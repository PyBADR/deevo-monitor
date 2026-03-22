/**
 * News Routes — Live news aggregation API.
 * Provides multi-source news data for the Live News panel.
 */
import { Router, type Request, type Response } from 'express';

const newsRouter = Router();

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceId: string;
  url: string;
  timestamp: string;
  category: string;
  region: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  imageUrl?: string;
}

// Simulated news sources
const NEWS_SOURCES = [
  'Bloomberg', 'Reuters', 'Al Jazeera', 'CNN', 'BBC',
  'Sky News', 'CNBC', 'France 24', 'DW', 'Al Arabiya',
  'Euronews', 'Financial Times',
];

function generateMockNews(count: number = 20): NewsItem[] {
  const headlines = [
    'GCC Insurance Market Posts Record Growth in Q4',
    'Saudi Arabia Launches New InsurTech Sandbox',
    'Red Sea Shipping Disruptions Impact Marine Premiums',
    'UAE Insurance Authority Issues New Digital Framework',
    'Kuwait Insurance Sector Reports Rising Fraud Cases',
    'Qatar Re-Insurance Capacity Expands 15% YoY',
    'Bahrain FinTech Hub Attracts $2B Insurance Investment',
    'OPEC+ Decision Impacts Energy Insurance Pricing',
    'Cyber Insurance Demand Surges Across GCC',
    'Oman Implements IFRS 17 Transition Framework',
    'Regional Tensions Push Political Risk Premiums Higher',
    'AI-Driven Claims Processing Reduces Cycle Time 40%',
    'GCC Motor Insurance Reform Enters Implementation Phase',
    'Reinsurance Rates Harden on CAT Exposure Reassessment',
    'Dubai Financial Market Insurance Index Gains 3.2%',
    'Iranian Proxy Threats Elevate Gulf Maritime Risk',
    'Saudi Vision 2030 Drives Health Insurance Expansion',
    'Climate Risk Models Updated for GCC Flood Exposure',
    'Cross-Border Insurance Fraud Ring Disrupted',
    'Takaful Market Growth Outpaces Conventional Insurance',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `news-${Date.now()}-${i}`,
    title: headlines[i % headlines.length],
    summary: `Detailed analysis and market intelligence for the GCC insurance sector. This developing story covers key risk factors and market dynamics across the Gulf Cooperation Council member states.`,
    source: NEWS_SOURCES[i % NEWS_SOURCES.length],
    sourceId: NEWS_SOURCES[i % NEWS_SOURCES.length].toLowerCase().replace(/\s+/g, '_'),
    url: '#',
    timestamp: new Date(Date.now() - i * 3_600_000 * Math.random()).toISOString(),
    category: ['insurance', 'geopolitical', 'financial', 'regulatory', 'tech'][i % 5],
    region: ['gcc', 'global', 'sa', 'ae', 'kw', 'qa'][i % 6],
    severity: (['info', 'low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 5)],
  }));
}

newsRouter.get('/', (_req: Request, res: Response) => {
  const source = (_req.query.source as string) || 'all';
  const region = (_req.query.region as string) || 'all';
  const limit = parseInt((_req.query.limit as string) || '20', 10);

  let news = generateMockNews(40);

  if (source !== 'all') {
    news = news.filter((n) =>
      n.sourceId.includes(source.toLowerCase())
    );
  }
  if (region !== 'all') {
    news = news.filter((n) => n.region === region);
  }

  res.json({
    data: news.slice(0, limit),
    meta: {
      timestamp: new Date().toISOString(),
      version: '4.0.0',
      source: 'deevo-news-aggregator',
      totalSources: NEWS_SOURCES.length,
    },
  });
});

newsRouter.get('/sources', (_req: Request, res: Response) => {
  res.json({
    data: NEWS_SOURCES.map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      active: true,
    })),
    meta: {
      timestamp: new Date().toISOString(),
      version: '4.0.0',
      source: 'deevo-news-aggregator',
    },
  });
});

export { newsRouter };
