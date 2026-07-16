# System Architecture

J Capital AI OS is an AI Business Operating Company. The Oklahoma City wholesale real estate workflow is the first Real Estate Business Module, not the entire platform.

## Architecture Layers

- AI Core: reusable platform services such as approvals, audit, memory, dashboard primitives, connector registry, provider readiness, AI workforce, and operating loop coordination.
- Business Modules: industry-specific workflows such as real estate lead capture, seller acquisition, acquisitions, county intelligence, deal analysis, and marketing.
- Connector Plug-ins: governed integrations such as Google, Twilio, Canva, Vercel, Meta, LinkedIn, and future providers.
- Approval / Safety Layer: Safe Auto Mode, exact-action approvals, provider health, audit logs, AI permissions, and execution policy.

## AI Company Operating Model

Every feature should fit this chain:

Company -> Division -> Department -> Manager AI -> AI Employee -> Daily Mission -> Work Order -> Approval -> Execution -> Outcome -> Memory -> KPI

Standalone features that do not fit this chain should be challenged before implementation.

## Reuse Rule

Before building a new module, search for existing architecture in:

- `lib/`
- `app/api/`
- `components/dashboard/`
- `docs/architecture/`
- `docs/ai-company-playbook/`
- tests under `lib/*.test.ts` and `tests/safety/`

Prefer extending existing services unless doing so would create tighter coupling or unclear ownership.

## External Execution Boundary

External provider calls, sends, posts, publishing, scheduling, scraping, ads, SMS, email, phone calls, OAuth writes, CRM mutations, and workflow execution remain blocked unless an explicit governed policy authorizes the exact action.
