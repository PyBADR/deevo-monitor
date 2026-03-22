/**
 * KPI Shared Types — Server-side type definitions matching src/kpi/kpi.types.ts.
 * Duplicated here because server/ cannot import from src/ (different runtimes).
 */

export type Severity = 'normal' | 'elevated' | 'high' | 'critical';
export type Trend = 'up' | 'down' | 'flat';

export interface SparklinePoint {
  t: number;
  v: number;
}

export interface KPIMetric {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  trend: Trend;
  trendValue: string;
  severity: Severity;
  sparkline: SparklinePoint[];
  description?: string;
  source?: string;
  updatedAt: number;
}

export interface KPISection {
  id: string;
  title: string;
  icon: string;
  metrics: KPIMetric[];
  collapsed?: boolean;
}

export type KPISetId = 'insurance' | 'insurtech' | 'financial' | 'fraud' | 'commodity' | 'wellness';

export interface KPISet {
  id: KPISetId;
  name: string;
  description: string;
  sections: KPISection[];
  lastUpdated: number;
}
