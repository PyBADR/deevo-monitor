/**
 * GCCStockTable — Tabular view of GCC insurance stocks for Finance variant.
 */
import { SparklineChart } from './SparklineChart';
import { useVariant } from '@/variants';
import type { StockQuote } from '@/kpi/kpi.types';

interface GCCStockTableProps {
  stocks: StockQuote[];
}

export function GCCStockTable({ stocks }: GCCStockTableProps) {
  const { variant } = useVariant();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px] font-mono">
        <thead>
          <tr style={{ borderBottom: `1px solid ${variant.colors.border}` }}>
            {['Symbol', 'Name', 'Exchange', 'Price', 'Change', 'Volume', 'Sector', 'Trend'].map(
              (h) => (
                <th
                  key={h}
                  className="text-left px-2 py-1.5 uppercase tracking-wider"
                  style={{ color: variant.colors.textMuted }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr
              key={s.symbol}
              className="border-b transition-colors hover:bg-white/[0.03]"
              style={{ borderColor: variant.colors.border }}
            >
              <td className="px-2 py-1.5 font-bold" style={{ color: variant.colors.primary }}>
                {s.symbol}
              </td>
              <td className="px-2 py-1.5" style={{ color: variant.colors.text }}>
                {s.name}
              </td>
              <td className="px-2 py-1.5" style={{ color: variant.colors.textMuted }}>
                {s.exchange}
              </td>
              <td className="px-2 py-1.5 font-bold" style={{ color: variant.colors.text }}>
                {s.price.toFixed(2)} {s.currency}
              </td>
              <td className="px-2 py-1.5">
                <span style={{ color: s.changePercent >= 0 ? '#10B981' : '#EF4444' }}>
                  {s.changePercent >= 0 ? '+' : ''}
                  {s.changePercent.toFixed(2)}%
                </span>
              </td>
              <td className="px-2 py-1.5" style={{ color: variant.colors.textSecondary }}>
                {(s.volume / 1000).toFixed(0)}K
              </td>
              <td className="px-2 py-1.5" style={{ color: variant.colors.textMuted }}>
                {s.sector}
              </td>
              <td className="px-2 py-1.5">
                <SparklineChart
                  data={s.sparkline}
                  color={s.changePercent >= 0 ? '#10B981' : '#EF4444'}
                  width={48}
                  height={14}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
