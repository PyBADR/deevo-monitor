import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CountryRisk {
  country: string;
  code: string;
  overall: number;
  political: number;
  economic: number;
  climate: number;
  cyber: number;
  fraud: number;
  trend: 'rising' | 'falling' | 'stable';
  lastUpdated: string;
}

function generateScore(base: number, variance: number): number {
  const v = (Math.random() - 0.5) * variance;
  return Math.round(Math.max(0, Math.min(100, base + v)) * 10) / 10;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const now = new Date().toISOString();
  const scores: CountryRisk[] = [
    { country: 'Saudi Arabia', code: 'SA', overall: generateScore(32, 8), political: generateScore(28, 10), economic: generateScore(25, 8), climate: generateScore(45, 12), cyber: generateScore(38, 10), fraud: generateScore(42, 8), trend: 'falling', lastUpdated: now },
    { country: 'United Arab Emirates', code: 'AE', overall: generateScore(22, 6), political: generateScore(15, 6), economic: generateScore(20, 8), climate: generateScore(40, 10), cyber: generateScore(35, 10), fraud: generateScore(30, 8), trend: 'stable', lastUpdated: now },
    { country: 'Kuwait', code: 'KW', overall: generateScore(38, 10), political: generateScore(35, 12), economic: generateScore(30, 8), climate: generateScore(50, 10), cyber: generateScore(40, 10), fraud: generateScore(48, 10), trend: 'rising', lastUpdated: now },
    { country: 'Qatar', code: 'QA', overall: generateScore(20, 6), political: generateScore(18, 6), economic: generateScore(15, 6), climate: generateScore(35, 8), cyber: generateScore(30, 8), fraud: generateScore(25, 6), trend: 'stable', lastUpdated: now },
    { country: 'Bahrain', code: 'BH', overall: generateScore(35, 8), political: generateScore(40, 12), economic: generateScore(32, 10), climate: generateScore(42, 10), cyber: generateScore(36, 8), fraud: generateScore(38, 8), trend: 'rising', lastUpdated: now },
    { country: 'Oman', code: 'OM', overall: generateScore(30, 8), political: generateScore(22, 8), economic: generateScore(35, 10), climate: generateScore(48, 12), cyber: generateScore(32, 8), fraud: generateScore(35, 8), trend: 'stable', lastUpdated: now },
  ];

  const country = req.query.country as string | undefined;
  if (country) {
    const match = scores.find((s) => s.code === country.toUpperCase());
    if (!match) return res.status(404).json({ error: 'Country not found' });
    return res.status(200).json(match);
  }

  return res.status(200).json({
    gccComposite: Math.round(scores.reduce((sum, s) => sum + s.overall, 0) / scores.length * 10) / 10,
    countries: scores,
    generatedAt: now,
  });
}
