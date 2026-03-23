/**
 * DEEVO Intelligence Monitor v3 — 3-Tier Cache Service
 * Contract 4 / Service 5 of 6
 * Layer: Data (L1) + APIs (L5)
 *
 * 3 tiers:
 *   T1: In-memory Map (instant, 1000 entries max, 60s TTL)
 *   T2: SessionStorage (survives SPA navigation, 5MB limit)
 *   T3: LocalStorage (persists across sessions, 10MB limit)
 *
 * Trade-off: No IndexedDB in v3 — keeps complexity low and avoids
 *            async overhead for cache reads. IndexedDB planned for v4
 *            when offline-first sync is implemented.
 *
 * Risk: Storage quota exceeded — mitigated by LRU eviction and
 *       graceful degradation to memory-only mode.
 */

// ── Cache Entry ──────────────────────────────────────────
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
  tier: 1 | 2 | 3;
  key: string;
}

// ── Cache Config ─────────────────────────────────────────
interface CacheConfig {
  t1MaxEntries: number;
  t1TtlMs: number;
  t2TtlMs: number;
  t3TtlMs: number;
  prefix: string;
}

const DEFAULT_CONFIG: CacheConfig = {
  t1MaxEntries: 1000,
  t1TtlMs: 60_000,       // 60 seconds
  t2TtlMs: 300_000,      // 5 minutes
  t3TtlMs: 3_600_000,    // 1 hour
  prefix: 'deevo_v3_',
};

// ── T1: In-Memory Cache ──────────────────────────────────
const memoryCache = new Map<string, CacheEntry<unknown>>();

// ── Storage Helpers ──────────────────────────────────────
const isStorageAvailable = (storage: Storage): boolean => {
  try {
    const testKey = '__deevo_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const hasSessionStorage = typeof sessionStorage !== 'undefined' && isStorageAvailable(sessionStorage);
const hasLocalStorage = typeof localStorage !== 'undefined' && isStorageAvailable(localStorage);

// ── LRU Eviction ─────────────────────────────────────────
const evictT1 = (config: CacheConfig): void => {
  if (memoryCache.size <= config.t1MaxEntries) return;
  const entries = Array.from(memoryCache.entries())
    .sort((a, b) => a[1].timestamp - b[1].timestamp);
  const toRemove = entries.slice(0, entries.length - config.t1MaxEntries);
  for (const [key] of toRemove) {
    memoryCache.delete(key);
  }
};

const isExpired = (entry: CacheEntry<unknown>): boolean =>
  Date.now() - entry.timestamp > entry.ttlMs;

// ── 3-Tier Cache API ─────────────────────────────────────
export const cacheService = {
  config: { ...DEFAULT_CONFIG },

  /** Get from cache — checks T1 → T2 → T3 */
  get<T>(key: string): T | null {
    const prefixedKey = this.config.prefix + key;

    // T1: Memory
    const memEntry = memoryCache.get(prefixedKey) as CacheEntry<T> | undefined;
    if (memEntry && !isExpired(memEntry)) {
      return memEntry.data;
    }
    if (memEntry) memoryCache.delete(prefixedKey);

    // T2: SessionStorage
    if (hasSessionStorage) {
      try {
        const raw = sessionStorage.getItem(prefixedKey);
        if (raw) {
          const entry = JSON.parse(raw) as CacheEntry<T>;
          if (!isExpired(entry)) {
            // Promote to T1
            memoryCache.set(prefixedKey, entry);
            return entry.data;
          }
          sessionStorage.removeItem(prefixedKey);
        }
      } catch { /* quota or parse error — skip */ }
    }

    // T3: LocalStorage
    if (hasLocalStorage) {
      try {
        const raw = localStorage.getItem(prefixedKey);
        if (raw) {
          const entry = JSON.parse(raw) as CacheEntry<T>;
          if (!isExpired(entry)) {
            // Promote to T1 + T2
            memoryCache.set(prefixedKey, entry);
            if (hasSessionStorage) {
              try { sessionStorage.setItem(prefixedKey, raw); } catch { /* ignore */ }
            }
            return entry.data;
          }
          localStorage.removeItem(prefixedKey);
        }
      } catch { /* quota or parse error — skip */ }
    }

    return null;
  },

  /** Set across all applicable tiers */
  set<T>(key: string, data: T, ttlMs?: number): void {
    const prefixedKey = this.config.prefix + key;
    const now = Date.now();

    // T1: Always
    const t1Entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttlMs: ttlMs ?? this.config.t1TtlMs,
      tier: 1,
      key: prefixedKey,
    };
    memoryCache.set(prefixedKey, t1Entry);
    evictT1(this.config);

    // T2: SessionStorage
    if (hasSessionStorage) {
      try {
        const t2Entry: CacheEntry<T> = { ...t1Entry, tier: 2, ttlMs: ttlMs ?? this.config.t2TtlMs };
        sessionStorage.setItem(prefixedKey, JSON.stringify(t2Entry));
      } catch { /* quota exceeded — T1 still works */ }
    }

    // T3: LocalStorage
    if (hasLocalStorage) {
      try {
        const t3Entry: CacheEntry<T> = { ...t1Entry, tier: 3, ttlMs: ttlMs ?? this.config.t3TtlMs };
        localStorage.setItem(prefixedKey, JSON.stringify(t3Entry));
      } catch { /* quota exceeded — T1+T2 still work */ }
    }
  },

  /** Invalidate a key across all tiers */
  invalidate(key: string): void {
    const prefixedKey = this.config.prefix + key;
    memoryCache.delete(prefixedKey);
    if (hasSessionStorage) try { sessionStorage.removeItem(prefixedKey); } catch { /* ignore */ }
    if (hasLocalStorage) try { localStorage.removeItem(prefixedKey); } catch { /* ignore */ }
  },

  /** Clear all DEEVO cache entries */
  clearAll(): void {
    // T1
    memoryCache.clear();

    // T2 + T3: only remove prefixed keys
    const clearStorage = (storage: Storage): void => {
      const keysToRemove: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith(this.config.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => storage.removeItem(k));
    };

    if (hasSessionStorage) try { clearStorage(sessionStorage); } catch { /* ignore */ }
    if (hasLocalStorage) try { clearStorage(localStorage); } catch { /* ignore */ }
  },

  /** Get cache stats */
  getStats(): { t1Size: number; t2Available: boolean; t3Available: boolean } {
    return {
      t1Size: memoryCache.size,
      t2Available: hasSessionStorage,
      t3Available: hasLocalStorage,
    };
  },
};
