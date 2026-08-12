import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { authorizeTwilioDiagnosticPreview, getTwilioDiagnosticReadiness, runTwilioDiagnosticPreviewRead, setTwilioDiagnosticDependenciesForTest, twilioDiagnosticSafety, twilioPreviewAuthorizationPhrase, twilioPreviewReadPhrase } from "@/lib/twilio-diagnostic-connector";

const actor = { tenantId: "default", actorId: "ceo@test" };
const previewEnv = { VERCEL_ENV: "preview", TWILIO_DIAGNOSTIC_ENABLED: "true", TWILIO_DIAGNOSTIC_TENANT_ID: "default", TWILIO_DIAGNOSTIC_ACCOUNT_SID: `AC${"a".repeat(32)}`, TWILIO_DIAGNOSTIC_API_KEY_SID: `SK${"b".repeat(32)}`, TWILIO_DIAGNOSTIC_API_KEY_SECRET: "restricted-test-secret" } as NodeJS.ProcessEnv;
const restores: Array<() => void> = [];
afterEach(() => { while (restores.length) restores.pop()?.(); });

function fakeDb() {
  const authorizations = new Map<string, Record<string, unknown>>();
  const audits: Array<Record<string, unknown>> = [];
  let createdNonceHash = "";
  return {
    state: { authorizations, audits, get nonceHash() { return createdNonceHash; } },
    connectorInstallationState: { async findUnique() { return { installationState: "enabled", configurationState: "configured", authenticationState: "authenticated", enabled: true, enableApprovalStatus: "approved", requiredScopes: ["twilio/read"], grantedScopes: ["twilio/read"], providerCalled: false, liveExecutionAllowed: false }; } },
    connectorCredentialReference: { async findFirst(args: { where: { tenantId: string } }) { return args.where.tenantId === "default" ? { id: "credential-ref" } : null; } },
    ueipPilotAuthorization: {
      async create(args: { data: Record<string, unknown> }) { createdNonceHash = String(args.data.nonceHash); const value = { id: "authorization-1", ...args.data, consumedAt: null, providerCallCount: 0, traceId: null }; authorizations.set(createdNonceHash, value); return value; },
      async findUnique(args: { where: { nonceHash: string } }) { return authorizations.get(args.where.nonceHash) ?? null; },
      async updateMany(args: { where: { nonceHash: string; tenantId: string }; data: Record<string, unknown> }) { const value = authorizations.get(args.where.nonceHash); if (!value || value.consumedAt || value.tenantId !== args.where.tenantId) return { count: 0 }; Object.assign(value, args.data); return { count: 1 }; },
      async update(args: { where: { nonceHash: string }; data: Record<string, unknown> }) { const value = authorizations.get(args.where.nonceHash)!; Object.assign(value, args.data); return value; },
    },
    ueipGatewayAuditEvent: {
      async findFirst(args: { where: { traceId: string } }) { return audits.filter(item => item.traceId === args.where.traceId).at(-1) ?? null; },
      async create(args: { data: Record<string, unknown> }) { audits.push(args.data); return args.data; },
    },
    enterpriseConnectorHealthEvent: { async create(args: { data: Record<string, unknown> }) { return args.data; } },
    businessDataSnapshot: { async create(args: { data: Record<string, unknown> }) { return args.data; } },
  };
}

describe("Twilio diagnostic governance", () => {
  it("blocks Production provider reads before network", async () => {
    const data = fakeDb(); let calls = 0;
    restores.push(setTwilioDiagnosticDependenciesForTest({ db: data as never, fetcher: async () => { calls += 1; return new Response("{}"); } }));
    const readiness = await getTwilioDiagnosticReadiness(actor, { ...previewEnv, VERCEL_ENV: "production" });
    assert.equal(readiness.status, "blocked");
    const result = await runTwilioDiagnosticPreviewRead({ actor, capability: "get_twilio_account_identity", confirmation: twilioPreviewReadPhrase, nonce: "x", env: { ...previewEnv, VERCEL_ENV: "production" } });
    assert.equal(result.status, "blocked"); assert.equal(calls, 0);
  });

  it("derives tenant from the actor and blocks a configured-tenant mismatch", async () => {
    const data = fakeDb(); restores.push(setTwilioDiagnosticDependenciesForTest({ db: data as never }));
    const readiness = await getTwilioDiagnosticReadiness({ tenantId: "tenant-other", actorId: "actor" }, previewEnv);
    assert.equal(readiness.tenantId, "tenant-other");
    assert.ok(readiness.reasonCodes.includes("diagnostic_tenant_mismatch"));
  });

  it("requires exact authorization and enforces one provider read", async () => {
    const data = fakeDb(); let calls = 0;
    restores.push(setTwilioDiagnosticDependenciesForTest({ db: data as never, fetcher: async () => { calls += 1; return new Response(JSON.stringify({ sid: previewEnv.TWILIO_DIAGNOSTIC_ACCOUNT_SID, type: "Trial", status: "active", auth_token: "must-not-escape" }), { status: 200 }); } }));
    const denied = await authorizeTwilioDiagnosticPreview({ actor, capability: "get_twilio_account_identity", confirmation: "wrong", env: previewEnv });
    assert.equal(denied.status, "blocked");
    const authorization = await authorizeTwilioDiagnosticPreview({ actor, capability: "get_twilio_account_identity", confirmation: twilioPreviewAuthorizationPhrase, env: previewEnv });
    assert.equal(authorization.status, "authorized");
    if (authorization.status !== "authorized") return;
    const result = await runTwilioDiagnosticPreviewRead({ actor, capability: "get_twilio_account_identity", confirmation: twilioPreviewReadPhrase, nonce: authorization.nonce, env: previewEnv });
    assert.equal(result.status, "completed"); assert.equal(calls, 1);
    assert.doesNotMatch(JSON.stringify(result), /must-not-escape|restricted-test-secret/);
    assert.deepEqual({ providerWrite: result.providerWrite, sent: result.sent, published: result.published, outreach: result.outreach, scraping: result.scraping, crmMutation: result.crmMutation, externalExecutionAllowed: result.externalExecutionAllowed, liveExecutionAllowed: result.liveExecutionAllowed }, twilioDiagnosticSafety);
    const replay = await runTwilioDiagnosticPreviewRead({ actor, capability: "get_twilio_account_identity", confirmation: twilioPreviewReadPhrase, nonce: authorization.nonce, env: previewEnv });
    assert.equal(replay.status, "locked"); assert.equal(calls, 1);
  });
});
