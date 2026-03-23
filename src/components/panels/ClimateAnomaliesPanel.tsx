/**
 * ClimateAnomaliesPanel — Climate anomaly monitoring for GCC CAT risk
 * Contract 8E | Layer: Data (L1) + Features (L2)
 * Variant: global + finance
 */
import { useState, useEffect, useMemo } from 'react';

type Severity = 'EXTREME' | 'HIGH' | 'ELEVATED' | 'MODERATE';

interface ClimateAnomaly {
  zone: string;
  tempAnomaly: number;
  precip: number;
  severity: Severity;
}

const INITIAL_ANOMALIES: ClimateAnomaly[] = [
  { zone: 'GCC Region', tempAnomaly: 4.2, precip: -0.3, severity: 'HIGH' },
  { zone: 'Persian Gulf', tempAnomaly: 3.8, precip: -0.1, severity: 'ELEVATED' },
  { zone: 'Rub al Khali', tempAnomaly: 6.1, precip: 0.0, severity: 'EXTREME' },
  { zone: 'Red Sea', tempAnomaly: 2.9, precip: -0.2, severity: 'MODERATE' },
  { zone: 'Arabian Sea', tempAnomaly: 3.1, precip: -0.4, severity: 'ELEVATED' },
];

const SEV_COLORS: Record<Severity, string> = {
  EXTREME: '#ef4444', HIGH: '#f59e0b', ELEVATED: '#f5a623', MODERATE: '#3b82f6',
};

const INSURANCE_LINES: { line: string; severity: Severity }[] = [
  { line: 'Property (heat damage)', severity: 'HIGH' },
  { line: 'Marine (storm risk)', severity: 'ELEVATED' },
  { line: 'Agriculture (crop failure)', severity: 'EXTREME' },
];

function ClimateAnomaliesPanelInner() {
  const [anomalies, setAnomalies] = useState(INITIAL_ANOMALIES);
  const [heatSparkline] = useState([45, 52, 61, 58, 69, 73, 79, 82]);
  const dustStormProb = 73;
  const floodRisk = 45;

  useEffect(() => {
    const iv = setInterval(() => {
      setAnomalies(prev => prev.map(a => ({
        ...a,
        tempAnomaly: Math.round((a.tempAnomaly + (Math.random() - 0.5) * 0.2) * 10) / 10,
      })));
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  const hasExtreme = useMemo(() => anomalies.some(a => a.severity === 'EXTREME'), [anomalies]);
  const tempColor = (t: number) => t > 5 ? '#ef4444' : t > 3 ? '#f5a623' : t > 2 ? '#eab308' : '#3b82f6';

  return (
    <div style={{ height: '100%', overflow: 'auto', backgroundColor: '#0a0f1a', color: '#e2e8f0', fontFamily: "'IBM Plex Mono', monospace", padding: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#f5a623' }}>CLIMATE ANOMALIES</span>
          <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#1e293b', color: '#94a3b8' }}>{anomalies.length} ZONES</span>
          {hasExtreme && <span style={{ fontSize: '8px', padding: '1px 5px', borderRadius: '4px', backgroundColor: '#ef444420', color: '#ef4444' }}>EXTREME</span>}
        </div>
      </div>

      {/* Anomalies Table */}
      <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse', marginBottom: '12px' }}>
        <thead>
          <tr style={{ color: '#64748b', borderBottom: '1px solid #1e293b' }}>
            <th style={{ textAlign: 'left', padding: '4px 6px' }}>ZONE</th>
            <th style={{ textAlign: 'right', padding: '4px 6px' }}>TEMP ANOMALY</th>
            <th style={{ textAlign: 'right', padding: '4px 6px' }}>PRECIP</th>
            <th style={{ textAlign: 'center', padding: '4px 6px' }}>SEVERITY</th>
          </tr>
        </thead>
        <tbody>
          {anomalies.map(a => (
            <tr key={a.zone} style={{ borderBottom: '1px solid #111827' }}>
              <td style={{ padding: '4px 6px' }}>{a.zone}</td>
              <td style={{ padding: '4px 6px', textAlign: 'right', color: tempColor(a.tempAnomaly), fontWeight: 700 }}>+{a.tempAnomaly.toFixed(1)}°C</td>
              <td style={{ padding: '4px 6px', textAlign: 'right', color: '#94a3b8' }}>{a.precip.toFixed(1)}mm</td>
              <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                <span style={{ fontSize: '8px', padding: '1px 6px', borderRadius: '4px', backgroundColor: `${SEV_COLORS[a.severity]}20`, color: SEV_COLORS[a.severity] }}>{a.severity}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* GCC Risks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        {/* Dust storm */}
        <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#111827', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '8px', color: '#64748b', marginBottom: '4px' }}>DUST STORM PROB.</div>
          <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${dustStormProb}%`, backgroundColor: '#f5a623', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#f5a623', marginTop: '2px' }}>{dustStormProb}%</div>
        </div>

        {/* Heat events sparkline */}
        <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#111827', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '8px', color: '#64748b', marginBottom: '4px' }}>EXTREME HEAT EVENTS</div>
          <svg width="100%" height="30" viewBox="0 0 120 30" preserveAspectRatio="none">
            <polyline
              points={heatSparkline.map((v, i) => `${(i / 7) * 116 + 2},${28 - (v / 100) * 26}`).join(' ')}
              fill="none" stroke="#ef4444" strokeWidth="1.5"
            />
          </svg>
        </div>
        {/* Flood risk */}
        <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#111827', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '8px', color: '#64748b', marginBottom: '4px' }}>FLASH FLOOD RISK</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#3b82f6' }}>{floodRisk}<span style={{ fontSize: '10px', color: '#64748b' }}>/100</span></div>
        </div>
      </div>

      {/* Insurance Line Impacts */}
      <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#111827', border: '1px solid #1e293b', marginBottom: '12px' }}>
        <div style={{ fontSize: '9px', fontWeight: 600, color: '#f5a623', marginBottom: '4px' }}>INSURANCE LINE IMPACTS</div>
        {INSURANCE_LINES.map(il => (
          <div key={il.line} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '1px solid #0a0f1a' }}>
            <span style={{ fontSize: '9px', color: '#94a3b8' }}>{il.line}</span>
            <span style={{ fontSize: '8px', padding: '1px 6px', borderRadius: '4px', backgroundColor: `${SEV_COLORS[il.severity]}20`, color: SEV_COLORS[il.severity] }}>{il.severity}</span>
          </div>
        ))}
      </div>

      {/* RULE_005 Integration */}
      {hasExtreme && (
        <div style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #f5a623', backgroundColor: '#f5a62310', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#f5a623' }}>RULE_005 — CAT MODEL UPDATE REQUIRED</div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>EXTREME anomaly detected in Rub al Khali zone</div>
          </div>
          <button
            onClick={() => console.log(`[AUDIT] RULE_005_CAT_UPDATE: ${new Date().toISOString()}`)}
            style={{ fontSize: '9px', padding: '4px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#f5a623', color: '#0a0f1a', fontWeight: 700, cursor: 'pointer', fontFamily: "'IBM Plex Mono'" }}
          >
            UPDATE CAT INPUTS
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(ClimateAnomaliesPanelInner);
