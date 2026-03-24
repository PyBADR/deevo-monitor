import type { VercelRequest, VercelResponse } from '@vercel/node';

const SEED_CARDS = [
  { type:'ENERGY', title:'Hormuz disruption risk — Brent premium elevated', narrative:'IRGC naval activity near Strait of Hormuz pushing Brent to $87+. Risk premium of $4-6/bbl priced in. Qatar LNG northward routing adds 3-day lag.', action:'Monitor chokepoint daily. Review marine war risk excess layers.', risk_caveat:'De-escalation within 48h would collapse premium rapidly.', confidence:'HIGH', asset:'BRENT', magnitude_pct:8.4, impact_24h:95, impact_7d:72, direction:'UP' },
  { type:'CLAIMS_SURGE', title:'Kuwait motor TPL +18% QoQ — frequency anomaly', narrative:'Q1 2026 Kuwait motor TPL frequency up 18% QoQ. ISA data confirms 3 corridor hotspots. FRIN flags coordinated workshop billing in Salmiya.', action:'Deploy field inspection units to top-5 flagged workshops.', risk_caveat:'Road infrastructure works in Salmiya may explain partial frequency lift.', confidence:'HIGH', country:'KW', magnitude_pct:18.0 },
  { type:'FRAUD_ALERT', title:'UAE medical fraud cluster — 3 clinic network', narrative:'DEEVO FRIN detected coordinated billing from 3 Abu Dhabi clinics. 94 claims, identical procedure codes, FRIN confidence 91%. Estimated AED 2.8M exposure.', action:'Flag top 3 providers for SIU. Suspend interim payments pending audit.', risk_caveat:'Seasonal demand variations could explain partial frequency uplift.', confidence:'HIGH', country:'UAE' },
  { type:'REGULATORY', title:'SAMA motor circular — 23 insurer compliance deadline', narrative:'Saudi SAMA issued circular requiring updated motor pricing models by Q2 2026. 23 insurers affected. Non-compliance triggers license review.', action:'Verify Tawuniya compliance timeline in DEEVO pipeline.', risk_caveat:'SAMA typically extends deadlines by 30-60 days upon request.', confidence:'HIGH', country:'SA' },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(200).json({ cards: SEED_CARDS, source: 'seed', summary: 'GCC CORTEX seed brief — add ANTHROPIC_API_KEY in Vercel env vars for live AI' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { context = '', systemPrompt = '' } = body || {};

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2500,
        temperature: 0.25,
        system: systemPrompt || 'You are DEEVO CORTEX — GCC Economic Intelligence. Generate 4 intelligence cards as a JSON array. No markdown. No preamble.',
        messages: [{ role: 'user', content: `Generate 4 GCC intelligence cards:\n${context}` }],
      }),
    });

    const data = await response.json() as {content?: {type: string; text: string}[]};
    const text = data.content?.[0]?.text ?? '';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const cards = JSON.parse(clean);

    return res.status(200).json({ cards: Array.isArray(cards) ? cards.slice(0, 5) : SEED_CARDS, source: 'live', summary: 'GCC CORTEX AI brief generated' });
  } catch {
    return res.status(200).json({ cards: SEED_CARDS, source: 'seed', summary: 'AI generation failed — using seed data' });
  }
}
