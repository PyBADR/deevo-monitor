/**
 * LayerPanel — Left sidebar layer toggles wired to Zustand mapStore.
 * 45 layers across 8 categories with enable-all/disable-all per category,
 * time range filter, 2D/3D toggle, style switcher, and pulse/extrusion toggles.
 * Fully synced with GCCMap SmartMapEngine via shared store.
 *
 * Architecture Layer: UI (L6) — wired to mapStore state
 */
import { useState } from "react";
import { clsx } from "clsx";
import { useVariant } from "@/variants";
import { GLOBAL_LAYER_DEFS } from "@/data/global-layers";
import { useMapStore, type MapStyleId, type TimeRange } from "@/stores/mapStore";

export function LayerPanel() {
  const { variant } = useVariant();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['GEOPOLITICAL', 'MILITARY', 'NUCLEAR', 'CLAIMS'])
  );

  // ── mapStore bindings ──
  const activeLayers = useMapStore((s) => s.activeLayers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const enableAllLayers = useMapStore((s) => s.enableAllLayers);
  const disableAllLayers = useMapStore((s) => s.disableAllLayers);
  const enableLayerCategory = useMapStore((s) => s.enableLayerCategory);
  const disableLayerCategory = useMapStore((s) => s.disableLayerCategory);
  const timeRange = useMapStore((s) => s.timeRange);
  const setTimeRange = useMapStore((s) => s.setTimeRange);
  const mode = useMapStore((s) => s.mode);
  const setMode = useMapStore((s) => s.setMode);
  const style = useMapStore((s) => s.style);
  const setStyle = useMapStore((s) => s.setStyle);
  const pulseAnimationsEnabled = useMapStore((s) => s.pulseAnimationsEnabled);
  const togglePulseAnimations = useMapStore((s) => s.togglePulseAnimations);
  const riskExtrusionEnabled = useMapStore((s) => s.riskExtrusionEnabled);
  const toggleRiskExtrusion = useMapStore((s) => s.toggleRiskExtrusion);

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
  const totalLayers = GLOBAL_LAYER_DEFS.length;

  const TIME_RANGES: TimeRange[] = ['1h', '6h', '24h', '7d', '30d', '90d', 'all'];
  const STYLES: { id: MapStyleId; label: string; icon: string }[] = [
    { id: 'cyberpunk', label: 'CYBER', icon: '🌃' },
    { id: 'satellite', label: 'SAT', icon: '🛰' },
    { id: 'minimal', label: 'CLEAN', icon: '◻' },
  ];

  return (
    <div
      className="absolute top-3 left-3 z-20 w-60 animate-slide-in rounded-lg border shadow-xl overflow-hidden"
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
            {activeLayers.size}/{totalLayers}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={enableAllLayers}
            className="text-[7px] font-mono px-1 py-0.5 rounded hover:bg-white/10 transition-colors"
            style={{ color: variant.colors.success }}
            title="Enable all layers"
          >
            ALL
          </button>
          <button
            onClick={disableAllLayers}
            className="text-[7px] font-mono px-1 py-0.5 rounded hover:bg-white/10 transition-colors"
            style={{ color: variant.colors.critical || '#FF3B30' }}
            title="Disable all layers"
          >
            NONE
          </button>
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-500 hover:text-gray-300 text-xs ml-1"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Search filter */}
      <div className="px-2 py-1.5 border-b" style={{ borderColor: variant.colors.border }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search layers ..."
          className="w-full text-[10px] font-mono px-2 py-1 rounded border bg-transparent placeholder-gray-600 focus:outline-none focus:border-gray-500"
          style={{ borderColor: variant.colors.border, color: variant.colors.text }}
        />
      </div>

      {/* Time range filter */}
      <div
        className="flex items-center gap-0.5 px-2 py-1.5 border-b"
        style={{ borderColor: variant.colors.border }}
      >
        {TIME_RANGES.map((tr) => (
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
      <div className="max-h-[340px] overflow-y-auto py-1">
        {categories.map((cat) => {
          const allCatLayers = GLOBAL_LAYER_DEFS.filter((l) => l.category === cat);
          const layers = searchQuery
            ? allCatLayers.filter((l) => l.label.toLowerCase().includes(searchQuery.toLowerCase()) || l.id.toLowerCase().includes(searchQuery.toLowerCase()))
            : allCatLayers;
          if (searchQuery && layers.length === 0) return null;
          const isExpanded = expandedCategories.has(cat);
          const activeCount = layers.filter((l) => activeLayers.has(l.id)).length;
          const allActive = activeCount === layers.length;

          return (
            <div key={cat}>
              <div className="flex items-center">
                <button
                  onClick={() => toggleCategory(cat)}
                  className="flex-1 flex items-center justify-between px-3 py-1.5 hover:bg-white/5"
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
                {/* Category toggle-all button */}
                <button
                  onClick={() => allActive ? disableLayerCategory(cat) : enableLayerCategory(cat)}
                  className="text-[7px] font-mono px-1.5 py-0.5 mr-2 rounded hover:bg-white/10 transition-colors"
                  style={{ color: allActive ? (variant.colors.critical || '#FF3B30') : variant.colors.success }}
                  title={allActive ? `Disable all ${cat}` : `Enable all ${cat}`}
                >
                  {allActive ? '○' : '●'}
                </button>
              </div>
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

      {/* Style switcher */}
      <div
        className="px-2 py-1.5 border-t flex items-center gap-1"
        style={{ borderColor: variant.colors.border }}
      >
        <span className="text-[7px] font-mono uppercase mr-1" style={{ color: variant.colors.textMuted }}>Style</span>
        {STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={clsx(
              'text-[8px] font-mono px-1.5 py-0.5 rounded transition-colors',
              style === s.id ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'
            )}
            style={
              style === s.id
                ? { backgroundColor: `${variant.colors.primary}30`, color: variant.colors.primary }
                : undefined
            }
            title={s.label}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Animation toggles */}
      <div
        className="px-3 py-1.5 border-t flex items-center gap-3"
        style={{ borderColor: variant.colors.border }}
      >
        <button
          onClick={togglePulseAnimations}
          className={clsx(
            'text-[8px] font-mono transition-colors',
            pulseAnimationsEnabled ? 'text-green-400' : 'text-gray-500'
          )}
          title="Toggle pulse animations"
        >
          {pulseAnimationsEnabled ? '◉' : '○'} Pulse
        </button>
        <button
          onClick={toggleRiskExtrusion}
          className={clsx(
            'text-[8px] font-mono transition-colors',
            riskExtrusionEnabled ? 'text-green-400' : 'text-gray-500'
          )}
          title="Toggle 3D risk extrusion"
        >
          {riskExtrusionEnabled ? '◉' : '○'} Extrude
        </button>
      </div>

      {/* Footer: 2D/3D toggle */}
      <div
        className="px-3 py-2 border-t flex items-center justify-between"
        style={{ borderColor: variant.colors.border }}
      >
        <span className="text-[8px] font-mono uppercase" style={{ color: variant.colors.textMuted }}>
          {mode.toUpperCase()} · {style.toUpperCase()} · {activeLayers.size} layers
        </span>
        <Map2D3DToggle mode={mode} setMode={setMode} />
      </div>
    </div>
  );
}

function Map2D3DToggle({ mode, setMode }: { mode: '2d' | '3d'; setMode: (m: '2d' | '3d') => void }) {
  const { variant } = useVariant();

  return (
    <div className="flex rounded overflow-hidden border" style={{ borderColor: variant.colors.border }}>
      <button
        onClick={() => setMode('2d')}
        className={clsx(
          'text-[9px] font-mono font-bold px-2 py-0.5 transition-colors',
          mode === '2d' ? 'text-white' : 'text-gray-500'
        )}
        style={mode === '2d' ? { backgroundColor: `${variant.colors.primary}30`, color: variant.colors.primary } : undefined}
      >
        2D
      </button>
      <button
        onClick={() => setMode('3d')}
        className={clsx(
          'text-[9px] font-mono font-bold px-2 py-0.5 transition-colors',
          mode === '3d' ? 'text-white' : 'text-gray-500'
        )}
        style={mode === '3d' ? { backgroundColor: `${variant.colors.primary}30`, color: variant.colors.primary } : undefined}
      >
        3D
      </button>
    </div>
  );
}
