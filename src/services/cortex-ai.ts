// ─── DEEVO CORTEX — AI BRIEF SERVICE ─────────────────────────────────────────
// Calls Anthropic API to generate real GCC intelligence briefs
// Uses the FRINContextBundle pattern from seed_frin_context.py

import type { NewsItem } from './news';
import type { Quote } from './market';

export interface CortexCard {
  type: 'FRAUD_ALERT'|'CLAIMS_SURGE'|'REGULATORY'|'ENERGY'|'AVIATION'|'MARKET'|'HEDGE';
  title: string;
  narrative: string;
  action: string;
  risk_caveat: string;
  confidence: 'HIGH'|'MEDIUM'|'LOW';
  country?: string;
  asset?: string;
  magnitude_pct?: number;
}

export interface CortexBrief {
  cards: CortexCard[];
  summary: string;
  frisk_level: 1|2|3|4|5;
  frisk_label: string;
  generated_at: number;
  source: 'api'|'seed';
}

// ─── SEED BRIEF (shown when API unavailable) ──────────────────────────────────
const SEED_BRIEF: CortexBrief = {
  frisk_level: 3,
  frisk_label: 'GUARDED',
  summary: 'GCC risk posture elevated. Oil price risk premium active. Aviation sector strong.',
  generated_at: Date.now(),
  source: 'seed',
  cards: [
    {
      type: 'ENERGY',
      title: 'Hormuz Chokepoint — Marine Risk Premium Active',
      narrative: 'Ongoing IRGC activity near Strait of Hormuz has triggered war risk clauses across 14 GCC marine policies. Brent at $87 reflects a $4-6 geopolitical premium. Qatar LNG shipments face potential 3-day delay window.',
      action: 'Activate marine war risk monitoring for Hormuz-transiting vessels. Review QatarEnergy LNG policy excess layers.',
      risk_caveat: 'De-escalation within 48h would erase premium; avoid over-hedging short duration positions.',
      confidence: 'HIGH',
      country: 'QA',
      asset: 'LNG',
      magnitude_pct: 14.2,
    },
    {
      type: 'CLAIMS_SURGE',
      title: 'Saudi Motor TPL — +18% Claim Velocity Anomaly',
      narrative: 'SAMA circular data shows Q1 2026 motor TPL frequency up 18% QoQ across Riyadh East corridor. Three workshops flagged by FRIN with coordinated billing patterns. FRIN confidence score: 87%.',
      action: 'Deploy DeevoSentinel FieldInspector to top 3 flagged Riyadh workshops. Suspend interim payments pending investigation.',
      risk_caveat: 'Seasonal summer driving increase accounts for 6-8% baseline uplift — net anomaly 10-12%.',
      confidence: 'HIGH',
      country: 'SA',
      magnitude_pct: 18.0,
    },
    {
      type: 'AVIATION',
      title: 'DXB Records 89.4K Daily Movements — Capacity Ceiling',
      narrative: 'Dubai International hit 89.4K daily movements, approaching its 100M PAX annual capacity ceiling. Emirates and flydubai both report 98%+ load factors. Al Maktoum (DWC) cargo operations up 42% YoY as overflow strategy activates.',
      action: 'Monitor DXB for capacity-related delays impacting GCC trade logistics. Aviation hull insurance exposure rises with utilization.',
      risk_caveat: 'Seasonal summer dip in June-August will temporarily relieve pressure.',
      confidence: 'MEDIUM',
      country: 'UAE',
      asset: 'DXB',
    },
    {
      type: 'MARKET',
      title: 'Gold as GCC Geopolitical Hedge — $2,318 Support Level',
      narrative: 'Gold holding $2,300 support level driven by Middle East risk premium and Fed dovish pivot expectations. GCC sovereign funds (ADIA, PIF, KIA) historically increase gold allocation when regional FRISK > 2. Current FRISK 3 supports continued bid.',
      action: 'Monitor gold/oil ratio as leading indicator for GCC insurance reserve adequacy.',
      risk_caveat: 'Strong US economic data could strengthen dollar and suppress gold above $2,350.',
      confidence: 'MEDIUM',
      asset: 'GOLD',
      magnitude_pct: 3.2,
    },
  ],
};

// ─── BUILD CONTEXT BUNDLE FOR LLM ────────────────────────────────────────────
function buildContext(news: NewsItem[], market: { commodities: Quote[]; forex: Quote[]; crypto: Quote[]; indices: Quote[] }): string {
  const lines: string[] = [];

  lines.push('=== GCC MARKET STATE ===');
  market.commodities.slice(0, 4).forEach(q =>
    lines.push(`${q.name}: ${q.price.toFixed(2)} (${q.changePct >= 0 ? '+' : ''}${q.changePct.toFixed(2)}%)`));

  lines.push('\n=== GCC STOCK INDICES ===');
  market.indices.forEach(q =>
    lines.push(`${q.name}: ${q.price.toLocaleString()} (${q.changePct >= 0 ? '+' : ''}${q.changePct.toFixed(2)}%)`));

  lines.push('\n=== LIVE GCC INTELLIGENCE (last 6 hours) ===');
  news.slice(0, 8).forEach(n =>
    lines.push(`[${n.severity}][${n.category}] ${n.title} — ${n.source}`));

  lines.push('\n=== GCC CONTEXT ===');
  lines.push('Region: Kuwait, Saudi Arabia, UAE, Bahrain, Oman, Qatar (combined GDP $2.1T)');
  lines.push('Sectors: Oil & Gas, Banking, Insurance, Fintech, Aviation, Construction');
  lines.push('Key chokepoints: Strait of Hormuz (21% global oil), Bab el-Mandeb (Red Sea)');

  return lines.join('\n');
}

// ─── CALL ANTHROPIC API ───────────────────────────────────────────────────────
export async function generateCortexBrief(
  news: NewsItem[],
  market: { commodities: Quote[]; forex: Quote[]; crypto: Quote[]; indices: Quote[] }
): Promise<CortexBrief> {
  const context = buildContext(news, market);

  const systemPrompt = `You are DEEVO CORTEX — a GCC Economic Intelligence engine for Gulf region decision makers.

Generate EXACTLY 4 intelligence cards based ONLY on the provided real-time data.

CARD TYPES (choose most relevant):
- ENERGY: Oil, gas, LNG, pipeline risk
- CLAIMS_SURGE: Insurance claim velocity anomalies
- FRAUD_ALERT: Coordinated fraud patterns detected
- REGULATORY: GCC regulator actions (SAMA, ISA, ADSIC, CBB, QCB)
- AVIATION: Airport capacity, flight disruption, cargo impact
- MARKET: Stock indices, forex, crypto moves
- HEDGE: Diverging signals requiring caution

OUTPUT: Respond with ONLY a valid JSON array. No markdown, no preamble.
Schema: [{"type":"ENERGY","title":"max 12 words","narrative":"2-3 sentences citing specific data","action":"1 sentence","risk_caveat":"1 sentence","confidence":"HIGH|MEDIUM|LOW","country":"SA|UAE|KW|QA|BH|OM (optional)","asset":"ticker or name (optional)","magnitude_pct":number_optional}]

RULES:
- Cite specific numbers from the data (prices, percentages, country names)
- Lead with highest-conviction card
- If signals diverge, use HEDGE type
- Never invent data not in the context
- country field: use 2-letter code or omit`;

  try {
    const response = await fetch('/api/cortex-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, systemPrompt }),
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();

    if (!data.cards || !Array.isArray(data.cards)) throw new Error('Invalid response');

    // Calculate FRISK level from cards
    const hasCritical = data.cards.some((c: CortexCard) => c.confidence === 'HIGH' && ['ENERGY','FRAUD_ALERT','CLAIMS_SURGE'].includes(c.type));
    const frisk_level = hasCritical ? 4 : data.cards.filter((c: CortexCard) => c.confidence !== 'LOW').length >= 3 ? 3 : 2;

    return {
      cards: data.cards,
      summary: data.summary || 'GCC intelligence brief generated.',
      frisk_level: frisk_level as CortexBrief['frisk_level'],
      frisk_label: ['','NOMINAL','ELEVATED','GUARDED','HIGH','CRITICAL'][frisk_level] || 'GUARDED',
      generated_at: Date.now(),
      source: 'api',
    };
  } catch {
    return { ...SEED_BRIEF, generated_at: Date.now(), source: 'seed' };
  }
}

export { SEED_BRIEF };
