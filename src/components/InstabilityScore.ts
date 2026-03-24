// ─── DEEVO CORTEX — COUNTRY INSTABILITY SCORE ENGINE ────────────────────────
// Mirrors World Monitor's Country Intelligence Index
// Composite of 6 signal categories → score 0–100

import type { GCCCountry, GeoEvent } from '@/config/gcc-data';

export interface InstabilityScore {
  code: string;
  score: number;        // 0-100
  frisk_level: 1|2|3|4|5;
  label: string;
  breakdown: {
    political: number;
    economic: number;
    security: number;
    energy: number;
    credit: number;
    sentiment: number;
  };
  trend: 'rising' | 'stable' | 'falling';
  last_updated: number;
}

const CREDIT_SCORES: Record<string, number> = {
  'AAA': 2, 'AA+': 5, 'AA': 8, 'AA-': 10,
  'A+': 18, 'A': 22, 'A-': 26,
  'BBB+': 35, 'BBB': 40, 'BBB-': 45,
  'BB+': 52, 'BB': 58, 'BB-': 64,
  'B+': 70, 'B': 76, 'B-': 82,
};

export function calculateInstabilityScore(
  country: GCCCountry,
  activeEvents: GeoEvent[],
  chokepointRisk = 0,
): InstabilityScore {
  // 1. Political: oil revenue dependency (high = vulnerable to oil shock)
  const political = Math.min(100, country.oil_revenue_pct * 0.6 + 10);

  // 2. Economic: GDP growth inverse (low growth = higher instability)
  const economic = Math.max(0, 100 - country.gdp_growth_pct * 12 - 30);

  // 3. Security: events targeting or near country
  const relevantEvents = activeEvents.filter(e => {
    const dist = Math.sqrt(
      Math.pow(e.origin_lat - country.lat, 2) +
      Math.pow(e.origin_lng - country.lng, 2)
    );
    return dist < 20; // within ~2000km
  });
  const security = Math.min(100,
    relevantEvents.reduce((acc, e) => {
      const sev = { CRITICAL: 40, HIGH: 25, MEDIUM: 10, LOW: 3 };
      return acc + (sev[e.severity] || 0);
    }, 0) + chokepointRisk * 15
  );

  // 4. Energy: oil revenue pct as double-edged sword
  const energy = country.oil_revenue_pct > 70
    ? 45  // very exposed to price swings
    : country.oil_revenue_pct > 40
    ? 25
    : 10;

  // 5. Credit rating
  const credit = CREDIT_SCORES[country.credit_rating] ?? 50;

  // 6. Sentiment: sovereign fund as buffer (higher fund = lower risk)
  const fundBuffer = Math.min(50, country.sovereign_fund_usd_billion / 20);
  const sentiment = Math.max(0, 50 - fundBuffer);

  // Weighted composite (mirrors WM's 12-signal index)
  const score = Math.round(
    political * 0.20 +
    economic * 0.15 +
    security * 0.30 +
    energy * 0.15 +
    credit * 0.10 +
    sentiment * 0.10
  );

  const clamped = Math.min(100, Math.max(0, score));

  // Map to FRISK level
  const frisk_level: 1|2|3|4|5 =
    clamped >= 80 ? 5 :
    clamped >= 60 ? 4 :
    clamped >= 40 ? 3 :
    clamped >= 20 ? 2 : 1;

  const labels = { 1:'NOMINAL', 2:'ELEVATED', 3:'GUARDED', 4:'HIGH', 5:'CRITICAL' };

  return {
    code: country.code,
    score: clamped,
    frisk_level,
    label: labels[frisk_level],
    breakdown: {
      political: Math.round(political),
      economic: Math.round(economic),
      security: Math.round(security),
      energy: Math.round(energy),
      credit: Math.round(credit),
      sentiment: Math.round(sentiment),
    },
    trend: security > 30 ? 'rising' : security < 10 ? 'falling' : 'stable',
    last_updated: Date.now(),
  };
}

export function calculateRegionFRISK(
  countries: GCCCountry[],
  events: GeoEvent[],
): { level: 1|2|3|4|5; label: string; scores: InstabilityScore[] } {
  const scores = countries.map(c => calculateInstabilityScore(c, events));
  const maxScore = Math.max(...scores.map(s => s.score));
  const avgScore = scores.reduce((a, s) => a + s.score, 0) / scores.length;
  const composite = Math.round(maxScore * 0.6 + avgScore * 0.4);

  const level: 1|2|3|4|5 =
    composite >= 75 ? 5 :
    composite >= 55 ? 4 :
    composite >= 35 ? 3 :
    composite >= 15 ? 2 : 1;

  const labels = { 1:'NOMINAL', 2:'ELEVATED', 3:'GUARDED', 4:'HIGH', 5:'CRITICAL' };
  return { level, label: labels[level], scores };
}
