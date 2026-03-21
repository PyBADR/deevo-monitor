/**
 * Deevo Monitor — API Server
 * Live RSS aggregation, Ollama proxy, data layer serving, and Cortex bridge
 * Port: 3001
 */

import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const PORT = parseInt(process.env.PORT || '3001');
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const CORTEX_URL = process.env.CORTEX_URL || 'http://localhost:8010';
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '300'); // 5 min default

// ─── 3-Tier Cache ────────────────────────────────────────────
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

const memoryCache = new Map<string, CacheEntry>();

function getCached(key: string): any | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl * 1000) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any, ttl = CACHE_TTL): void {
  memoryCache.set(key, { data, timestamp: Date.now(), ttl });
}

// ─── RSS Feed Fetcher ────────────────────────────────────────
const GCC_FEEDS = [
  { id: 'reuters-me', name: 'Reuters ME', url: 'https://www.reuters.com/rss/middleeast', tier: 1 },
  { id: 'alarabiya', name: 'Al Arabiya', url: 'https://english.alarabiya.net/tools/rss', tier: 2 },
  { id: 'aljazeera', name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', tier: 2 },
  { id: 'gulf-news', name: 'Gulf News', url: 'https://gulfnews.com/rss', tier: 2 },
  { id: 'arab-news', name: 'Arab News', url: 'https://www.arabnews.com/rss.xml', tier: 2 },
  { id: 'artemis', name: 'Artemis', url: 'https://www.artemis.bm/feed/', tier: 2 },
  { id: 'gdacs', name: 'GDACS', url: 'https://www.gdacs.org/xml/rss.xml', tier: 2 },
];

async function fetchFeed(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 10000, headers: { 'User-Agent': 'DeevoMonitor/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function parseRSSItems(xml: string, source: string): any[] {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const title = content.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || content.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const link = content.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const pubDate = content.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    const description = content.match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/)?.[1] || '';
    if (title) {
      items.push({ title: title.trim(), link, pubDate, description: description.substring(0, 200), source });
    }
  }
  return items;
}

async function aggregateFeeds(): Promise<any[]> {
  const cached = getCached('rss:all');
  if (cached) return cached;

  const results = await Promise.allSettled(
    GCC_FEEDS.map(async (feed) => {
      try {
        const xml = await fetchFeed(feed.url);
        return parseRSSItems(xml, feed.name).slice(0, 10);
      } catch {
        return [];
      }
    })
  );

  const allItems = results
    .filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 50);

  setCache('rss:all', allItems, 120);
  return allItems;
}

// ─── Ollama Proxy ────────────────────────────────────────────
async function proxyOllama(path: string, body: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, OLLAMA_URL);
    const req = http.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, timeout: 30000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve({ response: data }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Ollama timeout')); });
    req.write(body);
    req.end();
  });
}

// ─── GeoJSON Data Layers ─────────────────────────────────────
function getGCCBoundaries(): any {
  return {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { name: 'Saudi Arabia', code: 'SA', score: 32 }, geometry: { type: 'Point', coordinates: [46.6753, 24.7136] }},
      { type: 'Feature', properties: { name: 'UAE', code: 'AE', score: 28 }, geometry: { type: 'Point', coordinates: [54.3773, 24.4539] }},
      { type: 'Feature', properties: { name: 'Qatar', code: 'QA', score: 22 }, geometry: { type: 'Point', coordinates: [51.5310, 25.2854] }},
      { type: 'Feature', properties: { name: 'Kuwait', code: 'KW', score: 30 }, geometry: { type: 'Point', coordinates: [47.9774, 29.3759] }},
      { type: 'Feature', properties: { name: 'Bahrain', code: 'BH', score: 35 }, geometry: { type: 'Point', coordinates: [50.5860, 26.2285] }},
      { type: 'Feature', properties: { name: 'Oman', code: 'OM', score: 33 }, geometry: { type: 'Point', coordinates: [58.3829, 23.5880] }},
    ],
  };
}

function getOilGasLayer(): any {
  return {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { name: 'Ghawar Field', type: 'oil_field', capacity: '3.8M bpd', operator: 'Saudi Aramco', insuredValue: 'USD 50B+' }, geometry: { type: 'Point', coordinates: [49.40, 25.38] }},
      { type: 'Feature', properties: { name: 'Abqaiq Processing', type: 'processing', capacity: '7M bpd', operator: 'Saudi Aramco', insuredValue: 'USD 30B' }, geometry: { type: 'Point', coordinates: [49.68, 25.94] }},
      { type: 'Feature', properties: { name: 'Ras Tanura', type: 'refinery', capacity: '550K bpd', operator: 'Saudi Aramco', insuredValue: 'USD 15B' }, geometry: { type: 'Point', coordinates: [50.16, 26.64] }},
      { type: 'Feature', properties: { name: 'Ruwais Refinery', type: 'refinery', capacity: '922K bpd', operator: 'ADNOC', insuredValue: 'USD 20B' }, geometry: { type: 'Point', coordinates: [52.73, 24.11] }},
      { type: 'Feature', properties: { name: 'North Field', type: 'gas_field', capacity: '77 MTPA LNG', operator: 'QatarEnergy', insuredValue: 'USD 100B+' }, geometry: { type: 'Point', coordinates: [52.00, 26.00] }},
      { type: 'Feature', properties: { name: 'Ras Laffan LNG', type: 'lng', capacity: '77 MTPA', operator: 'QatarEnergy', insuredValue: 'USD 60B' }, geometry: { type: 'Point', coordinates: [51.55, 25.93] }},
      { type: 'Feature', properties: { name: 'Burgan Field', type: 'oil_field', capacity: '1.7M bpd', operator: 'KOC', insuredValue: 'USD 35B' }, geometry: { type: 'Point', coordinates: [47.97, 29.07] }},
      { type: 'Feature', properties: { name: 'BAPCO Refinery', type: 'refinery', capacity: '267K bpd', operator: 'BAPCO', insuredValue: 'USD 7B' }, geometry: { type: 'Point', coordinates: [50.52, 26.03] }},
      { type: 'Feature', properties: { name: 'Oman LNG', type: 'lng', capacity: '10.4 MTPA', operator: 'Oman LNG', insuredValue: 'USD 8B' }, geometry: { type: 'Point', coordinates: [59.28, 22.96] }},
    ],
  };
}

function getShippingLanes(): any {
  return {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { name: 'Gulf Shipping Lane', risk: 'elevated' }, geometry: { type: 'LineString', coordinates: [[56.25, 26.57], [54.0, 25.5], [51.5, 25.0], [50.5, 26.2], [49.0, 28.0]] }},
      { type: 'Feature', properties: { name: 'Arabian Sea to Red Sea', risk: 'high' }, geometry: { type: 'LineString', coordinates: [[56.25, 26.57], [58.0, 24.0], [60.0, 22.0], [53.0, 15.0], [43.3, 14.8]] }},
      { type: 'Feature', properties: { name: 'Red Sea North', risk: 'high' }, geometry: { type: 'LineString', coordinates: [[43.3, 14.8], [42.0, 15.5], [40.0, 18.0], [38.5, 21.5], [34.0, 27.0], [32.3, 30.0]] }},
      { type: 'Feature', properties: { name: 'Strait of Hormuz', risk: 'critical' }, geometry: { type: 'LineString', coordinates: [[56.0, 26.2], [56.25, 26.57], [56.5, 27.0]] }},
      { type: 'Feature', properties: { name: 'Bab el-Mandeb', risk: 'critical' }, geometry: { type: 'LineString', coordinates: [[43.0, 12.5], [43.3, 14.8], [43.5, 15.5]] }},
    ],
  };
}

function getPortsLayer(): any {
  return {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { name: 'Jebel Ali', teu: '14.7M', operator: 'DP World' }, geometry: { type: 'Point', coordinates: [55.03, 25.00] }},
      { type: 'Feature', properties: { name: 'Jeddah Islamic Port', teu: '4.4M', operator: 'Saudi Ports' }, geometry: { type: 'Point', coordinates: [39.17, 21.48] }},
      { type: 'Feature', properties: { name: 'Salalah Port', teu: '3.5M', operator: 'APM Terminals' }, geometry: { type: 'Point', coordinates: [54.01, 16.95] }},
      { type: 'Feature', properties: { name: 'Khalifa Port', teu: '2.5M', operator: 'ADPC' }, geometry: { type: 'Point', coordinates: [54.63, 24.79] }},
      { type: 'Feature', properties: { name: 'King Abdulaziz Port', teu: '2.3M', operator: 'Saudi Ports' }, geometry: { type: 'Point', coordinates: [50.22, 26.47] }},
      { type: 'Feature', properties: { name: 'Hamad Port', teu: '2.0M', operator: 'QTerminals' }, geometry: { type: 'Point', coordinates: [51.58, 25.01] }},
    ],
  };
}

function getRiskZones(): any {
  return {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { name: 'Strait of Hormuz', riskLevel: 'critical', type: 'chokepoint' }, geometry: { type: 'Polygon', coordinates: [[[55.5, 25.8], [57.0, 25.8], [57.0, 27.2], [55.5, 27.2], [55.5, 25.8]]] }},
      { type: 'Feature', properties: { name: 'Bab el-Mandeb', riskLevel: 'high', type: 'chokepoint' }, geometry: { type: 'Polygon', coordinates: [[[42.5, 12.0], [44.0, 12.0], [44.0, 15.5], [42.5, 15.5], [42.5, 12.0]]] }},
      { type: 'Feature', properties: { name: 'Eastern Province', riskLevel: 'elevated', type: 'oil_infrastructure' }, geometry: { type: 'Polygon', coordinates: [[[49.0, 25.0], [50.5, 25.0], [50.5, 27.0], [49.0, 27.0], [49.0, 25.0]]] }},
    ],
  };
}

// ─── Country Risk Scoring ────────────────────────────────────
function getCountryScores(): any {
  return {
    timestamp: new Date().toISOString(),
    overallGCC: 32,
    trend: 'stable',
    countries: [
      { code: 'SA', name: 'Saudi Arabia', score: 32, trend: -1.2, signals: { U: 15, C: 35, S: 20, I: 45, E: 40, F: 28 }},
      { code: 'AE', name: 'UAE', score: 28, trend: -0.5, signals: { U: 10, C: 30, S: 15, I: 40, E: 35, F: 25 }},
      { code: 'QA', name: 'Qatar', score: 22, trend: -2.1, signals: { U: 8, C: 25, S: 12, I: 35, E: 20, F: 18 }},
      { code: 'KW', name: 'Kuwait', score: 30, trend: 0.3, signals: { U: 12, C: 32, S: 18, I: 42, E: 30, F: 22 }},
      { code: 'BH', name: 'Bahrain', score: 35, trend: 1.8, signals: { U: 20, C: 38, S: 25, I: 45, E: 25, F: 32 }},
      { code: 'OM', name: 'Oman', score: 33, trend: 0.1, signals: { U: 10, C: 36, S: 22, I: 48, E: 35, F: 30 }},
    ],
    theaters: [
      { name: 'Iran Theater', level: 'CRIT' },
      { name: 'Yemen / Red Sea', level: 'ELEV' },
      { name: 'Arabian Gulf', level: 'NORM' },
      { name: 'Horn of Africa', level: 'ELEV' },
      { name: 'Levant / Iraq', level: 'NORM' },
    ],
  };
}

// ─── HTTP Server ─────────────────────────────────────────────
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function jsonResponse(res: http.ServerResponse, data: any, status = 200): void {
  res.writeHead(status, CORS_HEADERS);
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const path = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  try {
    // Health
    if (path === '/api/health') {
      return jsonResponse(res, { status: 'ok', service: 'deevo-monitor-api', version: '1.0.0', timestamp: new Date().toISOString() });
    }

    // RSS Feeds
    if (path === '/api/feeds') {
      const items = await aggregateFeeds();
      return jsonResponse(res, { items, count: items.length, cached: !!getCached('rss:all') });
    }

    // Ollama proxy
    if (path === '/api/ai/generate' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', async () => {
        try {
          const result = await proxyOllama('/api/generate', body);
          jsonResponse(res, result);
        } catch (e: any) {
          jsonResponse(res, { error: 'Ollama unavailable', message: e.message }, 503);
        }
      });
      return;
    }

    if (path === '/api/ai/chat' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', async () => {
        try {
          const result = await proxyOllama('/api/chat', body);
          jsonResponse(res, result);
        } catch (e: any) {
          jsonResponse(res, { error: 'Ollama unavailable', message: e.message }, 503);
        }
      });
      return;
    }

    if (path === '/api/ai/models') {
      try {
        const result = await proxyOllama('/api/tags', '{}');
        jsonResponse(res, result);
      } catch (e: any) {
        jsonResponse(res, { models: [], error: 'Ollama unavailable' });
      }
      return;
    }

    // GeoJSON layers
    if (path === '/api/layers/countries') return jsonResponse(res, getGCCBoundaries());
    if (path === '/api/layers/oil-gas') return jsonResponse(res, getOilGasLayer());
    if (path === '/api/layers/shipping') return jsonResponse(res, getShippingLanes());
    if (path === '/api/layers/ports') return jsonResponse(res, getPortsLayer());
    if (path === '/api/layers/risk-zones') return jsonResponse(res, getRiskZones());

    // Country risk scoring
    if (path === '/api/scoring') return jsonResponse(res, getCountryScores());

    // Cortex proxy (bridge to Deevo Analytics backend)
    if (path.startsWith('/api/cortex/')) {
      const cortexPath = path.replace('/api/cortex', '');
      try {
        const result = await new Promise((resolve, reject) => {
          const cortexUrl = new URL(cortexPath, CORTEX_URL);
          http.get(cortexUrl, { timeout: 10000 }, (cRes) => {
            let data = '';
            cRes.on('data', (chunk) => { data += chunk; });
            cRes.on('end', () => {
              try { resolve(JSON.parse(data)); } catch { resolve(data); }
            });
          }).on('error', reject);
        });
        return jsonResponse(res, result);
      } catch (e: any) {
        return jsonResponse(res, { error: 'Cortex unavailable', message: e.message }, 503);
      }
    }

    // 404
    jsonResponse(res, { error: 'Not found', path }, 404);

  } catch (e: any) {
    jsonResponse(res, { error: 'Internal server error', message: e.message }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   DEEVO MONITOR API SERVER                   ║
  ║   Port: ${PORT}                                 ║
  ║   Ollama: ${OLLAMA_URL.padEnd(33)}║
  ║   Cortex: ${CORTEX_URL.padEnd(33)}║
  ╚══════════════════════════════════════════════╝
  `);
  console.log('  Endpoints:');
  console.log('  GET  /api/health           — Server health');
  console.log('  GET  /api/feeds            — Aggregated RSS feeds');
  console.log('  POST /api/ai/generate      — Ollama generate proxy');
  console.log('  POST /api/ai/chat          — Ollama chat proxy');
  console.log('  GET  /api/ai/models        — List Ollama models');
  console.log('  GET  /api/layers/countries  — GCC country GeoJSON');
  console.log('  GET  /api/layers/oil-gas    — Oil & gas facilities');
  console.log('  GET  /api/layers/shipping   — Shipping lanes');
  console.log('  GET  /api/layers/ports      — Major ports');
  console.log('  GET  /api/layers/risk-zones — Risk zone polygons');
  console.log('  GET  /api/scoring          — Country risk scores');
  console.log('  GET  /api/cortex/*         — Cortex API bridge');
  console.log('');
});
