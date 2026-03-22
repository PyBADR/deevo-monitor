/**
 * FraudRingTable — Active fraud rings table for Fraud variant.
 * Shows ring name, status, threat level, exposure, actors, typology.
 */
import { useVariant } from '@/variants';
import type { FraudRingEntry, Severity } from '@/kpi/kpi.types';

interface FraudRingTableProps {
  rings: FraudRingEntry[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: 'ACTIVE', color: '#EF4444' },
  monitoring: { label: 'MONITORING', color: '#F59E0B' },
  disrupted: { label: 'DISRUPTED', color: '#10B981' },
  prosecuted: { label: 'PROSECUTED', color: '#6B7280' },
};

const THREAT_COLORS: Record<Severity, string> = {
  normal: '#10B981',
  elevated: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
};

export function FraudRingTable({ rings }: FraudRingTableProps) {
  const { variant } = useVariant();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px] font-mono">
        <thead>
          <tr style={{ borderBottom: `1px solid ${variant.colors.border}` }}>
            {['Ring', 'Status', 'Threat', 'Claims', 'Exposure', 'Actors', 'Typology', 'Region'].map(
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
          {rings.map((ring) => {
            const status = STATUS_LABELS[ring.status] ?? STATUS_LABELS['active']!;
            return (
              <tr
                key={ring.id}
                className="border-b transition-colors hover:bg-white/[0.03]"
                style={{ borderColor: variant.colors.border }}
              >
                <td className="px-2 py-1.5 font-bold" style={{ color: variant.colors.text }}>
                  {ring.ringName}
                </td>
                <td className="px-2 py-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{ backgroundColor: `${status.color}20`, color: status.color }}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-2 py-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: THREAT_COLORS[ring.threatLevel] }}
                  />
                </td>
                <td className="px-2 py-1.5" style={{ color: variant.colors.textSecondary }}>
                  {ring.claimsLinked.toLocaleString()}
                </td>
                <td className="px-2 py-1.5 font-bold" style={{ color: '#EF4444' }}>
                  ${(ring.estimatedExposure / 1_000_000).toFixed(1)}M
                </td>
                <td className="px-2 py-1.5" style={{ color: variant.colors.textSecondary }}>
                  {ring.actors}
                </td>
                <td className="px-2 py-1.5" style={{ color: variant.colors.textMuted }}>
                  {ring.typology.replace(/_/g, ' ')}
                </td>
                <td className="px-2 py-1.5" style={{ color: variant.colors.textMuted }}>
                  {ring.region}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
