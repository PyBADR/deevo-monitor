/**
 * LiveNewsPanel — Multi-source live news panel (worldmonitor-style).
 * Source tabs: BLOOMBERG, SKYNEWS, EURONEWS, DW, CNBC, CNN, FRANCE 24, ALARABIYA, ALJAZEERA
 * Each tab shows recent headlines from that source's RSS feed.
 * Includes a PAUSED/LIVE toggle and channel switcher.
 */
import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { NEWS_SOURCES } from '@/data/news-sources';
import { useDataStore } from '@/stores/dataStore';
import { useVariant } from '@/variants';

export function LiveNewsPanel() {
  const { variant } = useVariant();
  const feedItems = useDataStore((s) => s.feedItems);
  const [activeSource, setActiveSource] = useState<string>('all');
  const [isPaused, setIsPaused] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeSource === 'all') return feedItems.slice(0, 30);
    return feedItems
      .filter((item) => item.source.toLowerCase().includes(activeSource))
      .slice(0, 20);
  }, [feedItems, activeSource]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with LIVE/PAUSED toggle */}
      <div
        className="px-3 py-1.5 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: variant.colors.text }}>
            LIVE NEWS
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={clsx(
              'text-[9px] font-mono px-2 py-0.5 rounded',
              isPaused
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-green-500/20 text-green-400'
            )}
          >
            {isPaused ? '⏸ PAUSED' : '● LIVE'}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="text-[10px] text-gray-500 hover:text-gray-300 px-1">◀</button>
          <button className="text-[10px] text-gray-500 hover:text-gray-300 px-1">▶</button>
        </div>
      </div>

      {/* Source tabs */}
      <div
        className="flex gap-0.5 px-2 py-1 overflow-x-auto shrink-0 border-b"
        style={{ borderColor: variant.colors.border }}
      >
        <SourceTab
          name="ALL"
          active={activeSource === 'all'}
          onClick={() => setActiveSource('all')}
          color={variant.colors.primary}
        />
        {NEWS_SOURCES.map((src) => (
          <SourceTab
            key={src.id}
            name={src.nameShort}
            active={activeSource === src.id}
            onClick={() => setActiveSource(src.id)}
            color={src.color}
          />
        ))}
      </div>

      {/* News items */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="p-4 text-center" style={{ color: variant.colors.textMuted }}>
            <div className="text-xs">No items from this source yet</div>
            <div className="text-[10px] mt-1">Headlines will appear as feeds update</div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="px-3 py-2 border-b hover:bg-white/5 transition-colors cursor-pointer"
              style={{ borderColor: `${variant.colors.border}` }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium" style={{ color: variant.colors.text }}>
                    {item.title}
                  </div>
                  {item.summary && (
                    <div
                      className="text-[10px] mt-0.5 line-clamp-2"
                      style={{ color: variant.colors.textSecondary }}
                    >
                      {item.summary}
                    </div>
                  )}
                </div>
                {item.severity === 'critical' && (
                  <span className="text-[8px] bg-red-500/20 text-red-400 px-1 py-0.5 rounded font-mono shrink-0">
                    BREAKING
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <SourceBadge sourceName={item.source} />
                <span className="text-[9px]" style={{ color: variant.colors.textMuted }}>
                  {item.country || ''}
                </span>
                <span className="text-[9px] ml-auto" style={{ color: variant.colors.textMuted }}>
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SourceTab({
  name,
  active,
  onClick,
  color,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'text-[8px] font-mono font-bold px-2 py-0.5 rounded-sm whitespace-nowrap transition-colors',
        active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
      )}
      style={active ? { backgroundColor: `${color}30`, color } : undefined}
    >
      {name}
    </button>
  );
}

function SourceBadge({ sourceName }: { sourceName: string }) {
  const src = NEWS_SOURCES.find(
    (s) => sourceName.toLowerCase().includes(s.id) || sourceName.toLowerCase().includes(s.name.toLowerCase())
  );
  return (
    <span
      className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded"
      style={{
        backgroundColor: src ? `${src.color}25` : '#333',
        color: src?.color || '#888',
      }}
    >
      {src?.nameShort || sourceName.slice(0, 8).toUpperCase()}
    </span>
  );
}
