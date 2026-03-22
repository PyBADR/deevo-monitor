/**
 * Variant Configurations — All 4 DEEVO Monitor variants.
 * Each variant defines its own theme, layer set, feed categories, and AI prompt.
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
    'claims_heatmap', 'fraud_zones', 'risk_choropleth',
    'geopolitical_events', 'weather_alerts', 'insurer_offices',
  ],
  feedCategories: ['global_insurance', 'gcc_regional', 'regulatory', 'weather_cat'],
  kpiSet: 'insurance',
  mapViewport: { lat: 25.0, lon: 51.5, zoom: 4.5 },
  aiSystemPrompt: `You are a senior GCC insurance risk analyst. Synthesize news into actionable insurance intelligence for Kuwait, Saudi Arabia, UAE, Qatar, Bahrain, and Oman markets. Focus on: claims trends, fraud signals, regulatory changes, weather CAT events, reinsurance capacity. Be concise and data-driven.`,
  logo: { icon: '🛡️', color: '#00D4FF' },
  metaTitle: 'DEEVO Monitor — GCC Insurance Intelligence',
  metaDescription: 'Real-time GCC insurance risk dashboard — AI-powered claims, fraud, and regulatory intelligence',
  showPanels: {
    liveFeed: true, aiInsights: true, riskIndex: true,
    kpiDashboard: true, webcast: false, marketTicker: false,
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
    'insurer_offices', 'claim_centers', 'hospital_network',
    'risk_choropleth', 'regulatory_alerts',
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
    'risk_choropleth', 'premium_density', 'oil_price_impact',
    'reinsurance_flow', 'sanctions_exposure',
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
    'fraud_zones', 'staging_accidents', 'medical_inflation',
    'claims_heatmap', 'repair_shops', 'hospital_network',
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
  },
};

export const VARIANTS: Record<VariantId, VariantConfig> = {
  global: GLOBAL_VARIANT,
  tech: TECH_VARIANT,
  finance: FINANCE_VARIANT,
  fraud: FRAUD_VARIANT,
};

export const VARIANT_IDS: VariantId[] = ['global', 'tech', 'finance', 'fraud'];
