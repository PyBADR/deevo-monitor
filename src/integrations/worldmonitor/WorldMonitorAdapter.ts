/**
 * WorldMonitorAdapter.ts
 * DEEVO Analytics — World Monitor Integration Layer
 * Wraps koala73/worldmonitor v2.6.5 signals into DEEVO intelligence pipeline
 *
 * Layer: Signal Intake → Features → Models → Agents
 * Version: 1.0.0 | SHA-256 audited
 * Upstream: https://github.com/koala73/worldmonitor (AGPL-3.0)
 * Attribution: koala73/worldmonitor — 2088+ PRs
 *
 * Architecture Decision:
 *   - Adapter pattern wraps upstream signals without modifying upstream source
 *   - All signals receive SHA-256 hash for DEEVO governance audit trail
 *   - GCC relevance scoring prioritizes Kuwait/Saudi/UAE/Qatar/Bahrain/Oman signals
 *   - Transient mode: conflict signals purged after 24h (PDPL compliance)
 *   - Human-in-the-loop gate: risk scores >60 require manual review
 *
 * Data Flow:
 *   WM Signal (conflict|geo|aviation|market|alert|news|cyber|economic)
 *     → WorldMonitorAdapter.ingest()
 *       → SHA-256 hash
 *       → GCC relevance check
 *       → Risk score computation
 *       → Layer mapping (Data/Features/Models/Agents/APIs/UI/Governance)
 *     → DEEVORiskSignal (typed, versioned, auditable)
 *       → FRIN / Sentinel / Intel Dashboard / GeoSpatial Module
 */

import { createHash } from 'crypto';

// ── Signal Types ────────────────────────────────────────────────────────────

export type WMSignalType =
  | 'conflict'
  | 'geo'
  | 'aviation'
  | 'market'
  | 'alert'
  | 'news'
  | 'cyber'
  | 'economic'
  | 'military'
  | 'sanctions'
  | 'forecast'
  | 'thermal';

export interface WMSignal {
  type: WMSignalType;
  source: string;
  payload: Record<string, unknown>;
  timestamp: string;
  region?: string;
  /** Upstream PR reference for traceability */
  upstream_ref?: string;
}

export type DEEVOLayer =
  | 'Data'
  | 'Features'
  | 'Models'
  | 'Agents'
  | 'APIs'
  | 'UI'
  | 'Governance';

export interface DEEVORiskSignal {
  signal_id: string;
  sha256: string;
  deevo_module: string;
  layer: DEEVOLayer;
  risk_score: number; // 0-100
  gcc_relevance: boolean;
  gcc_countries: string[];
  transient: boolean; // PDPL: true = purge after 24h
  requires_human_review: boolean;
  raw: WMSignal;
  ingested_at: string;
  adapter_version: string;
}

// ── Constants ───────────────────────────────────────────────────────────────

const ADAPTER_VERSION = '1.0.0';
const UPSTREAM_VERSION = '2.6.5';
const HUMAN_REVIEW_THRESHOLD = 60;
const MAX_RISK_SCORE = 100;

const GCC_REGIONS: readonly string[] = [
  'kuwait', 'saudi', 'uae', 'qatar', 'bahrain', 'oman',
  'gcc', 'gulf', 'arab', 'riyadh', 'doha', 'abu dhabi',
  'dubai', 'muscat', 'manama', 'kuwait city',
] as const;

const TRANSIENT_SIGNAL_TYPES: ReadonlySet<WMSignalType> = new Set<WMSignalType>([
  'conflict', 'alert', 'military', 'thermal',
]);

const MODULE_MAP: Record<WMSignalType, string> = {
  conflict:  'FRIN — Fraud & Risk Intelligence Network',
  geo:       'GeoSpatial Risk Module',
  aviation:  'Field Inspector — Location Context',
  market:    'DEEVO Intel Dashboard — Market Signals',
  alert:     'DeevoSentinel — Push Alerts',
  news:      'Signal Intake Layer — Live Feeds',
  cyber:     'DeevoSentinel — Cyber Threat Feeds',
  economic:  'DEEVO Intel Dashboard — GCC Economies',
  military:  'Field Inspector — Aviation Intelligence',
  sanctions: 'FRIN — Sanctions & Compliance Intelligence',
  forecast:  'DEEVO Sentinel — Forecast Engine',
  thermal:   'GeoSpatial Risk Module — Thermal Escalation',
};

const LAYER_MAP: Record<WMSignalType, DEEVOLayer> = {
  conflict:  'Models',
  geo:       'Features',
  aviation:  'Features',
  market:    'APIs',
  alert:     'Agents',
  news:      'Data',
  cyber:     'Data',
  economic:  'APIs',
  military:  'Features',
  sanctions: 'Models',
  forecast:  'Agents',
  thermal:   'Features',
};

// ── Risk Scoring Keywords ───────────────────────────────────────────────────

const HIGH_RISK_KEYWORDS = [
  'attack', 'strike', 'bomb', 'missile', 'explosion', 'nuclear',
  'chemical', 'biological', 'hostage', 'terror', 'assassination',
];

const MEDIUM_RISK_KEYWORDS = [
  'iran', 'conflict', 'tension', 'escalation', 'military',
  'sanctions', 'embargo', 'blockade', 'drone', 'cyber',
  'ransomware', 'breach', 'vulnerability', 'critical',
];

const LOW_RISK_KEYWORDS = [
  'protest', 'demonstration', 'unrest', 'disruption',
  'warning', 'advisory', 'alert', 'forecast',
];

// ── Adapter Class ───────────────────────────────────────────────────────────

export class WorldMonitorAdapter {
  private auditLog: DEEVORiskSignal[] = [];
  private signalCount = 0;

  /**
   * Ingest a World Monitor signal and map it to DEEVO risk layer.
   *
   * Data Flow: WMSignal → SHA-256 → GCC check → Risk score → DEEVORiskSignal
   * Governance: All signals are hashed and logged. Transient signals flagged for 24h TTL.
   */
  ingest(signal: WMSignal): DEEVORiskSignal {
    const payloadStr = JSON.stringify(signal);
    const sha256 = createHash('sha256').update(payloadStr).digest('hex');
    const gccCountries = this.detectGCCCountries(payloadStr);
    const gccRelevance = gccCountries.length > 0;
    const riskScore = this.computeRiskScore(signal, gccRelevance);
    const isTransient = TRANSIENT_SIGNAL_TYPES.has(signal.type);

    const mapped: DEEVORiskSignal = {
      signal_id: `WM-${++this.signalCount}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sha256,
      deevo_module: MODULE_MAP[signal.type] ?? 'DEEVO Intelligence Lab',
      layer: LAYER_MAP[signal.type] ?? 'Data',
      risk_score: riskScore,
      gcc_relevance: gccRelevance,
      gcc_countries: gccCountries,
      transient: isTransient,
      requires_human_review: riskScore > HUMAN_REVIEW_THRESHOLD,
      raw: signal,
      ingested_at: new Date().toISOString(),
      adapter_version: ADAPTER_VERSION,
    };

    this.auditLog.push(mapped);
    return mapped;
  }

  /**
   * Batch-ingest multiple signals. Returns array of mapped DEEVO signals.
   */
  ingestBatch(signals: WMSignal[]): DEEVORiskSignal[] {
    return signals.map((s) => this.ingest(s));
  }

  /**
   * Detect which GCC countries are mentioned in the signal payload.
   */
  private detectGCCCountries(text: string): string[] {
    const lower = text.toLowerCase();
    const countryMap: Record<string, string> = {
      kuwait: 'KW', saudi: 'SA', riyadh: 'SA',
      uae: 'AE', dubai: 'AE', 'abu dhabi': 'AE',
      qatar: 'QA', doha: 'QA',
      bahrain: 'BH', manama: 'BH',
      oman: 'OM', muscat: 'OM',
    };
    const found = new Set<string>();
    for (const [keyword, iso] of Object.entries(countryMap)) {
      if (lower.includes(keyword)) found.add(iso);
    }
    // Generic GCC terms map to all
    if (lower.includes('gcc') || lower.includes('gulf')) {
      ['KW', 'SA', 'AE', 'QA', 'BH', 'OM'].forEach((c) => found.add(c));
    }
    return Array.from(found).sort();
  }

  /**
   * Compute risk score (0–100) based on signal type, keywords, and GCC relevance.
   *
   * Scoring model:
   *   Base: 10–30 depending on signal type
   *   +30–40 for high-risk keywords (attack, strike, missile, etc.)
   *   +15–20 for medium-risk keywords (conflict, sanctions, cyber, etc.)
   *   +5–10 for low-risk keywords (protest, warning, etc.)
   *   +15 for GCC relevance
   *   Cap at 70 for GPS jamming signals (pending FRIN calibration)
   */
  private computeRiskScore(signal: WMSignal, gccRelevance: boolean): number {
    let score = this.getBaseScore(signal.type);
    const text = JSON.stringify(signal).toLowerCase();

    // Keyword scoring
    for (const kw of HIGH_RISK_KEYWORDS) {
      if (text.includes(kw)) { score += 35; break; }
    }
    for (const kw of MEDIUM_RISK_KEYWORDS) {
      if (text.includes(kw)) { score += 18; break; }
    }
    for (const kw of LOW_RISK_KEYWORDS) {
      if (text.includes(kw)) { score += 8; break; }
    }

    // GCC relevance boost
    if (gccRelevance) score += 15;

    // Cap GPS jamming signals at 70 pending FRIN model calibration (Risk Register R5)
    if (signal.type === 'geo' && text.includes('jamming')) {
      score = Math.min(score, 70);
    }

    return Math.min(MAX_RISK_SCORE, Math.max(0, score));
  }

  private getBaseScore(type: WMSignalType): number {
    const bases: Record<WMSignalType, number> = {
      conflict: 30, alert: 25, military: 25, thermal: 20,
      cyber: 20, sanctions: 20, forecast: 15, geo: 15,
      aviation: 15, market: 10, economic: 10, news: 10,
    };
    return bases[type] ?? 10;
  }

  // ── Audit & Export ────────────────────────────────────────────────────────

  getAuditLog(): readonly DEEVORiskSignal[] {
    return this.auditLog;
  }

  getSignalCount(): number {
    return this.signalCount;
  }

  getGCCSignals(): DEEVORiskSignal[] {
    return this.auditLog.filter((s) => s.gcc_relevance);
  }

  getHighRiskSignals(threshold = HUMAN_REVIEW_THRESHOLD): DEEVORiskSignal[] {
    return this.auditLog.filter((s) => s.risk_score > threshold);
  }

  getTransientSignals(): DEEVORiskSignal[] {
    return this.auditLog.filter((s) => s.transient);
  }

  getSignalsByLayer(layer: DEEVOLayer): DEEVORiskSignal[] {
    return this.auditLog.filter((s) => s.layer === layer);
  }

  exportAuditJSON(): string {
    return JSON.stringify({
      exported_at: new Date().toISOString(),
      adapter_version: ADAPTER_VERSION,
      upstream_version: UPSTREAM_VERSION,
      total_signals: this.signalCount,
      gcc_signals: this.getGCCSignals().length,
      high_risk_signals: this.getHighRiskSignals().length,
      signals: this.auditLog,
    }, null, 2);
  }

  /**
   * Purge transient signals older than `maxAgeMs` (default: 24h).
   * PDPL compliance: conflict/alert/military/thermal signals must not persist.
   */
  purgeTransient(maxAgeMs = 24 * 60 * 60 * 1000): number {
    const cutoff = Date.now() - maxAgeMs;
    const before = this.auditLog.length;
    this.auditLog = this.auditLog.filter((s) => {
      if (!s.transient) return true;
      return new Date(s.ingested_at).getTime() > cutoff;
    });
    return before - this.auditLog.length;
  }
}

export default WorldMonitorAdapter;
