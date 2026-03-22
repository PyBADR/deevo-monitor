import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    status: 'ok',
    version: '5.0.0',
    platform: 'deevo-monitor',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    variants: ['global', 'tech', 'finance', 'fraud', 'commodity', 'happy'],
    feeds: { total: 435, categories: 15 },
    languages: 21,
  });
}
