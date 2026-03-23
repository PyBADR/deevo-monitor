import React, { useState, useCallback, useMemo } from 'react';

interface FraudRing {
  id: string;
  claimants: number;
  providers: number;
  garages: number;
  density: number;
  totalKWD: number;
  frinScore: number;
  status: 'ACTIVE' | 'MONITORING' | 'RESOLVED';
  nodes: FraudNode[];
  edges: FraudEdge[];
}

interface FraudNode {
  id: string;
  label: string;
  type: 'claimant' | 'provider' | 'garage';
  x: number;
  y: number;
}

interface FraudEdge {
  source: string;
  target: string;
  type: 'shared_phone' | 'shared_address' | 'same_accident';
}

const getNodeColor = (type: string): string => {
  switch (type) {
    case 'claimant':
      return '#00d4ff';
    case 'provider':
      return '#f5a623';
    case 'garage':
      return '#ff4444';
    default:
      return '#888888';
  }
};

const getEdgeColor = (type: string): string => {
  switch (type) {
    case 'shared_phone':
      return '#ff4444';
    case 'shared_address':
      return '#f5a623';
    case 'same_accident':
      return '#ffdd44';
    default:
      return '#666666';
  }
};

const generateDemoRings = (): FraudRing[] => {
  const ring1Nodes: FraudNode[] = [
    { id: 'c1', label: 'Claimant 1', type: 'claimant', x: 100, y: 100 },
    { id: 'c2', label: 'Claimant 2', type: 'claimant', x: 150, y: 50 },
    { id: 'c3', label: 'Claimant 3', type: 'claimant', x: 200, y: 120 },
    { id: 'c4', label: 'Claimant 4', type: 'claimant', x: 120, y: 180 },
    { id: 'c5', label: 'Claimant 5', type: 'claimant', x: 180, y: 160 },
    { id: 'c6', label: 'Claimant 6', type: 'claimant', x: 80, y: 140 },
    { id: 'c7', label: 'Claimant 7', type: 'claimant', x: 140, y: 70 },
    { id: 'c8', label: 'Claimant 8', type: 'claimant', x: 160, y: 190 },
    { id: 'c9', label: 'Claimant 9', type: 'claimant', x: 110, y: 110 },
    { id: 'c10', label: 'Claimant 10', type: 'claimant', x: 190, y: 80 },
    { id: 'c11', label: 'Claimant 11', type: 'claimant', x: 130, y: 150 },
    { id: 'c12', label: 'Claimant 12', type: 'claimant', x: 170, y: 130 },
    { id: 'p1', label: 'Provider A', type: 'provider', x: 140, y: 110 },
    { id: 'p2', label: 'Provider B', type: 'provider', x: 160, y: 140 },
    { id: 'p3', label: 'Provider C', type: 'provider', x: 120, y: 130 },
    { id: 'g1', label: 'Garage X', type: 'garage', x: 150, y: 150 },
  ];

  const ring1Edges: FraudEdge[] = [
    { source: 'c1', target: 'c2', type: 'shared_phone' },
    { source: 'c2', target: 'c3', type: 'shared_address' },
    { source: 'c3', target: 'c4', type: 'same_accident' },
    { source: 'c4', target: 'c5', type: 'shared_phone' },
    { source: 'c5', target: 'c6', type: 'shared_address' },
    { source: 'c1', target: 'p1', type: 'shared_phone' },
    { source: 'p1', target: 'g1', type: 'shared_address' },
  ];

  const ring2Nodes: FraudNode[] = [
    { id: 'r2_c1', label: 'Claimant A', type: 'claimant', x: 250, y: 100 },
    { id: 'r2_c2', label: 'Claimant B', type: 'claimant', x: 300, y: 80 },
    { id: 'r2_c3', label: 'Claimant C', type: 'claimant', x: 280, y: 140 },
    { id: 'r2_c4', label: 'Claimant D', type: 'claimant', x: 320, y: 120 },
    { id: 'r2_p1', label: 'Provider X', type: 'provider', x: 270, y: 110 },
    { id: 'r2_p2', label: 'Provider Y', type: 'provider', x: 310, y: 100 },
  ];

  const ring2Edges: FraudEdge[] = [
    { source: 'r2_c1', target: 'r2_c2', type: 'shared_phone' },
    { source: 'r2_c2', target: 'r2_c3', type: 'shared_address' },
    { source: 'r2_c1', target: 'r2_p1', type: 'shared_phone' },
    { source: 'r2_p1', target: 'r2_p2', type: 'same_accident' },
  ];

  return [
    {
      id: 'ring_1',
      claimants: 12,
      providers: 3,
      garages: 1,
      density: 0.83,
      totalKWD: 84000,
      frinScore: 91,
      status: 'ACTIVE',
      nodes: ring1Nodes,
      edges: ring1Edges,
    },
    {
      id: 'ring_2',
      claimants: 4,
      providers: 2,
      garages: 0,
      density: 0.52,
      totalKWD: 22000,
      frinScore: 67,
      status: 'MONITORING',
      nodes: ring2Nodes,
      edges: ring2Edges,
    },
  ];
};

export const NetworkAnalysisPanel: React.FC = () => {
  const [rings, setRings] = useState<FraudRing[]>(generateDemoRings());

  const handleEscalate = useCallback((ringId: string) => {
    console.log(`[AUDIT] SIU_ESCALATE ${ringId}`);
    setRings(prevRings =>
      prevRings.map(ring =>
        ring.id === ringId ? { ...ring, status: 'ACTIVE' } : ring
      )
    );
  }, []);

  const renderRingGraph = (ring: FraudRing): React.ReactNode => {
    const svgWidth = 320;
    const svgHeight = 240;

    return (
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{
          border: '1px solid #333333',
          borderRadius: '4px',
          background: '#0a0f1a',
        }}
        key={`svg_${ring.id}`}
      >
        {ring.edges.map((edge, idx) => {
          const sourceNode = ring.nodes.find(n => n.id === edge.source);
          const targetNode = ring.nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          return (
            <line
              key={`edge_${idx}`}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={getEdgeColor(edge.type)}
              strokeWidth="1.5"
              opacity="0.6"
            />
          );
        })}

        {ring.nodes.map((node, idx) => (
          <circle
            key={`node_${idx}`}
            cx={node.x}
            cy={node.y}
            r="6"
            fill={getNodeColor(node.type)}
            opacity="0.8"
            style={{ cursor: 'pointer' }}
          />
        ))}

        <text
          x={10}
          y={220}
          fontSize="11"
          fill="#888888"
          fontFamily="IBM Plex Mono, monospace"
        >
          Nodes: {ring.nodes.length} | Edges: {ring.edges.length}
        </text>
      </svg>
    );
  };

  const statusColor = (status: string): string => {
    switch (status) {
      case 'ACTIVE':
        return '#ff4444';
      case 'MONITORING':
        return '#f5a623';
      case 'RESOLVED':
        return '#44ff44';
      default:
        return '#888888';
    }
  };

  return (
    <div
      style={{
        background: '#0a0f1a',
        color: '#e5e7eb',
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'IBM Plex Mono, monospace',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600' }}>
          Network Analysis (FRIN)
        </h2>
        <p style={{ margin: '0', fontSize: '12px', color: '#888888' }}>
          Fraud Ring Identification Network - Detecting claim fraud patterns
        </p>
      </div>

      {rings.map(ring => (
        <div
          key={ring.id}
          style={{
            marginBottom: '20px',
            padding: '15px',
            border: '1px solid #333333',
            borderRadius: '6px',
            background: '#0f1420',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                {ring.id.toUpperCase()}
              </h3>
              <div style={{ fontSize: '11px', color: '#888888' }}>
                <div>Claimants: {ring.claimants} | Providers: {ring.providers} | Garages: {ring.garages}</div>
                <div>Density: {ring.density.toFixed(2)} | Total: {(ring.totalKWD / 1000).toFixed(0)}K KWD</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: ring.frinScore > 85 ? '#ff4444' : ring.frinScore > 65 ? '#f5a623' : '#44ff44',
                  marginBottom: '5px',
                }}
              >
                {ring.frinScore}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  background: statusColor(ring.status),
                  color: '#000000',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                }}
              >
                {ring.status}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            {renderRingGraph(ring)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px', fontSize: '11px' }}>
            <div style={{ background: '#1a2030', padding: '8px', borderRadius: '4px' }}>
              <div style={{ color: '#888888' }}>Shared Phone</div>
              <div style={{ color: '#ff4444', fontWeight: 'bold' }}>●</div>
            </div>
            <div style={{ background: '#1a2030', padding: '8px', borderRadius: '4px' }}>
              <div style={{ color: '#888888' }}>Shared Address</div>
              <div style={{ color: '#f5a623', fontWeight: 'bold' }}>●</div>
            </div>
            <div style={{ background: '#1a2030', padding: '8px', borderRadius: '4px' }}>
              <div style={{ color: '#888888' }}>Same Accident</div>
              <div style={{ color: '#ffdd44', fontWeight: 'bold' }}>●</div>
            </div>
          </div>

          <button
            onClick={() => handleEscalate(ring.id)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#ff4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily: 'IBM Plex Mono, monospace',
            }}
          >
            SIU ESCALATE
          </button>
        </div>
      ))}
    </div>
  );
};

export default memo(NetworkAnalysisPanel);
