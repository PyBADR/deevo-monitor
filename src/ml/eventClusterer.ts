/**
 * DEEVO Causal Intelligence — Event Clustering Engine
 * Layer: Features (L2)
 *
 * Groups related signals into evolving story clusters.
 * Uses cosine similarity on embeddings + entity overlap.
 * Deterministic — no LLM, no randomness.
 */
import type { EnrichedSignal, EventCluster, RiskLevel } from './types';

// ── Cosine Similarity ────────────────────────────────────
function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  if (len === 0) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i]! * b[i]!;
    magA += a[i]! * a[i]!;
    magB += b[i]! * b[i]!;
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ── Entity Overlap Score ─────────────────────────────────
function entityOverlap(a: EnrichedSignal, b: EnrichedSignal): number {
  const setA = new Set(a.entities.map(e => e.normalized));
  const setB = new Set(b.entities.map(e => e.normalized));
  let overlap = 0;
  for (const v of setA) { if (setB.has(v)) overlap++; }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : overlap / union;
}

// ── Combined Similarity ──────────────────────────────────
function signalSimilarity(a: EnrichedSignal, b: EnrichedSignal): number {
  const embSim = cosineSimilarity(a.embedding, b.embedding);
  const entSim = entityOverlap(a, b);
  const catMatch = a.category === b.category ? 0.2 : 0;
  return embSim * 0.4 + entSim * 0.4 + catMatch;
}

const CLUSTER_THRESHOLD = 0.35;

// ── Generate Cluster Headline ────────────────────────────
function generateHeadline(signals: EnrichedSignal[]): string {
  // Use the highest-risk signal's title as headline
  const sorted = [...signals].sort((a, b) => b.riskScore - a.riskScore);
  return sorted[0]?.title ?? 'Unknown Event';
}

function clusterRiskLevel(signals: EnrichedSignal[]): RiskLevel {
  const maxScore = Math.max(...signals.map(s => s.riskScore));
  if (maxScore >= 80) return 'CRITICAL';
  if (maxScore >= 60) return 'HIGH';
  if (maxScore >= 35) return 'MEDIUM';
  return 'LOW';
}

// ── Main Clustering Function ─────────────────────────────
export function clusterSignals(signals: EnrichedSignal[]): EventCluster[] {
  const clusters: EventCluster[] = [];
  const assigned = new Set<string>();

  for (const signal of signals) {
    if (assigned.has(signal.id)) continue;

    // Find all similar unassigned signals
    const group: EnrichedSignal[] = [signal];
    assigned.add(signal.id);

    for (const candidate of signals) {
      if (assigned.has(candidate.id)) continue;
      const sim = signalSimilarity(signal, candidate);
      if (sim >= CLUSTER_THRESHOLD) {
        group.push(candidate);
        assigned.add(candidate.id);
      }
    }

    const countries = [...new Set(group.flatMap(s => s.countries))];
    const timestamps = group.map(s => new Date(s.timestamp).getTime());

    clusters.push({
      id: `cluster_${signal.id}`,
      headline: generateHeadline(group),
      signals: group,
      category: signal.category,
      countries: countries as EventCluster['countries'],
      riskLevel: clusterRiskLevel(group),
      riskScore: Math.max(...group.map(s => s.riskScore)),
      firstSeen: new Date(Math.min(...timestamps)).toISOString(),
      lastUpdated: new Date(Math.max(...timestamps)).toISOString(),
      signalCount: group.length,
      isEvolving: group.length > 2,
    });
  }

  return clusters.sort((a, b) => b.riskScore - a.riskScore);
}

/** Collapse duplicate signals (same title, same source) */
export function deduplicateSignals(signals: EnrichedSignal[]): EnrichedSignal[] {
  const seen = new Map<string, EnrichedSignal>();
  for (const s of signals) {
    const key = `${s.title.toLowerCase().slice(0, 50)}_${s.source}`;
    if (!seen.has(key)) seen.set(key, s);
  }
  return Array.from(seen.values());
}
