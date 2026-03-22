/**
 * useRSSFeeds — Fetches live RSS news via multiple strategies:
 *   1. Express server (/api/feed) when running with dev:full
 *   2. rss2json.com API (reliable, pre-parsed JSON, no CORS issues)
 *   3. Direct CORS proxy fallback (allorigins.win)
 *
 * Polls every 90 seconds. All sources verified working as of 2025-12.
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

const POLL_INTERVAL = 90_000; // 90 seconds

// ── Verified RSS Feed URLs (tested 2025-12) ──────────────
// Only feeds that reliably serve XML and aren't paywalled
const VERIFIED_FEEDS: Record<string, { url: string; name: string }> = {
  bbc:        { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World' },
  aljazeera:  { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera' },
  dw:         { url: 'https://rss.dw.com/rdf/rss-en-all', name: 'Deutsche Welle' },
  france24:   { url: 'https://www.france24.com/en/rss', name: 'France 24' },
  cnbc:       { url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html', name: 'CNBC' },
  cnn:        { url: 'http://rss.cnn.com/rss/edition_world.rss', name: 'CNN' },
  skynews:    { url: 'https://feeds.skynews.com/feeds/rss/world.xml', name: 'Sky News' },
  alarabiya:  { url: 'https://english.alarabiya.net/rss.xml', name: 'Al Arabiya' },
  euronews:   { url: 'https://www.euronews.com/rss', name: 'Euronews' },
  arabnews:   { url: 'https://www.arabnews.com/rss.xml', name: 'Arab News' },
  reuters:    { url: 'https://www.reutersagency.com/feed/', name: 'Reuters' },
};

// ── Strategy 1: Express server (dev:full mode) ──────────
async function fetchFromExpressServer(): Promise<RSSNewsItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('http://localhost:3001/api/feed?limit=50', {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return [];

    const data = await res.json() as {
      data?: Array<{
        id: string;
        title: string;
        summary: string;
        source: string;
        sourceUrl?: string;
        timestamp: string;
        category: string;
      }>;
    };

    if (!data.data || data.data.length === 0) return [];

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
    return [];
  }
}

// ── Strategy 2: rss2json.com API (free, reliable, pre-parsed) ──
async function fetchViaRss2Json(feedUrl: string): Promise<Array<{
  title: string;
  link: string;
  description: string;
  pubDate: string;
}>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return [];
    const data = await res.json() as {
      status?: string;
      items?: Array<{
        title: string;
        link: string;
        description: string;
        pubDate: string;
      }>;
    };
    if (data.status !== 'ok' || !data.items) return [];
    return data.items;
  } catch {
    return [];
  }
}

// ── Strategy 3: CORS proxy + manual XML parse ────────────
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

function extractText(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tag}>`, 's');
  const match = xml.match(regex);
  return match ? (match[1] ?? '').trim().replace(/<[^>]+>/g, '').trim() : '';
}

function parseRSSXML(xml: string, sourceId: string, sourceName: string): RSSNewsItem[] {
  const items: RSSNewsItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1] ?? '';
    const title = extractText(block, 'title');
    const link = extractText(block, 'link') || extractText(block, 'guid');
    const description = extractText(block, 'description');
    const pubDate = extractText(block, 'pubDate');

    if (title && title.length > 5) {
      items.push({
        id: `${sourceId}-${items.length}-${Date.now()}`,
        title,
        link,
        summary: description.slice(0, 200),
        source: sourceName,
        sourceId,
        timestamp: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        category: 'news',
      });
    }
  }
  return items;
}

async function fetchViaCorsProxy(feedUrl: string): Promise<string | null> {
  for (const proxy of CORS_PROXIES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${proxy}${encodeURIComponent(feedUrl)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const text = await res.text();
        // Verify it looks like RSS/XML
        if (text.includes('<item') || text.includes('<entry')) return text;
      }
    } catch {
      // Try next proxy
    }
  }
  return null;
}

// ── Primary feed sources for client-side fetch (order = priority) ──
const PRIMARY_SOURCES = ['bbc', 'aljazeera', 'dw', 'france24', 'cnn', 'cnbc', 'skynews', 'alarabiya'] as const;

async function fetchClientSideFeeds(): Promise<RSSNewsItem[]> {
  const results: RSSNewsItem[] = [];
  const fetchedSources = new Set<string>();

  // Phase 1: Try rss2json API (most reliable for browser)
  await Promise.allSettled(
    PRIMARY_SOURCES.map(async (id) => {
      const feed = VERIFIED_FEEDS[id];
      if (!feed) return;
      try {
        const jsonItems = await fetchViaRss2Json(feed.url);
        if (jsonItems.length > 0) {
          fetchedSources.add(id);
          for (const item of jsonItems.slice(0, 8)) {
            results.push({
              id: `${id}-${results.length}-${Date.now()}`,
              title: item.title,
              link: item.link,
              summary: (item.description || '').replace(/<[^>]+>/g, '').slice(0, 200),
              source: feed.name,
              sourceId: id,
              timestamp: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
              category: 'news',
            });
          }
        }
      } catch {
        // Will try CORS proxy fallback
      }
    })
  );

  // Phase 2: CORS proxy fallback for sources that failed rss2json
  const failedSources = PRIMARY_SOURCES.filter((id) => !fetchedSources.has(id));
  if (failedSources.length > 0) {
    await Promise.allSettled(
      failedSources.map(async (id) => {
        const feed = VERIFIED_FEEDS[id];
        if (!feed) return;
        const xml = await fetchViaCorsProxy(feed.url);
        if (xml) {
          const parsed = parseRSSXML(xml, id, feed.name);
          results.push(...parsed.slice(0, 6));
        }
      })
    );
  }

  results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return results;
}

// ── Vercel serverless API (production) ───────────────────
async function fetchFromVercelAPI(): Promise<RSSNewsItem[]> {
  try {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    if (!API_BASE) return [];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_BASE}/api/feeds/rss?sources=bbc,aljazeera,cnn,dw,france24,cnbc&limit=50`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return [];
    const data = await res.json() as { items?: RSSNewsItem[] };
    return data.items && data.items.length > 0 ? data.items : [];
  } catch {
    return [];
  }
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
      // Strategy 1: Try Express server first (dev:full mode)
      const serverItems = await fetchFromExpressServer();
      if (serverItems.length > 0) {
        setItems(serverItems);
        setError(null);
        setLastUpdated(new Date());
        setLoading(false);
        fetchingRef.current = false;
        return;
      }

      // Strategy 2: Try Vercel API (production deployment)
      const vercelItems = await fetchFromVercelAPI();
      if (vercelItems.length > 0) {
        setItems(vercelItems);
        setError(null);
        setLastUpdated(new Date());
        setLoading(false);
        fetchingRef.current = false;
        return;
      }

      // Strategy 3: Client-side RSS fetch (rss2json + CORS proxy fallback)
      const clientItems = await fetchClientSideFeeds();
      if (clientItems.length > 0) {
        setItems(clientItems);
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
