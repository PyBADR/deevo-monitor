/**
 * StagingCorridorMap — Fraud variant panel showing geographic staging corridors.
 * Displays known fraud hotspots as a list/table (map integration in GCCMap).
 */
import { useVariant } from '@/variants';

interface StagingCorridor {
  id: string;
  name: string;
  region: string;
  country: string;
  type: 'motor_staging' | 'medical_mill' | 'identity_cluster' | 'mixed';
  riskScore: number;     // 0-100
  activeCases: number;
  monthlyIncidents: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  coordinates: { lat: number; lng: number };
}

const CORRIDORS: StagingCorridor[] = [
  { id: 'sc-01', name: 'Riyadh South Industrial', region: 'Riyadh', country: 'SA', type: 'motor_staging', riskScore: 92, activeCases: 48, monthlyIncidents: 24, trend: 'increasing', coordinates: { lat: 24.55, lng: 46.72 } },
  { id: 'sc-02', name: 'Deira-Sharjah Corridor', region: 'Dubai-Sharjah', country: 'AE', type: 'motor_staging', riskScore: 87, activeCases: 36, monthlyIncidents: 18, trend: 'stable', coordinates: { lat: 25.27, lng: 55.33 } },
  { id: 'sc-03', name: 'Jeddah Medical District', region: 'Jeddah', country: 'SA', type: 'medical_mill', riskScore: 84, activeCases: 22, monthlyIncidents: 12, trend: 'increasing', coordinates: { lat: 21.54, lng: 39.17 } },
  { id: 'sc-04', name: 'Kuwait Salmiya Zone', region: 'Salmiya', country: 'KW', type: 'identity_cluster', riskScore: 78, activeCases: 14, monthlyIncidents: 8, trend: 'decreasing', coordinates: { lat: 29.33, lng: 48.08 } },
  { id: 'sc-05', name: 'Dammam Port Area', region: 'Dammam', country: 'SA', type: 'mixed', riskScore: 75, activeCases: 18, monthlyIncidents: 10, trend: 'stable', coordinates: { lat: 26.43, lng: 50.10 } },
  { id: 'sc-06', name: 'Manama Commercial', region: 'Manama', country: 'BH', type: 'motor_staging', riskScore: 71, activeCases: 8, monthlyIncidents: 5, trend: 'stable', coordinates: { lat: 26.23, lng: 50.59 } },
  { id: 'sc-07', name: 'Muscat Industrial', region: 'Muscat', country: 'OM', type: 'mixed', riskScore: 64, activeCases: 6, monthlyIncidents: 3, trend: 'decreasing', coordinates: { lat: 23.59, lng: 58.54 } },
  { id: 'sc-08', name: 'Doha West Bay', region: 'Doha', country: 'QA', type: 'identity_cluster', riskScore: 58, activeCases: 4, monthlyIncidents: 2, trend: 'stable', coordinates: { lat: 25.32, lng: 51.53 } },
];

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  motor_staging: { label: 'MOTOR STAGING', color: '#EF4444' },
  medical_mill: { label: 'MEDICAL MILL', color: '#F97316' },
  identity_cluster: { label: 'IDENTITY', color: '#8B5CF6' },
  mixed: { label: 'MIXED', color: '#F59E0B' },
};

function getRiskColor(score: number): string {
  if (score >= 85) return '#EF4444';
  if (score >= 70) return '#F97316';
  if (score >= 50) return '#F59E0B';
  return '#10B981';
}

export function StagingCorridorMap() {
  const { variant } = useVariant();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <span className="text-[10px] font-mono font-bold" style={{ color: variant.colors.primary }}>
          STAGING CORRIDORS
        </span>
        <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>
          {CORRIDORS.length} ACTIVE ZONES
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr style={{ borderBottom: `1px solid ${variant.colors.border}` }}>
              {['Corridor', 'Country', 'Type', 'Risk', 'Cases', 'Monthly', 'Trend'].map((h) => (
                <th key={h} className="text-left px-2 py-1.5 uppercase tracking-wider" style={{ color: variant.colors.textMuted }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CORRIDORS.map((c) => {
              const typeInfo = TYPE_LABELS[c.type] ?? TYPE_LABELS['mixed']!;
              return (
                <tr
                  key={c.id}
                  className="border-b hover:bg-white/[0.03] transition-colors"
                  style={{ borderColor: variant.colors.border }}
                >
                  <td className="px-2 py-1.5 font-bold" style={{ color: variant.colors.text }}>
                    {c.name}
                  </td>
                  <td className="px-2 py-1.5" style={{ color: variant.colors.textMuted }}>
                    {c.country}
                  </td>
                  <td className="px-2 py-1.5">
                    <span
                      className="text-[8px] px-1.5 py-0.5 rounded font-bold"
                      style={{ backgroundColor: `${typeInfo.color}20`, color: typeInfo.color }}
                    >
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: variant.colors.border }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${c.riskScore}%`, backgroundColor: getRiskColor(c.riskScore) }}
                        />
                      </div>
                      <span style={{ color: getRiskColor(c.riskScore) }}>{c.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-2 py-1.5" style={{ color: variant.colors.textSecondary }}>
                    {c.activeCases}
                  </td>
                  <td className="px-2 py-1.5" style={{ color: variant.colors.textSecondary }}>
                    {c.monthlyIncidents}
                  </td>
                  <td className="px-2 py-1.5">
                    <span style={{
                      color: c.trend === 'increasing' ? '#EF4444' : c.trend === 'decreasing' ? '#10B981' : variant.colors.textMuted,
                    }}>
                      {c.trend === 'increasing' ? '▲' : c.trend === 'decreasing' ? '▼' : '▬'} {c.trend}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
