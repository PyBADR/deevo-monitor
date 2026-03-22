import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const now = new Date().toISOString();
  const composite = 34.2 + (Math.random() - 0.5) * 8;

  return res.status(200).json({
    dri: {
      composite: Math.round(composite * 10) / 10,
      level: composite < 25 ? 'low' : composite < 50 ? 'moderate' : composite < 75 ? 'elevated' : 'critical',
      trend: composite > 35 ? 'rising' : 'stable',
      confidence: 0.87,
    },
    components: {
      geopolitical: 42.5,
      weather_cat: 28.3,
      market_volatility: 31.7,
      fraud_activity: 38.9,
      regulatory_change: 22.1,
      cyber_threat: 35.6,
      claims_surge: 29.4,
      reinsurance_capacity: 26.8,
    },
    historicalTrend: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      value: Math.round((30 + Math.sin(i / 5) * 10 + (Math.random() - 0.5) * 6) * 10) / 10,
    })),
    generatedAt: now,
  });
}
