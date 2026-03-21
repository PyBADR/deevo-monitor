# Deevo Monitor

**Real-time GCC intelligence dashboard** — AI-powered insurance risk monitoring, geopolitical tracking, and infrastructure surveillance for Gulf Cooperation Council markets.

[![Stars](https://img.shields.io/github/stars/PyBADR/deevo-monitor)](https://github.com/PyBADR/deevo-monitor)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-65%25-blue)](https://www.typescriptlang.org/)

---

## What It Does

- **26+ data layers** across 6 categories: Risk, Infrastructure, Geopolitical, Environment, Finance, Insurance
- **Dual map engine** — 2D WebGL flat map (MapLibre GL / deck.gl) with GCC-focused data visualization
- **45+ RSS feeds** from GCC-specific sources: Al Arabiya, Arab News, SAMA, MEED, Artemis, GDACS, ACLED
- **Country Intelligence Index** — 24-signal composite risk scoring across 6 categories (U/C/S/I/E/F)
- **AI Insights** — Ollama-powered briefings, forecasts, and intel synthesis (no API keys required)
- **5 strategic theaters** — Iran, Yemen/Red Sea, Arabian Gulf, Horn of Africa, Levant/Iraq
- **Live webcams** — GCC cities, ports, and critical infrastructure streams
- **Insurance-specific layers** — Claims heatmap, fraud hotspots, insured asset clusters, treaty zones, loss accumulation
- **GCC infrastructure mapping** — 15 oil & gas facilities, 9 major ports, desalination plants, mega projects
- **Bilingual** — English + Arabic (RTL) support throughout

---

## Quick Start

```bash
git clone https://github.com/PyBADR/deevo-monitor.git
cd deevo-monitor
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173). No environment variables required for basic operation.

---

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla TypeScript, Vite 6, MapLibre GL, deck.gl, Chart.js |
| Map Engine | MapLibre GL (2D) + globe.gl/Three.js (3D) |
| AI/ML | Ollama (local), Groq (cloud fallback), Transformers.js (browser) |
| Data | 45+ RSS feeds, ACLED, GDACS, NASA FIRMS, AIS, USGS |
| Caching | 3-tier: In-memory → Redis → Upstream API |
| Desktop | Tauri 2 (Rust) — macOS, Windows, Linux |
| Backend | Vercel Edge Functions / self-hosted Node.js |

### GCC Data Sources

| Category | Sources |
|----------|---------|
| Wire Services | Reuters ME, AP, AFP/France24 |
| GCC News | Al Arabiya, Al Jazeera, Gulf News, Arab News, Khaleej Times, WAM, SPA |
| Insurance | Artemis, Insurance Journal, Reinsurance News, MEED |
| Regulatory | SAMA, CBUAE, QCB, CBK, CBB, CBO |
| Oil & Energy | Reuters Oil, Bloomberg Energy, OPEC, Energy Intelligence |
| Finance | Bloomberg ME, CNBC Arabia, Zawya, Tadawul |
| Geopolitical | Al-Monitor, Middle East Eye, Janes, Defense One |
| Catastrophe | NASA FIRMS, GDACS, UAE NCM, Saudi PME |
| Maritime | TradeWinds, Lloyd's List, AIS |
| Cyber | Saudi NCSC, aeCERT |

### Country Risk Scoring (24 Signals)

```
U — Unrest/Conflict:    Conflict events, protest index, terrorism risk, military escalation
C — Claims/Insurance:   Claims frequency, loss ratio, fraud rate, catastrophe exposure (PML)
S — Sanctions/Regulatory: Sanctions proximity, regulatory velocity, AML/CFT, PDPL compliance
I — Infrastructure:     Oil price impact, GDP growth, construction activity, supply chain stress
E — Environment:        Heat stress, flash flood, sandstorm severity, seismic activity
F — Financial/Market:   Stock volatility, currency pressure, CDS spread, insurance penetration
```

---

## Map Layers (26)

**Risk:** Claims Heatmap, Fraud Hotspots, Risk Zones, Cat Exposure, Flood Zones

**Infrastructure:** Oil & Gas (15 facilities), Ports (9), Airports, Desalination, Power Grid, Undersea Cables, Mega Projects

**Geopolitical:** Conflict Zones (ACLED), Military Bases, Shipping Lanes, Strait of Hormuz, Sanctions

**Environment:** Weather Alerts, Sandstorms, Seismic Activity, Fire Hotspots

**Finance:** FDI Projects, Free Trade Zones

**Insurance:** Insured Asset Clusters, Treaty Zones, Loss Accumulation

---

## Variants

```bash
npm run dev                # Full GCC Monitor (default)
npm run dev:insurance      # Insurance-focused variant
npm run dev:geopolitical   # Geopolitical/OSINT variant
npm run dev:finance        # Finance/markets variant
```

---

## Self-Hosting

### Docker

```bash
docker compose up -d
```

### Environment Variables

```env
# Optional — all features work without API keys via Ollama
VITE_OLLAMA_URL=http://localhost:11434
VITE_GROQ_API_KEY=           # Cloud AI fallback
VITE_AISSTREAM_API_KEY=      # AIS maritime data
VITE_NASA_FIRMS_API_KEY=     # Fire detection
VITE_ACLED_API_KEY=          # Conflict data
VITE_FRED_API_KEY=           # Economic indicators
```

### Ollama (Local AI)

```bash
ollama pull llama3.2:3b     # Lightweight for summaries
ollama pull mistral:7b      # Deeper analysis
```

---

## Deevo Analytics Integration

Deevo Monitor connects to the **Deevo Analytics Cortex** (`:8010`) for insurance-specific intelligence:

- **Claims Service** (:8002) → Claims heatmap layer
- **Fraud Service** (:8003) → Fraud hotspot layer
- **Risk Service** (:8004) → Risk zone layer + country scoring
- **Geospatial Service** (:8005) → PostGIS hazard profiles
- **Pricing Service** (:8006) → Premium impact analysis
- **Compliance Service** (:8007) → Regulatory change tracking
- **Governance Service** (:8008) → Audit trail + XAI

---

## Inspired By

Built studying the architecture patterns of [World Monitor](https://worldmonitor.app) by [@eliehabib](https://github.com/koala73) (42k+ stars). Adapted for GCC insurance intelligence with domain-specific data layers, scoring models, and Deevo Analytics integration.

---

## License

AGPL-3.0 — Non-commercial use with attribution. Commercial/SaaS requires separate license.

---

**DEEVO MONITOR** by [BDRAI](https://github.com/PyBADR) · Powered by Ollama + Deevo Analytics Cortex
