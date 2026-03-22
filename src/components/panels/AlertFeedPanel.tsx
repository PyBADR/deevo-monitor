/**
 * AlertFeedPanel — Real-time alert feed (THE RISK ZONE style).
 * Shows tagged alerts: [ALERT] [FRAUD] [REGULATORY] [WEATHER] [REINSURANCE]
 */
import { useMemo } from "react";
function formatDistanceToNow(date: Date, _opts?: { addSuffix?: boolean }): string {
  const now = Date.now();
  const diff = Math.max(0, now - date.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
import { clsx } from "clsx";
import { useDataStore } from "@/stores/dataStore";
import { LiveDot } from "@/components/shared/LiveDot";

type AlertTag = "ALERT" | "FRAUD" | "REGULATORY" | "WEATHER" | "REINSURANCE" | "CYBER" | "CLAIMS";

interface AlertEntry {
  id: string;
  timestamp: string;
  tag: AlertTag;
  title: string;
  region: string;
  source: string;
}

const TAG_COLORS: Record<AlertTag, string> = {
  ALERT: "bg-red-500/20 text-red-400 border-red-500/30",
  FRAUD: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  REGULATORY: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  WEATHER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  REINSURANCE: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  CYBER: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  CLAIMS: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

function feedToAlerts(feedItems: Array<{ id: string; timestamp: string; title: string; category: string; country?: string; source: string }>): AlertEntry[] {
  const tagMap: Record<string, AlertTag> = {
    fraud: "FRAUD",
    regulatory: "REGULATORY",
    weather: "WEATHER",
    cyber: "CYBER",
    claims: "CLAIMS",
    geopolitical: "ALERT",
    risk: "ALERT",
    market: "REINSURANCE",
  };
  return feedItems.slice(0, 30).map((item) => ({
    id: item.id,
    timestamp: item.timestamp,
    tag: tagMap[item.category] ?? "ALERT",
    title: item.title,
    region: item.country ?? "GCC",
    source: item.source,
  }));
}

export function AlertFeedPanel() {
  const feedItems = useDataStore((s) => s.feedItems);
  const alerts = useMemo(() => feedToAlerts(feedItems), [feedItems]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-surface-3 flex items-center gap-2">
        <span className="text-red-400 text-xs">⚡</span>
        <h2 className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider font-mono">
          Alert Feed
        </h2>
        <LiveDot status="live" size="sm" />
        <span className="text-[9px] text-gray-600 ml-auto font-mono">
          {alerts.length}
        </span>
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="px-3 py-1.5 border-b border-surface-3/20 hover:bg-surface-2/20 animate-slide-in"
          >
            <div className="flex items-start gap-2">
              {/* Tag */}
              <span
                className={clsx(
                  "text-[8px] px-1.5 py-0.5 rounded border font-mono shrink-0 mt-0.5",
                  TAG_COLORS[alert.tag]
                )}
              >
                {alert.tag}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-300 truncate">
                  {alert.title}
                </div>
                <div className="flex gap-2 text-[9px] text-gray-600 mt-0.5">
                  <span>{alert.region}</span>
                  <span>{alert.source}</span>
                  <span className="ml-auto">
                    {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
