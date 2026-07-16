#!/usr/bin/env bash
set -euo pipefail

compose_file="docker-compose.pressure.yml"
database_url="postgresql://jcapital_pressure:isolated-pressure-only@127.0.0.1:55432/jcapital_pressure?schema=public"
base_url="http://127.0.0.1:3100"
cookie_jar="$(mktemp)"
app_log="$(mktemp)"
app_pid=""

cleanup() {
  if [[ -n "$app_pid" ]]; then kill -- "-$app_pid" 2>/dev/null || true; fi
  docker compose -f "$compose_file" down --remove-orphans >/dev/null 2>&1 || true
  rm -f "$cookie_jar" "$app_log"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

docker compose -f "$compose_file" up -d --wait

export DATABASE_URL="$database_url"
export DIRECT_URL="$database_url"
export ADMIN_EMAIL="pressure-admin@localhost.invalid"
export ADMIN_PASSWORD="isolated-pressure-admin-password"
export AUTH_SECRET="isolated-professional-case-pressure-secret-32-bytes-minimum"
export PHASE4_LIVE_SMS_ENABLED="false"
export PHASE4_SMS_KILL_SWITCH="true"

npx prisma migrate deploy
node --import tsx scripts/configure-professional-case-pressure.ts

setsid npm run start -- --hostname 127.0.0.1 --port 3100 >"$app_log" 2>&1 &
app_pid="$!"

server_ready="false"
for _ in $(seq 1 90); do
  if curl --silent --fail --max-time 2 "$base_url/login" >/dev/null 2>&1; then
    server_ready="true"
    break
  fi
  if ! kill -0 "$app_pid" 2>/dev/null; then
    sed -n '1,160p' "$app_log" >&2
    exit 1
  fi
  sleep 1
done

if [[ "$server_ready" != "true" ]]; then
  sed -n '1,160p' "$app_log" >&2
  echo "pressure_app_readiness_timeout" >&2
  exit 1
fi

curl --silent --show-error --fail --max-time 10 --cookie-jar "$cookie_jar" \
  --header "content-type: application/json" \
  --data '{"email":"pressure-admin@localhost.invalid","password":"isolated-pressure-admin-password"}' \
  "$base_url/api/auth/login" >/dev/null

pressure_cookie="$(awk '$6 == "okcWholesaleAdminSession" { print $6 "=" $7 }' "$cookie_jar")"
if [[ -z "$pressure_cookie" ]]; then echo "pressure_auth_cookie_missing" >&2; exit 1; fi

curl --silent --show-error --fail --max-time 180 \
  --header "cookie: $pressure_cookie" \
  "$base_url/api/admin/professional-cases" >/dev/null

if ! PRESSURE_BASE_URL="$base_url" \
  PRESSURE_AUTH_COOKIE="$pressure_cookie" \
  PRESSURE_TARGET="development" \
  PRESSURE_CONFIRMATION="ISOLATED_NON_PRODUCTION_DATABASE" \
  npm run test:pressure:professional-cases; then
  sed -n '1,240p' "$app_log" >&2
  exit 1
fi

PLAYWRIGHT_EXTERNAL_SERVER="true" \
PLAYWRIGHT_BASE_URL="$base_url" \
ADMIN_EMAIL="$ADMIN_EMAIL" \
ADMIN_PASSWORD="$ADMIN_PASSWORD" \
npx playwright test tests/e2e/smoke.spec.ts
