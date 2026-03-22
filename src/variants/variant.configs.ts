/**
 * Variant Configurations — All 6 DEEVO Monitor variants.
 * Each variant defines its own theme, layer set, feed categories, and AI prompt.
 * v4.0: Added Commodity and Happy variants to match worldmonitor's 5 + Fraud (Deevo-specific).
 */
import type { VariantId, VariantConfig } from './variant.types';

// ─── GLOBAL VARIANT ──────────────────────────────────
export const GLOBAL_VARIANT: VariantConfig = {
  id: 'global',
  name: 'DEEVO MONITOR',
  tagline: 'GCC Insurance Risk Intelligence',
  domain: 'monitor.deevo.ai',
  localPort: 5174,
  colors: {
    primary: '#00D4FF',
    secondary: '#0099CC',
    critical: '#FF3B30',
    warning: '#FF9500',
    success: '#34C759',
    bg: '#0A0D14',
    surface: '#111827',
    surfaceHover: '#1C2535',
    border: 'rgba(255,255,255,0.08)',
    text: 'rgba(255,255,255,0.92)',
    textPrimary: 'rgba(255,255,255,0.92)',
    textSecondary: 'rgba(255,255,255,0.55)',
    textMuted: 'rgba(255,255,255,0.30)',
    badge: '#1C2535',
  },
  activeLayers: [
    'claims_heatmap', 'fraud_links', 'conflict_zones',
    'intel_hotspots', 'iran_attacks', 'military_bases',
    'nuclear_sites', 'pipelines',
  ],
  feedCategories: ['global_insurance', 'gcc_regional', 'regulatory', 'weather_cat', 'geopolitical'],
  kpiSet: 'insurance',
  mapViewport: { lat: 25.0, lon: 51.5, zoom: 4.5 },
  aiSystemPrompt: `You are a senior GCC insurance risk analyst. Synthesize news into actionable insurance intelligence for Kuwait, Saudi Arabia, UAE, Qatar, Bahrain, and Oman markets. Focus on: claims trends, fraud signals, regulatory changes, weather CAT events, reinsurance capacity, geopolitical risk. Be concise and data-driven.`,
  logo: { icon: '🛡️', color: '#00D4FF' },
  metaTitle: 'DEEVO Monitor — GCC Insurance Intelligence',
  metaDescription: 'Real-time GCC insurance risk dashboard — AI-powered claims, fraud, and regulatory intelligence',
  showPanels: {
    liveFeed: true, aiInsights: true, riskIndex: true,
    kpiDashboard: true, webcast: false, marketTicker: false,
    liveNews: true, webcams: true, strategicPosture: true, countryIntel: true,
  },
};

// ─── TECH VARIANT ────────────────────────────────────
export const TECH_VARIANT: VariantConfig = {
  id: 'tech',
  name: 'DEEVO TECH',
  tagline: 'InsurTech & Digital Insurance Intelligence',
  domain: 'tech.deevo.ai',
  localPort: 5175,
  colors: {
    primary: '#7C3AED',
    secondary: '#5B21B6',
    critical: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    bg: '#0D0A1A',
    surface: '#130F23',
    surfaceHover: '#1E1740',
    border: 'rgba(124,58,237,0.20)',
    text: 'rgba(255,255,255,0.92)',
    textPrimary: 'rgba(255,255,255,0.92)',
    textSecondary: 'rgba(200,185,255,0.65)',
    textMuted: 'rgba(200,185,255,0.35)',
    badge: '#1E1740',
  },
  activeLayers: [
    'ai_data_centers', 'cyber_threats', 'undersea_cables',
    'claims_heatmap', 'claim_clusters',
  ],
  feedCategories: ['insurtech', 'ai_ml', 'digital_insurance', 'regulatory', 'gcc_regional'],
  kpiSet: 'insurtech',
  mapViewport: { lat: 25.0, lon: 51.5, zoom: 4.5 },
  aiSystemPrompt: `You are a senior InsurTech analyst covering GCC digital insurance transformation. Focus on: AI/ML adoption, digital distribution, embedded insurance, parametric products, API economy, SAMA/CBUAE sandbox approvals, startup funding, mobile-first insurance. Synthesize tech trends into actionable intelligence.`,
  logo: { icon: '⚡', color: '#7C3AED' },
  metaTitle: 'DEEVO Tech — InsurTech Intelligence',
  metaDescription: 'Real-time InsurTech and digital insurance intelligence for GCC markets',
  showPanels: {
    liveFeed: true, aiInsights: true, riskIndex: false,
    kpiDashboard: true, webcast: false, marketTicker: false,
    liveNews: true, webcams: false, strategicPosture: false, countryIntel: false,
  },
};

// ─── FINANCE VARIANT ─────────────────────────────────
export const FINANCE_VARIANT: VariantConfig = {
  id: 'finance',
  name: 'DEEVO FINANCE',
  tagline: 'GCC Insurance Financial Markets',
  domain: 'finance.deevo.ai',
  localPort: 5176,
  colors: {
    primary: '#10B981',
    secondary: '#059669',
    critical: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    bg: '#060D0A',
    surface: '#0D1A12',
    surfaceHover: '#162A1E',
    border: 'rgba(16,185,129,0.18)',
    text: 'rgba(255,255,255,0.92)',
    textPrimary: 'rgba(255,255,255,0.92)',
    textSecondary: 'rgba(167,243,208,0.65)',
    textMuted: 'rgba(167,243,208,0.35)',
    badge: '#162A1E',
  },
  activeLayers: [
    'claims_heatmap', 'pipelines', 'oil_facilities',
    'ports_shipping', 'power_grid',
  ],
  feedCategories: ['financial_markets', 'gcc_regional', 'market_intel', 'regulatory', 'reinsurance'],
  kpiSet: 'financial_markets',
  mapViewport: { lat: 25.0, lon: 51.5, zoom: 4.0 },
  aiSystemPrompt: `You are a senior GCC insurance investment analyst at a sovereign wealth fund level. Focus on: insurance company financials (GIG, BUPA Arabia, Tawuniya, AXA Gulf, Zurich ME), combined ratios, investment yields, IFRS 17 impacts, reinsurance pricing, M&A activity, IPOs. Provide actionable financial intelligence.`,
  logo: { icon: '📈', color: '#10B981' },
  metaTitle: 'DEEVO Finance — GCC Insurance Markets',
  metaDescription: 'Real-time GCC insurance financial intelligence — stocks, combined ratios, reinsurance pricing',
  showPanels: {
    liveFeed: true, aiInsights: true, riskIndex: true,
    kpiDashboard: true, webcast: false, marketTicker: true,
    liveNews: true, webcams: false, strategicPosture: false, countryIntel: true,
  },
};

// ─── FRAUD VARIANT ───────────────────────────────────
export const FRAUD_VARIANT: VariantConfig = {
  id: 'fraud',
  name: 'DEEVO FRAUD',
  tagline: 'Insurance Fraud Intelligence Network',
  domain: 'fraud.deevo.ai',
  localPort: 5177,
  colors: {
    primary: '#FF3B30',
    secondary: '#CC2A20',
    critical: '#FF0000',
    warning: '#FF6B00',
    success: '#34C759',
    bg: '#100808',
    surface: '#1A0E0E',
    surfaceHover: '#2A1515',
    border: 'rgba(255,59,48,0.20)',
    text: 'rgba(255,255,255,0.92)',
    textPrimary: 'rgba(255,255,255,0.92)',
    textSecondary: 'rgba(255,180,180,0.65)',
    textMuted: 'rgba(255,180,180,0.35)',
    badge: '#2A1515',
  },
  activeLayers: [
    'fraud_links', 'staging_areas', 'hospital_network',
    'claims_heatmap', 'repair_shops',
  ],
  feedCategories: ['fraud', 'regulatory', 'gcc_regional', 'law_enforcement'],
  kpiSet: 'fraud_intel',
  mapViewport: { lat: 29.3, lon: 47.7, zoom: 7.0 },
  aiSystemPrompt: `You are a senior insurance fraud analyst with expertise in GCC markets. Focus on: fraud typologies (staged accidents, medical inflation, ghost policies, property arson), FRIN network intelligence, SIU signals, law enforcement actions, fraud ring detection patterns. Provide actionable fraud intelligence with specific risk indicators.`,
  logo: { icon: '🔍', color: '#FF3B30' },
  metaTitle: 'DEEVO Fraud — Insurance Fraud Intelligence',
  metaDescription: 'Real-time insurance fraud intelligence for GCC — staged accidents, medical fraud, SIU signals',
  showPanels: {
    liveFeed: true, aiInsights: true, riskIndex: false,
    kpiDashboard: true, webcast: false, marketTicker: false,
    liveNews: false, webcams: false, strategicPosture: false, countryIntel: false,
  },
};

// ─── COMMODITY VARIANT (NEW v4.0) ────────────────────
export const COMMODITY_VARIANT: VariantConfig = {
  id: 'commodity',
  name: 'DEEVO COMMODITY',
  tagline: 'GCC Commodity & Energy Risk Intelligence',
  domain: 'commodity.deevo.ai',
  localPort: 5178,
  colors: {
    primary: '#FF9500',
    secondary: '#CC7700',
    critical: '#FF3B30',
    warning: '#FFD600',
    success: '#34C759',
    bg: '#0D0A06',
    surface: '#1A1408',
    surfaceHover: '#2A2010',
    border: 'rgba(255,149,0,0.18)',
    text: 'rgba(255,255,255,0.92)',
    textPrimary: 'rgba(255,255,255,0.92)',
    textSecondary: 'rgba(255,220,160,0.65)',
    textMuted: 'rgba(255,220,160,0.35)',
    badge: '#2A2010',
  },
  activeLayers: [
    'pipelines', 'oil_facilities', 'ports_shipping',
    'power_grid', 'conflict_zones', 'iran_attacks',
  ],
  feedCategories: ['financial_markets', 'gcc_regional', 'geopolitical', 'reinsurance'],
  kpiSet: 'commodity',
  mapViewport: { lat: 25.0, lon: 51.5, zoom: 3.5 },
  aiSystemPrompt: `You are a senior commodity analyst focused on GCC energy markets. Focus on: oil price dynamics, natural gas pricing, petrochemical supply chains, OPEC+ decisions, maritime shipping (Strait of Hormuz, Bab el-Mandeb), commodity insurance, energy infrastructure risk, and supply chain disruption. Provide data-driven commodity intelligence.`,
  logo: { icon: '🛢', color: '#FF9500' },
  metaTitle: 'DEEVO Commodity — GCC Energy & Commodity Risk',
  metaDescription: 'Real-time GCC commodity and energy intelligence — oil, gas, shipping, supply chain risk',
  showPanels: {
    liveFeed: true, aiInsights: true, riskIndex: true,
    kpiDashboard: true, webcast: false, marketTicker: true,
    liveNews: true, webcams: false, strategicPosture: true, countryIntel: false,
  },
};

// ─── HAPPY VARIANT (NEW v4.0) ────────────────────────
export const HAPPY_VARIANT: VariantConfig = {
  id: 'happy',
  name: 'DEEVO HAPPY',
  tagline: 'GCC Wellness & Positive Intelligence',
  domain: 'happy.deevo.ai',
  localPort: 5179,
  colors: {
    primary: '#FFD600',
    secondary: '#E5C100',
    critical: '#FF9500',
    warning: '#FF6B35',
    success: '#34C759',
    bg: '#0A0D06',
    surface: '#141A0D',
    surfaceHover: '#1E2A15',
    border: 'rgba(255,214,0,0.15)',
    text: 'rgba(255,255,255,0.92)',
    textPrimary: 'rgba(255,255,255,0.92)',
    textSecondary: 'rgba(255,240,180,0.65)',
    textMuted: 'rgba(255,240,180,0.35)',
    badge: '#1E2A15',
  },
  activeLayers: ['claim_clusters', 'claims_heatmap'],
  feedCategories: ['gcc_regional', 'regulatory'],
  kpiSet: 'wellness',
  mapViewport: { lat: 25.0, lon: 51.5, zoom: 4.5 },
  aiSystemPrompt: `You are a positive intelligence analyst for the GCC region. Focus on: economic growth, development projects, cultural events, tourism milestones, sustainability achievements, healthcare improvements, quality of life indices, and positive insurance industry developments. Highlight opportunities and positive trends.`,
  logo: { icon: '☀️', color: '#FFD600' },
  metaTitle: 'DEEVO Happy — GCC Positive Intelligence',
  metaDescription: 'GCC positive news and wellness intelligence — growth, development, and opportunity tracking',
  showPanels: {
    liveFeed: true, aiInsights: true, riskIndex: false,
    kpiDashboard: true, webcast: false, marketTicker: false,
    liveNews: true, webcams: true, strategicPosture: false, countryIntel: false,
  },
};

export const VARIANTS: Record<VariantId, VariantConfig> = {
  global: GLOBAL_VARIANT,
  tech: TECH_VARIANT,
  finance: FINANCE_VARIANT,
  fraud: FRAUD_VARIANT,
  commodity: COMMODITY_VARIANT,
  happy: HAPPY_VARIANT,
};

export const VARIANT_IDS: VariantId[] = ['global', 'tech', 'finance', 'fraud', 'commodity', 'happy'];
