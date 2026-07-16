# Connector Contracts

Connector Plug-ins are governed provider boundaries managed by the [Universal Enterprise Integration Platform](./universal-enterprise-integration-platform.md). Readiness never grants execution authority.

## Platform Boundary

- UEIP is the authoritative AI Core control plane for external systems.
- Departments request semantic capabilities and must not call providers, read credentials, or create independent OAuth flows.
- Provider access must pass through the governed gateway after tenant, capability, environment, scope, feature flag, health, Safe Auto Mode, approval, and audit checks.
- A gateway allow decision authorizes a plan only; it does not itself call a provider.
- Existing direct provider paths are consolidation candidates and must not be copied into new department features.

## Universal Manifest

Every plug-in implements `ueip-connector-manifest-v1` and declares:

- stable connector ID and semantic version;
- provider, owner department, supported tenants, compatible business modules, and environments;
- lifecycle state: `proposed`, `sandboxed`, `read_only`, `controlled_write`, `suspended`, `deprecated`, or `retired`;
- semantic capability key and provider action mapping;
- operation, risk, scopes, approval policy, data classification, and execution boundary;
- authentication strategy and credential reference metadata without secret values;
- input/output, provenance, pagination, freshness, normalization, and error contracts;
- rate limit, quota, timeout, retry, circuit-breaker, health, redaction, retention, audit, fixture, and incident requirements.

Lifecycle promotion requires certification and explicit governance review. Passing one lifecycle gate never implicitly authorizes another.

## Universal Connector Contract

Every connector must define:

- connector ID
- provider name
- required environment keys
- optional environment keys
- official documentation links
- allowed read actions
- blocked write actions
- health-check behavior
- approval requirements
- rate-limit expectations
- audit fields
- failure behavior
- redaction rules
- supported tenant IDs and business modules
- semantic capabilities and data classification
- lifecycle state and certification evidence

## Required Response Fields

Connector readiness responses must include:

- `connectorId`
- `status`
- `requiredEnvKeys`
- `missingEnvKeys`
- `oauthRequired`
- `oauthReady`
- `readOnly`
- `providerCalled`
- `liveExecutionAllowed:false`

They must not include secret values, access tokens, refresh tokens, raw provider payloads, cookies, or authorization headers.

## Google Connector Family

Shared OAuth:

- Required keys: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`
- Official docs: [Google OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- Allowed readiness call: token exchange only, redacted to pass/fail/status.
- Blocked by default: writes, publishing, profile mutation, email sending, file writes, calendar writes.

### Search Console

- Required key: `GOOGLE_SEARCH_CONSOLE_SITE_URL`
- Official docs: [Search Console API Reference](https://developers.google.com/webmaster-tools/v1/api_reference_index)
- Allowed read actions: performance query, URL inspection readiness.
- Write actions: blocked.

### Google Analytics

- Required key: `GOOGLE_ANALYTICS_PROPERTY_ID`
- Official docs: [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- Allowed read actions: traffic summary and dashboard telemetry.
- Write actions: blocked.

### Google Business Profile

- Required key: `GOOGLE_BUSINESS_PROFILE_LOCATION_ID`
- Official docs: [Business Profile Performance API](https://developers.google.com/my-business/reference/performance/rest)
- Allowed read actions: performance telemetry and review visibility.
- Write actions: blocked unless a future exact publishing policy authorizes the action.

### YouTube

- Required key: `YOUTUBE_CHANNEL_ID`
- Official docs: [YouTube Data API](https://developers.google.com/youtube/v3), [YouTube Analytics API](https://developers.google.com/youtube/analytics)
- Allowed read actions: channel/video metadata and analytics summaries.
- Write actions: blocked.

## Vercel Operations Connector

- Official docs: [Vercel Environment Variables](https://vercel.com/docs/environment-variables), [vercel curl](https://vercel.com/docs/cli/curl)
- Sensitive env values must be verified through runtime redacted health, not env pull/list.
- Protected Preview endpoints should be tested with `vercel curl`.

## Failure Behavior

Connectors fail closed:

- Missing credentials create data gaps.
- Provider rejection creates a redacted readiness failure.
- Network errors create a redacted transient failure.
- Any write request without exact approval is blocked.
- Raw provider payloads are not stored until audit schema approval exists.

## Audit Fields

Future connector audit events should include:

- `connectorId`
- `actionKey`
- `readOnly`
- `providerCalled`
- `liveExecutionAllowed`
- `approvalId`
- `traceId`
- `status`
- `redactionApplied`
- `operatorId`
