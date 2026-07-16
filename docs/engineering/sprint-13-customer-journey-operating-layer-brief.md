# Sprint 13 Customer Journey Operating Layer Engineering Brief

## Sprint Identity

- Sprint name: Sprint 13 - Customer Journey Operating Layer.
- Date: 2026-07-10.
- Request owner: Moses Adebajo, CEO.
- Architecture owner: ChatGPT, Chief AI Officer / Enterprise Architect.
- Implementation owner: Codex, Engineering Director / Lead Software Engineer.
- Approval state: approved as a read-only advisory customer journey operating layer only. Outreach, CRM mutation, lead creation, provider calls, connector activation, publishing, scraping, persistence, deployment, autonomous workflows, and approval-as-execution remain unauthorized.

## Doctrine

- Sprint 13 converts Enterprise Opportunities into customer journey visibility, stage intelligence, department ownership, advisory touchpoint recommendations, CEO review packets, and telemetry.
- Every Enterprise Opportunity must map to a customer journey stage, be marked not customer-facing, or be recorded as a coverage gap.
- Customer journey intelligence may recommend internal review. It must not contact people, mutate systems, activate providers, publish, scrape, persist, or execute work.

## Delivery Sequence

- 13A - Enterprise Opportunity Intake Gate:
  - Validate `enterprise-opportunity-v1`, advisory governance flags, source and owner departments, evidence, missing data, required approvals, and absence of provider/action payloads.
- 13B - Customer Journey Contract:
  - Define seller, buyer, referral partner, and internal stakeholder journey records.
- 13C - Journey State Engine:
  - Map opportunities into journey stages including qualification, needs research, CEO review, waiting on data, stalled, closing completed, follow-up, referral, blocked, and closed advisory.
- 13D - Department Responsibility Matrix:
  - Assign owner and supporting departments with explainable responsibility.
- 13E - Advisory Touchpoint Planner:
  - Generate internal recommendations only; no sending, writing, scheduling, or execution.
- 13F - Funnel Visibility & Bottleneck Intelligence:
  - Report funnel progression, drop-off points, bottlenecks, coverage, missing data, and ownership.
- 13G - Executive Customer Journey Brief:
  - Produce CEO-facing journey review focused on high-impact, stalled, uncovered, follow-up, referral, and approval-sensitive journeys.
- 13H - Journey Telemetry, Advisory Only:
  - Measure journey volume, stage distribution, blocked reasons, missing-data frequency, department bottlenecks, opportunity coverage, and recommendation quality without persistence.

## Safety Boundary

- Every Sprint 13 object must preserve:
  - `requiresHumanReview:true`.
  - `advisoryOnly:true`.
  - `providerCalled:false`.
  - `liveExecutionAllowed:false`.
  - `externalWritesAllowed:false`.
  - `approvalAsExecutionAllowed:false`.
- Explicitly blocked:
  - provider calls.
  - OAuth exchange.
  - connector activation.
  - CRM mutation.
  - lead creation.
  - email, SMS, or calls.
  - publishing.
  - scraping.
  - autonomous work.
  - memory/KPI persistence.
  - approval-as-execution.

## Active Technical Debt

- High priority: ESLint silent timeout.
  - Investigate before production readiness so lint becomes a dependable CI gate.
- Medium priority: Turbopack tracing warning.
  - Track separately and resolve when actionable; do not block Sprint 13 unless it becomes a build failure.

## Validation Plan

- Targeted Sprint 13 tests must prove:
  - invalid Enterprise Opportunities are blocked before journey creation.
  - every opportunity maps to a stage, a not-customer-facing classification, or a coverage gap.
  - journey state mapping and department ownership are deterministic.
  - advisory touchpoint plans never send, write, create leads, call providers, publish, scrape, persist, or execute.
  - funnel intelligence and executive brief remain read-only and advisory.
  - telemetry is read-only and non-persistent.
- Required commands:
  - targeted Sprint 13 tests and Sprint 12F contract tests.
  - `npm run test:safety`.
  - `npm run build`.
  - bounded focused ESLint, recorded as inconclusive if the known timeout persists.

## Next Gate

- Recommended next sprint: Sprint 14 - Executive Intelligence, consuming Sprint 13 journey visibility and Sprint 12 opportunity intelligence as advisory inputs.
- Any future customer journey automation that contacts people, mutates CRM, writes provider data, or persists KPI/memory requires a separate governance gate.
