/**
 * DEEVO Causal Intelligence — Decision Explainer Engine
 * Layer: Agents (L4) + Governance (L7)
 *
 * Converts event clusters into structured decision briefs.
 * Every output grounded in signal evidence. No hallucination.
 */
import type { EventCluster, DecisionBrief, CausalLink, Forecast, SignalCategory } from './types';
import { inferCausality } from './correlationEngine';
import { generateForecasts } from './forecastEngine';
import { buildStoryGraph } from './storyGraphBuilder';

// ── SHA-256 Audit Hash ───────────────────────────────────
async function sha256(message: string): Promise<string> {
  const buffer = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Why It Matters Templates ─────────────────────────────
const WHY_TEMPLATES: Record<SignalCategory, string> = {
  'geopolitics': 'Geopolitical instability directly impacts GCC insurance markets, energy pricing, and sovereign risk ratings.',
  'oil-gas': 'Oil & gas disruptions affect GCC GDP, fiscal stability, and downstream insurance exposures across marine, property, and trade credit lines.',
  'supply-chain': 'Supply chain disruption cascades into cargo delays, premium adjustments, and trade credit exposure for GCC-linked routes.',
  'regulation': 'Regulatory changes require immediate compliance assessment, product repricing, and reserve adjustments by GCC insurers.',
  'insurance': 'Direct impact on GCC insurance operations — claims, pricing, reserves, or product terms require immediate review.',
  'fraud': 'Fraud intelligence escalation — SIU activation, claims leakage containment, and network investigation required.',
  'finance': 'Financial market movement affects GCC insurer investment portfolios, solvency ratios, and asset-liability matching.',
  'maritime': 'Maritime disruption impacts shipping-dependent GCC economies and triggers marine/cargo insurance clause reviews.',
  'climate': 'Climate events in GCC trigger CAT model updates, property claims surges, and motor fleet exposure reviews.',
  'cyber': 'Cyber incidents targeting GCC infrastructure trigger liability coverage, business interruption, and regulatory notification requirements.',
};

// ── Why Now Templates ────────────────────────────────────
function generateWhyNow(cluster: EventCluster): string {
  if (cluster.isEvolving && cluster.signalCount >= 5) {
    return `This story has ${cluster.signalCount} converging signals and is actively evolving. Signal density has crossed the escalation threshold.`;
  }
  if (cluster.riskScore >= 75) {
    return `Risk score has reached ${cluster.riskScore}/100, crossing the CRITICAL threshold. Multiple high-severity indicators detected.`;
  }
  if (cluster.signalCount >= 3) {
    return `Multiple sources (${cluster.signalCount} signals) now reporting on this event, confirming pattern escalation.`;
  }
  return `New signal detected in ${cluster.category} domain. Monitoring threshold reached.`;
}

// ── Action Recommendations ───────────────────────────────
const ACTION_TEMPLATES: Record<SignalCategory, string> = {
  'geopolitics': 'Activate geopolitical risk protocol. Review war exclusion clauses. Brief CRO on exposure.',
  'oil-gas': 'Monitor energy price corridor. Review marine cargo exposure. Alert commodity desk.',
  'supply-chain': 'Activate supply chain disruption protocol. Review trade credit limits. Monitor port congestion.',
  'regulation': 'Initiate compliance gap analysis. Review product terms against new framework. Brief legal team.',
  'insurance': 'Review underwriting guidelines. Activate claims watch. Assess reserve adequacy.',
  'fraud': 'Escalate to SIU. Freeze flagged claims. Initiate network investigation. Review ring indicators.',
  'finance': 'Review investment portfolio exposure. Monitor solvency impact. Alert asset management team.',
  'maritime': 'Activate marine risk escalation. Review war risk premiums. Monitor vessel tracking in affected zone.',
  'climate': 'Update CAT model parameters. Pre-position claims response. Review property portfolio exposure.',
  'cyber': 'Activate cyber incident response. Review affected policyholders. Assess business interruption exposure.',
};

// ── Connected Signals Detection ──────────────────────────
function detectConnections(cluster: EventCluster): DecisionBrief['connectedSignals'] {
  const allText = cluster.signals.map(s => `${s.title} ${s.content}`).join(' ').toLowerCase();
  return {
    oil: /oil|crude|brent|opec|lng|gas|energy/.test(allText),
    shipping: /ship|port|maritime|tanker|vessel|cargo|hormuz|suez/.test(allText),
    sanctions: /sanction|embargo|ofac|blocked|designated/.test(allText),
    regulation: /regulat|sama|cbuae|circular|compliance|framework|law/.test(allText),
    claims: /claim|loss|damage|liability|indemnity|payout/.test(allText),
    market: /stock|market|index|forex|bond|yield|exchange/.test(allText),
  };
}

// ── Likely Next Step ─────────────────────────────────────
function predictNextStep(cluster: EventCluster, causalChain: CausalLink[], forecasts: Forecast[]): string {
  const topForecast = forecasts.find(f => f.horizon === '24h') ?? forecasts[0];
  if (!topForecast) return 'Continue monitoring. No strong directional signal yet.';

  const dirLabel = topForecast.direction === 'up' ? 'escalation' : topForecast.direction === 'down' ? 'de-escalation' : 'lateral movement';
  const probPct = Math.round(topForecast.probability * 100);

  if (causalChain.length > 0) {
    return `${topForecast.metric} trending toward ${dirLabel} (${probPct}% probability in ${topForecast.horizon}). ${causalChain[0]!.effect}`;
  }
  return `${topForecast.metric}: ${dirLabel} expected (${probPct}% confidence over ${topForecast.horizon}).`;
}

// ── Main Decision Brief Generator ────────────────────────
export async function generateDecisionBrief(cluster: EventCluster): Promise<DecisionBrief> {
  const causalChain = inferCausality(cluster);
  const forecasts = generateForecasts(cluster);
  const graph = buildStoryGraph(cluster);
  const topSignal = cluster.signals.sort((a, b) => b.riskScore - a.riskScore)[0];
  const whatHappened = topSignal
    ? `${topSignal.title}. ${cluster.signalCount} related signals detected from ${new Set(cluster.signals.map(s => s.source)).size} sources.`
    : cluster.headline;
  const auditPayload = `brief_${cluster.id}_${new Date().toISOString()}`;
  const auditHash = await sha256(auditPayload);

  return {
    clusterId: cluster.id,
    headline: cluster.headline.length > 60 ? cluster.headline.slice(0, 57) + '...' : cluster.headline,
    whatHappened,
    whyItMatters: WHY_TEMPLATES[cluster.category] ?? 'Impact assessment pending.',
    whyNow: generateWhyNow(cluster),
    connectedSignals: detectConnections(cluster),
    likelyNextStep: predictNextStep(cluster, causalChain, forecasts),
    recommendedAction: ACTION_TEMPLATES[cluster.category] ?? 'Continue monitoring.',
    confidence: Math.round(Math.min(95, 50 + cluster.signalCount * 5 + (causalChain.length > 0 ? 15 : 0))),
    riskLevel: cluster.riskLevel,
    causalChain,
    forecasts,
    graph,
    auditHash,
    generatedAt: new Date().toISOString(),
  };
}
