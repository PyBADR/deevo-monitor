/**
 * Extended Market & Finance Panels — worldmonitor parity.
 * Provides dedicated sub-panels for: Regional News, Market Finance,
 * Crypto, Energy, Gold & Silver, Central Banks, Premium Stocks,
 * Telegram Intel, Daily Market, and Token/Trading panels.
 *
 * Architecture Layer: UI (L6)
 */
import { useVariant } from '@/variants';

// ── Reusable panel shell ────────────────────────────────────────────

function PanelShell({ title, icon, children }: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  const { variant } = useVariant();
  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: variant.colors.surface }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b shrink-0" style={{ borderColor: variant.colors.border }}>
        <span className="text-sm">{icon}</span>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: variant.colors.text }}>
          {title}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {children}
      </div>
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

// ── Region News Panel ───────────────────────────────────────────────

export function RegionNewsPanel() {
  const { variant } = useVariant();
  const gccNews = [
    { region: 'SA', title: 'NEOM Phase 2 construction reaches 40% completion', time: '2m ago', severity: 'info' },
    { region: 'AE', title: 'Abu Dhabi sovereign fund reports record returns', time: '5m ago', severity: 'info' },
    { region: 'QA', title: 'Qatar LNG expansion deal signed with Asian buyers', time: '12m ago', severity: 'info' },
    { region: 'KW', title: 'Kuwait oil minister addresses OPEC+ compliance', time: '18m ago', severity: 'medium' },
    { region: 'BH', title: 'Bahrain fintech sandbox approves 12 new startups', time: '25m ago', severity: 'info' },
    { region: 'OM', title: 'Oman diversification: green hydrogen MOU signed', time: '33m ago', severity: 'info' },
    { region: 'SA', title: 'SAMA announces digital currency pilot results', time: '41m ago', severity: 'high' },
    { region: 'AE', title: 'Dubai DIFC courts handle record arbitration cases', time: '48m ago', severity: 'info' },
  ];
  return (
    <PanelShell title="Region News" icon="🌍">
      <div className="space-y-2">
        {gccNews.map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5 border-b" style={{ borderColor: `${variant.colors.border}60` }}>
            <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded shrink-0" style={{ backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary }}>
              {item.region}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono truncate" style={{ color: variant.colors.text }}>{item.title}</div>
              <div className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

// ── Market & Finance Panel ──────────────────────────────────────────

export function MarketFinancePanel() {
  return (
    <PanelShell title="Market & Finance" icon="💹">
      <DataRow label="Tadawul (TASI)" value="12,145.30" trend="+0.82%" />
      <DataRow label="DFM General" value="4,287.15" trend="+0.45%" />
      <DataRow label="ADX General" value="9,876.22" trend="-0.12%" />
      <DataRow label="QSE" value="10,432.80" trend="+0.33%" />
      <DataRow label="Boursa Kuwait" value="7,891.45" trend="+0.18%" />
      <DataRow label="Bahrain Bourse" value="2,034.67" trend="-0.05%" />
      <DataRow label="MSM Muscat" value="4,567.89" trend="+0.27%" />
      <DataRow label="S&P 500" value="5,234.18" trend="+0.94%" />
      <DataRow label="FTSE 100" value="7,654.32" trend="-0.21%" />
      <DataRow label="Nikkei 225" value="38,912.45" trend="+1.22%" />
      <DataRow label="Shanghai Comp" value="3,145.67" trend="-0.33%" />
      <DataRow label="DAX" value="18,234.56" trend="+0.56%" />
    </PanelShell>
  );
}

// ── Crypto & DeFi Panel ─────────────────────────────────────────────

export function CryptoPanel() {
  return (
    <PanelShell title="Crypto & DeFi" icon="₿">
      <DataRow label="Bitcoin (BTC)" value="$67,432.18" trend="+2.4%" color="#F7931A" />
      <DataRow label="Ethereum (ETH)" value="$3,567.89" trend="+1.8%" color="#627EEA" />
      <DataRow label="Solana (SOL)" value="$178.45" trend="+5.2%" color="#00FFA3" />
      <DataRow label="BNB" value="$612.34" trend="+0.9%" color="#F3BA2F" />
      <DataRow label="XRP" value="$0.5234" trend="-1.2%" color="#00AAE4" />
      <DataRow label="Cardano (ADA)" value="$0.4567" trend="+3.1%" color="#0D1E30" />
      <DataRow label="Avalanche (AVAX)" value="$38.67" trend="+4.5%" />
      <DataRow label="Polkadot (DOT)" value="$7.89" trend="-0.8%" />
      <DataRow label="Total Market Cap" value="$2.45T" trend="+1.9%" />
      <DataRow label="BTC Dominance" value="52.3%" trend="+0.2%" />
      <DataRow label="DeFi TVL" value="$89.4B" trend="+3.2%" />
      <DataRow label="24h Volume" value="$98.7B" trend="+12.1%" />
    </PanelShell>
  );
}

// ── Energy & Commodities Panel ──────────────────────────────────────

export function EnergyPanel() {
  return (
    <PanelShell title="Energy & Commodities" icon="⚡">
      <DataRow label="Brent Crude" value="$82.45" trend="+1.23" />
      <DataRow label="WTI Crude" value="$78.67" trend="+0.98" />
      <DataRow label="Natural Gas (Henry Hub)" value="$2.345" trend="-0.05" />
      <DataRow label="LNG Asia Spot" value="$12.80" trend="+0.45" />
      <DataRow label="OPEC Basket" value="$81.23" trend="+0.67" />
      <DataRow label="Dubai/Oman" value="$81.89" trend="+1.12" />
      <DataRow label="Copper" value="$9,234" trend="+56.00" />
      <DataRow label="Aluminum" value="$2,456" trend="-12.00" />
      <DataRow label="Wheat (CBOT)" value="$6.78" trend="+0.12" />
      <DataRow label="Corn (CBOT)" value="$4.56" trend="-0.08" />
      <DataRow label="Iron Ore" value="$118.45" trend="+2.30" />
      <DataRow label="Uranium (U3O8)" value="$92.50" trend="+1.50" />
    </PanelShell>
  );
}

// ── Gold & Silver Panel ─────────────────────────────────────────────

export function GoldSilverPanel() {
  return (
    <PanelShell title="Gold & Silver" icon="🥇">
      <DataRow label="Gold Spot (XAU/USD)" value="$2,345.67" trend="+12.30" color="#FFD700" />
      <DataRow label="Silver Spot (XAG/USD)" value="$28.45" trend="+0.34" color="#C0C0C0" />
      <DataRow label="Platinum (XPT/USD)" value="$987.23" trend="-5.67" />
      <DataRow label="Palladium (XPD/USD)" value="$1,023.45" trend="+8.90" />
      <DataRow label="Gold/Silver Ratio" value="82.4" trend="-0.3" />
      <DataRow label="Gold Futures (Dec)" value="$2,367.80" trend="+15.20" />
      <DataRow label="COMEX Gold Volume" value="245K" trend="+12%" />
      <DataRow label="Shanghai Gold" value="¥545.23" trend="+2.10" />
    </PanelShell>
  );
}

// ── Central Banks Panel ─────────────────────────────────────────────

export function CentralBankPanel() {
  const { variant } = useVariant();
  const banks = [
    { name: 'SAMA (Saudi)', rate: '6.00%', action: 'HOLD', date: 'Mar 2026' },
    { name: 'CBUAE', rate: '5.40%', action: 'HOLD', date: 'Mar 2026' },
    { name: 'QCB (Qatar)', rate: '5.75%', action: 'HOLD', date: 'Feb 2026' },
    { name: 'CBK (Kuwait)', rate: '4.25%', action: 'CUT -25bp', date: 'Jan 2026' },
    { name: 'CBB (Bahrain)', rate: '6.00%', action: 'HOLD', date: 'Mar 2026' },
    { name: 'CBO (Oman)', rate: '5.50%', action: 'HOLD', date: 'Mar 2026' },
    { name: 'Federal Reserve', rate: '5.25%', action: 'HOLD', date: 'Mar 2026' },
    { name: 'ECB', rate: '4.00%', action: 'CUT -25bp', date: 'Feb 2026' },
    { name: 'BOE', rate: '4.75%', action: 'HOLD', date: 'Mar 2026' },
    { name: 'BOJ', rate: '0.25%', action: 'HIKE +10bp', date: 'Jan 2026' },
  ];
  return (
    <PanelShell title="Central Banks" icon="🏦">
      {banks.map((b, i) => (
        <div key={i} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: `${variant.colors.border}60` }}>
          <span className="text-[10px] font-mono" style={{ color: variant.colors.text }}>{b.name}</span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold" style={{ color: variant.colors.primary }}>{b.rate}</span>
            <span className="text-[9px] font-mono px-1 py-0.5 rounded" style={{
              backgroundColor: b.action === 'HOLD' ? '#6B728015' : b.action.includes('CUT') ? '#EF444420' : '#10B98120',
              color: b.action === 'HOLD' ? '#6B7280' : b.action.includes('CUT') ? '#EF4444' : '#10B981',
            }}>
              {b.action}
            </span>
            <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>{b.date}</span>
          </div>
        </div>
      ))}
    </PanelShell>
  );
}

// ── Premium Stocks Panel ────────────────────────────────────────────

export function PremiumStocksPanel() {
  return (
    <PanelShell title="Premium Stocks" icon="📈">
      <DataRow label="Saudi Aramco (2222.SR)" value="SAR 32.45" trend="+0.65%" />
      <DataRow label="Al Rajhi Bank (1120.SR)" value="SAR 87.30" trend="+1.12%" />
      <DataRow label="STC (7010.SR)" value="SAR 11.24" trend="-0.35%" />
      <DataRow label="SABIC (2010.SR)" value="SAR 78.50" trend="+0.42%" />
      <DataRow label="Emirates NBD (ENBD.AE)" value="AED 18.90" trend="+0.85%" />
      <DataRow label="FAB (FAB.AE)" value="AED 14.56" trend="+0.33%" />
      <DataRow label="QNB (QNBK.QA)" value="QAR 14.23" trend="-0.21%" />
      <DataRow label="Kuwait Finance House" value="KWD 0.845" trend="+1.45%" />
      <DataRow label="Apple (AAPL)" value="$198.45" trend="+2.1%" />
      <DataRow label="NVIDIA (NVDA)" value="$875.32" trend="+3.8%" />
      <DataRow label="Microsoft (MSFT)" value="$425.67" trend="+1.2%" />
      <DataRow label="Tesla (TSLA)" value="$245.89" trend="-1.5%" />
    </PanelShell>
  );
}

// ── Daily Market Summary Panel ──────────────────────────────────────

export function DailyMarketPanel() {
  const { variant } = useVariant();
  return (
    <PanelShell title="Daily Market Summary" icon="📋">
      <div className="mb-3">
        <div className="text-[10px] font-mono font-bold mb-1" style={{ color: variant.colors.primary }}>MARKET PULSE</div>
        <div className="text-[10px] font-mono leading-relaxed" style={{ color: variant.colors.textSecondary }}>
          GCC markets trading mixed as Saudi Aramco leads Tadawul higher. Dubai property sector showing
          renewed momentum. Oil prices stabilizing above $82 on OPEC+ compliance signals. Regional banking
          sector outperforming on strong Q4 earnings.
        </div>
      </div>
      <DataRow label="GCC Composite Index" value="8,234.56" trend="+0.45%" />
      <DataRow label="GCC Market Cap" value="$3.8T" trend="+0.2%" />
      <DataRow label="GCC Trading Volume" value="$4.2B" trend="+18%" />
      <DataRow label="Most Active: Aramco" value="245M shares" />
      <DataRow label="Top Gainer: STC" value="+4.5%" color="#10B981" />
      <DataRow label="Top Decliner: Etihad Etisalat" value="-2.1%" color="#EF4444" />
      <DataRow label="USD/SAR" value="3.7500" trend="0.00" />
      <DataRow label="USD/AED" value="3.6725" trend="0.00" />
    </PanelShell>
  );
}

// ── Telegram Intel Panel ────────────────────────────────────────────

export function TelegramIntelPanel() {
  const { variant } = useVariant();
  const channels = [
    { name: '@GCC_OSINT', msg: 'Naval movement detected near Strait of Hormuz — 3 vessels', time: '3m', priority: 'high' },
    { name: '@ME_Defense', msg: 'Air defense systems activated in eastern province drill', time: '8m', priority: 'medium' },
    { name: '@OilMarkets', msg: 'OPEC+ monitoring committee confirms compliance at 96%', time: '15m', priority: 'low' },
    { name: '@CyberGCC', msg: 'Phishing campaign targeting GCC financial institutions', time: '22m', priority: 'high' },
    { name: '@SaudiEcon', msg: 'PIF announces new AI investment vehicle worth $10B', time: '31m', priority: 'medium' },
    { name: '@UAEWatch', msg: 'Abu Dhabi real estate transactions up 34% YoY', time: '45m', priority: 'low' },
    { name: '@GulfShipping', msg: 'Container rates on Asia-GCC route rising 12% WoW', time: '52m', priority: 'medium' },
  ];
  return (
    <PanelShell title="Telegram Intel" icon="✈️">
      {channels.map((ch, i) => (
        <div key={i} className="py-2 border-b" style={{ borderColor: `${variant.colors.border}60` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-mono font-bold" style={{ color: variant.colors.primary }}>{ch.name}</span>
            <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>{ch.time}</span>
            <span className="text-[8px] font-mono px-1 rounded" style={{
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

// ── KPI Overview Panel ──────────────────────────────────────────────

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
    { label: 'Avg Settlement Time', value: '4.2d', trend: '-0.3d', icon: '⏱️' },
  ];
  return (
    <PanelShell title="KPI Overview" icon="📊">
      <div className="grid grid-cols-2 gap-2">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-2 rounded border" style={{ borderColor: variant.colors.border }}>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs">{kpi.icon}</span>
              <span className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>{kpi.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-mono font-bold" style={{ color: variant.colors.text }}>{kpi.value}</span>
              <span className="text-[9px] font-mono" style={{ color: kpi.trend.startsWith('+') ? '#10B981' : kpi.trend.startsWith('-') ? '#EF4444' : variant.colors.textMuted }}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
