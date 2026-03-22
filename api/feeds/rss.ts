import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * RSS Feed Proxy — Server-side RSS fetch and parse for Vercel deployment.
 * Solves CORS by proxying RSS XML → JSON on Vercel edge.
 *
 * GET /api/feeds/rss?sources=bbc,aljazeera,cnn&limit=30
 *
 * Architecture Layer: API (L5)
 */

interface RSSItem {
  id: string;
  title: string;
  link: string;
  summary: string;
  source: string;
  sourceId: string;
  timestamp: string;
  category: string;
}

// Verified working feeds (tested 2025-12)
const RSS_FEEDS: Record<string, { url: string; name: string }> = {
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

function extractText(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tag}>`, 's');
  const match = xml.match(regex);
  return match ? match[1]!.trim().replace(/<[^>]+>/g, '').trim() : '';
}

function parseRSSItems(xml: string, sourceId: string, sourceName: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]!;
    const title = extractText(block, 'title');
    const link = extractText(block, 'link') || extractText(block, 'guid');
    const description = extractText(block, 'description');
    const pubDate = extractText(block, 'pubDate');

    if (title && title.length > 5) {
      items.push({
        id: `${sourceId}-${Date.now()}-${items.length}`,
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const sourcesParam = (req.query.sources as string) || 'bbc,aljazeera,cnn,dw,france24';
  const limit = parseInt(req.query.limit as string) || 30;
  const sourceIds = sourcesParam.split(',').filter((s) => RSS_FEEDS[s]);

  const results: RSSItem[] = [];

  await Promise.allSettled(
    sourceIds.map(async (id) => {
      const feed = RSS_FEEDS[id]!;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(feed.url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'DeevoMonitor/5.1 RSS Reader' },
        });
        clearTimeout(timeout);

        if (!response.ok) return;
        const xml = await response.text();
        const items = parseRSSItems(xml, id, feed.name);
        results.push(...items.slice(0, 10));
      } catch {
        // Silently skip failed feeds
      }
    })
  );

  results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return res.status(200).json({
    items: results.slice(0, limit),
    total: results.length,
    sources: sourceIds.length,
    generatedAt: new Date().toISOString(),
  });
}
