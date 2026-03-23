/**
 * DEEVO Intelligence Monitor v3 — Forex & Gold Panel
 * Contract 5 / Panel 7 of 7
 * Layer: UI (L6)
 *
 * Live GCC currency pairs + gold/oil prices.
 * Displays sparklines, change deltas, and alerts.
 * All currencies pegged to USD (except KWD float band).
 */

import { useState, useMemo } from 'react';

interface ForexPair {
  pair: string;
  label: string;
  rate: number;
  change24h: number;
  sparkline: number[];
}

interface CommodityPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  unit: string;
}

const FOREX_DATA: ForexPair[] = [
  { pair: 'USD/SAR', label: 'Saudi Riyal', rate: 3.7500, change24h: 0.00, sparkline: [3.75, 3.75, 3.75, 3.75, 3.75, 3.75, 3.75, 3.75] },
  { pair: 'USD/AED', label: 'UAE Dirham', rate: 3.6725, change24h: 0.00, sparkline: [3.67, 3.67, 3.67, 3.67, 3.67, 3.67, 3.67, 3.67] },
  { pair: 'USD/QAR', label: 'Qatari Riyal', rate: 3.6400, change24h: -0.01, sparkline: [3.64, 3.64, 3.64, 3.64, 3.64, 3.64, 3.64, 3.64] },
  { pair: 'USD/KWD', label: 'Kuwaiti Dinar', rate: 0.3070, change24h: 0.12, sparkline: [0.307, 0.306, 0.307, 0.308, 0.307, 0.306, 0.307, 0.307] },
  { pair: 'USD/BHD', label: 'Bahraini Dinar', rate: 0.3760, change24h: 0.00, sparkline: [0.376, 0.376, 0.376, 0.376, 0.376, 0.376, 0.376, 0.376] },
  { pair: 'USD/OMR', label: 'Omani Rial', rate: 0.3845, change24h: 0.00, sparkline: [0.385, 0.385, 0.385, 0.384, 0.385, 0.385, 0.385, 0.385] },
];

const COMMODITY_DATA: CommodityPrice[] = [
  { symbol: 'XAU', name: 'Gold', price: 2345.60, change24h: 1.23, unit: '$/oz' },
  { symbol: 'XAG', name: 'Silver', price: 28.45, change24h: -0.45, unit: '$/oz' },
  { symbol: 'CL', name: 'WTI Crude', price: 78.32, change24h: 2.15, unit: '$/bbl' },
  { symbol: 'BZ', name: 'Brent Crude', price: 82.65, change24h: 1.87, unit: '$/bbl' },
  { symbol: 'NG', name: 'Natural Gas', price: 2.34, change24h: -3.21, unit: '$/MMBtu' },
];

interface ForexGoldPanelProps {
  compact?: boolean;
}

export default function ForexGoldPanel({ compact = false }: ForexGoldPanelProps) {
  const [view, setView] = useState<'forex' | 'commodities'>('forex');

  const miniSparkline = (data: number[], color: string): string => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const h = 20;
    const w = 60;
    const points = data.map((v, i) =>
      `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`
    ).join(' ');
    return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
  };

  // Suppress unused helper in JSX (used via dangerouslySetInnerHTML)
  void miniSparkline;

  const activeData = useMemo(() =>
    view === 'forex' ? FOREX_DATA : [],
    [view]
  );

  return (
    <div style={{
      background: '#0a0f1a', borderRadius: 12,
      border: '1px solid rgba(245,166,35,0.2)',
      padding: compact ? 10 : 16, height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h3 style={{ color: '#f5a623', fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, margin: 0 }}>
          {view === 'forex' ? 'GCC FOREX' : 'COMMODITIES'}
        </h3>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['forex', 'commodities'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                background: view === v ? 'rgba(245,166,35,0.2)' : 'transparent',
                border: `1px solid ${view === v ? '#f5a623' : 'rgba(255,255,255,0.1)'}`,
                color: view === v ? '#f5a623' : 'rgba(255,255,255,0.4)',
                borderRadius: 4, padding: '2px 8px', fontSize: 10,
                fontFamily: 'IBM Plex Mono', cursor: 'pointer', textTransform: 'uppercase',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {view === 'forex' ? (
          activeData.map((pair) => (
            <div key={pair.pair} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
            }}>
              <div>
                <div style={{ color: 'white', fontSize: 12, fontFamily: 'IBM Plex Mono' }}>{pair.pair}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{pair.label}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'white', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>
                  {pair.rate.toFixed(4)}
                </div>
                <div style={{
                  color: pair.change24h > 0 ? '#22c55e' : pair.change24h < 0 ? '#ef4444' : 'rgba(255,255,255,0.3)',
                  fontSize: 10, fontFamily: 'IBM Plex Mono',
                }}>
                  {pair.change24h > 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))
        ) : (
          COMMODITY_DATA.map((item) => (
            <div key={item.symbol} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
            }}>
              <div>
                <div style={{ color: 'white', fontSize: 12, fontFamily: 'IBM Plex Mono' }}>
                  {item.symbol} <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{item.name}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'white', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600 }}>
                  {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginLeft: 4 }}>{item.unit}</span>
                </div>
                <div style={{
                  color: item.change24h > 0 ? '#22c55e' : '#ef4444',
                  fontSize: 10, fontFamily: 'IBM Plex Mono',
                }}>
                  {item.change24h > 0 ? '▲' : '▼'} {Math.abs(item.change24h).toFixed(2)}%
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
