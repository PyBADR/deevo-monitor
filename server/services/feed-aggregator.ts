/**
 * Feed Aggregator — Pulls RSS from GCC insurance/regulatory sources.
 * Runs on a 5-minute interval, pushes new items via Socket.io.
 * Falls back to seed data when RSS sources are unreachable.
 */
import type { Server } from "socket.io";
import RssParser from "rss-parser";

interface FeedItem {
  id: string;
  timestamp: string;
  title: string;
  summary: string;
  category: string;
  severity: string;
  source: string;
  sourceUrl?: string;
  country?: string;
  coordinates?: [number, number];
}

interface FeedSource {
  name: string;
  url: string;
  category: string;
  country: string;
  active: boolean;
}

// ── RSS Sources (20+ GCC insurance / regulatory / news feeds) ──
const RSS_SOURCES: FeedSource[] = [
  // ── Pan-GCC & Regional ────────────────────────────────
  { name: "Reuters Middle East", url: "https://www.reuters.com/rssFeed/middleeastNews", category: "geopolitical", country: "GCC", active: true },
  { name: "Arabian Business", url: "https://www.arabianbusiness.com/rss", category: "market", country: "GCC", active: true },
  { name: "Middle East Insurance Review", url: "https://www.meinsurancereview.com/rss", category: "insurance", country: "GCC", active: true },
  { name: "MENA Insurance CEO Club", url: "https://www.menaceoclub.com/feed", category: "reinsurance", country: "GCC", active: true },
  { name: "Artemis Reinsurance", url: "https://www.artemis.bm/feed/", category: "reinsurance", country: "GCC", active: true },
  { name: "Insurance Journal", url: "https://www.insurancejournal.com/rss/international/", category: "insurance", country: "GCC", active: true },
  { name: "Reinsurance News", url: "https://www.reinsurancene.ws/feed/", category: "reinsurance", country: "GCC", active: true },

  // ── UAE ────────────────────────────────────────────────
  { name: "Gulf News", url: "https://gulfnews.com/rss", category: "geopolitical", country: "AE", active: true },
  { name: "Khaleej Times", url: "https://www.khaleejtimes.com/rss", category: "market", country: "AE", active: true },
  { name: "The National UAE", url: "https://www.thenationalnews.com/rss", category: "geopolitical", country: "AE", active: true },

  // ── Saudi Arabia ──────────────────────────────────────
  { name: "Saudi Gazette", url: "https://saudigazette.com.sa/rss", category: "regulatory", country: "SA", active: true },
  { name: "Arab News", url: "https://www.arabnews.com/rss.xml", category: "geopolitical", country: "SA", active: true },
  { name: "Argaam Business", url: "https://www.argaam.com/en/rss/articles", category: "market", country: "SA", active: true },

  // ── Kuwait ─────────────────────────────────────────────
  { name: "Kuwait Times", url: "https://www.kuwaittimes.com/feed/", category: "geopolitical", country: "KW", active: true },
  { name: "Arab Times Kuwait", url: "https://www.arabtimesonline.com/feed/", category: "market", country: "KW", active: true },

  // ── Qatar ──────────────────────────────────────────────
  { name: "Qatar Tribune", url: "https://www.qatar-tribune.com/rss", category: "geopolitical", country: "QA", active: true },
  { name: "The Peninsula Qatar", url: "https://thepeninsulaqatar.com/rss", category: "market", country: "QA", active: true },
  { name: "Gulf Times Qatar", url: "https://www.gulf-times.com/rss", category: "geopolitical", country: "QA", active: true },

  // ── Bahrain ────────────────────────────────────────────
  { name: "Gulf Daily News", url: "https://www.gdnonline.com/rss", category: "market", country: "BH", active: true },
  { name: "Daily Tribune Bahrain", url: "https://www.newsofbahrain.com/rss", category: "geopolitical", country: "BH", active: true },

  // ── Oman ───────────────────────────────────────────────
  { name: "Times of Oman", url: "https://timesofoman.com/rss", category: "geopolitical", country: "OM", active: true },
  { name: "Muscat Daily", url: "https://www.muscatdaily.com/feed/", category: "market", country: "OM", active: true },

  // ── Weather / CAT ─────────────────────────────────────
  { name: "ReliefWeb MENA", url: "https://reliefweb.int/updates/rss.xml?primary_country=8657", category: "weather", country: "GCC", active: true },

  // ── Cyber Risk ─────────────────────────────────────────
  { name: "Dark Reading", url: "https://www.darkreading.com/rss.xml", category: "cyber", country: "GCC", active: true },
];

// ── In-memory store ──────────────────────────────────────
let feedItems: FeedItem[] = [];
const MAX_ITEMS = 500;
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const parser = new RssParser({
  timeout: 10_000,
  headers: { "User-Agent": "DeevoMonitor/2.0" },
});

// ── Seed data (for offline/demo mode) ────────────────────
const SEED_ITEMS: FeedItem[] = [
  {
    id: "seed-1", timestamp: new Date().toISOString(),
    title: "SAMA Updates Motor Insurance Framework",
    summary: "Saudi Central Bank issues updated guidelines for motor insurance pricing incorporating AI-assisted underwriting.",
    category: "regulatory", severity: "medium", source: "SAMA Bulletin", country: "SA",
  },
  {
    id: "seed-2", timestamp: new Date(Date.now() - 180_000).toISOString(),
    title: "Dubai Insurance Market Grows 8.2% YoY",
    summary: "CBUAE reports strong growth in Dubai's insurance sector driven by health and motor lines.",
    category: "market", severity: "info", source: "CBUAE", country: "AE",
  },
  {
    id: "seed-3", timestamp: new Date(Date.now() - 360_000).toISOString(),
    title: "Cyclone Advisory — Gulf of Oman",
    summary: "IMD issues tropical cyclone warning affecting Oman coastal regions. Property insurers activating CAT protocols.",
    category: "weather", severity: "high", source: "Oman Met Office", country: "OM",
  },
  {
    id: "seed-4", timestamp: new Date(Date.now() - 540_000).toISOString(),
    title: "Cross-Border Fraud Network Identified",
    summary: "Joint regulatory operation uncovers organized fraud ring spanning SA, AE, and QA with estimated losses of SAR 12M.",
    category: "fraud", severity: "critical", source: "DeevoSentinel", country: "SA",
  },
  {
    id: "seed-5", timestamp: new Date(Date.now() - 720_000).toISOString(),
    title: "Qatar InsurTech Regulatory Sandbox Expands",
    summary: "QCB opens regulatory sandbox to AI-driven claims processing startups.",
    category: "regulatory", severity: "low", source: "QCB", country: "QA",
  },
  {
    id: "seed-6", timestamp: new Date(Date.now() - 900_000).toISOString(),
    title: "Kuwait Motor Claims Surge After Flooding",
    summary: "Heavy rainfall causes widespread vehicle damage. CBK advises insurers to expedite claims processing.",
    category: "claims", severity: "high", source: "Kuwait Times", country: "KW",
  },
  {
    id: "seed-7", timestamp: new Date(Date.now() - 1_080_000).toISOString(),
    title: "Bahrain FinTech Bay Insurance Innovation",
    summary: "CBB-backed initiative launches parametric insurance pilot for agriculture sector.",
    category: "market", severity: "info", source: "CBB", country: "BH",
  },
];

function categorizeSeverity(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("critical") || lower.includes("emergency") || lower.includes("fraud")) return "critical";
  if (lower.includes("warning") || lower.includes("surge") || lower.includes("alert")) return "high";
  if (lower.includes("update") || lower.includes("change")) return "medium";
  return "low";
}

async function pollSource(source: FeedSource): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).slice(0, 10).map((item, i) => ({
      id: `${source.name.replace(/\s/g, "-").toLowerCase()}-${Date.now()}-${i}`,
      timestamp: item.isoDate || new Date().toISOString(),
      title: item.title || "Untitled",
      summary: (item.contentSnippet || item.content || "").slice(0, 300),
      category: source.category,
      severity: categorizeSeverity(item.title || ""),
      source: source.name,
      sourceUrl: item.link,
      country: source.country,
    }));
  } catch {
    return [];
  }
}

async function pollAllSources(io: Server): Promise<void> {
  const activeSources = RSS_SOURCES.filter((s) => s.active);
  const results = await Promise.allSettled(activeSources.map(pollSource));

  let newCount = 0;
  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const item of result.value) {
        const exists = feedItems.some((f) => f.title === item.title);
        if (!exists) {
          feedItems.unshift(item);
          newCount++;
          io.emit("feed:new", item);
          io.to(`feed:${item.category}`).emit("feed:new", item);
        }
      }
    }
  }

  // Trim to max
  if (feedItems.length > MAX_ITEMS) {
    feedItems = feedItems.slice(0, MAX_ITEMS);
  }

  if (newCount > 0) {
    console.log(`[Feed] Aggregated ${newCount} new items from ${activeSources.length} sources`);
  }
}

// ── Public API ────────────────────────────────────────
export function getFeedItems(opts: { limit: number; category?: string }): FeedItem[] {
  let items = feedItems;
  if (opts.category) {
    items = items.filter((i) => i.category === opts.category);
  }
  return items.slice(0, opts.limit);
}

export function getFeedSources(): FeedSource[] {
  return RSS_SOURCES;
}

export function startFeedAggregator(io: Server): void {
  // Load seed data
  feedItems = [...SEED_ITEMS];
  console.log(`[Feed] Loaded ${SEED_ITEMS.length} seed items`);

  // Initial poll
  setTimeout(() => pollAllSources(io), 5_000);

  // Recurring poll
  setInterval(() => pollAllSources(io), POLL_INTERVAL_MS);
  console.log(`[Feed] Aggregator started — polling every ${POLL_INTERVAL_MS / 1000}s`);
}
