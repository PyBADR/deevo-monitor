/**
 * MarketTickerBar — Scrolling market indices ticker for Finance variant.
 * Shows GCC exchange indices with real-time-style updates.
 */
import { useVariant } from '@/variants';

interface IndexQuote {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// Mock data — in production sourced from /api/stocks endpoint
const GCC_INDICES: IndexQuote[] = [
  { symbol: 'TASI', name: 'Tadawul', value: 12847.32, change: 178.4, changePercent: 1.41 },
  { symbol: 'ADI', name: 'Abu Dhabi', value: 9234.18, change: 73.2, changePercent: 0.80 },
  { symbol: 'DFM', name: 'Dubai', value: 4412.56, change: -13.8, changePercent: -0.31 },
  { symbol: 'BK', name: 'Boursa Kuwait', value: 7891.44, change: 39.4, changePercent: 0.50 },
  { symbol: 'MSM30', name: 'Muscat', value: 4623.71, change: 4.6, changePercent: 0.10 },
  { symbol: 'BAX', name: 'Bahrain', value: 1987.23, change: 7.9, changePercent: 0.40 },
  { symbol: 'QSE', name: 'Qatar', value: 10542.88, change: -22.1, changePercent: -0.21 },
  { symbol: 'BRENT', name: 'Brent Crude', value: 82.47, change: 1.23, changePercent: 1.51 },
  { symbol: 'GOLD', name: 'Gold', value: 3042.60, change: 18.40, changePercent: 0.61 },
];

export function MarketTickerBar() {
  const { variant } = useVariant();

  return (
    <div
      className="h-7 flex items-center gap-6 px-3 overflow-x-auto border-b shrink-0"
      style={{
        backgroundColor: variant.colors.bg,
        borderColor: variant.colors.border,
      }}
    >
      <span className="text-[9px] font-mono font-bold shrink-0" style={{ color: variant.colors.primary }}>
        MARKETS
      </span>
      <div className="w-px h-3.5 shrink-0" style={{ backgroundColor: variant.colors.border }} />
      {GCC_INDICES.map((idx) => (
        <div key={idx.symbol} className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] font-mono font-bold" style={{ color: variant.colors.textSecondary }}>
            {idx.symbol}
          </span>
          <span className="text-[9px] font-mono" style={{ color: variant.colors.text }}>
            {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span
            className="text-[8px] font-mono"
            style={{ color: idx.changePercent >= 0 ? '#10B981' : '#EF4444' }}
          >
            {idx.changePercent >= 0 ? '▲' : '▼'}
            {Math.abs(idx.changePercent).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}
