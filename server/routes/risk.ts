/**
 * Risk Router — Country-level risk aggregation and DRI computation.
 * GET /api/risk/countries     — All 6 GCC country risk scores
 * GET /api/risk/dri           — Current DRI level
 * GET /api/risk/:country      — Single country risk detail
 */
import { Router } from "express";
import { getCountryRisks, getDRILevel, getCountryRisk } from "../services/risk-engine.js";

export const riskRouter = Router();

riskRouter.get("/countries", (_req, res) => {
  res.json({
    data: getCountryRisks(),
    meta: {
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      source: "deevo-risk-engine",
    },
  });
});

riskRouter.get("/dri", (_req, res) => {
  res.json({
    data: { level: getDRILevel(), timestamp: new Date().toISOString() },
    meta: {
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      source: "deevo-risk-engine",
    },
  });
});

riskRouter.get("/:country", (req, res) => {
  const country = req.params.country?.toUpperCase();
  const risk = getCountryRisk(country);
  if (!risk) {
    res.status(404).json({ error: "Country not found", code: "COUNTRY_NOT_FOUND" });
    return;
  }
  res.json({
    data: risk,
    meta: {
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      source: "deevo-risk-engine",
    },
  });
});
