/**
 * DEEVO Intelligence Monitor v3 — Signal Type System
 * Contract 2 / File 2 of 4
 * Layer: Data (L1) — intelligence signals flowing through the 7-layer stack
 *
 * Trade-off: Granular signal categories enable precise correlation rules
 *            at the cost of larger union types. Worth it for audit trails.
 */

import type { GCCCountryCode } from './index';

// ── Signal Categories ────────────────────────────────────
export type SignalCategory =
  | 'geopolitical'
  | 'regulatory'
  | 'fraud'
  | 'claims'
  | 'weather'
  | 'cyber'
  | 'market'
  | 'marine'
  | 'energy'
  | 'sanctions'
  | 'labor'
  | 'climate'
  | 'military'
  | 'health'
  | 'infrastructure';

// ── Alert Levels ─────────────────────────────────────────
export type AlertLevel = 'INFO' | 'WARNING' | 'ELEVATED' | 'CRITICAL';

// ── DEEVO Variant Identifiers ────────────────────────────
export type DeevoVariant = 'global' | 'fraud' | 'finance' | 'tech';

// ── Intelligence Layer (7-layer stack position) ──────────
export type IntelligenceLayer =
  | 'data'
  | 'features'
  | 'models'
  | 'agents'
  | 'apis'
  | 'ui'
  | 'governance';

// ── Intelligence Signal ──────────────────────────────────
export interface IntelSignal {
  /** Unique signal ID — format: `sig_{timestamp}_{hash8}` */
  readonly id: string;
  /** ISO 8601 timestamp of signal detection */
  timestamp: string;
  /** Signal title / headline */
  title: string;
  /** Detailed signal content / body */
  content: string;
  /** Signal classification */
  category: SignalCategory;
  /** Alert severity level */
  alertLevel: AlertLevel;
  /** Source feed or system that generated this signal */
  source: string;
  /** Source URL for verification */
  sourceUrl?: string;
  /** Affected GCC countries */
  countries: GCCCountryCode[];
  /** Geographic coordinates if location-specific */
  coordinates?: [longitude: number, latitude: number];
  /** Which DEEVO variant(s) this signal is relevant to */
  variants: DeevoVariant[];
  /** Which intelligence layer detected this signal */
  detectedBy: IntelligenceLayer;
  /** Confidence score (0.0–1.0) */
  confidence: number;
  /** Related entity IDs */
  relatedEntities: string[];
  /** Related signal IDs (for correlation chains) */
  correlatedSignals: string[];
  /** Tags for filtering and search */
  tags: string[];
  /** Whether this signal has been acknowledged by a human */
  acknowledged: boolean;
  /** TTL in seconds — signal expires after this duration */
  ttlSeconds: number;
  /** Optional metadata for variant-specific extensions */
  metadata?: Record<string, unknown>;
}

// ── Correlation Rule Match ───────────────────────────────
export interface CorrelationMatch {
  /** Rule ID that fired — e.g., 'HORMUZ_MARINE_ALERT' */
  ruleId: string;
  /** Human-readable rule name */
  ruleName: string;
  /** Signal IDs that triggered this correlation */
  triggerSignals: string[];
  /** Resulting alert level */
  alertLevel: AlertLevel;
  /** Confidence of the correlation (0.0–1.0) */
  confidence: number;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Recommended action */
  recommendedAction: string;
}
