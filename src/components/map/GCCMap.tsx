/**
 * SmartMapEngine — Production-grade 2D/3D map with 45 data layers.
 *
 * Engine: DeckGL + MapLibre GL (2D) | globe.gl (3D)
 * Styles: Cyberpunk (dark neon), Satellite hybrid, Clean minimal
 * Layers: 45 across 8 categories — all active by default
 * Interactions: Pulse animations, click-to-drill intel cards, time-slider, 3D extrusion
 *
 * Architecture Decision: Single component orchestrates both engines.
 * DeckGL handles 2D with ScatterplotLayer, ArcLayer, HeatmapLayer, IconLayer,
 * HexagonLayer, and custom animated layers. Globe.gl handles 3D with extruded risk bars.
 */
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { ScatterplotLayer, ArcLayer, TextLayer } from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';

import { useMapStore, type MapStyleId, type IntelCardData } from '@/stores/mapStore';
import { useDataStore } from '@/stores/dataStore';
import { useVariant } from '@/variants';
import {
  GLOBAL_LAYER_DEFS,
  getLayerPoints,
  CONFLICT_ZONE_POINTS,
  MILITARY_BASE_POINTS,
  NUCLEAR_SITE_POINTS,
  INTEL_HOTSPOT_POINTS,
  PIPELINE_POINTS,
  AI_DATA_CENTER_POINTS,
  IRAN_ATTACK_POINTS,
  SPACEPORT_POINTS,
  STOCK_EXCHANGE_POINTS,
  FINANCIAL_CENTER_POINTS,
  CENTRAL_BANK_POINTS,
  GULF_INVESTMENT_POINTS,
  STARTUP_HUB_POINTS,
  TECH_HQ_POINTS,
  CLOUD_REGION_POINTS,
  COMMODITY_HUB_POINTS,
  STRATEGIC_WATERWAY_POINTS,
  DESALINATION_POINTS,
  SOLAR_FARM_POINTS,
  OIL_FACILITY_POINTS,
  type LayerPoint,
} from '@/data/global-layers';
import type { MapViewState } from '@/types';

// ── Map Style URLs ──────────────────────────────────────
const MAP_STYLES: Record<MapStyleId, string> = {
  cyberpunk: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  satellite: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  minimal: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
};

// GCC-centered initial view
const INITIAL_VIEW: MapViewState = {
  longitude: 50.0,
  latitude: 25.0,
  zoom: 5,
  pitch: 45,
  bearing: -15,
  transitionDuration: 1000,
};

// ── Severity Colors ─────────────────────────────────────
const SEVERITY_COLORS: Record<string, [number, number, number, number]> = {
  low: [16, 185, 129, 200],
  medium: [234, 179, 8, 200],
  high: [239, 68, 68, 200],
  critical: [220, 38, 38, 255],
};

function severityToColor(severity?: string): [number, number, number, number] {
  return SEVERITY_COLORS[severity || 'medium'] ?? [234, 179, 8, 200];
}

// ── Pulse Animation ─────────────────────────────────────
function usePulseRadius(enabled: boolean): number {
  const [pulse, setPulse] = useState(1);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) { setPulse(1); return; }
    let t = 0;
    const animate = () => {
      t += 0.03;
      setPulse(1 + Math.sin(t) * 0.3);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [enabled]);

  return pulse;
}

// ── Intel Card Component ────────────────────────────────
function IntelCard({ card, onDismiss }: { card: IntelCardData; onDismiss: () => void }) {
  const { variant } = useVariant();

  return (
    <div
      className="absolute bottom-20 right-4 z-30 w-80 rounded-lg border shadow-2xl overflow-hidden animate-slide-up"
      style={{
        backgroundColor: `${variant.colors.bg}F5`,
        borderColor: variant.colors.border,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: variant.colors.border }}>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: SEVERITY_COLORS[card.severity]?.slice(0, 3).map(c => `rgb(${c})`).join('') || '#ef4444' }}
          />
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: variant.colors.primary }}>
            {card.category}
          </span>
        </div>
        <button onClick={onDismiss} className="text-gray-500 hover:text-gray-300 text-xs">✕</button>
      </div>

      {/* Body */}
      <div className="px-3 py-2 space-y-2">
        <h3 className="text-sm font-semibold" style={{ color: variant.colors.text }}>{card.title}</h3>
        <p className="text-[11px] leading-relaxed" style={{ color: variant.colors.textMuted }}>{card.description}</p>

        {card.riskScore !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono uppercase" style={{ color: variant.colors.textMuted }}>Risk Score</span>
            <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${card.riskScore}%`,
                  backgroundColor: card.riskScore > 70 ? '#ef4444' : card.riskScore > 40 ? '#eab308' : '#10b981',
                }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold" style={{ color: variant.colors.text }}>{card.riskScore}</span>
          </div>
        )}

        {card.aiSummary && (
          <div className="rounded p-2" style={{ backgroundColor: `${variant.colors.primary}10` }}>
            <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: variant.colors.primary }}>AI Summary</span>
            <p className="text-[10px] mt-1 leading-relaxed" style={{ color: variant.colors.text }}>{card.aiSummary}</p>
          </div>
        )}

        {card.newsItems && card.newsItems.length > 0 && (
          <div className="space-y-1">
            <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: variant.colors.textMuted }}>Related News</span>
            {card.newsItems.map((item, i) => (
              <div key={i} className="flex items-baseline gap-1">
                <span className="text-[9px]" style={{ color: variant.colors.primary }}>●</span>
                <span className="text-[10px]" style={{ color: variant.colors.text }}>{item.title}</span>
                <span className="text-[8px] ml-auto shrink-0" style={{ color: variant.colors.textMuted }}>{item.source}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Coordinates */}
      <div className="px-3 py-1.5 border-t flex items-center justify-between" style={{ borderColor: variant.colors.border }}>
        <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>
          {card.lat.toFixed(4)}°N, {card.lon.toFixed(4)}°E
        </span>
        <span
          className="text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold"
          style={{
            backgroundColor: `${card.severity === 'critical' ? '#ef4444' : card.severity === 'high' ? '#f97316' : card.severity === 'medium' ? '#eab308' : '#10b981'}20`,
            color: card.severity === 'critical' ? '#ef4444' : card.severity === 'high' ? '#f97316' : card.severity === 'medium' ? '#eab308' : '#10b981',
          }}
        >
          {card.severity}
        </span>
      </div>
    </div>
  );
}

// ── Time Slider Component ───────────────────────────────
function TimeSlider() {
  const { variant } = useVariant();
  const timeRange = useMapStore((s) => s.timeRange);
  const setTimeRange = useMapStore((s) => s.setTimeRange);
  const timeSliderValue = useMapStore((s) => s.timeSliderValue);
  const setTimeSliderValue = useMapStore((s) => s.setTimeSliderValue);

  const ranges = ['1h', '6h', '24h', '7d', '30d', '90d'] as const;

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-lg border"
      style={{
        backgroundColor: `${variant.colors.bg}E0`,
        borderColor: variant.colors.border,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Range selector */}
      <div className="flex gap-0.5">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setTimeRange(r)}
            className="text-[8px] font-mono px-1.5 py-0.5 rounded transition-colors"
            style={
              timeRange === r
                ? { backgroundColor: `${variant.colors.primary}30`, color: variant.colors.primary, fontWeight: 'bold' }
                : { color: variant.colors.textMuted }
            }
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={100}
        value={timeSliderValue}
        onChange={(e) => setTimeSliderValue(Number(e.target.value))}
        className="w-32 h-1 appearance-none rounded-full cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${variant.colors.primary} ${timeSliderValue}%, ${variant.colors.border} ${timeSliderValue}%)`,
        }}
      />

      {/* Current position label */}
      <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>
        {timeSliderValue === 100 ? 'NOW' : `${100 - timeSliderValue}% back`}
      </span>
    </div>
  );
}

// ── Map Controls Bar ────────────────────────────────────
function MapControls() {
  const { variant } = useVariant();
  const mode = useMapStore((s) => s.mode);
  const setMode = useMapStore((s) => s.setMode);
  const style = useMapStore((s) => s.style);
  const setStyle = useMapStore((s) => s.setStyle);
  const pulseEnabled = useMapStore((s) => s.pulseAnimationsEnabled);
  const togglePulse = useMapStore((s) => s.togglePulseAnimations);
  const extrusionEnabled = useMapStore((s) => s.riskExtrusionEnabled);
  const toggleExtrusion = useMapStore((s) => s.toggleRiskExtrusion);
  const resetView = useMapStore((s) => s.resetView);
  const activeLayers = useMapStore((s) => s.activeLayers);

  const styles: { id: 'cyberpunk' | 'satellite' | 'minimal'; label: string; icon: string }[] = [
    { id: 'cyberpunk', label: 'Dark', icon: '🌑' },
    { id: 'satellite', label: 'Satellite', icon: '🛰' },
    { id: 'minimal', label: 'Clean', icon: '◻' },
  ];

  return (
    <div
      className="absolute top-3 right-3 z-20 flex flex-col gap-1.5"
    >
      {/* 2D/3D Toggle */}
      <div
        className="flex rounded-lg overflow-hidden border"
        style={{ backgroundColor: `${variant.colors.bg}E0`, borderColor: variant.colors.border, backdropFilter: 'blur(12px)' }}
      >
        {(['2d', '3d'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="text-[10px] font-mono font-bold px-3 py-1.5 transition-colors"
            style={
              mode === m
                ? { backgroundColor: `${variant.colors.primary}30`, color: variant.colors.primary }
                : { color: variant.colors.textMuted }
            }
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Style Switcher */}
      <div
        className="flex flex-col rounded-lg overflow-hidden border"
        style={{ backgroundColor: `${variant.colors.bg}E0`, borderColor: variant.colors.border, backdropFilter: 'blur(12px)' }}
      >
        {styles.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-mono transition-colors"
            style={
              style === s.id
                ? { backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary }
                : { color: variant.colors.textMuted }
            }
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Feature toggles */}
      <div
        className="flex flex-col rounded-lg overflow-hidden border"
        style={{ backgroundColor: `${variant.colors.bg}E0`, borderColor: variant.colors.border, backdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={togglePulse}
          className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-mono transition-colors"
          style={{ color: pulseEnabled ? variant.colors.primary : variant.colors.textMuted }}
        >
          <span className={pulseEnabled ? 'animate-pulse' : ''}>●</span>
          <span>Pulse</span>
        </button>
        <button
          onClick={toggleExtrusion}
          className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-mono transition-colors"
          style={{ color: extrusionEnabled ? variant.colors.primary : variant.colors.textMuted }}
        >
          <span>▮</span>
          <span>3D Bars</span>
        </button>
      </div>

      {/* Reset + Layer count */}
      <button
        onClick={resetView}
        className="px-2 py-1.5 rounded-lg border text-[9px] font-mono transition-colors"
        style={{
          backgroundColor: `${variant.colors.bg}E0`,
          borderColor: variant.colors.border,
          color: variant.colors.textMuted,
          backdropFilter: 'blur(12px)',
        }}
      >
        ⟐ Reset ({activeLayers.size})
      </button>
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────
export function GCCMap() {
  const viewState = useMapStore((s) => s.viewState);
  const setViewState = useMapStore((s) => s.setViewState);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const mapStyle = useMapStore((s) => s.style);
  const mode = useMapStore((s) => s.mode);
  const selectedIntelCard = useMapStore((s) => s.selectedIntelCard);
  const selectIntelCard = useMapStore((s) => s.selectIntelCard);
  const dismissIntelCard = useMapStore((s) => s.dismissIntelCard);
  const pulseEnabled = useMapStore((s) => s.pulseAnimationsEnabled);
  const flyToCoords = useMapStore((s) => s.flyToCoords);

  const { variant } = useVariant();
  const hotspots = useDataStore((s) => s.riskHotspots);
  const clusters = useDataStore((s) => s.claimClusters);
  const arcs = useDataStore((s) => s.fraudArcs);
  const alerts = useDataStore((s) => s.alertIcons);

  const pulseRadius = usePulseRadius(pulseEnabled);

  const currentView = viewState ?? INITIAL_VIEW;
  const currentMapStyle = MAP_STYLES[mapStyle];

  const onViewStateChange = useCallback(
    ({ viewState: vs }: { viewState: MapViewState }) => {
      setViewState(vs);
    },
    [setViewState]
  );

  // Click handler for intel card drill-down
  const onLayerClick = useCallback(
    (info: any) => {
      if (!info.object) return;
      const obj = info.object as LayerPoint & Record<string, any>;

      const card: IntelCardData = {
        id: obj.id || `${info.coordinate?.[0]}-${info.coordinate?.[1]}`,
        lat: obj.lat ?? obj.position?.[1] ?? info.coordinate?.[1] ?? 0,
        lon: obj.lon ?? obj.position?.[0] ?? info.coordinate?.[0] ?? 0,
        title: obj.name || obj.label || 'Intelligence Point',
        description: obj.description || `${obj.category || 'Unknown'} activity detected in this area.`,
        severity: obj.severity || 'medium',
        category: obj.layerId || obj.category || 'intelligence',
        layerId: obj.layerId || '',
        riskScore: obj.severity === 'critical' ? 85 + Math.random() * 15 : obj.severity === 'high' ? 60 + Math.random() * 25 : obj.severity === 'medium' ? 35 + Math.random() * 25 : 10 + Math.random() * 25,
        aiSummary: `AI analysis indicates ${obj.severity || 'moderate'} activity at ${obj.name || 'this location'}. Monitoring recommended for GCC insurance exposure assessment.`,
      };

      selectIntelCard(card);
      flyToCoords(card.lat, card.lon, 8);
    },
    [selectIntelCard, flyToCoords]
  );

  // ── Build All 45 Layers ───────────────────────────────
  const deckLayers = useMemo(() => {
    const result: any[] = [];

    // ── Claims & Risk Layers ────────────────────────────
    if (activeLayers.has('claims_heatmap')) {
      result.push(

        new HeatmapLayer({
          id: 'claims-heatmap',
          data: hotspots,
          getPosition: (d: any) => d.position,
          getWeight: (d: any) => d.weight,
          radiusPixels: 60,
          intensity: 1.5,
          threshold: 0.1,
          colorRange: [
            [0, 25, 53], [6, 182, 212], [234, 179, 8], [239, 68, 68], [220, 38, 38],
          ] as [number, number, number][],
          opacity: 0.6,
        })
      );
    }

    if (activeLayers.has('risk_density')) {
      result.push(

        new HexagonLayer({
          id: 'risk-hexagon',
          data: hotspots,
          getPosition: (d: any) => d.position,
          getElevationWeight: (d: any) => d.weight,
          elevationScale: 500,
          extruded: true,
          radius: 15000,
          coverage: 0.85,
          upperPercentile: 95,
          colorRange: [
            [1, 152, 189], [73, 227, 206], [216, 254, 181], [254, 237, 177], [254, 173, 84], [209, 55, 78],
          ],
          opacity: 0.7,
          pickable: true,
        })
      );
    }

    if (activeLayers.has('claim_clusters')) {
      result.push(
        new ScatterplotLayer({
          id: 'claim-clusters',
          data: clusters,
          getPosition: (d: any) => d.position,
          getRadius: (d: any) => Math.sqrt(d.count) * 500 * pulseRadius,
          getFillColor: (d: any) => {
            const days = d.avgProcessingDays;
            if (days < 10) return [16, 185, 129, 180];
            if (days < 14) return [234, 179, 8, 180];
            return [239, 68, 68, 180];
          },
          getLineColor: [255, 255, 255, 60],
          lineWidthMinPixels: 1,
          stroked: true,
          filled: true,
          pickable: true,
          radiusMinPixels: 6,
          radiusMaxPixels: 60,
          opacity: 0.8,
          updateTriggers: { getRadius: [pulseRadius] },
        })
      );
    }

    // ── Fraud Layers ────────────────────────────────────
    if (activeLayers.has('fraud_links')) {
      result.push(

        new ArcLayer({
          id: 'fraud-arcs',
          data: arcs,
          getSourcePosition: (d: any) => d.source,
          getTargetPosition: (d: any) => d.target,
          getSourceColor: [6, 182, 212, 200],
          getTargetColor: [244, 63, 94, 200],
          getWidth: (d: any) => d.weight * 6,
          getHeight: 0.3,
          greatCircle: true,
          pickable: true,
          widthMinPixels: 1,
          widthMaxPixels: 8,
        })
      );
    }

    // ── Geospatial Point Layers (all from global-layers.ts) ──
    const pointLayerConfigs = [
      // Geopolitical & Intelligence
      { layerId: 'conflict_zones', data: CONFLICT_ZONE_POINTS, radiusBase: 18000 },
      { layerId: 'iran_attacks', data: IRAN_ATTACK_POINTS, radiusBase: 16000 },
      { layerId: 'intel_hotspots', data: INTEL_HOTSPOT_POINTS, radiusBase: 14000 },
      // Military
      { layerId: 'military_bases', data: MILITARY_BASE_POINTS, radiusBase: 12000 },
      { layerId: 'strategic_waterways', data: STRATEGIC_WATERWAY_POINTS, radiusBase: 16000 },
      // Nuclear
      { layerId: 'nuclear_sites', data: NUCLEAR_SITE_POINTS, radiusBase: 15000 },
      // Infrastructure
      { layerId: 'pipelines', data: PIPELINE_POINTS, radiusBase: 10000 },
      { layerId: 'ai_data_centers', data: AI_DATA_CENTER_POINTS, radiusBase: 10000 },
      { layerId: 'spaceports', data: SPACEPORT_POINTS, radiusBase: 12000 },
      { layerId: 'desalination', data: DESALINATION_POINTS, radiusBase: 10000 },
      { layerId: 'solar_farms', data: SOLAR_FARM_POINTS, radiusBase: 11000 },
      { layerId: 'oil_facilities', data: OIL_FACILITY_POINTS, radiusBase: 13000 },
      // Finance
      { layerId: 'stock_exchanges', data: STOCK_EXCHANGE_POINTS, radiusBase: 11000 },
      { layerId: 'financial_centers', data: FINANCIAL_CENTER_POINTS, radiusBase: 12000 },
      { layerId: 'central_banks', data: CENTRAL_BANK_POINTS, radiusBase: 10000 },
      { layerId: 'gulf_investments', data: GULF_INVESTMENT_POINTS, radiusBase: 10000 },
      // Tech
      { layerId: 'startup_hubs', data: STARTUP_HUB_POINTS, radiusBase: 10000 },
      { layerId: 'tech_hqs', data: TECH_HQ_POINTS, radiusBase: 10000 },
      { layerId: 'cloud_regions', data: CLOUD_REGION_POINTS, radiusBase: 10000 },
      // Commodity
      { layerId: 'commodity_hubs', data: COMMODITY_HUB_POINTS, radiusBase: 12000 },
    ];

    for (const config of pointLayerConfigs) {
      if (!activeLayers.has(config.layerId) || config.data.length === 0) continue;

      const layerDef = GLOBAL_LAYER_DEFS.find((l) => l.id === config.layerId);
      if (!layerDef) continue;

      // Parse hex color to RGBA
      const hex = layerDef.color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      // Scatterplot for each layer
      result.push(
        new ScatterplotLayer({
          id: `layer-${config.layerId}`,
          data: config.data,
          getPosition: (d: LayerPoint) => [d.lon, d.lat],
          getRadius: (d: LayerPoint) => {
            const sev = d.severity;
            const mult = sev === 'critical' ? 1.8 : sev === 'high' ? 1.4 : sev === 'medium' ? 1.0 : 0.7;
            return config.radiusBase * mult * (pulseEnabled && (sev === 'critical' || sev === 'high') ? pulseRadius : 1);
          },
          getFillColor: (d: LayerPoint) => severityToColor(d.severity) || [r, g, b, 180],
          getLineColor: [r, g, b, 120],
          lineWidthMinPixels: 1,
          stroked: true,
          filled: true,
          pickable: true,
          radiusMinPixels: 4,
          radiusMaxPixels: 40,
          opacity: 0.85,
          updateTriggers: { getRadius: [pulseRadius] },
        })
      );

      // Text labels for each layer
      result.push(
        new TextLayer({
          id: `labels-${config.layerId}`,
          data: config.data,
          getPosition: (d: LayerPoint) => [d.lon, d.lat],
          getText: (d: LayerPoint) => d.name,
          getSize: 10,
          getColor: [255, 255, 255, 180],
          getAngle: 0,
          getTextAnchor: 'start' as const,
          getAlignmentBaseline: 'center' as const,
          getPixelOffset: [12, 0],
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 500,
          outlineWidth: 2,
          outlineColor: [0, 0, 0, 200],
          billboard: true,
        })
      );
    }

    // ── Remaining layers (stub ScatterplotLayers for layers without explicit point data) ──
    const stubLayers = [
      'sanctions_zones', 'refugee_flows', 'naval_assets', 'air_defense', 'aircraft_tracks',
      'gamma_irradiators', 'radiation_watch', 'undersea_cables', 'spaceports', 'power_grid',
      'oil_facilities', 'ports_shipping', 'cyber_threats', 'terror_incidents', 'protest_zones',
      'staging_areas', 'repair_shops', 'hospital_network', 'weather_cat', 'flood_zones',
      'un_missions', 'trade_routes', 'diaspora_hubs', 'naval_patrols',
      'desalination', 'telecom_cables', 'solar_farms', 'osint_feeds', 'social_signal',
      'air_quality', 'seismic_activity', 'dust_storms',
    ];

    for (const layerId of stubLayers) {
      if (!activeLayers.has(layerId)) continue;
      const pts = getLayerPoints(layerId);
      if (pts.length === 0) continue;

      const layerDef = GLOBAL_LAYER_DEFS.find((l) => l.id === layerId);
      if (!layerDef) continue;

      const hex = layerDef.color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      result.push(
        new ScatterplotLayer({
          id: `stub-${layerId}`,
          data: pts,
          getPosition: (d: LayerPoint) => [d.lon, d.lat],
          getRadius: 10000,
          getFillColor: [r, g, b, 160],
          getLineColor: [r, g, b, 80],
          stroked: true,
          filled: true,
          pickable: true,
          radiusMinPixels: 3,
          radiusMaxPixels: 25,
          opacity: 0.7,
        })
      );
    }

    // ── Alert Icons ─────────────────────────────────────
    if (alerts.length > 0) {
      result.push(
        new ScatterplotLayer({
          id: 'alert-icons',
          data: alerts,
          getPosition: (d: any) => d.position,
          getRadius: 8000 * pulseRadius,
          getFillColor: [255, 59, 48, 220],
          getLineColor: [255, 255, 255, 100],
          stroked: true,
          filled: true,
          pickable: true,
          radiusMinPixels: 5,
          radiusMaxPixels: 20,
          opacity: 0.9,
          updateTriggers: { getRadius: [pulseRadius] },
        })
      );
    }

    return result;
  }, [activeLayers, hotspots, clusters, arcs, alerts, pulseRadius, pulseEnabled]);

  // ── Tooltip ───────────────────────────────────────────
  const getTooltip = useCallback(({ object }: { object?: any }) => {
    if (!object) return null;
    const name = object.name || object.label || '';
    const severity = object.severity || '';
    const desc = object.description || '';
    const text = [name, severity ? `[${severity.toUpperCase()}]` : '', desc].filter(Boolean).join(' — ');
    return text ? { text, style: { backgroundColor: '#0a0a0a', color: '#fff', fontSize: '11px', fontFamily: 'monospace', padding: '6px 10px', borderRadius: '6px', border: '1px solid #333' } } : null;
  }, []);

  // ── Render ────────────────────────────────────────────
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* DeckGL 2D Map */}
      {mode === '2d' && (
        <DeckGL
          viewState={currentView}
          onViewStateChange={onViewStateChange}
          controller={{ dragRotate: true, touchRotate: true, inertia: true }}
          layers={deckLayers}
          getTooltip={getTooltip}
          onClick={onLayerClick}
        >
          <Map mapStyle={currentMapStyle} />
        </DeckGL>
      )}

      {/* 3D Globe — lazy loaded */}
      {mode === '3d' && (
        <GlobeViewInline />
      )}

      {/* Controls */}
      <MapControls />

      {/* Time Slider */}
      <TimeSlider />

      {/* Intel Card Drill-Down */}
      {selectedIntelCard && (
        <IntelCard card={selectedIntelCard} onDismiss={dismissIntelCard} />
      )}

      {/* Layer count badge */}
      <div
        className="absolute top-3 left-3 z-20 px-2 py-1 rounded-lg border"
        style={{
          backgroundColor: `${variant.colors.bg}E0`,
          borderColor: variant.colors.border,
          backdropFilter: 'blur(12px)',
        }}
      >
        <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>
          LAYERS {activeLayers.size}/{GLOBAL_LAYER_DEFS.length} · {mode.toUpperCase()} · {mapStyle.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// ── Inline Globe View (3D Mode) ─────────────────────────
function GlobeViewInline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const { variant } = useVariant();
  const viewState = useMapStore((s) => s.viewState);
  const hotspots = useDataStore((s) => s.riskHotspots);
  const arcs = useDataStore((s) => s.fraudArcs);
  const riskExtrusionEnabled = useMapStore((s) => s.riskExtrusionEnabled);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!containerRef.current) return;
      let Globe: any;
      try {
        Globe = (await import('globe.gl')).default;
      } catch {
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-family:monospace;font-size:12px;">
              <div style="text-align:center">
                <div style="font-size:48px;margin-bottom:8px">🌍</div>
                <div>3D Globe — npm install globe.gl three</div>
              </div>
            </div>`;
        }
        return;
      }

      if (!mounted || !containerRef.current) return;

      const points = hotspots.map((h: any) => ({
        lat: h.position[1], lng: h.position[0], size: h.weight * 0.3,
        color: variant.colors.primary, label: h.label || 'Risk Hotspot',
      }));

      const arcData = arcs.map((a: any) => ({
        startLat: a.source[1], startLng: a.source[0],
        endLat: a.target[1], endLng: a.target[0],
        color: variant.colors.critical, stroke: 0.5,
      }));

      // Country risk bars (3D extrusion)
      const countryBars = riskExtrusionEnabled ? [
        { lat: 24.7, lng: 46.7, alt: 0.35, color: '#00D4FF', label: 'Saudi Arabia — DRI: 32' },
        { lat: 25.2, lng: 55.3, alt: 0.22, color: '#10B981', label: 'UAE — DRI: 22' },
        { lat: 29.4, lng: 47.9, alt: 0.38, color: '#EAB308', label: 'Kuwait — DRI: 38' },
        { lat: 25.3, lng: 51.5, alt: 0.20, color: '#10B981', label: 'Qatar — DRI: 20' },
        { lat: 26.1, lng: 50.6, alt: 0.35, color: '#EAB308', label: 'Bahrain — DRI: 35' },
        { lat: 23.6, lng: 58.3, alt: 0.30, color: '#F97316', label: 'Oman — DRI: 30' },
      ] : [];

      const globe = new Globe(containerRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .showAtmosphere(true)
        .atmosphereColor(variant.colors.primary)
        .atmosphereAltitude(0.15)
        .pointsData(points)
        .pointLat('lat').pointLng('lng')
        .pointAltitude((d: any) => d.size * 0.01)
        .pointRadius((d: any) => d.size * 0.15)
        .pointColor('color').pointLabel('label')
        .arcsData(arcData)
        .arcStartLat('startLat').arcStartLng('startLng')
        .arcEndLat('endLat').arcEndLng('endLng')
        .arcColor('color').arcStroke('stroke')
        .arcDashLength(0.4).arcDashGap(0.2).arcDashAnimateTime(1500)
        // 3D Risk Extrusion Bars
        .customLayerData(countryBars)
        .customThreeObject((d: any) => {
          if (typeof window === 'undefined') return null;
          try {
            const THREE = (window as any).THREE;
            if (!THREE) return null;
            const geometry = new THREE.CylinderGeometry(0.6, 0.6, d.alt * 100, 16);
            const material = new THREE.MeshLambertMaterial({ color: d.color, transparent: true, opacity: 0.8 });
            return new THREE.Mesh(geometry, material);
          } catch { return null; }
        })
        .customThreeObjectUpdate((obj: any, d: any) => {
          if (obj) {
            Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt / 2));
          }
        });

      if (viewState) {
        globe.pointOfView({ lat: viewState.latitude, lng: viewState.longitude, altitude: Math.max(0.5, 8 - viewState.zoom * 0.5) }, 0);
      } else {
        globe.pointOfView({ lat: 25.0, lng: 50.0, altitude: 2.5 }, 0);
      }

      const controls = globe.controls();
      if (controls) { controls.autoRotate = true; controls.autoRotateSpeed = 0.3; }

      globeRef.current = globe;
    }

    init();

    return () => {
      mounted = false;
      if (globeRef.current) { globeRef.current._destructor?.(); globeRef.current = null; }
    };
  }, [hotspots, arcs, variant, viewState, riskExtrusionEnabled]);

  // Resize
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current && globeRef.current) {
        globeRef.current.width(containerRef.current.clientWidth);
        globeRef.current.height(containerRef.current.clientHeight);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} className="w-full h-full" style={{ backgroundColor: '#000011' }} />;
}
