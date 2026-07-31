# J Capital CEO Operating Scorecard

## Purpose

The CEO Operating Scorecard is the single read-only control surface for P0 Batch 1 controlled operations. It helps the CEO understand today's objective, active mission, department work, approvals, KPI evidence, connector gaps, and governance boundaries from `/dashboard/command-center`.

It does not activate connectors, send outreach, publish content, mutate CRM records, call providers, promote Phase 3, or start Phase 4.

## Data Sources

- Daily Mission: `getDailyMission`.
- AI COO / Command Center: `createAiWorkforceCommandCenter`.
- Revenue Operating Loop: `createDailyRevenueOperatingLoop`.
- Executive Dashboard context: `createExecutiveDashboardReport`.
- Company Activation and Approval Queue: `getCompanyActivationSnapshot`, `getInternalWorkQueue`.
- Department Registry: `getCompanyDepartmentRegistry`.
- Connector Readiness: `getConnectorHealth`, `createProviderReadinessReport`, Daily Mission connector health.
- Governance posture: feature flag snapshot and hard-coded P0 governance constants.

All scorecard records include source labels or source names. Missing sources become visible no-evidence states.

## Scorecard Sections

- Today's Business Objective.
- Daily Mission.
- KPI Movement.
- Department Work.
- CEO Decisions.
- Connector and Data Gaps.
- Governance.
- Controlled Operating Loop.
- Workforce Drill-Down.

The route reuses existing drill-down pages instead of duplicating workflows.

## Business Objective

The first objective is:

`Increase source-attributed qualified seller conversations.`

Owner: Revenue Operations.

Supporting departments: Marketing Intelligence, Search Intelligence, Property Intelligence, Operations, and Executive Office.

Until an approved persistence path confirms the objective, the scorecard displays it as `draft_requires_ceo_confirmation`.

## KPI Definitions

- Qualified seller conversations: qualified seller conversations per week with source attribution.
- Source attribution coverage: percentage of usable lead/opportunity evidence with a trusted source.
- Decision packets prepared: internal work items ready for final approval.
- CEO review time: Daily Mission estimated review minutes until measured review time exists.
- Blocked leads resolved: lead/work blockers moved to a resolved state.
- Unauthorized outreach count: unsafe outreach, publishing, provider write, or external execution events.

The scorecard must not invent KPI values. It displays `not_yet_measured` or `no_evidence` when the canonical source does not yet prove the metric.

## Governance Boundaries

P0 Batch 1 preserves:

- `phase3Status: calibration_ready`
- `phase4Status: blocked_until_phase3_promotion`
- `providerCalled: false`
- `liveExecutionAllowed: false`
- `externalExecutionPermitted: false`

The scorecard is advisory and read-only. It does not grant approval, execute approved work, start provider calls, mutate CRM records, or activate connectors.

## No-Evidence Behavior

If a source fails or does not exist, the scorecard keeps the section visible and labels the result as no evidence. The CEO should see the gap instead of a fabricated value.

Examples:

- Qualified seller conversations remain `not_yet_measured` until a source proves conversations per week.
- Source attribution coverage remains `no_evidence` until a canonical KPI exists.
- End-of-day outcome remains `not_yet_measured` until the first controlled operating day is recorded.

## Operating Loop

The visible loop is:

Morning Brief -> Daily Mission -> Department Work -> QA Review -> CEO Decision -> Executive Memory -> End-of-Day Outcome.

Each step shows status, owner, evidence, next action, and blocker.

## CEO Workflow

1. Open `/dashboard/command-center`.
2. Confirm the draft objective or identify what blocks confirmation.
3. Review Daily Mission status and dependencies.
4. Review ready work, blocked work, and CEO approvals.
5. Use drill-down links for existing Revenue, Leads, Approvals, Connectors, Production Readiness, Workforce, Daily Revenue, and Knowledge surfaces.
6. End the day by recording measured outcomes through already approved internal workflows.

## Rollback

Rollback is limited to removing the route integration, scorecard component, scorecard contract, focused tests, and this document. Existing workforce command center behavior can be restored by rendering `AiWorkforceCommandCenter` directly from `/dashboard/command-center`.

Rollback must not remove existing PR #18 runtime work, accessibility toolbar files, connector registry code, or dashboard modules.

## Future Figma Synchronization

Figma remains View-only for `hello@jcapitalpropertygroup.com`, so P0 implementation uses the existing J Capital dashboard design language.

Future editable frames/components needed:

- Desktop CEO Operating Scorecard.
- Mobile CEO Operating Scorecard.
- Governance strip.
- KPI no-evidence state.
- Connector blocker list.
- Controlled operating-loop timeline.
