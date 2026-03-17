# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM oven/bun:1.2-alpine AS builder
WORKDIR /app

# Install dependencies first (layer cached separately)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build

# ── Stage 2: Serve with nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Copy built static assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config template — $PORT substituted at container start
COPY nginx.conf /etc/nginx/templates/default.conf.template

ENV PORT=8080
EXPOSE 8080

# envsubst replaces $PORT in template, then nginx starts
CMD ["/bin/sh", "-c", \
  "envsubst '$PORT' < /etc/nginx/templates/default.conf.template \
   > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
