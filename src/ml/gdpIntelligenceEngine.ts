/**
 * DEEVO GDP Intelligence Engine
 * Layer: Models
 * Maps every signal cluster to GDP components (C + I + G + NX).
 * Computes directional impact, magnitude, and aggregate GDP pressure.
 * Answers: "Is the GCC economy expanding or contracting right now?"
 */

import type { EventCluster } from './types';
import type { GDPComponent, GDPImpact, SectorId } from './sectorOntology';
import { SECTOR_REGISTRY } from './sectorOntology';
import { analyzeClusterSectorImpact } from './sectorImpactEngine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GDPComponentState {
  component: GDPComponent;
  label: string;
  /** Directional pressure: -1 (contracting) to +1 (expanding) */
  pressure: number;
  /** Confidence in the assessment (0-1) */
  confidence: number;
  /** Magnitude of movement (0-1) */
  magnitude: number;
  /** Contributing sectors */
  contributors: Array<{ sectorId: SectorId; label: string; impact: number }>;
  /** Human-readable assessment */
  narrative: string;
}

export interface GDPSnapshot {
  timestamp: string;
  /** Overall GDP direction: expanding / contracting / stable */
  overallDirection: 'expanding' | 'contracting' | 'stable';
  /** Overall pressure score: -1 to +1 */
  overallPressure: number;
  /** Per-component breakdown */
  components: GDPComponentState[];
  /** Number of clusters analyzed */
  clustersAnalyzed: number;
  /** Top risk to GDP right now */
  topRisk: string;
  /** Top growth driver right now */
  topGrowthDriver: string;
}

// ---------------------------------------------------------------------------
// GDP Component Labels and Weights
// ---------------------------------------------------------------------------

const GDP_META: Record<GDPComponent, { label: string; gccWeight: number }> = {
  'consumption': { label: 'Consumption (C)', gccWeight: 0.25 },
  'investment': { label: 'Investment (I)', gccWeight: 0.25 },
  'government-spending': { label: 'Government Spending (G)', gccWeight: 0.30 },
  'net-exports': { label: 'Net Exports (NX)', gccWeight: 0.20 },
};

// ---------------------------------------------------------------------------
// Narrative Templates
// ---------------------------------------------------------------------------

function generateComponentNarrative(
  component: GDPComponent,
  pressure: number,
  topContributor: string
): string {
  const dir = pressure > 0.2 ? 'expanding' : pressure < -0.2 ? 'contracting' : 'stable';
  const strength = Math.abs(pressure) > 0.6 ? 'significantly' : Math.abs(pressure) > 0.3 ? 'moderately' : 'marginally';

  const templates: Record<GDPComponent, Record<string, string>> = {
    'consumption': {
      expanding: `Consumer spending ${strength} up, driven by ${topContributor}`,
      contracting: `Consumer spending ${strength} down, pressured by ${topContributor}`,
      stable: `Consumer spending stable, ${topContributor} signals mixed`,
    },
    'investment': {
      expanding: `Capital investment ${strength} increasing, led by ${topContributor}`,
      contracting: `Capital investment ${strength} declining, ${topContributor} under pressure`,
      stable: `Investment flows holding steady, ${topContributor} in equilibrium`,
    },
    'government-spending': {
      expanding: `Government expenditure ${strength} rising, ${topContributor} driving fiscal expansion`,
      contracting: `Fiscal tightening ${strength} underway, ${topContributor} signaling cuts`,
      stable: `Government spending on track, ${topContributor} within forecast`,
    },
    'net-exports': {
      expanding: `Export revenue ${strength} growing, ${topContributor} boosting trade balance`,
      contracting: `Export revenue ${strength} declining, ${topContributor} under trade pressure`,
      stable: `Trade balance steady, ${topContributor} maintaining export flow`,
    },
  };

  return templates[component][dir] ?? `${GDP_META[component].label}: ${dir}`;
}

// ---------------------------------------------------------------------------
// Main: Compute GDP snapshot from event clusters
// ---------------------------------------------------------------------------

export function computeGDPSnapshot(clusters: EventCluster[]): GDPSnapshot {
  // Accumulate GDP pressure from all clusters
  const componentAccum = new Map<GDPComponent, {
    pressureSum: number;
    magnitudeSum: number;
    count: number;
    contributors: Map<SectorId, { label: string; impact: number }>;
  }>();

  // Initialize all components
  for (const comp of Object.keys(GDP_META) as GDPComponent[]) {
    componentAccum.set(comp, { pressureSum: 0, magnitudeSum: 0, count: 0, contributors: new Map() });
  }

  // Analyze each cluster through sector impact engine
  for (const cluster of clusters) {
    const analysis = analyzeClusterSectorImpact(cluster);

    for (const gdpImpact of analysis.aggregateGDP) {
      const accum = componentAccum.get(gdpImpact.component);
      if (!accum) continue;

      const dirNum = gdpImpact.direction === 'positive' ? 1 : gdpImpact.direction === 'negative' ? -1 : 0;
      accum.pressureSum += dirNum * gdpImpact.magnitude;
      accum.magnitudeSum += gdpImpact.magnitude;
      accum.count += 1;

      // Track sector contributors
      for (const impact of analysis.impacts) {
        if (impact.totalImpact < 0.05) continue;
        const existing = accum.contributors.get(impact.sectorId);
        if (!existing || impact.totalImpact > existing.impact) {
          accum.contributors.set(impact.sectorId, { label: impact.label, impact: impact.totalImpact });
        }
      }
    }
  }

  // Build component states
  const components: GDPComponentState[] = [];
  let overallPressure = 0;
  let topRiskScore = 0;
  let topRisk = 'None identified';
  let topGrowthScore = 0;
  let topGrowthDriver = 'None identified';

  for (const [component, meta] of Object.entries(GDP_META) as Array<[GDPComponent, { label: string; gccWeight: number }]>) {
    const accum = componentAccum.get(component)!;
    const pressure = accum.count > 0 ? accum.pressureSum / accum.count : 0;
    const magnitude = accum.count > 0 ? accum.magnitudeSum / accum.count : 0;
    const confidence = Math.min(1, accum.count * 0.2); // More clusters = higher confidence

    const contributors = [...accum.contributors.entries()]
      .map(([sectorId, data]) => ({ sectorId, ...data }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5);

    const topContributor = contributors[0]?.label ?? 'mixed signals';
    const narrative = generateComponentNarrative(component, pressure, topContributor);

    components.push({ component, label: meta.label, pressure, confidence, magnitude, contributors, narrative });

    // Weight towards overall
    overallPressure += pressure * meta.gccWeight;

    // Track top risk and growth
    if (pressure < 0 && Math.abs(pressure) > topRiskScore) {
      topRiskScore = Math.abs(pressure);
      topRisk = `${meta.label} under pressure from ${topContributor}`;
    }
    if (pressure > 0 && pressure > topGrowthScore) {
      topGrowthScore = pressure;
      topGrowthDriver = `${meta.label} expanding via ${topContributor}`;
    }
  }

  const overallDirection: GDPSnapshot['overallDirection'] =
    overallPressure > 0.15 ? 'expanding' : overallPressure < -0.15 ? 'contracting' : 'stable';

  return {
    timestamp: new Date().toISOString(),
    overallDirection,
    overallPressure,
    components,
    clustersAnalyzed: clusters.length,
    topRisk,
    topGrowthDriver,
  };
}
