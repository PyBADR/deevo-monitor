/**
 * DEEVO Decision Intelligence — Shared Design Tokens
 * Single source of truth for all panel styling.
 */
export const colors = {
  bg: '#0a0f1a',
  surface: '#111827',
  surfaceLight: '#1e293b',
  border: '#1e293b',
  borderActive: '#f5a623',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  amber: '#f5a623',
  cyan: '#22d3ee',
  green: '#22c55e',
  red: '#ef4444',
  orange: '#f59e0b',
  purple: '#8b5cf6',
} as const;

export const fonts = {
  mono: "'IBM Plex Mono', 'Fira Code', monospace",
  sans: "'IBM Plex Sans', -apple-system, sans-serif",
} as const;

export const panel = {
  container: {
