/**
 * DEEVO Intelligence Monitor v3 — Variant Configuration
 * Contract 3 / File 4 of 4
 * Layer: UI (L6) + APIs (L5) — 4 DEEVO product variants
 *
 * Each variant defines:
 *   - Domain + branding
 *   - Panel assignments (which components render)
 *   - Feed subscriptions
 *   - Correlation rule scope
 *   - Feature flags
 *
 * Trade-off: Static config vs DB-driven feature flags.
 *            Static chosen for v3 offline-first. Feature flag
 *            service can override at runtime in C4.
 */

import type { DeevoVariant, SignalCategory } from '../types/signals';

// ── Panel Identifiers ────────────────────────────────────
export type PanelId =
  | 'GCCMapIntelligence'
  | 'ForceGraphView'
  | 'TimelineView'
  | 'DecisionEnginePanel'
  | 'ArchitectureView'
  | 'KPIDashboard'
  | 'ForexGoldPanel'
  | 'NewsFeedPanel'
  | 'SanctionsWatch'
  | 'ThermalEscalation'
  | 'SupplyChainChokepoints'
  | 'DisplacementPanel'
  | 'ClimateAnomalies'
  | 'NetworkAnalysis'
  | 'FieldInspectionScheduler'
  | 'FraudHeatmap'
  | 'ClaimsLeakage'
  | 'SIUCaseManager'
  | 'BiometricVerification'
  | 'VoiceAnalytics'
  | 'IFRSReporting'
  | 'ReinsuranceTower'
  | 'CatModeling'
  | 'PortfolioOptimizer'
  | 'AIModelRegistry'
  | 'DataPipelineMonitor'
  | 'CyberThreatMap'
  | 'APIHealthDashboard'
  | 'WebcamPanel'
  | 'AIStrategicPosture'
  | 'MilitaryTracker'
  | 'WorldNewsPanel'
  | 'RSSFeedManager';

// ── Variant Configuration ────────────────────────────────
export interface VariantConfig {
  /** Variant identifier */
  id: DeevoVariant;
  /** Display name */
  name: string;
  /** Arabic name */
  nameAr: string;
  /** Domain (for hostname detection) */
  domain: string;
  /** Tagline */
  tagline: string;
  /** Primary accent color */
  accentColor: string;
  /** Panels assigned to this variant */
  panels: readonly PanelId[];
  /** Signal categories this variant monitors */
  signalScope: readonly SignalCategory[];
  /** Feature flags */
  features: {
    forceGraph: boolean;
    timeline: boolean;
    decisionEngine: boolean;
    architectureView: boolean;
    ollamaReasoning: boolean;
    arabicRTL: boolean;
    liveWebcams: boolean;
    militaryTracker: boolean;
  };
}

// ── 4 DEEVO Variants ─────────────────────────────────────
export const VARIANT_CONFIGS: Record<DeevoVariant, VariantConfig> = {
  global: {
    id: 'global',
    name: 'DEEVO Intelligence Monitor',
    nameAr: 'ديفو مراقب الاستخبارات',
    domain: 'deevo.ai',
    tagline: 'GCC Insurance Decision Intelligence',
    accentColor: '#f5a623', // Gulf Amber
    panels: [
      'GCCMapIntelligence', 'ForceGraphView', 'TimelineView',
      'DecisionEnginePanel', 'ArchitectureView', 'KPIDashboard',
      'ForexGoldPanel', 'NewsFeedPanel', 'SanctionsWatch',
      'ThermalEscalation', 'SupplyChainChokepoints', 'DisplacementPanel',
      'ClimateAnomalies', 'NetworkAnalysis', 'WebcamPanel',
      'AIStrategicPosture', 'MilitaryTracker', 'WorldNewsPanel',
      'RSSFeedManager',
    ],
    signalScope: [
      'geopolitical', 'regulatory', 'fraud', 'claims', 'weather',
      'cyber', 'market', 'marine', 'energy', 'sanctions', 'labor',
      'climate', 'military', 'health', 'infrastructure',
    ],
    features: {
      forceGraph: true,
      timeline: true,
      decisionEngine: true,
      architectureView: true,
      ollamaReasoning: true,
      arabicRTL: true,
      liveWebcams: true,
      militaryTracker: true,
    },
  },

  fraud: {
    id: 'fraud',
    name: 'DEEVO Fraud Intelligence',
    nameAr: 'ديفو استخبارات الاحتيال',
    domain: 'fraud.deevo.ai',
    tagline: 'AI-Powered Fraud Detection & Prevention',
    accentColor: '#ef4444', // Fraud Red
    panels: [
      'GCCMapIntelligence', 'FraudHeatmap', 'ClaimsLeakage',
      'SIUCaseManager', 'BiometricVerification', 'VoiceAnalytics',
      'NetworkAnalysis', 'FieldInspectionScheduler', 'KPIDashboard',
      'DecisionEnginePanel', 'NewsFeedPanel', 'TimelineView',
    ],
    signalScope: [
      'fraud', 'claims', 'sanctions', 'cyber', 'labor',
    ],
    features: {
      forceGraph: true,
      timeline: true,
      decisionEngine: true,
      architectureView: false,
      ollamaReasoning: true,
      arabicRTL: true,
      liveWebcams: false,
      militaryTracker: false,
    },
  },

  finance: {
    id: 'finance',
    name: 'DEEVO Finance Intelligence',
    nameAr: 'ديفو استخبارات المالية',
    domain: 'finance.deevo.ai',
    tagline: 'Insurance Financial Intelligence & IFRS 17',
    accentColor: '#3b82f6', // Finance Blue
    panels: [
      'GCCMapIntelligence', 'ForexGoldPanel', 'IFRSReporting',
      'ReinsuranceTower', 'CatModeling', 'PortfolioOptimizer',
      'KPIDashboard', 'TimelineView', 'DecisionEnginePanel',
      'NewsFeedPanel', 'ForceGraphView',
    ],
    signalScope: [
      'market', 'regulatory', 'energy', 'climate', 'sanctions',
      'geopolitical', 'infrastructure',
    ],
    features: {
      forceGraph: true,
      timeline: true,
      decisionEngine: true,
      architectureView: false,
      ollamaReasoning: true,
      arabicRTL: true,
      liveWebcams: false,
      militaryTracker: false,
    },
  },

  tech: {
    id: 'tech',
    name: 'DEEVO Tech Intelligence',
    nameAr: 'ديفو استخبارات التقنية',
    domain: 'tech.deevo.ai',
    tagline: 'AI/ML Operations & Platform Health',
    accentColor: '#8b5cf6', // Tech Purple
    panels: [
      'AIModelRegistry', 'DataPipelineMonitor', 'CyberThreatMap',
      'APIHealthDashboard', 'ArchitectureView', 'KPIDashboard',
      'DecisionEnginePanel', 'NewsFeedPanel', 'TimelineView',
    ],
    signalScope: [
      'cyber', 'infrastructure', 'market', 'geopolitical',
    ],
    features: {
      forceGraph: false,
      timeline: true,
      decisionEngine: true,
      architectureView: true,
      ollamaReasoning: true,
      arabicRTL: true,
      liveWebcams: false,
      militaryTracker: false,
    },
  },
};

// ── Variant Detection ────────────────────────────────────
/** Detect variant from hostname */
export const detectVariant = (hostname: string): DeevoVariant => {
  const variants = Object.values(VARIANT_CONFIGS);
  const match = variants.find((v) => hostname.includes(v.domain));
  return match?.id ?? 'global';
};

/** Get variant config by ID */
export const getVariantConfig = (variant: DeevoVariant): VariantConfig =>
  VARIANT_CONFIGS[variant];

/** Check if a panel is enabled for a variant */
export const isPanelEnabled = (variant: DeevoVariant, panel: PanelId): boolean =>
  VARIANT_CONFIGS[variant].panels.includes(panel);

/** Check if a feature is enabled for a variant */
export const isFeatureEnabled = (
  variant: DeevoVariant,
  feature: keyof VariantConfig['features'],
): boolean => VARIANT_CONFIGS[variant].features[feature];
