/**
 * DEEVO Intelligence Monitor v3 — Architecture View
 * Contract 5 / Panel 5 of 7
 * Layer: UI (L6)
 *
 * Visual representation of the 7-layer intelligence stack.
 * Each layer shows status, throughput, and active services.
 */

import { useState } from 'react';

interface LayerData {
  id: string;
  name: string;
  nameAr: string;
  level: number;
  color: string;
  status: 'healthy' | 'degraded' | 'down';
  throughput: string;
  services: string[];
  description: string;
}

const LAYERS: LayerData[] = [
  { id: 'governance', name: 'Governance', nameAr: 'الحوكمة', level: 7, color: '#ef4444', status: 'healthy', throughput: '100%', services: ['Audit Chain', 'PDPL', 'IFRS17'], description: 'SHA-256 audit trails, compliance gates, human-in-the-loop' },
  { id: 'ui', name: 'UI', nameAr: 'واجهة المستخدم', level: 6, color: '#f5a623', status: 'healthy', throughput: '60fps', services: ['React', 'MapLibre', 'Charts'], description: 'Interactive dashboards, RTL Arabic, responsive panels' },
  { id: 'apis', name: 'APIs', nameAr: 'واجهات البرمجة', level: 5, color: '#8b5cf6', status: 'healthy', throughput: '1.2k/s', services: ['REST', 'WebSocket', 'EventBus'], description: 'Real-time events, cached endpoints, variant routing' },
  { id: 'agents', name: 'Agents', nameAr: 'الوكلاء', level: 4, color: '#22c55e', status: 'healthy', throughput: '45/min', services: ['Ollama', 'LangGraph', 'Reasoning'], description: 'Explainable AI chains, decision generation, fallback mode' },
  { id: 'models', name: 'Models', nameAr: 'النماذج', level: 3, color: '#06b6d4', status: 'healthy', throughput: '6 rules', services: ['Correlation', 'Scoring', 'Forecast'], description: '6 correlation rules, risk scoring, time-series forecast' },
  { id: 'features', name: 'Features', nameAr: 'الميزات', level: 2, color: '#3b82f6', status: 'healthy', throughput: '200+', services: ['NLP', 'Geo', 'Entity'], description: 'Signal classification, entity extraction, geo-mapping' },
  { id: 'data', name: 'Data', nameAr: 'البيانات', level: 1, color: '#78716c', status: 'healthy', throughput: '600+', services: ['RSS', 'GDELT', 'APIs'], description: '600+ feeds, 34 entities, 3-tier cache, health tracking' },
];

const STATUS_COLORS = { healthy: '#22c55e', degraded: '#f5a623', down: '#ef4444' };

export default function ArchitectureView() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  return (
    <div style={{
      background: '#0a0f1a', borderRadius: 12,
      border: '1px solid rgba(245,166,35,0.2)',
      padding: 16, height: '100%', display: 'flex', flexDirection: 'column',
    }}>
      <h3 style={{ color: '#f5a623', fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, margin: '0 0 12px' }}>
        7-LAYER INTELLIGENCE ARCHITECTURE
      </h3>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {LAYERS.map((layer) => {
          const isSelected = selectedLayer === layer.id;
          return (
            <div
              key={layer.id}
              onClick={() => setSelectedLayer(isSelected ? null : layer.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 8,
                background: isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)',
                border: `1px solid ${isSelected ? layer.color + '40' : 'rgba(255,255,255,0.03)'}`,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {/* Level badge */}
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: layer.color + '20',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: layer.color, fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 13, fontWeight: 700,
              }}>
                L{layer.level}
              </div>

              {/* Name + status */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{layer.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{layer.nameAr}</span>
                </div>
                {isSelected && (
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 }}>
                    {layer.description}
                  </div>
                )}
              </div>

              {/* Throughput */}
              <span style={{
                color: layer.color, fontSize: 11,
                fontFamily: 'IBM Plex Mono, monospace',
              }}>
                {layer.throughput}
              </span>

              {/* Status dot */}
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: STATUS_COLORS[layer.status],
              }} />
            </div>
          );
        })}
      </div>

      {/* Selected layer services */}
      {selectedLayer && (() => {
        const layer = LAYERS.find((l) => l.id === selectedLayer);
        if (!layer) return null;
        return (
          <div style={{
            marginTop: 8, padding: 10, borderRadius: 8,
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${layer.color}20`,
          }}>
            <div style={{ color: layer.color, fontSize: 10, fontFamily: 'IBM Plex Mono', marginBottom: 6 }}>
              SERVICES
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {layer.services.map((s) => (
                <span key={s} style={{
                  background: layer.color + '15', color: layer.color,
                  fontSize: 10, padding: '3px 8px', borderRadius: 4,
                  fontFamily: 'IBM Plex Mono',
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
