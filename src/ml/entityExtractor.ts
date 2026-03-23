/**
 * DEEVO Causal Intelligence — Entity Extraction Engine
 * Layer: Features (L2)
 *
 * Deterministic entity extraction using keyword dictionaries.
 * No LLM — pure pattern matching with confidence scoring.
 */
import type { ExtractedEntity, EntityType, RawSignal, EnrichedSignal, SignalCategory, RelevantCountry, RiskLevel } from './types';

// ── Entity Dictionaries ──────────────────────────────────
const ENTITY_DICT: Record<EntityType, Record<string, string>> = {
  country: {
    'saudi arabia': 'SA', 'saudi': 'SA', 'kingdom': 'SA', 'riyadh': 'SA',
    'uae': 'AE', 'emirates': 'AE', 'dubai': 'AE', 'abu dhabi': 'AE',
    'kuwait': 'KW', 'qatar': 'QA', 'doha': 'QA', 'bahrain': 'BH',
    'oman': 'OM', 'muscat': 'OM', 'iran': 'IR', 'tehran': 'IR',
    'iraq': 'IQ', 'baghdad': 'IQ', 'yemen': 'YE', 'houthi': 'YE',
    'egypt': 'EG', 'jordan': 'JO', 'lebanon': 'LB',
  },
  city: {
    'riyadh': 'Riyadh', 'jeddah': 'Jeddah', 'dammam': 'Dammam',
    'dubai': 'Dubai', 'abu dhabi': 'Abu Dhabi', 'sharjah': 'Sharjah',
    'doha': 'Doha', 'manama': 'Manama', 'muscat': 'Muscat',
    'kuwait city': 'Kuwait City', 'basra': 'Basra', 'aden': 'Aden',
  },
  company: {
    'aramco': 'Saudi Aramco', 'sabic': 'SABIC', 'adnoc': 'ADNOC',
    'knpc': 'KNPC', 'qatarenergy': 'QatarEnergy', 'bapco': 'BAPCO',
    'pdo': 'PDO', 'sama': 'SAMA', 'cbuae': 'CBUAE',
    'tawuniya': 'Tawuniya', 'bupa arabia': 'Bupa Arabia',
    'medgulf': 'MedGulf', 'salama': 'Salama', 'oman insurance': 'Oman Insurance',
  },
  regulator: {
    'sama': 'SAMA', 'cbuae': 'CBUAE', 'cbk': 'CBK', 'qcb': 'QCB',
    'cbb': 'CBB', 'cbo': 'CBO', 'cma': 'CMA', 'sca': 'SCA',
    'ia': 'Insurance Authority', 'nphies': 'NPHIES',
    'sdaia': 'SDAIA', 'ndmo': 'NDMO',
  },
  port: {
    'hormuz': 'Strait of Hormuz', 'strait of hormuz': 'Strait of Hormuz',
    'bab-el-mandeb': 'Bab-el-Mandeb', 'bab el mandeb': 'Bab-el-Mandeb',
    'jebel ali': 'Jebel Ali', 'king abdulaziz port': 'King Abdulaziz Port',
    'ras tanura': 'Ras Tanura', 'fujairah': 'Fujairah Port',
    'duqm': 'Duqm Port', 'hamad port': 'Hamad Port',
    'mina salman': 'Mina Salman', 'suez': 'Suez Canal',
    'red sea': 'Red Sea', 'persian gulf': 'Persian Gulf',
  },
  vessel: {
    'tanker': 'Oil Tanker', 'vlcc': 'VLCC', 'lng carrier': 'LNG Carrier',
    'container ship': 'Container Ship', 'bulk carrier': 'Bulk Carrier',
  },
  commodity: {
    'crude oil': 'Crude Oil', 'brent': 'Brent Crude', 'wti': 'WTI',
    'lng': 'LNG', 'natural gas': 'Natural Gas', 'gold': 'Gold',
    'petrochemical': 'Petrochemicals', 'diesel': 'Diesel', 'jet fuel': 'Jet Fuel',
    'naphtha': 'Naphtha', 'aluminum': 'Aluminum', 'steel': 'Steel',
  },
  'insurance-line': {
    'marine': 'Marine', 'cargo': 'Cargo', 'hull': 'Hull',
    'motor': 'Motor', 'property': 'Property', 'liability': 'Liability',
    'health': 'Health', 'life': 'Life', 'cyber': 'Cyber Liability',
    'reinsurance': 'Reinsurance', 'cat': 'CAT', 'trade credit': 'Trade Credit',
    'war risk': 'War Risk', 'political risk': 'Political Risk',
  },
  'risk-topic': {
    'sanctions': 'Sanctions', 'terrorism': 'Terrorism', 'conflict': 'Conflict',
    'flood': 'Flood Risk', 'dust storm': 'Dust Storm', 'earthquake': 'Earthquake',
    'pandemic': 'Pandemic', 'cyber attack': 'Cyber Attack',
    'fraud': 'Insurance Fraud', 'money laundering': 'AML',
    'climate': 'Climate Risk', 'inflation': 'Inflation',
  },
  'event-type': {
    'escalation': 'Escalation', 'de-escalation': 'De-escalation',
    'disruption': 'Disruption', 'blockade': 'Blockade',
    'regulation': 'Regulatory Change', 'ipo': 'IPO',
    'merger': 'M&A', 'bankruptcy': 'Bankruptcy',
    'attack': 'Attack', 'seizure': 'Seizure',
    'embargo': 'Embargo', 'ceasefire': 'Ceasefire',
  },
};

// ── Category Classification Rules ────────────────────────
const CATEGORY_RULES: Array<{ keywords: string[]; category: SignalCategory }> = [
  { keywords: ['hormuz', 'houthi', 'iran', 'missile', 'drone', 'conflict', 'military', 'sanctions', 'nuclear', 'geopolitical'], category: 'geopolitics' },
  { keywords: ['crude', 'brent', 'wti', 'opec', 'oil', 'gas', 'lng', 'refinery', 'petrochemical', 'aramco', 'adnoc'], category: 'oil-gas' },
  { keywords: ['shipping', 'port', 'vessel', 'tanker', 'container', 'cargo', 'freight', 'maritime', 'route', 'chokepoint'], category: 'supply-chain' },
  { keywords: ['regulation', 'regulator', 'sama', 'cbuae', 'circular', 'compliance', 'pdpl', 'law', 'framework', 'license'], category: 'regulation' },
  { keywords: ['insurance', 'premium', 'claim', 'underwriting', 'reinsurance', 'policy', 'actuarial', 'solvency', 'tawuniya'], category: 'insurance' },
  { keywords: ['fraud', 'staged', 'ghost', 'ring', 'suspicious', 'siu', 'forged', 'counterfeit', 'laundering'], category: 'fraud' },
  { keywords: ['stock', 'market', 'index', 'bond', 'yield', 'forex', 'currency', 'exchange', 'tadawul', 'dfm'], category: 'finance' },
  { keywords: ['ship', 'tanker', 'port', 'hormuz', 'suez', 'red sea', 'bab-el-mandeb', 'naval'], category: 'maritime' },
  { keywords: ['flood', 'dust', 'heat', 'storm', 'climate', 'temperature', 'drought', 'rainfall'], category: 'climate' },
  { keywords: ['cyber', 'hack', 'ransomware', 'breach', 'phishing', 'malware', 'data leak'], category: 'cyber' },
];

// ── GCC Relevance Scoring ────────────────────────────────
const GCC_CODES = new Set(['SA', 'AE', 'KW', 'QA', 'BH', 'OM']);
const CONTEXT_KEYWORDS = ['hormuz', 'red sea', 'gulf', 'gcc', 'opec', 'mena', 'middle east', 'persian gulf'];

function scoreGCCRelevance(text: string, countries: RelevantCountry[]): number {
  let score = 0;
  const gccCountries = countries.filter(c => GCC_CODES.has(c));
  score += Math.min(gccCountries.length * 0.3, 0.6);
  const lower = text.toLowerCase();
  for (const kw of CONTEXT_KEYWORDS) {
    if (lower.includes(kw)) { score += 0.1; break; }
  }
  if (countries.some(c => ['IR', 'IQ', 'YE'].includes(c))) score += 0.15;
  return Math.min(score, 1);
}

// ── Risk Score Calculation ───────────────────────────────
function computeRiskScore(text: string, entities: ExtractedEntity[], category: SignalCategory): number {
  let score = 20; // baseline
  const lower = text.toLowerCase();
  const highRiskWords = ['critical', 'attack', 'war', 'blockade', 'explosion', 'seizure', 'sanctions', 'escalation', 'emergency'];
  const medRiskWords = ['disruption', 'delay', 'risk', 'threat', 'concern', 'tension', 'warning', 'surge'];
  for (const w of highRiskWords) { if (lower.includes(w)) score += 12; }
  for (const w of medRiskWords) { if (lower.includes(w)) score += 6; }
  if (category === 'geopolitics' || category === 'maritime') score += 10;
  if (entities.some(e => e.type === 'port' && e.normalized === 'Strait of Hormuz')) score += 15;
  return Math.min(score, 100);
}

function toRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

// ── Simple Embedding (TF-IDF-like word frequency vector) ─
function computeEmbedding(text: string): number[] {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const vocab = [...new Set(words)].slice(0, 64);
  return vocab.map(v => words.filter(w => w === v).length / words.length);
}

// ── Main Extraction Function ─────────────────────────────
export function extractEntities(text: string): ExtractedEntity[] {
  const lower = text.toLowerCase();
  const entities: ExtractedEntity[] = [];

  for (const [type, dict] of Object.entries(ENTITY_DICT)) {
    for (const [keyword, normalized] of Object.entries(dict)) {
      if (lower.includes(keyword)) {
        if (!entities.some(e => e.normalized === normalized && e.type === type)) {
          entities.push({
            name: keyword,
            type: type as EntityType,
            normalized,
            confidence: keyword.length > 4 ? 0.9 : 0.7,
          });
        }
      }
    }
  }
  return entities;
}

// ── Classify Category ────────────────────────────────────
export function classifyCategory(text: string): SignalCategory {
  const lower = text.toLowerCase();
  let bestCategory: SignalCategory = 'geopolitics';
  let bestScore = 0;
  for (const rule of CATEGORY_RULES) {
    const score = rule.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) { bestScore = score; bestCategory = rule.category; }
  }
  return bestCategory;
}

// ── Full Enrichment Pipeline ─────────────────────────────
export function enrichSignal(raw: RawSignal): EnrichedSignal {
  const text = `${raw.title} ${raw.content}`;
  const entities = extractEntities(text);
  const category = classifyCategory(text);
  const countries = entities
    .filter(e => e.type === 'country')
    .map(e => e.normalized as RelevantCountry)
    .filter((v, i, a) => a.indexOf(v) === i) as RelevantCountry[];
  const riskScore = computeRiskScore(text, entities, category);

  return {
    ...raw,
    entities,
    category,
    countries,
    riskScore,
    riskLevel: toRiskLevel(riskScore),
    embedding: computeEmbedding(text),
    gccRelevance: scoreGCCRelevance(text, countries),
  };
}
