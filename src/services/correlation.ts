/**
 * DEEVO Intelligence Monitor v3 — Correlation Engine
 * Contract 4 / Service 3 of 6
 * Layer: Models (L3) — evaluates 6 named correlation rules against
 *        incoming signals in a sliding time window.
 *
 * Architecture: Event-driven — signals are pushed into the engine,
 *               which evaluates all active rules and emits matches.
 *               Uses in-memory sliding window (no DB dependency).
 *
 * Trade-off: In-memory window vs persistent event store.
 *            In-memory chosen for v3 speed (sub-ms evaluation).
 *            Persistent store planned for v4 audit replay.
 *
 * Risk: Memory growth — mitigated by max window size and TTL eviction.
 */

import type { IntelSignal, AlertLevel } from '../types/signals';
import type { CorrelationMatch } from '../types/signals';
import { CORRELATION_RULES, type CorrelationRule } from '../config/rules';
import { createAuditEntry } from './audit';

// ── Sliding Window ───────────────────────────────────────
interface WindowConfig {
  maxSignals: number;
  evictionIntervalMs: number;
}

const DEFAULT_WINDOW: WindowConfig = {
  maxSignals: 10_000,
  evictionIntervalMs: 30_000,
};

// ── Signal Window State ──────────────────────────────────
let signalWindow: IntelSignal[] = [];
let evictionTimer: ReturnType<typeof setInterval> | null = null;

// ── Event Listeners ──────────────────────────────────────
type CorrelationListener = (match: CorrelationMatch) => void;
const listeners: CorrelationListener[] = [];

export const onCorrelationMatch = (fn: CorrelationListener): (() => void) => {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
};

const emit = (match: CorrelationMatch): void => {
  listeners.forEach((fn) => {
    try { fn(match); } catch (err) {
      console.error('[CorrelationEngine] Listener error:', err);
    }
  });
};

// ── Eviction ─────────────────────────────────────────────
const evictExpired = (): void => {
  const now = Date.now();
  // Remove signals older than the longest rule window
  const maxWindow = Math.max(...CORRELATION_RULES.map((r) => r.windowSeconds)) * 1000;
  signalWindow = signalWindow.filter((s) => {
    const age = now - new Date(s.timestamp).getTime();
    return age < maxWindow;
  });

  // Enforce max window size via LRU
  if (signalWindow.length > DEFAULT_WINDOW.maxSignals) {
    signalWindow = signalWindow.slice(-DEFAULT_WINDOW.maxSignals);
  }
};

// ── Rule Evaluation ──────────────────────────────────────
const evaluateRule = (
  rule: CorrelationRule,
  _newSignal: IntelSignal,
): CorrelationMatch | null => {
  if (!rule.active) return null;

  const now = Date.now();
  const windowStart = now - rule.windowSeconds * 1000;

  // Get signals in this rule's time window matching trigger categories
  const relevantSignals = signalWindow.filter((s) => {
    const signalTime = new Date(s.timestamp).getTime();
    return (
      signalTime >= windowStart &&
      rule.triggerCategories.includes(s.category)
    );
  });

  // Check if minimum signal count is met
  if (relevantSignals.length < rule.minSignals) return null;

  // Check category diversity — need signals from at least 2 different trigger categories
  const categorySet = new Set(relevantSignals.map((s) => s.category));
  const matchingCategories = rule.triggerCategories.filter((c) => categorySet.has(c));
  if (matchingCategories.length < 2) return null;

  // Compute confidence as average of matching signal confidences
  const avgConfidence =
    relevantSignals.reduce((sum, s) => sum + s.confidence, 0) / relevantSignals.length;

  if (avgConfidence < rule.confidenceThreshold) return null;

  // Rule fires!
  return {
    ruleId: rule.id,
    ruleName: rule.name,
    triggerSignals: relevantSignals.map((s) => s.id),
    alertLevel: rule.outputAlertLevel as AlertLevel,
    confidence: avgConfidence,
    timestamp: new Date().toISOString(),
    recommendedAction: rule.recommendedAction,
  };
};

// ── Public API ───────────────────────────────────────────

/** Ingest a new signal into the correlation engine */
export const ingestSignal = async (signal: IntelSignal): Promise<CorrelationMatch[]> => {
  signalWindow.push(signal);
  const matches: CorrelationMatch[] = [];

  for (const rule of CORRELATION_RULES) {
    const match = evaluateRule(rule, signal);
    if (match) {
      matches.push(match);
      emit(match);

      // Audit the correlation firing
      void createAuditEntry({
        action: 'CORRELATION_FIRED',
        variant: 'global',
        actor: 'correlation_engine',
        description: `Rule ${rule.id} fired: ${rule.name}`,
        payload: {
          ruleId: rule.id,
          triggerCount: match.triggerSignals.length,
          confidence: match.confidence,
          alertLevel: match.alertLevel,
        },
      });
    }
  }

  return matches;
};

/** Start the eviction timer */
export const startCorrelationEngine = (
  config: WindowConfig = DEFAULT_WINDOW,
): void => {
  if (evictionTimer) return;
  evictionTimer = setInterval(evictExpired, config.evictionIntervalMs);
};

/** Stop the eviction timer */
export const stopCorrelationEngine = (): void => {
  if (evictionTimer) {
    clearInterval(evictionTimer);
    evictionTimer = null;
  }
};

/** Get current window stats */
export const getWindowStats = (): {
  signalCount: number;
  oldestSignal: string | null;
  newestSignal: string | null;
} => ({
  signalCount: signalWindow.length,
  oldestSignal: signalWindow[0]?.timestamp ?? null,
  newestSignal: signalWindow[signalWindow.length - 1]?.timestamp ?? null,
});

/** Clear window (testing only) */
export const _clearWindow = (): void => {
  signalWindow = [];
};
