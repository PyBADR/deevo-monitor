# Changelog

All notable changes to DEEVO Monitor are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.0.0] — 2026-03-22

### Added
- Full React + TypeScript + DeckGL rewrite (replacing v1 vanilla JS)
- DeckGL 9.1 map engine with 5 composable data layers
  - HexagonLayer: 3D risk density aggregation
  - ScatterplotLayer: claim clusters by volume
  - ArcLayer: cross-border fraud connections
  - HeatmapLayer: 2D risk intensity overlay
  - TextLayer: alert icon markers
- DEEVO Risk Index (DRI) — 5-level composite scoring system
- Express + Socket.io API server with real-time streaming
- RSS feed aggregation from 20+ GCC insurance sources
- Ollama AI integration for risk briefings and forecasts
- Cortex bridge to DeevoAnalytics backend
- LiveFeed panel with 8 category filters
- AIInsights panel with interactive prompt
- RiskScore panel with per-country breakdown
- ForecastPanel with 7d/30d claim projections
- AlertFeedPanel with tagged real-time alerts
- PipelineStats KPI dashboard
- WorldMonitor-style StatusBar with UTC clock and region selector
- LayerPanel with category-grouped toggles
- RiskLegend with DRI scale and severity indicators
- LiveDot animated status indicator component
- RiskMeter SVG circular gauge component
- DRIBadge with animated pulsing glow
- GCC GeoJSON boundaries for all 6 countries
- 60+ realistic mock claim hotspots across GCC
- Docker multi-stage build + nginx + docker-compose
- Tailwind CSS dark terminal aesthetic
- RTL/Arabic font support (Noto Sans Arabic)
- TypeScript strict mode — zero errors

### Changed
- Package version: 1.0.0 → 2.0.0
- Build system: vanilla Vite → React + TypeScript + Tailwind
- Map: static globe → interactive DeckGL with 5 layers
- Server: basic Express → Express + Socket.io + RSS + Ollama

### Removed
- Vanilla JS implementation
- Tauri 1.x desktop wrapper (to be re-added as Tauri 2 in future)
- Static landing page

## [1.0.0] — 2026-03-20

### Added
- Initial vanilla JS implementation
- Basic DeckGL globe view
- Server with RSS and Ollama proxy
- Tauri desktop app wrapper
- Landing page
