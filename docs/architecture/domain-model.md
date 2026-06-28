# Domain Model

The product is organized around internal real estate operating records.

Primary domains:

- Leads: seller/contact/property context, source tracking, lead status, scoring signals, notes, follow-ups, approval state, and manual outreach boundaries.
- Properties: property review views derived from stored lead/property records. The system must not invent property facts.
- Acquisitions: offer readiness, analyzer context, seller motivation, and pipeline review.
- Finance: manual entries that support cash flow, cost per lead, cost per acquisition, ROI, and dashboard KPI interpretation.
- Marketing: internal draft workflow, approvals, publish assists, Canva asset briefs, and provider readiness. Publishing remains manual.
- Knowledge: saved KnowledgeItem records plus curated documentation references for SOPs, playbooks, checklists, and guidance.
- AI Memory: governed AiMemoryEvent records used for deterministic confidence and learning signals.
- Provider readiness: credential and governance readiness tracking without live calls.

Recent foundations:

- BI engine computes real KPI cards, department health, channel performance, and trend series from stored records.
- AI Memory learning adds recommendation confidence from internal events.
- Knowledge search combines keyword ranking, documentation references, and optional gated embeddings.
- Global search and command palette normalize internal search results without provider calls.

Modeling rules:

- Every lead must track source.
- Assumptions must be labeled clearly.
- Missing timestamps stay unavailable instead of guessed.
- Readiness records are not credentials and must not expose secrets.
