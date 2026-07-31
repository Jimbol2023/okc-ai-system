# Sprint 24 GA4 Governed Read-Only Connector Review

## Scope

Sprint 24 promotes Google Analytics 4 from a direct read-only snapshot adapter into a UEIP-governed read-only connector path.

The implementation reuses the Sprint 23 Search Console governance model:

- tenant installation validation
- credential reference verification
- read-only OAuth scope enforcement
- feature flag gating
- Preview/development runtime boundaries
- audit chain evidence
- timeout, retry, rate-limit, cache, and circuit-breaker behavior
- normalized internal evidence
- no raw provider payload delivery

## Authorized Read Capability

GA4 is authorized only for bounded aggregate read reporting through:

`POST https://analyticsdata.googleapis.com/v1beta/properties/{propertyId}:runReport`

Required scope:

`https://www.googleapis.com/auth/analytics.readonly`

Implemented capabilities:

- `analytics.traffic.read`
- `analytics.page.performance.read`
- `analytics.conversion.summary.read`

## Explicitly Blocked

Sprint 24 does not authorize:

- GA4 Admin API writes
- tag or key-event mutation
- audience mutation
- attribution configuration changes
- property mutation
- CRM mutation
- lead creation
- outreach
- publishing
- scraping
- workflow automation
- external execution
- memory persistence
- KPI persistence
- production provider-read promotion

## Evidence Delivery

GA4 evidence is admitted only as `business-data-snapshot-v1` normalized evidence with:

- connector id `google_analytics`
- source label from the certified GA4 adapter
- evidence hash
- observation window
- trace id
- reliability metadata
- aggregate metrics
- sanitized records
- data gaps and assumptions
- read-only safety flags

GA4 evidence may support Marketing Intelligence, Revenue Intelligence, Executive Memory candidates, and CEO Dashboard visibility. It cannot create tasks, approvals, campaigns, website edits, provider writes, CRM records, or external actions.

## CEO Approval Stop

Sprint 24 stops after internal verification and governance review.

CEO approval is required before any later production promotion, provider-read expansion, persistence expansion, or external action path.
