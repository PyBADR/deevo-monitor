'use client';
// ─── DEEVO CORTEX — AI FORECASTS PANEL ───────────────────────────────────────
// 12-card structured intelligence feed — mirrors World Monitor's AI Forecasts
// Uses the seeder pattern: pre-built context bundle → Anthropic → structured cards

import React, { useState, useEffect } from 'react';
import type { NewsItem } from '@/services/news';
import type { Quote } from '@/services/market';

const BG = '#040a06';
const BG2 = '#070e09';
const BG3 = '#0b1610';
const BORDER = '#132018';
const GREEN = '#10b981';
const AMBER = '#f59e0b';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const TEXT = '#9dc4a6';
const TEXT_DIM = '#3a5c42';
const TEXT_BRIGHT = '#d4f0d8';

const TYPE_COLORS: Record<string, string> = {
  ENERGY: RED, FRAUD_ALERT: '#f97316', CLAIMS_SURGE: AMBER,
  REGULATORY: BLUE, AVIATION: '#06b6d4', MARKET: GREEN, HEDGE: '#a855f7',
};

const FILTER_TABS = ['All', 'Conflict', 'Market', 'Supply Chain', 'Political', 'Military', 'Cyber', 'Infra'] as const;

export interface ForecastCard {
  type: string;
  title: string;
  narrative: string;
  action: string;
  risk_caveat: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  country?: string;
  asset?: string;
  magnitude_pct?: number;
  impact_24h?: number;
  impact_7d?: number;
  impact_30d?: number;
  direction?: 'UP' | 'DOWN' | 'VOLATILE';
  category?: string;
}

// ─── SEED FORECASTS (12 cards — mirrors WM's count) ──────────────────────────
const SEED_FORECASTS: ForecastCard[] = [
  { type:'ENERGY', title:'Hormuz disruption risk — Brent premium elevated', narrative:'IRGC naval activity near Strait of Hormuz pushing Brent to $87+. Risk premium of $4-6/bbl now priced in. Qatar LNG northward routing adds 3-day lag.', action:'Monitor chokepoint daily. Review marine war risk excess layers for GCC clients.', risk_caveat:'De-escalation within 48h would collapse premium rapidly.', confidence:'HIGH', asset:'BRENT', magnitude_pct:8.4, impact_24h:95, impact_7d:72, impact_30d:48, direction:'UP', category:'Conflict' },
  { type:'MARKET', title:'Saudi TASI recovery — Vision 2030 catalysts intact', narrative:'TASI up 0.84% on strong Q1 earnings from Al Rajhi and STC. Non-oil GDP component growing at 4.2% — SAMA confirming macro stability.', action:'TASI sector rotation opportunity: overweight banking, underweight energy.', risk_caveat:'Oil price volatility remains the primary macro risk for Saudi equity premium.', confidence:'MEDIUM', asset:'TASI', magnitude_pct:1.8, impact_7d:68, direction:'UP', category:'Market' },
  { type:'FRAUD_ALERT', title:'UAE medical fraud cluster — 3 clinic network', narrative:'DEEVO FRIN detected coordinated billing from 3 Abu Dhabi clinics. 94 claims, identical procedure codes, FRIN confidence 91%. Estimated exposure AED 2.8M.', action:'Flag top 3 providers for SIU investigation. Suspend interim payments pending audit.', risk_caveat:'Seasonal demand variations could explain partial frequency uplift.', confidence:'HIGH', country:'UAE', direction:'UP', category:'Conflict' },
  { type:'CLAIMS_SURGE', title:'Kuwait motor TPL +18% QoQ — frequency anomaly', narrative:'Q1 2026 Kuwait motor TPL frequency up 18% quarter-on-quarter. ISA data confirms 3 corridor hotspots. FRIN flags coordinated workshop billing in Salmiya district.', action:'Deploy field inspection units to top-5 flagged workshops. Review pricing adequacy.', risk_caveat:'Road infrastructure works in Salmiya may explain partial frequency lift.', confidence:'HIGH', country:'KW', magnitude_pct:18.0, impact_7d:82, direction:'UP', category:'Conflict' },
  { type:'AVIATION', title:'DXB approaching 100M PAX capacity ceiling', narrative:'Dubai International tracking toward 100M PAX annual capacity limit. Current utilization 89%. Overflow to DWC Al Maktoum cargo up 42% YoY as Phase 1 strategy activates.', action:'Model DXB capacity risk in aviation hull portfolio. Monitor DWC expansion timeline.', risk_caveat:'Summer seasonal dip June-August will provide temporary headroom.', confidence:'MEDIUM', country:'UAE', category:'Supply Chain' },
  { type:'REGULATORY', title:'SAMA motor circular — 23 insurer compliance deadline', narrative:'Saudi SAMA issued circular requiring updated motor pricing models by Q2 2026. 23 insurers affected. Non-compliance triggers license review. Tawuniya and Bupa Arabia most exposed.', action:'Verify Tawuniya compliance timeline in DEEVO pipeline. Update PAA assumptions.', risk_caveat:'SAMA typically extends deadlines by 30-60 days upon request.', confidence:'HIGH', country:'SA', category:'Political' },
  { type:'HEDGE', title:'Red Sea disruption vs GCC aviation — diverging signals', narrative:'Red Sea Houthi attacks pushing shipping costs +400% while GCC airports hit record traffic. Insurance marine exposure is rising as aviation remains strong — diverging sector risk.', action:'Maintain long aviation, hedge marine book. Cross-reference composite exposure quarterly.', risk_caveat:'Escalation to air threat would rapidly shift aviation from beneficiary to risk.', confidence:'MEDIUM', category:'Conflict' },
  { type:'ENERGY', title:'QatarEnergy LNG expansion — North Field Phase 2 online', narrative:'QatarEnergy confirms North Field Expansion Phase 2 is on track for Q3 2026. Production capacity increase to 126 MTPA. EU buyers signing long-term contracts as Russian gas diversification accelerates.', action:'Model LNG price impact on Qatar sovereign fund assets and insurance market.', risk_caveat:'China demand slowdown could suppress LNG spot premium despite supply growth.', confidence:'MEDIUM', country:'QA', asset:'LNG', direction:'UP', impact_7d:62, category:'Supply Chain' },
  { type:'MARKET', title:'Bitcoin risk-off pressure from geopolitical escalation', narrative:'BTC down 2.14% on Hormuz risk headlines. Institutional desks rotating to gold and USD during Middle East tension spikes. On-chain data shows exchange inflows — distribution signal.', action:'Reduce crypto portfolio beta during high FRISK periods (FRISK ≥ 3).', risk_caveat:'Fed dovish pivot expectations offset geopolitical selling pressure partially.', confidence:'MEDIUM', asset:'BTC', magnitude_pct:-4.8, direction:'DOWN', category:'Market' },
  { type:'REGULATORY', title:'Bahrain CBB fintech sandbox — 18 new approvals', narrative:'CBB approved 18 new fintech entities in Q1 2026 sandbox. Rain (crypto), Tarabut Gateway (open banking), and 16 others. GCC fintech AUM growing 38% YoY from Bahrain hub.', action:'Update Bahrain risk model — fintech sector growth supports economic diversification score.', risk_caveat:'Regulatory sandbox graduation rate remains below 30% — survival risk for most.', confidence:'LOW', country:'BH', category:'Political' },
  { type:'CLAIMS_SURGE', title:'Oman property CAT exposure — cyclone season alert', narrative:'Oman Met issues early alert for cyclone development in Arabian Sea. Historical data: Oman property claims spike 340% in cyclone years. CAT reinsurance layers may be triggered.', action:'Activate CAT watchlist for Oman coastal property book. Review retention vs ceded.', risk_caveat:'Cyclone dissipation before landfall is historically most likely outcome.', confidence:'MEDIUM', country:'OM', direction:'UP', category:'Conflict' },
  { type:'MARKET', title:'Gold $2,318 — GCC sovereign fund buying confirmed', narrative:'Gold holding above $2,300 with sovereign fund buying confirmed. ADIA, PIF, and KIA historically increase gold allocation when regional FRISK > 2. Current FRISK 3 supports bid.', action:'Model gold/oil correlation for GCC insurance reserve adequacy assessment.', risk_caveat:'Strong US economic data could strengthen dollar and cap gold above $2,350.', confidence:'MEDIUM', asset:'GOLD', magnitude_pct:3.2, direction:'UP', category:'Market' },
];

interface AIForecastsProps {
  news: NewsItem[];
  market: { commodities: Quote[]; forex: Quote[]; crypto: Quote[]; indices: Quote[] };
  compact?: boolean;
}

export default function AIForecasts({ news, market, compact = false }: AIForecastsProps) {
  const [cards, setCards] = useState<ForecastCard[]>(SEED_FORECASTS);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [activeFilter, setActiveFilter] = useState<typeof FILTER_TABS[number]>('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [source, setSource] = useState<'seed' | 'live'>('seed');
  const [lastGen, setLastGen] = useState<Date | null>(null);

  const STEPS = [
    'Ingesting GCC market data...', 'Processing live news signals...',
    'Building intelligence bundle...', 'Running FRIN analysis...',
    'Generating forecast cards...', 'Validating signal integrity...',
  ];

  async function runForecasts() {
    setLoading(true); setStep(1);
    const iv = setInterval(() => setStep(s => Math.min(s + 1, 6)), 900);
    try {
      const res = await fetch('/api/cortex-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: buildContext(),
          systemPrompt: FORECASTS_PROMPT,
          count: 12,
        }),
      });
      const data = await res.json();
      if (data.cards && data.cards.length > 0) {
        setCards(data.cards);
        setSource('live');
        setLastGen(new Date());
      }
    } catch { /* keep seed */ }
    clearInterval(iv);
    setStep(0); setLoading(false);
  }

  function buildContext(): string {
    const lines: string[] = [];
    lines.push('=== LIVE MARKET ===');
    market.commodities.forEach(q => lines.push(`${(q as {name:string}).name}: ${q.price.toFixed(2)} (${(q as {changePct:number}).changePct >= 0 ? '+' : ''}${(q as {changePct:number}).changePct?.toFixed(2) ?? q.change}%)`));
    lines.push('\n=== GCC NEWS (last 6h) ===');
    news.slice(0, 8).forEach(n => lines.push(`[${n.severity}] ${n.title} — ${n.source}`));
    return lines.join('\n');
  }

  const FORECASTS_PROMPT = `You are DEEVO CORTEX — GCC Economic Intelligence for Gulf region insurance and finance.
Generate exactly 12 intelligence forecast cards based ONLY on the provided live data.
Distribute card types across: ENERGY, MARKET, FRAUD_ALERT, CLAIMS_SURGE, REGULATORY, AVIATION, HEDGE
Each card must include: type, title (max 10 words), narrative (2-3 sentences with specific data), action (1 sentence), risk_caveat (1 sentence), confidence (HIGH/MEDIUM/LOW), optional: country (2-letter GCC code), asset, magnitude_pct, direction (UP/DOWN/VOLATILE), category (one of: Conflict/Market/Supply Chain/Political/Military/Cyber/Infra).
Respond with ONLY a valid JSON array. No markdown. No preamble.`;

  const filtered = activeFilter === 'All' ? cards : cards.filter(c => c.category === activeFilter);

  const confColor = { HIGH: GREEN, MEDIUM: AMBER, LOW: TEXT_DIM };
  const dirSymbol = { UP: '▲', DOWN: '▼', VOLATILE: '◈' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: BG2 }}>
      {/* Header */}
      <div style={{ padding: '6px 12px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: source === 'live' ? GREEN : AMBER, animation: 'pulse 2s infinite' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: TEXT_DIM, letterSpacing: 2 }}>AI FORECASTS</span>
        <span style={{ fontFamily: 'monospace', fontSize: 8, background: `${source === 'live' ? GREEN : AMBER}20`, color: source === 'live' ? GREEN : AMBER, padding: '1px 5px', borderRadius: 2 }}>
          {cards.length}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 8, background: `${source === 'live' ? GREEN : AMBER}15`, color: source === 'live' ? GREEN : AMBER, padding: '1px 5px', borderRadius: 2 }}>
          {source.toUpperCase()}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {lastGen && <span style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM }}>{lastGen.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>}
          <button onClick={runForecasts} disabled={loading}
            style={{ background: loading ? 'transparent' : `${GREEN}15`, border: `1px solid ${loading ? BORDER : GREEN}40`, borderRadius: 2, padding: '2px 7px', fontFamily: 'monospace', fontSize: 8, color: loading ? TEXT_DIM : GREEN, cursor: loading ? 'default' : 'pointer' }}>
            {loading ? '⟳' : '↻'} GENERATE
          </button>
        </div>
      </div>

      {/* Loading bar */}
      {loading && (
        <div style={{ padding: '6px 12px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ height: 2, background: BG3, borderRadius: 1, marginBottom: 5 }}>
            <div style={{ width: `${(step / 6) * 100}%`, height: '100%', background: GREEN, borderRadius: 1, transition: 'width 0.5s' }} />
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: GREEN }}>{STEPS[step - 1] || 'Initializing...'}</div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 2, padding: '4px 8px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, overflowX: 'auto' }}>
        {FILTER_TABS.map(f => (
          <div key={f} onClick={() => setActiveFilter(f)}
            style={{ padding: '3px 8px', borderRadius: 2, border: `1px solid ${activeFilter === f ? BLUE : BORDER}`, background: activeFilter === f ? `${BLUE}15` : 'transparent', fontFamily: 'monospace', fontSize: 8, color: activeFilter === f ? BLUE : TEXT_DIM, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {f}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {filtered.map((card, i) => (
          <div key={i}
            onClick={() => setExpanded(expanded === String(i) ? null : String(i))}
            style={{ background: BG3, border: `1px solid ${(TYPE_COLORS[card.type] || BORDER)}25`, borderLeft: `2px solid ${TYPE_COLORS[card.type] || BORDER}`, borderRadius: 3, padding: '7px 9px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: TYPE_COLORS[card.type] || TEXT_DIM, background: `${TYPE_COLORS[card.type] || BORDER}15`, padding: '1px 5px', borderRadius: 2 }}>{card.type}</span>
              {card.direction && <span style={{ fontFamily: 'monospace', fontSize: 8, color: card.direction === 'UP' ? GREEN : card.direction === 'DOWN' ? RED : AMBER }}>{dirSymbol[card.direction]}{card.magnitude_pct ? ` ${Math.abs(card.magnitude_pct).toFixed(1)}%` : ''}</span>}
              <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 8, color: confColor[card.confidence] || TEXT_DIM }}>{card.confidence}</span>
              {card.country && <span style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM, background: BG, padding: '1px 4px', borderRadius: 2 }}>{card.country}</span>}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: TEXT_BRIGHT, lineHeight: 1.4, marginBottom: 3 }}>{card.title}</div>

            {/* Impact bars */}
            {(card.impact_24h || card.impact_7d || card.impact_30d) && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                {card.impact_24h && <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM, marginBottom: 2 }}>24h</div>
                  <div style={{ height: 2, background: BORDER, borderRadius: 1 }}><div style={{ width: `${card.impact_24h}%`, height: '100%', background: card.impact_24h > 70 ? RED : AMBER, borderRadius: 1 }} /></div>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM }}>{card.impact_24h}%</div>
                </div>}
                {card.impact_7d && <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM, marginBottom: 2 }}>7d</div>
                  <div style={{ height: 2, background: BORDER, borderRadius: 1 }}><div style={{ width: `${card.impact_7d}%`, height: '100%', background: card.impact_7d > 60 ? AMBER : GREEN, borderRadius: 1 }} /></div>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM }}>{card.impact_7d}%</div>
                </div>}
                {card.impact_30d && <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM, marginBottom: 2 }}>30d</div>
                  <div style={{ height: 2, background: BORDER, borderRadius: 1 }}><div style={{ width: `${card.impact_30d}%`, height: '100%', background: GREEN, borderRadius: 1 }} /></div>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM }}>{card.impact_30d}%</div>
                </div>}
              </div>
            )}

            {/* Expanded detail */}
            {expanded === String(i) && (
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 6, marginTop: 3 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: TEXT, lineHeight: 1.5, marginBottom: 5 }}>{card.narrative}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: GREEN, lineHeight: 1.4, marginBottom: 3 }}>▶ {card.action}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: TEXT_DIM, lineHeight: 1.4 }}>⚠ {card.risk_caveat}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
