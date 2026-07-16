# AI Employees

Sprint 0 defines the first AI employee roster for daily internal work.

## Roster Requirements

Every AI employee must define:

- department
- manager
- role
- mission
- daily responsibilities
- required tools/connectors
- KPI impact
- approval level
- output types
- blockers
- readiness status
- safe next action
- responsibility matrix

## Responsibility Matrix

Every AI employee has:

- primary responsibilities
- secondary responsibilities
- cannot-do rules
- handoff targets
- handoff triggers
- required evidence before work
- approval escalation trigger

The matrix prevents overlapping ownership as future daily work orders are added. For example, Content may draft a GBP topic, SEO may review search/local fit, Local SEO / GBP may adapt the task, Compliance may review claims, Approval may route CEO review, and no employee publishes it in Sprint 0.

## External Execution Boundary

All AI employees have:

- `externalExecutionAllowed:false`
- `providerCalled:false`
- `liveExecutionAllowed:false`

These flags are part of the workforce contract, not optional UI labels.
