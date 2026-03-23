/**
 * DEEVO Intelligence Pipeline — Orchestrator
 * Layer: Models → Agents
 * Chains: enrichment → dedup → clustering → causal → forecast → graph → decision
 * Contract: Every output carries SHA-256 audit trail
 */

import type { RawSignal, EnrichedSignal, EventCluster, DecisionBrief } from './types';
import { enrichSignal } from './entityExtractor';
import { deduplicateSignals, clusterSignals } from './eventClusterer';
import { findCorrelations, inferCausality } from './correlationEngine';
import { generateForecasts } from './forecastEngine';
import { buildStoryGraph } from './storyGraphBuilder';
import { generateDecisionBrief } from './decisionExplainer';

// ---------------------------------------------------------------------------
// Pipeline Configuration
// ---------------------------------------------------------------------------

export interface PipelineConfig {
  /** Minimum GCC relevance score to keep a signal (0-1) */
  gccRelevanceThreshold: number;
  /** Minimum risk score to surface in dashboard (0-1) */
  riskThreshold: number;
  /** Maximum age of signal in hours before discard */
  maxSignalAgeHours: number;
  /** Enable cross-cluster correlation detection */
  enableCorrelations: boolean;
}

const DEFAULT_CONFIG: PipelineConfig = {
  gccRelevanceThreshold: 0.3,
  riskThreshold: 0.2,
  maxSignalAgeHours: 72,
  enableCorrelations: true,
};

// ---------------------------------------------------------------------------
// Pipeline Output
// ---------------------------------------------------------------------------

export interface PipelineResult {
  /** Timestamp of pipeline execution */
  executedAt: string;
  /** Number of raw signals ingested */
  rawCount: number;
  /** Number after dedup + GCC filter */
  filteredCount: number;
  /** Event clusters produced */
  clusters: EventCluster[];
  /** Decision briefs — one per cluster */
  briefs: DecisionBrief[];
  /** Cross-cluster correlations found */
  correlationCount: number;
  /** Pipeline execution time in ms */
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Stage 1: Enrich — extract entities, score relevance, compute embeddings
// ---------------------------------------------------------------------------

function stageEnrich(raw: RawSignal[]): EnrichedSignal[] {
  return raw.map(enrichSignal);
}

// ---------------------------------------------------------------------------
// Stage 2: Filter — GCC relevance gate + age gate
// ---------------------------------------------------------------------------

function stageFilter(
  signals: EnrichedSignal[],
  config: PipelineConfig
): EnrichedSignal[] {
  const cutoff = Date.now() - config.maxSignalAgeHours * 3600_000;
  return signals.filter((s) => {
    if (s.gccRelevance < config.gccRelevanceThreshold) return false;
    if (new Date(s.timestamp).getTime() < cutoff) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Stage 3: Deduplicate — collapse near-identical signals
// ---------------------------------------------------------------------------

function stageDedup(signals: EnrichedSignal[]): EnrichedSignal[] {
  return deduplicateSignals(signals);
}

// ---------------------------------------------------------------------------
// Stage 4: Cluster — group related signals into event clusters
// ---------------------------------------------------------------------------

function stageCluster(signals: EnrichedSignal[]): EventCluster[] {
  return clusterSignals(signals);
}

// ---------------------------------------------------------------------------
// Stage 5: Analyze — causal inference + forecasting + graph per cluster
// ---------------------------------------------------------------------------

function stageAnalyze(clusters: EventCluster[]): EventCluster[] {
  return clusters.map((cluster) => {
    const causalLinks = inferCausality(cluster);
    const forecasts = generateForecasts(cluster);
    const graph = buildStoryGraph(cluster);
    return {
      ...cluster,
      causalLinks,
      forecasts,
      graph,
    };
  });
}

// ---------------------------------------------------------------------------
// Stage 6: Correlate — find cross-cluster links
// ---------------------------------------------------------------------------

function stageCorrelate(
  clusters: EventCluster[],
  enabled: boolean
): number {
  if (!enabled || clusters.length < 2) return 0;
  const correlations = findCorrelations(clusters);
  return correlations.length;
}

// ---------------------------------------------------------------------------
// Stage 7: Decide — generate executive decision briefs
// ---------------------------------------------------------------------------

async function stageDecide(
  clusters: EventCluster[]
): Promise<DecisionBrief[]> {
  const briefs: DecisionBrief[] = [];
  for (const cluster of clusters) {
    const brief = await generateDecisionBrief(cluster);
    briefs.push(brief);
  }
  return briefs;
}

// ---------------------------------------------------------------------------
// Main Pipeline Entry Point
// ---------------------------------------------------------------------------

export async function runPipeline(
  rawSignals: RawSignal[],
  config: Partial<PipelineConfig> = {}
): Promise<PipelineResult> {
  const t0 = performance.now();
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Stage 1: Enrich
  const enriched = stageEnrich(rawSignals);

  // Stage 2: Filter (GCC relevance + age)
  const filtered = stageFilter(enriched, cfg);

  // Stage 3: Deduplicate
  const deduped = stageDedup(filtered);

  // Stage 4: Cluster
  const clusters = stageCluster(deduped);

  // Stage 5: Analyze (causal + forecast + graph)
  const analyzed = stageAnalyze(clusters);

  // Stage 6: Cross-cluster correlations
  const correlationCount = stageCorrelate(analyzed, cfg.enableCorrelations);

  // Stage 7: Decision briefs
  const briefs = await stageDecide(analyzed);

  return {
    executedAt: new Date().toISOString(),
    rawCount: rawSignals.length,
    filteredCount: deduped.length,
    clusters: analyzed,
    briefs,
    correlationCount,
    durationMs: Math.round(performance.now() - t0),
  };
}
