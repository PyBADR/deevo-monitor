/**
 * DEEVO Causal Intelligence — Core Type Definitions
 * Layer: Data (L1) — contracts for the entire ML pipeline
 *
 * Every type is deterministic, typed, and auditable.
 * No LLM-generated content without grounded signals.
 */

// ── GCC Scope ────────────────────────────────────────────
export type GCCCountry = 'SA' | 'AE' | 'KW' | 'QA' | 'BH' | 'OM';
export type ContextCountry = 'IR' | 'IQ' | 'YE' | 'EG' | 'JO' | 'LB';
export type RelevantCountry = GCCCountry | ContextCountry;

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SignalCategory =
  | 'geopolitics' | 'oil-gas' | 'supply-chain'
  | 'regulation' | 'insurance' | 'fraud' | 'finance'
  | 'maritime' | 'climate' | 'cyber';

export type EntityType =
  | 'country' | 'city' | 'company' | 'regulator'
  | 'port' | 'vessel' | 'commodity' | 'insurance-line'
  | 'risk-topic' | 'event-type';

// ── Extracted Entity ─────────────────────────────────────
export interface ExtractedEntity {
  name: string;
  type: EntityType;
  normalized: string;  // canonical form
  confidence: number;  // 0-1
}

// ── Raw Signal (ingested article/feed item) ──────────────
export interface RawSignal {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  timestamp: string;
  region: string;
}

// ── Enriched Signal (after entity extraction + classification)
export interface EnrichedSignal extends RawSignal {
  entities: ExtractedEntity[];
  category: SignalCategory;
  countries: RelevantCountry[];
  riskScore: number;       // 0-100
  riskLevel: RiskLevel;
  embedding: number[];     // text similarity vector
  gccRelevance: number;    // 0-1 how relevant to GCC
}

// ── Event Cluster (grouped related signals) ──────────────
export interface EventCluster {
  id: string;
  headline: string;
  signals: EnrichedSignal[];
  category: SignalCategory;
  countries: RelevantCountry[];
  riskLevel: RiskLevel;
  riskScore: number;
  firstSeen: string;
  lastUpdated: string;
  signalCount: number;
  isEvolving: boolean;
}

// ── Graph Node & Edge ────────────────────────────────────
export type GraphNodeType =
  | 'event' | 'entity' | 'market-signal' | 'commodity'
  | 'country' | 'port' | 'insurer' | 'regulator';

export type GraphEdgeType =
  | 'affects' | 'caused_by' | 'linked_to' | 'reported_with'
  | 'increases_risk_for' | 'impacts' | 'correlates_with' | 'regulated_by';

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  riskLevel?: RiskLevel;
  data?: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: GraphEdgeType;
  weight: number;   // 0-1 strength
  evidence: string;  // grounding signal ID
}

export interface StoryGraph {
  clusterId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ── Causal Explanation ───────────────────────────────────
export interface CausalLink {
  cause: string;
  effect: string;
  rule: string;           // which rule produced this
  confidence: number;
  evidence: string[];     // signal IDs grounding this
}

// ── Forecast ─────────────────────────────────────────────
export interface Forecast {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  magnitude: 'minor' | 'moderate' | 'major';
  horizon: '24h' | '7d' | '30d';
  probability: number;    // 0-1
  basedOn: string[];      // signal IDs
}

// ── Decision Brief (final output per cluster) ────────────
export interface DecisionBrief {
  clusterId: string;
  headline: string;
  whatHappened: string;
  whyItMatters: string;
  whyNow: string;
  connectedSignals: {
    oil: boolean; shipping: boolean; sanctions: boolean;
    regulation: boolean; claims: boolean; market: boolean;
  };
  likelyNextStep: string;
  recommendedAction: string;
  confidence: number;     // 0-100
  riskLevel: RiskLevel;
  causalChain: CausalLink[];
  forecasts: Forecast[];
  graph: StoryGraph;
  auditHash: string;      // SHA-256
  generatedAt: string;
}
