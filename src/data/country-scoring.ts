/**
 * Deevo Monitor — GCC Country Intelligence Index
 * 12-signal composite risk scoring + insurance-specific signals
 * Inspired by World Monitor's Country Instability Index, adapted for GCC insurance
 */

import type { GCCCountryCode } from './gcc-sources';

// ─── Signal Definitions ──────────────────────────────────────
export interface RiskSignal {
  id: string;
  name: string;
  nameAr: string;
  category: SignalCategory;
  weight: number;         // 0.0 - 1.0
  source: string;
  refreshInterval: number; // seconds
  invertScale: boolean;    // true = higher value = lower risk
}

export type SignalCategory =
  | 'U'  // Unrest / Conflict
  | 'C'  // Claims / Insurance
  | 'S'  // Sanctions / Regulatory
  | 'I'  // Infrastructure / Economic
  | 'E'  // Environmental / Catastrophe
  | 'F'; // Financial / Market

export const RISK_SIGNALS: RiskSignal[] = [
  // ── Unrest / Conflict (U) ──
  { id: 'conflict-events', name: 'Conflict Events', nameAr: 'أحداث النزاع', category: 'U', weight: 0.90, source: 'ACLED', refreshInterval: 3600, invertScale: false },
  { id: 'protest-index', name: 'Protest Index', nameAr: 'مؤشر الاحتجاجات', category: 'U', weight: 0.75, source: 'ACLED', refreshInterval: 3600, invertScale: false },
  { id: 'terrorism-risk', name: 'Terrorism Risk', nameAr: 'مخاطر الإرهاب', category: 'U', weight: 0.95, source: 'GTI', refreshInterval: 86400, invertScale: false },
  { id: 'military-escalation', name: 'Military Escalation', nameAr: 'التصعيد العسكري', category: 'U', weight: 0.88, source: 'SIPRI', refreshInterval: 86400, invertScale: false },

  // ── Claims / Insurance (C) ──
  { id: 'claims-frequency', name: 'Claims Frequency', nameAr: 'تكرار المطالبات', category: 'C', weight: 0.85, source: 'Cortex', refreshInterval: 300, invertScale: false },
  { id: 'loss-ratio', name: 'Loss Ratio', nameAr: 'نسبة الخسارة', category: 'C', weight: 0.92, source: 'Cortex', refreshInterval: 3600, invertScale: false },
  { id: 'fraud-rate', name: 'Fraud Detection Rate', nameAr: 'معدل كشف الاحتيال', category: 'C', weight: 0.80, source: 'Cortex', refreshInterval: 300, invertScale: false },
  { id: 'catastrophe-exposure', name: 'Cat Exposure (PML)', nameAr: 'التعرض للكوارث', category: 'C', weight: 0.88, source: 'Cortex', refreshInterval: 3600, invertScale: false },

  // ── Sanctions / Regulatory (S) ──
  { id: 'sanctions-proximity', name: 'Sanctions Proximity', nameAr: 'قرب العقوبات', category: 'S', weight: 0.70, source: 'OFAC/EU', refreshInterval: 86400, invertScale: false },
  { id: 'regulatory-change', name: 'Regulatory Change Velocity', nameAr: 'سرعة التغيير التنظيمي', category: 'S', weight: 0.65, source: 'RegScan', refreshInterval: 86400, invertScale: false },
  { id: 'aml-cft-score', name: 'AML/CFT Score', nameAr: 'درجة مكافحة غسل الأموال', category: 'S', weight: 0.72, source: 'FATF', refreshInterval: 86400, invertScale: true },
  { id: 'pdpl-compliance', name: 'PDPL Compliance', nameAr: 'امتثال حماية البيانات', category: 'S', weight: 0.60, source: 'Cortex', refreshInterval: 86400, invertScale: true },

  // ── Infrastructure / Economic (I) ──
  { id: 'oil-price-impact', name: 'Oil Price Impact', nameAr: 'تأثير سعر النفط', category: 'I', weight: 0.82, source: 'Bloomberg', refreshInterval: 300, invertScale: false },
  { id: 'gdp-growth', name: 'GDP Growth', nameAr: 'نمو الناتج المحلي', category: 'I', weight: 0.55, source: 'IMF/WB', refreshInterval: 86400, invertScale: true },
  { id: 'construction-activity', name: 'Construction Activity', nameAr: 'نشاط البناء', category: 'I', weight: 0.60, source: 'MEED', refreshInterval: 86400, invertScale: false },
  { id: 'supply-chain-stress', name: 'Supply Chain Stress', nameAr: 'إجهاد سلسلة الإمداد', category: 'I', weight: 0.68, source: 'AIS/Ports', refreshInterval: 3600, invertScale: false },

  // ── Environmental / Catastrophe (E) ──
  { id: 'heat-stress', name: 'Heat Stress Index', nameAr: 'مؤشر الإجهاد الحراري', category: 'E', weight: 0.70, source: 'Weather', refreshInterval: 3600, invertScale: false },
  { id: 'flood-risk', name: 'Flash Flood Risk', nameAr: 'مخاطر السيول', category: 'E', weight: 0.78, source: 'GDACS', refreshInterval: 3600, invertScale: false },
  { id: 'sandstorm-severity', name: 'Sandstorm Severity', nameAr: 'شدة العواصف الرملية', category: 'E', weight: 0.65, source: 'Dust/AOD', refreshInterval: 3600, invertScale: false },
  { id: 'seismic-activity', name: 'Seismic Activity', nameAr: 'النشاط الزلزالي', category: 'E', weight: 0.72, source: 'USGS', refreshInterval: 300, invertScale: false },

  // ── Financial / Market (F) ──
  { id: 'stock-volatility', name: 'Stock Market Volatility', nameAr: 'تقلب سوق الأسهم', category: 'F', weight: 0.60, source: 'Exchange', refreshInterval: 300, invertScale: false },
  { id: 'currency-pressure', name: 'Currency Pressure', nameAr: 'ضغط العملة', category: 'F', weight: 0.55, source: 'FX', refreshInterval: 300, invertScale: false },
  { id: 'cds-spread', name: 'CDS Spread', nameAr: 'فارق مقايضة التخلف', category: 'F', weight: 0.75, source: 'Bloomberg', refreshInterval: 3600, invertScale: false },
  { id: 'insurance-penetration', name: 'Insurance Penetration', nameAr: 'اختراق التأمين', category: 'F', weight: 0.50, source: 'Swiss Re', refreshInterval: 86400, invertScale: true },
];

// ─── Country Risk Profiles ───────────────────────────────────
export interface CountryRiskProfile {
  country: GCCCountryCode;
  compositeScore: number;    // 0-100 (higher = more risk)
  trend: 'rising' | 'stable' | 'falling';
  trendDelta: number;        // change in last 7 days
  signals: Record<SignalCategory, number>; // U/C/S/I/E/F sub-scores
  insuranceSpecific: {
    grossWrittenPremium: string;
    marketSize: string;
    topPerils: string[];
    regulatoryHeat: 'low' | 'medium' | 'high' | 'critical';
    ifrs17Status: 'compliant' | 'transitioning' | 'pending';
  };
  lastUpdated: string;
}

// Baseline risk profiles (updated in real-time by scoring engine)
export const BASELINE_RISK_PROFILES: CountryRiskProfile[] = [
  {
    country: 'SA',
    compositeScore: 32,
    trend: 'stable',
    trendDelta: -1.2,
    signals: { U: 15, C: 35, S: 20, I: 45, E: 40, F: 28 },
    insuranceSpecific: {
      grossWrittenPremium: 'SAR 52.3B',
      marketSize: 'Largest in GCC',
      topPerils: ['Motor', 'Medical', 'Property', 'Engineering'],
      regulatoryHeat: 'high',
      ifrs17Status: 'compliant',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    country: 'AE',
    compositeScore: 28,
    trend: 'stable',
    trendDelta: -0.5,
    signals: { U: 10, C: 30, S: 15, I: 40, E: 35, F: 25 },
    insuranceSpecific: {
      grossWrittenPremium: 'AED 55.8B',
      marketSize: '2nd in GCC',
      topPerils: ['Motor', 'Property', 'Marine', 'Engineering'],
      regulatoryHeat: 'high',
      ifrs17Status: 'compliant',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    country: 'QA',
    compositeScore: 22,
    trend: 'falling',
    trendDelta: -2.1,
    signals: { U: 8, C: 25, S: 12, I: 35, E: 20, F: 18 },
    insuranceSpecific: {
      grossWrittenPremium: 'QAR 12.5B',
      marketSize: '4th in GCC',
      topPerils: ['Energy', 'Property', 'Marine', 'Motor'],
      regulatoryHeat: 'medium',
      ifrs17Status: 'transitioning',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    country: 'KW',
    compositeScore: 30,
    trend: 'stable',
    trendDelta: 0.3,
    signals: { U: 12, C: 32, S: 18, I: 42, E: 30, F: 22 },
    insuranceSpecific: {
      grossWrittenPremium: 'KWD 580M',
      marketSize: '3rd in GCC',
      topPerils: ['Motor', 'Marine', 'Property', 'Life'],
      regulatoryHeat: 'medium',
      ifrs17Status: 'transitioning',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    country: 'BH',
    compositeScore: 35,
    trend: 'rising',
    trendDelta: 1.8,
    signals: { U: 20, C: 38, S: 25, I: 45, E: 25, F: 32 },
    insuranceSpecific: {
      grossWrittenPremium: 'BHD 310M',
      marketSize: '5th in GCC',
      topPerils: ['Motor', 'Medical', 'Property', 'Marine'],
      regulatoryHeat: 'medium',
      ifrs17Status: 'compliant',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    country: 'OM',
    compositeScore: 33,
    trend: 'stable',
    trendDelta: 0.1,
    signals: { U: 10, C: 36, S: 22, I: 48, E: 35, F: 30 },
    insuranceSpecific: {
      grossWrittenPremium: 'OMR 520M',
      marketSize: '6th in GCC',
      topPerils: ['Motor', 'Property', 'Engineering', 'Marine'],
      regulatoryHeat: 'low',
      ifrs17Status: 'pending',
    },
    lastUpdated: new Date().toISOString(),
  },
];

// ─── Scoring Engine ──────────────────────────────────────────
export function computeCompositeScore(signals: Record<string, number>): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const signal of RISK_SIGNALS) {
    const raw = signals[signal.id] ?? 0;
    const normalized = signal.invertScale ? (100 - raw) : raw;
    weightedSum += normalized * signal.weight;
    totalWeight += signal.weight;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

export function getSignalCategorySummary(signals: Record<string, number>): Record<SignalCategory, number> {
  const categories: SignalCategory[] = ['U', 'C', 'S', 'I', 'E', 'F'];
  const result: Record<string, number> = {};

  for (const cat of categories) {
    const catSignals = RISK_SIGNALS.filter(s => s.category === cat);
    let totalWeight = 0;
    let weightedSum = 0;

    for (const signal of catSignals) {
      const raw = signals[signal.id] ?? 0;
      const normalized = signal.invertScale ? (100 - raw) : raw;
      weightedSum += normalized * signal.weight;
      totalWeight += signal.weight;
    }

    result[cat] = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }

  return result as Record<SignalCategory, number>;
}

export function getRiskLevel(score: number): { level: string; color: string; label: string; labelAr: string } {
  if (score >= 80) return { level: 'CRIT', color: '#ff0000', label: 'Critical', labelAr: 'حرج' };
  if (score >= 60) return { level: 'HIGH', color: '#ff6600', label: 'High', labelAr: 'مرتفع' };
  if (score >= 40) return { level: 'ELEV', color: '#ffaa00', label: 'Elevated', labelAr: 'مرتفع نسبياً' };
  if (score >= 20) return { level: 'NORM', color: '#00cc66', label: 'Normal', labelAr: 'طبيعي' };
  return { level: 'LOW', color: '#0088ff', label: 'Low', labelAr: 'منخفض' };
}

// ─── Strategic Posture Assessment ────────────────────────────
export interface StrategicPosture {
  theater: string;
  theaterAr: string;
  level: 'CRIT' | 'HIGH' | 'ELEV' | 'NORM' | 'LOW';
  factors: string[];
}

export const GCC_THEATERS: StrategicPosture[] = [
  {
    theater: 'Iran Theater',
    theaterAr: 'المسرح الإيراني',
    level: 'HIGH',
    factors: ['Strait of Hormuz tensions', 'Nuclear negotiations', 'Proxy activity in Yemen/Iraq'],
  },
  {
    theater: 'Yemen / Red Sea',
    theaterAr: 'اليمن / البحر الأحمر',
    level: 'ELEV',
    factors: ['Houthi maritime threats', 'Shipping insurance premiums', 'Red Sea route disruption'],
  },
  {
    theater: 'Arabian Gulf',
    theaterAr: 'الخليج العربي',
    level: 'NORM',
    factors: ['Naval presence stable', 'Oil infrastructure secure', 'Cyber threat elevated'],
  },
  {
    theater: 'Horn of Africa',
    theaterAr: 'القرن الأفريقي',
    level: 'ELEV',
    factors: ['Somalia instability', 'GCC investment exposure', 'Piracy risk'],
  },
  {
    theater: 'Levant / Iraq',
    theaterAr: 'المشرق / العراق',
    level: 'NORM',
    factors: ['Reconstruction phase', 'Diplomatic normalization', 'Refugee camp insurance'],
  },
];
