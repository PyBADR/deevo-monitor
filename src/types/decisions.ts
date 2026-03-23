/**
 * DEEVO Intelligence Monitor v3 — Decision Type System
 * Contract 2 / File 3 of 4
 * Layer: Agents (L4) + Governance (L7)
 *
 * Every decision carries an explainable reasoning chain and requires
 * human-in-the-loop approval for CRITICAL actions. This is enforced
 * at the type level via the `requiresHumanApproval` flag.
 *
 * Trade-off: Verbose reasoning chains increase payload size but are
 *            mandatory for GCC enterprise auditability (PDPL Art. 22).
 */

import type { GCCCountryCode } from './index';
import type { AlertLevel, DeevoVariant } from './signals';

// ── Decision Lifecycle ───────────────────────────────────
export type DecisionStatus =
  | 'pending'         // Awaiting agent processing
  | 'reasoning'       // Agent building reasoning chain
  | 'human_review'    // Escalated — awaiting human approval
  | 'approved'        // Human approved (or auto-approved if LOW/MEDIUM)
  | 'rejected'        // Human rejected
  | 'executed'        // Action taken
  | 'expired';        // TTL exceeded without action

// ── Reasoning Chain (Explainable AI) ─────────────────────
export interface ReasoningStep {
  /** Step sequence number (1-based) */
  step: number;
  /** Which intelligence layer produced this reasoning */
  layer: 'data' | 'features' | 'models' | 'agents' | 'governance';
  /** Human-readable explanation of this reasoning step */
  explanation: string;
  /** Evidence supporting this step */
  evidence: string[];
  /** Confidence in this step (0.0–1.0) */
  confidence: number;
  /** Duration of this step in milliseconds */
  durationMs: number;
}

// ── Decision Impact Assessment ───────────────────────────
export interface DecisionImpact {
  /** Affected GCC countries */
  countries: GCCCountryCode[];
  /** Affected insurance lines */
  lines: string[];
  /** Estimated financial impact in USD */
  estimatedImpactUSD: number;
  /** Number of policies potentially affected */
  policiesAffected: number;
  /** Regulatory implications */
  regulatoryFlags: string[];
}

// ── Decision Action ──────────────────────────────────────
export interface DecisionAction {
  /** Action type identifier */
  type: string;
  /** Human-readable label */
  label: string;
  /** Whether this action is irreversible */
  irreversible: boolean;
  /** Parameters for execution */
  params: Record<string, unknown>;
}

// ── Decision Alert (Full Decision Object) ────────────────
export interface DecisionAlert {
  /** Unique decision ID — format: `dec_{timestamp}_{hash8}` */
  readonly id: string;
  /** ISO 8601 creation timestamp */
  readonly createdAt: string;
  /** ISO 8601 last update timestamp */
  updatedAt: string;
  /** Current lifecycle status */
  status: DecisionStatus;
  /** Decision title */
  title: string;
  /** Detailed description */
  description: string;
  /** Which DEEVO variant owns this decision */
  variant: DeevoVariant;
  /** Triggering signal IDs */
  triggerSignals: string[];
  /** Correlation rule that created this (if any) */
  correlationRule?: string;
  /** Explainable reasoning chain */
  reasoning: ReasoningStep[];
  /** Impact assessment */
  impact: DecisionImpact;
  /** Recommended action */
  action: DecisionAction;
  /** Alert level driving this decision */
  alertLevel: AlertLevel;
  /** Affected GCC countries */
  countries: GCCCountryCode[];
  /** Whether human approval is required (CRITICAL = always true) */
  requiresHumanApproval: boolean;
  /** Human reviewer ID (if escalated) */
  reviewedBy?: string;
  /** Human review timestamp */
  reviewedAt?: string;
  /** Human review notes */
  reviewNotes?: string;
  /** TTL in seconds — auto-expires if not acted upon */
  ttlSeconds: number;
  /** Overall confidence (0.0–1.0) — min of all reasoning steps */
  confidence: number;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}
