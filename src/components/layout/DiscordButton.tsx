/**
 * DiscordButton — Floating "Join Discord" button (worldmonitor parity).
 * Fixed to bottom-right corner with dismiss functionality.
 *
 * Architecture Layer: UI (L6)
 */
import { useState } from 'react';

export function DiscordButton() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-14 right-4 z-40 flex items-center gap-2 animate-fade-in">
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span className="text-[10px] font-mono text-gray-400">Join Discord</span>
      <a
        href="https://discord.gg/deevo-monitor"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
        style={{
          backgroundColor: '#5865F2',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(88,101,242,0.4)',
        }}
      >
        Join Discord
      </a>
      <button
        onClick={() => setDismissed(true)}
        className="text-gray-600 hover:text-gray-400 text-xs ml-1"
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
