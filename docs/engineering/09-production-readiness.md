# Production Readiness

Production readiness is a governed state, not just a passing build.

## Required Before Production Deploy

- approved sprint decision gate
- scoped file review
- TypeScript passes
- relevant unit and safety tests pass
- build passes
- provider execution remains blocked unless explicitly approved
- no credential or OAuth scope changes without approval
- no unrelated dirty files included
- database migrations reviewed if present
- rollback and monitoring plan documented
- Preview validation completed when applicable

## Deployment Rules

- Do not deploy Production without explicit approval.
- Do not promote Preview to Production without explicit approval.
- Do not change aliases, credentials, environment variables, or OAuth scopes without explicit approval.
- Use redacted diagnostics for runtime health.

## Production Stop Conditions

Stop before Production if:

- tests fail
- build fails
- connector health is ambiguous for a required live path
- the change touches unrelated dirty files
- the sprint lacks a business value answer
- external execution would occur without exact governed approval
