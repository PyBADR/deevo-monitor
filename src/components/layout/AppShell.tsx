/**
 * AppShell — Main application layout.
 * Grid: [LeftPanel 320px] [Map flex-1] [RightPanel 380px]
 * Top: DRI status bar (48px)
 * Bottom: Live feed ticker (40px)
 *
 * Responsive: panels collapse on < 1024px with toggle buttons.
 */
import { useState } from "react";
import { GCCMap } from "@/components/map/GCCMap";
import { LiveFeed } from "@/components/panels/LiveFeed";
import { RiskScore } from "@/components/panels/RiskScore";
import { AIInsights } from "@/components/panels/AIInsights";
import { PipelineStats } from "@/components/panels/PipelineStats";
import { DRIBadge } from "@/components/shared/DRIBadge";
import { useDataStore } from "@/stores/dataStore";
import { useSocket } from "@/hooks/useSocket";
import { useInitialData } from "@/hooks/useApi";
import { clsx } from "clsx";

export function AppShell() {
  const driLevel = useDataStore((s) => s.driLevel);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [rightTab, setRightTab] = useState<"risk" | "ai">("risk");

  // Initialize data streams
  useSocket();
  useInitialData();

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-0 overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────── */}
      <header className="h-12 flex items-center justify-between px-4 glass-panel rounded-none border-x-0 border-t-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLeftOpen(!leftOpen)}
            className="lg:hidden text-gray-400 hover:text-accent-cyan text-sm"
            title="Toggle feed panel"
          >
            ☰
          </button>
          <span className="text-accent-cyan font-bold text-lg tracking-tight">
            DEEVO MONITOR
          </span>
          <span className="text-[10px] text-gray-600 font-mono hidden sm:inline">
            v2.0.0
          </span>
        </div>

        <div className="flex items-center gap-4">
          <DRIBadge level={driLevel} size="md" />
          <span className="text-[10px] text-gray-500 hidden md:inline">
            GCC Insurance Intelligence
          </span>
          <button
            onClick={() => setRightOpen(!rightOpen)}
            className="lg:hidden text-gray-400 hover:text-accent-cyan text-sm"
            title="Toggle analysis panel"
          >
            ⚙
          </button>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel — Live Feed */}
        <aside
          className={clsx(
            "shrink-0 glass-panel rounded-none border-t-0 border-l-0 border-b-0 z-10 transition-all duration-300 overflow-hidden",
            leftOpen ? "w-80" : "w-0"
          )}
        >
          <LiveFeed />
        </aside>

        {/* Center — Map */}
        <div className="flex-1 relative">
          <GCCMap />
        </div>

        {/* Right Panel — Risk + AI */}
        <aside
          className={clsx(
            "shrink-0 glass-panel rounded-none border-t-0 border-r-0 border-b-0 z-10 flex flex-col transition-all duration-300 overflow-hidden",
            rightOpen ? "w-96" : "w-0"
          )}
        >
          {/* Tab switcher */}
          <div className="flex border-b border-surface-3 shrink-0">
            <button
              onClick={() => setRightTab("risk")}
              className={clsx(
                "flex-1 text-xs py-2 transition-colors",
                rightTab === "risk"
                  ? "text-accent-cyan border-b-2 border-accent-cyan"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              Risk Scores
            </button>
            <button
              onClick={() => setRightTab("ai")}
              className={clsx(
                "flex-1 text-xs py-2 transition-colors",
                rightTab === "ai"
                  ? "text-accent-emerald border-b-2 border-accent-emerald"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              AI Insights
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {rightTab === "risk" ? <RiskScore /> : <AIInsights />}
          </div>

          {/* Pipeline stats — always visible at bottom */}
          <div className="shrink-0 border-t border-surface-3">
            <PipelineStats />
          </div>
        </aside>
      </main>

      {/* ── Bottom Ticker ────────────────────────────────── */}
      <BottomTicker />
    </div>
  );
}

function BottomTicker() {
  const feedItems = useDataStore((s) => s.feedItems);
  const latest = feedItems[0];

  return (
    <footer className="h-10 flex items-center px-4 glass-panel rounded-none border-x-0 border-b-0 text-xs font-mono shrink-0 z-20 overflow-hidden">
      <span className="text-accent-cyan animate-pulse shrink-0">◉</span>
      <span className="text-gray-500 ml-2 shrink-0">LIVE</span>
      <span className="mx-2 text-surface-3">│</span>
      <div className="flex-1 truncate text-gray-400">
        {latest ? (
          <>
            <span className="text-gray-500">[{latest.category.toUpperCase()}]</span>{" "}
            {latest.title}
          </>
        ) : (
          "Connecting to intelligence feeds..."
        )}
      </div>
      <span className="text-gray-600 ml-2 shrink-0">
        {new Date().toLocaleTimeString("en-US", { hour12: false })}
      </span>
    </footer>
  );
}
