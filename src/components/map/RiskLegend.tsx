/**
 * RiskLegend — Bottom map legend (worldmonitor parity).
 * Shows: High Alert, Elevated, Monitoring, Base, Nuclear, Datacenter, Aircraft severity scale.
 *
 * Architecture Layer: UI (L6)
 */

export function RiskLegend() {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 glass-panel px-4 py-2 flex gap-4 items-center">
      <span className="text-[9px] text-gray-500 uppercase tracking-wider font-mono font-bold">
        LEGEND
      </span>
      <div className="flex gap-3 items-center">
        {[
          { label: 'High Alert', color: '#FF2D55' },
          { label: 'Elevated', color: '#FF6B35' },
          { label: 'Monitoring', color: '#FFD600' },
          { label: 'Base', color: '#34C759' },
          { label: 'Nuclear', color: '#AF52DE' },
          { label: 'Datacenter', color: '#5AC8FA' },
          { label: 'Aircraft', color: '#64D2FF' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[8px] text-gray-400 font-mono">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
