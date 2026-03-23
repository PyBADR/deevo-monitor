/**
 * DEEVO Causal Intelligence — Story Graph Builder
 * Layer: Agents (L4)
 *
 * Builds a visual graph linking events, entities, markets,
 * and insurance exposures for each event cluster.
 */
import type { EventCluster, StoryGraph, GraphNode, GraphEdge, GraphNodeType, GraphEdgeType } from './types';

export function buildStoryGraph(cluster: EventCluster): StoryGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  function addNode(id: string, label: string, type: GraphNodeType, riskLevel?: GraphNode['riskLevel']) {
    if (nodeIds.has(id)) return;
    nodeIds.add(id);
    nodes.push({ id, label, type, riskLevel });
  }

  function addEdge(source: string, target: string, type: GraphEdgeType, weight: number, evidence: string) {
    if (!nodeIds.has(source) || !nodeIds.has(target)) return;
    if (source === target) return;
    edges.push({ source, target, type, weight, evidence });
  }

  // Central event node
  const eventId = `evt_${cluster.id}`;
  addNode(eventId, cluster.headline, 'event', cluster.riskLevel);

  // Add entity nodes from all signals
  for (const signal of cluster.signals) {
    for (const entity of signal.entities) {
      const entId = `ent_${entity.type}_${entity.normalized.replace(/\s+/g, '_')}`;
      const nodeType: GraphNodeType =
        entity.type === 'country' ? 'country' :
        entity.type === 'port' ? 'port' :
        entity.type === 'commodity' ? 'commodity' :
        entity.type === 'regulator' ? 'regulator' :
        entity.type === 'company' && entity.normalized.includes('Insurance') ? 'insurer' :
        'entity';
      addNode(entId, entity.normalized, nodeType);
      addEdge(eventId, entId, 'reported_with', entity.confidence, signal.id);
    }
  }

  // Add country nodes and link
  for (const country of cluster.countries) {
    const cId = `country_${country}`;
    addNode(cId, country, 'country');
    addEdge(eventId, cId, 'affects', 0.8, cluster.signals[0]?.id ?? cluster.id);
  }

  // Link entities to each other based on co-occurrence
  const entityPairs: Array<[string, string, string]> = [];
  for (const signal of cluster.signals) {
    const entIds = signal.entities.map(e => `ent_${e.type}_${e.normalized.replace(/\s+/g, '_')}`);
    for (let i = 0; i < entIds.length; i++) {
      for (let j = i + 1; j < entIds.length; j++) {
        entityPairs.push([entIds[i]!, entIds[j]!, signal.id]);
      }
    }
  }

  // Deduplicate edges and add co-occurrence links
  const edgeSet = new Set<string>();
  for (const [a, b, evidence] of entityPairs) {
    const key = [a, b].sort().join('_');
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      addEdge(a, b, 'linked_to', 0.6, evidence);
    }
  }

  // Add market signal nodes for relevant categories
  const marketSignals: Record<string, { label: string; type: GraphNodeType }> = {
    'oil-gas': { label: 'Oil & Gas Markets', type: 'market-signal' },
    'finance': { label: 'GCC Financial Markets', type: 'market-signal' },
    'maritime': { label: 'Shipping & Logistics', type: 'market-signal' },
    'insurance': { label: 'Insurance Sector', type: 'market-signal' },
  };

  const ms = marketSignals[cluster.category];
  if (ms) {
    const msId = `market_${cluster.category}`;
    addNode(msId, ms.label, ms.type);
    addEdge(eventId, msId, 'impacts', 0.75, cluster.signals[0]?.id ?? cluster.id);
  }

  return { clusterId: cluster.id, nodes, edges };
}
