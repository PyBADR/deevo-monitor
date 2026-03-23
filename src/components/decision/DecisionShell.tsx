/**
 * DEEVO Decision Shell — GCC Decision Intelligence Command Center
 * 6-panel layout with real MapContainer, scoring engine, feature gating.
 */

import { useMemo, useState, memo, lazy, Suspense } from 'react';
import { scoreSignal, correlateSignals } from '../../lib/scoring';
import type { ScoredSignal, RiskLevel } from '../../lib/scoring';
import type { PlanTier } from '../../lib/auth/roles';
import { TIER_ACCESS } from '../../lib/auth/roles';

const MapContainer = lazy(() => import('../map/MapContainer'));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Country { code: string; name: string; }
interface RiskItem { title: string; level: 'Critical' | 'High' | 'Medium' | 'Low'; delta: string; }
interface SectorItem { name: string; score: number; }
interface GdpItem { label: string; value: string; note: string; }
interface ForecastItem { horizon: string; note: string; }
interface GraphNode { x: number; y: number; label: string; color: string; }
interface GraphEdge { x1: number; y1: number; x2: number; y2: number; }

// ---------------------------------------------------------------------------
// Demo Data — Hormuz Escalation Scenario (live data will replace this)
// ---------------------------------------------------------------------------

const DEMO_DATA = {
  countries: [
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'AE', name: 'UAE' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'QA', name: 'Qatar' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'OM', name: 'Oman' },
  ] as Country[],
  activeRisks: [
    { title: 'Hormuz Shipping Tension', level: 'Critical', delta: '+18%' },
    { title: 'Marine Insurance Exposure', level: 'High', delta: '+12%' },
    { title: 'Oil Export Corridor Pressure', level: 'High', delta: '+9%' },
  ] as RiskItem[],
  emergingSignals: [
    'AIS dark vessel activity near Hormuz',
    'Brent crude volatility rising across 24h',
    'Marine claims sensitivity increasing in GCC portfolios',
  ],
  actions: [
    'Activate marine underwriting review',
    'Escalate corridor monitoring to operations desk',
    'Flag reinsurer accumulation watch for exposed routes',
  ],
  // Raw signals — will be scored by the scoring engine
  rawSignals: [
    { id: 'SIG-001', title: 'Hormuz risk index moved into critical band', source: 'Strategic Feed', timestamp: '2026-03-23T02:14:00Z' },
    { id: 'SIG-002', title: 'Brent crude oil price surge on corridor disruption fears', source: 'Market Feed', timestamp: '2026-03-23T01:52:00Z' },
    { id: 'SIG-003', title: 'Marine insurance claims sensitivity increased for GCC shipping routes', source: 'Insurance Feed', timestamp: '2026-03-23T01:31:00Z' },
    { id: 'SIG-004', title: 'Red Sea attack on commercial vessel reported near Bab al-Mandab', source: 'Security Feed', timestamp: '2026-03-23T01:12:00Z' },
    { id: 'SIG-005', title: 'OPEC production cut announcement expected within 48h', source: 'Energy Feed', timestamp: '2026-03-23T00:45:00Z' },
    { id: 'SIG-006', title: 'Port congestion at Jebel Ali reaches 72h average delay', source: 'Logistics Feed', timestamp: '2026-03-22T23:30:00Z' },
  ],
  sectors: [
    { name: 'Oil & Gas', score: 87 },
    { name: 'Insurance', score: 79 },
    { name: 'Banking', score: 58 },
    { name: 'Supply Chain', score: 82 },
    { name: 'E-commerce', score: 46 },
  ] as SectorItem[],
  gdp: [
    { label: 'Exports', value: '-2.3%', note: 'Oil + shipping pressure' },
    { label: 'Government Revenue', value: '-1.1%', note: 'Energy sensitivity' },
    { label: 'Investment', value: '-0.6%', note: 'Risk premium rising' },
    { label: 'Consumption', value: '-0.3%', note: 'Delivery + pricing spillover' },
  ] as GdpItem[],
  forecast: [
    { horizon: '24h', note: 'High corridor sensitivity remains likely' },
    { horizon: '7d', note: 'Marine pricing pressure may stay elevated' },
    { horizon: '30d', note: 'Export-linked GDP pressure depends on de-escalation' },
  ] as ForecastItem[],
  alerts: [
    'Critical: Hormuz corridor monitoring active',
    'High: Marine risk playbook triggered',
    'Medium: Banking liquidity watch for exposed flows',
  ],
  graphNodes: [
    { x: 12, y: 55, label: 'Geopolitics', color: 'red' },
    { x: 30, y: 28, label: 'Oil', color: 'amber' },
    { x: 32, y: 78, label: 'Shipping', color: 'sky' },
    { x: 56, y: 55, label: 'Insurance', color: 'fuchsia' },
    { x: 76, y: 35, label: 'Banking', color: 'emerald' },
    { x: 84, y: 74, label: 'GDP', color: 'indigo' },
  ] as GraphNode[],
  graphEdges: [
    { x1: 16, y1: 55, x2: 28, y2: 31 },
    { x1: 16, y1: 55, x2: 30, y2: 74 },
    { x1: 35, y1: 30, x2: 52, y2: 52 },
    { x1: 37, y1: 74, x2: 52, y2: 58 },
    { x1: 60, y1: 53, x2: 74, y2: 38 },
    { x1: 60, y1: 58, x2: 80, y2: 72 },
  ] as GraphEdge[],
};

// ---------------------------------------------------------------------------
// Inline Style Tokens
// ---------------------------------------------------------------------------

const C = {
  bg: '#020617',
  surface: '#0f172a',
  surfaceAlt: '#111827',
  border: '#1e293b',
  borderLight: '#334155',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  cyan: '#22d3ee',
  cyanDim: 'rgba(34,211,238,0.15)',
  amber: '#f5a623',
  amberDim: 'rgba(245,166,35,0.1)',
  red: '#f87171',
  redDim: 'rgba(248,113,113,0.1)',
  emerald: '#34d399',
  emeraldDim: 'rgba(52,211,153,0.1)',
  indigo: '#818cf8',
  fuchsia: '#d946ef',
  sky: '#38bdf8',
};

const nodeColors: Record<string, string> = {
  red: C.red, amber: C.amber, sky: C.sky,
  fuchsia: C.fuchsia, emerald: C.emerald, indigo: C.indigo,
};

const LEVEL_COLORS: Record<RiskLevel, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: C.red, bg: C.redDim, border: 'rgba(248,113,113,0.4)' },
  HIGH: { color: C.amber, bg: C.amberDim, border: 'rgba(245,166,35,0.4)' },
  MED: { color: '#facc15', bg: 'rgba(250,204,21,0.1)', border: 'rgba(250,204,21,0.4)' },
  LOW: { color: C.emerald, bg: C.emeraldDim, border: 'rgba(52,211,153,0.4)' },
};

function scoreTone(score: number): { color: string; bg: string; border: string } {
  if (score >= 80) return LEVEL_COLORS.CRITICAL;
  if (score >= 65) return LEVEL_COLORS.HIGH;
  if (score >= 50) return LEVEL_COLORS.MED;
  return LEVEL_COLORS.LOW;
}

// ---------------------------------------------------------------------------
// Reusable Components
// ---------------------------------------------------------------------------

function Card({ title, right, children, locked }: { title: string; right?: React.ReactNode; children: React.ReactNode; locked?: boolean }) {
  return (
    <div style={{
      borderRadius: 16, border: `1px solid ${locked ? 'rgba(100,116,139,0.3)' : C.border}`,
      background: 'rgba(15,23,42,0.7)', position: 'relative',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)',
      opacity: locked ? 0.5 : 1, filter: locked ? 'blur(1px)' : 'none',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.border}`, padding: '12px 16px',
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.025em', color: C.text, margin: 0 }}>{title}</h3>
        {right}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
      {locked && <LockedOverlay />}
    </div>
  );
}

function LockedOverlay() {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 16, zIndex: 20,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(4px)',
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>PRO Feature</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Upgrade to unlock</div>
      <button style={{
        marginTop: 12, borderRadius: 999, border: `1px solid rgba(245,166,35,0.5)`,
        background: C.amberDim, padding: '8px 20px', fontSize: 12, fontWeight: 600,
        color: C.amber, cursor: 'pointer',
      }}>Upgrade to Pro</button>
    </div>
  );
}

function Pill({ children, active, onClick, style: extraStyle }: { children: React.ReactNode; active?: boolean; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{
      borderRadius: 999, border: `1px solid ${active ? 'rgba(34,211,238,0.6)' : C.borderLight}`,
      background: active ? C.cyanDim : C.surfaceAlt, padding: '6px 12px',
      fontSize: 12, fontWeight: 500, color: active ? C.cyan : C.textMuted,
      cursor: 'pointer', transition: 'all 0.15s', ...extraStyle,
    }}>{children}</button>
  );
}

function MiniCard({ children, style: extraStyle }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      borderRadius: 12, border: `1px solid ${C.border}`, background: 'rgba(15,23,42,0.8)',
      padding: 12, ...extraStyle,
    }}>{children}</div>
  );
}

// ---------------------------------------------------------------------------
// Top Bar with Tier Badge
// ---------------------------------------------------------------------------

function TopBar({ selectedCountry, onSelectCountry, tier }: {
  selectedCountry: string; onSelectCountry: (c: string) => void; tier: PlanTier;
}) {
  const tierLabel = tier === 'government' ? 'GOV' : tier === 'pro' ? 'PRO' : 'FREE';
  const tierColor = tier === 'free' ? C.textDim : C.amber;

  return (
    <div style={{
      marginBottom: 16, borderRadius: 24, border: `1px solid ${C.border}`,
      background: 'rgba(15,23,42,0.8)', padding: '16px 20px',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 16, border: '1px solid rgba(34,211,238,0.3)',
            background: C.cyanDim, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.cyan, fontSize: 20,
          }}>◉</div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.cyan }}>Live GCC Intelligence</div>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: C.text }}>DEEVO MONITOR</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Pill active style={{ background: C.emeraldDim, borderColor: 'rgba(52,211,153,0.3)', color: C.emerald }}>LIVE</Pill>
          <Pill style={{ borderColor: `${tierColor}66`, color: tierColor }}>{tierLabel}</Pill>
          <Pill>EN | AR</Pill>
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DEMO_DATA.countries.map((c) => (
            <Pill key={c.code} active={c.code === selectedCountry} onClick={() => onSelectCountry(c.code)}>{c.code}</Pill>
          ))}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, borderRadius: 16,
          border: `1px solid ${C.borderLight}`, background: C.surfaceAlt, padding: '12px 16px',
          width: '100%', maxWidth: 520,
        }}>
          <span style={{ color: C.textDim }}>⌕</span>
          <input style={{
            background: 'transparent', border: 'none', outline: 'none', color: C.textMuted,
            fontSize: 14, width: '100%',
          }} placeholder="Search intelligence, sectors, GDP impact, ministries..." />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero: Decision Board
// ---------------------------------------------------------------------------

function HeroBoard() {
  const sectionStyle = (borderColor: string, bgColor: string) => ({
    borderRadius: 16, border: `1px solid ${borderColor}`, background: bgColor, padding: 16,
  });
  const labelStyle = (color: string): React.CSSProperties => ({
    fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color, margin: 0,
  });

  return (
    <Card title="GCC Decision Board" right={<span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.textDim }}>Command Center</span>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={sectionStyle('rgba(248,113,113,0.2)', C.redDim)}>
          <div style={labelStyle(C.red)}>Active Risks</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DEMO_DATA.activeRisks.map((risk) => (
              <MiniCard key={risk.title}>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{risk.title}</div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: C.red }}>{risk.level}</span>
                  <span style={{ color: C.textDim }}>{risk.delta}</span>
                </div>
              </MiniCard>
            ))}
          </div>
        </div>
        <div style={sectionStyle('rgba(245,166,35,0.2)', C.amberDim)}>
          <div style={labelStyle(C.amber)}>Emerging Signals</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DEMO_DATA.emergingSignals.map((signal) => (
              <MiniCard key={signal}><div style={{ fontSize: 14, color: C.text }}>{signal}</div></MiniCard>
            ))}
          </div>
        </div>
        <div style={sectionStyle('rgba(34,211,238,0.2)', C.cyanDim)}>
          <div style={labelStyle(C.cyan)}>Recommended Actions</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DEMO_DATA.actions.map((action) => (
              <MiniCard key={action}><div style={{ fontSize: 14, color: C.text }}>{action}</div></MiniCard>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// GCC Strategic Map — Real MapLibre + deck.gl
// ---------------------------------------------------------------------------

function StrategicMap({ locked }: { locked?: boolean }) {
  return (
    <Card title="GCC Strategic Map" right={<Pill>Live Layers</Pill>} locked={locked}>
      <div style={{ height: 320, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
        <Suspense fallback={
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: C.bg, color: C.textDim, fontSize: 13,
          }}>Loading GCC Decision Map...</div>
        }>
          <MapContainer />
        </Suspense>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// 6 Overview Panels — with scoring engine + feature gating
// ---------------------------------------------------------------------------

function OverviewPanels({ tier }: { tier: PlanTier }) {
  const access = TIER_ACCESS[tier];

  // Score all raw signals through the scoring engine
  const scoredSignals: ScoredSignal[] = useMemo(() => {
    const raw = DEMO_DATA.rawSignals.map((s) => scoreSignal(s.id, s.title, s.source, s.timestamp));
    return correlateSignals(raw);
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {/* Risk Overview */}
      <Card title="Risk Overview">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DEMO_DATA.activeRisks.map((risk) => (
            <MiniCard key={risk.title} style={{ background: 'rgba(15,23,42,0.7)' }}>
              <div style={{ fontSize: 14, color: C.text }}>{risk.title}</div>
              <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: C.border }}>
                <div style={{ height: 8, borderRadius: 4, background: `linear-gradient(to right, ${C.amber}, ${C.red})`, width: risk.level === 'Critical' ? '92%' : '76%' }} />
              </div>
            </MiniCard>
          ))}
        </div>
      </Card>

      {/* Intelligence Feed — powered by scoring engine */}
      <Card title="Intelligence Feed" right={
        <span style={{ fontSize: 11, color: C.cyan }}>{scoredSignals.length} signals scored</span>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {scoredSignals.slice(0, 4).map((signal) => {
            const tone = LEVEL_COLORS[signal.level];
            return (
              <MiniCard key={signal.id} style={{ background: 'rgba(15,23,42,0.7)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textDim }}>
                  <span>{new Date(signal.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC</span>
                  <span>{signal.source}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 14, color: C.text }}>{signal.title}</div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    borderRadius: 999, border: `1px solid ${tone.border}`, background: tone.bg,
                    padding: '2px 10px', fontSize: 11, fontWeight: 600, color: tone.color,
                  }}>{signal.level} · {signal.score}</span>
                  <span style={{ fontSize: 11, color: C.textDim }}>{signal.category}</span>
                </div>
              </MiniCard>
            );
          })}
        </div>
      </Card>

      {/* Sector Impact — locked for free tier */}
      <Card title="Sector Impact" locked={!access.sectorIntelligence}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DEMO_DATA.sectors.map((sector) => {
            const tone = scoreTone(sector.score);
            return (
              <MiniCard key={sector.name} style={{ background: 'rgba(15,23,42,0.7)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: C.text }}>{sector.name}</span>
                  <span style={{ borderRadius: 999, border: `1px solid ${tone.border}`, background: tone.bg, padding: '4px 8px', fontSize: 12, color: tone.color }}>{sector.score}</span>
                </div>
                <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: C.border }}>
                  <div style={{ height: 8, borderRadius: 4, background: `linear-gradient(to right, ${C.cyan}, ${C.amber}, ${C.red})`, width: `${sector.score}%` }} />
                </div>
              </MiniCard>
            );
          })}
        </div>
      </Card>

      {/* GDP Impact — locked for free tier */}
      <Card title="GDP Impact" locked={!access.gdpDashboard}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DEMO_DATA.gdp.map((item) => (
            <MiniCard key={item.label} style={{ background: 'rgba(15,23,42,0.7)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: C.text }}>{item.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.red }}>{item.value}</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: C.textDim }}>{item.note}</div>
            </MiniCard>
          ))}
        </div>
      </Card>

      {/* Forecast */}
      <Card title="Forecast">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DEMO_DATA.forecast.map((item) => (
            <MiniCard key={item.horizon} style={{ background: 'rgba(15,23,42,0.7)' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.cyan }}>{item.horizon}</div>
              <div style={{ marginTop: 8, fontSize: 14, color: C.text }}>{item.note}</div>
            </MiniCard>
          ))}
        </div>
      </Card>

      {/* Alerts */}
      <Card title="Alerts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DEMO_DATA.alerts.map((alert) => (
            <MiniCard key={alert} style={{ background: 'rgba(15,23,42,0.7)' }}>
              <div style={{ fontSize: 14, color: C.text }}>{alert}</div>
            </MiniCard>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scenario Panel with Propagation Graph — locked for non-government
// ---------------------------------------------------------------------------

function ScenarioPanel({ locked }: { locked?: boolean }) {
  const infoBlock = (label: string, text: string) => (
    <MiniCard style={{ background: 'rgba(15,23,42,0.7)' }}>
      <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.cyan }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 14, color: C.text }}>{text}</div>
    </MiniCard>
  );

  return (
    <Card title="Scenario View — Hormuz Escalation" locked={locked}>
      <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {infoBlock('What happened', 'Maritime tension increased across Hormuz, with higher corridor sensitivity and stronger oil-linked market reaction.')}
          {infoBlock('Why', 'Multiple linked signals aligned: shipping anomalies, geopolitical rhetoric, and rising export risk sensitivity.')}
          {infoBlock('Decision', 'Increase marine pricing watch, activate corridor escalation protocol, and flag export-sensitive exposures.')}
        </div>
        <div style={{ position: 'relative', height: 260, borderRadius: 16, border: `1px solid ${C.border}`, background: 'rgba(15,23,42,0.6)' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
            {DEMO_DATA.graphEdges.map((edge, i) => (
              <line key={i} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="rgba(56,189,248,0.5)" strokeWidth="1" />
            ))}
          </svg>
          {DEMO_DATA.graphNodes.map((node) => (
            <div key={node.label} style={{
              position: 'absolute', left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)',
              borderRadius: 16, border: `1px solid ${nodeColors[node.color] ?? C.cyan}`,
              background: `${nodeColors[node.color] ?? C.cyan}20`, padding: '8px 12px',
              fontSize: 12, fontWeight: 500, color: nodeColors[node.color] ?? C.cyan,
              boxShadow: `0 4px 12px ${nodeColors[node.color] ?? C.cyan}30`,
            }}>{node.label}</div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sector Detail Panel
// ---------------------------------------------------------------------------

function SectorPanel({ locked }: { locked?: boolean }) {
  const metricBox = (label: string, value: string, color: string) => (
    <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: 'rgba(15,23,42,0.7)', padding: 16 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.textDim }}>{label}</div>
      <div style={{ marginTop: 12, fontSize: 28, fontWeight: 600, color }}>{value}</div>
    </div>
  );

  return (
    <Card title="Sector View — Insurance" locked={locked}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {metricBox('Loss Ratio Risk', '72', C.amber)}
        {metricBox('Claims Sensitivity', 'High', C.red)}
        {metricBox('Recommended Action', 'Review marine exposure', C.cyan)}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main DecisionShell Component
// ---------------------------------------------------------------------------

function DecisionShellInner() {
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [tier] = useState<PlanTier>('pro'); // Default to pro for demo; free for gating demo
  const access = TIER_ACCESS[tier];

  const selectedCountryName = useMemo(() =>
    DEMO_DATA.countries.find((c) => c.code === selectedCountry)?.name ?? 'Saudi Arabia',
    [selectedCountry]
  );

  const mapLocked = access.mapLayers < 4;
  const scenarioLocked = !access.scenarioSimulation;
  const sectorLocked = !access.sectorIntelligence;

  return (
    <div style={{
      minHeight: '100vh', color: C.text,
      background: `radial-gradient(circle at top, rgba(30,64,175,0.18), transparent 35%), linear-gradient(180deg, ${C.bg} 0%, ${C.bg} 55%, #000814 100%)`,
    }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: 24 }}>
        <TopBar selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} tier={tier} />

        {/* Country Context Bar */}
        <div style={{
          marginBottom: 16, borderRadius: 16, border: `1px solid ${C.border}`,
          background: 'rgba(15,23,42,0.6)', padding: '12px 16px', fontSize: 14, color: C.textMuted,
        }}>
          Active country context: <span style={{ fontWeight: 500, color: C.cyan }}>{selectedCountryName}</span>
        </div>

        {/* Hero Row: Decision Board + Strategic Map */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 16 }}>
          <HeroBoard />
          <StrategicMap locked={mapLocked} />
        </div>

        {/* Main Grid: 6 Panels + Scenario + Sector */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 16 }}>
          <OverviewPanels tier={tier} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ScenarioPanel locked={scenarioLocked} />
            <SectorPanel locked={sectorLocked} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(DecisionShellInner);
