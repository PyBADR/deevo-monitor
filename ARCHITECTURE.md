# Deevo Monitor — Architecture

## 7-Layer Intelligence Stack

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 7: GOVERNANCE                                          │
│ Audit trails · SHA-256 hashing · PDPL compliance · RBAC     │
├─────────────────────────────────────────────────────────────┤
│ Layer 6: UI                                                  │
│ Vite 6 + React 18 + DeckGL 9.1 + MapLibre + Tailwind       │
│ Components: AppShell, GCCMap, LiveFeed, RiskScore, DRIBadge │
├─────────────────────────────────────────────────────────────┤
│ Layer 5: API                                                 │
│ Express REST + Socket.io WebSocket                           │
│ Routes: /api/feed, /api/risk, /api/ollama, /api/cortex      │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: AGENTS                                              │
│ Ollama LLM (llama3.2:3b) for briefings + forecasts          │
│ System prompt: GCC insurance risk analyst persona            │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: FEATURE STORE                                       │
│ Zustand stores: mapStore, dataStore, riskStore, feedStore    │
│ Time-series risk scores by region, in-memory cache           │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: RISK ENGINE                                         │
│ DRI calculation: weighted(fraud×0.35 + claims×0.25 +         │
│   weather×0.15 + geopolitical×0.25) → DRI 1-5               │
│ Country score normalization, trend detection                 │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: DATA INGESTION                                      │
│ RSS feeds (20+ GCC insurance sources) + WebSocket streaming  │
│ Cortex bridge: /api/v1/cortex/monitor/* endpoints            │
│ Ollama: local LLM inference, no cloud dependency             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
RSS Sources ──→ Feed Aggregator ──→ feedStore ──→ LiveFeed Panel
                     ↓                              ↓
                  Ollama ──→ AI Insights ──→ AIInsights Panel
                     ↓
Risk Engine ──→ DRI Calc ──→ riskStore ──→ RiskScore Panel
     ↓                          ↓
  Country Scores ──→ GeoJSON Layer ──→ DeckGL Map
     ↓
  Hotspots ──→ HeatmapLayer / HexagonLayer
  Fraud Arcs ──→ ArcLayer
  Alerts ──→ TextLayer (icons)
  Claims ──→ ScatterplotLayer
```

## DRI Formula

```
rawScore = fraud × 0.35 + claims × 0.25 + weather × 0.15 + geopolitical × 0.25
DRI = clamp(round(rawScore / 20), 1, 5)
```

| DRI | Label    | Color   | Action                        |
|-----|----------|---------|-------------------------------|
| 1   | SECURE   | #34C759 | Standard monitoring           |
| 2   | GUARDED  | #00D4FF | Enhanced awareness            |
| 3   | ELEVATED | #FFD600 | Active investigation          |
| 4   | HIGH     | #FF6B35 | Immediate assessment          |
| 5   | CRITICAL | #FF2D55 | Maximum alert, cascade events |

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Map Engine | DeckGL + MapLibre | GPU-accelerated, free basemaps, WebGL2 |
| State | Zustand | Minimal boilerplate, TypeScript-native |
| AI | Ollama (local) | No API keys, data sovereignty, GCC compliance |
| Build | Vite | Fast HMR, tree-shaking, ESM native |
| Styling | Tailwind | Utility-first, dark theme, RTL support |
| Real-time | Socket.io | Bi-directional, reconnect, room-based |
