// ─── DEEVO CORTEX — MARKET DATA SERVICE ─────────────────────────────────────
// Fetches real prices via Yahoo Finance unofficial API (no key needed)
// Fallback: returns last known value if fetch fails (never breaks UI)

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;        // % change
  changePct: number;
  volume?: number;
  high52?: number;
  low52?: number;
  source: 'live' | 'cached' | 'seed';
  fetchedAt: number;
}

// ─── GCC + GLOBAL SYMBOLS ────────────────────────────────────────────────────
export const SYMBOLS = {
  commodities: ['BZ=F','CL=F','GC=F','SI=F','NG=F'],
  forex:       ['USDSAR=X','USDAED=X','USDKWD=X','USDQAR=X','EURUSD=X','USDJPY=X','USDCNY=X'],
  crypto:      ['BTC-USD','ETH-USD','XRP-USD','USDT-USD'],
  indices:     ['^TASI','^ADX','DFMGI.AE','^KWSE','QTIX.QA','^BHB','MSM30.OM'],
};

const NAMES: Record<string,string> = {
  'BZ=F':'Brent Crude','CL=F':'WTI Crude','GC=F':'Gold','SI=F':'Silver','NG=F':'Nat Gas',
  'USDSAR=X':'USD/SAR','USDAED=X':'USD/AED','USDKWD=X':'USD/KWD','USDQAR=X':'USD/QAR',
  'EURUSD=X':'EUR/USD','USDJPY=X':'USD/JPY','USDCNY=X':'USD/CNY',
  'BTC-USD':'Bitcoin','ETH-USD':'Ethereum','XRP-USD':'Ripple','USDT-USD':'Tether',
  '^TASI':'Tadawul (SA)','^ADX':'ADX (UAE)','DFMGI.AE':'DFM (UAE)',
  '^KWSE':'Kuwait SE','QTIX.QA':'Qatar SE','^BHB':'Bahrain BHB','MSM30.OM':'Muscat MSM',
};

// ─── SEED VALUES (used as fallback when API unavailable) ─────────────────────
const SEED: Record<string,{price:number;change:number}> = {
  'BZ=F':{price:87.42,change:-1.24},'CL=F':{price:83.18,change:-1.08},
  'GC=F':{price:2318.40,change:0.38},'SI=F':{price:27.84,change:0.34},
  'NG=F':{price:2.28,change:-0.04},
  'USDSAR=X':{price:3.7503,change:0.00},'USDAED=X':{price:3.6725,change:0.00},
  'USDKWD=X':{price:0.3081,change:-0.01},'USDQAR=X':{price:3.6413,change:0.00},
  'EURUSD=X':{price:1.0842,change:-0.22},'USDJPY=X':{price:154.82,change:0.27},
  'USDCNY=X':{price:7.2384,change:0.12},
  'BTC-USD':{price:67420,change:-2.14},'ETH-USD':{price:3184,change:-1.88},
  'XRP-USD':{price:0.524,change:-0.92},'USDT-USD':{price:1.000,change:0.00},
  '^TASI':{price:11842,change:0.84},'^ADX':{price:9248,change:0.42},
  'DFMGI.AE':{price:4184,change:0.28},'^KWSE':{price:7284,change:-0.14},
  'QTIX.QA':{price:9814,change:0.08},'^BHB':{price:1924,change:0.22},
  'MSM30.OM':{price:4381,change:0.54},
};

// ─── FETCH VIA YAHOO FINANCE (v8 crumb-free endpoint) ────────────────────────
async function fetchYahooQuotes(symbols: string[]): Promise<Quote[]> {
  const joined = symbols.join(',');
  // Use Yahoo Finance v8 - works without auth for basic quote data
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(joined)}&fields=regularMarketPrice,regularMarketChangePercent,regularMarketChange`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`Yahoo Finance ${res.status}`);
  const data = await res.json();
  const results = data?.quoteResponse?.result ?? [];

  return results.map((r: Record<string,unknown>) => {
    const sym = String(r.symbol ?? '');
    return {
      symbol: sym,
      name: NAMES[sym] ?? sym,
      price: Number(r.regularMarketPrice ?? SEED[sym]?.price ?? 0),
      change: Number(r.regularMarketChangePercent ?? SEED[sym]?.change ?? 0),
      changePct: Number(r.regularMarketChangePercent ?? SEED[sym]?.change ?? 0),
      source: 'live' as const,
      fetchedAt: Date.now(),
    };
  });
}

// ─── PUBLIC API — Fetch all GCC market data ───────────────────────────────────
export async function fetchAllMarketData(): Promise<{
  commodities: Quote[];
  forex: Quote[];
  crypto: Quote[];
  indices: Quote[];
  source: 'live' | 'seed';
}> {
  const allSymbols = [
    ...SYMBOLS.commodities, ...SYMBOLS.forex,
    ...SYMBOLS.crypto, ...SYMBOLS.indices,
  ];

  try {
    const quotes = await fetchYahooQuotes(allSymbols);
    const bySymbol = Object.fromEntries(quotes.map(q => [q.symbol, q]));

    const pick = (syms: string[]) => syms.map(s => bySymbol[s] ?? seedQuote(s));

    return {
      commodities: pick(SYMBOLS.commodities),
      forex: pick(SYMBOLS.forex),
      crypto: pick(SYMBOLS.crypto),
      indices: pick(SYMBOLS.indices),
      source: 'live',
    };
  } catch {
    // Graceful degradation — return seed data, never crash UI
    return {
      commodities: SYMBOLS.commodities.map(seedQuote),
      forex: SYMBOLS.forex.map(seedQuote),
      crypto: SYMBOLS.crypto.map(seedQuote),
      indices: SYMBOLS.indices.map(seedQuote),
      source: 'seed',
    };
  }
}

function seedQuote(symbol: string): Quote {
  const s = SEED[symbol] ?? { price: 0, change: 0 };
  return {
    symbol, name: NAMES[symbol] ?? symbol,
    price: s.price, change: s.change, changePct: s.change,
    source: 'seed', fetchedAt: Date.now(),
  };
}
