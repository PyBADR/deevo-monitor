import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800');

  return res.status(200).json({
    forecast: {
      horizon: '90_days',
      generatedAt: new Date().toISOString(),
      predictions: [
        { category: 'motor_claims', direction: 'rising', probability: 0.72, impact: 'medium', rationale: 'Seasonal traffic increase + fraud ring disruption may cause short-term surge as accomplices file remaining claims.' },
        { category: 'health_premiums', direction: 'stable', probability: 0.85, impact: 'low', rationale: 'Medical inflation contained at 4.2% across GCC. Mandatory coverage expansion in Qatar offsets cost pressures.' },
        { category: 'property_cat', direction: 'rising', probability: 0.58, impact: 'high', rationale: 'Arabian Sea cyclone season outlook above normal. Oman and eastern UAE coastal exposure elevated.' },
        { category: 'cyber_risk', direction: 'rising', probability: 0.67, impact: 'high', rationale: 'DIFC-targeted phishing campaigns increasing. Insurance sector remains under-penetrated for cyber coverage.' },
        { category: 'reinsurance_rates', direction: 'stable', probability: 0.74, impact: 'medium', rationale: 'Global reinsurance capacity adequate. GCC-specific treaty renewals expected flat to +3% at 1/1.' },
        { category: 'fraud_frequency', direction: 'falling', probability: 0.65, impact: 'medium', rationale: 'Kuwait enforcement action creates deterrence effect. FRIN intelligence sharing improving detection rates.' },
      ],
    },
    confidence: 0.78,
    provider: 'deevo-ai',
  });
}
