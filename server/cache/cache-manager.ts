/**
 * 3-Tier Cache Manager — worldmonitor parity.
 *
 * Tier 1: In-memory LRU (hot path, <1ms)
 * Tier 2: Redis (shared, <5ms) — optional, falls back gracefully
 * Tier 3: Origin fetch (API/RSS, 100ms–5s)
 *
 * Architecture Layer: Infrastructure (L0) → Data (L1)
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  source: 'memory' | 'redis' | 'origin';
}

interface CacheConfig {
  memoryMaxEntries: number;
  defaultTtlMs: number;
  redisUrl: string | null;
  redisTtlMs: number;
  enableRedis: boolean;
  namespace: string;
}

const DEFAULT_CONFIG: CacheConfig = {
  memoryMaxEntries: 500,
  defaultTtlMs: 60_000,          // 1 minute
  redisUrl: process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL || null,
  redisTtlMs: 300_000,            // 5 minutes
  enableRedis: !!process.env.REDIS_URL || !!process.env.UPSTASH_REDIS_URL,
  namespace: 'deevo:v4',
};

// ── Tier 1: In-Memory LRU Cache ──────────────────────

class MemoryLRU<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxEntries: number;

  constructor(maxEntries: number) {
    this.maxEntries = maxEntries;
  }

  get(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry;
  }

  set(key: string, data: T, ttl: number): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxEntries) {
      const oldest = this.cache.keys().next().value;
      if (oldest) this.cache.delete(oldest);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      source: 'memory',
    });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  getStats() {
    let expired = 0;
    const now = Date.now();
    for (const [, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) expired++;
    }
    return { total: this.cache.size, expired, active: this.cache.size - expired };
  }
}

// ── Tier 2: Redis Cache (optional) ──────────────────

class RedisCache {
  private client: any = null;
  private connected = false;
  private namespace: string;

  constructor(url: string | null, namespace: string) {
    this.namespace = namespace;
    if (url) {
      this.connect(url);
    }
  }

  private async connect(url: string) {
    try {
      // Dynamic import — ioredis may not be installed
      const Redis = (await import('ioredis')).default;
      this.client = new Redis(url, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => Math.min(times * 100, 3000),
        lazyConnect: true,
      });
      await this.client.connect();
      this.connected = true;
      console.log('[Cache] Redis Tier 2 connected');
    } catch (err) {
      console.warn('[Cache] Redis unavailable, operating with Tier 1 only:', (err as Error).message);
      this.connected = false;
    }
  }

  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    if (!this.connected || !this.client) return null;
    try {
      const raw = await this.client.get(`${this.namespace}:${key}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async set<T>(key: string, data: T, ttlMs: number): Promise<void> {
    if (!this.connected || !this.client) return;
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlMs,
        source: 'redis',
      };
      await this.client.set(
        `${this.namespace}:${key}`,
        JSON.stringify(entry),
        'PX',
        ttlMs,
      );
    } catch {
      // Silent fail — cache miss is acceptable
    }
  }

  async invalidate(key: string): Promise<void> {
    if (!this.connected || !this.client) return;
    try {
      await this.client.del(`${this.namespace}:${key}`);
    } catch {
      // Silent fail
    }
  }

  get isConnected(): boolean {
    return this.connected;
  }
}

// ── Cache Manager ────────────────────────────────────

export class CacheManager {
  private memory: MemoryLRU<any>;
  private redis: RedisCache;
  private config: CacheConfig;

  // Stats
  private hits = { memory: 0, redis: 0, origin: 0 };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.memory = new MemoryLRU(this.config.memoryMaxEntries);
    this.redis = new RedisCache(
      this.config.enableRedis ? this.config.redisUrl : null,
      this.config.namespace,
    );
  }

  /**
   * Get a value from the 3-tier cache.
   * Returns { data, source } where source indicates which tier served the request.
   */
  async get<T>(key: string): Promise<{ data: T; source: string } | null> {
    // Tier 1: Memory
    const memEntry = this.memory.get(key);
    if (memEntry) {
      this.hits.memory++;
      return { data: memEntry.data, source: 'memory' };
    }

    // Tier 2: Redis
    if (this.config.enableRedis) {
      const redisEntry = await this.redis.get<T>(key);
      if (redisEntry) {
        this.hits.redis++;
        // Promote to Tier 1
        this.memory.set(key, redisEntry.data, this.config.defaultTtlMs);
        return { data: redisEntry.data, source: 'redis' };
      }
    }

    return null;
  }

  /**
   * Get with origin fetch fallback.
   * If not in any cache tier, calls the fetcher function and stores the result.
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: { memoryTtl?: number; redisTtl?: number },
  ): Promise<{ data: T; source: string }> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    // Tier 3: Origin fetch
    const data = await fetcher();
    this.hits.origin++;

    const memTtl = options?.memoryTtl ?? this.config.defaultTtlMs;
    const redisTtl = options?.redisTtl ?? this.config.redisTtlMs;

    // Store in both tiers
    this.memory.set(key, data, memTtl);
    if (this.config.enableRedis) {
      await this.redis.set(key, data, redisTtl);
    }

    return { data, source: 'origin' };
  }

  /**
   * Invalidate a key across all tiers.
   */
  async invalidate(key: string): Promise<void> {
    this.memory.invalidate(key);
    if (this.config.enableRedis) {
      await this.redis.invalidate(key);
    }
  }

  /**
   * Get cache stats for monitoring.
   */
  getStats() {
    return {
      hits: { ...this.hits },
      hitRate: {
        memory: this.hits.memory / Math.max(1, this.hits.memory + this.hits.redis + this.hits.origin),
        redis: this.hits.redis / Math.max(1, this.hits.memory + this.hits.redis + this.hits.origin),
        origin: this.hits.origin / Math.max(1, this.hits.memory + this.hits.redis + this.hits.origin),
      },
      memory: this.memory.getStats(),
      redisConnected: this.redis.isConnected,
      config: {
        memoryMaxEntries: this.config.memoryMaxEntries,
        defaultTtlMs: this.config.defaultTtlMs,
        enableRedis: this.config.enableRedis,
      },
    };
  }
}

// ── Singleton Export ──────────────────────────────────

export const cache = new CacheManager();
