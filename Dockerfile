# ── Stage 1: Build React admin frontend ──────────────────────────────────────
FROM node:20-alpine AS admin-builder
WORKDIR /admin

COPY admin/package*.json ./
RUN npm install

COPY admin/ .
RUN npm run build
# Output lands in /admin/dist (vite.config.js build.outDir is relative;
# we override with an absolute-equivalent path here by copying the dist out)


# ── Stage 2: Backend ──────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ .

# Copy the built admin SPA into the backend's public folder
COPY --from=admin-builder /backend/public/admin ./public/admin

EXPOSE 3000
CMD ["node", "server.js"]
