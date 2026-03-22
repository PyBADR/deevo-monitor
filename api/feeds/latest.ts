import type { VercelRequest, VercelResponse } from '@vercel/node';

const MOCK_ITEMS = [
  { id: 'f001', title: 'SAMA Issues Updated Guidelines on Motor Insurance Pricing', source: 'Saudi Gazette', category: 'regulatory', language: 'en', region: 'SA', priority: 'high', timestamp: new Date(Date.now() - 1800000).toISOString(), url: '#', summary: 'Saudi Central Bank releases comprehensive motor insurance pricing reform framework targeting transparency and competition.' },
  { id: 'f002', title: 'تأمين السيارات: تحديثات جديدة في السوق الكويتي', source: 'الأنباء', category: 'gcc_regional', language: 'ar', region: 'KW', priority: 'medium', timestamp: new Date(Date.now() - 3600000).toISOString(), url: '#', summary: 'هيئة التأمين الكويتية تصدر تعليمات جديدة بشأن تسعير تأمين المركبات.' },
  { id: 'f003', title: 'Lemonade Expands AI Claims Processing to UAE Market', source: 'InsurTech Weekly', category: 'insurtech', language: 'en', region: 'AE', priority: 'high', timestamp: new Date(Date.now() - 5400000).toISOString(), url: '#', summary: 'Digital insurer partners with DIFC-based entities for AI-driven claims adjudication in the Emirates.' },
  { id: 'f004', title: 'Brent Crude Surges Past $85 Amid OPEC+ Supply Concerns', source: 'Reuters', category: 'financial_markets', language: 'en', region: 'global', priority: 'high', timestamp: new Date(Date.now() - 7200000).toISOString(), url: '#', summary: 'Oil prices rally on supply disruption fears affecting marine cargo and energy infrastructure insurance.' },
  { id: 'f005', title: 'قطر: نمو قطاع التأمين الصحي بنسبة ١٥٪', source: 'الراية', category: 'gcc_regional', language: 'ar', region: 'QA', priority: 'medium', timestamp: new Date(Date.now() - 9000000).toISOString(), url: '#', summary: 'سوق التأمين الصحي في قطر يشهد نمواً ملحوظاً مدفوعاً بالتغطية الإلزامية.' },
  { id: 'f006', title: 'Staged Accident Ring Busted in Kuwait — 23 Arrested', source: 'Kuwait Times', category: 'fraud', language: 'en', region: 'KW', priority: 'critical', timestamp: new Date(Date.now() - 10800000).toISOString(), url: '#', summary: 'MOI dismantles organized fraud ring responsible for $2.3M in fraudulent motor claims across 6 governorates.' },
  { id: 'f007', title: 'Tropical Cyclone Watch Issued for Oman Coast', source: 'NCMS', category: 'weather_cat', language: 'en', region: 'OM', priority: 'critical', timestamp: new Date(Date.now() - 12600000).toISOString(), url: '#', summary: 'National Center of Meteorology issues advisory for potential cyclonic activity affecting Sur and Muscat regions.' },
  { id: 'f008', title: 'GIG Reports 12% Premium Growth in Q3 2025', source: 'Bloomberg', category: 'financial_markets', language: 'en', region: 'KW', priority: 'medium', timestamp: new Date(Date.now() - 14400000).toISOString(), url: '#', summary: 'Gulf Insurance Group posts strong quarterly results with combined ratio improvement to 94.2%.' },
  { id: 'f009', title: 'البنك المركزي البحريني يعتمد معايير IFRS 17', source: 'أخبار الخليج', category: 'regulatory', language: 'ar', region: 'BH', priority: 'high', timestamp: new Date(Date.now() - 16200000).toISOString(), url: '#', summary: 'مصرف البحرين المركزي يصدر التعليمات النهائية لتطبيق المعيار الدولي للتقارير المالية 17.' },
  { id: 'f010', title: 'Strait of Hormuz Shipping Insurance Premiums Rise 8%', source: 'Lloyd\'s List', category: 'energy_commodity', language: 'en', region: 'global', priority: 'high', timestamp: new Date(Date.now() - 18000000).toISOString(), url: '#', summary: 'War risk premiums for tankers transiting the Strait increase amid heightened regional tensions.' },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');

  const category = req.query.category as string | undefined;
  const language = req.query.language as string | undefined;
  const limit = parseInt(req.query.limit as string) || 20;

  let items = [...MOCK_ITEMS];
  if (category) items = items.filter((i) => i.category === category);
  if (language) items = items.filter((i) => i.language === language);

  return res.status(200).json({
    items: items.slice(0, limit),
    total: items.length,
    generatedAt: new Date().toISOString(),
  });
}
