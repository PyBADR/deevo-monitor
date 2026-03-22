/**
 * AppShell — Master layout (worldmonitor-style CSS Grid).
 * Now variant-aware: colors, panels, and layout adapt to active variant.
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
import { ThemeInjector, useVariant } from "@/variants";
import { useState } from "react";
import { clsx } from "clsx";

export function AppShell() {
  useSocket();
  useInitialData();

  const { variant } = useVariant();

  const [bottomTab, setBottomTab] = useState<
    "feed" | "ai" | "risk" | "forecast" | "alerts" | "pipeline"
  >("feed");

  // Build tab list based on variant's showPanels config
  const tabs = [
    variant.showPanels.liveFeed && { id: "feed" as const, label: "LIVE NEWS", color: variant.colors.primary },
    variant.showPanels.aiInsights && { id: "ai" as const, label: "AI INSIGHTS", color: variant.colors.success },
    variant.showPanels.riskIndex && { id: "risk" as const, label: "RISK INDEX", color: variant.colors.warning },
    { id: "forecast" as const, label: "FORECASTS", color: "#FF6B35" },
    { id: "alerts" as const, label: "ALERTS", color: variant.colors.critical },
    { id: "pipeline" as const, label: "PIPELINE", color: variant.colors.primary },
  ].filter(Boolean) as { id: typeof bottomTab; label: string; color: string }[];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: variant.colors.bg }}>
      <ThemeInjector />

      {/* ── StatusBar ─────────────────────────────────── */}
      <StatusBar />

      {/* ── Map Area ──────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <GCCMap />
        <LayerPanel />
        <RiskLegend />
      </div>

      {/* ── Bottom Panel Section ──────────────────────── */}
      <div
        className="h-[280px] shrink-0 flex flex-col border-t"
        style={{ borderColor: variant.colors.border }}
      >
        {/* Tab bar */}
        <div
          className="h-8 flex items-center px-1 shrink-0 border-b"
          style={{
            backgroundColor: variant.colors.bg,
            borderColor: variant.colors.border,
          }}
        >
          {tabs.map((tab) => (
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
        <div className="flex-1 overflow-hidden" style={{ backgroundColor: variant.colors.surface }}>
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
  const { variant } = useVariant();
  const latest = feedItems[0];

  return (
    <footer
      className="h-8 flex items-center px-3 border-t text-[10px] font-mono shrink-0 z-20 overflow-hidden"
      style={{
        backgroundColor: variant.colors.bg,
        borderColor: variant.colors.border,
      }}
    >
      <span className="animate-pulse shrink-0" style={{ color: variant.colors.primary }}>
        ◉
      </span>
      <span style={{ color: variant.colors.textMuted }} className="ml-2 shrink-0">
        LIVE
      </span>
      <span className="mx-2" style={{ color: variant.colors.border }}>│</span>
      <div className="flex-1 truncate" style={{ color: variant.colors.textSecondary }}>
        {latest ? (
          <>
            <span style={{ color: variant.colors.textMuted }}>
              [{latest.category.toUpperCase()}]
            </span>{" "}
            {latest.title}
          </>
        ) : (
          "Connecting to intelligence feeds..."
        )}
      </div>
      <span style={{ color: variant.colors.textMuted }} className="ml-2 shrink-0">
        {new Date().toLocaleTimeString("en-US", { hour12: false })}
      </span>
    </footer>
  );
}
