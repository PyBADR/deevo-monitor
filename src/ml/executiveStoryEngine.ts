/**
 * DEEVO Executive Story Engine
 * Layer: Agents → UI
 * Produces investor-ready, government-grade narrative output.
 * For every major event cluster: what happened, why, propagation path,
 * sector impact, GDP impact, next move, decision.
 * No buzzwords. No AI fluff. Every sentence carries meaning.
 */

import type { EventCluster } from './types';
import type { SectorId, GDPComponent } from './sectorOntology';
import { SECTOR_REGISTRY } from './sectorOntology';
import type { ClusterSectorAnalysis } from './sectorImpactEngine';
import { analyzeClusterSectorImpact } from './sectorImpactEngine';
import type { PropagationResult } from './propagationGraph';
import { propagateShock } from './propagationGraph';
import type { GDPSnapshot } from './gdpIntelligenceEngine';
import { computeGDPSnapshot } from './gdpIntelligenceEngine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExecutiveStory {
  /** Unique story ID */
  id: string;
  timestamp: string;
  /** Sharp headline — max 12 words */
  headline: string;
  /** What happened — 1-2 sentences */
  situation: string;
  /** Why it matters to GCC — 1-2 sentences */
  whyItMatters: string;
  /** What changed from last assessment */
  whatChanged: string;
  /** Propagation path: ordered sector chain */
  propagationPath: SectorId[];
  /** Sector impact summary */
  sectorImpacts: Array<{
    sectorId: SectorId;
    label: string;
    level: 'HIGH' | 'MED' | 'LOW';
    detail: string;
  }>;
  /** GDP impact summary */
  gdpImpacts: Array<{
    component: string;
    direction: string;
    detail: string;
  }>;
  /** What happens next — forward-looking */
  nextMoves: string[];
  /** Recommended actions — concrete, actionable */
  decisions: string[];
  /** Confidence level */
  confidence: number;
  /** Risk level */
  riskLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE' | 'LOW';
  /** System insight — the meta observation */
  systemInsight: string;
}

// ---------------------------------------------------------------------------
// Headline Generator — sharp, no fluff
// ---------------------------------------------------------------------------

function generateHeadline(cluster: EventCluster, primarySector: SectorId): string {
  const sectorLabel = SECTOR_REGISTRY.get(primarySector)?.label ?? primarySector;
  const signalCount = cluster.signals.length;
  const avgRisk = cluster.signals.reduce((s, sig) => s + sig.riskScore, 0) / Math.max(1, signalCount);

  if (avgRisk > 0.7) return `${sectorLabel} under critical pressure — ${signalCount} converging signals`;
  if (avgRisk > 0.5) return `Rising risk in ${sectorLabel} — cross-sector exposure building`;
  if (avgRisk > 0.3) return `${sectorLabel} signals elevated — monitoring required`;
  return `${sectorLabel} activity detected — low immediate risk`;
}

// ---------------------------------------------------------------------------
// Situation Builder — what happened
// ---------------------------------------------------------------------------

function buildSituation(cluster: EventCluster): string {
  const topSignals = cluster.signals
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);
  const titles = topSignals.map((s) => s.title).join('. ');
  const countries = [...new Set(cluster.signals.flatMap((s) => s.entities
    .filter((e) => e.type === 'country')
    .map((e) => e.name)
  ))].slice(0, 3);

  const geo = countries.length > 0 ? ` affecting ${countries.join(', ')}` : '';
  return `${titles}${geo}.`;
}

// ---------------------------------------------------------------------------
// Why It Matters — GCC-specific impact reasoning
// ---------------------------------------------------------------------------

function buildWhyItMatters(
  analysis: ClusterSectorAnalysis,
  propagation: PropagationResult
): string {
  const topImpacts = analysis.impacts.filter((i) => i.totalImpact > 0.2);
  const sectorNames = topImpacts.slice(0, 3).map((i) => i.label).join(', ');
  const pathLen = propagation.criticalPath.length;

  if (pathLen > 3) {
    return `This event propagates across ${pathLen} sectors (${sectorNames}), creating systemic cross-sector exposure in the GCC economy.`;
  }
  if (topImpacts.length > 1) {
    return `Direct impact on ${sectorNames}. Cross-sector linkages amplify exposure beyond the primary sector.`;
  }
  return `Concentrated impact on ${sectorNames}. Monitor for secondary propagation.`;
}

// ---------------------------------------------------------------------------
// Decision Generator — concrete actions, not vague advice
// ---------------------------------------------------------------------------

const SECTOR_ACTIONS: Record<string, string[]> = {
  'oil-gas': [
    'Activate energy price hedging protocols',
    'Review OPEC+ compliance exposure',
    'Stress-test sovereign revenue assumptions',
  ],
  'insurance': [
    'Adjust underwriting exposure limits',
    'Trigger portfolio accumulation review',
    'Activate claims surge response protocol',
  ],
  'reinsurance': [
    'Review treaty capacity and renewal terms',
    'Model aggregate loss scenarios',
    'Assess retrocession market conditions',
  ],
  'banking': [
    'Monitor interbank liquidity corridors',
    'Review credit exposure to affected sectors',
    'Activate stress-testing on loan portfolio',
  ],
  'supply-chain': [
    'Activate marine risk protocols',
    'Assess alternative routing options',
    'Review cargo insurance coverage adequacy',
  ],
  'aviation': [
    'Monitor fuel cost exposure',
    'Review route profitability under disruption',
    'Assess passenger demand impact',
  ],
  'ecommerce': [
    'Monitor last-mile delivery disruption risk',
    'Assess consumer sentiment indicators',
    'Review payment processing continuity',
  ],
  'fintech': [
    'Monitor regulatory sandbox compliance',
    'Review payment volume trends',
    'Assess funding runway exposure',
  ],
  'infrastructure': [
    'Review project timeline risk',
    'Monitor material cost escalation',
    'Assess labor supply continuity',
  ],
  'ai-economy': [
    'Review data sovereignty compliance',
    'Monitor GPU/chip supply constraints',
    'Assess sovereign AI investment alignment',
  ],
  'food-water': [
    'Monitor food import supply chain status',
    'Review strategic reserve levels',
    'Assess desalination capacity margins',
  ],
  'defense': [
    'Monitor regional escalation indicators',
    'Review defense procurement timeline impact',
    'Assess critical infrastructure exposure',
  ],
  'digital-economy': [
    'Monitor cyber threat escalation',
    'Review digital service continuity',
    'Assess telecom infrastructure resilience',
  ],
  'space-satellite': [
    'Monitor satellite communication continuity',
    'Review Earth observation data availability',
    'Assess launch schedule disruption risk',
  ],
};

function getDecisions(impactedSectors: SectorId[]): string[] {
  const decisions: string[] = [];
  for (const sector of impactedSectors.slice(0, 4)) {
    const actions = SECTOR_ACTIONS[sector];
    if (actions) decisions.push(actions[0]); // Top action per sector
  }
  if (decisions.length === 0) decisions.push('Continue monitoring — no immediate action required');
  return decisions;
}

// ---------------------------------------------------------------------------
// Next Moves — forward-looking predictions
// ---------------------------------------------------------------------------

function predictNextMoves(analysis: ClusterSectorAnalysis, avgRisk: number): string[] {
  const moves: string[] = [];
  const topSectors = analysis.impacts.filter((i) => i.totalImpact > 0.3);

  if (avgRisk > 0.7) {
    moves.push('Expect cascading impact within 24-48 hours');
    moves.push('Secondary sector exposure likely to materialize');
  } else if (avgRisk > 0.4) {
    moves.push('Monitor for escalation signals over next 7 days');
  }

  if (topSectors.length > 2) {
    moves.push('Cross-sector correlation suggests systemic pressure building');
  }

  for (const path of analysis.propagationPath.slice(0, 2)) {
    const fromLabel = SECTOR_REGISTRY.get(path.from)?.label ?? path.from;
    const toLabel = SECTOR_REGISTRY.get(path.to)?.label ?? path.to;
    moves.push(`Watch ${fromLabel} → ${toLabel} transmission channel`);
  }

  if (moves.length === 0) moves.push('Situation contained — maintain standard monitoring');
  return moves;
}

// ---------------------------------------------------------------------------
// Main: Generate Executive Story
// ---------------------------------------------------------------------------

export function generateExecutiveStory(cluster: EventCluster): ExecutiveStory {
  const analysis = analyzeClusterSectorImpact(cluster);
  const primarySector = analysis.primarySector;
  const primaryImpact = analysis.impacts[0]?.totalImpact ?? 0;

  // Propagation
  const propagation = propagateShock(primarySector, primaryImpact);

  // GDP
  const gdpSnapshot = computeGDPSnapshot([cluster]);

  // Risk level
  const avgRisk = cluster.signals.reduce((s, sig) => s + sig.riskScore, 0) / Math.max(1, cluster.signals.length);
  const riskLevel: ExecutiveStory['riskLevel'] =
    avgRisk > 0.8 ? 'CRITICAL' :
    avgRisk > 0.6 ? 'HIGH' :
    avgRisk > 0.4 ? 'ELEVATED' :
    avgRisk > 0.2 ? 'MODERATE' : 'LOW';

  // Impacted sectors (above threshold)
  const impactedSectors = analysis.impacts
    .filter((i) => i.totalImpact > 0.1)
    .map((i) => i.sectorId);

  return {
    id: `story-${cluster.id}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    headline: generateHeadline(cluster, primarySector),
    situation: buildSituation(cluster),
    whyItMatters: buildWhyItMatters(analysis, propagation),
    whatChanged: `${cluster.signals.length} signals converged in ${analysis.primarySector} sector over recent hours`,
    propagationPath: propagation.criticalPath,
    sectorImpacts: analysis.impacts
      .filter((i) => i.totalImpact > 0.05)
      .slice(0, 8)
      .map((i) => ({
        sectorId: i.sectorId,
        label: i.label,
        level: (i.totalImpact > 0.5 ? 'HIGH' : i.totalImpact > 0.2 ? 'MED' : 'LOW') as 'HIGH' | 'MED' | 'LOW',
        detail: i.triggeredDrivers.length > 0
          ? `Risk drivers: ${i.triggeredDrivers.join(', ')}`
          : `Propagated exposure (${Math.round(i.propagatedImpact * 100)}%)`,
      })),
    gdpImpacts: gdpSnapshot.components
      .filter((c) => Math.abs(c.pressure) > 0.05)
      .map((c) => ({
        component: c.label,
        direction: c.pressure > 0 ? '↑' : '↓',
        detail: c.narrative,
      })),
    nextMoves: predictNextMoves(analysis, avgRisk),
    decisions: getDecisions(impactedSectors),
    confidence: Math.min(1, cluster.signals.length * 0.15),
    riskLevel,
    systemInsight: `${propagation.nodes.length} sectors in propagation chain. Total economic exposure: ${Math.round(propagation.totalExposure * 100)}%. ${gdpSnapshot.overallDirection === 'contracting' ? 'GDP pressure negative.' : gdpSnapshot.overallDirection === 'expanding' ? 'GDP pressure positive.' : 'GDP direction mixed.'}`,
  };
}
