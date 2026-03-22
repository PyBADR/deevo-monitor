/**
 * GLOBAL variant KPI data — Insurance industry metrics.
 * 5 sections: Market Overview, Lines of Business, Performance Ratios,
 * Fraud Intelligence, Country Breakdown.
 */
import type { KPISet, KPISection, KPIMetric, SparklinePoint } from './kpi.shared';

// ── Helpers ─────────────────────────────────────────────────────────

function spark(base: number, variance: number, points = 30): SparklinePoint[] {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    t: now - (points - i) * 3600_000,
    v: +(base + (Math.random() - 0.5) * variance).toFixed(2),
  }));
}

const ts = () => Date.now();

// ── Section 1: Market Overview ──────────────────────────────────────

const marketOverview: KPISection = {
  id: 'ins-market',
  title: 'Market Overview',
  icon: '📊',
  metrics: [
    {
      id: 'gwp-gcc', label: 'GCC GWP', value: 28.4, unit: 'bn USD',
      trend: 'up', trendValue: '+6.2%', severity: 'normal',
      sparkline: spark(28, 2), description: 'Gross Written Premium across GCC markets',
      source: 'Swiss Re Sigma / AM Best', updatedAt: ts(),
    },
    {
      id: 'market-growth', label: 'YoY Growth', value: 8.7, unit: '%',
      trend: 'up', trendValue: '+1.4pp', severity: 'normal',
      sparkline: spark(8, 1.5), source: 'SAMA Annual Report', updatedAt: ts(),
    },
    {
      id: 'penetration', label: 'Insurance Penetration', value: 2.1, unit: '%',
      trend: 'up', trendValue: '+0.3pp', severity: 'elevated',
      sparkline: spark(2, 0.3), description: 'Premium as % of GDP',
      source: 'World Bank / Swiss Re', updatedAt: ts(),
    },
    {
      id: 'density', label: 'Insurance Density', value: 612, unit: 'USD/cap',
      trend: 'up', trendValue: '+$48', severity: 'normal',
      sparkline: spark(600, 60), source: 'Swiss Re Sigma', updatedAt: ts(),
    },
    {
      id: 'combined-ratio-market', label: 'Market Combined Ratio', value: 97.2, unit: '%',
      trend: 'down', trendValue: '-1.8pp', severity: 'normal',
      sparkline: spark(98, 3), description: 'Industry-wide combined ratio',
      source: 'AM Best GCC Report', updatedAt: ts(),
    },
    {
      id: 'reinsurance-cession', label: 'Reinsurance Cession Rate', value: 34.5, unit: '%',
      trend: 'down', trendValue: '-2.1pp', severity: 'normal',
      sparkline: spark(35, 4), source: 'Artemis', updatedAt: ts(),
    },
  ],
};

// ── Section 2: Lines of Business ────────────────────────────────────

const linesOfBusiness: KPISection = {
  id: 'ins-lob',
  title: 'Lines of Business',
  icon: '🏢',
  metrics: [
    {
      id: 'motor-gwp', label: 'Motor GWP', value: 8.2, unit: 'bn USD',
      trend: 'up', trendValue: '+4.8%', severity: 'normal',
      sparkline: spark(8, 0.8), source: 'SAMA', updatedAt: ts(),
    },
    {
      id: 'health-gwp', label: 'Medical/Health GWP', value: 11.6, unit: 'bn USD',
      trend: 'up', trendValue: '+9.2%', severity: 'normal',
      sparkline: spark(11, 1), description: 'Driven by mandatory health insurance expansion',
      source: 'CCHI / SAMA', updatedAt: ts(),
    },
    {
      id: 'property-gwp', label: 'Property GWP', value: 3.8, unit: 'bn USD',
      trend: 'up', trendValue: '+7.1%', severity: 'normal',
      sparkline: spark(3.5, 0.5), source: 'AM Best', updatedAt: ts(),
    },
    {
      id: 'marine-gwp', label: 'Marine & Aviation GWP', value: 1.4, unit: 'bn USD',
      trend: 'flat', trendValue: '+0.3%', severity: 'normal',
      sparkline: spark(1.4, 0.2), source: 'Lloyd\'s', updatedAt: ts(),
    },
    {
      id: 'engineering-gwp', label: 'Engineering GWP', value: 2.1, unit: 'bn USD',
      trend: 'up', trendValue: '+12.4%', severity: 'normal',
      sparkline: spark(2, 0.3), description: 'NEOM & Vision 2030 mega-project demand',
      source: 'Marsh GCC Report', updatedAt: ts(),
    },
    {
      id: 'life-gwp', label: 'Life & Savings GWP', value: 1.3, unit: 'bn USD',
      trend: 'up', trendValue: '+5.6%', severity: 'normal',
      sparkline: spark(1.2, 0.2), source: 'Swiss Re', updatedAt: ts(),
    },
  ],
};

// ── Section 3: Performance Ratios ───────────────────────────────────

const performanceRatios: KPISection = {
  id: 'ins-ratios',
  title: 'Performance Ratios',
  icon: '📈',
  metrics: [
    {
      id: 'loss-ratio', label: 'Loss Ratio', value: 68.4, unit: '%',
      trend: 'down', trendValue: '-2.1pp', severity: 'normal',
      sparkline: spark(69, 4), source: 'AM Best', updatedAt: ts(),
    },
    {
      id: 'expense-ratio', label: 'Expense Ratio', value: 28.8, unit: '%',
      trend: 'flat', trendValue: '+0.2pp', severity: 'normal',
      sparkline: spark(29, 2), source: 'AM Best', updatedAt: ts(),
    },
    {
      id: 'combined-ratio', label: 'Combined Ratio', value: 97.2, unit: '%',
      trend: 'down', trendValue: '-1.9pp', severity: 'normal',
      sparkline: spark(98, 3), source: 'AM Best', updatedAt: ts(),
    },
    {
      id: 'roe', label: 'Return on Equity', value: 12.8, unit: '%',
      trend: 'up', trendValue: '+1.4pp', severity: 'normal',
      sparkline: spark(12, 2), source: 'Company Filings', updatedAt: ts(),
    },
    {
      id: 'solvency-ratio', label: 'Solvency Ratio', value: 187, unit: '%',
      trend: 'up', trendValue: '+8pp', severity: 'normal',
      sparkline: spark(185, 15), description: 'Average regulatory solvency margin',
      source: 'SAMA', updatedAt: ts(),
    },
    {
      id: 'investment-yield', label: 'Investment Yield', value: 4.2, unit: '%',
      trend: 'up', trendValue: '+0.6pp', severity: 'normal',
      sparkline: spark(4, 0.5), source: 'Central Bank Reports', updatedAt: ts(),
    },
  ],
};

// ── Section 4: Fraud Intelligence ───────────────────────────────────

const fraudIntel: KPISection = {
  id: 'ins-fraud',
  title: 'Fraud Intelligence',
  icon: '🛡️',
  metrics: [
    {
      id: 'fraud-rate', label: 'Detected Fraud Rate', value: 4.2, unit: '%',
      trend: 'up', trendValue: '+0.8pp', severity: 'elevated',
      sparkline: spark(4, 1), description: 'Claims flagged as fraudulent',
      source: 'DeevoSentinel', updatedAt: ts(),
    },
    {
      id: 'fraud-savings', label: 'Fraud Savings', value: 340, unit: 'M USD',
      trend: 'up', trendValue: '+$62M', severity: 'normal',
      sparkline: spark(320, 40), source: 'FRIN', updatedAt: ts(),
    },
    {
      id: 'siu-cases', label: 'Active SIU Cases', value: 1842, unit: '',
      trend: 'up', trendValue: '+214', severity: 'elevated',
      sparkline: spark(1700, 200), source: 'DeevoSentinel', updatedAt: ts(),
    },
    {
      id: 'avg-claim-leakage', label: 'Avg Claim Leakage', value: 8.6, unit: '%',
      trend: 'down', trendValue: '-1.2pp', severity: 'normal',
      sparkline: spark(9, 1.5), description: 'Overpayment as % of incurred claims',
      source: 'FRIN Analytics', updatedAt: ts(),
    },
  ],
};

// ── Section 5: Country Breakdown ────────────────────────────────────

const countryBreakdown: KPISection = {
  id: 'ins-countries',
  title: 'Country Breakdown',
  icon: '🌍',
  metrics: [
    {
      id: 'sa-gwp', label: '🇸🇦 Saudi Arabia GWP', value: 14.2, unit: 'bn USD',
      trend: 'up', trendValue: '+8.4%', severity: 'normal',
      sparkline: spark(14, 1.5), source: 'SAMA', updatedAt: ts(),
    },
    {
      id: 'ae-gwp', label: '🇦🇪 UAE GWP', value: 8.6, unit: 'bn USD',
      trend: 'up', trendValue: '+5.1%', severity: 'normal',
      sparkline: spark(8.5, 0.8), source: 'CBUAE', updatedAt: ts(),
    },
    {
      id: 'kw-gwp', label: '🇰🇼 Kuwait GWP', value: 2.1, unit: 'bn USD',
      trend: 'up', trendValue: '+3.8%', severity: 'normal',
      sparkline: spark(2, 0.3), source: 'CMA Kuwait', updatedAt: ts(),
    },
    {
      id: 'qa-gwp', label: '🇶🇦 Qatar GWP', value: 1.8, unit: 'bn USD',
      trend: 'up', trendValue: '+6.2%', severity: 'normal',
      sparkline: spark(1.7, 0.2), source: 'QCB', updatedAt: ts(),
    },
    {
      id: 'om-gwp', label: '🇴🇲 Oman GWP', value: 1.1, unit: 'bn USD',
      trend: 'up', trendValue: '+4.5%', severity: 'normal',
      sparkline: spark(1, 0.15), source: 'CMA Oman', updatedAt: ts(),
    },
    {
      id: 'bh-gwp', label: '🇧🇭 Bahrain GWP', value: 0.6, unit: 'bn USD',
      trend: 'flat', trendValue: '+1.2%', severity: 'normal',
      sparkline: spark(0.6, 0.08), source: 'CBB', updatedAt: ts(),
    },
  ],
};

// ── Export KPI Set ──────────────────────────────────────────────────

export const INSURANCE_KPI_SET: KPISet = {
  id: 'insurance',
  name: 'GCC Insurance Intelligence',
  description: 'Comprehensive insurance market KPIs across all GCC markets',
  sections: [marketOverview, linesOfBusiness, performanceRatios, fraudIntel, countryBreakdown],
  lastUpdated: Date.now(),
};
