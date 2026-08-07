import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { executeGoogleWorkspaceRead, UeipGoogleWorkspaceAdapterError } from "@/lib/ueip-google-workspace-adapter";
import { createUeipExecutionContext, runUeipGoogleWorkspaceGateway, setUeipRuntimeDependenciesForTest } from "@/lib/ueip-runtime-gateway";

const scopes = {
  gmail: "https://www.googleapis.com/auth/gmail.readonly",
  google_calendar: "https://www.googleapis.com/auth/calendar.events.readonly",
  google_drive: "https://www.googleapis.com/auth/drive.metadata.readonly",
} as const;

const env = { VERCEL_ENV: "preview", GOOGLE_OAUTH_CLIENT_ID: "client", GOOGLE_OAUTH_CLIENT_SECRET: "secret", GOOGLE_OAUTH_REFRESH_TOKEN: "refresh" } as NodeJS.ProcessEnv;
let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

function gatewayRuntime(input: { connectorId?: keyof typeof scopes; tenantId?: string; grantedScopes?: string[]; environment?: "development" | "preview" | "production"; auditFailsAt?: string } = {}) {
  const connectorId = input.connectorId ?? "gmail";
  const tenantId = input.tenantId ?? "tenant-alpha";
  const audits: Array<Record<string, unknown>> = [];
  let fetches = 0;
  const db = {
    connectorInstallationState: {
      async findUnique(args: { where: { tenantId_connectorId: { tenantId: string; connectorId: string } } }) {
        if (args.where.tenantId_connectorId.tenantId !== tenantId || args.where.tenantId_connectorId.connectorId !== connectorId) return null;
        return { id: `${connectorId}-installation`, tenantId, connectorId, installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", sandboxMode: true, enabled: true, enableApprovalStatus: "approved", credentialReferenceId: `${connectorId}-credential`, requiredScopes: [scopes[connectorId]], grantedScopes: input.grantedScopes ?? [scopes[connectorId]], permissionValidation: { quotaPerMinute: 20, circuitState: "closed", previewOnly: true } };
      },
    },
    connectorCredentialReference: {
      async findFirst(args: { where: { id: string; tenantId: string; connectorId: string } }) {
        if (args.where.tenantId !== tenantId || args.where.connectorId !== connectorId) return null;
        return { id: `${connectorId}-credential`, tenantId, connectorId, referenceKey: connectorId, secretStorageProvider: "environment", rawSecretStored: false, rawSecretRendered: false, expiresAt: null };
      },
    },
    ueipGatewayAuditEvent: {
      async findFirst() { return audits.length ? { sequenceNumber: audits.length, eventDigest: audits.at(-1)?.eventDigest } : null; },
      async create(args: { data: Record<string, unknown> }) {
        if (args.data.stage === input.auditFailsAt) throw new Error("audit unavailable");
        audits.push(args.data);
        return { id: `audit-${audits.length}` };
      },
    },
    enterpriseConnectorHealthEvent: { async create() { return {}; } },
  };
  const fetcher: typeof fetch = async (url) => {
    fetches += 1;
    if (String(url).includes("oauth2.googleapis.com")) return new Response(JSON.stringify({ access_token: "access" }), { status: 200, headers: { "content-type": "application/json" } });
    if (connectorId === "gmail" && String(url).includes("/messages?") ) return new Response(JSON.stringify({ messages: [{ id: "message-1" }] }), { status: 200, headers: { "content-type": "application/json" } });
    if (connectorId === "gmail") return new Response(JSON.stringify({ id: "message-1", snippet: "seller property question", payload: { headers: [{ name: "From", value: "seller@example.com" }, { name: "Subject", value: "Property" }, { name: "Date", value: "today" }] } }), { status: 200, headers: { "content-type": "application/json" } });
    if (connectorId === "google_calendar") return new Response(JSON.stringify({ items: [{ id: "event-1", summary: "Property review", start: { dateTime: "2026-08-06T17:00:00.000Z" }, end: { dateTime: "2026-08-06T18:00:00.000Z" } }] }), { status: 200, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ files: [{ id: "file-1", name: "Acquisition notes", mimeType: "application/pdf", modifiedTime: "2026-08-06T12:00:00.000Z" }] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  restore = setUeipRuntimeDependenciesForTest({ db: db as never, fetcher, environment: input.environment ?? "preview" });
  return { audits, fetches: () => fetches };
}

function workspaceRequest(connectorId: keyof typeof scopes) {
  const capabilityKey = connectorId === "gmail" ? "gmail.inbox.metadata.read" as const : connectorId === "google_calendar" ? "calendar.events.read" as const : "drive.metadata.read" as const;
  return { connectorId, capabilityKey, capabilityVersion: "1.0.0" as const, parameters: { observationStart: "2026-08-05T00:00:00.000Z", observationEnd: "2026-08-06T23:00:00.000Z", rowLimit: 5 }, freshnessSeconds: 60, idempotencyKey: `${connectorId}-read` };
}

test("Workspace adapter validates before OAuth or provider access", async () => {
  let called = false;
  await assert.rejects(() => executeGoogleWorkspaceRead({ request: { capability: "gmail.inbox.metadata.read", observationStart: "invalid", observationEnd: "invalid" }, credentials: { clientId: "x", clientSecret: "y", refreshToken: "z" }, fetcher: async () => { called = true; return new Response(); } }), (error: unknown) => error instanceof UeipGoogleWorkspaceAdapterError && error.category === "invalid_request" && !error.providerAttempted);
  assert.equal(called, false);
});

for (const connectorId of Object.keys(scopes) as Array<keyof typeof scopes>) {
  test(`${connectorId} executes through tenant, scope, audit, normalization, and health gates`, async () => {
    const runtime = gatewayRuntime({ connectorId });
    const context = createUeipExecutionContext({ tenantId: "tenant-alpha", actorId: "admin", businessModule: "ai_core", requestOrigin: "test" });
    const result = await runUeipGoogleWorkspaceGateway({ context, request: workspaceRequest(connectorId), env });
    assert.equal(result.ok, true);
    assert.equal(result.providerCalled, true);
    assert.deepEqual(runtime.audits.map((event) => event.stage), ["preflight_allowed", "credential_resolved", "completed"]);
    assert.ok(runtime.fetches() >= 2);
    assert.equal(JSON.stringify(runtime.audits).includes("access"), false);
    assert.equal(result.liveExecutionAllowed, false);
  });
}

test("cross-tenant Workspace lookup fails closed before provider access", async () => {
  const runtime = gatewayRuntime({ connectorId: "gmail", tenantId: "tenant-alpha" });
  const context = createUeipExecutionContext({ tenantId: "tenant-beta", actorId: "admin", businessModule: "ai_core", requestOrigin: "test" });
  const result = await runUeipGoogleWorkspaceGateway({ context, request: workspaceRequest("gmail"), env });
  assert.equal(result.ok, false);
  assert.equal(result.providerCalled, false);
  assert.equal(runtime.fetches(), 0);
});

test("missing connector-specific scope blocks before credential or provider access", async () => {
  const runtime = gatewayRuntime({ connectorId: "google_drive", grantedScopes: [] });
  const context = createUeipExecutionContext({ tenantId: "tenant-alpha", actorId: "admin", businessModule: "ai_core", requestOrigin: "test" });
  const result = await runUeipGoogleWorkspaceGateway({ context, request: workspaceRequest("google_drive"), env });
  assert.equal(result.ok, false);
  assert.equal(result.providerCalled, false);
  assert.equal(runtime.fetches(), 0);
});

test("concurrent Workspace retries share one governed invocation", async () => {
  const runtime = gatewayRuntime({ connectorId: "google_calendar" });
  const context = createUeipExecutionContext({ tenantId: "tenant-alpha", actorId: "admin", businessModule: "ai_core", requestOrigin: "test" });
  const [first, second] = await Promise.all([runUeipGoogleWorkspaceGateway({ context, request: workspaceRequest("google_calendar"), env }), runUeipGoogleWorkspaceGateway({ context, request: workspaceRequest("google_calendar"), env })]);
  assert.equal(first.traceId, second.traceId);
  assert.equal(runtime.audits.filter((event) => event.stage === "completed").length, 1);
  assert.equal(runtime.fetches(), 2);
});

test("completion audit failure quarantines Workspace evidence", async () => {
  const runtime = gatewayRuntime({ connectorId: "google_drive", auditFailsAt: "completed" });
  const context = createUeipExecutionContext({ tenantId: "tenant-alpha", actorId: "admin", businessModule: "ai_core", requestOrigin: "test" });
  const result = await runUeipGoogleWorkspaceGateway({ context, request: workspaceRequest("google_drive"), env });
  assert.equal(result.ok, false);
  assert.equal(result.providerCalled, true);
  assert.equal(result.auditStatus, "failed");
  assert.equal(runtime.fetches(), 2);
});

test("Production Workspace provider reads are blocked", async () => {
  const runtime = gatewayRuntime({ connectorId: "gmail", environment: "production" });
  const context = createUeipExecutionContext({ tenantId: "tenant-alpha", actorId: "admin", businessModule: "ai_core", requestOrigin: "test" });
  const result = await runUeipGoogleWorkspaceGateway({ context, request: workspaceRequest("gmail"), env: { ...env, VERCEL_ENV: "production", NODE_ENV: "production" } });
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "production_pilot_blocked");
  assert.equal(runtime.fetches(), 0);
});
