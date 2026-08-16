#!/usr/bin/env bash
set -euo pipefail

# Keep Playwright entirely inside the Linux WSL filesystem. Windows TEMP paths
# are not valid transform/artifact locations for the Linux Node runtime.
export TMPDIR="${TMPDIR:-/tmp}"
export TEMP="${TEMP:-/tmp}"
export TMP="${TMP:-/tmp}"

exec ./node_modules/.bin/playwright test "$@"
