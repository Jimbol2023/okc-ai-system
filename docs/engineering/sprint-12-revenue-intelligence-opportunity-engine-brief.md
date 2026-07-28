# Sprint 12 Revenue Intelligence & Opportunity Engine Engineering Brief

## Sprint Identity

- Sprint name: Sprint 12 - Revenue Intelligence & Opportunity Engine.
- Date: 2026-07-10.
- Request owner: Moses Adebajo, CEO.
- Architecture owner: ChatGPT, Chief AI Officer / Enterprise Architect.
- Implementation owner: Codex, Engineering Director / Lead Software Engineer.
- Approval state: approved as read-only advisory revenue intelligence and recommendation-quality improvement only. Execution authority, provider calls, connector activation, CRM mutation, lead creation, outreach, publishing, scraping, persistence, deployment, and approval-as-execution remain unauthorized.

## Doctrine

- Sprint 12 improves opportunity detection, scoring, prioritization, and executive revenue recommendations.
- Sprint 12 does not create execution authority.
- Revenue Intelligence means better judgment and better recommendations, not autonomous revenue chasing.

## Objective

- Convert Sprint 11 department missions, Sprint 11 telemetry, Sprint 10E market/customer intelligence, CRM/revenue spine signals, and department operating outputs into standardized advisory revenue opportunities.
- Produce transparent scoring, prioritized opportunity review queues, a CEO-facing revenue brief, and advisory closed-loop learning notes.
- Preserve the Sprint 11 doctrine that departments interpret, prioritize, coordinate, and present CEO decisions without executing.

## Sprint 12 Delivery Sequence

- 12A - Opportunity Detection:
  - Create standardized advisory opportunity records from mission, intelligence, CRM/revenue, marketing, acquisition, market, and telemetry signals.
- 12B - Opportunity Scoring:
  - Score confidence, expected value, urgency, estimated effort, data completeness, governance risk, department readiness, and bottleneck severity.
- 12C - Revenue Prioritization:
  - Rank opportunities by expected business impact and feasibility so the company knows what to review first.
- 12D - Executive Revenue Brief:
  - Surface top five opportunities, risks, bottlenecks, departments needing attention, missing data, and recommended internal decisions.
- 12E - Closed-Loop Learning, Advisory Only:
  - Compare expected opportunity value and recommended actions with observed read-only outcomes when available.
  - Improve recommendation quality only; do not persist memory/KPI changes or trigger automation.

## Safety Boundary

- Every Sprint 12 object must preserve:
  - `requiresHumanReview:true`.
  - `advisoryOnly:true`.
  - `providerCalled:false`.
  - `liveExecutionAllowed:false`.
  - `externalWritesAllowed:false`.
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
  - Continue recording bounded focused lint as inconclusive until resolved.
- Medium priority: Turbopack tracing warning.
  - Existing warning involves `next.config.ts`, Prisma, referrals, and `app/api/leads/route.ts`.
  - Track separately and resolve when actionable; do not block Sprint 12 unless it becomes a build failure.

## Validation Plan

- Targeted Sprint 12 tests must prove:
  - Sprint 11 missions and telemetry convert into advisory opportunity records.
  - scoring is deterministic and explainable.
  - prioritization ranks by expected business impact and feasibility.
  - executive brief surfaces top opportunities, risks, bottlenecks, departments needing attention, and missing data.
  - closed-loop learning is advisory and non-persistent.
  - no opportunity authorizes outreach, publishing, provider writes, CRM mutation, lead creation, scraping, memory/KPI persistence, autonomous execution, or approval-as-execution.
- Required commands:
  - targeted Sprint 12 safety tests.
  - `npm run test:safety`.
  - `npm run build`.
  - bounded focused ESLint, recorded as inconclusive if the known timeout persists.

## Next Gate

- Recommended next sprint: Sprint 13 - Customer Journey Automation.
- Sprint 13 should consume Sprint 12 opportunity intelligence as advisory input only unless a separate governance gate authorizes controlled execution.
