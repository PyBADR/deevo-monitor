import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');

  return res.status(200).json({
    crypto: [
      { symbol: 'BTC', name: 'Bitcoin', price: 67420, change24h: 2.3, marketCap: '1.32T', volume24h: '28.4B' },
      { symbol: 'ETH', name: 'Ethereum', price: 3580, change24h: 1.8, marketCap: '430B', volume24h: '12.1B' },
      { symbol: 'BNB', name: 'BNB', price: 612, change24h: -0.5, marketCap: '94B', volume24h: '1.8B' },
      { symbol: 'SOL', name: 'Solana', price: 148, change24h: 5.2, marketCap: '65B', volume24h: '3.2B' },
      { symbol: 'XRP', name: 'XRP', price: 0.584, change24h: -1.2, marketCap: '32B', volume24h: '1.4B' },
      { symbol: 'ADA', name: 'Cardano', price: 0.452, change24h: 3.1, marketCap: '16B', volume24h: '890M' },
      { symbol: 'AVAX', name: 'Avalanche', price: 38.2, change24h: 4.5, marketCap: '14B', volume24h: '720M' },
      { symbol: 'DOGE', name: 'Dogecoin', price: 0.125, change24h: -2.8, marketCap: '18B', volume24h: '1.1B' },
    ],
    totalMarketCap: '2.45T',
    generatedAt: new Date().toISOString(),
  });
}
