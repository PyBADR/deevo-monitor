import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=60');

  return res.status(200).json({
    breaking: [
      { id: 'brk-001', title: 'BREAKING: Staged Accident Ring Dismantled — 23 Arrests in Kuwait', source: 'Kuwait Times', category: 'fraud', priority: 'critical', timestamp: new Date(Date.now() - 600000).toISOString(), region: 'KW' },
      { id: 'brk-002', title: 'ALERT: Tropical Cyclone Warning — Oman Coastal Properties at Risk', source: 'NCMS', category: 'weather_cat', priority: 'critical', timestamp: new Date(Date.now() - 1200000).toISOString(), region: 'OM' },
    ],
    count: 2,
    generatedAt: new Date().toISOString(),
  });
}
