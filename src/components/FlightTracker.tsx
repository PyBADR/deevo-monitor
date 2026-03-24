'use client';
// ─── DEEVO CORTEX — FLIGHT TRACKER PANEL ─────────────────────────────────────
// Live ADS-B flight data over GCC via OpenSky Network (free, no key)

import React, { useState, useEffect } from 'react';
import { fetchGCCFlights, type FlightStats } from '@/services/flights';

const BG2 = '#070e09';
const BG3 = '#0b1610';
const BORDER = '#132018';
const GREEN = '#10b981';
const AMBER = '#f59e0b';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const CYAN = '#06b6d4';
const TEXT = '#9dc4a6';
const TEXT_DIM = '#3a5c42';
const TEXT_BRIGHT = '#d4f0d8';

const COUNTRY_COLORS: Record<string, string> = {
  UAE: AMBER, SA: GREEN, KW: BLUE, QA: '#a855f7', BH: RED, OM: '#f97316',
};

const AIRPORT_CAPACITY: Record<string, number> = {
  DXB: 100, AUH: 45, SHJ: 20, RUH: 80, JED: 80, DMM: 24,
  DOH: 65, KWI: 25, BAH: 20, MCT: 24,
};

interface FlightTrackerProps {
  compact?: boolean;
}

export default function FlightTracker({ compact = false }: FlightTrackerProps) {
  const [stats, setStats] = useState<FlightStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await fetchGCCFlights();
      setStats(result.stats);
      setLastUpdate(new Date());
      setLoading(false);
    }
    load();
    const id = setInterval(load, 120000); // refresh every 2 min
    return () => clearInterval(id);
  }, []);

  if (!stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'monospace', fontSize: 9, color: TEXT_DIM }}>
      Loading flight data...
    </div>
  );

  const topAirports = Object.entries(stats.by_airport)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: BG2 }}>
      {/* Header */}
      <div style={{ padding: '6px 12px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: CYAN, animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: TEXT_DIM, letterSpacing: 2 }}>LIVE FLIGHTS — GCC</span>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: CYAN, fontWeight: 'bold' }}>{stats.in_gcc.toLocaleString()}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 8, color: TEXT_DIM }}>airborne</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 7, color: stats.source === 'live' ? GREEN : AMBER, background: `${stats.source === 'live' ? GREEN : AMBER}15`, padding: '1px 5px', borderRadius: 2 }}>
            {stats.source === 'live' ? 'ADS-B LIVE' : 'SEED DATA'}
          </span>
          {lastUpdate && <span style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM }}>{lastUpdate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        {/* Total stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 12 }}>
          {[
            { label: 'GCC Airborne', value: stats.in_gcc.toLocaleString(), color: CYAN },
            { label: 'Region Total', value: stats.total.toLocaleString(), color: TEXT },
            { label: 'GCC Share', value: `${Math.round((stats.in_gcc / Math.max(stats.total, 1)) * 100)}%`, color: GREEN },
          ].map(s => (
            <div key={s.label} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 3, padding: '8px 10px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM, letterSpacing: 1, marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 16, color: s.color, fontWeight: 'bold' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* By country */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM, letterSpacing: 2, marginBottom: 6 }}>FLIGHTS BY COUNTRY</div>
          {Object.entries(stats.by_country)
            .sort(([, a], [, b]) => b - a)
            .map(([code, count]) => {
              const pct = Math.round((count / Math.max(stats.in_gcc, 1)) * 100);
              return (
                <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: `1px solid ${BORDER}20` }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: COUNTRY_COLORS[code] || TEXT, minWidth: 30 }}>{code}</span>
                  <div style={{ flex: 1, height: 4, background: BORDER, borderRadius: 2 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: COUNTRY_COLORS[code] || GREEN, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: TEXT_BRIGHT, minWidth: 28, textAlign: 'right' }}>{count}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM, minWidth: 28, textAlign: 'right' }}>{pct}%</span>
                </div>
              );
            })}
        </div>

        {/* Airport table */}
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM, letterSpacing: 2, marginBottom: 6 }}>TOP AIRPORTS — LIVE MOVEMENTS</div>
          {topAirports.map(([iata, count]) => {
            const capacity = AIRPORT_CAPACITY[iata] || 20;
            const util = Math.round((count / (capacity / 365 * 1000 / 24)) * 100);
            return (
              <div key={iata} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: `1px solid ${BORDER}20` }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: CYAN, fontWeight: 'bold', minWidth: 36 }}>{iata}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 3, background: BORDER, borderRadius: 1, marginBottom: 2 }}>
                    <div style={{ width: `${Math.min(util, 100)}%`, height: '100%', background: util > 80 ? RED : util > 60 ? AMBER : GREEN, borderRadius: 1 }} />
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM }}>{util}% util</span>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: TEXT_BRIGHT, minWidth: 24, textAlign: 'right' }}>{count}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 7, color: TEXT_DIM }}>flt</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
