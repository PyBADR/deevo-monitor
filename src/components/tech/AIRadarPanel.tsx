/**
 * AIRadarPanel — Tech variant panel showing AI/ML model status,
 * inference metrics, and pipeline health in radar-style display.
 */
import { useVariant } from '@/variants';
import { SparklineChart } from '@/components/kpi/SparklineChart';
import type { SparklinePoint } from '@/kpi/kpi.types';

interface ModelStatus {
  id: string;
  name: string;
  version: string;
  status: 'running' | 'training' | 'degraded' | 'offline';
  accuracy: number;
  latencyP99: number;
  requestsPerMin: number;
  driftScore: number;
  sparkline: SparklinePoint[];
}

// Mock data — in production would come from /api/ai/models
const MODELS: ModelStatus[] = [
  {
    id: 'fraud-detect-v4', name: 'FraudDetect', version: 'v4.2.1',
    status: 'running', accuracy: 94.7, latencyP99: 48, requestsPerMin: 1240,
    driftScore: 0.023, sparkline: generateSparkline(94, 1),
  },
  {
    id: 'claims-triage-v3', name: 'ClaimsTriage', version: 'v3.8.0',
    status: 'running', accuracy: 91.2, latencyP99: 62, requestsPerMin: 890,
    driftScore: 0.018, sparkline: generateSparkline(91, 1.5),
  },
  {
    id: 'risk-score-v2', name: 'RiskScorer', version: 'v2.5.3',
    status: 'running', accuracy: 88.4, latencyP99: 35, requestsPerMin: 2100,
    driftScore: 0.012, sparkline: generateSparkline(88, 2),
  },
  {
    id: 'nlp-summarizer', name: 'NewsSummarizer', version: 'v1.4.0',
    status: 'running', accuracy: 96.1, latencyP99: 420, requestsPerMin: 180,
    driftScore: 0.008, sparkline: generateSparkline(96, 0.5),
  },
  {
    id: 'geospatial-risk', name: 'GeoRisk', version: 'v2.1.0',
    status: 'training', accuracy: 85.6, latencyP99: 180, requestsPerMin: 0,
    driftScore: 0.041, sparkline: generateSparkline(85, 3),
  },
  {
    id: 'sentiment-ar', name: 'SentimentAR', version: 'v1.2.0',
    status: 'running', accuracy: 82.3, latencyP99: 95, requestsPerMin: 340,
    driftScore: 0.031, sparkline: generateSparkline(82, 2),
  },
];

function generateSparkline(base: number, variance: number): SparklinePoint[] {
  const now = Date.now();
  return Array.from({ length: 30 }, (_, i) => ({
    t: now - (30 - i) * 3600_000,
    v: +(base + (Math.random() - 0.5) * variance).toFixed(2),
  }));
}

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  running: { label: 'RUNNING', color: '#10B981' },
  training: { label: 'TRAINING', color: '#7C3AED' },
  degraded: { label: 'DEGRADED', color: '#F59E0B' },
  offline: { label: 'OFFLINE', color: '#6B7280' },
};

export function AIRadarPanel() {
  const { variant } = useVariant();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold" style={{ color: variant.colors.primary }}>
            AI MODEL RADAR
          </span>
          <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>
            {MODELS.filter((m) => m.status === 'running').length}/{MODELS.length} ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Stat label="AVG ACCURACY" value="89.7%" color="#10B981" />
          <Stat label="AVG LATENCY" value="140ms" color={variant.colors.primary} />
          <Stat label="TOTAL RPM" value="4,750" color={variant.colors.primary} />
        </div>
      </div>

      {/* Model grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {MODELS.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ModelCard({ model }: { model: ModelStatus }) {
  const { variant } = useVariant();
  const st = STATUS_STYLES[model.status] ?? STATUS_STYLES['running']!;
  const driftWarning = model.driftScore > 0.03;

  return (
    <div
      className="p-2.5 rounded-lg border"
      style={{ borderColor: variant.colors.border }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold" style={{ color: variant.colors.text }}>
            {model.name}
          </span>
          <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>
            {model.version}
          </span>
        </div>
        <span
          className="text-[7px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${st.color}20`, color: st.color }}
        >
          {st.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-1.5">
        <MiniStat label="Accuracy" value={`${model.accuracy}%`} />
        <MiniStat label="P99" value={`${model.latencyP99}ms`} />
        <MiniStat label="RPM" value={model.requestsPerMin.toLocaleString()} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span
            className="text-[8px] font-mono"
            style={{ color: driftWarning ? '#F59E0B' : variant.colors.textMuted }}
          >
            DRIFT: {model.driftScore.toFixed(3)}
          </span>
          {driftWarning && <span className="text-[8px]">⚠️</span>}
        </div>
        <SparklineChart data={model.sparkline} color={variant.colors.primary} width={48} height={14} />
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[8px] font-mono text-gray-500">{label}</span>
      <span className="text-[10px] font-mono font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  const { variant } = useVariant();
  return (
    <div>
      <div className="text-[7px] font-mono" style={{ color: variant.colors.textMuted }}>{label}</div>
      <div className="text-[10px] font-mono font-bold" style={{ color: variant.colors.text }}>{value}</div>
    </div>
  );
}
