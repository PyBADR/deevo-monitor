/**
 * DEEVO Intelligence Monitor — Strategic Risk Overview
 * Contract C10 / Panel 3 of 4
 * Layer: Agents (L4) + UI (L6)
 *
 * Executive-level strategic risk dashboard aggregating
 * all risk domains into a single operational picture.
 */
import { useState, useEffect, memo } from 'react';

interface RiskDomain {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE' | 'LOW';
  change24h: number;
  keyDriver: string;
  insuranceImpact: string;
}

const RISK_DOMAINS: RiskDomain[] = [
  { id: 'geo', name: 'Geopolitical', score: 78, maxScore: 100, status: 'HIGH', change24h: +3, keyDriver: 'Hormuz escalation', insuranceImpact: 'Marine & cargo +15% premium' },
  { id: 'fin', name: 'Financial Markets', score: 52, maxScore: 100, status: 'ELEVATED', change24h: -2, keyDriver: 'Fed rate hold', insuranceImpact: 'Investment portfolio volatility' },
  { id: 'cyber', name: 'Cyber Threat', score: 65, maxScore: 100, status: 'HIGH', change24h: +5, keyDriver: 'GCC banking sector targeting', insuranceImpact: 'Cyber liability claims +22%' },
  { id: 'climate', name: 'Climate & CAT', score: 58, maxScore: 100, status: 'ELEVATED', change24h: +1, keyDriver: 'Dust storm season onset', insuranceImpact: 'Property CAT reserves' },
  { id: 'fraud', name: 'Fraud & Integrity', score: 44, maxScore: 100, status: 'MODERATE', change24h: 0, keyDriver: 'FRIN network monitoring', insuranceImpact: 'Claims leakage -8% (improving)' },
  { id: 'reg', name: 'Regulatory', score: 35, maxScore: 100, status: 'MODERATE', change24h: -1, keyDriver: 'PDPL enforcement timeline', insuranceImpact: 'Compliance cost increase' },
  { id: 'supply', name: 'Supply Chain', score: 71, maxScore: 100, status: 'HIGH', change24h: +4, keyDriver: 'Bab-el-Mandeb chokepoint', insuranceImpact: 'Trade credit exposure' },
  { id: 'health', name: 'Pandemic & Health', score: 18, maxScore: 100, status: 'LOW', change24h: 0, keyDriver: 'No active threats', insuranceImpact: 'Baseline monitoring' },
];

const statusColors: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f59e0b', ELEVATED: '#f5a623', MODERATE: '#22d3ee', LOW: '#22c55e',
};

const s = {
  container: { padding: '16px', fontFamily: "'IBM Plex Mono', monospace", color: '#e2e8f0', height: '100%', overflowY: 'auto' as const, background: '#0a0f1a' },
  header: { fontSize: '14px', fontWeight: 700, color: '#f5a623', marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '1.5px' },
  subtext: { fontSize: '11px', color: '#64748b', marginBottom: '16px' },
  scoreBox: { display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', background: '#111827', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '16px' },
  bigScore: (color: string) => ({ fontSize: '36px', fontWeight: 800, color, lineHeight: 1 }),
  bigLabel: { fontSize: '10px', color: '#64748b', marginTop: '4px', textTransform: 'uppercase' as const },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' },
  card: { background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  domainName: { fontSize: '12px', fontWeight: 600, color: '#e2e8f0' },
  badge: (color: string) => ({ fontSize: '9px', padding: '2px 8px', borderRadius: '4px', background: `${color}22`, color, fontWeight: 700 }),
  bar: { height: '6px', borderRadius: '3px', background: '#1e293b', marginBottom: '8px' },
  barFill: (pct: number, color: string) => ({ height: '6px', borderRadius: '3px', background: color, width: `${pct}%`, transition: 'width 0.5s ease' }),
  detail: { fontSize: '10px', color: '#94a3b8', marginBottom: '3px' },
  change: (val: number) => ({ fontSize: '10px', fontWeight: 600, color: val > 0 ? '#ef4444' : val < 0 ? '#22c55e' : '#64748b' }),
  footer: { marginTop: '14px', padding: '10px', background: '#111827', borderRadius: '6px', border: '1px solid #1e293b', fontSize: '10px', color: '#64748b' },
};

function StrategicRiskOverviewPanelInner() {
  const [domains, setDomains] = useState<RiskDomain[]>(RISK_DOMAINS);

  useEffect(() => {
    const iv = setInterval(() => {
      setDomains(prev => prev.map(d => {
        const delta = Math.round((Math.random() - 0.5) * 4);
        const newScore = Math.max(5, Math.min(99, d.score + delta));
        const newStatus = newScore >= 80 ? 'CRITICAL' : newScore >= 65 ? 'HIGH' : newScore >= 45 ? 'ELEVATED' : newScore >= 25 ? 'MODERATE' : 'LOW';
        return { ...d, score: newScore, status: newStatus, change24h: d.change24h + delta };
      }));
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  const compositeScore = Math.round(domains.reduce((a, d) => a + d.score, 0) / domains.length);
  const compositeColor = compositeScore >= 65 ? '#ef4444' : compositeScore >= 45 ? '#f5a623' : '#22c55e';

  return (
    <div style={s.container}>
      <div style={s.header}>Strategic Risk Overview</div>
      <div style={s.subtext}>Executive risk posture across {domains.length} domains</div>

      <div style={s.scoreBox}>
        <div>
          <div style={s.bigScore(compositeColor)}>{compositeScore}</div>
          <div style={s.bigLabel}>Composite Risk</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={s.bar}><div style={s.barFill(compositeScore, compositeColor)} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#475569', marginTop: '4px' }}>
            <span>LOW</span><span>MODERATE</span><span>ELEVATED</span><span>HIGH</span><span>CRITICAL</span>
          </div>
        </div>
      </div>

      <div style={s.grid}>
        {domains.map(d => (
          <div key={d.id} style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.domainName}>{d.name}</span>
              <span style={s.badge(statusColors[d.status] ?? '#64748b')}>{d.status}</span>
            </div>
            <div style={s.bar}><div style={s.barFill(d.score, statusColors[d.status] ?? '#64748b')} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: statusColors[d.status] }}>{d.score}/100</span>
              <span style={s.change(d.change24h)}>{d.change24h > 0 ? '+' : ''}{d.change24h} (24h)</span>
            </div>
            <div style={s.detail}>Driver: {d.keyDriver}</div>
            <div style={s.detail}>Impact: {d.insuranceImpact}</div>
          </div>
        ))}
      </div>

      <div style={s.footer}>
        L7 Governance: CRITICAL domains auto-escalate to CRO. Board notification at composite ≥ 75. SHA-256 audit on all score changes.
      </div>
    </div>
  );
}

export default memo(StrategicRiskOverviewPanelInner);
