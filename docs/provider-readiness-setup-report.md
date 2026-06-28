# Provider Readiness Setup Report

## Purpose

This readiness layer prepares J Capital Property Group for future API integrations without activating external providers. It is setup-only: no live external fetches, OAuth starts, ads, posts, scraping, enrichment writes, calendar writes, workflow triggers, or automated outreach are authorized by this phase.

## Credential Checklist

Lead capture and enrichment have the best near-term ROI:

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`
- ATTOM: `ATTOM_API_KEY`
- Google Maps: `GOOGLE_MAPS_API_KEY`
- OpenStreetMap: optional `OPENSTREETMAP_USER_AGENT`
- OpenAI: `OPENAI_API_KEY`
- Google Gemini: `GOOGLE_GEMINI_API_KEY`
- xAI: `XAI_API_KEY`
- n8n: `N8N_BASE_URL`, `N8N_ENCRYPTION_KEY`, `N8N_BASIC_AUTH_USER`, `N8N_BASIC_AUTH_PASSWORD`, optional `N8N_WEBHOOK_SECRET`

Operations tooling comes second:

- Vercel CLI: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Docker/n8n local database: `N8N_POSTGRES_DB`, `N8N_POSTGRES_USER`, `N8N_POSTGRES_PASSWORD`
- Postman: `POSTMAN_API_KEY`, `POSTMAN_WORKSPACE_ID`
- Google Calendar: `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_REDIRECT_URI`

Paid marketing comes after attribution, budget controls, and compliance review:

- Google Ads: `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID`
- Meta Marketing: `META_MARKETING_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, `META_APP_ID`, `META_APP_SECRET`
- LinkedIn Marketing: `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_AD_ACCOUNT_ID`, optional `LINKEDIN_ACCESS_TOKEN`

## Local n8n Setup

Use Docker Compose for local workflow design only:

```bash
docker compose up -d n8n
```

Expected local URL: `http://localhost:5678`.

Do not connect live lead sources, ad accounts, SMS, email, calendar writes, scraping, or enrichment writes in this phase. Build workflows as drafts and document required approvals before enabling triggers.

## Vercel CLI Setup

Install and authenticate the Vercel CLI outside the repo as needed, then store token/project metadata in local or Vercel environment variables. Do not commit `.env` or token values.

Suggested setup order:

1. Confirm Vercel project ownership and production domain.
2. Add `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.
3. Add `VERCEL_TOKEN` only in local shell, CI, or Vercel secret storage.
4. Run deployment checks after `npm run lint` and `npm run build` pass locally.

## Supabase Connection

Supabase should back lead capture and CRM storage before paid acquisition is scaled. Use the pooled `DATABASE_URL` for app runtime and `DIRECT_URL` for Prisma migrations when Supabase provides both.

Do not run schema migrations against production until there is a backup, rollback plan, and operator approval.

## Postman Strategy

Create a Postman workspace for internal API smoke tests after the provider readiness route is available. The first collection should cover:

- `GET /api/system-readiness`
- `GET /api/provider-readiness`
- `POST /api/leads` with a safe test lead and explicit source
- Auth failure cases for protected dashboard APIs

Do not store real provider secrets in Postman examples.

## Activation Order

1. Lead storage: Supabase/Postgres and existing lead capture validation.
2. Address/property readiness: Google Maps, OpenStreetMap, and ATTOM in read-only preview mode.
3. AI assistance: OpenAI first, then Gemini/xAI comparison only after audit and cost controls.
4. Workflow design: n8n manual drafts with disabled triggers.
5. Ops documentation: Postman and Vercel CLI.
6. Calendar scheduling: Google Calendar after manual approval gates.
7. Paid channels: Google Ads, Meta, and LinkedIn only after source attribution, budget controls, landing-page tracking, and compliance review.

## Current Safety Boundary

The readiness API must continue returning `providerCalled:false` and `liveCallsAllowed:false` for every provider until a later approved phase adds provider adapters, kill switches, audit logging, and explicit operator approval gates.
