'use client';
// ─── DEEVO CORTEX — DECK.GL + MAPLIBRE MAP ENGINE ──────────────────────────
// Phase 2: Real WebGL map replacing Canvas 2D
// Tile source: OpenFreeMap (free, no key, OpenStreetMap data)

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { GCCCountry, GeoEvent, MapLayer } from '@/config/gcc-data';
import { CHOKEPOINTS, GLOBAL_PARTNERS } from '@/config/gcc-data';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface ScatterPoint {
  position: [number, number];
  color: [number, number, number, number];
  radius: number;
  label: string;
  type: 'country' | 'airport' | 'chokepoint' | 'event' | 'partner';
  data?: unknown;
}

interface ArcData {
  sourcePosition: [number, number];
  targetPosition: [number, number];
  sourceColor: [number, number, number, number];
  targetColor: [number, number, number, number];
  width: number;
}

interface GCCGlobeProps {
  layers: MapLayer[];
  countries: GCCCountry[];
  activeCountry: string | null;
  setActiveCountry: (c: string | null) => void;
  activeEvent: GeoEvent | null;
  is3D: boolean;
}

// ─── COLOR HELPERS ────────────────────────────────────────────────────────────
function hexToRGBA(hex: string, alpha = 255): [number, number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, alpha];
}

const RISK_HEX: Record<number, string> = {
  1: '#10b981', 2: '#84cc16', 3: '#f59e0b', 4: '#f97316', 5: '#ef4444',
};

// ─── MAIN MAP COMPONENT ───────────────────────────────────────────────────────
export default function GCCGlobe({
  layers, countries, activeCountry, setActiveCountry, activeEvent, is3D,
}: GCCGlobeProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const deckRef = useRef<unknown>(null);
  const [mapReady, setMapReady] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const activeLayerIds = layers.filter(l => l.active).map(l => l.id);

  // ─── INIT MAPLIBRE ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let map: unknown;
    let deck: unknown;

    async function init() {
      const [maplibre, deckModule] = await Promise.all([
        import('maplibre-gl'),
        import('deck.gl'),
      ]);

      const { Map: MLMap } = maplibre;
      const { Deck, ScatterplotLayer, ArcLayer, TextLayer, ColumnLayer } = deckModule;

      // OpenFreeMap tiles — free, no API key, global coverage
      map = new MLMap({
        container: mapContainerRef.current!,
        style: {
          version: 8,
          name: 'Dark GCC',
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://tile.openfreemap.org/dark/{z}/{x}/{y}',
              ],
              tileSize: 256,
              attribution: '© OpenFreeMap · © OpenStreetMap',
            } as unknown as maplibregl.RasterSourceSpecification,
          },
          layers: [
            {
              id: 'osm-background',
              type: 'raster',
              source: 'osm-tiles',
              paint: { 'raster-opacity': 0.85, 'raster-brightness-min': 0 },
            } as maplibregl.LayerSpecification,
          ],
        },
        center: [50.5, 25.5],   // GCC center
        zoom: 4.2,
        minZoom: 2,
        maxZoom: 14,
        bearing: 0,
        pitch: is3D ? 45 : 0,
        antialias: true,
        attributionControl: false,
      } as maplibregl.MapOptions);

      // Dark overlay tint
      (map as maplibregl.Map).on('load', () => {
        // Add country fill layer from vector tiles for GCC highlight
        try {
          (map as maplibregl.Map).addSource('countries-fill', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: countries.map(c => ({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
                properties: { code: c.code, color: c.color, gdp: c.gdp_usd_billion },
              })),
            },
          });
        } catch (_e) { /* ok if already loaded */ }
        setMapReady(true);
      });

      mapRef.current = map;

      // Create Deck.gl overlay
      deck = new Deck({
        canvas: 'deck-canvas',
        width: '100%',
        height: '100%',
        initialViewState: {
          longitude: 50.5,
          latitude: 25.5,
          zoom: 4.2,
          pitch: is3D ? 45 : 0,
          bearing: 0,
        },
        controller: false, // MapLibre handles pan/zoom
        layers: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onViewStateChange: ({ viewState }: any) => {
          const vs = viewState;
          (map as maplibregl.Map).jumpTo({
            center: [vs.longitude, vs.latitude] as [number, number],
            zoom: vs.zoom,
            bearing: vs.bearing,
            pitch: vs.pitch,
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onHover: (info: any) => { const { object, x, y } = info;
          if (object) {
            const obj = object as {label?: string; name?: string};
            setTooltip({ x, y, text: obj.label || obj.name || '' });
          } else {
            setTooltip(null);
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick: (info: any) => { const { object } = info;
          if (object) {
            const obj = object as {type?: string; code?: string};
            if (obj.type === 'country' && obj.code) {
              setActiveCountry(obj.code === activeCountry ? null : obj.code);
            }
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getCursor: (info: any) => info.isHovering ? 'pointer' : 'crosshair',
      });

      deckRef.current = deck;
    }

    init();

    return () => {
      if (mapRef.current) {
        (mapRef.current as maplibregl.Map).remove();
        mapRef.current = null;
      }
      if (deckRef.current) {
        (deckRef.current as {finalize: () => void}).finalize();
        deckRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── UPDATE DECK LAYERS WHEN STATE CHANGES ─────────────────────────────────
  useEffect(() => {
    if (!deckRef.current) return;

    const deck = deckRef.current as {setProps: (p: unknown) => void};
    const deckModule = require('deck.gl');
    const { ScatterplotLayer, ArcLayer, TextLayer } = deckModule;

    const deckLayers: unknown[] = [];

    // ── 1. TRADE ARC LAYER ──────────────────────────────────────────────────
    if (activeLayerIds.includes('trade')) {
      const arcs: ArcData[] = GLOBAL_PARTNERS.map(p => ({
        sourcePosition: [50.5, 25.5] as [number, number],
        targetPosition: [p.lng, p.lat] as [number, number],
        sourceColor: [245, 158, 11, 60] as [number, number, number, number],
        targetColor: hexToRGBA(p.color, 80),
        width: Math.max(1, p.gcc_trade_usd_billion / 60),
      }));

      deckLayers.push(new ArcLayer({
        id: 'trade-arcs',
        data: arcs,
        getSourcePosition: (d: ArcData) => d.sourcePosition,
        getTargetPosition: (d: ArcData) => d.targetPosition,
        getSourceColor: (d: ArcData) => d.sourceColor,
        getTargetColor: (d: ArcData) => d.targetColor,
        getWidth: (d: ArcData) => d.width,
        opacity: 0.7,
        pickable: false,
      }));
    }

    // ── 2. GDP BUBBLE LAYER ──────────────────────────────────────────────────
    if (activeLayerIds.includes('gdp')) {
      const gdpPoints = countries.map(c => ({
        position: [c.lng, c.lat, 0] as [number, number, number],
        color: [...hexToRGBA(c.color, 40)] as [number, number, number, number],
        radius: Math.sqrt(c.gdp_usd_billion) * 1800,
        label: `$${c.gdp_usd_billion}B`,
        type: 'gdp-bubble',
      }));

      deckLayers.push(new ScatterplotLayer({
        id: 'gdp-bubbles',
        data: gdpPoints,
        getPosition: (d: {position: [number,number,number]}) => d.position,
        getRadius: (d: {radius: number}) => d.radius,
        getFillColor: (d: {color: [number,number,number,number]}) => d.color,
        getLineColor: (d: {color: [number,number,number,number]}) => [...d.color.slice(0, 3), 120] as [number,number,number,number],
        stroked: true,
        lineWidthMinPixels: 1,
        pickable: false,
        opacity: 0.8,
        radiusUnits: 'meters',
      }));
    }

    // ── 3. COUNTRY NODES ────────────────────────────────────────────────────
    const countryPoints: ScatterPoint[] = countries.map(c => {
      const riskColor = hexToRGBA(RISK_HEX[Math.ceil(c.oil_revenue_pct / 20) as 1|2|3|4|5] || '#f59e0b', 200);
      return {
        position: [c.lng, c.lat] as [number, number],
        color: riskColor,
        radius: c.code === activeCountry ? 55000 : 40000,
        label: c.code,
        type: 'country' as const,
        data: { code: c.code, name: c.name, gdp: c.gdp_usd_billion },
      };
    });

    deckLayers.push(
      new ScatterplotLayer({
        id: 'country-nodes',
        data: countryPoints,
        getPosition: (d: ScatterPoint) => d.position,
        getRadius: (d: ScatterPoint) => d.radius,
        getFillColor: (d: ScatterPoint) => d.color,
        getLineColor: [255, 255, 255, 100],
        stroked: true,
        lineWidthMinPixels: activeCountry ? 2 : 1,
        pickable: true,
        radiusUnits: 'meters',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick: ({ object }: any) => {
          if (object?.type === 'country') {
            const c = countries.find(x => x.code === (object.data as {code: string}).code);
            if (c) setActiveCountry(c.code === activeCountry ? null : c.code);
          }
        },
      }),
      new TextLayer({
        id: 'country-labels',
        data: countryPoints,
        getPosition: (d: ScatterPoint) => [d.position[0] + 0.5, d.position[1] + 0.3] as [number,number],
        getText: (d: ScatterPoint) => d.label,
        getSize: 13,
        getColor: [212, 240, 216, 220],
        fontFamily: 'monospace',
        pickable: false,
      }),
    );

    // ── 4. AIRPORT LAYER ────────────────────────────────────────────────────
    if (activeLayerIds.includes('airports')) {
      const airportPoints = countries.flatMap(c =>
        c.airports.map(a => ({
          position: [a.lng, a.lat] as [number, number],
          color: [6, 182, 212, 200] as [number, number, number, number],
          radius: a.type === 'mega' ? 28000 : 18000,
          label: a.iata,
          type: 'airport' as const,
          data: { iata: a.iata, name: a.name, pax: a.pax_annual_million },
        }))
      );

      deckLayers.push(
        new ScatterplotLayer({
          id: 'airports',
          data: airportPoints,
          getPosition: (d: ScatterPoint) => d.position,
          getRadius: (d: ScatterPoint) => d.radius,
          getFillColor: (d: ScatterPoint) => d.color,
          getLineColor: [6, 182, 212, 120],
          stroked: true,
          lineWidthMinPixels: 1,
          pickable: true,
          radiusUnits: 'meters',
        }),
        new TextLayer({
          id: 'airport-labels',
          data: airportPoints,
          getPosition: (d: ScatterPoint) => [d.position[0] + 0.3, d.position[1] + 0.2] as [number,number],
          getText: (d: ScatterPoint) => d.label,
          getSize: 10,
          getColor: [6, 182, 212, 180],
          fontFamily: 'monospace',
          pickable: false,
        }),
      );
    }

    // ── 5. CHOKEPOINT LAYER ─────────────────────────────────────────────────
    if (activeLayerIds.includes('chokepoints')) {
      const cpColors: Record<string, [number,number,number,number]> = {
        CRITICAL: [239, 68, 68, 200],
        HIGH: [249, 115, 22, 200],
        MEDIUM: [245, 158, 11, 180],
      };

      const cpPoints = CHOKEPOINTS.map(c => ({
        position: [c.lng, c.lat] as [number, number],
        color: cpColors[c.riskLevel] || [245, 158, 11, 180],
        radius: 60000,
        label: c.name.split(' ').slice(-1)[0],
        type: 'chokepoint' as const,
        data: c,
      }));

      deckLayers.push(new ScatterplotLayer({
        id: 'chokepoints',
        data: cpPoints,
        getPosition: (d: ScatterPoint) => d.position,
        getRadius: (d: ScatterPoint) => d.radius,
        getFillColor: (d: ScatterPoint) => [
          ...(d.color as [number,number,number,number]).slice(0, 3), 40
        ] as [number,number,number,number],
        getLineColor: (d: ScatterPoint) => d.color as [number,number,number,number],
        stroked: true,
        lineWidthMinPixels: 2,
        pickable: true,
        radiusUnits: 'meters',
      }));
    }

    // ── 6. GEO EVENT PULSE ──────────────────────────────────────────────────
    if (activeEvent) {
      const pulseColor: [number,number,number,number] = [239, 68, 68, 160];
      const evtPoint = [{
        position: [activeEvent.origin_lng, activeEvent.origin_lat] as [number, number],
        color: pulseColor,
        radius: 120000,
        label: activeEvent.severity,
        type: 'event' as const,
      }];

      deckLayers.push(new ScatterplotLayer({
        id: 'active-event',
        data: evtPoint,
        getPosition: (d: ScatterPoint) => d.position,
        getRadius: (d: ScatterPoint) => d.radius,
        getFillColor: [239, 68, 68, 25],
        getLineColor: [239, 68, 68, 180],
        stroked: true,
        lineWidthMinPixels: 2,
        pickable: false,
        radiusUnits: 'meters',
      }));

      // Event arc to target
      if (activeEvent.target_lat && activeEvent.target_lng) {
        deckLayers.push(new ArcLayer({
          id: 'event-arc',
          data: [{
            sourcePosition: [activeEvent.origin_lng, activeEvent.origin_lat] as [number,number],
            targetPosition: [activeEvent.target_lng!, activeEvent.target_lat!] as [number,number],
            sourceColor: [239, 68, 68, 220] as [number,number,number,number],
            targetColor: [249, 115, 22, 180] as [number,number,number,number],
            width: 3,
          }],
          getSourcePosition: (d: ArcData) => d.sourcePosition,
          getTargetPosition: (d: ArcData) => d.targetPosition,
          getSourceColor: (d: ArcData) => d.sourceColor,
          getTargetColor: (d: ArcData) => d.targetColor,
          getWidth: 3,
          pickable: false,
        }));
      }
    }

    // ── 7. GLOBAL PARTNER DOTS ─────────────────────────────────────────────
    if (activeLayerIds.includes('trade')) {
      const partnerPoints = GLOBAL_PARTNERS.map(p => ({
        position: [p.lng, p.lat] as [number, number],
        color: hexToRGBA(p.color, 160),
        radius: 20000,
        label: p.code,
        type: 'partner' as const,
        data: p,
      }));

      deckLayers.push(
        new ScatterplotLayer({
          id: 'partners',
          data: partnerPoints,
          getPosition: (d: ScatterPoint) => d.position,
          getRadius: (d: ScatterPoint) => d.radius,
          getFillColor: (d: ScatterPoint) => d.color as [number,number,number,number],
          pickable: true,
          radiusUnits: 'meters',
        }),
        new TextLayer({
          id: 'partner-labels',
          data: partnerPoints,
          getPosition: (d: ScatterPoint) => [d.position[0] + 0.8, d.position[1] + 0.2] as [number,number],
          getText: (d: ScatterPoint) => d.label,
          getSize: 10,
          getColor: [212, 240, 216, 140],
          fontFamily: 'monospace',
          pickable: false,
        }),
      );
    }

    deck.setProps({ layers: deckLayers });
  }, [activeLayerIds.join(','), activeCountry, activeEvent, mapReady, countries]);

  // ─── PITCH TRANSITION (2D ↔ 3D) ───────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    (mapRef.current as maplibregl.Map).easeTo({
      pitch: is3D ? 50 : 0,
      duration: 600,
    });
  }, [is3D]);

  // ─── ACTIVE COUNTRY FLY-TO ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !activeCountry) return;
    const c = countries.find(x => x.code === activeCountry);
    if (!c) return;
    (mapRef.current as maplibregl.Map).flyTo({
      center: [c.lng, c.lat] as [number, number],
      zoom: 6,
      duration: 1000,
    });
  }, [activeCountry, countries]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#040a06' }}>
      {/* MapLibre container */}
      <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Deck.gl canvas overlay */}
      <canvas
        id="deck-canvas"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Tooltip */}
      {tooltip && tooltip.text && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 12,
          top: tooltip.y - 10,
          background: '#070e09ee',
          border: '1px solid #1a2e1e',
          borderRadius: 3,
          padding: '4px 8px',
          fontFamily: 'monospace',
          fontSize: 10,
          color: '#d4f0d8',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          {tooltip.text}
        </div>
      )}

      {/* Attribution */}
      <div style={{
        position: 'absolute', bottom: 4, right: 8,
        fontFamily: 'monospace', fontSize: 7,
        color: '#3a5c42', pointerEvents: 'none',
      }}>
        © OpenFreeMap · © OpenStreetMap · deck.gl
      </div>

      {/* Loading overlay */}
      {!mapReady && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#040a06',
          flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#10b981', letterSpacing: 2 }}>
            LOADING MAP TILES...
          </div>
          <div style={{ width: 120, height: 2, background: '#132018', borderRadius: 1 }}>
            <div style={{ width: '60%', height: '100%', background: '#10b981', borderRadius: 1, animation: 'pulse 1.5s infinite' }} />
          </div>
        </div>
      )}
    </div>
  );
}
