import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  return res.status(200).json({
    commodities: {
      energy: [
        { symbol: 'BRENT', name: 'Brent Crude', price: 84.5, unit: 'USD/bbl', change: 1.8, trend: 'rising' },
        { symbol: 'WTI', name: 'WTI Crude', price: 80.2, unit: 'USD/bbl', change: 1.5, trend: 'rising' },
        { symbol: 'NATGAS', name: 'Natural Gas', price: 2.85, unit: 'USD/MMBtu', change: -2.1, trend: 'falling' },
        { symbol: 'LNG', name: 'LNG Asia Spot', price: 12.4, unit: 'USD/MMBtu', change: -3.5, trend: 'falling' },
      ],
      metals: [
        { symbol: 'GOLD', name: 'Gold Spot', price: 2340, unit: 'USD/oz', change: 0.8, trend: 'rising' },
        { symbol: 'SILVER', name: 'Silver Spot', price: 29.8, unit: 'USD/oz', change: 1.2, trend: 'rising' },
        { symbol: 'COPPER', name: 'Copper', price: 9420, unit: 'USD/t', change: -0.5, trend: 'stable' },
        { symbol: 'ALUMINUM', name: 'Aluminum', price: 2380, unit: 'USD/t', change: 0.3, trend: 'stable' },
      ],
      agriculture: [
        { symbol: 'WHEAT', name: 'Wheat', price: 628, unit: 'USc/bu', change: -1.8, trend: 'falling' },
        { symbol: 'RICE', name: 'Rice', price: 15.2, unit: 'USD/cwt', change: 0.5, trend: 'stable' },
      ],
    },
    generatedAt: new Date().toISOString(),
  });
}
