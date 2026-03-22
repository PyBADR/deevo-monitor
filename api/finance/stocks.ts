import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');

  const stocks = [
    { symbol: 'TAWUNIYA', name: 'Company for Cooperative Insurance', exchange: 'Tadawul', price: 142.8, change: 4.2, marketCap: '14.3B SAR', sector: 'insurance', country: 'SA' },
    { symbol: 'BUPA', name: 'Bupa Arabia', exchange: 'Tadawul', price: 189.4, change: 1.8, marketCap: '22.8B SAR', sector: 'health_insurance', country: 'SA' },
    { symbol: 'GIG', name: 'Gulf Insurance Group', exchange: 'Boursa Kuwait', price: 0.820, change: 2.1, marketCap: '412M KWD', sector: 'insurance', country: 'KW' },
    { symbol: 'SALAMA', name: 'Salama Islamic Insurance', exchange: 'DFM', price: 0.425, change: -1.2, marketCap: '637M AED', sector: 'takaful', country: 'AE' },
    { symbol: 'OIC', name: 'Orient Insurance', exchange: 'DFM', price: 3.150, change: 0.8, marketCap: '1.26B AED', sector: 'insurance', country: 'AE' },
    { symbol: 'QIIC', name: 'Qatar Insurance Company', exchange: 'QSE', price: 2.580, change: -0.4, marketCap: '6.7B QAR', sector: 'insurance', country: 'QA' },
    { symbol: 'SOLIDARITY', name: 'Solidarity Bahrain', exchange: 'BHB', price: 0.145, change: 1.5, marketCap: '43.5M BHD', sector: 'takaful', country: 'BH' },
    { symbol: 'MEDGULF', name: 'Mediterranean & Gulf Insurance', exchange: 'Tadawul', price: 22.30, change: -2.8, marketCap: '2.23B SAR', sector: 'insurance', country: 'SA' },
    { symbol: 'WATANIYA', name: 'Wataniya Insurance', exchange: 'Tadawul', price: 18.70, change: 0.5, marketCap: '935M SAR', sector: 'insurance', country: 'SA' },
    { symbol: 'AXA_GULF', name: 'AXA Gulf', exchange: 'DFM', price: 1.280, change: 3.1, marketCap: '384M AED', sector: 'insurance', country: 'AE' },
  ];

  return res.status(200).json({ stocks, count: stocks.length, generatedAt: new Date().toISOString() });
}
