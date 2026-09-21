#!/usr/bin/env bash
set -euo pipefail

# Daily Postgres backup: dump -> gzip -> upload off-box via rclone -> rotate.
#
# One-time setup this script does NOT do for you:
#   1. Install rclone and run `rclone config` once to set up a remote —
#      either a Hetzner Storage Box (SFTP) or a Backblaze B2 bucket. Name
#      it whatever RCLONE_REMOTE below points at.
#   2. Test a restore at least once before relying on this. Download a
#      backup, gunzip it, and psql it into a scratch database. A backup
#      that has never been restored is a guess, not a backup:
#        gunzip -c ynni-llan-<timestamp>.sql.gz | psql "$SCRATCH_DATABASE_URL"
#      then spot-check row counts and a member row against the source.
#
# Configure via /opt/ynni-llan-energy/.env (the same file docker-compose.yml
# reads), or override RCLONE_REMOTE/RETAIN_DAYS directly when invoking this
# script.

RCLONE_REMOTE="${RCLONE_REMOTE:-hetzner-storagebox:ynni-llan-backups}"
RETAIN_DAYS="${RETAIN_DAYS:-14}"

COMPOSE_DIR="/opt/ynni-llan-energy"
BACKUP_DIR="$COMPOSE_DIR/backups"
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
FILENAME="ynni-llan-${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"
cd "$COMPOSE_DIR"

# shellcheck disable=SC1091
set -a
source .env
set +a

echo "Dumping database..."
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  | gzip > "$BACKUP_DIR/$FILENAME"

if [ ! -s "$BACKUP_DIR/$FILENAME" ]; then
  echo "Backup file is empty — aborting without uploading or rotating anything." >&2
  rm -f "$BACKUP_DIR/$FILENAME"
  exit 1
fi

echo "Uploading to $RCLONE_REMOTE..."
rclone copy "$BACKUP_DIR/$FILENAME" "$RCLONE_REMOTE/"

echo "Rotating local backups older than $RETAIN_DAYS days..."
find "$BACKUP_DIR" -name "ynni-llan-*.sql.gz" -mtime "+$RETAIN_DAYS" -delete

echo "Rotating remote backups older than $RETAIN_DAYS days..."
rclone delete "$RCLONE_REMOTE/" --min-age "${RETAIN_DAYS}d"

echo "Backup complete: $FILENAME"
