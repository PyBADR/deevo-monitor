/**
 * COMMODITY variant KPI data — Energy & commodity insurance metrics.
 * 5 sections: Energy Markets, Marine & Cargo, Commodity Risk,
 * Supply Chain, Environmental Impact.
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

const energyMarkets: KPISection = {
  id: 'cmd-energy',
  title: 'Energy Markets',
  icon: '⛽',
  metrics: [
    { id: 'brent-crude', label: 'Brent Crude', value: 82.45, unit: 'USD/bbl', trend: 'up', trendValue: '+2.1%', severity: 'normal', sparkline: spark(82, 8), source: 'ICE Futures', updatedAt: ts() },
    { id: 'wti-crude', label: 'WTI Crude', value: 78.32, unit: 'USD/bbl', trend: 'up', trendValue: '+1.8%', severity: 'normal', sparkline: spark(78, 7), source: 'NYMEX', updatedAt: ts() },
    { id: 'nat-gas', label: 'Natural Gas', value: 2.85, unit: 'USD/MMBtu', trend: 'down', trendValue: '-3.2%', severity: 'elevated', sparkline: spark(2.8, 0.5), source: 'Henry Hub', updatedAt: ts() },
    { id: 'opec-compliance', label: 'OPEC+ Compliance', value: 94.2, unit: '%', trend: 'flat', trendValue: '+0.3pp', severity: 'normal', sparkline: spark(94, 3), source: 'OPEC Secretariat', updatedAt: ts() },
    { id: 'gcc-oil-exports', label: 'GCC Oil Exports', value: 14.2, unit: 'mn bpd', trend: 'up', trendValue: '+0.4%', severity: 'normal', sparkline: spark(14, 1), source: 'JODI', updatedAt: ts() },
  ],
};

const marineCargo: KPISection = {
  id: 'cmd-marine',
  title: 'Marine & Cargo',
  icon: '🚢',
  metrics: [
    { id: 'marine-premium', label: 'Marine Premium Index', value: 142, unit: 'idx', trend: 'up', trendValue: '+8.3%', severity: 'elevated', sparkline: spark(140, 15), source: 'IUMI', updatedAt: ts() },
    { id: 'cargo-losses', label: 'Cargo Losses YTD', value: 3.2, unit: 'bn USD', trend: 'up', trendValue: '+12%', severity: 'high', sparkline: spark(3, 0.5), source: 'AGCS', updatedAt: ts() },
    { id: 'vessel-incidents', label: 'Vessel Incidents (30d)', value: 47, unit: 'count', trend: 'up', trendValue: '+15%', severity: 'high', sparkline: spark(45, 10), source: 'IMB', updatedAt: ts() },
    { id: 'suez-transit', label: 'Suez Daily Transit', value: 62, unit: 'vessels', trend: 'down', trendValue: '-18%', severity: 'critical', sparkline: spark(65, 12), source: 'Suez Canal Authority', updatedAt: ts() },
    { id: 'hormuz-flow', label: 'Hormuz Oil Flow', value: 17.1, unit: 'mn bpd', trend: 'flat', trendValue: '-0.2%', severity: 'normal', sparkline: spark(17, 1), source: 'EIA', updatedAt: ts() },
  ],
};

const commodityRisk: KPISection = {
  id: 'cmd-risk',
  title: 'Commodity Risk',
  icon: '📈',
  metrics: [
    { id: 'commodity-vol', label: 'Commodity Vol Index', value: 24.8, unit: '%', trend: 'up', trendValue: '+3.1pp', severity: 'elevated', sparkline: spark(24, 5), source: 'Bloomberg', updatedAt: ts() },
    { id: 'energy-war-risk', label: 'Energy War Risk Rate', value: 0.85, unit: '%', trend: 'up', trendValue: '+0.15pp', severity: 'high', sparkline: spark(0.8, 0.2), source: 'JLT Specialty', updatedAt: ts() },
    { id: 'crop-failure', label: 'Crop Failure Claims', value: 1.8, unit: 'bn USD', trend: 'up', trendValue: '+22%', severity: 'high', sparkline: spark(1.5, 0.5), source: 'IFAD', updatedAt: ts() },
    { id: 'metal-index', label: 'Industrial Metals', value: 187, unit: 'idx', trend: 'down', trendValue: '-2.4%', severity: 'normal', sparkline: spark(188, 10), source: 'LME', updatedAt: ts() },
  ],
};

const supplyChain: KPISection = {
  id: 'cmd-supply',
  title: 'Supply Chain',
  icon: '🔗',
  metrics: [
    { id: 'gscpi', label: 'Global Supply Chain Pressure', value: 1.42, unit: 'σ', trend: 'up', trendValue: '+0.3σ', severity: 'elevated', sparkline: spark(1.4, 0.4), source: 'NY Fed', updatedAt: ts() },
    { id: 'container-rate', label: 'Container Rates (40ft)', value: 4250, unit: 'USD', trend: 'up', trendValue: '+35%', severity: 'high', sparkline: spark(4000, 800), source: 'Freightos', updatedAt: ts() },
    { id: 'port-congestion', label: 'GCC Port Congestion', value: 12, unit: 'days avg', trend: 'up', trendValue: '+2.5d', severity: 'elevated', sparkline: spark(11, 3), source: 'DP World', updatedAt: ts() },
    { id: 'trade-bi', label: 'Trade BI Claims', value: 890, unit: 'mn USD', trend: 'up', trendValue: '+18%', severity: 'elevated', sparkline: spark(850, 100), source: 'AGCS', updatedAt: ts() },
  ],
};

const environmental: KPISection = {
  id: 'cmd-env',
  title: 'Environmental Impact',
  icon: '🌍',
  metrics: [
    { id: 'carbon-price', label: 'EU Carbon Price', value: 68, unit: 'EUR/t', trend: 'down', trendValue: '-5.2%', severity: 'normal', sparkline: spark(70, 10), source: 'ICE EUA', updatedAt: ts() },
    { id: 'nat-cat-losses', label: 'NatCat Losses YTD', value: 52, unit: 'bn USD', trend: 'up', trendValue: '+28%', severity: 'critical', sparkline: spark(48, 8), source: 'Munich Re', updatedAt: ts() },
    { id: 'gcc-heat-events', label: 'GCC Extreme Heat Events', value: 34, unit: 'count', trend: 'up', trendValue: '+45%', severity: 'high', sparkline: spark(30, 8), source: 'WMO', updatedAt: ts() },
  ],
};

export const COMMODITY_KPI_SET: KPISet = {
  id: 'commodity' as any,
  name: 'Commodity Intelligence',
  description: 'Energy, marine cargo, and commodity insurance market metrics for the GCC.',
  sections: [energyMarkets, marineCargo, commodityRisk, supplyChain, environmental],
  lastUpdated: Date.now(),
};
