# Sprint 10 Provider Adapter Expansion Engineering Brief

## Sprint Identity

- Sprint name: Sprint 10 - Provider Adapter Expansion.
- Date: 2026-07-10.
- Request owner: Moses Adebajo, CEO.
- Architecture owner: ChatGPT, Chief AI Officer / Enterprise Architect.
- Implementation owner: Codex, Engineering Director / Lead Software Engineer.
- Approval state: Sprint 10A implementation completed as shared provider adapter contract and dry-run registry expansion only. Sprint 10B added adapter registry expansion and provider capability metadata only. Sprint 10C added draft payload validation and normalization only. Sprint 10D added Preview-only governed draft adapter integration visibility only. Provider execution, OAuth activation, Preview deployment, Production deployment, and controlled Preview pilot execution remain unauthorized.

## Business Value

- Business problem solved: prepare J Capital AI OS to add Google Workspace draft adapters without multiplying one-off provider code paths.
- Department benefited: Executive Office, AI COO, Revenue Operations, Engineering, Compliance/Governance, Marketing, and future Provider Operations.
- AI employees affected: AI COO, Engineering Director, Compliance Officer, Connector Operations Manager, Revenue Operations Manager, Executive Assistant AI, Marketing Manager AI.
- Revenue impact: creates the governed foundation for faster CEO-reviewed documents, email drafts, and calendar draft preparation while preventing unsafe external writes.
- Cost reduction impact: reduces future engineering duplication by introducing one shared adapter contract before adding Google Drive, Google Docs, Gmail, and Calendar draft surfaces.

## Architecture Review

- Existing modules searched:
  - `lib/controlled-execution-maturity.ts`
  - `lib/google-drive-draft-pilot.ts`
  - `lib/approved-execution-layer.ts`
  - `lib/connector-platform.ts`
  - `lib/tool-capability-manager.ts`
  - `lib/read-only-business-connections.ts`
  - `lib/read-only-connector-adapters.ts`
  - `docs/architecture/provider-integration-policy.md`
  - `docs/architecture/connector-contracts.md`
  - `tests/safety/*provider*`, `tests/safety/*google-drive*`, `tests/safety/*connector*`
- Reusable architecture found:
  - Provider execution registry and redacted dry-run preview model.
  - External execution readiness gate.
  - Google Drive draft pilot validation, audit preflight, memory outcome, and Production hard block.
  - Connector platform metadata for Gmail, Google Calendar, and Google Drive.
  - Read-only Google Workspace connector foundation and scope verification.
  - Draft-only external work contract for email, calendar, and drive document drafts.
- Recommended implementation path:
  - Extract a shared provider adapter interface first.
  - Move provider action registry shape from a single Drive action to a typed multi-action registry.
  - Add draft-only adapter definitions for Google Drive/Docs, Gmail, and Calendar without live provider writes.
  - Keep the Sprint 9 Google Drive live-write pilot path separate and protected unless separately approved.
- Simpler architecture available: extend the current Drive-only registry in place for Sprint 10A before creating routes or UI for every provider. This is preferred over adding new endpoint families.
- Does this fit the AI company model: yes. It improves the CEO -> AI COO -> Department -> CEO loop by preparing governed draft work for review while preserving approval boundaries.
- Should this sprint be split: yes. Sprint 10 should be split into 10A shared adapter contract, 10B Google Drive/Docs draft adapter planning, 10C Gmail draft adapter planning, 10D Calendar draft adapter planning, and only later any separately approved Preview pilot.

## Expected Change Scope

- Expected files changed:
  - `lib/controlled-execution-maturity.ts`
  - New shared provider adapter contract module under `lib/`
  - Existing provider execution framework tests under `tests/safety/`
  - Controlled execution dashboard only if read-only visibility needs to show the expanded registry.
- Expected new files:
  - A shared provider adapter contract module.
  - Focused safety tests for provider adapter registry, redaction, unsupported action blocking, and no-live-write invariants.
- Expected docs changed:
  - Sprint 10 brief and sprint history after implementation.
  - Provider integration docs only if public contract terms change.
- Files explicitly out of scope:
  - No OAuth credential files.
  - No Prisma schema or migrations unless a later approved audit persistence change requires them.
  - No new live provider execution route.
  - No changes to `app/api/company/provider-pilots/google-drive-draft/route.ts` unless explicitly approved.

## Safety And Approval

- External provider calls expected: no.
- External writes expected: no.
- Sends/posts/publishing/SMS/email/scheduling/scraping expected: no.
- Credentials or OAuth scopes changed: no.
- CEO approval required:
  - Required before implementation.
  - Separately required before any Preview-only provider pilot.
  - Separately required before any OAuth scope or environment change.
- Approval gates preserved:
  - Safe Auto Mode.
  - Connector health.
  - Feature flags.
  - Exact-action allowlist.
  - Audit preflight.
  - Memory outcome handling.
  - Kill switch.
  - Production hard block.
  - Confirmation phrase for any future controlled pilot.

## Recommended Sprint 10A Implementation

- Introduce a shared provider adapter contract with these minimum concepts:
  - `actionType`
  - `connector`
  - `providerOperation`
  - `mode`
  - `allowedEnvironment`
  - `requiredConfigKeys`
  - `requiredScopes`
  - `approvalRequired`
  - `killSwitchRequired`
  - `productionBlocked`
  - `liveWriteEnabled:false`
  - `buildRedactedPreview`
  - `validateReadiness`
  - `safety`
- Supported Sprint 10A actions should remain preview/draft planning only:
  - `create_drive_doc_draft`
  - `create_google_doc_draft`
  - `create_gmail_draft`
  - `create_calendar_event_draft`
- The shared preview result must always include:
  - `providerCalled:false`
  - `liveExecutionAllowed:false`
  - `wouldCallProvider:false`
  - `sent:false`
  - `published:false`
  - `scheduled:false`
  - `productionBlocked:true`
  - redacted request preview only.
- Do not implement provider SDK clients, live fetch calls, OAuth token exchanges, draft creation API calls, email sending, calendar insertion, document upload, or background jobs in Sprint 10A.

## Risk And Technical Debt

- Risks discovered:
  - Current Drive pilot executor is intentionally live-write capable in Preview when all gates pass; do not generalize that into broad provider execution.
  - Existing `create_drive_doc` / `drive.files.create` approved-execution naming is riskier than `create_drive_doc_draft` and must remain blocked/separate.
  - Gmail and Calendar currently have read-only scope foundations; draft/write scopes must not be assumed or activated.
  - Dirty worktree contains many modified/untracked files; preserve all unrelated work.
- Technical debt discovered:
  - Single-action provider registry should become shared before adding provider families.
  - Readiness packet shape is Drive-specific and should become generic enough for Gmail/Calendar/Docs.
  - ESLint hang from Sprint 9 remains unresolved.
  - Existing Turbopack tracing warning remains unrelated but should be tracked separately.
- Duplicate logic risk: high if Gmail, Calendar, Docs, and Drive each get separate readiness, redaction, audit, and safety logic.
- Architecture conflict risk: high if Sprint 10 turns draft adapters into provider writes without a separate CEO-approved controlled phase.
- Stop-authority decision: stop immediately if implementation requires OAuth scope changes, provider calls, provider SDK activation, live writes, Production deployment, or background automation.

## Validation Plan

- Focused tests:
  - Provider adapter registry lists only approved draft/planning actions.
  - Unsupported action types throw or block.
  - Redacted previews never include secrets, tokens, folder IDs, emails beyond approved preview fields, authorization headers, or provider endpoints.
  - Production requested environment blocks.
  - Every Sprint 10 adapter preview reports `providerCalled:false` and `liveExecutionAllowed:false`.
- Safety/read-only tests:
  - Existing Google Drive readiness and provider execution framework tests remain passing.
  - Add Gmail and Calendar draft adapter tests that prove no send/insert/update calls exist.
  - Add contract tests that `create_drive_doc` and `drive.files.create` remain blocked/separate.
- TypeScript/build:
  - Run targeted safety tests after implementation.
  - Run `npm run test:safety`.
  - Run `npm run build`.
  - Run lint only if the local lint hang is resolved or with a bounded focused command.
- Manual validation:
  - Inspect controlled execution dashboard if registry visibility changes.
  - Confirm no Preview deploy, no Production deploy, and no provider call occurred.
- Deploy plan:
  - No deploy in Sprint 10A unless separately approved after all gates pass.

## CEO Decision Required Before Implementation

- Recommended default: approve Sprint 10A shared provider adapter contract and dry-run registry expansion only.
- Do not approve provider execution as part of Sprint 10A.
- Do not approve the controlled Preview Google Drive pilot as part of Sprint 10A.
- A separate CEO decision is required for any Preview pilot packet, OAuth scope change, provider write, or deployment.

## Sprint 10 Sequence Correction

- Sprint 10A: shared provider adapter contract and dry-run registry expansion.
- Sprint 10B: adapter registry expansion and provider capability metadata.
- Sprint 10C: draft payload validation and normalization.
- Sprint 10D: Preview-only integration with governed draft adapters, with no autonomous execution.
- UI readiness work must come after metadata and validation are stable.

## Sprint 10B Metadata Additions

- Capability metadata must be versioned with `sprint-10b-v1`.
- Each adapter must declare owner department, AI employee owner, capability family, draft surface, human review categories, blocked operation taxonomy, redaction policy, audit readiness label, memory readiness label, fallback instruction, provider risk level, and future sprint mapping.
- Capability summaries must be derived from the adapter registry, not duplicated in another module.
- Capability metadata remains read-only and must always report no provider call, no live execution, no live write, and Production blocked.

## Sprint 10C Payload Validation And Normalization

- Draft payload validation is versioned with `sprint-10c-v1`.
- Validation accepts only the four approved Sprint 10 draft actions.
- Validation normalizes title, body, recipient preview, attendee preview, start time preview, source label, and Google Drive target-folder evidence before preview generation.
- Google Drive folder evidence is reduced to a configured/not-configured boolean; raw folder IDs must not appear in normalized payload output.
- Gmail payloads require recipient preview before governed preview generation.
- Calendar payloads require attendee preview and start time preview before governed preview generation.
- Secret-like values, authorization headers, bearer tokens, refresh tokens, OAuth client secrets, and provider endpoints are redacted and block a valid payload result.
- Payload validation always reports `providerCalled:false` and `liveExecutionAllowed:false`.

## Sprint 10D Governed Preview-Only Integration

- Governed preview integration is versioned with `sprint-10d-v1`.
- Preview integration must consume normalized Sprint 10C payloads only.
- The integration may produce redacted preview packets for Drive, Docs, Gmail, and Calendar draft adapters.
- It must not add provider routes, execution buttons, OAuth changes, SDK clients, fetch calls, deployments, background jobs, autonomous execution, or live writes.
- Every integration packet must report `providerCalled:false`, `wouldCallProvider:false`, `liveExecutionAllowed:false`, `autonomousExecution:false`, `previewOnly:true`, and `productionBlocked:true`.
- Production requests remain blocked before any provider call can exist.
- Sprint 9 Google Drive pilot route remains isolated and unchanged.
