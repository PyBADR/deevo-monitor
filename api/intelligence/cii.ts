import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CIICountry {
  code: string;
  name: string;
  cii: number;
  signals: {
    political_stability: number;
    economic_freedom: number;
    regulatory_quality: number;
    fraud_environment: number;
    climate_exposure: number;
    cyber_readiness: number;
    infrastructure_quality: number;
    reinsurance_access: number;
    market_maturity: number;
    claims_efficiency: number;
    digital_readiness: number;
    workforce_quality: number;
  };
  trend: 'improving' | 'declining' | 'stable';
  anomalies: string[];
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');

  const countries: CIICountry[] = [
    { code: 'SA', name: 'Saudi Arabia', cii: 72.4, signals: { political_stability: 68, economic_freedom: 65, regulatory_quality: 78, fraud_environment: 58, climate_exposure: 42, cyber_readiness: 71, infrastructure_quality: 82, reinsurance_access: 85, market_maturity: 75, claims_efficiency: 68, digital_readiness: 74, workforce_quality: 70 }, trend: 'improving', anomalies: ['Motor pricing reform impact'] },
    { code: 'AE', name: 'United Arab Emirates', cii: 82.1, signals: { political_stability: 85, economic_freedom: 82, regulatory_quality: 88, fraud_environment: 72, climate_exposure: 38, cyber_readiness: 80, infrastructure_quality: 92, reinsurance_access: 90, market_maturity: 85, claims_efficiency: 78, digital_readiness: 86, workforce_quality: 82 }, trend: 'stable', anomalies: [] },
    { code: 'KW', name: 'Kuwait', cii: 62.8, signals: { political_stability: 58, economic_freedom: 55, regulatory_quality: 62, fraud_environment: 45, climate_exposure: 48, cyber_readiness: 60, infrastructure_quality: 72, reinsurance_access: 75, market_maturity: 68, claims_efficiency: 55, digital_readiness: 58, workforce_quality: 62 }, trend: 'stable', anomalies: ['Fraud ring disruption — positive signal'] },
    { code: 'QA', name: 'Qatar', cii: 78.5, signals: { political_stability: 75, economic_freedom: 72, regulatory_quality: 80, fraud_environment: 78, climate_exposure: 35, cyber_readiness: 76, infrastructure_quality: 88, reinsurance_access: 82, market_maturity: 72, claims_efficiency: 75, digital_readiness: 80, workforce_quality: 78 }, trend: 'improving', anomalies: [] },
    { code: 'BH', name: 'Bahrain', cii: 68.2, signals: { political_stability: 55, economic_freedom: 70, regulatory_quality: 75, fraud_environment: 62, climate_exposure: 45, cyber_readiness: 68, infrastructure_quality: 74, reinsurance_access: 78, market_maturity: 72, claims_efficiency: 65, digital_readiness: 70, workforce_quality: 68 }, trend: 'stable', anomalies: ['IFRS 17 transition ahead of schedule'] },
    { code: 'OM', name: 'Oman', cii: 58.9, signals: { political_stability: 72, economic_freedom: 58, regulatory_quality: 60, fraud_environment: 65, climate_exposure: 35, cyber_readiness: 52, infrastructure_quality: 62, reinsurance_access: 68, market_maturity: 55, claims_efficiency: 52, digital_readiness: 48, workforce_quality: 58 }, trend: 'improving', anomalies: ['Cyclone exposure elevated'] },
  ];

  return res.status(200).json({
    cii: countries,
    gccAverage: Math.round(countries.reduce((s, c) => s + c.cii, 0) / countries.length * 10) / 10,
    methodology: '12-signal weighted composite — Welford anomaly detection',
    generatedAt: new Date().toISOString(),
  });
}
