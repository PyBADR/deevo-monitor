/**
 * DEEVO Sector Ontology — 14 GCC Sectors across 3 Tiers
 * Layer: Features
 * Defines sector models, KPIs, risk drivers, GDP roles, inter-sector dependencies
 * Used by: sectorImpactEngine, propagationGraph, gdpIntelligenceEngine, wideForecastEngine
 */

// ---------------------------------------------------------------------------
// Sector IDs — 3 Tiers
// ---------------------------------------------------------------------------

export type Tier1Sector = 'oil-gas' | 'insurance' | 'reinsurance' | 'banking' | 'supply-chain' | 'aviation';
export type Tier2Sector = 'ecommerce' | 'fintech' | 'infrastructure' | 'ai-economy';
export type Tier3Sector = 'food-water' | 'defense' | 'digital-economy' | 'space-satellite';
export type SectorId = Tier1Sector | Tier2Sector | Tier3Sector;

export type SectorTier = 1 | 2 | 3;

// ---------------------------------------------------------------------------
// GDP Components
// ---------------------------------------------------------------------------

export type GDPComponent = 'consumption' | 'investment' | 'government-spending' | 'net-exports';

export interface GDPImpact {
  component: GDPComponent;
  direction: 'positive' | 'negative' | 'neutral';
  magnitude: number; // 0-1
  description: string;
}

// ---------------------------------------------------------------------------
// Value Flow Types
// ---------------------------------------------------------------------------

export type FlowType = 'cost' | 'risk' | 'delay' | 'liquidity' | 'demand' | 'regulatory';

export interface ValueFlow {
  from: SectorId;
  to: SectorId;
  direction: 'unidirectional' | 'bidirectional';
  strength: number; // 0-1
  type: FlowType;
  label: string;
}

// ---------------------------------------------------------------------------
// Sector Model
// ---------------------------------------------------------------------------

export interface SectorKPI {
  id: string;
  label: string;
  unit: string;
  direction: 'higher-better' | 'lower-better' | 'neutral';
}

export interface RiskDriver {
  id: string;
  label: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  keywords: string[];
}

export interface SectorModel {
  id: SectorId;
  tier: SectorTier;
  label: string;
  labelAr: string;
  economicRole: string;
  gdpComponents: GDPComponent[];
  keyEntities: string[];
  kpis: SectorKPI[];
  riskDrivers: RiskDriver[];
  dependencies: SectorId[];
}

// ---------------------------------------------------------------------------
// Tier 1 Sectors — Core GCC Economic Pillars
// ---------------------------------------------------------------------------

const OIL_GAS: SectorModel = {
  id: 'oil-gas',
  tier: 1,
  label: 'Oil & Gas',
  labelAr: 'النفط والغاز',
  economicRole: 'Primary revenue source, 40-70% of GCC GDP, sovereign wealth anchor',
  gdpComponents: ['net-exports', 'government-spending', 'investment'],
  keyEntities: ['Saudi Aramco', 'ADNOC', 'KPC', 'QatarEnergy', 'PDO', 'BAPCO', 'OPEC', 'OPEC+'],
  kpis: [
    { id: 'brent-price', label: 'Brent Crude Price', unit: 'USD/bbl', direction: 'neutral' },
    { id: 'production-volume', label: 'Production Volume', unit: 'mbpd', direction: 'neutral' },
    { id: 'refining-margin', label: 'Refining Margin', unit: 'USD/bbl', direction: 'higher-better' },
    { id: 'spare-capacity', label: 'OPEC Spare Capacity', unit: 'mbpd', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'price-collapse', label: 'Oil Price Collapse', severity: 'critical', keywords: ['oil crash', 'price drop', 'oversupply'] },
    { id: 'hormuz-disruption', label: 'Strait of Hormuz Disruption', severity: 'critical', keywords: ['hormuz', 'strait blockade', 'tanker seizure'] },
    { id: 'energy-transition', label: 'Energy Transition Risk', severity: 'high', keywords: ['renewable', 'decarbonization', 'peak oil'] },
    { id: 'opec-discord', label: 'OPEC+ Disagreement', severity: 'high', keywords: ['quota dispute', 'opec split', 'production cut'] },
  ],
  dependencies: ['supply-chain', 'banking', 'insurance'],
};

const INSURANCE: SectorModel = {
  id: 'insurance',
  tier: 1,
  label: 'Insurance',
  labelAr: 'التأمين',
  economicRole: 'Risk transfer for mega-projects, energy, health; enabler of economic activity',
  gdpComponents: ['consumption', 'investment'],
  keyEntities: ['Tawuniya', 'ADNIC', 'Oman Insurance', 'Qatar Insurance', 'GIG', 'Solidarity', 'Wataniya'],
  kpis: [
    { id: 'gwp', label: 'Gross Written Premium', unit: 'USD M', direction: 'higher-better' },
    { id: 'combined-ratio', label: 'Combined Ratio', unit: '%', direction: 'lower-better' },
    { id: 'claims-ratio', label: 'Claims Ratio', unit: '%', direction: 'lower-better' },
    { id: 'penetration', label: 'Insurance Penetration', unit: '%', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'cat-event', label: 'Catastrophe Event', severity: 'critical', keywords: ['flood', 'earthquake', 'cyclone', 'sandstorm'] },
    { id: 'fraud-surge', label: 'Fraud Surge', severity: 'high', keywords: ['insurance fraud', 'staged claim', 'fraud ring'] },
    { id: 'regulatory-change', label: 'Regulatory Change', severity: 'medium', keywords: ['CCHI', 'mandatory cover', 'solvency'] },
    { id: 'cyber-exposure', label: 'Cyber Exposure', severity: 'high', keywords: ['data breach', 'ransomware', 'cyber claim'] },
  ],
  dependencies: ['reinsurance', 'banking', 'oil-gas'],
};

const REINSURANCE: SectorModel = {
  id: 'reinsurance',
  tier: 1,
  label: 'Reinsurance',
  labelAr: 'إعادة التأمين',
  economicRole: 'Capital backstop for insurance sector; risk aggregation and distribution',
  gdpComponents: ['investment', 'net-exports'],
  keyEntities: ['Swiss Re', 'Munich Re', 'Hannover Re', 'SCOR', 'Lloyd\'s', 'DIFC Reinsurers', 'Saudi Re'],
  kpis: [
    { id: 'renewal-rate', label: 'Renewal Rate Change', unit: '%', direction: 'neutral' },
    { id: 'capacity', label: 'Available Capacity', unit: 'USD B', direction: 'higher-better' },
    { id: 'nat-cat-losses', label: 'Nat Cat Losses YTD', unit: 'USD B', direction: 'lower-better' },
  ],
  riskDrivers: [
    { id: 'capacity-crunch', label: 'Capacity Withdrawal', severity: 'critical', keywords: ['hard market', 'capacity pull', 'rate hardening'] },
    { id: 'accumulation', label: 'Risk Accumulation', severity: 'high', keywords: ['concentration risk', 'PML breach', 'aggregation'] },
    { id: 'retro-failure', label: 'Retrocession Failure', severity: 'high', keywords: ['retro market', 'ILS trapped', 'collateral'] },
  ],
  dependencies: ['insurance', 'banking'],
};

const BANKING: SectorModel = {
  id: 'banking',
  tier: 1,
  label: 'Banking',
  labelAr: 'الخدمات المصرفية',
  economicRole: 'Liquidity backbone, credit allocation, sovereign wealth management',
  gdpComponents: ['investment', 'consumption', 'government-spending'],
  keyEntities: ['SNB', 'Al Rajhi', 'FAB', 'Emirates NBD', 'NBK', 'QNB', 'Bank Muscat', 'SAMA', 'CBUAE'],
  kpis: [
    { id: 'credit-growth', label: 'Credit Growth', unit: '%', direction: 'higher-better' },
    { id: 'npl-ratio', label: 'NPL Ratio', unit: '%', direction: 'lower-better' },
    { id: 'liquidity-ratio', label: 'Liquidity Coverage Ratio', unit: '%', direction: 'higher-better' },
    { id: 'nim', label: 'Net Interest Margin', unit: '%', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'liquidity-squeeze', label: 'Liquidity Squeeze', severity: 'critical', keywords: ['liquidity crunch', 'interbank rate', 'deposit flight'] },
    { id: 'credit-default', label: 'Credit Default Wave', severity: 'critical', keywords: ['NPL spike', 'loan default', 'credit loss'] },
    { id: 'rate-shock', label: 'Interest Rate Shock', severity: 'high', keywords: ['rate hike', 'fed funds', 'monetary tightening'] },
    { id: 'sanctions-exposure', label: 'Sanctions Exposure', severity: 'high', keywords: ['sanctions', 'OFAC', 'compliance breach'] },
  ],
  dependencies: ['oil-gas', 'insurance', 'fintech', 'infrastructure'],
};

const SUPPLY_CHAIN: SectorModel = {
  id: 'supply-chain',
  tier: 1,
  label: 'Supply Chain',
  labelAr: 'سلاسل الإمداد',
  economicRole: 'Trade corridor management, port operations, logistics hub for Asia-Europe trade',
  gdpComponents: ['net-exports', 'consumption', 'investment'],
  keyEntities: ['DP World', 'Jebel Ali', 'King Abdullah Port', 'Hamad Port', 'Sohar Port', 'Etihad Rail', 'Saudi Railways'],
  kpis: [
    { id: 'container-throughput', label: 'Container Throughput', unit: 'TEU M', direction: 'higher-better' },
    { id: 'freight-index', label: 'Freight Rate Index', unit: 'Index', direction: 'lower-better' },
    { id: 'port-dwell', label: 'Port Dwell Time', unit: 'days', direction: 'lower-better' },
  ],
  riskDrivers: [
    { id: 'red-sea-disruption', label: 'Red Sea Disruption', severity: 'critical', keywords: ['houthi', 'red sea', 'bab al-mandab', 'suez'] },
    { id: 'port-congestion', label: 'Port Congestion', severity: 'high', keywords: ['congestion', 'vessel queue', 'berth shortage'] },
    { id: 'trade-war', label: 'Trade War Impact', severity: 'high', keywords: ['tariff', 'trade war', 'sanctions', 'embargo'] },
  ],
  dependencies: ['oil-gas', 'aviation', 'insurance', 'ecommerce'],
};

const AVIATION: SectorModel = {
  id: 'aviation',
  tier: 1,
  label: 'Aviation',
  labelAr: 'الطيران',
  economicRole: 'Tourism enabler, cargo logistics, hub connectivity for GCC economies',
  gdpComponents: ['net-exports', 'consumption', 'investment'],
  keyEntities: ['Emirates', 'Qatar Airways', 'Saudia', 'Etihad', 'flyadeal', 'Air Arabia', 'DXB', 'DOH', 'JED', 'RUH'],
  kpis: [
    { id: 'pax-volume', label: 'Passenger Volume', unit: 'M pax', direction: 'higher-better' },
    { id: 'load-factor', label: 'Load Factor', unit: '%', direction: 'higher-better' },
    { id: 'cargo-tonnage', label: 'Cargo Tonnage', unit: 'K tons', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'fuel-spike', label: 'Jet Fuel Price Spike', severity: 'high', keywords: ['jet fuel', 'aviation fuel', 'fuel surcharge'] },
    { id: 'airspace-closure', label: 'Airspace Closure', severity: 'critical', keywords: ['airspace closed', 'NOTAM', 'overflight ban'] },
    { id: 'tourism-shock', label: 'Tourism Demand Shock', severity: 'medium', keywords: ['travel ban', 'visa restriction', 'pandemic'] },
  ],
  dependencies: ['oil-gas', 'supply-chain', 'insurance'],
};

// ---------------------------------------------------------------------------
// Tier 2 Sectors — Growth & Diversification
// ---------------------------------------------------------------------------

const ECOMMERCE: SectorModel = {
  id: 'ecommerce',
  tier: 2,
  label: 'E-Commerce',
  labelAr: 'التجارة الإلكترونية',
  economicRole: 'Consumer economy digitization, Vision 2030 diversification pillar',
  gdpComponents: ['consumption'],
  keyEntities: ['Noon', 'Amazon.sa', 'Namshi', 'Talabat', 'Careem', 'STC Pay', 'Jarir'],
  kpis: [
    { id: 'gmv', label: 'Gross Merchandise Value', unit: 'USD B', direction: 'higher-better' },
    { id: 'digital-payments', label: 'Digital Payment Share', unit: '%', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'consumer-sentiment', label: 'Consumer Sentiment Drop', severity: 'medium', keywords: ['spending cut', 'consumer confidence', 'retail slump'] },
    { id: 'logistics-failure', label: 'Last-Mile Failure', severity: 'medium', keywords: ['delivery delay', 'fulfillment', 'warehouse'] },
  ],
  dependencies: ['supply-chain', 'fintech', 'banking'],
};

const FINTECH: SectorModel = {
  id: 'fintech',
  tier: 2,
  label: 'Fintech',
  labelAr: 'التقنية المالية',
  economicRole: 'Financial inclusion, payment innovation, regulatory sandbox economies',
  gdpComponents: ['consumption', 'investment'],
  keyEntities: ['STC Pay', 'Tabby', 'Tamara', 'PayTabs', 'Lean', 'Wahed', 'Rain', 'SAMA Sandbox', 'DFSA'],
  kpis: [
    { id: 'tpv', label: 'Total Payment Volume', unit: 'USD B', direction: 'higher-better' },
    { id: 'funded-startups', label: 'Funded Startups', unit: 'count', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'regulatory-clamp', label: 'Regulatory Clampdown', severity: 'high', keywords: ['license revoked', 'sandbox exit', 'compliance'] },
    { id: 'funding-winter', label: 'Funding Winter', severity: 'medium', keywords: ['VC pullback', 'down round', 'runway'] },
  ],
  dependencies: ['banking', 'ecommerce'],
};

const INFRASTRUCTURE: SectorModel = {
  id: 'infrastructure',
  tier: 2,
  label: 'Infrastructure',
  labelAr: 'البنية التحتية',
  economicRole: 'Mega-project execution, Vision 2030/2035 delivery, construction multiplier',
  gdpComponents: ['investment', 'government-spending'],
  keyEntities: ['NEOM', 'The Line', 'Qiddiya', 'Red Sea Global', 'Diriyah Gate', 'Lusail', 'Masdar City', 'Etihad Rail'],
  kpis: [
    { id: 'project-pipeline', label: 'Active Project Value', unit: 'USD B', direction: 'higher-better' },
    { id: 'completion-rate', label: 'Completion Rate', unit: '%', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'cost-overrun', label: 'Cost Overrun', severity: 'high', keywords: ['budget overrun', 'cost escalation', 'delay'] },
    { id: 'labor-shortage', label: 'Labor Shortage', severity: 'medium', keywords: ['worker shortage', 'visa restriction', 'labor'] },
    { id: 'material-inflation', label: 'Material Price Inflation', severity: 'high', keywords: ['steel price', 'cement cost', 'material shortage'] },
  ],
  dependencies: ['banking', 'supply-chain', 'oil-gas'],
};

const AI_ECONOMY: SectorModel = {
  id: 'ai-economy',
  tier: 2,
  label: 'AI Economy',
  labelAr: 'اقتصاد الذكاء الاصطناعي',
  economicRole: 'Productivity multiplier, sovereign AI initiatives, data center investment',
  gdpComponents: ['investment', 'government-spending'],
  keyEntities: ['SDAIA', 'G42', 'Technology Innovation Institute', 'Presight AI', 'Mozn', 'Lean Technologies'],
  kpis: [
    { id: 'ai-investment', label: 'AI Investment', unit: 'USD B', direction: 'higher-better' },
    { id: 'dc-capacity', label: 'Data Center Capacity', unit: 'MW', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'talent-gap', label: 'AI Talent Gap', severity: 'medium', keywords: ['talent shortage', 'brain drain', 'skills gap'] },
    { id: 'sovereign-data', label: 'Data Sovereignty Risk', severity: 'high', keywords: ['data localization', 'PDPL', 'cross-border data'] },
    { id: 'chip-restriction', label: 'Chip Export Restriction', severity: 'high', keywords: ['GPU ban', 'chip export', 'NVIDIA restriction'] },
  ],
  dependencies: ['banking', 'fintech', 'infrastructure', 'digital-economy'],
};

// ---------------------------------------------------------------------------
// Tier 3 Sectors — Strategic & Emerging
// ---------------------------------------------------------------------------

const FOOD_WATER: SectorModel = {
  id: 'food-water',
  tier: 3,
  label: 'Food & Water Security',
  labelAr: 'الأمن الغذائي والمائي',
  economicRole: 'National security essential, desalination dependency, food import reliance',
  gdpComponents: ['consumption', 'government-spending'],
  keyEntities: ['SALIC', 'Almarai', 'ACWA Power', 'SWCC', 'Hassad Food', 'Al Dahra', 'Agthia'],
  kpis: [
    { id: 'food-import-ratio', label: 'Food Import Dependency', unit: '%', direction: 'lower-better' },
    { id: 'desal-capacity', label: 'Desalination Capacity', unit: 'M m³/day', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'supply-disruption', label: 'Food Supply Disruption', severity: 'critical', keywords: ['food shortage', 'wheat price', 'export ban'] },
    { id: 'water-stress', label: 'Water Stress', severity: 'critical', keywords: ['aquifer depletion', 'desalination failure', 'water scarcity'] },
  ],
  dependencies: ['supply-chain', 'infrastructure', 'oil-gas'],
};

const DEFENSE: SectorModel = {
  id: 'defense',
  tier: 3,
  label: 'Defense',
  labelAr: 'الدفاع',
  economicRole: 'Sovereign security, defense manufacturing localization, arms procurement',
  gdpComponents: ['government-spending', 'investment'],
  keyEntities: ['SAMI', 'EDGE Group', 'Barzan Holdings', 'GAMI', 'Tawazun'],
  kpis: [
    { id: 'defense-spend', label: 'Defense Spending', unit: 'USD B', direction: 'neutral' },
    { id: 'localization-pct', label: 'Local Content %', unit: '%', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'geopolitical-escalation', label: 'Regional Escalation', severity: 'critical', keywords: ['military escalation', 'missile strike', 'border conflict'] },
    { id: 'arms-embargo', label: 'Arms Supply Disruption', severity: 'high', keywords: ['arms embargo', 'sanctions', 'export control'] },
  ],
  dependencies: ['oil-gas', 'infrastructure', 'ai-economy'],
};

const DIGITAL_ECONOMY: SectorModel = {
  id: 'digital-economy',
  tier: 3,
  label: 'Digital Economy',
  labelAr: 'الاقتصاد الرقمي',
  economicRole: 'Diversification accelerator, digital transformation, smart city enablement',
  gdpComponents: ['consumption', 'investment'],
  keyEntities: ['stc', 'e&', 'Ooredoo', 'Zain', 'du', 'Elm', 'SITE'],
  kpis: [
    { id: 'digital-gdp-share', label: 'Digital GDP Share', unit: '%', direction: 'higher-better' },
    { id: 'internet-penetration', label: 'Internet Penetration', unit: '%', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'cyber-attack', label: 'Major Cyber Attack', severity: 'critical', keywords: ['cyber attack', 'DDoS', 'infrastructure hack'] },
    { id: 'digital-divide', label: 'Digital Divide', severity: 'medium', keywords: ['connectivity gap', 'rural access', 'digital literacy'] },
  ],
  dependencies: ['ai-economy', 'fintech', 'infrastructure'],
};

const SPACE_SATELLITE: SectorModel = {
  id: 'space-satellite',
  tier: 3,
  label: 'Space & Satellite',
  labelAr: 'الفضاء والأقمار الصناعية',
  economicRole: 'Sovereign capability, Earth observation, communications infrastructure',
  gdpComponents: ['government-spending', 'investment'],
  keyEntities: ['Saudi Space Agency', 'MBRSC', 'Yahsat', 'Badr', 'KACST', 'Thuraya'],
  kpis: [
    { id: 'satellites-active', label: 'Active Satellites', unit: 'count', direction: 'higher-better' },
    { id: 'space-investment', label: 'Space Investment', unit: 'USD M', direction: 'higher-better' },
  ],
  riskDrivers: [
    { id: 'launch-failure', label: 'Launch/Satellite Failure', severity: 'high', keywords: ['launch failure', 'satellite malfunction', 'orbit decay'] },
    { id: 'debris-risk', label: 'Space Debris Risk', severity: 'medium', keywords: ['space debris', 'collision risk', 'kessler'] },
  ],
  dependencies: ['defense', 'ai-economy', 'digital-economy'],
};

// ---------------------------------------------------------------------------
// Sector Registry
// ---------------------------------------------------------------------------

export const SECTOR_REGISTRY: ReadonlyMap<SectorId, SectorModel> = new Map([
  ['oil-gas', OIL_GAS],
  ['insurance', INSURANCE],
  ['reinsurance', REINSURANCE],
  ['banking', BANKING],
  ['supply-chain', SUPPLY_CHAIN],
  ['aviation', AVIATION],
  ['ecommerce', ECOMMERCE],
  ['fintech', FINTECH],
  ['infrastructure', INFRASTRUCTURE],
  ['ai-economy', AI_ECONOMY],
  ['food-water', FOOD_WATER],
  ['defense', DEFENSE],
  ['digital-economy', DIGITAL_ECONOMY],
  ['space-satellite', SPACE_SATELLITE],
]);

export const ALL_SECTOR_IDS: readonly SectorId[] = [...SECTOR_REGISTRY.keys()];

export function getSectorsByTier(tier: SectorTier): SectorModel[] {
  return [...SECTOR_REGISTRY.values()].filter((s) => s.tier === tier);
}

export function getSector(id: SectorId): SectorModel | undefined {
  return SECTOR_REGISTRY.get(id);
}

// ---------------------------------------------------------------------------
// Cross-Sector Value Flows — Directed Graph
// ---------------------------------------------------------------------------

export const VALUE_FLOWS: readonly ValueFlow[] = [
  // Oil → Shipping → Insurance → Reinsurance → Banking chain
  { from: 'oil-gas', to: 'supply-chain', direction: 'unidirectional', strength: 0.9, type: 'cost', label: 'Energy cost drives shipping rates' },
  { from: 'supply-chain', to: 'insurance', direction: 'unidirectional', strength: 0.8, type: 'risk', label: 'Trade volume drives marine premium' },
  { from: 'insurance', to: 'reinsurance', direction: 'unidirectional', strength: 0.9, type: 'risk', label: 'Risk transfer to reinsurance' },
  { from: 'reinsurance', to: 'banking', direction: 'unidirectional', strength: 0.7, type: 'liquidity', label: 'Capital requirements flow to banking' },
  { from: 'banking', to: 'ecommerce', direction: 'unidirectional', strength: 0.6, type: 'liquidity', label: 'Credit fuels consumer spending' },

  // Oil → Aviation → Tourism chain
  { from: 'oil-gas', to: 'aviation', direction: 'unidirectional', strength: 0.85, type: 'cost', label: 'Fuel cost impacts aviation' },
  { from: 'aviation', to: 'ecommerce', direction: 'unidirectional', strength: 0.5, type: 'demand', label: 'Tourism drives retail demand' },

  // Infrastructure mega-project chain
  { from: 'banking', to: 'infrastructure', direction: 'unidirectional', strength: 0.8, type: 'liquidity', label: 'Project financing' },
  { from: 'infrastructure', to: 'insurance', direction: 'unidirectional', strength: 0.7, type: 'risk', label: 'Construction risk needs coverage' },
  { from: 'infrastructure', to: 'supply-chain', direction: 'unidirectional', strength: 0.7, type: 'demand', label: 'Material import demand' },

  // Fintech ↔ Banking bidirectional
  { from: 'fintech', to: 'banking', direction: 'bidirectional', strength: 0.7, type: 'liquidity', label: 'Fintech disrupts and depends on banking' },

  // Digital economy chains
  { from: 'ai-economy', to: 'digital-economy', direction: 'unidirectional', strength: 0.8, type: 'demand', label: 'AI capabilities power digital services' },
  { from: 'digital-economy', to: 'ecommerce', direction: 'unidirectional', strength: 0.7, type: 'demand', label: 'Digital infrastructure enables e-commerce' },
  { from: 'digital-economy', to: 'fintech', direction: 'unidirectional', strength: 0.6, type: 'demand', label: 'Digital platforms need payment rails' },

  // Defense → AI → Space chain
  { from: 'defense', to: 'ai-economy', direction: 'unidirectional', strength: 0.6, type: 'demand', label: 'Defense investment drives AI R&D' },
  { from: 'defense', to: 'space-satellite', direction: 'unidirectional', strength: 0.7, type: 'demand', label: 'Military satellite needs' },

  // Food security chains
  { from: 'supply-chain', to: 'food-water', direction: 'unidirectional', strength: 0.85, type: 'delay', label: 'Shipping disruption hits food imports' },
  { from: 'oil-gas', to: 'food-water', direction: 'unidirectional', strength: 0.6, type: 'cost', label: 'Energy costs affect desalination' },

  // Regulatory / risk feedback loops
  { from: 'oil-gas', to: 'banking', direction: 'unidirectional', strength: 0.8, type: 'liquidity', label: 'Oil revenue funds bank deposits' },
  { from: 'banking', to: 'fintech', direction: 'unidirectional', strength: 0.5, type: 'regulatory', label: 'Banking regulation shapes fintech' },
  { from: 'space-satellite', to: 'digital-economy', direction: 'unidirectional', strength: 0.5, type: 'demand', label: 'Satellite connectivity enables digital' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getFlowsFrom(sector: SectorId): ValueFlow[] {
  return VALUE_FLOWS.filter((f) => f.from === sector || (f.direction === 'bidirectional' && f.to === sector));
}

export function getFlowsTo(sector: SectorId): ValueFlow[] {
  return VALUE_FLOWS.filter((f) => f.to === sector || (f.direction === 'bidirectional' && f.from === sector));
}

export function getConnectedSectors(sector: SectorId): SectorId[] {
  const connected = new Set<SectorId>();
  for (const f of VALUE_FLOWS) {
    if (f.from === sector) connected.add(f.to);
    if (f.to === sector) connected.add(f.from);
  }
  return [...connected];
}
