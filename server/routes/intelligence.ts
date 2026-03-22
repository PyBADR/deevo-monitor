/**
 * Intelligence Routes — Strategic posture & country intelligence API.
 * Provides data for StrategicPosture and CountryIntelligence panels.
 */
import { Router, type Request, type Response } from 'express';

const intelligenceRouter = Router();

// ── Types ────────────────────────────────────────────────

type PostureLevel = 'CRIT' | 'HIGH' | 'ELEV' | 'MON' | 'LOW';
type ImpactSeverity = 'critical' | 'high' | 'medium' | 'low';

interface TheaterAssessment {
  id: string;
  theater: string;
  region: string;
  postureLevel: PostureLevel;
  trend: 'escalating' | 'stable' | 'de-escalating';
  summary: string;
  keyFactors: string[];
  lastUpdated: string;
}

interface ForecastItem {
  id: string;
  title: string;
  probability: number;
  impact: ImpactSeverity;
  timeframe: string;
  category: string;
  description: string;
}

interface CountrySignal {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'flat';
  severity: 'critical' | 'high' | 'elevated' | 'normal';
}

interface CountryIntel {
  code: string;
  name: string;
  nameAr: string;
  overallScore: number;
  riskLevel: 'low' | 'moderate' | 'elevated' | 'high' | 'critical';
  signals: CountrySignal[];
}

// ── Data ─────────────────────────────────────────────────

const THEATERS: TheaterAssessment[] = [
  {
    id: 'theater-iran', theater: 'Iran / Proxy Network', region: 'MENA',
    postureLevel: 'HIGH', trend: 'escalating',
    summary: 'Elevated proxy activity across Gulf maritime corridors. Houthi anti-shipping operations persist in Red Sea AOR.',
    keyFactors: ['Houthi maritime attacks', 'IRGC naval provocations', 'Nuclear program acceleration', 'Proxy coordination'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'theater-gulf', theater: 'Gulf Security', region: 'GCC',
    postureLevel: 'ELEV', trend: 'stable',
    summary: 'GCC internal security posture nominal. Cross-border cooperation on counter-terrorism maintaining effectiveness.',
    keyFactors: ['Maritime domain awareness', 'Counter-drone investment', 'Intelligence sharing', 'Border security upgrades'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'theater-levant', theater: 'Levant / Syria', region: 'MENA',
    postureLevel: 'HIGH', trend: 'escalating',
    summary: 'Syria conflict dynamics shifting. Turkish operations, Israeli strikes on Iranian assets, and humanitarian crisis persist.',
    keyFactors: ['Cross-border operations', 'Refugee flows', 'Iranian entrenchment', 'ISIS remnants'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'theater-nafr', theater: 'North Africa', region: 'MENA',
    postureLevel: 'MON', trend: 'stable',
    summary: 'Libya ceasefire holding with intermittent violations. Sahel instability continues to generate regional spillover.',
    keyFactors: ['Libya political process', 'Sahel militant expansion', 'Migration pressure', 'Energy infrastructure'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'theater-cyber', theater: 'Cyber Domain', region: 'GLOBAL',
    postureLevel: 'ELEV', trend: 'escalating',
    summary: 'GCC financial sector facing increased APT activity. State-sponsored campaigns targeting insurance & banking infrastructure.',
    keyFactors: ['APT campaigns targeting GCC banks', 'Ransomware surge', 'Supply chain attacks', 'Critical infrastructure probes'],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'theater-econ', theater: 'Economic Warfare', region: 'GLOBAL',
    postureLevel: 'MON', trend: 'de-escalating',
    summary: 'Oil price stabilization supporting GCC fiscal positions. Sanctions regime adjustments impacting reinsurance flows.',
    keyFactors: ['OPEC+ dynamics', 'Sanctions compliance', 'De-dollarization trends', 'Trade route disruptions'],
    lastUpdated: new Date().toISOString(),
  },
];

const FORECASTS: ForecastItem[] = [
  { id: 'fc-1', title: 'Red Sea shipping corridor partial closure', probability: 0.72, impact: 'high', timeframe: '30d', category: 'maritime', description: 'Houthi escalation may force major rerouting of GCC-bound cargo.' },
  { id: 'fc-2', title: 'GCC cyber insurance mandatory requirement', probability: 0.65, impact: 'medium', timeframe: '90d', category: 'regulatory', description: 'SAMA and CBUAE preparing mandatory cyber insurance frameworks.' },
  { id: 'fc-3', title: 'Iran nuclear deal collapse triggers premium surge', probability: 0.41, impact: 'critical', timeframe: '180d', category: 'geopolitical', description: 'Political risk insurance premiums could spike 40-60% in Gulf markets.' },
  { id: 'fc-4', title: 'Takaful market overtakes conventional in UAE', probability: 0.58, impact: 'medium', timeframe: '365d', category: 'market', description: 'Islamic insurance growth trajectory suggests crossover within 12 months.' },
  { id: 'fc-5', title: 'Major GCC insurer acquisition by global player', probability: 0.35, impact: 'high', timeframe: '180d', category: 'corporate', description: 'Multiple global carriers reportedly evaluating GCC market entry via M&A.' },
  { id: 'fc-6', title: 'PDPL enforcement action against insurer', probability: 0.55, impact: 'high', timeframe: '60d', category: 'compliance', description: 'Saudi PDPL enforcement maturing; first major insurance sector action expected.' },
  { id: 'fc-7', title: 'Climate event triggering CAT bond activation', probability: 0.28, impact: 'critical', timeframe: '365d', category: 'environmental', description: 'Gulf flooding risk models being recalibrated after recent extreme events.' },
];

const COUNTRY_INTEL: CountryIntel[] = [
  {
    code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', overallScore: 76,
    riskLevel: 'moderate',
    signals: [
      { category: 'political', score: 82, trend: 'up', severity: 'normal' },
      { category: 'economic', score: 78, trend: 'up', severity: 'normal' },
      { category: 'military', score: 68, trend: 'flat', severity: 'elevated' },
      { category: 'cyber', score: 65, trend: 'down', severity: 'elevated' },
      { category: 'social', score: 74, trend: 'up', severity: 'normal' },
      { category: 'environmental', score: 58, trend: 'down', severity: 'high' },
      { category: 'regulatory', score: 85, trend: 'up', severity: 'normal' },
      { category: 'fraud', score: 62, trend: 'down', severity: 'elevated' },
      { category: 'infrastructure', score: 88, trend: 'up', severity: 'normal' },
      { category: 'health', score: 79, trend: 'up', severity: 'normal' },
      { category: 'energy', score: 91, trend: 'flat', severity: 'normal' },
      { category: 'trade', score: 80, trend: 'up', severity: 'normal' },
    ],
  },
  {
    code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', overallScore: 82,
    riskLevel: 'low',
    signals: [
      { category: 'political', score: 88, trend: 'flat', severity: 'normal' },
      { category: 'economic', score: 85, trend: 'up', severity: 'normal' },
      { category: 'military', score: 72, trend: 'flat', severity: 'normal' },
      { category: 'cyber', score: 70, trend: 'down', severity: 'elevated' },
      { category: 'social', score: 82, trend: 'up', severity: 'normal' },
      { category: 'environmental', score: 55, trend: 'down', severity: 'high' },
      { category: 'regulatory', score: 90, trend: 'up', severity: 'normal' },
      { category: 'fraud', score: 68, trend: 'flat', severity: 'elevated' },
      { category: 'infrastructure', score: 92, trend: 'up', severity: 'normal' },
      { category: 'health', score: 85, trend: 'flat', severity: 'normal' },
      { category: 'energy', score: 88, trend: 'flat', severity: 'normal' },
      { category: 'trade', score: 89, trend: 'up', severity: 'normal' },
    ],
  },
  {
    code: 'KW', name: 'Kuwait', nameAr: 'الكويت', overallScore: 71,
    riskLevel: 'moderate',
    signals: [
      { category: 'political', score: 65, trend: 'down', severity: 'elevated' },
      { category: 'economic', score: 72, trend: 'flat', severity: 'normal' },
      { category: 'military', score: 70, trend: 'flat', severity: 'normal' },
      { category: 'cyber', score: 60, trend: 'down', severity: 'elevated' },
      { category: 'social', score: 68, trend: 'flat', severity: 'elevated' },
      { category: 'environmental', score: 52, trend: 'down', severity: 'high' },
      { category: 'regulatory', score: 75, trend: 'up', severity: 'normal' },
      { category: 'fraud', score: 58, trend: 'down', severity: 'high' },
      { category: 'infrastructure', score: 78, trend: 'up', severity: 'normal' },
      { category: 'health', score: 76, trend: 'flat', severity: 'normal' },
      { category: 'energy', score: 85, trend: 'flat', severity: 'normal' },
      { category: 'trade', score: 74, trend: 'flat', severity: 'normal' },
    ],
  },
  {
    code: 'QA', name: 'Qatar', nameAr: 'قطر', overallScore: 79,
    riskLevel: 'low',
    signals: [
      { category: 'political', score: 80, trend: 'flat', severity: 'normal' },
      { category: 'economic', score: 82, trend: 'up', severity: 'normal' },
      { category: 'military', score: 74, trend: 'flat', severity: 'normal' },
      { category: 'cyber', score: 68, trend: 'down', severity: 'elevated' },
      { category: 'social', score: 78, trend: 'up', severity: 'normal' },
      { category: 'environmental', score: 56, trend: 'down', severity: 'high' },
      { category: 'regulatory', score: 82, trend: 'up', severity: 'normal' },
      { category: 'fraud', score: 65, trend: 'flat', severity: 'elevated' },
      { category: 'infrastructure', score: 88, trend: 'up', severity: 'normal' },
      { category: 'health', score: 81, trend: 'flat', severity: 'normal' },
      { category: 'energy', score: 92, trend: 'up', severity: 'normal' },
      { category: 'trade', score: 83, trend: 'up', severity: 'normal' },
    ],
  },
  {
    code: 'BH', name: 'Bahrain', nameAr: 'البحرين', overallScore: 68,
    riskLevel: 'moderate',
    signals: [
      { category: 'political', score: 62, trend: 'flat', severity: 'elevated' },
      { category: 'economic', score: 65, trend: 'up', severity: 'elevated' },
      { category: 'military', score: 70, trend: 'flat', severity: 'normal' },
      { category: 'cyber', score: 58, trend: 'down', severity: 'high' },
      { category: 'social', score: 60, trend: 'flat', severity: 'elevated' },
      { category: 'environmental', score: 50, trend: 'down', severity: 'high' },
      { category: 'regulatory', score: 78, trend: 'up', severity: 'normal' },
      { category: 'fraud', score: 55, trend: 'down', severity: 'high' },
      { category: 'infrastructure', score: 75, trend: 'up', severity: 'normal' },
      { category: 'health', score: 74, trend: 'flat', severity: 'normal' },
      { category: 'energy', score: 72, trend: 'flat', severity: 'normal' },
      { category: 'trade', score: 76, trend: 'up', severity: 'normal' },
    ],
  },
  {
    code: 'OM', name: 'Oman', nameAr: 'عمان', overallScore: 72,
    riskLevel: 'moderate',
    signals: [
      { category: 'political', score: 78, trend: 'flat', severity: 'normal' },
      { category: 'economic', score: 68, trend: 'up', severity: 'elevated' },
      { category: 'military', score: 72, trend: 'flat', severity: 'normal' },
      { category: 'cyber', score: 55, trend: 'down', severity: 'high' },
      { category: 'social', score: 75, trend: 'flat', severity: 'normal' },
      { category: 'environmental', score: 54, trend: 'down', severity: 'high' },
      { category: 'regulatory', score: 72, trend: 'up', severity: 'normal' },
      { category: 'fraud', score: 60, trend: 'flat', severity: 'elevated' },
      { category: 'infrastructure', score: 76, trend: 'up', severity: 'normal' },
      { category: 'health', score: 73, trend: 'flat', severity: 'normal' },
      { category: 'energy', score: 80, trend: 'up', severity: 'normal' },
      { category: 'trade', score: 74, trend: 'flat', severity: 'normal' },
    ],
  },
];

// ── Routes ───────────────────────────────────────────────

intelligenceRouter.get('/posture', (_req: Request, res: Response) => {
  res.json({
    data: THEATERS,
    meta: {
      timestamp: new Date().toISOString(),
      version: '4.0.0',
      source: 'deevo-intelligence-engine',
      theaterCount: THEATERS.length,
    },
  });
});

intelligenceRouter.get('/forecasts', (_req: Request, res: Response) => {
  const category = (_req.query.category as string) || 'all';
  let forecasts = [...FORECASTS];
  if (category !== 'all') {
    forecasts = forecasts.filter((f) => f.category === category);
  }
  res.json({
    data: forecasts,
    meta: {
      timestamp: new Date().toISOString(),
      version: '4.0.0',
      source: 'deevo-forecast-engine',
    },
  });
});

intelligenceRouter.get('/countries', (_req: Request, res: Response) => {
  const code = (_req.query.code as string) || 'all';
  let countries = [...COUNTRY_INTEL];
  if (code !== 'all') {
    countries = countries.filter((c) => c.code === code.toUpperCase());
  }
  res.json({
    data: countries,
    meta: {
      timestamp: new Date().toISOString(),
      version: '4.0.0',
      source: 'deevo-country-intelligence',
      countryCount: countries.length,
    },
  });
});

intelligenceRouter.get('/countries/:code', (req: Request, res: Response) => {
  const country = COUNTRY_INTEL.find((c) => c.code === req.params.code.toUpperCase());
  if (!country) {
    res.status(404).json({ error: 'Country not found', code: req.params.code });
    return;
  }
  res.json({
    data: country,
    meta: {
      timestamp: new Date().toISOString(),
      version: '4.0.0',
      source: 'deevo-country-intelligence',
    },
  });
});

export { intelligenceRouter };
