/**
 * WorldMonitorAdapter — Smoke Tests
 * Validates SHA-256 generation, GCC relevance detection, risk scoring,
 * layer mapping, transient tagging, and PDPL purge logic.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import WorldMonitorAdapter from '../WorldMonitorAdapter';
import type { WMSignal } from '../WorldMonitorAdapter';

describe('WorldMonitorAdapter', () => {
  let adapter: WorldMonitorAdapter;

  beforeEach(() => {
    adapter = new WorldMonitorAdapter();
  });

  // ── SHA-256 & Signal ID ─────────────────────────────────────────────────

  test('generates valid SHA-256 hash (64 hex chars)', () => {
    const sig = adapter.ingest({
      type: 'conflict',
      source: 'worldmonitor',
      payload: { event: 'strike', target: 'Kuwait border' },
      timestamp: new Date().toISOString(),
      region: 'Kuwait',
    });
    expect(sig.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(sig.signal_id).toMatch(/^WM-/);
  });

  test('different signals produce different SHA-256 hashes', () => {
    const sig1 = adapter.ingest({
      type: 'news', source: 'bbc', payload: { title: 'Article A' },
      timestamp: '2026-03-23T00:00:00Z',
    });
    const sig2 = adapter.ingest({
      type: 'news', source: 'bbc', payload: { title: 'Article B' },
      timestamp: '2026-03-23T00:00:01Z',
    });
    expect(sig1.sha256).not.toBe(sig2.sha256);
  });

  // ── GCC Relevance ───────────────────────────────────────────────────────

  test('detects GCC relevance for Kuwait signal', () => {
    const sig = adapter.ingest({
      type: 'conflict', source: 'worldmonitor',
      payload: { event: 'strike', target: 'Kuwait border' },
      timestamp: new Date().toISOString(),
      region: 'Kuwait',
    });
    expect(sig.gcc_relevance).toBe(true);
    expect(sig.gcc_countries).toContain('KW');
  });

  test('detects multiple GCC countries in one signal', () => {
    const sig = adapter.ingest({
      type: 'economic', source: 'worldmonitor',
      payload: { markets: 'Saudi and UAE oil production' },
      timestamp: new Date().toISOString(),
    });
    expect(sig.gcc_relevance).toBe(true);
    expect(sig.gcc_countries).toContain('SA');
    expect(sig.gcc_countries).toContain('AE');
  });

  test('generic GCC term maps to all 6 countries', () => {
    const sig = adapter.ingest({
      type: 'market', source: 'bloomberg',
      payload: { headline: 'GCC stock markets rally' },
      timestamp: new Date().toISOString(),
    });
    expect(sig.gcc_countries).toHaveLength(6);
    expect(sig.gcc_countries).toEqual(['AE', 'BH', 'KW', 'OM', 'QA', 'SA']);
  });

  test('non-GCC signal has no GCC relevance', () => {
    const sig = adapter.ingest({
      type: 'news', source: 'reuters',
      payload: { headline: 'European markets close higher' },
      timestamp: new Date().toISOString(),
    });
    expect(sig.gcc_relevance).toBe(false);
    expect(sig.gcc_countries).toHaveLength(0);
  });

  // ── Risk Scoring ────────────────────────────────────────────────────────

  test('conflict + GCC signal scores > 50', () => {
    const sig = adapter.ingest({
      type: 'conflict', source: 'wm',
      payload: { event: 'attack near Saudi border' },
      timestamp: new Date().toISOString(),
    });
    expect(sig.risk_score).toBeGreaterThan(50);
    expect(sig.requires_human_review).toBe(true);
  });

  test('news signal without keywords scores low', () => {
    const sig = adapter.ingest({
      type: 'news', source: 'bbc',
      payload: { title: 'Local sports update' },
      timestamp: new Date().toISOString(),
    });
    expect(sig.risk_score).toBeLessThan(30);
    expect(sig.requires_human_review).toBe(false);
  });

  test('GPS jamming signals capped at 70 (pending FRIN calibration)', () => {
    const sig = adapter.ingest({
      type: 'geo', source: 'wm',
      payload: { event: 'GPS jamming detected near Kuwait airspace', severity: 'critical' },
      timestamp: new Date().toISOString(),
      region: 'Kuwait',
    });
    expect(sig.risk_score).toBeLessThanOrEqual(70);
  });

  test('risk score never exceeds 100', () => {
    const sig = adapter.ingest({
      type: 'conflict', source: 'wm',
      payload: {
        event: 'missile attack strike bomb nuclear chemical terror explosion',
        target: 'GCC Kuwait Saudi UAE military sanctions cyber Iran conflict',
      },
      timestamp: new Date().toISOString(),
    });
    expect(sig.risk_score).toBeLessThanOrEqual(100);
  });

  // ── Layer Mapping ───────────────────────────────────────────────────────

  test('conflict signals map to Models layer', () => {
    const sig = adapter.ingest({
      type: 'conflict', source: 'wm', payload: {}, timestamp: new Date().toISOString(),
    });
    expect(sig.layer).toBe('Models');
    expect(sig.deevo_module).toContain('FRIN');
  });

  test('cyber signals map to Data layer', () => {
    const sig = adapter.ingest({
      type: 'cyber', source: 'wm', payload: {}, timestamp: new Date().toISOString(),
    });
    expect(sig.layer).toBe('Data');
    expect(sig.deevo_module).toContain('Cyber');
  });

  test('forecast signals map to Agents layer', () => {
    const sig = adapter.ingest({
      type: 'forecast', source: 'wm', payload: {}, timestamp: new Date().toISOString(),
    });
    expect(sig.layer).toBe('Agents');
    expect(sig.deevo_module).toContain('Forecast');
  });

  // ── Transient / PDPL ──────────────────────────────────────────────────

  test('conflict signals marked as transient (PDPL)', () => {
    const sig = adapter.ingest({
      type: 'conflict', source: 'wm', payload: {}, timestamp: new Date().toISOString(),
    });
    expect(sig.transient).toBe(true);
  });

  test('economic signals are NOT transient', () => {
    const sig = adapter.ingest({
      type: 'economic', source: 'wm', payload: {}, timestamp: new Date().toISOString(),
    });
    expect(sig.transient).toBe(false);
  });

  // ── Audit Log ─────────────────────────────────────────────────────────

  test('audit log tracks all ingested signals', () => {
    adapter.ingest({ type: 'geo', source: 'wm', payload: {}, timestamp: new Date().toISOString() });
    adapter.ingest({ type: 'news', source: 'bbc', payload: {}, timestamp: new Date().toISOString() });
    adapter.ingest({ type: 'cyber', source: 'wm', payload: {}, timestamp: new Date().toISOString() });
    expect(adapter.getAuditLog()).toHaveLength(3);
    expect(adapter.getSignalCount()).toBe(3);
  });

  test('batch ingest processes multiple signals', () => {
    const signals: WMSignal[] = [
      { type: 'alert', source: 'oref', payload: { siren: true }, timestamp: new Date().toISOString() },
      { type: 'market', source: 'bloomberg', payload: { index: 'TASI' }, timestamp: new Date().toISOString() },
    ];
    const results = adapter.ingestBatch(signals);
    expect(results).toHaveLength(2);
    expect(adapter.getSignalCount()).toBe(2);
  });

  test('exportAuditJSON produces valid JSON with metadata', () => {
    adapter.ingest({ type: 'conflict', source: 'wm', payload: {}, timestamp: new Date().toISOString() });
    const exported = JSON.parse(adapter.exportAuditJSON());
    expect(exported.adapter_version).toBe('1.0.0');
    expect(exported.upstream_version).toBe('2.6.5');
    expect(exported.total_signals).toBe(1);
    expect(exported.signals).toHaveLength(1);
  });

  // ── Filter Methods ────────────────────────────────────────────────────

  test('getGCCSignals filters correctly', () => {
    adapter.ingest({ type: 'news', source: 'bbc', payload: { title: 'Kuwait economy' }, timestamp: new Date().toISOString() });
    adapter.ingest({ type: 'news', source: 'bbc', payload: { title: 'Paris weather' }, timestamp: new Date().toISOString() });
    expect(adapter.getGCCSignals()).toHaveLength(1);
  });

  test('getSignalsByLayer filters by DEEVO layer', () => {
    adapter.ingest({ type: 'conflict', source: 'wm', payload: {}, timestamp: new Date().toISOString() });
    adapter.ingest({ type: 'news', source: 'bbc', payload: {}, timestamp: new Date().toISOString() });
    adapter.ingest({ type: 'sanctions', source: 'wm', payload: {}, timestamp: new Date().toISOString() });
    expect(adapter.getSignalsByLayer('Models')).toHaveLength(2);
    expect(adapter.getSignalsByLayer('Data')).toHaveLength(1);
  });
});
