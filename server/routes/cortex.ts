/**
 * Cortex Router — Bridge to DeevoAnalytics Cortex backend.
 * Proxies requests to the Cortex Monitor Bridge endpoints.
 * Falls back to local mock data when Cortex is unavailable.
 *
 * GET /api/cortex/feed          — Intelligence feed from Cortex
 * GET /api/cortex/country-risk  — Country risk from Cortex
 * GET /api/cortex/pipeline      — Pipeline stats from Cortex
 * GET /api/cortex/status        — Cortex connection status
 */
import { Router } from "express";

const CORTEX_BASE =
  process.env.CORTEX_URL || "http://localhost:8010/api/v1/cortex";

export const cortexRouter = Router();

async function proxyToCortex(path: string): Promise<unknown> {
  const response = await fetch(`${CORTEX_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.CORTEX_TOKEN || "dev-token"}`,
      "X-Tenant-ID": process.env.CORTEX_TENANT || "default",
    },
  });
  if (!response.ok) throw new Error(`Cortex ${response.status}`);
  return response.json();
}

cortexRouter.get("/status", async (_req, res) => {
  try {
    await fetch(`${CORTEX_BASE}/monitor/feed`);
    res.json({ status: "connected", url: CORTEX_BASE });
  } catch {
    res.json({ status: "disconnected", url: CORTEX_BASE, fallback: "local" });
  }
});

cortexRouter.get("/feed", async (_req, res) => {
  try {
    const data = await proxyToCortex("/monitor/feed");
    res.json(data);
  } catch {
    res.json({
      data: [],
      meta: { source: "local-fallback", timestamp: new Date().toISOString() },
    });
  }
});

cortexRouter.get("/country-risk", async (_req, res) => {
  try {
    const data = await proxyToCortex("/monitor/country-risk");
    res.json(data);
  } catch {
    res.json({
      data: [],
      meta: { source: "local-fallback", timestamp: new Date().toISOString() },
    });
  }
});

cortexRouter.get("/pipeline", async (_req, res) => {
  try {
    const data = await proxyToCortex("/monitor/pipeline-stats");
    res.json(data);
  } catch {
    // Fallback mock pipeline stats
    res.json({
      data: {
        fnolVolume24h: 342,
        fraudDetectionRate: 0.127,
        stpRate: 0.68,
        gwpTotal: 2_450_000_000,
        activePolicies: 1_247_000,
        openClaims: 34_521,
        avgClaimCycleHours: 72.4,
        lastUpdated: new Date().toISOString(),
      },
      meta: { source: "local-fallback", timestamp: new Date().toISOString() },
    });
  }
});
