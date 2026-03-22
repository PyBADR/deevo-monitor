/**
 * ReinsuranceFlowViz — Sankey-style visualization of reinsurance flows
 * between GCC cedants and global reinsurers.
 */
import { useVariant } from '@/variants';

interface ReinsuranceFlow {
  cedant: string;
  reinsurer: string;
  cededPremium: number;
  treatyType: string;
}

const FLOWS: ReinsuranceFlow[] = [
  { cedant: 'Tawuniya', reinsurer: 'Swiss Re', cededPremium: 420, treatyType: 'QS' },
  { cedant: 'Tawuniya', reinsurer: 'Munich Re', cededPremium: 310, treatyType: 'XL' },
  { cedant: 'Bupa Arabia', reinsurer: 'Hannover Re', cededPremium: 280, treatyType: 'QS' },
  { cedant: 'Orient', reinsurer: 'Swiss Re', cededPremium: 190, treatyType: 'XL' },
  { cedant: 'Orient', reinsurer: 'SCOR', cededPremium: 140, treatyType: 'SL' },
  { cedant: 'AXA Gulf', reinsurer: 'AXA XL', cededPremium: 220, treatyType: 'QS' },
  { cedant: 'Oman Insurance', reinsurer: 'Lloyd\'s', cededPremium: 165, treatyType: 'XL' },
  { cedant: 'Gulf Insurance', reinsurer: 'Munich Re', cededPremium: 130, treatyType: 'QS' },
  { cedant: 'Solidarity', reinsurer: 'Gen Re', cededPremium: 95, treatyType: 'XL' },
  { cedant: 'QIC', reinsurer: 'PartnerRe', cededPremium: 180, treatyType: 'Cat XL' },
];

const TREATY_COLORS: Record<string, string> = {
  QS: '#10B981',
  XL: '#3B82F6',
  SL: '#F59E0B',
  'Cat XL': '#EF4444',
};

export function ReinsuranceFlowViz() {
  const { variant } = useVariant();
  const totalCeded = FLOWS.reduce((s, f) => s + f.cededPremium, 0);

  // Group by cedant and reinsurer for summary
  const cedants = [...new Set(FLOWS.map((f) => f.cedant))];
  const reinsurers = [...new Set(FLOWS.map((f) => f.reinsurer))];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <span className="text-[10px] font-mono font-bold" style={{ color: variant.colors.primary }}>
          REINSURANCE FLOWS
        </span>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>
            TOTAL CEDED: <span style={{ color: variant.colors.text }}>${totalCeded}M</span>
          </span>
          <div className="flex items-center gap-2">
            {Object.entries(TREATY_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flow table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr style={{ borderBottom: `1px solid ${variant.colors.border}` }}>
              {['Cedant', 'Reinsurer', 'Treaty', 'Ceded Premium', 'Share'].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-1.5 uppercase tracking-wider"
                  style={{ color: variant.colors.textMuted }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...FLOWS].sort((a, b) => b.cededPremium - a.cededPremium).map((flow, i) => (
              <tr
                key={i}
                className="border-b hover:bg-white/[0.03] transition-colors"
                style={{ borderColor: variant.colors.border }}
              >
                <td className="px-3 py-1.5 font-bold" style={{ color: variant.colors.text }}>
                  {flow.cedant}
                </td>
                <td className="px-3 py-1.5" style={{ color: variant.colors.textSecondary }}>
                  {flow.reinsurer}
                </td>
                <td className="px-3 py-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{
                      backgroundColor: `${TREATY_COLORS[flow.treatyType] ?? variant.colors.primary}20`,
                      color: TREATY_COLORS[flow.treatyType] ?? variant.colors.primary,
                    }}
                  >
                    {flow.treatyType}
                  </span>
                </td>
                <td className="px-3 py-1.5 font-bold" style={{ color: variant.colors.text }}>
                  ${flow.cededPremium}M
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: variant.colors.border }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(flow.cededPremium / (FLOWS[0]?.cededPremium ?? 1)) * 100}%`,
                          backgroundColor: variant.colors.primary,
                        }}
                      />
                    </div>
                    <span style={{ color: variant.colors.textMuted }}>
                      {((flow.cededPremium / totalCeded) * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary bar */}
      <div
        className="flex items-center justify-between px-3 py-1 border-t shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>
          {cedants.length} CEDANTS → {reinsurers.length} REINSURERS
        </span>
        <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>
          {FLOWS.length} TREATIES
        </span>
      </div>
    </div>
  );
}
