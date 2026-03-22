/**
 * Variant System — Type Definitions
 * Deevo Monitor v4.0 runs 6 distinct variants from a single codebase.
 * Matches worldmonitor's 5 variants + fraud (Deevo-specific).
 */

export type VariantId = 'global' | 'tech' | 'finance' | 'fraud' | 'commodity' | 'happy';

export interface VariantColors {
  primary: string;
  secondary: string;
  critical: string;
  warning: string;
  success: string;
  bg: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: string;            // primary text color
  textPrimary: string;     // alias for text
  textSecondary: string;
  textMuted: string;
  badge: string;
}

export interface VariantConfig {
  id: VariantId;
  name: string;
  tagline: string;
  domain: string;
  localPort: number;
  colors: VariantColors;
  activeLayers: string[];
  feedCategories: string[];
  kpiSet: KPISetId;
  mapViewport: { lat: number; lon: number; zoom: number };
  aiSystemPrompt: string;
  logo: { icon: string; color: string };
  metaTitle: string;
  metaDescription: string;
  showPanels: {
    liveFeed: boolean;
    aiInsights: boolean;
    riskIndex: boolean;
    kpiDashboard: boolean;
    webcast: boolean;
    marketTicker: boolean;
    liveNews: boolean;
    webcams: boolean;
    strategicPosture: boolean;
    countryIntel: boolean;
  };
}

export type KPISetId = 'insurance' | 'insurtech' | 'financial_markets' | 'fraud_intel' | 'commodity' | 'wellness';
