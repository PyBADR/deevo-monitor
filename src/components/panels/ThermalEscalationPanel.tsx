/**
 * ThermalEscalationPanel — Satellite thermal signature monitoring (Iran/GCC)
 * Contract 8B | Layer: Data (L1) + Features (L2)
 * Variant: global
 */
import { useState, useEffect, useCallback, memo } from 'react';

interface ThermalReading {
  country: string;
  currentMW: number;
  change12h: number;
  status: 'PERSISTENT' | 'NORMAL' | 'STABLE' | 'ELEVATED';
  observations: number;
}

const INITIAL_DATA: ThermalReading[] = [
  { country: 'Iran', currentMW: 381, change12h: 21.6, status: 'PERSISTENT', observations: 39 },
  { country: 'Saudi Arabia', currentMW: 124, change12h: 2.1, status: 'NORMAL', observations: 12 },
  { country: 'Iraq', currentMW: 98, change12h: -3.2, status: 'STABLE', observations: 8 },
  { country: 'Kuwait', currentMW: 45, change12h: 0.8, status: 'NORMAL', observations: 6 },
  { country: 'UAE', currentMW: 67, change12h: 1.2, status: 'NORMAL', observations: 8 },
];

const STATUS_COLORS: Record<string, string> = {
  PERSISTENT: '#ef4444', ELEVATED: '#f59e0b', NORMAL: '#10b981', STABLE: '#3b82f6',
};

function ThermalEscalationPanelInner() {
  const [data, setData] = useState<ThermalReading[]>(INITIAL_DATA);
  const [iranHistory, setIranHistory] = useState<number[]>([
    358, 362, 367, 370, 372, 375, 377, 379, 380, 381, 382, 381,
  ]);

  const updateReadings = useCallback(() => {
    setData(prev => prev.map(r => {
      if (r.country !== 'Iran') return r;
      const delta = (Math.random() - 0.45) * 6;
      const newMW = Math.max(350, Math.min(420, r.currentMW + delta));
      return { ...r, currentMW: Math.round(newMW * 10) / 10, change12h: Math.round((r.change12h + delta * 0.1) * 10) / 10 };
    }));
    setIranHistory(prev => [...prev.slice(1), data[0].currentMW]);
  }, [data]);

  useEffect(() => {
    const iv = setInterval(updateReadings, 30000);
    return () => clearInterval(iv);
  }, [updateReadings]);

  const iran = data[0];
  const ruleTriggered = iran.change12h > 15;
  const isCritical = iran.change12h > 30;

  // SVG arc gauge helper
  const gaugeArc = (value: number, max: number, radius: number) => {
    const angle = (value / max) * 180;
    const rad = (angle * Math.PI) / 180;
    const x = 100 + radius * Math.cos(Math.PI - rad);
    const y = 100 - radius * Math.sin(Math.PI - rad);
    const large = angle > 90 ? 1 : 0;
    return `M ${100 - radius} 100 A ${radius} ${radius} 0 ${large} 1 ${x} ${y}`;
  };

  // Sparkline points
  const sparklinePoints = iranHistory.map((v, i) => {
    const x = 10 + (i / 11) * 180;
    const y = 55 - ((v - 340) / 80) * 50;
    return `${x},${y}`;
  }).join(' ');

  const threshold15Y = 55 - ((15) / 80) * 50;
  const threshold30Y = 55 - ((30) / 80) * 50;

  const gaugeColor = isCritical ? '#ef4444' : ruleTriggered ? '#f5a623' : '#10b981';

  return (
    <div style={{ height: '100%', overflow: 'auto', backgroundColor: '#0a0f1a', color: '#e2e8f0', fontFamily: "'IBM Plex Mono', monospace", padding: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#f5a623' }}>THERMAL ESCALATION</span>
          <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#1e293b', color: '#94a3b8' }}>{data.length} SITES</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '9px', color: '#64748b' }}>LIVE</span>
        </div>
      </div>

      {/* Iran Primary Gauge + Sparkline */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <div style={{ textAlign: 'center', minWidth: '140px' }}>
          <svg width="140" height="80" viewBox="0 0 200 110">
            <path d={gaugeArc(500, 500, 70)} stroke="#1e293b" strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d={gaugeArc(iran.currentMW, 500, 70)} stroke={gaugeColor} strokeWidth="12" fill="none" strokeLinecap="round" />
            <text x="100" y="85" textAnchor="middle" fill="#e2e8f0" fontSize="22" fontWeight="700" fontFamily="'IBM Plex Mono'">{iran.currentMW}</text>
            <text x="100" y="105" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="'IBM Plex Mono'">MW — IRAN</text>
          </svg>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '4px' }}>
            {['PERSISTENT', 'CONFLICT-ADJ', 'STRATEGIC'].map(tag => (
              <span key={tag} style={{ fontSize: '7px', padding: '1px 5px', borderRadius: '8px', backgroundColor: '#1e293b', color: '#f5a623' }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '4px' }}>12H THERMAL TREND</div>
          <svg width="200" height="60" viewBox="0 0 200 60">
            <line x1="10" y1={threshold15Y} x2="190" y2={threshold15Y} stroke="#f5a623" strokeWidth="0.5" strokeDasharray="4,3" />
            <line x1="10" y1={threshold30Y} x2="190" y2={threshold30Y} stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4,3" />
            <text x="194" y={threshold15Y + 3} fill="#f5a623" fontSize="7">+15MW</text>
            <text x="194" y={threshold30Y + 3} fill="#ef4444" fontSize="7">+30MW</text>
            <polyline points={sparklinePoints} fill="none" stroke={gaugeColor} strokeWidth="1.5" />
            {iranHistory.map((v, i) => {
              const x = 10 + (i / 11) * 180;
              const y = 55 - ((v - 340) / 80) * 50;
              return <circle key={i} cx={x} cy={y} r="2" fill={gaugeColor} />;
            })}
          </svg>
        </div>
      </div>

      {/* Data Table */}
      <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse', marginBottom: '12px' }}>
        <thead>
          <tr style={{ color: '#64748b', borderBottom: '1px solid #1e293b' }}>
            <th style={{ textAlign: 'left', padding: '4px 6px' }}>COUNTRY</th>
            <th style={{ textAlign: 'right', padding: '4px 6px' }}>CURRENT MW</th>
            <th style={{ textAlign: 'right', padding: '4px 6px' }}>12H CHANGE</th>
            <th style={{ textAlign: 'center', padding: '4px 6px' }}>STATUS</th>
            <th style={{ textAlign: 'right', padding: '4px 6px' }}>OBS</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.country} style={{ borderBottom: '1px solid #111827' }}>
              <td style={{ padding: '4px 6px', fontWeight: r.country === 'Iran' ? 700 : 400 }}>{r.country}</td>
              <td style={{ padding: '4px 6px', textAlign: 'right', color: '#f5a623', fontWeight: 700 }}>{r.currentMW}</td>
              <td style={{ padding: '4px 6px', textAlign: 'right', color: r.change12h > 0 ? '#ef4444' : '#10b981' }}>
                {r.change12h > 0 ? '+' : ''}{r.change12h}
              </td>
              <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                <span style={{ fontSize: '8px', padding: '1px 6px', borderRadius: '4px', backgroundColor: `${STATUS_COLORS[r.status]}20`, color: STATUS_COLORS[r.status] }}>
                  {r.status}
                </span>
              </td>
              <td style={{ padding: '4px 6px', textAlign: 'right', color: '#94a3b8' }}>{r.observations}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* RULE_002 Warning */}
      {ruleTriggered && (
        <div style={{ padding: '8px 12px', borderRadius: '6px', border: `1px solid ${isCritical ? '#ef4444' : '#f5a623'}`, backgroundColor: isCritical ? '#ef444410' : '#f5a62310', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: isCritical ? '#ef4444' : '#f5a623' }}>
              RULE_002 {isCritical ? 'CRITICAL' : 'TRIGGERED'} — IRAN ENERGY PROPERTY
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>
              Iran thermal +{iran.change12h}MW/12h exceeds {isCritical ? '30MW' : '15MW'} threshold
            </div>
          </div>
          <button
            onClick={() => console.log(`[AUDIT] RULE_002_REVIEW: Iran ${iran.currentMW}MW, change +${iran.change12h}`)}
            style={{ fontSize: '9px', padding: '4px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#f5a623', color: '#0a0f1a', fontWeight: 700, cursor: 'pointer', fontFamily: "'IBM Plex Mono'" }}
          >
            REVIEW ENERGY POLICIES
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(ThermalEscalationPanelInner);
