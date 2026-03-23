/**
 * DEEVO Intelligence Monitor — AI Forecasts Panel
 * Contract C10 / Panel 1 of 4
 * Layer: Models (L3) + UI (L6)
 *
 * Displays AI-generated risk forecasts for GCC insurance lines.
 * Model confidence scores, prediction windows, and drift indicators.
 */
import { useState, useEffect, memo } from 'react';

interface Forecast {
  id: string;
  model: string;
  target: string;
  prediction: string;
  confidence: number;
  horizon: string;
  drift: number;
  updatedAt: string;
}

const INITIAL_FORECASTS: Forecast[] = [
  { id: 'fc-001', model: 'DeevoRisk-v3', target: 'GCC Motor Claims Surge', prediction: '+12% Q2 2026', confidence: 0.87, horizon: '90d', drift: 0.02, updatedAt: '2026-03-23T08:00:00Z' },
  { id: 'fc-002', model: 'FraudNet-FRIN', target: 'Organized Fraud Ring Activity', prediction: 'ELEVATED → HIGH by Apr', confidence: 0.79, horizon: '30d', drift: 0.05, updatedAt: '2026-03-23T07:45:00Z' },
  { id: 'fc-003', model: 'CatModel-GCC', target: 'Dust Storm Frequency (UAE/Oman)', prediction: '3.2 events/month', confidence: 0.82, horizon: '60d', drift: 0.01, updatedAt: '2026-03-23T06:30:00Z' },
  { id: 'fc-004', model: 'PricingEngine-v2', target: 'Marine Hull Premium Trend', prediction: '+8.5% hardening', confidence: 0.74, horizon: '180d', drift: 0.08, updatedAt: '2026-03-22T22:00:00Z' },
  { id: 'fc-005', model: 'GeoPol-Sentinel', target: 'Hormuz Strait Disruption Risk', prediction: '34% probability', confidence: 0.71, horizon: '30d', drift: 0.03, updatedAt: '2026-03-23T09:15:00Z' },
  { id: 'fc-006', model: 'ClimateRisk-v1', target: 'Flash Flood (Jeddah Basin)', prediction: '22% next 14d', confidence: 0.68, horizon: '14d', drift: 0.12, updatedAt: '2026-03-23T05:00:00Z' },
];

const s = {
  container: { padding: '16px', fontFamily: "'IBM Plex Mono', monospace", color: '#e2e8f0', height: '100%', overflowY: 'auto' as const, background: '#0a0f1a' },
  header: { fontSize: '14px', fontWeight: 700, color: '#f5a623', marginBottom: '12px', textTransform: 'uppercase' as const, letterSpacing: '1.5px' },
  subtext: { fontSize: '11px', color: '#64748b', marginBottom: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '12px' },
  card: { background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px' },
  modelName: { fontSize: '10px', color: '#f5a623', fontWeight: 600, marginBottom: '4px' },
  target: { fontSize: '13px', color: '#e2e8f0', fontWeight: 600, marginBottom: '8px' },
  prediction: { fontSize: '15px', color: '#22d3ee', fontWeight: 700, marginBottom: '8px' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  label: { fontSize: '10px', color: '#64748b', textTransform: 'uppercase' as const },
  value: { fontSize: '11px', color: '#94a3b8' },
  bar: { height: '4px', borderRadius: '2px', background: '#1e293b', marginTop: '8px' },
  barFill: (pct: number, color: string) => ({ height: '4px', borderRadius: '2px', background: color, width: `${pct}%`, transition: 'width 0.5s ease' }),
  driftWarn: { fontSize: '10px', color: '#f59e0b', fontWeight: 600, marginTop: '6px' },
  driftOk: { fontSize: '10px', color: '#22c55e', marginTop: '6px' },
  footer: { marginTop: '16px', padding: '10px', background: '#111827', borderRadius: '6px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: '10px', color: '#64748b' },
  footerValue: { fontSize: '12px', color: '#e2e8f0', fontWeight: 600 },
};

function AIForecastsPanelInner() {
  const [forecasts, setForecasts] = useState<Forecast[]>(INITIAL_FORECASTS);

  useEffect(() => {
    const iv = setInterval(() => {
      setForecasts(prev => prev.map(f => ({
        ...f,
        confidence: Math.max(0.5, Math.min(0.99, f.confidence + (Math.random() - 0.5) * 0.02)),
        drift: Math.max(0, Math.min(0.2, f.drift + (Math.random() - 0.5) * 0.01)),
      })));
    }, 15000);
    return () => clearInterval(iv);
  }, []);

  const avgConf = forecasts.reduce((a, f) => a + f.confidence, 0) / forecasts.length;
  const driftAlerts = forecasts.filter(f => f.drift > 0.05).length;

  return (
    <div style={s.container}>
      <div style={s.header}>AI Forecasts — Model Predictions</div>
      <div style={s.subtext}>
        {forecasts.length} active models · Avg confidence {(avgConf * 100).toFixed(1)}% · {driftAlerts} drift alert{driftAlerts !== 1 ? 's' : ''}
      </div>
      <div style={s.grid}>
        {forecasts.map(f => {
          const confColor = f.confidence >= 0.8 ? '#22c55e' : f.confidence >= 0.7 ? '#f5a623' : '#ef4444';
          return (
            <div key={f.id} style={s.card}>
              <div style={s.modelName}>{f.model}</div>
              <div style={s.target}>{f.target}</div>
              <div style={s.prediction}>{f.prediction}</div>
              <div style={s.row}>
                <span style={s.label}>Confidence</span>
                <span style={{ ...s.value, color: confColor }}>{(f.confidence * 100).toFixed(1)}%</span>
              </div>
              <div style={s.bar}><div style={s.barFill(f.confidence * 100, confColor)} /></div>
              <div style={s.row}>
                <span style={s.label}>Horizon</span>
                <span style={s.value}>{f.horizon}</span>
              </div>
              <div style={s.row}>
                <span style={s.label}>Model Drift</span>
                <span style={s.value}>{(f.drift * 100).toFixed(1)}%</span>
              </div>
              {f.drift > 0.05
                ? <div style={s.driftWarn}>⚠ DRIFT ABOVE THRESHOLD — RETRAIN RECOMMENDED</div>
                : <div style={s.driftOk}>✓ Drift within tolerance</div>}
            </div>
          );
        })}
      </div>
      <div style={s.footer}>
        <div>
          <div style={s.footerLabel}>L7 GOVERNANCE</div>
          <div style={s.footerValue}>Human-in-loop required for confidence &lt; 70%</div>
        </div>
        <div style={{ fontSize: '10px', color: '#64748b' }}>
          Last refresh: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default memo(AIForecastsPanelInner);
