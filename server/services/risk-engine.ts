/**
 * Risk Engine — Computes DRI levels and country risk scores.
 * Updates every 30s with simulated variance (production: pulls from Cortex).
 * Pushes updates to connected clients via Socket.io.
 */
import type { Server } from "socket.io";

type GCCCountryCode = "SA" | "AE" | "QA" | "KW" | "BH" | "OM";
type DRILevel = 1 | 2 | 3 | 4 | 5;

interface RiskComponents {
  fraud: number;
  claims: number;
  geopolitical: number;
  regulatory: number;
  weather: number;
  cyber: number;
}

interface CountryRisk {
  country: GCCCountryCode;
  overallScore: number;
  driLevel: DRILevel;
  components: RiskComponents;
  trend: "improving" | "stable" | "deteriorating";
  activeClaims: number;
  gwpMillions: number;
  lastUpdated: string;
}

// ── Baseline risk profiles per country ───────────────────
const BASELINES: Record<GCCCountryCode, { components: RiskComponents; claims: number; gwp: number }> = {
  SA: { components: { fraud: 42, claims: 55, geopolitical: 30, regulatory: 35, weather: 25, cyber: 38 }, claims: 12470, gwp: 980 },
  AE: { components: { fraud: 48, claims: 52, geopolitical: 25, regulatory: 28, weather: 20, cyber: 45 }, claims: 15800, gwp: 1250 },
  QA: { components: { fraud: 35, claims: 40, geopolitical: 38, regulatory: 22, weather: 15, cyber: 30 }, claims: 5670, gwp: 420 },
  KW: { components: { fraud: 38, claims: 45, geopolitical: 32, regulatory: 30, weather: 28, cyber: 25 }, claims: 4450, gwp: 380 },
  BH: { components: { fraud: 30, claims: 35, geopolitical: 20, regulatory: 25, weather: 12, cyber: 28 }, claims: 3120, gwp: 210 },
  OM: { components: { fraud: 28, claims: 38, geopolitical: 22, regulatory: 28, weather: 35, cyber: 20 }, claims: 2890, gwp: 180 },
};

const UPDATE_INTERVAL_MS = 30_000; // 30 seconds

// ── State ────────────────────────────────────────────────
let countryRisks: Map<GCCCountryCode, CountryRisk> = new Map();
let currentDRI: DRILevel = 2;

function jitter(base: number, variance: number): number {
  return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * 2 * variance));
}

function computeDRI(score: number): DRILevel {
  if (score >= 80) return 5;
  if (score >= 65) return 4;
  if (score >= 50) return 3;
  if (score >= 30) return 2;
  return 1;
}

function determineTrend(current: number, _country: GCCCountryCode): "improving" | "stable" | "deteriorating" {
  const prev = countryRisks.get(_country)?.overallScore ?? current;
  const delta = current - prev;
  if (delta > 3) return "deteriorating";
  if (delta < -3) return "improving";
  return "stable";
}

function computeCountryRisks(): void {
  const countries: GCCCountryCode[] = ["SA", "AE", "QA", "KW", "BH", "OM"];

  for (const code of countries) {
    const baseline = BASELINES[code];
    const components: RiskComponents = {
      fraud: jitter(baseline.components.fraud, 8),
      claims: jitter(baseline.components.claims, 6),
      geopolitical: jitter(baseline.components.geopolitical, 5),
      regulatory: jitter(baseline.components.regulatory, 4),
      weather: jitter(baseline.components.weather, 10),
      cyber: jitter(baseline.components.cyber, 7),
    };

    const weights = { fraud: 0.25, claims: 0.20, geopolitical: 0.15, regulatory: 0.15, weather: 0.10, cyber: 0.15 };
    const overallScore = Math.round(
      components.fraud * weights.fraud +
      components.claims * weights.claims +
      components.geopolitical * weights.geopolitical +
      components.regulatory * weights.regulatory +
      components.weather * weights.weather +
      components.cyber * weights.cyber
    );

    const risk: CountryRisk = {
      country: code,
      overallScore,
      driLevel: computeDRI(overallScore),
      components: {
        fraud: Math.round(components.fraud),
        claims: Math.round(components.claims),
        geopolitical: Math.round(components.geopolitical),
        regulatory: Math.round(components.regulatory),
        weather: Math.round(components.weather),
        cyber: Math.round(components.cyber),
      },
      trend: determineTrend(overallScore, code),
      activeClaims: Math.round(jitter(baseline.claims, baseline.claims * 0.05)),
      gwpMillions: Math.round(jitter(baseline.gwp, baseline.gwp * 0.02)),
      lastUpdated: new Date().toISOString(),
    };

    countryRisks.set(code, risk);
  }

  // Global DRI = max of all country DRIs
  const maxDRI = Math.max(...Array.from(countryRisks.values()).map((r) => r.driLevel)) as DRILevel;
  currentDRI = maxDRI;
}

// ── Public API ───────────────────────────────────────────
export function getCountryRisks(): CountryRisk[] {
  return Array.from(countryRisks.values());
}

export function getCountryRisk(code: string): CountryRisk | undefined {
  return countryRisks.get(code as GCCCountryCode);
}

export function getDRILevel(): DRILevel {
  return currentDRI;
}

export function startRiskEngine(io: Server): void {
  // Initial computation
  computeCountryRisks();
  console.log(`[Risk] Initial DRI: ${currentDRI} — ${countryRisks.size} countries loaded`);

  // Recurring updates
  setInterval(() => {
    const prevDRI = currentDRI;
    computeCountryRisks();

    // Push updates
    for (const risk of countryRisks.values()) {
      io.emit("risk:update", risk);
      io.to(`country:${risk.country}`).emit("risk:update", risk);
    }

    // DRI change notification
    if (currentDRI !== prevDRI) {
      io.emit("dri:change", currentDRI);
      console.log(`[Risk] DRI changed: ${prevDRI} → ${currentDRI}`);
    }

    // Pipeline stats broadcast
    io.emit("pipeline:stats", {
      fnolVolume24h: Math.round(300 + Math.random() * 100),
      fraudDetectionRate: parseFloat((0.10 + Math.random() * 0.05).toFixed(3)),
      stpRate: parseFloat((0.65 + Math.random() * 0.10).toFixed(3)),
      gwpTotal: 2_450_000_000 + Math.round(Math.random() * 50_000_000),
      activePolicies: 1_247_000 + Math.round(Math.random() * 5_000),
      openClaims: 34_000 + Math.round(Math.random() * 2_000),
      avgClaimCycleHours: parseFloat((68 + Math.random() * 10).toFixed(1)),
      lastUpdated: new Date().toISOString(),
    });
  }, UPDATE_INTERVAL_MS);

  console.log(`[Risk] Engine started — updating every ${UPDATE_INTERVAL_MS / 1000}s`);
}
