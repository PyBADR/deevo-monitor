/**
 * KPI Engine — Barrel export with variant-aware KPI set resolution.
 */
export type { KPISet, KPISection, KPIMetric, KPISetId, SparklinePoint, Severity, Trend } from './kpi.shared';
export { INSURANCE_KPI_SET } from './insurance.kpi';
export { INSURTECH_KPI_SET } from './insurtech.kpi';
export { FINANCIAL_KPI_SET } from './financial.kpi';
export { FRAUD_KPI_SET } from './fraud.kpi';

import { INSURANCE_KPI_SET } from './insurance.kpi';
import { INSURTECH_KPI_SET } from './insurtech.kpi';
import { FINANCIAL_KPI_SET } from './financial.kpi';
import { FRAUD_KPI_SET } from './fraud.kpi';
import type { KPISet, KPISetId } from './kpi.shared';

const KPI_REGISTRY: Record<KPISetId, KPISet> = {
  insurance: INSURANCE_KPI_SET,
  insurtech: INSURTECH_KPI_SET,
  financial: FINANCIAL_KPI_SET,
  fraud: FRAUD_KPI_SET,
};

/**
 * Resolve variant ID → KPI set ID mapping.
 * global → insurance, tech → insurtech, finance → financial, fraud → fraud
 */
type VariantId = 'global' | 'tech' | 'finance' | 'fraud';

const VARIANT_TO_KPI: Record<VariantId, KPISetId> = {
  global: 'insurance',
  tech: 'insurtech',
  finance: 'financial',
  fraud: 'fraud',
};

/**
 * Get the KPI set for a given variant, with fresh timestamps.
 */
export function getKPISetForVariant(variantId: string): KPISet {
  const kpiId = VARIANT_TO_KPI[variantId as VariantId] ?? 'insurance';
  const set = KPI_REGISTRY[kpiId];
  return {
    ...set,
    lastUpdated: Date.now(),
  };
}

/**
 * Get a specific KPI set by its ID.
 */
export function getKPISetById(kpiSetId: string): KPISet | null {
  return KPI_REGISTRY[kpiSetId as KPISetId] ?? null;
}

/**
 * Get all available KPI set IDs.
 */
export function getAvailableKPISets(): { id: KPISetId; name: string; description: string }[] {
  return Object.values(KPI_REGISTRY).map(({ id, name, description }) => ({
    id, name, description,
  }));
}
