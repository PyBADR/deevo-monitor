/**
 * LiveFeed — Real-time intelligence feed panel.
 * Scrollable list of FeedItems with severity coloring and category filters.
 */
import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { clsx } from "clsx";
import { useDataStore } from "@/stores/dataStore";
import type { FeedCategory, FeedSeverity } from "@/types";

const SEVERITY_COLORS: Record<FeedSeverity, string> = {
  critical: "border-red-500 bg-red-500/5",
  high: "border-orange-500 bg-orange-500/5",
  medium: "border-amber-500 bg-amber-500/5",
  low: "border-yellow-600 bg-yellow-600/5",
  info: "border-cyan-500 bg-cyan-500/5",
};

const CATEGORY_LABELS: Record<FeedCategory, { icon: string; label: string }> = {
  fraud: { icon: "!", label: "Fraud" },
  risk: { icon: "△", label: "Risk" },
  claims: { icon: "✦", label: "Claims" },
  geopolitical: { icon: "⚑", label: "Geo" },
  regulatory: { icon: "§", label: "Reg" },
  weather: { icon: "☁", label: "Weather" },
  cyber: { icon: "⌥", label: "Cyber" },
  market: { icon: "◈", label: "Market" },
};

export function LiveFeed() {
  const feedItems = useDataStore((s) => s.feedItems);
  const [activeFilter, setActiveFilter] = useState<FeedCategory | "all">("all");

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return feedItems.slice(0, 50);
    return feedItems.filter((i) => i.category === activeFilter).slice(0, 50);
  }, [feedItems, activeFilter]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-surface-3">
        <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <span className="text-accent-cyan animate-pulse">◉</span>
          Live Intelligence Feed
          <span className="text-[10px] text-gray-500 font-mono ml-auto">
            {feedItems.length} items
          </span>
        </h2>
      </div>

      {/* Category filters */}
      <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-surface-3/50">
        <FilterChip
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
          label="All"
        />
        {(Object.entries(CATEGORY_LABELS) as [FeedCategory, { icon: string; label: string }][]).map(
          ([cat, { icon, label }]) => (
            <FilterChip
              key={cat}
              active={activeFilter === cat}
              onClick={() => setActiveFilter(cat)}
              label={`${icon} ${label}`}
            />
          )
        )}
      </div>

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No items matching filter
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={clsx(
                "feed-item border-l-2 px-3 py-2 hover:bg-surface-2/50 transition-colors cursor-pointer",
                SEVERITY_COLORS[item.severity]
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-200 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">
                    {item.summary}
                  </div>
                </div>
                {item.country && (
                  <span className="text-[10px] text-gray-500 font-mono shrink-0">
                    {item.country}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-500">
                  {CATEGORY_LABELS[item.category]?.icon} {item.source}
                </span>
                <span className="text-[10px] text-gray-600 ml-auto">
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

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap transition-colors",
        active
          ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
          : "text-gray-500 hover:text-gray-300 border border-transparent"
      )}
    >
      {label}
    </button>
  );
}
