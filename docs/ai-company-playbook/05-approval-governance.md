# Approval Governance

The AI workforce is approval-first.

## Approval Levels

- `none_internal_only`: the employee can produce internal notes, summaries, or checklists.
- `manager_review`: a department manager or AI COO review is required before the output becomes a work order.
- `ceo_approval_required`: CEO review is required before the work can move beyond preparation.
- `external_action_prohibited`: the employee may prepare internal drafts only; external action is blocked.

## CEO Approval Is Not General Permission

CEO approval must be exact-action approval. Approval for one draft, task, or recommendation does not authorize future sends, posts, publishing, scraping, provider writes, or outreach.

## Safety Defaults

Sprint 0 keeps these defaults:

- external actions blocked
- live execution blocked
- provider writes blocked
- sending blocked
- publishing blocked
- scraping blocked
- SMS blocked
- scheduling blocked

Any future execution sprint must preserve audit logs, approval records, memory records, and fail-closed behavior.
