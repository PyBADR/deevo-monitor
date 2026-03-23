/**
 * DEEVO Cross-Sector Propagation Graph
 * Layer: Models → Agents
 * Models how value, risk, cost, and delay propagate across GCC sectors.
 * Implements multi-hop BFS traversal through the sector value flow graph.
 * Answers: "If oil drops, what happens to insurance in 3 steps?"
 */

import type { SectorId, FlowType, ValueFlow } from './sectorOntology';
import { VALUE_FLOWS, SECTOR_REGISTRY, getConnectedSectors } from './sectorOntology';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PropagationNode {
  sectorId: SectorId;
  label: string;
  tier: number;
  /** Impact arriving at this node (0-1) */
  impactScore: number;
  /** Number of hops from origin */
  depth: number;
  /** How impact arrived */
  incomingFlowType: FlowType | 'origin';
}

export interface PropagationEdge {
  from: SectorId;
  to: SectorId;
  flowType: FlowType;
  strength: number;
  /** Effective impact transmitted */
  transmittedImpact: number;
}

export interface PropagationResult {
  /** Origin sector where the shock started */
  origin: SectorId;
  /** Initial shock magnitude (0-1) */
  initialShock: number;
  /** All nodes reached by propagation */
  nodes: PropagationNode[];
  /** All edges traversed */
  edges: PropagationEdge[];
  /** Maximum depth reached */
  maxDepth: number;
  /** Total economic exposure (sum of all node impacts weighted by tier) */
  totalExposure: number;
  /** Primary propagation chain — highest impact path */
  criticalPath: SectorId[];
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MAX_HOPS = 4;
const DECAY_FACTOR = 0.55; // Impact decays 45% per hop
const MIN_IMPACT_THRESHOLD = 0.03; // Stop propagating below this

// ---------------------------------------------------------------------------
// BFS Propagation Engine
// ---------------------------------------------------------------------------

function getOutboundFlows(sector: SectorId): ValueFlow[] {
  return VALUE_FLOWS.filter(
    (f) => f.from === sector || (f.direction === 'bidirectional' && f.to === sector)
  );
}

export function propagateShock(
  origin: SectorId,
  initialShock: number
): PropagationResult {
  const nodes: PropagationNode[] = [];
  const edges: PropagationEdge[] = [];
  const visited = new Map<SectorId, number>(); // sectorId → best impact seen

  const originSector = SECTOR_REGISTRY.get(origin);
  nodes.push({
    sectorId: origin,
    label: originSector?.label ?? origin,
    tier: originSector?.tier ?? 1,
    impactScore: initialShock,
    depth: 0,
    incomingFlowType: 'origin',
  });
  visited.set(origin, initialShock);

  // BFS queue: [sectorId, currentImpact, depth]
  const queue: Array<[SectorId, number, number]> = [[origin, initialShock, 0]];

  while (queue.length > 0) {
    const [current, currentImpact, depth] = queue.shift()!;
    if (depth >= MAX_HOPS) continue;

    const outbound = getOutboundFlows(current);
    for (const flow of outbound) {
      // Determine target (handle bidirectional)
      const target = flow.from === current ? flow.to : flow.from;
      const transmittedImpact = currentImpact * flow.strength * DECAY_FACTOR;
      if (transmittedImpact < MIN_IMPACT_THRESHOLD) continue;

      // Only propagate if this path delivers more impact than previously seen
      const prevBest = visited.get(target) ?? 0;
      if (transmittedImpact <= prevBest) continue;

      visited.set(target, transmittedImpact);

      const targetSector = SECTOR_REGISTRY.get(target);
      nodes.push({
        sectorId: target,
        label: targetSector?.label ?? target,
        tier: targetSector?.tier ?? 2,
        impactScore: transmittedImpact,
        depth: depth + 1,
        incomingFlowType: flow.type,
      });

      edges.push({
        from: current,
        to: target,
        flowType: flow.type,
        strength: flow.strength,
        transmittedImpact,
      });

      queue.push([target, transmittedImpact, depth + 1]);
    }
  }

  // Deduplicate nodes — keep highest impact per sector
  const bestNodes = new Map<SectorId, PropagationNode>();
  for (const node of nodes) {
    const existing = bestNodes.get(node.sectorId);
    if (!existing || node.impactScore > existing.impactScore) {
      bestNodes.set(node.sectorId, node);
    }
  }
  const uniqueNodes = [...bestNodes.values()].sort((a, b) => b.impactScore - a.impactScore);

  // Total exposure: impact * tier weight
  const tierWeight = (tier: number) => tier === 1 ? 1.0 : tier === 2 ? 0.7 : 0.4;
  const totalExposure = uniqueNodes.reduce(
    (sum, n) => sum + n.impactScore * tierWeight(n.tier), 0
  );

  // Critical path: highest-impact chain from origin
  const criticalPath = buildCriticalPath(origin, edges);

  return {
    origin,
    initialShock,
    nodes: uniqueNodes,
    edges: edges.sort((a, b) => b.transmittedImpact - a.transmittedImpact),
    maxDepth: Math.max(0, ...uniqueNodes.map((n) => n.depth)),
    totalExposure,
    criticalPath,
  };
}

// ---------------------------------------------------------------------------
// Critical Path — greedy highest-impact traversal
// ---------------------------------------------------------------------------

function buildCriticalPath(origin: SectorId, edges: PropagationEdge[]): SectorId[] {
  const path: SectorId[] = [origin];
  let current = origin;
  const used = new Set<string>();

  for (let i = 0; i < MAX_HOPS; i++) {
    const next = edges
      .filter((e) => e.from === current && !used.has(`${e.from}-${e.to}`))
      .sort((a, b) => b.transmittedImpact - a.transmittedImpact)[0];
    if (!next) break;
    used.add(`${next.from}-${next.to}`);
    path.push(next.to);
    current = next.to;
  }

  return path;
}

// ---------------------------------------------------------------------------
// Multi-Shock: propagate multiple sector shocks simultaneously
// ---------------------------------------------------------------------------

export function propagateMultiShock(
  shocks: Array<{ sector: SectorId; magnitude: number }>
): PropagationResult[] {
  return shocks.map((s) => propagateShock(s.sector, s.magnitude));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get all sectors within N hops of a given sector */
export function getSectorsWithinHops(sector: SectorId, hops: number): SectorId[] {
  const result = propagateShock(sector, 1.0);
  return result.nodes.filter((n) => n.depth <= hops).map((n) => n.sectorId);
}
