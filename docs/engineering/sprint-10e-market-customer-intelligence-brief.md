# Sprint 10E Market & Customer Intelligence Foundation Engineering Brief

## Sprint Identity

- Sprint name: Sprint 10E - Market & Customer Intelligence Foundation.
- Date: 2026-07-10.
- Request owner: Moses Adebajo, CEO.
- Architecture owner: ChatGPT, Chief AI Officer / Enterprise Architect.
- Implementation owner: Codex, Engineering Director / Lead Software Engineer.
- Approval state: approved as a read-only advisory intelligence foundation checkpoint only. Provider execution, OAuth activation, connector activation, CRM mutation, persistence, deployment, outreach, publishing, scraping, and autonomous workflows remain unauthorized.

## Objective

- Bridge Sprint 10 provider-readiness work into Sprint 11 Department Operating System by producing department-ready intelligence packets.
- Fuse existing CRM/internal operating data, read-only connector snapshots, manual/import-ready market intelligence, and internal knowledge into reusable advisory intelligence objects.
- Preserve the source-priority model:
  - CRM and internal operating data first.
  - Existing read-only connector snapshots second.
  - Manual/import-ready market intelligence third.
  - Internal knowledge as supporting context.
  - Missing live connector data becomes `data_gap` and never bypasses governance.

## Implementation Scope

- Add a shared intelligence foundation module that emits:
  - market trends.
  - customer segments.
  - neighborhood opportunities.
  - lead quality signals.
  - conversion signals.
  - content opportunities.
  - local trust signals.
  - department intelligence packets.
- Reuse existing architecture:
  - connector signal normalization.
  - read-only connector adapters.
  - Phase 2 market and demand intelligence.
  - daily revenue operating loop.
  - AI workforce routing.
- Add read-only API visibility for the completed report.
- Do not add execution controls, connector activation controls, persistence controls, provider SDKs, live fetch calls, OAuth changes, CRM mutation, memory writes, KPI writes, or approval-as-execution paths.

## Required Object Contract

- Every intelligence object must include source label, source type, confidence, freshness, missing data, assumptions, safe next action, human review requirement, advisory-only flag, and no-execution safety flags.
- Every packet must expose unified scoring:
  - confidence.
  - freshness.
  - revenue relevance.
  - urgency.
  - data completeness.
  - governance risk.
  - recommended department.
  - safe next action.
- Department packets must target Sprint 11 departments:
  - CEO Office.
  - AI COO.
  - Lead Generation.
  - Seller Acquisition.
  - SEO.
  - Marketing.
  - Content.
  - Operations.
  - Knowledge / Memory.
  - Approval / Safety.

## Safety Boundary

- Explicitly blocked:
  - Google API calls.
  - OAuth exchange or scope changes.
  - connector activation.
  - CRM mutation.
  - lead creation.
  - email, SMS, or calls.
  - Google Business Profile replies or posts.
  - website publishing.
  - scraping.
  - analytics or tag changes.
  - autonomous work orders.
  - memory or KPI persistence.
- Every report must preserve `providerCalled:false`, `liveExecutionAllowed:false`, `externalWritesAllowed:false`, and advisory-only/human-review flags.

## Validation Plan

- Targeted Sprint 10E tests must prove:
  - all outputs are advisory-only and provider-call-free.
  - no raw payloads, secrets, tokens, endpoint strings, or authorization headers leak.
  - missing GA4, Search Console, Google Business Profile, or CRM data becomes safe data-gap intelligence.
  - department routing is deterministic and Sprint 11-ready.
  - no object authorizes outreach, publishing, scraping, provider writes, CRM mutation, memory/KPI persistence, or autonomous execution.
- Run:
  - targeted Sprint 10E safety tests.
  - `npm run test:safety`.
  - `npm run build`.
  - bounded focused ESLint, recording timeout as inconclusive if the existing silent hang persists.

## Next Gate

- Recommended next sprint: Sprint 11 - Department Operating System.
- Sprint 11 should consume Sprint 10E packets and build daily department rhythm, managers, and orchestration without rebuilding the intelligence layer.
