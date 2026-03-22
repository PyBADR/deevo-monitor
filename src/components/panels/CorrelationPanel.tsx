/**
 * CorrelationPanel — Cross-stream correlation display (worldmonitor parity).
 * Shows detected signal convergence across military, economic, disaster, escalation streams.
 */
import { useMemo } from 'react';
import { useVariant } from '@/variants';
import { detectCorrelations, generateMockSignals, type Correlation } from '@/engines/correlation';

const STREAM_COLORS: Record<string, string> = {
  military: '#F87171',
  economic: '#FBBF24',
  disaster: '#FB923C',
  escalation: '#EF4444',
  cyber: '#A78BFA',
  regulatory: '#60A5FA',
  social: '#34D399',
};

export function CorrelationPanel() {
  const { variant } = useVariant();

  // Generate and detect correlations (replace with live data when API connected)
  const correlations = useMemo(() => {
    const signals = generateMockSignals(40);
    return detectCorrelations(signals);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-1.5 border-b shrink-0 flex items-center gap-3" style={{ borderColor: variant.colors.border }}>
        <span className="text-sm font-bold" style={{ color: variant.colors.text }}>
          CROSS-STREAM CORRELATION
        </span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${variant.colors.critical}20`, color: variant.colors.critical }}>
          {correlations.length} ACTIVE
        </span>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-2">
        {correlations.length === 0 ? (
          <div className="text-center py-8 text-[10px] font-mono" style={{ color: variant.colors.textMuted }}>
            No active correlations detected. Monitoring {7} streams.
          </div>
        ) : (
          correlations.map((corr) => (
            <CorrelationCard key={corr.id} correlation={corr} variant={variant} />
          ))
        )}
      </div>
    </div>
  );
}

function CorrelationCard({ correlation, variant }: { correlation: Correlation; variant: any }) {
  const streams = [...new Set(correlation.signals.map((s) => s.stream))];
  const scoreColor = correlation.convergenceScore >= 70 ? variant.colors.critical :
    correlation.convergenceScore >= 50 ? variant.colors.warning : variant.colors.primary;

  return (
    <div className="rounded border p-2" style={{ borderColor: variant.colors.border, backgroundColor: `${variant.colors.bg}80` }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {streams.map((s) => (
            <span
              key={s}
              className="text-[8px] font-mono px-1 py-0.5 rounded"
              style={{ backgroundColor: `${STREAM_COLORS[s]}20`, color: STREAM_COLORS[s] }}
            >
              {s.toUpperCase()}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold font-mono" style={{ color: scoreColor }}>
            {correlation.convergenceScore}
          </span>
          <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>score</span>
        </div>
      </div>

      {/* Convergence bar */}
      <div className="w-full h-1.5 rounded-full mb-1.5" style={{ backgroundColor: variant.colors.border }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${correlation.convergenceScore}%`, backgroundColor: scoreColor }}
        />
      </div>

      {/* Details */}
      <div className="text-[9px] font-mono" style={{ color: variant.colors.textSecondary }}>
        {correlation.signals.length} signals · {correlation.regions.join(', ')} · r={Math.round(correlation.spatialRadius)}km
      </div>
      <div className="text-[9px] font-mono mt-0.5" style={{ color: variant.colors.textMuted }}>
        P(escalation): {(correlation.escalationProbability * 100).toFixed(1)}%
      </div>
    </div>
  );
}
