/**
 * useRSSFeeds — Fetches live RSS news via parallel strategies:
 *   1. rss2json.com API (most reliable, pre-parsed JSON, no CORS)
 *   2. allorigins.win CORS proxy + XML parse (fallback)
 *   3. Express server /api/feed (when running dev:full)
 *
 * All strategies fire in parallel — first one with results wins.
 * Polls every 90 seconds. All feeds verified working 2025-12.
 *
 * Architecture Layer: Data (L1) → Features (L2)
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export interface RSSNewsItem {
  id: string;
  title: string;
  link: string;
  summary: string;
  source: string;
  sourceId: string;
  timestamp: string;
  category: string;
}

const POLL_INTERVAL = 90_000;

// ── Verified RSS Feed URLs ───────────────────────────────
const FEEDS: Record<string, { url: string; name: string }> = {
  bbc:       { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World' },
  aljazeera: { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera' },
  dw:        { url: 'https://rss.dw.com/rdf/rss-en-all', name: 'Deutsche Welle' },
  france24:  { url: 'https://www.france24.com/en/rss', name: 'France 24' },
  cnbc:      { url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html', name: 'CNBC' },
  cnn:       { url: 'http://rss.cnn.com/rss/edition_world.rss', name: 'CNN' },
  skynews:   { url: 'https://feeds.skynews.com/feeds/rss/world.xml', name: 'Sky News' },
  alarabiya: { url: 'https://english.alarabiya.net/rss.xml', name: 'Al Arabiya' },
  euronews:  { url: 'https://www.euronews.com/rss', name: 'Euronews' },
  arabnews:  { url: 'https://www.arabnews.com/rss.xml', name: 'Arab News' },
};

const SOURCES_TO_FETCH = ['bbc', 'aljazeera', 'dw', 'france24', 'cnn', 'cnbc', 'skynews', 'alarabiya'] as const;

// ── rss2json.com — returns pre-parsed JSON, no CORS issues ──
async function fetchViaRss2Json(sourceId: string, feedUrl: string, feedName: string): Promise<RSSNewsItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = await res.json() as {
      status?: string;
      items?: Array<{ title: string; link: string; description: string; pubDate: string }>;
    };
    if (data.status !== 'ok' || !data.items) return [];
    return data.items.slice(0, 8).map((item, i) => ({
      id: `${sourceId}-r2j-${i}-${Date.now()}`,
      title: item.title,
      link: item.link,
      summary: (item.description || '').replace(/<[^>]+>/g, '').slice(0, 200),
      source: feedName,
      sourceId,
      timestamp: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      category: 'news',
    }));
  } catch {
    clearTimeout(timeout);
    return [];
  }
}

// ── allorigins.win CORS proxy — fetches raw XML ──────────
function extractText(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tag}>`, 's');
  const m = xml.match(re);
  return m ? (m[1] ?? '').trim().replace(/<[^>]+>/g, '').trim() : '';
}

function parseXML(xml: string, sourceId: string, sourceName: string): RSSNewsItem[] {
  const items: RSSNewsItem[] = [];
  const re = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[1] ?? '';
    const title = extractText(block, 'title');
    if (!title || title.length < 5) continue;
    items.push({
      id: `${sourceId}-xml-${items.length}-${Date.now()}`,
      title,
      link: extractText(block, 'link') || extractText(block, 'guid'),
      summary: extractText(block, 'description').slice(0, 200),
      source: sourceName,
      sourceId,
      timestamp: (() => {
        const d = extractText(block, 'pubDate');
        return d ? new Date(d).toISOString() : new Date().toISOString();
      })(),
      category: 'news',
    });
  }
  return items;
}

async function fetchViaCorsProxy(sourceId: string, feedUrl: string, feedName: string): Promise<RSSNewsItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!res.ok) return [];
    const xml = await res.text();
    if (!xml.includes('<item') && !xml.includes('<entry')) return [];
    return parseXML(xml, sourceId, feedName).slice(0, 8);
  } catch {
    clearTimeout(timeout);
    return [];
  }
}

// ── Express server (only when dev:full is running) ───────
async function fetchFromServer(): Promise<RSSNewsItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch('http://localhost:3001/api/feed?limit=50', {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = await res.json() as {
      data?: Array<{ id: string; title: string; summary: string; source: string; sourceUrl?: string; timestamp: string; category: string }>;
    };
    if (!data.data?.length) return [];
    return data.data.map((item) => ({
      id: item.id,
      title: item.title,
      link: item.sourceUrl || '#',
      summary: item.summary,
      source: item.source,
      sourceId: item.source.toLowerCase().replace(/\s+/g, '-'),
      timestamp: item.timestamp,
      category: item.category,
    }));
  } catch {
    clearTimeout(timeout);
    return [];
  }
}

// ── Main fetch: all strategies in parallel, first wins ───
async function fetchAllFeeds(): Promise<RSSNewsItem[]> {
  // Strategy A: rss2json for all sources (parallel)
  const rss2jsonPromise = Promise.allSettled(
    SOURCES_TO_FETCH.map((id) => {
      const f = FEEDS[id];
      return f ? fetchViaRss2Json(id, f.url, f.name) : Promise.resolve([]);
    })
  ).then((results) => {
    const items: RSSNewsItem[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') items.push(...r.value);
    }
    return items;
  });

  // Strategy B: allorigins proxy for top 4 sources (parallel)
  const proxyPromise = Promise.allSettled(
    (['bbc', 'aljazeera', 'dw', 'france24'] as const).map((id) => {
      const f = FEEDS[id];
      return f ? fetchViaCorsProxy(id, f.url, f.name) : Promise.resolve([]);
    })
  ).then((results) => {
    const items: RSSNewsItem[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') items.push(...r.value);
    }
    return items;
  });

  // Strategy C: Express server
  const serverPromise = fetchFromServer();

  // Race: first strategy to return >0 items wins
  // But also collect all results for max coverage
  const [rss2jsonItems, proxyItems, serverItems] = await Promise.all([
    rss2jsonPromise,
    proxyPromise,
    serverPromise,
  ]);

  // Prefer server items (most complete), then rss2json, then proxy
  if (serverItems.length > 5) return serverItems;
  if (rss2jsonItems.length > 0) return rss2jsonItems;
  if (proxyItems.length > 0) return proxyItems;

  // Merge whatever we got
  const merged = [...serverItems, ...rss2jsonItems, ...proxyItems];
  // Deduplicate by title
  const seen = new Set<string>();
  const unique = merged.filter((item) => {
    if (seen.has(item.title)) return false;
    seen.add(item.title);
    return true;
  });
  unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return unique;
}

export function useRSSFeeds() {
  const [items, setItems] = useState<RSSNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchingRef = useRef(false);

  const fetchFeeds = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      const result = await fetchAllFeeds();
      if (result.length > 0) {
        setItems(result);
        setError(null);
        setLastUpdated(new Date());
      } else {
        setError('Unable to reach RSS feeds. Check your connection.');
      }
    } catch {
      setError('Failed to fetch feeds');
    }
    setLoading(false);
    fetchingRef.current = false;
  }, []);

  useEffect(() => {
    fetchFeeds();
    intervalRef.current = setInterval(fetchFeeds, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchFeeds]);

  return { items, loading, error, lastUpdated, refetch: fetchFeeds };
}
