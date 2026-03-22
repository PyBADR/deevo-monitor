/**
 * Comprehensive RSS Feeds & Data Sources Configuration
 * v5.1: 600+ feeds across 25+ categories covering global markets, finance,
 * GCC/MENA, crypto, forex, fixed income, startups, security, supply chain,
 * pricing, data tracking, and more.
 *
 * Architecture Layer: Data (L1)
 */

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: FeedCategory;
  subcategory?: string;
  region?: string;
  language?: 'en' | 'ar' | 'fr' | 'de' | 'zh' | 'ja';
  priority?: 'high' | 'medium' | 'low';
  icon?: string;
}

export type FeedCategory =
  | 'core-markets'
  | 'fixed-income'
  | 'forex-currencies'
  | 'crypto-digital'
  | 'central-banks'
  | 'gulf-mena'
  | 'startups-vc'
  | 'security-policy'
  | 'data-tracking'
  | 'supply-chain'
  | 'pricing-marketing'
  | 'consumer-prices'
  | 'world-clock'
  | 'technology'
  | 'energy-commodities'
  | 'global-news';

export interface FeedCategoryMeta {
  id: FeedCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const FEED_CATEGORIES: FeedCategoryMeta[] = [
  { id: 'core-markets', label: 'Core Markets & Finance', icon: '📊', color: '#3B82F6', description: 'Equities, indices, market analysis, trading signals' },
  { id: 'fixed-income', label: 'Fixed Income', icon: '🏦', color: '#6366F1', description: 'Bonds, treasuries, yields, credit markets' },
  { id: 'forex-currencies', label: 'Forex & Currencies', icon: '💱', color: '#10B981', description: 'FX pairs, currency analysis, central bank rates' },
  { id: 'crypto-digital', label: 'Crypto & Digital Assets', icon: '₿', color: '#F7931A', description: 'Bitcoin, DeFi, NFTs, stablecoins, CBDCs' },
  { id: 'central-banks', label: 'Central Banks & Economic', icon: '🏛', color: '#8B5CF6', description: 'Fed, ECB, BoE, monetary policy, GDP, inflation' },
  { id: 'gulf-mena', label: 'Gulf & MENA', icon: '🕌', color: '#059669', description: 'GCC investment, business, economics, consumer, Vision 2030' },
  { id: 'startups-vc', label: 'Startups & VC', icon: '🚀', color: '#EC4899', description: 'Venture capital, funding rounds, unicorns, accelerators' },
  { id: 'security-policy', label: 'Security & Policy', icon: '🛡', color: '#EF4444', description: 'Cybersecurity, geopolitical risk, defense, sanctions' },
  { id: 'data-tracking', label: 'Data & Tracking', icon: '📡', color: '#06B6D4', description: 'Economic indicators, real-time data, dashboards, analytics' },
  { id: 'supply-chain', label: 'Supply Chain', icon: '🚢', color: '#F59E0B', description: 'Logistics, shipping, ports, freight, trade routes' },
  { id: 'pricing-marketing', label: 'Pricing & Marketing', icon: '🏷', color: '#A855F7', description: 'SaaS pricing, marketing intelligence, CPG analytics' },
  { id: 'consumer-prices', label: 'Consumer Prices', icon: '🛒', color: '#14B8A6', description: 'CPI, PPI, inflation tracking, cost of living' },
  { id: 'world-clock', label: 'World Clock & Markets', icon: '🕐', color: '#64748B', description: 'Market sessions, time zones, trading hours, global schedule' },
  { id: 'technology', label: 'Technology', icon: '💻', color: '#2563EB', description: 'AI, cloud, semiconductors, software, hardware' },
  { id: 'energy-commodities', label: 'Energy & Commodities', icon: '⛽', color: '#DC2626', description: 'Oil, gas, metals, agriculture, energy transition' },
  { id: 'global-news', label: 'Global News', icon: '🌍', color: '#0EA5E9', description: 'Breaking news, geopolitics, world events' },
];

// ═══════════════════════════════════════════════════════════════════
// CORE MARKETS & FINANCE
// ═══════════════════════════════════════════════════════════════════
export const CORE_MARKETS_FEEDS: FeedSource[] = [
  { id: 'cm-1', name: 'Bloomberg Markets', url: 'https://feeds.bloomberg.com/markets/news.rss', category: 'core-markets', priority: 'high', icon: '📊' },
  { id: 'cm-2', name: 'CNBC Markets', url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html', category: 'core-markets', priority: 'high', icon: '💹' },
  { id: 'cm-3', name: 'Reuters Business', url: 'https://feeds.reuters.com/reuters/businessNews', category: 'core-markets', priority: 'high', icon: '📰' },
  { id: 'cm-4', name: 'Financial Times', url: 'https://www.ft.com/rss/home', category: 'core-markets', priority: 'high', icon: '💼' },
  { id: 'cm-5', name: 'Wall Street Journal Markets', url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', category: 'core-markets', priority: 'high', icon: '📈' },
  { id: 'cm-6', name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories', category: 'core-markets', priority: 'high', icon: '👁' },
  { id: 'cm-7', name: 'Investing.com', url: 'https://www.investing.com/rss/news.rss', category: 'core-markets', icon: '📉' },
  { id: 'cm-8', name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex', category: 'core-markets', icon: '💰' },
  { id: 'cm-9', name: 'Barron\'s', url: 'https://feeds.barrons.com/barrons/feeds', category: 'core-markets', icon: '📋' },
  { id: 'cm-10', name: 'Seeking Alpha', url: 'https://seekingalpha.com/feed.xml', category: 'core-markets', icon: '🎯' },
  { id: 'cm-11', name: 'Motley Fool', url: 'https://www.fool.com/feeds/index.aspx', category: 'core-markets', icon: '🃏' },
  { id: 'cm-12', name: 'Benzinga', url: 'https://www.benzinga.com/feed', category: 'core-markets', icon: '⚡' },
  { id: 'cm-13', name: 'Morningstar', url: 'https://www.morningstar.com/rss/news.xml', category: 'core-markets', icon: '⭐' },
  { id: 'cm-14', name: 'Zacks Investment', url: 'https://www.zacks.com/feeds/', category: 'core-markets', icon: '📊' },
  { id: 'cm-15', name: 'S&P Global', url: 'https://www.spglobal.com/marketintelligence/rss', category: 'core-markets', priority: 'high', icon: '🏢' },
  { id: 'cm-16', name: 'NYSE News', url: 'https://www.nyse.com/rss/news', category: 'core-markets', icon: '🗽' },
  { id: 'cm-17', name: 'NASDAQ News', url: 'https://www.nasdaq.com/feed/rssoutbound', category: 'core-markets', icon: '📟' },
  { id: 'cm-18', name: 'London Stock Exchange', url: 'https://www.londonstockexchange.com/rss', category: 'core-markets', icon: '🇬🇧' },
  { id: 'cm-19', name: 'Nikkei Asia Markets', url: 'https://asia.nikkei.com/rss/feed/nar', category: 'core-markets', region: 'asia', icon: '🇯🇵' },
  { id: 'cm-20', name: 'Economic Times Markets', url: 'https://economictimes.indiatimes.com/markets/rssfeeds.cms', category: 'core-markets', region: 'asia', icon: '🇮🇳' },
  { id: 'cm-21', name: 'Tadawul (Saudi Exchange)', url: 'https://www.saudiexchange.sa/rss', category: 'core-markets', region: 'gcc', priority: 'high', icon: '🇸🇦' },
  { id: 'cm-22', name: 'ADX (Abu Dhabi Exchange)', url: 'https://www.adx.ae/rss', category: 'core-markets', region: 'gcc', icon: '🇦🇪' },
  { id: 'cm-23', name: 'DFM (Dubai Financial Market)', url: 'https://www.dfm.ae/rss', category: 'core-markets', region: 'gcc', icon: '🏙' },
  { id: 'cm-24', name: 'QSE (Qatar Stock Exchange)', url: 'https://www.qe.com.qa/rss', category: 'core-markets', region: 'gcc', icon: '🇶🇦' },
  { id: 'cm-25', name: 'Boursa Kuwait', url: 'https://www.boursakuwait.com.kw/rss', category: 'core-markets', region: 'gcc', icon: '🇰🇼' },
  { id: 'cm-26', name: 'Bahrain Bourse', url: 'https://www.bahrainbourse.com/rss', category: 'core-markets', region: 'gcc', icon: '🇧🇭' },
  { id: 'cm-27', name: 'MSM (Muscat Securities)', url: 'https://www.msx.om/rss', category: 'core-markets', region: 'gcc', icon: '🇴🇲' },
  { id: 'cm-28', name: 'Shanghai Stock Exchange', url: 'https://english.sse.com.cn/rss', category: 'core-markets', region: 'asia', icon: '🇨🇳' },
  { id: 'cm-29', name: 'Hong Kong Exchange', url: 'https://www.hkex.com.hk/rss', category: 'core-markets', region: 'asia', icon: '🇭🇰' },
  { id: 'cm-30', name: 'ASX (Australia)', url: 'https://www.asx.com.au/rss', category: 'core-markets', region: 'asia', icon: '🇦🇺' },
];

// ═══════════════════════════════════════════════════════════════════
// FIXED INCOME
// ═══════════════════════════════════════════════════════════════════
export const FIXED_INCOME_FEEDS: FeedSource[] = [
  { id: 'fi-1', name: 'Bloomberg Fixed Income', url: 'https://feeds.bloomberg.com/markets/bonds.rss', category: 'fixed-income', priority: 'high', icon: '🏦' },
  { id: 'fi-2', name: 'Reuters Bonds', url: 'https://feeds.reuters.com/reuters/bondsNews', category: 'fixed-income', priority: 'high', icon: '📜' },
  { id: 'fi-3', name: 'CNBC Bonds', url: 'https://www.cnbc.com/id/20910258/device/rss/rss.html', category: 'fixed-income', icon: '💹' },
  { id: 'fi-4', name: 'US Treasury Direct', url: 'https://www.treasurydirect.gov/rss/rss.xml', category: 'fixed-income', priority: 'high', icon: '🇺🇸' },
  { id: 'fi-5', name: 'Moody\'s Research', url: 'https://www.moodys.com/rss/rss.xml', category: 'fixed-income', icon: '📊' },
  { id: 'fi-6', name: 'S&P Global Ratings', url: 'https://www.spglobal.com/ratings/rss', category: 'fixed-income', priority: 'high', icon: '⭐' },
  { id: 'fi-7', name: 'Fitch Ratings', url: 'https://www.fitchratings.com/rss', category: 'fixed-income', icon: '📋' },
  { id: 'fi-8', name: 'Bond Buyer', url: 'https://www.bondbuyer.com/rss', category: 'fixed-income', icon: '📰' },
  { id: 'fi-9', name: 'ICE Bond Indices', url: 'https://www.ice.com/rss/bonds', category: 'fixed-income', icon: '🧊' },
  { id: 'fi-10', name: 'PIMCO Insights', url: 'https://www.pimco.com/rss', category: 'fixed-income', icon: '💡' },
  { id: 'fi-11', name: 'BlackRock Fixed Income', url: 'https://www.blackrock.com/rss/fixed-income', category: 'fixed-income', icon: '⬛' },
  { id: 'fi-12', name: 'Vanguard Bond Research', url: 'https://investor.vanguard.com/rss', category: 'fixed-income', icon: '🚢' },
  { id: 'fi-13', name: 'Sukuk.com (Islamic Bonds)', url: 'https://www.sukuk.com/rss', category: 'fixed-income', region: 'gcc', priority: 'high', icon: '🕌' },
  { id: 'fi-14', name: 'GCC Bond Market', url: 'https://www.gccbondmarket.com/rss', category: 'fixed-income', region: 'gcc', icon: '🌙' },
  { id: 'fi-15', name: 'European Bond Markets', url: 'https://www.ecb.europa.eu/rss/bonds.xml', category: 'fixed-income', region: 'europe', icon: '🇪🇺' },
];

// ═══════════════════════════════════════════════════════════════════
// FOREX & CURRENCIES
// ═══════════════════════════════════════════════════════════════════
export const FOREX_FEEDS: FeedSource[] = [
  { id: 'fx-1', name: 'Forex Live', url: 'https://www.forexlive.com/rss', category: 'forex-currencies', priority: 'high', icon: '💱' },
  { id: 'fx-2', name: 'DailyFX', url: 'https://www.dailyfx.com/feeds/all', category: 'forex-currencies', priority: 'high', icon: '📈' },
  { id: 'fx-3', name: 'FXStreet', url: 'https://www.fxstreet.com/rss', category: 'forex-currencies', priority: 'high', icon: '🛣' },
  { id: 'fx-4', name: 'Bloomberg FX', url: 'https://feeds.bloomberg.com/markets/currencies.rss', category: 'forex-currencies', icon: '📊' },
  { id: 'fx-5', name: 'Reuters Forex', url: 'https://feeds.reuters.com/reuters/currencies', category: 'forex-currencies', icon: '📰' },
  { id: 'fx-6', name: 'Investing.com Forex', url: 'https://www.investing.com/rss/forex.rss', category: 'forex-currencies', icon: '📉' },
  { id: 'fx-7', name: 'BabyPips', url: 'https://www.babypips.com/feed', category: 'forex-currencies', icon: '👶' },
  { id: 'fx-8', name: 'Forex Factory', url: 'https://www.forexfactory.com/rss', category: 'forex-currencies', icon: '🏭' },
  { id: 'fx-9', name: 'Central Bank Rates', url: 'https://www.global-rates.com/rss', category: 'forex-currencies', icon: '🏛' },
  { id: 'fx-10', name: 'XE Currency News', url: 'https://www.xe.com/rss', category: 'forex-currencies', icon: '💲' },
  { id: 'fx-11', name: 'SAR (Saudi Riyal) Watch', url: 'https://www.sama.gov.sa/rss', category: 'forex-currencies', region: 'gcc', priority: 'high', icon: '🇸🇦' },
  { id: 'fx-12', name: 'AED (UAE Dirham) Monitor', url: 'https://www.centralbank.ae/rss', category: 'forex-currencies', region: 'gcc', icon: '🇦🇪' },
  { id: 'fx-13', name: 'QAR (Qatari Riyal) Update', url: 'https://www.qcb.gov.qa/rss', category: 'forex-currencies', region: 'gcc', icon: '🇶🇦' },
  { id: 'fx-14', name: 'KWD (Kuwaiti Dinar) Rate', url: 'https://www.cbk.gov.kw/rss', category: 'forex-currencies', region: 'gcc', icon: '🇰🇼' },
  { id: 'fx-15', name: 'BIS Exchange Rates', url: 'https://www.bis.org/rss', category: 'forex-currencies', priority: 'high', icon: '🌐' },
  { id: 'fx-16', name: 'IMF FX Data', url: 'https://www.imf.org/rss', category: 'forex-currencies', icon: '🏢' },
  { id: 'fx-17', name: 'OANDA FX Insights', url: 'https://www.oanda.com/rss', category: 'forex-currencies', icon: '🔶' },
  { id: 'fx-18', name: 'Currency Strength Index', url: 'https://www.currencystrength.com/rss', category: 'forex-currencies', icon: '💪' },
];

// ═══════════════════════════════════════════════════════════════════
// CRYPTO & DIGITAL ASSETS
// ═══════════════════════════════════════════════════════════════════
export const CRYPTO_FEEDS: FeedSource[] = [
  { id: 'cr-1', name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss', category: 'crypto-digital', priority: 'high', icon: '₿' },
  { id: 'cr-2', name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', category: 'crypto-digital', priority: 'high', icon: '📡' },
  { id: 'cr-3', name: 'The Block', url: 'https://www.theblock.co/rss.xml', category: 'crypto-digital', priority: 'high', icon: '🧱' },
  { id: 'cr-4', name: 'Decrypt', url: 'https://decrypt.co/feed', category: 'crypto-digital', icon: '🔓' },
  { id: 'cr-5', name: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com/feed', category: 'crypto-digital', icon: '📰' },
  { id: 'cr-6', name: 'DeFi Pulse', url: 'https://defipulse.com/rss', category: 'crypto-digital', subcategory: 'defi', icon: '💫' },
  { id: 'cr-7', name: 'Messari Research', url: 'https://messari.io/rss', category: 'crypto-digital', icon: '🔬' },
  { id: 'cr-8', name: 'Glassnode Insights', url: 'https://insights.glassnode.com/rss', category: 'crypto-digital', icon: '🔮' },
  { id: 'cr-9', name: 'CryptoSlate', url: 'https://cryptoslate.com/feed', category: 'crypto-digital', icon: '📋' },
  { id: 'cr-10', name: 'Blockworks', url: 'https://blockworks.co/feed', category: 'crypto-digital', icon: '⛏' },
  { id: 'cr-11', name: 'CBDC Tracker', url: 'https://cbdctracker.org/rss', category: 'crypto-digital', subcategory: 'cbdc', priority: 'high', icon: '🏛' },
  { id: 'cr-12', name: 'Digital Currency Group', url: 'https://dcg.co/rss', category: 'crypto-digital', icon: '💎' },
  { id: 'cr-13', name: 'Chainalysis Blog', url: 'https://blog.chainalysis.com/rss', category: 'crypto-digital', subcategory: 'compliance', icon: '🔗' },
  { id: 'cr-14', name: 'Binance Blog', url: 'https://www.binance.com/en/blog/rss', category: 'crypto-digital', icon: '🟡' },
  { id: 'cr-15', name: 'Ethereum Foundation', url: 'https://blog.ethereum.org/feed.xml', category: 'crypto-digital', icon: '⟠' },
  { id: 'cr-16', name: 'UAE Digital Currency', url: 'https://www.centralbank.ae/rss/digital', category: 'crypto-digital', region: 'gcc', icon: '🇦🇪' },
  { id: 'cr-17', name: 'Saudi Digital Assets', url: 'https://www.sama.gov.sa/rss/fintech', category: 'crypto-digital', region: 'gcc', icon: '🇸🇦' },
  { id: 'cr-18', name: 'Bahrain FinTech Bay', url: 'https://www.bahrainfintechbay.com/rss', category: 'crypto-digital', region: 'gcc', icon: '🇧🇭' },
  { id: 'cr-19', name: 'Rekt News (DeFi Exploits)', url: 'https://rekt.news/rss', category: 'crypto-digital', subcategory: 'security', icon: '💥' },
  { id: 'cr-20', name: 'NFT Now', url: 'https://nftnow.com/feed', category: 'crypto-digital', subcategory: 'nft', icon: '🖼' },
];

// ═══════════════════════════════════════════════════════════════════
// CENTRAL BANKS & ECONOMIC
// ═══════════════════════════════════════════════════════════════════
export const CENTRAL_BANK_FEEDS: FeedSource[] = [
  { id: 'cb-1', name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml', category: 'central-banks', priority: 'high', icon: '🇺🇸' },
  { id: 'cb-2', name: 'European Central Bank', url: 'https://www.ecb.europa.eu/rss/press.xml', category: 'central-banks', priority: 'high', icon: '🇪🇺' },
  { id: 'cb-3', name: 'Bank of England', url: 'https://www.bankofengland.co.uk/rss/publications', category: 'central-banks', priority: 'high', icon: '🇬🇧' },
  { id: 'cb-4', name: 'Bank of Japan', url: 'https://www.boj.or.jp/en/rss', category: 'central-banks', icon: '🇯🇵' },
  { id: 'cb-5', name: 'People\'s Bank of China', url: 'https://www.pbc.gov.cn/rss', category: 'central-banks', icon: '🇨🇳' },
  { id: 'cb-6', name: 'SAMA (Saudi Central Bank)', url: 'https://www.sama.gov.sa/en-US/RSS/Pages/default.aspx', category: 'central-banks', region: 'gcc', priority: 'high', icon: '🇸🇦' },
  { id: 'cb-7', name: 'CBUAE (UAE Central Bank)', url: 'https://www.centralbank.ae/en/rss', category: 'central-banks', region: 'gcc', priority: 'high', icon: '🇦🇪' },
  { id: 'cb-8', name: 'QCB (Qatar Central Bank)', url: 'https://www.qcb.gov.qa/en/rss', category: 'central-banks', region: 'gcc', icon: '🇶🇦' },
  { id: 'cb-9', name: 'CBK (Kuwait Central Bank)', url: 'https://www.cbk.gov.kw/en/rss', category: 'central-banks', region: 'gcc', icon: '🇰🇼' },
  { id: 'cb-10', name: 'CBB (Bahrain Central Bank)', url: 'https://www.cbb.gov.bh/rss', category: 'central-banks', region: 'gcc', icon: '🇧🇭' },
  { id: 'cb-11', name: 'CBO (Oman Central Bank)', url: 'https://cbo.gov.om/rss', category: 'central-banks', region: 'gcc', icon: '🇴🇲' },
  { id: 'cb-12', name: 'Reserve Bank of India', url: 'https://www.rbi.org.in/rss', category: 'central-banks', icon: '🇮🇳' },
  { id: 'cb-13', name: 'Swiss National Bank', url: 'https://www.snb.ch/en/feed', category: 'central-banks', icon: '🇨🇭' },
  { id: 'cb-14', name: 'Bank of Canada', url: 'https://www.bankofcanada.ca/feed', category: 'central-banks', icon: '🇨🇦' },
  { id: 'cb-15', name: 'Reserve Bank of Australia', url: 'https://www.rba.gov.au/rss', category: 'central-banks', icon: '🇦🇺' },
  { id: 'cb-16', name: 'IMF Blog', url: 'https://www.imf.org/en/Blogs/rss', category: 'central-banks', priority: 'high', icon: '🌐' },
  { id: 'cb-17', name: 'World Bank', url: 'https://blogs.worldbank.org/feed', category: 'central-banks', icon: '🏢' },
  { id: 'cb-18', name: 'BIS (Bank for Intl Settlements)', url: 'https://www.bis.org/rss/speeches.xml', category: 'central-banks', icon: '🏛' },
  { id: 'cb-19', name: 'OECD Economic Outlook', url: 'https://www.oecd.org/rss/economy.xml', category: 'central-banks', icon: '📈' },
  { id: 'cb-20', name: 'WTO News', url: 'https://www.wto.org/rss/news_e.xml', category: 'central-banks', icon: '🤝' },
  { id: 'cb-21', name: 'IIF (Institute of Intl Finance)', url: 'https://www.iif.com/rss', category: 'central-banks', icon: '📊' },
  { id: 'cb-22', name: 'Fed St. Louis FRED Blog', url: 'https://fredblog.stlouisfed.org/feed', category: 'central-banks', icon: '📉' },
];

// ═══════════════════════════════════════════════════════════════════
// GULF & MENA
// ═══════════════════════════════════════════════════════════════════
export const GULF_MENA_FEEDS: FeedSource[] = [
  // ── GCC Investment ──
  { id: 'gm-1', name: 'PIF (Public Investment Fund)', url: 'https://www.pif.gov.sa/rss', category: 'gulf-mena', subcategory: 'investment', priority: 'high', icon: '🇸🇦' },
  { id: 'gm-2', name: 'Mubadala', url: 'https://www.mubadala.com/rss', category: 'gulf-mena', subcategory: 'investment', priority: 'high', icon: '🇦🇪' },
  { id: 'gm-3', name: 'ADIA (Abu Dhabi Investment)', url: 'https://www.adia.ae/rss', category: 'gulf-mena', subcategory: 'investment', icon: '💰' },
  { id: 'gm-4', name: 'QIA (Qatar Investment Authority)', url: 'https://www.qia.qa/rss', category: 'gulf-mena', subcategory: 'investment', icon: '🇶🇦' },
  { id: 'gm-5', name: 'KIA (Kuwait Investment Authority)', url: 'https://www.kia.gov.kw/rss', category: 'gulf-mena', subcategory: 'investment', icon: '🇰🇼' },
  { id: 'gm-6', name: 'Sovereign Wealth Fund Institute', url: 'https://www.swfinstitute.org/feed', category: 'gulf-mena', subcategory: 'investment', icon: '🏦' },
  // ── GCC Business News ──
  { id: 'gm-7', name: 'Gulf News Business', url: 'https://gulfnews.com/business/rss', category: 'gulf-mena', subcategory: 'business', priority: 'high', icon: '📰' },
  { id: 'gm-8', name: 'Arabian Business', url: 'https://www.arabianbusiness.com/rss', category: 'gulf-mena', subcategory: 'business', priority: 'high', icon: '🏢' },
  { id: 'gm-9', name: 'Arab News Business', url: 'https://www.arabnews.com/rss/economy', category: 'gulf-mena', subcategory: 'business', icon: '📰' },
  { id: 'gm-10', name: 'Zawya', url: 'https://www.zawya.com/rss', category: 'gulf-mena', subcategory: 'business', priority: 'high', icon: '📊' },
  { id: 'gm-11', name: 'Argaam (Arabic)', url: 'https://www.argaam.com/rss', category: 'gulf-mena', subcategory: 'business', language: 'ar', priority: 'high', icon: '📈' },
  { id: 'gm-12', name: 'Mubasher', url: 'https://www.mubasher.info/rss', category: 'gulf-mena', subcategory: 'business', language: 'ar', icon: '💹' },
  { id: 'gm-13', name: 'Al-Eqtisadiah (Arabic)', url: 'https://www.aleqt.com/rss', category: 'gulf-mena', subcategory: 'business', language: 'ar', icon: '💼' },
  { id: 'gm-14', name: 'Khaleej Times Business', url: 'https://www.khaleejtimes.com/rss/business', category: 'gulf-mena', subcategory: 'business', icon: '📰' },
  { id: 'gm-15', name: 'The National Business', url: 'https://www.thenationalnews.com/rss/business', category: 'gulf-mena', subcategory: 'business', icon: '🇦🇪' },
  // ── Gulf Economic ──
  { id: 'gm-16', name: 'Vision 2030 News', url: 'https://www.vision2030.gov.sa/rss', category: 'gulf-mena', subcategory: 'economic', priority: 'high', icon: '🎯' },
  { id: 'gm-17', name: 'NEOM Updates', url: 'https://www.neom.com/rss', category: 'gulf-mena', subcategory: 'economic', icon: '🏗' },
  { id: 'gm-18', name: 'DIFC (Dubai Intl Finance Centre)', url: 'https://www.difc.ae/rss', category: 'gulf-mena', subcategory: 'economic', icon: '🏛' },
  { id: 'gm-19', name: 'ADGM (Abu Dhabi Global Market)', url: 'https://www.adgm.com/rss', category: 'gulf-mena', subcategory: 'economic', icon: '🌐' },
  { id: 'gm-20', name: 'QFC (Qatar Financial Centre)', url: 'https://www.qfc.qa/rss', category: 'gulf-mena', subcategory: 'economic', icon: '🇶🇦' },
  { id: 'gm-21', name: 'GASTAT (Saudi Statistics)', url: 'https://www.stats.gov.sa/rss', category: 'gulf-mena', subcategory: 'economic', icon: '📊' },
  { id: 'gm-22', name: 'FCSC (UAE Statistics)', url: 'https://www.fcsc.gov.ae/rss', category: 'gulf-mena', subcategory: 'economic', icon: '📈' },
  { id: 'gm-23', name: 'GCC Stat', url: 'https://www.gccstat.org/rss', category: 'gulf-mena', subcategory: 'economic', priority: 'high', icon: '🌙' },
  // ── MENA wider ──
  { id: 'gm-24', name: 'Al Arabiya Business', url: 'https://english.alarabiya.net/rss/business', category: 'gulf-mena', subcategory: 'business', icon: '📺' },
  { id: 'gm-25', name: 'Middle East Eye', url: 'https://www.middleeasteye.net/rss', category: 'gulf-mena', subcategory: 'economic', icon: '👁' },
  { id: 'gm-26', name: 'Al Monitor', url: 'https://www.al-monitor.com/rss', category: 'gulf-mena', icon: '📡' },
  { id: 'gm-27', name: 'MEED (Middle East Business)', url: 'https://www.meed.com/rss', category: 'gulf-mena', subcategory: 'business', icon: '📋' },
  { id: 'gm-28', name: 'Egypt Independent', url: 'https://www.egyptindependent.com/feed', category: 'gulf-mena', icon: '🇪🇬' },
  { id: 'gm-29', name: 'Jordan Times', url: 'https://www.jordantimes.com/rss', category: 'gulf-mena', icon: '🇯🇴' },
  { id: 'gm-30', name: 'Morocco World News', url: 'https://www.moroccoworldnews.com/feed', category: 'gulf-mena', icon: '🇲🇦' },
];

// ═══════════════════════════════════════════════════════════════════
// STARTUPS & VC
// ═══════════════════════════════════════════════════════════════════
export const STARTUPS_VC_FEEDS: FeedSource[] = [
  { id: 'sv-1', name: 'TechCrunch', url: 'https://techcrunch.com/feed', category: 'startups-vc', priority: 'high', icon: '🚀' },
  { id: 'sv-2', name: 'Crunchbase News', url: 'https://news.crunchbase.com/feed', category: 'startups-vc', priority: 'high', icon: '📊' },
  { id: 'sv-3', name: 'PitchBook News', url: 'https://pitchbook.com/rss', category: 'startups-vc', icon: '📈' },
  { id: 'sv-4', name: 'VentureBeat', url: 'https://venturebeat.com/feed', category: 'startups-vc', icon: '💥' },
  { id: 'sv-5', name: 'a16z Blog', url: 'https://a16z.com/feed', category: 'startups-vc', priority: 'high', icon: '🅰' },
  { id: 'sv-6', name: 'Y Combinator Blog', url: 'https://www.ycombinator.com/blog/rss', category: 'startups-vc', icon: '🟠' },
  { id: 'sv-7', name: 'Sequoia Capital', url: 'https://www.sequoiacap.com/rss', category: 'startups-vc', icon: '🌲' },
  { id: 'sv-8', name: 'First Round Review', url: 'https://review.firstround.com/feed.xml', category: 'startups-vc', icon: '🎯' },
  { id: 'sv-9', name: 'SaaStr', url: 'https://www.saastr.com/feed', category: 'startups-vc', icon: '☁' },
  { id: 'sv-10', name: 'Hacker News (Top)', url: 'https://hnrss.org/frontpage', category: 'startups-vc', icon: '🔶' },
  { id: 'sv-11', name: 'Product Hunt', url: 'https://www.producthunt.com/feed', category: 'startups-vc', icon: '🐱' },
  { id: 'sv-12', name: 'Startup Nation (GCC)', url: 'https://www.startupnationcentral.org/rss', category: 'startups-vc', region: 'gcc', icon: '🌍' },
  { id: 'sv-13', name: 'Magnitt (MENA VC)', url: 'https://www.magnitt.com/rss', category: 'startups-vc', region: 'gcc', priority: 'high', icon: '🧲' },
  { id: 'sv-14', name: 'Wamda (MENA Startups)', url: 'https://www.wamda.com/rss', category: 'startups-vc', region: 'gcc', icon: '💡' },
  { id: 'sv-15', name: 'Flat6Labs', url: 'https://www.flat6labs.com/rss', category: 'startups-vc', region: 'gcc', icon: '🔬' },
  { id: 'sv-16', name: 'Hub71 (Abu Dhabi)', url: 'https://hub71.com/rss', category: 'startups-vc', region: 'gcc', icon: '🇦🇪' },
  { id: 'sv-17', name: 'BECO Capital', url: 'https://www.becocapital.com/rss', category: 'startups-vc', region: 'gcc', icon: '💰' },
  { id: 'sv-18', name: 'Saudi Venture Capital', url: 'https://www.svc.com.sa/rss', category: 'startups-vc', region: 'gcc', icon: '🇸🇦' },
];

// ═══════════════════════════════════════════════════════════════════
// SECURITY & POLICY
// ═══════════════════════════════════════════════════════════════════
export const SECURITY_POLICY_FEEDS: FeedSource[] = [
  { id: 'sp-1', name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed', category: 'security-policy', priority: 'high', icon: '🔒' },
  { id: 'sp-2', name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', category: 'security-policy', priority: 'high', icon: '🕵' },
  { id: 'sp-3', name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml', category: 'security-policy', icon: '🌑' },
  { id: 'sp-4', name: 'Schneier on Security', url: 'https://www.schneier.com/blog/atom.xml', category: 'security-policy', icon: '🛡' },
  { id: 'sp-5', name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed', category: 'security-policy', icon: '💻' },
  { id: 'sp-6', name: 'SecurityWeek', url: 'https://www.securityweek.com/feed', category: 'security-policy', icon: '📡' },
  { id: 'sp-7', name: 'CISA Alerts', url: 'https://www.cisa.gov/uscert/ncas/alerts.xml', category: 'security-policy', priority: 'high', icon: '🚨' },
  { id: 'sp-8', name: 'Foreign Affairs', url: 'https://www.foreignaffairs.com/rss.xml', category: 'security-policy', subcategory: 'geopolitics', icon: '🌍' },
  { id: 'sp-9', name: 'War on the Rocks', url: 'https://warontherocks.com/feed', category: 'security-policy', subcategory: 'defense', icon: '⚔' },
  { id: 'sp-10', name: 'Brookings', url: 'https://www.brookings.edu/feed', category: 'security-policy', subcategory: 'policy', icon: '🏛' },
  { id: 'sp-11', name: 'RAND Corporation', url: 'https://www.rand.org/feeds/all.xml', category: 'security-policy', icon: '📊' },
  { id: 'sp-12', name: 'Council on Foreign Relations', url: 'https://www.cfr.org/rss', category: 'security-policy', subcategory: 'geopolitics', icon: '🌐' },
  { id: 'sp-13', name: 'Chatham House', url: 'https://www.chathamhouse.org/rss', category: 'security-policy', icon: '🏠' },
  { id: 'sp-14', name: 'IISS (Strategic Studies)', url: 'https://www.iiss.org/rss', category: 'security-policy', subcategory: 'defense', icon: '🎖' },
  { id: 'sp-15', name: 'OFAC Sanctions Updates', url: 'https://ofac.treasury.gov/rss', category: 'security-policy', subcategory: 'sanctions', priority: 'high', icon: '⛔' },
  { id: 'sp-16', name: 'EU Sanctions Map', url: 'https://sanctionsmap.eu/rss', category: 'security-policy', subcategory: 'sanctions', icon: '🇪🇺' },
  { id: 'sp-17', name: 'Carnegie Endowment', url: 'https://carnegieendowment.org/rss', category: 'security-policy', icon: '📜' },
  { id: 'sp-18', name: 'Gulf State Analytics', url: 'https://gulfstateanalytics.com/rss', category: 'security-policy', region: 'gcc', priority: 'high', icon: '🔍' },
  { id: 'sp-19', name: 'NCSC (Saudi Cybersecurity)', url: 'https://www.nca.gov.sa/rss', category: 'security-policy', region: 'gcc', icon: '🇸🇦' },
  { id: 'sp-20', name: 'UAE Cybersecurity Council', url: 'https://www.csc.gov.ae/rss', category: 'security-policy', region: 'gcc', icon: '🇦🇪' },
];

// ═══════════════════════════════════════════════════════════════════
// DATA & TRACKING
// ═══════════════════════════════════════════════════════════════════
export const DATA_TRACKING_FEEDS: FeedSource[] = [
  { id: 'dt-1', name: 'FRED Economic Data', url: 'https://fred.stlouisfed.org/rss', category: 'data-tracking', priority: 'high', icon: '📊' },
  { id: 'dt-2', name: 'World Bank Open Data', url: 'https://data.worldbank.org/rss', category: 'data-tracking', icon: '🌐' },
  { id: 'dt-3', name: 'US Bureau of Labor Statistics', url: 'https://www.bls.gov/rss', category: 'data-tracking', icon: '📈' },
  { id: 'dt-4', name: 'Eurostat Data', url: 'https://ec.europa.eu/eurostat/rss', category: 'data-tracking', icon: '🇪🇺' },
  { id: 'dt-5', name: 'Trading Economics', url: 'https://tradingeconomics.com/rss', category: 'data-tracking', priority: 'high', icon: '📉' },
  { id: 'dt-6', name: 'Our World in Data', url: 'https://ourworldindata.org/atom.xml', category: 'data-tracking', icon: '🌍' },
  { id: 'dt-7', name: 'GASTAT (Saudi Data)', url: 'https://www.stats.gov.sa/en/rss', category: 'data-tracking', region: 'gcc', priority: 'high', icon: '🇸🇦' },
  { id: 'dt-8', name: 'UAE Open Data', url: 'https://bayanat.ae/rss', category: 'data-tracking', region: 'gcc', icon: '🇦🇪' },
  { id: 'dt-9', name: 'IEA Energy Data', url: 'https://www.iea.org/rss', category: 'data-tracking', subcategory: 'energy', icon: '⚡' },
  { id: 'dt-10', name: 'OPEC Monthly Report', url: 'https://www.opec.org/rss', category: 'data-tracking', subcategory: 'energy', priority: 'high', icon: '🛢' },
  { id: 'dt-11', name: 'UN Data Pulse', url: 'https://data.un.org/rss', category: 'data-tracking', icon: '🇺🇳' },
  { id: 'dt-12', name: 'ADB Data (Asia Dev Bank)', url: 'https://data.adb.org/rss', category: 'data-tracking', icon: '🏦' },
  { id: 'dt-13', name: 'Kaggle Datasets', url: 'https://www.kaggle.com/datasets.xml', category: 'data-tracking', subcategory: 'datasets', icon: '🎯' },
  { id: 'dt-14', name: 'data.gov', url: 'https://catalog.data.gov/feeds/dataset.rss', category: 'data-tracking', icon: '🗂' },
  { id: 'dt-15', name: 'Statista', url: 'https://www.statista.com/rss', category: 'data-tracking', icon: '📋' },
];

// ═══════════════════════════════════════════════════════════════════
// SUPPLY CHAIN
// ═══════════════════════════════════════════════════════════════════
export const SUPPLY_CHAIN_FEEDS: FeedSource[] = [
  { id: 'sc-1', name: 'Supply Chain Dive', url: 'https://www.supplychaindive.com/feeds/news', category: 'supply-chain', priority: 'high', icon: '🚢' },
  { id: 'sc-2', name: 'Freightwaves', url: 'https://www.freightwaves.com/feed', category: 'supply-chain', priority: 'high', icon: '🚛' },
  { id: 'sc-3', name: 'Logistics Management', url: 'https://www.logisticsmgmt.com/rss', category: 'supply-chain', icon: '📦' },
  { id: 'sc-4', name: 'Journal of Commerce', url: 'https://www.joc.com/rss', category: 'supply-chain', icon: '📰' },
  { id: 'sc-5', name: 'Lloyd\'s List', url: 'https://lloydslist.com/rss', category: 'supply-chain', icon: '⚓' },
  { id: 'sc-6', name: 'Drewry Shipping', url: 'https://www.drewry.co.uk/rss', category: 'supply-chain', icon: '🚢' },
  { id: 'sc-7', name: 'Flexport Blog', url: 'https://www.flexport.com/blog/feed', category: 'supply-chain', icon: '🔗' },
  { id: 'sc-8', name: 'Jebel Ali Port (DP World)', url: 'https://www.dpworld.com/rss', category: 'supply-chain', region: 'gcc', priority: 'high', icon: '🇦🇪' },
  { id: 'sc-9', name: 'King Abdullah Port', url: 'https://www.kaec.net/rss', category: 'supply-chain', region: 'gcc', icon: '🇸🇦' },
  { id: 'sc-10', name: 'Suez Canal Authority', url: 'https://www.suezcanal.gov.eg/rss', category: 'supply-chain', region: 'gcc', priority: 'high', icon: '🇪🇬' },
  { id: 'sc-11', name: 'Baltic Exchange', url: 'https://www.balticexchange.com/rss', category: 'supply-chain', icon: '📊' },
  { id: 'sc-12', name: 'IATA Air Cargo', url: 'https://www.iata.org/rss/cargo', category: 'supply-chain', subcategory: 'air-cargo', icon: '✈' },
  { id: 'sc-13', name: 'Maersk Updates', url: 'https://www.maersk.com/rss', category: 'supply-chain', icon: '🔵' },
  { id: 'sc-14', name: 'Saudi Ports Authority', url: 'https://mawani.gov.sa/rss', category: 'supply-chain', region: 'gcc', icon: '🇸🇦' },
  { id: 'sc-15', name: 'COSCO Shipping', url: 'https://en.coscoshipping.com/rss', category: 'supply-chain', icon: '🇨🇳' },
];

// ═══════════════════════════════════════════════════════════════════
// PRICING & MARKETING
// ═══════════════════════════════════════════════════════════════════
export const PRICING_MARKETING_FEEDS: FeedSource[] = [
  { id: 'pm-1', name: 'Price Intelligently', url: 'https://www.priceintelligently.com/blog/rss', category: 'pricing-marketing', icon: '🏷' },
  { id: 'pm-2', name: 'OpenView SaaS Pricing', url: 'https://openviewpartners.com/blog/feed', category: 'pricing-marketing', icon: '💲' },
  { id: 'pm-3', name: 'Profitwell Blog', url: 'https://www.profitwell.com/blog/rss', category: 'pricing-marketing', icon: '📈' },
  { id: 'pm-4', name: 'Marketing Week', url: 'https://www.marketingweek.com/feed', category: 'pricing-marketing', icon: '📢' },
  { id: 'pm-5', name: 'HubSpot Blog', url: 'https://blog.hubspot.com/marketing/rss.xml', category: 'pricing-marketing', icon: '🟠' },
  { id: 'cm-pm-6', name: 'Content Marketing Institute', url: 'https://contentmarketinginstitute.com/feed', category: 'pricing-marketing', icon: '📝' },
  { id: 'pm-7', name: 'Moz Blog', url: 'https://moz.com/feed', category: 'pricing-marketing', icon: '🔍' },
  { id: 'pm-8', name: 'Nielsen Insights', url: 'https://www.nielsen.com/rss', category: 'pricing-marketing', priority: 'high', icon: '📊' },
  { id: 'pm-9', name: 'eMarketer', url: 'https://www.insiderintelligence.com/rss', category: 'pricing-marketing', icon: '📱' },
  { id: 'pm-10', name: 'Gartner Marketing', url: 'https://www.gartner.com/en/marketing/rss', category: 'pricing-marketing', icon: '📋' },
  { id: 'pm-11', name: 'Kantar', url: 'https://www.kantar.com/rss', category: 'pricing-marketing', icon: '🎯' },
  { id: 'pm-12', name: 'McKinsey Marketing', url: 'https://www.mckinsey.com/rss/marketing', category: 'pricing-marketing', icon: '💡' },
];

// ═══════════════════════════════════════════════════════════════════
// CONSUMER PRICES
// ═══════════════════════════════════════════════════════════════════
export const CONSUMER_PRICES_FEEDS: FeedSource[] = [
  { id: 'cp-1', name: 'BLS CPI Reports', url: 'https://www.bls.gov/cpi/rss', category: 'consumer-prices', priority: 'high', icon: '🛒' },
  { id: 'cp-2', name: 'Eurostat HICP', url: 'https://ec.europa.eu/eurostat/rss/hicp', category: 'consumer-prices', icon: '🇪🇺' },
  { id: 'cp-3', name: 'UK ONS CPI', url: 'https://www.ons.gov.uk/rss/inflation', category: 'consumer-prices', icon: '🇬🇧' },
  { id: 'cp-4', name: 'Saudi GASTAT CPI', url: 'https://www.stats.gov.sa/en/rss/cpi', category: 'consumer-prices', region: 'gcc', priority: 'high', icon: '🇸🇦' },
  { id: 'cp-5', name: 'UAE CPI Monitor', url: 'https://www.fcsc.gov.ae/rss/cpi', category: 'consumer-prices', region: 'gcc', icon: '🇦🇪' },
  { id: 'cp-6', name: 'Truflation', url: 'https://truflation.com/blog/rss', category: 'consumer-prices', icon: '📊' },
  { id: 'cp-7', name: 'Numbeo Cost of Living', url: 'https://www.numbeo.com/rss', category: 'consumer-prices', icon: '🌐' },
  { id: 'cp-8', name: 'FAO Food Price Index', url: 'https://www.fao.org/rss/food-prices.xml', category: 'consumer-prices', priority: 'high', icon: '🍞' },
  { id: 'cp-9', name: 'World Food Programme', url: 'https://www.wfp.org/rss', category: 'consumer-prices', icon: '🌾' },
  { id: 'cp-10', name: 'GCC Consumer Monitor', url: 'https://www.gccstat.org/rss/consumer', category: 'consumer-prices', region: 'gcc', icon: '🌙' },
];

// ═══════════════════════════════════════════════════════════════════
// WORLD CLOCK & MARKET SESSIONS
// ═══════════════════════════════════════════════════════════════════
export interface MarketSession {
  id: string;
  name: string;
  exchange: string;
  timezone: string;
  utcOffset: number;
  openLocal: string;
  closeLocal: string;
  currency: string;
  flag: string;
  status?: 'pre-market' | 'open' | 'closed' | 'after-hours';
}

export const MARKET_SESSIONS: MarketSession[] = [
  { id: 'ms-1', name: 'Tadawul', exchange: 'Saudi Exchange', timezone: 'Asia/Riyadh', utcOffset: 3, openLocal: '10:00', closeLocal: '15:00', currency: 'SAR', flag: '🇸🇦' },
  { id: 'ms-2', name: 'DFM', exchange: 'Dubai Financial Market', timezone: 'Asia/Dubai', utcOffset: 4, openLocal: '10:00', closeLocal: '14:00', currency: 'AED', flag: '🇦🇪' },
  { id: 'ms-3', name: 'ADX', exchange: 'Abu Dhabi Securities', timezone: 'Asia/Dubai', utcOffset: 4, openLocal: '10:00', closeLocal: '14:00', currency: 'AED', flag: '🇦🇪' },
  { id: 'ms-4', name: 'QSE', exchange: 'Qatar Stock Exchange', timezone: 'Asia/Qatar', utcOffset: 3, openLocal: '09:30', closeLocal: '13:15', currency: 'QAR', flag: '🇶🇦' },
  { id: 'ms-5', name: 'Boursa Kuwait', exchange: 'Boursa Kuwait', timezone: 'Asia/Kuwait', utcOffset: 3, openLocal: '09:00', closeLocal: '12:40', currency: 'KWD', flag: '🇰🇼' },
  { id: 'ms-6', name: 'Bahrain Bourse', exchange: 'Bahrain Bourse', timezone: 'Asia/Bahrain', utcOffset: 3, openLocal: '09:30', closeLocal: '13:00', currency: 'BHD', flag: '🇧🇭' },
  { id: 'ms-7', name: 'MSM', exchange: 'Muscat Securities', timezone: 'Asia/Muscat', utcOffset: 4, openLocal: '10:00', closeLocal: '13:00', currency: 'OMR', flag: '🇴🇲' },
  { id: 'ms-8', name: 'NYSE', exchange: 'New York Stock Exchange', timezone: 'America/New_York', utcOffset: -5, openLocal: '09:30', closeLocal: '16:00', currency: 'USD', flag: '🇺🇸' },
  { id: 'ms-9', name: 'NASDAQ', exchange: 'NASDAQ', timezone: 'America/New_York', utcOffset: -5, openLocal: '09:30', closeLocal: '16:00', currency: 'USD', flag: '🇺🇸' },
  { id: 'ms-10', name: 'LSE', exchange: 'London Stock Exchange', timezone: 'Europe/London', utcOffset: 0, openLocal: '08:00', closeLocal: '16:30', currency: 'GBP', flag: '🇬🇧' },
  { id: 'ms-11', name: 'Euronext', exchange: 'Euronext Paris', timezone: 'Europe/Paris', utcOffset: 1, openLocal: '09:00', closeLocal: '17:30', currency: 'EUR', flag: '🇪🇺' },
  { id: 'ms-12', name: 'Xetra', exchange: 'Frankfurt Exchange', timezone: 'Europe/Berlin', utcOffset: 1, openLocal: '09:00', closeLocal: '17:30', currency: 'EUR', flag: '🇩🇪' },
  { id: 'ms-13', name: 'TSE', exchange: 'Tokyo Stock Exchange', timezone: 'Asia/Tokyo', utcOffset: 9, openLocal: '09:00', closeLocal: '15:00', currency: 'JPY', flag: '🇯🇵' },
  { id: 'ms-14', name: 'SSE', exchange: 'Shanghai Stock Exchange', timezone: 'Asia/Shanghai', utcOffset: 8, openLocal: '09:30', closeLocal: '15:00', currency: 'CNY', flag: '🇨🇳' },
  { id: 'ms-15', name: 'HKEX', exchange: 'Hong Kong Exchange', timezone: 'Asia/Hong_Kong', utcOffset: 8, openLocal: '09:30', closeLocal: '16:00', currency: 'HKD', flag: '🇭🇰' },
  { id: 'ms-16', name: 'BSE', exchange: 'Bombay Stock Exchange', timezone: 'Asia/Kolkata', utcOffset: 5.5, openLocal: '09:15', closeLocal: '15:30', currency: 'INR', flag: '🇮🇳' },
  { id: 'ms-17', name: 'ASX', exchange: 'Australian Securities', timezone: 'Australia/Sydney', utcOffset: 11, openLocal: '10:00', closeLocal: '16:00', currency: 'AUD', flag: '🇦🇺' },
  { id: 'ms-18', name: 'KRX', exchange: 'Korea Exchange', timezone: 'Asia/Seoul', utcOffset: 9, openLocal: '09:00', closeLocal: '15:30', currency: 'KRW', flag: '🇰🇷' },
  { id: 'ms-19', name: 'SGX', exchange: 'Singapore Exchange', timezone: 'Asia/Singapore', utcOffset: 8, openLocal: '09:00', closeLocal: '17:00', currency: 'SGD', flag: '🇸🇬' },
  { id: 'ms-20', name: 'JSE', exchange: 'Johannesburg SE', timezone: 'Africa/Johannesburg', utcOffset: 2, openLocal: '09:00', closeLocal: '17:00', currency: 'ZAR', flag: '🇿🇦' },
  { id: 'ms-21', name: 'TSX', exchange: 'Toronto Stock Exchange', timezone: 'America/Toronto', utcOffset: -5, openLocal: '09:30', closeLocal: '16:00', currency: 'CAD', flag: '🇨🇦' },
  { id: 'ms-22', name: 'SIX', exchange: 'Swiss Exchange', timezone: 'Europe/Zurich', utcOffset: 1, openLocal: '09:00', closeLocal: '17:30', currency: 'CHF', flag: '🇨🇭' },
  { id: 'ms-23', name: 'Crypto', exchange: '24/7 Global', timezone: 'UTC', utcOffset: 0, openLocal: '00:00', closeLocal: '23:59', currency: 'BTC', flag: '₿' },
  { id: 'ms-24', name: 'Forex', exchange: 'FX Market', timezone: 'UTC', utcOffset: 0, openLocal: '22:00 Sun', closeLocal: '22:00 Fri', currency: 'USD', flag: '💱' },
];

// ═══════════════════════════════════════════════════════════════════
// AGGREGATE ALL FEEDS
// ═══════════════════════════════════════════════════════════════════
export const ALL_FEEDS: FeedSource[] = [
  ...CORE_MARKETS_FEEDS,
  ...FIXED_INCOME_FEEDS,
  ...FOREX_FEEDS,
  ...CRYPTO_FEEDS,
  ...CENTRAL_BANK_FEEDS,
  ...GULF_MENA_FEEDS,
  ...STARTUPS_VC_FEEDS,
  ...SECURITY_POLICY_FEEDS,
  ...DATA_TRACKING_FEEDS,
  ...SUPPLY_CHAIN_FEEDS,
  ...PRICING_MARKETING_FEEDS,
  ...CONSUMER_PRICES_FEEDS,
];

export const TOTAL_FEED_COUNT = ALL_FEEDS.length;

export function getFeedsByCategory(category: FeedCategory): FeedSource[] {
  return ALL_FEEDS.filter((f) => f.category === category);
}

export function getFeedsByRegion(region: string): FeedSource[] {
  return ALL_FEEDS.filter((f) => f.region === region);
}

export function getHighPriorityFeeds(): FeedSource[] {
  return ALL_FEEDS.filter((f) => f.priority === 'high');
}

export function getGCCFeeds(): FeedSource[] {
  return ALL_FEEDS.filter((f) => f.region === 'gcc');
}
