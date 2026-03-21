/**
 * RiskScore — Country-level risk breakdown panel.
 * Shows all 6 GCC countries with component scores and trend indicators.
 * Click a country to fly the map to that region.
 */
import { clsx } from "clsx";
import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from "@/stores/mapStore";
import { DRIBadge } from "@/components/shared/DRIBadge";
import { GCC_COUNTRIES, type GCCCountryCode, type DRILevel } from "@/types";

const COMPONENT_LABELS: Record<string, { label: string; color: string }> = {
  fraud: { label: "Fraud", color: "#f43f5e" },
  claims: { label: "Claims", color: "#f59e0b" },
  geopolitical: { label: "Geo", color: "#8b5cf6" },
  regulatory: { label: "Reg", color: "#06b6d4" },
  weather: { label: "Weather", color: "#10b981" },
  cyber: { label: "Cyber", color: "#ec4899" },
};

const TREND_ICONS: Record<string, { icon: string; color: string }> = {
  improving: { icon: "↓", color: "text-green-400" },
  stable: { icon: "→", color: "text-gray-400" },
  deteriorating: { icon: "↑", color: "text-red-400" },
};

export function RiskScore() {
  const countryRisks = useDataStore((s) => s.countryRisks);
  const flyToCountry = useMapStore((s) => s.flyToCountry);
  const focusedCountry = useMapStore((s) => s.focusedCountry);
  const resetView = useMapStore((s) => s.resetView);

  const countries: GCCCountryCode[] = ["SA", "AE", "QA", "KW", "BH", "OM"];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-surface-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <span className="text-accent-amber">△</span>
          GCC Risk Scores
        </h2>
        {focusedCountry && (
          <button
            onClick={resetView}
            className="text-[10px] text-gray-500 hover:text-accent-cyan"
          >
            Reset View
          </button>
        )}
      </div>

      {/* Country list */}
      <div className="flex-1 overflow-y-auto">
        {countries.map((code) => {
          const risk = countryRisks.get(code);
          const country = GCC_COUNTRIES[code];
          const isFocused = focusedCountry === code;

          return (
            <button
              key={code}
              onClick={() => flyToCountry(code)}
              className={clsx(
                "w-full text-left px-3 py-2 border-b border-surface-3/30 transition-colors",
                isFocused
                  ? "bg-accent-cyan/10 border-l-2 border-l-accent-cyan"
                  : "hover:bg-surface-2/30"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-200">
                    {code}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {country.name}
                  </span>
                </div>
                <DRIBadge
                  level={(risk?.driLevel ?? 2) as DRILevel}
                  size="sm"
                  showLabel={false}
                />
              </div>

              {risk ? (
                <>
                  {/* Score bar */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${risk.overallScore}%`,
                          backgroundColor: risk.overallScore >= 65
                            ? "#ef4444"
                            : risk.overallScore >= 50
                            ? "#f59e0b"
                            : risk.overallScore >= 30
                            ? "#eab308"
                            : "#22c55e",
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-gray-300 w-8 text-right">
                      {risk.overallScore}
                    </span>
                    <span className={clsx("text-xs", TREND_ICONS[risk.trend]?.color)}>
                      {TREND_ICONS[risk.trend]?.icon}
                    </span>
                  </div>

                  {/* Component mini-bars */}
                  <div className="grid grid-cols-6 gap-0.5">
                    {Object.entries(COMPONENT_LABELS).map(([key, { label, color }]) => {
                      const val = risk.components[key as keyof typeof risk.components] ?? 0;
                      return (
                        <div key={key} className="text-center" title={`${label}: ${val}`}>
                          <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${val}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                          <span className="text-[8px] text-gray-600">{label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
                    <span>Claims: {risk.activeClaims.toLocaleString()}</span>
                    <span>GWP: {risk.gwpMillions}M {country.currency}</span>
                  </div>
                </>
              ) : (
                <div className="text-[10px] text-gray-600">Loading...</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
