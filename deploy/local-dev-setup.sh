#!/usr/bin/env bash
# local-dev-setup.sh — обёртка для запуска `pnpm dev` локально с Payload db.push
#
# Проблема: Payload 3 db.push использует @clack/prompts, которые спрашивают
# "Is X table created or renamed?" (на каждую новую таблицу) и
# "Accept warnings and push schema? (y/N)" (на data-loss warning).
# При ручном запуске pnpm dev оператор отвечает ~20-30 раз, что долго и
# подвержено ошибкам.
#
# Решение: Python PTY wrapper, который эмулирует TTY и автоматически отвечает:
# - Enter на "create/rename" prompts (accept default "create table")
# - 'y'+Enter на "Accept warnings" prompts
#
# Использование:
#   ./deploy/local-dev-setup.sh              # запуск pnpm dev с автоответами
#   ./deploy/local-dev-setup.sh --reset-db   # дроп локальной БД + фреш push
#
# Требования:
# - Docker Postgres: контейнер obikhod_postgres (см. site/docker-compose.yml)
# - Python 3 (встроен в macOS/Ubuntu)
# - site/.env.local с DATABASE_URI, PAYLOAD_SECRET, PAYLOAD_PREVIEW_SECRET

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE_DIR="$PROJECT_ROOT/site"
PG_CONTAINER="obikhod_postgres"

# --- 0. Sanity checks --------------------------------------------------------

if [ ! -d "$SITE_DIR" ]; then
  echo "✗ site/ not found at $SITE_DIR" >&2
  exit 1
fi

if [ ! -f "$SITE_DIR/.env.local" ]; then
  echo "✗ site/.env.local not found. Скопируй из .env.example и заполни." >&2
  exit 1
fi

# --- 1. Postgres ------------------------------------------------------------

if ! docker ps --format '{{.Names}}' | grep -q "^${PG_CONTAINER}$"; then
  echo "→ Запускаю Postgres (docker-compose)…"
  (cd "$SITE_DIR" && docker compose up -d)
  sleep 3
fi

docker exec "$PG_CONTAINER" pg_isready -U obikhod >/dev/null 2>&1 \
  || { echo "✗ Postgres не отвечает"; exit 1; }

# --- 2. Опциональный reset --------------------------------------------------

if [ "${1:-}" = "--reset-db" ]; then
  echo "→ Сброс локальной БД obikhod (prod не затрагивается)…"
  docker exec "$PG_CONTAINER" psql -U obikhod -d postgres \
    -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='obikhod';" \
    >/dev/null 2>&1 || true
  docker exec "$PG_CONTAINER" psql -U obikhod -d postgres \
    -c "DROP DATABASE IF EXISTS obikhod;" >/dev/null
  docker exec "$PG_CONTAINER" psql -U obikhod -d postgres \
    -c "CREATE DATABASE obikhod OWNER obikhod;" >/dev/null
  echo "✓ БД пересоздана пустой"
fi

# --- 3. Убиваем старые dev-процессы -----------------------------------------

pkill -9 -f "next dev" 2>/dev/null || true
pkill -9 -f "pnpm dev" 2>/dev/null || true
pkill -9 -f "run-pnpm-dev.py" 2>/dev/null || true
sleep 1

# --- 4. PTY wrapper ---------------------------------------------------------

echo "→ Запускаю pnpm dev с авто-ответами на Payload prompts…"
echo "  Логи: все ответы auto (create table / accept warnings)."
echo "  Остановить: Ctrl-C."
echo

python3 - <<PYEOF
import os, pty, select, sys, time, re, signal

CWD = "$SITE_DIR"
READY = re.compile(rb"Ready in \d+")
TABLE_RENAME = re.compile(rb"table created or renamed from another table")
WARNINGS = re.compile(rb"Accept warnings and push schema to database")

pid, fd = pty.fork()
if pid == 0:
    os.chdir(CWD)
    os.execvp("pnpm", ["pnpm", "dev"])

os.set_blocking(fd, False)

def cleanup(*_):
    try: os.kill(pid, signal.SIGTERM)
    except ProcessLookupError: pass
    sys.exit(0)

signal.signal(signal.SIGTERM, cleanup)
signal.signal(signal.SIGINT, cleanup)

buffer = b""
last_write = 0
MAX = 64 * 1024

while True:
    try:
        r, _, _ = select.select([fd], [], [], 0.3)
    except (OSError, ValueError):
        break
    if fd not in r: continue
    try:
        data = os.read(fd, 4096)
    except OSError:
        break
    if not data: break
    buffer += data
    sys.stdout.buffer.write(data); sys.stdout.buffer.flush()
    if len(buffer) > MAX: buffer = buffer[-MAX:]

    if time.time() - last_write < 0.2: continue

    tail = buffer[-2048:]
    if WARNINGS.search(tail):
        try:
            os.write(fd, b"y"); time.sleep(0.05); os.write(fd, b"\r")
            last_write = time.time(); buffer = b""
        except OSError: break
        continue
    if TABLE_RENAME.search(tail):
        try:
            os.write(fd, b"\r")
            last_write = time.time(); buffer = b""
        except OSError: break

try: os.waitpid(pid, 0)
except OSError: pass
PYEOF
