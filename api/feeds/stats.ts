import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  return res.status(200).json({
    total: 435,
    active: 412,
    categories: {
      global_insurance: 35, gcc_regional: 30, regulatory: 20, insurtech: 30,
      financial_markets: 35, fraud: 25, energy_commodity: 30, geopolitical: 25,
      weather_cat: 20, cryptocurrency: 20, stock_market: 20, central_bank: 15,
      development: 20, healthcare: 15, maritime_trade: 15,
    },
    byLanguage: { en: 350, ar: 65, fr: 10, de: 5, zh: 5 },
    byRegion: { global: 180, gcc: 120, mena: 55, europe: 40, asia: 25, americas: 15 },
    lastFetchAt: new Date().toISOString(),
    avgLatencyMs: 1240,
    errorRate: 0.023,
  });
}
