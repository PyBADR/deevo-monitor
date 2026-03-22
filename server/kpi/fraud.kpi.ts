/**
 * FRAUD variant KPI data — Fraud & Risk Intelligence Network metrics.
 * 5 sections: Fraud Overview, Typology Breakdown, Network Analysis,
 * Investigation Pipeline, Regulatory & Compliance.
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

// ── Section 1: Fraud Overview ───────────────────────────────────────

const fraudOverview: KPISection = {
  id: 'fraud-overview',
  title: 'Fraud Overview',
  icon: '🚨',
  metrics: [
    {
      id: 'total-exposure', label: 'Total Fraud Exposure', value: 1.42, unit: 'bn USD',
      trend: 'up', trendValue: '+$180M', severity: 'critical',
      sparkline: spark(1.3, 0.2), description: 'Estimated total fraud exposure across GCC',
      source: 'FRIN', updatedAt: ts(),
    },
    {
      id: 'detection-rate', label: 'Detection Rate', value: 78.4, unit: '%',
      trend: 'up', trendValue: '+3.2pp', severity: 'normal',
      sparkline: spark(76, 4), source: 'DeevoSentinel', updatedAt: ts(),
    },
    {
      id: 'false-positive', label: 'False Positive Rate', value: 8.2, unit: '%',
      trend: 'down', trendValue: '-1.4pp', severity: 'normal',
      sparkline: spark(9, 2), description: 'Lower is better — industry avg 15%',
      source: 'DeevoSentinel ML', updatedAt: ts(),
    },
    {
      id: 'active-rings', label: 'Active Fraud Rings', value: 34, unit: '',
      trend: 'up', trendValue: '+6', severity: 'high',
      sparkline: spark(30, 5), source: 'FRIN Network', updatedAt: ts(),
    },
    {
      id: 'savings-recovered', label: 'Savings Recovered', value: 482, unit: 'M USD',
      trend: 'up', trendValue: '+$78M', severity: 'normal',
      sparkline: spark(440, 50), description: 'Prevented payouts from detected fraud',
      source: 'FRIN Analytics', updatedAt: ts(),
    },
    {
      id: 'avg-investigation-time', label: 'Avg Investigation Time', value: 4.2, unit: 'days',
      trend: 'down', trendValue: '-0.8d', severity: 'normal',
      sparkline: spark(4.5, 1), source: 'FRIN SIU', updatedAt: ts(),
    },
  ],
};

// ── Section 2: Typology Breakdown ───────────────────────────────────

const typologyBreakdown: KPISection = {
  id: 'fraud-typology',
  title: 'Typology Breakdown',
  icon: '🔍',
  metrics: [
    {
      id: 'staged-collision', label: 'Staged Collisions', value: 412, unit: 'cases',
      trend: 'up', trendValue: '+14%', severity: 'high',
      sparkline: spark(380, 40), description: 'Motor fraud — organized staged accidents',
      source: 'FRIN Motor', updatedAt: ts(),
    },
    {
      id: 'medical-mills', label: 'Medical Mills', value: 186, unit: 'cases',
      trend: 'up', trendValue: '+22%', severity: 'critical',
      sparkline: spark(160, 25), description: 'Healthcare provider fraud networks',
      source: 'FRIN Health', updatedAt: ts(),
    },
    {
      id: 'phantom-policies', label: 'Phantom Policies', value: 94, unit: 'cases',
      trend: 'down', trendValue: '-8%', severity: 'elevated',
      sparkline: spark(100, 15), description: 'Fictitious policy creation',
      source: 'FRIN Policy', updatedAt: ts(),
    },
    {
      id: 'inflated-claims', label: 'Inflated Claims', value: 1247, unit: 'cases',
      trend: 'up', trendValue: '+6%', severity: 'elevated',
      sparkline: spark(1200, 80), source: 'FRIN Claims', updatedAt: ts(),
    },
    {
      id: 'identity-fraud', label: 'Identity Fraud', value: 328, unit: 'cases',
      trend: 'up', trendValue: '+18%', severity: 'high',
      sparkline: spark(300, 35), description: 'Synthetic & stolen identity cases',
      source: 'FRIN Identity', updatedAt: ts(),
    },
    {
      id: 'cyber-fraud', label: 'Cyber-Enabled Fraud', value: 76, unit: 'cases',
      trend: 'up', trendValue: '+42%', severity: 'critical',
      sparkline: spark(60, 15), description: 'Deepfake, AI-generated docs, phishing',
      source: 'FRIN Cyber', updatedAt: ts(),
    },
  ],
};

// ── Section 3: Network Analysis ─────────────────────────────────────

const networkAnalysis: KPISection = {
  id: 'fraud-network',
  title: 'Network Analysis',
  icon: '🕸️',
  metrics: [
    {
      id: 'entities-flagged', label: 'Entities Flagged', value: 14820, unit: '',
      trend: 'up', trendValue: '+2,140', severity: 'elevated',
      sparkline: spark(13500, 1500), source: 'FRIN Graph DB', updatedAt: ts(),
    },
    {
      id: 'connections-mapped', label: 'Connections Mapped', value: 48200, unit: '',
      trend: 'up', trendValue: '+6,800', severity: 'normal',
      sparkline: spark(44000, 5000), description: 'Entity-to-entity relationships',
      source: 'FRIN Graph DB', updatedAt: ts(),
    },
    {
      id: 'cross-company', label: 'Cross-Company Links', value: 892, unit: '',
      trend: 'up', trendValue: '+124', severity: 'high',
      sparkline: spark(820, 80), description: 'Fraud actors linked across insurers',
      source: 'FRIN Network', updatedAt: ts(),
    },
    {
      id: 'pep-matches', label: 'PEP/Sanctions Matches', value: 42, unit: '',
      trend: 'up', trendValue: '+8', severity: 'critical',
      sparkline: spark(38, 6), description: 'Politically Exposed Persons flagged',
      source: 'FRIN AML', updatedAt: ts(),
    },
    {
      id: 'geographic-clusters', label: 'Geographic Clusters', value: 18, unit: '',
      trend: 'up', trendValue: '+3', severity: 'elevated',
      sparkline: spark(16, 3), description: 'Hotspot areas with concentrated fraud activity',
      source: 'FRIN Geo', updatedAt: ts(),
    },
  ],
};

// ── Section 4: Investigation Pipeline ───────────────────────────────

const investigations: KPISection = {
  id: 'fraud-investigations',
  title: 'Investigation Pipeline',
  icon: '📂',
  metrics: [
    {
      id: 'open-cases', label: 'Open Cases', value: 1842, unit: '',
      trend: 'up', trendValue: '+214', severity: 'elevated',
      sparkline: spark(1700, 200), source: 'FRIN SIU', updatedAt: ts(),
    },
    {
      id: 'cases-closed-month', label: 'Closed This Month', value: 312, unit: '',
      trend: 'up', trendValue: '+48', severity: 'normal',
      sparkline: spark(280, 40), source: 'FRIN SIU', updatedAt: ts(),
    },
    {
      id: 'prosecution-referrals', label: 'Prosecution Referrals', value: 86, unit: '',
      trend: 'up', trendValue: '+12', severity: 'normal',
      sparkline: spark(78, 10), source: 'FRIN Legal', updatedAt: ts(),
    },
    {
      id: 'conviction-rate', label: 'Conviction Rate', value: 72.4, unit: '%',
      trend: 'up', trendValue: '+2.1pp', severity: 'normal',
      sparkline: spark(71, 4), source: 'FRIN Legal', updatedAt: ts(),
    },
    {
      id: 'siu-capacity', label: 'SIU Utilization', value: 91, unit: '%',
      trend: 'up', trendValue: '+4pp', severity: 'high',
      sparkline: spark(88, 5), description: 'Special Investigation Unit capacity usage',
      source: 'FRIN Operations', updatedAt: ts(),
    },
  ],
};

// ── Section 5: Regulatory & Compliance ──────────────────────────────

const regulatory: KPISection = {
  id: 'fraud-regulatory',
  title: 'Regulatory & Compliance',
  icon: '⚖️',
  metrics: [
    {
      id: 'sar-filed', label: 'SARs Filed (YTD)', value: 1248, unit: '',
      trend: 'up', trendValue: '+186', severity: 'normal',
      sparkline: spark(1150, 100), description: 'Suspicious Activity Reports filed with regulators',
      source: 'FRIN Compliance', updatedAt: ts(),
    },
    {
      id: 'aml-alerts', label: 'AML Alerts', value: 3420, unit: '',
      trend: 'up', trendValue: '+480', severity: 'elevated',
      sparkline: spark(3100, 400), source: 'FRIN AML', updatedAt: ts(),
    },
    {
      id: 'fatf-score', label: 'FATF Compliance Score', value: 8.4, unit: '/10',
      trend: 'up', trendValue: '+0.3', severity: 'normal',
      sparkline: spark(8.2, 0.4), source: 'FATF MER', updatedAt: ts(),
    },
    {
      id: 'pdpl-compliance', label: 'PDPL Compliance', value: 96, unit: '%',
      trend: 'up', trendValue: '+2pp', severity: 'normal',
      sparkline: spark(94, 3), description: 'Saudi Personal Data Protection Law compliance',
      source: 'FRIN DPO', updatedAt: ts(),
    },
    {
      id: 'audit-findings', label: 'Open Audit Findings', value: 4, unit: '',
      trend: 'down', trendValue: '-2', severity: 'normal',
      sparkline: spark(5, 2), source: 'Internal Audit', updatedAt: ts(),
    },
  ],
};

// ── Export KPI Set ──────────────────────────────────────────────────

export const FRAUD_KPI_SET: KPISet = {
  id: 'fraud',
  name: 'Fraud & Risk Intelligence',
  description: 'FRIN fraud detection, typology analysis, network intelligence, and compliance',
  sections: [fraudOverview, typologyBreakdown, networkAnalysis, investigations, regulatory],
  lastUpdated: Date.now(),
};
