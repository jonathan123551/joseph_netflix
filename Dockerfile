# syntax=docker/dockerfile:1
# Backend (NestJS + Prisma) image for Railway.
# Build context MUST be the repository root (this is a pnpm workspace).

# ---------- builder ----------
FROM node:22-slim AS builder
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.15.1 --activate
WORKDIR /app

# Workspace + manifests first for better layer caching.
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/backend/package.json apps/backend/
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/ui/package.json packages/ui/

# Prisma schema/config are needed by backend's postinstall (`prisma generate`).
COPY apps/backend/prisma apps/backend/prisma
COPY apps/backend/prisma.config.ts apps/backend/

# Install only the backend and its dependencies.
# --no-frozen-lockfile keeps deploys from breaking if the lockfile drifts.
RUN pnpm install --filter backend... --no-frozen-lockfile

# Backend source + compile.
COPY apps/backend apps/backend
RUN pnpm --filter backend build

# ---------- runner ----------
FROM node:22-slim AS runner
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.15.1 --activate
ENV NODE_ENV=production
WORKDIR /app/apps/backend

# Carry the installed workspace (generated Prisma client + Prisma CLI) and build output.
COPY --from=builder /app /app

EXPOSE 3000
# Apply any pending migrations on every deploy, then start the server.
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main"]
