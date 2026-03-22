import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');

  return res.status(200).json({
    insights: [
      { id: 'ins-001', type: 'anomaly', severity: 'high', title: 'Fraud Cluster Detected — Kuwait Motor', body: 'Welford anomaly detection flagged 3.2σ deviation in Salmiya motor claims frequency. 47 claims in cluster share common repair shop (ID: RS-KW-0847) and medical provider linkages.', actionable: true, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'ins-002', type: 'trend', severity: 'medium', title: 'IFRS 17 Implementation Acceleration', body: 'Three GCC regulators (SAMA, CBB, CMA) have aligned IFRS 17 transition timelines. Insurance companies should expect Q1 reporting template changes affecting reserve calculations.', actionable: true, timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: 'ins-003', type: 'opportunity', severity: 'low', title: 'Parametric Insurance Demand Rising', body: 'Search volume for parametric weather insurance up 340% in GCC region. Oman cyclone concerns and Saudi flash flood events driving market interest. First-mover advantage window estimated at 6-9 months.', actionable: true, timestamp: new Date(Date.now() - 14400000).toISOString() },
      { id: 'ins-004', type: 'risk', severity: 'elevated', title: 'Strait of Hormuz War Risk Premium Spike', body: 'Marine cargo insurance premiums through Strait of Hormuz increased 8% WoW. Energy infrastructure underwriters should review aggregate exposures for Gulf-facing facilities.', actionable: true, timestamp: new Date(Date.now() - 18000000).toISOString() },
      { id: 'ins-005', type: 'correlation', severity: 'medium', title: 'Oil Price — Motor Claims Correlation', body: 'Historical analysis shows 0.73 correlation between Brent crude drops >15% and subsequent 12-month motor claims frequency increase in Kuwait and Saudi Arabia. Current oil trajectory warrants monitoring.', actionable: false, timestamp: new Date(Date.now() - 21600000).toISOString() },
    ],
    count: 5,
    generatedAt: new Date().toISOString(),
  });
}
