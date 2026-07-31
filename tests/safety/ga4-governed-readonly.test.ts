import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { executeGa4Read, UeipGa4AdapterError } from "@/lib/ueip-ga4-adapter";
import {
  createUeipExecutionContext,
  runUeipGa4Gateway,
  setUeipRuntimeDependenciesForTest,
} from "@/lib/ueip-runtime-gateway";

const propertyId = "123456789";
const scope = "https://www.googleapis.com/auth/analytics.readonly";
let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

function runtime(input: { tenantId?: string; auditFails?: boolean; auditFailsAt?: string; fetcher?: typeof fetch; environment?: "development" | "preview" | "production"; grantedScopes?: string[] } = {}) {
  const tenantId = input.tenantId ?? "tenant-a";
  const audits: Array<Record<string, unknown>> = [];
  let providerFetches = 0;
  const db = {
    connectorInstallationState: {
      async findUnique() {
        return {
          id: "ga4-installation-a",
          tenantId,
          connectorId: "google_analytics",
          installationState: "enabled",
          configurationState: "configured",
          authenticationState: "authenticated",
          sandboxMode: true,
          enabled: true,
          enableApprovalStatus: "approved",
          credentialReferenceId: "ga4-credential-a",
          requiredScopes: [scope],
          grantedScopes: input.grantedScopes ?? [scope],
          permissionValidation: { authorizedPropertyIds: [propertyId] },
        };
      },
    },
    connectorCredentialReference: {
      async findFirst() {
        return { id: "ga4-credential-a", tenantId, connectorId: "google_analytics", referenceKey: "ga4", secretStorageProvider: "environment", rawSecretStored: false, rawSecretRendered: false, expiresAt: null };
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
    return new Response(JSON.stringify({ rows: [{ dimensionValues: [{ value: "/moore" }], metricValues: [{ value: "12" }, { value: "8" }, { value: "20" }, { value: "0.5" }, { value: "2" }] }] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  restore = setUeipRuntimeDependenciesForTest({ db: db as never, fetcher: input.fetcher ?? defaultFetch, environment: input.environment ?? "preview" });
  return { audits, providerFetches: () => providerFetches };
}

function request(id: string) {
  return {
    connectorId: "google_analytics" as const,
    capabilityKey: "analytics.page.performance.read" as const,
    capabilityVersion: "1.0.0" as const,
    parameters: { propertyId, startDate: "2026-07-01", endDate: "2026-07-10", rowLimit: 10 },
    freshnessSeconds: 60,
    idempotencyKey: id,
  };
}

const env = { VERCEL_ENV: "preview", GOOGLE_OAUTH_CLIENT_ID: "client", GOOGLE_OAUTH_CLIENT_SECRET: "client-secret", GOOGLE_OAUTH_REFRESH_TOKEN: "refresh-secret", GOOGLE_ANALYTICS_PROPERTY_ID: propertyId } as NodeJS.ProcessEnv;

test("GA4 adapter validates request before provider access", async () => {
  let called = false;
  await assert.rejects(
    () => executeGa4Read({
      request: { capability: "analytics.page.performance.read", propertyId: "not-a-property", startDate: "2026-07-01", endDate: "2026-07-10" },
      credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" },
      fetcher: async () => { called = true; return new Response(); },
      now: new Date("2026-07-15T12:00:00.000Z"),
    }),
    (error: unknown) => error instanceof UeipGa4AdapterError && error.category === "invalid_request" && !error.providerAttempted,
  );
  assert.equal(called, false);
});

test("GA4 adapter normalizes bounded runReport page evidence", async () => {
  const responses = [
    new Response(JSON.stringify({ access_token: "token" }), { status: 200, headers: { "content-type": "application/json" } }),
    new Response(JSON.stringify({ rows: [{ dimensionValues: [{ value: "/edmond" }], metricValues: [{ value: "10" }, { value: "7" }, { value: "18" }, { value: "0.4" }, { value: "1" }] }] }), { status: 200, headers: { "content-type": "application/json" } }),
  ];
  const result = await executeGa4Read({ request: { capability: "analytics.page.performance.read", propertyId, startDate: "2026-07-01", endDate: "2026-07-10", rowLimit: 10 }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => responses.shift()!, now: new Date("2026-07-15T12:00:00.000Z") });
  assert.equal(result.contractVersion, "ueip-ga4-result-v1");
  assert.equal(result.capability, "analytics.page.performance.read");
  assert.equal(result.signals.sessions, 10);
  assert.equal(result.signals.keyEvents, 1);
  assert.equal((result.signals.pages as unknown[]).length, 1);
});

test("GA4 adapter handles empty rows as partial evidence", async () => {
  const responses = [
    new Response(JSON.stringify({ access_token: "token" }), { status: 200, headers: { "content-type": "application/json" } }),
    new Response(JSON.stringify({ rows: [] }), { status: 200, headers: { "content-type": "application/json" } }),
  ];
  const result = await executeGa4Read({ request: { capability: "analytics.traffic.read", propertyId, startDate: "2026-07-01", endDate: "2026-07-10" }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => responses.shift()!, now: new Date("2026-07-15T12:00:00.000Z") });
  assert.equal(result.reliability.status, "partial");
  assert.ok(result.dataGaps.some((gap) => /no rows/i.test(gap)));
});

test("GA4 adapter quota responses fail closed as rate-limited errors", async () => {
  const responses = [
    new Response(JSON.stringify({ access_token: "token" }), { status: 200, headers: { "content-type": "application/json" } }),
    new Response(JSON.stringify({ error: "quota" }), { status: 429, headers: { "content-type": "application/json" } }),
  ];
  await assert.rejects(
    () => executeGa4Read({ request: { capability: "analytics.traffic.read", propertyId, startDate: "2026-07-01", endDate: "2026-07-10" }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => responses.shift()!, now: new Date("2026-07-15T12:00:00.000Z") }),
    (error: unknown) => error instanceof UeipGa4AdapterError && error.category === "quota",
  );
});

test("Preview GA4 read passes through durable preflight, normalization, and completion evidence", async () => {
  const state = runtime();
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipGa4Gateway({ context, request: request("ga4-success"), env });
  assert.equal(result.ok, true);
  assert.equal(result.providerCalled, true);
  assert.equal(state.providerFetches(), 2);
  assert.deepEqual(state.audits.map((event) => event.stage), ["preflight_allowed", "credential_resolved", "completed"]);
  assert.equal(JSON.stringify(result).includes("secret-access-token"), false);
  assert.equal(JSON.stringify(state.audits).includes("client-secret"), false);
});

test("Development GA4 returns a fixture without credentials or provider calls", async () => {
  const state = runtime({ environment: "development" });
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipGa4Gateway({ context, request: request("ga4-development"), env: { NODE_ENV: "development" } });
  assert.equal(result.ok, true);
  assert.equal(result.providerCalled, false);
  assert.equal(state.providerFetches(), 0);
});

test("Production GA4 provider reads stay blocked before promotion", async () => {
  const state = runtime({ environment: "production" });
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipGa4Gateway({ context, request: request("ga4-production"), env: { ...env, VERCEL_ENV: "production", NODE_ENV: "production" } });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "production_pilot_blocked");
  assert.equal(state.providerFetches(), 0);
});

test("Missing GA4 readonly scope blocks before credential or provider access", async () => {
  const state = runtime({ grantedScopes: [] });
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipGa4Gateway({ context, request: request("ga4-scope"), env });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "credential_scope_insufficient");
  assert.equal(state.providerFetches(), 0);
});

test("GA4 completion audit failure quarantines normalized provider data", async () => {
  const state = runtime({ auditFailsAt: "completed" });
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipGa4Gateway({ context, request: request("ga4-quarantine"), env });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "completion_audit_failed");
  assert.equal(result.providerCalled, true);
  assert.equal(state.providerFetches(), 2);
});
