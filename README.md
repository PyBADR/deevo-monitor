# Deevo Monitor v5.1.0 — GCC Insurance Intelligence Dashboard

[![GitHub](https://img.shields.io/github/stars/PyBADR/deevo-monitor?style=social)](https://github.com/PyBADR/deevo-monitor)
[![Discord](https://img.shields.io/discord/YOUR_DISCORD_ID?color=5865F2&logo=discord&logoColor=white&label=Discord)](https://discord.gg/deevo-monitor)
[![Version](https://img.shields.io/badge/version-5.1.0-00D4FF)](https://github.com/PyBADR/deevo-monitor)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)

Real-time AI-powered risk monitoring & decision intelligence platform for Gulf Cooperation Council insurance markets. Built with React 18, TypeScript 5, DeckGL, MapLibre GL, globe.gl, and Ollama local AI.

## Community

[![Discord](https://img.shields.io/badge/Join%20our-Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/deevo-monitor)

Join the **Deevo Monitor Discord** for live discussions, feature requests, GCC insurance intel sharing, and community support.

- `#general` — Platform discussions & announcements
- `#gcc-markets` — GCC exchange data & market analysis
- `#risk-intel` — Geopolitical risk & threat intelligence
- `#dev` — Development, PRs, architecture decisions
- `#bugs` — Bug reports & feature requests
- `#insurance` — GCC insurance industry news & IFRS 17

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                  Deevo Monitor v5.1.0                          │
├────────────┬──────────────────────────────┬───────────────────┤
│ LayerPanel │   Smart Map Engine (GCCMap)  │   Map Controls    │
│ 45 Layers  │                              │                   │
│ 8 Cats     │  DeckGL 2D — 45 Layers       │  2D/3D Toggle     │
│            │  globe.gl 3D — Risk Bars      │  3 Styles         │
│ Style      │  3 Basemap Styles             │  Time Slider      │
│ Switcher   │  Pulse Animations             │  Pulse Toggle     │
│            │  Intel Cards on Click          │  Extrusion Toggle │
├────────────┴──────────────────────────────┴───────────────────┤
│          55+ Bottom Panel Tabs (scrollable tab bar)           │
│  INTEL | NEWS | MARKETS | FOREX | CRYPTO | FIXED INCOME |... │
│  GCC INVEST | STARTUPS | SECURITY | SUPPLY CHAIN | CLOCK |...│
├───────────────────────────────────────────────────────────────┤
│               Bottom Ticker — Live Intelligence                │
└───────────────────────────────────────────────────────────────┘
         ↕ Socket.io          ↕ Vercel API (18 routes)
┌───────────────────────────────────────────────────────────────┐
│              Vercel Serverless + Ollama Local AI               │
│  ├─ /api/feed        — RSS aggregation (600+ feeds)           │
│  ├─ /api/risk        — DRI engine + country scores            │
│  ├─ /api/fraud-intel — Fraud detection signals                │
│  ├─ /api/cii         — Composite Insurance Index (12 signals) │
│  └─ /api/ollama      — Local AI proxy (Mac M4 Max GPU)        │
└───────────────────────────────────────────────────────────────┘
```

## What's New in v5.1

- **Smart Map Engine** — DeckGL 2D with all 45 data layers + globe.gl 3D mode with risk extrusion bars
- **3 Map Styles** — Cyberpunk dark, satellite imagery, clean minimal (switchable)
- **Pulse Animations** — Animated hotspot pulses via requestAnimationFrame
- **Intel Cards** — Click any point for risk score, AI summary, related news
- **Time Slider** — Replay data across 1h / 6h / 24h / 7d / 30d / 90d ranges
- **600+ RSS Feeds** — 16 categories covering global markets, GCC, crypto, forex, supply chain
- **55+ Panel Tabs** — Core Markets, Fixed Income, Forex, Crypto/Digital, Central Banks, GCC Investment, Gulf Economic, Startups/VC, Security/Policy, Data Tracking, Supply Chain, Pricing/Marketing, Consumer Prices, World Clock
- **21 Languages** — Full i18n with RTL support (Arabic, Farsi, Hebrew, Urdu)
- **18 API Routes** — Vercel serverless with GCC insurance domain data
- **24 Market Sessions** — Live world clock showing open/closed status for global exchanges

## Stack

| Layer       | Technology                                          |
|-------------|-----------------------------------------------------|
| Frontend    | React 18, TypeScript 5, Vite 6                      |
| Map Engine  | DeckGL 9.1, MapLibre GL, globe.gl, Three.js          |
| State       | Zustand 5 (persist middleware)                       |
| Styling     | Tailwind CSS 3.4                                     |
| Charts      | Recharts 2.15                                        |
| i18n        | i18next + react-i18next (21 locales + RTL)           |
| API         | Vercel Serverless Functions (18 routes)               |
| AI          | Ollama (local GPU — Mac M4 Max)                      |
| RSS         | rss-parser (600+ feed sources)                       |
| Deployment  | Vercel (frontend + API) / Docker multi-stage          |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start with specific variant
npm run dev:global    # Global risk monitoring
npm run dev:finance   # Finance-focused
npm run dev:fraud     # Fraud detection
npm run dev:tech      # Technology
npm run dev:commodity # Commodities
```

## 6 Variant System

| Variant   | Focus                  | Primary Color |
|-----------|------------------------|---------------|
| global    | Geopolitical risk      | Cyan          |
| tech      | Technology & AI        | Blue          |
| finance   | Markets & banking      | Green         |
| fraud     | Insurance fraud        | Red           |
| commodity | Oil, gas, metals       | Amber         |
| happy     | General dashboard      | Purple        |

## Data Coverage

| Category          | Feeds | Key Sources                                    |
|-------------------|-------|------------------------------------------------|
| Core Markets      | 30    | Bloomberg, CNBC, all 7 GCC exchanges            |
| Fixed Income      | 15    | US Treasury, Moody's, S&P, Sukuk                |
| Forex             | 18    | ForexLive, DailyFX, all GCC currency pegs        |
| Crypto/Digital    | 20    | CoinDesk, CoinTelegraph, CBDCs, DeFi            |
| Central Banks     | 22    | Fed, ECB, SAMA, CBUAE, IMF, World Bank           |
| Gulf & MENA       | 30    | PIF, Mubadala, Gulf News, Vision 2030            |
| Startups/VC       | 18    | TechCrunch, Magnitt, Wamda, Hub71                |
| Security/Policy   | 20    | Krebs, CISA, Foreign Affairs, OFAC               |
| Data & Tracking   | 15    | FRED, World Bank, Trading Economics               |
| Supply Chain      | 15    | Freightwaves, DP World, Suez Canal               |
| Pricing/Marketing | 12    | Nielsen, Profitwell, Gartner                     |
| Consumer Prices   | 10    | BLS CPI, Eurostat, FAO, GCC CPIs                 |

## 45 Map Layers (8 Categories)

GEOPOLITICAL, MILITARY, NUCLEAR, INFRASTRUCTURE, INTELLIGENCE, CLAIMS, FRAUD, ENVIRONMENTAL

## GCC Coverage

Saudi Arabia (SA), United Arab Emirates (AE), Qatar (QA), Kuwait (KW), Bahrain (BH), Oman (OM)

## Compliance

- **PDPL** — Saudi Personal Data Protection Law compliant
- **IFRS 17** — Insurance contracts standard ready
- **SHA-256** — Full audit trail with cryptographic hashing
- **Multi-Tenant** — Data isolation per organization

## Discord

Join our community: **[discord.gg/deevo-monitor](https://discord.gg/deevo-monitor)**

## GitHub

Star the repo: **[github.com/PyBADR/deevo-monitor](https://github.com/PyBADR/deevo-monitor)**

## License

AGPL-3.0 — Deevo Analytics / BDRAI
