/**
 * FRINPanel — Fraud & Risk Intelligence Network overview panel.
 * Shows real-time fraud detection stats, active investigations, and alert feed.
 */
import { useVariant } from '@/variants';

interface FRINAlert {
  id: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  region: string;
}

const MOCK_ALERTS: FRINAlert[] = [
  { id: 'fa-001', timestamp: Date.now() - 120_000, severity: 'critical', type: 'RING_DETECTED', message: 'New organized fraud ring identified — 14 linked entities across Riyadh motor claims', region: 'SA' },
  { id: 'fa-002', timestamp: Date.now() - 340_000, severity: 'high', type: 'MEDICAL_MILL', message: 'Medical mill pattern detected — Provider ID P-4821 abnormal billing cluster', region: 'AE' },
  { id: 'fa-003', timestamp: Date.now() - 560_000, severity: 'high', type: 'IDENTITY', message: 'Synthetic identity cluster — 8 policies with shared biometric anomalies', region: 'KW' },
  { id: 'fa-004', timestamp: Date.now() - 780_000, severity: 'medium', type: 'INFLATED', message: 'Claim inflation pattern — 3σ deviation on repair costs for VIN cluster', region: 'SA' },
  { id: 'fa-005', timestamp: Date.now() - 980_000, severity: 'critical', type: 'CYBER', message: 'Deepfake document detected — AI-generated medical report in claim CL-98421', region: 'AE' },
  { id: 'fa-006', timestamp: Date.now() - 1_200_000, severity: 'medium', type: 'STAGING', message: 'Staged collision indicators — GPS trajectory analysis flags 4 recent motor claims', region: 'BH' },
  { id: 'fa-007', timestamp: Date.now() - 1_500_000, severity: 'high', type: 'PEP', message: 'PEP/Sanctions match — Policyholder on updated OFAC SDN list', region: 'QA' },
  { id: 'fa-008', timestamp: Date.now() - 1_800_000, severity: 'low', type: 'ANOMALY', message: 'Statistical anomaly — Unusual claim frequency in Muscat district 4', region: 'OM' },
];

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#6B7280',
};

export function FRINPanel() {
  const { variant } = useVariant();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with live stats */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#EF4444' }} />
          <span className="text-[10px] font-mono font-bold" style={{ color: variant.colors.primary }}>
            FRIN ALERT FEED
          </span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono">
          <StatBadge label="ACTIVE RINGS" value="34" color="#EF4444" />
          <StatBadge label="OPEN CASES" value="1,842" color="#F97316" />
          <StatBadge label="TODAY ALERTS" value="127" color="#F59E0B" />
          <StatBadge label="DETECTION %" value="78.4%" color="#10B981" />
        </div>
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto">
        {MOCK_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-2 px-3 py-2 border-b hover:bg-white/[0.03] transition-colors"
            style={{ borderColor: variant.colors.border }}
          >
            {/* Severity indicator */}
            <div className="shrink-0 mt-0.5">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: SEVERITY_COLORS[alert.severity] }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${SEVERITY_COLORS[alert.severity]}20`,
                    color: SEVERITY_COLORS[alert.severity],
                  }}
                >
                  {alert.severity.toUpperCase()}
                </span>
                <span
                  className="text-[8px] font-mono px-1 py-0.5 rounded"
                  style={{ backgroundColor: `${variant.colors.primary}15`, color: variant.colors.primary }}
                >
                  {alert.type}
                </span>
                <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>
                  {alert.region}
                </span>
              </div>
              <div className="text-[10px] font-mono" style={{ color: variant.colors.text }}>
                {alert.message}
              </div>
            </div>

            {/* Timestamp */}
            <span className="text-[8px] font-mono shrink-0" style={{ color: variant.colors.textMuted }}>
              {formatRelativeTime(alert.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
