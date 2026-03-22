/**
 * StrategicPosture — AI Strategic Posture panel (worldmonitor-style).
 * Displays theater-level strategic assessments with severity levels.
 * Also includes World Brief and AI Forecasts sections.
 */
import { useState } from 'react';
import { clsx } from 'clsx';
import { useVariant } from '@/variants';
import { useDataStore } from '@/stores/dataStore';

type PostureLevel = 'CRIT' | 'HIGH' | 'ELEV' | 'MON' | 'LOW';

interface TheaterAssessment {
  id: string;
  name: string;
  level: PostureLevel;
  threats: number;
  opportunities: number;
  trend: 'escalating' | 'stable' | 'de-escalating';
  description: string;
  lastUpdate: string;
}

const POSTURE_COLORS: Record<PostureLevel, string> = {
  CRIT: '#FF3B30',
  HIGH: '#FF6B00',
  ELEV: '#FFD600',
  MON: '#00D4FF',
  LOW: '#34C759',
};

const THEATER_DATA: TheaterAssessment[] = [
  {
    id: 'iran',
    name: 'Iran Theater',
    level: 'CRIT',
    threats: 12,
    opportunities: 2,
    trend: 'escalating',
    description: 'IRGC proxy escalation across Strait of Hormuz, Red Sea, and Levant. Direct missile capability demonstrated.',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'gulf',
    name: 'Gulf Security',
    level: 'ELEV',
    threats: 5,
    opportunities: 4,
    trend: 'stable',
    description: 'GCC maritime security posture elevated. Houthi anti-shipping campaign continues in Red Sea.',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'levant',
    name: 'Levant / Syria',
    level: 'HIGH',
    threats: 8,
    opportunities: 1,
    trend: 'escalating',
    description: 'Multi-front escalation risk: Hezbollah, Syrian theater, Israeli operations. Cross-border spillover.',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'africa',
    name: 'North Africa',
    level: 'MON',
    threats: 3,
    opportunities: 3,
    trend: 'stable',
    description: 'Libya fragmentation ongoing. Sudan civil war generating displacement. Sahel instability.',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'cyber',
    name: 'Cyber Domain',
    level: 'HIGH',
    threats: 9,
    opportunities: 2,
    trend: 'escalating',
    description: 'Iranian APT groups targeting GCC financial infrastructure. Ransomware surge in insurance sector.',
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'economic',
    name: 'Economic Warfare',
    level: 'ELEV',
    threats: 4,
    opportunities: 5,
    trend: 'de-escalating',
    description: 'Sanctions regime complexity increasing. De-dollarization trends. GCC sovereign wealth diversification.',
    lastUpdate: new Date().toISOString(),
  },
];

interface ForecastItem {
  id: string;
  category: string;
  icon: string;
  label: string;
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
}

const AI_FORECASTS: ForecastItem[] = [
  { id: 'f1', category: 'conflict', icon: '⚔', label: 'Regional Escalation', probability: 0.72, impact: 'critical', timeframe: '30d' },
  { id: 'f2', category: 'market', icon: '📉', label: 'Oil Price Shock', probability: 0.45, impact: 'high', timeframe: '90d' },
  { id: 'f3', category: 'supply_chain', icon: '🚢', label: 'Red Sea Disruption', probability: 0.81, impact: 'high', timeframe: '14d' },
  { id: 'f4', category: 'political', icon: '🏛', label: 'Regulatory Shift', probability: 0.38, impact: 'medium', timeframe: '180d' },
  { id: 'f5', category: 'military', icon: '🎯', label: 'Strait of Hormuz Incident', probability: 0.29, impact: 'critical', timeframe: '60d' },
  { id: 'f6', category: 'cyber', icon: '💻', label: 'GCC Financial Cyberattack', probability: 0.55, impact: 'high', timeframe: '30d' },
  { id: 'f7', category: 'infra', icon: '⚡', label: 'Infrastructure Disruption', probability: 0.33, impact: 'high', timeframe: '90d' },
];

export function StrategicPosture() {
  const { variant } = useVariant();
  const [tab, setTab] = useState<'posture' | 'forecasts' | 'brief'>('posture');
  const insights = useDataStore((s) => s.insights);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-3 py-1.5 border-b flex items-center gap-2 shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <span className="text-sm font-bold" style={{ color: variant.colors.text }}>
          AI STRATEGIC POSTURE
        </span>
        <span className="text-[8px] font-mono bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
          ● NEW
        </span>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-0.5 px-2 py-1 border-b shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        {(['posture', 'forecasts', 'brief'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm transition-colors uppercase',
              tab === t ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            )}
            style={
              tab === t
                ? { backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary }
                : undefined
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'posture' && <PostureView theaters={THEATER_DATA} />}
        {tab === 'forecasts' && <ForecastView forecasts={AI_FORECASTS} />}
        {tab === 'brief' && <WorldBrief insights={insights} />}
      </div>
    </div>
  );
}

function PostureView({ theaters }: { theaters: TheaterAssessment[] }) {
  const { variant } = useVariant();
  return (
    <div className="p-2 space-y-1">
      {theaters.map((theater) => (
        <div
          key={theater.id}
          className="rounded p-2 border"
          style={{
            borderColor: `${POSTURE_COLORS[theater.level]}30`,
            backgroundColor: `${POSTURE_COLORS[theater.level]}08`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold" style={{ color: variant.colors.text }}>
              {theater.name}
            </span>
            <span
              className="text-[9px] font-mono font-bold px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${POSTURE_COLORS[theater.level]}25`,
                color: POSTURE_COLORS[theater.level],
              }}
            >
              {theater.level}
            </span>
          </div>
          <div className="text-[10px] mt-1" style={{ color: variant.colors.textSecondary }}>
            {theater.description}
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[9px] font-mono text-red-400">✕ {theater.threats}</span>
            <span className="text-[9px] font-mono text-green-400">▲ {theater.opportunities}</span>
            <span
              className={clsx(
                'text-[9px] font-mono',
                theater.trend === 'escalating' && 'text-red-400',
                theater.trend === 'stable' && 'text-amber-400',
                theater.trend === 'de-escalating' && 'text-green-400'
              )}
            >
              → {theater.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ForecastView({ forecasts }: { forecasts: ForecastItem[] }) {
  const { variant } = useVariant();
  return (
    <div className="p-2 space-y-1">
      {forecasts.map((f) => (
        <div
          key={f.id}
          className="flex items-center gap-2 rounded p-2 border"
          style={{ borderColor: variant.colors.border }}
        >
          <span className="text-sm">{f.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold" style={{ color: variant.colors.text }}>
              {f.label}
            </div>
            <div className="text-[9px]" style={{ color: variant.colors.textMuted }}>
              {f.timeframe} outlook
            </div>
          </div>
          {/* Probability bar */}
          <div className="w-16">
            <div className="h-1.5 rounded-full bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${f.probability * 100}%`,
                  backgroundColor:
                    f.probability > 0.7 ? '#FF3B30' : f.probability > 0.4 ? '#FF9500' : '#34C759',
                }}
              />
            </div>
            <div
              className="text-[8px] font-mono text-right mt-0.5"
              style={{ color: variant.colors.textMuted }}
            >
              {Math.round(f.probability * 100)}%
            </div>
          </div>
          <span
            className={clsx(
              'text-[8px] font-mono px-1 py-0.5 rounded',
              f.impact === 'critical' && 'bg-red-500/20 text-red-400',
              f.impact === 'high' && 'bg-orange-500/20 text-orange-400',
              f.impact === 'medium' && 'bg-amber-500/20 text-amber-400',
              f.impact === 'low' && 'bg-green-500/20 text-green-400'
            )}
          >
            {f.impact.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}

function WorldBrief({ insights }: { insights: Array<{ id: string; title: string; content: string; confidence: number }> }) {
  const { variant } = useVariant();
  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-red-400">●</span>
        <span className="text-[11px] font-bold" style={{ color: variant.colors.text }}>
          WORLD BRIEF
        </span>
      </div>
      {insights.length > 0 ? (
        <div className="space-y-3">
          {insights.slice(0, 3).map((insight) => (
            <div key={insight.id}>
              <div className="text-[11px] font-bold mb-1" style={{ color: variant.colors.text }}>
                {insight.title}
              </div>
              <div className="text-[10px] leading-relaxed" style={{ color: variant.colors.textSecondary }}>
                {insight.content.slice(0, 400)}
                {insight.content.length > 400 && '...'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[11px] leading-relaxed" style={{ color: variant.colors.textSecondary }}>
          Regional tensions remain elevated across multiple theaters. The Gulf maritime corridor faces
          ongoing disruption from Houthi anti-shipping operations. Insurance market exposure to
          geopolitical risk has increased significantly, with reinsurers adjusting pricing for
          war-adjacent perils. GCC regulators have issued advisories on cyber resilience and business
          continuity planning. AI-driven intelligence synthesis is active — connect Ollama for
          real-time analysis.
        </div>
      )}
    </div>
  );
}
