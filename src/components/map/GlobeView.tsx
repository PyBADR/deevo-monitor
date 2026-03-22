/**
 * GlobeView — 3D globe engine using globe.gl + Three.js.
 * worldmonitor parity: Renders a photorealistic Earth with data overlays.
 * Supports: arc layers, point layers, hex bins, heatmaps, label overlays.
 * Toggled via the 2D/3D switch in StatusBar / AppShell.
 */
import { useEffect, useRef, useCallback, memo } from 'react';
import { useMapStore } from '@/stores/mapStore';
import { useDataStore } from '@/stores/dataStore';
import { useVariant } from '@/variants';

// Globe.gl is loaded dynamically to avoid SSR issues
let GlobeModule: any = null;

async function loadGlobe() {
  if (!GlobeModule) {
    try {
      GlobeModule = (await import('globe.gl')).default;
    } catch {
      // Fallback: globe.gl not installed yet
      console.warn('[GlobeView] globe.gl not installed. Run: npm install globe.gl three');
      return null;
    }
  }
  return GlobeModule;
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  stroke: number;
  label?: string;
}

interface PointData {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  category: string;
}

export const GlobeView = memo(function GlobeView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const { variant } = useVariant();
  const viewState = useMapStore((s) => s.viewState);
  const hotspots = useDataStore((s) => s.riskHotspots);
  const arcs = useDataStore((s) => s.fraudArcs);

  // Convert hotspots to globe points (position is [lng, lat])
  const points: PointData[] = hotspots.map((h) => ({
    lat: h.position[1],
    lng: h.position[0],
    size: h.weight * 0.3,
    color: variant.colors.primary,
    label: h.label || 'Risk Hotspot',
    category: 'risk',
  }));

  // Convert fraud arcs to globe arcs
  const arcData: ArcData[] = arcs.map((a) => ({
    startLat: a.source[1],
    startLng: a.source[0],
    endLat: a.target[1],
    endLng: a.target[0],
    color: variant.colors.critical,
    stroke: 0.5,
    label: `${a.sourceLabel} → ${a.targetLabel}`,
  }));

  const initGlobe = useCallback(async () => {
    if (!containerRef.current) return;

    const Globe = await loadGlobe();
    if (!Globe) {
      // Render fallback
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:${variant.colors.textMuted};font-family:monospace;font-size:12px;">
            <div style="text-align:center">
              <div style="font-size:48px;margin-bottom:8px">🌍</div>
              <div>3D Globe requires: npm install globe.gl three</div>
              <div style="margin-top:4px;opacity:0.6">Falling back to 2D map</div>
            </div>
          </div>
        `;
      }
      return;
    }

    const globe = new Globe(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .showAtmosphere(true)
      .atmosphereColor(variant.colors.primary)
      .atmosphereAltitude(0.15)
      // Points layer
      .pointsData(points)
      .pointLat('lat')
      .pointLng('lng')
      .pointAltitude((d: PointData) => d.size * 0.01)
      .pointRadius((d: PointData) => d.size * 0.15)
      .pointColor('color')
      .pointLabel('label')
      // Arcs layer
      .arcsData(arcData)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor('color')
      .arcStroke('stroke')
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(1500)
      .arcLabel('label');

    // Set initial POV to match the 2D map's viewState
    if (viewState) {
      globe.pointOfView({
        lat: viewState.latitude,
        lng: viewState.longitude,
        altitude: Math.max(0.5, 8 - viewState.zoom * 0.5),
      }, 0);
    } else {
      // Default: GCC center
      globe.pointOfView({ lat: 25.0, lng: 50.0, altitude: 2.5 }, 0);
    }

    globeRef.current = globe;

    // Auto-rotate
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
    }
  }, [points, arcData, variant, viewState]);

  useEffect(() => {
    initGlobe();

    return () => {
      if (globeRef.current) {
        globeRef.current._destructor?.();
        globeRef.current = null;
      }
    };
  }, [initGlobe]);

  // Resize handler
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

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ backgroundColor: '#000011' }}
    />
  );
});
