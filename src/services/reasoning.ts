/**
 * DEEVO Intelligence Monitor v3 — Reasoning Service (Ollama Bridge)
 * Contract 4 / Service 4 of 6
 * Layer: Agents (L4) — connects to local Ollama instance for
 *        explainable AI reasoning chains on Mac M4 Max GPU.
 *
 * Architecture: HTTP client to Ollama REST API (localhost:11434).
 *               Falls back to rule-based reasoning when Ollama
 *               is unavailable (offline-first).
 *
 * Trade-off: Local LLM vs cloud API.
 *            Local chosen for: data sovereignty (PDPL), zero latency,
 *            zero cost, offline capability, GPU utilization on M4 Max.
 *
 * Risk: Ollama not running — mitigated by health check + fallback.
 *       Model drift — mitigated by version pinning in config.
 */

import type { ReasoningStep } from '../types/decisions';
import type { IntelSignal } from '../types/signals';
import type { CorrelationMatch } from '../types/signals';
import { createAuditEntry } from './audit';

// ── Ollama Config ────────────────────────────────────────
interface OllamaConfig {
  baseUrl: string;
  model: string;
  timeoutMs: number;
  maxTokens: number;
  temperature: number;
}

const DEFAULT_OLLAMA_CONFIG: OllamaConfig = {
  baseUrl: 'http://localhost:11434',
  model: 'llama3.2:3b',
  timeoutMs: 30_000,
  maxTokens: 1024,
  temperature: 0.3,
};

// ── Health State ─────────────────────────────────────────
let ollamaAvailable = false;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 60_000; // 1 minute

// ── Health Check ─────────────────────────────────────────
export const checkOllamaHealth = async (
  config: OllamaConfig = DEFAULT_OLLAMA_CONFIG,
): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${config.baseUrl}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    ollamaAvailable = response.ok;
    lastHealthCheck = Date.now();
    return ollamaAvailable;
  } catch {
    ollamaAvailable = false;
    lastHealthCheck = Date.now();
    return false;
  }
};

// ── Fallback Rule-Based Reasoning ────────────────────────
const generateFallbackReasoning = (
  signals: IntelSignal[],
  correlation?: CorrelationMatch,
): ReasoningStep[] => {
  const steps: ReasoningStep[] = [
    {
      step: 1,
      layer: 'data',
      explanation: `Ingested ${signals.length} signal(s) from ${new Set(signals.map((s) => s.source)).size} source(s).`,
      evidence: signals.map((s) => `[${s.category}] ${s.title}`),
      confidence: 0.9,
      durationMs: 0,
    },
    {
      step: 2,
      layer: 'features',
      explanation: `Extracted categories: ${[...new Set(signals.map((s) => s.category))].join(', ')}.`,
      evidence: signals.map((s) => s.category),
      confidence: 0.85,
      durationMs: 0,
    },
  ];

  if (correlation) {
    steps.push({
      step: 3,
      layer: 'models',
      explanation: `Correlation rule ${correlation.ruleId} matched with ${correlation.confidence.toFixed(2)} confidence.`,
      evidence: [`Rule: ${correlation.ruleName}`, `Action: ${correlation.recommendedAction}`],
      confidence: correlation.confidence,
      durationMs: 0,
    });
  }

  steps.push({
    step: steps.length + 1,
    layer: 'agents',
    explanation: 'Ollama unavailable — using rule-based reasoning fallback.',
    evidence: ['Fallback mode active', 'No GPU inference performed'],
    confidence: 0.6,
    durationMs: 0,
  });

  return steps;
};

// ── Ollama LLM Reasoning ─────────────────────────────────
const queryOllama = async (
  prompt: string,
  config: OllamaConfig = DEFAULT_OLLAMA_CONFIG,
): Promise<string | null> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    const response = await fetch(`${config.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        prompt,
        stream: false,
        options: {
          num_predict: config.maxTokens,
          temperature: config.temperature,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!response.ok) return null;

    const data = await response.json() as { response?: string };
    return data.response ?? null;
  } catch {
    return null;
  }
};

// ── Build Reasoning Chain ────────────────────────────────
export const buildReasoningChain = async (
  signals: IntelSignal[],
  correlation?: CorrelationMatch,
  config: OllamaConfig = DEFAULT_OLLAMA_CONFIG,
): Promise<ReasoningStep[]> => {
  // Check health if stale
  if (Date.now() - lastHealthCheck > HEALTH_CHECK_INTERVAL) {
    await checkOllamaHealth(config);
  }

  // Fallback if Ollama unavailable
  if (!ollamaAvailable) {
    return generateFallbackReasoning(signals, correlation);
  }

  const startMs = performance.now();

  // Build prompt for Ollama
  const signalSummary = signals
    .slice(0, 5)
    .map((s) => `- [${s.category}/${s.alertLevel}] ${s.title}`)
    .join('\n');

  const correlationCtx = correlation
    ? `\nCorrelation Rule: ${correlation.ruleName} (${correlation.ruleId})\nConfidence: ${correlation.confidence}\nAction: ${correlation.recommendedAction}`
    : '';

  const prompt = `You are DEEVO, a GCC insurance decision intelligence system.
Analyze these intelligence signals and provide a structured reasoning chain.

Signals:
${signalSummary}
${correlationCtx}

Provide analysis in this format:
1. DATA: What data sources confirm this pattern?
2. FEATURES: What key features/indicators are present?
3. MODELS: What risk models are relevant?
4. AGENTS: What is your recommended action?
5. GOVERNANCE: What compliance considerations apply?

Be concise. Each point should be 1-2 sentences.`;

  const llmResponse = await queryOllama(prompt, config);
  const llmDurationMs = performance.now() - startMs;

  if (!llmResponse) {
    return generateFallbackReasoning(signals, correlation);
  }

  // Parse LLM response into reasoning steps
  const steps: ReasoningStep[] = [
    {
      step: 1,
      layer: 'data',
      explanation: `Ingested ${signals.length} signal(s) from ${new Set(signals.map((s) => s.source)).size} source(s).`,
      evidence: signals.map((s) => `[${s.category}] ${s.title}`),
      confidence: 0.9,
      durationMs: 0,
    },
  ];

  // Extract sections from LLM response
  const sections = ['DATA', 'FEATURES', 'MODELS', 'AGENTS', 'GOVERNANCE'];
  const layers: ReasoningStep['layer'][] = ['data', 'features', 'models', 'agents', 'governance'];

  for (let i = 0; i < sections.length; i++) {
    const sectionName = sections[i]!;
    const layer = layers[i]!;
    const regex = new RegExp(`${sectionName}[:\\s]*(.+?)(?=\\d+\\.|$)`, 's');
    const match = regex.exec(llmResponse);
    const content = match?.[1]?.trim() ?? `${sectionName} analysis completed.`;

    steps.push({
      step: steps.length + 1,
      layer,
      explanation: content,
      evidence: correlation ? [`Rule: ${correlation.ruleId}`] : [],
      confidence: 0.75,
      durationMs: Math.round(llmDurationMs / sections.length),
    });
  }

  // Audit the reasoning
  void createAuditEntry({
    action: 'DECISION_CREATED',
    variant: 'global',
    actor: `ollama:${config.model}`,
    description: `Reasoning chain built: ${steps.length} steps, ${Math.round(llmDurationMs)}ms`,
    payload: { model: config.model, steps: steps.length, durationMs: llmDurationMs },
  });

  return steps;
};

// ── Exports ──────────────────────────────────────────────
export const isOllamaAvailable = (): boolean => ollamaAvailable;
export const getOllamaConfig = (): OllamaConfig => ({ ...DEFAULT_OLLAMA_CONFIG });
