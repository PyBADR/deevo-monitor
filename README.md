# Deevo Monitor v2.0 — GCC Insurance Intelligence Dashboard

Real-time risk monitoring dashboard for Gulf Cooperation Council insurance markets. Built with DeckGL, MapLibre GL, React, TypeScript, and AI-powered insights via Ollama.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Deevo Monitor v2.0                     │
├──────────┬──────────────────────────┬───────────────────┤
│ LiveFeed │    DeckGL + MapLibre     │  Risk / AI Panel  │
│  Panel   │                          │                   │
│          │  ⬡ HexagonLayer (risk)   │  ├─ RiskScore     │
│  RSS     │  ◉ ScatterplotLayer      │  ├─ AIInsights    │
│  Feed    │  ⌒ ArcLayer (fraud)      │  └─ PipelineStats │
│  Items   │  🔥 HeatmapLayer         │                   │
│          │  ⚠ AlertIconLayer        │                   │
├──────────┴──────────────────────────┴───────────────────┤
│             Bottom Ticker — Live Intelligence            │
└─────────────────────────────────────────────────────────┘
         ↕ Socket.io          ↕ REST API
┌─────────────────────────────────────────────────────────┐
│              Express + Socket.io Server                   │
│  ├─ /api/feed     — RSS aggregation                      │
│  ├─ /api/risk     — DRI engine + country scores          │
│  ├─ /api/ollama   — Local AI proxy                       │
│  └─ /api/cortex   — DeevoAnalytics bridge                │
└─────────────────────────────────────────────────────────┘
```

## Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React 18, TypeScript 5.7, Vite 6              |
| Map Engine  | DeckGL 9.1, MapLibre GL 4.7, react-map-gl 7.1 |
| State       | Zustand 5                                      |
| Styling     | Tailwind CSS 3.4                               |
| Charts      | Recharts 2.15                                  |
| API Server  | Express 5, Socket.io 4.8                       |
| AI          | Ollama (llama3.2:3b local)                     |
| RSS         | rss-parser                                     |
| Deployment  | Docker multi-stage, nginx                      |

## Quick Start

```bash
# Install dependencies
npm install

# Start frontend (port 5174) + API server (port 3001)
npm run dev:all

# Or start separately
npm run dev         # Vite frontend → localhost:5174
npm run dev:server  # Express API   → localhost:3001
```

## DRI — Deevo Risk Index

5-level composite risk scoring system (GCC insurance DEFCON equivalent):

| Level | Label    | Color  | Description                              |
|-------|----------|--------|------------------------------------------|
| DRI-1 | NORMAL   | Green  | All systems nominal                      |
| DRI-2 | ELEVATED | Yellow | Increased activity detected               |
| DRI-3 | HIGH     | Orange | Significant risk signals                  |
| DRI-4 | SEVERE   | Red    | Critical threshold breached               |
| DRI-5 | CRITICAL | Deep Red | Multiple cascading risk events         |

## Map Layers

- **HexagonLayer** — 3D risk density aggregation (25km hexagons)
- **ScatterplotLayer** — Claim clusters by volume and processing time
- **ArcLayer** — Cross-border fraud connections (animated arcs)
- **HeatmapLayer** — 2D risk intensity overlay
- **AlertIconLayer** — Active alert markers with severity

## Docker Deployment

```bash
# Build and run
docker compose up -d

# With Cortex connection
CORTEX_TOKEN=your-token docker compose up -d
```

## Environment Variables

| Variable        | Default                                  | Description              |
|-----------------|------------------------------------------|--------------------------|
| `PORT`          | `3001`                                   | API server port          |
| `CORS_ORIGIN`   | `http://localhost:5174`                  | Allowed CORS origin      |
| `OLLAMA_URL`    | `http://localhost:11434`                 | Ollama API endpoint      |
| `OLLAMA_MODEL`  | `llama3.2:3b`                            | Default LLM model        |
| `CORTEX_URL`    | `http://localhost:8010/api/v1/cortex`    | DeevoAnalytics Cortex    |
| `CORTEX_TOKEN`  | `dev-token`                              | Cortex auth token        |
| `CORTEX_TENANT` | `default`                                | Tenant ID                |

## GCC Coverage

Saudi Arabia (SA), United Arab Emirates (AE), Qatar (QA), Kuwait (KW), Bahrain (BH), Oman (OM)

## License

AGPL-3.0 — Deevo Analytics / BDRAI
