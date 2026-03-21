/**
 * GCCMap — DeckGL + MapLibre GL map engine.
 * Centers on GCC region (lat ~25, lng ~50) with 5 composable data layers.
 * Dark basemap, responsive viewport, touch-friendly.
 */
import { useCallback, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { useMapStore } from "@/stores/mapStore";
import { useDataStore } from "@/stores/dataStore";
import { createRiskHexagonLayer } from "./layers/RiskHexagonLayer";
import { createClaimScatterLayer } from "./layers/ClaimScatterLayer";
import { createFraudArcLayer } from "./layers/FraudArcLayer";
import { createHeatmapLayer } from "./layers/RiskHeatmapLayer";
import { createAlertIconLayer } from "./layers/AlertIconLayer";
import type { MapViewState } from "@/types";

// GCC-centered initial view
const INITIAL_VIEW: MapViewState = {
  longitude: 50.0,
  latitude: 25.0,
  zoom: 5,
  pitch: 45,
  bearing: -15,
  transitionDuration: 1000,
};

// Dark basemap — free, no API key required
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export function GCCMap() {
  const viewState = useMapStore((s) => s.viewState);
  const setViewState = useMapStore((s) => s.setViewState);
  const activeLayers = useMapStore((s) => s.activeLayers);

  const hotspots = useDataStore((s) => s.riskHotspots);
  const clusters = useDataStore((s) => s.claimClusters);
  const arcs = useDataStore((s) => s.fraudArcs);
  const alerts = useDataStore((s) => s.alertIcons);

  const currentView = viewState ?? INITIAL_VIEW;

  const onViewStateChange = useCallback(
    ({ viewState: vs }: { viewState: MapViewState }) => {
      setViewState(vs);
    },
    [setViewState]
  );

  const layers = useMemo(() => {
    const result = [];

    if (activeLayers.has("heatmap")) {
      result.push(createHeatmapLayer(hotspots));
    }
    if (activeLayers.has("hexagon")) {
      result.push(createRiskHexagonLayer(hotspots));
    }
    if (activeLayers.has("scatterplot")) {
      result.push(createClaimScatterLayer(clusters));
    }
    if (activeLayers.has("arc")) {
      result.push(createFraudArcLayer(arcs));
    }
    if (activeLayers.has("icon")) {
      result.push(createAlertIconLayer(alerts));
    }

    return result;
  }, [activeLayers, hotspots, clusters, arcs, alerts]);

  return (
    <div className="relative w-full h-full">
      <DeckGL
        viewState={currentView}
        onViewStateChange={onViewStateChange}
        controller={{ dragRotate: true, touchRotate: true }}
        layers={layers}
        getTooltip={({ object }: { object?: Record<string, unknown> }) => {
          if (!object) return null;
          const label = (object as { label?: string }).label;
          return label ? { text: label } : null;
        }}
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>

      {/* Layer toggle overlay */}
      <LayerToggle />
    </div>
  );
}

function LayerToggle() {
  const activeLayers = useMapStore((s) => s.activeLayers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);

  const layerDefs = [
    { id: "hexagon" as const, label: "Risk Density", icon: "⬡" },
    { id: "scatterplot" as const, label: "Claim Clusters", icon: "◉" },
    { id: "arc" as const, label: "Fraud Links", icon: "⌒" },
    { id: "heatmap" as const, label: "Heat Map", icon: "🔥" },
    { id: "icon" as const, label: "Alerts", icon: "⚠" },
  ] as const;

  return (
    <div className="absolute top-3 right-3 glass-panel p-2 space-y-1 z-10">
      <div className="text-[10px] text-gray-500 uppercase tracking-widest px-2 pb-1">
        Layers
      </div>
      {layerDefs.map((l) => (
        <button
          key={l.id}
          onClick={() => toggleLayer(l.id)}
          className={`flex items-center gap-2 px-2 py-1 rounded text-xs w-full transition-colors ${
            activeLayers.has(l.id)
              ? "bg-accent-cyan/20 text-accent-cyan"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <span>{l.icon}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
}
