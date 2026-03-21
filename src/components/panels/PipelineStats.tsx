/**
 * PipelineStats — KPI cards showing insurance pipeline metrics.
 * FNOL volume, fraud rate, STP rate, GWP, active policies, open claims.
 */
import { useDataStore } from "@/stores/dataStore";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

function StatCard({ label, value, sub, color = "text-gray-200" }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className="text-[10px] text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <span className={`text-lg font-semibold font-mono ${color}`}>{value}</span>
      {sub && <span className="text-[10px] text-gray-600">{sub}</span>}
    </div>
  );
}

export function PipelineStats() {
  const stats = useDataStore((s) => s.pipelineStats);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 gap-2 p-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="stat-card animate-pulse">
            <div className="h-3 bg-surface-3 rounded w-16" />
            <div className="h-6 bg-surface-3 rounded w-12 mt-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      <StatCard
        label="FNOL 24h"
        value={stats.fnolVolume24h.toLocaleString()}
        sub="First Notice of Loss"
        color="text-accent-cyan"
      />
      <StatCard
        label="Fraud Rate"
        value={`${(stats.fraudDetectionRate * 100).toFixed(1)}%`}
        sub="Detection rate"
        color={stats.fraudDetectionRate > 0.15 ? "text-red-400" : "text-accent-emerald"}
      />
      <StatCard
        label="STP Rate"
        value={`${(stats.stpRate * 100).toFixed(1)}%`}
        sub="Straight-through"
        color="text-accent-emerald"
      />
      <StatCard
        label="GWP"
        value={`${(stats.gwpTotal / 1e9).toFixed(2)}B`}
        sub="Gross Written Premium"
      />
      <StatCard
        label="Policies"
        value={`${(stats.activePolicies / 1e6).toFixed(2)}M`}
        sub="Active"
      />
      <StatCard
        label="Claims"
        value={stats.openClaims.toLocaleString()}
        sub={`Avg ${stats.avgClaimCycleHours.toFixed(0)}h cycle`}
        color="text-accent-amber"
      />
    </div>
  );
}
