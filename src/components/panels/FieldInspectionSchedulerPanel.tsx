/**
 * FieldInspectionSchedulerPanel — Safety-aware field inspection scheduling
 * Contract 8G | Layer: Agents (L4) + Governance (L7)
 * Variant: fraud + global
 */
import { useState, memo } from 'react';

interface Region {
  name: string;
  safety: 'SAFE' | 'CAUTION' | 'RESTRICTED';
  note: string;
}

interface Inspection {
  claimId: string;
  location: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assigned: string;
  safety: 'SAFE' | 'CAUTION';
  status: 'HOLD' | 'SCHEDULED' | 'IN PROGRESS' | 'COMPLETED' | 'PENDING';
}

const REGIONS: Region[] = [
  { name: 'Kuwait City South', safety: 'CAUTION', note: 'Fraud cluster active' },
  { name: 'Kuwait City North', safety: 'SAFE', note: '' },
  { name: 'Riyadh Central', safety: 'SAFE', note: '' },
  { name: 'Jeddah', safety: 'SAFE', note: '' },
  { name: 'Dubai', safety: 'SAFE', note: '' },
  { name: 'Abu Dhabi', safety: 'SAFE', note: '' },
];

const INITIAL_INSPECTIONS: Inspection[] = [
  { claimId: 'CLM-8821', location: 'KW South', priority: 'HIGH', assigned: 'Pending', safety: 'CAUTION', status: 'HOLD' },
  { claimId: 'CLM-8804', location: 'KW North', priority: 'MEDIUM', assigned: 'Agent-3', safety: 'SAFE', status: 'SCHEDULED' },
  { claimId: 'CLM-8799', location: 'Riyadh', priority: 'LOW', assigned: 'Agent-7', safety: 'SAFE', status: 'IN PROGRESS' },
  { claimId: 'CLM-8756', location: 'Dubai', priority: 'MEDIUM', assigned: 'Agent-2', safety: 'SAFE', status: 'COMPLETED' },
  { claimId: 'CLM-8712', location: 'Jeddah', priority: 'HIGH', assigned: 'Pending', safety: 'SAFE', status: 'PENDING' },
];

const SAFETY_COLORS: Record<string, string> = {
  SAFE: '#10b981', CAUTION: '#f5a623', RESTRICTED: '#ef4444',
};
const PRIORITY_COLORS: Record<string, string> = {
  HIGH: '#ef4444', MEDIUM: '#f5a623', LOW: '#3b82f6',
};
const STATUS_COLORS: Record<string, string> = {
  HOLD: '#ef4444', SCHEDULED: '#3b82f6', 'IN PROGRESS': '#f5a623', COMPLETED: '#10b981', PENDING: '#64748b',
};
const AGENTS = ['Agent-1', 'Agent-2', 'Agent-3', 'Agent-4', 'Agent-5', 'Agent-6', 'Agent-7', 'Agent-8'];

function FieldInspectionSchedulerPanelInner() {
  const [inspections] = useState(INITIAL_INSPECTIONS);
  const [selectedAgent, setSelectedAgent] = useState('Agent-1');
  const pending = inspections.filter(i => i.status === 'PENDING' || i.status === 'HOLD').length;

  return (
    <div style={{ height: '100%', overflow: 'auto', backgroundColor: '#0a0f1a', color: '#e2e8f0', fontFamily: "'IBM Plex Mono', monospace", padding: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#f5a623' }}>FIELD INSPECTION SCHEDULER</span>
          <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#ef444420', color: '#ef4444' }}>{pending} PENDING</span>
        </div>
      </div>

      {/* Safety Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
        {REGIONS.map(r => (
          <div key={r.name} style={{ padding: '6px 8px', borderRadius: '6px', backgroundColor: '#111827', border: `1px solid ${SAFETY_COLORS[r.safety]}30` }}>
            <div style={{ fontSize: '9px', fontWeight: 600, color: '#e2e8f0' }}>{r.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: SAFETY_COLORS[r.safety], display: 'inline-block' }} />
              <span style={{ fontSize: '8px', color: SAFETY_COLORS[r.safety] }}>{r.safety}</span>
              {r.note && <span style={{ fontSize: '7px', color: '#64748b' }}>— {r.note}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Inspections Table */}
      <table style={{ width: '100%', fontSize: '9px', borderCollapse: 'collapse', marginBottom: '12px' }}>
        <thead>
          <tr style={{ color: '#64748b', borderBottom: '1px solid #1e293b' }}>
            <th style={{ textAlign: 'left', padding: '4px 6px' }}>CLAIM ID</th>
            <th style={{ textAlign: 'left', padding: '4px 6px' }}>LOCATION</th>
            <th style={{ textAlign: 'center', padding: '4px 6px' }}>PRIORITY</th>
            <th style={{ textAlign: 'left', padding: '4px 6px' }}>ASSIGNED</th>
            <th style={{ textAlign: 'center', padding: '4px 6px' }}>SAFETY</th>
            <th style={{ textAlign: 'center', padding: '4px 6px' }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {inspections.map(i => (
            <tr key={i.claimId} style={{ borderBottom: '1px solid #111827', borderLeft: i.status === 'HOLD' ? '3px solid #ef4444' : i.status === 'IN PROGRESS' ? '3px solid #f5a623' : '3px solid transparent' }}>
              <td style={{ padding: '5px 6px', fontWeight: 600, color: '#f5a623' }}>{i.claimId}</td>
              <td style={{ padding: '5px 6px' }}>{i.location}</td>
              <td style={{ padding: '5px 6px', textAlign: 'center' }}>
                <span style={{ fontSize: '7px', padding: '1px 5px', borderRadius: '4px', backgroundColor: `${PRIORITY_COLORS[i.priority]}20`, color: PRIORITY_COLORS[i.priority] }}>{i.priority}</span>
              </td>
              <td style={{ padding: '5px 6px', color: i.assigned === 'Pending' ? '#64748b' : '#e2e8f0' }}>{i.assigned}</td>
              <td style={{ padding: '5px 6px', textAlign: 'center' }}>
                <span style={{ fontSize: '7px', padding: '1px 5px', borderRadius: '4px', backgroundColor: `${SAFETY_COLORS[i.safety]}20`, color: SAFETY_COLORS[i.safety] }}>{i.safety}</span>
              </td>
              <td style={{ padding: '5px 6px', textAlign: 'center' }}>
                <span style={{ fontSize: '7px', padding: '1px 5px', borderRadius: '4px', backgroundColor: `${STATUS_COLORS[i.status]}20`, color: STATUS_COLORS[i.status] }}>{i.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Safety Rules */}
      <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#111827', border: '1px solid #1e293b', marginBottom: '12px' }}>
        <div style={{ fontSize: '9px', fontWeight: 600, color: '#f5a623', marginBottom: '4px' }}>SAFETY RULES</div>
        <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '3px', paddingLeft: '8px', borderLeft: '2px solid #ef444440' }}>
          IF hormuz_risk &gt; 90 → Flag all coastal inspections as RESTRICTED
        </div>
        <div style={{ fontSize: '8px', color: '#94a3b8', paddingLeft: '8px', borderLeft: '2px solid #f5a62340' }}>
          IF country_instability &gt; 80 → Suspend field operations in affected region
        </div>
      </div>

      {/* Assign Inspector */}
      <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#111827', border: '1px solid #1e293b' }}>
        <div style={{ fontSize: '9px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>ASSIGN INSPECTOR (SAFE regions only)</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedAgent}
            onChange={e => setSelectedAgent(e.target.value)}
            style={{ fontSize: '9px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#0a0f1a', color: '#e2e8f0', border: '1px solid #334155', fontFamily: "'IBM Plex Mono'" }}
          >
            {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <input type="date" style={{ fontSize: '9px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#0a0f1a', color: '#e2e8f0', border: '1px solid #334155', fontFamily: "'IBM Plex Mono'" }} />
          <button
            onClick={() => console.log(`[AUDIT] FIELD_INSPECTION_SCHEDULED: ${selectedAgent}, ${new Date().toISOString()}`)}
            style={{ fontSize: '9px', padding: '4px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#f5a623', color: '#0a0f1a', fontWeight: 700, cursor: 'pointer', fontFamily: "'IBM Plex Mono'" }}
          >
            ASSIGN
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(FieldInspectionSchedulerPanelInner);
