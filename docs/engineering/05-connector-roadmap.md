# Connector Roadmap

Connector work must preserve provider governance, least privilege, approval gates, auditability, and Safe Auto Mode.

## Connector Maturity Levels

1. Registry only: connector is known but not usable.
2. Readiness metadata: connector requirements and blockers are visible.
3. Read-only adapter: connector can produce governed snapshots without writes.
4. Internal work integration: read-only signals create internal tasks or drafts.
5. Approved exact-action execution: one approved action can run with audit and fail-closed behavior.
6. Production governed automation: recurring execution under explicit policy, monitoring, rollback, and kill switches.

## Current Priority Families

- Google Workspace: Gmail, Calendar, Drive, Search Console, GA4, YouTube.
- Google Business Profile: discovery, location resolution, performance, reviews, draft-only trust tasks.
- Canva and design systems: metadata, asset briefs, future governed creation/export.
- Communication: Twilio/SMS, email, phone, consent, DNC, and exact approval.
- Property data: county records, ATTOM, mapping, manual upload, no unauthorized scraping.
- Operations: Vercel, GitHub, diagnostics, deployment readiness.

## Connector Safety Rules

- Connector readiness is not permission to execute.
- OAuth scope changes require explicit approval.
- Provider writes require exact-action approval and audit.
- Rate limits must fail closed and produce operator-safe next actions.
- Scraping is blocked unless explicitly governed and legally reviewed.
