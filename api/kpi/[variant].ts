import type { VercelRequest, VercelResponse } from '@vercel/node';

const KPI_DATA: Record<string, Record<string, { value: number; unit: string; trend: string; delta: number }>> = {
  insurance: {
    grossPremiums: { value: 14.2, unit: 'B USD', trend: 'rising', delta: 8.3 },
    combinedRatio: { value: 94.8, unit: '%', trend: 'falling', delta: -2.1 },
    claimsRatio: { value: 62.3, unit: '%', trend: 'stable', delta: 0.4 },
    fraudDetectionRate: { value: 78.5, unit: '%', trend: 'rising', delta: 5.2 },
    solvencyRatio: { value: 182, unit: '%', trend: 'stable', delta: 1.8 },
    renewalRate: { value: 87.2, unit: '%', trend: 'rising', delta: 2.1 },
    avgClaimDays: { value: 12.4, unit: 'days', trend: 'falling', delta: -1.8 },
    digitalAdoption: { value: 43.7, unit: '%', trend: 'rising', delta: 12.5 },
    policyCount: { value: 8.9, unit: 'M', trend: 'rising', delta: 6.2 },
    investmentYield: { value: 4.8, unit: '%', trend: 'stable', delta: 0.3 },
    customerSatisfaction: { value: 7.4, unit: '/10', trend: 'rising', delta: 0.6 },
    reinsuranceCeded: { value: 38.2, unit: '%', trend: 'stable', delta: -0.8 },
  },
  insurtech: {
    digitalPolicies: { value: 2.1, unit: 'M', trend: 'rising', delta: 45.3 },
    apiCalls: { value: 142, unit: 'M/day', trend: 'rising', delta: 28.7 },
    mobileAdoption: { value: 67.8, unit: '%', trend: 'rising', delta: 15.2 },
    claimsAutomation: { value: 52.3, unit: '%', trend: 'rising', delta: 18.9 },
    embeddedInsurance: { value: 340, unit: 'M USD', trend: 'rising', delta: 62.1 },
    startupFunding: { value: 890, unit: 'M USD', trend: 'stable', delta: 3.2 },
    sandboxApprovals: { value: 14, unit: 'count', trend: 'rising', delta: 40 },
    parametricProducts: { value: 23, unit: 'count', trend: 'rising', delta: 53.3 },
  },
  financial_markets: {
    tadawulInsuranceIndex: { value: 8924, unit: 'pts', trend: 'rising', delta: 4.2 },
    dfmInsuranceIndex: { value: 3241, unit: 'pts', trend: 'stable', delta: 1.1 },
    gccInsuranceMarketCap: { value: 42.8, unit: 'B USD', trend: 'rising', delta: 7.3 },
    avgPE: { value: 14.2, unit: 'x', trend: 'stable', delta: -0.8 },
    dividendYield: { value: 3.8, unit: '%', trend: 'stable', delta: 0.2 },
    brentCrude: { value: 84.5, unit: 'USD/bbl', trend: 'rising', delta: 5.3 },
    usdSar: { value: 3.7500, unit: 'SAR', trend: 'stable', delta: 0 },
    reinsuranceRateChange: { value: 3.2, unit: '%', trend: 'falling', delta: -2.1 },
  },
  fraud_intel: {
    casesOpen: { value: 342, unit: 'count', trend: 'falling', delta: -12.3 },
    casesClosed: { value: 189, unit: 'count', trend: 'rising', delta: 24.5 },
    recoveryRate: { value: 42.3, unit: '%', trend: 'rising', delta: 8.7 },
    ringsDetected: { value: 7, unit: 'count', trend: 'rising', delta: 40 },
    avgFraudValue: { value: 48200, unit: 'USD', trend: 'falling', delta: -15.2 },
    siuReferrals: { value: 523, unit: 'count', trend: 'rising', delta: 18.9 },
    stagedAccidents: { value: 89, unit: 'count', trend: 'falling', delta: -22.1 },
    medicalFraud: { value: 156, unit: 'count', trend: 'stable', delta: 2.3 },
  },
  commodity: {
    brentCrude: { value: 84.5, unit: 'USD/bbl', trend: 'rising', delta: 5.3 },
    wtiCrude: { value: 80.2, unit: 'USD/bbl', trend: 'rising', delta: 4.8 },
    naturalGas: { value: 2.85, unit: 'USD/MMBtu', trend: 'stable', delta: -1.2 },
    goldSpot: { value: 2340, unit: 'USD/oz', trend: 'rising', delta: 8.2 },
    hormuzTransits: { value: 21, unit: 'M bbl/day', trend: 'stable', delta: 0.5 },
    shippingIndex: { value: 1842, unit: 'pts', trend: 'falling', delta: -3.8 },
    lngPrice: { value: 12.4, unit: 'USD/MMBtu', trend: 'falling', delta: -8.5 },
    petrochemSpread: { value: 342, unit: 'USD/t', trend: 'stable', delta: 1.2 },
  },
  wellness: {
    happinessIndex: { value: 7.2, unit: '/10', trend: 'rising', delta: 3.5 },
    gdpGrowth: { value: 3.8, unit: '%', trend: 'stable', delta: 0.2 },
    tourismArrivals: { value: 48.2, unit: 'M', trend: 'rising', delta: 22.3 },
    greenProjects: { value: 142, unit: 'count', trend: 'rising', delta: 35.6 },
    healthcareAccess: { value: 92.3, unit: '%', trend: 'rising', delta: 4.1 },
    educationSpend: { value: 5.8, unit: '% GDP', trend: 'stable', delta: 0.3 },
    sustainabilityScore: { value: 68.4, unit: '/100', trend: 'rising', delta: 7.8 },
    culturalEvents: { value: 892, unit: 'count', trend: 'rising', delta: 42.1 },
  },
};

const VARIANT_KPI_MAP: Record<string, string> = {
  global: 'insurance', tech: 'insurtech', finance: 'financial_markets',
  fraud: 'fraud_intel', commodity: 'commodity', happy: 'wellness',
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');

  const variant = req.query.variant as string;
  const kpiSetId = VARIANT_KPI_MAP[variant];

  if (!kpiSetId || !KPI_DATA[kpiSetId]) {
    return res.status(404).json({ error: `Unknown variant: ${variant}`, validVariants: Object.keys(VARIANT_KPI_MAP) });
  }

  return res.status(200).json({
    variant,
    kpiSet: kpiSetId,
    metrics: KPI_DATA[kpiSetId],
    generatedAt: new Date().toISOString(),
  });
}
