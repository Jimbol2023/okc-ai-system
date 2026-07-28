# AI Operating Company Runbook

This runbook is the first stop for Codex and human operators working on J Capital AI OS. It explains what the system is, where authority lives, how to diagnose it safely, and how to avoid turning readiness into unauthorized execution.

## Operating Model

J Capital AI OS is an AI Business Operating Company. The Oklahoma City wholesale real estate workflow is the first Real Estate Business Module, not the whole platform.

- AI Core: reusable services such as authentication, CRM primitives, approvals, audit readiness, infrastructure health, connector registry, and operating-loop coordination.
- Business Modules: industry-specific behavior such as real estate lead capture, deal analysis, tax list import, driving for dollars, acquisitions, and seller workflows.
- Connector Plug-ins: governed integrations such as Google, Twilio, Vercel, Canva, Microsoft, Meta, and future providers.

## Source Of Truth

Use this order before changing behavior:

1. `AGENTS.md`
2. `docs/architecture/ENGINEERING_CONSTITUTION.md`
3. `docs/architecture/ARCHITECTURE_INDEX.md`
4. Existing implementation and tests
5. Official vendor documentation
6. New implementation notes or ADRs

## What Codex Should Check First

Before implementing:

- Read the relevant architecture document.
- Search the existing module or service with `rg`.
- Check safety gates and provider policy.
- Check whether the work belongs in AI Core, a Business Module, or a Connector Plug-in.
- Run a focused test before broad verification when possible.

Safe discovery commands:

```bash
rg "term" app lib docs
npm run diagnose
npm run diagnose:infra
npm run diagnose:connectors
npm run infra:preflight
```

## Runtime Diagnostics

Use these diagnostics instead of ad hoc secret checks:

- `GET /api/admin/infrastructure-health`: admin-only, redacted runtime health.
- `npm run diagnose`: redacted local diagnostic snapshot.
- `npm run diagnose:infra`: redacted infrastructure and database posture.
- `npm run diagnose:connectors`: connector readiness without provider calls unless explicitly enabled.
- `npm run verify:predeploy`: predeployment blocker check.

Never use `vercel env pull` or `vercel env ls` as proof that sensitive secret values are present or absent.

## Deployment Flow

1. Run `npm run infra:preflight`.
2. Run `npm test`.
3. Run `npm run build`.
4. Deploy Preview only unless Production deploy is explicitly authorized.
5. Use `vercel curl` for protected Preview diagnostics.
6. Promote or deploy Production only after the runtime health gate is clean.

## Safety Gates

External actions remain blocked unless an exact governed policy authorizes the exact action.

Never bypass:

- Safe Auto Mode
- feature flags
- connector health
- approvals
- audit requirements
- AI permissions
- provider readiness
- kill switches

## Credential Rule

Secrets live only in Vercel or an approved secret manager. The app may verify runtime presence through redacted health checks, but it must never render, log, store, or commit secret values.

## Current Known Operator Tasks

- Add `GOOGLE_SEARCH_CONSOLE_SITE_URL` where Search Console reads should work.
- Add `GOOGLE_BUSINESS_PROFILE_LOCATION_ID` where Google Business Profile reads should work.
- Keep working Google OAuth variables intact; runtime verification proved token exchange can succeed.
