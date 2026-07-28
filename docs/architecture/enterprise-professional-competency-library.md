# Enterprise Professional Competency Library

## Decision

The Enterprise Professional Competency Library is an AI Core standards layer over the existing AI Workforce and Department OS. It owns versioned competency, SOP, evidence, deliverable, assessment, scoped certification, QA, and professional-outcome contracts. It does not own employees, department missions, provider authority, approvals, prompts, or autonomous execution.

The authoritative relationship is:

`Definition -> Workforce Profile -> Department Requirement -> Assessment -> Scoped Certification -> Deliverable -> Independent QA -> Human Decision -> Outcome`

The implemented enterprise operating chain is:

`Business Outcome -> Department Mandate -> Professional Profile -> Competencies -> SOPs -> Evidence -> Deliverable -> Independent QA -> Executive Decision -> Verified Outcome -> Promotion or Remediation`

## Reusable Contract System

`lib/enterprise-professional-operating-system.ts` is the AI Core contract library for professional profiles, competencies, SOPs, evidence, QA, deliverables, promotion, capability qualification, executive portfolio reporting, and industry professionalization packs.

- Job level changes responsibility and required proficiency; it never grants provider or execution authority.
- Enterprise-core competencies are reusable. Functional competencies remain department-scoped until reuse is proven. Industry competencies remain in Business Modules.
- Each deliverable has an accountable generator, an independent reviewer, an executive consumer, a balanced scorecard, and a promotion contract.
- Revenue Operations, Marketing Intelligence, Finance and Executive Analytics, and Creative Studio are technically instantiated but remain operationally unvalidated.
- Property Intelligence remains compatible with its existing brief and workforce contracts while migrating conceptually to the reusable definitions.

## Program Boundaries

- Program A — Professional Workforce: reusable contracts, department profiles, deterministic deliverables, QA, scorecards, remediation, and promotion evidence.
- Program B — UEIP: professional capability qualifications and connector-demand planning. A qualification references UEIP metadata but grants no installation, credential, policy, health, approval, or runtime authority.
- Program C — Executive Intelligence: sanitized professional portfolio, capability gaps, scorecard visibility, risks, and advisory CEO decisions.
- Program D — Industry Expertise: installable professionalization packs. Real Estate is the first pack; future packs must not inherit property-specific assumptions.

The API uses the phrase `capability-qualified`, not `connector-certified`. Named but unavailable connectors are `planned` and cannot be invoked.

## Operating Company Composition

The [Enterprise Professional Operating Company Kickoff](../engineering/enterprise-operating-company-kickoff-brief.md) composes the canonical registry into immutable cross-department cases, department work assignments, typed contributions, CEO decision packets, scorecards, and pilot results. It does not create a second professional registry.

Uncertified professionals may participate in supervised calibration, but their contributions are not executive-use eligible. Creative work requires an approved internal Marketing or Revenue brief. Executive synthesis preserves department disagreement and cannot rewrite or execute department recommendations.

## ROI and Promotion Boundary

A competency remains department-specific until reuse across at least two departments is demonstrated. Property Intelligence remains technically implemented but operationally unvalidated until the CEO-selected calibration and blind-validation cohorts satisfy the existing proof thresholds. No code path invents cohort evidence or promotes a department automatically.

Departments advance sequentially: Property Intelligence, Revenue Operations, Marketing Intelligence, Finance and Executive Analytics, then Creative Studio. Each department has one primary executive deliverable and must pass its proof gate before the next department advances.

The generic proof gate requires at least 10 calibration cases, 20 blind-validation cases, zero invented facts and unauthorized actions, complete seeded-critical-defect detection, at least 25% median time improvement, at least 80% useful-or-better ratings, no harmful-error increase, and explicit outcome evidence references. A passing record produces evidence for human promotion review; it never promotes automatically.

## Authority Boundary

- AI Workforce owns employee identity and reporting lines.
- Department OS owns missions and handoffs.
- UEIP owns provider access.
- Approval / Safety owns execution decisions.
- EPC certification authorizes only the exact internal advisory deliverable scope recorded by tenant, profile, competency, SOP, deliverable, and business-module version.

Certification never grants provider access, connector activation, approval authority, outreach, publishing, spending, CRM mutation, or external execution.

## Persistence

Definitions are code-versioned and active definitions are immutable. Assessments, certifications, outcomes, and governance changes are append-only tenant-scoped records. Administrative writes derive tenant and actor from the signed session, require an exact confirmation phrase and idempotency key, validate current definitions, and append sanitized governance evidence in the same transaction.

Department proof gates, capability qualifications, and remediation records use the append-only EPC governance event store. Historical failures and overrides are immutable. A failed review may recommend training, reassessment, suspension, or a versioned definition change; it cannot alter an active definition autonomously.

## Enterprise Learning

Professional outcomes are captured from EPC-1 onward, but Sprint 15 remains blocked until EPC-6 confirms trustworthy cross-department evidence. Learning may recommend versioned changes; it may not modify definitions, certifications, policies, provider authority, or execution behavior autonomously.
