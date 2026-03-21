/**
 * Deevo Monitor v2 — API Server
 * Express + Socket.io backend providing:
 *   1. RSS feed aggregation from GCC insurance/regulatory sources
 *   2. Ollama AI proxy for local LLM insights
 *   3. Real-time risk engine computing DRI levels
 *   4. Cortex bridge to DeevoAnalytics backend
 *   5. WebSocket push for live dashboard updates
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
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5174";

const app = express();
const httpServer = createServer(app);

// ── Socket.io ─────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGIN, methods: ["GET", "POST"] },
  transports: ["websocket", "polling"],
});

// Make io available to routes
app.set("io", io);

// ── Middleware ─────────────────────────────────────────
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────
app.use("/api/feed", feedRouter);
app.use("/api/risk", riskRouter);
app.use("/api/ollama", ollamaRouter);
app.use("/api/cortex", cortexRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    version: "2.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

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
      const response = await fetch("http://localhost:11434/api/generate", {
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

  socket.on("disconnect", () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
  });
});

// ── Start Services ────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`\n  🌍 Deevo Monitor API Server v2.0.0`);
  console.log(`  ├─ HTTP:   http://localhost:${PORT}`);
  console.log(`  ├─ WS:     ws://localhost:${PORT}`);
  console.log(`  ├─ Health: http://localhost:${PORT}/api/health`);
  console.log(`  └─ CORS:   ${CORS_ORIGIN}\n`);

  // Start background services
  startFeedAggregator(io);
  startRiskEngine(io);
});
