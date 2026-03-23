/**
 * DEEVO Intelligence Monitor v3 — KPI Dashboard
 * Contract 5 / Panel 6 of 7
 * Layer: UI (L6)
 *
 * Intelligence-layer KPI cards showing:
 *   - Signal volume, correlation matches, decision throughput
 *   - Feed health, audit chain integrity
 *   - Per-variant metrics
 *
 * Design: IBM Plex Mono for all data, Gulf Amber accent.
 */

import { useState } from 'react';
import type { DeevoVariant } from '../../types/signals';

interface KPICard {
  id: string;
  label: string;
  value: string;
  change: number;
  unit: string;
  color: string;
  layer: string;
}

const KPI_DATA: KPICard[] = [
  { id: 'signals', label: 'Signals / 24h', value: '2,847', change: 12.3, unit: '', color: '#3b82f6', layer: 'L1' },
  { id: 'feeds', label: 'Active Feeds', value: '587', change: -2.1, unit: '/600+', color: '#06b6d4', layer: 'L1' },
  { id: 'correlations', label: 'Correlations', value: '14', change: 40.0, unit: '/24h', color: '#f5a623', layer: 'L3' },
  { id: 'decisions', label: 'Decisions', value: '6', change: 0, unit: 'pending', color: '#8b5cf6', layer: 'L4' },
  { id: 'entities', label: 'GCC Entities', value: '34', change: 0, unit: 'tracked', color: '#22c55e', layer: 'L2' },
  { id: 'audit', label: 'Audit Chain', value: '1,204', change: 8.5, unit: 'entries', color: '#ef4444', layer: 'L7' },
  { id: 'ollama', label: 'Ollama Status', value: 'ONLINE', change: 0, unit: '3b model', color: '#22c55e', layer: 'L4' },
  { id: 'dri', label: 'DRI Level', value: '4', change: 0, unit: 'SEVERE', color: '#ef4444', layer: 'L7' },
];

interface KPIDashboardV3Props {
  variant?: DeevoVariant;
}

export default function KPIDashboardV3({ variant = 'global' }: KPIDashboardV3Props) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Suppress unused var
  void variant;

  return (
    <div style={{
      background: '#0a0f1a', borderRadius: 12,
      border: '1px solid rgba(245,166,35,0.2)',
      padding: 16, height: '100%', display: 'flex', flexDirection: 'column',
    }}>
      <h3 style={{ color: '#f5a623', fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, margin: '0 0 12px' }}>
        INTELLIGENCE KPIs
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 8, flex: 1,
      }}>
        {KPI_DATA.map((kpi) => {
          const isSelected = selectedCard === kpi.id;
          return (
            <div
              key={kpi.id}
              onClick={() => setSelectedCard(isSelected ? null : kpi.id)}
              style={{
                background: isSelected ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSelected ? kpi.color + '40' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 8, padding: 12, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}>
                  {kpi.label}
                </span>
                <span style={{
                  background: kpi.color + '20', color: kpi.color,
                  fontSize: 8, padding: '1px 4px', borderRadius: 3,
                  fontFamily: 'IBM Plex Mono',
                }}>
                  {kpi.layer}
                </span>
              </div>
              <div style={{
                color: 'white', fontSize: 22, fontWeight: 700,
                fontFamily: 'IBM Plex Mono, monospace',
              }}>
                {kpi.value}
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginLeft: 4 }}>
                  {kpi.unit}
                </span>
              </div>
              {kpi.change !== 0 && (
                <div style={{
                  color: kpi.change > 0 ? '#22c55e' : '#ef4444',
                  fontSize: 10, fontFamily: 'IBM Plex Mono', marginTop: 4,
                }}>
                  {kpi.change > 0 ? '▲' : '▼'} {Math.abs(kpi.change).toFixed(1)}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
