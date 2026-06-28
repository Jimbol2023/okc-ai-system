# Provider Integration Policy

Provider integrations are intentionally conservative. The product advantage is explainable governance, not black-box automation.

Allowed today:

- Provider readiness tracking.
- Manual setup documentation.
- Internal-only recommendations that mention missing provider readiness.
- Optional server-side OpenAI embeddings for search only when explicitly enabled.
- n8n workflow design as disabled drafts only.

Not allowed without a future controlled phase:

- Sending SMS, email, calls, or outreach.
- Publishing social posts or GBP updates.
- Creating ads or spending ad budget.
- Scraping, enrichment writes, or automatic property facts.
- Client-side provider calls.
- Live n8n triggers, Power Automate Desktop flows, dashboard terminal execution, or dashboard file system writes.
- LLM-generated property claims, legal claims, tax claims, valuation claims, or seller-specific facts.

Activation requirements for future phases:

- Explicit operator approval.
- Kill switch.
- Audit log.
- Provider-specific safety flags.
- Least-privilege credentials.
- Dry-run mode.
- Clear user-facing status showing whether a provider was called.

OpenAI boundary:

- Embeddings are optional and server-only.
- Text generation is not part of the current search phase.
- Failure must fall back to internal keyword search with `providerCalled:false`.
