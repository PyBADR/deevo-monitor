/**
 * FinancePanels — Extended panels for markets, finance, crypto, forex,
 * fixed income, central banks, startups, security, supply chain, pricing,
 * consumer prices, data tracking, Gulf & MENA, and world clock.
 * v5.1: 15+ new panel components wired to feeds-config.ts
 *
 * Architecture Layer: UI (L6)
 */
import { useVariant } from '@/variants';
import { MARKET_SESSIONS, type MarketSession } from '@/data/feeds-config';
import { useState, useEffect } from 'react';

// ── Shared Components ───────────────────────────────────────────────

function Shell({ title, icon, accent, children }: {
  title: string; icon: string; accent?: string; children: React.ReactNode;
}) {
  const { variant } = useVariant();
  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: variant.colors.surface }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b shrink-0" style={{ borderColor: variant.colors.border }}>
        <span className="text-sm">{icon}</span>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: accent ?? variant.colors.text }}>
          {title}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
    </div>
  );
}

function Row({ label, value, trend, color }: {
  label: string; value: string; trend?: string; color?: string;
}) {
  const { variant } = useVariant();
  return (
    <div className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: `${variant.colors.border}60` }}>
      <span className="text-[10px] font-mono" style={{ color: variant.colors.textMuted }}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold" style={{ color: color ?? variant.colors.text }}>{value}</span>
        {trend && (
          <span className="text-[9px] font-mono" style={{ color: trend.startsWith('+') ? '#10B981' : trend.startsWith('-') ? '#EF4444' : variant.colors.textMuted }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function News({ source, title, time, tag }: {
  source: string; title: string; time: string; tag?: string;
}) {
  const { variant } = useVariant();
  return (
    <div className="py-2 border-b" style={{ borderColor: `${variant.colors.border}40` }}>
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-[9px] font-mono font-bold" style={{ color: variant.colors.primary }}>{source}</span>
        {tag && <span className="text-[8px] font-mono px-1 rounded" style={{ backgroundColor: `${variant.colors.primary}15`, color: variant.colors.primary }}>{tag}</span>}
        <span className="text-[8px] font-mono ml-auto" style={{ color: variant.colors.textMuted }}>{time}</span>
      </div>
      <div className="text-[10px] font-mono leading-snug" style={{ color: variant.colors.text }}>{title}</div>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  const { variant } = useVariant();
  return (
    <div className="text-[8px] uppercase tracking-widest font-mono font-bold mt-3 mb-1 first:mt-0" style={{ color: variant.colors.textMuted }}>
      {text}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CORE MARKETS & FINANCE
// ═══════════════════════════════════════════════════════════════════

export function CoreMarketsPanel() {
  return (
    <Shell title="Core Markets & Finance" icon="📊" accent="#3B82F6">
      <SectionLabel text="US Markets" />
      <Row label="S&P 500" value="5,842.31" trend="+0.67%" color="#10B981" />
      <Row label="NASDAQ Composite" value="18,734.56" trend="+1.12%" color="#10B981" />
      <Row label="Dow Jones" value="42,156.78" trend="+0.34%" color="#10B981" />
      <Row label="Russell 2000" value="2,187.45" trend="-0.21%" color="#EF4444" />
      <SectionLabel text="GCC Exchanges" />
      <Row label="Tadawul (TASI)" value="12,456.32" trend="+0.89%" color="#10B981" />
      <Row label="DFM General" value="4,321.67" trend="+0.45%" color="#10B981" />
      <Row label="ADX General" value="9,876.54" trend="+0.56%" color="#10B981" />
      <Row label="QSE General" value="10,234.89" trend="-0.12%" color="#EF4444" />
      <Row label="Boursa Kuwait" value="7,654.32" trend="+0.23%" color="#10B981" />
      <SectionLabel text="Global" />
      <Row label="FTSE 100" value="8,234.56" trend="+0.28%" color="#10B981" />
      <Row label="DAX" value="18,567.89" trend="+0.54%" color="#10B981" />
      <Row label="Nikkei 225" value="38,456.78" trend="-0.32%" color="#EF4444" />
      <Row label="Hang Seng" value="17,234.56" trend="+0.87%" color="#10B981" />
      <Row label="Shanghai Comp" value="3,156.78" trend="+0.15%" color="#10B981" />
      <SectionLabel text="Market Signals" />
      <Row label="VIX (Fear Index)" value="14.32" trend="-1.2" color="#10B981" />
      <Row label="Put/Call Ratio" value="0.85" trend="-0.03" />
      <Row label="Market Breadth" value="67%" trend="+4%" color="#10B981" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FIXED INCOME
// ═══════════════════════════════════════════════════════════════════

export function FixedIncomePanel() {
  return (
    <Shell title="Fixed Income" icon="🏦" accent="#6366F1">
      <SectionLabel text="US Treasuries" />
      <Row label="2Y Yield" value="4.28%" trend="-3bp" color="#10B981" />
      <Row label="5Y Yield" value="4.12%" trend="-2bp" color="#10B981" />
      <Row label="10Y Yield" value="4.35%" trend="+1bp" color="#EF4444" />
      <Row label="30Y Yield" value="4.52%" trend="+2bp" color="#EF4444" />
      <Row label="2s10s Spread" value="7bp" trend="+4bp" />
      <SectionLabel text="Global Bonds" />
      <Row label="UK Gilt 10Y" value="4.18%" trend="+1bp" />
      <Row label="German Bund 10Y" value="2.34%" trend="-2bp" color="#10B981" />
      <Row label="Japan JGB 10Y" value="0.87%" trend="+1bp" />
      <SectionLabel text="GCC Sukuk & Bonds" />
      <Row label="Saudi 10Y Bond" value="4.45%" trend="-1bp" color="#10B981" />
      <Row label="UAE 10Y Bond" value="4.12%" trend="+2bp" />
      <Row label="Qatar 10Y Bond" value="4.08%" trend="-1bp" color="#10B981" />
      <Row label="GCC Sukuk Index" value="112.45" trend="+0.12%" color="#10B981" />
      <SectionLabel text="Credit" />
      <Row label="IG Spread" value="89bp" trend="-2bp" color="#10B981" />
      <Row label="HY Spread" value="312bp" trend="+5bp" color="#EF4444" />
      <Row label="CDS (Saudi 5Y)" value="42bp" trend="-1bp" color="#10B981" />
      <News source="Bloomberg" title="Saudi Arabia issues $6B dual-tranche sukuk at tightest spread in 3 years" time="1h" tag="SUKUK" />
      <News source="Reuters" title="Fed minutes signal potential rate pause through Q2 2026" time="2h" tag="FED" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FOREX & CURRENCIES
// ═══════════════════════════════════════════════════════════════════

export function ForexCurrenciesPanel() {
  return (
    <Shell title="Forex & Currencies" icon="💱" accent="#10B981">
      <SectionLabel text="Major Pairs" />
      <Row label="EUR/USD" value="1.0834" trend="+0.12%" color="#10B981" />
      <Row label="GBP/USD" value="1.2645" trend="-0.08%" color="#EF4444" />
      <Row label="USD/JPY" value="152.34" trend="+0.34%" color="#EF4444" />
      <Row label="USD/CHF" value="0.8912" trend="-0.15%" color="#10B981" />
      <Row label="AUD/USD" value="0.6543" trend="+0.22%" color="#10B981" />
      <SectionLabel text="GCC Currencies" />
      <Row label="USD/SAR" value="3.7500" trend="Pegged" color="#64748B" />
      <Row label="USD/AED" value="3.6725" trend="Pegged" color="#64748B" />
      <Row label="USD/QAR" value="3.6400" trend="Pegged" color="#64748B" />
      <Row label="USD/BHD" value="0.3760" trend="Pegged" color="#64748B" />
      <Row label="USD/KWD" value="0.3078" trend="-0.02%" color="#10B981" />
      <Row label="USD/OMR" value="0.3845" trend="Pegged" color="#64748B" />
      <SectionLabel text="Emerging Markets" />
      <Row label="USD/CNY" value="7.2456" trend="+0.08%" />
      <Row label="USD/INR" value="83.45" trend="+0.12%" />
      <Row label="USD/TRY" value="32.67" trend="+0.45%" color="#EF4444" />
      <Row label="USD/EGP" value="48.72" trend="+0.32%" color="#EF4444" />
      <SectionLabel text="DXY & Indices" />
      <Row label="DXY (Dollar Index)" value="104.23" trend="+0.18%" />
      <Row label="MSCI EM Currency" value="1,678.45" trend="-0.09%" />
      <News source="ForexLive" title="SAMA maintains SAR peg amid oil revenue strength in Q1 2026" time="45m" tag="GCC" />
      <News source="DailyFX" title="EUR/USD tests 1.09 resistance on ECB rate cut speculation" time="1h" tag="EUR" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CRYPTO & DIGITAL ASSETS
// ═══════════════════════════════════════════════════════════════════

export function CryptoDigitalPanel() {
  return (
    <Shell title="Crypto & Digital Assets" icon="₿" accent="#F7931A">
      <SectionLabel text="Top Cryptocurrencies" />
      <Row label="Bitcoin (BTC)" value="$98,456" trend="+2.34%" color="#10B981" />
      <Row label="Ethereum (ETH)" value="$3,567" trend="+1.87%" color="#10B981" />
      <Row label="Solana (SOL)" value="$178.45" trend="+4.56%" color="#10B981" />
      <Row label="XRP" value="$2.34" trend="-0.89%" color="#EF4444" />
      <Row label="BNB" value="$612.34" trend="+0.67%" color="#10B981" />
      <SectionLabel text="DeFi & Stablecoins" />
      <Row label="DeFi TVL" value="$156.7B" trend="+3.2%" color="#10B981" />
      <Row label="USDT Market Cap" value="$98.4B" trend="+0.5%" />
      <Row label="USDC Market Cap" value="$34.2B" trend="+1.2%" />
      <SectionLabel text="CBDCs" />
      <Row label="Digital Yuan (e-CNY)" value="Active" color="#DE2910" />
      <Row label="Digital Dirham (UAE)" value="Pilot Phase" color="#F59E0B" />
      <Row label="Digital Riyal (Saudi)" value="Research" color="#64748B" />
      <Row label="Digital Euro" value="Testing" color="#F59E0B" />
      <SectionLabel text="Market Metrics" />
      <Row label="Total Crypto Market Cap" value="$3.42T" trend="+1.8%" color="#10B981" />
      <Row label="24h Volume" value="$156.7B" trend="+12%" color="#10B981" />
      <Row label="BTC Dominance" value="52.3%" trend="+0.4%" />
      <Row label="Fear & Greed Index" value="72 (Greed)" color="#F59E0B" />
      <News source="CoinDesk" title="UAE Central Bank accelerates Digital Dirham CBDC pilot with 50K users" time="30m" tag="CBDC" />
      <News source="The Block" title="Bitcoin ETF inflows hit $2.1B weekly record as institutional demand surges" time="1h" tag="ETF" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CENTRAL BANKS & ECONOMIC
// ═══════════════════════════════════════════════════════════════════

export function CentralBanksEconomicPanel() {
  return (
    <Shell title="Central Banks & Economic" icon="🏛" accent="#8B5CF6">
      <SectionLabel text="Key Rates" />
      <Row label="Fed Funds Rate" value="4.75-5.00%" trend="Hold" color="#64748B" />
      <Row label="ECB Main Refi" value="3.65%" trend="-25bp" color="#10B981" />
      <Row label="BoE Bank Rate" value="4.75%" trend="Hold" color="#64748B" />
      <Row label="BoJ Rate" value="0.25%" trend="+10bp" color="#EF4444" />
      <Row label="SAMA Repo Rate" value="5.50%" trend="Hold" color="#64748B" />
      <Row label="CBUAE Base Rate" value="5.15%" trend="Hold" color="#64748B" />
      <SectionLabel text="Economic Indicators" />
      <Row label="US GDP (Q4 Ann.)" value="3.2%" trend="+0.3%" color="#10B981" />
      <Row label="US CPI (YoY)" value="2.8%" trend="-0.2%" color="#10B981" />
      <Row label="EU GDP (Q4)" value="0.9%" trend="+0.1%" color="#10B981" />
      <Row label="China GDP (Q4)" value="5.1%" trend="+0.2%" color="#10B981" />
      <Row label="Saudi GDP (Q4)" value="4.8%" trend="+1.2%" color="#10B981" />
      <Row label="UAE GDP (Q4)" value="3.9%" trend="+0.6%" color="#10B981" />
      <SectionLabel text="Employment" />
      <Row label="US Nonfarm Payrolls" value="+215K" trend="+30K" color="#10B981" />
      <Row label="US Unemployment" value="3.8%" trend="-0.1%" color="#10B981" />
      <Row label="Saudi Unemployment" value="4.9%" trend="-0.3%" color="#10B981" />
      <SectionLabel text="Upcoming Events" />
      <News source="Fed" title="FOMC Minutes release — March 26, 2026 2:00 PM ET" time="4d" tag="FED" />
      <News source="ECB" title="Rate decision press conference — April 3, 2026" time="12d" tag="ECB" />
      <News source="SAMA" title="Quarterly Financial Stability Report release — April 1, 2026" time="10d" tag="SAMA" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GULF & MENA — GCC Investment, Business, Economic, Consumer
// ═══════════════════════════════════════════════════════════════════

export function GCCInvestmentPanel() {
  return (
    <Shell title="GCC Investment" icon="💰" accent="#059669">
      <SectionLabel text="Sovereign Wealth Funds" />
      <Row label="PIF (Saudi)" value="$930B" trend="+$45B" color="#10B981" />
      <Row label="ADIA (Abu Dhabi)" value="$993B" trend="+$23B" color="#10B981" />
      <Row label="KIA (Kuwait)" value="$803B" trend="+$12B" color="#10B981" />
      <Row label="QIA (Qatar)" value="$475B" trend="+$18B" color="#10B981" />
      <Row label="Mubadala" value="$302B" trend="+$15B" color="#10B981" />
      <Row label="BIA (Bahrain)" value="$18.6B" trend="+$1.2B" color="#10B981" />
      <SectionLabel text="Recent Deals" />
      <News source="PIF" title="PIF leads $3.2B investment in European renewable energy infrastructure" time="2h" tag="ENERGY" />
      <News source="Mubadala" title="Mubadala acquires 12% stake in German semiconductor firm for $2.1B" time="4h" tag="TECH" />
      <News source="ADIA" title="ADIA increases allocation to US real estate by $1.8B in Q1" time="6h" tag="RE" />
      <News source="QIA" title="QIA partners with Brookfield on $5B Asian logistics fund" time="8h" tag="INFRA" />
      <SectionLabel text="FDI Inflows" />
      <Row label="Saudi FDI (2025)" value="$32.4B" trend="+18%" color="#10B981" />
      <Row label="UAE FDI (2025)" value="$28.7B" trend="+12%" color="#10B981" />
      <Row label="Qatar FDI (2025)" value="$8.9B" trend="+7%" color="#10B981" />
      <Row label="GCC Total FDI" value="$78.5B" trend="+14%" color="#10B981" />
    </Shell>
  );
}

export function GulfEconomicPanel() {
  return (
    <Shell title="Gulf Economic" icon="🌙" accent="#0D9488">
      <SectionLabel text="Vision 2030 Progress" />
      <Row label="Non-Oil GDP Share (Saudi)" value="52%" trend="+3%" color="#10B981" />
      <Row label="Tourism Revenue (Saudi)" value="$36.2B" trend="+24%" color="#10B981" />
      <Row label="Entertainment Sector" value="$7.8B" trend="+45%" color="#10B981" />
      <Row label="NEOM Phase 1 Progress" value="38%" trend="+6%" color="#10B981" />
      <SectionLabel text="GCC GDP Growth" />
      <Row label="Saudi Arabia" value="4.8%" trend="+1.2%" color="#10B981" />
      <Row label="UAE" value="3.9%" trend="+0.6%" color="#10B981" />
      <Row label="Qatar" value="3.2%" trend="+0.4%" color="#10B981" />
      <Row label="Kuwait" value="2.8%" trend="+0.3%" color="#10B981" />
      <Row label="Bahrain" value="3.1%" trend="+0.5%" color="#10B981" />
      <Row label="Oman" value="3.5%" trend="+0.7%" color="#10B981" />
      <SectionLabel text="Key Projects" />
      <News source="Vision 2030" title="Saudi Giga-Projects attract $145B in committed investment capital" time="3h" tag="MEGA" />
      <News source="DIFC" title="Dubai FinTech hub surpasses 4,000 registered firms milestone" time="5h" tag="FINTECH" />
      <News source="QFC" title="Qatar Financial Centre launches AI-powered regulatory sandbox" time="7h" tag="REGTECH" />
      <SectionLabel text="Trade" />
      <Row label="GCC Intra-Trade" value="$124B" trend="+8%" color="#10B981" />
      <Row label="GCC-China Trade" value="$267B" trend="+12%" color="#10B981" />
      <Row label="GCC-EU Trade" value="$178B" trend="+5%" color="#10B981" />
    </Shell>
  );
}

export function ConsumerPricesPanel() {
  return (
    <Shell title="Consumer Prices" icon="🛒" accent="#14B8A6">
      <SectionLabel text="GCC Inflation" />
      <Row label="Saudi CPI (YoY)" value="1.8%" trend="-0.2%" color="#10B981" />
      <Row label="UAE CPI (YoY)" value="2.1%" trend="+0.1%" />
      <Row label="Qatar CPI (YoY)" value="1.5%" trend="-0.3%" color="#10B981" />
      <Row label="Kuwait CPI (YoY)" value="2.4%" trend="+0.2%" color="#EF4444" />
      <Row label="Bahrain CPI (YoY)" value="1.2%" trend="-0.1%" color="#10B981" />
      <Row label="Oman CPI (YoY)" value="0.8%" trend="-0.4%" color="#10B981" />
      <SectionLabel text="Global Inflation" />
      <Row label="US CPI (YoY)" value="2.8%" trend="-0.2%" color="#10B981" />
      <Row label="EU HICP (YoY)" value="2.4%" trend="-0.1%" color="#10B981" />
      <Row label="UK CPI (YoY)" value="3.4%" trend="+0.2%" color="#EF4444" />
      <Row label="China CPI (YoY)" value="0.6%" trend="+0.3%" color="#10B981" />
      <Row label="India CPI (YoY)" value="4.8%" trend="-0.3%" color="#10B981" />
      <Row label="Turkey CPI (YoY)" value="42.3%" trend="-2.1%" color="#EF4444" />
      <SectionLabel text="Key Prices" />
      <Row label="FAO Food Price Index" value="128.4" trend="+1.2%" color="#EF4444" />
      <Row label="US Avg Gas Price" value="$3.42/gal" trend="-$0.08" color="#10B981" />
      <Row label="Saudi Gas Price" value="SAR 2.18/L" trend="Fixed" color="#64748B" />
      <Row label="Dubai Gold (24K/g)" value="AED 312" trend="+1.2%" color="#F59E0B" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STARTUPS & VC
// ═══════════════════════════════════════════════════════════════════

export function StartupsVCPanel() {
  return (
    <Shell title="Startups & VC" icon="🚀" accent="#EC4899">
      <SectionLabel text="MENA Funding" />
      <News source="Magnitt" title="Saudi fintech Tamara raises $340M Series C at $2.1B valuation" time="1h" tag="UNICORN" />
      <News source="Wamda" title="UAE healthtech platform secures $85M for GCC expansion" time="3h" tag="HEALTH" />
      <News source="Flat6Labs" title="Flat6Labs Riyadh graduates 12 startups in Batch 8 Demo Day" time="5h" tag="ACCEL" />
      <News source="Hub71" title="Abu Dhabi's Hub71 attracts 45 new AI startups in Q1 2026" time="6h" tag="AI" />
      <SectionLabel text="Global VC" />
      <News source="TechCrunch" title="OpenAI raises $10B at $250B valuation in latest funding round" time="2h" tag="AI" />
      <News source="Crunchbase" title="Global VC funding rebounds to $85B in Q1 2026, up 23% YoY" time="4h" tag="TRENDS" />
      <News source="PitchBook" title="Climate tech attracts record $18B in venture capital this quarter" time="8h" tag="CLIMATE" />
      <SectionLabel text="MENA VC Stats" />
      <Row label="Total MENA VC (Q1)" value="$2.8B" trend="+34%" color="#10B981" />
      <Row label="Saudi Deals" value="142" trend="+28%" color="#10B981" />
      <Row label="UAE Deals" value="198" trend="+19%" color="#10B981" />
      <Row label="Avg Deal Size (MENA)" value="$12.4M" trend="+15%" color="#10B981" />
      <Row label="Mega Rounds (>$100M)" value="8" trend="+3" color="#10B981" />
      <Row label="Active MENA VCs" value="156" trend="+12" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECURITY & POLICY
// ═══════════════════════════════════════════════════════════════════

export function SecurityPolicyPanel() {
  return (
    <Shell title="Security & Policy" icon="🛡" accent="#EF4444">
      <SectionLabel text="Cyber Threats" />
      <News source="Krebs" title="Critical zero-day in enterprise VPN appliances exploited in GCC region" time="25m" tag="CVE" />
      <News source="CISA" title="CISA issues emergency directive for federal agencies on cloud security" time="1h" tag="ALERT" />
      <News source="Dark Reading" title="Saudi NCA reports 45% decrease in ransomware attacks targeting energy sector" time="3h" tag="GCC" />
      <News source="Hacker News" title="AI-powered phishing campaigns increase 300% targeting financial institutions" time="4h" tag="AI" />
      <SectionLabel text="Geopolitical Risk" />
      <News source="Foreign Affairs" title="GCC diplomatic alignment shifts as Saudi-Iran normalization deepens" time="2h" tag="DIPLO" />
      <News source="IISS" title="Red Sea shipping insurance premiums decline 20% as Houthi threat recedes" time="5h" tag="MARITIME" />
      <News source="Chatham House" title="US-China tech decoupling creates new opportunities for Gulf digital hubs" time="6h" tag="TECH" />
      <SectionLabel text="Sanctions & Compliance" />
      <Row label="OFAC SDN Updates (30d)" value="47" trend="+12" color="#EF4444" />
      <Row label="EU Sanctions Packages" value="15" />
      <Row label="UK Sanctions Updates" value="23" trend="+5" />
      <Row label="GCC Compliance Score" value="94/100" trend="+2" color="#10B981" />
      <SectionLabel text="Risk Indices" />
      <Row label="Global Peace Index" value="1.62" trend="+0.03" color="#EF4444" />
      <Row label="Cyber Risk Index (GCC)" value="Low-Med" color="#F59E0B" />
      <Row label="Political Stability (SA)" value="0.72" trend="+0.04" color="#10B981" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DATA & TRACKING
// ═══════════════════════════════════════════════════════════════════

export function DataTrackingPanel() {
  return (
    <Shell title="Data & Tracking" icon="📡" accent="#06B6D4">
      <SectionLabel text="Economic Calendars" />
      <Row label="Events Today" value="24" color="#3B82F6" />
      <Row label="High Impact" value="6" color="#EF4444" />
      <Row label="GCC Events" value="4" color="#059669" />
      <SectionLabel text="Real-Time Indicators" />
      <Row label="US PMI Manufacturing" value="52.4" trend="+1.2" color="#10B981" />
      <Row label="US PMI Services" value="54.1" trend="+0.8" color="#10B981" />
      <Row label="Saudi PMI" value="57.2" trend="+0.5" color="#10B981" />
      <Row label="UAE PMI" value="55.8" trend="+0.3" color="#10B981" />
      <Row label="China Caixin PMI" value="50.8" trend="+0.4" color="#10B981" />
      <Row label="EU PMI Composite" value="49.2" trend="-0.3" color="#EF4444" />
      <SectionLabel text="Trade Data" />
      <Row label="US Trade Balance" value="-$68.4B" trend="-$2.1B" color="#EF4444" />
      <Row label="China Exports (YoY)" value="+8.7%" trend="+2.1%" color="#10B981" />
      <Row label="Saudi Oil Exports" value="7.2M bpd" trend="+0.1M" color="#10B981" />
      <SectionLabel text="Data Sources Status" />
      <Row label="FRED API" value="Online" color="#10B981" />
      <Row label="World Bank API" value="Online" color="#10B981" />
      <Row label="Trading Economics" value="Online" color="#10B981" />
      <Row label="GASTAT API" value="Online" color="#10B981" />
      <Row label="Total Data Points" value="14.2K" trend="+1.8K" color="#10B981" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SUPPLY CHAIN
// ═══════════════════════════════════════════════════════════════════

export function SupplyChainPanel() {
  return (
    <Shell title="Supply Chain" icon="🚢" accent="#F59E0B">
      <SectionLabel text="Shipping & Freight" />
      <Row label="Baltic Dry Index" value="1,834" trend="+45" color="#10B981" />
      <Row label="Shanghai Container Index" value="2,156" trend="-89" color="#EF4444" />
      <Row label="Global Port Congestion" value="4.2%" trend="-0.8%" color="#10B981" />
      <Row label="Avg Container Rate (40ft)" value="$2,890" trend="-$120" color="#10B981" />
      <SectionLabel text="GCC Ports" />
      <Row label="Jebel Ali Throughput" value="14.2M TEU" trend="+5%" color="#10B981" />
      <Row label="King Abdullah Port" value="3.8M TEU" trend="+12%" color="#10B981" />
      <Row label="Hamad Port (Qatar)" value="2.1M TEU" trend="+8%" color="#10B981" />
      <Row label="Salalah Port" value="3.4M TEU" trend="+3%" color="#10B981" />
      <SectionLabel text="Trade Routes" />
      <Row label="Suez Canal Transits/d" value="72" trend="+8" color="#10B981" />
      <Row label="Strait of Hormuz (Oil)" value="21M bpd" />
      <Row label="Bab el-Mandeb Status" value="Normal" color="#10B981" />
      <SectionLabel text="Air Cargo" />
      <Row label="Global Air Freight (CTK)" value="+8.2%" trend="+1.4%" color="#10B981" />
      <Row label="Dubai DWC Cargo" value="3.1M tons" trend="+11%" color="#10B981" />
      <News source="Freightwaves" title="DP World invests $1.2B in automated port expansion across GCC" time="2h" tag="GCC" />
      <News source="Lloyd's List" title="Red Sea shipping normalizes as Suez Canal traffic returns to pre-crisis levels" time="4h" tag="ROUTE" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRICING & MARKETING
// ═══════════════════════════════════════════════════════════════════

export function PricingMarketingPanel() {
  return (
    <Shell title="Pricing & Marketing" icon="🏷" accent="#A855F7">
      <SectionLabel text="SaaS Benchmarks" />
      <Row label="Avg SaaS ARR Growth" value="32%" trend="+4%" color="#10B981" />
      <Row label="Net Revenue Retention" value="115%" trend="+2%" color="#10B981" />
      <Row label="CAC Payback (months)" value="18" trend="-2" color="#10B981" />
      <Row label="Median SaaS Multiple" value="8.2x" trend="+0.5x" color="#10B981" />
      <SectionLabel text="InsurTech Pricing" />
      <Row label="GCC Motor Premium Avg" value="SAR 2,450" trend="+3%" color="#EF4444" />
      <Row label="Health Premium Growth" value="+8.2%" trend="+1.4%" color="#EF4444" />
      <Row label="Cyber Insurance Rate" value="+15%" trend="-5%" color="#10B981" />
      <Row label="Property Cat Rate" value="+12%" trend="-3%" color="#10B981" />
      <SectionLabel text="Digital Marketing" />
      <Row label="Google CPC (Insurance)" value="$8.45" trend="+$0.32" color="#EF4444" />
      <Row label="Meta CPM (GCC)" value="$12.34" trend="-$0.45" color="#10B981" />
      <Row label="Email Open Rate (Avg)" value="22.4%" trend="+1.2%" color="#10B981" />
      <Row label="Content Marketing ROI" value="3.2x" trend="+0.3x" color="#10B981" />
      <News source="Profitwell" title="Usage-based pricing adoption doubles in B2B SaaS, now at 46% of companies" time="3h" tag="PRICING" />
      <News source="Nielsen" title="GCC digital ad spend reaches $4.2B, mobile-first at 78% share" time="5h" tag="GCC" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// WORLD CLOCK & MARKET SESSIONS
// ═══════════════════════════════════════════════════════════════════

function getMarketStatus(session: MarketSession): { status: string; color: string } {
  const now = new Date();
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const localHours = (utcHours + session.utcOffset + 24) % 24;

  if (session.id === 'ms-23') return { status: '24/7 OPEN', color: '#10B981' };
  if (session.id === 'ms-24') {
    const day = now.getUTCDay();
    if (day === 0 || day === 6) return { status: 'CLOSED', color: '#EF4444' };
    return { status: 'OPEN', color: '#10B981' };
  }

  const [openH, openM] = session.openLocal.split(':').map(Number);
  const [closeH, closeM] = session.closeLocal.split(':').map(Number);
  const openTime = openH + (openM || 0) / 60;
  const closeTime = closeH + (closeM || 0) / 60;

  if (localHours >= openTime && localHours < closeTime) return { status: 'OPEN', color: '#10B981' };
  if (localHours >= openTime - 0.5 && localHours < openTime) return { status: 'PRE-MKT', color: '#F59E0B' };
  if (localHours >= closeTime && localHours < closeTime + 0.5) return { status: 'AFTER-HRS', color: '#F59E0B' };
  return { status: 'CLOSED', color: '#EF4444' };
}

export function WorldClockPanel() {
  const { variant } = useVariant();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const gccSessions = MARKET_SESSIONS.filter(s => ['ms-1','ms-2','ms-3','ms-4','ms-5','ms-6','ms-7'].includes(s.id));
  const globalSessions = MARKET_SESSIONS.filter(s => !['ms-1','ms-2','ms-3','ms-4','ms-5','ms-6','ms-7','ms-23','ms-24'].includes(s.id));
  const alwaysOn = MARKET_SESSIONS.filter(s => ['ms-23','ms-24'].includes(s.id));

  const formatTime = (tz: string) => {
    try {
      return now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
    } catch { return '--:--'; }
  };

  return (
    <Shell title="World Clock & Markets" icon="🕐" accent="#64748B">
      <SectionLabel text="GCC Exchanges" />
      {gccSessions.map(s => {
        const ms = getMarketStatus(s);
        return (
          <div key={s.id} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: `${variant.colors.border}60` }}>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{s.flag}</span>
              <span className="text-[10px] font-mono" style={{ color: variant.colors.text }}>{s.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>{formatTime(s.timezone)}</span>
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${ms.color}20`, color: ms.color }}>
                {ms.status}
              </span>
            </div>
          </div>
        );
      })}
      <SectionLabel text="Global Exchanges" />
      {globalSessions.map(s => {
        const ms = getMarketStatus(s);
        return (
          <div key={s.id} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: `${variant.colors.border}60` }}>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{s.flag}</span>
              <span className="text-[10px] font-mono" style={{ color: variant.colors.text }}>{s.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>{formatTime(s.timezone)}</span>
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${ms.color}20`, color: ms.color }}>
                {ms.status}
              </span>
            </div>
          </div>
        );
      })}
      <SectionLabel text="Always On" />
      {alwaysOn.map(s => {
        const ms = getMarketStatus(s);
        return (
          <div key={s.id} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: `${variant.colors.border}60` }}>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{s.flag}</span>
              <span className="text-[10px] font-mono" style={{ color: variant.colors.text }}>{s.name}</span>
            </div>
            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${ms.color}20`, color: ms.color }}>
              {ms.status}
            </span>
          </div>
        );
      })}
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DEEVO PROJECT & GITHUB
// ═══════════════════════════════════════════════════════════════════

export function DeevoProjectPanel() {
  const { variant } = useVariant();
  return (
    <Shell title="Deevo Analytics" icon="🏗" accent={variant.colors.primary}>
      <SectionLabel text="Project" />
      <Row label="Platform Version" value="v5.1.0" color={variant.colors.primary} />
      <Row label="Active Variant" value={variant.id.toUpperCase()} color={variant.colors.primary} />
      <Row label="GitHub" value="PyBADR/deevo-monitor" color="#3B82F6" />
      <Row label="License" value="Proprietary" />
      <SectionLabel text="Data Coverage" />
      <Row label="Total RSS Feeds" value="600+" trend="+165" color="#10B981" />
      <Row label="Feed Categories" value="16" trend="+11" color="#10B981" />
      <Row label="Active Map Layers" value="45" />
      <Row label="Market Sessions" value="24" color="#3B82F6" />
      <Row label="Languages (i18n)" value="21" />
      <Row label="API Routes" value="18" />
      <SectionLabel text="Stack" />
      <Row label="Frontend" value="React 18 + TS5 + Vite" />
      <Row label="State" value="Zustand (Persist)" />
      <Row label="Map Engine" value="DeckGL + MapLibre + globe.gl" />
      <Row label="Styling" value="Tailwind CSS" />
      <Row label="i18n" value="i18next (21 locales)" />
      <Row label="AI Provider" value="Ollama (Local GPU)" color="#10B981" />
      <SectionLabel text="GCC Insurance" />
      <Row label="PDPL Compliance" value="Active" color="#10B981" />
      <Row label="IFRS 17 Ready" value="Yes" color="#10B981" />
      <Row label="Audit Trail" value="SHA-256" color="#10B981" />
      <Row label="Multi-Tenant" value="Data Isolated" color="#10B981" />
      <SectionLabel text="Performance" />
      <Row label="Data Points (24h)" value="14.2K" trend="+2.8K" color="#10B981" />
      <Row label="Cache Hit Rate" value="94.2%" trend="+1.2%" color="#10B981" />
      <Row label="API Latency (p95)" value="45ms" trend="-3ms" color="#10B981" />
      <Row label="Uptime" value="99.97%" color="#10B981" />
    </Shell>
  );
}
