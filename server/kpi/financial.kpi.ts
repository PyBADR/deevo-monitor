/**
 * FINANCE variant KPI data — Financial Markets metrics.
 * 5 sections: GCC Market Indices, Insurance Stocks, Fixed Income,
 * IFRS 17 Compliance, Reinsurance Markets.
 */
import type { KPISet, KPISection } from './kpi.shared';

function spark(base: number, variance: number, points = 30) {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    t: now - (points - i) * 3600_000,
    v: +(base + (Math.random() - 0.5) * variance).toFixed(2),
  }));
}
const ts = () => Date.now();

// ── Section 1: GCC Market Indices ───────────────────────────────────

const marketIndices: KPISection = {
  id: 'fin-indices',
  title: 'GCC Market Indices',
  icon: '📈',
  metrics: [
    {
      id: 'tasi', label: 'TASI (Saudi)', value: 12847, unit: '',
      trend: 'up', trendValue: '+1.4%', severity: 'normal',
      sparkline: spark(12700, 300), source: 'Tadawul', updatedAt: ts(),
    },
    {
      id: 'adi', label: 'ADI (Abu Dhabi)', value: 9234, unit: '',
      trend: 'up', trendValue: '+0.8%', severity: 'normal',
      sparkline: spark(9150, 200), source: 'ADX', updatedAt: ts(),
    },
    {
      id: 'dfm', label: 'DFM (Dubai)', value: 4412, unit: '',
      trend: 'down', trendValue: '-0.3%', severity: 'normal',
      sparkline: spark(4430, 100), source: 'DFM', updatedAt: ts(),
    },
    {
      id: 'boursa', label: 'Boursa Kuwait', value: 7891, unit: '',
      trend: 'up', trendValue: '+0.5%', severity: 'normal',
      sparkline: spark(7850, 120), source: 'Boursa Kuwait', updatedAt: ts(),
    },
    {
      id: 'msm30', label: 'MSM 30 (Oman)', value: 4623, unit: '',
      trend: 'flat', trendValue: '+0.1%', severity: 'normal',
      sparkline: spark(4610, 50), source: 'MSM', updatedAt: ts(),
    },
    {
      id: 'bse', label: 'Bahrain Bourse', value: 1987, unit: '',
      trend: 'up', trendValue: '+0.4%', severity: 'normal',
      sparkline: spark(1975, 30), source: 'BHB', updatedAt: ts(),
    },
  ],
};

// ── Section 2: Insurance Stocks ─────────────────────────────────────

const insuranceStocks: KPISection = {
  id: 'fin-insurance-stocks',
  title: 'Insurance Stocks',
  icon: '🏦',
  metrics: [
    {
      id: 'tawuniya', label: 'Tawuniya (8010.SR)', value: 142.8, unit: 'SAR',
      trend: 'up', trendValue: '+3.2%', severity: 'normal',
      sparkline: spark(140, 8), source: 'Tadawul', updatedAt: ts(),
    },
    {
      id: 'bupa-arabia', label: 'Bupa Arabia (8210.SR)', value: 198.4, unit: 'SAR',
      trend: 'up', trendValue: '+1.8%', severity: 'normal',
      sparkline: spark(195, 6), source: 'Tadawul', updatedAt: ts(),
    },
    {
      id: 'orient-insurance', label: 'Orient Insurance', value: 8.42, unit: 'AED',
      trend: 'down', trendValue: '-0.6%', severity: 'normal',
      sparkline: spark(8.5, 0.4), source: 'DFM', updatedAt: ts(),
    },
    {
      id: 'oman-insurance', label: 'Oman Insurance', value: 2.14, unit: 'OMR',
      trend: 'flat', trendValue: '+0.2%', severity: 'normal',
      sparkline: spark(2.12, 0.1), source: 'MSM', updatedAt: ts(),
    },
    {
      id: 'gcc-insurance-index', label: 'GCC Insurance Index', value: 1247, unit: '',
      trend: 'up', trendValue: '+2.1%', severity: 'normal',
      sparkline: spark(1230, 30), description: 'Composite of top 20 GCC insurance stocks',
      source: 'S&P GCC Index', updatedAt: ts(),
    },
  ],
};

// ── Section 3: Fixed Income ─────────────────────────────────────────

const fixedIncome: KPISection = {
  id: 'fin-bonds',
  title: 'Fixed Income & Sukuk',
  icon: '📜',
  metrics: [
    {
      id: 'gcc-sovereign-yield', label: 'GCC Sovereign Avg Yield', value: 4.82, unit: '%',
      trend: 'down', trendValue: '-12bp', severity: 'normal',
      sparkline: spark(4.9, 0.3), source: 'Bloomberg', updatedAt: ts(),
    },
    {
      id: 'sukuk-issuance', label: 'Sukuk Issuance (YTD)', value: 48.2, unit: 'bn USD',
      trend: 'up', trendValue: '+18%', severity: 'normal',
      sparkline: spark(45, 5), source: 'S&P Sukuk Index', updatedAt: ts(),
    },
    {
      id: 'cat-bond-spread', label: 'Cat Bond Spread', value: 682, unit: 'bp',
      trend: 'down', trendValue: '-48bp', severity: 'normal',
      sparkline: spark(700, 60), source: 'Artemis', updatedAt: ts(),
    },
    {
      id: 'ils-outstanding', label: 'ILS Outstanding', value: 47.8, unit: 'bn USD',
      trend: 'up', trendValue: '+$3.2B', severity: 'normal',
      sparkline: spark(46, 3), description: 'Insurance-linked securities market size',
      source: 'Artemis', updatedAt: ts(),
    },
  ],
};

// ── Section 4: IFRS 17 Compliance ───────────────────────────────────

const ifrs17: KPISection = {
  id: 'fin-ifrs17',
  title: 'IFRS 17 Compliance',
  icon: '📋',
  metrics: [
    {
      id: 'gcc-adoption', label: 'GCC IFRS 17 Adoption', value: 94, unit: '%',
      trend: 'up', trendValue: '+6pp', severity: 'normal',
      sparkline: spark(90, 5), description: 'GCC insurers compliant with IFRS 17',
      source: 'Deloitte / KPMG', updatedAt: ts(),
    },
    {
      id: 'csm-balance', label: 'Industry CSM Balance', value: 8.4, unit: 'bn USD',
      trend: 'up', trendValue: '+$1.1B', severity: 'normal',
      sparkline: spark(8, 1), description: 'Contractual Service Margin balance',
      source: 'Company Filings', updatedAt: ts(),
    },
    {
      id: 'ra-level', label: 'Risk Adjustment Level', value: 6.8, unit: '%',
      trend: 'flat', trendValue: '+0.1pp', severity: 'normal',
      sparkline: spark(6.7, 0.5), description: 'Avg risk adjustment as % of best estimate',
      source: 'Actuarial Reports', updatedAt: ts(),
    },
    {
      id: 'bba-groups', label: 'BBA Group Count', value: 342, unit: '',
      trend: 'up', trendValue: '+28', severity: 'normal',
      sparkline: spark(330, 20), description: 'Building Block Approach contract groups',
      source: 'Industry Average', updatedAt: ts(),
    },
    {
      id: 'paa-eligible', label: 'PAA Eligible %', value: 71, unit: '%',
      trend: 'flat', trendValue: '+0.5pp', severity: 'normal',
      sparkline: spark(70, 3), description: 'Premium Allocation Approach eligible contracts',
      source: 'Industry Average', updatedAt: ts(),
    },
  ],
};

// ── Section 5: Reinsurance Markets ──────────────────────────────────

const reinsuranceMarkets: KPISection = {
  id: 'fin-reinsurance',
  title: 'Reinsurance Markets',
  icon: '🔄',
  metrics: [
    {
      id: 'global-reinsurance-cap', label: 'Global Reinsurance Capital', value: 695, unit: 'bn USD',
      trend: 'up', trendValue: '+$28B', severity: 'normal',
      sparkline: spark(680, 30), source: 'Aon Reinsurance Report', updatedAt: ts(),
    },
    {
      id: 'rol-index', label: 'Rate-on-Line Index', value: 112.4, unit: '',
      trend: 'up', trendValue: '+4.8%', severity: 'normal',
      sparkline: spark(110, 5), source: 'Guy Carpenter', updatedAt: ts(),
    },
    {
      id: 'cat-losses-ytd', label: 'Cat Losses (YTD)', value: 42, unit: 'bn USD',
      trend: 'up', trendValue: '+$8B', severity: 'elevated',
      sparkline: spark(38, 8), description: 'Global insured catastrophe losses',
      source: 'Swiss Re natCatSERVICE', updatedAt: ts(),
    },
    {
      id: 'gcc-cession-rate', label: 'GCC Cession Rate', value: 34.5, unit: '%',
      trend: 'down', trendValue: '-2.1pp', severity: 'normal',
      sparkline: spark(35, 3), source: 'Artemis', updatedAt: ts(),
    },
  ],
};

// ── Export KPI Set ──────────────────────────────────────────────────

export const FINANCIAL_KPI_SET: KPISet = {
  id: 'financial',
  name: 'Financial Markets Intelligence',
  description: 'GCC market indices, insurance stocks, IFRS 17, and reinsurance analytics',
  sections: [marketIndices, insuranceStocks, fixedIncome, ifrs17, reinsuranceMarkets],
  lastUpdated: Date.now(),
};
