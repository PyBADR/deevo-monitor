/**
 * Stocks API Route — /api/stocks
 * Returns GCC insurance stock quotes and market indices.
 */
import { Router } from 'express';

const router = Router();

function spark(base: number, variance: number, points = 30) {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    t: now - (points - i) * 3600_000,
    v: +(base + (Math.random() - 0.5) * variance).toFixed(2),
  }));
}

const GCC_INSURANCE_STOCKS = [
  { symbol: '8010.SR', name: 'Tawuniya', exchange: 'TADAWUL', price: 142.80, change: 4.40, changePercent: 3.18, volume: 1240000, currency: 'SAR', sector: 'Insurance', sparkline: spark(140, 8) },
  { symbol: '8210.SR', name: 'Bupa Arabia', exchange: 'TADAWUL', price: 198.40, change: 3.50, changePercent: 1.80, volume: 890000, currency: 'SAR', sector: 'Health Insurance', sparkline: spark(195, 6) },
  { symbol: '8200.SR', name: 'Al Rajhi Takaful', exchange: 'TADAWUL', price: 78.60, change: -1.20, changePercent: -1.50, volume: 420000, currency: 'SAR', sector: 'Takaful', sparkline: spark(79, 3) },
  { symbol: '8230.SR', name: 'Walaa Insurance', exchange: 'TADAWUL', price: 28.35, change: 0.85, changePercent: 3.09, volume: 1560000, currency: 'SAR', sector: 'Insurance', sparkline: spark(28, 2) },
  { symbol: 'OIC', name: 'Orient Insurance', exchange: 'DFM', price: 8.42, change: -0.05, changePercent: -0.59, volume: 180000, currency: 'AED', sector: 'Insurance', sparkline: spark(8.5, 0.4) },
  { symbol: 'SALAMA', name: 'Salama Islamic', exchange: 'DFM', price: 0.68, change: 0.02, changePercent: 3.03, volume: 4200000, currency: 'AED', sector: 'Takaful', sparkline: spark(0.67, 0.04) },
  { symbol: 'ADNIC', name: 'Abu Dhabi National', exchange: 'ADX', price: 6.12, change: 0.14, changePercent: 2.34, volume: 340000, currency: 'AED', sector: 'Insurance', sparkline: spark(6, 0.3) },
  { symbol: 'GIG', name: 'Gulf Insurance Group', exchange: 'BOURSA', price: 0.824, change: 0.012, changePercent: 1.48, volume: 280000, currency: 'KWD', sector: 'Insurance', sparkline: spark(0.82, 0.03) },
  { symbol: 'OINS', name: 'Oman Insurance Co', exchange: 'MSM', price: 2.14, change: 0.004, changePercent: 0.19, volume: 52000, currency: 'OMR', sector: 'Insurance', sparkline: spark(2.12, 0.1) },
  { symbol: 'QIC', name: 'Qatar Insurance Co', exchange: 'QSE', price: 2.48, change: -0.03, changePercent: -1.20, volume: 620000, currency: 'QAR', sector: 'Insurance', sparkline: spark(2.5, 0.12) },
];

const GCC_INDICES = [
  { symbol: 'TASI', name: 'Tadawul All Share', exchange: 'TADAWUL', price: 12847.32, change: 178.40, changePercent: 1.41, volume: 284000000, currency: 'SAR', sector: 'Index', sparkline: spark(12700, 300) },
  { symbol: 'ADI', name: 'ADX General', exchange: 'ADX', price: 9234.18, change: 73.20, changePercent: 0.80, volume: 142000000, currency: 'AED', sector: 'Index', sparkline: spark(9150, 200) },
  { symbol: 'DFM', name: 'DFM General', exchange: 'DFM', price: 4412.56, change: -13.80, changePercent: -0.31, volume: 98000000, currency: 'AED', sector: 'Index', sparkline: spark(4430, 100) },
  { symbol: 'BK', name: 'Boursa Kuwait', exchange: 'BOURSA', price: 7891.44, change: 39.40, changePercent: 0.50, volume: 76000000, currency: 'KWD', sector: 'Index', sparkline: spark(7850, 120) },
  { symbol: 'QSE', name: 'Qatar Exchange', exchange: 'QSE', price: 10542.88, change: -22.10, changePercent: -0.21, volume: 64000000, currency: 'QAR', sector: 'Index', sparkline: spark(10550, 150) },
];

/**
 * GET /api/stocks
 * Returns all GCC insurance stocks.
 */
router.get('/', (_req, res) => {
  res.json({
    quotes: GCC_INSURANCE_STOCKS.map((s) => ({ ...s, updatedAt: Date.now() })),
    indices: GCC_INDICES.map((s) => ({ ...s, updatedAt: Date.now() })),
    timestamp: Date.now(),
  });
});

/**
 * GET /api/stocks/indices
 * Returns only GCC market indices.
 */
router.get('/indices', (_req, res) => {
  res.json({
    indices: GCC_INDICES.map((s) => ({ ...s, updatedAt: Date.now() })),
    timestamp: Date.now(),
  });
});

export default router;
