#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[restore] DATABASE_URL is not set; cannot run restore." >&2
  exit 1
fi

backup_dir="${BACKUP_DIR:-/backups}"
restore_path="$backup_dir/latest.dump"

if [ ! -f "$restore_path" ]; then
  echo "[restore] Backup file not found: $restore_path" >&2
  exit 1
fi

echo "[restore] Restoring from $restore_path"

if [ "$(head -c 5 "$restore_path" || true)" = "PGDMP" ]; then
  pg_restore --clean --if-exists --no-owner --no-privileges -d "$DATABASE_URL" "$restore_path"
else
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$restore_path"
fi

echo "[restore] Restore completed successfully"