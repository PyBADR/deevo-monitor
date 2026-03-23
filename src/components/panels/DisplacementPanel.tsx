/**
 * DisplacementPanel — UNHCR displacement data for catastrophe risk modeling
 * Contract 8D | Layer: Data (L1) + Features (L2)
 * Variant: global
 */

interface DisplacementOrigin {
  country: string;
  status: 'CRISIS' | 'HIGH' | 'ELEVATED' | 'MODERATE';
  displaced: string;
}

const STATS = [
  { label: 'REFUGEES', value: '30.5M', color: '#f5a623' },
  { label: 'ASYLUM SEEKERS', value: '8.4M', color: '#3b82f6' },
  { label: 'IDPs', value: '63.9M', color: '#ef4444' },
  { label: 'TOTAL DISPLACED', value: '107.2M', color: '#f5a623' },
];

const ORIGINS: DisplacementOrigin[] = [
  { country: 'Syrian Arab Rep.', status: 'CRISIS', displaced: '13.5M' },
  { country: 'Yemen', status: 'CRISIS', displaced: '4.5M' },
  { country: 'Sudan', status: 'CRISIS', displaced: '9.1M' },
  { country: 'South Sudan', status: 'CRISIS', displaced: '4.4M' },
  { country: 'Somalia', status: 'HIGH', displaced: '3.9M' },
  { country: 'Afghanistan', status: 'HIGH', displaced: '6.4M' },
  { country: 'Iraq', status: 'ELEVATED', displaced: '1.2M' },
  { country: 'Libya', status: 'ELEVATED', displaced: '0.8M' },
];

const STATUS_COLORS: Record<string, string> = {
  CRISIS: '#ef4444', HIGH: '#f59e0b', ELEVATED: '#f5a623', MODERATE: '#3b82f6',
};

const GCC_PRESSURE = 62;

const INSURANCE_IMPACTS = [
  'Property claims — abandoned assets in conflict zones affect reinsurance exposure',
  'Health insurance — cross-border movement strains GCC medical coverage pools',
  'Marine — refugee vessel incidents increase P&I club liability in Arabian Sea / Red Sea',
];

function DisplacementPanelInner() {
  return (
    <div style={{ height: '100%', overflow: 'auto', backgroundColor: '#0a0f1a', color: '#e2e8f0', fontFamily: "'IBM Plex Mono', monospace", padding: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#f5a623' }}>UNHCR DISPLACEMENT</span>
          <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#1e293b', color: '#94a3b8' }}>107.2M</span>
          <span style={{ fontSize: '8px', padding: '1px 5px', borderRadius: '4px', backgroundColor: '#f5a62320', color: '#f5a623' }}>MENA FOCUS</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {STATS.map(s => (
          <div key={s.label} style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#111827', textAlign: 'center', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '8px', color: '#64748b', marginTop: '2px', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Origins Table */}
      <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse', marginBottom: '12px' }}>
        <thead>
          <tr style={{ color: '#64748b', borderBottom: '1px solid #1e293b' }}>
            <th style={{ textAlign: 'left', padding: '4px 6px' }}>COUNTRY</th>
            <th style={{ textAlign: 'center', padding: '4px 6px' }}>STATUS</th>
            <th style={{ textAlign: 'right', padding: '4px 6px' }}>DISPLACED</th>
          </tr>
        </thead>
        <tbody>
          {ORIGINS.map(o => (
            <tr key={o.country} style={{ borderBottom: '1px solid #111827' }}>
              <td style={{ padding: '4px 6px' }}>{o.country}</td>
              <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                <span style={{ fontSize: '8px', padding: '1px 6px', borderRadius: '4px', backgroundColor: `${STATUS_COLORS[o.status]}20`, color: STATUS_COLORS[o.status] }}>{o.status}</span>
              </td>
              <td style={{ padding: '4px 6px', textAlign: 'right', color: '#f5a623', fontWeight: 600 }}>{o.displaced}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Insurance Relevance */}
      <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#111827', border: '1px solid #1e293b', marginBottom: '12px' }}>
        <div style={{ fontSize: '9px', fontWeight: 600, color: '#f5a623', marginBottom: '6px' }}>INSURANCE RELEVANCE</div>
        {INSURANCE_IMPACTS.map((text, i) => (
          <div key={i} style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '4px', paddingLeft: '8px', borderLeft: '2px solid #f5a62340' }}>
            {text}
          </div>
        ))}
      </div>

      {/* CAT Model Indicator */}
      <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#111827', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '9px', fontWeight: 600, color: '#e2e8f0' }}>GCC DISPLACEMENT PRESSURE</span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: GCC_PRESSURE > 75 ? '#ef4444' : GCC_PRESSURE > 50 ? '#f5a623' : '#10b981' }}>
            {GCC_PRESSURE}/100 ELEVATED
          </span>
        </div>
        <div style={{ height: '8px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${GCC_PRESSURE}%`, borderRadius: '4px',
            background: `linear-gradient(90deg, #10b981 0%, #f5a623 50%, #ef4444 100%)`,
          }} />
        </div>
        <div style={{ fontSize: '8px', color: '#64748b', marginTop: '4px' }}>
          Feeds into RULE_005 Climate/CAT Trigger
        </div>
      </div>
    </div>
  );
}

export default memo(DisplacementPanelInner);
