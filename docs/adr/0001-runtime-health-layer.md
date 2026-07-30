# ADR 0001: Runtime Health Layer

## Status

Accepted.

## Context

Vercel sensitive environment variables can be present in runtime while appearing empty through CLI pull/list workflows. The operating company needs a safer way to diagnose infrastructure readiness without exposing secrets or relying on non-authoritative local files.

## Decision

Create a permanent runtime health layer that:

- evaluates environment key presence/status/length only
- checks database health
- performs redacted OAuth token-exchange readiness when explicitly allowed
- reports connector readiness by dependency
- feeds an admin-only dashboard and API
- blocks Production builds through preflight only when platform-critical or safety blockers exist
- reports missing or unhealthy department connectors as department-scoped blockers without stopping unrelated company deployment

## Deployment Scope Policy

The runtime health layer uses a two-tier gate:

- Platform-critical infrastructure and safety controls are company-wide deployment blockers.
- Connector configuration, authentication, health, and data gaps block only the connector-backed capabilities and affected departments.

Connector-scoped deployment warnings do not authorize provider calls or external execution. Affected connectors remain fail-closed, and the Department Enablement Matrix must show the blocked capability, affected departments, safe internal fallback availability, and required operator action.

## Consequences

- Operators get runtime truth instead of dashboard/CLI guesswork.
- Codex can run safe diagnostics without reading secret values.
- Production deploys have a clearer fail-closed path.
- Provider readiness remains distinct from execution authority.
- One department connector cannot take down deployment of unrelated public, internal, or department surfaces.

## Rollback

Remove the prebuild hook and admin health route if they block emergency recovery, then redeploy the last known-good build. Keep secret values in Vercel; do not move them into code or logs.
