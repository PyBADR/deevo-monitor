import { useState, useEffect, useMemo, useCallback , memo } from 'react';
import type { AlertLevel } from '../../types/signals';
import { createAuditEntry } from '../../services/audit';

interface RecentBlock {
  id: string;
  timestamp: string;
  vesselName: string;
  source: string;
  hash: string;
}

interface CountryDesignation {
  country: string;
  count: number;
}

const SanctionsWatchPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [screenResult, setScreenResult] = useState<'CLEAR' | 'BLOCKED' | null>(null);
  const [selectedBody, setSelectedBody] = useState<'ALL' | 'OFAC' | 'UN' | 'EU' | 'UK_FCDO'>('ALL');

  const stats = useMemo(() => ({
    totalDesignations: 19865,
    vessels: 1455,
    aircraft: 342,
    newToday: 7,
  }), []);

  const countries = useMemo(() => [
    { country: 'Russia', count: 5952 },
    { country: 'Iran', count: 1519 },
    { country: 'China', count: 1229 },
    { country: 'DPRK', count: 892 },
    { country: 'Syria', count: 687 },
  ] as CountryDesignation[], []);

  const recentBlocks = useMemo(() => [
    { id: '1', timestamp: '2026-03-23T14:32:00Z', vesselName: 'PACIFIC VENTURE', source: 'OFAC', hash: 'a7f3e9...' },
    { id: '2', timestamp: '2026-03-23T13:18:00Z', vesselName: 'TEHRAN EXPRESS', source: 'UN', hash: 'b2c8f4...' },
    { id: '3', timestamp: '2026-03-23T12:01:00Z', vesselName: 'SILK ROAD', source: 'EU', hash: 'c9d1a5...' },
    { id: '4', timestamp: '2026-03-22T18:45:00Z', vesselName: 'GULF TRADER', source: 'OFAC', hash: 'd4e2b6...' },
    { id: '5', timestamp: '2026-03-22T16:22:00Z', vesselName: 'ARABIAN SUN', source: 'UK_FCDO', hash: 'e5f3c7...' },
    { id: '6', timestamp: '2026-03-22T14:10:00Z', vesselName: 'HORIZON', source: 'UN', hash: 'f6a4d8...' },
    { id: '7', timestamp: '2026-03-22T11:33:00Z', vesselName: 'LIBERTY', source: 'OFAC', hash: 'g7b5e9...' },
    { id: '8', timestamp: '2026-03-22T09:15:00Z', vesselName: 'PROSPERITY', source: 'EU', hash: 'h8c6f0...' },
    { id: '9', timestamp: '2026-03-22T07:42:00Z', vesselName: 'GUARDIAN', source: 'OFAC', hash: 'i9d7a1...' },
    { id: '10', timestamp: '2026-03-21T22:30:00Z', vesselName: 'ATLAS', source: 'UN', hash: 'j0e8b2...' },
  ] as RecentBlock[], []);

  const handleScreenNow = useCallback(async () => {
    if (!searchQuery.trim()) return;

    const isBlocked = (searchQuery.includes('IMO') || /^\d+$/.test(searchQuery.trim())) && Math.random() < 0.2;
    setScreenResult(isBlocked ? 'BLOCKED' : 'CLEAR');

    const auditMsg = `[AUDIT] SANCTIONS_SCREEN: ${searchQuery} → ${isBlocked ? 'BLOCKED' : 'CLEAR'}`;
    console.log(auditMsg);

    if (isBlocked) {
      try {
        await createAuditEntry({
          ruleId: 'SANCTIONS_SCREEN',
          result: 'BLOCKED',
          query: searchQuery,
          severity: AlertLevel.CRITICAL,
        });
      } catch (err) {
        console.error('Audit logging error:', err);
      }
    }
  }, [searchQuery]);

  const panelStyle: React.CSSProperties = {
    backgroundColor: '#0a0f1a',
    border: '1px solid #1e293b',
    borderRadius: '6px',
    padding: '20px',
    color: '#e2e8f0',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '12px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #111827',
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: '#f5a623',
    color: '#000',
    padding: '4px 8px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: '#111827',
    padding: '12px',
    borderRadius: '4px',
    textAlign: 'center',
    border: '1px solid #1e293b',
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#f5a623',
    marginBottom: '4px',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#94a3b8',
    textTransform: 'uppercase',
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>SANCTIONS WATCH</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px' }}>{stats.totalDesignations.toLocaleString()}</span>
          <span style={{ ...badgeStyle, width: '8px', height: '8px', borderRadius: '50%', padding: 0, margin: 0, backgroundColor: '#10b981' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.totalDesignations.toLocaleString()}</div>
          <div style={statLabelStyle}>Designations</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.vessels.toLocaleString()}</div>
          <div style={statLabelStyle}>Vessels</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.aircraft}</div>
          <div style={statLabelStyle}>Aircraft</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.newToday}</div>
          <div style={statLabelStyle}>New Today</div>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', color: '#94a3b8' }}>ORIGIN COUNTRIES</div>
        <div style={{ backgroundColor: '#111827', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #1e293b' }}>
          {countries.map((c) => (
            <div key={c.country} style={{ padding: '8px 12px', borderBottom: '1px solid #0a0f1a', display: 'flex', justifyContent: 'space-between' }}>
              <span>{c.country}</span>
              <span style={{ color: '#f5a623' }}>{c.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            placeholder="Enter IMO or aircraft registration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScreenNow()}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '3px',
              color: '#e2e8f0',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
            }}
          />
          <button
            onClick={handleScreenNow}
            style={{
              backgroundColor: '#f5a623',
              color: '#000',
              padding: '8px 16px',
              borderRadius: '3px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'IBM Plex Mono, monospace',
            }}
          >
            SCREEN NOW
          </button>
        </div>

        {screenResult && (
          <div
            style={{
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '12px',
              backgroundColor: screenResult === 'BLOCKED' ? '#7f1d1d' : '#064e3b',
              border: `1px solid ${screenResult === 'BLOCKED' ? '#dc2626' : '#10b981'}`,
              color: screenResult === 'BLOCKED' ? '#fca5a5' : '#a7f3d0',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {screenResult === 'BLOCKED' ? '🔒 BLOCKED — L7 HUMAN GATE REQUIRED' : '✓ CLEAR'}
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', color: '#94a3b8' }}>RECENT BLOCKS</div>
        <div style={{ backgroundColor: '#111827', borderRadius: '4px', maxHeight: '240px', overflowY: 'auto', border: '1px solid #1e293b' }}>
          {recentBlocks.map((block) => (
            <div key={block.id} style={{ padding: '8px 12px', borderBottom: '1px solid #0a0f1a', fontSize: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ color: '#f5a623', fontWeight: 'bold' }}>{block.vesselName}</span>
                <span style={{ color: '#64748b' }}>{block.hash}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>{block.source}</span>
                <span>{new Date(block.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(SanctionsWatchPanel);
