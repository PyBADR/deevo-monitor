/**
 * Map Store — Zustand state for DeckGL + globe.gl smart map engine.
 * Manages: viewport, 45 layer toggles, map style, time-slider,
 * intel card selection, 2D/3D mode, animation state.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MapViewState, GCCCountryCode } from '@/types';
import { GCC_COUNTRIES } from '@/types';
import { GLOBAL_LAYER_DEFS } from '@/data/global-layers';

// ── Types ───────────────────────────────────────────────

export type MapStyleId = 'cyberpunk' | 'satellite' | 'minimal';
export type MapMode = '2d' | '3d';
export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d' | '90d' | 'all';

export interface IntelCardData {
  id: string;
  lat: number;
  lon: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  layerId: string;
  riskScore?: number;
  newsItems?: { title: string; source: string; time: string }[];
  aiSummary?: string;
}

export interface MapStoreState {
  // Viewport
  viewState: MapViewState | null;
  focusedCountry: GCCCountryCode | null;

  // Mode & Style
  mode: MapMode;
  style: MapStyleId;

  // Layers — all 45
  activeLayers: Set<string>;

  // Time Slider
  timeRange: TimeRange;
  timeSliderValue: number; // 0-100 representing position in range

  // Intel Card (click-to-drill)
  selectedIntelCard: IntelCardData | null;
  intelCardVisible: boolean;

  // Animation
  pulseAnimationsEnabled: boolean;
  riskExtrusionEnabled: boolean;

  // Actions
  setViewState: (vs: MapViewState) => void;
  setMode: (mode: MapMode) => void;
  setStyle: (style: MapStyleId) => void;
  toggleLayer: (layerId: string) => void;
  setLayerActive: (layerId: string, active: boolean) => void;
  enableAllLayers: () => void;
  disableAllLayers: () => void;
  enableLayerCategory: (category: string) => void;
  disableLayerCategory: (category: string) => void;
  setTimeRange: (range: TimeRange) => void;
  setTimeSliderValue: (value: number) => void;
  selectIntelCard: (card: IntelCardData | null) => void;
  dismissIntelCard: () => void;
  togglePulseAnimations: () => void;
  toggleRiskExtrusion: () => void;
  flyToCountry: (country: GCCCountryCode) => void;
  flyToCoords: (lat: number, lon: number, zoom?: number) => void;
  resetView: () => void;
}

// All 45 layers enabled by default
const ALL_LAYER_IDS = GLOBAL_LAYER_DEFS.map((l) => l.id);

export const useMapStore = create<MapStoreState>()(
  persist(
    (set) => ({
      // Initial State
      viewState: null,
      focusedCountry: null,
      mode: '2d',
      style: 'cyberpunk',
      activeLayers: new Set(ALL_LAYER_IDS),
      timeRange: '7d',
      timeSliderValue: 100,
      selectedIntelCard: null,
      intelCardVisible: false,
      pulseAnimationsEnabled: true,
      riskExtrusionEnabled: true,

      // Viewport
      setViewState: (vs) => set({ viewState: vs }),

      // Mode & Style
      setMode: (mode) => set({ mode }),
      setStyle: (style) => set({ style }),

      // Layer Management
      toggleLayer: (layerId) =>
        set((state) => {
          const next = new Set(state.activeLayers);
          if (next.has(layerId)) next.delete(layerId);
          else next.add(layerId);
          return { activeLayers: next };
        }),

      setLayerActive: (layerId, active) =>
        set((state) => {
          const next = new Set(state.activeLayers);
          if (active) next.add(layerId);
          else next.delete(layerId);
          return { activeLayers: next };
        }),

      enableAllLayers: () => set({ activeLayers: new Set(ALL_LAYER_IDS) }),

      disableAllLayers: () => set({ activeLayers: new Set() }),

      enableLayerCategory: (category) =>
        set((state) => {
          const next = new Set(state.activeLayers);
          GLOBAL_LAYER_DEFS.filter((l) => l.category === category).forEach((l) => next.add(l.id));
          return { activeLayers: next };
        }),

      disableLayerCategory: (category) =>
        set((state) => {
          const next = new Set(state.activeLayers);
          GLOBAL_LAYER_DEFS.filter((l) => l.category === category).forEach((l) => next.delete(l.id));
          return { activeLayers: next };
        }),

      // Time Slider
      setTimeRange: (range) => set({ timeRange: range }),
      setTimeSliderValue: (value) => set({ timeSliderValue: value }),

      // Intel Card
      selectIntelCard: (card) => set({ selectedIntelCard: card, intelCardVisible: !!card }),
      dismissIntelCard: () => set({ selectedIntelCard: null, intelCardVisible: false }),

      // Animations
      togglePulseAnimations: () => set((s) => ({ pulseAnimationsEnabled: !s.pulseAnimationsEnabled })),
      toggleRiskExtrusion: () => set((s) => ({ riskExtrusionEnabled: !s.riskExtrusionEnabled })),

      // Navigation
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

      flyToCoords: (lat, lon, zoom = 8) =>
        set({
          viewState: {
            latitude: lat,
            longitude: lon,
            zoom,
            pitch: 45,
            bearing: 0,
            transitionDuration: 1200,
          },
        }),

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
    }),
    {
      name: 'deevo-map-store',
      partialize: (state) => ({
        mode: state.mode,
        style: state.style,
        timeRange: state.timeRange,
        pulseAnimationsEnabled: state.pulseAnimationsEnabled,
        riskExtrusionEnabled: state.riskExtrusionEnabled,
        // Serialize Set as array for persistence
        activeLayers: Array.from(state.activeLayers),
      }),
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
        // Deserialize array back to Set
        activeLayers: persisted?.activeLayers
          ? new Set(persisted.activeLayers)
          : current.activeLayers,
      }),
    }
  )
);
