import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');

  return res.status(200).json({
    briefing: {
      date: new Date().toISOString().split('T')[0],
      headline: 'GCC Insurance Markets: Moderate Risk with Localized Fraud Hotspots',
      summary: 'The GCC insurance landscape shows stable macro conditions with three key developments requiring attention: a dismantled fraud ring in Kuwait impacting motor lines, SAMA regulatory updates affecting Saudi pricing models, and cyclone preparedness gaps in Oman coastal properties.',
      keyPoints: [
        { topic: 'Fraud Intelligence', severity: 'high', detail: 'Kuwait MOI arrested 23 individuals in organized staged accident ring. Estimated $2.3M in fraudulent claims across motor portfolio. SIU recommends cross-referencing Salmiya-Hawally corridor claims from past 18 months.' },
        { topic: 'Regulatory', severity: 'medium', detail: 'SAMA motor insurance pricing guidelines take effect Q2. Actuarial teams should model impact on premium adequacy. Estimated 5-8% rate compression for standard risks.' },
        { topic: 'Weather CAT', severity: 'elevated', detail: 'Oman NCMS cyclone advisory active. Coastal property portfolios in Sur-Muscat corridor face $120M aggregate exposure. Reinsurance treaties should be reviewed for adequacy.' },
        { topic: 'Market Performance', severity: 'low', detail: 'GIG Q3 results show 12% premium growth with combined ratio at 94.2%. Sector-wide improvement trend continues across GCC listed insurers.' },
      ],
      riskOutlook: 'moderate',
      confidence: 0.82,
    },
    provider: 'deevo-ai',
    generatedAt: new Date().toISOString(),
  });
}
