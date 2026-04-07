#!/bin/sh
set -eu

run_backup_hook() {
  if [ "${ENABLE_BACKUP_ON_STOP:-0}" != "1" ]; then
    return 0
  fi

  if [ -z "${DATABASE_URL:-}" ]; then
    echo "[entrypoint] DATABASE_URL not set; skipping shutdown backup."
    return 0
  fi

  echo "[entrypoint] Running shutdown backup hook..."
  /app/scripts/container/backup-db.sh || echo "[entrypoint] Shutdown backup failed."
}

child_pid=""
received_stop_signal=0

on_stop() {
  received_stop_signal=1
  if [ -n "$child_pid" ] && kill -0 "$child_pid" 2>/dev/null; then
    kill -TERM "$child_pid" 2>/dev/null || true
  fi
}

trap on_stop TERM INT

"$@" &
child_pid="$!"

wait "$child_pid"
exit_code=$?

if [ "$received_stop_signal" -eq 1 ]; then
  run_backup_hook
elif [ "${RUN_BACKUP_ON_NORMAL_EXIT:-0}" = "1" ]; then
  run_backup_hook
fi

exit "$exit_code"
