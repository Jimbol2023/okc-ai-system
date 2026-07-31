import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { executeGbpRead, UeipGbpAdapterError } from "@/lib/ueip-gbp-adapter";
import { createUeipExecutionContext, runUeipGbpGateway, setUeipRuntimeDependenciesForTest } from "@/lib/ueip-runtime-gateway";

const locationName = "locations/123456789";
const reviewLocationName = "accounts/111/locations/123456789";
const scope = "https://www.googleapis.com/auth/business.manage";
let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

function runtime(input: { tenantId?: string; auditFails?: boolean; auditFailsAt?: string; fetcher?: typeof fetch; environment?: "development" | "preview" | "production"; grantedScopes?: string[]; authorizedLocationNames?: string[] } = {}) {
  const tenantId = input.tenantId ?? "tenant-a";
  const audits: Array<Record<string, unknown>> = [];
  let providerFetches = 0;
  const db = {
    connectorInstallationState: {
      async findUnique() {
        return {
          id: "gbp-installation-a",
          tenantId,
          connectorId: "google_business_profile",
          installationState: "enabled",
          configurationState: "configured",
          authenticationState: "authenticated",
          sandboxMode: true,
          enabled: true,
          enableApprovalStatus: "approved",
          credentialReferenceId: "gbp-credential-a",
          requiredScopes: [scope],
          grantedScopes: input.grantedScopes ?? [scope],
          permissionValidation: { authorizedLocationNames: input.authorizedLocationNames ?? [locationName, reviewLocationName] },
        };
      },
    },
    connectorCredentialReference: {
      async findFirst() {
        return { id: "gbp-credential-a", tenantId, connectorId: "google_business_profile", referenceKey: "gbp", secretStorageProvider: "environment", rawSecretStored: false, rawSecretRendered: false, expiresAt: null };
      },
    },
    ueipGatewayAuditEvent: {
      async create(args: { data: Record<string, unknown> }) {
        if (input.auditFails || input.auditFailsAt === args.data.stage) throw new Error("audit unavailable");
        audits.push(args.data);
        return { id: `audit-${audits.length}` };
      },
    },
    enterpriseConnectorHealthEvent: { async create() { return {}; } },
  };
  const defaultFetch: typeof fetch = async (url) => {
    providerFetches += 1;
    if (String(url).includes("oauth2.googleapis.com")) return new Response(JSON.stringify({ access_token: "secret-access-token" }), { status: 200, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ multiDailyMetricTimeSeries: [{ dailyMetric: "CALL_CLICKS", timeSeries: { datedValues: [{ value: "3" }] } }] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  restore = setUeipRuntimeDependenciesForTest({ db: db as never, fetcher: input.fetcher ?? defaultFetch, environment: input.environment ?? "preview" });
  return { audits, providerFetches: () => providerFetches };
}

function request(id: string, overrides: Partial<{ locationName: string; capabilityKey: "gbp.performance.read" | "gbp.reviews.read" }> = {}) {
  return {
    connectorId: "google_business_profile" as const,
    capabilityKey: overrides.capabilityKey ?? "gbp.performance.read" as const,
    capabilityVersion: "1.0.0" as const,
    parameters: { locationName: overrides.locationName ?? locationName, startDate: "2026-07-01", endDate: "2026-07-10", rowLimit: 10 },
    freshnessSeconds: 60,
    idempotencyKey: id,
  };
}

const env = { VERCEL_ENV: "preview", GOOGLE_OAUTH_CLIENT_ID: "client", GOOGLE_OAUTH_CLIENT_SECRET: "client-secret", GOOGLE_OAUTH_REFRESH_TOKEN: "refresh-secret", GOOGLE_BUSINESS_PROFILE_LOCATION_ID: locationName } as NodeJS.ProcessEnv;

test("GBP adapter validates location before provider access", async () => {
  let called = false;
  await assert.rejects(
    () => executeGbpRead({ request: { capability: "gbp.performance.read", locationName: "../bad", startDate: "2026-07-01", endDate: "2026-07-10" }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => { called = true; return new Response(); }, now: new Date("2026-07-15T12:00:00.000Z") }),
    (error: unknown) => error instanceof UeipGbpAdapterError && error.category === "invalid_request" && !error.providerAttempted,
  );
  assert.equal(called, false);
});

test("GBP adapter normalizes performance and review evidence", async () => {
  const performanceResponses = [
    new Response(JSON.stringify({ access_token: "token" }), { status: 200, headers: { "content-type": "application/json" } }),
    new Response(JSON.stringify({ multiDailyMetricTimeSeries: [{ dailyMetric: "CALL_CLICKS", timeSeries: { datedValues: [{ value: "2" }, { value: "3" }] } }, { dailyMetric: "BUSINESS_DIRECTION_REQUESTS", timeSeries: { datedValues: [{ value: "4" }] } }] }), { status: 200, headers: { "content-type": "application/json" } }),
  ];
  const performance = await executeGbpRead({ request: { capability: "gbp.performance.read", locationName, startDate: "2026-07-01", endDate: "2026-07-10" }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => performanceResponses.shift()!, now: new Date("2026-07-15T12:00:00.000Z") });
  assert.equal(performance.contractVersion, "ueip-gbp-result-v1");
  assert.equal(performance.signals.callClicks, 5);
  assert.equal(performance.signals.directionRequests, 4);

  const reviewResponses = [
    new Response(JSON.stringify({ access_token: "token" }), { status: 200, headers: { "content-type": "application/json" } }),
    new Response(JSON.stringify({ reviews: [{ reviewId: "r1", starRating: "FIVE", updateTime: "2026-07-01T00:00:00Z", comment: "Helpful team" }] }), { status: 200, headers: { "content-type": "application/json" } }),
  ];
  const reviews = await executeGbpRead({ request: { capability: "gbp.reviews.read", locationName: reviewLocationName, startDate: "2026-07-01", endDate: "2026-07-10" }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => reviewResponses.shift()!, now: new Date("2026-07-15T12:00:00.000Z") });
  assert.equal(reviews.signals.reviewRows, 1);
  assert.equal(JSON.stringify(reviews).includes("token"), false);
});

test("GBP adapter handles empty quota timeout and oversized responses safely", async () => {
  const emptyResponses = [new Response(JSON.stringify({ access_token: "token" }), { status: 200, headers: { "content-type": "application/json" } }), new Response(JSON.stringify({ multiDailyMetricTimeSeries: [] }), { status: 200, headers: { "content-type": "application/json" } })];
  const empty = await executeGbpRead({ request: { capability: "gbp.performance.read", locationName, startDate: "2026-07-01", endDate: "2026-07-10" }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => emptyResponses.shift()!, now: new Date("2026-07-15T12:00:00.000Z") });
  assert.equal(empty.reliability.status, "partial");
  const quotaResponses = [new Response(JSON.stringify({ access_token: "token" }), { status: 200, headers: { "content-type": "application/json" } }), new Response(JSON.stringify({ error: "quota" }), { status: 429, headers: { "content-type": "application/json" } })];
  await assert.rejects(() => executeGbpRead({ request: { capability: "gbp.performance.read", locationName, startDate: "2026-07-01", endDate: "2026-07-10" }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => quotaResponses.shift()!, now: new Date("2026-07-15T12:00:00.000Z") }), (error: unknown) => error instanceof UeipGbpAdapterError && error.category === "quota");
  const oversizedResponses = [new Response(JSON.stringify({ access_token: "token" }), { status: 200, headers: { "content-type": "application/json" } }), new Response(JSON.stringify({ reviews: "x".repeat(1_100_000) }), { status: 200, headers: { "content-type": "application/json" } })];
  await assert.rejects(() => executeGbpRead({ request: { capability: "gbp.reviews.read", locationName: reviewLocationName, startDate: "2026-07-01", endDate: "2026-07-10" }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => oversizedResponses.shift()!, now: new Date("2026-07-15T12:00:00.000Z") }), (error: unknown) => error instanceof UeipGbpAdapterError && error.category === "invalid_response");
});

test("Preview GBP read passes through durable preflight normalization and completion evidence", async () => {
  const state = runtime();
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipGbpGateway({ context, request: request("gbp-success"), env });
  assert.equal(result.ok, true);
  assert.equal(result.providerCalled, true);
  assert.equal(state.providerFetches(), 2);
  assert.deepEqual(state.audits.map((event) => event.stage), ["preflight_allowed", "credential_resolved", "completed"]);
  assert.equal(JSON.stringify(result).includes("secret-access-token"), false);
});

test("Development Production scope location audit and cache guards stay fail-closed", async () => {
  let state = runtime({ environment: "development" });
  let context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  let result = await runUeipGbpGateway({ context, request: request("gbp-development"), env: { NODE_ENV: "development" } });
  assert.equal(result.ok, true);
  assert.equal(result.providerCalled, false);
  assert.equal(state.providerFetches(), 0);
  restore?.();

  state = runtime({ environment: "production" });
  context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  result = await runUeipGbpGateway({ context, request: request("gbp-production"), env: { ...env, VERCEL_ENV: "production", NODE_ENV: "production" } });
  assert.equal(result.ok, false);
  assert.equal(result.providerCalled, false);
  restore?.();

  state = runtime({ grantedScopes: [] });
  context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  result = await runUeipGbpGateway({ context, request: request("gbp-scope"), env });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "credential_scope_insufficient");
  assert.equal(state.providerFetches(), 0);
  restore?.();

  state = runtime({ authorizedLocationNames: ["locations/777"] });
  context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  result = await runUeipGbpGateway({ context, request: request("gbp-location"), env: { ...env, GOOGLE_BUSINESS_PROFILE_LOCATION_ID: "locations/777" } });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "location_not_authorized");
  assert.equal(state.providerFetches(), 0);
  restore?.();

  state = runtime({ auditFailsAt: "completed" });
  context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  result = await runUeipGbpGateway({ context, request: request("gbp-quarantine"), env });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "completion_audit_failed");
  assert.equal(result.providerCalled, true);
  restore?.();

  state = runtime();
  context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  await runUeipGbpGateway({ context, request: request("gbp-cache"), env });
  await runUeipGbpGateway({ context, request: request("gbp-cache"), env });
  assert.equal(state.providerFetches(), 2);
});
