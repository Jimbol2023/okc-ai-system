import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { authorizeGoogleReadOnlyPreview, configureGoogleReadOnlyPreview, getGoogleReadOnlyPreviewReadiness, googleReadOnlyPreviewConfirmations, reconcileGoogleReadOnlyPreviewEvidence, runGoogleReadOnlyPreview, setGoogleReadOnlyPreviewBusinessSyncForTest, setGoogleReadOnlyPreviewDbForTest, setGoogleReadOnlyPreviewEnabled, setGoogleReadOnlyPreviewIdentityDiagnosisForTest } from "@/lib/ueip-google-readonly-preview";

const actor = { tenantId: "tenant-alpha", actorId: "admin" };
const env = {
  VERCEL_ENV: "preview",
  UEIP_PREVIEW_ENVIRONMENT_ID: "preview-certified",
  UEIP_PREVIEW_DATABASE_FINGERPRINT: "preview-fingerprint",
  UEIP_PRODUCTION_DATABASE_FINGERPRINT: "production-fingerprint",
  GOOGLE_OAUTH_CLIENT_ID: "client",
  GOOGLE_OAUTH_CLIENT_SECRET: "secret",
  GOOGLE_OAUTH_REFRESH_TOKEN: "refresh",
  GOOGLE_ANALYTICS_PROPERTY_ID: "123456789",
  GOOGLE_OAUTH_GRANTED_SCOPES: [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/calendar.events.readonly",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/analytics.readonly",
  ].join(" "),
} as NodeJS.ProcessEnv;

const restores: Array<() => void> = [];
afterEach(() => { while (restores.length) restores.pop()?.(); });

function stateDb() {
  let identity = { environmentId: "preview-certified", environmentType: "preview", databaseFingerprint: "preview-fingerprint", productionProhibited: true };
  const installations: Array<Record<string, unknown>> = [];
  const credentials: Array<Record<string, unknown>> = [];
  const authorizations: Array<Record<string, unknown>> = [];
  const controls: Array<Record<string, unknown>> = [];
  const audits: Array<Record<string, unknown>> = [];
  const snapshots: Array<Record<string, unknown>> = [];
  const db: Record<string, unknown> = {};
  Object.assign(db, {
    async $transaction(input: unknown) { return Array.isArray(input) ? Promise.all(input) : (input as (tx: unknown) => Promise<unknown>)(db); },
    ueipEnvironmentIdentity: {
      async findUnique() { return identity; },
      async upsert(args: { create: typeof identity; update: Partial<typeof identity> }) { identity = { ...identity, ...args.create, ...args.update }; return identity; },
    },
    enterpriseConnectorRegistry: { async upsert(args: { create: Record<string, unknown> }) { return args.create; } },
    connectorCredentialReference: { async upsert(args: { create: Record<string, unknown> }) { const existing = credentials.find((item) => item.referenceKey === args.create.referenceKey); if (existing) return existing; const item = { id: `credential-${credentials.length + 1}`, ...args.create }; credentials.push(item); return item; } },
    connectorInstallationState: {
      async upsert(args: { create: Record<string, unknown>; update: Record<string, unknown> }) { const existing = installations.find((item) => item.connectorId === args.create.connectorId && item.tenantId === args.create.tenantId); if (existing) { Object.assign(existing, args.update); return existing; } const item = { id: `installation-${installations.length + 1}`, ...args.create }; installations.push(item); return item; },
      async findMany(args: { where: { tenantId: string } }) { return installations.filter((item) => item.tenantId === args.where.tenantId); },
      async update(args: { where: { tenantId_connectorId: { tenantId: string; connectorId: string } }; data: Record<string, unknown> }) { const item = installations.find((candidate) => candidate.tenantId === args.where.tenantId_connectorId.tenantId && candidate.connectorId === args.where.tenantId_connectorId.connectorId)!; Object.assign(item, args.data); return item; },
    },
    ueipPilotControlEvent: {
      async findFirst(args: { where: { eventType: string } }) { return controls.find((item) => item.eventType === args.where.eventType) ?? null; },
      async create(args: { data: Record<string, unknown> }) { controls.push(args.data); return args.data; },
    },
    ueipPilotAuthorization: {
      async create(args: { data: Record<string, unknown> }) { const item = { id: `authorization-${authorizations.length + 1}`, consumedAt: null, createdAt: new Date(), ...args.data }; authorizations.push(item); return item; },
      async findUnique(args: { where: { nonceHash: string } }) { return authorizations.find((item) => item.nonceHash === args.where.nonceHash) ?? null; },
      async findFirst(args: { where: { connectorId: string } }) { return [...authorizations].reverse().find((item) => item.connectorId === args.where.connectorId) ?? null; },
      async update(args: { where: { id: string }; data: Record<string, unknown> }) { const item = authorizations.find((candidate) => candidate.id === args.where.id)!; Object.assign(item, args.data); return item; },
    },
    ueipGatewayAuditEvent: { async findMany(args: { where: { connectorId: string } }) { return audits.filter((item) => item.connectorId === args.where.connectorId); } },
    businessDataSnapshot: { async findFirst(args: { where: { connectorId: string; traceId: string } }) { return snapshots.find((item) => item.connectorId === args.where.connectorId && item.traceId === args.where.traceId) ?? null; } },
  });
  return { db, installations, authorizations, controls, audits, snapshots };
}

function useCertifiedIdentity() {
  restores.push(setGoogleReadOnlyPreviewIdentityDiagnosisForTest(async () => ({
    classification: "PREVIEW_DATABASE_IDENTITY_CERTIFIED",
  } as never)));
}

test("Preview guard blocks Production, shared fingerprints, and missing scopes before writes", async () => {
  useCertifiedIdentity();
  const state = stateDb();
  restores.push(setGoogleReadOnlyPreviewDbForTest(state.db as never));
  for (const invalidEnv of [{ ...env, VERCEL_ENV: "production" }, { ...env, UEIP_PRODUCTION_DATABASE_FINGERPRINT: "preview-fingerprint" }, { ...env, GOOGLE_OAUTH_GRANTED_SCOPES: "https://www.googleapis.com/auth/gmail.readonly" }]) {
    const result = await configureGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.configure, env: invalidEnv as NodeJS.ProcessEnv });
    assert.equal(result.status, "blocked");
  }
  assert.equal(state.installations.length, 0);
});

test("configuration is tenant scoped, additive, idempotent, and records rollback controls", async () => {
  useCertifiedIdentity();
  const state = stateDb();
  restores.push(setGoogleReadOnlyPreviewDbForTest(state.db as never));
  await configureGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.configure, env });
  await configureGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.configure, env });
  assert.equal(state.installations.length, 4);
  assert.ok(state.installations.every((item) => item.tenantId === actor.tenantId && item.liveExecutionAllowed === false && item.providerCalled === false));
  assert.ok(state.controls.every((item) => item.providerCalled === false && item.liveExecutionAllowed === false));
  assert.equal((await getGoogleReadOnlyPreviewReadiness({ actor, env })).status, "ready");
});

test("bundle authorization creates one single-use authorization per connector without storing the raw nonce", async () => {
  useCertifiedIdentity();
  const state = stateDb();
  restores.push(setGoogleReadOnlyPreviewDbForTest(state.db as never));
  await configureGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.configure, env });
  const result = await authorizeGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.authorize, env });
  assert.equal(result.status, "authorized");
  if (result.status !== "authorized") return;
  assert.equal(state.authorizations.length, 4);
  assert.ok(state.authorizations.every((item) => item.maximumProviderCalls === 1 && item.providerCallCount === 0));
  assert.equal(JSON.stringify(state.authorizations).includes(result.nonce), false);
});

test("disable and restore affect only the authenticated tenant installations", async () => {
  useCertifiedIdentity();
  const state = stateDb();
  restores.push(setGoogleReadOnlyPreviewDbForTest(state.db as never));
  await configureGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.configure, env });
  await setGoogleReadOnlyPreviewEnabled({ actor, confirmation: googleReadOnlyPreviewConfirmations.disable, action: "disable", env });
  assert.ok(state.installations.every((item) => item.enabled === false));
  await setGoogleReadOnlyPreviewEnabled({ actor, confirmation: googleReadOnlyPreviewConfirmations.restore, action: "restore", env });
  assert.ok(state.installations.every((item) => item.enabled === true));
});

test("existing provider reads reconcile from gateway audits without another provider call", async () => {
  useCertifiedIdentity();
  const state = stateDb();
  restores.push(setGoogleReadOnlyPreviewDbForTest(state.db as never));
  await configureGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.configure, env });
  const createdAt = new Date("2026-08-07T03:59:38.000Z");
  for (const connectorId of ["gmail", "google_calendar", "google_drive", "google_analytics"]) {
    state.authorizations.push({ id: `existing-${connectorId}`, tenantId: actor.tenantId, connectorId, environment: "preview", status: "consumed", providerCallCount: 0, createdAt });
    state.audits.push({ connectorId, tenantId: actor.tenantId, environment: "preview", traceId: "trace-existing", stage: "completed", decision: "completed", providerCalled: true, auditComplete: true, createdAt: new Date(createdAt.getTime() + 1000) });
  }
  for (const connectorId of ["gmail", "google_calendar", "google_drive"]) {
    state.snapshots.push({ id: `snapshot-${connectorId}`, tenantId: actor.tenantId, connectorId, traceId: "trace-existing", status: "data_gap", providerCalled: true, evidenceHash: "hash", updatedAt: new Date() });
  }

  const result = await reconcileGoogleReadOnlyPreviewEvidence({ actor, confirmation: googleReadOnlyPreviewConfirmations.reconcile, env });
  assert.equal(result.status, "quarantined");
  assert.equal(result.newProviderCallMade, false);
  assert.equal(result.providerCallOccurredPreviously, true);
  assert.equal(result.outcomes.length, 4);
  assert.ok(result.outcomes.every((outcome) => outcome.providerCallCount === 1 && outcome.status === "quarantined"));
  assert.ok(state.authorizations.every((item) => item.providerCallCount === 1));
  assert.ok(state.controls.every((item) => item.liveExecutionAllowed === false));
});

test("partial-run failure reports audit-derived calls and reconciles before returning", async () => {
  useCertifiedIdentity();
  const state = stateDb();
  restores.push(setGoogleReadOnlyPreviewDbForTest(state.db as never));
  restores.push(setGoogleReadOnlyPreviewBusinessSyncForTest(async () => { throw new Error("mock_snapshot_persistence_failure"); }));
  await configureGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.configure, env });
  const authorization = await authorizeGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.authorize, env });
  assert.equal(authorization.status, "authorized");
  if (authorization.status !== "authorized") return;
  for (const connectorId of ["gmail", "google_calendar", "google_drive", "google_analytics"]) {
    state.audits.push({ connectorId, tenantId: actor.tenantId, environment: "preview", traceId: "trace-partial", stage: "completed", decision: "completed", providerCalled: true, auditComplete: true, createdAt: new Date() });
  }

  const result = await runGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.read, nonce: authorization.nonce, env });
  assert.equal(result.status, "quarantined");
  assert.deepEqual(result.reasonCodes, ["business_snapshot_or_brief_persistence_failed"]);
  assert.equal(result.providerCalled, true);
  assert.equal(result.newProviderCallMade, true);
  assert.ok(result.outcomes.every((outcome) => outcome.providerCallCount === 1 && outcome.status === "quarantined"));
});
