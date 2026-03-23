/**
 * DEEVO Intelligence Monitor v3 — Entity Type System
 * Contract 2 / File 1 of 4
 * Layer: Data (L1) — defines all GCC entity nodes and edges
 * 
 * Trade-off: Union types over enums for tree-shaking + JSON serialization.
 * Risk: Adding new entity types requires updating EntityType union — mitigated
 *       by exhaustive switch checks via `never` default.
 */

import type { GCCCountryCode } from './index';

// ── Entity Classification ────────────────────────────────
export type EntityType =
  | 'insurer'
  | 'reinsurer'
  | 'regulator'
  | 'government'
  | 'port'
  | 'airport'
  | 'oilfield'
  | 'refinery'
  | 'ftz'          // Free Trade Zone
  | 'hospital'
  | 'exchange'
  | 'central_bank'
  | 'sovereign_fund'
  | 'military_base'
  | 'desalination'
  | 'pipeline'
  | 'tech_hub';

// ── Risk Assessment ──────────────────────────────────────
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskTrend = 'improving' | 'stable' | 'deteriorating' | 'volatile';

// ── Layer Categories (7-Layer Intelligence Stack) ────────
export type LayerCategory =
  | 'data'           // L1: Raw feeds, APIs, sensors
  | 'features'       // L2: Feature extraction, NLP, embeddings
  | 'models'         // L3: ML models, scoring, prediction
  | 'agents'         // L4: LangGraph agents, reasoning
  | 'apis'           // L5: REST/WS endpoints, integrations
  | 'ui'             // L6: React components, visualizations
  | 'governance';    // L7: Audit, compliance, PDPL, IFRS17

// ── GCC Entity (Node in Force Graph) ─────────────────────
export interface GCCEntity {
  /** Unique identifier — format: `{type}_{country}_{slug}` */
  readonly id: string;
  /** Human-readable name (English) */
  name: string;
  /** Human-readable name (Arabic) */
  nameAr: string;
  /** Entity classification */
  type: EntityType;
  /** GCC country code */
  country: GCCCountryCode;
  /** Geographic coordinates [longitude, latitude] */
  coordinates: [longitude: number, latitude: number];
  /** Current risk assessment */
  riskLevel: RiskLevel;
  /** Risk trend direction */
  riskTrend: RiskTrend;
  /** Composite risk score (0–100) */
  riskScore: number;
  /** Which intelligence layer this entity primarily belongs to */
  layer: LayerCategory;
  /** Active alert count */
  activeAlerts: number;
  /** ISO 8601 last update timestamp */
  lastUpdated: string;
  /** Optional metadata for variant-specific extensions */
  metadata?: Record<string, unknown>;
}

// ── Edge Types (Force Graph Links) ───────────────────────
export type EdgeType =
  | 'regulatory'      // Regulator → Insurer oversight
  | 'reinsurance'     // Insurer → Reinsurer cession
  | 'trade'           // Port/FTZ → Exchange flow
  | 'energy'          // Oilfield → Refinery → Pipeline
  | 'financial'       // Central Bank → Exchange → Insurer
  | 'supply_chain'    // Port → Airport → FTZ logistics
  | 'risk_transfer'   // Insurer → Reinsurer → Retrocession
  | 'correlation';    // Signal-detected co-movement

// ── Entity Edge (Force Graph Link) ───────────────────────
export interface EntityEdge {
  /** Unique edge ID — format: `edge_{source}_{target}` */
  readonly id: string;
  /** Source entity ID */
  source: string;
  /** Target entity ID */
  target: string;
  /** Edge classification */
  type: EdgeType;
  /** Edge weight / strength (0.0–1.0) */
  weight: number;
  /** Human-readable label */
  label: string;
  /** Whether this edge is currently active */
  active: boolean;
  /** ISO 8601 last update timestamp */
  lastUpdated: string;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

// ── Entity Graph (Complete Force-Directed Graph State) ────
export interface EntityGraph {
  /** All entities (nodes) */
  nodes: GCCEntity[];
  /** All edges (links) */
  edges: EntityEdge[];
  /** Graph metadata */
  meta: {
    totalNodes: number;
    totalEdges: number;
    lastUpdated: string;
    version: string;
  };
}
