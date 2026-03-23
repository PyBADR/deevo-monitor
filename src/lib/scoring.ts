/**
 * DEEVO Signal Scoring — Simple, Deterministic
 * Scores: LOW | MED | HIGH | CRITICAL
 * Rules: keyword match + multi-signal correlation → risk level
 * No LLM. No complexity. Just signal → score → action.
 */

export type RiskLevel = 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

export interface ScoredSignal {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  level: RiskLevel;
  score: number; // 0-100
  category: string;
  action: string;
}

// ---------------------------------------------------------------------------
// Keyword-based severity scoring
// ---------------------------------------------------------------------------

const CRITICAL_KEYWORDS = [
  'hormuz', 'strait blockade', 'tanker seizure', 'military strike',
  'oil facility attack', 'bank run', 'sovereign default', 'nuclear',
  'war declared', 'catastrophe', 'tsunami', 'earthquake magnitude',
];

const HIGH_KEYWORDS = [
  'sanctions', 'embargo', 'missile', 'drone attack', 'oil spill',
  'pipeline explosion', 'cyberattack', 'data breach', 'fraud ring',
  'market crash', 'credit freeze', 'liquidity crisis', 'evacuation',
  'red sea attack', 'houthi', 'airspace closed',
];

const MED_KEYWORDS = [
  'oil price', 'production cut', 'opec', 'rate hike', 'inflation',
  'insurance claim', 'flood', 'sandstorm', 'regulatory change',
  'trade dispute', 'shipping delay', 'port congestion', 'protest',
  'diplomatic tension', 'recall', 'investigation',
];

// ---------------------------------------------------------------------------
// Score computation
// ---------------------------------------------------------------------------

function computeScore(text: string): { score: number; level: RiskLevel } {
  const lower = text.toLowerCase();

  let score = 10; // baseline

  for (const kw of CRITICAL_KEYWORDS) {
    if (lower.includes(kw)) score += 30;
  }
  for (const kw of HIGH_KEYWORDS) {
    if (lower.includes(kw)) score += 18;
  }
  for (const kw of MED_KEYWORDS) {
    if (lower.includes(kw)) score += 8;
  }

  score = Math.min(100, score);

  const level: RiskLevel =
    score >= 80 ? 'CRITICAL' :
    score >= 55 ? 'HIGH' :
    score >= 30 ? 'MED' : 'LOW';

  return { score, level };
}

// ---------------------------------------------------------------------------
// Action recommendation based on level
// ---------------------------------------------------------------------------

const ACTION_MAP: Record<RiskLevel, string> = {
  CRITICAL: 'Escalate immediately — activate response protocol',
  HIGH: 'Review exposure and prepare contingency',
  MED: 'Monitor closely — increase signal tracking',
  LOW: 'Log for review — no immediate action',
};

// ---------------------------------------------------------------------------
// Category detection
// ---------------------------------------------------------------------------

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  if (/oil|gas|opec|petroleum|crude|barrel|refin/.test(lower)) return 'Oil & Gas';
  if (/insurance|claim|underwriting|premium|reinsur/.test(lower)) return 'Insurance';
  if (/bank|credit|loan|deposit|interest|liquidity/.test(lower)) return 'Banking';
  if (/ship|port|cargo|container|freight|maritime/.test(lower)) return 'Supply Chain';
  if (/military|defense|missile|drone|weapon/.test(lower)) return 'Defense';
  if (/cyber|hack|breach|ransomware/.test(lower)) return 'Cyber';
  if (/regulat|law|compliance|sanction|embargo/.test(lower)) return 'Regulatory';
  return 'Geopolitics';
}

// ---------------------------------------------------------------------------
// Multi-signal correlation — if multiple HIGH/CRITICAL signals in same
// category within timeframe, elevate the group
// ---------------------------------------------------------------------------

export function correlateSignals(signals: ScoredSignal[]): ScoredSignal[] {
  const categoryGroups = new Map<string, ScoredSignal[]>();
  for (const s of signals) {
    const group = categoryGroups.get(s.category) ?? [];
    group.push(s);
    categoryGroups.set(s.category, group);
  }

  const elevated: ScoredSignal[] = [];
  for (const [_category, group] of categoryGroups) {
    const highCount = group.filter((s) => s.level === 'HIGH' || s.level === 'CRITICAL').length;
    if (highCount >= 2) {
      // Multiple high signals in same category → elevate all to CRITICAL
      for (const s of group) {
        if (s.level === 'HIGH') {
          elevated.push({ ...s, level: 'CRITICAL', score: Math.min(100, s.score + 20), action: ACTION_MAP.CRITICAL });
        } else {
          elevated.push(s);
        }
      }
    } else {
      elevated.push(...group);
    }
  }
  return elevated;
}

// ---------------------------------------------------------------------------
// Main: Score a raw signal
// ---------------------------------------------------------------------------

export function scoreSignal(
  id: string,
  title: string,
  source: string,
  timestamp: string
): ScoredSignal {
  const { score, level } = computeScore(title);
  const category = detectCategory(title);

  return {
    id,
    title,
    source,
    timestamp,
    level,
    score,
    category,
    action: ACTION_MAP[level],
  };
}
