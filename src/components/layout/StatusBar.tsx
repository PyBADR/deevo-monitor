/**
 * StatusBar — Top navigation bar (worldmonitor-style).
 * v4.0: Added DEFCON indicator, search, webcam count, enhanced variant badge.
 * Left: [Logo] [VariantSwitcher] [● LIVE] [v4.0.0] [user]
 * Center: [DEFCON Badge] [Date/Time UTC] [Region selector]
 * Right: [Webcam count] [Silicon badge] [Search] [Link] [Settings] [2D/3D]
 */
import { useState, useEffect } from "react";
import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from "@/stores/mapStore";
import { DRIBadge } from "@/components/shared/DRIBadge";
import { LiveDot } from "@/components/shared/LiveDot";
import { VariantSwitcher } from "@/components/ui/VariantSwitcher";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { useVariant } from "@/variants";
import { GCC_COUNTRIES, DRI_LEVELS, type GCCCountryCode, type DRILevel } from "@/types";
import { clsx } from "clsx";
import { setLanguage, getLanguage, type LanguageCode } from "@/i18n";

export function StatusBar() {
  const { variant, variantId } = useVariant();
  const driLevel = useDataStore((s) => s.driLevel);
  const flyToCountry = useMapStore((s) => s.flyToCountry);
  const resetView = useMapStore((s) => s.resetView);
  const focusedCountry = useMapStore((s) => s.focusedCountry);
  const [time, setTime] = useState(new Date());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRegion = (code: string) => {
    if (code === "GLOBAL") {
      resetView();
    } else {
      flyToCountry(code as GCCCountryCode);
    }
  };

  return (
    <>
      <header
        className="h-10 flex items-center justify-between px-3 border-b z-30 shrink-0 font-mono"
        style={{
          backgroundColor: variant.colors.bg,
          borderColor: variant.colors.border,
        }}
      >
        {/* Left section */}
        <div className="flex items-center gap-2">
          {/* Logo / variant icon */}
          <span className="text-sm">{variant.logo.icon}</span>
          <VariantSwitcher />
          <div className="w-px h-4" style={{ backgroundColor: variant.colors.border }} />
          <LiveDot status="live" size="sm" label="LIVE" />
          <span style={{ color: variant.colors.textMuted }} className="text-[10px]">
            v5.1.0
          </span>
        </div>

        {/* Center section */}
        <div className="flex items-center gap-3">
          {/* DEFCON / DRI Badge */}
          <DEFCONBadge level={driLevel} />

          <div className="w-px h-4" style={{ backgroundColor: variant.colors.border }} />

          <span style={{ color: variant.colors.textSecondary }} className="text-[10px]">
            {time.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }).toUpperCase()}
          </span>
          <span className="text-xs font-bold" style={{ color: variant.colors.primary }}>
            {time.toLocaleTimeString("en-US", { hour12: false, timeZone: "UTC" })}
            <span style={{ color: variant.colors.textMuted }} className="text-[9px] ml-1">
              UTC
            </span>
          </span>

          <div className="w-px h-4" style={{ backgroundColor: variant.colors.border }} />

          {/* Region selector */}
          <div className="flex gap-1">
            <RegionButton
              code="GLOBAL"
              label="Global"
              active={!focusedCountry}
              onClick={() => handleRegion("GLOBAL")}
              primaryColor={variant.colors.primary}
            />
            {(Object.keys(GCC_COUNTRIES) as GCCCountryCode[]).map((code) => (
              <RegionButton
                key={code}
                code={code}
                label={code}
                active={focusedCountry === code}
                onClick={() => handleRegion(code)}
                primaryColor={variant.colors.primary}
              />
            ))}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Webcam count */}
          {variant.showPanels.webcams && (
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1"
              style={{ backgroundColor: `${variant.colors.primary}15`, color: variant.colors.textMuted }}
            >
              📹 <span style={{ color: variant.colors.primary }}>27</span>
            </span>
          )}

          {/* Silicon badge (tech variant) */}
          {variantId === 'tech' && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#7C3AED20', color: '#7C3AED' }}>
              ⬡ Silicon
            </span>
          )}

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-[10px] px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
            style={{ color: variant.colors.textMuted }}
            title="Search"
          >
            ⌕ Search
          </button>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-[10px] px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
            style={{ color: variant.colors.textMuted }}
            title="Settings"
          >
            ⚙
          </button>

          {/* DRI badge */}
          {variant.showPanels.riskIndex && <DRIBadge level={driLevel} size="sm" />}

          {/* Variant badge */}
          <VariantBadge />
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {/* Settings modal */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

/** DEFCON-style threat level badge (worldmonitor parity) */
function DEFCONBadge({ level }: { level: DRILevel }) {
  const dri = DRI_LEVELS[level];
  // Map DRI 1-5 to DEFCON 5-1 (DEFCON 5 = safest, DEFCON 1 = most dangerous)
  const defcon = 6 - level;

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-0.5 rounded border"
      style={{
        borderColor: `${dri.color}40`,
        backgroundColor: `${dri.color}15`,
      }}
    >
      <span className="text-[9px] font-mono font-bold" style={{ color: dri.color }}>
        DEFCON {defcon}
      </span>
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: dri.color }}
      />
      <span className="text-[8px] font-mono" style={{ color: dri.color }}>
        {Math.round(Math.random() * 5 + 2)}%
      </span>
    </div>
  );
}

function VariantBadge() {
  const { variantId, variant } = useVariant();
  const labels: Record<string, string> = {
    global: 'G', tech: 'T', finance: 'F', fraud: 'FR', commodity: 'C', happy: 'H',
  };
  return (
    <span
      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
      style={{
        backgroundColor: `${variant.colors.primary}20`,
        color: variant.colors.primary,
      }}
    >
      {labels[variantId]}
    </span>
  );
}

/** Language switcher — AR/EN toggle in StatusBar */
function LanguageSwitcher() {
  const { variant } = useVariant();
  const [lang, setLang] = useState<LanguageCode>(getLanguage());

  const toggle = () => {
    const next: LanguageCode = lang === 'ar' ? 'en' : 'ar';
    setLanguage(next);
    setLang(next);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors hover:bg-white/10"
      style={{
        borderColor: `${variant.colors.primary}40`,
        color: variant.colors.textMuted,
      }}
      title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span
        className="font-bold"
        style={{ color: lang === 'en' ? variant.colors.primary : variant.colors.textMuted }}
      >
        EN
      </span>
      <span style={{ color: variant.colors.border }}>|</span>
      <span
        className="font-bold"
        style={{ color: lang === 'ar' ? variant.colors.primary : variant.colors.textMuted }}
      >
        عربي
      </span>
    </button>
  );
}

function RegionButton({
  code: _code,
  label,
  active,
  onClick,
  primaryColor,
}: {
  code: string;
  label: string;
  active: boolean;
  onClick: () => void;
  primaryColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "text-[9px] px-1.5 py-0.5 rounded transition-colors",
        active ? "text-white" : "text-gray-600 hover:text-gray-400"
      )}
      style={active ? { backgroundColor: `${primaryColor}20`, color: primaryColor } : undefined}
    >
      {label}
    </button>
  );
}

/** Search result categories for global Ctrl+K search */
interface SearchResult {
  id: string;
  category: 'panel' | 'layer' | 'region' | 'setting' | 'feed' | 'command';
  title: string;
  subtitle: string;
  icon: string;
}

const SEARCH_CATALOG: SearchResult[] = [
  // Panels
  { id: 'p-feed', category: 'panel', title: 'Live News Feed', subtitle: 'RSS aggregation across 435+ sources', icon: '📡' },
  { id: 'p-ai', category: 'panel', title: 'AI Insights', subtitle: 'Ollama-powered intelligence analysis', icon: '🤖' },
  { id: 'p-risk', category: 'panel', title: 'Risk Index', subtitle: 'DEFCON Risk Index (DRI) dashboard', icon: '🎯' },
  { id: 'p-forecast', category: 'panel', title: 'Strategic Forecasts', subtitle: 'Probability-weighted event forecasts', icon: '🔮' },
  { id: 'p-alerts', category: 'panel', title: 'Alerts', subtitle: 'Critical alert management', icon: '🚨' },
  { id: 'p-pipeline', category: 'panel', title: 'Claims Pipeline', subtitle: 'Insurance claims processing', icon: '🔄' },
  { id: 'p-kpi', category: 'panel', title: 'KPI Dashboard', subtitle: 'Key performance indicators', icon: '📊' },
  { id: 'p-webcams', category: 'panel', title: 'Live Webcams', subtitle: '27 live camera feeds worldwide', icon: '📹' },
  { id: 'p-intel', category: 'panel', title: 'Intelligence Posture', subtitle: '6 theater assessments', icon: '🛡️' },
  { id: 'p-finance', category: 'panel', title: 'Finance Radar', subtitle: '92 exchanges, commodities, crypto', icon: '💹' },
  { id: 'p-correlation', category: 'panel', title: 'Correlation Engine', subtitle: 'Cross-stream signal convergence', icon: '🔗' },
  { id: 'p-country', category: 'panel', title: 'Country Intelligence', subtitle: 'GCC composite risk scoring', icon: '🌐' },
  { id: 'p-strategy', category: 'panel', title: 'Strategy', subtitle: 'Strategic threat assessment', icon: '🎯' },
  { id: 'p-livecase', category: 'panel', title: 'Live Case', subtitle: 'Real-time case tracking', icon: '📋' },
  { id: 'p-market', category: 'panel', title: 'Market & Finance', subtitle: 'Global market overview', icon: '📈' },
  { id: 'p-financial', category: 'panel', title: 'Financial Overview', subtitle: 'Cross-market financial data', icon: '💵' },
  { id: 'p-economical', category: 'panel', title: 'Economical', subtitle: 'Macro-economic indicators', icon: '🏛️' },
  { id: 'p-premstock', category: 'panel', title: 'Premium Stock', subtitle: 'Premium equity tracking', icon: '📊' },
  { id: 'p-premnews', category: 'panel', title: 'Premium Market News', subtitle: 'Curated market intelligence', icon: '📰' },
  { id: 'p-premii', category: 'panel', title: 'Premium II', subtitle: 'Advanced premium analytics', icon: '🔬' },
  { id: 'p-energymarket', category: 'panel', title: 'PTC / Energy Market', subtitle: 'Petrochemical trading', icon: '⛽' },
  { id: 'p-basemetals', category: 'panel', title: 'Base Metals & Trade', subtitle: 'Industrial metals markets', icon: '🔩' },
  { id: 'p-cryptonews', category: 'panel', title: 'Crypto News & Trading', subtitle: 'Crypto market intelligence', icon: '₿' },
  { id: 'p-token', category: 'panel', title: 'Token', subtitle: 'Token economics & DeFi', icon: '🪙' },
  { id: 'p-consumer', category: 'panel', title: 'Consumer', subtitle: 'Consumer markets & retail', icon: '🛒' },
  { id: 'p-gccbiz', category: 'panel', title: 'GCC Business News', subtitle: 'Gulf business intelligence', icon: '🏢' },
  { id: 'p-gccmarket', category: 'panel', title: 'GCC Market', subtitle: 'GCC exchange data', icon: '🇸🇦' },
  { id: 'p-globalnews', category: 'panel', title: 'Global News', subtitle: 'Worldwide news aggregation', icon: '🌍' },
  { id: 'p-topical', category: 'panel', title: 'Topical', subtitle: 'Trending topics & analysis', icon: '🔥' },
  { id: 'p-technology', category: 'panel', title: 'Technology', subtitle: 'Tech industry intelligence', icon: '💻' },
  { id: 'p-brand', category: 'panel', title: 'Brand & Application', subtitle: 'Brand monitoring & app intel', icon: '🏷️' },
  { id: 'p-region', category: 'panel', title: 'Region News', subtitle: 'Regional news aggregation', icon: '🗺️' },
  { id: 'p-telegram', category: 'panel', title: 'Telegram Intel', subtitle: 'Telegram OSINT channels', icon: '✈️' },
  { id: 'p-daily', category: 'panel', title: 'Daily Market', subtitle: 'Daily market summary', icon: '📅' },
  // Regions
  { id: 'r-sa', category: 'region', title: 'Saudi Arabia', subtitle: 'Riyadh — SA theater', icon: '🇸🇦' },
  { id: 'r-ae', category: 'region', title: 'United Arab Emirates', subtitle: 'Dubai — AE theater', icon: '🇦🇪' },
  { id: 'r-qa', category: 'region', title: 'Qatar', subtitle: 'Doha — QA theater', icon: '🇶🇦' },
  { id: 'r-kw', category: 'region', title: 'Kuwait', subtitle: 'Kuwait City — KW theater', icon: '🇰🇼' },
  { id: 'r-bh', category: 'region', title: 'Bahrain', subtitle: 'Manama — BH theater', icon: '🇧🇭' },
  { id: 'r-om', category: 'region', title: 'Oman', subtitle: 'Muscat — OM theater', icon: '🇴🇲' },
  // Layers
  { id: 'l-military', category: 'layer', title: 'Military Bases', subtitle: 'Active military installations', icon: '🎖️' },
  { id: 'l-nuclear', category: 'layer', title: 'Nuclear Sites', subtitle: 'Nuclear facilities worldwide', icon: '☢️' },
  { id: 'l-cables', category: 'layer', title: 'Subsea Cables', subtitle: 'Submarine communication cables', icon: '🔌' },
  { id: 'l-trades', category: 'layer', title: 'Trade Routes', subtitle: 'Maritime shipping lanes', icon: '🚢' },
  { id: 'l-air', category: 'layer', title: 'Air Defense Zones', subtitle: 'Missile defense systems', icon: '🛡️' },
  { id: 'l-oil', category: 'layer', title: 'Oil & Gas', subtitle: 'Energy infrastructure', icon: '🛢️' },
  // Feed categories
  { id: 'f-gcc', category: 'feed', title: 'GCC News', subtitle: 'Gulf region news feeds', icon: '📰' },
  { id: 'f-tech', category: 'feed', title: 'Technology', subtitle: 'TechCrunch, Wired, Ars Technica', icon: '💻' },
  { id: 'f-finance', category: 'feed', title: 'Financial News', subtitle: 'Reuters, Bloomberg, FT', icon: '💰' },
  { id: 'f-energy', category: 'feed', title: 'Energy & Commodities', subtitle: 'Oil, gas, metals markets', icon: '⚡' },
  { id: 'f-crypto', category: 'feed', title: 'Crypto & DeFi', subtitle: 'CoinDesk, Decrypt, The Block', icon: '₿' },
  { id: 'f-military', category: 'feed', title: 'Military & Defense', subtitle: 'Jane\'s, Defense One', icon: '🎖️' },
  { id: 'f-cyber', category: 'feed', title: 'Cybersecurity', subtitle: 'KrebsOnSecurity, Dark Reading', icon: '🔒' },
  { id: 'f-market', category: 'feed', title: 'Stock Markets', subtitle: 'GCC & global exchanges', icon: '📈' },
  { id: 'f-gold', category: 'feed', title: 'Gold & Silver', subtitle: 'Precious metals tracking', icon: '🥇' },
  { id: 'f-central', category: 'feed', title: 'Central Banks', subtitle: 'SAMA, CBUAE, Fed, ECB', icon: '🏦' },
  // Settings
  { id: 's-theme', category: 'setting', title: 'Theme Settings', subtitle: 'Dark/light/auto appearance', icon: '🎨' },
  { id: 's-map', category: 'setting', title: 'Map Settings', subtitle: 'Map style, zoom, overlays', icon: '🗺️' },
  { id: 's-ai', category: 'setting', title: 'AI Engine Settings', subtitle: 'Ollama, Groq, OpenRouter config', icon: '🤖' },
  { id: 's-media', category: 'setting', title: 'Media Settings', subtitle: 'Video quality, streaming', icon: '🎬' },
  { id: 's-discord', category: 'setting', title: 'Discord Integration', subtitle: 'Webhook alerts to Discord', icon: '🔗' },
  { id: 's-privacy', category: 'setting', title: 'Privacy & Compliance', subtitle: 'PDPL, audit, data retention', icon: '🛡️' },
  // Commands
  { id: 'c-toggle3d', category: 'command', title: 'Toggle 2D/3D Globe', subtitle: 'Switch between flat map and globe', icon: '🌍' },
  { id: 'c-fullscreen', category: 'command', title: 'Toggle Fullscreen', subtitle: 'F11 — fullscreen mode', icon: '🖥️' },
  { id: 'c-reset', category: 'command', title: 'Reset Map View', subtitle: 'Ctrl+0 — return to GCC center', icon: '🔄' },
  { id: 'c-export', category: 'command', title: 'Export Data', subtitle: 'Export current view as JSON/CSV/PDF', icon: '📤' },
  { id: 'c-share', category: 'command', title: 'Share Screenshot', subtitle: 'Capture and share current view', icon: '📷' },
];

const CATEGORY_LABELS: Record<string, string> = {
  panel: 'PANELS',
  layer: 'LAYERS',
  region: 'REGIONS',
  setting: 'SETTINGS',
  feed: 'FEED CATEGORIES',
  command: 'COMMANDS',
};

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { variant } = useVariant();
  const [query, setQuery] = useState('');

  const filtered = query.length > 0
    ? SEARCH_CATALOG.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_CATALOG.slice(0, 8); // Show top items when empty

  // Group by category
  const grouped = filtered.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category]!.push(r);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-[640px] max-w-[90vw] max-h-[70vh] rounded-xl border shadow-2xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: variant.colors.surface,
          borderColor: variant.colors.border,
        }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: variant.colors.border }}>
          <span style={{ color: variant.colors.primary }} className="text-lg">⌕</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search panels, layers, feeds, regions, settings..."
            autoFocus
            className="flex-1 bg-transparent text-sm font-mono outline-none"
            style={{ color: variant.colors.text }}
          />
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: variant.colors.border, color: variant.colors.textMuted }}>
            ESC
          </span>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {Object.entries(grouped).map(([cat, results]) => (
            <div key={cat} className="mb-2">
              <div className="text-[9px] font-mono font-bold px-2 py-1 uppercase tracking-wider" style={{ color: variant.colors.textMuted }}>
                {CATEGORY_LABELS[cat] ?? cat} ({results.length})
              </div>
              {results.map((r) => (
                <button
                  key={r.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                  onClick={onClose}
                >
                  <span className="text-sm shrink-0">{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-mono font-bold truncate" style={{ color: variant.colors.text }}>
                      {r.title}
                    </div>
                    <div className="text-[9px] font-mono truncate" style={{ color: variant.colors.textMuted }}>
                      {r.subtitle}
                    </div>
                  </div>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${variant.colors.primary}15`, color: variant.colors.primary }}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8">
              <div className="text-[10px] font-mono" style={{ color: variant.colors.textMuted }}>
                No results for &ldquo;{query}&rdquo;
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t flex items-center gap-4" style={{ borderColor: variant.colors.border }}>
          <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>
            {filtered.length} results
          </span>
          <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>
            ↑↓ Navigate
          </span>
          <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>
            ↵ Open
          </span>
          <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>
            Ctrl+K Toggle
          </span>
        </div>
      </div>
    </div>
  );
}
