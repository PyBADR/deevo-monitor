# ── Stage 1: Build ────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Production ──────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

# Install only production deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy server source (runs via tsx in prod for simplicity)
COPY server ./server

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

# Port
EXPOSE 3001

# Start API server (serves static files from dist/)
ENV NODE_ENV=production
CMD ["npx", "tsx", "server/index.ts"]
