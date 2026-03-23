/**
 * DEEVO Wide Forecast Engine
 * Layer: Models → Agents
 * Macro-level forecasting: sector trends + GDP direction + cross-sector pressure
 * Horizons: 24h, 7d, 30d
 * Answers: "Where is the GCC economy heading?"
 */

import type { EventCluster } from './types';
import type { SectorId, GDPComponent } from './sectorOntology';
import { SECTOR_REGISTRY } from './sectorOntology';
import type { ClusterSectorAnalysis } from './sectorImpactEngine';
import { analyzeClusterSectorImpact } from './sectorImpactEngine';
import type { GDPSnapshot } from './gdpIntelligenceEngine';
import { computeGDPSnapshot } from './gdpIntelligenceEngine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ForecastHorizon = '24h' | '7d' | '30d';

export interface SectorForecast {
  sectorId: SectorId;
  label: string;
  horizons: Record<ForecastHorizon, {
    direction: 'improving' | 'deteriorating' | 'stable';
    pressure: number; // -1 to +1
    confidence: number; // 0-1
  }>;
}

export interface GDPForecast {
  component: GDPComponent;
  label: string;
  horizons: Record<ForecastHorizon, {
    direction: 'expanding' | 'contracting' | 'stable';
    score: number; // -1 to +1
    confidence: number;
  }>;
}

export interface MacroForecast {
  timestamp: string;
  /** Overall GCC economic outlook */
  overallOutlook: 'positive' | 'negative' | 'mixed';
  overallScore: number; // -1 to +1
  /** Per-sector forecasts */
  sectorForecasts: SectorForecast[];
  /** GDP component forecasts */
  gdpForecasts: GDPForecast[];
  /** Cross-sector pressure points */
  pressurePoints: Array<{
    from: SectorId;
    to: SectorId;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    horizon: ForecastHorizon;
  }>;
  /** Executive headline */
  headline: string;
}

// ---------------------------------------------------------------------------
// Horizon Decay — confidence drops with longer horizons
// ---------------------------------------------------------------------------

const HORIZON_DECAY: Record<ForecastHorizon, number> = {
  '24h': 1.0,
  '7d': 0.7,
  '30d': 0.4,
};

const HORIZON_MOMENTUM: Record<ForecastHorizon, number> = {
  '24h': 1.0,   // Full signal strength
  '7d': 0.85,   // Some mean reversion
  '30d': 0.6,   // Significant mean reversion
};

// ---------------------------------------------------------------------------
// Sector Forecast Builder
// ---------------------------------------------------------------------------

function buildSectorForecasts(analyses: ClusterSectorAnalysis[]): SectorForecast[] {
  const sectorPressures = new Map<SectorId, number[]>();

  for (const analysis of analyses) {
    for (const impact of analysis.impacts) {
      if (impact.totalImpact < 0.05) continue;
      const pressures = sectorPressures.get(impact.sectorId) ?? [];
      // Negative pressure if risk drivers triggered, positive if entities active but no risk
      const pressure = impact.triggeredDrivers.length > 0
        ? -impact.totalImpact
        : impact.totalImpact * 0.5;
      pressures.push(pressure);
      sectorPressures.set(impact.sectorId, pressures);
    }
  }

  const forecasts: SectorForecast[] = [];
  for (const [sectorId, sector] of SECTOR_REGISTRY) {
    const pressures = sectorPressures.get(sectorId) ?? [];
    const avgPressure = pressures.length > 0
      ? pressures.reduce((a, b) => a + b, 0) / pressures.length
      : 0;

    const horizons = {} as SectorForecast['horizons'];
    for (const h of ['24h', '7d', '30d'] as ForecastHorizon[]) {
      const p = avgPressure * HORIZON_MOMENTUM[h];
      horizons[h] = {
        direction: p > 0.1 ? 'improving' : p < -0.1 ? 'deteriorating' : 'stable',
        pressure: Math.round(p * 100) / 100,
        confidence: Math.min(1, pressures.length * 0.15) * HORIZON_DECAY[h],
      };
    }

    forecasts.push({ sectorId, label: sector.label, horizons });
  }

  return forecasts.sort((a, b) =>
    Math.abs(b.horizons['24h'].pressure) - Math.abs(a.horizons['24h'].pressure)
  );
}

// ---------------------------------------------------------------------------
// GDP Forecast Builder
// ---------------------------------------------------------------------------

function buildGDPForecasts(gdpSnapshot: GDPSnapshot): GDPForecast[] {
  return gdpSnapshot.components.map((comp): GDPForecast => {
    const horizons = {} as GDPForecast['horizons'];
    for (const h of ['24h', '7d', '30d'] as ForecastHorizon[]) {
      const score = comp.pressure * HORIZON_MOMENTUM[h];
      horizons[h] = {
        direction: score > 0.15 ? 'expanding' : score < -0.15 ? 'contracting' : 'stable',
        score: Math.round(score * 100) / 100,
        confidence: comp.confidence * HORIZON_DECAY[h],
      };
    }
    return { component: comp.component, label: comp.label, horizons };
  });
}

// ---------------------------------------------------------------------------
// Pressure Point Detection
// ---------------------------------------------------------------------------

function detectPressurePoints(
  sectorForecasts: SectorForecast[]
): MacroForecast['pressurePoints'] {
  const points: MacroForecast['pressurePoints'] = [];
  const deteriorating = sectorForecasts.filter(
    (f) => f.horizons['24h'].direction === 'deteriorating'
  );

  // For each deteriorating sector, check if connected sectors are also under stress
  for (const sf of deteriorating) {
    const sector = SECTOR_REGISTRY.get(sf.sectorId);
    if (!sector) continue;
    for (const dep of sector.dependencies) {
      const depForecast = sectorForecasts.find((f) => f.sectorId === dep);
      if (!depForecast) continue;
      const combined = Math.abs(sf.horizons['24h'].pressure) + Math.abs(depForecast.horizons['24h'].pressure);
      if (combined < 0.2) continue;

      const severity = combined > 0.8 ? 'critical' : combined > 0.5 ? 'high' : combined > 0.3 ? 'medium' : 'low';
      const horizon: ForecastHorizon = combined > 0.6 ? '24h' : combined > 0.3 ? '7d' : '30d';

      points.push({
        from: sf.sectorId,
        to: dep,
        type: 'cross-sector stress',
        severity,
        horizon,
      });
    }
  }

  return points.sort((a, b) => {
    const sev = { critical: 4, high: 3, medium: 2, low: 1 };
    return sev[b.severity] - sev[a.severity];
  });
}

// ---------------------------------------------------------------------------
// Headline Generator
// ---------------------------------------------------------------------------

function generateHeadline(overallScore: number, topSector: SectorForecast | undefined): string {
  const dir = overallScore > 0.2 ? 'positive' : overallScore < -0.2 ? 'negative' : 'mixed';
  const sectorName = topSector?.label ?? 'multiple sectors';
  if (dir === 'positive') return `GCC outlook improving — ${sectorName} leading growth`;
  if (dir === 'negative') return `GCC under pressure — ${sectorName} driving risk`;
  return `GCC outlook mixed — watch ${sectorName} for directional signal`;
}

// ---------------------------------------------------------------------------
// Main: Generate macro forecast from event clusters
// ---------------------------------------------------------------------------

export function generateMacroForecast(clusters: EventCluster[]): MacroForecast {
  // Step 1: Sector impact analysis
  const analyses = clusters.map(analyzeClusterSectorImpact);

  // Step 2: GDP snapshot
  const gdpSnapshot = computeGDPSnapshot(clusters);

  // Step 3: Sector forecasts
  const sectorForecasts = buildSectorForecasts(analyses);

  // Step 4: GDP forecasts
  const gdpForecasts = buildGDPForecasts(gdpSnapshot);

  // Step 5: Pressure points
  const pressurePoints = detectPressurePoints(sectorForecasts);

  // Step 6: Overall score
  const overallScore = gdpSnapshot.overallPressure;
  const overallOutlook: MacroForecast['overallOutlook'] =
    overallScore > 0.15 ? 'positive' : overallScore < -0.15 ? 'negative' : 'mixed';

  return {
    timestamp: new Date().toISOString(),
    overallOutlook,
    overallScore,
    sectorForecasts,
    gdpForecasts,
    pressurePoints,
    headline: generateHeadline(overallScore, sectorForecasts[0]),
  };
}
