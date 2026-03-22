import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  return res.status(200).json({
    variants: [
      { id: 'global', name: 'DEEVO Monitor', tagline: 'GCC Insurance Risk Intelligence', domain: 'monitor.deevo.ai', port: 5174, icon: '🛡️', color: '#00D4FF', kpiSet: 'insurance', feedCategories: ['global_insurance', 'gcc_regional', 'regulatory', 'weather_cat', 'geopolitical'] },
      { id: 'tech', name: 'DEEVO Tech', tagline: 'InsurTech & Digital Insurance Intelligence', domain: 'tech.deevo.ai', port: 5175, icon: '⚡', color: '#7C3AED', kpiSet: 'insurtech', feedCategories: ['insurtech', 'ai_ml', 'digital_insurance', 'regulatory', 'gcc_regional'] },
      { id: 'finance', name: 'DEEVO Finance', tagline: 'GCC Insurance Financial Markets', domain: 'finance.deevo.ai', port: 5176, icon: '📈', color: '#10B981', kpiSet: 'financial_markets', feedCategories: ['financial_markets', 'gcc_regional', 'market_intel', 'regulatory', 'reinsurance'] },
      { id: 'fraud', name: 'DEEVO Fraud', tagline: 'Insurance Fraud Intelligence Network', domain: 'fraud.deevo.ai', port: 5177, icon: '🔍', color: '#FF3B30', kpiSet: 'fraud_intel', feedCategories: ['fraud', 'regulatory', 'gcc_regional', 'law_enforcement'] },
      { id: 'commodity', name: 'DEEVO Commodity', tagline: 'GCC Commodity & Energy Risk Intelligence', domain: 'commodity.deevo.ai', port: 5178, icon: '🛢', color: '#FF9500', kpiSet: 'commodity', feedCategories: ['financial_markets', 'gcc_regional', 'geopolitical', 'reinsurance'] },
      { id: 'happy', name: 'DEEVO Happy', tagline: 'GCC Wellness & Positive Intelligence', domain: 'happy.deevo.ai', port: 5179, icon: '☀️', color: '#FFD600', kpiSet: 'wellness', feedCategories: ['gcc_regional', 'regulatory'] },
    ],
    count: 6,
    version: '5.0.0',
  });
}
