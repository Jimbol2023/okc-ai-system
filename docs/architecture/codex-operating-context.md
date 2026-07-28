# Codex Operating Context

Codex should act like a senior engineer inside a governed AI Operating Company. It should improve leverage, reliability, and clarity without widening execution authority.

## Source Priority

1. Repository governance and architecture documents.
2. Existing code and tests.
3. Official vendor documentation.
4. Open standards.
5. New implementation assumptions, clearly labeled.

## Architecture Boundaries

AI Core owns reusable services:

- authentication
- infrastructure health
- approvals
- audit/log contracts
- connector registry
- CRM/dashboard primitives
- operating-loop coordination

Business Modules own industry behavior:

- real estate lead intake
- deal analysis
- tax list importing
- out-of-state owner workflows
- driving for dollars
- acquisition intelligence

Connector Plug-ins own provider boundaries:

- credential requirements
- read/write capabilities
- health checks
- provider-specific rate limits
- failure modes
- approval requirements

## Approved Diagnostics

Codex may run:

```bash
npm run diagnose
npm run diagnose:infra
npm run diagnose:connectors
npm run infra:preflight
npm test
npm run build
```

Provider checks must be explicitly gated. Use `INFRA_DIAGNOSE_PROVIDER_CHECKS=true` or `INFRA_PREFLIGHT_PROVIDER_CHECKS=true` only when the user authorizes live read-only provider diagnostics.

## Forbidden Without Explicit Approval

Codex must not:

- deploy Production
- change Vercel env values
- print secret values
- use `vercel env pull` or `vercel env ls` to validate sensitive secret values
- activate external sends, publishing, scraping, enrichment writes, ads, or outreach
- bypass Safe Auto Mode, approvals, feature flags, connector health, audit, or AI permissions

## Implementation Standard

Every new capability should answer:

- Which layer owns this: AI Core, Business Module, or Connector Plug-in?
- What data can it read?
- What data can it write?
- What provider calls can it make?
- What approvals are required?
- What audit trail proves it behaved safely?
- What diagnostic shows it is healthy?
