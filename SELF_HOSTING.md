# Self-Hosting DEEVO Monitor

## Prerequisites

- Docker + Docker Compose v2
- Ollama running locally (optional, for AI insights)

## Quick Start

```bash
git clone https://github.com/PyBADR/deevo-monitor.git
cd deevo-monitor
cp .env.example .env
docker compose up -d
```

Open http://localhost → Dashboard ready.

## With Ollama AI (Recommended)

1. Install Ollama:
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

2. Pull model:
```bash
ollama pull llama3.2
```

3. Edit `.env`:
```
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3.2
```

4. Restart:
```bash
docker compose up -d
```

## With DeevoAnalytics Cortex

If you have a DeevoAnalytics backend running:

```env
CORTEX_URL=http://your-cortex-host:8010/api/v1/cortex
CORTEX_TOKEN=your-api-token
CORTEX_TENANT=your-tenant-id
```

## Verify

- Web dashboard: http://localhost
- API health: http://localhost:3001/api/health
- Risk data: http://localhost:3001/api/risk/dri
- Feed data: http://localhost:3001/api/feed

## Production Deployment

For production, configure nginx with SSL:

```bash
# Set your domain
DOMAIN=monitor.deevo.ai docker compose -f docker-compose.yml up -d
```

## Ports

| Service | Port | Description |
|---------|------|-------------|
| Web | 80 | Static dashboard (nginx) |
| API | 3001 | Express + Socket.io |
| Ollama | 11434 | Local LLM (host machine) |
