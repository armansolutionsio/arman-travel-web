FROM node:20-alpine AS base

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# --- Builder ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
ARG NEXT_PUBLIC_URL_INSTAGRAM=https://www.instagram.com/armantravel.arg
ARG NEXT_PUBLIC_URL_WHATSAPP=https://wa.me/5491156989263
ENV NEXT_PUBLIC_URL_INSTAGRAM=$NEXT_PUBLIC_URL_INSTAGRAM
ENV NEXT_PUBLIC_URL_WHATSAPP=$NEXT_PUBLIC_URL_WHATSAPP

# Copy assets into public for the build
RUN mkdir -p public/videos public/images
RUN cp videos/portada.mp4 public/videos/portada.mp4 2>/dev/null || true
RUN cp "imagenes/logo arman.png" public/images/logo-arman.png 2>/dev/null || true

RUN npm run build

# --- Runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
