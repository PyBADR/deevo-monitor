/**
 * ForecastPanel — AI claim forecasts with mini charts.
 * Shows 7-day and 30-day projections for claim volume by category.
 */
import { useMemo } from "react";
import { useDataStore } from "@/stores/dataStore";

interface ForecastItem {
  category: string;
  current: number;
  forecast7d: number;
  forecast30d: number;
  trend: "up" | "down" | "flat";
  confidence: number;
}

// Synthetic forecast data (production: Ollama generates these)
function generateForecasts(): ForecastItem[] {
  return [
    { category: "Motor Claims", current: 342, forecast7d: 378, forecast30d: 1420, trend: "up", confidence: 0.82 },
    { category: "Medical Claims", current: 287, forecast7d: 295, forecast30d: 1180, trend: "flat", confidence: 0.75 },
    { category: "Property Claims", current: 89, forecast7d: 102, forecast30d: 390, trend: "up", confidence: 0.68 },
    { category: "Fraud Alerts", current: 47, forecast7d: 52, forecast30d: 195, trend: "up", confidence: 0.71 },
    { category: "Marine Claims", current: 23, forecast7d: 21, forecast30d: 88, trend: "down", confidence: 0.65 },
  ];
}

const TREND_ICONS = { up: "↑", down: "↓", flat: "→" };
const TREND_COLORS = { up: "text-red-400", down: "text-green-400", flat: "text-gray-400" };

export function ForecastPanel() {
  const pipelineStats = useDataStore((s) => s.pipelineStats);
  const forecasts = useMemo(() => generateForecasts(), []);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-surface-3 flex items-center gap-2">
        <span className="text-accent-cyan text-xs">◈</span>
        <h2 className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider font-mono">
          AI Forecasts
        </h2>
        <span className="text-[9px] text-gray-600 ml-auto font-mono">
          {pipelineStats ? "Live" : "Baseline"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {forecasts.map((f) => (
          <div
            key={f.category}
            className="px-3 py-2 border-b border-surface-3/30 hover:bg-surface-2/20"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-300">{f.category}</span>
              <span className={`text-xs font-mono ${TREND_COLORS[f.trend]}`}>
                {TREND_ICONS[f.trend]} {f.trend === "up" ? "+" : f.trend === "down" ? "-" : ""}
                {Math.abs(f.forecast7d - f.current)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span>Now: <span className="text-gray-300 font-mono">{f.current}</span></span>
              <span>7d: <span className="text-gray-300 font-mono">{f.forecast7d}</span></span>
              <span>30d: <span className="text-gray-300 font-mono">{f.forecast30d}</span></span>
              <span className="ml-auto text-[9px]">
                {Math.round(f.confidence * 100)}% conf
              </span>
            </div>
            {/* Mini bar */}
            <div className="mt-1 h-1 bg-surface-3 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(f.current / f.forecast30d) * 100}%`,
                  backgroundColor: f.trend === "up" ? "#FF6B35" : f.trend === "down" ? "#34C759" : "#FFD600",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
