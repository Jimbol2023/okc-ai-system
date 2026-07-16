# AI Workforce Architecture

The AI workforce model connects departments, managers, employees, tools, KPIs, blockers, and safe daily output.

Primary implementation reference:

- `lib/ai-workforce.ts`
- `docs/ai-company-playbook/`

## Workforce Contract

Every AI employee should define:

- department
- manager
- mission
- daily responsibilities
- required tools/connectors
- KPI impact
- approval level
- output type
- blockers
- readiness
- safe next action
- responsibility matrix

## Responsibility Matrix

The responsibility matrix prevents unclear ownership. It should define:

- primary responsibilities
- secondary responsibilities
- cannot-do rules
- handoff targets
- handoff triggers
- required evidence before work
- approval escalation trigger

## Sprint Design Rule

Future work orders should attach to:

Department -> Manager AI -> AI Employee -> Output Type -> KPI -> Approval Requirement

If a future feature cannot identify the department and AI employee that use it, engineering should recommend postponing or redesigning it.

## Professional Workforce Extension

The Enterprise Professional Workforce Platform extends this registry with versioned competency, SOP, evidence, deliverable, KPI, certification, UEIP capability, escalation, and QA contracts. It must not create a second employee registry. Professional certification authorizes internal advisory output only and never bypasses approvals, Safe Auto Mode, feature flags, connector health, or UEIP policy.

The first reference implementation is the [Property Intelligence Pilot](./enterprise-professional-workforce-property-intelligence-brief.md).
