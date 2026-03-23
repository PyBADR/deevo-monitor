# DEEVO MONITOR — System Audit Report
**Date:** 2026-03-23
**Auditor:** AI Systems Architect
**Verdict:** MAJOR REFACTOR REQUIRED

## 1. Codebase Summary

| Metric | Value |
|---|---|
| Total src/ lines | 33,504 |
| Panel components | 33 (target: 6) |
| API endpoints | 27 |
| Server routes | 10 |
| WorldMonitor integrations | 31 files |
| Variant configs | 6 |
| Feed configs | 446 lines |
| Crypto references | 133 across codebase |
| Global/non-GCC references | 35+ |

## 2. Critical Issues

### 2.1 NON-GCC DATA CONTAMINATION
- `api/finance/crypto.ts` — Entire crypto API endpoint (DELETE)
- `src/data/feeds-config.ts` — 44 crypto references (PURGE)
- `server/feeds/all-feeds.config.ts` — 85 crypto refs, 35 global refs (PURGE)
- `src/config/feeds.ts` — 4 crypto references (PURGE)
- Global feeds: US, Europe, Asia news mixed with GCC (REMOVE)

### 2.2 DEAD / UNUSED PANELS (33 panels, only 6 needed)
DELETE all except core 6:
- AIForecastsPanel.tsx — redundant with new ML pipeline
- AIInsights.tsx — vague, no GCC focus
- ArchitectureView.tsx — dev tool, not production
- ClimateAnomaliesPanel.tsx — global, not GCC-specific
- DisplacementPanel.tsx — not core GCC intelligence
- ExtendedPanels.tsx — umbrella for dead panels
- FieldInspectionSchedulerPanel.tsx — insurance micro-feature
- FinancePanels.tsx — global finance, not GCC-scoped
- FinanceRadar.tsx — duplicate finance view
- ForceGraphView.tsx — experimental viz
- ForecastPanel.tsx — replaced by wideForecastEngine
- ForexGoldPanel.tsx — global forex, not GCC-scoped
- KPIDashboardV3.tsx — legacy dashboard version
- LiveFeed.tsx — duplicate of LiveNewsFeedPanel
- LiveNewsPanel.tsx — duplicate of LiveNewsFeedPanel
- LiveWebcams.tsx — irrelevant to decision intelligence
- MarketPanels.tsx — global markets, not GCC
- PipelineStats.tsx — dev metrics, not production
- TimelineView.tsx — experimental
- ThermalEscalationPanel.tsx — niche, not core

### 2.3 OLD APPSHELL STILL IN REPO
- `src/components/layout/AppShell.tsx` — 501 lines, 49 imports, 74 tabs
- No longer imported (App.tsx uses DecisionShell) but still in codebase
- Must DELETE

### 2.4 VARIANT SYSTEM (REMOVE)
- `src/config/variants.ts` — 228 lines, 6 variant configs
- `src/variants/` — 4 files (index, useVariant, configs, types)
- `src/components/ui/VariantSwitcher.tsx`
- `api/variants/index.ts`
- `server/routes/variants.ts`
- One product, one variant. Delete all.

### 2.5 WORLDMONITOR INTEGRATION BLOAT
- 31 files in `src/integrations/worldmonitor/`
- Includes: oref-alerts (Israel-specific), wingbits, telegram-intel
- Many are global intelligence, not GCC-scoped
- Keep only: RSS feeds, signal aggregator, country instability (GCC-filtered)

### 2.6 MAP ISSUES
- `src/components/map/GlobeView.tsx` — Global 3D globe (REMOVE)
- `src/data/global-layers.ts` — Global layer data (REMOVE)
- Map layers are mock/placeholder, not real deck.gl implementations
- No GCC-focused viewport lock

### 2.7 SERVER BLOAT
- `server/routes/webcams.ts` — Webcam feeds (REMOVE)
- `server/routes/ollama.ts` — LLM integration (REMOVE per AI simplicity rule)
- `server/routes/cortex.ts` — Unclear purpose (REMOVE)
- `server/kpi/wellness.kpi.ts` — Not GCC intelligence (REMOVE)

### 2.8 SECURITY
- No auth system
- No feature gating
- No rate limiting on APIs
- No role-based access

## 3. What to KEEP

### Core ML Pipeline (src/ml/) — 16 engines, production-grade
- types.ts, entityExtractor.ts, eventClusterer.ts
- correlationEngine.ts, forecastEngine.ts, storyGraphBuilder.ts
- decisionExplainer.ts, pipeline.ts
- sectorOntology.ts (14 sectors, 3 tiers)
- sectorImpactEngine.ts, propagationGraph.ts
- gdpIntelligenceEngine.ts, wideForecastEngine.ts
- executiveStoryEngine.ts, sectorDecisionEngine.ts
- marketDynamicsEngine.ts, scenarioEngine.ts

### Core Infrastructure
- api/rss-proxy.ts — CORS proxy with domain whitelist
- api/health.ts — Health endpoint
- src/components/compliance/PDPLBanner.tsx — PDPL compliance
- src/components/layout/ErrorBoundary.tsx
- src/utils/hijri.ts — Hijri calendar
- src/i18n/ — Internationalization
- src/services/rss.ts — RSS service

### Decision Shell
- src/components/decision/DecisionShell.tsx — New 6-panel UI (needs refinement)

## 4. Action Plan

| Phase | Action | Files Affected |
|---|---|---|
| HARD RESET | Delete 27+ dead panels, crypto API, variants, global data | ~40 files |
| UI REBUILD | Clean DecisionShell with 6 panels + GCC map | 3-5 files |
| MAP | MapLibre + deck.gl with 4 real GCC layers | 8 new files |
| DATA | GCC-only RSS, schema enforcement, fallback | 3-4 files |
| AI | Signal scoring only (LOW/MED/HIGH/CRITICAL) | 2 files |
| SaaS | Auth, tiers, feature gating, billing structure | 8 new files |
| PERF | Memoization, lazy loading, <1s render | All components |
| GITHUB | README as product, docs, architecture | 3-4 files |
