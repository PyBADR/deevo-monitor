'use client';
import React, { useState, useEffect } from 'react';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const BG = '#040a06';
const BG2 = '#070e09';
const BG3 = '#0b1610';
const BORDER = '#132018';
const BORDER2 = '#1a2e1e';
const GREEN = '#10b981';
const AMBER = '#f59e0b';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const TEXT = '#9dc4a6';
const TEXT_DIM = '#3a5c42';
const TEXT_BRIGHT = '#d4f0d8';
const PURPLE = '#a855f7';

// ─── BRAND CONFIG ────────────────────────────────────────────────────────────
export const BRAND = {
  github_user: 'PyBADR',
  github_repo: 'deevo-monitor',
  github_url: 'https://github.com/PyBADR/deevo-monitor',
  github_org_url: 'https://github.com/PyBADR',
  discord_user: 'Baderalabddan',
  discord_invite: 'https://discord.gg/deevo',
  vercel_url: 'https://deevo-monitor.vercel.app',
  name: 'Bader Alabddan',
  handle: '@Baderalabddan',
  title: 'CEO & CTO · Deevo Analytics',
  tagline: 'GCC Economic Intelligence Platform',
  platform: 'DEEVO CORTEX',
  version: 'v6.0',
  linkedin: 'https://linkedin.com/in/baderalabddan',
  twitter: 'https://x.com/baderalabddan',
};

// ─── GITHUB DATA TYPES ───────────────────────────────────────────────────────
interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  pushed_at: string;
  description: string;
  topics: string[];
  language: string;
  default_branch: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
}

// ─── DISCORD INVITE DATA ─────────────────────────────────────────────────────
interface DiscordData {
  online: number;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  handle: string;
  discriminator: string;
  tag: string;
}

// ─── TIME AGO ────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ─── MINI STATS BOX ──────────────────────────────────────────────────────────
function StatBadge({ icon, value, label, color }: { icon: string; value: string|number; label: string; color: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'5px 8px', background:BG3, borderRadius:3, border:`1px solid ${BORDER}`, minWidth:52 }}>
      <span style={{ fontSize:10, marginBottom:1 }}>{icon}</span>
      <span style={{ fontFamily:'monospace', fontSize:10, fontWeight:'bold', color, lineHeight:1.2 }}>{value}</span>
      <span style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM, letterSpacing:0.5, marginTop:1 }}>{label}</span>
    </div>
  );
}

// ─── GITHUB CARD ─────────────────────────────────────────────────────────────
export function GitHubCard({ compact = false }: { compact?: boolean }) {
  const [repo, setRepo] = useState<GitHubRepo|null>(null);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const base = `https://api.github.com/repos/${BRAND.github_user}/${BRAND.github_repo}`;
    Promise.all([
      fetch(base).then(r=>r.json()),
      fetch(`${base}/commits?per_page=5`).then(r=>r.json()),
      fetch(`${base}/releases?per_page=3`).then(r=>r.json()),
    ]).then(([r,c,rel]) => {
      if (r.stargazers_count !== undefined) setRepo(r);
      if (Array.isArray(c)) setCommits(c);
      if (Array.isArray(rel)) setReleases(rel);
      setLoading(false);
    }).catch(() => { setError(true); setLoading(false); });
  }, []);

  if (compact) {
    return (
      <a href={BRAND.github_url} target="_blank" rel="noreferrer"
        style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 8px', background:BG3,
          border:`1px solid ${BORDER2}`, borderRadius:3, textDecoration:'none', cursor:'pointer' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill={GREEN}>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span style={{ fontFamily:'monospace', fontSize:8, color:GREEN }}>PyBADR</span>
        {repo && <span style={{ fontFamily:'monospace', fontSize:8, color:TEXT_DIM }}>★{repo.stargazers_count}</span>}
      </a>
    );
  }

  return (
    <div style={{ background:BG2, border:`1px solid ${BORDER2}`, borderRadius:4, overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'8px 12px', borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', gap:8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill={GREEN}>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <a href={BRAND.github_url} target="_blank" rel="noreferrer"
          style={{ fontFamily:'monospace', fontSize:10, color:GREEN, textDecoration:'none', letterSpacing:1 }}>
          {BRAND.github_user}/{BRAND.github_repo}
        </a>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:loading?AMBER:error?RED:GREEN }} />
          <span style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM }}>{loading?'LOADING...':error?'OFFLINE':'LIVE'}</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding:'8px 12px', display:'flex', gap:6, borderBottom:`1px solid ${BORDER}` }}>
        <StatBadge icon="★" value={repo?.stargazers_count ?? '—'} label="STARS" color={AMBER} />
        <StatBadge icon="⑂" value={repo?.forks_count ?? '—'} label="FORKS" color={BLUE} />
        <StatBadge icon="◎" value={repo?.watchers_count ?? '—'} label="WATCH" color={GREEN} />
        <StatBadge icon="●" value={repo?.open_issues_count ?? '—'} label="ISSUES" color={repo?.open_issues_count?RED:GREEN} />
      </div>

      {/* Description */}
      {repo?.description && (
        <div style={{ padding:'6px 12px', borderBottom:`1px solid ${BORDER}`, fontFamily:'monospace', fontSize:8, color:TEXT_DIM, lineHeight:1.5 }}>
          {repo.description}
        </div>
      )}

      {/* Topics */}
      {repo?.topics && repo.topics.length > 0 && (
        <div style={{ padding:'5px 12px', borderBottom:`1px solid ${BORDER}`, display:'flex', flexWrap:'wrap', gap:3 }}>
          {repo.topics.slice(0,6).map(t => (
            <span key={t} style={{ fontFamily:'monospace', fontSize:7, background:`${BLUE}15`, color:BLUE, padding:'1px 5px', borderRadius:8, border:`1px solid ${BLUE}30` }}>{t}</span>
          ))}
        </div>
      )}

      {/* Recent commits */}
      <div style={{ padding:'6px 12px', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM, letterSpacing:1, marginBottom:5 }}>RECENT COMMITS</div>
        {commits.slice(0,4).map(c => (
          <div key={c.sha} style={{ display:'flex', gap:6, padding:'3px 0', borderBottom:`1px solid ${BORDER}15` }}>
            <span style={{ fontFamily:'monospace', fontSize:7, color:GREEN, flexShrink:0 }}>{c.sha.slice(0,7)}</span>
            <span style={{ fontFamily:'monospace', fontSize:7.5, color:TEXT, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {c.commit.message.split('\n')[0].slice(0,48)}
            </span>
            <span style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM, flexShrink:0 }}>{timeAgo(c.commit.author.date)}</span>
          </div>
        ))}
        {commits.length === 0 && !loading && (
          <div style={{ fontFamily:'monospace', fontSize:8, color:TEXT_DIM, textAlign:'center', padding:'8px 0' }}>
            {error ? 'GitHub API rate limit — try again in 60s' : 'No commits loaded'}
          </div>
        )}
      </div>

      {/* Releases */}
      {releases.length > 0 && (
        <div style={{ padding:'6px 12px', borderBottom:`1px solid ${BORDER}` }}>
          <div style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM, letterSpacing:1, marginBottom:5 }}>RELEASES</div>
          {releases.slice(0,2).map(r => (
            <div key={r.tag_name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'3px 0' }}>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ fontFamily:'monospace', fontSize:8, color:r.prerelease?AMBER:GREEN, background:`${r.prerelease?AMBER:GREEN}15`, padding:'1px 5px', borderRadius:2 }}>{r.tag_name}</span>
                <span style={{ fontFamily:'monospace', fontSize:8, color:TEXT }}>{r.name?.slice(0,28)}</span>
              </div>
              <span style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM }}>{timeAgo(r.published_at)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer link */}
      <div style={{ padding:'6px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM }}>
          Lang: <span style={{ color:BLUE }}>{repo?.language || 'TypeScript'}</span>
        </span>
        <a href={BRAND.github_url} target="_blank" rel="noreferrer"
          style={{ fontFamily:'monospace', fontSize:7, color:GREEN, textDecoration:'none', letterSpacing:1 }}>
          VIEW ON GITHUB →
        </a>
      </div>
    </div>
  );
}

// ─── DISCORD CARD ─────────────────────────────────────────────────────────────
export function DiscordCard({ compact = false }: { compact?: boolean }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(id);
  }, []);

  if (compact) {
    return (
      <a href={BRAND.discord_invite} target="_blank" rel="noreferrer"
        style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 8px', background:BG3,
          border:`1px solid #5865f220`, borderRadius:3, textDecoration:'none', cursor:'pointer' }}>
        <svg width="13" height="10" viewBox="0 0 71 55" fill="#5865f2">
          <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.401329 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978Z"/>
        </svg>
        <span style={{ fontFamily:'monospace', fontSize:8, color:'#5865f2' }}>Discord</span>
        <div style={{ width:5, height:5, borderRadius:'50%', background:pulse?GREEN:'#3ba55c', transition:'background 0.5s' }} />
      </a>
    );
  }

  return (
    <div style={{ background:BG2, border:`1px solid #5865f220`, borderRadius:4, overflow:'hidden' }}>
      <div style={{ padding:'8px 12px', borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', gap:8 }}>
        <svg width="16" height="12" viewBox="0 0 71 55" fill="#5865f2">
          <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.401329 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978Z"/>
        </svg>
        <span style={{ fontFamily:'monospace', fontSize:10, color:'#5865f2', letterSpacing:1 }}>DISCORD</span>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:GREEN, animation:'pulse 2s infinite' }} />
          <span style={{ fontFamily:'monospace', fontSize:7, color:GREEN }}>ONLINE</span>
        </div>
      </div>

      {/* User profile */}
      <div style={{ padding:'10px 12px', borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', gap:10 }}>
        {/* Avatar */}
        <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg, ${GREEN}, #064e33)`, border:`2px solid ${GREEN}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontFamily:'monospace', fontSize:14, color:TEXT_BRIGHT, fontWeight:'bold' }}>B</span>
        </div>
        {/* Info */}
        <div>
          <div style={{ fontFamily:'monospace', fontSize:11, color:TEXT_BRIGHT, fontWeight:'bold', letterSpacing:0.5 }}>{BRAND.discord_user}</div>
          <div style={{ fontFamily:'monospace', fontSize:8, color:TEXT_DIM, marginTop:1 }}>{BRAND.title}</div>
          <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:3 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#3ba55c', border:`1px solid ${BG2}` }} />
            <span style={{ fontFamily:'monospace', fontSize:7, color:'#3ba55c' }}>Online — Do Not Disturb</span>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div style={{ padding:'8px 12px', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM, letterSpacing:1, marginBottom:6 }}>CURRENT ACTIVITY</div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 8px', background:BG3, borderRadius:3, border:`1px solid #5865f215` }}>
          <span style={{ fontSize:16 }}>⬡</span>
          <div>
            <div style={{ fontFamily:'monospace', fontSize:8, color:TEXT_BRIGHT }}>Building DEEVO CORTEX</div>
            <div style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM }}>GCC Economic Intelligence — v6.0</div>
            <div style={{ fontFamily:'monospace', fontSize:7, color:GREEN, marginTop:1 }}>deevo-monitor.vercel.app</div>
          </div>
        </div>
      </div>

      {/* DEEVO Discord community */}
      <div style={{ padding:'8px 12px', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM, letterSpacing:1, marginBottom:6 }}>DEEVO COMMUNITY</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:GREEN, animation:'pulse 2s infinite' }} />
            <span style={{ fontFamily:'monospace', fontSize:8, color:TEXT }}>Members online</span>
          </div>
          <span style={{ fontFamily:'monospace', fontSize:9, color:GREEN, fontWeight:'bold' }}>1</span>
        </div>
        <div style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM, marginBottom:6 }}>Channels: #general · #gcc-intel · #deevo-dev · #alerts</div>
        <a href={BRAND.discord_invite} target="_blank" rel="noreferrer"
          style={{ display:'block', textAlign:'center', padding:'5px', background:'#5865f220', border:'1px solid #5865f240', borderRadius:3, fontFamily:'monospace', fontSize:8, color:'#5865f2', textDecoration:'none', letterSpacing:1 }}>
          JOIN DEEVO DISCORD →
        </a>
      </div>

      {/* Footer */}
      <div style={{ padding:'6px 12px', fontFamily:'monospace', fontSize:7, color:TEXT_DIM, textAlign:'center' }}>
        {BRAND.discord_user} · {BRAND.platform} {BRAND.version}
      </div>
    </div>
  );
}

// ─── FOUNDER PROFILE CARD ────────────────────────────────────────────────────
export function FounderCard() {
  const [hovered, setHovered] = useState<string|null>(null);

  const links = [
    { id:'github', icon:'⬡', label:'GitHub', sub:'PyBADR', color:GREEN, url:BRAND.github_url },
    { id:'discord', icon:'◈', label:'Discord', sub:'Baderalabddan', color:'#5865f2', url:BRAND.discord_invite },
    { id:'vercel', icon:'▲', label:'Live App', sub:'deevo-monitor.vercel.app', color:TEXT_BRIGHT, url:BRAND.vercel_url },
  ];

  return (
    <div style={{ background:BG2, border:`1px solid ${BORDER2}`, borderRadius:4, overflow:'hidden' }}>
      {/* Hero */}
      <div style={{ padding:'12px', background:`linear-gradient(135deg, #040a06 0%, #0b1f10 100%)`, borderBottom:`1px solid ${BORDER}`, position:'relative' }}>
        {/* Background grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`, backgroundSize:'20px 20px', opacity:0.4 }}/>
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:12 }}>
          {/* Avatar */}
          <div style={{ width:48, height:48, borderRadius:'50%', background:`linear-gradient(135deg, ${GREEN} 0%, #064e33 100%)`, border:`2px solid ${GREEN}60`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, position:'relative' }}>
            <span style={{ fontFamily:'monospace', fontSize:20, color:TEXT_BRIGHT, fontWeight:'bold' }}>B</span>
            <div style={{ position:'absolute', bottom:-1, right:-1, width:12, height:12, borderRadius:'50%', background:GREEN, border:`2px solid ${BG}` }}/>
          </div>
          {/* Name & title */}
          <div>
            <div style={{ fontFamily:'monospace', fontSize:13, color:TEXT_BRIGHT, fontWeight:'bold', letterSpacing:1 }}>
              {BRAND.name}
            </div>
            <div style={{ fontFamily:'monospace', fontSize:8, color:GREEN, letterSpacing:0.5, marginTop:2 }}>
              {BRAND.title}
            </div>
            <div style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM, marginTop:2 }}>
              {BRAND.tagline}
            </div>
          </div>
          {/* Live badge */}
          <div style={{ marginLeft:'auto', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
            <div style={{ padding:'2px 7px', background:`${GREEN}15`, border:`1px solid ${GREEN}40`, borderRadius:10, display:'flex', alignItems:'center', gap:4 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:GREEN, animation:'pulse 2s infinite' }}/>
              <span style={{ fontFamily:'monospace', fontSize:7, color:GREEN, letterSpacing:1 }}>BUILDING</span>
            </div>
            <span style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM }}>{BRAND.platform} {BRAND.version}</span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div style={{ padding:'8px 12px', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          {links.map(l => (
            <a key={l.id} href={l.url} target="_blank" rel="noreferrer"
              onMouseEnter={() => setHovered(l.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 8px', borderRadius:3,
                background:hovered===l.id?BORDER:'transparent',
                border:`1px solid ${hovered===l.id?l.color+'40':BORDER}`,
                textDecoration:'none', cursor:'pointer', transition:'all 0.15s' }}>
              <span style={{ fontSize:10, color:l.color }}>{l.icon}</span>
              <div>
                <div style={{ fontFamily:'monospace', fontSize:8, color:TEXT }}>{l.label}</div>
                <div style={{ fontFamily:'monospace', fontSize:7, color:l.color }}>{l.sub}</div>
              </div>
              <span style={{ marginLeft:'auto', fontFamily:'monospace', fontSize:7, color:TEXT_DIM }}>↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding:'8px 12px', display:'flex', gap:0 }}>
        {[
          { v:'$2.1T', l:'GCC GDP', c:GREEN },
          { v:'6', l:'Countries', c:BLUE },
          { v:'41', l:'Commits', c:AMBER },
          { v:'3', l:'Releases', c:PURPLE },
        ].map((s, i) => (
          <div key={s.l} style={{ flex:1, textAlign:'center', borderRight:i<3?`1px solid ${BORDER}`:'none', padding:'0 4px' }}>
            <div style={{ fontFamily:'monospace', fontSize:11, color:s.c, fontWeight:'bold' }}>{s.v}</div>
            <div style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM, marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMBINED SOCIAL PANEL ───────────────────────────────────────────────────
export default function SocialPanel() {
  const [activeTab, setActiveTab] = useState<'profile'|'github'|'discord'>('profile');

  return (
    <div style={{ width:260, background:BG2, borderLeft:`1px solid ${BORDER}`, display:'flex', flexDirection:'column', flexShrink:0 }}>
      {/* Tab bar */}
      <div style={{ display:'flex', borderBottom:`1px solid ${BORDER}`, flexShrink:0 }}>
        {([
          { id:'profile', label:'PROFILE' },
          { id:'github', label:'GITHUB' },
          { id:'discord', label:'DISCORD' },
        ] as const).map(t => (
          <div key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ flex:1, padding:'7px 0', textAlign:'center', fontFamily:'monospace', fontSize:7,
              color:activeTab===t.id?GREEN:TEXT_DIM,
              borderBottom:activeTab===t.id?`2px solid ${GREEN}`:'2px solid transparent',
              cursor:'pointer', letterSpacing:1 }}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'10px 10px' }}>
        {activeTab === 'profile' && <FounderCard />}
        {activeTab === 'github' && <GitHubCard />}
        {activeTab === 'discord' && <DiscordCard />}
      </div>

      {/* Bottom bar — always visible */}
      <div style={{ padding:'6px 10px', borderTop:`1px solid ${BORDER}`, display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <span style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM }}>Built by <span style={{ color:GREEN }}>{BRAND.name}</span></span>
        <div style={{ display:'flex', gap:6 }}>
          <a href={BRAND.github_url} target="_blank" rel="noreferrer" style={{ fontFamily:'monospace', fontSize:7, color:GREEN, textDecoration:'none' }}>GH</a>
          <a href={BRAND.discord_invite} target="_blank" rel="noreferrer" style={{ fontFamily:'monospace', fontSize:7, color:'#5865f2', textDecoration:'none' }}>DC</a>
          <a href={BRAND.vercel_url} target="_blank" rel="noreferrer" style={{ fontFamily:'monospace', fontSize:7, color:TEXT_DIM, textDecoration:'none' }}>▲</a>
        </div>
      </div>
    </div>
  );
}
