# UEIP Phase 2 — Runtime Gateway Adoption

## Decision

UEIP is the mandatory runtime boundary for migrated external capabilities. Google Search Console is the first reference connector. Its live read path is authorized only in Preview after tenant installation, policy, scope, feature flag, site authorization, health, durable preflight audit, credential broker, endpoint allowlist, and adapter certification gates pass.

Development returns deterministic fixtures. Production remains blocked. No write, publishing, outreach, CRM mutation, scraping, connector auto-activation, or autonomous execution is authorized.

## Runtime Sequence

`Trusted context → Tenant installation → Policy → Reliability gates → Preflight audit → Credential broker → Certified adapter → Schema normalization → Completion audit and health → Safe response`

- Tenant and actor come from a signed session or pinned system-cron context.
- Environment comes from trusted server configuration, never the request.
- The installation is resolved by tenant and connector before credential access.
- Audit failure before the call blocks the provider.
- Audit or health persistence failure after the call quarantines the result.
- Department consumers receive only versioned normalized signals with provenance and data gaps.

## Reference Capabilities

- Active in Phase 2: `seo.page.performance.read`, `seo.indexing.summary.read`.
- Registered, not implemented: `seo.site.list`, `seo.performance.read`, `seo.query.performance.read`.

The Search Console adapter admits only approved HTTPS hosts, methods, path templates, site URLs, inspection URLs, dates, and bounded row limits. It enforces timeouts, bounded retries, response-size limits, JSON/schema validation, per-tenant rate limits, request coalescing, freshness caching, and tenant-installation circuit state.

## Migration Matrix

| Path | Provider | Classification | UEIP status | Required action |
| --- | --- | --- | --- | --- |
| Certified Search Console adapter | Google Search Console | Read-only | Migrated / Preview pilot | Establish pilot baseline, then certify |
| Shared read-only business adapters | Google/Canva | Legacy, partly duplicated | Consolidation candidate | Migrate one connector at a time |
| Approved execution provider paths | Gmail/Calendar/Drive/webhooks | Controlled-write, legacy governed | Not migrated | Defer until exact-write UEIP phase |
| Google Drive draft pilot | Google Drive | Controlled-write, legacy governed | Not migrated | Preserve until controlled-write migration |
| GBP discovery | Google Business Profile | Legacy read/OAuth | Consolidation candidate | Migrate after read reference certification |
| Twilio automation | Twilio | Controlled-write, legacy governed | Not migrated | Defer until communications UEIP phase |
| Twilio inbound webhook | Twilio | Registered inbound boundary | Boundary only | Apply certified webhook standard later |
| Infrastructure OAuth probe | Google | Legacy readiness | Consolidation candidate | Replace with credential health contract |
| OpenAI embeddings | OpenAI | Legacy AI-provider boundary | Consolidation candidate | Migrate under AI-provider adapter contract |

The machine-readable inventory in `lib/ueip-provider-surface-inventory.ts` is authoritative for CI enforcement. New external URLs, provider credential access, SDK imports, or provider calls must be registered or CI fails.

## Closeout Gate

- Cross-tenant and request-supplied authority fail closed.
- Preview is the only live pilot environment.
- Preflight evidence exists before every provider attempt.
- Secrets and raw provider payloads never enter responses, audits, snapshots, or logs.
- Search Console results are normalized and source-attributed.
- Timeout, quota, malformed response, audit failure, circuit, caching, and concurrency behavior are covered.
- All non-migrated provider surfaces remain classified.
- Initial service targets are not invented; they will be set from pilot evidence.

Sprint 15 Enterprise Learning may consume normalized reliability, policy, and verified outcome signals only after this gate closes. It may not consume opaque raw provider payloads or modify UEIP authority autonomously.

## 2M–2P Hardened Preview Pilot

- Preview configuration requires a distinct non-secret Preview database fingerprint and explicit Production fingerprint mismatch.
- Installation configuration, authorization, pilot, readiness, and rollback are admin-only Preview APIs.
- A ten-minute authorization stores only a nonce hash, permits one `seo.page.performance.read`, and is atomically consumed before provider access.
- A rollback disable/restore drill must be recorded before authorization.
- The successful pilot automatically disables and locks the installation after the provider attempt.
- The blocked-site probe uses a server-owned invalid site and must record no credential or provider attempt.
- Gateway evidence uses monotonic per-trace sequence numbers and linked SHA-256 digests for tamper evidence.
- Closeout remains `pilot_incomplete` until one completed read, one passed blocked probe, one-call maximum, complete audit evidence, rollback evidence, and Production blocking are all proven in the isolated Preview environment.

Implementation does not itself apply the Preview migration, configure credentials, deploy, or execute the live pilot. Those actions require the protected Preview environment and exact confirmation phrases documented by the API workflow.
