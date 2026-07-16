import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { createSessionToken, verifySessionToken } from "@/lib/auth";
import {
  createUeipExecutionContext,
  runUeipSearchConsoleGateway,
  setUeipRuntimeDependenciesForTest,
} from "@/lib/ueip-runtime-gateway";
import { executeSearchConsoleRead, UeipSearchConsoleAdapterError } from "@/lib/ueip-search-console-adapter";

process.env.ADMIN_EMAIL ||= "admin@example.com";
process.env.ADMIN_PASSWORD ||= "test-password-12345";
process.env.AUTH_SECRET ||= "test-auth-secret-for-ueip-runtime-gateway-coverage";

const siteUrl = "https://example.com/";
const scope = "https://www.googleapis.com/auth/webmasters.readonly";
let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

function runtime(input: { tenantId?: string; auditFails?: boolean; auditFailsAt?: string; fetcher?: typeof fetch; environment?: "development" | "preview" | "production" } = {}) {
  const tenantId = input.tenantId ?? "tenant-a";
  const audits: Array<Record<string, unknown>> = [];
  let providerFetches = 0;
  const db = {
    connectorInstallationState: {
      async findUnique() {
        return {
          id: "installation-a",
          tenantId,
          connectorId: "google_search_console",
          installationState: "enabled",
          configurationState: "configured",
          authenticationState: "authenticated",
          sandboxMode: true,
          enabled: true,
          enableApprovalStatus: "approved",
          credentialReferenceId: "credential-a",
          requiredScopes: [scope],
          grantedScopes: [scope],
          permissionValidation: { authorizedSiteUrls: [siteUrl] },
        };
      },
    },
    connectorCredentialReference: {
      async findFirst() {
        return { id: "credential-a", tenantId, connectorId: "google_search_console", referenceKey: "search-console", secretStorageProvider: "environment", rawSecretStored: false, rawSecretRendered: false, expiresAt: null };
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
    return new Response(JSON.stringify({ rows: [{ keys: ["https://example.com/page"], clicks: 2, impressions: 20, ctr: 0.1, position: 3 }] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  restore = setUeipRuntimeDependenciesForTest({ db: db as never, fetcher: input.fetcher ?? defaultFetch, environment: input.environment ?? "preview" });
  return { audits, providerFetches: () => providerFetches };
}

function request(id: string) {
  return {
    connectorId: "google_search_console" as const,
    capabilityKey: "seo.page.performance.read" as const,
    capabilityVersion: "1.0.0" as const,
    parameters: { siteUrl, startDate: "2026-07-01", endDate: "2026-07-10", rowLimit: 10 },
    freshnessSeconds: 60,
    idempotencyKey: id,
  };
}

const env = { VERCEL_ENV: "preview", GOOGLE_OAUTH_CLIENT_ID: "client", GOOGLE_OAUTH_CLIENT_SECRET: "client-secret", GOOGLE_OAUTH_REFRESH_TOKEN: "refresh-secret" } as NodeJS.ProcessEnv;

test("signed sessions carry tenant and actor identity while legacy defaults remain safe", async () => {
  const token = await createSessionToken("admin@example.com", { tenantId: "tenant-a", actorId: "actor-a" });
  const session = await verifySessionToken(token);
  assert.equal(session?.tenantId, "tenant-a");
  assert.equal(session?.actorId, "actor-a");
  assert.equal(session?.sessionVersion, 1);
});

test("Preview Search Console read passes through durable preflight, normalization, and completion evidence", async () => {
  const state = runtime();
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipSearchConsoleGateway({ context, request: request("success"), env });

  assert.equal(result.ok, true);
  assert.equal(result.providerCalled, true);
  assert.equal(state.providerFetches(), 2);
  assert.deepEqual(state.audits.map((event) => event.stage), ["preflight_allowed", "credential_resolved", "completed"]);
  assert.equal(JSON.stringify(result).includes("secret-access-token"), false);
  assert.equal(JSON.stringify(state.audits).includes("client-secret"), false);
});

test("cross-tenant installation fails closed before credential or provider access", async () => {
  const state = runtime({ tenantId: "tenant-b" });
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipSearchConsoleGateway({ context, request: request("cross-tenant"), env });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "installation_not_found");
  assert.equal(state.providerFetches(), 0);
});

test("preflight audit failure blocks credential resolution and provider access", async () => {
  const state = runtime({ auditFails: true });
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipSearchConsoleGateway({ context, request: request("audit-fail"), env });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "audit_unavailable");
  assert.equal(result.auditStatus, "failed");
  assert.equal(state.providerFetches(), 0);
});

test("Production pilot is blocked even when the caller supplies otherwise-valid installation data", async () => {
  const state = runtime({ environment: "production" });
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipSearchConsoleGateway({ context, request: request("production"), env: { ...env, VERCEL_ENV: "production", NODE_ENV: "production" } });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "production_pilot_blocked");
  assert.equal(state.providerFetches(), 0);
});

test("Development returns a fixture without resolving credentials or calling the provider", async () => {
  const state = runtime({ environment: "development" });
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipSearchConsoleGateway({ context, request: request("development"), env: { NODE_ENV: "development" } });
  assert.equal(result.ok, true);
  assert.equal(result.providerCalled, false);
  assert.equal(state.providerFetches(), 0);
  if (result.ok) assert.equal(result.result.sourceLabel, "ueip:search_console:development_fixture");
});

test("freshness cache reuses one governed result instead of multiplying provider calls", async () => {
  const state = runtime();
  const firstContext = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const secondContext = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const first = await runUeipSearchConsoleGateway({ context: firstContext, request: request("cached"), env });
  const second = await runUeipSearchConsoleGateway({ context: secondContext, request: request("cached"), env });
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(state.providerFetches(), 2);
});

test("quota responses become governed rate-limited data gaps", async () => {
  let calls = 0;
  runtime({ fetcher: async (url) => {
    calls += 1;
    if (String(url).includes("oauth2.googleapis.com")) return new Response(JSON.stringify({ access_token: "access" }), { status: 200, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ error: "quota" }), { status: 429, headers: { "content-type": "application/json" } });
  } });
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipSearchConsoleGateway({ context, request: request("quota"), env });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "quota");
  assert.equal(result.healthStatus, "rate_limited");
  assert.equal(calls, 2);
});

test("a successful provider response is quarantined when completion evidence fails", async () => {
  const state = runtime({ auditFailsAt: "completed" });
  const context = createUeipExecutionContext({ tenantId: "tenant-a", actorId: "admin-a", businessModule: "real_estate", requestOrigin: "test" });
  const result = await runUeipSearchConsoleGateway({ context, request: request("quarantine"), env });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "completion_audit_failed");
  assert.equal(result.providerCalled, true);
  assert.equal(result.auditStatus, "failed");
  assert.equal(state.providerFetches(), 2);
});

test("certified adapter enforces timeout before admitting provider data", async () => {
  const fetcher: typeof fetch = async (_url, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
  });
  await assert.rejects(
    executeSearchConsoleRead({
      request: { capability: "seo.page.performance.read", siteUrl, startDate: "2026-07-01", endDate: "2026-07-10" },
      credentials: { clientId: "client", clientSecret: "secret", refreshToken: "refresh" },
      fetcher,
      timeoutMs: 5,
    }),
    (error: unknown) => error instanceof UeipSearchConsoleAdapterError && error.category === "timeout",
  );
});

test("certified adapter retries one transient read failure and validates the normalized schema", async () => {
  let calls = 0;
  const fetcher: typeof fetch = async (url) => {
    calls += 1;
    if (String(url).includes("oauth2.googleapis.com")) return new Response(JSON.stringify({ access_token: "access" }), { status: 200, headers: { "content-type": "application/json" } });
    if (calls === 2) return new Response(JSON.stringify({ error: "transient" }), { status: 503, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ rows: [] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const result = await executeSearchConsoleRead({
    request: { capability: "seo.page.performance.read", siteUrl, startDate: "2026-07-01", endDate: "2026-07-10" },
    credentials: { clientId: "client", clientSecret: "secret", refreshToken: "refresh" },
    fetcher,
    maxRetries: 1,
  });
  assert.equal(calls, 3);
  assert.equal(result.reliability.attempts, 2);
  assert.equal(result.contractVersion, "ueip-search-console-result-v1");
});
