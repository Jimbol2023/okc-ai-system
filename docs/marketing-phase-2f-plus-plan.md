# Phase 2F+ Social, Analytics, Content, and Sales Growth Plan

## Summary / Audit

- The target architecture is sound: make the AI OS the control center, keep all external platforms behind internal Next.js API routes, and preserve the `AI Draft -> Human Review -> Approve -> Publish` governance model.
- The highest-ROI next step is connection readiness, not publishing: verify accounts, permissions, missing credentials, and dashboard visibility before adding live actions.
- Current local work already supports the right foundation: Marketing Drafts, Approval Queue, Canva Assist, and Sales Conversion Assist. The next layer should plug into those workflows instead of creating a separate social workflow.
- Important correction: `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` alone generally cannot prove a connected Page/account. Most platforms require OAuth access tokens, service accounts, account IDs, scopes, or app review before account-level reads.

## Phase 1: Provider Connection Readiness

Add protected, server-only routes that validate configuration and test read-only connectivity when credentials exist:

- `POST /api/social/facebook`
- `POST /api/social/instagram`
- `POST /api/social/tiktok`
- `POST /api/social/linkedin`
- `POST /api/social/youtube`

Each route returns a standardized provider status:

```ts
{
  connected: boolean;
  provider: string;
  account?: string;
  permissions: string[];
  mode: "not_configured" | "credentials_present" | "connection_verified" | "needs_review" | "error";
  canPublish: false;
  publishEnabled: false;
  checkedAt: string;
  warnings: string[];
}
```

Implementation rules:

- No publishing.
- No scheduling.
- No posting.
- No browser-exposed secrets.
- No fake `connected: true` responses.
- If credentials are missing, return `not_configured`.
- If credentials exist but cannot verify account access, return `credentials_present` or `needs_review`.

Add a Marketing Hub section: Connected Accounts, showing Facebook, Instagram, GBP, YouTube, TikTok, and LinkedIn readiness.

## Phase 2: Read-Only Analytics

After connection readiness works, add analytics-only routes:

- `GET /api/analytics/ga4`
- `GET /api/analytics/search-console`
- `GET /api/analytics/facebook`
- `GET /api/analytics/gbp`

Dashboard questions answered:

- Visitors today.
- Best-performing article.
- Highest-reach Facebook post.
- GBP update views.
- Search impressions/clicks.

No sales decisions should be based on unverified analytics; label unavailable or partial data clearly.

## Phase 3: Content Engine

Add:

- `POST /api/content/create`
- `POST /api/content/repurpose`

Reuse existing `MarketingDraft` and `MarketingApproval` models.

Input:

```json
{
  "topic": "Inherited Property"
}
```

Output creates internal drafts only for:

- Facebook
- Instagram
- TikTok
- YouTube
- Google Business Profile
- Website article outline

No external provider calls. No automatic posting.

## Phase 4: Publishing Gate

Only after Phases 1-3 are proven:

- Start with `POST /api/social/facebook/publish`.
- Require approved draft.
- Require explicit human publish confirmation.
- Require verified connected account.
- Write audit log before and after publish attempt.
- Never publish automatically from AI generation.

Do not add TikTok, LinkedIn, Instagram, YouTube, or GBP publishing until Facebook publish governance is proven.

## Recommended ROI Priority

1. Facebook + Instagram connection readiness.
2. GBP connection readiness.
3. GA4 + Search Console analytics.
4. Content repurposing from one article into multi-channel drafts.
5. GBP/manual content assist.
6. Facebook publishing gate.
7. TikTok/LinkedIn later unless audience data proves strong ROI.

## Test Plan

Run from Windows PowerShell / Windows Node:

```powershell
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm.cmd run lint
npm.cmd run build
```

Add tests for:

- Missing credentials return `not_configured`.
- Secrets never appear in API responses.
- Publish flags always return `false` in Phase 1.
- Unapproved drafts cannot publish.
- Content routes create drafts only.
- Analytics routes do not mutate CRM, leads, drafts, or approvals.

## Assumptions

- Existing local commits should be pushed once GitHub credentials are fixed.
- `.env.local` will hold secrets, never committed.
- OAuth/token storage is not added until separately approved.
- Phase 2E/live publishing remains gated behind human approval and audit logging.
