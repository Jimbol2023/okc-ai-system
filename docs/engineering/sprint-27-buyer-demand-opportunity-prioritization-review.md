# Sprint 27 Buyer-Demand Opportunity Prioritization Review

Sprint 27 uses Sprint 26A cross-connector certification plus internal buyer-demand signals to prioritize manual buyer-demand opportunities.

The output contract is `buyer-demand-opportunity-prioritization-v1`. It is advisory only and prioritizes:

- page/content opportunities
- city or local-market opportunities
- buyer-fit opportunities
- local trust opportunities
- buyer-demand data gaps

Inputs are limited to:

- certified Sprint 26A packet output
- internal buyer-demand signals from existing buyer records
- R78 buyer-demand alignment lockdown doctrine

Safety boundaries remain locked:

- no new provider connector
- no Search Console, GA4, GBP, buyer-data, external API, or provider reads from this layer
- no buyer or seller contact
- no buyer match creation, seller lead creation, CRM mutation, campaign, deal blast, outreach, publishing, ads, scraping, runtime job, automation, memory write, KPI write, or persistence promotion
- missing buyer-demand evidence becomes data gaps only

CEO approval remains required before any production provider-read expansion, recurring reads, persistence promotion, buyer matching operations, outreach, campaign action, or external execution.
