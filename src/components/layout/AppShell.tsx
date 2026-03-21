/**
 * AppShell — Master layout (worldmonitor-style CSS Grid).
 *
 * ┌─────────────────────────────────────────────────────┐
 * │ StatusBar (h:40px fixed top)                        │
 * ├──────────────────────────────────────────────────────┤
 * │                                                     │
 * │     DeevoMap (fills remaining height)               │
 * │     + LayerPanel overlay (left)                     │
 * │     + RiskLegend overlay (bottom-left)              │
 * │                                                     │
 * ├──────────────┬────────────┬──────────┬──────────────┤
 * │ LiveFeed     │ AIInsights │ Forecast │ AlertFeed    │
 * │ (25%)        │ (25%)      │ (25%)    │ (25%)        │
 * └──────────────┴────────────┴──────────┴──────────────┘
 * └─ BottomTicker (h:32px)                              ┘
 */
import { GCCMap } from "@/components/map/GCCMap";
import { LayerPanel } from "@/components/map/LayerPanel";
import { RiskLegend } from "@/components/map/RiskLegend";
import { StatusBar } from "@/components/layout/StatusBar";
import { LiveFeed } from "@/components/panels/LiveFeed";
import { AIInsights } from "@/components/panels/AIInsights";
import { ForecastPanel } from "@/components/panels/ForecastPanel";
import { AlertFeedPanel } from "@/components/panels/AlertFeedPanel";
import { RiskScore } from "@/components/panels/RiskScore";
import { PipelineStats } from "@/components/panels/PipelineStats";
import { useDataStore } from "@/stores/dataStore";
import { useSocket } from "@/hooks/useSocket";
import { useInitialData } from "@/hooks/useApi";
import { LiveDot } from "@/components/shared/LiveDot";
import { useState } from "react";
import { clsx } from "clsx";

export function AppShell() {
  // Initialize data streams
  useSocket();
  useInitialData();

  const [bottomTab, setBottomTab] = useState<
    "feed" | "ai" | "risk" | "forecast" | "alerts" | "pipeline"
  >("feed");

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0A0E1A] overflow-hidden">
      {/* ── StatusBar ─────────────────────────────────── */}
      <StatusBar />

      {/* ── Map Area ──────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <GCCMap />
        <LayerPanel />
        <RiskLegend />
      </div>

      {/* ── Bottom Panel Section ──────────────────────── */}
      <div className="h-[280px] shrink-0 flex flex-col border-t border-[#1F2937]">
        {/* Tab bar */}
        <div className="h-8 flex items-center bg-[#0A0E1A] border-b border-[#1F2937] px-1 shrink-0">
          {[
            { id: "feed" as const, label: "LIVE NEWS", color: "#00D4FF" },
            { id: "ai" as const, label: "AI INSIGHTS", color: "#34C759" },
            { id: "risk" as const, label: "RISK INDEX", color: "#FFD600" },
            { id: "forecast" as const, label: "FORECASTS", color: "#FF6B35" },
            { id: "alerts" as const, label: "ALERTS", color: "#FF2D55" },
            { id: "pipeline" as const, label: "PIPELINE", color: "#00D4FF" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setBottomTab(tab.id)}
              className={clsx(
                "h-full px-3 text-[10px] font-mono uppercase tracking-wider transition-colors relative",
                bottomTab === tab.id
                  ? "text-gray-200"
                  : "text-gray-600 hover:text-gray-400"
              )}
            >
              {tab.label}
              {bottomTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: tab.color }}
                />
              )}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 pr-2">
            <LiveDot status="live" size="sm" />
          </div>
        </div>

        {/* Panel content */}
        <div className="flex-1 bg-[#111827] overflow-hidden">
          {bottomTab === "feed" && <LiveFeed />}
          {bottomTab === "ai" && <AIInsights />}
          {bottomTab === "risk" && <RiskScore />}
          {bottomTab === "forecast" && <ForecastPanel />}
          {bottomTab === "alerts" && <AlertFeedPanel />}
          {bottomTab === "pipeline" && <PipelineStats />}
        </div>
      </div>

      {/* ── Bottom Ticker ─────────────────────────────── */}
      <BottomTicker />
    </div>
  );
}

function BottomTicker() {
  const feedItems = useDataStore((s) => s.feedItems);
  const latest = feedItems[0];

  return (
    <footer className="h-8 flex items-center px-3 bg-[#0A0E1A] border-t border-[#1F2937] text-[10px] font-mono shrink-0 z-20 overflow-hidden">
      <span className="text-[#00D4FF] animate-pulse shrink-0">◉</span>
      <span className="text-gray-600 ml-2 shrink-0">LIVE</span>
      <span className="mx-2 text-[#1F2937]">│</span>
      <div className="flex-1 truncate text-gray-500">
        {latest ? (
          <>
            <span className="text-gray-600">[{latest.category.toUpperCase()}]</span>{" "}
            {latest.title}
          </>
        ) : (
          "Connecting to intelligence feeds..."
        )}
      </div>
      <span className="text-gray-700 ml-2 shrink-0">
        {new Date().toLocaleTimeString("en-US", { hour12: false })}
      </span>
    </footer>
  );
}
