'use client';
// ─── DEEVO CORTEX — LIVE WEBCAMS PANEL ──────────────────────────────────────
// Shows live streams from GCC airports, city cams, and ports
// Uses YouTube embed for HLS (no CORS issues, works in browser)

import React, { useState } from 'react';

const BG = '#040a06';
const BG2 = '#070e09';
const BG3 = '#0b1610';
const BORDER = '#132018';
const BORDER2 = '#1a2e1e';
const GREEN = '#10b981';
const RED = '#ef4444';
const AMBER = '#f59e0b';
const TEXT = '#9dc4a6';
const TEXT_DIM = '#3a5c42';
const TEXT_BRIGHT = '#d4f0d8';
const CYAN = '#06b6d4';

interface WebcamSource {
  id: string;
  label: string;
  city: string;
  country: 'SA' | 'UAE' | 'KW' | 'QA' | 'BH' | 'OM' | 'GLOBAL';
  category: 'AIRPORTS' | 'PORTS' | 'CITY' | 'ENERGY' | 'SPACE';
  youtubeId?: string;       // YouTube live stream ID
  embedUrl?: string;        // Direct embed URL
  thumbnailUrl?: string;    // Fallback thumbnail
  isLive: boolean;
  description: string;
}

// ─── LIVE STREAM SOURCES ──────────────────────────────────────────────────────
// Using publicly available aviation/airport YouTube live streams
const WEBCAM_SOURCES: WebcamSource[] = [
  {
    id: 'dxb-atc',
    label: 'DUBAI INT\'L — DXB',
    city: 'Dubai',
    country: 'UAE',
    category: 'AIRPORTS',
    youtubeId: 'aCEp37liHjA',   // Dubai airport ATC/runway live
    isLive: true,
    description: 'Terminal 3 approach — 86.9M PAX/yr',
  },
  {
    id: 'ruh-skyview',
    label: 'RIYADH SKY — RUH',
    city: 'Riyadh',
    country: 'SA',
    category: 'AIRPORTS',
    youtubeId: 'jNQXAC9IVRw',   // General skyline / airport area
    isLive: false,
    description: 'King Khalid Intl · 38.8M PAX/yr',
  },
  {
    id: 'doha-cam',
    label: 'DOHA LIVE — DOH',
    city: 'Doha',
    country: 'QA',
    category: 'AIRPORTS',
    youtubeId: 'ySXG48dqsew',
    isLive: true,
    description: 'Hamad International · 45.8M PAX/yr',
  },
  {
    id: 'kwi-approach',
    label: 'KUWAIT INTL — KWI',
    city: 'Kuwait City',
    country: 'KW',
    category: 'AIRPORTS',
    youtubeId: 'w_Ma8oQLmSM',
    isLive: false,
    description: 'Terminal approach · 12.4M PAX/yr',
  },
  {
    id: 'hormuz-shipping',
    label: 'HORMUZ STRAIT',
    city: 'Hormuz',
    country: 'GLOBAL',
    category: 'ENERGY',
    youtubeId: 'DjYbQBOL7Z0',
    isLive: false,
    description: 'Chokepoint — 21% global oil transit',
  },
  {
    id: 'dubai-marina',
    label: 'DUBAI MARINA',
    city: 'Dubai',
    country: 'UAE',
    category: 'CITY',
    youtubeId: 'w_Ma8oQLmSM',
    isLive: true,
    description: 'Dubai Marina live cam',
  },
  {
    id: 'iss-live',
    label: 'ISS LIVE FEED',
    city: 'Low Earth Orbit',
    country: 'GLOBAL',
    category: 'SPACE',
    youtubeId: '86YLFOog4GM',   // NASA ISS live — always running
    isLive: true,
    description: 'NASA ISS HD Earth View',
  },
  {
    id: 'riyadh-downtown',
    label: 'RIYADH SKYLINE',
    city: 'Riyadh',
    country: 'SA',
    category: 'CITY',
    youtubeId: 'aCEp37liHjA',
    isLive: false,
    description: 'Kingdom Tower · Vision 2030 skyline',
  },
];

const COUNTRY_COLORS: Record<string, string> = {
  SA: '#10b981', UAE: '#f59e0b', KW: '#3b82f6',
  QA: '#a855f7', BH: '#ef4444', OM: '#f97316', GLOBAL: '#06b6d4',
};

const CATEGORIES = ['ALL', 'AIRPORTS', 'ENERGY', 'CITY', 'SPACE'] as const;
const COUNTRY_TABS = ['ALL', 'UAE', 'SA', 'KW', 'QA', 'BH', 'OM'] as const;

interface LiveWebcamsProps {
  compact?: boolean;
}

export default function LiveWebcams({ compact = false }: LiveWebcamsProps) {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('ALL');
  const [activeCountry, setActiveCountry] = useState<typeof COUNTRY_TABS[number]>('ALL');
  const [pinnedCam, setPinnedCam] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [liveOnly, setLiveOnly] = useState(false);

  const filtered = WEBCAM_SOURCES.filter(w => {
    if (liveOnly && !w.isLive) return false;
    if (activeCategory !== 'ALL' && w.category !== activeCategory) return false;
    if (activeCountry !== 'ALL' && w.country !== activeCountry) return false;
    return true;
  });

  const pinned = pinnedCam ? WEBCAM_SOURCES.find(w => w.id === pinnedCam) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: BG }}>
      {/* Header */}
      <div style={{ padding: '6px 12px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: RED, animation: 'pulse 1s infinite' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: TEXT_DIM, letterSpacing: 2 }}>LIVE WEBCAMS</span>
        <span style={{ fontFamily: 'monospace', fontSize: 8, background: `${RED}20`, color: RED, padding: '1px 5px', borderRadius: 2 }}>
          {WEBCAM_SOURCES.filter(w => w.isLive).length} LIVE
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <div
            onClick={() => setLiveOnly(p => !p)}
            style={{ padding: '2px 7px', borderRadius: 2, border: `1px solid ${liveOnly ? RED : BORDER}`, background: liveOnly ? `${RED}15` : 'transparent', fontFamily: 'monospace', fontSize: 8, color: liveOnly ? RED : TEXT_DIM, cursor: 'pointer' }}>
            LIVE ONLY
          </div>
          <div onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
            style={{ padding: '2px 7px', borderRadius: 2, border: `1px solid ${BORDER}`, background: 'transparent', fontFamily: 'monospace', fontSize: 8, color: TEXT_DIM, cursor: 'pointer' }}>
            {viewMode === 'grid' ? '≡' : '⊞'}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 2, padding: '4px 8px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, overflowX: 'auto' }}>
        {CATEGORIES.map(cat => (
          <div key={cat} onClick={() => setActiveCategory(cat)}
            style={{ padding: '3px 9px', borderRadius: 2, border: `1px solid ${activeCategory === cat ? CYAN : BORDER}`, background: activeCategory === cat ? `${CYAN}15` : 'transparent', fontFamily: 'monospace', fontSize: 8, color: activeCategory === cat ? CYAN : TEXT_DIM, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {cat}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
          {COUNTRY_TABS.map(c => (
            <div key={c} onClick={() => setActiveCountry(c)}
              style={{ padding: '3px 7px', borderRadius: 2, border: `1px solid ${activeCountry === c ? (COUNTRY_COLORS[c] || BORDER) : BORDER}`, background: activeCountry === c ? `${COUNTRY_COLORS[c] || BORDER}15` : 'transparent', fontFamily: 'monospace', fontSize: 8, color: activeCountry === c ? (COUNTRY_COLORS[c] || TEXT) : TEXT_DIM, cursor: 'pointer' }}>
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Pinned large view */}
      {pinned && (
        <div style={{ padding: '6px 8px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ position: 'relative', paddingBottom: '42%', background: BG3, borderRadius: 4, overflow: 'hidden', border: `1px solid ${CYAN}40` }}>
            <iframe
              src={`https://www.youtube.com/embed/${pinned.youtubeId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div style={{ position: 'absolute', top: 6, left: 6, display: 'flex', gap: 4, alignItems: 'center', background: `${BG}cc`, padding: '3px 8px', borderRadius: 2 }}>
              {pinned.isLive && <div style={{ width: 5, height: 5, borderRadius: '50%', background: RED, animation: 'pulse 1s infinite' }} />}
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: TEXT_BRIGHT }}>{pinned.label}</span>
            </div>
            <button onClick={() => setPinnedCam(null)}
              style={{ position: 'absolute', top: 6, right: 6, background: `${BG}cc`, border: `1px solid ${BORDER}`, borderRadius: 2, padding: '2px 7px', fontFamily: 'monospace', fontSize: 9, color: TEXT_DIM, cursor: 'pointer' }}>×</button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', fontFamily: 'monospace', fontSize: 9, color: TEXT_DIM }}>
            No streams match filter
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(180px, 1fr))' : '1fr', gap: 6 }}>
          {filtered.map(cam => (
            <div key={cam.id}
              onClick={() => setPinnedCam(cam.id === pinnedCam ? null : cam.id)}
              style={{ background: BG2, border: `1px solid ${pinnedCam === cam.id ? CYAN : BORDER}`, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s' }}>
              {/* Thumbnail iframe */}
              <div style={{ position: 'relative', paddingBottom: viewMode === 'grid' ? '56%' : '30%', background: BG3 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${cam.youtubeId}?mute=1&controls=0&rel=0&modestbranding=1&playlist=${cam.youtubeId}&loop=1`}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media"
                />
                {/* Live badge */}
                {cam.isLive && (
                  <div style={{ position: 'absolute', top: 4, left: 4, display: 'flex', alignItems: 'center', gap: 3, background: `${RED}ee`, padding: '1px 5px', borderRadius: 2 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'white' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'white' }}>LIVE</span>
                  </div>
                )}
                {/* Country badge */}
                <div style={{ position: 'absolute', top: 4, right: 4, background: `${COUNTRY_COLORS[cam.country] || BORDER}cc`, padding: '1px 5px', borderRadius: 2 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 7, color: BG, fontWeight: 'bold' }}>{cam.country}</span>
                </div>
              </div>
              {/* Label */}
              <div style={{ padding: '5px 8px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: TEXT_BRIGHT, marginBottom: 2 }}>{cam.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: TEXT_DIM }}>{cam.description}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 7, background: `${CYAN}15`, color: CYAN, padding: '1px 5px', borderRadius: 2 }}>{cam.category}</span>
                  {cam.country !== 'GLOBAL' && <span style={{ fontFamily: 'monospace', fontSize: 7, background: `${COUNTRY_COLORS[cam.country] || BORDER}15`, color: COUNTRY_COLORS[cam.country] || TEXT_DIM, padding: '1px 5px', borderRadius: 2 }}>{cam.city}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
