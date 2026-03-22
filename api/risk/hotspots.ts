import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');

  return res.status(200).json({
    hotspots: [
      { id: 'hs-001', lat: 29.3759, lon: 47.9774, city: 'Kuwait City', country: 'KW', severity: 'high', type: 'fraud_cluster', description: 'Elevated staged accident reports — Salmiya-Hawally corridor', radius_km: 8, claimCount: 47 },
      { id: 'hs-002', lat: 24.7136, lon: 46.6753, city: 'Riyadh', country: 'SA', severity: 'moderate', type: 'weather_cat', description: 'Flash flood claims surge — southern Riyadh districts', radius_km: 15, claimCount: 123 },
      { id: 'hs-003', lat: 25.2048, lon: 55.2708, city: 'Dubai', country: 'AE', severity: 'elevated', type: 'cyber_threat', description: 'DIFC-targeted phishing campaign affecting insurance brokers', radius_km: 5, claimCount: 12 },
      { id: 'hs-004', lat: 26.2285, lon: 50.5860, city: 'Manama', country: 'BH', severity: 'moderate', type: 'medical_fraud', description: 'Inflated medical billing pattern detected — 3 clinics flagged', radius_km: 4, claimCount: 31 },
      { id: 'hs-005', lat: 25.2854, lon: 51.5310, city: 'Doha', country: 'QA', severity: 'low', type: 'property_risk', description: 'Construction project insurance gaps — Lusail corridor', radius_km: 10, claimCount: 8 },
      { id: 'hs-006', lat: 23.5880, lon: 58.3829, city: 'Muscat', country: 'OM', severity: 'elevated', type: 'weather_cat', description: 'Cyclone season preparedness — coastal property exposure', radius_km: 25, claimCount: 0 },
      { id: 'hs-007', lat: 21.4858, lon: 39.1925, city: 'Jeddah', country: 'SA', severity: 'high', type: 'claims_surge', description: 'Motor claims spike — Ring Road accident frequency +34%', radius_km: 12, claimCount: 89 },
      { id: 'hs-008', lat: 26.3173, lon: 50.2083, city: 'Dammam', country: 'SA', severity: 'moderate', type: 'energy_risk', description: 'Industrial zone liability exposure — Jubail petrochemical cluster', radius_km: 20, claimCount: 15 },
    ],
    generatedAt: new Date().toISOString(),
  });
}
