import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * DEEVO Intelligence Monitor — System Health Endpoint
 * Contract C9 / Task 9B
 * Layer: API (L5) + Governance (L7)
 *
 * GET /api/health
 *
 * Returns platform status, version, service registry,
 * and L7 audit metadata for operational monitoring.
 */

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Powered-By', 'DEEVO Analytics v6.0');

  return res.status(200).json({
    status: 'ok',
    version: '6.0.0',
    platform: 'deevo-monitor',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.VERCEL_ENV ?? 'development',
    region: process.env.VERCEL_REGION ?? 'local',
    services: {
      rssProxy: '/api/rss-proxy',
      feedsAggregator: '/api/feeds/rss',
      feedsBreaking: '/api/feeds/breaking',
      feedsLatest: '/api/feeds/latest',
      feedsStats: '/api/feeds/stats',
      intelligence: '/api/intelligence',
      risk: '/api/risk',
      kpi: '/api/kpi',
      ai: '/api/ai',
      finance: '/api/finance',
      variants: '/api/variants',
    },
    capabilities: {
      variants: ['global', 'tech', 'finance', 'fraud', 'commodity', 'happy'],
      feeds: { total: 435, categories: 15 },
      languages: 21,
      panels: 38,
    },
    governance: {
      auditTrail: 'SHA-256',
      humanInLoop: true,
      pdplCompliant: true,
      ifrs17Ready: true,
    },
  });
}
