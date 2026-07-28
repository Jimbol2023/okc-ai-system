#!/usr/bin/env bash
set -euo pipefail

if [[ "${NODE_ENV:-development}" == "production" || "${VERCEL_ENV:-development}" == "production" ]]; then
  echo "production_full_verification_blocked" >&2
  exit 1
fi

npx prisma validate
npx tsc --noEmit
npm run lint
npm run test:unit:all
npm run test:safety
npm run build:storybook
npm run build
npm run test:pressure:professional-cases:isolated
