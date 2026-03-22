import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  return res.status(200).json({
    radar: {
      stocks: { total: 92, tracked: 42, topGainer: { symbol: 'TAWUNIYA', change: 4.2 }, topLoser: { symbol: '8310.SR', change: -2.8 } },
      crypto: { total: 30, btcPrice: 67420, ethPrice: 3580, totalMarketCap: '2.45T USD' },
      commodities: { brent: 84.5, wti: 80.2, gold: 2340, silver: 29.8, natGas: 2.85 },
      exchanges: { total: 8, active: ['Tadawul', 'DFM', 'ADX', 'Boursa Kuwait', 'QSE', 'BHB', 'MSM', 'NASDAQ Dubai'] },
      forex: { usdSar: 3.7500, usdAed: 3.6725, usdKwd: 0.3072, usdQar: 3.6400, usdBhd: 0.3770, usdOmr: 0.3845 },
    },
    generatedAt: new Date().toISOString(),
  });
}
