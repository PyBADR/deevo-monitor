/**
 * LayerPanel — Left sidebar layer toggles (worldmonitor-style LAYERS panel).
 * Categories: CLAIMS, FRAUD, WEATHER, INFRASTRUCTURE, GEOPOLITICAL.
 * Collapsible with animated slide-in.
 */
import { useState } from "react";
import { clsx } from "clsx";
import { useMapStore } from "@/stores/mapStore";
import type { MapLayerType } from "@/types";

interface LayerDef {
  id: MapLayerType;
  label: string;
  labelAr: string;
  icon: string;
  color: string;
  category: string;
}

const LAYER_DEFS: LayerDef[] = [
  { id: "heatmap", label: "Claims Heat", labelAr: "حرارة المطالبات", icon: "🔥", color: "#FF6B35", category: "CLAIMS" },
  { id: "scatterplot", label: "Claim Clusters", labelAr: "تجمعات المطالبات", icon: "◉", color: "#00D4FF", category: "CLAIMS" },
  { id: "hexagon", label: "Risk Density", labelAr: "كثافة المخاطر", icon: "⬡", color: "#FFD600", category: "CLAIMS" },
  { id: "arc", label: "Fraud Links", labelAr: "روابط الاحتيال", icon: "⌒", color: "#FF2D55", category: "FRAUD" },
  { id: "icon", label: "Alert Markers", labelAr: "علامات التنبيه", icon: "⚠", color: "#FF6B35", category: "ALERTS" },
];

export function LayerPanel() {
  const activeLayers = useMapStore((s) => s.activeLayers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute top-3 left-3 z-20 glass-panel px-2 py-2 text-gray-400 hover:text-accent-cyan transition-colors"
        title="Show layers"
      >
        <span className="text-sm">☰</span>
      </button>
    );
  }

  // Group by category
  const categories = Array.from(new Set(LAYER_DEFS.map((l) => l.category)));

  return (
    <div className="absolute top-3 left-3 z-20 glass-panel w-52 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-surface-3">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
          Layers
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-gray-500 hover:text-gray-300 text-xs"
        >
          ✕
        </button>
      </div>

      {/* Layer list grouped by category */}
      <div className="py-1">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="px-3 py-1">
              <span className="text-[8px] text-gray-600 uppercase tracking-widest font-mono">
                {cat}
              </span>
            </div>
            {LAYER_DEFS.filter((l) => l.category === cat).map((layer) => {
              const isActive = activeLayers.has(layer.id);
              return (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={clsx(
                    "w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors",
                    isActive
                      ? "text-gray-200"
                      : "text-gray-500 hover:text-gray-400"
                  )}
                >
                  {/* Toggle indicator */}
                  <span
                    className={clsx(
                      "w-2.5 h-2.5 rounded-sm border transition-colors",
                      isActive
                        ? "border-transparent"
                        : "border-gray-600"
                    )}
                    style={{
                      backgroundColor: isActive ? layer.color : "transparent",
                    }}
                  />
                  <span>{layer.icon}</span>
                  <span className="flex-1 text-left">{layer.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer: 3D toggle */}
      <div className="px-3 py-2 border-t border-surface-3">
        <button
          onClick={() => {
            const store = useMapStore.getState();
            const current = store.viewState;
            if (current) {
              store.setViewState({
                ...current,
                pitch: current.pitch > 0 ? 0 : 45,
                transitionDuration: 800,
              });
            }
          }}
          className="text-[10px] text-gray-500 hover:text-accent-cyan font-mono"
        >
          ⟐ Toggle 3D
        </button>
      </div>
    </div>
  );
}
