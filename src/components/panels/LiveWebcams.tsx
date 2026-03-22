/**
 * LiveWebcams — Webcam grid panel with regional filtering (worldmonitor-style).
 * Shows 27 live webcam feeds with region tabs: IRAN ATTACKS | ALL | MIDEAST | EUROPE | AMERICAS | ASIA | SPACE
 */
import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { WEBCAM_SOURCES, type WebcamSource } from '@/data/news-sources';
import { useVariant } from '@/variants';

type RegionFilter = 'iran_attacks' | 'all' | 'mideast' | 'europe' | 'americas' | 'asia' | 'space';

const REGION_TABS: { id: RegionFilter; label: string }[] = [
  { id: 'iran_attacks', label: 'IRAN ATTACKS' },
  { id: 'all', label: 'ALL' },
  { id: 'mideast', label: 'MIDEAST' },
  { id: 'europe', label: 'EUROPE' },
  { id: 'americas', label: 'AMERICAS' },
  { id: 'asia', label: 'ASIA' },
  { id: 'space', label: 'SPACE' },
];

export function LiveWebcams() {
  const { variant } = useVariant();
  const [activeRegion, setActiveRegion] = useState<RegionFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCams = useMemo(() => {
    if (activeRegion === 'all') return WEBCAM_SOURCES;
    if (activeRegion === 'iran_attacks') {
      return WEBCAM_SOURCES.filter((c) =>
        ['Tehran', 'Tel Aviv', 'Beirut', 'Baghdad', 'Damascus', 'Jerusalem'].includes(c.name)
      );
    }
    return WEBCAM_SOURCES.filter((c) => c.region === activeRegion);
  }, [activeRegion]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-3 py-1.5 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: variant.colors.text }}>
            LIVE WEBCAMS
          </span>
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary }}
          >
            {filteredCams.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx('text-xs px-1', viewMode === 'grid' ? 'text-white' : 'text-gray-500')}
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx('text-xs px-1', viewMode === 'list' ? 'text-white' : 'text-gray-500')}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Region tabs */}
      <div
        className="flex gap-0.5 px-2 py-1 overflow-x-auto shrink-0 border-b"
        style={{ borderColor: variant.colors.border }}
      >
        {REGION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRegion(tab.id)}
            className={clsx(
              'text-[8px] font-mono font-bold px-2 py-0.5 rounded-sm whitespace-nowrap transition-colors',
              activeRegion === tab.id
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            )}
            style={
              activeRegion === tab.id
                ? {
                    backgroundColor:
                      tab.id === 'iran_attacks' ? '#FF3B3030' : `${variant.colors.primary}20`,
                    color: tab.id === 'iran_attacks' ? '#FF3B30' : variant.colors.primary,
                  }
                : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Webcam grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-1.5">
            {filteredCams.map((cam) => (
              <WebcamCard key={cam.id} cam={cam} />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCams.map((cam) => (
              <WebcamListItem key={cam.id} cam={cam} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WebcamCard({ cam }: { cam: WebcamSource }) {
  const { variant } = useVariant();
  return (
    <div
      className="relative rounded overflow-hidden cursor-pointer group"
      style={{ backgroundColor: variant.colors.surface }}
    >
      {/* Placeholder thumbnail */}
      <div
        className="aspect-video flex items-center justify-center"
        style={{ backgroundColor: `${cam.thumbnailColor}15` }}
      >
        <div className="text-center">
          <div className="text-2xl opacity-40">📹</div>
          <div className="text-[8px] font-mono text-gray-500 mt-0.5">{cam.name}</div>
        </div>
      </div>
      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono text-white font-bold">{cam.name}</span>
          {cam.streamType === 'live' && (
            <span className="text-[7px] bg-red-500/80 text-white px-1 rounded font-mono">
              LIVE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function WebcamListItem({ cam }: { cam: WebcamSource }) {
  const { variant } = useVariant();
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer"
      style={{ borderBottom: `1px solid ${variant.colors.border}` }}
    >
      <div
        className="w-8 h-8 rounded flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${cam.thumbnailColor}20` }}
      >
        <span className="text-sm">📹</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-mono font-bold" style={{ color: variant.colors.text }}>
          {cam.name}
        </div>
        <div className="text-[9px]" style={{ color: variant.colors.textMuted }}>
          {cam.location}
        </div>
      </div>
      {cam.streamType === 'live' && (
        <span className="text-[7px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-mono">
          LIVE
        </span>
      )}
    </div>
  );
}
