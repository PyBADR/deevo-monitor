'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  GCC_COUNTRIES, GLOBAL_PARTNERS, MAP_LAYERS, MARKET_SYMBOLS,
  SAMPLE_GEO_EVENTS, CHOKEPOINTS, GDP_TIMELINE,
  type GCCCountry, type GeoEvent, type MapLayer, type GCCCode,
} from '@/config/gcc-data';
import { GitHubCard, DiscordCard, FounderCard, BRAND as BRAND_CONFIG } from './BrandProfile';
import { calculateRegionFRISK, type InstabilityScore } from './InstabilityScore';
import { fetchAllMarketData, type Quote } from '@/services/market';
import { fetchGCCNews, type NewsItem } from '@/services/news';
import { generateCortexBrief, SEED_BRIEF, type CortexBrief, type CortexCard } from '@/services/cortex-ai';
import type { ForecastCard } from './AIForecasts';

const GCCGlobe = dynamic(() => import('./GCCGlobe'), {
  ssr: false,
  loading: () => (
    <div style={{width:'100%',height:'100%',background:'#040a06',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:'monospace',fontSize:10,color:'#10b981',letterSpacing:3}}>LOADING MAP ENGINE...</div>
    </div>
  ),
});
const LiveWebcams = dynamic(() => import('./LiveWebcams'), { ssr: false });
const AIForecasts = dynamic(() => import('./AIForecasts'), { ssr: false });
const FlightTracker = dynamic(() => import('./FlightTracker'), { ssr: false });

// ─── BRAND IDENTITY ─────────────────────────────────────────────────────────
const BRAND = {
  github_user: 'PyBADR',
  github_repo: 'deevo-monitor',
  github_url: 'https://github.com/PyBADR/deevo-monitor',
  discord_user: 'Baderalabddan',
  discord_invite: 'https://discord.gg/deevo',
  vercel_url: 'https://deevo-monitor.vercel.app',
  name: 'Baderalabddan',
  title: 'CEO · DEEVO Analytics',
  tagline: 'GCC Economic Intelligence Platform',
};

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const BG = '#040a06';
const BG2 = '#070e09';
const BG3 = '#0b1610';
const BORDER = '#132018';
const BORDER2 = '#1a2e1e';
const GREEN = '#10b981';
const GREEN_DIM = '#064e33';
const AMBER = '#f59e0b';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const TEXT = '#9dc4a6';
const TEXT_DIM = '#3a5c42';
const TEXT_BRIGHT = '#d4f0d8';

const RISK_COLORS: Record<string,string> = {CRITICAL:'#ef4444',HIGH:'#f97316',MEDIUM:'#f59e0b',LOW:'#84cc16',NOMINAL:'#10b981'};
const LAYER_CATEGORIES = ['economic','infrastructure','sectors','geopolitical','analytics'] as const;

// ─── LIVE MARKET DATA HOOK (real Yahoo Finance) ───────────────────────────────
interface MarketState {
  commodities: Quote[];
  forex: Quote[];
  crypto: Quote[];
  indices: Quote[];
  source: 'live'|'seed';
  lastFetch: number;
}

function buildFallbackMarket(): MarketState {
  const seed = MARKET_SYMBOLS;
  const toQuotes = (items: typeof seed.commodities) => items.map(i => ({
    symbol: i.symbol, name: i.name, price: i.price,
    change: i.change, changePct: i.change, source: 'seed' as const, fetchedAt: Date.now(),
  }));
  return {
    commodities: toQuotes(seed.commodities as typeof seed.commodities),
    forex: seed.forex.map(f => ({ symbol: f.symbol, name: f.name, price: f.price, change: f.change, changePct: f.change, source: 'seed' as const, fetchedAt: Date.now() })),
    crypto: seed.crypto.map(c => ({ symbol: c.symbol, name: c.name, price: c.price, change: c.change, changePct: c.change, source: 'seed' as const, fetchedAt: Date.now() })),
    indices: seed.indices.map(i => ({ symbol: i.symbol, name: i.name, price: i.price, change: i.change, changePct: i.change, source: 'seed' as const, fetchedAt: Date.now() })),
    source: 'seed', lastFetch: Date.now(),
  };
}

function useLiveMarket() {
  const [data, setData] = useState<MarketState>(buildFallbackMarket());
  const [dataSource, setDataSource] = useState<'live'|'seed'>('seed');

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchAllMarketData();
        setData({ ...result, lastFetch: Date.now() });
        setDataSource(result.source);
      } catch { /* keep seed */ }
    }
    load();
    const id = setInterval(load, 60000); // refresh every 60s (Yahoo Finance rate limit friendly)
    return () => clearInterval(id);
  }, []);

  // Micro-jitter for visual "live" feel between fetches (tiny ±0.02%)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => ({
        ...prev,
        commodities: prev.commodities.map(q => ({ ...q, price: +(q.price * (1 + (Math.random()-0.5)*0.0002)).toFixed(q.price > 100 ? 2 : 4) })),
        crypto: prev.crypto.map(q => ({ ...q, price: +(q.price * (1 + (Math.random()-0.5)*0.0004)).toFixed(q.symbol==='USDT-USD'||q.symbol==='USDT'?3:0) })),
      }));
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return { data, tick, dataSource };
}

// ─── LIVE NEWS HOOK ───────────────────────────────────────────────────────────
function useLiveNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsSource, setNewsSource] = useState<'live'|'seed'>('seed');

  useEffect(() => {
    async function load() {
      const result = await fetchGCCNews(20);
      setNews(result.items);
      setNewsSource(result.source);
    }
    load();
    const id = setInterval(load, 180000); // refresh every 3 min
    return () => clearInterval(id);
  }, []);

  return { news, newsSource };
}

function useLiveTime() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}

// ─── GITHUB LIVE DATA ────────────────────────────────────────────────────────
interface GitHubData {
  stars: number;
  forks: number;
  watchers: number;
  commits: number;
  branches: number;
  releases: number;
  last_commit: string;
  last_commit_msg: string;
  last_commit_sha: string;
  open_issues: number;
  language: string;
  description: string;
  loaded: boolean;
}

function useGitHubData() {
  const [data, setData] = useState<GitHubData>({
    stars: 1, forks: 0, watchers: 0, commits: 41, branches: 3,
    releases: 3, last_commit: '1 hour ago',
    last_commit_msg: 'feat(v3): DEEVO Intelligence Monitor v6.0 - 7-layer decision i...',
    last_commit_sha: 'f161c2f', open_issues: 0, language: 'TypeScript',
    description: 'Real-time GCC intelligence dashboard — AI-powered insurance risk monitoring, geopolitical tracking, and infrastructure surveillance',
    loaded: false,
  });

  useEffect(() => {
    async function fetchGitHub() {
      try {
        const [repo, commits] = await Promise.all([
          fetch(`https://api.github.com/repos/${BRAND.github_user}/${BRAND.github_repo}`, {
            headers: { Accept: 'application/vnd.github.v3+json' }
          }).then(r => r.ok ? r.json() : null),
          fetch(`https://api.github.com/repos/${BRAND.github_user}/${BRAND.github_repo}/commits?per_page=1`, {
            headers: { Accept: 'application/vnd.github.v3+json' }
          }).then(r => r.ok ? r.json() : null),
        ]);

        if (repo) {
          const lastCommit = commits?.[0];
          const commitDate = lastCommit?.commit?.committer?.date
            ? new Date(lastCommit.commit.committer.date)
            : null;
          const timeAgo = commitDate
            ? getTimeAgo(commitDate)
            : '1 hour ago';

          setData({
            stars: repo.stargazers_count ?? 1,
            forks: repo.forks_count ?? 0,
            watchers: repo.subscribers_count ?? 0,
            commits: 41,
            branches: 3,
            releases: 3,
            last_commit: timeAgo,
            last_commit_msg: (lastCommit?.commit?.message?.slice(0, 60) ?? data.last_commit_msg) + '...',
            last_commit_sha: lastCommit?.sha?.slice(0, 7) ?? 'f161c2f',
            open_issues: repo.open_issues_count ?? 0,
            language: repo.language ?? 'TypeScript',
            description: repo.description ?? data.description,
            loaded: true,
          });
        }
      } catch {
        setData(prev => ({ ...prev, loaded: true }));
      }
    }
    fetchGitHub();
    const id = setInterval(fetchGitHub, 120000); // refresh every 2 min
    return () => clearInterval(id);
  }, []);

  return data;
}

function getTimeAgo(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec/60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec/3600)}h ago`;
  return `${Math.floor(sec/86400)}d ago`;
}

// ─── GITHUB PANEL ─────────────────────────────────────────────────────────────
function GitHubPanel({ gh }: { gh: GitHubData }) {
  const PURPLE = '#8b5cf6';
  return (
    <div style={{display:'flex',flexDirection:'column',gap:0}}>
      {/* Repo header */}
      <div style={{padding:'8px 12px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          {/* GitHub icon */}
          <svg width="14" height="14" viewBox="0 0 16 16" fill={PURPLE}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span style={{fontFamily:'monospace',fontSize:9,color:PURPLE,letterSpacing:1}}>{BRAND.github_user}/{BRAND.github_repo}</span>
          {!gh.loaded && <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,animation:'pulse 1s infinite'}}>syncing...</span>}
        </div>
        <a href={BRAND.github_url} target="_blank" rel="noopener noreferrer"
          style={{fontFamily:'monospace',fontSize:8,color:PURPLE,textDecoration:'none',padding:'1px 6px',border:`1px solid ${PURPLE}40`,borderRadius:2,background:`${PURPLE}10`}}>
          ↗ VIEW
        </a>
      </div>

      {/* Stats row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:0,borderBottom:`1px solid ${BORDER}`}}>
        {[
          {icon:'★',label:'Stars',value:gh.stars},
          {icon:'⑂',label:'Forks',value:gh.forks},
          {icon:'●',label:'Commits',value:gh.commits},
        ].map(s=>(
          <div key={s.label} style={{padding:'6px 8px',textAlign:'center',borderRight:`1px solid ${BORDER}`}}>
            <div style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,marginBottom:2}}>{s.icon} {s.label}</div>
            <div style={{fontFamily:'monospace',fontSize:12,color:PURPLE,fontWeight:'bold'}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Latest commit */}
      <div style={{padding:'7px 12px',borderBottom:`1px solid ${BORDER}`}}>
        <div style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,marginBottom:3,letterSpacing:1}}>LATEST COMMIT</div>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
          <span style={{fontFamily:'monospace',fontSize:8,background:`${PURPLE}20`,color:PURPLE,padding:'1px 5px',borderRadius:2}}>{gh.last_commit_sha}</span>
          <span style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM}}>{gh.last_commit}</span>
        </div>
        <div style={{fontFamily:'monospace',fontSize:8,color:TEXT,lineHeight:1.4}}>{gh.last_commit_msg}</div>
      </div>

      {/* Repo meta */}
      <div style={{padding:'6px 12px',borderBottom:`1px solid ${BORDER}`}}>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {[
            {l:'TypeScript',c:'#3b82f6'},
            {l:'intelligence',c:PURPLE},
            {l:'gcc',c:GREEN},
            {l:'insurance',c:'#ec4899'},
            {l:'geopolitical',c:AMBER},
            {l:'ollama',c:'#06b6d4'},
          ].map(tag=>(
            <span key={tag.l} style={{fontFamily:'monospace',fontSize:7,background:`${tag.c}15`,color:tag.c,padding:'2px 6px',borderRadius:10,border:`1px solid ${tag.c}30`}}>{tag.l}</span>
          ))}
        </div>
      </div>

      {/* Branch + release */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',borderBottom:`1px solid ${BORDER}`}}>
        {[
          {l:'Branches',v:gh.branches,icon:'⌥'},
          {l:'Releases',v:gh.releases,icon:'◈'},
        ].map(s=>(
          <div key={s.l} style={{padding:'5px 10px',borderRight:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontFamily:'monospace',fontSize:9,color:PURPLE}}>{s.icon}</span>
            <div>
              <div style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM}}>{s.l}</div>
              <div style={{fontFamily:'monospace',fontSize:10,color:TEXT_BRIGHT}}>{s.v}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Live badge */}
      <div style={{padding:'5px 12px',display:'flex',alignItems:'center',gap:6}}>
        <div style={{width:4,height:4,borderRadius:'50%',background:GREEN,animation:'pulse 2s infinite'}}/>
        <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM}}>v5.2.0-wm-integration: Worl... Latest</span>
      </div>
    </div>
  );
}

// ─── DISCORD PANEL ────────────────────────────────────────────────────────────
function DiscordPanel() {
  const DISCORD_BLUE = '#5865f2';
  const [copied, setCopied] = useState(false);

  function copyHandle() {
    navigator.clipboard?.writeText(BRAND.discord_user).then(()=>{
      setCopied(true); setTimeout(()=>setCopied(false),2000);
    });
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:0}}>
      {/* Discord header */}
      <div style={{padding:'8px 12px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <svg width="14" height="11" viewBox="0 0 71 55" fill={DISCORD_BLUE}>
            <path d="M60.1 4.9A58.6 58.6 0 0045.6.6a40.9 40.9 0 00-1.9 3.8 54.2 54.2 0 00-16.3 0A38.7 38.7 0 0025.5.6 58.4 58.4 0 0011 4.9C1.6 18.9-1 32.5.3 45.9a59.1 59.1 0 0018 9.1 43.5 43.5 0 003.8-6.1 38.4 38.4 0 01-6-2.9l1.5-1.1a42.1 42.1 0 0036.2 0l1.5 1.1a38.3 38.3 0 01-6 2.9 43.3 43.3 0 003.8 6.1 58.8 58.8 0 0018-9 55 55 0 00-10.9-41zm-37.9 33.6c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.5 0 6.4 3.2 6.4 7.1-.1 3.9-2.9 7.1-6.4 7.1zm23.6 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.5 0 6.4 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1z"/>
          </svg>
          <span style={{fontFamily:'monospace',fontSize:9,color:DISCORD_BLUE,letterSpacing:1}}>DISCORD</span>
          <div style={{width:5,height:5,borderRadius:'50%',background:GREEN}}/>
          <span style={{fontFamily:'monospace',fontSize:7,color:GREEN}}>ONLINE</span>
        </div>
        <a href={BRAND.discord_invite} target="_blank" rel="noopener noreferrer"
          style={{fontFamily:'monospace',fontSize:8,color:DISCORD_BLUE,textDecoration:'none',padding:'1px 6px',border:`1px solid ${DISCORD_BLUE}40`,borderRadius:2,background:`${DISCORD_BLUE}10`}}>
          JOIN
        </a>
      </div>

      {/* User card */}
      <div style={{padding:'10px 12px',borderBottom:`1px solid ${BORDER}`}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${GREEN},#064e33)`,display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${GREEN}`,flexShrink:0}}>
            <span style={{fontFamily:'monospace',fontSize:11,color:'white',fontWeight:'bold'}}>B</span>
          </div>
          <div>
            <div style={{fontFamily:'monospace',fontSize:10,color:TEXT_BRIGHT,fontWeight:'bold',letterSpacing:0.5}}>{BRAND.discord_user}</div>
            <div style={{fontFamily:'monospace',fontSize:7,color:GREEN}}>● Invisible / Active</div>
          </div>
          <button onClick={copyHandle} style={{marginLeft:'auto',background:'transparent',border:`1px solid ${BORDER}`,borderRadius:3,padding:'2px 7px',fontFamily:'monospace',fontSize:7,color:copied?GREEN:TEXT_DIM,cursor:'pointer'}}>
            {copied?'✓ COPIED':'COPY'}
          </button>
        </div>
        {/* Role badges */}
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {[
            {l:'CEO · DEEVO',c:GREEN},
            {l:'AI Builder',c:'#8b5cf6'},
            {l:'GCC Intel',c:AMBER},
          ].map(r=>(
            <span key={r.l} style={{fontFamily:'monospace',fontSize:7,background:`${r.c}15`,color:r.c,padding:'2px 7px',borderRadius:10,border:`1px solid ${r.c}30`}}>{r.l}</span>
          ))}
        </div>
      </div>

      {/* Connections */}
      <div style={{padding:'7px 12px',borderBottom:`1px solid ${BORDER}`}}>
        <div style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,marginBottom:6,letterSpacing:1}}>CONNECTIONS</div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          <a href={BRAND.github_url} target="_blank" rel="noopener noreferrer"
            style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none',padding:'4px 6px',borderRadius:3,border:`1px solid ${BORDER}`,background:BG3}}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="#8b5cf6"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            <span style={{fontFamily:'monospace',fontSize:8,color:'#8b5cf6'}}>{BRAND.github_user}</span>
            <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,marginLeft:'auto'}}>↗</span>
          </a>
          <a href={BRAND.vercel_url} target="_blank" rel="noopener noreferrer"
            style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none',padding:'4px 6px',borderRadius:3,border:`1px solid ${BORDER}`,background:BG3}}>
            <span style={{fontFamily:'monospace',fontSize:10,color:TEXT_BRIGHT}}>▲</span>
            <span style={{fontFamily:'monospace',fontSize:8,color:TEXT}}>deevo-monitor.vercel.app</span>
            <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,marginLeft:'auto'}}>↗</span>
          </a>
        </div>
      </div>

      {/* Status message */}
      <div style={{padding:'7px 12px'}}>
        <div style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,marginBottom:3,letterSpacing:1}}>CURRENT STATUS</div>
        <div style={{fontFamily:'monospace',fontSize:8,color:TEXT,lineHeight:1.5}}>
          🌍 Building DEEVO Cortex<br/>
          📊 GCC Intelligence Platform<br/>
          💬 dm for partnerships
        </div>
      </div>
    </div>
  );
}

// ─── AUTHOR BRANDING FOOTER ───────────────────────────────────────────────────
function AuthorBranding({ gh }: { gh: GitHubData }) {
  const PURPLE = '#8b5cf6';
  const DISCORD_BLUE = '#5865f2';
  return (
    <div style={{
      borderTop:`1px solid ${BORDER}`,background:BG2,padding:'5px 14px',
      display:'flex',alignItems:'center',gap:12,flexShrink:0,
    }}>
      {/* Avatar + name */}
      <div style={{display:'flex',alignItems:'center',gap:7}}>
        <div style={{width:20,height:20,borderRadius:'50%',background:`linear-gradient(135deg,${GREEN},#064e33)`,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${GREEN}40`,flexShrink:0}}>
          <span style={{fontFamily:'monospace',fontSize:9,color:'white',fontWeight:'bold'}}>B</span>
        </div>
        <div>
          <span style={{fontFamily:'monospace',fontSize:9,color:TEXT_BRIGHT,fontWeight:'bold',letterSpacing:0.5}}>Baderalabddan</span>
          <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,marginLeft:6}}>· CEO, DEEVO Analytics</span>
        </div>
      </div>

      <div style={{width:1,height:12,background:BORDER}}/>

      {/* GitHub link */}
      <a href={BRAND.github_url} target="_blank" rel="noopener noreferrer"
        style={{display:'flex',alignItems:'center',gap:4,textDecoration:'none'}}>
        <svg width="11" height="11" viewBox="0 0 16 16" fill={PURPLE}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        <span style={{fontFamily:'monospace',fontSize:8,color:PURPLE}}>PyBADR</span>
        <span style={{fontFamily:'monospace',fontSize:7,color:PURPLE,background:`${PURPLE}15`,padding:'0 4px',borderRadius:2}}>★ {gh.stars}</span>
      </a>

      {/* Discord link */}
      <a href={BRAND.discord_invite} target="_blank" rel="noopener noreferrer"
        style={{display:'flex',alignItems:'center',gap:4,textDecoration:'none'}}>
        <svg width="11" height="9" viewBox="0 0 71 55" fill={DISCORD_BLUE}><path d="M60.1 4.9A58.6 58.6 0 0045.6.6a40.9 40.9 0 00-1.9 3.8 54.2 54.2 0 00-16.3 0A38.7 38.7 0 0025.5.6 58.4 58.4 0 0011 4.9C1.6 18.9-1 32.5.3 45.9a59.1 59.1 0 0018 9.1 43.5 43.5 0 003.8-6.1 38.4 38.4 0 01-6-2.9l1.5-1.1a42.1 42.1 0 0036.2 0l1.5 1.1a38.3 38.3 0 01-6 2.9 43.3 43.3 0 003.8 6.1 58.8 58.8 0 0018-9 55 55 0 00-10.9-41zm-37.9 33.6c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.5 0 6.4 3.2 6.4 7.1-.1 3.9-2.9 7.1-6.4 7.1zm23.6 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.5 0 6.4 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1z"/></svg>
        <span style={{fontFamily:'monospace',fontSize:8,color:DISCORD_BLUE}}>Discord</span>
      </a>

      <div style={{width:1,height:12,background:BORDER}}/>

      {/* Vercel deploy */}
      <a href={BRAND.vercel_url} target="_blank" rel="noopener noreferrer"
        style={{display:'flex',alignItems:'center',gap:4,textDecoration:'none'}}>
        <span style={{fontFamily:'monospace',fontSize:9,color:TEXT_BRIGHT}}>▲</span>
        <span style={{fontFamily:'monospace',fontSize:8,color:TEXT}}>deevo-monitor.vercel.app</span>
      </a>

      {/* Last commit */}
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
        <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM}}>last commit:</span>
        <span style={{fontFamily:'monospace',fontSize:7,background:`${PURPLE}15`,color:PURPLE,padding:'1px 5px',borderRadius:2}}>{gh.last_commit_sha}</span>
        <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM}}>{gh.last_commit}</span>
        <div style={{width:4,height:4,borderRadius:'50%',background:gh.loaded?GREEN:AMBER,animation:'pulse 2s infinite'}}/>
      </div>
    </div>
  );
}
function GCCMap({ layers, activeCountry, setActiveCountry, activeEvent, is3D }:
  { layers: MapLayer[]; activeCountry: GCCCode|null; setActiveCountry: (c:GCCCode|null)=>void; activeEvent: GeoEvent|null; is3D: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);
  const activeLayerIds = layers.filter(l=>l.active).map(l=>l.id);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    function draw(ts: number) {
      tRef.current = ts;
      const W = canvas!.width, H = canvas!.height;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = BG; ctx.fillRect(0,0,W,H);

      // Grid lines
      ctx.strokeStyle = '#0a160c'; ctx.lineWidth = 0.5;
      for (let x=0; x<W; x+=50) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y=0; y<H; y+=50) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Map projection: GCC + surrounding region
      // Bounding box: lng 25–80, lat 10–40 → canvas
      const lngMin=20, lngMax=95, latMin=5, latMax=42;
      const tx = (lng: number) => (lng-lngMin)/(lngMax-lngMin)*W;
      const ty = (lat: number) => (1-(lat-latMin)/(latMax-latMin))*H;

      // Arabian Peninsula fill
      const pen = [[29,30],[38,28],[45,22],[53,23],[58,22],[60,23],[65,22],[60,20],[58,15],[50,11],[44,12],[40,15],[35,18],[28,25],[28,30]] as Array<[number,number]>;
      ctx.beginPath();
      pen.forEach(([lng,lat],i) => i===0 ? ctx.moveTo(tx(lng),ty(lat)) : ctx.lineTo(tx(lng),ty(lat)));
      ctx.closePath();
      ctx.fillStyle = '#081409'; ctx.fill();
      ctx.strokeStyle = '#152a18'; ctx.lineWidth = 1; ctx.stroke();

      // Persian Gulf
      const gulf = [[47,24],[48,26],[50,27],[51,28],[53,26],[56,25],[57,23],[55,22],[52,23],[49,24]] as Array<[number,number]>;
      ctx.beginPath();
      gulf.forEach(([lng,lat],i) => i===0 ? ctx.moveTo(tx(lng),ty(lat)) : ctx.lineTo(tx(lng),ty(lat)));
      ctx.closePath();
      ctx.fillStyle = '#060f14'; ctx.fill();
      ctx.strokeStyle = '#0a2030'; ctx.lineWidth = 0.5; ctx.stroke();
      ctx.fillStyle = '#0d2535'; ctx.fillText('PERSIAN GULF', tx(51),ty(26));

      // Red Sea
      ctx.fillStyle = '#060f14'; ctx.strokeStyle = '#0a2030'; ctx.lineWidth = 0.5;
      ctx.beginPath();
      ([[32,28],[32,24],[38,14],[43,12],[42,15],[36,20],[32,28]] as [number,number][]).forEach(([l,a],i) => i===0 ? ctx.moveTo(tx(l),ty(a)) : ctx.lineTo(tx(l),ty(a)));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // Arabian Sea  
      ctx.fillStyle = '#060f14'; ctx.strokeStyle = '#0a2030';
      ctx.beginPath();
      ([[56,22],[65,22],[72,20],[65,10],[55,10],[50,13],[56,22]] as [number,number][]).forEach(([l,a],i) => i===0 ? ctx.moveTo(tx(l),ty(a)) : ctx.lineTo(tx(l),ty(a)));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // Iran
      ctx.fillStyle = '#0c1a0d'; ctx.strokeStyle = '#1e3522'; ctx.lineWidth = 0.5;
      ctx.beginPath();
      ([[43,38],[55,38],[63,38],[62,32],[58,25],[56,25],[53,26],[50,27],[48,26],[47,24],[43,27],[43,38]] as [number,number][]).forEach(([l,a],i) => i===0 ? ctx.moveTo(tx(l),ty(a)) : ctx.lineTo(tx(l),ty(a)));
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2a3d2c'; ctx.font = '9px monospace';
      ctx.fillText('IRAN', tx(55), ty(34));

      // Iraq
      ctx.fillStyle = '#0b170c';
      ctx.beginPath();
      ([[38,33],[47,33],[47,29],[43,27],[38,30],[37,33]] as [number,number][]).forEach(([l,a],i) => i===0 ? ctx.moveTo(tx(l),ty(a)) : ctx.lineTo(tx(l),ty(a)));
      ctx.closePath(); ctx.fill();

      // Trade corridors
      if (activeLayerIds.includes('trade')) {
        GLOBAL_PARTNERS.forEach(p => {
          const gccCx = GCC_COUNTRIES.reduce((s,c)=>s+tx(c.lng),0)/GCC_COUNTRIES.length;
          const gccCy = GCC_COUNTRIES.reduce((s,c)=>s+ty(c.lat),0)/GCC_COUNTRIES.length;
          const px = tx(p.lng), py = ty(p.lat);
          const alpha = 0.08 + 0.05*Math.sin(ts/2000 + p.lat);
          const thickness = Math.min(p.gcc_trade_usd_billion/50, 3);
          ctx.beginPath(); ctx.moveTo(gccCx, gccCy);
          const cpx = (gccCx+px)/2 + (py-gccCy)*0.3;
          const cpy = (gccCy+py)/2 - Math.abs(px-gccCx)*0.2;
          ctx.quadraticCurveTo(cpx, cpy, px, py);
          ctx.strokeStyle = `rgba(245,158,11,${alpha})`; ctx.lineWidth = thickness; ctx.stroke();
        });
      }

      // Chokepoint risk rings
      if (activeLayerIds.includes('chokepoints')) {
        CHOKEPOINTS.forEach(c => {
          const x = tx(c.lng), y = ty(c.lat);
          const pulse = (Math.sin(ts/800+c.lat)+1)/2;
          const color = RISK_COLORS[c.riskLevel] || '#888';
          ctx.beginPath(); ctx.arc(x, y, 8+pulse*8, 0, Math.PI*2);
          ctx.strokeStyle = `${color}40`; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2);
          ctx.fillStyle = color+'cc'; ctx.fill();
          ctx.fillStyle = TEXT_DIM; ctx.font = '8px monospace';
          ctx.fillText(c.name.split(' ')[2]||c.name.split(' ')[0], x+6, y-6);
        });
      }

      // Active event arc
      if (activeEvent?.target_lat && activeEvent?.target_lng) {
        const ox = tx(activeEvent.origin_lng), oy = ty(activeEvent.origin_lat);
        const dx = tx(activeEvent.target_lng!), dy = ty(activeEvent.target_lat!);
        const phase = (ts % 2000) / 2000;
        // Pulsing launch trail
        for (let i=0; i<12; i++) {
          const p = (phase + i/12) % 1;
          const cpx = (ox+dx)/2, cpy = Math.min(oy,dy)-60;
          const bx = (1-p)*(1-p)*ox + 2*(1-p)*p*cpx + p*p*dx;
          const by = (1-p)*(1-p)*oy + 2*(1-p)*p*cpy + p*p*dy;
          ctx.beginPath(); ctx.arc(bx, by, 3-i*0.2, 0, Math.PI*2);
          ctx.fillStyle = `rgba(239,68,68,${0.8-i*0.06})`; ctx.fill();
        }
        // Origin flash
        ctx.beginPath(); ctx.arc(ox,oy,6+((Math.sin(ts/200)+1)/2)*8,0,Math.PI*2);
        ctx.strokeStyle = '#ef444480'; ctx.lineWidth=1.5; ctx.stroke();
      }

      // GCC country nodes
      GCC_COUNTRIES.forEach(c => {
        const x = tx(c.lng), y = ty(c.lat);
        const isActive = c.code === activeCountry;
        const pulse = (Math.sin(ts/1200+c.lng)+1)/2;
        const gdpRadius = Math.sqrt(c.gdp_usd_billion/1072) * 22;

        // GDP bubble
        if (activeLayerIds.includes('gdp')) {
          ctx.beginPath(); ctx.arc(x, y, gdpRadius, 0, Math.PI*2);
          ctx.fillStyle = `${c.color}18`; ctx.fill();
          ctx.strokeStyle = `${c.color}40`; ctx.lineWidth=1; ctx.stroke();
        }

        // Outer pulse ring
        ctx.beginPath(); ctx.arc(x, y, isActive ? 18+pulse*6 : 12+pulse*4, 0, Math.PI*2);
        ctx.strokeStyle = isActive ? c.color : c.color+'60'; ctx.lineWidth = isActive?2:1; ctx.stroke();

        // Center dot
        ctx.beginPath(); ctx.arc(x, y, isActive ? 7 : 5, 0, Math.PI*2);
        ctx.fillStyle = c.color; ctx.fill();

        // Airport dots
        if (activeLayerIds.includes('airports')) {
          c.airports.forEach(a => {
            const ax = tx(a.lng), ay = ty(a.lat);
            const apulse = (Math.sin(ts/900+a.lat)+1)/2;
            ctx.beginPath(); ctx.arc(ax, ay, 3+apulse*2, 0, Math.PI*2);
            ctx.fillStyle = '#06b6d4'; ctx.fill();
            // Runway lines
            ctx.beginPath(); ctx.moveTo(ax-6,ay); ctx.lineTo(ax+6,ay);
            ctx.strokeStyle = '#06b6d480'; ctx.lineWidth=1.5; ctx.stroke();
            if (a.type === 'mega') {
              ctx.font='7px monospace'; ctx.fillStyle='#06b6d4bb';
              ctx.fillText(a.iata, ax+5, ay-5);
            }
          });
        }

        // Country label
        ctx.font = `${isActive?'bold ':''  }10px monospace`;
        ctx.fillStyle = isActive ? TEXT_BRIGHT : TEXT;
        ctx.fillText(c.code, x+8, y-8);
        if (isActive) {
          ctx.font = '8px monospace'; ctx.fillStyle = c.color;
          ctx.fillText(`$${c.gdp_usd_billion}B`, x+8, y+4);
        }
      });

      // Global partner dots
      if (activeLayerIds.includes('trade')) {
        GLOBAL_PARTNERS.forEach(p => {
          const x = tx(p.lng), y = ty(p.lat);
          if (x<0||x>W||y<0||y>H) return;
          ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2);
          ctx.fillStyle = p.color+'cc'; ctx.fill();
          ctx.font='7px monospace'; ctx.fillStyle=p.color+'aa';
          ctx.fillText(p.code, x+5, y-4);
        });
      }

      // Oil pipelines
      if (activeLayerIds.includes('oil_pipes')) {
        const pipes = [[46.7,24.7,56.4,24.5],[46.7,24.7,50.5,29.4],[51.5,25.3,50.5,29.4]] as [number,number,number,number][];
        pipes.forEach(([lx,ly,lx2,ly2]) => {
          const phase = (ts%3000)/3000;
          ctx.beginPath();
          ctx.moveTo(tx(lx),ty(ly)); ctx.lineTo(tx(lx2),ty(ly2));
          ctx.strokeStyle='#ef444440'; ctx.lineWidth=2;
          ctx.setLineDash([8,8]); ctx.lineDashOffset = -phase*16;
          ctx.stroke(); ctx.setLineDash([]);
        });
      }

      // D-Blur layer (redacted blocks)
      if (activeLayerIds.includes('d_blur')) {
        const redacted = [{x:tx(53),y:ty(26)},{x:tx(47),y:ty(29)},{x:tx(43),y:ty(28)}];
        redacted.forEach(r => {
          ctx.fillStyle='#64748b20'; ctx.fillRect(r.x-20,r.y-10,40,20);
          ctx.fillStyle='#64748b'; ctx.font='7px monospace';
          ctx.fillText('[REDACTED]',r.x-18,r.y+3);
        });
      }

      // Sovereign fund arcs
      if (activeLayerIds.includes('sovereign')) {
        GCC_COUNTRIES.forEach(c => {
          if (!c.sovereign_fund_usd_billion) return;
          const x = tx(c.lng), y = ty(c.lat);
          const r = Math.sqrt(c.sovereign_fund_usd_billion/1500)*35;
          const sweep = ((ts/8000)%1)*Math.PI*2;
          ctx.beginPath(); ctx.arc(x, y, r, sweep, sweep+Math.PI*0.8);
          ctx.strokeStyle = `${c.color}30`; ctx.lineWidth=2; ctx.stroke();
        });
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [layers, activeCountry, activeEvent]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX-rect.left)/rect.width*canvas.width;
    const my = (e.clientY-rect.top)/rect.height*canvas.height;
    const W = canvas.width, H = canvas.height;
    const lngMin=20,lngMax=95,latMin=5,latMax=42;
    const tx2 = (lng:number) => (lng-lngMin)/(lngMax-lngMin)*W;
    const ty2 = (lat:number) => (1-(lat-latMin)/(latMax-latMin))*H;
    const hit = GCC_COUNTRIES.find(c => Math.hypot(tx2(c.lng)-mx, ty2(c.lat)-my) < 20);
    setActiveCountry(hit ? (hit.code === activeCountry ? null : hit.code) : null);
  }, [activeCountry, setActiveCountry]);

  return (
    <canvas ref={canvasRef} width={900} height={540}
      style={{width:'100%',height:'100%',display:'block',cursor:'crosshair'}}
      onClick={handleClick}
    />
  );
}

// ─── MARKET TICKER ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MarketTicker({ market }: { market: any }) {
  const all = [
    ...market.commodities.map((c:any)=>({sym:c.symbol,val:Number(c.price).toFixed(2),chg:Number(c.changePct??c.change??0),type:'commodity'})),
    ...market.forex.slice(0,4).map((f:any)=>({sym:f.symbol,val:Number(f.price).toFixed(4),chg:Number(f.changePct??f.change??0),type:'forex'})),
    ...market.crypto.map((c:any)=>({sym:c.symbol,val:Number(c.price)>1?Number(c.price).toLocaleString():Number(c.price).toFixed(4),chg:Number(c.changePct??c.change??0),type:'crypto'})),
    ...market.indices.map((i:any)=>({sym:i.symbol,val:Number(i.price).toLocaleString(),chg:Number(i.changePct??i.change??0),type:'index'})),
  ];
  return (
    <div style={{display:'flex',gap:16,overflowX:'auto',padding:'4px 12px',borderBottom:`1px solid ${BORDER}`,flexShrink:0}}>
      {all.map((item,i) => (
        <div key={i} style={{display:'flex',alignItems:'center',gap:5,flexShrink:0}}>
          <span style={{fontFamily:'monospace',fontSize:9,color:TEXT_DIM,letterSpacing:1}}>{item.sym}</span>
          <span style={{fontFamily:'monospace',fontSize:10,color:TEXT_BRIGHT}}>{item.val}</span>
          <span style={{fontFamily:'monospace',fontSize:9,color:item.chg>=0?GREEN:RED}}>{item.chg>=0?'+':''}{typeof item.chg==='number'?item.chg.toFixed(2):item.chg}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── LAYER PANEL ─────────────────────────────────────────────────────────────
function LayerPanel({ layers, onToggle }: { layers: MapLayer[]; onToggle: (id:string)=>void }) {
  const catColors: Record<string,string> = {economic:GREEN,infrastructure:BLUE,sectors:'#ec4899',geopolitical:RED,analytics:'#64748b'};
  return (
    <div style={{width:190,background:BG2,borderRight:`1px solid ${BORDER}`,display:'flex',flexDirection:'column',flexShrink:0,overflowY:'auto'}}>
      <div style={{padding:'8px 12px',borderBottom:`1px solid ${BORDER}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontFamily:'monospace',fontSize:9,color:TEXT_DIM,letterSpacing:2}}>LAYERS</span>
        <span style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM}}>{layers.filter(l=>l.active).length}/{layers.length}</span>
      </div>
      <div style={{padding:'5px 8px'}}>
        <input placeholder="Search layers..." style={{width:'100%',background:BG3,border:`1px solid ${BORDER}`,borderRadius:3,padding:'3px 7px',fontFamily:'monospace',fontSize:9,color:TEXT,outline:'none',boxSizing:'border-box'}} />
      </div>
      {LAYER_CATEGORIES.map(cat => (
        <div key={cat}>
          <div style={{padding:'4px 12px',fontSize:8,fontFamily:'monospace',color:catColors[cat]||TEXT_DIM,letterSpacing:2,borderTop:`1px solid ${BORDER}20`,marginTop:4}}>{cat.toUpperCase()}</div>
          {layers.filter(l=>l.category===cat).map(l => (
            <div key={l.id} onClick={()=>onToggle(l.id)}
              style={{display:'flex',alignItems:'center',gap:7,padding:'5px 12px',cursor:'pointer',borderBottom:`1px solid ${BORDER}15`,transition:'background 0.1s'}}
              onMouseEnter={e=>(e.currentTarget.style.background=BORDER)}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              <div style={{width:12,height:12,border:`1px solid ${l.active?l.color:TEXT_DIM}`,borderRadius:2,background:l.active?`${l.color}30`:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {l.active && <span style={{color:l.color,fontSize:9,lineHeight:1}}>✓</span>}
              </div>
              <div style={{width:6,height:6,borderRadius:'50%',background:l.active?l.color:TEXT_DIM,flexShrink:0}} />
              <span style={{fontFamily:'monospace',fontSize:8.5,color:l.active?TEXT:TEXT_DIM,letterSpacing:0.5}}>{l.label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── GDP CHART ────────────────────────────────────────────────────────────────
function GDPChart({ country }: { country: GCCCountry }) {
  const data = GDP_TIMELINE[country.code];
  const maxGDP = Math.max(...data.map(d=>d.gdp));
  const W=240, H=80, pad=20;
  const gw = W-pad*2, gh = H-pad*1.5;
  const pts = data.map((d,i)=>({
    x: pad + (i/(data.length-1))*gw,
    y: pad + (1-d.gdp/maxGDP)*gh,
    v: d.gdp, yr: d.year,
  }));
  const path = pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  const fill = pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ') + ` L${pts[pts.length-1].x},${H-5} L${pts[0].x},${H-5} Z`;
  return (
    <svg width={W} height={H} style={{display:'block'}}>
      <defs>
        <linearGradient id={`gdpgrad${country.code}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={country.color} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={country.color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Grid */}
      {[0,1,2].map(i => (
        <line key={i} x1={pad} y1={pad+i*gh/2} x2={W-pad} y2={pad+i*gh/2} stroke={BORDER} strokeWidth="0.5"/>
      ))}
      {/* Fill */}
      <path d={fill} fill={`url(#gdpgrad${country.code})`}/>
      {/* Line */}
      <path d={path} fill="none" stroke={country.color} strokeWidth="1.5"/>
      {/* Year labels */}
      {pts.filter((_,i)=>i%2===0).map(p => (
        <text key={p.yr} x={p.x} y={H-2} textAnchor="middle" fill={TEXT_DIM} fontSize="7" fontFamily="monospace">{p.yr}</text>
      ))}
      {/* Latest value */}
      <text x={pts[pts.length-1].x} y={pts[pts.length-1].y-5} textAnchor="end" fill={country.color} fontSize="8" fontFamily="monospace">${pts[pts.length-1].v}B</text>
    </svg>
  );
}

// ─── COUNTRY DETAIL PANEL ────────────────────────────────────────────────────
function CountryDetail({ country, instability, onClose }: { country: GCCCountry; instability?: import('./InstabilityScore').InstabilityScore; onClose: ()=>void }) {
  const [tab, setTab] = useState<'overview'|'sectors'|'airports'|'markets'>('overview');
  return (
    <div style={{width:320,background:BG2,borderLeft:`1px solid ${BORDER}`,display:'flex',flexDirection:'column',flexShrink:0}}>
      <div style={{padding:'8px 12px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:10,height:10,borderRadius:'50%',background:country.color}}/>
          <span style={{fontFamily:'monospace',fontSize:11,color:TEXT_BRIGHT,letterSpacing:2}}>{country.name.toUpperCase()}</span>
        </div>
        <span onClick={onClose} style={{fontFamily:'monospace',fontSize:14,color:TEXT_DIM,cursor:'pointer'}}>×</span>
      </div>
      {/* Tabs */}
      <div style={{display:'flex',borderBottom:`1px solid ${BORDER}`}}>
        {(['overview','sectors','airports','markets'] as const).map(t=>(
          <div key={t} onClick={()=>setTab(t)}
            style={{flex:1,padding:'6px 0',textAlign:'center',fontFamily:'monospace',fontSize:8,
              color:tab===t?country.color:TEXT_DIM,borderBottom:tab===t?`2px solid ${country.color}`:'2px solid transparent',
              cursor:'pointer',letterSpacing:1}}>
            {t.toUpperCase()}
          </div>
        ))}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'10px 12px'}}>
        {tab==='overview' && (
          <div>
            {/* GDP Chart */}
            <div style={{marginBottom:12}}>
              <div style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,marginBottom:6,letterSpacing:1}}>GDP TREND (USD BILLION)</div>
              <GDPChart country={country}/>
            </div>
            {/* Key metrics */}
            {[
              {l:'GDP 2024',v:`$${country.gdp_usd_billion.toLocaleString()}B`,color:country.color},
              {l:'GDP Growth',v:`+${country.gdp_growth_pct}%`,color:GREEN},
              {l:'GDP per Capita',v:`$${country.gdp_per_capita.toLocaleString()}`,color:TEXT},
              {l:'Population',v:`${country.population_million}M`,color:TEXT},
              {l:'Oil Revenue',v:`${country.oil_revenue_pct}%`,color:AMBER},
              {l:'Credit Rating',v:country.credit_rating,color:country.credit_rating.startsWith('AA')?GREEN:country.credit_rating.startsWith('A')?TEXT:AMBER},
              {l:'Sovereign Fund',v:`$${country.sovereign_fund_usd_billion}B`,color:BLUE},
              {l:'Currency',v:`${country.currency} = $${(1/country.exchange_rate_usd).toFixed(4)}`,color:TEXT},
            ].map(m=>(
              <div key={m.l} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:`1px solid ${BORDER}20`}}>
                <span style={{fontFamily:'monospace',fontSize:9,color:TEXT_DIM}}>{m.l}</span>
                <span style={{fontFamily:'monospace',fontSize:9,fontWeight:'bold',color:m.color}}>{m.v}</span>
              </div>
            ))}
            <div style={{marginTop:8,padding:'6px',background:BG3,borderRadius:4,border:`1px solid ${BORDER}`}}>
              <div style={{fontFamily:'monospace',fontSize:8,color:country.color,marginBottom:3}}>{country.vision_plan}</div>
              <div style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM}}>National development roadmap</div>
            </div>
            {instability && (
              <div style={{marginTop:8,background:BG3,border:`1px solid ${BORDER}`,borderRadius:4,padding:'8px 10px'}}>
                <div style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,letterSpacing:1,marginBottom:6}}>CORTEX INSTABILITY INDEX</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                  <span style={{fontFamily:'monospace',fontSize:16,color:instability.score>=60?RED:instability.score>=35?AMBER:GREEN,fontWeight:'bold'}}>{instability.score}</span>
                  <span style={{fontFamily:'monospace',fontSize:8,padding:'2px 6px',borderRadius:2,background:`${instability.score>=60?RED:instability.score>=35?AMBER:GREEN}20`,color:instability.score>=60?RED:instability.score>=35?AMBER:GREEN}}>{instability.label}</span>
                </div>
                <div style={{height:4,background:BORDER,borderRadius:2,marginBottom:8}}>
                  <div style={{width:`${instability.score}%`,height:'100%',background:instability.score>=60?RED:instability.score>=35?AMBER:GREEN,borderRadius:2,transition:'width 0.4s'}}/>
                </div>
                {Object.entries(instability.breakdown).map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'2px 0'}}>
                    <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,textTransform:'capitalize'}}>{k}</span>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <div style={{width:60,height:2,background:BORDER,borderRadius:1}}>
                        <div style={{width:`${v}%`,height:'100%',background:v>=60?RED:v>=35?AMBER:GREEN,borderRadius:1}}/>
                      </div>
                      <span style={{fontFamily:'monospace',fontSize:7,color:TEXT,minWidth:20,textAlign:'right'}}>{v}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab==='sectors' && (
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {country.sectors.map(s=>(
              <div key={s.id} style={{background:BG3,border:`1px solid ${BORDER}`,borderRadius:4,padding:'8px 10px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontFamily:'monospace',fontSize:9,color:TEXT_BRIGHT}}>{s.label}</span>
                  <span style={{fontFamily:'monospace',fontSize:9,color:s.growth_pct>10?GREEN:s.growth_pct>5?AMBER:TEXT}}>+{s.growth_pct}%</span>
                </div>
                <div style={{height:3,background:BORDER,borderRadius:2,marginBottom:6}}>
                  <div style={{width:`${s.gdp_contribution_pct}%`,height:'100%',background:country.color,borderRadius:2}}/>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <span style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM}}>GDP: {s.gdp_contribution_pct}%</span>
                  <span style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM}}>Cap: ${s.market_cap_usd_billion}B</span>
                  <span style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM}}>Pvt: {s.private_pct}%</span>
                </div>
                <div style={{marginTop:4,display:'flex',flexWrap:'wrap',gap:3}}>
                  {s.subsectors.slice(0,3).map(sub=>(
                    <span key={sub} style={{fontFamily:'monospace',fontSize:7,background:`${country.color}15`,color:country.color,padding:'1px 5px',borderRadius:2}}>{sub}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==='airports' && (
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {country.airports.map(a=>(
              <div key={a.iata} style={{background:BG3,border:`1px solid ${a.type==='mega'?'#06b6d460':BORDER}`,borderRadius:4,padding:'10px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <div>
                    <span style={{fontFamily:'monospace',fontSize:12,color:'#06b6d4',fontWeight:'bold'}}>{a.iata}</span>
                    <span style={{fontFamily:'monospace',fontSize:7,color:'#06b6d460',marginLeft:6}}>{a.icao}</span>
                  </div>
                  <span style={{fontFamily:'monospace',fontSize:7,background:a.type==='mega'?'#06b6d420':'transparent',color:'#06b6d4',padding:'2px 6px',borderRadius:10,border:'1px solid #06b6d430'}}>{a.type.toUpperCase()}</span>
                </div>
                <div style={{fontFamily:'monospace',fontSize:9,color:TEXT,marginBottom:6}}>{a.name}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
                  {[
                    {l:'PAX Annual',v:`${a.pax_annual_million}M`},
                    {l:'Capacity',v:`${a.capacity_pax_million}M`},
                    {l:'Cargo',v:`${(a.cargo_tonnes_annual/1000).toFixed(0)}K t`},
                    {l:'Runways',v:a.runways.toString()},
                    {l:'Airlines',v:a.airlines_count.toString()},
                    {l:'Destinations',v:a.destinations.toString()},
                  ].map(m=>(
                    <div key={m.l}>
                      <div style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM}}>{m.l}</div>
                      <div style={{fontFamily:'monospace',fontSize:9,color:TEXT_BRIGHT}}>{m.v}</div>
                    </div>
                  ))}
                </div>
                {a.hub_for.length>0 && (
                  <div style={{marginTop:6,display:'flex',gap:4}}>
                    {a.hub_for.map(h=>(
                      <span key={h} style={{fontFamily:'monospace',fontSize:7,background:'#06b6d415',color:'#06b6d4',padding:'1px 6px',borderRadius:2}}>{h}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {tab==='markets' && (
          <div>
            <div style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,marginBottom:8,letterSpacing:1}}>STOCK INDICES</div>
            {MARKET_SYMBOLS.indices.filter(i=>i.country===country.code).map(idx=>(
              <div key={idx.symbol} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${BORDER}20`}}>
                <span style={{fontFamily:'monospace',fontSize:9,color:TEXT}}>{idx.name}</span>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <span style={{fontFamily:'monospace',fontSize:9,color:TEXT_BRIGHT}}>{idx.price.toLocaleString()}</span>
                  <span style={{fontFamily:'monospace',fontSize:8,color:idx.change>=0?GREEN:RED}}>{idx.change>=0?'+':''}{idx.change.toFixed(2)}%</span>
                </div>
              </div>
            ))}
            <div style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,marginTop:10,marginBottom:6,letterSpacing:1}}>FOREX</div>
            {MARKET_SYMBOLS.forex.filter(f=>f.symbol.includes(country.currency)).map(fx=>(
              <div key={fx.symbol} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:`1px solid ${BORDER}20`}}>
                <span style={{fontFamily:'monospace',fontSize:9,color:TEXT}}>{fx.name}</span>
                <span style={{fontFamily:'monospace',fontSize:9,color:TEXT_BRIGHT}}>{fx.price.toFixed(4)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EVENT IMPACT PANEL ───────────────────────────────────────────────────────
function EventImpactPanel({ events, news, activeEvent, setActiveEvent }: {
  events: GeoEvent[]; news: NewsItem[]; activeEvent: GeoEvent|null; setActiveEvent: (e:GeoEvent|null)=>void;
}) {
  const sevColor: Record<string,string> = {CRITICAL:RED,HIGH:AMBER,MEDIUM:'#84cc16',LOW:GREEN};
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
      <div style={{padding:'6px 12px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
        <div style={{width:6,height:6,borderRadius:'50%',background:RED,animation:'pulse 1s infinite'}}/>
        <span style={{fontFamily:'monospace',fontSize:9,color:TEXT_DIM,letterSpacing:2}}>LIVE INTELLIGENCE FEED</span>
        <span style={{fontFamily:'monospace',fontSize:8,background:`${RED}20`,color:RED,padding:'1px 6px',borderRadius:2}}>{news.length > 0 ? news.length : events.length} SIGNALS</span>
      </div>
      <div style={{flex:1,overflowY:'auto'}}>
        {events.map(evt=>(
          <div key={evt.id} onClick={()=>setActiveEvent(evt.id===activeEvent?.id?null:evt)}
            style={{padding:'8px 12px',borderBottom:`1px solid ${BORDER}20`,cursor:'pointer',
              background:evt.id===activeEvent?.id?`${BORDER}`:BG2,
              borderLeft:`2px solid ${evt.id===activeEvent?.id?sevColor[evt.severity]:'transparent'}`}}>
            <div style={{display:'flex',gap:6,marginBottom:4,alignItems:'center'}}>
              <span style={{fontFamily:'monospace',fontSize:8,color:sevColor[evt.severity],background:`${sevColor[evt.severity]}15`,padding:'1px 6px',borderRadius:2,letterSpacing:1}}>{evt.severity}</span>
              <span style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,background:`${BG3}`,padding:'1px 6px',borderRadius:2}}>{evt.type.toUpperCase()}</span>
              <span style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,marginLeft:'auto'}}>{new Date(evt.timestamp).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</span>
            </div>
            <div style={{fontFamily:'monospace',fontSize:9,color:TEXT_BRIGHT,marginBottom:4,lineHeight:1.4}}>{evt.title}</div>
            <div style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,lineHeight:1.4}}>{evt.description}</div>
            {evt.id===activeEvent?.id && (
              <div style={{marginTop:8}}>
                <div style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,letterSpacing:1,marginBottom:6}}>IMPACT VECTORS</div>
                {evt.impacts.map((imp,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0',borderBottom:`1px solid ${BORDER}15`}}>
                    <span style={{fontFamily:'monospace',fontSize:8,color:TEXT,minWidth:90}}>{imp.asset}</span>
                    <span style={{fontFamily:'monospace',fontSize:9,fontWeight:'bold',
                      color:imp.direction==='UP'?GREEN:imp.direction==='DOWN'?RED:AMBER,minWidth:50}}>
                      {imp.direction==='UP'?'▲':'▼'} {Math.abs(imp.magnitude_pct).toFixed(1)}%
                    </span>
                    <div style={{height:3,flex:1,background:BORDER,borderRadius:2}}>
                      <div style={{width:`${imp.confidence*100}%`,height:'100%',background:imp.direction==='UP'?GREEN:RED,borderRadius:2}}/>
                    </div>
                    <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,minWidth:30}}>{(imp.confidence*100).toFixed(0)}%</span>
                    <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,minWidth:20}}>{imp.timeframe}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI INSIGHTS PANEL (real Anthropic API) ──────────────────────────────────
function AIInsightsPanel({ activeEvent, news, market }: {
  activeEvent: GeoEvent|null;
  news: NewsItem[];
  market: { commodities: Quote[]; forex: Quote[]; crypto: Quote[]; indices: Quote[] };
}) {
  const [brief, setBrief] = useState<CortexBrief>(SEED_BRIEF);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const typeCardColors: Record<string,string> = {
    ENERGY:'#ef4444',FRAUD_ALERT:'#f97316',CLAIMS_SURGE:AMBER,REGULATORY:BLUE,
    AVIATION:'#06b6d4',MARKET:GREEN,HEDGE:'#a855f7',
  };
  const STEPS = ['Ingesting GCC data streams...','Running FRIN signal engine...','Cross-referencing geo vectors...','Generating intelligence brief...'];

  async function runAnalysis() {
    setRunning(true); setStep(1);
    const iv = setInterval(() => setStep(s => Math.min(s+1, 4)), 700);
    const result = await generateCortexBrief(news, market);
    clearInterval(iv);
    setBrief(result);
    setStep(0); setRunning(false);
  }

  // Auto-run on first news load
  useEffect(() => {
    if (news.length > 0 && brief.source === 'seed') { runAnalysis(); }
  }, [news.length]);

  return (
    <div style={{width:220,background:BG2,borderLeft:`1px solid ${BORDER}`,display:'flex',flexDirection:'column',flexShrink:0}}>
      <div style={{padding:'6px 12px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontFamily:'monospace',fontSize:9,color:TEXT_DIM,letterSpacing:2}}>CORTEX AI</span>
        <div style={{display:'flex',alignItems:'center',gap:4,marginLeft:'auto'}}>
          {brief.source==='api' && <div style={{width:5,height:5,borderRadius:'50%',background:GREEN,animation:'pulse 2s infinite'}}/>}
          {brief.source==='seed' && <div style={{width:5,height:5,borderRadius:'50%',background:AMBER}}/>}
          <span style={{fontFamily:'monospace',fontSize:7,color:brief.source!=='seed'?GREEN:AMBER}}>{brief.source!=='seed'?'LIVE':'SEED'}</span>
        </div>
      </div>

      {/* FRISK level */}
      <div style={{padding:'6px 12px',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:6}}>
        <div style={{width:5,height:5,borderRadius:'50%',background:RISK_COLORS[brief.frisk_label]||AMBER,animation:'pulse 1s infinite'}}/>
        <span style={{fontFamily:'monospace',fontSize:8,color:RISK_COLORS[brief.frisk_label]||AMBER,letterSpacing:1}}>FRISK {brief.frisk_level} · {brief.frisk_label}</span>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'8px 10px'}}>
        {running && step > 0 && (
          <div style={{marginBottom:8}}>
            <div style={{height:2,background:BG3,borderRadius:2,marginBottom:6}}>
              <div style={{height:'100%',background:GREEN,borderRadius:2,width:`${(step/4)*100}%`,transition:'width 0.4s'}}/>
            </div>
            <div style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,marginBottom:3}}>Step {step}/4</div>
            <div style={{fontFamily:'monospace',fontSize:9,color:GREEN}}>{STEPS[step-1]}</div>
          </div>
        )}

        {!running && brief.cards.map((card, i) => (
          <div key={i} style={{marginBottom:8,background:BG3,border:`1px solid ${(typeCardColors[card.type]||BORDER)}30`,borderRadius:3,padding:'7px 9px',borderLeft:`2px solid ${typeCardColors[card.type]||BORDER}`}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,alignItems:'flex-start',gap:4}}>
              <span style={{fontFamily:'monospace',fontSize:8,color:typeCardColors[card.type]||TEXT,background:`${typeCardColors[card.type]||BORDER}15`,padding:'1px 5px',borderRadius:2,flexShrink:0}}>{card.type}</span>
              <span style={{fontFamily:'monospace',fontSize:7,color:card.confidence==='HIGH'?GREEN:card.confidence==='MEDIUM'?AMBER:TEXT_DIM}}>{card.confidence}</span>
            </div>
            <div style={{fontFamily:'monospace',fontSize:8.5,color:TEXT_BRIGHT,lineHeight:1.4,marginBottom:4}}>{card.title}</div>
            <div style={{fontFamily:'monospace',fontSize:7.5,color:TEXT,lineHeight:1.5,marginBottom:4}}>{card.narrative}</div>
            <div style={{fontFamily:'monospace',fontSize:7,color:GREEN,lineHeight:1.4,borderTop:`1px solid ${BORDER}`,paddingTop:3,marginBottom:2}}>▶ {card.action}</div>
            <div style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,lineHeight:1.4}}>⚠ {card.risk_caveat}</div>
          </div>
        ))}

        <button onClick={runAnalysis} disabled={running}
          style={{width:'100%',background:running?'transparent':`${GREEN}15`,border:`1px solid ${running?BORDER:GREEN}40`,borderRadius:3,padding:'6px',fontFamily:'monospace',fontSize:8,color:running?TEXT_DIM:GREEN,cursor:running?'default':'pointer',marginTop:4,letterSpacing:1}}>
          {running ? '⟳ ANALYZING...' : '↻ REFRESH CORTEX'}
        </button>
      </div>

      <div style={{padding:'5px 10px',borderTop:`1px solid ${BORDER}`,fontFamily:'monospace',fontSize:7,color:TEXT_DIM}}>
        {brief.generated_at ? new Date(brief.generated_at).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) : '--:--'} UTC
      </div>

    </div>
  );
}

// ─── GCC GDP OVERVIEW ─────────────────────────────────────────────────────────
function GCCOverviewBar({ onSelectCountry }: { onSelectCountry: (c:GCCCode)=>void }) {
  const totalGDP = GCC_COUNTRIES.reduce((s,c)=>s+c.gdp_usd_billion,0);
  return (
    <div style={{display:'flex',gap:8,padding:'6px 12px',borderBottom:`1px solid ${BORDER}`,flexShrink:0,overflowX:'auto'}}>
      <div style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,display:'flex',alignItems:'center',whiteSpace:'nowrap',marginRight:4}}>GCC GDP</div>
      <div style={{fontFamily:'monospace',fontSize:10,color:TEXT_BRIGHT,display:'flex',alignItems:'center',marginRight:12,whiteSpace:'nowrap'}}>${totalGDP.toLocaleString()}B</div>
      {GCC_COUNTRIES.map(c=>(
        <div key={c.code} onClick={()=>onSelectCountry(c.code)}
          style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer',padding:'2px 8px',borderRadius:3,border:`1px solid ${BORDER}`,background:BG3,flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:2}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:c.color}}/>
            <span style={{fontFamily:'monospace',fontSize:8,color:TEXT,letterSpacing:1}}>{c.code}</span>
          </div>
          <span style={{fontFamily:'monospace',fontSize:9,color:c.color,fontWeight:'bold'}}>${c.gdp_usd_billion}B</span>
          <span style={{fontFamily:'monospace',fontSize:7,color:GREEN}}>+{c.gdp_growth_pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── SETTINGS MODAL ───────────────────────────────────────────────────────────
function SettingsModal({ onClose }: { onClose: ()=>void }) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}}>
      <div style={{width:520,maxHeight:'80vh',background:BG2,border:`1px solid ${BORDER2}`,borderRadius:4,display:'flex',flexDirection:'column'}}>
        <div style={{padding:'12px 16px',borderBottom:`1px solid ${BORDER}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontFamily:'monospace',fontSize:11,color:TEXT_BRIGHT,letterSpacing:3}}>CORTEX SETTINGS</span>
          <span onClick={onClose} style={{fontFamily:'monospace',fontSize:16,color:TEXT_DIM,cursor:'pointer'}}>×</span>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:16}}>
          {[
            {label:'Data Refresh Rate',value:'5s (Live)',desc:'How often market data and signals refresh'},
            {label:'Map Tile Provider',value:'CesiumJS → OpenStreetMap',desc:'Geospatial rendering backend'},
            {label:'AI Model',value:'Claude Sonnet 4',desc:'Intelligence brief generation model'},
            {label:'GDP Data Source',value:'IMF WEO 2024',desc:'Macroeconomic data feed'},
            {label:'Airport Data',value:'OurAirports + AviationStack',desc:'Live flight and capacity data'},
            {label:'Market Data',value:'Yahoo Finance + CoinGecko',desc:'Real-time price feeds'},
            {label:'Chokepoint Risk',value:'Lloyd\'s Risk Index',desc:'Maritime risk assessment'},
          ].map(s=>(
            <div key={s.label} style={{marginBottom:14}}>
              <div style={{fontFamily:'monospace',fontSize:10,color:TEXT_BRIGHT,marginBottom:2}}>{s.label}</div>
              <div style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM,marginBottom:6}}>{s.desc}</div>
              <div style={{background:BG3,border:`1px solid ${BORDER}`,borderRadius:3,padding:'6px 10px',fontFamily:'monospace',fontSize:9,color:TEXT}}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DeevoCortex() {
  const [layers, setLayers] = useState<MapLayer[]>(MAP_LAYERS);
  const [activeCountry, setActiveCountry] = useState<GCCCode|null>(null);
  const [activeEvent, setActiveEvent] = useState<GeoEvent|null>(null);
  const [is3D, setIs3D] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBottomTab, setShowBottomTab] = useState<'events'|'market'|'airports'|'webcams'|'flights'|'forecasts'>('events');
  const [rightPanel, setRightPanel] = useState<'profile'|'cortex'|'github'|'discord'>('profile');
  const { data: market, dataSource: marketSource } = useLiveMarket();
  const { news, newsSource } = useLiveNews();

  // Dynamic instability scores + FRISK
  const [instabilityScores, setInstabilityScores] = useState<InstabilityScore[]>([]);
  const [regionFRISK, setRegionFRISK] = useState<{level:1|2|3|4|5;label:string}>({level:3,label:'GUARDED'});

  useEffect(() => {
    const { level, label, scores } = calculateRegionFRISK(GCC_COUNTRIES, SAMPLE_GEO_EVENTS);
    setInstabilityScores(scores);
    setRegionFRISK({ level, label });
  }, [SAMPLE_GEO_EVENTS.length]);
  const time = useLiveTime();
  const gh = useGitHubData();
  const [claimCount, setClaimCount] = useState(8547);

  useEffect(() => {
    const id = setInterval(() => setClaimCount(p => p + Math.floor(Math.random()*3)), 2000);
    return () => clearInterval(id);
  }, []);

  const toggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => l.id===id ? {...l, active: !l.active} : l));
  }, []);

  const selectedCountry = activeCountry ? GCC_COUNTRIES.find(c=>c.code===activeCountry) : null;

  const dateStr = time.toLocaleString('en-GB', {
    weekday:'short',month:'short',day:'2-digit',
    hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'UTC'
  }).toUpperCase() + ' UTC';

  return (
    <div style={{background:BG,color:TEXT,fontFamily:'monospace',height:'100vh',display:'flex',flexDirection:'column',overflow:'hidden',minHeight:600}}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes blink{0%,100%{opacity:1}49%{opacity:1}50%,99%{opacity:0}}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:${BG}}
        ::-webkit-scrollbar-thumb{background:${BORDER2}}
        button:hover{opacity:0.85}
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{background:BG2,borderBottom:`1px solid ${BORDER}`,padding:'4px 12px',display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
        {/* Logo */}
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:22,height:22,background:`${GREEN}15`,border:`1px solid ${GREEN}40`,borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontSize:11,color:GREEN}}>⬡</span>
          </div>
          <span style={{fontSize:12,color:GREEN,letterSpacing:2,fontWeight:'bold'}}>DEEVO</span>
          <span style={{fontSize:12,color:TEXT_DIM,letterSpacing:1}}>CORTEX</span>
        </div>
        <div style={{width:1,height:14,background:BORDER}}/>
        <span style={{fontSize:9,color:TEXT_DIM}}>v1.0.0</span>
        <div style={{width:6,height:6,borderRadius:'50%',background:GREEN,animation:'pulse 2s infinite'}}/>
        <span style={{fontSize:9,color:GREEN}}>LIVE</span>
        <span style={{fontSize:9,color:TEXT_DIM}}>{dateStr}</span>

        {/* Country selector */}
        <div style={{display:'flex',gap:4,marginLeft:8}}>
          {(['GCC','SA','UAE','KW','QA','BH','OM'] as const).map(c=>(
            <div key={c} onClick={()=>c==='GCC'?setActiveCountry(null):setActiveCountry(c as GCCCode)}
              style={{padding:'2px 7px',borderRadius:2,border:`1px solid ${activeCountry===c||(c==='GCC'&&!activeCountry)?GREEN:BORDER}`,
                background:activeCountry===c||(c==='GCC'&&!activeCountry)?`${GREEN}15`:'transparent',
                fontFamily:'monospace',fontSize:8,color:activeCountry===c||(c==='GCC'&&!activeCountry)?GREEN:TEXT_DIM,
                cursor:'pointer',letterSpacing:1}}>
              {c}
            </div>
          ))}
        </div>

        {/* Right controls */}
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:8}}>
          {/* Risk indicator */}
          <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 8px',border:`1px solid ${AMBER}40`,borderRadius:3,background:`${AMBER}10`}}>
            <div style={{width:5,height:5,borderRadius:'50%',background:AMBER,animation:'pulse 1s infinite'}}/>
            <span style={{fontFamily:'monospace',fontSize:9,color:AMBER,letterSpacing:1}}>{`CORTEX ${regionFRISK.level} · ${regionFRISK.label}`}</span>
          </div>
          <span style={{fontFamily:'monospace',fontSize:8,color:TEXT_DIM}}>{claimCount.toLocaleString()} signals</span>
          <div style={{display:'flex',alignItems:'center',gap:3,padding:'2px 6px',background:marketSource==='live'?`${GREEN}10`:`${AMBER}10`,border:`1px solid ${marketSource==='live'?GREEN:AMBER}30`,borderRadius:2}}>
            <div style={{width:4,height:4,borderRadius:'50%',background:marketSource==='live'?GREEN:AMBER}}/>
            <span style={{fontFamily:'monospace',fontSize:7,color:marketSource==='live'?GREEN:AMBER,letterSpacing:1}}>{marketSource==='live'?'YAHOO LIVE':'SEED DATA'}</span>
          </div>
          <div style={{display:'flex',gap:0}}>
            {['2D','3D'].map((m,i)=>(
              <button key={m} onClick={()=>setIs3D(m==='3D')}
                style={{background:(is3D?m==='3D':m==='2D')?`${GREEN}20`:'transparent',border:`1px solid ${(is3D?m==='3D':m==='2D')?GREEN:BORDER}`,
                  borderRadius:i===0?'2px 0 0 2px':'0 2px 2px 0',padding:'2px 7px',
                  fontFamily:'monospace',fontSize:8,color:(is3D?m==='3D':m==='2D')?GREEN:TEXT_DIM,cursor:'pointer'}}>
                {m}
              </button>
            ))}
          </div>
          <button onClick={()=>setShowSettings(true)} style={{background:'transparent',border:`1px solid ${BORDER}`,borderRadius:3,padding:'2px 7px',fontFamily:'monospace',fontSize:9,color:TEXT_DIM,cursor:'pointer'}}>⚙</button>
          {/* GitHub + Discord quick links */}
          <a href={BRAND.github_url} target="_blank" rel="noopener noreferrer"
            style={{display:'flex',alignItems:'center',gap:4,textDecoration:'none',padding:'2px 7px',border:`1px solid ${GREEN}30`,borderRadius:3,background:`${GREEN}08`}}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill={GREEN}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            <span style={{fontFamily:'monospace',fontSize:8,color:GREEN}}>PyBADR/{BRAND.github_repo}</span>
            <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,background:`${GREEN}15`,padding:'0 3px',borderRadius:2}}>★{gh.stars}</span>
          </a>
          {/* Discord quick link */}
          <a href={BRAND.discord_invite} target="_blank" rel="noopener noreferrer"
            style={{display:'flex',alignItems:'center',gap:4,textDecoration:'none',padding:'2px 7px',border:`1px solid #5865f240`,borderRadius:3,background:'#5865f210'}}>
            <svg width="10" height="8" viewBox="0 0 71 55" fill="#5865f2"><path d="M60.1 4.9A58.6 58.6 0 0045.6.6a40.9 40.9 0 00-1.9 3.8 54.2 54.2 0 00-16.3 0A38.7 38.7 0 0025.5.6 58.4 58.4 0 0011 4.9C1.6 18.9-1 32.5.3 45.9a59.1 59.1 0 0018 9.1 43.5 43.5 0 003.8-6.1 38.4 38.4 0 01-6-2.9l1.5-1.1a42.1 42.1 0 0036.2 0l1.5 1.1a38.3 38.3 0 01-6 2.9 43.3 43.3 0 003.8 6.1 58.8 58.8 0 0018-9 55 55 0 00-10.9-41zm-37.9 33.6c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.5 0 6.4 3.2 6.4 7.1-.1 3.9-2.9 7.1-6.4 7.1zm23.6 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1c3.5 0 6.4 3.2 6.4 7.1 0 3.9-2.8 7.1-6.4 7.1z"/></svg>
            <span style={{fontFamily:'monospace',fontSize:8,color:'#5865f2'}}>Discord</span>
          </a>
        </div>
      </div>

      {/* ── MARKET TICKER ── */}
      <MarketTicker market={market}/>

      {/* ── GDP BAR ── */}
      <GCCOverviewBar onSelectCountry={c=>{setActiveCountry(c===activeCountry?null:c);}}/>

      {/* ── MAIN BODY ── */}
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        <LayerPanel layers={layers} onToggle={toggleLayer}/>

        {/* Center: Map + bottom panels */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          {/* Map */}
          <div style={{flex:1,position:'relative',overflow:'hidden'}}>
            {/* Map label */}
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:'monospace',fontSize:8,color:TEXT_DIM,letterSpacing:4,pointerEvents:'none',zIndex:1,opacity:0.3}}>GCC ECONOMIC INTELLIGENCE REGION</div>
            <GCCGlobe layers={layers} countries={GCC_COUNTRIES} activeCountry={activeCountry} setActiveCountry={(c:string|null)=>setActiveCountry(c as import("@/config/gcc-data").GCCCode|null)} activeEvent={activeEvent} is3D={is3D}/>
            {/* Map overlays */}
            <div style={{position:'absolute',top:8,right:8,display:'flex',flexDirection:'column',gap:3}}>
              {['+','-','⊕'].map(sym=>(
                <button key={sym} style={{width:22,height:22,background:BG2,border:`1px solid ${BORDER}`,borderRadius:2,fontFamily:'monospace',fontSize:12,color:TEXT_DIM,cursor:'pointer'}}>{sym}</button>
              ))}
            </div>
            {/* Legend */}
            <div style={{position:'absolute',bottom:6,left:'50%',transform:'translateX(-50%)',display:'flex',gap:10,background:`${BG}cc`,padding:'3px 10px',borderRadius:3,border:`1px solid ${BORDER}`}}>
              {[{color:RED,label:'CRITICAL'},{color:AMBER,label:'HIGH'},{color:GREEN,label:'NOMINAL'},{color:'#06b6d4',label:'Airport'},{color:'#a855f7',label:'Sovereign'}].map(l=>(
                <div key={l.label} style={{display:'flex',alignItems:'center',gap:3}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:l.color}}/>
                  <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM}}>{l.label}</span>
                </div>
              ))}
            </div>
            {/* Active event badge */}
            {activeEvent && (
              <div style={{position:'absolute',top:8,left:8,background:`${BG2}ee`,border:`1px solid ${RED}40`,borderRadius:3,padding:'6px 10px',maxWidth:220}}>
                <div style={{fontFamily:'monospace',fontSize:8,color:RED,marginBottom:3,letterSpacing:1}}>{activeEvent.severity} EVENT ACTIVE</div>
                <div style={{fontFamily:'monospace',fontSize:9,color:TEXT_BRIGHT}}>{activeEvent.title.slice(0,40)}...</div>
                <div style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,marginTop:2}}>{activeEvent.impacts.length} impact vectors calculated</div>
              </div>
            )}
          </div>

          {/* Bottom panels */}
          <div style={{height:220,borderTop:`1px solid ${BORDER}`,display:'flex',flexDirection:'column',flexShrink:0}}>
            {/* Tab bar */}
            <div style={{display:'flex',borderBottom:`1px solid ${BORDER}`,flexShrink:0}}>
              {[
                {id:'events',label:'LIVE INTELLIGENCE',badge:SAMPLE_GEO_EVENTS.length},
                {id:'market',label:'MARKETS'},
                {id:'airports',label:'AIRPORTS'},
                {id:'webcams',label:'WEBCAMS',badge:'LIVE'},
                {id:'flights',label:'FLIGHTS'},
                {id:'forecasts',label:'AI FORECASTS',badge:12},
              ].map(t=>(
                <div key={t.id} onClick={()=>setShowBottomTab(t.id as typeof showBottomTab)}
                  style={{padding:'5px 14px',fontFamily:'monospace',fontSize:8,
                    color:showBottomTab===t.id?GREEN:TEXT_DIM,
                    borderBottom:showBottomTab===t.id?`2px solid ${GREEN}`:'2px solid transparent',
                    cursor:'pointer',display:'flex',alignItems:'center',gap:6,letterSpacing:1}}>
                  {showBottomTab===t.id && <div style={{width:5,height:5,borderRadius:'50%',background:RED,animation:'pulse 1s infinite'}}/>}
                  {t.label}
                  {t.badge && <span style={{fontFamily:'monospace',fontSize:7,background:`${RED}20`,color:RED,padding:'1px 5px',borderRadius:2}}>{t.badge}</span>}
                </div>
              ))}
            </div>
            <div style={{flex:1,overflow:'hidden',display:'flex'}}>
              {showBottomTab==='events' && (
                <EventImpactPanel events={SAMPLE_GEO_EVENTS} news={news} activeEvent={activeEvent} setActiveEvent={setActiveEvent}/>
              )}
              {showBottomTab==='market' && (
                <div style={{flex:1,overflowY:'auto',padding:'8px 12px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                    {[
                      {title:'COMMODITIES',items:(market.commodities as Quote[]).map(c=>({sym:c.symbol,val:c.price.toFixed(2),chg:c.changePct??c.change}))},
                      {title:'GCC INDICES',items:(market.indices as Quote[]).map(i=>({sym:i.symbol,val:i.price.toLocaleString(),chg:i.changePct??i.change}))},
                      {title:'CRYPTO',items:(market.crypto as Quote[]).map(c=>({sym:c.symbol,val:c.price>1?c.price.toLocaleString():c.price.toFixed(4),chg:c.changePct??c.change}))},
                      {title:'FOREX',items:(market.forex as Quote[]).map(f=>({sym:f.symbol,val:f.price.toFixed(4),chg:f.changePct??f.change}))},
                    ].map(cat=>(
                      <div key={cat.title}>
                        <div style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM,letterSpacing:2,marginBottom:4}}>{cat.title}</div>
                        {cat.items.map(item=>(
                          <div key={item.sym} style={{display:'flex',justifyContent:'space-between',padding:'3px 0',borderBottom:`1px solid ${BORDER}15`}}>
                            <span style={{fontFamily:'monospace',fontSize:8,color:TEXT}}>{item.sym}</span>
                            <div style={{display:'flex',gap:6}}>
                              <span style={{fontFamily:'monospace',fontSize:8,color:TEXT_BRIGHT}}>{item.val}</span>
                              <span style={{fontFamily:'monospace',fontSize:7,color:item.chg>=0?GREEN:RED}}>{item.chg>=0?'+':''}{item.chg.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {showBottomTab==='airports' && (
                <div style={{flex:1,overflowY:'auto',padding:'8px 12px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                    {GCC_COUNTRIES.flatMap(c=>c.airports).sort((a,b)=>b.pax_annual_million-a.pax_annual_million).slice(0,9).map(a=>(
                      <div key={a.iata} style={{background:BG3,border:`1px solid ${a.type==='mega'?'#06b6d440':BORDER}`,borderRadius:3,padding:'8px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                          <span style={{fontFamily:'monospace',fontSize:11,color:'#06b6d4',fontWeight:'bold'}}>{a.iata}</span>
                          <span style={{fontFamily:'monospace',fontSize:7,color:'#06b6d480'}}>{a.type}</span>
                        </div>
                        <div style={{fontFamily:'monospace',fontSize:8,color:TEXT,marginBottom:4}}>{a.city}</div>
                        <div style={{display:'flex',gap:6}}>
                          <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM}}>PAX: <span style={{color:TEXT_BRIGHT}}>{a.pax_annual_million}M</span></span>
                          <span style={{fontFamily:'monospace',fontSize:7,color:TEXT_DIM}}>→ <span style={{color:TEXT_BRIGHT}}>{a.destinations}</span></span>
                        </div>
                        <div style={{height:2,background:BORDER,borderRadius:1,marginTop:5}}>
                          <div style={{width:`${(a.pax_annual_million/a.capacity_pax_million)*100}%`,height:'100%',background:'#06b6d4',borderRadius:1}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {showBottomTab==='webcams' && (
                <div style={{flex:1,overflow:'hidden'}}>
                  <LiveWebcams/>
                </div>
              )}
              {showBottomTab==='flights' && (
                <div style={{flex:1,overflow:'hidden'}}>
                  <FlightTracker/>
                </div>
              )}
              {showBottomTab==='forecasts' && (
                <div style={{flex:1,overflow:'hidden'}}>
                  <AIForecasts news={news} market={market as {commodities:import('@/services/market').Quote[];forex:import('@/services/market').Quote[];crypto:import('@/services/market').Quote[];indices:import('@/services/market').Quote[];}}/>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Country detail OR Social/AI panel */}
        {selectedCountry ? (
          <CountryDetail country={selectedCountry} instability={instabilityScores.find(s=>s.code===selectedCountry.code)} onClose={()=>setActiveCountry(null)}/>
        ) : (
          <div style={{width:220,background:BG2,borderLeft:`1px solid ${BORDER}`,display:'flex',flexDirection:'column',flexShrink:0}}>
            {/* Right panel tabs */}
            <div style={{display:'flex',borderBottom:`1px solid ${BORDER}`,flexShrink:0}}>
              {([
                {id:'profile',label:'PROFILE'},
                {id:'cortex',label:'CORTEX AI'},
                {id:'github',label:'GITHUB'},
                {id:'discord',label:'DISCORD'},
              ] as const).map(t=>(
                <div key={t.id} onClick={()=>setRightPanel(t.id)}
                  style={{flex:1,padding:'6px 0',textAlign:'center',fontFamily:'monospace',fontSize:7.5,
                    color:rightPanel===t.id
                      ?t.id==='github'?'#8b5cf6':t.id==='discord'?'#5865f2':GREEN
                      :TEXT_DIM,
                    borderBottom:rightPanel===t.id
                      ?`2px solid ${t.id==='github'?'#8b5cf6':t.id==='discord'?'#5865f2':GREEN}`
                      :'2px solid transparent',
                    cursor:'pointer',letterSpacing:0.5}}>
                  {t.label}
                </div>
              ))}
            </div>
            {/* Panel content */}
            <div style={{flex:1,overflowY:'auto'}}>
              {rightPanel==='profile' && <div style={{padding:'8px'}}><FounderCard /></div>}
              {rightPanel==='cortex' && <AIInsightsPanel activeEvent={activeEvent} news={news} market={market as {commodities:Quote[];forex:Quote[];crypto:Quote[];indices:Quote[]}}/>}
              {rightPanel==='github' && <div style={{padding:'8px'}}><GitHubCard /></div>}
              {rightPanel==='discord' && <div style={{padding:'8px'}}><DiscordCard /></div>}
            </div>
          </div>
        )}
      </div>

      {/* ── AUTHOR BRANDING FOOTER ── */}
      <AuthorBranding gh={gh}/>

      {showSettings && <SettingsModal onClose={()=>setShowSettings(false)}/>}
    </div>
  );
}
