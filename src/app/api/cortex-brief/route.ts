// ─── API ROUTE: POST /api/cortex-brief ───────────────────────────────────────
// Calls Anthropic API server-side (key never exposed to browser)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { context, systemPrompt } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return seed data if no key configured — never fail
      return NextResponse.json({ cards: null, error: 'no_key' }, { status: 200 });
    }

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
        system: systemPrompt,
        messages: [{ role: 'user', content: `Generate 4 GCC intelligence cards from this live data:\n\n${context}` }],
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return NextResponse.json({ cards: null, error: 'api_error' }, { status: 200 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';

    // Strip any markdown fences
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let cards;
    try {
      cards = JSON.parse(clean);
    } catch {
      // If JSON parse fails, return seed
      return NextResponse.json({ cards: null, error: 'parse_error' }, { status: 200 });
    }

    if (!Array.isArray(cards)) {
      return NextResponse.json({ cards: null, error: 'not_array' }, { status: 200 });
    }

    return NextResponse.json({
      cards: cards.slice(0, 5),
      summary: `${cards.length} intelligence signals analyzed — GCC CORTEX brief generated`,
    });
  } catch (err) {
    console.error('Cortex brief route error:', err);
    return NextResponse.json({ cards: null, error: 'server_error' }, { status: 200 });
  }
}
