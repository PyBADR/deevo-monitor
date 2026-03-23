/**
 * DEEVO Scenario Engine
 * Layer: Agents
 * Pre-built scenario simulations for GCC economic intelligence.
 * Scenarios: geopolitical escalation, shipping disruption, AI economic shift, financial stress
 * Each scenario generates: propagation path, sector impacts, GDP impacts, decisions
 */

import type { SectorId, GDPComponent } from './sectorOntology';
import { SECTOR_REGISTRY } from './sectorOntology';
import { propagateShock } from './propagationGraph';
import type { PropagationResult } from './propagationGraph';
import { getMinistryImpact } from './marketDynamicsEngine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ScenarioId = 'geopolitical-escalation' | 'shipping-disruption' | 'ai-economic-shift' | 'financial-stress';

export interface ScenarioDefinition {
  id: ScenarioId;
  title: string;
  titleAr: string;
  description: string;
  /** Which sector is the shock origin */
  originSector: SectorId;
  /** Shock magnitude (0-1) */
  shockMagnitude: number;
  /** Trigger signals that would activate this scenario */
  triggerKeywords: string[];
}

export interface ScenarioOutput {
  scenarioId: ScenarioId;
  title: string;
  timestamp: string;
  /** What happened */
  whatHappened: string;
  /** Why it happened */
  whyItHappened: string;
  /** Propagation result */
  propagation: PropagationResult;
  /** Sector impacts with levels */
  sectorImpacts: Array<{ sectorId: SectorId; label: string; level: 'HIGH' | 'MED' | 'LOW'; score: number }>;
  /** Ministry impacts */
  ministryImpacts: Array<{ ministry: string; sectors: string[]; country: string }>;
  /** GDP component impacts */
  gdpImpacts: Array<{ component: GDPComponent; direction: 'positive' | 'negative' | 'neutral'; detail: string }>;
  /** What happens next */
  whatHappensNext: string[];
  /** Recommended actions */
  recommendedActions: string[];
}

// ---------------------------------------------------------------------------
// Scenario Definitions
// ---------------------------------------------------------------------------

const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'geopolitical-escalation',
    title: 'Geopolitical Escalation — Hormuz',
    titleAr: 'تصعيد جيوسياسي — هرمز',
    description: 'Military tension or disruption at the Strait of Hormuz affecting oil exports and shipping.',
    originSector: 'oil-gas',
    shockMagnitude: 0.85,
    triggerKeywords: ['hormuz', 'iran', 'military', 'missile', 'naval', 'escalation', 'tanker seizure'],
  },
  {
    id: 'shipping-disruption',
    title: 'Red Sea Shipping Disruption',
    titleAr: 'اضطراب الشحن في البحر الأحمر',
    description: 'Major disruption to Red Sea / Bab al-Mandab shipping corridor affecting global trade.',
    originSector: 'supply-chain',
    shockMagnitude: 0.75,
    triggerKeywords: ['red sea', 'houthi', 'bab al-mandab', 'shipping attack', 'container diversion'],
  },
  {
    id: 'ai-economic-shift',
    title: 'AI Economy Structural Shift',
    titleAr: 'تحول هيكلي في اقتصاد الذكاء الاصطناعي',
    description: 'Major AI policy, investment, or restriction event reshaping GCC technology landscape.',
    originSector: 'ai-economy',
    shockMagnitude: 0.6,
    triggerKeywords: ['GPU restriction', 'AI investment', 'data sovereignty', 'chip ban', 'sovereign AI'],
  },
  {
    id: 'financial-stress',
    title: 'Financial System Stress',
    titleAr: 'ضغوط على النظام المالي',
    description: 'Banking liquidity crisis, credit default wave, or sudden rate shock in GCC financial system.',
    originSector: 'banking',
    shockMagnitude: 0.8,
    triggerKeywords: ['liquidity crisis', 'bank run', 'NPL spike', 'credit freeze', 'rate shock'],
  },
];

export function getScenarioDefinitions(): ScenarioDefinition[] {
  return SCENARIOS;
}

// ---------------------------------------------------------------------------
// Scenario-specific narrative templates
// ---------------------------------------------------------------------------

const SCENARIO_NARRATIVES: Record<ScenarioId, {
  whatHappened: string;
  whyItHappened: string;
  whatHappensNext: string[];
  actions: string[];
  gdpDetails: Record<GDPComponent, string>;
}> = {
  'geopolitical-escalation': {
    whatHappened: 'Maritime tension increased across the Strait of Hormuz, with higher corridor sensitivity and stronger oil-linked market reaction.',
    whyItHappened: 'Multiple linked signals aligned: shipping anomalies, geopolitical rhetoric, and rising export risk sensitivity.',
    whatHappensNext: [
      'Oil price volatility expected within 24h',
      'Marine insurance repricing likely within 48h',
      'Export corridor alternative routing may activate',
      'Banking liquidity tightening possible if sustained',
    ],
    actions: [
      'Activate marine risk protocols',
      'Adjust underwriting exposure for Hormuz-linked routes',
      'Monitor liquidity corridors',
      'Escalate corridor monitoring to operations desk',
      'Flag reinsurer accumulation for exposed routes',
    ],
    gdpDetails: {
      'net-exports': 'Oil + shipping pressure reducing export throughput',
      'government-spending': 'Energy revenue sensitivity increasing fiscal risk',
      'investment': 'Risk premium rising, project financing costs up',
      'consumption': 'Delivery delays and pricing spillover to retail',
    },
  },
  'shipping-disruption': {
    whatHappened: 'Red Sea corridor disrupted — container vessels rerouting via Cape of Good Hope, adding 10-14 days to Asia-Europe transit.',
    whyItHappened: 'Escalation in Bab al-Mandab region forcing commercial shipping diversions and insurance premium spikes.',
    whatHappensNext: [
      'Freight rates spike 30-80% on affected routes within 7d',
      'Marine cargo insurance repricing within 48h',
      'Food import delays for GCC within 14d',
      'E-commerce fulfillment disruption within 7d',
    ],
    actions: [
      'Activate alternative routing protocols',
      'Review marine cargo insurance coverage adequacy',
      'Assess strategic food reserve levels',
      'Monitor container availability at GCC ports',
    ],
    gdpDetails: {
      'net-exports': 'Trade corridor disruption reduces throughput',
      'consumption': 'Import delays and price increases hit consumers',
      'investment': 'Logistics infrastructure investment accelerates',
      'government-spending': 'Emergency food import procurement may activate',
    },
  },
  'ai-economic-shift': {
    whatHappened: 'Major AI policy shift: chip export restrictions tightened, or sovereign AI investment announced at scale.',
    whyItHappened: 'Geopolitical competition over AI capability driving regulatory and investment decisions affecting GCC tech stack.',
    whatHappensNext: [
      'Data center expansion plans under review within 7d',
      'Sovereign AI strategy adjustment within 30d',
      'Talent acquisition competition intensifies',
      'Digital economy growth trajectory recalculated',
    ],
    actions: [
      'Review data sovereignty compliance posture',
      'Assess GPU supply chain alternatives',
      'Accelerate sovereign AI capability roadmap',
      'Monitor fintech and digital economy downstream impact',
    ],
    gdpDetails: {
      'investment': 'AI infrastructure investment pivot likely',
      'government-spending': 'Sovereign AI programs may accelerate spending',
      'consumption': 'Digital service quality and availability affected',
      'net-exports': 'Technology export competitiveness shifts',
    },
  },
  'financial-stress': {
    whatHappened: 'GCC banking system under pressure: liquidity tightening, credit defaults rising, or sudden rate shock transmitted from global markets.',
    whyItHappened: 'Combination of oil revenue sensitivity, global monetary policy transmission, and sector-specific credit concentration.',
    whatHappensNext: [
      'Interbank rates spike within 24h',
      'Credit tightening across real estate and construction within 7d',
      'Insurance sector investment portfolio pressure within 14d',
      'Consumer lending slowdown within 30d',
    ],
    actions: [
      'Activate liquidity contingency plan',
      'Review credit exposure to oil-linked sectors',
      'Prepare SAMA/CBUAE regulatory stress-test update',
      'Monitor deposit flight indicators',
      'Assess insurance investment portfolio mark-to-market',
    ],
    gdpDetails: {
      'investment': 'Credit freeze stalls project financing',
      'consumption': 'Consumer lending pullback reduces spending',
      'government-spending': 'Sovereign intervention may be required',
      'net-exports': 'Trade finance disruption affects exports',
    },
  },
};

// ---------------------------------------------------------------------------
// Main: Run a scenario simulation
// ---------------------------------------------------------------------------

export function runScenario(scenarioId: ScenarioId): ScenarioOutput {
  const def = SCENARIOS.find((s) => s.id === scenarioId);
  if (!def) throw new Error(`Unknown scenario: ${scenarioId}`);

  const narrative = SCENARIO_NARRATIVES[scenarioId];

  // Run propagation from origin sector
  const propagation = propagateShock(def.originSector, def.shockMagnitude);

  // Map propagation nodes to sector impact levels
  const sectorImpacts = propagation.nodes.map((node) => ({
    sectorId: node.sectorId,
    label: node.label,
    level: (node.impactScore > 0.5 ? 'HIGH' : node.impactScore > 0.2 ? 'MED' : 'LOW') as 'HIGH' | 'MED' | 'LOW',
    score: Math.round(node.impactScore * 100),
  }));

  // Map affected sectors to ministries
  const affectedSectors = sectorImpacts.filter((s) => s.level !== 'LOW').map((s) => s.sectorId);
  const ministrySet = new Map<string, { ministry: string; sectors: string[]; country: string }>();
  for (const sectorId of affectedSectors) {
    const ministries = getMinistryImpact(sectorId);
    for (const m of ministries) {
      const existing = ministrySet.get(m.id);
      if (existing) {
        if (!existing.sectors.includes(sectorId)) existing.sectors.push(sectorId);
      } else {
        ministrySet.set(m.id, { ministry: m.label, sectors: [sectorId], country: m.country });
      }
    }
  }

  // GDP impacts from narrative templates
  const gdpComponents: GDPComponent[] = ['net-exports', 'government-spending', 'investment', 'consumption'];
  const gdpImpacts = gdpComponents.map((comp) => ({
    component: comp,
    direction: (def.shockMagnitude > 0.6 ? 'negative' : 'neutral') as 'positive' | 'negative' | 'neutral',
    detail: narrative.gdpDetails[comp],
  }));

  return {
    scenarioId: def.id,
    title: def.title,
    timestamp: new Date().toISOString(),
    whatHappened: narrative.whatHappened,
    whyItHappened: narrative.whyItHappened,
    propagation,
    sectorImpacts,
    ministryImpacts: [...ministrySet.values()],
    gdpImpacts,
    whatHappensNext: narrative.whatHappensNext,
    recommendedActions: narrative.actions,
  };
}

// ---------------------------------------------------------------------------
// Auto-detect scenario from signal keywords
// ---------------------------------------------------------------------------

export function detectScenario(text: string): ScenarioId | null {
  const lower = text.toLowerCase();
  for (const scenario of SCENARIOS) {
    const matches = scenario.triggerKeywords.filter((kw) => lower.includes(kw));
    if (matches.length >= 2) return scenario.id;
  }
  return null;
}
