import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * DEEVO Intelligence Monitor — RSS CORS Proxy
 * Contract C9 / Task 9A
 * Layer: API (L5) — Generic RSS proxy with domain whitelist
 *
 * GET /api/rss-proxy?url=https://feeds.bbci.co.uk/news/world/rss.xml
 *
 * Architecture Decision:
 *   Own proxy vs allorigins.win — eliminates third-party dependency,
 *   enforces domain whitelist for security, adds caching headers.
 *
 * Risk: Feed downtime — mitigated by 60s stale-while-revalidate.
 *       Abuse — mitigated by domain whitelist + rate limiting via Vercel.
 */

// ── Domain Whitelist ─────────────────────────────────────
// Only these domains are allowed through the proxy.
// Add new feed domains here as needed.
const ALLOWED_DOMAINS: string[] = [
  'feeds.bbci.co.uk',
  'www.aljazeera.com',
  'rss.dw.com',
  'www.france24.com',
  'www.cnbc.com',
  'rss.cnn.com',
  'feeds.skynews.com',
  'english.alarabiya.net',
  'www.euronews.com',
  'www.arabnews.com',
  'www.reuters.com',
  'feeds.feedburner.com',
  'news.google.com',
  'www.ft.com',
  'www.bloomberg.com',
  'www.middleeasteye.net',
  'www.thenationalnews.com',
  'gulfnews.com',
  'www.khaleejtimes.com',
  'saudigazette.com.sa',
  'www.spa.gov.sa',
  'www.wam.ae',
  'www.kuna.net.kw',
  'www.omanobserver.om',
  'www.gulf-times.com',
  'www.bna.bh',
];

function isDomainAllowed(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const feedUrl = req.query.url as string;

  if (!feedUrl) {
    return res.status(400).json({
      error: 'Missing required parameter: url',
      usage: 'GET /api/rss-proxy?url=<RSS_FEED_URL>',
    });
  }

  if (!isDomainAllowed(feedUrl)) {
    return res.status(403).json({
      error: 'Domain not in whitelist',
      domain: new URL(feedUrl).hostname,
      hint: 'Add domain to ALLOWED_DOMAINS in api/rss-proxy.ts',
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'DeevoMonitor/6.0 RSS Proxy',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Upstream returned ${response.status}`,
        url: feedUrl,
      });
    }

    const contentType = response.headers.get('content-type') ?? 'text/xml';
    const body = await response.text();

    // Cache: 60s fresh, serve stale up to 5min while revalidating
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Proxy-Source', feedUrl);
    res.setHeader('X-Powered-By', 'DEEVO Analytics v6.0');

    return res.status(200).send(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(502).json({
      error: 'Failed to fetch upstream feed',
      detail: message,
      url: feedUrl,
    });
  }
}
