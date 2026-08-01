# Production Schema Alignment And Figma-Led CEO Dashboard UX Plan

## Scope

This review separates the live dashboard blocker from the CEO Dashboard UX opportunity.

The `BusinessDataSnapshot.version does not exist in the current database` message is a schema drift signal. The repository Prisma model already includes the hardened snapshot fields. Production operators should align the live database with the committed migration before treating dashboard layout as the cause.

## Required Migration

- Migration id: `20260716100000_harden_business_data_snapshots`
- Migration path: `prisma/migrations/20260716100000_harden_business_data_snapshots/migration.sql`
- Expected SHA256: `CB77DE1EBA483EA38E205A2A4081222873BE06FB6C21A30399803D1F19C8C890`
- Hardened columns:
  - `version`
  - `contractVersion`
  - `evidenceHash`
  - `observationStart`
  - `observationEnd`
  - `traceId`
  - `reliability`

The internal infrastructure health report now checks these columns and reports missing fields as pending migration work. This is an operator deployment action only.

## Operator Readiness Proof

No approved internal immutable migration-hash record location was found in this repository. Do not create a new hash registry for this migration. After CEO approval and a matching local SHA256, this is recorded as `not_applicable_no_registry_found` and is not a permanent blocker.

Readiness states:

- `blocked`: hash, ledger, schema, backup, or pending-chain proof is missing or unsafe.
- `ready_to_execute`: the target migration is absent, all earlier migrations are clean, schema and backup proof are complete, and the one approved migration may be executed.
- `already_applied_verify_only`: the target migration is already applied cleanly; skip execution and complete verification.
- `complete`: ledger, schema, snapshot select, dashboard, dry-run, and department compatibility checks passed.
- `review_required`: the migration is applied but one or more post-migration or department checks failed.

Read-only Production evidence to collect before CEO approval:

```powershell
npm.cmd exec prisma migrate status --schema prisma/schema.prisma
```

```powershell
psql "$env:DATABASE_URL" -c "SELECT migration_name, started_at, finished_at, rolled_back_at, logs FROM ""_prisma_migrations"" WHERE migration_name = '20260716100000_harden_business_data_snapshots';"
```

```powershell
psql "$env:DATABASE_URL" -c "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'BusinessDataSnapshot' AND column_name IN ('version','contractVersion','evidenceHash','observationStart','observationEnd','traceId','reliability') ORDER BY column_name;"
```

```powershell
psql "$env:DATABASE_URL" -c "SELECT migration_name, finished_at, rolled_back_at FROM ""_prisma_migrations"" ORDER BY started_at, migration_name;"
```

Recovery evidence to collect before CEO approval:

- PITR or backup enabled proof
- latest known recoverable point
- recovery owner
- target RTO and RPO
- rollback decision authority
- application rollback path

Approved execution command after blockers are resolved:

```powershell
npm.cmd exec prisma migrate deploy --schema prisma/schema.prisma
```

Do not execute this command if the pending migration chain includes any unexpected earlier migration. Prisma applies pending migrations in order, so the operator must confirm the only pending work in scope is this approved schema alignment.

Post-migration read-only verification:

```powershell
psql "$env:DATABASE_URL" -c "SELECT id, ""tenantId"", version, ""contractVersion"", ""evidenceHash"", ""observationStart"", ""observationEnd"", ""traceId"", reliability FROM ""BusinessDataSnapshot"" LIMIT 1;"
```

Department compatibility checks:

- CEO Dashboard: `/dashboard` no longer reports `BusinessDataSnapshot.version does not exist`.
- Draft Workspace: `/dashboard/drafts` loads, previews, saves, and records internal decisions without provider calls.
- Production dry-run: run only after schema proof and confirm provider, publishing, sent, workflow, CRM, outreach, scraping, and automation flags remain false.
- Search/Market Intelligence: normalized `business-data-snapshot-v1` evidence remains readable without raw provider payloads.
- Revenue Intelligence: GA4, Search Console, and GBP snapshot context remains advisory only.
- Buyer-Demand Prioritization/Certification: cross-connector evidence loads or becomes data gaps without provider retries.
- Cross-Connector Certification: evidence hashes, trace IDs, observation windows, and data gaps remain readable.
- Department OS/Morning Brief: snapshot gaps degrade gracefully and do not authorize work execution.

## Safety Boundary

Schema drift does not authorize provider reads, CRM mutation, outreach, publishing, scraping, automation, production promotion, recurring jobs, memory persistence, KPI persistence, or external execution.

The readiness check is diagnostic. It does not apply migrations and does not call Search Console, GA4, Google Business Profile, buyer data providers, or any external workflow.

## Figma Direction

Figma should become the design system source of truth for executive UX, while React and Next.js remain the implementation source.

Phase 1 should redesign one screen family at a time:

- CEO Dashboard
- Morning Brief
- Revenue Command Center

The design work should focus on visual hierarchy, spacing rhythm, typography scale, grouping, scan paths, visual priority, mobile responsiveness, and executive readability. It should not become a full-application redesign or change governed connector behavior.

## CEO Stop Condition

Before any production migration or dashboard UX rollout, CEO/operator approval is required. After the approved migration deployment, operators should verify `/dashboard` and `/dashboard/drafts` no longer report missing `BusinessDataSnapshot` hardened columns and that department compatibility checks classify as `complete`.
