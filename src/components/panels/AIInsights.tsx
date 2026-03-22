/**
 * AIInsights — Panel showing Ollama-generated intelligence analysis.
 * Displays recent AI insights with confidence scores and action items.
 * Includes a prompt input for ad-hoc analysis requests.
 */
import { useState, useRef } from "react";
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
import { useSocket } from "@/hooks/useSocket";

export function AIInsights() {
  const insights = useDataStore((s) => s.insights);
  const socketRef = useSocket();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    socketRef.current?.emit("insight:request", prompt.trim());
    setPrompt("");

    // Auto-reset loading after timeout
    setTimeout(() => setLoading(false), 15_000);
  };

  // Reset loading when new insight arrives
  if (loading && insights.length > 0) {
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-surface-3">
        <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <span className="text-accent-emerald">⬡</span>
          AI Insights
          <span className="text-[10px] font-mono ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400">Ollama</span>
            <span className="text-gray-600">Local AI</span>
          </span>
        </h2>
      </div>

      {/* Step progress indicator */}
      {loading && (
        <div className="px-3 py-2 border-b border-surface-3/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className="w-5 h-5 rounded-full text-[8px] font-mono flex items-center justify-center border"
                  style={{
                    borderColor: step <= 2 ? '#10B981' : '#374151',
                    backgroundColor: step <= 2 ? '#10B98120' : 'transparent',
                    color: step <= 2 ? '#10B981' : '#6B7280',
                  }}
                >
                  {step}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-mono text-gray-400 animate-pulse">
              Step 2/4 · Analyzing sentiment...
            </span>
          </div>
          <div className="mt-1.5 h-1 bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: '50%', backgroundColor: '#10B981' }}
            />
          </div>
        </div>
      )}

      {/* Prompt input */}
      <form onSubmit={handleSubmit} className="px-3 py-2 border-b border-surface-3/50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Deevo AI..."
            className="flex-1 bg-surface-2 text-gray-200 text-xs px-3 py-1.5 rounded border border-surface-3 focus:border-accent-cyan focus:outline-none placeholder:text-gray-600"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className={clsx(
              "text-xs px-3 py-1.5 rounded font-medium transition-colors",
              loading
                ? "bg-surface-3 text-gray-500"
                : "bg-accent-emerald/20 text-accent-emerald hover:bg-accent-emerald/30"
            )}
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </form>

      {/* Insights list */}
      <div className="flex-1 overflow-y-auto">
        {insights.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-xs">
            <p className="mb-2">No AI insights yet</p>
            <p className="text-gray-600">
              Ask a question above or insights will appear
              as the risk engine detects patterns.
            </p>
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className="px-3 py-2 border-b border-surface-3/30 hover:bg-surface-2/30"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-gray-200">
                  {insight.title}
                </span>
                <ConfidenceBadge value={insight.confidence} />
              </div>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                {insight.content.slice(0, 300)}
                {insight.content.length > 300 && "..."}
              </p>
              {insight.suggestedAction && (
                <div className="mt-1.5 text-[10px] text-accent-emerald bg-accent-emerald/10 px-2 py-1 rounded">
                  Action: {insight.suggestedAction}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-600 font-mono">
                  {insight.model}
                </span>
                <span className="text-[10px] text-gray-600 ml-auto">
                  {formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <span
      className={clsx(
        "text-[10px] font-mono px-1.5 py-0.5 rounded",
        pct >= 80 && "bg-green-500/20 text-green-400",
        pct >= 50 && pct < 80 && "bg-amber-500/20 text-amber-400",
        pct < 50 && "bg-red-500/20 text-red-400"
      )}
    >
      {pct}%
    </span>
  );
}
