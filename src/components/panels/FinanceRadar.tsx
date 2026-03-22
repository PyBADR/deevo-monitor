/**
 * FinanceRadar — Finance radar panel (worldmonitor parity).
 * 92 stock exchanges, commodities, crypto, 7-signal market composite.
 * Sub-tabs: EXCHANGES | COMMODITIES | CRYPTO | COMPOSITE
 */
import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { useVariant } from '@/variants';

type FinanceTab = 'exchanges' | 'commodities' | 'crypto' | 'composite';

interface MarketIndex {
  id: string;
  name: string;
  ticker: string;
  region: string;
  value: number;
  change: number;
  changePct: number;
  volume: string;
  status: 'open' | 'closed' | 'pre-market' | 'after-hours';
}

interface CommodityPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  unit: string;
  change: number;
  changePct: number;
  category: 'energy' | 'metals' | 'agriculture' | 'livestock';
}

interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: string;
  change24h: number;
  volume24h: string;
}

interface CompositeSignal {
  id: string;
  name: string;
  value: number;
  weight: number;
  direction: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

// ── Mock Data ────────────────────────────────────────

const GCC_EXCHANGES: MarketIndex[] = [
  { id: 'tadawul', name: 'Tadawul (TASI)', ticker: 'TASI', region: 'SA', value: 12480, change: 145, changePct: 1.17, volume: '8.2B SAR', status: 'open' },
  { id: 'dfm', name: 'Dubai Financial Market', ticker: 'DFM', region: 'AE', value: 4285, change: -12, changePct: -0.28, volume: '1.1B AED', status: 'open' },
  { id: 'adx', name: 'Abu Dhabi Securities', ticker: 'ADX', region: 'AE', value: 9640, change: 82, changePct: 0.86, volume: '2.4B AED', status: 'open' },
  { id: 'qse', name: 'Qatar Stock Exchange', ticker: 'QSE', region: 'QA', value: 10320, change: -45, changePct: -0.43, volume: '890M QAR', status: 'open' },
  { id: 'bse-bh', name: 'Bahrain Bourse', ticker: 'BAX', region: 'BH', value: 1985, change: 8, changePct: 0.40, volume: '12M BHD', status: 'open' },
  { id: 'kse', name: 'Boursa Kuwait', ticker: 'BKP', region: 'KW', value: 7850, change: 32, changePct: 0.41, volume: '320M KWD', status: 'open' },
  { id: 'msm', name: 'Muscat Securities', ticker: 'MSM', region: 'OM', value: 4620, change: -18, changePct: -0.39, volume: '45M OMR', status: 'open' },
];

const GLOBAL_EXCHANGES: MarketIndex[] = [
  { id: 'sp500', name: 'S&P 500', ticker: 'SPX', region: 'US', value: 5890, change: 42, changePct: 0.72, volume: '4.2T USD', status: 'closed' },
  { id: 'nasdaq', name: 'NASDAQ', ticker: 'IXIC', region: 'US', value: 18950, change: 185, changePct: 0.99, volume: '5.8T USD', status: 'closed' },
  { id: 'ftse', name: 'FTSE 100', ticker: 'UKX', region: 'UK', value: 8240, change: -28, changePct: -0.34, volume: '£4.5B', status: 'open' },
  { id: 'dax', name: 'DAX', ticker: 'DAX', region: 'DE', value: 18650, change: 120, changePct: 0.65, volume: '€3.2B', status: 'open' },
  { id: 'nikkei', name: 'Nikkei 225', ticker: 'N225', region: 'JP', value: 39800, change: 340, changePct: 0.86, volume: '¥3.8T', status: 'closed' },
  { id: 'hsi', name: 'Hang Seng', ticker: 'HSI', region: 'HK', value: 18420, change: -95, changePct: -0.51, volume: 'HK$120B', status: 'closed' },
  { id: 'sse', name: 'Shanghai Composite', ticker: 'SHCOMP', region: 'CN', value: 3285, change: 18, changePct: 0.55, volume: '¥450B', status: 'closed' },
  { id: 'sensex', name: 'BSE Sensex', ticker: 'SENSEX', region: 'IN', value: 78400, change: 420, changePct: 0.54, volume: '₹85B', status: 'open' },
];

const COMMODITIES: CommodityPrice[] = [
  { id: 'brent', name: 'Brent Crude', symbol: 'BRN', price: 82.45, unit: 'USD/bbl', change: 1.72, changePct: 2.13, category: 'energy' },
  { id: 'wti', name: 'WTI Crude', symbol: 'CL', price: 78.32, unit: 'USD/bbl', change: 1.45, changePct: 1.89, category: 'energy' },
  { id: 'natgas', name: 'Natural Gas', symbol: 'NG', price: 2.85, unit: 'USD/MMBtu', change: -0.09, changePct: -3.06, category: 'energy' },
  { id: 'gold', name: 'Gold', symbol: 'XAU', price: 2680, unit: 'USD/oz', change: 28, changePct: 1.06, category: 'metals' },
  { id: 'silver', name: 'Silver', symbol: 'XAG', price: 31.45, unit: 'USD/oz', change: 0.82, changePct: 2.68, category: 'metals' },
  { id: 'copper', name: 'Copper', symbol: 'HG', price: 4.32, unit: 'USD/lb', change: -0.08, changePct: -1.82, category: 'metals' },
  { id: 'wheat', name: 'Wheat', symbol: 'ZW', price: 5.85, unit: 'USD/bu', change: 0.12, changePct: 2.09, category: 'agriculture' },
  { id: 'corn', name: 'Corn', symbol: 'ZC', price: 4.62, unit: 'USD/bu', change: -0.05, changePct: -1.07, category: 'agriculture' },
];

const CRYPTO_ASSETS: CryptoAsset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 98450, marketCap: '1.93T', change24h: 2.34, volume24h: '42B' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3840, marketCap: '462B', change24h: 1.87, volume24h: '18B' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 185, marketCap: '82B', change24h: 4.21, volume24h: '5.2B' },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', price: 612, marketCap: '94B', change24h: -0.54, volume24h: '2.1B' },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', price: 2.45, marketCap: '138B', change24h: 1.23, volume24h: '4.8B' },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 0.92, marketCap: '33B', change24h: -1.12, volume24h: '1.2B' },
];

const COMPOSITE_SIGNALS: CompositeSignal[] = [
  { id: 'momentum', name: 'Market Momentum', value: 72, weight: 0.20, direction: 'bullish', description: 'Multi-timeframe momentum across GCC & global indices' },
  { id: 'volatility', name: 'Volatility Regime', value: 35, weight: 0.15, direction: 'neutral', description: 'VIX, MOVE, GCC implied vol surfaces' },
  { id: 'credit', name: 'Credit Stress', value: 22, weight: 0.15, direction: 'bullish', description: 'CDS spreads, GCC sovereign yields, IG/HY spread' },
  { id: 'flow', name: 'Capital Flow', value: 65, weight: 0.15, direction: 'bullish', description: 'Net fund flows, FDI inflows, capital flight indicators' },
  { id: 'sentiment', name: 'Sentiment Index', value: 58, weight: 0.10, direction: 'neutral', description: 'News sentiment, social signal, put/call ratios' },
  { id: 'geopolitical', name: 'Geopolitical Risk', value: 48, weight: 0.15, direction: 'bearish', description: 'GPR index, conflict proximity, sanctions risk' },
  { id: 'liquidity', name: 'Liquidity Conditions', value: 68, weight: 0.10, direction: 'bullish', description: 'Central bank balances, repo rates, interbank spreads' },
];

// ── Component ────────────────────────────────────────

export function FinanceRadar() {
  const { variant } = useVariant();
  const [tab, setTab] = useState<FinanceTab>('exchanges');
  const [exchangeFilter, setExchangeFilter] = useState<'gcc' | 'global' | 'all'>('gcc');

  const compositeScore = useMemo(() => {
    const weighted = COMPOSITE_SIGNALS.reduce((acc, s) => acc + s.value * s.weight, 0);
    return Math.round(weighted);
  }, []);

  const tabs: { id: FinanceTab; label: string; count: number }[] = [
    { id: 'exchanges', label: 'EXCHANGES', count: GCC_EXCHANGES.length + GLOBAL_EXCHANGES.length },
    { id: 'commodities', label: 'COMMODITIES', count: COMMODITIES.length },
    { id: 'crypto', label: 'CRYPTO', count: CRYPTO_ASSETS.length },
    { id: 'composite', label: 'COMPOSITE', count: COMPOSITE_SIGNALS.length },
  ];

  const filteredExchanges = useMemo(() => {
    if (exchangeFilter === 'gcc') return GCC_EXCHANGES;
    if (exchangeFilter === 'global') return GLOBAL_EXCHANGES;
    return [...GCC_EXCHANGES, ...GLOBAL_EXCHANGES];
  }, [exchangeFilter]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-1.5 border-b shrink-0 flex items-center gap-3" style={{ borderColor: variant.colors.border }}>
        <span className="text-sm font-bold" style={{ color: variant.colors.text }}>FINANCE RADAR</span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${variant.colors.success}20`, color: variant.colors.success }}>
          COMPOSITE: {compositeScore}/100
        </span>
        <div className="flex gap-0.5 ml-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx('text-[9px] font-mono px-2 py-0.5 rounded transition-colors', tab === t.id ? 'text-white' : 'text-gray-600 hover:text-gray-400')}
              style={tab === t.id ? { backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary } : undefined}
            >
              {t.label} <span className="opacity-50">({t.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2">
        {tab === 'exchanges' && (
          <div>
            <div className="flex gap-1 mb-2">
              {(['gcc', 'global', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setExchangeFilter(f)}
                  className={clsx('text-[8px] font-mono px-2 py-0.5 rounded', exchangeFilter === f ? 'text-white' : 'text-gray-600')}
                  style={exchangeFilter === f ? { backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary } : undefined}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {filteredExchanges.map((ex) => (
                <ExchangeCard key={ex.id} exchange={ex} variant={variant} />
              ))}
            </div>
          </div>
        )}

        {tab === 'commodities' && (
          <div className="grid grid-cols-2 gap-1">
            {COMMODITIES.map((c) => (
              <CommodityCard key={c.id} commodity={c} variant={variant} />
            ))}
          </div>
        )}

        {tab === 'crypto' && (
          <div className="grid grid-cols-2 gap-1">
            {CRYPTO_ASSETS.map((c) => (
              <CryptoCard key={c.id} crypto={c} variant={variant} />
            ))}
          </div>
        )}

        {tab === 'composite' && (
          <div>
            {/* Composite score display */}
            <div className="text-center mb-3 py-2 rounded border" style={{ borderColor: variant.colors.border, backgroundColor: `${variant.colors.surface}` }}>
              <div className="text-3xl font-bold font-mono" style={{ color: compositeScore >= 60 ? variant.colors.success : compositeScore >= 40 ? variant.colors.warning : variant.colors.critical }}>
                {compositeScore}
              </div>
              <div className="text-[9px] font-mono" style={{ color: variant.colors.textMuted }}>
                7-SIGNAL MARKET COMPOSITE
              </div>
            </div>
            <div className="space-y-1">
              {COMPOSITE_SIGNALS.map((s) => (
                <SignalRow key={s.id} signal={s} variant={variant} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────

function ExchangeCard({ exchange, variant }: { exchange: MarketIndex; variant: any }) {
  const isUp = exchange.change >= 0;
  return (
    <div className="p-2 rounded border text-[10px] font-mono" style={{ borderColor: variant.colors.border, backgroundColor: `${variant.colors.bg}80` }}>
      <div className="flex justify-between items-start">
        <div>
          <span style={{ color: variant.colors.text }}>{exchange.ticker}</span>
          <span className="ml-1 text-[8px]" style={{ color: variant.colors.textMuted }}>{exchange.region}</span>
        </div>
        <span className={clsx('text-[8px] px-1 rounded', exchange.status === 'open' ? 'text-green-400' : 'text-gray-500')}>
          {exchange.status.toUpperCase()}
        </span>
      </div>
      <div className="mt-1">
        <span className="text-sm font-bold" style={{ color: variant.colors.text }}>{exchange.value.toLocaleString()}</span>
        <span className="ml-2" style={{ color: isUp ? '#34D399' : '#F87171' }}>
          {isUp ? '▲' : '▼'} {Math.abs(exchange.changePct).toFixed(2)}%
        </span>
      </div>
      <div className="text-[8px] mt-0.5" style={{ color: variant.colors.textMuted }}>Vol: {exchange.volume}</div>
    </div>
  );
}

function CommodityCard({ commodity, variant }: { commodity: CommodityPrice; variant: any }) {
  const isUp = commodity.change >= 0;
  return (
    <div className="p-2 rounded border text-[10px] font-mono" style={{ borderColor: variant.colors.border, backgroundColor: `${variant.colors.bg}80` }}>
      <div className="flex justify-between">
        <span style={{ color: variant.colors.text }}>{commodity.name}</span>
        <span className="text-[8px] uppercase" style={{ color: variant.colors.textMuted }}>{commodity.category}</span>
      </div>
      <div className="mt-1">
        <span className="text-sm font-bold" style={{ color: variant.colors.text }}>${commodity.price.toLocaleString()}</span>
        <span className="text-[8px] ml-1" style={{ color: variant.colors.textMuted }}>{commodity.unit}</span>
      </div>
      <span style={{ color: isUp ? '#34D399' : '#F87171' }}>
        {isUp ? '▲' : '▼'} {Math.abs(commodity.changePct).toFixed(2)}%
      </span>
    </div>
  );
}

function CryptoCard({ crypto, variant }: { crypto: CryptoAsset; variant: any }) {
  const isUp = crypto.change24h >= 0;
  return (
    <div className="p-2 rounded border text-[10px] font-mono" style={{ borderColor: variant.colors.border, backgroundColor: `${variant.colors.bg}80` }}>
      <div className="flex justify-between">
        <span style={{ color: variant.colors.text }}>{crypto.symbol}</span>
        <span className="text-[8px]" style={{ color: variant.colors.textMuted }}>MCap: ${crypto.marketCap}</span>
      </div>
      <div className="mt-1">
        <span className="text-sm font-bold" style={{ color: variant.colors.text }}>${crypto.price.toLocaleString()}</span>
      </div>
      <div className="flex justify-between mt-0.5">
        <span style={{ color: isUp ? '#34D399' : '#F87171' }}>
          {isUp ? '▲' : '▼'} {Math.abs(crypto.change24h).toFixed(2)}%
        </span>
        <span style={{ color: variant.colors.textMuted }}>Vol: ${crypto.volume24h}</span>
      </div>
    </div>
  );
}

function SignalRow({ signal, variant }: { signal: CompositeSignal; variant: any }) {
  const dirColor = signal.direction === 'bullish' ? '#34D399' : signal.direction === 'bearish' ? '#F87171' : '#FBBF24';
  const dirIcon = signal.direction === 'bullish' ? '▲' : signal.direction === 'bearish' ? '▼' : '◆';

  return (
    <div className="flex items-center gap-2 py-1 px-2 rounded" style={{ backgroundColor: `${variant.colors.bg}80` }}>
      <span className="text-[10px]" style={{ color: dirColor }}>{dirIcon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <span className="text-[10px] font-mono" style={{ color: variant.colors.text }}>{signal.name}</span>
          <span className="text-[10px] font-bold font-mono" style={{ color: dirColor }}>{signal.value}</span>
        </div>
        <div className="w-full h-1 rounded-full mt-0.5" style={{ backgroundColor: `${variant.colors.border}` }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${signal.value}%`, backgroundColor: dirColor }} />
        </div>
      </div>
      <span className="text-[8px] font-mono shrink-0" style={{ color: variant.colors.textMuted }}>
        w:{(signal.weight * 100).toFixed(0)}%
      </span>
    </div>
  );
}
