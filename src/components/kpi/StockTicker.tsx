/**
 * StockTicker — Scrolling horizontal stock quote bar for Finance variant.
 * Renders GCC exchange stocks with price, change %, and mini sparkline.
 */
import { SparklineChart } from './SparklineChart';
import { useVariant } from '@/variants';
import type { StockQuote } from '@/kpi/kpi.types';

interface StockTickerProps {
  quotes: StockQuote[];
}

export function StockTicker({ quotes }: StockTickerProps) {
  const { variant } = useVariant();

  if (!quotes.length) return null;

  return (
    <div
      className="flex items-center gap-4 px-3 py-1.5 overflow-x-auto border-b"
      style={{ borderColor: variant.colors.border, backgroundColor: variant.colors.bg }}
    >
      <span className="text-[9px] font-mono uppercase shrink-0" style={{ color: variant.colors.textMuted }}>
        GCC MARKETS
      </span>
      <div className="w-px h-4 shrink-0" style={{ backgroundColor: variant.colors.border }} />
      {quotes.map((q) => (
        <div key={q.symbol} className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono font-bold" style={{ color: variant.colors.text }}>
            {q.symbol}
          </span>
          <span className="text-[10px] font-mono" style={{ color: variant.colors.textSecondary }}>
            {q.price.toFixed(2)}
          </span>
          <span
            className="text-[9px] font-mono"
            style={{ color: q.changePercent >= 0 ? '#10B981' : '#EF4444' }}
          >
            {q.changePercent >= 0 ? '▲' : '▼'} {Math.abs(q.changePercent).toFixed(2)}%
          </span>
          <SparklineChart
            data={q.sparkline}
            color={q.changePercent >= 0 ? '#10B981' : '#EF4444'}
            width={48}
            height={16}
          />
          <div className="w-px h-3" style={{ backgroundColor: variant.colors.border }} />
        </div>
      ))}
    </div>
  );
}
