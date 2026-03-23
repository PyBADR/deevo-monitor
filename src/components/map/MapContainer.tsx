/**
 * DEEVO GCC Decision Map — MapLibre + deck.gl
 * Production-grade geospatial intelligence layer.
 * GCC-locked viewport. 4 real data layers. No mock data.
 */

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import maplibregl from 'maplibre-gl';
import { Deck } from '@deck.gl/core';
import { ArcLayer, ScatterplotLayer, PolygonLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { GCC_CENTER, GCC_ZOOM, GCC_BOUNDS, MAP_STYLE, GCC_COUNTRIES } from '../../lib/map/map-config';
import type { LayerId } from '../../lib/map/layers-config';
import { LAYER_CONFIGS } from '../../lib/map/layers-config';
import {
  GCC_PORTS, TRADE_ROUTES, OIL_FLOWS, RISK_ZONES, INSURANCE_EXPOSURE,
} from '../../lib/map/data-adapters';

// ---------------------------------------------------------------------------
// Style tokens
// ---------------------------------------------------------------------------

const C = {
  bg: '#020617',
  surface: '#0f172a',
  border: '#1e293b',
  borderLight: '#334155',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  cyan: '#22d3ee',
};

const STATUS_COLORS: Record<string, [number, number, number]> = {
  stable: [52, 211, 153],
  risk: [245, 166, 35],
  disruption: [248, 113, 113],
};

// ---------------------------------------------------------------------------
// Layer Builder
// ---------------------------------------------------------------------------

function buildDeckLayers(visible: Set<LayerId>) {
  const layers = [];

  layers.push(
    new ScatterplotLayer({
      id: 'gcc-ports',
      data: GCC_PORTS,
      getPosition: (d: typeof GCC_PORTS[0]) => d.coordinates,
      getRadius: (d: typeof GCC_PORTS[0]) => 8000 + d.intensity * 20000,
      getFillColor: [34, 211, 238, 180],
      getLineColor: [34, 211, 238, 255],
      lineWidthMinPixels: 1,
      stroked: true,
      pickable: true,
    })
  );

  if (visible.has('trade-routes')) {
    layers.push(
      new ArcLayer({
        id: 'trade-routes',
        data: TRADE_ROUTES,
        getSourcePosition: (d: typeof TRADE_ROUTES[0]) => d.source,
        getTargetPosition: (d: typeof TRADE_ROUTES[0]) => d.target,
        getSourceColor: (d: typeof TRADE_ROUTES[0]) => STATUS_COLORS[d.status] ?? STATUS_COLORS.stable,
        getTargetColor: (d: typeof TRADE_ROUTES[0]) => STATUS_COLORS[d.status] ?? STATUS_COLORS.stable,
        getWidth: (d: typeof TRADE_ROUTES[0]) => 1 + d.volume * 4,
        greatCircle: true,
        pickable: true,
      })
    );
  }

  if (visible.has('oil-flow')) {
    layers.push(
      new ArcLayer({
        id: 'oil-flow',
        data: OIL_FLOWS,
        getSourcePosition: (d: typeof OIL_FLOWS[0]) => d.source,
        getTargetPosition: (d: typeof OIL_FLOWS[0]) => d.target,
        getSourceColor: (d: typeof OIL_FLOWS[0]) => STATUS_COLORS[d.status] ?? [245, 166, 35],
        getTargetColor: [245, 166, 35, 200],
        getWidth: (d: typeof OIL_FLOWS[0]) => 1 + d.volume * 5,
        greatCircle: true,
        pickable: true,
      })
    );
  }

  if (visible.has('risk-zones')) {
    layers.push(
      new PolygonLayer({
        id: 'risk-zones',
        data: RISK_ZONES,
        getPolygon: (d: typeof RISK_ZONES[0]) => d.coordinates,
        getFillColor: (d: typeof RISK_ZONES[0]) => [248, 113, 113, Math.round(d.risk * 80)],
        getLineColor: [248, 113, 113, 180],
        lineWidthMinPixels: 1,
        stroked: true,
        filled: true,
        pickable: true,
      })
    );
  }

  if (visible.has('insurance-exposure')) {
    layers.push(
      new HeatmapLayer({
        id: 'insurance-exposure',
        data: INSURANCE_EXPOSURE,
        getPosition: (d: typeof INSURANCE_EXPOSURE[0]) => d.coordinates,
        getWeight: (d: typeof INSURANCE_EXPOSURE[0]) => d.weight,
        radiusPixels: 60,
        intensity: 1.2,
        threshold: 0.1,
      })
    );
  }

  return layers;
}

// ---------------------------------------------------------------------------
// Layer Toggle Panel
// ---------------------------------------------------------------------------

function LayerPanel({
  visibleLayers,
  onToggle,
}: {
  visibleLayers: Set<LayerId>;
  onToggle: (id: LayerId) => void;
}) {
  return (
    <div style={{
      position: 'absolute', bottom: 16, left: 16, zIndex: 10,
      display: 'flex', gap: 6,
    }}>
      {LAYER_CONFIGS.map((layer) => {
        const active = visibleLayers.has(layer.id);
        return (
          <button
            key={layer.id}
            onClick={() => onToggle(layer.id)}
            style={{
              borderRadius: 999,
              border: `1px solid ${active ? layer.color + '99' : C.borderLight}`,
              background: active ? layer.color + '20' : 'rgba(15,23,42,0.85)',
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 500,
              color: active ? layer.color : C.textDim,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.15s',
            }}
          >
            <span style={{
              display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
              background: active ? layer.color : C.textDim, marginRight: 6,
            }} />
            {layer.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Map Component
// ---------------------------------------------------------------------------

function MapContainerInner() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const deckRef = useRef<Deck | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<Set<LayerId>>(
    () => new Set(LAYER_CONFIGS.filter((l) => l.visible).map((l) => l.id))
  );

  const toggleLayer = useCallback((id: LayerId) => {
    setVisibleLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: GCC_CENTER,
      zoom: GCC_ZOOM,
      maxBounds: GCC_BOUNDS,
      attributionControl: false,
      antialias: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      Object.entries(GCC_COUNTRIES).forEach(([_code, country]) => {
        const el = document.createElement('div');
        el.style.cssText = `font-size:10px;color:${C.textMuted};pointer-events:none;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,0.8);`;
        el.textContent = country.name;
        new maplibregl.Marker({ element: el }).setLngLat([country.lng, country.lat]).addTo(map);
      });
    });

    mapRef.current = map;

    const deck = new Deck({
      parent: mapContainerRef.current,
      style: { position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' },
      viewState: {
        longitude: GCC_CENTER[0],
        latitude: GCC_CENTER[1],
        zoom: GCC_ZOOM,
        pitch: 0,
        bearing: 0,
      },
      controller: false,
      layers: [],
    });

    map.on('move', () => {
      const center = map.getCenter();
      deck.setProps({
        viewState: {
          longitude: center.lng,
          latitude: center.lat,
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          bearing: map.getBearing(),
        },
      });
    });

    deckRef.current = deck;

    return () => {
      deck.finalize();
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!deckRef.current) return;
    deckRef.current.setProps({ layers: buildDeckLayers(visibleLayers) });
  }, [visibleLayers]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <LayerPanel visibleLayers={visibleLayers} onToggle={toggleLayer} />
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 10,
        borderRadius: 12, border: `1px solid ${C.border}`,
        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
        padding: '8px 14px', fontSize: 11, color: C.textMuted,
      }}>
        <span style={{ color: C.cyan, marginRight: 8 }}>●</span>
        GCC Decision Map — Live
      </div>
    </div>
  );
}

export default memo(MapContainerInner);
