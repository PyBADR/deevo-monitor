/**
 * Deevo Monitor v4.0.0 — API Server
 * Express + Socket.io backend providing:
 *   1. RSS feed aggregation from 435+ GCC insurance/regulatory sources
 *   2. Ollama AI proxy for local LLM insights
 *   3. Real-time risk engine computing DRI levels
 *   4. Cortex bridge to DeevoAnalytics backend
 *   5. WebSocket push for live dashboard updates
 *   6. KPI engine with 6 variant-specific datasets
 *   7. GCC stock market data
 *   8. Variant configuration API
 *   9. Live news aggregation (12 sources)
 *  10. Live webcam feed metadata (22 feeds)
 *  11. Strategic posture & country intelligence API
 *
 * Port: 3001 (proxied by Vite dev server)
 */
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import { feedRouter } from "./routes/feed.js";
import { riskRouter } from "./routes/risk.js";
import { ollamaRouter } from "./routes/ollama.js";
import { cortexRouter } from "./routes/cortex.js";
import { startFeedAggregator } from "./services/feed-aggregator.js";
import { startRiskEngine } from "./services/risk-engine.js";

const PORT = parseInt(process.env.PORT || "3001", 10);
const CORS_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:5174")
  .split(",")
  .map((s) => s.trim());

const app = express();
const httpServer = createServer(app);

// ── Socket.io ─────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGINS, methods: ["GET", "POST"] },
  transports: ["websocket", "polling"],
});

// Make io available to routes
app.set("io", io);

// ── Middleware ─────────────────────────────────────────
app.use(cors({ origin: CORS_ORIGINS }));
app.use(express.json());

// Serve static frontend in production (when dist/ exists)
import { existsSync } from "fs";
import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname2 = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname2, "..", "dist");

// Auto-build if dist/ is missing (handles Render where build command = "npm install" only)
if (!existsSync(distPath)) {
  console.log("[BUILD] dist/ not found — running vite build...");
  try {
    execSync("npx vite build", { cwd: join(__dirname2, ".."), stdio: "inherit", timeout: 120_000 });
    console.log("[BUILD] ✓ vite build completed");
  } catch (e: any) {
    console.error("[BUILD] ✗ vite build failed:", e.message || e);
  }
}

if (existsSync(distPath)) {
  app.use(express.static(distPath));
}

// ── V3 Route imports ─────────────────────────────────
import kpiRouter from "./routes/kpi.js";
import stocksRouter from "./routes/stocks.js";
import variantsRouter from "./routes/variants.js";

// ── V4 Route imports ─────────────────────────────────
import { newsRouter } from "./routes/news.js";
import { webcamsRouter } from "./routes/webcams.js";
import { intelligenceRouter } from "./routes/intelligence.js";

// ── Routes ────────────────────────────────────────────
app.use("/api/feed", feedRouter);
app.use("/api/risk", riskRouter);
app.use("/api/ollama", ollamaRouter);
app.use("/api/cortex", cortexRouter);
app.use("/api/kpi", kpiRouter);
app.use("/api/stocks", stocksRouter);
app.use("/api/variants", variantsRouter);
app.use("/api/news", newsRouter);
app.use("/api/webcams", webcamsRouter);
app.use("/api/intelligence", intelligenceRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    version: "4.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    variants: ["global", "tech", "finance", "fraud", "commodity", "happy"],
    endpoints: [
      "/api/feed", "/api/risk", "/api/ollama", "/api/cortex",
      "/api/kpi", "/api/stocks", "/api/variants",
      "/api/news", "/api/webcams", "/api/intelligence",
    ],
  });
});

// ── SPA fallback (serve index.html for non-API routes) ─
if (existsSync(distPath)) {
  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/socket.io")) {
      return next();
    }
    res.sendFile(join(distPath, "index.html"));
  });
}

// ── Socket.io Connection ──────────────────────────────
io.on("connection", (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);

  socket.on("feed:subscribe", (categories: string[]) => {
    categories.forEach((cat) => socket.join(`feed:${cat}`));
    console.log(`[WS] ${socket.id} subscribed to: ${categories.join(", ")}`);
  });

  socket.on("feed:unsubscribe", (categories: string[]) => {
    categories.forEach((cat) => socket.leave(`feed:${cat}`));
  });

  socket.on("country:focus", (country: string) => {
    socket.join(`country:${country}`);
    console.log(`[WS] ${socket.id} focused on: ${country}`);
  });

  socket.on("insight:request", async (prompt: string) => {
    // Forward to Ollama and stream back
    try {
      const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || "llama3.2:3b",
          prompt: `You are Deevo AI, a GCC insurance intelligence analyst. ${prompt}`,
          stream: false,
        }),
      });
      const data = await response.json() as { response?: string };
      socket.emit("insight:new", {
        id: `insight-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: "AI Analysis",
        content: data.response || "No response from model",
        confidence: 0.75,
        category: "risk",
        actionable: true,
        model: process.env.OLLAMA_MODEL || "llama3.2:3b",
      });
    } catch {
      socket.emit("insight:new", {
        id: `insight-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: "AI Offline",
        content: "Ollama is not available. Start Ollama locally for AI insights.",
        confidence: 0,
        category: "risk",
        actionable: false,
        model: "offline",
      });
    }
  });

  // V3: Variant-aware events
  socket.on("variant:switch", (variantId: string) => {
    // Leave all variant rooms, join the new one
    ["global", "tech", "finance", "fraud", "commodity", "happy"].forEach((v) => socket.leave(`variant:${v}`));
    socket.join(`variant:${variantId}`);
    console.log(`[WS] ${socket.id} switched to variant: ${variantId}`);
  });

  socket.on("kpi:subscribe", (variantId: string) => {
    socket.join(`kpi:${variantId}`);
    console.log(`[WS] ${socket.id} subscribed to KPIs for: ${variantId}`);
  });

  socket.on("fraud:subscribe", () => {
    socket.join("fraud:alerts");
    console.log(`[WS] ${socket.id} subscribed to fraud alerts`);
  });

  socket.on("stocks:subscribe", () => {
    socket.join("stocks:live");
    console.log(`[WS] ${socket.id} subscribed to stock updates`);
  });

  socket.on("disconnect", () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
  });
});

// ── Start Services ────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`\n  🌍 Deevo Monitor API Server v4.0.0`);
  console.log(`  ├─ HTTP:         http://localhost:${PORT}`);
  console.log(`  ├─ WS:           ws://localhost:${PORT}`);
  console.log(`  ├─ Health:       http://localhost:${PORT}/api/health`);
  console.log(`  ├─ KPI:          http://localhost:${PORT}/api/kpi`);
  console.log(`  ├─ Stocks:       http://localhost:${PORT}/api/stocks`);
  console.log(`  ├─ Variants:     http://localhost:${PORT}/api/variants`);
  console.log(`  ├─ News:         http://localhost:${PORT}/api/news`);
  console.log(`  ├─ Webcams:      http://localhost:${PORT}/api/webcams`);
  console.log(`  ├─ Intelligence: http://localhost:${PORT}/api/intelligence`);
  console.log(`  └─ CORS:         ${CORS_ORIGINS.join(", ")}\n`);

  // Start background services
  startFeedAggregator(io);
  startRiskEngine(io);
});
