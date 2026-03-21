/**
 * Ollama Router — AI proxy for local LLM inference.
 * POST /api/ollama/generate  — Generate AI insight
 * GET  /api/ollama/status    — Check Ollama availability
 * GET  /api/ollama/models    — List available models
 */
import { Router } from "express";

const OLLAMA_BASE = process.env.OLLAMA_URL || "http://localhost:11434";
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";

export const ollamaRouter = Router();

ollamaRouter.get("/status", async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE}/api/tags`);
    if (response.ok) {
      const data = await response.json() as { models?: Array<{ name: string }> };
      res.json({
        status: "online",
        models: (data.models || []).map((m: { name: string }) => m.name),
        defaultModel: DEFAULT_MODEL,
      });
    } else {
      res.json({ status: "error", message: "Ollama returned non-OK response" });
    }
  } catch {
    res.json({ status: "offline", message: "Ollama is not running on this machine" });
  }
});

ollamaRouter.get("/models", async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE}/api/tags`);
    const data = await response.json() as { models?: Array<{ name: string; size: number; modified_at: string }> };
    res.json({ models: data.models || [] });
  } catch {
    res.json({ models: [], error: "Ollama not available" });
  }
});

ollamaRouter.post("/generate", async (req, res) => {
  const { prompt, model, context } = req.body as {
    prompt?: string;
    model?: string;
    context?: string;
  };

  if (!prompt) {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  const systemPrompt = `You are Deevo AI, a specialized GCC insurance intelligence analyst.
You analyze risk patterns, fraud indicators, regulatory changes, and market dynamics across
Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, and Oman. Be concise, data-driven, and actionable.
${context ? `\nContext: ${context}` : ""}`;

  try {
    const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        prompt: `${systemPrompt}\n\nUser: ${prompt}`,
        stream: false,
        options: { temperature: 0.7, top_p: 0.9 },
      }),
    });

    const data = await response.json() as {
      response?: string;
      total_duration?: number;
      eval_count?: number;
    };

    res.json({
      insight: {
        id: `insight-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: "AI Analysis",
        content: data.response || "No response generated",
        confidence: 0.75,
        category: "risk",
        actionable: true,
        model: model || DEFAULT_MODEL,
      },
      performance: {
        totalDurationMs: data.total_duration
          ? data.total_duration / 1_000_000
          : null,
        tokenCount: data.eval_count || null,
      },
    });
  } catch {
    res.status(503).json({
      error: "Ollama unavailable",
      message: "Start Ollama locally: ollama serve",
    });
  }
});
