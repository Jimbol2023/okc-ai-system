# Testing Strategy

Testing protects the product from accidental automation drift as the dashboard grows.

Current validation commands:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e
```

TypeScript:

- Verifies route, component, API, and shared library types.
- Should run before build and before committing schema/API changes.

Lint:

- Runs on `app`, `components`, and `lib`.
- Existing warnings should be reduced over time, but new errors should block commits.

Build:

- Confirms authenticated dashboard pages stay dynamic when they depend on Prisma.
- Confirms public pages prerender safely.
- May require permission to write `.next` trace files in restricted local environments.

Playwright:

- Covers browser smoke tests for login, protected dashboard behavior, Knowledge search, command palette, and workflow orchestration readiness.
- Authenticated Playwright tests require `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the test process environment.
- Tests must not read `.env.local` directly.
- Tests must not log into real provider accounts.
- Tests must not send SMS, email, ads, social posts, calls, provider requests, or workflow triggers.

Safety regression tests:

- API and library tests should assert `providerCalled:false`.
- Workflow orchestration tests should assert `workflowTriggered:false`.
- Desktop automation tests should assert `desktopAutomationAuthorized:false`.
- Terminal and file-system readiness tests should assert no dashboard execution/write authority.

Pressure testing:

- `npm run test:activation-smoke` verifies the internal company loop against a development database: Executive Directive seed, Campaign 001 approval, department assignments, draft queue, decision memory, and Department Intelligence.
- `npm run test:pressure` runs authenticated Playwright pressure checks for repeated Executive Dashboard reads, repeated and concurrent Campaign 001 decisions, and Department Intelligence refresh.
- These tests are dev/staging-only. They must not run when `NODE_ENV=production` or `VERCEL_ENV=production`.
- Mutating pressure tests require `ALLOW_MUTATING_DEV_DB_TESTS=true`.
- Authenticated pressure tests require `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Pressure thresholds are intentionally conservative for remote Neon and can be tuned with `PRESSURE_DASHBOARD_P95_MS` and `PRESSURE_DECISION_MAX_MS`.
- Pressure tests must preserve `providerCalled:false`, `sent:false`, `published:false`, `outreachSent:false`, `workflowStarted:false`, and `liveExecutionAllowed:false`.
- Do not point load tools or pressure scripts at production unless a separate CEO-approved production load policy exists.

Deferred testing:

- Playwright visual screenshots for dashboard layout.
- Accessibility scans.
- Seeded test database flows.
- n8n draft workflow export validation with triggers disabled.
- Optional local/staging load tooling with `autocannon` or `k6`.
