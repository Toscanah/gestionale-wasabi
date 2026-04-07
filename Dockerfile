# --- Stage 1: Build ---
FROM node:24-alpine AS builder

# Container filesystem path. Source files still come from repository root.
WORKDIR /app

# Install ALL dependencies (including dev tools needed for the build)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps

# Generate Prisma client and build the Next.js app
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
COPY . .
RUN npm run build

# --- Stage 2: Run ---
FROM node:24-alpine AS runner

WORKDIR /app

# pg_dump is required for container-native backup routines.
RUN apk add --no-cache postgresql-client

# Set environment to production
ENV NODE_ENV=production

# 1. Copy the strictly necessary runtime files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
# 2. Copy the now-slimmed-down node_modules
COPY --from=builder /app/node_modules ./node_modules
# 3. Copy Prisma schema for the schema-sync command
COPY --from=builder /app/prisma ./prisma
# 4. Copy Prisma CLI config used by db push
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
# 5. Copy runtime container scripts (entrypoint + backup hook)
COPY --from=builder /app/scripts/container ./scripts/container

RUN chmod +x /app/scripts/container/*.sh

EXPOSE 3000

# Wrap runtime command to support graceful shutdown backup hooks.
ENTRYPOINT ["/app/scripts/container/entrypoint.sh"]

# Start the Next.js server
CMD ["npm", "start"]