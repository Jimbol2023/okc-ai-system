# API Governance

Dashboard APIs are authenticated, runtime-only when they depend on Prisma, and explicit about safety flags.

Response conventions:

- Success responses use `ok:true`.
- Error responses use `ok:false`, `error`, and `providerCalled:false`.
- Dashboard partial-data paths return scoped data gaps instead of making the entire dashboard unusable when one subsection fails.
- Provider and outreach flags must stay truthful.

Current helper pattern:

- `lib/api-response.ts` provides shared success/error response body builders.
- `loadPartialData` gives dashboard aggregations a consistent partial-data gap message.
- Expensive read-only dashboard aggregations can use short server-side TTL caching after authentication.

Safety rules:

- APIs must not read or expose `.env.local`.
- APIs must not include secrets in responses, logs, metadata, or recommendations.
- Display/search APIs must not call providers, scrape, publish, create ads, send outreach, or mutate CRM state.
- OpenAI embeddings remain optional, server-only, and manually gated.
- Tool Registry APIs must preserve `providerCalled:false` and `liveExecutionAllowed:false` while they are in readiness/advisory mode.
- Safe Auto Mode APIs may evaluate internal automation eligibility but must not execute external actions.
- Phase 2 connector and intelligence APIs must remain authenticated, source-aware, and advisory by default.
- Connector lifecycle APIs may prepare readiness state but must not authenticate, enable live providers, or execute external calls without future approval policy.
- Phase 3 production-slice APIs must keep connector marketplace, install/test/enable, permissions, approvals, social operations, automation policies, learning outcomes, and mobile command center responses plan-only by default.
- Approval APIs may record decisions and update eligibility state. Controlled execution paths may be implemented behind exact-action governance gates, but implementation does not equal authorization. They must not send, publish, spend, authenticate providers, rotate secrets, or bypass Safe Auto Mode unless the exact governed runtime policy, feature flag, connector health, audit requirement, and human approval all allow that one action.
- Social operations APIs must include source labels and assumptions and must return `providerCalled:false`, `published:false`, `scheduled:false`, and `liveExecutionAllowed:false` unless a future controlled policy changes a specific action.

Deferred governance:

- Provider activation requires kill switches, audit logging, approval gates, and explicit operator intent.
- Background jobs require separate review before they can create durable workflow effects.

Cron routes:

- Vercel Cron requests must use `Authorization: Bearer $CRON_SECRET`.
- Proxy pass-through is allowed only for exact governed cron routes listed in code.
- Route handlers must still verify `CRON_SECRET`; proxy pass-through is not execution authority.
- Cron tokens must not grant access to unrelated authenticated API routes.

Related standards:

- `docs/architecture/enterprise-ai-governance-constitution.md`
- `docs/architecture/tool-registry-capability-manager.md`
- `docs/architecture/safe-auto-mode.md`
- `docs/architecture/phase2-enterprise-connector-intelligence-platform.md`
- `docs/architecture/phase3-production-execution-platform.md`
