# Sprint 19A Canonical Workspace Adoption Verification

Date: 2026-07-15
Branch: `sprint-19-canonical-daily-mission`
Canonical workspace: `/home/sabiu/projects/okc-wholesale-ai-system-git`
Rollback/source copy: `C:\projects\okc-wholesale-ai-system-git`
Baseline commit: `chore: adopt Linux-native WSL2 canonical workspace`

## WSL Recovery

- Downloaded official Ubuntu 24.04.4 WSL package to `C:\wsl-install\ubuntu-24.04.4-wsl-amd64.wsl`.
- Verified SHA256: `9B2F7730DC68227DD04A9F3E5EAB86AD85CAF556B8606AD94F1F29FF5C4FD3F5`.
- Registered isolated WSL2 distro `Ubuntu-19A` at `C:\wsl-distros\Ubuntu-19A`.
- Preserved the stale `Ubuntu` distro registration. No unregister/reset was performed against `Ubuntu`.
- Created Linux user `sabiu`, granted sudo, and set it as the default user for `Ubuntu-19A`.
- Verified Ubuntu 24.04.4 LTS, WSL2 kernel, and canonical workspace path.

## Migration

- Migrated the current Windows worktree into `/home/sabiu/projects/okc-wholesale-ai-system-git` using Linux-side `rsync`.
- Included `.git`, tracked files, untracked app/API/lib/test/doc/migration files, generated Prisma output, and `package-lock.json`.
- Excluded local/heavy artifacts: `node_modules`, `.next`, `.vercel`, logs, coverage, test-results, `.env`, `.env.local`, and `.env.*.local`.
- Normalized CRLF line endings in three non-generated files that failed Linux `git diff --check` after migration:
  - `app/(dashboard)/dashboard/knowledge/decision/route.ts`
  - `components/dashboard/knowledge-hub-client.tsx`
  - `lib/executive-dashboard.test.ts`

## Audit Results

- `pwd`: `/home/sabiu/projects/okc-wholesale-ai-system-git`
- `git status --branch --short`: branch `sprint-19-canonical-daily-mission`, tracking `origin/sprint-19-canonical-daily-mission`.
- `git ls-files --deleted`: empty; no tracked deletions detected.
- `git diff --stat`: 55 tracked files changed, 41,875 insertions, 21,295 deletions before final verification-note/test updates.
- `git status --ignored --short generated/prisma`: expected generated Prisma changes plus `generated/prisma/libquery_engine-debian-openssl-3.0.x.so.node`.
- `git diff --check`: after source CRLF normalization, remaining findings are only generated Prisma `generated/prisma/index.d.ts` trailing whitespace.

## Engineering Pipeline

All commands below were run from `/home/sabiu/projects/okc-wholesale-ai-system-git` inside `Ubuntu-19A`.

- `npm ci`: passed. Prisma postinstall generated Prisma Client v6.19.3. NPM audit reported 8 vulnerabilities: 1 low, 4 moderate, 3 high.
- `npx prisma generate`: passed. A second run produced the same generated Prisma file set, confirming deterministic Linux-generated output.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with 4 warnings and 0 errors.
- `npm run test:safety`: initially failed because `tests/safety/ueip-runtime-gateway.test.ts` did not seed auth env defaults for `createSessionToken`; fixed with test-only env defaults. Re-run passed: 260 tests, 12 suites, 0 failures.
- `npm run build`: passed. `prebuild` infrastructure preflight reported deployment blockers for missing `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`; the preflight remained advisory in development and reported `providerCalled: false` and `liveExecutionAllowed: false`. Next.js build compiled successfully.

## Remaining Risks

- The Windows worktree is retired operationally and should remain rollback/source copy only.
- Future development should happen exclusively in `/home/sabiu/projects/okc-wholesale-ai-system-git`.
- `git diff --check` still reports generated Prisma whitespace in `generated/prisma/index.d.ts`; this was reproduced by Prisma generation and is recorded as generated-output noise.
- NPM audit vulnerabilities remain for a separate dependency-governance sprint.
- Deployment secrets are intentionally absent from local development and must be supplied through governed environment management before deployment.
