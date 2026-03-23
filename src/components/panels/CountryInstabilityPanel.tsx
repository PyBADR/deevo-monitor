/**
 * DEEVO Intelligence Monitor — Country Instability Index
 * Contract C10 / Panel 2 of 4
 * Layer: Features (L2) + UI (L6)
 *
 * Composite instability scores for GCC + MENA countries.
 * Aggregates political, economic, security, and climate risk factors.
 */
import { useState, useEffect, memo } from 'react';

interface CountryRisk {
  code: string;
  name: string;
  score: number;
  political: number;
  economic: number;
  security: number;
  climate: number;
  trend: 'rising' | 'stable' | 'falling';
  lastEvent: string;
}

const COUNTRIES: CountryRisk[] = [
  { code: 'YE', name: 'Yemen', score: 91, political: 95, economic: 88, security: 94, climate: 72, trend: 'rising', lastEvent: 'Houthi naval escalation' },
  { code: 'SY', name: 'Syria', score: 85, political: 90, economic: 82, security: 88, climate: 65, trend: 'stable', lastEvent: 'Refugee return program stall' },
  { code: 'IQ', name: 'Iraq', score: 72, political: 75, economic: 68, security: 78, climate: 60, trend: 'falling', lastEvent: 'Kurdish autonomy talks' },
  { code: 'IR', name: 'Iran', score: 68, political: 72, economic: 70, security: 65, climate: 55, trend: 'rising', lastEvent: 'Sanctions tightening' },
  { code: 'LB', name: 'Lebanon', score: 65, political: 68, economic: 75, security: 58, climate: 48, trend: 'stable', lastEvent: 'IMF reform deadline' },
  { code: 'SA', name: 'Saudi Arabia', score: 22, political: 18, economic: 15, security: 25, climate: 42, trend: 'stable', lastEvent: 'Vision 2030 milestone' },
  { code: 'AE', name: 'UAE', score: 15, political: 12, economic: 10, security: 14, climate: 38, trend: 'stable', lastEvent: 'COP33 preparation' },
  { code: 'QA', name: 'Qatar', score: 18, political: 15, economic: 12, security: 16, climate: 40, trend: 'falling', lastEvent: 'LNG expansion deal' },
  { code: 'KW', name: 'Kuwait', score: 28, political: 32, economic: 22, security: 20, climate: 45, trend: 'stable', lastEvent: 'Parliament dissolution' },
  { code: 'BH', name: 'Bahrain', score: 25, political: 28, economic: 25, security: 18, climate: 35, trend: 'falling', lastEvent: 'Fintech regulation update' },
  { code: 'OM', name: 'Oman', score: 20, political: 15, economic: 18, security: 15, climate: 42, trend: 'stable', lastEvent: 'Duqm port expansion' },
];

const s = {
  container: { padding: '16px', fontFamily: "'IBM Plex Mono', monospace", color: '#e2e8f0', height: '100%', overflowY: 'auto' as const, background: '#0a0f1a' },
  header: { fontSize: '14px', fontWeight: 700, color: '#f5a623', marginBottom: '12px', textTransform: 'uppercase' as const, letterSpacing: '1.5px' },
  subtext: { fontSize: '11px', color: '#64748b', marginBottom: '16px' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '11px' },
  th: { textAlign: 'left' as const, padding: '8px 6px', color: '#64748b', borderBottom: '1px solid #1e293b', fontSize: '10px', textTransform: 'uppercase' as const },
  td: { padding: '8px 6px', borderBottom: '1px solid #111827' },
  scoreCell: (score: number) => ({
    padding: '8px 6px', borderBottom: '1px solid #111827', fontWeight: 700,
    color: score >= 80 ? '#ef4444' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f5a623' : '#22c55e',
  }),
  miniBar: { display: 'inline-block', height: '6px', borderRadius: '3px', marginRight: '3px' },
  trendUp: { color: '#ef4444', fontSize: '10px' },
  trendStable: { color: '#64748b', fontSize: '10px' },
  trendDown: { color: '#22c55e', fontSize: '10px' },
  legend: { display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap' as const },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#94a3b8' },
  legendDot: (color: string) => ({ width: '8px', height: '8px', borderRadius: '50%', background: color }),
  footer: { marginTop: '14px', padding: '10px', background: '#111827', borderRadius: '6px', border: '1px solid #1e293b', fontSize: '10px', color: '#64748b' },
};

function CountryInstabilityPanelInner() {
  const [countries, setCountries] = useState<CountryRisk[]>(COUNTRIES);

  useEffect(() => {
    const iv = setInterval(() => {
      setCountries(prev => prev.map(c => ({
        ...c,
        score: Math.max(5, Math.min(99, c.score + Math.round((Math.random() - 0.5) * 3))),
        political: Math.max(5, Math.min(99, c.political + Math.round((Math.random() - 0.5) * 2))),
        economic: Math.max(5, Math.min(99, c.economic + Math.round((Math.random() - 0.5) * 2))),
        security: Math.max(5, Math.min(99, c.security + Math.round((Math.random() - 0.5) * 2))),
      })));
    }, 12000);
    return () => clearInterval(iv);
  }, []);

  const critical = countries.filter(c => c.score >= 70).length;
  const elevated = countries.filter(c => c.score >= 40 && c.score < 70).length;

  return (
    <div style={s.container}>
      <div style={s.header}>Country Instability Index — GCC + MENA</div>
      <div style={s.subtext}>
        {countries.length} countries monitored · {critical} critical · {elevated} elevated · Composite score: political + economic + security + climate
      </div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Country</th>
            <th style={s.th}>Score</th>
            <th style={s.th}>Pol</th>
            <th style={s.th}>Econ</th>
            <th style={s.th}>Sec</th>
            <th style={s.th}>Clim</th>
            <th style={s.th}>Trend</th>
            <th style={s.th}>Last Event</th>
          </tr>
        </thead>
        <tbody>
          {[...countries].sort((a, b) => b.score - a.score).map(c => (
            <tr key={c.code}>
              <td style={s.td}><span style={{ fontWeight: 600 }}>{c.code}</span> {c.name}</td>
              <td style={s.scoreCell(c.score)}>{c.score}/100</td>
              <td style={s.td}>
                <span style={s.miniBar}>{c.political}</span>
                <div style={{ ...s.miniBar, width: `${c.political * 0.5}px`, background: '#ef4444' }} />
              </td>
              <td style={s.td}>
                <span style={s.miniBar}>{c.economic}</span>
                <div style={{ ...s.miniBar, width: `${c.economic * 0.5}px`, background: '#f59e0b' }} />
              </td>
              <td style={s.td}>
                <span style={s.miniBar}>{c.security}</span>
                <div style={{ ...s.miniBar, width: `${c.security * 0.5}px`, background: '#8b5cf6' }} />
              </td>
              <td style={s.td}>{c.climate}</td>
              <td style={s.td}>
                {c.trend === 'rising' && <span style={s.trendUp}>▲ Rising</span>}
                {c.trend === 'stable' && <span style={s.trendStable}>→ Stable</span>}
                {c.trend === 'falling' && <span style={s.trendDown}>▼ Falling</span>}
              </td>
              <td style={{ ...s.td, fontSize: '10px', color: '#94a3b8', maxWidth: '160px' }}>{c.lastEvent}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={s.legend}>
        <div style={s.legendItem}><div style={s.legendDot('#ef4444')} /> Political</div>
        <div style={s.legendItem}><div style={s.legendDot('#f59e0b')} /> Economic</div>
        <div style={s.legendItem}><div style={s.legendDot('#8b5cf6')} /> Security</div>
        <div style={s.legendItem}><div style={s.legendDot('#22d3ee')} /> Climate</div>
      </div>
      <div style={s.footer}>
        L7 Governance: Countries with score ≥ 80 trigger automatic underwriting hold (RULE_007). Human approval required to resume.
      </div>
    </div>
  );
}

export default memo(CountryInstabilityPanelInner);
