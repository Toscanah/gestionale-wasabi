#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[migrate] DATABASE_URL is not set; cannot run migrations." >&2
  exit 1
fi

migrations_dir="/app/prisma/migrations"

if [ ! -d "$migrations_dir" ]; then
  echo "[migrate] Migrations directory not found at $migrations_dir" >&2
  exit 1
fi

first_migration="$(for path in "$migrations_dir"/*; do [ -d "$path" ] && basename "$path"; done | LC_ALL=C sort | head -n 1)"

if [ -z "$first_migration" ]; then
  echo "[migrate] No migration folders found in $migrations_dir" >&2
  exit 1
fi

migrations_table_exists="$(psql "$DATABASE_URL" -tAc "SELECT to_regclass('public._prisma_migrations') IS NOT NULL" | tr -d '[:space:]')"

if [ "$migrations_table_exists" = "f" ]; then
  app_tables_count="$(psql "$DATABASE_URL" -tAc "SELECT count(*) FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'" | tr -d '[:space:]')"

  if [ "${app_tables_count:-0}" -gt 0 ]; then
    echo "[migrate] Existing schema detected without migration history; baselining with $first_migration"
    npx prisma migrate resolve --applied "$first_migration"
  fi
fi

echo "[migrate] Applying Prisma migrations"
npx prisma migrate deploy
