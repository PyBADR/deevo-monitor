/**
 * useRSSFeeds — Fetches live RSS news from /api/feeds/rss endpoint.
 * Polls every 60 seconds. Falls back to direct RSS fetch via public CORS proxies.
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

const ALL_SOURCE_IDS = 'bloomberg,skynews,euronews,dw,cnbc,cnn,france24,alarabiya,aljazeera,reuters,bbc,ft';
const POLL_INTERVAL = 60_000; // 60 seconds

// Public CORS proxy fallback for local dev / when Vercel API is unavailable
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

// RSS feed URLs for client-side fallback
const CLIENT_RSS_FEEDS: Record<string, { url: string; name: string }> = {
  bbc: { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World' },
  aljazeera: { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera' },
  cnn: { url: 'http://rss.cnn.com/rss/edition_world.rss', name: 'CNN' },
  dw: { url: 'https://rss.dw.com/rdf/rss-en-all', name: 'Deutsche Welle' },
  france24: { url: 'https://www.france24.com/en/rss', name: 'France 24' },
  cnbc: { url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html', name: 'CNBC' },
  euronews: { url: 'https://www.euronews.com/rss?format=mrss&level=theme&name=news', name: 'Euronews' },
  bloomberg: { url: 'https://feeds.bloomberg.com/markets/news.rss', name: 'Bloomberg' },
  skynews: { url: 'https://feeds.skynews.com/feeds/rss/world.xml', name: 'Sky News' },
  alarabiya: { url: 'https://english.alarabiya.net/rss.xml', name: 'Al Arabiya' },
  reuters: { url: 'https://feeds.reuters.com/reuters/worldNews', name: 'Reuters' },
  ft: { url: 'https://www.ft.com/rss/home', name: 'Financial Times' },
};

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

    if (title) {
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

async function fetchViaProxy(feedUrl: string): Promise<string | null> {
  for (const proxy of CORS_PROXIES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${proxy}${encodeURIComponent(feedUrl)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) return await res.text();
    } catch {
      // Try next proxy
    }
  }
  return null;
}

async function fetchClientSideFeeds(sourceIds: string[]): Promise<RSSNewsItem[]> {
  const results: RSSNewsItem[] = [];

  await Promise.allSettled(
    sourceIds.map(async (id) => {
      const feed = CLIENT_RSS_FEEDS[id];
      if (!feed) return;
      const xml = await fetchViaProxy(feed.url);
      if (xml) {
        const items = parseRSSXML(xml, id, feed.name);
        results.push(...items.slice(0, 8));
      }
    })
  );

  results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return results;
}

export function useRSSFeeds() {
  const [items, setItems] = useState<RSSNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchFeeds = useCallback(async () => {
    try {
      // Try Vercel API first
      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${API_BASE}/feeds/rss?sources=${ALL_SOURCE_IDS}&limit=50`);

      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setItems(data.items);
          setError(null);
          setLastUpdated(new Date());
          setLoading(false);
          return;
        }
      }
    } catch {
      // API unavailable, fall through to client-side
    }

    // Fallback: client-side RSS via CORS proxy
    try {
      const clientItems = await fetchClientSideFeeds([
        'bbc', 'aljazeera', 'dw', 'france24', 'cnbc', 'cnn',
      ]);
      if (clientItems.length > 0) {
        setItems(clientItems);
        setError(null);
        setLastUpdated(new Date());
      } else {
        setError('No feeds available');
      }
    } catch {
      setError('Failed to fetch feeds');
    }
    setLoading(false);
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
