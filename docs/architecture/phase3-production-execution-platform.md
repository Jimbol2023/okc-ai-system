# Phase 3 Production Execution Platform

Phase 3 adds a governed production vertical slice for daily operations. It does not enable broad live connector execution. The first supported workflow moves a seller lead from website source capture into revenue scoring, internal follow-up task preparation, social and Google Business Profile draft preparation, unified approvals, connector execution planning, audit visibility, and mobile executive briefing.

## Safety Posture

- Internal AI may analyze, score, prioritize, draft, organize, queue, schedule internally, and generate reports.
- External provider calls remain disabled by default.
- External writes remain blocked unless a future administrator-approved connector action policy explicitly enables them.
- Approval decisions create audit and eligibility state, but approval alone does not bypass feature flags, connector health, connector lifecycle, rate limits, Tool Registry policy, or Safe Auto Mode.
- Credential records store references only. Raw secrets must never be stored, rendered, logged, or returned from APIs.
- Social and GBP content must use approved source labels, assumptions, and non-private facts only.

## Implemented Surfaces

### Connector Marketplace And Wizard

The marketplace exposes connector readiness, lifecycle state, health, ownership, permissions, and credential-reference posture. The wizard endpoints prepare lifecycle actions for install, test, and enable, but do not authenticate providers or enable live execution.

Primary endpoints:

- `GET /api/connectors/marketplace`
- `POST /api/connectors/[connectorId]/install`
- `POST /api/connectors/[connectorId]/test`
- `POST /api/connectors/[connectorId]/enable`

### AI Permission Center

Permission policies describe what an AI agent may prepare and what it may not execute. Current examples keep Marketing AI draft-only for public-facing work and keep Executive AI advisory for operational recommendations.

Primary endpoint:

- `GET /api/permissions/policies`

### Unified Approval Center

Unified approvals include lead follow-up, social posts, Canva briefs, GBP posts, connector lifecycle changes, and AI recommendations. Decisions support approve, reject, edit, reschedule, delegate, and block.

Primary endpoints:

- `GET /api/approvals/unified`
- `POST /api/approvals/[approvalId]/decision`

### Social Operations

Social operations prepare platform-specific drafts and repurposed variants for Facebook, Instagram, LinkedIn, X, YouTube, and Google Business Profile. In Phase 3, drafts can become execution plans only; publishing is still connector-gated and blocked by default.

Primary endpoints:

- `GET /api/social-ops/drafts`
- `POST /api/social-ops/repurpose`
- `POST /api/social-ops/execution-plan`

### Mobile Command Center

The mobile command center is a browser-based PWA-ready dashboard for daily executive operations. It shows briefing priorities, Revenue Spine status, CRM/task posture, approval center, connector health, marketing queue, market intelligence, notifications, and the Phase 3 vertical slice state.

Primary endpoint and route:

- `GET /api/mobile-command-center`
- `/dashboard/mobile-command`

### Automation Center And Learning Loop

Automation policies define safe workflow shapes such as educational content, closing announcement, review request, and marketing campaign. Learning outcomes record explainable recommendations from future operational data without autonomous self-modification.

Primary endpoints:

- `GET /api/automation/policies`
- `GET /api/learning/outcomes`

## Persistence

Phase 3 adds durable foundations for:

- Connector installation and configuration state.
- Credential reference metadata.
- Connector test results.
- AI permission policies.
- Unified approval items and decisions.
- Social content sources, drafts, variants, schedules, execution plans, and performance snapshots.
- Automation policies and runs.
- Notification records.
- Learning outcome events.
- Daily briefing snapshots.

These tables are intentionally metadata-first and keep `providerCalled`, `liveExecutionAllowed`, `sent`, `published`, and `scheduled` false by default where applicable.

## Acceptance Flow

1. Seller submits a website form and the lead source is preserved.
2. Lead enters the Revenue Spine and receives an explainable score.
3. Internal follow-up task is prepared.
4. AI prepares a Canva or asset brief only when source data is sufficient.
5. AI prepares a GBP or social draft from approved, non-private facts.
6. Drafts and tasks appear in the Unified Approval Center.
7. Human approves, edits, rejects, delegates, blocks, or reschedules.
8. System creates connector execution plans.
9. Live execution remains blocked until connector, feature flag, health, action policy, approval, and Safe Auto Mode requirements are all satisfied.
10. Mobile Command Center updates briefing, ROI rationale, approval state, connector state, and audit trail.

## Test Requirements

- Connector wizard tests must prove secrets are not exposed and enablement remains approval-gated.
- Permission tests must prove publishing, sending, public replies, budget changes, offers, contracts, and listing edits are blocked.
- Approval tests must prove decisions log audit-ready state and do not bypass Safe Auto Mode.
- Social operations tests must prove every draft has source labels, assumptions, and no fabricated facts.
- Execution-plan tests must prove disabled or unhealthy connectors fallback, queue, notify, or block.
- Mobile tests must prove the command center renders core panels at mobile, tablet, and desktop widths without overlap.
- Vertical-slice tests must prove lead source preservation through score, task, draft, approval, execution-plan block, and executive briefing.
