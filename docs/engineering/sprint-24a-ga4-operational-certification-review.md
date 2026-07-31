# Sprint 24A GA4 Operational Certification Review

Status: implemented for internal Preview certification readiness.

Sprint 24A certifies the Google Analytics 4 connector through the same operational pattern used for Search Console:

- Preview environment identity verification
- credential-reference verification without raw secret exposure
- `analytics.readonly` scope verification
- GA4 property allowlist verification
- rollback disable and restore drill
- single-use Preview authorization nonce
- one governed Preview read through UEIP
- blocked property probe with no provider attempt
- closeout evidence review

## Certified Boundary

GA4 remains a read-only UEIP connector under connector id `google_analytics`.

The certification read uses:

- contract `ueip-ga4-result-v1`
- capability `analytics.page.performance.read`
- required scope `https://www.googleapis.com/auth/analytics.readonly`
- configured property `GOOGLE_ANALYTICS_PROPERTY_ID`

The pilot admits only normalized evidence. Raw GA4 payloads, OAuth tokens, credential material, provider URLs, and write-capable actions are excluded from closeout evidence and downstream intelligence.

## Safety Position

This sprint does not authorize:

- Production GA4 reads
- GA4 Admin API writes
- tag, audience, attribution, conversion, or key-event mutation
- CRM mutation
- publishing
- outreach
- ads
- scraping
- workflow automation
- recurring provider execution

Failed or partial GA4 reads become data gaps. A failed pilot does not authorize retries outside the single-use governed Preview flow.

## CEO Closeout Packet

The GA4 Preview closeout exposes:

- status
- readiness reason codes
- successful trace id
- evidence hash from completion evidence
- provider call count
- blocked probe status
- audit-chain verification
- expected audit-stage verification
- normalized contract verification
- secret-scan result
- production-blocked proof
- `ceoApprovalRequired: true`

The closeout can reach `preview_pilot_verified` only when exactly one GA4 provider read completed, the blocked property probe passed without provider access, audit evidence is complete, and Production remains blocked.

## Forward Sequence

Sprint 25 should implement Google Business Profile using the same governed Preview certification lifecycle with GBP-specific scopes, endpoint allowlists, normalized evidence, blocked probe, and CEO approval stop.

Sprint 26 should combine Search Console, GA4, and GBP evidence into cross-connector advisory intelligence:

- people found us
- they visited these pages
- they stayed here
- they left here
- highest business opportunities

The combined intelligence remains internal advisory context only until a later governed approval explicitly authorizes any external action.
