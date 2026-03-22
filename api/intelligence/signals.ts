import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  return res.status(200).json({
    signals: [
      { id: 'sig-001', type: 'regulatory', country: 'SA', severity: 'high', title: 'SAMA Motor Pricing Reform', detail: 'New pricing guidelines effective Q2 — actuarial model recalibration required', timestamp: new Date(Date.now() - 3600000).toISOString(), source: 'SAMA Circular 2025-R-047' },
      { id: 'sig-002', type: 'fraud', country: 'KW', severity: 'critical', title: 'Organized Fraud Ring Dismantled', detail: '23 arrests in staged accident network. 47 linked claims identified for review.', timestamp: new Date(Date.now() - 7200000).toISOString(), source: 'Kuwait MOI / FRIN' },
      { id: 'sig-003', type: 'weather', country: 'OM', severity: 'elevated', title: 'Cyclone Season Advisory', detail: 'Arabian Sea tropical activity above normal. Coastal property aggregate review recommended.', timestamp: new Date(Date.now() - 10800000).toISOString(), source: 'Oman NCMS' },
      { id: 'sig-004', type: 'cyber', country: 'AE', severity: 'medium', title: 'DIFC Phishing Campaign', detail: 'Targeted spear-phishing against insurance broker email systems. 3 confirmed compromises.', timestamp: new Date(Date.now() - 14400000).toISOString(), source: 'AECERT Advisory' },
      { id: 'sig-005', type: 'market', country: 'BH', severity: 'medium', title: 'IFRS 17 Early Adoption', detail: 'CBB accelerates IFRS 17 timeline. Reserve methodology changes impact Q1 reporting.', timestamp: new Date(Date.now() - 18000000).toISOString(), source: 'CBB Directive' },
      { id: 'sig-006', type: 'geopolitical', country: 'global', severity: 'elevated', title: 'Strait of Hormuz Tensions', detail: 'War risk premiums up 8%. Marine cargo and energy infrastructure underwriters assess exposure.', timestamp: new Date(Date.now() - 21600000).toISOString(), source: "Lloyd's Market Association" },
      { id: 'sig-007', type: 'economic', country: 'QA', severity: 'low', title: 'Health Insurance Market Growth', detail: 'Qatar health insurance premiums up 15% YoY driven by mandatory coverage expansion.', timestamp: new Date(Date.now() - 25200000).toISOString(), source: 'QFC Regulatory Authority' },
      { id: 'sig-008', type: 'technology', country: 'SA', severity: 'low', title: 'Digital ID Integration', detail: 'Absher platform API now available for insurance KYC automation. Pilot with 3 carriers.', timestamp: new Date(Date.now() - 28800000).toISOString(), source: 'NIC / SAMA' },
    ],
    count: 8,
    generatedAt: new Date().toISOString(),
  });
}
