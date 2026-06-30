# System Overview

J Capital Property Group is a Next.js wholesale real estate operating system for Oklahoma City. The public site captures leads, and the authenticated dashboard supports CRM review, acquisitions, property review, finance, marketing workflow, Knowledge Hub search, BI metrics, and AI Memory insights.

Current runtime boundaries:

- Dashboard routes are authenticated and runtime-only when they depend on Prisma.
- Prisma is the source of truth for leads, finance entries, marketing workflow records, Knowledge Hub items, AI memory events, and provider readiness tracking.
- The Enterprise AI Governance Constitution is the source of truth for AI agents, workflows, connectors, automation, APIs, users, and future modules.
- The Tool Registry & Capability Manager defines available tools, supported actions, health, approvals, and fallbacks before any AI module can recommend tool use.
- Safe Auto Mode allows internal drafts, summaries, scoring, and review queues while external execution remains blocked by default.
- Phase 2 Enterprise AI adds feature-flagged connector platform, market intelligence, demand discovery, growth engine foundations, and executive briefings without authorizing live external execution.
- Phase 3 Production Execution adds the first governed daily-operations vertical slice: connector marketplace readiness, wizard planning, AI permissions, unified approvals, social operations drafts, automation policies, learning outcomes, and a mobile command center. It remains execution-plan-only unless future connector policy explicitly permits live execution.
- Executive Dashboard metrics come from the BI engine, revenue pipeline analysis, manual finance entries, Knowledge Hub records, and AI Memory.
- Knowledge search is internal-first. Optional OpenAI embeddings are server-only and disabled unless explicitly gated by environment flags.
- Global search is internal-only across navigation, leads, properties, knowledge records, documentation references, and marketing drafts.
- Workflow orchestration readiness is audit-only. n8n is the preferred future orchestrator, while Power Automate Desktop, Playwright, terminal access, and file system access remain blocked or manual-review-only until governance exists.

Safety boundaries:

- Never invent property facts.
- No outreach, provider calls, ads, scraping, publishing, or autonomous automation may be introduced by dashboard display code.
- Recommendations are advisory only and must remain explainable.
- Provider readiness does not imply provider activation.
- Approval decisions do not imply live execution authority.

Deferred work:

- Live provider integrations.
- Live workflow triggers or desktop automation.
- Approval-controlled publishing.
- Durable historical KPI snapshots.
- AI-generated answers or lead enrichment.

Related governance documents:

- `docs/architecture/enterprise-ai-governance-constitution.md`
- `docs/architecture/tool-registry-capability-manager.md`
- `docs/architecture/safe-auto-mode.md`
- `docs/architecture/growth-intelligence-engines.md`
- `docs/architecture/phase2-enterprise-connector-intelligence-platform.md`
- `docs/architecture/phase3-production-execution-platform.md`
