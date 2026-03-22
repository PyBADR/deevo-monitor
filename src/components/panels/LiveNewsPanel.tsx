/**
 * LiveNewsPanel — Multi-source live news panel (worldmonitor-style).
 * Fetches REAL RSS feeds via /api/feeds/rss or client-side CORS proxy fallback.
 * Source tabs: ALL, BLOOMBERG, SKYNEWS, EURONEWS, DW, CNBC, CNN, FRANCE 24, ALARABIYA, ALJAZEERA, BBC, REUTERS
 *
 * Architecture Layer: UI (L6)
 */
import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { NEWS_SOURCES } from '@/data/news-sources';
import { useVariant } from '@/variants';
import { useRSSFeeds, type RSSNewsItem } from '@/hooks/useRSSFeeds';

function timeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function LiveNewsPanel() {
  const { variant } = useVariant();
  const { items, loading, error, lastUpdated, refetch } = useRSSFeeds();
  const [activeSource, setActiveSource] = useState<string>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeSource === 'all') return items.slice(0, 50);
    return items
      .filter((item) => item.sourceId === activeSource)
      .slice(0, 30);
  }, [items, activeSource]);

  const itemCount = filteredItems.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header with LIVE/PAUSED toggle and count */}
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
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${variant.colors.primary}15`, color: variant.colors.primary }}
          >
            {itemCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-[9px] font-mono text-gray-500 hover:text-gray-300 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
            title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={refetch}
            className="text-[9px] font-mono text-gray-500 hover:text-gray-300 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
            title="Refresh feeds"
          >
            ↻
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-[9px] font-mono text-gray-500 hover:text-gray-300 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? '⊟' : '⊞'}
          </button>
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
          count={items.length}
        />
        {NEWS_SOURCES.map((src) => {
          const count = items.filter((i) => i.sourceId === src.id).length;
          return (
            <SourceTab
              key={src.id}
              name={src.nameShort}
              active={activeSource === src.id}
              onClick={() => setActiveSource(src.id)}
              color={src.color}
              count={count}
            />
          );
        })}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-4 text-center" style={{ color: variant.colors.textMuted }}>
          <div className="text-xs animate-pulse">Fetching live news feeds ...</div>
          <div className="flex justify-center gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ backgroundColor: variant.colors.primary, animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && filteredItems.length === 0 && (
        <div className="p-4 text-center" style={{ color: variant.colors.textMuted }}>
          <div className="text-xs">Unable to fetch live feeds</div>
          <div className="text-[10px] mt-1">{error}</div>
          <button
            onClick={refetch}
            className="text-[10px] mt-2 px-3 py-1 rounded border hover:bg-white/5 transition-colors"
            style={{ borderColor: variant.colors.border, color: variant.colors.primary }}
          >
            Retry
          </button>
        </div>
      )}

      {/* News items */}
      <div className="flex-1 overflow-y-auto">
        {!loading && filteredItems.length === 0 && !error ? (
          <div className="p-4 text-center" style={{ color: variant.colors.textMuted }}>
            <div className="text-xs">No items from this source yet</div>
            <div className="text-[10px] mt-1">Headlines will appear as feeds update</div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <NewsItem key={item.id} item={item} variant={variant} />
          ))
        )}
      </div>

      {/* Footer status */}
      {lastUpdated && (
        <div
          className="px-3 py-1 border-t text-[8px] font-mono flex items-center justify-between shrink-0"
          style={{ borderColor: variant.colors.border, color: variant.colors.textMuted }}
        >
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <span>{items.length} headlines from {new Set(items.map((i) => i.sourceId)).size} sources</span>
        </div>
      )}
    </div>
  );
}

function NewsItem({ item, variant }: { item: RSSNewsItem; variant: any }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-3 py-2 border-b hover:bg-white/5 transition-colors cursor-pointer"
      style={{ borderColor: `${variant.colors.border}` }}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium leading-snug" style={{ color: variant.colors.text }}>
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
      </div>
      <div className="flex items-center gap-2 mt-1">
        <SourceBadge sourceId={item.sourceId} sourceName={item.source} />
        <span className="text-[9px] ml-auto" style={{ color: variant.colors.textMuted }}>
          {timeAgo(item.timestamp)}
        </span>
      </div>
    </a>
  );
}

function SourceTab({
  name,
  active,
  onClick,
  color,
  count,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
  color: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'text-[8px] font-mono font-bold px-2 py-0.5 rounded-sm whitespace-nowrap transition-colors flex items-center gap-1',
        active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
      )}
      style={active ? { backgroundColor: `${color}30`, color } : undefined}
    >
      {name}
      {count !== undefined && count > 0 && (
        <span className="text-[7px] opacity-60">{count}</span>
      )}
    </button>
  );
}

function SourceBadge({ sourceId, sourceName }: { sourceId: string; sourceName: string }) {
  const src = NEWS_SOURCES.find((s) => s.id === sourceId);
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
