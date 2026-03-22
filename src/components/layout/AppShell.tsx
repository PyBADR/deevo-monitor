/**
 * AppShell — Master layout (worldmonitor-style CSS Grid).
 * v4.0: Added Live News, Webcams, Strategic Posture, Country Intel panels.
 * v4.1: Added Finance Radar, Correlation, 3D Globe toggle.
 * v4.2: Added Market, Crypto, Energy, Gold, Central Bank, Premium Stocks,
 *        Telegram Intel, Daily Market, KPI Overview, Region News panels.
 * Bottom panel now has a 3-column layout matching worldmonitor:
 *   [Live News] [Live Webcams] [AI Insights / Strategic Posture]
 *
 * Architecture Layer: UI (L6)
 */
import { GCCMap } from "@/components/map/GCCMap";
import { GlobeView } from "@/components/map/GlobeView";
import { LayerPanel } from "@/components/map/LayerPanel";
import { RiskLegend } from "@/components/map/RiskLegend";
import { StatusBar } from "@/components/layout/StatusBar";
import { LiveFeed } from "@/components/panels/LiveFeed";
import { AIInsights } from "@/components/panels/AIInsights";
import { ForecastPanel } from "@/components/panels/ForecastPanel";
import { AlertFeedPanel } from "@/components/panels/AlertFeedPanel";
import { RiskScore } from "@/components/panels/RiskScore";
import { PipelineStats } from "@/components/panels/PipelineStats";
import { LiveNewsPanel } from "@/components/panels/LiveNewsPanel";
import { LiveWebcams } from "@/components/panels/LiveWebcams";
import { StrategicPosture } from "@/components/panels/StrategicPosture";
import { CountryIntelligence } from "@/components/panels/CountryIntelligence";
import { FinanceRadar } from "@/components/panels/FinanceRadar";
import { CorrelationPanel } from "@/components/panels/CorrelationPanel";
import {
  RegionNewsPanel,
  MarketFinancePanel,
  CryptoPanel,
  EnergyPanel,
  GoldSilverPanel,
  CentralBankPanel,
  PremiumStocksPanel,
  DailyMarketPanel,
  TelegramIntelPanel,
  KPIOverviewPanel,
} from "@/components/panels/MarketPanels";
import { useDataStore } from "@/stores/dataStore";
import { useSocket } from "@/hooks/useSocket";
import { useInitialData } from "@/hooks/useApi";
import { LiveDot } from "@/components/shared/LiveDot";
import { ThemeInjector, useVariant } from "@/variants";
import { useState } from "react";
import { clsx } from "clsx";

type BottomViewMode = 'split' | 'tabs';

type BottomTabId =
  | 'feed' | 'news' | 'webcams' | 'ai' | 'posture' | 'intel'
  | 'risk' | 'forecast' | 'alerts' | 'pipeline' | 'finance'
  | 'correlation' | 'region' | 'market' | 'crypto' | 'energy'
  | 'gold' | 'central' | 'premium' | 'daily' | 'telegram' | 'kpi';

export function AppShell() {
  useSocket();
  useInitialData();

  const { variant } = useVariant();
  const [bottomViewMode, setBottomViewMode] = useState<BottomViewMode>('split');
  const [mapMode, setMapMode] = useState<'2d' | '3d'>('2d');
  const [bottomTab, setBottomTab] = useState<BottomTabId>('feed');

  // Build tab list based on variant's showPanels config
  const tabs: { id: BottomTabId; label: string; color: string }[] = [
    variant.showPanels.liveFeed ? { id: 'feed', label: 'INTEL FEED', color: variant.colors.primary } : null,
    variant.showPanels.liveNews ? { id: 'news', label: 'LIVE NEWS', color: '#FF6B35' } : null,
    variant.showPanels.webcams ? { id: 'webcams', label: 'WEBCAMS', color: '#5AC8FA' } : null,
    variant.showPanels.aiInsights ? { id: 'ai', label: 'AI INSIGHTS', color: variant.colors.success } : null,
    variant.showPanels.strategicPosture ? { id: 'posture', label: 'POSTURE', color: '#FF2D55' } : null,
    variant.showPanels.countryIntel ? { id: 'intel', label: 'COUNTRY INTEL', color: '#FFD600' } : null,
    variant.showPanels.riskIndex ? { id: 'risk', label: 'RISK INDEX', color: variant.colors.warning } : null,
    { id: 'finance', label: 'FINANCE', color: '#10B981' },
    { id: 'correlation', label: 'CORRELATION', color: '#A78BFA' },
    { id: 'region', label: 'REGION NEWS', color: '#F59E0B' },
    { id: 'market', label: 'MARKET', color: '#3B82F6' },
    { id: 'crypto', label: 'CRYPTO', color: '#F7931A' },
    { id: 'energy', label: 'ENERGY', color: '#EF4444' },
    { id: 'gold', label: 'GOLD', color: '#FFD700' },
    { id: 'central', label: 'CENTRAL BANKS', color: '#6366F1' },
    { id: 'premium', label: 'STOCKS', color: '#14B8A6' },
    { id: 'daily', label: 'DAILY', color: '#EC4899' },
    { id: 'telegram', label: 'TELEGRAM', color: '#0EA5E9' },
    { id: 'kpi', label: 'KPI', color: '#8B5CF6' },
    { id: 'forecast', label: 'FORECASTS', color: '#FF6B35' },
    { id: 'alerts', label: 'ALERTS', color: variant.colors.critical },
    { id: 'pipeline', label: 'PIPELINE', color: variant.colors.primary },
  ].filter((t): t is { id: BottomTabId; label: string; color: string } => t !== null);

  // Check if the split (worldmonitor-style 3-column) mode should be shown
  const showSplitMode = variant.showPanels.liveNews && variant.showPanels.webcams;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: variant.colors.bg }}>
      <ThemeInjector />

      {/* ── StatusBar ─────────────────────────────────── */}
      <StatusBar />

      {/* ── Map Area ──────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {mapMode === '2d' ? <GCCMap /> : <GlobeView />}
        <LayerPanel />
        <RiskLegend />

        {/* 2D/3D Toggle overlay (top-right, worldmonitor-style) */}
        <div className="absolute top-3 right-3 z-20">
          <Map2D3DOverlay mode={mapMode} setMode={setMapMode} />
        </div>
      </div>

      {/* ── Bottom Panel Section ──────────────────────── */}
      <div
        className="h-[300px] shrink-0 flex flex-col border-t"
        style={{ borderColor: variant.colors.border }}
      >
        {/* View mode toggle + Tab bar */}
        <div
          className="h-8 flex items-center px-1 shrink-0 border-b overflow-x-auto"
          style={{
            backgroundColor: variant.colors.bg,
            borderColor: variant.colors.border,
          }}
        >
          {/* Split/Tab mode toggle */}
          {showSplitMode && (
            <div className="flex items-center gap-0.5 mr-2 pl-1 shrink-0">
              <button
                onClick={() => setBottomViewMode('split')}
                className={clsx(
                  'text-[8px] font-mono px-1.5 py-0.5 rounded',
                  bottomViewMode === 'split' ? 'text-white' : 'text-gray-600'
                )}
                style={bottomViewMode === 'split' ? { backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary } : undefined}
                title="Split view (worldmonitor-style)"
              >
                ⊞
              </button>
              <button
                onClick={() => setBottomViewMode('tabs')}
                className={clsx(
                  'text-[8px] font-mono px-1.5 py-0.5 rounded',
                  bottomViewMode === 'tabs' ? 'text-white' : 'text-gray-600'
                )}
                style={bottomViewMode === 'tabs' ? { backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary } : undefined}
                title="Tab view"
              >
                ☰
              </button>
            </div>
          )}

          {/* Tab buttons (shown in tab mode, or when not split-mode capable) */}
          {(bottomViewMode === 'tabs' || !showSplitMode) && tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setBottomTab(tab.id)}
              className={clsx(
                "h-full px-2 text-[9px] font-mono uppercase tracking-wider transition-colors relative shrink-0 whitespace-nowrap",
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

          {/* Split mode label */}
          {bottomViewMode === 'split' && showSplitMode && (
            <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>
              LIVE NEWS | WEBCAMS | AI INSIGHTS
            </span>
          )}

          <div className="ml-auto flex items-center gap-2 pr-2 shrink-0">
            <LiveDot status="live" size="sm" />
          </div>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-hidden" style={{ backgroundColor: variant.colors.surface }}>
          {bottomViewMode === 'split' && showSplitMode ? (
            /* ── Worldmonitor-style 3-column split ── */
            <div className="h-full grid grid-cols-3 divide-x" style={{ borderColor: variant.colors.border }}>
              <div className="overflow-hidden" style={{ borderColor: variant.colors.border }}>
                <LiveNewsPanel />
              </div>
              <div className="overflow-hidden" style={{ borderColor: variant.colors.border }}>
                <LiveWebcams />
              </div>
              <div className="overflow-hidden">
                <StrategicPosture />
              </div>
            </div>
          ) : (
            /* ── Single tab view ── */
            <>
              {bottomTab === 'feed' && <LiveFeed />}
              {bottomTab === 'news' && <LiveNewsPanel />}
              {bottomTab === 'webcams' && <LiveWebcams />}
              {bottomTab === 'ai' && <AIInsights />}
              {bottomTab === 'posture' && <StrategicPosture />}
              {bottomTab === 'intel' && <CountryIntelligence />}
              {bottomTab === 'risk' && <RiskScore />}
              {bottomTab === 'forecast' && <ForecastPanel />}
              {bottomTab === 'alerts' && <AlertFeedPanel />}
              {bottomTab === 'pipeline' && <PipelineStats />}
              {bottomTab === 'finance' && <FinanceRadar />}
              {bottomTab === 'correlation' && <CorrelationPanel />}
              {bottomTab === 'region' && <RegionNewsPanel />}
              {bottomTab === 'market' && <MarketFinancePanel />}
              {bottomTab === 'crypto' && <CryptoPanel />}
              {bottomTab === 'energy' && <EnergyPanel />}
              {bottomTab === 'gold' && <GoldSilverPanel />}
              {bottomTab === 'central' && <CentralBankPanel />}
              {bottomTab === 'premium' && <PremiumStocksPanel />}
              {bottomTab === 'daily' && <DailyMarketPanel />}
              {bottomTab === 'telegram' && <TelegramIntelPanel />}
              {bottomTab === 'kpi' && <KPIOverviewPanel />}
            </>
          )}
        </div>
      </div>

      {/* ── Bottom Ticker ─────────────────────────────── */}
      <BottomTicker />
    </div>
  );
}

function Map2D3DOverlay({ mode, setMode }: { mode: '2d' | '3d'; setMode: (m: '2d' | '3d') => void }) {
  const { variant } = useVariant();
  return (
    <div
      className="flex rounded-lg overflow-hidden border shadow-lg"
      style={{
        borderColor: variant.colors.border,
        backgroundColor: `${variant.colors.bg}E0`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <button
        onClick={() => setMode('2d')}
        className={clsx(
          'text-[11px] font-mono font-bold px-3 py-1.5 transition-colors',
          mode === '2d' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
        )}
        style={mode === '2d' ? { backgroundColor: `${variant.colors.primary}30`, color: variant.colors.primary } : undefined}
      >
        2D
      </button>
      <button
        onClick={() => setMode('3d')}
        className={clsx(
          'text-[11px] font-mono font-bold px-3 py-1.5 transition-colors',
          mode === '3d' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
        )}
        style={mode === '3d' ? { backgroundColor: `${variant.colors.primary}30`, color: variant.colors.primary } : undefined}
      >
        3D
      </button>
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
