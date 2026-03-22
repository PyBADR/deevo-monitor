/**
 * KPICard — Single metric card with value, trend arrow, sparkline, severity indicator.
 */
import { SparklineChart } from './SparklineChart';
import { useVariant } from '@/variants';
import type { KPIMetric, Severity } from '@/kpi/kpi.types';

interface KPICardProps {
  metric: KPIMetric;
}

const SEVERITY_COLORS: Record<Severity, string> = {
  normal: '#10B981',
  elevated: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
};

const TREND_ICONS: Record<string, string> = {
  up: '▲',
  down: '▼',
  flat: '▬',
};

export function KPICard({ metric }: KPICardProps) {
  const { variant } = useVariant();
  const severityColor = SEVERITY_COLORS[metric.severity];

  return (
    <div
      className="flex flex-col gap-1 p-2.5 rounded-lg border transition-colors hover:bg-white/[0.03]"
      style={{ borderColor: variant.colors.border }}
    >
      {/* Header: label + severity dot */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10px] font-mono uppercase tracking-wide truncate"
          style={{ color: variant.colors.textMuted }}
        >
          {metric.label}
        </span>
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: severityColor }}
          title={metric.severity}
        />
      </div>

      {/* Value row */}
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-lg font-bold font-mono leading-none"
            style={{ color: variant.colors.text }}
          >
            {typeof metric.value === 'number'
              ? metric.value.toLocaleString('en-US', { maximumFractionDigits: 2 })
              : metric.value}
          </span>
          {metric.unit && (
            <span
              className="text-[9px] font-mono uppercase"
              style={{ color: variant.colors.textMuted }}
            >
              {metric.unit}
            </span>
          )}
        </div>
        <SparklineChart data={metric.sparkline} color={variant.colors.primary} width={64} height={20} />
      </div>

      {/* Trend row */}
      <div className="flex items-center gap-1.5">
        <span
          className="text-[9px] font-mono"
          style={{
            color:
              metric.trend === 'up'
                ? '#10B981'
                : metric.trend === 'down'
                  ? '#EF4444'
                  : variant.colors.textMuted,
          }}
        >
          {TREND_ICONS[metric.trend]} {metric.trendValue}
        </span>
        {metric.source && (
          <span className="text-[8px] ml-auto" style={{ color: variant.colors.textMuted }}>
            {metric.source}
          </span>
        )}
      </div>
    </div>
  );
}
