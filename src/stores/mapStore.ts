/**
 * Map Store — Zustand state for DeckGL viewport and layer visibility.
 */
import { create } from "zustand";
import type { MapViewState, MapLayerType, GCCCountryCode } from "@/types";
import { GCC_COUNTRIES } from "@/types";

interface MapState {
  viewState: MapViewState | null;
  activeLayers: Set<MapLayerType>;
  focusedCountry: GCCCountryCode | null;

  setViewState: (vs: MapViewState) => void;
  toggleLayer: (layer: MapLayerType) => void;
  setLayerActive: (layer: MapLayerType, active: boolean) => void;
  flyToCountry: (country: GCCCountryCode) => void;
  resetView: () => void;
}

const DEFAULT_LAYERS: MapLayerType[] = ["hexagon", "scatterplot", "arc", "icon"];

export const useMapStore = create<MapState>((set) => ({
  viewState: null,
  activeLayers: new Set(DEFAULT_LAYERS),
  focusedCountry: null,

  setViewState: (vs) => set({ viewState: vs }),

  toggleLayer: (layer) =>
    set((state) => {
      const next = new Set(state.activeLayers);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return { activeLayers: next };
    }),

  setLayerActive: (layer, active) =>
    set((state) => {
      const next = new Set(state.activeLayers);
      if (active) {
        next.add(layer);
      } else {
        next.delete(layer);
      }
      return { activeLayers: next };
    }),

  flyToCountry: (country) => {
    const c = GCC_COUNTRIES[country];
    set({
      focusedCountry: country,
      viewState: {
        longitude: c.center[0],
        latitude: c.center[1],
        zoom: c.zoom,
        pitch: 45,
        bearing: 0,
        transitionDuration: 1500,
      },
    });
  },

  resetView: () =>
    set({
      focusedCountry: null,
      viewState: {
        longitude: 50.0,
        latitude: 25.0,
        zoom: 5,
        pitch: 45,
        bearing: -15,
        transitionDuration: 1500,
      },
    }),
}));
