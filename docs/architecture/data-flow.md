# Data Flow

Lead flow:

1. Public and dashboard intake validate submitted lead data.
2. Leads are stored through Prisma with a required source.
3. Dashboard views read stored leads for CRM, acquisitions, properties, analyzer, and executive summaries.
4. Follow-up and outreach signals remain manual-review only unless an explicitly governed future workflow changes that.

Executive dashboard flow:

1. The authenticated dashboard API loads leads, marketing workflow, finance entries, knowledge items, AI memory events, system health, and recent activity.
2. Each subsection may fail independently and return a data gap.
3. The BI engine computes current KPIs, trend series, channel performance, and department health.
4. AI Memory creates deterministic advisory recommendations with confidence and Knowledge Hub references.
5. The UI renders Morning Brief, priorities, KPI heartbeat, health, charts, recommendations, data gaps, and activity.

Search flow:

1. Knowledge search ranks saved Knowledge Hub records and curated documentation references.
2. Global search ranks navigation, leads, properties, knowledge, documentation references, and marketing drafts.
3. Search responses include `providerCalled:false` and do not generate property facts.
4. Optional semantic search uses stored embeddings only when server-side OpenAI flags are enabled.

Provider flow:

- Provider readiness can be displayed and tracked.
- Live provider calls, outreach, enrichment writes, ad creation, scraping, and publishing are deferred.
