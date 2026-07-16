# Credential Workflow

Credentials are production infrastructure, not application code.

## Rules

- Store secrets only in Vercel or an approved secret manager.
- Never commit `.env`, `.env.local`, secret exports, screenshots, or copied values.
- Never verify sensitive secrets with `vercel env pull` or `vercel env ls`.
- Verify runtime presence with `GET /api/admin/infrastructure-health`.
- Values may be checked only by presence, status, length, and redacted provider readiness.

## Rotation Flow

1. Create or update the secret in Vercel Preview.
2. Deploy Preview.
3. Use `vercel curl` to reach protected Preview diagnostics.
4. Authenticate through app admin.
5. Call `/api/admin/infrastructure-health`.
6. Confirm no blockers and expected connector readiness.
7. Repeat for Production only after approval.
8. Redeploy the target environment after env changes.
9. Record the outcome in the operator notes or audit trail.

## Credential Checklist

- Database: `DATABASE_URL`, `DIRECT_URL`
- Admin auth: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`
- Google OAuth: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`
- Search Console: `GOOGLE_SEARCH_CONSOLE_SITE_URL`
- UEIP Preview identity: `UEIP_PREVIEW_ENVIRONMENT_ID`, `UEIP_PREVIEW_DATABASE_FINGERPRINT`, `UEIP_PRODUCTION_DATABASE_FINGERPRINT` (non-secret identifiers; Preview and Production fingerprints must differ)
- GA4: `GOOGLE_ANALYTICS_PROPERTY_ID`
- YouTube: `YOUTUBE_CHANNEL_ID`
- Google Business Profile: `GOOGLE_BUSINESS_PROFILE_LOCATION_ID`
- Cron: `CRON_SECRET`
- Approved Execution: `APPROVED_EXECUTION_ENABLED`, `APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED`

## Redaction Standard

Diagnostics may show:

- key name
- present/missing
- empty/non-empty
- length
- placeholder status
- provider status code
- redacted error type

Diagnostics must never show:

- secret value
- token value
- provider response body
- authorization header
- cookie
- database URL contents
