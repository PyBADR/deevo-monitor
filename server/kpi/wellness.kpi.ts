/**
 * HAPPY variant KPI data — Wellness & positive insurance impact metrics.
 * 5 sections: Community Impact, Health & Wellness, Financial Inclusion,
 * ESG Performance, Claims Resolution.
 */
import type { KPISet, KPISection, SparklinePoint } from './kpi.shared';

function spark(base: number, variance: number, points = 30): SparklinePoint[] {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    t: now - (points - i) * 3600_000,
    v: +(base + (Math.random() - 0.5) * variance).toFixed(2),
  }));
}

const ts = () => Date.now();

const communityImpact: KPISection = {
  id: 'well-community',
  title: 'Community Impact',
  icon: '🤝',
  metrics: [
    { id: 'lives-covered', label: 'Lives Covered (GCC)', value: 42.5, unit: 'mn', trend: 'up', trendValue: '+8.2%', severity: 'normal', sparkline: spark(42, 3), source: 'GCC Insurance Authorities', updatedAt: ts() },
    { id: 'micro-policies', label: 'Micro Insurance Policies', value: 3.8, unit: 'mn', trend: 'up', trendValue: '+24%', severity: 'normal', sparkline: spark(3.5, 0.5), source: 'IAIS', updatedAt: ts() },
    { id: 'claims-paid', label: 'Claims Paid (QTD)', value: 6.2, unit: 'bn USD', trend: 'up', trendValue: '+12%', severity: 'normal', sparkline: spark(6, 0.8), source: 'AM Best', updatedAt: ts() },
    { id: 'csat-score', label: 'Customer Satisfaction', value: 4.2, unit: '/5.0', trend: 'up', trendValue: '+0.3', severity: 'normal', sparkline: spark(4.1, 0.3), source: 'JD Power GCC', updatedAt: ts() },
  ],
};

const healthWellness: KPISection = {
  id: 'well-health',
  title: 'Health & Wellness',
  icon: '💚',
  metrics: [
    { id: 'health-coverage', label: 'Health Insurance Coverage', value: 78, unit: '%', trend: 'up', trendValue: '+4.5pp', severity: 'normal', sparkline: spark(76, 4), source: 'WHO / SAMA', updatedAt: ts() },
    { id: 'preventive-claims', label: 'Preventive Care Claims', value: 890, unit: 'mn USD', trend: 'up', trendValue: '+18%', severity: 'normal', sparkline: spark(850, 80), source: 'CCHI', updatedAt: ts() },
    { id: 'mental-health', label: 'Mental Health Coverage', value: 34, unit: '%', trend: 'up', trendValue: '+8pp', severity: 'elevated', sparkline: spark(32, 4), source: 'Insurance Authorities', updatedAt: ts() },
    { id: 'telemedicine', label: 'Telemedicine Uptake', value: 42, unit: '%', trend: 'up', trendValue: '+15pp', severity: 'normal', sparkline: spark(38, 5), source: 'GCC Digital Health', updatedAt: ts() },
  ],
};

const financialInclusion: KPISection = {
  id: 'well-finc',
  title: 'Financial Inclusion',
  icon: '🏦',
  metrics: [
    { id: 'takaful-growth', label: 'Takaful Market Growth', value: 14.2, unit: '%', trend: 'up', trendValue: '+2.1pp', severity: 'normal', sparkline: spark(13, 2), source: 'IFSB', updatedAt: ts() },
    { id: 'sme-coverage', label: 'SME Insurance Rate', value: 28, unit: '%', trend: 'up', trendValue: '+5pp', severity: 'elevated', sparkline: spark(26, 3), source: 'SAMA / CBUAE', updatedAt: ts() },
    { id: 'expat-coverage', label: 'Expat Worker Coverage', value: 92, unit: '%', trend: 'up', trendValue: '+3pp', severity: 'normal', sparkline: spark(90, 2), source: 'GCC Labor Authorities', updatedAt: ts() },
    { id: 'digital-policies', label: 'Digital Policy Issuance', value: 56, unit: '%', trend: 'up', trendValue: '+12pp', severity: 'normal', sparkline: spark(52, 5), source: 'InsurTech Reports', updatedAt: ts() },
  ],
};

const esgPerformance: KPISection = {
  id: 'well-esg',
  title: 'ESG Performance',
  icon: '🌱',
  metrics: [
    { id: 'esg-score', label: 'Avg ESG Score (GCC Insurers)', value: 62, unit: '/100', trend: 'up', trendValue: '+8pts', severity: 'normal', sparkline: spark(60, 5), source: 'MSCI', updatedAt: ts() },
    { id: 'green-premium', label: 'Green Insurance Premiums', value: 1.2, unit: 'bn USD', trend: 'up', trendValue: '+35%', severity: 'normal', sparkline: spark(1, 0.3), source: 'Swiss Re', updatedAt: ts() },
    { id: 'carbon-offset', label: 'Carbon Offsets Purchased', value: 2.4, unit: 'mn tonnes', trend: 'up', trendValue: '+42%', severity: 'normal', sparkline: spark(2, 0.5), source: 'Verra', updatedAt: ts() },
  ],
};

const claimsResolution: KPISection = {
  id: 'well-claims',
  title: 'Claims Resolution',
  icon: '✅',
  metrics: [
    { id: 'avg-settlement', label: 'Avg Settlement Time', value: 4.2, unit: 'days', trend: 'down', trendValue: '-28%', severity: 'normal', sparkline: spark(5, 1.5), source: 'Deevo Analytics', updatedAt: ts() },
    { id: 'auto-approval', label: 'Auto-Approved Claims', value: 38, unit: '%', trend: 'up', trendValue: '+12pp', severity: 'normal', sparkline: spark(35, 4), source: 'AI Claims Engine', updatedAt: ts() },
    { id: 'dispute-rate', label: 'Dispute Rate', value: 3.8, unit: '%', trend: 'down', trendValue: '-1.2pp', severity: 'normal', sparkline: spark(4.2, 0.8), source: 'Insurance Ombudsman', updatedAt: ts() },
    { id: 'nps', label: 'Claims NPS', value: 67, unit: 'score', trend: 'up', trendValue: '+8', severity: 'normal', sparkline: spark(64, 5), source: 'Customer Feedback', updatedAt: ts() },
  ],
};

export const WELLNESS_KPI_SET: KPISet = {
  id: 'wellness' as any,
  name: 'Wellness Intelligence',
  description: 'Positive impact, health, inclusion, and ESG metrics for GCC insurance.',
  sections: [communityImpact, healthWellness, financialInclusion, esgPerformance, claimsResolution],
  lastUpdated: Date.now(),
};
