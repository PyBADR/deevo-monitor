/**
 * RiskLegend — Bottom map legend showing DRI scale, hotspot severity, and claim types.
 */
import { DRI_CONFIG, type DRILevel } from "@/types/risk.types";

export function RiskLegend() {
  return (
    <div className="absolute bottom-3 left-3 z-10 glass-panel px-3 py-2 flex gap-6 items-center">
      {/* DRI scale */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-gray-500 uppercase tracking-wider font-mono">
          DRI
        </span>
        <div className="flex gap-1">
          {([1, 2, 3, 4, 5] as DRILevel[]).map((level) => {
            const config = DRI_CONFIG[level];
            return (
              <div
                key={level}
                className="flex items-center gap-0.5"
                title={`${config.label}: ${config.description}`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-[8px] text-gray-500 font-mono">
                  {level}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Severity */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-gray-500 uppercase tracking-wider font-mono">
          Severity
        </span>
        <div className="flex gap-1">
          {[
            { label: "Low", color: "#34C759" },
            { label: "Med", color: "#FFD600" },
            { label: "High", color: "#FF6B35" },
            { label: "Crit", color: "#FF2D55" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-0.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[8px] text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Claim types */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-gray-500 uppercase tracking-wider font-mono">
          Claims
        </span>
        <div className="flex gap-1">
          {[
            { label: "Motor", icon: "🚗" },
            { label: "Medical", icon: "🏥" },
            { label: "Property", icon: "🏢" },
            { label: "Marine", icon: "🚢" },
          ].map((c) => (
            <span key={c.label} className="text-[8px] text-gray-500" title={c.label}>
              {c.icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
