/**
 * IFRS17Panel — IFRS 17 compliance metrics panel for Finance variant.
 * Shows CSM waterfall, risk adjustment, measurement model breakdown.
 */
import { useVariant } from '@/variants';

interface IFRS17Row {
  label: string;
  current: number;
  previous: number;
  unit: string;
  category: 'csm' | 'ra' | 'model' | 'disclosure';
}

const IFRS17_DATA: IFRS17Row[] = [
  { label: 'Opening CSM Balance', current: 7320, previous: 6840, unit: 'M USD', category: 'csm' },
  { label: 'New Business CSM', current: 1240, previous: 980, unit: 'M USD', category: 'csm' },
  { label: 'CSM Amortization', current: -680, previous: -620, unit: 'M USD', category: 'csm' },
  { label: 'Experience Adjustments', current: -180, previous: -140, unit: 'M USD', category: 'csm' },
  { label: 'Closing CSM Balance', current: 8400, previous: 7320, unit: 'M USD', category: 'csm' },
  { label: 'Risk Adjustment (% of BEL)', current: 6.8, previous: 6.7, unit: '%', category: 'ra' },
  { label: 'RA Confidence Level', current: 75, previous: 75, unit: '%', category: 'ra' },
  { label: 'RA Release', current: 420, previous: 380, unit: 'M USD', category: 'ra' },
  { label: 'BBA Contract Groups', current: 342, previous: 314, unit: '', category: 'model' },
  { label: 'PAA Eligible %', current: 71, previous: 70.5, unit: '%', category: 'model' },
  { label: 'VFA Groups', current: 28, previous: 24, unit: '', category: 'model' },
  { label: 'Onerous Contracts', current: 12, previous: 18, unit: '', category: 'model' },
  { label: 'GCC Adoption Rate', current: 94, previous: 88, unit: '%', category: 'disclosure' },
  { label: 'Audit Findings (IFRS 17)', current: 3, previous: 7, unit: '', category: 'disclosure' },
];

const CATEGORY_LABELS: Record<string, { title: string; icon: string }> = {
  csm: { title: 'Contractual Service Margin', icon: '📊' },
  ra: { title: 'Risk Adjustment', icon: '⚖️' },
  model: { title: 'Measurement Model', icon: '📐' },
  disclosure: { title: 'Disclosure & Compliance', icon: '📋' },
};

export function IFRS17Panel() {
  const { variant } = useVariant();
  const categories = ['csm', 'ra', 'model', 'disclosure'] as const;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <span className="text-[10px] font-mono font-bold" style={{ color: variant.colors.primary }}>
          IFRS 17 COMPLIANCE DASHBOARD
        </span>
        <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>
          Q4 2025 vs Q3 2025
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {categories.map((cat) => {
          const catInfo = CATEGORY_LABELS[cat]!;
          const rows = IFRS17_DATA.filter((r) => r.category === cat);
          return (
            <div key={cat}>
              <div
                className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: variant.colors.primary, backgroundColor: `${variant.colors.primary}08` }}
              >
                <span>{catInfo.icon}</span>
                <span>{catInfo.title}</span>
              </div>
              <table className="w-full text-[10px] font-mono">
                <tbody>
                  {rows.map((row) => {
                    const variance = row.current - row.previous;
                    const variancePct = row.previous !== 0 ? (variance / Math.abs(row.previous)) * 100 : 0;
                    return (
                      <tr
                        key={row.label}
                        className="border-b hover:bg-white/[0.03] transition-colors"
                        style={{ borderColor: variant.colors.border }}
                      >
                        <td className="px-3 py-1.5 w-1/3" style={{ color: variant.colors.text }}>
                          {row.label}
                        </td>
                        <td className="px-3 py-1.5 text-right font-bold" style={{ color: variant.colors.text }}>
                          {row.current.toLocaleString()}{row.unit ? ` ${row.unit}` : ''}
                        </td>
                        <td className="px-3 py-1.5 text-right" style={{ color: variant.colors.textMuted }}>
                          {row.previous.toLocaleString()}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <span
                            style={{
                              color: variance > 0 ? '#10B981' : variance < 0 ? '#EF4444' : variant.colors.textMuted,
                            }}
                          >
                            {variance > 0 ? '+' : ''}{variance.toLocaleString()}
                            {row.unit === '%' ? 'pp' : ''}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-right" style={{ color: variant.colors.textMuted }}>
                          {variancePct !== 0 ? `${variancePct > 0 ? '+' : ''}${variancePct.toFixed(1)}%` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
