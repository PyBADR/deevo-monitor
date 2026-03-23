/**
 * DEEVO Intelligence Monitor v3 — Audit Type System
 * Contract 2 / File 4 of 4
 * Layer: Governance (L7) — immutable SHA-256 audit chain
 *
 * Every irreversible action in the system generates an AuditEntry.
 * Entries are hash-chained: each entry's `previousHash` references
 * the prior entry, forming a tamper-evident log.
 *
 * Trade-off: SHA-256 hashing adds ~2ms per entry on M4 Max.
 *            Acceptable for enterprise auditability requirements.
 * Risk: Clock skew across distributed nodes — mitigate with NTP sync
 *       and server-authoritative timestamps.
 */

import type { GCCCountryCode } from './index';
import type { DeevoVariant } from './signals';
import type { DecisionStatus } from './decisions';

// ── Audit Actions ────────────────────────────────────────
export type AuditAction =
  | 'SIGNAL_INGESTED'
  | 'CORRELATION_FIRED'
  | 'DECISION_CREATED'
  | 'DECISION_APPROVED'
  | 'DECISION_REJECTED'
  | 'DECISION_EXECUTED'
  | 'DECISION_EXPIRED'
  | 'HUMAN_OVERRIDE'
  | 'CONFIG_CHANGED'
  | 'ENTITY_CREATED'
  | 'ENTITY_UPDATED'
  | 'FEED_SOURCE_ADDED'
  | 'FEED_SOURCE_REMOVED'
  | 'MODEL_DEPLOYED'
  | 'MODEL_ROLLED_BACK'
  | 'VARIANT_SWITCHED'
  | 'EXPORT_GENERATED'
  | 'SESSION_STARTED'
  | 'SESSION_ENDED';

// ── Audit Entry (Immutable, Hash-Chained) ────────────────
export interface AuditEntry {
  /** Unique audit ID — format: `aud_{timestamp}_{hash8}` */
  readonly id: string;
  /** ISO 8601 timestamp — server-authoritative */
  readonly timestamp: string;
  /** Action performed */
  action: AuditAction;
  /** Which DEEVO variant generated this entry */
  variant: DeevoVariant;
  /** Actor — user ID, agent ID, or 'system' */
  actor: string;
  /** Human-readable description */
  description: string;
  /** Affected GCC country (if applicable) */
  country?: GCCCountryCode;
  /** Related entity ID */
  entityId?: string;
  /** Related decision ID */
  decisionId?: string;
  /** Related signal ID */
  signalId?: string;
  /** Decision status at time of audit (if decision-related) */
  decisionStatus?: DecisionStatus;
  /** Payload snapshot — JSON-serializable context data */
  payload: Record<string, unknown>;
  /** SHA-256 hash of this entry's content */
  readonly hash: string;
  /** SHA-256 hash of the previous entry (chain link) */
  readonly previousHash: string;
  /** IP address or system identifier of the actor */
  sourceIp?: string;
  /** Session ID for traceability */
  sessionId?: string;
}

// ── Audit Chain Metadata ─────────────────────────────────
export interface AuditChainMeta {
  /** Total entries in the chain */
  totalEntries: number;
  /** Hash of the latest entry */
  latestHash: string;
  /** ISO 8601 timestamp of latest entry */
  latestTimestamp: string;
  /** Whether the chain integrity is verified */
  integrityVerified: boolean;
  /** Last verification timestamp */
  lastVerifiedAt: string;
}
