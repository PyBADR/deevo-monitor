/**
 * DEEVO Causal Intelligence — Forecasting Engine
 * Layer: Models (L3)
 *
 * Deterministic trend + volatility forecasting.
 * No complex ML — moving averages, signal density, and rule-based projections.
 */
import type { EventCluster, Forecast } from './types';

// ── Trend Direction from Signal Density ──────────────────
function trendFromDensity(cluster: EventCluster): 'up' | 'down' | 'stable' {
  if (cluster.signalCount >= 5 && cluster.riskScore >= 60) return 'up';
  if (cluster.signalCount >= 3 && cluster.riskScore >= 40) return 'up';
  if (cluster.isEvolving) return 'up';
  return 'stable';
}

function magnitudeFromScore(score: number): 'minor' | 'moderate' | 'major' {
  if (score >= 75) return 'major';
  if (score >= 45) return 'moderate';
  return 'minor';
}

// ── Category-Specific Forecast Rules ─────────────────────
interface ForecastRule {
  category: string;
  metric: string;
  horizons: Array<'24h' | '7d' | '30d'>;
}

const FORECAST_RULES: ForecastRule[] = [
  { category: 'geopolitics', metric: 'GCC Political Risk Index', horizons: ['24h', '7d', '30d'] },
  { category: 'oil-gas', metric: 'Oil Price Pressure', horizons: ['24h', '7d', '30d'] },
  { category: 'maritime', metric: 'Maritime Disruption Probability', horizons: ['24h', '7d'] },
  { category: 'supply-chain', metric: 'Supply Chain Stress Index', horizons: ['7d', '30d'] },
  { category: 'insurance', metric: 'Claims Escalation Probability', horizons: ['7d', '30d'] },
  { category: 'regulation', metric: 'Regulatory Impact Score', horizons: ['30d'] },
  { category: 'climate', metric: 'CAT Event Probability', horizons: ['24h', '7d'] },
  { category: 'fraud', metric: 'Fraud Ring Activity Index', horizons: ['7d', '30d'] },
  { category: 'cyber', metric: 'Cyber Threat Level', horizons: ['24h', '7d'] },
  { category: 'finance', metric: 'GCC Market Volatility', horizons: ['24h', '7d', '30d'] },
];

// ── Generate Forecasts for a Cluster ─────────────────────
export function generateForecasts(cluster: EventCluster): Forecast[] {
  const forecasts: Forecast[] = [];
  const direction = trendFromDensity(cluster);
  const magnitude = magnitudeFromScore(cluster.riskScore);

  for (const rule of FORECAST_RULES) {
    if (rule.category === cluster.category) {
      for (const horizon of rule.horizons) {
        const baseProbability = cluster.riskScore / 100;
        const horizonDecay = horizon === '24h' ? 1.0 : horizon === '7d' ? 0.8 : 0.6;
        forecasts.push({
          metric: rule.metric,
          direction,
          magnitude,
          horizon,
          probability: Math.round(baseProbability * horizonDecay * 100) / 100,
          basedOn: cluster.signals.map(s => s.id),
        });
      }
    }
  }
  return forecasts;
}
