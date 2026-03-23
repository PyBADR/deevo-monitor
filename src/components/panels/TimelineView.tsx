/**
 * DEEVO Intelligence Monitor v3 — Timeline / Forecast View
 * Contract 5 / Panel 3 of 7
 * Layer: UI (L6)
 *
 * Multi-series timeline with 4 data streams:
 *   - Signal volume (area chart)
 *   - Risk score trend (line)
 *   - Correlation match events (scatter)
 *   - Forecast projection (dashed line)
 *
 * Uses SVG for crisp rendering at any resolution.
 * Design: Gulf Amber accent, IBM Plex Mono for data.
 */

import { useState, useMemo } from 'react';
import type { IntelSignal } from '../../types/signals';

interface TimelineViewProps {
  signals?: IntelSignal[];
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
  onTimeRangeChange?: (range: string) => void;
}

// ── Generate mock time series for demo ───────────────────
const generateTimeSeries = (points: number, base: number, variance: number): number[] => {
  const data: number[] = [];
  let value = base;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.48) * variance;
    value = Math.max(0, Math.min(100, value));
    data.push(value);
  }
  return data;
};

function TimelineViewInner({
  signals = [],
  timeRange = '24h',
  onTimeRangeChange,
}: TimelineViewProps) {
  const [activeSeries, setActiveSeries] = useState<Set<string>>(
    new Set(['signals', 'risk', 'correlations', 'forecast'])
  );

  const POINTS = 48;
  const W = 700;
  const H = 250;
  const PAD = { top: 20, right: 20, bottom: 30, left: 45 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  // Generate data series
  const data = useMemo(() => ({
    signals: generateTimeSeries(POINTS, 40, 15),
    risk: generateTimeSeries(POINTS, 55, 8),
    correlations: generateTimeSeries(POINTS, 20, 25),
    forecast: generateTimeSeries(POINTS, 50, 10),
  }), []);

  const seriesConfig = {
    signals: { color: '#3b82f6', label: 'Signal Volume', type: 'area' as const },
    risk: { color: '#ef4444', label: 'Risk Score', type: 'line' as const },
    correlations: { color: '#f5a623', label: 'Correlations', type: 'scatter' as const },
    forecast: { color: '#22c55e', label: 'Forecast', type: 'dashed' as const },
  };

  const toX = (i: number): number => PAD.left + (i / (POINTS - 1)) * plotW;
  const toY = (v: number): number => PAD.top + plotH - (v / 100) * plotH;

  const toggleSeries = (key: string) => {
    setActiveSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const buildPath = (values: number[]): string =>
    values.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');

  const buildAreaPath = (values: number[]): string => {
    const line = buildPath(values);
    return `${line} L${toX(values.length - 1)},${toY(0)} L${toX(0)},${toY(0)} Z`;
  };

  return (
    <div style={{
      background: '#0a0f1a',
      borderRadius: 12,
      border: '1px solid rgba(245,166,35,0.2)',
      padding: 16,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ color: '#f5a623', fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, margin: 0 }}>
          TIMELINE / FORECAST
        </h3>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['1h', '6h', '24h', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => onTimeRangeChange?.(r)}
              style={{
                background: timeRange === r ? 'rgba(245,166,35,0.2)' : 'transparent',
                border: `1px solid ${timeRange === r ? '#f5a623' : 'rgba(255,255,255,0.1)'}`,
                color: timeRange === r ? '#f5a623' : 'rgba(255,255,255,0.4)',
                borderRadius: 4, padding: '2px 8px', fontSize: 10,
                fontFamily: 'IBM Plex Mono, monospace', cursor: 'pointer',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Series Legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        {Object.entries(seriesConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => toggleSeries(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              opacity: activeSeries.has(key) ? 1 : 0.3,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }}>
              {cfg.label}
            </span>
          </button>
        ))}
      </div>

      {/* SVG Chart */}
      <div style={{ flex: 1 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={PAD.left} y1={toY(v)} x2={W - PAD.right} y2={toY(v)} stroke="rgba(255,255,255,0.05)" />
              <text x={PAD.left - 8} y={toY(v) + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="IBM Plex Mono">
                {v}
              </text>
            </g>
          ))}

          {/* Area chart — signals */}
          {activeSeries.has('signals') && (
            <path d={buildAreaPath(data.signals)} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth={1.5} />
          )}

          {/* Line — risk */}
          {activeSeries.has('risk') && (
            <path d={buildPath(data.risk)} fill="none" stroke="#ef4444" strokeWidth={2} />
          )}

          {/* Dashed — forecast */}
          {activeSeries.has('forecast') && (
            <path d={buildPath(data.forecast)} fill="none" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="6,4" />
          )}

          {/* Scatter — correlations */}
          {activeSeries.has('correlations') && data.correlations.map((v, i) => (
            v > 40 ? (
              <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill="#f5a623" opacity={0.8} />
            ) : null
          ))}
        </svg>
      </div>

      {/* Footer stats */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '8px 0 0', borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)',
      }}>
        <span>{signals.length} signals ingested</span>
        <span>Range: {timeRange}</span>
        <span>{activeSeries.size}/4 series active</span>
      </div>
    </div>
  );
}

export default memo(TimelineViewInner);
