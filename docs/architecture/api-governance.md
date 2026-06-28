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

Deferred governance:

- Provider activation requires kill switches, audit logging, approval gates, and explicit operator intent.
- Background jobs require separate review before they can create durable workflow effects.
