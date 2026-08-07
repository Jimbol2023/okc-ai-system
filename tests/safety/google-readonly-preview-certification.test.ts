import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { authorizeGoogleReadOnlyPreview, configureGoogleReadOnlyPreview, getGoogleReadOnlyPreviewReadiness, googleReadOnlyPreviewConfirmations, setGoogleReadOnlyPreviewDbForTest, setGoogleReadOnlyPreviewEnabled } from "@/lib/ueip-google-readonly-preview";

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
  const installations: Array<Record<string, unknown>> = [];
  const credentials: Array<Record<string, unknown>> = [];
  const authorizations: Array<Record<string, unknown>> = [];
  const controls: Array<Record<string, unknown>> = [];
  const db: Record<string, unknown> = {};
  Object.assign(db, {
    async $transaction(input: unknown) { return Array.isArray(input) ? Promise.all(input) : (input as (tx: unknown) => Promise<unknown>)(db); },
    ueipEnvironmentIdentity: { async findUnique() { return { environmentId: "preview-certified", environmentType: "preview", databaseFingerprint: "preview-fingerprint", productionProhibited: true }; } },
    connectorCredentialReference: { async upsert(args: { create: Record<string, unknown> }) { const existing = credentials.find((item) => item.referenceKey === args.create.referenceKey); if (existing) return existing; const item = { id: `credential-${credentials.length + 1}`, ...args.create }; credentials.push(item); return item; } },
    connectorInstallationState: {
      async upsert(args: { create: Record<string, unknown>; update: Record<string, unknown> }) { const existing = installations.find((item) => item.connectorId === args.create.connectorId && item.tenantId === args.create.tenantId); if (existing) { Object.assign(existing, args.update); return existing; } const item = { id: `installation-${installations.length + 1}`, ...args.create }; installations.push(item); return item; },
      async findMany(args: { where: { tenantId: string } }) { return installations.filter((item) => item.tenantId === args.where.tenantId); },
      async update(args: { where: { tenantId_connectorId: { tenantId: string; connectorId: string } }; data: Record<string, unknown> }) { const item = installations.find((candidate) => candidate.tenantId === args.where.tenantId_connectorId.tenantId && candidate.connectorId === args.where.tenantId_connectorId.connectorId)!; Object.assign(item, args.data); return item; },
    },
    ueipPilotControlEvent: { async create(args: { data: Record<string, unknown> }) { controls.push(args.data); return args.data; } },
    ueipPilotAuthorization: { async create(args: { data: Record<string, unknown> }) { const item = { id: `authorization-${authorizations.length + 1}`, consumedAt: null, ...args.data }; authorizations.push(item); return item; } },
  });
  return { db, installations, authorizations, controls };
}

test("Preview guard blocks Production, shared fingerprints, and missing scopes before writes", async () => {
  const state = stateDb();
  restores.push(setGoogleReadOnlyPreviewDbForTest(state.db as never));
  for (const invalidEnv of [{ ...env, VERCEL_ENV: "production" }, { ...env, UEIP_PRODUCTION_DATABASE_FINGERPRINT: "preview-fingerprint" }, { ...env, GOOGLE_OAUTH_GRANTED_SCOPES: "https://www.googleapis.com/auth/gmail.readonly" }]) {
    const result = await configureGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.configure, env: invalidEnv as NodeJS.ProcessEnv });
    assert.equal(result.status, "blocked");
  }
  assert.equal(state.installations.length, 0);
});

test("configuration is tenant scoped, additive, idempotent, and records rollback controls", async () => {
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
  const state = stateDb();
  restores.push(setGoogleReadOnlyPreviewDbForTest(state.db as never));
  await configureGoogleReadOnlyPreview({ actor, confirmation: googleReadOnlyPreviewConfirmations.configure, env });
  await setGoogleReadOnlyPreviewEnabled({ actor, confirmation: googleReadOnlyPreviewConfirmations.disable, action: "disable", env });
  assert.ok(state.installations.every((item) => item.enabled === false));
  await setGoogleReadOnlyPreviewEnabled({ actor, confirmation: googleReadOnlyPreviewConfirmations.restore, action: "restore", env });
  assert.ok(state.installations.every((item) => item.enabled === true));
});
