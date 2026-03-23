/**
 * DEEVO Intelligence Monitor v3 — Feed Configuration Bridge
 * Contract 3 / File 2 of 4
 * Layer: Data (L1) — routes 600+ feeds from feeds-config.ts through
 *        the v3 type system with variant-aware filtering.
 *
 * Trade-off: Re-exports existing feed registry rather than duplicating.
 *            Adds variant routing layer and signal category mapping.
 * Risk: Feed URL rot — mitigated by health-check in C4 RSS service.
 */

import type { DeevoVariant, SignalCategory } from '../types/signals';
import {
  ALL_FEEDS,
  FEED_CATEGORIES,
  type FeedSource,
  type FeedCategory,
} from '../data/feeds-config';

// ── Re-export base feed data ─────────────────────────────
export { ALL_FEEDS, FEED_CATEGORIES };
export type { FeedSource, FeedCategory };

// ── Signal Category Mapping ──────────────────────────────
/** Maps feed categories to intelligence signal categories */
export const FEED_TO_SIGNAL_MAP: Record<FeedCategory, SignalCategory> = {
  'core-markets': 'market',
  'fixed-income': 'market',
  'forex-currencies': 'market',
  'crypto-digital': 'market',
  'central-banks': 'regulatory',
  'gulf-mena': 'geopolitical',
  'startups-vc': 'market',
  'security-policy': 'military',
  'data-tracking': 'infrastructure',
  'supply-chain': 'infrastructure',
  'pricing-marketing': 'market',
  'consumer-prices': 'market',
  'world-clock': 'geopolitical',
  'technology': 'cyber',
  'energy-commodities': 'energy',
  'global-news': 'geopolitical',
};

// ── Variant Feed Routing ─────────────────────────────────
/** Which feed categories each DEEVO variant subscribes to */
export const VARIANT_FEED_SUBSCRIPTIONS: Record<DeevoVariant, readonly FeedCategory[]> = {
  global: [
    'core-markets', 'fixed-income', 'forex-currencies', 'crypto-digital',
    'central-banks', 'gulf-mena', 'security-policy', 'energy-commodities',
    'global-news', 'supply-chain', 'world-clock', 'technology',
    'data-tracking', 'startups-vc', 'pricing-marketing', 'consumer-prices',
  ],
  fraud: [
    'core-markets', 'gulf-mena', 'security-policy', 'data-tracking',
    'technology', 'global-news',
  ],
  finance: [
    'core-markets', 'fixed-income', 'forex-currencies', 'crypto-digital',
    'central-banks', 'gulf-mena', 'energy-commodities', 'pricing-marketing',
    'consumer-prices',
  ],
  tech: [
    'technology', 'crypto-digital', 'startups-vc', 'data-tracking',
    'global-news', 'core-markets',
  ],
};

// ── Feed Helpers ─────────────────────────────────────────
/** Get all feeds for a specific variant */
export const getFeedsForVariant = (variant: DeevoVariant): FeedSource[] => {
  const categories = VARIANT_FEED_SUBSCRIPTIONS[variant];
  return ALL_FEEDS.filter((f: FeedSource) => categories.includes(f.category));
};

/** Get feed count per variant */
export const getVariantFeedCounts = (): Record<DeevoVariant, number> => ({
  global: getFeedsForVariant('global').length,
  fraud: getFeedsForVariant('fraud').length,
  finance: getFeedsForVariant('finance').length,
  tech: getFeedsForVariant('tech').length,
});

/** Map a feed item's category to a signal category */
export const toSignalCategory = (feedCat: FeedCategory): SignalCategory =>
  FEED_TO_SIGNAL_MAP[feedCat] ?? 'geopolitical';

/** Get high-priority feeds only */
export const getHighPriorityFeeds = (): FeedSource[] =>
  ALL_FEEDS.filter((f: FeedSource) => f.priority === 'high');
