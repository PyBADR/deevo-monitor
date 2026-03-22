/**
 * TECH variant KPI data — InsurTech / Technology metrics.
 * 5 sections: Funding & Deals, Platform Metrics, AI/ML Pipeline,
 * Ecosystem Health, GCC Tech Landscape.
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

// ── Section 1: Funding & Deals ──────────────────────────────────────

const fundingDeals: KPISection = {
  id: 'tech-funding',
  title: 'Funding & Deals',
  icon: '💰',
  metrics: [
    {
      id: 'total-funding', label: 'Global InsurTech Funding', value: 4.2, unit: 'bn USD',
      trend: 'down', trendValue: '-18%', severity: 'elevated',
      sparkline: spark(4.5, 1), description: 'YTD InsurTech venture funding',
      source: 'CB Insights / Gallagher Re', updatedAt: ts(),
    },
    {
      id: 'deal-count', label: 'Deal Count (YTD)', value: 287, unit: '',
      trend: 'down', trendValue: '-12%', severity: 'normal',
      sparkline: spark(290, 30), source: 'Crunchbase', updatedAt: ts(),
    },
    {
      id: 'gcc-insurtech-funding', label: 'GCC InsurTech Funding', value: 186, unit: 'M USD',
      trend: 'up', trendValue: '+42%', severity: 'normal',
      sparkline: spark(170, 30), description: 'MAGNiTT tracked GCC InsurTech raises',
      source: 'MAGNiTT', updatedAt: ts(),
    },
    {
      id: 'mega-rounds', label: 'Mega Rounds ($100M+)', value: 8, unit: '',
      trend: 'down', trendValue: '-4', severity: 'elevated',
      sparkline: spark(9, 3), source: 'CB Insights', updatedAt: ts(),
    },
    {
      id: 'avg-deal-size', label: 'Avg Deal Size', value: 14.6, unit: 'M USD',
      trend: 'down', trendValue: '-$2.1M', severity: 'normal',
      sparkline: spark(15, 3), source: 'Gallagher Re', updatedAt: ts(),
    },
    {
      id: 'unicorn-count', label: 'InsurTech Unicorns', value: 42, unit: '',
      trend: 'flat', trendValue: '+1', severity: 'normal',
      sparkline: spark(41, 2), source: 'CB Insights', updatedAt: ts(),
    },
  ],
};

// ── Section 2: Platform Metrics ─────────────────────────────────────

const platformMetrics: KPISection = {
  id: 'tech-platform',
  title: 'Platform Metrics',
  icon: '⚡',
  metrics: [
    {
      id: 'api-latency', label: 'API Avg Latency', value: 142, unit: 'ms',
      trend: 'down', trendValue: '-18ms', severity: 'normal',
      sparkline: spark(150, 20), source: 'Deevo Platform', updatedAt: ts(),
    },
    {
      id: 'uptime', label: 'Platform Uptime', value: 99.97, unit: '%',
      trend: 'up', trendValue: '+0.02pp', severity: 'normal',
      sparkline: spark(99.95, 0.05), source: 'Deevo SRE', updatedAt: ts(),
    },
    {
      id: 'daily-quotes', label: 'Daily Quote Volume', value: 284000, unit: '',
      trend: 'up', trendValue: '+14%', severity: 'normal',
      sparkline: spark(270000, 30000), source: 'Deevo Analytics', updatedAt: ts(),
    },
    {
      id: 'embed-partners', label: 'Embedded Partners', value: 47, unit: '',
      trend: 'up', trendValue: '+6', severity: 'normal',
      sparkline: spark(44, 4), description: 'Active API distribution partners',
      source: 'Deevo Platform', updatedAt: ts(),
    },
    {
      id: 'bind-rate', label: 'Digital Bind Rate', value: 34.2, unit: '%',
      trend: 'up', trendValue: '+2.8pp', severity: 'normal',
      sparkline: spark(33, 3), source: 'Deevo Analytics', updatedAt: ts(),
    },
  ],
};

// ── Section 3: AI/ML Pipeline ───────────────────────────────────────

const aiPipeline: KPISection = {
  id: 'tech-ai',
  title: 'AI/ML Pipeline',
  icon: '🤖',
  metrics: [
    {
      id: 'model-accuracy', label: 'Fraud Model Accuracy', value: 94.7, unit: '%',
      trend: 'up', trendValue: '+0.8pp', severity: 'normal',
      sparkline: spark(94, 1), source: 'DeevoSentinel ML', updatedAt: ts(),
    },
    {
      id: 'inference-latency', label: 'Inference Latency (P99)', value: 48, unit: 'ms',
      trend: 'down', trendValue: '-6ms', severity: 'normal',
      sparkline: spark(50, 8), source: 'Ollama GPU Cluster', updatedAt: ts(),
    },
    {
      id: 'training-jobs', label: 'Active Training Jobs', value: 12, unit: '',
      trend: 'up', trendValue: '+3', severity: 'normal',
      sparkline: spark(10, 3), source: 'MLOps Dashboard', updatedAt: ts(),
    },
    {
      id: 'model-drift', label: 'Model Drift Score', value: 0.023, unit: '',
      trend: 'up', trendValue: '+0.004', severity: 'elevated',
      sparkline: spark(0.02, 0.008), description: 'PSI score — >0.05 triggers retraining',
      source: 'MLOps Monitoring', updatedAt: ts(),
    },
    {
      id: 'llm-tokens', label: 'LLM Tokens/Day', value: 18.4, unit: 'M',
      trend: 'up', trendValue: '+22%', severity: 'normal',
      sparkline: spark(16, 3), source: 'Ollama / LangGraph', updatedAt: ts(),
    },
    {
      id: 'claims-auto-rate', label: 'Claims Auto-Adjudication', value: 62.1, unit: '%',
      trend: 'up', trendValue: '+4.3pp', severity: 'normal',
      sparkline: spark(60, 5), description: 'Claims resolved without human intervention',
      source: 'Deevo Claims AI', updatedAt: ts(),
    },
  ],
};

// ── Section 4: Ecosystem Health ─────────────────────────────────────

const ecosystem: KPISection = {
  id: 'tech-ecosystem',
  title: 'Ecosystem Health',
  icon: '🌐',
  metrics: [
    {
      id: 'sandbox-participants', label: 'SAMA Sandbox Cohort', value: 14, unit: '',
      trend: 'up', trendValue: '+3', severity: 'normal',
      sparkline: spark(12, 2), source: 'SAMA', updatedAt: ts(),
    },
    {
      id: 'open-api-adopters', label: 'Open API Adopters', value: 89, unit: '',
      trend: 'up', trendValue: '+12', severity: 'normal',
      sparkline: spark(82, 8), source: 'Deevo Developer Portal', updatedAt: ts(),
    },
    {
      id: 'github-stars', label: 'OSS GitHub Stars', value: 2400, unit: '',
      trend: 'up', trendValue: '+340', severity: 'normal',
      sparkline: spark(2200, 200), source: 'GitHub', updatedAt: ts(),
    },
    {
      id: 'developer-nps', label: 'Developer NPS', value: 72, unit: '',
      trend: 'up', trendValue: '+4', severity: 'normal',
      sparkline: spark(70, 5), source: 'Quarterly Survey', updatedAt: ts(),
    },
  ],
};

// ── Section 5: GCC Tech Landscape ───────────────────────────────────

const gccTech: KPISection = {
  id: 'tech-gcc',
  title: 'GCC Tech Landscape',
  icon: '🏗️',
  metrics: [
    {
      id: 'gcc-startups', label: 'GCC InsurTech Startups', value: 68, unit: '',
      trend: 'up', trendValue: '+11', severity: 'normal',
      sparkline: spark(62, 6), source: 'MAGNiTT', updatedAt: ts(),
    },
    {
      id: 'digital-adoption', label: 'Digital Insurance Adoption', value: 24.3, unit: '%',
      trend: 'up', trendValue: '+4.8pp', severity: 'normal',
      sparkline: spark(22, 3), description: 'Policies purchased digitally in GCC',
      source: 'McKinsey GCC Insurance', updatedAt: ts(),
    },
    {
      id: 'super-apps', label: 'Super App Integrations', value: 6, unit: '',
      trend: 'up', trendValue: '+2', severity: 'normal',
      sparkline: spark(5, 1), description: 'Insurance embedded in GCC super-apps',
      source: 'Industry Tracking', updatedAt: ts(),
    },
    {
      id: 'cloud-migration', label: 'Cloud Migration %', value: 41, unit: '%',
      trend: 'up', trendValue: '+8pp', severity: 'normal',
      sparkline: spark(38, 5), description: 'GCC insurers with cloud-native core systems',
      source: 'Gartner GCC', updatedAt: ts(),
    },
  ],
};

// ── Export KPI Set ──────────────────────────────────────────────────

export const INSURTECH_KPI_SET: KPISet = {
  id: 'insurtech',
  name: 'InsurTech Intelligence',
  description: 'InsurTech funding, platform performance, AI pipeline, and GCC tech ecosystem',
  sections: [fundingDeals, platformMetrics, aiPipeline, ecosystem, gccTech],
  lastUpdated: Date.now(),
};
