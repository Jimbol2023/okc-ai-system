#!/usr/bin/env bash
set -euo pipefail

tracked_databases="$(git ls-files --cached -- 'dev.db' 'prisma/dev.db' '*.db' '*.db-journal' '*.sqlite' '*.sqlite-journal')"
if [[ -n "$tracked_databases" ]]; then
  echo "tracked_local_database_artifacts" >&2
  exit 1
fi

echo '{"status":"pass","trackedLocalDatabases":0}'
