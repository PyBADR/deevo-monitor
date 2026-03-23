/**
 * DEEVO Intelligence Monitor v3 — RSS Ingestion Service
 * Contract 4 / Service 2 of 6
 * Layer: Data (L1) — fetches, parses, and normalizes RSS feeds
 *        into IntelSignal format for the intelligence pipeline.
 *
 * Architecture: Pull-based polling with configurable intervals per
 *               feed priority. Uses 3-tier cache to avoid re-fetching.
 *
 * Trade-off: Client-side RSS via CORS proxy vs server-side aggregation.
 *            Client-side chosen for v3 offline-first + Vercel deployment.
 *            Server-side aggregation planned for v4 with Render backend.
 *
 * Risk: CORS blocking — mitigated by configurable proxy URL list.
 *       Feed downtime — mitigated by cache fallback and health tracking.
 */

import type { IntelSignal, SignalCategory, DeevoVariant } from '../types/signals';
import type { GCCCountryCode } from '../types/index';
import type { FeedSource } from '../data/feeds-config';
import { toSignalCategory, getFeedsForVariant } from '../config/feeds';
import { cacheService } from './cache';

// ── RSS Config ───────────────────────────────────────────
interface RSSConfig {
  /** CORS proxy URL template — {url} replaced with feed URL */
  corsProxy: string;
  /** Poll interval in ms per priority tier */
  pollIntervals: { high: number; medium: number; low: number };
  /** Max items to keep per feed */
  maxItemsPerFeed: number;
  /** Request timeout in ms */
  timeoutMs: number;
}

const DEFAULT_RSS_CONFIG: RSSConfig = {
  corsProxy: '/api/rss-proxy?url={url}',
  pollIntervals: {
    high: 60_000,      // 1 minute
    medium: 300_000,   // 5 minutes
    low: 900_000,      // 15 minutes
  },
  maxItemsPerFeed: 20,
  timeoutMs: 10_000,
};

// ── Feed Health Tracking ─────────────────────────────────
interface FeedHealth {
  feedId: string;
  lastFetchAt: string | null;
  lastSuccessAt: string | null;
  consecutiveFailures: number;
  totalFetches: number;
  totalFailures: number;
  avgLatencyMs: number;
  active: boolean;
}

const feedHealthMap = new Map<string, FeedHealth>();

// ── Signal ID Generator ──────────────────────────────────
const generateSignalId = (): string => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 10);
  return `sig_${ts}_${rand}`;
};

// ── Parse RSS XML ────────────────────────────────────────
const parseRSSItem = (
  item: Element,
  feed: FeedSource,
  category: SignalCategory,
): IntelSignal | null => {
  const title = item.querySelector('title')?.textContent?.trim();
  const link = item.querySelector('link')?.textContent?.trim();
  const description = item.querySelector('description')?.textContent?.trim();
  const pubDate = item.querySelector('pubDate')?.textContent?.trim();

  if (!title) return null;

  return {
    id: generateSignalId(),
    timestamp: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    title,
    content: description ?? '',
    category,
    alertLevel: 'INFO',
    source: feed.name,
    sourceUrl: link ?? feed.url,
    countries: (feed.region ? [feed.region] : []) as GCCCountryCode[],
    variants: ['global'] as DeevoVariant[],
    detectedBy: 'data',
    confidence: 0.5,
    relatedEntities: [],
    correlatedSignals: [],
    tags: [feed.category, feed.region ?? 'global'].filter(Boolean),
    acknowledged: false,
    ttlSeconds: 86400,
  };
};

// ── Fetch Single Feed ────────────────────────────────────
export const fetchFeed = async (
  feed: FeedSource,
  config: RSSConfig = DEFAULT_RSS_CONFIG,
): Promise<IntelSignal[]> => {
  const cacheKey = `rss_${feed.id}`;
  const cached = cacheService.get<IntelSignal[]>(cacheKey);
  if (cached) return cached;

  const health = feedHealthMap.get(feed.id) ?? {
    feedId: feed.id,
    lastFetchAt: null,
    lastSuccessAt: null,
    consecutiveFailures: 0,
    totalFetches: 0,
    totalFailures: 0,
    avgLatencyMs: 0,
    active: true,
  };

  health.totalFetches++;
  health.lastFetchAt = new Date().toISOString();
  const startMs = performance.now();

  try {
    const proxyUrl = config.corsProxy.replace('{url}', encodeURIComponent(feed.url));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    const response = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const xml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');

    const category = toSignalCategory(feed.category);
    const items = Array.from(doc.querySelectorAll('item'))
      .slice(0, config.maxItemsPerFeed)
      .map((item) => parseRSSItem(item, feed, category))
      .filter((item): item is IntelSignal => item !== null);

    // Update health
    health.consecutiveFailures = 0;
    health.lastSuccessAt = new Date().toISOString();
    health.avgLatencyMs = (health.avgLatencyMs + (performance.now() - startMs)) / 2;
    feedHealthMap.set(feed.id, health);

    // Cache results
    const ttlMs = feed.priority === 'high' ? 60_000 : 300_000;
    cacheService.set(cacheKey, items, ttlMs);

    return items;
  } catch (err) {
    health.consecutiveFailures++;
    health.totalFailures++;
    feedHealthMap.set(feed.id, health);

    // Deactivate feed after 5 consecutive failures
    if (health.consecutiveFailures >= 5) {
      health.active = false;
      console.warn(`[RSSService] Feed ${feed.id} deactivated after 5 failures`);
    }

    // Return cached data if available, empty array otherwise
    return cacheService.get<IntelSignal[]>(cacheKey) ?? [];
  }
};

// ── Fetch All Feeds for Variant ──────────────────────────
export const fetchAllFeeds = async (
  variant: DeevoVariant = 'global',
  config: RSSConfig = DEFAULT_RSS_CONFIG,
): Promise<IntelSignal[]> => {
  const feeds = getFeedsForVariant(variant).filter((f) => {
    const health = feedHealthMap.get(f.id);
    return !health || health.active;
  });

  const results = await Promise.allSettled(
    feeds.map((feed) => fetchFeed(feed, config)),
  );

  return results
    .filter((r): r is PromiseFulfilledResult<IntelSignal[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// ── Health API ───────────────────────────────────────────
export const getFeedHealth = (): FeedHealth[] =>
  Array.from(feedHealthMap.values());

export const getHealthyFeedCount = (): number =>
  Array.from(feedHealthMap.values()).filter((h) => h.active).length;

export const resetFeedHealth = (feedId: string): void => {
  const health = feedHealthMap.get(feedId);
  if (health) {
    health.active = true;
    health.consecutiveFailures = 0;
    feedHealthMap.set(feedId, health);
  }
};
