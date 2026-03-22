/**
 * Cross-Stream Correlation Engine — worldmonitor parity.
 * Detects convergence across military, economic, disaster, and escalation signals.
 * Outputs correlation alerts when multiple independent streams align.
 *
 * Architecture Layer: Models → Agents (LangGraph intelligence stack L3–L4)
 */

export type StreamType = 'military' | 'economic' | 'disaster' | 'escalation' | 'cyber' | 'regulatory' | 'social';

export interface StreamSignal {
  id: string;
  stream: StreamType;
  timestamp: number;
  lat: number;
  lng: number;
  severity: number;       // 0–100
  confidence: number;     // 0–1
  title: string;
  description: string;
  source: string;
  region: string;          // GCC country code or 'GLOBAL'
  tags: string[];
}

export interface Correlation {
  id: string;
  signals: StreamSignal[];
  convergenceScore: number;   // 0–100 composite
  temporalWindow: number;     // ms window in which signals converged
  spatialRadius: number;      // km radius of geographic clustering
  category: string;
  title: string;
  description: string;
  detectedAt: number;
  regions: string[];
  escalationProbability: number; // 0–1
}

export interface CorrelationConfig {
  temporalWindowMs: number;      // Max time gap between signals (default: 6h)
  spatialRadiusKm: number;       // Max geo distance for clustering (default: 500km)
  minStreams: number;             // Min distinct stream types to fire (default: 2)
  minConvergenceScore: number;   // Min composite score threshold (default: 40)
}

const DEFAULT_CONFIG: CorrelationConfig = {
  temporalWindowMs: 6 * 60 * 60 * 1000,  // 6 hours
  spatialRadiusKm: 500,
  minStreams: 2,
  minConvergenceScore: 40,
};

/**
 * Haversine distance between two lat/lng points in km.
 */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Compute convergence score from a cluster of signals.
 * Factors: stream diversity, severity amplitude, temporal tightness, confidence.
 */
function computeConvergence(signals: StreamSignal[], config: CorrelationConfig): number {
  const streams = new Set(signals.map((s) => s.stream));
  const streamDiversity = streams.size / 7; // 7 possible stream types

  const avgSeverity = signals.reduce((a, s) => a + s.severity, 0) / signals.length;
  const avgConfidence = signals.reduce((a, s) => a + s.confidence, 0) / signals.length;

  const timestamps = signals.map((s) => s.timestamp);
  const timeSpan = Math.max(...timestamps) - Math.min(...timestamps);
  const temporalTightness = 1 - Math.min(timeSpan / config.temporalWindowMs, 1);

  // Weighted composite
  return Math.round(
    streamDiversity * 30 +
    (avgSeverity / 100) * 25 +
    temporalTightness * 20 +
    avgConfidence * 25
  );
}

/**
 * Run correlation detection on a set of signals.
 * Groups by spatiotemporal proximity, then scores convergence.
 */
export function detectCorrelations(
  signals: StreamSignal[],
  config: Partial<CorrelationConfig> = {},
): Correlation[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const correlations: Correlation[] = [];
  const used = new Set<string>();

  // Sort by timestamp (newest first)
  const sorted = [...signals].sort((a, b) => b.timestamp - a.timestamp);

  for (let i = 0; i < sorted.length; i++) {
    const anchorItem = sorted[i]!;
    if (used.has(anchorItem.id)) continue;

    const anchor = anchorItem;
    const cluster: StreamSignal[] = [anchor];

    for (let j = i + 1; j < sorted.length; j++) {
      const candidateItem = sorted[j]!;
      if (used.has(candidateItem.id)) continue;

      const candidate = candidateItem;
      const timeDelta = Math.abs(anchor.timestamp - candidate.timestamp);
      const distKm = haversineKm(anchor.lat, anchor.lng, candidate.lat, candidate.lng);

      if (timeDelta <= cfg.temporalWindowMs && distKm <= cfg.spatialRadiusKm) {
        cluster.push(candidate);
      }
    }

    // Check minimum stream diversity
    const streams = new Set(cluster.map((s) => s.stream));
    if (streams.size < cfg.minStreams) continue;

    const score = computeConvergence(cluster, cfg);
    if (score < cfg.minConvergenceScore) continue;

    // Mark signals as used
    cluster.forEach((s) => used.add(s.id));

    const regions = [...new Set(cluster.map((s) => s.region))];

    correlations.push({
      id: `corr-${Date.now()}-${i}`,
      signals: cluster,
      convergenceScore: score,
      temporalWindow: Math.max(...cluster.map((s) => s.timestamp)) - Math.min(...cluster.map((s) => s.timestamp)),
      spatialRadius: Math.max(
        ...cluster.map((s) => haversineKm(anchor.lat, anchor.lng, s.lat, s.lng))
      ),
      category: [...streams].join('+'),
      title: `${streams.size}-stream convergence: ${[...streams].join(', ')}`,
      description: `Detected ${cluster.length} correlated signals across ${streams.size} streams within ${Math.round(cfg.spatialRadiusKm)}km radius.`,
      detectedAt: Date.now(),
      regions,
      escalationProbability: Math.min(score / 100, 0.95),
    });
  }

  return correlations.sort((a, b) => b.convergenceScore - a.convergenceScore);
}

/**
 * Generate mock cross-stream signals for the GCC region.
 * Used until live feeds are connected.
 */
export function generateMockSignals(count = 30): StreamSignal[] {
  const streams: StreamType[] = ['military', 'economic', 'disaster', 'escalation', 'cyber', 'regulatory', 'social'];
  const gccPoints = [
    { lat: 24.7, lng: 46.7, region: 'SA' },   // Riyadh
    { lat: 25.3, lng: 55.3, region: 'AE' },   // Dubai
    { lat: 25.4, lng: 51.5, region: 'QA' },   // Doha
    { lat: 29.4, lng: 47.9, region: 'KW' },   // Kuwait City
    { lat: 26.2, lng: 50.6, region: 'BH' },   // Manama
    { lat: 23.6, lng: 58.5, region: 'OM' },   // Muscat
    { lat: 26.6, lng: 56.3, region: 'HORMUZ' },
    { lat: 12.6, lng: 43.3, region: 'BAB' },
  ];

  const sources = ['OSINT', 'SIGINT', 'HUMINT', 'FININT', 'CYBINT'] as const;

  return Array.from({ length: count }, (_, i) => {
    const point = gccPoints[i % gccPoints.length]!;
    const stream = streams[i % streams.length]!;
    const source = sources[i % sources.length]!;
    return {
      id: `sig-${Date.now()}-${i}`,
      stream,
      timestamp: Date.now() - Math.random() * 12 * 60 * 60 * 1000,
      lat: point.lat + (Math.random() - 0.5) * 2,
      lng: point.lng + (Math.random() - 0.5) * 2,
      severity: Math.round(30 + Math.random() * 70),
      confidence: +(0.4 + Math.random() * 0.6).toFixed(2),
      title: `${stream.toUpperCase()} signal near ${point.region}`,
      description: `Automated ${stream} intelligence signal detected in the ${point.region} theater.`,
      source,
      region: point.region,
      tags: [stream, point.region.toLowerCase()],
    };
  });
}
