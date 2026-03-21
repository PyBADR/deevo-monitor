/**
 * Feed Router — RSS aggregation from GCC insurance/regulatory sources.
 * GET /api/feed          — Latest feed items (paginated)
 * GET /api/feed/sources  — List of active RSS sources
 */
import { Router } from "express";
import { getFeedItems, getFeedSources } from "../services/feed-aggregator.js";

export const feedRouter = Router();

feedRouter.get("/", (_req, res) => {
  const limit = Math.min(parseInt(String(_req.query.limit) || "50", 10), 200);
  const category = _req.query.category as string | undefined;
  const items = getFeedItems({ limit, category });

  res.json({
    data: items,
    meta: {
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      source: "deevo-monitor-feed",
      count: items.length,
    },
  });
});

feedRouter.get("/sources", (_req, res) => {
  res.json({
    data: getFeedSources(),
    meta: {
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      source: "deevo-monitor-feed",
    },
  });
});
