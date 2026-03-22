/**
 * useVariant — Detects and manages the active variant.
 *
 * Detection priority:
 *   1. URL hostname subdomain (tech.deevo.ai → 'tech')
 *   2. URL param ?variant=tech
 *   3. localStorage 'deevo_variant'
 *   4. Default: 'global'
 */
import { useState, useCallback, useMemo } from 'react';
import type { VariantId, VariantConfig } from './variant.types';
import { VARIANTS } from './variant.configs';

const STORAGE_KEY = 'deevo_variant';

function detectVariant(): VariantId {
  // 1. Subdomain detection
  try {
    const host = window.location.hostname;
    if (host.startsWith('tech.')) return 'tech';
    if (host.startsWith('finance.')) return 'finance';
    if (host.startsWith('fraud.')) return 'fraud';
    if (host.startsWith('monitor.')) return 'global';
  } catch {
    // SSR safety
  }

  // 2. URL param ?variant=
  try {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('variant') as VariantId | null;
    if (param && param in VARIANTS) return param;
  } catch {
    // SSR safety
  }

  // 3. localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as VariantId | null;
    if (stored && stored in VARIANTS) return stored;
  } catch {
    // localStorage unavailable
  }

  // 4. Default
  return 'global';
}

export function useVariant() {
  const [variantId, setVariantIdState] = useState<VariantId>(detectVariant);

  const variant: VariantConfig = useMemo(() => VARIANTS[variantId], [variantId]);

  const setVariant = useCallback((id: VariantId) => {
    setVariantIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // localStorage unavailable
    }
    const v = VARIANTS[id];
    document.title = v.metaTitle;
  }, []);

  const isVariant = useCallback(
    (id: VariantId) => variantId === id,
    [variantId],
  );

  return { variant, variantId, setVariant, isVariant } as const;
}
