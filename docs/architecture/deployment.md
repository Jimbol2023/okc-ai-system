# Deployment

The app is a Next.js application with Prisma-generated database access.

Standard validation commands:

```powershell
npm.cmd run prisma:generate
.\node_modules\.bin\tsc.cmd --noEmit
npm.cmd run infra:preflight
npm.cmd run infra:runtime-preflight
npm.cmd run lint
npm.cmd run build
```

Runtime expectations:

- Prisma client generation must run before production build when schema or generated client files change.
- Dashboard routes that depend on database reads must stay dynamic.
- Environment variables are configured outside git. `.env.local` must not be edited, committed, or exposed.
- Provider keys may exist only as deployment/runtime configuration and must not imply live activation.
- First Sprint 21 production start must leave `APPROVED_EXECUTION_ENABLED` unset or `false`; external approved execution remains blocked until post-deploy smoke tests pass.

Operational notes:

- Build-time prerender must not execute authenticated Prisma dashboard queries.
- Provider integrations are readiness-only unless a future governed phase explicitly activates them.
- Search should remain useful without providers through internal keyword ranking.
- Manual finance entries are required for finance KPIs; missing entries should be reported as data gaps, not fabricated values.
- Approved Execution Layer production external calls require both `APPROVED_EXECUTION_ENABLED=true` and `APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED=true`. Internal CRM task creation can be used for first smoke testing without provider calls.

## Infrastructure Health

The permanent admin health endpoint is `GET /api/admin/infrastructure-health`.

- It requires the existing admin session cookie.
- It reports environment variable presence, status, and length only.
- It never returns secret values, OAuth tokens, provider response bodies, or raw credentials.
- It reports Google OAuth token-exchange readiness as pass/fail/status only.
- It reports connector readiness from missing dependency keys and read-only OAuth readiness.

For protected Preview deployments, use `vercel curl` instead of `vercel env pull` or `vercel env ls`:

```powershell
vercel curl /api/admin/infrastructure-health --deployment https://<preview-url> -- --silent --show-error
```

If app admin authentication is required, sign in through `/api/auth/login` with a temporary cookie jar and then call the endpoint with that cookie. Do not print credentials or secret values in terminal output.

`npm run infra:preflight` runs before `npm run build` and certifies configuration only.

- Its success state is `CONFIGURATION_READY_RUNTIME_NOT_VERIFIED`; it must not be used as runtime health proof.
- Development and Preview report warnings without failing build-only workflows.
- Production promotion and runtime certification require `npm run infra:runtime-preflight`.
- `infra:runtime-preflight` checks governed database connectivity, audit visibility, schema readiness, and runtime-critical dependencies. It fails closed when database-backed audit evidence is unavailable.
- Provider token exchange checks run only when `INFRA_PREFLIGHT_PROVIDER_CHECKS=true`.

## Execution Capability Wording

CONTROLLED EXECUTION IMPLEMENTED means provider-capable paths may exist in code behind feature flags, exact approvals, connector configuration, smoke evidence, audit logging, and Safe Auto Mode checks.

LIVE EXECUTION AUTHORIZED means a specific governed policy has authorized one exact external action at runtime.

The default Production posture remains provider/external execution disabled. Provider-capable code paths do not authorize Gmail, Calendar, Drive, webhooks, SMS, publishing, outreach, ads, scraping, or CRM mutations by themselves.

## Production Operating Runbook

### Safe rollout

1. Deploy with `APPROVED_EXECUTION_ENABLED` unset or `false`.
2. Keep Gmail, Calendar, Drive, publish, social, SMS, ads, scraping, and enrichment write credentials unset until the app is healthy.
3. Confirm `/`, `/login`, `/api/system-readiness`, `/dashboard`, AI COO internal work, CEO Draft Workspace, and Approved Execution Layer all load.
4. Prepare and execute only an internal CRM task approval. The expected result is `providerCalled:false`, `sent:false`, `published:false`, `liveExecutionAllowed:false`, plus a CRM task reference.
5. Do not enable external approved execution until the internal CRM smoke test, audit log write, executive memory write, and business outcome placeholder are confirmed.

### External execution enablement

External execution requires both gates:

- `APPROVED_EXECUTION_ENABLED=true`
- `APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED=true`

Enable one connector at a time. Add only the exact provider credential or webhook being tested, execute one harmless CEO-approved action, verify audit and memory records, then decide whether to keep that connector enabled.

### Rollback

1. Set `APPROVED_EXECUTION_ENABLED=false` immediately.
2. Remove or disable the failing provider credential/webhook in Vercel.
3. Redeploy the last known-good production deployment from Vercel if application boot, dashboard rendering, or approval routes are affected.
4. Record the incident in the audit log or operations notes with the approval ID, connector ID, trace ID, and outcome.
5. Leave blocked approvals in `execution_blocked`; do not manually mark them executed.

### Approved execution incident response

If execution behaves unexpectedly:

- Disable `APPROVED_EXECUTION_ENABLED`.
- Preserve the approval item, audit event, memory event, provider response, and trace ID.
- Check whether audit or memory failed. A missing audit or memory write means the execution must be treated as failed/blocked, even if a provider returned success.
- Create a follow-up internal CRM task for investigation.
- Re-enable only after a new smoke test proves the exact connector/action is safe.

### Connector maintenance

Read-only connectors must report `connected`, `authenticated`, `readOnly`, `healthy`, `lastSuccessfulRead`, `lastFailure`, `permissions`, `dataFreshness`, and `sourceLabel`.

- Missing credentials create explicit data gaps.
- Stale reads should lower recommendation confidence.
- Connector writes remain blocked unless governed by exact approved execution.
- Provider readiness should be reviewed after credential rotation, OAuth scope changes, Vercel env changes, and failed reads.

### Operating-loop smoke test

Before production promotion, verify the full internal loop:

1. Morning Brief creates or feeds Daily Mission.
2. Daily Mission exposes CEO Decision Agenda.
3. CEO approval creates AI COO assignments.
4. Assignments create department work orders.
5. Work orders populate CEO Draft Workspace with structured department artifacts.
6. Draft approval prepares an exact Approved Execution item.
7. Exact execute writes audit, executive memory, operating-loop trace, and business outcome placeholder.
8. Tomorrow recommendations include blocked/executed outcomes, connector freshness, and department memory.
