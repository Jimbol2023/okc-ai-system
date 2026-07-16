# Sprint 9 Preview Verification Checklist

## Purpose

Sprint 9 is a governance verification gate for one future controlled Google Drive Preview pilot. It does not authorize provider execution, OAuth activation, Preview deployment, Production deployment, email, SMS, publishing, scraping, ads, or autonomous workflows.

## Required Gate State

- CEO approval must authorize exactly one Preview-only Google Drive draft test before any execution attempt.
- Production must remain blocked before, during, and after the test.
- The pilot endpoint must remain authenticated and exact-action only: `create_drive_doc_draft`.
- The confirmation phrase must be exactly `CREATE_PREVIEW_DRIVE_DRAFT`.
- The Google Drive pilot flag must be configured only for the approved Preview environment: `GOOGLE_DRIVE_DRAFT_PILOT_ENABLED=true`.
- The test folder must be a dedicated non-production folder configured with `GOOGLE_DRIVE_TEST_FOLDER_ID`.
- Google OAuth values must be configured in Preview only and never exposed in UI, logs, audit metadata, or memory summaries.
- Current read-only Drive scope remains documented separately from the future draft-write pilot scope.
- Kill switch, audit preflight, and memory review must be confirmed before a CEO-approved Preview attempt.

## Production Hard Block Proof

- `NODE_ENV=production` blocks the pilot before a provider call.
- `VERCEL_ENV=production` blocks the pilot before a provider call.
- Production deployment is not included in Sprint 9 verification.
- Production provider execution remains blocked even when approval, credentials, and a test folder exist.

## No Provider Execution Evidence

Verification commands for this gate must be limited to local inspection and tests:

- `node --import tsx --test tests/safety/google-drive-draft-pilot.test.ts tests/safety/google-drive-draft-pilot-readiness.test.ts tests/safety/provider-execution-framework.test.ts tests/safety/external-execution-readiness-gate.test.ts`
- `npm run test:safety`
- `npm run test`
- `npm run lint`
- `npm run build`

Passing verification means readiness can report configuration state, Production block tests pass, and provider-call fields truthfully remain false for readiness and dry-run preview surfaces. These commands must not perform Google API calls, OAuth token exchanges, document creation, deployment, sends, publishes, scraping, ad actions, or workflow execution.

## Preview Execution Checklist

- Confirm CEO approval for one controlled Preview-only Google Drive draft test.
- Confirm Vercel target is Preview only.
- Confirm `GOOGLE_DRIVE_DRAFT_PILOT_ENABLED=true` in Preview only.
- Confirm `GOOGLE_DRIVE_TEST_FOLDER_ID` points to a dedicated test folder.
- Confirm Google OAuth env vars are configured in Preview and are not rendered or logged.
- Confirm the OAuth grant supports the pilot write action while read-only connector scope remains documented.
- Confirm kill switch is active and reversible.
- Confirm request action is `create_drive_doc_draft`.
- Confirm confirmation phrase is `CREATE_PREVIEW_DRIVE_DRAFT`.
- Confirm audit write succeeds before any provider call.
- Confirm memory write is reviewed after any provider call.
- Confirm Production remains blocked before, during, and after the test.

## Technical Debt Before Sprint 10

- Keep readiness gates and executor gates aligned before adding more provider adapters.
- Extract a shared provider adapter interface before adding Google Docs, Gmail drafts, or Calendar drafts.
- Keep `create_drive_doc` and `drive.files.create` blocked and separate from the safer `create_drive_doc_draft` pilot path.
- Preserve the dirty worktree; future Sprint 10 edits should touch only approved adapter/readiness surfaces.
