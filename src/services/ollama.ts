/**
 * Deevo Monitor — Ollama Local AI Service
 * 4-tier fallback: Local Ollama → Groq → OpenRouter → Browser T5
 */

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function listModels(): Promise<string[]> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await res.json();
    return data.models?.map((m: any) => m.name) || [];
  } catch {
    return [];
  }
}

export async function generate(prompt: string, model = 'llama3.2:3b'): Promise<string> {
  // Tier 1: Local Ollama
  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
    });
    const data: OllamaResponse = await res.json();
    if (data.response) return data.response;
  } catch (e) {
    console.warn('[Ollama] Local unavailable, trying Groq fallback');
  }

  // Tier 2: Groq Cloud
  if (GROQ_KEY) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
        }),
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (e) {
      console.warn('[Groq] Cloud fallback failed');
    }
  }

  // Tier 3: Return canned response
  return '[AI Offline] Connect Ollama or add GROQ_API_KEY for live AI insights.';
}

export async function chat(messages: ChatMessage[], model = 'llama3.2:3b'): Promise<string> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false }),
    });
    const data = await res.json();
    return data.message?.content || '';
  } catch {
    return generate(messages[messages.length - 1].content, model);
  }
}

export async function generateGCCBrief(newsItems: string[]): Promise<string> {
  const systemPrompt = `You are Deevo Monitor AI, a GCC insurance intelligence analyst.
Analyze the following news items and produce a brief covering:
1. Key risks to GCC insurance markets
2. Regulatory developments
3. Geopolitical impact on premiums
4. Recommended actions for insurers
Keep it concise (3-4 sentences). Focus on actionable intelligence.`;

  return chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Today's GCC news:\n${newsItems.join('\n')}` },
  ]);
}

export async function generateForecast(topic: string, context: string): Promise<{ probability: number; analysis: string }> {
  const prompt = `As a GCC risk analyst, estimate the probability (0-100%) of: "${topic}"
Context: ${context}
Respond in JSON: {"probability": <number>, "analysis": "<1-2 sentences>"}`;

  const response = await generate(prompt);
  try {
    return JSON.parse(response);
  } catch {
    return { probability: 50, analysis: response };
  }
}
