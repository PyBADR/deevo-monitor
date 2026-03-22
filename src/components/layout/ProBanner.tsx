/**
 * ProBanner — Top-of-page promotional banner (worldmonitor-style).
 * Dismissible, with gradient background and call-to-action.
 *
 * Architecture Layer: UI (L6)
 */
import { useState } from 'react';
import { useVariant } from '@/variants';

export function ProBanner() {
  const { variant } = useVariant();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="h-8 flex items-center justify-center px-4 text-[10px] font-mono shrink-0 relative"
      style={{
        background: `linear-gradient(90deg, ${variant.colors.primary}15, ${variant.colors.success}10, ${variant.colors.primary}15)`,
        borderBottom: `1px solid ${variant.colors.border}`,
      }}
    >
      <span style={{ color: variant.colors.textMuted }}>
        <span className="font-bold" style={{ color: variant.colors.primary }}>Pro</span>
        {' '}is coming — More Signal, Less Noise. Smarter feeds, AI briefs, and priority alerts.
      </span>
      <button
        className="ml-3 px-3 py-0.5 rounded text-[9px] font-bold transition-colors"
        style={{
          backgroundColor: `${variant.colors.primary}20`,
          color: variant.colors.primary,
          border: `1px solid ${variant.colors.primary}40`,
        }}
      >
        Notify Me
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 text-gray-500 hover:text-gray-300 transition-colors text-xs"
        title="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
