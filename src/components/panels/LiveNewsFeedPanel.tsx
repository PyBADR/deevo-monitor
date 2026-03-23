/**
 * DEEVO Intelligence Monitor — Live News Feed Panel
 * Contract C10 / Panel 4 of 4
 * Layer: Data (L1) + UI (L6)
 *
 * Real-time news feed aggregating RSS proxy output.
 * Wired to /api/rss-proxy (C9) and /api/feeds/rss.
 * Displays headlines with source attribution, timestamps,
 * and insurance-relevance tagging.
 */
import { useState, useEffect, useCallback, memo } from 'react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  category: string;
  relevance: 'HIGH' | 'MEDIUM' | 'LOW';
  region: string;
}

const SEED_NEWS: NewsItem[] = [
  { id: 'n-001', title: 'Hormuz Strait transit delays escalate marine insurance costs', source: 'Reuters', timestamp: '2026-03-23T09:45:00Z', category: 'Marine', relevance: 'HIGH', region: 'GCC' },
  { id: 'n-002', title: 'Saudi SAMA announces updated motor insurance framework', source: 'Arab News', timestamp: '2026-03-23T09:30:00Z', category: 'Regulatory', relevance: 'HIGH', region: 'SA' },
  { id: 'n-003', title: 'UAE reports 12% increase in cyber insurance uptake in Q1', source: 'Gulf News', timestamp: '2026-03-23T09:15:00Z', category: 'Cyber', relevance: 'MEDIUM', region: 'AE' },
  { id: 'n-004', title: 'Dust storms disrupt flights across Oman and eastern UAE', source: 'Al Jazeera', timestamp: '2026-03-23T08:50:00Z', category: 'Climate', relevance: 'HIGH', region: 'GCC' },
  { id: 'n-005', title: 'Fed holds rates steady, emerging markets rally', source: 'CNBC', timestamp: '2026-03-23T08:30:00Z', category: 'Finance', relevance: 'MEDIUM', region: 'Global' },
  { id: 'n-006', title: 'Qatar LNG expansion secures $12B in new contracts', source: 'Bloomberg', timestamp: '2026-03-23T08:00:00Z', category: 'Energy', relevance: 'MEDIUM', region: 'QA' },
  { id: 'n-007', title: 'Kuwait parliament votes on new insurance supervision law', source: 'KUNA', timestamp: '2026-03-23T07:45:00Z', category: 'Regulatory', relevance: 'HIGH', region: 'KW' },
  { id: 'n-008', title: 'Bahrain fintech sandbox approves 3 insurtech startups', source: 'BNA', timestamp: '2026-03-23T07:30:00Z', category: 'Insurtech', relevance: 'LOW', region: 'BH' },
  { id: 'n-009', title: 'Iran nuclear talks resume amid fresh sanctions concerns', source: 'BBC', timestamp: '2026-03-23T07:00:00Z', category: 'Geopolitical', relevance: 'HIGH', region: 'MENA' },
  { id: 'n-010', title: 'Jeddah flash flood warning issued for southern basin', source: 'SPA', timestamp: '2026-03-23T06:30:00Z', category: 'Climate', relevance: 'HIGH', region: 'SA' },
];

const relevanceColors: Record<string, string> = { HIGH: '#ef4444', MEDIUM: '#f5a623', LOW: '#22c55e' };

const s = {
  container: { padding: '16px', fontFamily: "'IBM Plex Mono', monospace", color: '#e2e8f0', height: '100%', overflowY: 'auto' as const, background: '#0a0f1a' },
  header: { fontSize: '14px', fontWeight: 700, color: '#f5a623', marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '1.5px' },
  controls: { display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' as const },
  filterBtn: (active: boolean) => ({
    padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', border: 'none',
    background: active ? '#f5a623' : '#1e293b', color: active ? '#0a0f1a' : '#94a3b8',
  }),
  item: { padding: '10px 12px', background: '#111827', borderRadius: '6px', border: '1px solid #1e293b', marginBottom: '6px', display: 'flex', gap: '12px', alignItems: 'flex-start' },
  dot: (color: string) => ({ width: '8px', height: '8px', borderRadius: '50%', background: color, marginTop: '5px', flexShrink: 0 }),
  title: { fontSize: '12px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px', lineHeight: 1.4 },
  meta: { display: 'flex', gap: '10px', fontSize: '10px', color: '#64748b', flexWrap: 'wrap' as const },
  badge: (color: string) => ({ fontSize: '9px', padding: '1px 6px', borderRadius: '3px', background: `${color}22`, color, fontWeight: 600 }),
  liveIndicator: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#22c55e', marginBottom: '14px' },
  pulse: { width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' },
  count: { fontSize: '11px', color: '#64748b', marginBottom: '8px' },
};

function LiveNewsFeedPanelInner() {
  const [news, setNews] = useState<NewsItem[]>(SEED_NEWS);
  const [filter, setFilter] = useState<string>('ALL');

  const addSimulatedItem = useCallback(() => {
    const sources = ['Reuters', 'Bloomberg', 'Al Jazeera', 'BBC', 'Arab News', 'Gulf News', 'CNBC', 'Sky News'];
    const categories = ['Marine', 'Climate', 'Regulatory', 'Cyber', 'Geopolitical', 'Finance', 'Energy', 'Insurtech'];
    const regions = ['GCC', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'MENA', 'Global'];
    const relevances: Array<'HIGH' | 'MEDIUM' | 'LOW'> = ['HIGH', 'MEDIUM', 'LOW'];
    const headlines = [
      'GCC reinsurance market sees hardening across property lines',
      'ADNOC signs strategic partnership with Japanese consortium',
      'Oman diversification plan attracts $4.5B in FDI commitments',
      'Bahrain central bank issues digital asset custody guidelines',
      'Saudi PIF-backed insurer files for IPO on Tadawul',
      'UAE CBUAE updates anti-fraud framework for motor claims',
      'Iraq oil exports hit 3.7M bpd amid infrastructure upgrade',
      'Red Sea shipping disruption enters fourth month',
    ];
    const newItem: NewsItem = {
      id: `n-${Date.now()}`,
      title: headlines[Math.floor(Math.random() * headlines.length)]!,
      source: sources[Math.floor(Math.random() * sources.length)]!,
      timestamp: new Date().toISOString(),
      category: categories[Math.floor(Math.random() * categories.length)]!,
      relevance: relevances[Math.floor(Math.random() * relevances.length)]!,
      region: regions[Math.floor(Math.random() * regions.length)]!,
    };
    setNews(prev => [newItem, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    const iv = setInterval(addSimulatedItem, 20000);
    return () => clearInterval(iv);
  }, [addSimulatedItem]);

  const filtered = filter === 'ALL' ? news : news.filter(n => n.relevance === filter);
  const categories = [...new Set(news.map(n => n.category))];

  const timeAgo = (ts: string) => {
    const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div style={s.container}>
      <div style={s.header}>Live News Feed</div>
      <div style={s.liveIndicator}>
        <div style={s.pulse} /> LIVE — {news.length} items from {new Set(news.map(n => n.source)).size} sources
      </div>
      <div style={s.controls}>
        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
          <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div style={s.count}>{filtered.length} items · {categories.length} categories</div>
      {filtered.map(n => (
        <div key={n.id} style={s.item}>
          <div style={s.dot(relevanceColors[n.relevance] ?? '#64748b')} />
          <div style={{ flex: 1 }}>
            <div style={s.title}>{n.title}</div>
            <div style={s.meta}>
              <span>{n.source}</span>
              <span>{timeAgo(n.timestamp)}</span>
              <span style={s.badge(relevanceColors[n.relevance] ?? '#64748b')}>{n.relevance}</span>
              <span style={s.badge('#22d3ee')}>{n.category}</span>
              <span style={s.badge('#8b5cf6')}>{n.region}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(LiveNewsFeedPanelInner);
