/**
 * LayerPanel — Left sidebar layer toggles (worldmonitor-style LAYERS panel).
 * 30+ layers across 8 categories: GEOPOLITICAL, MILITARY, NUCLEAR,
 * INFRASTRUCTURE, INTELLIGENCE, CLAIMS, FRAUD, ENVIRONMENTAL.
 * Collapsible with animated slide-in. Time range filter at top.
 */
import { useState } from "react";
import { clsx } from "clsx";
import { useVariant } from "@/variants";
import { GLOBAL_LAYER_DEFS } from "@/data/global-layers";

type TimeRange = '1h' | '6h' | '24h' | '48h' | '7d' | 'all';

export function LayerPanel() {
  const { variant } = useVariant();
  const [collapsed, setCollapsed] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(
    new Set(GLOBAL_LAYER_DEFS.filter((l) => l.defaultEnabled).map((l) => l.id))
  );
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['GEOPOLITICAL', 'MILITARY', 'NUCLEAR', 'CLAIMS'])
  );

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

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

  // Group by category preserving order
  const categories = Array.from(new Set(GLOBAL_LAYER_DEFS.map((l) => l.category)));

  return (
    <div
      className="absolute top-3 left-3 z-20 w-56 animate-slide-in rounded-lg border shadow-xl overflow-hidden"
      style={{
        backgroundColor: `${variant.colors.bg}F0`,
        borderColor: variant.colors.border,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: variant.colors.border }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: variant.colors.textMuted }}>
            Layers
          </span>
          <span
            className="text-[8px] font-mono px-1 py-0.5 rounded"
            style={{ backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary }}
          >
            {activeLayers.size}
          </span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-gray-500 hover:text-gray-300 text-xs"
        >
          ✕
        </button>
      </div>

      {/* Time range filter */}
      <div
        className="flex items-center gap-0.5 px-2 py-1.5 border-b"
        style={{ borderColor: variant.colors.border }}
      >
        {(['1h', '6h', '24h', '48h', '7d', 'all'] as TimeRange[]).map((tr) => (
          <button
            key={tr}
            onClick={() => setTimeRange(tr)}
            className={clsx(
              'text-[8px] font-mono px-1.5 py-0.5 rounded transition-colors',
              timeRange === tr ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'
            )}
            style={
              timeRange === tr
                ? { backgroundColor: `${variant.colors.primary}30`, color: variant.colors.primary }
                : undefined
            }
          >
            {tr === 'all' ? 'All' : tr.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Layer list grouped by category — scrollable */}
      <div className="max-h-[400px] overflow-y-auto py-1">
        {categories.map((cat) => {
          const layers = GLOBAL_LAYER_DEFS.filter((l) => l.category === cat);
          const isExpanded = expandedCategories.has(cat);
          const activeCount = layers.filter((l) => activeLayers.has(l.id)).length;

          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-white/5"
              >
                <span className="text-[8px] uppercase tracking-widest font-mono font-bold" style={{ color: variant.colors.textMuted }}>
                  {cat}
                </span>
                <div className="flex items-center gap-1">
                  {activeCount > 0 && (
                    <span
                      className="text-[7px] font-mono px-1 rounded"
                      style={{ backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary }}
                    >
                      {activeCount}
                    </span>
                  )}
                  <span className="text-[8px] text-gray-500">{isExpanded ? '▾' : '▸'}</span>
                </div>
              </button>
              {isExpanded &&
                layers.map((layer) => {
                  const isActive = activeLayers.has(layer.id);
                  return (
                    <button
                      key={layer.id}
                      onClick={() => toggleLayer(layer.id)}
                      className={clsx(
                        "w-full flex items-center gap-2 px-3 py-1 text-xs transition-colors",
                        isActive ? "text-gray-200" : "text-gray-500 hover:text-gray-400"
                      )}
                    >
                      <span
                        className={clsx(
                          "w-2.5 h-2.5 rounded-sm border transition-colors shrink-0",
                          isActive ? "border-transparent" : "border-gray-600"
                        )}
                        style={{
                          backgroundColor: isActive ? layer.color : "transparent",
                        }}
                      />
                      <span className="shrink-0">{layer.icon}</span>
                      <span className="flex-1 text-left text-[10px]">{layer.label}</span>
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>

      {/* Footer: 2D/3D toggle */}
      <div
        className="px-3 py-2 border-t flex items-center justify-between"
        style={{ borderColor: variant.colors.border }}
      >
        <button className="text-[9px] font-mono hover:text-white transition-colors" style={{ color: variant.colors.textMuted }}>
          ⟐ Toggle 3D
        </button>
        <Map2D3DToggle />
      </div>
    </div>
  );
}

function Map2D3DToggle() {
  const { variant } = useVariant();
  const [is3D, setIs3D] = useState(false);

  return (
    <div className="flex rounded overflow-hidden border" style={{ borderColor: variant.colors.border }}>
      <button
        onClick={() => setIs3D(false)}
        className={clsx(
          'text-[9px] font-mono font-bold px-2 py-0.5 transition-colors',
          !is3D ? 'text-white' : 'text-gray-500'
        )}
        style={!is3D ? { backgroundColor: `${variant.colors.primary}30`, color: variant.colors.primary } : undefined}
      >
        2D
      </button>
      <button
        onClick={() => setIs3D(true)}
        className={clsx(
          'text-[9px] font-mono font-bold px-2 py-0.5 transition-colors',
          is3D ? 'text-white' : 'text-gray-500'
        )}
        style={is3D ? { backgroundColor: `${variant.colors.primary}30`, color: variant.colors.primary } : undefined}
      >
        3D
      </button>
    </div>
  );
}
