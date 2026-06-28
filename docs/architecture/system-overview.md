# System Overview

J Capital Property Group is a Next.js wholesale real estate operating system for Oklahoma City. The public site captures leads, and the authenticated dashboard supports CRM review, acquisitions, property review, finance, marketing workflow, Knowledge Hub search, BI metrics, and AI Memory insights.

Current runtime boundaries:

- Dashboard routes are authenticated and runtime-only when they depend on Prisma.
- Prisma is the source of truth for leads, finance entries, marketing workflow records, Knowledge Hub items, AI memory events, and provider readiness tracking.
- Executive Dashboard metrics come from the BI engine, revenue pipeline analysis, manual finance entries, Knowledge Hub records, and AI Memory.
- Knowledge search is internal-first. Optional OpenAI embeddings are server-only and disabled unless explicitly gated by environment flags.
- Global search is internal-only across navigation, leads, properties, knowledge records, documentation references, and marketing drafts.

Safety boundaries:

- Never invent property facts.
- No outreach, provider calls, ads, scraping, publishing, or autonomous automation may be introduced by dashboard display code.
- Recommendations are advisory only and must remain explainable.
- Provider readiness does not imply provider activation.

Deferred work:

- Live provider integrations.
- Approval-controlled publishing.
- Durable historical KPI snapshots.
- AI-generated answers or lead enrichment.
