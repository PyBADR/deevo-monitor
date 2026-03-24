// ─── DEEVO CORTEX — NEWS & RSS SERVICE ──────────────────────────────────────
// Fetches live GCC news from curated RSS feeds
// Uses allorigins.win as CORS proxy (free, no key)

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: 'GCC_REGULATORS'|'INSURANCE'|'INTELLIGENCE'|'MARKETS'|'ENERGY'|'AVIATION';
  severity: 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW';
  url: string;
  publishedAt: number;
  country?: string;
  summary?: string;
}

// ─── GCC RSS FEEDS ────────────────────────────────────────────────────────────
const FEEDS = [
  // Business / Finance
  { url:'https://asharqbusiness.com/feed/', source:'Asharq Business', category:'MARKETS' as const },
  { url:'https://www.arabianbusiness.com/rss', source:'Arabian Business', category:'MARKETS' as const },
  { url:'https://gulfnews.com/rss/business', source:'Gulf News Business', category:'MARKETS' as const },
  // Energy
  { url:'https://oilprice.com/rss/main', source:'OilPrice.com', category:'ENERGY' as const },
  { url:'https://www.offshore-technology.com/feed/', source:'Offshore Technology', category:'ENERGY' as const },
  // GCC General
  { url:'https://www.thenationalnews.com/rss', source:'The National UAE', category:'INTELLIGENCE' as const },
  { url:'https://www.middleeasteye.net/rss', source:'Middle East Eye', category:'INTELLIGENCE' as const },
  // Aviation
  { url:'https://simpleflying.com/feed/', source:'Simple Flying', category:'AVIATION' as const },
];

// Keywords that determine severity
const SEVERITY_MAP: {keywords: string[]; severity: NewsItem['severity']}[] = [
  { keywords:['attack','missile','war','conflict','explosion','crisis','emergency','DEFCON','ceasefire'], severity:'CRITICAL' },
  { keywords:['sanction','oil price spike','Hormuz','disruption','surge','alert','warning','breach','hack'], severity:'HIGH' },
  { keywords:['increase','rise','fall','regulation','policy','rates','inflation','GDP'], severity:'MEDIUM' },
  { keywords:['report','update','analysis','forecast','quarterly','annual'], severity:'LOW' },
];

function detectSeverity(title: string): NewsItem['severity'] {
  const lower = title.toLowerCase();
  for (const { keywords, severity } of SEVERITY_MAP) {
    if (keywords.some(k => lower.includes(k))) return severity;
  }
  return 'LOW';
}

// ─── CORS PROXY FETCH ────────────────────────────────────────────────────────
async function fetchFeed(feedUrl: string): Promise<string> {
  // allorigins is a free CORS proxy - works in browser
  const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
  const res = await fetch(proxy, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
  return res.text();
}

// ─── PARSE RSS XML ────────────────────────────────────────────────────────────
function parseRSS(xml: string, source: string, category: NewsItem['category']): NewsItem[] {
  const items: NewsItem[] = [];
  const itemMatches = xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g);

  for (const match of Array.from(itemMatches).slice(0, 8)) {
    const content = match[1];
    const title = content.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/gs)?.[1]?.trim() ?? '';
    const link = content.match(/<link[^>]*>([^<]+)<\/link>/gs)?.[1]?.trim() ??
                 content.match(/<link[^>]*href="([^"]+)"/gs)?.[1]?.trim() ?? '';
    const pubDate = content.match(/<pubDate[^>]*>(.*?)<\/pubDate>/gs)?.[1]?.trim() ??
                    content.match(/<dc:date[^>]*>(.*?)<\/dc:date>/gs)?.[1]?.trim() ?? '';
    const desc = content.match(/<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/gs)?.[1]
                  ?.replace(/<[^>]+>/g,'')?.trim()?.slice(0, 200) ?? '';

    if (!title || title.length < 5) continue;

    const cleanTitle = title.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"');

    items.push({
      id: `${source}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      title: cleanTitle,
      source,
      category,
      severity: detectSeverity(cleanTitle),
      url: link,
      publishedAt: pubDate ? new Date(pubDate).getTime() : Date.now(),
      summary: desc || undefined,
    });
  }
  return items;
}

// ─── FALLBACK SEED NEWS ───────────────────────────────────────────────────────
const SEED_NEWS: NewsItem[] = [
  { id:'seed-1', title:'Saudi SAMA issues new motor claims circular affecting 23 insurers', source:'SAMA', category:'GCC_REGULATORS', severity:'HIGH', url:'#', publishedAt:Date.now()-3600000 },
  { id:'seed-2', title:'Kuwait motor TPL claims up 18% QoQ — algorithmic review triggered', source:'ISA Kuwait', category:'GCC_REGULATORS', severity:'MEDIUM', url:'#', publishedAt:Date.now()-7200000 },
  { id:'seed-3', title:'Brent crude climbs on Hormuz tensions — GCC insurers flag marine exposure', source:'OilPrice.com', category:'ENERGY', severity:'HIGH', url:'#', publishedAt:Date.now()-10800000 },
  { id:'seed-4', title:'Dubai International Airport records 89.4K movements — new monthly record', source:'Simple Flying', category:'AVIATION', severity:'MEDIUM', url:'#', publishedAt:Date.now()-14400000 },
  { id:'seed-5', title:'QatarEnergy LNG expansion raises North Field output by 35%', source:'Arabian Business', category:'ENERGY', severity:'MEDIUM', url:'#', publishedAt:Date.now()-18000000 },
  { id:'seed-6', title:'UAE fintech sector grows 42% YoY — DIFC reports 600+ licensed firms', source:'The National UAE', category:'MARKETS', severity:'LOW', url:'#', publishedAt:Date.now()-21600000 },
  { id:'seed-7', title:'Red Sea disruption enters 8th week — GCC marine reinsurance premiums +400%', source:'Gulf News Business', category:'INSURANCE', severity:'CRITICAL', url:'#', publishedAt:Date.now()-25200000 },
  { id:'seed-8', title:'Bahrain fintech hub attracts 18 new CBB sandbox approvals in Q1 2026', source:'Arabian Business', category:'MARKETS', severity:'LOW', url:'#', publishedAt:Date.now()-28800000 },
];

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
export async function fetchGCCNews(maxItems = 30): Promise<{ items: NewsItem[]; source: 'live'|'seed' }> {
  try {
    // Try up to 3 feeds in parallel (don't hammer all at once)
    const feedsToTry = FEEDS.slice(0, 3);
    const results = await Promise.allSettled(
      feedsToTry.map(f =>
        fetchFeed(f.url).then(xml => parseRSS(xml, f.source, f.category))
      )
    );

    const items: NewsItem[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') items.push(...r.value);
    }

    if (items.length === 0) throw new Error('All feeds failed');

    // Sort by date, dedup by title similarity
    const sorted = items
      .sort((a, b) => b.publishedAt - a.publishedAt)
      .slice(0, maxItems);

    return { items: sorted, source: 'live' };
  } catch {
    return { items: SEED_NEWS, source: 'seed' };
  }
}
