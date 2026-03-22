/**
 * ThemeInjector — Injects CSS custom properties based on the active variant.
 * Runs on every variant change, updating :root styles, meta theme-color, and title.
 */
import { useEffect } from 'react';
import type { VariantColors } from './variant.types';
import { useVariant } from './useVariant';

const COLOR_MAP: [keyof VariantColors, string][] = [
  ['primary', '--color-primary'],
  ['secondary', '--color-secondary'],
  ['critical', '--color-critical'],
  ['warning', '--color-warning'],
  ['success', '--color-success'],
  ['bg', '--color-bg'],
  ['surface', '--color-surface'],
  ['surfaceHover', '--color-surface-hover'],
  ['border', '--color-border'],
  ['text', '--color-text'],
  ['textPrimary', '--color-text-primary'],
  ['textSecondary', '--color-text-secondary'],
  ['textMuted', '--color-text-muted'],
  ['badge', '--color-badge'],
];

export function ThemeInjector() {
  const { variant } = useVariant();

  useEffect(() => {
    const root = document.documentElement.style;

    // Inject all color variables
    for (const [key, cssVar] of COLOR_MAP) {
      root.setProperty(cssVar, variant.colors[key]);
    }

    // Update meta theme-color for mobile browsers
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', variant.colors.bg);

    // Update page title
    document.title = variant.metaTitle;

    // Update body background
    document.body.style.backgroundColor = variant.colors.bg;
  }, [variant]);

  return null;
}
