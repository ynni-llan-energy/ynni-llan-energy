# Multi-stage build producing a minimal standalone Next.js runtime image.
#
# IMPORTANT — build-time vs runtime secrets:
# `next build` statically prerenders marketing pages, which render the site
# Header, which calls Auth.js's auth() -> reads the database (see the
# DATABASE_URL/AUTH_SECRET discovery from the Supabase migration). That means
# a *reachable* Postgres and *some* AUTH_SECRET must exist at build time —
# but they do NOT need to be the real production ones, and must not be: an
# image layer (and anything baked in via ARG/ENV) persists in the pushed
# image indefinitely. The CI workflow that builds this image points
# DATABASE_URL/AUTH_SECRET at a throwaway Postgres service container with a
# placeholder secret, purely so prerendering succeeds against *a* database,
# not *the* database.
#
# Real secrets (the production DATABASE_URL, AUTH_SECRET, RESEND_API_KEY,
# SANITY_API_TOKEN, CRON_SECRET) are runtime-only: injected via
# docker-compose's environment on the Hetzner box, read by the running
# container at request time. They are never passed as build args and never
# end up in this image.
#
# NEXT_PUBLIC_* vars are the exception — Next.js inlines them into the
# client bundle at build time by design, so they're passed as build args
# below. They are not secrets (a Sanity project ID/dataset is already
# visible in any browser request to Sanity's API).

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_PREVIEW_SECRET
# Throwaway values only — see the header comment. Never pass real secrets
# as build args for these two.
ARG DATABASE_URL
ARG AUTH_SECRET

ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID \
    NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET \
    NEXT_PUBLIC_SANITY_PREVIEW_SECRET=$NEXT_PUBLIC_SANITY_PREVIEW_SECRET \
    DATABASE_URL=$DATABASE_URL \
    AUTH_SECRET=$AUTH_SECRET \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- migrator: runs `drizzle-kit migrate` as a one-off, not part of `web` ----
# Deliberately not the full app build — just enough to run migrations.
# Deploy runs this via `docker compose run --rm migrate` before swapping
# the new `web` container in, so a bad migration fails the deploy instead
# of a half-migrated server going live.
FROM node:22-alpine AS migrator
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY drizzle.config.ts ./
COPY drizzle ./drizzle
COPY src/lib/db/schema.ts ./src/lib/db/schema.ts
CMD ["npx", "drizzle-kit", "migrate"]

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
