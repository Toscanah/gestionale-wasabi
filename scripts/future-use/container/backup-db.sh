#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[backup] DATABASE_URL is not set; cannot run backup." >&2
  exit 1
fi

backup_dir="${BACKUP_DIR:-/backups}"
backup_file_name="${BACKUP_FILE_NAME:-gestionale-wasabi.dump}"
backup_base_name="${backup_file_name%.dump}"
backup_date="$(date +"%Y%m%d")"
daily_backup="$backup_dir/${backup_base_name}-${backup_date}.dump"
latest_backup="$backup_dir/latest.dump"
max_daily_backups=31

mkdir -p "$backup_dir"

echo "[backup] Writing daily dump to $daily_backup"
pg_dump "$DATABASE_URL" -F c -f "$daily_backup"

cp "$daily_backup" "$latest_backup"
echo "[backup] Updated latest snapshot at $latest_backup"

daily_files="$({ find "$backup_dir" -maxdepth 1 -type f -name "${backup_base_name}-????????.dump" 2>/dev/null || true; } | LC_ALL=C sort)"
daily_count="$(printf "%s\n" "$daily_files" | sed '/^$/d' | wc -l | tr -d ' ')"

if [ "$daily_count" -gt "$max_daily_backups" ]; then
  to_delete=$((daily_count - max_daily_backups))
  printf "%s\n" "$daily_files" | sed '/^$/d' | head -n "$to_delete" | while IFS= read -r old_file; do
    rm -f "$old_file"
    echo "[backup] Deleted old daily backup: $old_file"
  done
fi
