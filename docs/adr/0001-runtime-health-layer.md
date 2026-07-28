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
- blocks Production builds through preflight when critical blockers exist

## Consequences

- Operators get runtime truth instead of dashboard/CLI guesswork.
- Codex can run safe diagnostics without reading secret values.
- Production deploys have a clearer fail-closed path.
- Provider readiness remains distinct from execution authority.

## Rollback

Remove the prebuild hook and admin health route if they block emergency recovery, then redeploy the last known-good build. Keep secret values in Vercel; do not move them into code or logs.
