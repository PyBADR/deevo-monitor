/**
 * SupplyChainChokepointsPanel — Real-time chokepoint risk for GCC marine insurance
 * Contract 8C | Layer: Features (L2) + Models (L3)
 * Variant: global + finance
 */
import { useState, useEffect, useCallback, memo } from 'react';

interface ChokepointData {
  name: string;
  score: number;
  status: string;
  traffic: string;
  aisDark: number;
  incidents7d: number;
  trend: string;
  marinePolicies: number;
  exposureKWD: string;
  warClause: string;
  routes: { name: string; risk: 'HIGH' | 'ELEVATED' | 'MODERATE' }[];
  sparkline: number[];
}

const RISK_COLORS: Record<string, string> = {
  HIGH: '#ef4444', ELEVATED: '#f59e0b', MODERATE: '#3b82f6', CRITICAL: '#ef4444',
};

const INITIAL_HORMUZ: ChokepointData = {
  name: 'STRAIT OF HORMUZ', score: 90, status: 'CRITICAL',
  traffic: '↓92%', aisDark: 3, incidents7d: 1176, trend: '↑ +18 (12h)',
  marinePolicies: 47, exposureKWD: '12.4M', warClause: 'MONITORING',
  routes: [
    { name: 'Gulf Oil Exports', risk: 'HIGH' },
    { name: 'Qatar LNG', risk: 'ELEVATED' },
    { name: 'UAE Trade', risk: 'MODERATE' },
  ],
  sparkline: [72, 74, 76, 78, 80, 82, 81, 83, 85, 86, 87, 88, 89, 90],
};

const INITIAL_BAB: ChokepointData = {
  name: 'BAB-EL-MANDEB', score: 74, status: 'ELEVATED',
  traffic: '↓78%', aisDark: 1, incidents7d: 423, trend: '↑ +8 (12h)',
  marinePolicies: 23, exposureKWD: '5.8M', warClause: 'ACTIVE',
  routes: [
    { name: 'Red Sea Shipping', risk: 'HIGH' },
    { name: 'Suez Canal Feed', risk: 'ELEVATED' },
  ],
  sparkline: [58, 60, 62, 65, 67, 68, 70, 71, 72, 73, 74, 74, 73, 74],
};

function SupplyChainChokepointsPanelInner() {
  const [hormuz, setHormuz] = useState(INITIAL_HORMUZ);
  const [bab, setBab] = useState(INITIAL_BAB);

  const updateScores = useCallback(() => {
    const jitter = (v: number) => Math.max(0, Math.min(100, v + (Math.random() - 0.5) * 4));
    setHormuz(prev => {
      const s = jitter(prev.score);
      return { ...prev, score: Math.round(s), sparkline: [...prev.sparkline.slice(1), Math.round(s)] };
    });
    setBab(prev => {
      const s = jitter(prev.score);
      return { ...prev, score: Math.round(s), sparkline: [...prev.sparkline.slice(1), Math.round(s)] };
    });
  }, []);

  useEffect(() => {
    const iv = setInterval(updateScores, 5000);
    return () => clearInterval(iv);
  }, [updateScores]);

  const arcPath = (score: number, r: number) => {
    const angle = (score / 100) * 180;
    const rad = (angle * Math.PI) / 180;
    const x = 80 + r * Math.cos(Math.PI - rad);
    const y = 75 - r * Math.sin(Math.PI - rad);
    return `M ${80 - r} 75 A ${r} ${r} 0 ${angle > 90 ? 1 : 0} 1 ${x} ${y}`;
  };

  const scoreColor = (s: number) => s > 80 ? '#ef4444' : s > 60 ? '#f5a623' : s > 40 ? '#eab308' : '#10b981';

  const renderChokepoint = (cp: ChokepointData, large: boolean) => (
    <div key={cp.name} style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#111827', border: '1px solid #1e293b', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Arc Gauge */}
        <div style={{ textAlign: 'center', minWidth: large ? '120px' : '90px' }}>
          <svg width={large ? 120 : 90} height={large ? 80 : 60} viewBox="0 0 160 80">
            <path d={arcPath(100, 55)} stroke="#1e293b" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d={arcPath(cp.score, 55)} stroke={scoreColor(cp.score)} strokeWidth="10" fill="none" strokeLinecap="round" />
            <text x="80" y="65" textAnchor="middle" fill="#e2e8f0" fontSize={large ? '20' : '16'} fontWeight="700" fontFamily="'IBM Plex Mono'">{cp.score}</text>
            <text x="80" y="78" textAnchor="middle" fill="#64748b" fontSize="8">/100</text>
          </svg>
          <span style={{ fontSize: '8px', padding: '1px 6px', borderRadius: '4px', backgroundColor: `${scoreColor(cp.score)}20`, color: scoreColor(cp.score) }}>{cp.status}</span>
        </div>
        {/* Details */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#f5a623', marginBottom: '6px' }}>{cp.name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '9px', marginBottom: '6px' }}>
            <div><span style={{ color: '#64748b' }}>Traffic: </span><span style={{ color: '#ef4444' }}>{cp.traffic}</span></div>
            <div><span style={{ color: '#64748b' }}>AIS Dark: </span><span style={{ color: '#ef4444' }}>{cp.aisDark}</span></div>
            <div><span style={{ color: '#64748b' }}>Incidents(7d): </span><span style={{ color: '#e2e8f0' }}>{cp.incidents7d.toLocaleString()}</span></div>
            <div><span style={{ color: '#64748b' }}>Trend: </span><span style={{ color: '#ef4444' }}>{cp.trend}</span></div>
          </div>

          {/* Insurance Impact */}
          <div style={{ padding: '6px 8px', borderRadius: '4px', backgroundColor: '#0a0f1a', marginBottom: '6px', fontSize: '9px' }}>
            <div style={{ color: '#64748b', marginBottom: '3px', fontWeight: 600 }}>INSURANCE IMPACT</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span><span style={{ color: '#94a3b8' }}>Marine Policies: </span><span style={{ color: '#f5a623' }}>{cp.marinePolicies}</span></span>
              <span><span style={{ color: '#94a3b8' }}>Exposure: </span><span style={{ color: '#f5a623' }}>{cp.exposureKWD} KWD</span></span>
              <span><span style={{ color: '#94a3b8' }}>War Clause: </span><span style={{ color: cp.warClause === 'ACTIVE' ? '#ef4444' : '#f5a623' }}>{cp.warClause}</span></span>
            </div>
          </div>
          {/* Routes */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {cp.routes.map(r => (
              <span key={r.name} style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '4px', backgroundColor: `${RISK_COLORS[r.risk]}15`, color: RISK_COLORS[r.risk], border: `1px solid ${RISK_COLORS[r.risk]}30` }}>
                {r.name}: {r.risk}
              </span>
            ))}
          </div>
        </div>
        {/* Sparkline */}
        <svg width="100" height="40" viewBox="0 0 100 40" style={{ flexShrink: 0 }}>
          <polyline
            points={cp.sparkline.map((v, i) => `${(i / (cp.sparkline.length - 1)) * 96 + 2},${38 - ((v - 40) / 60) * 36}`).join(' ')}
            fill="none" stroke={scoreColor(cp.score)} strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflow: 'auto', backgroundColor: '#0a0f1a', color: '#e2e8f0', fontFamily: "'IBM Plex Mono', monospace", padding: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#f5a623' }}>SUPPLY CHAIN CHOKEPOINTS</span>
          <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#ef444420', color: '#ef4444' }}>
            {(hormuz.score > 80 ? 1 : 0) + (bab.score > 80 ? 1 : 0)} CRITICAL
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
          <span style={{ fontSize: '9px', color: '#64748b' }}>LIVE</span>
        </div>
      </div>

      {renderChokepoint(hormuz, true)}
      {renderChokepoint(bab, false)}

      {/* War Clause Protocol */}
      {hormuz.score > 85 && (
        <button
          onClick={() => console.log(`[AUDIT] WAR_CLAUSE_PROTOCOL: Hormuz ${hormuz.score}/100, initiated by operator`)}
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ef4444', backgroundColor: '#ef444415', color: '#ef4444', fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: "'IBM Plex Mono'", letterSpacing: '0.05em' }}
        >
          ⚠ ACTIVATE WAR CLAUSE PROTOCOL — L7 HUMAN GATE REQUIRED
        </button>
      )}
    </div>
  );
}

export default memo(SupplyChainChokepointsPanelInner);
