/**
 * DEEVO Intelligence Monitor v3 — Force-Directed Graph View
 * Contract 5 / Panel 2 of 7
 * Layer: UI (L6)
 *
 * Renders the GCC entity graph as an interactive force-directed layout.
 * Nodes = entities, edges = relationships (regulatory, reinsurance, etc.)
 * Uses canvas-based rendering for performance with 34+ nodes.
 */

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { GCCEntity } from '../../types/entities';
import { GCC_ENTITIES, GCC_EDGES } from '../../config/entities';

// ── Design Tokens ────────────────────────────────────────
const EDGE_COLORS: Record<string, string> = {
  regulatory: '#f5a623',
  reinsurance: '#3b82f6',
  trade: '#22c55e',
  energy: '#ef4444',
  financial: '#8b5cf6',
  supply_chain: '#06b6d4',
  risk_transfer: '#ec4899',
  correlation: '#f97316',
};

const NODE_COLORS: Record<string, string> = {
  insurer: '#3b82f6', reinsurer: '#6366f1', regulator: '#f5a623',
  government: '#ef4444', port: '#06b6d4', airport: '#22c55e',
  oilfield: '#78716c', refinery: '#f97316', ftz: '#8b5cf6',
  hospital: '#ec4899', exchange: '#eab308', central_bank: '#f5a623',
  sovereign_fund: '#a855f7', military_base: '#dc2626', desalination: '#0ea5e9',
  pipeline: '#78716c', tech_hub: '#10b981',
};

interface ForceNode extends GCCEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface ForceGraphViewProps {
  onEntitySelect?: (entity: GCCEntity) => void;
  selectedEntityId?: string | null;
  edgeFilter?: string[];
}

function ForceGraphViewInner({
  onEntitySelect,
  selectedEntityId = null,
  edgeFilter,
}: ForceGraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [simulationStep, setSimulationStep] = useState(0);

  // Initialize nodes with random positions
  const nodes = useMemo<ForceNode[]>(() =>
    GCC_ENTITIES.map((e, i) => ({
      ...e,
      x: 200 + Math.cos(i * 0.5) * 150 + Math.random() * 40,
      y: 180 + Math.sin(i * 0.5) * 120 + Math.random() * 40,
      vx: 0,
      vy: 0,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const edges = useMemo(() =>
    edgeFilter
      ? GCC_EDGES.filter((e) => edgeFilter.includes(e.type))
      : [...GCC_EDGES],
    [edgeFilter]
  );

  // Simple force simulation step
  const simulate = useCallback(() => {
    const k = 0.01; // Spring constant
    const repulsion = 2000;

    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ni = nodes[i]!;
        const nj = nodes[j]!;
        const dx = ni.x - nj.x;
        const dy = ni.y - nj.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        const force = repulsion / (dist * dist);
        ni.vx += (dx / dist) * force;
        ni.vy += (dy / dist) * force;
        nj.vx -= (dx / dist) * force;
        nj.vy -= (dy / dist) * force;
      }
    }

    // Spring force along edges
    for (const edge of edges) {
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);
      if (!source || !target) continue;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const force = (dist - 100) * k;
      source.vx += (dx / dist) * force;
      source.vy += (dy / dist) * force;
      target.vx -= (dx / dist) * force;
      target.vy -= (dy / dist) * force;
    }

    // Apply velocity with damping
    for (const node of nodes) {
      node.vx *= 0.8;
      node.vy *= 0.8;
      node.x += node.vx;
      node.y += node.vy;
      // Keep in bounds
      node.x = Math.max(30, Math.min(370, node.x));
      node.y = Math.max(30, Math.min(330, node.y));
    }
  }, [nodes, edges]);

  // Run simulation on mount
  useEffect(() => {
    const interval = setInterval(() => {
      simulate();
      setSimulationStep((s) => s + 1);
    }, 50);

    // Stop after 100 steps
    const timeout = setTimeout(() => clearInterval(interval), 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [simulate]);

  // Suppress unused var warning for simulation reactivity
  void simulationStep;

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ color: '#f5a623', fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, margin: 0 }}>
          FORCE GRAPH — ENTITY NETWORK
        </h3>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11 }}>
          {nodes.length} nodes · {edges.length} edges
        </span>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <svg viewBox="0 0 400 360" style={{ width: '100%', height: '100%' }}>
          {/* Edges */}
          {edges.map((edge) => {
            const s = nodes.find((n) => n.id === edge.source);
            const t = nodes.find((n) => n.id === edge.target);
            if (!s || !t) return null;
            return (
              <line
                key={edge.id}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke={EDGE_COLORS[edge.type] ?? '#555'}
                strokeWidth={edge.weight * 2}
                opacity={0.4}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedEntityId === node.id;
            const isHovered = hoveredNode === node.id;
            const r = isSelected ? 14 : isHovered ? 12 : 8;

            return (
              <g
                key={node.id}
                onClick={() => onEntitySelect?.(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {isSelected && (
                  <circle cx={node.x} cy={node.y} r={r + 4} fill="none" stroke="#f5a623" strokeWidth={2} opacity={0.6} />
                )}
                <circle
                  cx={node.x} cy={node.y} r={r}
                  fill={NODE_COLORS[node.type] ?? '#666'}
                  opacity={isHovered || isSelected ? 1 : 0.7}
                />
                {(isHovered || isSelected) && (
                  <text
                    x={node.x} y={node.y - r - 6}
                    textAnchor="middle" fill="white" fontSize={9}
                    fontFamily="IBM Plex Sans, sans-serif"
                  >
                    {node.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Edge type legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8,
        padding: '8px 0 0', borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        {Object.entries(EDGE_COLORS).map(([type, color]) => (
          <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 12, height: 2, background: color, display: 'inline-block' }} />
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'IBM Plex Mono, monospace' }}>
              {type}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default memo(ForceGraphViewInner);
