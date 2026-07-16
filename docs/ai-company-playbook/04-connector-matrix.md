# Connector Matrix

Sprint 0 uses connector and tool readiness to decide whether an AI employee can produce internal-only work today.

## Connector States

- Ready or connected: usable for internal-only work or read-only evidence.
- Readiness only: installed or planned, but not trusted for daily live operation.
- Missing: required configuration, credential, scope, or connector is absent.
- Data gap: connector exists but lacks fresh usable evidence.
- Blocked: tool is unavailable, rate-limited, prohibited, or external execution is not allowed.

## Important Rule

A connected or healthy connector does not authorize external execution.

Sprint 0 permits:

- internal summaries
- draft briefs
- checklists
- approval packets
- safe next actions
- read-only readiness review

Sprint 0 prohibits:

- sending
- publishing
- posting
- scraping
- texting
- emailing
- scheduling
- external provider writes
- ads
- automated seller outreach

## Priority Missing Connectors

The workforce readiness engine surfaces missing connectors from the current tool registry and connector activation report so Operations can decide what to configure next.
