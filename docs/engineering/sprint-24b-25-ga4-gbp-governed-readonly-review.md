# Sprint 24B and Sprint 25 Governed Read-Only Review

Status: implemented for internal readiness and CEO review.

## Sprint 24B

GA4 Preview operations now expose an internal operator packet around the existing certification workflow. The packet summarizes readiness, credential-reference verification, scope verification, property authorization, rollback drill state, pilot lock state, closeout status, trace id, evidence hash, data gaps, and CEO approval requirement.

The packet is non-executing. It does not run GA4, create an authorization, create tasks, mutate CRM, publish, perform outreach, create automation, or enable Production reads.

## Sprint 25

Google Business Profile is implemented as a governed UEIP read-only connector under connector id `google_business_profile`.

The certified adapter uses:

- contract `ueip-gbp-result-v1`
- capabilities `gbp.performance.read` and `gbp.reviews.read`
- required scope `https://www.googleapis.com/auth/business.manage`
- configured location `GOOGLE_BUSINESS_PROFILE_LOCATION_ID`

GBP snapshots are admitted as normalized `business-data-snapshot-v1` evidence for:

- `google_business_profile_performance`
- `google_business_profile_reviews`

The legacy direct GBP snapshot path now calls the governed UEIP gateway instead of calling provider endpoints directly.

## Safety Boundary

Allowed provider behavior is limited to read-only GBP evidence through allowlisted endpoints. The system blocks profile updates, posts, media uploads, review replies, verification actions, user/admin changes, location mutation, CRM mutation, publishing, outreach, ads, scraping, workflow automation, recurring execution, and Production provider reads.

Failed, empty, quota-limited, timed-out, unavailable, invalid, or oversized GBP responses become fail-closed errors or data gaps.

## Certification Stop

GBP Preview certification mirrors Search Console and GA4:

- Preview environment identity
- credential-reference verification
- `business.manage` scope verification
- location allowlist verification
- rollback disable and restore drill
- single-use authorization nonce
- one governed Preview read
- blocked location probe with no provider attempt
- closeout evidence review

The closeout can reach `preview_pilot_verified` only after exactly one completed GBP Preview read, a passed blocked-location probe, verified audit chain, expected audit stages, normalized contract verification, secret scan, and Production-blocked proof.

CEO approval remains required before Production promotion, recurring reads, cross-connector operational use, or any external action.
