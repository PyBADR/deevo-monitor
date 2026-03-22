/**
 * ExtendedPanels — Full worldmonitor-parity panel set.
 * v4.2: 30+ additional panels covering every market, news, finance,
 *       crypto, energy, GCC business, and intelligence category.
 *
 * Architecture Layer: UI (L6)
 */
import { useVariant } from '@/variants';

// ── Shared Components ───────────────────────────────────────────────

function PanelShell({ title, icon, accentColor, children }: {
  title: string; icon: string; accentColor?: string; children: React.ReactNode;
}) {
  const { variant } = useVariant();
  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: variant.colors.surface }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b shrink-0" style={{ borderColor: variant.colors.border }}>
        <span className="text-sm">{icon}</span>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: accentColor ?? variant.colors.text }}>
          {title}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
    </div>
  );
}

function DataRow({ label, value, trend, color }: {
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

function NewsItem({ source, title, time, tag }: {
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

// ═══════════════════════════════════════════════════════════════════
// TECHNOLOGY PANELS
// ═══════════════════════════════════════════════════════════════════

export function TechnologyPanel() {
  return (
    <PanelShell title="Technology" icon="💻" accentColor="#3B82F6">
      <NewsItem source="TechCrunch" title="OpenAI launches GPT-5 with multimodal reasoning capabilities" time="12m" tag="AI" />
      <NewsItem source="Wired" title="Saudi Arabia's $40B AI fund attracts Silicon Valley startups" time="28m" tag="GCC" />
      <NewsItem source="Ars Technica" title="New quantum computing breakthrough: 1000-qubit processor demonstrated" time="45m" tag="QUANTUM" />
      <NewsItem source="The Verge" title="Apple Vision Pro 2 enters mass production in Q2 2026" time="1h" tag="HARDWARE" />
      <NewsItem source="MIT Tech Review" title="NEOM smart city deploys largest IoT mesh network globally" time="2h" tag="IoT" />
      <NewsItem source="ZDNet" title="UAE launches national cybersecurity AI defense grid" time="3h" tag="CYBER" />
      <NewsItem source="Hacker News" title="Rust overtakes C++ in embedded systems market share" time="4h" tag="DEV" />
      <NewsItem source="TechCrunch" title="Dubai-based fintech raises $200M Series C for MENA expansion" time="5h" tag="FINTECH" />
    </PanelShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CRYPTO & TOKEN PANELS
// ═══════════════════════════════════════════════════════════════════

export function CryptoNewsPanel() {
  return (
    <PanelShell title="Crypto News & Trading" icon="📰" accentColor="#F7931A">
      <NewsItem source="CoinDesk" title="SEC approves spot Ethereum ETF options, market rallies 8%" time="5m" tag="ETH" />
      <NewsItem source="The Block" title="Saudi Arabia central bank pilots CBDC for wholesale settlement" time="18m" tag="CBDC" />
      <NewsItem source="Decrypt" title="Solana DEX volume surpasses Ethereum for third consecutive month" time="32m" tag="SOL" />
      <NewsItem source="CoinTelegraph" title="UAE crypto exchange licenses surpass 50 under VARA framework" time="1h" tag="REGULATION" />
      <NewsItem source="The Defiant" title="Aave V4 launches with native stablecoin and GCC liquidity pools" time="2h" tag="DeFi" />
      <NewsItem source="Blockworks" title="Bitcoin mining hashrate hits all-time high post-halving" time="3h" tag="BTC" />
      <NewsItem source="DL News" title="Bahrain becomes first GCC state to accept crypto tax payments" time="4h" tag="TAX" />
    </PanelShell>
  );
}

export function TokenPanel() {
  return (
    <PanelShell title="Token Markets" icon="🪙" accentColor="#8B5CF6">
      <DataRow label="Bitcoin (BTC)" value="$67,432" trend="+2.4%" color="#F7931A" />
      <DataRow label="Ethereum (ETH)" value="$3,568" trend="+1.8%" color="#627EEA" />
      <DataRow label="Solana (SOL)" value="$178.45" trend="+5.2%" color="#00FFA3" />
      <DataRow label="BNB Chain" value="$612.34" trend="+0.9%" color="#F3BA2F" />
      <DataRow label="XRP" value="$0.5234" trend="-1.2%" color="#00AAE4" />
      <DataRow label="Cardano (ADA)" value="$0.457" trend="+3.1%" />
      <DataRow label="Avalanche (AVAX)" value="$38.67" trend="+4.5%" />
      <DataRow label="Polkadot (DOT)" value="$7.89" trend="-0.8%" />
      <DataRow label="Chainlink (LINK)" value="$15.23" trend="+2.7%" />
      <DataRow label="Polygon (MATIC)" value="$0.892" trend="+1.4%" />
      <DataRow label="Arbitrum (ARB)" value="$1.23" trend="+6.2%" />
      <DataRow label="Optimism (OP)" value="$2.45" trend="+3.8%" />
      <DataRow label="Total Market Cap" value="$2.45T" trend="+1.9%" />
      <DataRow label="24h Volume" value="$98.7B" trend="+12.1%" />
      <DataRow label="BTC Dominance" value="52.3%" trend="+0.2%" />
      <DataRow label="DeFi TVL" value="$89.4B" trend="+3.2%" />
    </PanelShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PREMIUM STOCK & MARKET PANELS
// ═══════════════════════════════════════════════════════════════════

export function PremiumStockPanel() {
  return (
    <PanelShell title="Premium Stocks" icon="📈" accentColor="#14B8A6">
      <DataRow label="Saudi Aramco (2222.SR)" value="SAR 32.45" trend="+0.65%" />
      <DataRow label="Al Rajhi Bank (1120.SR)" value="SAR 87.30" trend="+1.12%" />
      <DataRow label="STC (7010.SR)" value="SAR 11.24" trend="-0.35%" />
      <DataRow label="SABIC (2010.SR)" value="SAR 78.50" trend="+0.42%" />
      <DataRow label="Emirates NBD (ENBD)" value="AED 18.90" trend="+0.85%" />
      <DataRow label="FAB (FAB.AE)" value="AED 14.56" trend="+0.33%" />
      <DataRow label="QNB Group (QNBK)" value="QAR 14.23" trend="-0.21%" />
      <DataRow label="Kuwait Finance House" value="KWD 0.845" trend="+1.45%" />
      <DataRow label="Etihad Etisalat (7020.SR)" value="SAR 42.10" trend="+2.3%" />
      <DataRow label="ADNOC Drilling" value="AED 4.12" trend="+0.48%" />
    </PanelShell>
  );
}

export function PremiumMarketNewsPanel() {
  return (
    <PanelShell title="Premium Market News" icon="🏆" accentColor="#EC4899">
      <NewsItem source="Bloomberg" title="Saudi Aramco dividend yield surpasses 7% as oil stabilizes" time="8m" tag="ARAMCO" />
      <NewsItem source="Reuters" title="GCC IPO pipeline strongest since 2022 with $12B in filings" time="22m" tag="IPO" />
      <NewsItem source="FT" title="Abu Dhabi's Mubadala increases tech allocation to 35%" time="45m" tag="SOVEREIGN" />
      <NewsItem source="CNBC Arabia" title="Tadawul hits 13,000 milestone on foreign inflow surge" time="1h" tag="TASI" />
      <NewsItem source="Gulf News" title="DFM plans T+1 settlement to attract institutional investors" time="2h" tag="DFM" />
      <NewsItem source="Arab News" title="Saudi PIF launches $2B logistics infrastructure fund" time="3h" tag="PIF" />
      <NewsItem source="S&P Global" title="GCC banking sector NPL ratios at decade low of 2.8%" time="4h" tag="BANKING" />
    </PanelShell>
  );
}

export function PremiumIIPanel() {
  return (
    <PanelShell title="Premium Intelligence II" icon="💎" accentColor="#6366F1">
      <DataRow label="MSCI GCC Index" value="1,234.56" trend="+0.78%" />
      <DataRow label="S&P GCC Composite" value="98.45" trend="+0.45%" />
      <DataRow label="FTSE GCC Index" value="2,345.67" trend="+0.32%" />
      <DataRow label="GCC Sukuk Index" value="104.23" trend="+0.12%" />
      <DataRow label="GCC Real Estate REIT" value="87.45" trend="-0.23%" />
      <DataRow label="GCC Insurance Index" value="1,567.89" trend="+1.45%" />
      <DataRow label="Shariah Comp Index" value="3,456.78" trend="+0.67%" />
      <DataRow label="Institutional Flow (net)" value="+$234M" trend="+18%" color="#10B981" />
      <DataRow label="Foreign Ownership %" value="12.3%" trend="+0.4%" />
      <DataRow label="Market Breadth" value="65/35" trend="Bullish" color="#10B981" />
    </PanelShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GCC BUSINESS & REGIONAL PANELS
// ═══════════════════════════════════════════════════════════════════

export function GCCBusinessNewsPanel() {
  return (
    <PanelShell title="GCC Business News" icon="🏢" accentColor="#F59E0B">
      <NewsItem source="Arab News" title="Vision 2030: Saudi entertainment sector revenue hits $8B" time="10m" tag="SA" />
      <NewsItem source="Gulf News" title="Dubai real estate transactions exceed AED 50B in Q1 2026" time="25m" tag="AE" />
      <NewsItem source="The National" title="Abu Dhabi Global Market registers 200th fintech firm" time="40m" tag="ADGM" />
      <NewsItem source="Qatar Tribune" title="Lusail City occupancy reaches 85% ahead of Asian Games" time="1h" tag="QA" />
      <NewsItem source="Kuwait Times" title="Kuwait sovereign wealth fund assets surpass $900B" time="2h" tag="KW" />
      <NewsItem source="Muscat Daily" title="Oman-India free trade corridor volumes double YoY" time="3h" tag="OM" />
      <NewsItem source="BNA" title="Bahrain EDB attracts 45 new companies in Q1 2026" time="4h" tag="BH" />
      <NewsItem source="Argaam" title="Saudi non-oil GDP grows 5.2% in latest quarter" time="5h" tag="GDP" />
    </PanelShell>
  );
}

export function GCCMarketPanel() {
  return (
    <PanelShell title="GCC Markets" icon="🌙" accentColor="#10B981">
      <DataRow label="Tadawul (TASI)" value="12,145.30" trend="+0.82%" />
      <DataRow label="Nomu (Parallel)" value="28,456.12" trend="+1.45%" />
      <DataRow label="DFM General" value="4,287.15" trend="+0.45%" />
      <DataRow label="ADX General" value="9,876.22" trend="-0.12%" />
      <DataRow label="QSE 20" value="10,432.80" trend="+0.33%" />
      <DataRow label="Boursa Kuwait Premier" value="7,891.45" trend="+0.18%" />
      <DataRow label="Bahrain All Share" value="2,034.67" trend="-0.05%" />
      <DataRow label="MSM 30" value="4,567.89" trend="+0.27%" />
      <DataRow label="GCC Total Volume" value="$4.2B" trend="+18%" />
      <DataRow label="GCC Total Trades" value="892K" trend="+12%" />
      <DataRow label="Foreign Net Buy" value="+$145M" color="#10B981" />
      <DataRow label="Most Active" value="Aramco (245M)" />
    </PanelShell>
  );
}

export function ConsumerPanel() {
  return (
    <PanelShell title="Consumer & Retail" icon="🛒" accentColor="#F472B6">
      <DataRow label="GCC Consumer Confidence" value="78.4" trend="+2.1" />
      <DataRow label="SA Retail Sales (YoY)" value="+6.8%" trend="+0.5%" color="#10B981" />
      <DataRow label="UAE Retail Sales (YoY)" value="+5.2%" trend="+0.3%" color="#10B981" />
      <DataRow label="GCC E-commerce Volume" value="$42B" trend="+22%" />
      <DataRow label="CPI Saudi Arabia" value="1.8%" trend="+0.1%" />
      <DataRow label="CPI UAE" value="2.1%" trend="-0.2%" />
      <DataRow label="Hotel Occupancy (Dubai)" value="82%" trend="+4%" />
      <DataRow label="Tourism Revenue (SA)" value="$28B" trend="+15%" />
      <DataRow label="Auto Sales (GCC)" value="145K units" trend="+8%" />
      <DataRow label="Luxury Goods Index" value="+12.3%" trend="+1.8%" />
    </PanelShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ENERGY & COMMODITIES PANELS
// ═══════════════════════════════════════════════════════════════════

export function EnergyMarketPanel() {
  return (
    <PanelShell title="Energy Markets" icon="⚡" accentColor="#EF4444">
      <DataRow label="Brent Crude" value="$82.45" trend="+1.23" />
      <DataRow label="WTI Crude" value="$78.67" trend="+0.98" />
      <DataRow label="Natural Gas (HH)" value="$2.345" trend="-0.05" />
      <DataRow label="LNG Asia Spot" value="$12.80" trend="+0.45" />
      <DataRow label="OPEC Basket" value="$81.23" trend="+0.67" />
      <DataRow label="Dubai/Oman Crude" value="$81.89" trend="+1.12" />
      <DataRow label="Arab Light" value="$82.10" trend="+0.95" />
      <DataRow label="Murban Crude" value="$83.45" trend="+1.34" />
      <DataRow label="Gasoline RBOB" value="$2.567" trend="+0.034" />
      <DataRow label="Heating Oil" value="$2.789" trend="-0.012" />
      <DataRow label="Uranium (U3O8)" value="$92.50" trend="+1.50" />
      <DataRow label="Carbon Credits (EU)" value="€67.80" trend="+2.30" />
      <DataRow label="OPEC+ Compliance" value="96%" />
      <DataRow label="SPR (US)" value="372M bbl" trend="-2M" />
    </PanelShell>
  );
}

export function GoldSilverPanel() {
  return (
    <PanelShell title="Gold & Silver" icon="🥇" accentColor="#FFD700">
      <DataRow label="Gold Spot (XAU/USD)" value="$2,345.67" trend="+12.30" color="#FFD700" />
      <DataRow label="Silver Spot (XAG/USD)" value="$28.45" trend="+0.34" color="#C0C0C0" />
      <DataRow label="Platinum (XPT/USD)" value="$987.23" trend="-5.67" />
      <DataRow label="Palladium (XPD/USD)" value="$1,023.45" trend="+8.90" />
      <DataRow label="Gold/Silver Ratio" value="82.4" trend="-0.3" />
      <DataRow label="Gold Futures (Dec)" value="$2,367.80" trend="+15.20" />
      <DataRow label="COMEX Gold Volume" value="245K" trend="+12%" />
      <DataRow label="Shanghai Gold (SGE)" value="¥545.23" trend="+2.10" />
      <DataRow label="Dubai Gold Rate 24K" value="AED 286.50" trend="+3.25" />
      <DataRow label="SA Gold Import (YTD)" value="42 tonnes" trend="+8%" />
      <DataRow label="Central Bank Gold Buy" value="+28 tonnes" trend="Q1 2026" />
    </PanelShell>
  );
}

export function BaseMetalsPanel() {
  return (
    <PanelShell title="Base Metals & Trade" icon="🔩" accentColor="#78716C">
      <DataRow label="Copper" value="$9,234/t" trend="+56" />
      <DataRow label="Aluminum" value="$2,456/t" trend="-12" />
      <DataRow label="Zinc" value="$2,678/t" trend="+23" />
      <DataRow label="Nickel" value="$16,789/t" trend="+145" />
      <DataRow label="Tin" value="$28,456/t" trend="+234" />
      <DataRow label="Lead" value="$2,123/t" trend="-8" />
      <DataRow label="Iron Ore (62% Fe)" value="$118.45/t" trend="+2.30" />
      <DataRow label="Steel Rebar" value="$567/t" trend="+12" />
      <DataRow label="Wheat (CBOT)" value="$6.78/bu" trend="+0.12" />
      <DataRow label="Corn (CBOT)" value="$4.56/bu" trend="-0.08" />
      <DataRow label="Coffee Arabica" value="$1.89/lb" trend="+0.05" />
      <DataRow label="Sugar #11" value="$0.234/lb" trend="+0.008" />
      <DataRow label="Baltic Dry Index" value="1,567" trend="+45" />
      <DataRow label="Container Rate (Asia-GCC)" value="$2,345" trend="+12%" />
    </PanelShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CENTRAL BANK & FINANCIAL PANELS
// ═══════════════════════════════════════════════════════════════════

export function CentralBankPanel() {
  const { variant } = useVariant();
  const banks = [
    { name: 'SAMA (Saudi Arabia)', rate: '6.00%', action: 'HOLD', next: 'Apr 15' },
    { name: 'CBUAE (UAE)', rate: '5.40%', action: 'HOLD', next: 'Apr 22' },
    { name: 'QCB (Qatar)', rate: '5.75%', action: 'HOLD', next: 'May 1' },
    { name: 'CBK (Kuwait)', rate: '4.25%', action: 'CUT -25bp', next: 'Apr 8' },
    { name: 'CBB (Bahrain)', rate: '6.00%', action: 'HOLD', next: 'Apr 15' },
    { name: 'CBO (Oman)', rate: '5.50%', action: 'HOLD', next: 'Apr 22' },
    { name: 'Federal Reserve', rate: '5.25%', action: 'HOLD', next: 'May 7' },
    { name: 'ECB', rate: '4.00%', action: 'CUT -25bp', next: 'Apr 17' },
    { name: 'Bank of England', rate: '4.75%', action: 'HOLD', next: 'May 8' },
    { name: 'Bank of Japan', rate: '0.25%', action: 'HIKE +10bp', next: 'Apr 25' },
    { name: 'PBoC (China)', rate: '3.45%', action: 'CUT -10bp', next: 'Apr 20' },
    { name: 'RBI (India)', rate: '6.50%', action: 'HOLD', next: 'Apr 9' },
  ];
  return (
    <PanelShell title="Central Banks" icon="🏦" accentColor="#6366F1">
      {banks.map((b, i) => (
        <div key={i} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: `${variant.colors.border}60` }}>
          <span className="text-[10px] font-mono flex-1" style={{ color: variant.colors.text }}>{b.name}</span>
          <span className="text-[10px] font-mono font-bold w-14 text-right" style={{ color: variant.colors.primary }}>{b.rate}</span>
          <span className="text-[8px] font-mono px-1 py-0.5 rounded mx-2 w-16 text-center" style={{
            backgroundColor: b.action === 'HOLD' ? '#6B728015' : b.action.includes('CUT') ? '#EF444420' : '#10B98120',
            color: b.action === 'HOLD' ? '#6B7280' : b.action.includes('CUT') ? '#EF4444' : '#10B981',
          }}>
            {b.action}
          </span>
          <span className="text-[8px] font-mono w-12 text-right" style={{ color: variant.colors.textMuted }}>{b.next}</span>
        </div>
      ))}
    </PanelShell>
  );
}

export function FinancialOverviewPanel() {
  return (
    <PanelShell title="Financial Overview" icon="💹" accentColor="#059669">
      <DataRow label="USD/SAR" value="3.7500" trend="Pegged" />
      <DataRow label="USD/AED" value="3.6725" trend="Pegged" />
      <DataRow label="USD/QAR" value="3.6400" trend="Pegged" />
      <DataRow label="USD/BHD" value="0.3770" trend="Pegged" />
      <DataRow label="USD/OMR" value="0.3845" trend="Pegged" />
      <DataRow label="USD/KWD" value="0.3067" trend="-0.0003" />
      <DataRow label="EUR/USD" value="1.0845" trend="+0.0023" />
      <DataRow label="GBP/USD" value="1.2678" trend="+0.0015" />
      <DataRow label="USD/JPY" value="151.23" trend="+0.45" />
      <DataRow label="DXY (Dollar Index)" value="104.23" trend="-0.15" />
      <DataRow label="US 10Y Yield" value="4.28%" trend="+0.03" />
      <DataRow label="VIX" value="14.56" trend="-0.78" />
      <DataRow label="GCC Bond Index" value="102.45" trend="+0.12" />
      <DataRow label="Sukuk Spread (5Y)" value="+85bp" trend="-3bp" />
    </PanelShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DAILY MARKET & ECONOMIC PANELS
// ═══════════════════════════════════════════════════════════════════

export function DailyMarketPanel() {
  const { variant } = useVariant();
  return (
    <PanelShell title="Daily Market Summary" icon="📋" accentColor="#EC4899">
      <div className="mb-3">
        <div className="text-[10px] font-mono font-bold mb-1" style={{ color: variant.colors.primary }}>MARKET PULSE — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
        <div className="text-[10px] font-mono leading-relaxed" style={{ color: variant.colors.textSecondary }}>
          GCC markets trading mixed. Tadawul leads on Aramco strength. Dubai property sector momentum continues.
          Oil prices stabilizing above $82 on OPEC+ compliance. Regional banking outperforms on strong Q4 earnings.
          Foreign institutional flow turns net positive for second consecutive week.
        </div>
      </div>
      <DataRow label="GCC Composite" value="8,234.56" trend="+0.45%" />
      <DataRow label="GCC Total Market Cap" value="$3.8T" trend="+0.2%" />
      <DataRow label="GCC Trading Volume" value="$4.2B" trend="+18%" />
      <DataRow label="Advancing / Declining" value="142 / 87" />
      <DataRow label="New 52W Highs" value="23" color="#10B981" />
      <DataRow label="New 52W Lows" value="5" color="#EF4444" />
      <DataRow label="Top Gainer" value="STC +4.5%" color="#10B981" />
      <DataRow label="Top Decliner" value="Etihad Etisalat -2.1%" color="#EF4444" />
      <DataRow label="Most Active" value="Aramco (245M shares)" />
    </PanelShell>
  );
}

export function EconomicalPanel() {
  return (
    <PanelShell title="Economic Indicators" icon="📊" accentColor="#8B5CF6">
      <DataRow label="SA GDP Growth (YoY)" value="+4.2%" color="#10B981" />
      <DataRow label="UAE GDP Growth (YoY)" value="+3.8%" color="#10B981" />
      <DataRow label="Qatar GDP Growth" value="+2.9%" color="#10B981" />
      <DataRow label="SA Unemployment" value="10.1%" trend="-0.3%" />
      <DataRow label="SA Non-Oil GDP" value="+5.2%" color="#10B981" />
      <DataRow label="GCC FDI Inflow (YTD)" value="$42B" trend="+15%" />
      <DataRow label="SA PMI (Manufacturing)" value="57.2" trend="+0.8" />
      <DataRow label="UAE PMI" value="56.4" trend="+0.3" />
      <DataRow label="GCC Construction Index" value="234.5" trend="+12%" />
      <DataRow label="SA Budget Balance" value="-2.1% GDP" />
      <DataRow label="UAE Trade Balance" value="+$180B" />
      <DataRow label="SA Foreign Reserves" value="$434B" trend="+$8B" />
    </PanelShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// INTELLIGENCE & SECURITY PANELS
// ═══════════════════════════════════════════════════════════════════

export function LiveCasePanel() {
  const { variant } = useVariant();
  const cases = [
    { id: 'IC-2026-0342', type: 'FRAUD', status: 'ACTIVE', severity: 'HIGH', region: 'SA', desc: 'Organized auto claims ring — 14 linked policies' },
    { id: 'IC-2026-0341', type: 'CYBER', status: 'ACTIVE', severity: 'CRITICAL', region: 'AE', desc: 'Ransomware attempt on Dubai insurer systems' },
    { id: 'IC-2026-0340', type: 'CLAIMS', status: 'REVIEW', severity: 'MEDIUM', region: 'QA', desc: 'Suspicious marine cargo loss — $4.2M claim' },
    { id: 'IC-2026-0339', type: 'FRAUD', status: 'ACTIVE', severity: 'HIGH', region: 'KW', desc: 'Ghost broker network detected — 200+ policies' },
    { id: 'IC-2026-0338', type: 'REGS', status: 'MONITOR', severity: 'LOW', region: 'BH', desc: 'PDPL compliance gap in legacy claims system' },
    { id: 'IC-2026-0337', type: 'FRAUD', status: 'CLOSED', severity: 'HIGH', region: 'SA', desc: 'Medical fraud ring dismantled — 8 providers' },
  ];
  return (
    <PanelShell title="Live Cases" icon="🔴" accentColor="#EF4444">
      {cases.map((c, i) => (
        <div key={i} className="py-2 border-b" style={{ borderColor: `${variant.colors.border}40` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[8px] font-mono font-bold" style={{ color: variant.colors.primary }}>{c.id}</span>
            <span className="text-[8px] font-mono px-1 rounded" style={{ backgroundColor: `${variant.colors.primary}15`, color: variant.colors.primary }}>{c.type}</span>
            <span className="text-[8px] font-mono px-1 rounded" style={{
              backgroundColor: c.severity === 'CRITICAL' ? '#EF444430' : c.severity === 'HIGH' ? '#F59E0B30' : '#6B728020',
              color: c.severity === 'CRITICAL' ? '#EF4444' : c.severity === 'HIGH' ? '#F59E0B' : '#6B7280',
            }}>{c.severity}</span>
            <span className="text-[8px] font-mono px-1 rounded" style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}>{c.region}</span>
            <span className="text-[8px] font-mono ml-auto" style={{
              color: c.status === 'ACTIVE' ? '#10B981' : c.status === 'CLOSED' ? '#6B7280' : '#F59E0B',
            }}>{c.status}</span>
          </div>
          <div className="text-[10px] font-mono" style={{ color: variant.colors.text }}>{c.desc}</div>
        </div>
      ))}
    </PanelShell>
  );
}

export function TelegramIntelPanel() {
  const { variant } = useVariant();
  const channels = [
    { name: '@GCC_OSINT', msg: 'Naval movement detected near Strait of Hormuz — 3 vessels repositioned', time: '3m', priority: 'high' },
    { name: '@ME_Defense', msg: 'Air defense systems activated in eastern province — routine drill confirmed', time: '8m', priority: 'medium' },
    { name: '@OilMarkets', msg: 'OPEC+ monitoring committee confirms compliance at 96%', time: '15m', priority: 'low' },
    { name: '@CyberGCC', msg: 'Phishing campaign targeting GCC financial institutions — IOCs shared', time: '22m', priority: 'high' },
    { name: '@SaudiEcon', msg: 'PIF announces new AI investment vehicle worth $10B', time: '31m', priority: 'medium' },
    { name: '@UAEWatch', msg: 'Abu Dhabi real estate transactions up 34% YoY in Q1', time: '45m', priority: 'low' },
    { name: '@GulfShipping', msg: 'Container rates on Asia-GCC route rising 12% WoW', time: '52m', priority: 'medium' },
    { name: '@IranWatch', msg: 'IRGC naval exercises in Persian Gulf — 5 fast boats observed', time: '1h', priority: 'high' },
    { name: '@CryptoGCC', msg: 'VARA approves 3 new exchanges for Dubai operations', time: '1h', priority: 'low' },
  ];
  return (
    <PanelShell title="Telegram Intel" icon="✈️" accentColor="#0EA5E9">
      {channels.map((ch, i) => (
        <div key={i} className="py-2 border-b" style={{ borderColor: `${variant.colors.border}40` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-mono font-bold" style={{ color: variant.colors.primary }}>{ch.name}</span>
            <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>{ch.time}</span>
            <span className="text-[8px] font-mono px-1 rounded ml-auto" style={{
              backgroundColor: ch.priority === 'high' ? '#EF444420' : ch.priority === 'medium' ? '#F59E0B20' : '#6B728015',
              color: ch.priority === 'high' ? '#EF4444' : ch.priority === 'medium' ? '#F59E0B' : '#6B7280',
            }}>
              {ch.priority.toUpperCase()}
            </span>
          </div>
          <div className="text-[10px] font-mono" style={{ color: variant.colors.text }}>{ch.msg}</div>
        </div>
      ))}
    </PanelShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL NEWS PANELS
// ═══════════════════════════════════════════════════════════════════

export function GlobalNewsPanel() {
  return (
    <PanelShell title="Global News" icon="🌐" accentColor="#3B82F6">
      <NewsItem source="Reuters" title="US-China trade talks resume in Geneva with tariff rollback proposals" time="5m" tag="TRADE" />
      <NewsItem source="AP" title="EU Parliament approves landmark AI regulation framework" time="18m" tag="AI" />
      <NewsItem source="BBC" title="India surpasses Japan as world's 4th largest economy" time="32m" tag="ECONOMY" />
      <NewsItem source="Al Jazeera" title="Lebanon reconstruction fund reaches $5B in international pledges" time="45m" tag="MIDEAST" />
      <NewsItem source="Bloomberg" title="Global semiconductor shortage eases as TSMC expands Arizona fab" time="1h" tag="TECH" />
      <NewsItem source="NYT" title="Climate summit in Dubai sets binding 2035 emission targets" time="2h" tag="CLIMATE" />
      <NewsItem source="FT" title="UK-GCC free trade agreement enters final negotiation phase" time="3h" tag="TRADE" />
    </PanelShell>
  );
}

export function TopicalPanel() {
  return (
    <PanelShell title="Trending Topics" icon="🔥" accentColor="#F97316">
      <NewsItem source="Analysis" title="OPEC+ strategy shift: From market share to price stability" time="15m" tag="OIL" />
      <NewsItem source="Deep Dive" title="GCC insurance market digitization — $1.2B opportunity by 2028" time="30m" tag="INSURANCE" />
      <NewsItem source="Briefing" title="De-dollarization trends: Impact on GCC currency pegs" time="1h" tag="FX" />
      <NewsItem source="Report" title="Saudi giga-projects: Construction insurance demand surges 300%" time="2h" tag="CONSTRUCTION" />
      <NewsItem source="Analysis" title="Iran nuclear deal collapse: Insurance implications for Gulf shipping" time="3h" tag="GEOPOLITICS" />
      <NewsItem source="Forecast" title="GCC Takaful market to reach $25B by 2028 — compound growth 12%" time="4h" tag="TAKAFUL" />
    </PanelShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STRATEGY & KPI PANELS
// ═══════════════════════════════════════════════════════════════════

export function StrategyPanel() {
  const { variant } = useVariant();
  return (
    <PanelShell title="Strategy Dashboard" icon="🎯" accentColor="#7C3AED">
      <div className="mb-3">
        <div className="text-[10px] font-mono font-bold mb-1" style={{ color: variant.colors.primary }}>STRATEGIC PRIORITIES — Q1 2026</div>
      </div>
      <DataRow label="Claims Automation Rate" value="78%" trend="+5% vs target" color="#10B981" />
      <DataRow label="Digital Policy Issuance" value="64%" trend="+12% QoQ" color="#10B981" />
      <DataRow label="Fraud Detection Rate" value="92.3%" trend="+3.1%" color="#10B981" />
      <DataRow label="Customer NPS" value="72" trend="+8 pts" color="#10B981" />
      <DataRow label="Combined Ratio" value="94.2%" trend="-1.8%" color="#10B981" />
      <DataRow label="Loss Ratio" value="67.3%" trend="-2.1%" color="#10B981" />
      <DataRow label="Expense Ratio" value="26.9%" trend="+0.3%" color="#EF4444" />
      <DataRow label="Market Share (GCC)" value="8.7%" trend="+0.4%" />
      <DataRow label="IFRS 17 Compliance" value="98%" trend="On track" color="#10B981" />
      <DataRow label="PDPL Readiness" value="95%" trend="On track" color="#10B981" />
    </PanelShell>
  );
}

export function KPIOverviewPanel() {
  const { variant } = useVariant();
  const kpis = [
    { label: 'Claims Processed', value: '12,847', trend: '+4.2%', icon: '📋' },
    { label: 'Fraud Detected', value: '234', trend: '+12.5%', icon: '🚨' },
    { label: 'Active Policies', value: '1.2M', trend: '+2.1%', icon: '📄' },
    { label: 'Loss Ratio', value: '67.3%', trend: '-1.8%', icon: '📉' },
    { label: 'Combined Ratio', value: '94.2%', trend: '-0.5%', icon: '📊' },
    { label: 'GWP (YTD)', value: '$4.8B', trend: '+8.9%', icon: '💰' },
    { label: 'NPS Score', value: '72', trend: '+3', icon: '⭐' },
    { label: 'Settlement Time', value: '4.2d', trend: '-0.3d', icon: '⏱️' },
    { label: 'Digital Adoption', value: '64%', trend: '+12%', icon: '📱' },
    { label: 'Reinsurance Ratio', value: '42%', trend: '-2%', icon: '🔄' },
  ];
  return (
    <PanelShell title="KPI Overview" icon="📊" accentColor="#8B5CF6">
      <div className="grid grid-cols-2 gap-2">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-2 rounded border" style={{ borderColor: variant.colors.border }}>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs">{kpi.icon}</span>
              <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>{kpi.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-mono font-bold" style={{ color: variant.colors.text }}>{kpi.value}</span>
              <span className="text-[9px] font-mono" style={{ color: kpi.trend.startsWith('+') || kpi.trend.startsWith('-') ? (kpi.trend.startsWith('+') ? '#10B981' : '#EF4444') : variant.colors.textMuted }}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

// ═══════════════════════════════════════════════════════════════════
// APPLICATION & BRAND PANEL
// ═══════════════════════════════════════════════════════════════════

export function BrandApplicationPanel() {
  const { variant } = useVariant();
  return (
    <PanelShell title="Deevo Platform" icon="🏗️" accentColor={variant.colors.primary}>
      <DataRow label="Platform Version" value="v4.0.0" />
      <DataRow label="Active Variant" value={variant.id.toUpperCase()} color={variant.colors.primary} />
      <DataRow label="Connected Feeds" value="435+" />
      <DataRow label="Active Layers" value="45" />
      <DataRow label="Data Points (24h)" value="12.4K" trend="+8%" />
      <DataRow label="AI Provider" value="Ollama (Local)" color="#10B981" />
      <DataRow label="Cache Hit Rate" value="94.2%" trend="+1.2%" color="#10B981" />
      <DataRow label="API Latency (p95)" value="45ms" trend="-3ms" color="#10B981" />
      <DataRow label="WebSocket Clients" value="1" />
      <DataRow label="Uptime" value="99.97%" color="#10B981" />
      <DataRow label="PDPL Compliance" value="Active" color="#10B981" />
      <DataRow label="Audit Trail" value="SHA-256 Enabled" color="#10B981" />
    </PanelShell>
  );
}
