# J Capital Phase 1 Security Stabilization - Immutable Source Evidence

Evidence date: 2026-08-10

Pre-publication classification: `LOCAL_P0_P1_GATES_PASSED`

This record contains no credentials, connection strings, cookies, tokens, raw PII, or private record contents. The immutable commit SHA, Draft PR, exact-SHA Preview deployment, deployed acceptance, and final Production-unchanged comparison are post-commit gates recorded in the PR and final certification response.

## Preview identity and migration

- Protected branch-aware v2 result: `PREVIEW_DATABASE_IDENTITY_CERTIFIED`.
- Project: `summer-star-72148368`; Preview branch: `vercel-preview`.
- Preview branch and endpoint differ from Production `main`; pooled and direct Preview identities match.
- Legacy v1 status is intentionally ignored.
- Migration `20260808180000_add_security_stabilization_controls` is applied; 47 migrations are current.
- Three security tables, three primary keys, and nine migration-defined secondary/unique indexes are present.
- All pre-existing table counts and tenant hashes remained unchanged across migration.
- No Production database connection occurred.

## Local verification

- TypeScript: passed.
- ESLint: passed with zero warnings.
- Maintained unit: 148 passed, 0 failed, 0 skipped.
- Safety: 372 passed, 0 failed, 0 skipped.
- Migration: 6 passed, 0 failed, 0 skipped.
- PostgreSQL integration: 2 passed, 0 failed, 0 skipped; synthetic records cleaned.
- Authenticated browser acceptance: 5 passed, 0 failed, 0 skipped.
- Test classification: 741 discovered and classified; 23 maintained-unit files, 5 safety files, 713 quarantined legacy files.
- Repository integrity: passed; zero tracked local databases after the staged deletion is committed.
- Production dependency audit: 0 vulnerabilities across 732 resolved dependencies.
- Full dependency audit: 0 vulnerabilities across 732 resolved dependencies.
- Invalid and unsigned Twilio webhook rejection used mocked `Request` construction only. Twilio was not called.

## Reproducible builds

Two consecutive clean production builds completed from the same controlled source.

| Measurement | Build 1 | Build 2 |
| --- | ---: | ---: |
| Manifest JSON files | 980 | 980 |
| NFT trace files | 274 | 274 |
| Unique traced paths | 11,171 | 11,171 |
| Path-set SHA-256 | `41405e35571812aa5f7fb9fa20cd4bb1a103dd47eb7777f47e329878e500965e` | `41405e35571812aa5f7fb9fa20cd4bb1a103dd47eb7777f47e329878e500965e` |
| Docs | 0 | 0 |
| Tests | 0 | 0 |
| `.git` | 0 | 0 |
| `.env*` | 0 | 0 |
| Storybook | 0 | 0 |
| Windows Prisma/native engines | 0 | 0 |
| Absolute Windows paths | 0 | 0 |
| Build owner lock after exit | absent | absent |

## Safety attestations

- `NEON_MCP_DISABLED_FAIL_CLOSED=true`; Neon MCP was not authorized, installed, reconnected, or used.
- No provider call, SMS, outreach, CRM mutation, publishing, scraping, or external workflow execution occurred.
- No Production deployment, alias, environment value, or database was changed.
- Phase 2 did not start.

## Remaining post-commit gates

- Push the one immutable Phase 1 commit and open a Draft PR.
- Prove local SHA equals remote branch SHA and Draft PR head SHA.
- Add the approved sensitive `PUBLIC_INTAKE_TENANT_ID` only to the now-existing Phase 1 Preview branch.
- Deploy only the immutable SHA through Git-integrated Preview and require `READY` with no Production alias.
- Repeat all five authenticated journeys against that exact Preview deployment.
- Repeat read-only Production control-plane metadata and require no drift.
