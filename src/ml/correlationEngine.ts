/**
 * DEEVO Causal Intelligence — Correlation & Causal Reasoning Engine
 * Layer: Models (L3)
 *
 * Rule-based causal inference. Every "why" is grounded in signal evidence.
 * No hallucinated causality — only rule-matched, evidence-linked chains.
 */
import type { EventCluster, CausalLink, SignalCategory } from './types';

// ── Causal Rules ─────────────────────────────────────────
// Each rule: IF condition THEN cause → effect
interface CausalRule {
  id: string;
  name: string;
  condition: (cluster: EventCluster) => boolean;
  cause: string;
  effect: string;
}

const CAUSAL_RULES: CausalRule[] = [
  {
    id: 'R001', name: 'Hormuz → Marine Risk',
    condition: (c) => c.signals.some(s =>
      s.entities.some(e => e.normalized === 'Strait of Hormuz') &&
      ['geopolitics', 'maritime'].includes(s.category)),
    cause: 'Strait of Hormuz disruption or military escalation',
    effect: 'Marine insurance premiums increase; war risk clauses activated',
  },
  {
    id: 'R002', name: 'Oil Disruption → Price Spike',
    condition: (c) => c.signals.some(s =>
      s.entities.some(e => ['Crude Oil', 'Brent Crude', 'WTI', 'LNG'].includes(e.normalized)) &&
      s.entities.some(e => ['Disruption', 'Blockade', 'Attack', 'Escalation'].includes(e.normalized))),
    cause: 'Oil/gas supply disruption in GCC corridor',
    effect: 'Commodity prices spike; energy insurance exposure increases',
  },
  {
    id: 'R003', name: 'Sanctions → Trade Credit',
    condition: (c) => c.signals.some(s =>
      s.entities.some(e => e.normalized === 'Sanctions') &&
      s.countries.some(cc => ['IR', 'YE', 'IQ'].includes(cc))),
    cause: 'New sanctions regime targeting GCC-adjacent state',
    effect: 'Trade credit insurance tightens; compliance costs rise',
  },
  {
    id: 'R004', name: 'Regulatory Change → Premium Adjustment',
    condition: (c) => c.category === 'regulation' &&
      c.signals.some(s => s.entities.some(e =>
        ['SAMA', 'CBUAE', 'CBK', 'QCB', 'Insurance Authority'].includes(e.normalized))),
    cause: 'GCC regulator issues new insurance framework or circular',
    effect: 'Insurers must adjust pricing, reserves, or product terms',
  },
  {
    id: 'R005', name: 'Red Sea → Shipping Costs',
    condition: (c) => c.signals.some(s =>
      s.entities.some(e => ['Red Sea', 'Bab-el-Mandeb', 'Suez Canal'].includes(e.normalized)) &&
      ['supply-chain', 'maritime', 'geopolitics'].includes(s.category)),
    cause: 'Red Sea shipping route under threat',
    effect: 'Shipping costs surge; cargo insurance premiums rise; supply chain delays',
  },
  {
    id: 'R006', name: 'Climate Event → CAT Claims',
    condition: (c) => c.category === 'climate' &&
      c.signals.some(s => s.riskScore >= 50),
    cause: 'Extreme weather event in GCC (flood, dust storm, heat)',
    effect: 'Property and motor claims surge; CAT reserves activated',
  },
  {
    id: 'R007', name: 'Cyber Attack → Liability Exposure',
    condition: (c) => c.category === 'cyber' &&
      c.signals.some(s => s.entities.some(e =>
        ['Cyber Attack', 'Ransomware'].includes(e.normalized ?? ''))),
    cause: 'Cyber incident targeting GCC financial or energy sector',
    effect: 'Cyber liability claims; business interruption coverage triggered',
  },
  {
    id: 'R008', name: 'Fraud Ring → SIU Escalation',
    condition: (c) => c.category === 'fraud' &&
      c.riskScore >= 50,
    cause: 'Organized fraud activity detected in GCC insurance market',
    effect: 'SIU investigation triggered; claims leakage risk elevated',
  },
  {
    id: 'R009', name: 'Multi-Signal Convergence → Systemic Risk',
    condition: (c) => c.signalCount >= 5 && c.riskScore >= 70,
    cause: 'Multiple HIGH signals converging on same risk domain',
    effect: 'Systemic risk elevated; CRO briefing recommended; board notification threshold',
  },
  {
    id: 'R010', name: 'Iran Escalation → GCC Defense Posture',
    condition: (c) => c.signals.some(s =>
      s.countries.includes('IR' as any) &&
      s.entities.some(e => ['Escalation', 'Attack', 'Conflict'].includes(e.normalized))),
    cause: 'Iran military or nuclear escalation',
    effect: 'GCC political risk premiums rise; property war exclusion reviews triggered',
  },
];

// ── Cross-Category Correlation ───────────────────────────
interface CorrelationPair {
  categoryA: SignalCategory;
  categoryB: SignalCategory;
  weight: number;
  description: string;
}

const CORRELATION_MATRIX: CorrelationPair[] = [
  { categoryA: 'geopolitics', categoryB: 'oil-gas', weight: 0.85, description: 'Geopolitical tension directly impacts oil supply and pricing' },
  { categoryA: 'geopolitics', categoryB: 'maritime', weight: 0.80, description: 'Geopolitical events disrupt shipping routes' },
  { categoryA: 'maritime', categoryB: 'supply-chain', weight: 0.90, description: 'Maritime disruption cascades to supply chains' },
  { categoryA: 'oil-gas', categoryB: 'finance', weight: 0.75, description: 'Oil price moves impact GCC financial markets' },
  { categoryA: 'oil-gas', categoryB: 'insurance', weight: 0.70, description: 'Energy sector changes affect insurance exposures' },
  { categoryA: 'regulation', categoryB: 'insurance', weight: 0.80, description: 'Regulatory changes directly impact insurance operations' },
  { categoryA: 'climate', categoryB: 'insurance', weight: 0.75, description: 'Climate events drive claims activity' },
  { categoryA: 'cyber', categoryB: 'insurance', weight: 0.65, description: 'Cyber incidents trigger liability coverage' },
  { categoryA: 'fraud', categoryB: 'insurance', weight: 0.85, description: 'Fraud directly impacts claims costs' },
  { categoryA: 'supply-chain', categoryB: 'insurance', weight: 0.60, description: 'Supply disruption affects trade credit and cargo lines' },
];

// ── Find Correlations Between Clusters ───────────────────
export function findCorrelations(clusters: EventCluster[]): Array<{ clusterA: string; clusterB: string; weight: number; reason: string }> {
  const results: Array<{ clusterA: string; clusterB: string; weight: number; reason: string }> = [];
  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      const a = clusters[i]!;
      const b = clusters[j]!;
      const pair = CORRELATION_MATRIX.find(p =>
        (p.categoryA === a.category && p.categoryB === b.category) ||
        (p.categoryA === b.category && p.categoryB === a.category));
      if (pair && pair.weight >= 0.6) {
        results.push({ clusterA: a.id, clusterB: b.id, weight: pair.weight, reason: pair.description });
      }
    }
  }
  return results.sort((a, b) => b.weight - a.weight);
}

// ── Apply Causal Rules to Cluster ────────────────────────
export function inferCausality(cluster: EventCluster): CausalLink[] {
  const links: CausalLink[] = [];
  for (const rule of CAUSAL_RULES) {
    if (rule.condition(cluster)) {
      links.push({
        cause: rule.cause,
        effect: rule.effect,
        rule: rule.id,
        confidence: Math.min(0.95, 0.6 + cluster.signalCount * 0.05),
        evidence: cluster.signals.map(s => s.id),
      });
    }
  }
  return links;
}
