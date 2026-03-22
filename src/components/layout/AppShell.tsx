/**
 * AppShell — Master layout (worldmonitor-style CSS Grid).
 * v4.0: Added Live News, Webcams, Strategic Posture, Country Intel panels.
 * v4.1: Added Finance Radar, Correlation, 3D Globe toggle.
 * v4.2: Added Market, Crypto, Energy, Gold, Central Bank, Premium Stocks,
 *        Telegram Intel, Daily Market, KPI Overview, Region News panels.
 * v5.1: 55+ panel tabs — added Core Markets, Fixed Income, Forex, Crypto/Digital,
 *        Central Banks, GCC Investment, Gulf Economic, Consumer Prices, Startups/VC,
 *        Security/Policy, Data Tracking, Supply Chain, Pricing/Marketing, World Clock,
 *        Deevo Project panels. 600+ RSS feeds across 16 categories.
 * v4.3: Full worldmonitor parity — 40+ panel tabs covering every category:
 *        Technology, CryptoNews, Token, PremiumII, GCC Business/Market,
 *        Consumer, BaseMetals, Financial, Economical, LiveCase, GlobalNews,
 *        Topical, Strategy, BrandApplication.
 * Bottom panel now has a 3-column layout matching worldmonitor:
 *   [Live News] [Live Webcams] [AI Insights / Strategic Posture]
 *
 * Architecture Layer: UI (L6)
 */
import { GCCMap } from "@/components/map/GCCMap";
import { LayerPanel } from "@/components/map/LayerPanel";
import { RiskLegend } from "@/components/map/RiskLegend";
import { MapControls } from "@/components/map/MapControls";
import { StatusBar } from "@/components/layout/StatusBar";
import { ProBanner } from "@/components/layout/ProBanner";
import { GlobalSituation } from "@/components/layout/GlobalSituation";
import { Footer } from "@/components/layout/Footer";
import { DiscordButton } from "@/components/layout/DiscordButton";
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
import {
  TechnologyPanel,
  CryptoNewsPanel,
  TokenPanel,
  PremiumStockPanel,
  PremiumMarketNewsPanel,
  PremiumIIPanel,
  GCCBusinessNewsPanel,
  GCCMarketPanel,
  ConsumerPanel,
  EnergyMarketPanel,
  BaseMetalsPanel,
  FinancialOverviewPanel,
  EconomicalPanel,
  LiveCasePanel,
  GlobalNewsPanel,
  TopicalPanel,
  StrategyPanel,
  BrandApplicationPanel,
} from "@/components/panels/ExtendedPanels";
import {
  CoreMarketsPanel,
  FixedIncomePanel,
  ForexCurrenciesPanel,
  CryptoDigitalPanel,
  CentralBanksEconomicPanel,
  GCCInvestmentPanel,
  GulfEconomicPanel,
  ConsumerPricesPanel,
  StartupsVCPanel,
  SecurityPolicyPanel,
  DataTrackingPanel,
  SupplyChainPanel,
  PricingMarketingPanel,
  WorldClockPanel,
  DeevoProjectPanel,
  DiscordPanel,
} from "@/components/panels/FinancePanels";
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
  | 'gold' | 'central' | 'premium' | 'daily' | 'telegram' | 'kpi'
  | 'technology' | 'cryptonews' | 'token' | 'premstock' | 'premnews'
  | 'premii' | 'gccbiz' | 'gccmarket' | 'consumer' | 'energymarket'
  | 'basemetals' | 'financial' | 'economical' | 'livecase'
  | 'globalnews' | 'topical' | 'strategy' | 'brand'
  | 'coremarkets' | 'fixedincome' | 'forex' | 'cryptodigital'
  | 'centralbanks' | 'gccinvest' | 'gulfeconomic' | 'consumerprices'
  | 'startupsvc' | 'securitypolicy' | 'datatracking' | 'supplychain'
  | 'pricingmktg' | 'worldclock' | 'deevoproject' | 'discord';

export function AppShell() {
  useSocket();
  useInitialData();

  const { variant } = useVariant();
  const [bottomViewMode, setBottomViewMode] = useState<BottomViewMode>('split');
  const [bottomTab, setBottomTab] = useState<BottomTabId>('feed');

  // Build tab list based on variant's showPanels config — full worldmonitor parity
  const tabs: { id: BottomTabId; label: string; color: string }[] = [
    // ── Core Intelligence ──
    variant.showPanels.liveFeed ? { id: 'feed', label: 'INTEL FEED', color: variant.colors.primary } : null,
    variant.showPanels.liveNews ? { id: 'news', label: 'LIVE NEWS', color: '#FF6B35' } : null,
    variant.showPanels.webcams ? { id: 'webcams', label: 'WEBCAMS', color: '#5AC8FA' } : null,
    variant.showPanels.aiInsights ? { id: 'ai', label: 'AI INSIGHTS', color: variant.colors.success } : null,
    variant.showPanels.strategicPosture ? { id: 'posture', label: 'POSTURE', color: '#FF2D55' } : null,
    variant.showPanels.countryIntel ? { id: 'intel', label: 'COUNTRY INTEL', color: '#FFD600' } : null,
    variant.showPanels.riskIndex ? { id: 'risk', label: 'RISK INDEX', color: variant.colors.warning } : null,
    { id: 'strategy', label: 'STRATEGY', color: '#DC2626' },
    { id: 'livecase', label: 'LIVE CASE', color: '#F97316' },
    // ── Markets & Finance ──
    { id: 'finance', label: 'FINANCE', color: '#10B981' },
    { id: 'market', label: 'MARKET', color: '#3B82F6' },
    { id: 'financial', label: 'FINANCIAL', color: '#059669' },
    { id: 'economical', label: 'ECONOMICAL', color: '#7C3AED' },
    { id: 'premium', label: 'STOCKS', color: '#14B8A6' },
    { id: 'premstock', label: 'PREM STOCK', color: '#0D9488' },
    { id: 'premnews', label: 'PREM NEWS', color: '#0891B2' },
    { id: 'premii', label: 'PREMIUM II', color: '#6D28D9' },
    { id: 'daily', label: 'DAILY', color: '#EC4899' },
    // ── Commodities ──
    { id: 'energy', label: 'ENERGY', color: '#EF4444' },
    { id: 'energymarket', label: 'PTC MARKET', color: '#B91C1C' },
    { id: 'gold', label: 'GOLD & SILVER', color: '#FFD700' },
    { id: 'basemetals', label: 'BASE METALS', color: '#92400E' },
    // ── Crypto ──
    { id: 'crypto', label: 'CRYPTO', color: '#F7931A' },
    { id: 'cryptonews', label: 'CRYPTO NEWS', color: '#EA580C' },
    { id: 'token', label: 'TOKEN', color: '#D97706' },
    // ── Banking & Consumer ──
    { id: 'central', label: 'CENTRAL BANKS', color: '#6366F1' },
    { id: 'consumer', label: 'CONSUMER', color: '#A855F7' },
    // ── GCC ──
    { id: 'gccbiz', label: 'GCC BUSINESS', color: '#059669' },
    { id: 'gccmarket', label: 'GCC MARKET', color: '#0284C7' },
    // ── News & Intel ──
    { id: 'region', label: 'REGION NEWS', color: '#F59E0B' },
    { id: 'globalnews', label: 'GLOBAL NEWS', color: '#2563EB' },
    { id: 'topical', label: 'TOPICAL', color: '#9333EA' },
    { id: 'technology', label: 'TECHNOLOGY', color: '#06B6D4' },
    { id: 'telegram', label: 'TELEGRAM', color: '#0EA5E9' },
    { id: 'brand', label: 'BRAND / APP', color: '#E11D48' },
    // ── New Finance & Markets ──
    { id: 'coremarkets', label: 'CORE MARKETS', color: '#3B82F6' },
    { id: 'fixedincome', label: 'FIXED INCOME', color: '#6366F1' },
    { id: 'forex', label: 'FOREX', color: '#10B981' },
    { id: 'cryptodigital', label: 'CRYPTO/DIGITAL', color: '#F7931A' },
    { id: 'centralbanks', label: 'CENTRAL BANKS+', color: '#8B5CF6' },
    // ── GCC & MENA ──
    { id: 'gccinvest', label: 'GCC INVEST', color: '#059669' },
    { id: 'gulfeconomic', label: 'GULF ECONOMIC', color: '#0D9488' },
    { id: 'consumerprices', label: 'CPI/PRICES', color: '#14B8A6' },
    // ── Startups, Security, Data ──
    { id: 'startupsvc', label: 'STARTUPS/VC', color: '#EC4899' },
    { id: 'securitypolicy', label: 'SECURITY', color: '#EF4444' },
    { id: 'datatracking', label: 'DATA TRACK', color: '#06B6D4' },
    { id: 'supplychain', label: 'SUPPLY CHAIN', color: '#F59E0B' },
    { id: 'pricingmktg', label: 'PRICING/MKTG', color: '#A855F7' },
    { id: 'worldclock', label: 'WORLD CLOCK', color: '#64748B' },
    { id: 'deevoproject', label: 'DEEVO', color: '#00D4FF' },
    { id: 'discord', label: 'DISCORD', color: '#5865F2' },
    // ── Analysis ──
    { id: 'correlation', label: 'CORRELATION', color: '#A78BFA' },
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

      {/* ── PRO Banner ──────────────────────────────── */}
      <ProBanner />

      {/* ── StatusBar ─────────────────────────────────── */}
      <StatusBar />

      {/* ── Global Situation Bar ─────────────────────── */}
      <GlobalSituation />

      {/* ── Map Area — SmartMapEngine handles 2D/3D, styles, intel cards ── */}
      <div className="flex-1 relative overflow-hidden">
        <GCCMap />
        <LayerPanel />
        <RiskLegend />
        <MapControls />
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
            /* ── Single tab view — full worldmonitor parity (40+ panels) ── */
            <>
              {/* Core Intelligence */}
              {bottomTab === 'feed' && <LiveFeed />}
              {bottomTab === 'news' && <LiveNewsPanel />}
              {bottomTab === 'webcams' && <LiveWebcams />}
              {bottomTab === 'ai' && <AIInsights />}
              {bottomTab === 'posture' && <StrategicPosture />}
              {bottomTab === 'intel' && <CountryIntelligence />}
              {bottomTab === 'risk' && <RiskScore />}
              {bottomTab === 'strategy' && <StrategyPanel />}
              {bottomTab === 'livecase' && <LiveCasePanel />}
              {/* Markets & Finance */}
              {bottomTab === 'finance' && <FinanceRadar />}
              {bottomTab === 'market' && <MarketFinancePanel />}
              {bottomTab === 'financial' && <FinancialOverviewPanel />}
              {bottomTab === 'economical' && <EconomicalPanel />}
              {bottomTab === 'premium' && <PremiumStocksPanel />}
              {bottomTab === 'premstock' && <PremiumStockPanel />}
              {bottomTab === 'premnews' && <PremiumMarketNewsPanel />}
              {bottomTab === 'premii' && <PremiumIIPanel />}
              {bottomTab === 'daily' && <DailyMarketPanel />}
              {/* Commodities */}
              {bottomTab === 'energy' && <EnergyPanel />}
              {bottomTab === 'energymarket' && <EnergyMarketPanel />}
              {bottomTab === 'gold' && <GoldSilverPanel />}
              {bottomTab === 'basemetals' && <BaseMetalsPanel />}
              {/* Crypto */}
              {bottomTab === 'crypto' && <CryptoPanel />}
              {bottomTab === 'cryptonews' && <CryptoNewsPanel />}
              {bottomTab === 'token' && <TokenPanel />}
              {/* Banking & Consumer */}
              {bottomTab === 'central' && <CentralBankPanel />}
              {bottomTab === 'consumer' && <ConsumerPanel />}
              {/* GCC */}
              {bottomTab === 'gccbiz' && <GCCBusinessNewsPanel />}
              {bottomTab === 'gccmarket' && <GCCMarketPanel />}
              {/* News & Intel */}
              {bottomTab === 'region' && <RegionNewsPanel />}
              {bottomTab === 'globalnews' && <GlobalNewsPanel />}
              {bottomTab === 'topical' && <TopicalPanel />}
              {bottomTab === 'technology' && <TechnologyPanel />}
              {bottomTab === 'telegram' && <TelegramIntelPanel />}
              {bottomTab === 'brand' && <BrandApplicationPanel />}
              {/* New Finance & Markets */}
              {bottomTab === 'coremarkets' && <CoreMarketsPanel />}
              {bottomTab === 'fixedincome' && <FixedIncomePanel />}
              {bottomTab === 'forex' && <ForexCurrenciesPanel />}
              {bottomTab === 'cryptodigital' && <CryptoDigitalPanel />}
              {bottomTab === 'centralbanks' && <CentralBanksEconomicPanel />}
              {/* GCC & MENA */}
              {bottomTab === 'gccinvest' && <GCCInvestmentPanel />}
              {bottomTab === 'gulfeconomic' && <GulfEconomicPanel />}
              {bottomTab === 'consumerprices' && <ConsumerPricesPanel />}
              {/* Startups, Security, Data */}
              {bottomTab === 'startupsvc' && <StartupsVCPanel />}
              {bottomTab === 'securitypolicy' && <SecurityPolicyPanel />}
              {bottomTab === 'datatracking' && <DataTrackingPanel />}
              {bottomTab === 'supplychain' && <SupplyChainPanel />}
              {bottomTab === 'pricingmktg' && <PricingMarketingPanel />}
              {bottomTab === 'worldclock' && <WorldClockPanel />}
              {bottomTab === 'deevoproject' && <DeevoProjectPanel />}
              {bottomTab === 'discord' && <DiscordPanel />}
              {/* Analysis */}
              {bottomTab === 'correlation' && <CorrelationPanel />}
              {bottomTab === 'kpi' && <KPIOverviewPanel />}
              {bottomTab === 'forecast' && <ForecastPanel />}
              {bottomTab === 'alerts' && <AlertFeedPanel />}
              {bottomTab === 'pipeline' && <PipelineStats />}
            </>
          )}
        </div>
      </div>

      {/* ── Bottom Ticker ─────────────────────────────── */}
      <BottomTicker />

      {/* ── Footer ──────────────────────────────────── */}
      <Footer />

      {/* ── Floating Discord Button ─────────────────── */}
      <DiscordButton />
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
