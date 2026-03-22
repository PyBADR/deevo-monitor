# Deevo Monitor v4.1.0

> AI-Powered Decision Intelligence for GCC Insurance & Geopolitical Risk

[![GitHub](https://img.shields.io/github/stars/PyBADR/deevo-monitor?style=social)](https://github.com/PyBADR/deevo-monitor)
[![CI](https://github.com/PyBADR/deevo-monitor/actions/workflows/ci.yml/badge.svg)](https://github.com/PyBADR/deevo-monitor/actions)
[![Version](https://img.shields.io/badge/version-4.1.0-00D4FF)](https://github.com/PyBADR/deevo-monitor)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)

Real-time AI-powered risk monitoring and decision intelligence platform for Gulf Cooperation Council insurance markets. Full worldmonitor feature parity with GCC-specific extensions.

## What It Does

**435+ curated news feeds** across 17 categories, AI-synthesized into intelligence briefs via local Ollama models.

**Dual map engine** with 3D globe (globe.gl) and WebGL flat map (deck.gl + MapLibre) featuring 60+ data layers across 12 categories: Geopolitical, Military, Nuclear, Infrastructure, Intelligence, Claims, Fraud, Environmental, Space, Tech, Finance, and Commodity.

**Cross-stream correlation** detects convergence across military, economic, cyber, and geopolitical signals within configurable time windows, triggering MULTI-SIGNAL and ESCALATION alerts.

**Country Intelligence Index** provides composite risk scoring across 12 signal categories for each GCC country (SA, AE, QA, KW, BH, OM) with trend analysis and severity classification.

**Finance radar** tracks 92 stock exchanges, commodities (oil, gold, gas), crypto assets, and GCC currencies with a 7-signal market composite score.

**Local AI** runs everything with Ollama (no API keys required), with fallback to OpenRouter and Groq for cloud inference.

**6 site variants** from a single codebase: Global (default), GCC, Tech, Finance, Commodity, and Happy (positive news).

**Native desktop app** via Tauri 2 for macOS, Windows, and Linux with system tray, native notifications, and offline mode.

**21 languages** with native-language feeds and full RTL support for Arabic, Persian, Hebrew, and Urdu.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript 5, Vite 6, Tailwind CSS 3 |
| Maps | DeckGL 9, MapLibre GL, globe.gl, Three.js |
| State | Zustand 5 with persist middleware |
| AI | Ollama (local), OpenRouter, Groq |
| i18n | i18next + react-i18next (21 languages, RTL) |
| Backend | Express 5, Socket.IO 4, Redis |
| Desktop | Tauri 2 (Rust) |
| Deploy | Vercel (19 serverless API routes) |
| CI | GitHub Actions (typecheck + build for all variants) |

## Quick Start

```bash
git clone https://github.com/PyBADR/deevo-monitor
cd deevo-monitor
npm install
npm run dev           # Global variant (default)
npm run dev:gcc       # GCC Insurance variant (Arabic RTL)
npm run dev:tech      # Technology & Cyber focus
npm run dev:finance   # Market Intelligence focus
npm run dev:commodity # Resource & Supply Chain
```

## Variants

| Variant | Port | Focus | Default Language |
|---------|------|-------|-----------------|
| `global` | 5174 | Full platform, all layers | English |
| `gcc` | 5174 | GCC insurance, PDPL compliance | Arabic (RTL) |
| `tech` | 5175 | Cyber threats, tech infrastructure | English |
| `finance` | 5176 | Market data, stock exchanges | English |
| `commodity` | 5177 | Trade routes, oil/gas, minerals | English |
| `happy` | 5178 | Positive news, conservation wins | English |

## Map Layers (60+)

Geopolitical: Conflict Zones, Iran Attacks, Sanctions, Refugees, UN Missions, Trade Routes, Diaspora.
Military: Bases, Naval Assets, Air Defense, Aircraft Tracks, Naval Patrols, UCDP Events, Strategic Waterways.
Nuclear: Sites, Gamma Irradiators, Radiation Watch.
Infrastructure: Pipelines, Subsea Cables, Spaceports, AI Data Centers, Power Grid, Oil Facilities, Ports, Desalination, Solar Farms.
Intelligence: Intel Hotspots, Cyber Threats, Terror Incidents, Protests, OSINT Feeds, Social Signal.
Space: Orbital Surveillance, GPS Jamming, Day/Night.
Tech: Startup Hubs, Tech HQs, Cloud Regions, Internet Disruptions.
Finance: Stock Exchanges, Financial Centers, Central Banks, GCC Investments.
Commodity: Commodity Hubs, Mining Sites, Ports, Critical Minerals.
Environmental: Weather CAT, Floods, Air Quality, Seismic, Dust Storms, Fires, Climate Anomalies.
Insurance: Claims Heat, Claim Clusters, Risk Density, Fraud Links, Staging Areas, Repair Shops, Hospital Network.

## GCC Variant

Purpose-built for Gulf Cooperation Council insurance markets:

- Default view centered on Gulf region (SA, AE, QA, KW, BH, OM)
- Arabic RTL interface with native-language news feeds
- PDPL (Saudi Personal Data Protection Law) compliance controls
- DRI (DEFCON Risk Index) scoring system
- Insurance-specific layers: Claims Heat, Fraud Links, Staging Areas
- SHA-256 audit trails for regulatory compliance
- IFRS 17 compliance tracking

## Desktop App (Tauri 2)

```bash
npm run tauri:dev     # Development
npm run tauri:build   # Production build (macOS/Windows/Linux)
```

Features: system tray with DEFCON indicator, native notifications for CRIT alerts, offline mode with cached data, direct Ollama connection (no CORS).

## Settings (15 sections)

Appearance, Maps, Map Tile Provider, Live Events, Feeds, AI Engine, Notifications, Display, Media, Pages & Panels, Shortcuts, Data Sources, Integrations, Explorer, Privacy & Compliance.

## Bottom Panels (55+)

Intel Feed, Live News, Webcams, AI Insights, Strategic Posture, Country Intel, Risk Index, Strategy, Live Case, Finance Radar, Market, Financial, Economical, Stocks, Premium, Daily, Energy, Gold & Silver, Base Metals, Crypto, Central Banks, Consumer, GCC Business, GCC Market, Region News, Global News, Topical, Technology, Telegram Intel, Brand/App, Core Markets, Fixed Income, Forex, Crypto/Digital, Central Banks+, GCC Invest, Gulf Economic, CPI/Prices, Startups/VC, Security, Data Track, Supply Chain, Pricing/Marketing, World Clock, Deevo Project, Discord, Correlation, KPI, Forecasts, Alerts, Pipeline.

## API Routes (19 Vercel serverless)

`/api/feeds/rss` (RSS proxy), `/api/ai/*` (Ollama bridge), `/api/finance/*` (market data), `/api/geo/*` (geospatial), `/api/risk/*` (DRI scoring), `/api/auth/*` (session management).

## Architecture

7-layer intelligence stack: Data > Features > Models > Agents > APIs > UI > Governance.

All architectural decisions are defensible to GCC enterprise clients, deployable from Mac M4 Max local to cloud, and traceable through the full stack.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines. Join our [Discord](https://discord.gg/deevo-monitor) for discussions.

## License

[AGPL-3.0](LICENSE) — BDRAI
