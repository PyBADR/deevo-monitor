/**
 * VariantSwitcher — Dropdown to switch between DEEVO Monitor variants.
 * Shows in StatusBar: [icon] [VARIANT NAME ▼]
 */
import { useState, useRef, useEffect } from 'react';
import { useVariant, VARIANT_IDS, VARIANTS } from '@/variants';
import type { VariantId } from '@/variants';

export function VariantSwitcher() {
  const { variant, variantId, setVariant } = useVariant();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded transition-colors hover:bg-white/5"
      >
        <span className="text-sm">{variant.logo.icon}</span>
        <span
          className="text-xs font-bold tracking-tight"
          style={{ color: variant.colors.primary }}
        >
          {variant.name}
        </span>
        <svg
          className="w-3 h-3 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-72 rounded-lg border shadow-2xl z-50 overflow-hidden"
          style={{
            backgroundColor: variant.colors.surface,
            borderColor: variant.colors.border,
          }}
        >
          {VARIANT_IDS.map((id: VariantId) => {
            const v = VARIANTS[id];
            const active = id === variantId;
            return (
              <button
                key={id}
                onClick={() => { setVariant(id); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                style={{
                  borderLeft: active ? `3px solid ${v.colors.primary}` : '3px solid transparent',
                }}
              >
                <span className="text-lg shrink-0">{v.logo.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold"
                      style={{ color: v.colors.primary }}
                    >
                      {v.name}
                    </span>
                    {active && (
                      <span
                        className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{
                          backgroundColor: `${v.colors.primary}20`,
                          color: v.colors.primary,
                        }}
                      >
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {v.domain}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
