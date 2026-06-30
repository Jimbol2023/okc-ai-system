# Provider Integration Policy

Provider integrations are intentionally conservative. The product advantage is explainable governance, not black-box automation.

Allowed today:

- Provider readiness tracking.
- Tool Registry and Capability Manager visibility for supported actions, approval requirements, health, and fallbacks.
- Safe Auto Mode evaluation for internal drafts, summaries, scoring, and review queues.
- Manual setup documentation.
- Internal-only recommendations that mention missing provider readiness.
- Optional server-side OpenAI embeddings for search only when explicitly enabled.
- n8n workflow design as disabled drafts only.
- Connector marketplace visibility, setup wizard planning, connector test plans, and connector enablement requests as approval-gated metadata only.
- Social operations drafts, repurposing, schedule intent, and execution plans when they remain provider-call-free and publish-blocked.

Not allowed without a future controlled phase:

- Sending SMS, email, calls, or outreach.
- Publishing social posts or GBP updates.
- Creating ads or spending ad budget.
- Scraping, enrichment writes, or automatic property facts.
- Client-side provider calls.
- Live n8n triggers, Power Automate Desktop flows, dashboard terminal execution, or dashboard file system writes.
- LLM-generated property claims, legal claims, tax claims, valuation claims, or seller-specific facts.
- Treating content approval, connector install, connector test, or connector enablement as permission to call providers or perform external writes.

Activation requirements for future phases:

- Explicit operator approval.
- Kill switch.
- Audit log.
- Provider-specific safety flags.
- Least-privilege credentials.
- Dry-run mode.
- Clear user-facing status showing whether a provider was called.
- Registered tool definition with authentication method, permissions, rate limits, cost, owner, supported actions, retry policy, fallback, and approval requirements.
- Enabled feature flag and connector lifecycle state.
- Circuit breaker, timeout policy, health monitoring, and fallback behavior.
- Unified approval record and Safe Auto Mode decision proving the specific action is allowed.
- Connector installation state showing authentication, scope validation, health, and action policy are all satisfied.

OpenAI boundary:

- Embeddings are optional and server-only.
- Text generation is not part of the current search phase.
- Failure must fall back to internal keyword search with `providerCalled:false`.
