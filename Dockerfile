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

ARG NEXT_PUBLIC_URL_INSTAGRAM=https://www.instagram.com/armantravel.arg
ARG NEXT_PUBLIC_URL_WHATSAPP=https://wa.me/5491156989263?text=Hola!%20Quiero%20mas%20info..
ARG DATABASE_URL=postgresql://arman_user:arman_password_2024@db:5432/arman_travel
ENV NEXT_PUBLIC_URL_INSTAGRAM=$NEXT_PUBLIC_URL_INSTAGRAM
ENV NEXT_PUBLIC_URL_WHATSAPP=$NEXT_PUBLIC_URL_WHATSAPP
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

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

# Install pg for init script
RUN npm install pg --prefix /app/tools --no-save 2>/dev/null

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/scripts/init-db.js ./scripts/init-db.js
COPY --from=builder /app/scripts/seed-caribe.js ./scripts/seed-caribe.js

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "NODE_PATH=/app/tools/node_modules node scripts/init-db.js && NODE_PATH=/app/tools/node_modules node scripts/seed-caribe.js; node server.js"]
