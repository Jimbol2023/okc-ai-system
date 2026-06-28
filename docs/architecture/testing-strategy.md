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

Deferred testing:

- Playwright visual screenshots for dashboard layout.
- Accessibility scans.
- Seeded test database flows.
- n8n draft workflow export validation with triggers disabled.
