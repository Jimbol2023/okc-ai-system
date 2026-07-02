# Modular AI Business OS Standard

J Capital AI OS is a governed, multi-industry AI Business Operating System. Real estate is the first installed business module, not the platform boundary.

## Classification Gate

Before any new feature is planned or implemented, classify it with `classifyFeatureArchitecture` in `lib/modular-architecture-standard.ts`.

Required questions:

- Is this reusable across different industries?
- Should this belong in AI Core or a Business Module?
- Can it be implemented as a plug-in?
- Does it preserve governance, Safe Auto Mode, feature flags, audit logs, approval workflows, AI permissions, and connector health?
- Can it be extended without redesigning the platform?

## AI Core

AI Core must stay business-agnostic. Shared services include Executive AI, Revenue Engine, CRM primitives, Workflow Engine, Automation Engine, Connector Platform, AI Agent Framework, Knowledge Base, Document Engine, Analytics, Notifications, Security, Governance, Audit, AI Permissions, and Feature Flags.

AI Core may expose stable extension points for capabilities, workflows, permissions, UI surfaces, connectors, audit events, schemas, analytics, documents, and notifications. It must not absorb industry-specific scoring, terminology, schemas, or workflows unless they have been extracted into reusable primitives.

## Business Modules

Business-specific functionality belongs in installable Business Modules. Examples include Real Estate, E-commerce, Trucking, Healthcare, Consulting, and future industries.

Business Modules own industry-specific schemas, scoring rules, terminology, workflows, views, and integrations. The Real Estate Business Module owns property-specific behavior such as deal analysis, tax list importing, out-of-state owner detection, driving-for-dollars workflows, property intelligence, and property-data connector policy.

Every Business Module inherits the Enterprise AI Governance Constitution by default.

## Connector Plug-ins

Provider integrations belong in the Connector Platform as governed connector plug-ins. Connector behavior must prefer official APIs, respect rate limits and platform Terms of Service, and fail closed.

Connector readiness, installation, testing, content approval, or enablement never grants live execution by itself. External calls require explicit policy, feature flag eligibility, connector health, approval, audit, AI permission, Safe Auto Mode, and kill-switch checks.

## Enforcement

- `registerBusinessModuleDefinition` validates required module extension points and governance controls.
- `requiredGovernanceControls` requires Safe Auto Mode, feature flags, audit logs, approval workflows, AI permissions, connector health, rate limits, official APIs, and fail-closed behavior.
- Safety tests in `tests/safety/modular-architecture-standard.test.ts` pin AI Core classification, Real Estate module registration, connector plug-in placement, source tracking, and external-action blocking.
