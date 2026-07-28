# J Capital AI Business Operating Company Engineering Constitution

## Purpose

This document defines how engineering work is implemented in J Capital AI OS.

It does not replace the business constitution, governance constitution, Safe Auto Mode, Approval Center, Executive Memory, Knowledge Platform, or CEO direction. It translates those authorities into implementation rules for Codex and future engineers.

## Role Boundary

The CEO defines business priorities.

The Chief AI Architect defines system architecture.

Engineering implements approved architecture safely.

Engineering must not redesign stable systems, replace governed workflows, or create duplicate logic unless the approved architecture explicitly requires it.

## Authoritative Source Order

Implement using this source order:

1. Internal Knowledge Registry and repository architecture.
   - Existing design patterns.
   - Naming conventions.
   - Safety policies.
   - Department standards.
   - Executive Memory.
   - Knowledge Platform.
   - Current architecture documents.
2. Official vendor documentation.
   - Next.js, React, TypeScript, Prisma, Neon, PostgreSQL, Vercel, Playwright, Tailwind, auth providers, Google APIs, Microsoft APIs, Stripe, Twilio, Cloudflare, and GitHub.
3. Open standards.
   - RFCs, HTTP specifications, OAuth, OpenID Connect, OWASP, WCAG, WAI-ARIA, and REST conventions.
4. High-quality open-source projects.
   - Use maintained, production-proven projects as reference implementations only.
   - Never blindly copy code.

When sources conflict, internal J Capital governance wins unless it violates law, platform policy, security, privacy, or a higher external compliance requirement.

## Internal Source Anchors

Engineering work must preserve and reference these internal sources when relevant:

- [J Capital AI Business Constitution v1](./ai-business-constitution-v1.md)
- [Enterprise AI Governance Constitution](./enterprise-ai-governance-constitution.md)
- [Safe Auto Mode](./safe-auto-mode.md)
- [Provider Integration Policy](./provider-integration-policy.md)
- [Testing Strategy](./testing-strategy.md)
- [API Governance](./api-governance.md)
- [Modular AI Business OS Standard](./modular-ai-business-os-standard.md)

## Implementation Principles

Before implementing:

- Search the internal registry and current code first.
- Reuse existing architecture and services.
- Extend existing modules when appropriate.
- Avoid duplicate implementations.
- Preserve backward compatibility.
- Keep changes small, typed, focused, and testable.
- Prefer reusable AI Core capabilities over one-off business-module logic.
- Keep industry-specific behavior inside installable Business Modules.
- Treat provider integrations as governed connector plug-ins.

## Operating Loop Test

Every feature must improve or protect the CEO -> AI COO -> Department -> CEO operating loop.

If a change does not help the CEO make decisions, help the AI COO coordinate departments, help departments prepare work, preserve learning, or improve governed execution readiness, it should not be implemented without explicit approval.

## Safety Rules

Everything remains approval-gated by default.

Do not enable any of the following unless an explicit governed policy authorizes the exact action:

- Provider calls.
- Publishing.
- Email sending.
- SMS sending.
- Phone calls.
- Ads.
- CRM mutations.
- OAuth writes.
- Workflow execution.
- Scraping.
- Skip tracing.
- External execution.

Approval alone does not bypass feature flags, connector health, AI permissions, audit logging, Safe Auto Mode, or exact-action policy.

## Data And Claims

- Never invent property facts, ownership facts, valuation facts, repair facts, title facts, tax facts, probate facts, client stories, market statistics, legal claims, or relationship history.
- Label assumptions clearly.
- Track lead source attribution.
- Preserve provenance for approved knowledge sources.
- Keep sensitive data out of client-side bundles, logs, error messages, and generated summaries.

## PR Verification Gate

Every implementation PR must verify:

- TypeScript.
- ESLint.
- Unit tests.
- Safety tests.
- Build.
- No provider execution.
- No live execution.
- No external workflow execution.
- No architecture regression.

When a check is skipped or cannot run, the PR must state why and list the remaining risk.

## Stop Condition

When implementation is complete, report:

- Files changed.
- Architecture preserved.
- Tests and verification.
- Remaining risks.

Do not continue building additional features without approval.
