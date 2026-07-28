# Sprint 12F Enterprise Opportunity Contract Engineering Brief

## Sprint Identity

- Sprint name: Sprint 12F - Enterprise Opportunity Contract.
- Date: 2026-07-10.
- Request owner: Moses Adebajo, CEO.
- Architecture owner: ChatGPT, Chief AI Officer / Enterprise Architect.
- Implementation owner: Codex, Engineering Director / Lead Software Engineer.
- Approval state: approved as a read-only AI Core contract refinement before Sprint 13. Execution authority, provider calls, connector activation, CRM mutation, lead creation, outreach, publishing, scraping, persistence, deployment, and approval-as-execution remain unauthorized.

## Doctrine

- An opportunity is what the company might do.
- A recommendation is what AI suggests internally.
- An approval is what a human may authorize later through a separate governed workflow.
- The Enterprise Opportunity Contract can recommend, route, require review, and carry required approval labels, but it never grants execution authority.

## Objective

- Define one standard opportunity object that every AI department can produce and consume.
- Keep the contract broader than revenue so it can support marketing, acquisition, customer journey, operations, compliance, and data-gap opportunities.
- Map Sprint 12 revenue opportunities into the shared contract without breaking existing Sprint 12 outputs.

## Contract Additions

- Shared fields:
  - `id`, `version`, `sourceDepartment`, `ownerDepartment`, `type`, `title`, `estimatedValue`, `confidenceScore`, `priority`, `evidence`, `missingData`, `recommendedActions`, `requiredApprovals`, `status`, `nextInternalStep`, `sourceLabels`, `createdFrom`, and `governanceFlags`.
- Lifecycle statuses:
  - `identified`, `under_review`, `needs_data`, `needs_ceo_review`, `approved_for_internal_work`, `deferred`, `closed_advisory`, and `blocked`.
- Required governance flags:
  - `requiresHumanReview:true`.
  - `advisoryOnly:true`.
  - `providerCalled:false`.
  - `liveExecutionAllowed:false`.
  - `externalWritesAllowed:false`.
  - `approvalAsExecutionAllowed:false`.

## Safety Boundary

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
- Required approvals are descriptive labels only. They do not create approval records, mutate queues, or execute work.

## Validation Plan

- Targeted Sprint 12F tests must prove:
  - every Sprint 12 opportunity maps into the Enterprise Opportunity Contract.
  - status defaults are deterministic.
  - governance flags survive cross-department consumption.
  - required approvals remain descriptive only.
  - no opportunity can authorize outreach, publishing, provider writes, CRM mutation, lead creation, scraping, persistence, autonomous execution, or approval-as-execution.
- Required commands:
  - targeted Sprint 12F and Sprint 12 safety tests.
  - `npm run test:safety`.
  - `npm run build`.
  - bounded focused ESLint, recorded as inconclusive if the known timeout persists.

## Next Gate

- Recommended next sprint: Sprint 13 - Customer Journey Automation.
- Sprint 13 should consume Enterprise Opportunities as advisory input only unless a separate governance gate authorizes controlled execution.
