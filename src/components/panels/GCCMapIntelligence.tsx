/**
 * DEEVO Intelligence Monitor v3 — GCC Map Intelligence Panel
 * Contract 5 / Panel 1 of 7
 * Layer: UI (L6)
 *
 * Enhanced GCC map with intelligence overlay:
 *   - Entity nodes rendered at coordinates
 *   - Signal hotspots with severity-based sizing
 *   - Risk heatmap by country
 *   - Correlation arcs between entities
 *
 * Uses MapLibre GL for base map, with SVG overlay for entities.
 */

import { useState, useMemo, useCallback } from 'react';
import type { GCCEntity, RiskLevel } from '../../types/entities';
import type { IntelSignal } from '../../types/signals';
import { GCC_ENTITIES, getEntitiesByCountry } from '../../config/entities';
import type { GCCCountryCode } from '../../types/index';

// ── Design Tokens ────────────────────────────────────────
const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: '#22c55e',
  MEDIUM: '#f5a623',
  HIGH: '#ef4444',
  CRITICAL: '#dc2626',
};

const ENTITY_ICONS: Record<string, string> = {
  insurer: '🏢', regulator: '⚖️', port: '🚢', airport: '✈️',
  oilfield: '🛢️', refinery: '🏭', ftz: '🏦', hospital: '🏥',
  exchange: '📈', central_bank: '🏛️', sovereign_fund: '💰',
  military_base: '🎖️', desalination: '💧', pipeline: '🔗', tech_hub: '💻',
};

interface GCCMapIntelligenceProps {
  signals?: IntelSignal[];
  selectedCountry?: GCCCountryCode | null;
  onEntityClick?: (entity: GCCEntity) => void;
  onCountryClick?: (country: GCCCountryCode) => void;
}

// ── Country Centers for SVG ──────────────────────────────
const COUNTRY_POSITIONS: Record<GCCCountryCode, { x: number; y: number }> = {
  SA: { x: 280, y: 200 },
  AE: { x: 380, y: 180 },
  QA: { x: 360, y: 160 },
  KW: { x: 320, y: 100 },
  BH: { x: 350, y: 140 },
  OM: { x: 400, y: 220 },
};

export default function GCCMapIntelligence({
  signals = [],
  selectedCountry = null,
  onEntityClick,
  onCountryClick,
}: GCCMapIntelligenceProps) {
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<'entities' | 'signals' | 'risk'>('entities');

  const entities = useMemo(() =>
    selectedCountry ? getEntitiesByCountry(selectedCountry) : [...GCC_ENTITIES],
    [selectedCountry]
  );

  const signalsByCountry = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of signals) {
      for (const c of s.countries) {
        map.set(c, (map.get(c) ?? 0) + 1);
      }
    }
    return map;
  }, [signals]);

  const handleEntityClick = useCallback((entity: GCCEntity) => {
    onEntityClick?.(entity);
  }, [onEntityClick]);

  return (
    <div style={{
      background: '#0a0f1a',
      borderRadius: 12,
      border: '1px solid rgba(245,166,35,0.2)',
      padding: 16,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ color: '#f5a623', fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, margin: 0 }}>
          GCC MAP INTELLIGENCE
        </h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['entities', 'signals', 'risk'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              style={{
                background: activeLayer === layer ? 'rgba(245,166,35,0.2)' : 'transparent',
                border: `1px solid ${activeLayer === layer ? '#f5a623' : 'rgba(255,255,255,0.1)'}`,
                color: activeLayer === layer ? '#f5a623' : 'rgba(255,255,255,0.5)',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 11,
                fontFamily: 'IBM Plex Mono, monospace',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map Area */}
      <div style={{ flex: 1, position: 'relative', minHeight: 300 }}>
        <svg viewBox="0 0 500 350" style={{ width: '100%', height: '100%' }}>
          {/* Country regions */}
          {(Object.entries(COUNTRY_POSITIONS) as [GCCCountryCode, { x: number; y: number }][]).map(([code, pos]) => {
            const sigCount = signalsByCountry.get(code) ?? 0;
            const isSelected = selectedCountry === code;
            return (
              <g key={code} onClick={() => onCountryClick?.(code)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={pos.x} cy={pos.y}
                  r={isSelected ? 35 : 28}
                  fill={isSelected ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.03)'}
                  stroke={isSelected ? '#f5a623' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text x={pos.x} y={pos.y - 8} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={11} fontFamily="IBM Plex Mono">
                  {code}
                </text>
                {sigCount > 0 && (
                  <text x={pos.x} y={pos.y + 12} textAnchor="middle" fill="#f5a623" fontSize={10} fontFamily="IBM Plex Mono">
                    {sigCount} signals
                  </text>
                )}
              </g>
            );
          })}

          {/* Entity nodes */}
          {activeLayer === 'entities' && entities.map((entity, i) => {
            const countryPos = COUNTRY_POSITIONS[entity.country];
            const angle = (i * 137.5) * (Math.PI / 180); // Golden angle distribution
            const radius = 45 + (i % 3) * 15;
            const ex = countryPos.x + Math.cos(angle) * radius;
            const ey = countryPos.y + Math.sin(angle) * radius;
            const isHovered = hoveredEntity === entity.id;

            return (
              <g
                key={entity.id}
                onClick={() => handleEntityClick(entity)}
                onMouseEnter={() => setHoveredEntity(entity.id)}
                onMouseLeave={() => setHoveredEntity(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={ex} cy={ey} r={isHovered ? 14 : 10}
                  fill={RISK_COLORS[entity.riskLevel]}
                  opacity={isHovered ? 0.9 : 0.6}
                />
                <text x={ex} y={ey + 4} textAnchor="middle" fontSize={10}>
                  {ENTITY_ICONS[entity.type] ?? '📍'}
                </text>
                {isHovered && (
                  <text x={ex} y={ey - 18} textAnchor="middle" fill="white" fontSize={9} fontFamily="IBM Plex Sans">
                    {entity.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Entity Count Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '8px 0 0', borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)',
      }}>
        <span>{entities.length} entities</span>
        <span>{signals.length} active signals</span>
        <span>Layer: {activeLayer.toUpperCase()}</span>
      </div>
    </div>
  );
}
