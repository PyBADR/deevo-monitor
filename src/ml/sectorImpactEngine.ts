/**
 * DEEVO Sector Impact Engine
 * Layer: Models
 * Scores per-sector impact from event clusters using keyword matching against
 * sector risk drivers, entity overlap, and dependency propagation.
 */

import type { EventCluster } from './types';
import type { SectorId, SectorModel, GDPComponent, GDPImpact } from './sectorOntology';
import { SECTOR_REGISTRY, VALUE_FLOWS } from './sectorOntology';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SectorImpactScore {
  sectorId: SectorId;
  label: string;
  tier: number;
  /** Direct impact from keyword/entity match (0-1) */
  directImpact: number;
  /** Propagated impact from connected sectors (0-1) */
  propagatedImpact: number;
  /** Combined score (0-1) */
  totalImpact: number;
  /** Which risk drivers were triggered */
  triggeredDrivers: string[];
  /** Matched entities from the cluster */
  matchedEntities: string[];
  /** GDP impact assessment */
  gdpImpacts: GDPImpact[];
}

export interface ClusterSectorAnalysis {
  clusterId: string;
  timestamp: string;
  /** All sectors impacted, sorted by totalImpact descending */
  impacts: SectorImpactScore[];
  /** Primary affected sector */
  primarySector: SectorId;
  /** Propagation path — ordered list of sector-to-sector flows triggered */
  propagationPath: Array<{ from: SectorId; to: SectorId; strength: number }>;
  /** Aggregate GDP impact */
  aggregateGDP: GDPImpact[];
}

// ---------------------------------------------------------------------------
// Direct Impact Scoring — keyword + entity matching
// ---------------------------------------------------------------------------

function computeDirectImpact(
  cluster: EventCluster,
  sector: SectorModel
): { score: number; triggeredDrivers: string[]; matchedEntities: string[] } {
  const clusterText = cluster.signals
    .map((s) => `${s.title} ${s.summary}`.toLowerCase())
    .join(' ');

  // Score risk driver keyword matches
  const triggeredDrivers: string[] = [];
  let driverScore = 0;
  for (const driver of sector.riskDrivers) {
    const hits = driver.keywords.filter((kw) => clusterText.includes(kw.toLowerCase()));
    if (hits.length > 0) {
      triggeredDrivers.push(driver.id);
      const severityWeight =
        driver.severity === 'critical' ? 1.0 :
        driver.severity === 'high' ? 0.75 :
        driver.severity === 'medium' ? 0.5 : 0.25;
      driverScore += severityWeight * (hits.length / driver.keywords.length);
    }
  }
  driverScore = Math.min(1, driverScore);

  // Score entity matches
  const matchedEntities: string[] = [];
  for (const entity of sector.keyEntities) {
    if (clusterText.includes(entity.toLowerCase())) {
      matchedEntities.push(entity);
    }
  }
  const entityScore = Math.min(1, matchedEntities.length * 0.3);

  // Combined: 60% driver + 40% entity
  const score = Math.min(1, driverScore * 0.6 + entityScore * 0.4);

  return { score, triggeredDrivers, matchedEntities };
}

// ---------------------------------------------------------------------------
// GDP Impact Assessment
// ---------------------------------------------------------------------------

function assessGDPImpact(
  sector: SectorModel,
  directScore: number,
  clusterRiskLevel: number
): GDPImpact[] {
  const GDP_LABELS: Record<GDPComponent, string> = {
    'consumption': 'Consumer spending and retail demand',
    'investment': 'Capital formation and project investment',
    'government-spending': 'Government expenditure and fiscal policy',
    'net-exports': 'Trade balance and export revenue',
  };

  return sector.gdpComponents.map((component): GDPImpact => {
    // Higher risk = negative direction; lower risk = positive or neutral
    const direction = clusterRiskLevel > 0.6 ? 'negative' : clusterRiskLevel > 0.3 ? 'neutral' : 'positive';
    // Magnitude scales with direct impact and tier importance
    const tierWeight = sector.tier === 1 ? 1.0 : sector.tier === 2 ? 0.7 : 0.4;
    const magnitude = Math.min(1, directScore * tierWeight);

    return {
      component,
      direction,
      magnitude,
      description: `${sector.label}: ${GDP_LABELS[component]}`,
    };
  });
}

// ---------------------------------------------------------------------------
// Propagation — compute cascading impact through value flows
// ---------------------------------------------------------------------------

function computePropagation(
  directScores: Map<SectorId, number>
): { propagated: Map<SectorId, number>; path: Array<{ from: SectorId; to: SectorId; strength: number }> } {
  const propagated = new Map<SectorId, number>();
  const path: Array<{ from: SectorId; to: SectorId; strength: number }> = [];

  // Single-hop propagation through value flow graph
  for (const flow of VALUE_FLOWS) {
    const sourceScore = directScores.get(flow.from) ?? 0;
    if (sourceScore < 0.1) continue; // no signal, no propagation

    const cascadeScore = sourceScore * flow.strength * 0.5; // dampen by 50% per hop
    if (cascadeScore < 0.05) continue;

    const existing = propagated.get(flow.to) ?? 0;
    propagated.set(flow.to, Math.min(1, existing + cascadeScore));
    path.push({ from: flow.from, to: flow.to, strength: cascadeScore });

    // Bidirectional: reverse direction too
    if (flow.direction === 'bidirectional') {
      const reverseScore = directScores.get(flow.to) ?? 0;
      if (reverseScore >= 0.1) {
        const reverseCascade = reverseScore * flow.strength * 0.5;
        if (reverseCascade >= 0.05) {
          const existingReverse = propagated.get(flow.from) ?? 0;
          propagated.set(flow.from, Math.min(1, existingReverse + reverseCascade));
          path.push({ from: flow.to, to: flow.from, strength: reverseCascade });
        }
      }
    }
  }

  return { propagated, path };
}

// ---------------------------------------------------------------------------
// Main: Analyze cluster impact across all 14 sectors
// ---------------------------------------------------------------------------

export function analyzeClusterSectorImpact(cluster: EventCluster): ClusterSectorAnalysis {
  const directScores = new Map<SectorId, number>();
  const impactDetails = new Map<SectorId, { triggeredDrivers: string[]; matchedEntities: string[] }>();

  // Phase 1: Direct impact scoring per sector
  for (const [sectorId, sector] of SECTOR_REGISTRY) {
    const { score, triggeredDrivers, matchedEntities } = computeDirectImpact(cluster, sector);
    directScores.set(sectorId, score);
    impactDetails.set(sectorId, { triggeredDrivers, matchedEntities });
  }

  // Phase 2: Propagation through value flow graph
  const { propagated, path } = computePropagation(directScores);

  // Phase 3: Combine direct + propagated into final scores
  const clusterRisk = cluster.signals.reduce((sum, s) => sum + s.riskScore, 0) / Math.max(1, cluster.signals.length);
  const impacts: SectorImpactScore[] = [];

  for (const [sectorId, sector] of SECTOR_REGISTRY) {
    const directImpact = directScores.get(sectorId) ?? 0;
    const propagatedImpact = propagated.get(sectorId) ?? 0;
    const totalImpact = Math.min(1, directImpact + propagatedImpact);
    const details = impactDetails.get(sectorId);
    const gdpImpacts = assessGDPImpact(sector, directImpact, clusterRisk);

    impacts.push({
      sectorId,
      label: sector.label,
      tier: sector.tier,
      directImpact,
      propagatedImpact,
      totalImpact,
      triggeredDrivers: details?.triggeredDrivers ?? [],
      matchedEntities: details?.matchedEntities ?? [],
      gdpImpacts,
    });
  }

  // Sort by total impact descending
  impacts.sort((a, b) => b.totalImpact - a.totalImpact);

  // Aggregate GDP across all impacted sectors
  const gdpAgg = new Map<GDPComponent, { direction: number; magnitude: number; count: number }>();
  for (const impact of impacts) {
    if (impact.totalImpact < 0.05) continue;
    for (const g of impact.gdpImpacts) {
      const existing = gdpAgg.get(g.component) ?? { direction: 0, magnitude: 0, count: 0 };
      const dirNum = g.direction === 'positive' ? 1 : g.direction === 'negative' ? -1 : 0;
      existing.direction += dirNum * impact.totalImpact;
      existing.magnitude += g.magnitude * impact.totalImpact;
      existing.count += 1;
      gdpAgg.set(g.component, existing);
    }
  }

  const GDP_LABELS: Record<GDPComponent, string> = {
    'consumption': 'Consumer spending and retail demand',
    'investment': 'Capital formation and project investment',
    'government-spending': 'Government expenditure and fiscal policy',
    'net-exports': 'Trade balance and export revenue',
  };

  const aggregateGDP: GDPImpact[] = [];
  for (const [component, agg] of gdpAgg) {
    if (agg.count === 0) continue;
    const avgDir = agg.direction / agg.count;
    aggregateGDP.push({
      component,
      direction: avgDir > 0.2 ? 'positive' : avgDir < -0.2 ? 'negative' : 'neutral',
      magnitude: Math.min(1, agg.magnitude / agg.count),
      description: GDP_LABELS[component],
    });
  }

  return {
    clusterId: cluster.id,
    timestamp: new Date().toISOString(),
    impacts,
    primarySector: impacts[0]?.sectorId ?? 'oil-gas',
    propagationPath: path.sort((a, b) => b.strength - a.strength),
    aggregateGDP,
  };
}
