/**
 * KPI System — Type definitions for the 4-variant KPI dashboard engine.
 * Each variant gets its own KPISet with sections, metrics, sparklines, and severity.
 */

// ── Severity & Trend ────────────────────────────────────────────────

export type Severity = 'normal' | 'elevated' | 'high' | 'critical';
export type Trend = 'up' | 'down' | 'flat';

// ── KPI Metric ──────────────────────────────────────────────────────

export interface SparklinePoint {
  t: number;   // epoch ms
  v: number;   // value
}

export interface KPIMetric {
  id: string;
  label: string;
  value: number | string;
  unit: string;                   // '%', 'USD', 'bn', 'ms', '', etc.
  trend: Trend;
  trendValue: string;             // e.g. '+2.3%', '-14bp', '+$1.2B'
  severity: Severity;
  sparkline: SparklinePoint[];    // last 30 data points
  description?: string;           // tooltip / detail text
  source?: string;                // data provenance
  updatedAt: number;              // epoch ms
}

// ── KPI Section ─────────────────────────────────────────────────────

export interface KPISection {
  id: string;
  title: string;
  icon: string;          // emoji or icon identifier
  metrics: KPIMetric[];
  collapsed?: boolean;   // UI default state
}

// ── KPI Set ─────────────────────────────────────────────────────────

export type KPISetId = 'insurance' | 'insurtech' | 'financial' | 'fraud';

export interface KPISet {
  id: KPISetId;
  name: string;
  description: string;
  sections: KPISection[];
  lastUpdated: number;   // epoch ms
}

// ── Stock Quote (Finance variant) ───────────────────────────────────

export interface StockQuote {
  symbol: string;
  name: string;
  exchange: string;         // 'TADAWUL', 'ADX', 'DFM', 'BOURSA', 'MSM', 'BHB'
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;       // in local currency
  currency: string;         // 'SAR', 'AED', 'KWD', 'OMR', 'BHD', 'QAR'
  sector: string;
  sparkline: SparklinePoint[];
  updatedAt: number;
}

// ── Fraud Ring Entry (Fraud variant) ────────────────────────────────

export interface FraudRingEntry {
  id: string;
  ringName: string;
  status: 'active' | 'monitoring' | 'disrupted' | 'prosecuted';
  threatLevel: Severity;
  claimsLinked: number;
  estimatedExposure: number;    // USD
  region: string;
  typology: string;             // 'staged_collision', 'phantom_policy', 'medical_mills', etc.
  firstDetected: number;        // epoch ms
  lastActivity: number;         // epoch ms
  actors: number;               // number of identified actors
  notes?: string;
}

// ── IFRS 17 Metric (Finance variant) ────────────────────────────────

export interface IFRS17Metric {
  id: string;
  label: string;
  value: number;
  unit: string;
  period: string;          // 'Q1 2026', 'FY 2025', etc.
  comparativePeriod: string;
  comparativeValue: number;
  variance: number;
  variancePercent: number;
  standard: string;        // 'IFRS 17', 'IFRS 9', 'IAS 36', etc.
}

// ── Reinsurance Flow (Finance variant) ──────────────────────────────

export interface ReinsuranceFlow {
  id: string;
  cedant: string;
  reinsurer: string;
  treatyType: 'quota_share' | 'excess_of_loss' | 'surplus' | 'stop_loss' | 'cat_xl';
  lineOfBusiness: string;
  cededPremium: number;
  retentionPercent: number;
  limit: number;
  currency: string;
  effectiveDate: number;
  expiryDate: number;
  status: 'active' | 'expired' | 'pending_renewal';
}

// ── API Response Types ──────────────────────────────────────────────

export interface KPIResponse {
  kpiSet: KPISet;
  timestamp: number;
}

export interface StockResponse {
  quotes: StockQuote[];
  indices: StockQuote[];
  timestamp: number;
}

export interface FraudRingResponse {
  rings: FraudRingEntry[];
  summary: {
    totalActive: number;
    totalExposure: number;
    newThisMonth: number;
    disruptedThisMonth: number;
  };
  timestamp: number;
}
