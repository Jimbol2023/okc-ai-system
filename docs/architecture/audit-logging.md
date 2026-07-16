# Audit And Logging Architecture

Audit is the memory of governed execution. Logging is for operational diagnosis. Neither may leak secrets.

## What Gets Logged

- operator-visible action
- approval ID
- connector ID
- action key
- trace ID
- status
- redacted failure type
- provider-called flag
- live-execution flag
- safety gate snapshot
- deployment health result

## What Never Gets Logged

- access tokens
- refresh tokens
- client secrets
- passwords
- database URLs
- authorization headers
- cookies
- raw provider payloads
- full message bodies unless a future retention policy permits them

## Redaction Rules

Any field matching secret-like names must be dropped or replaced with `[redacted]`.

Secret-like names include:

- token
- secret
- password
- credential
- authorization
- cookie
- api key
- database url

## Provider Payload Handling

Provider payloads may be summarized into safe metrics and source labels. Raw payload storage requires a future schema, retention, privacy, and approval review.

## Runtime Health Events

Future runtime health persistence should track:

- last successful connector check
- last failed connector check
- last deployment health result
- last operator-visible blocker
- last redaction failure

Do not add persistence for these fields until the schema is reviewed and migration risk is accepted.

## Failure Policy

If audit writing is required and fails, the action must fail closed or be marked unsafe/incomplete. Approval alone does not bypass audit requirements.
