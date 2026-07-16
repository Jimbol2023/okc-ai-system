import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import {
  authorizeSearchConsolePreview,
  configureSearchConsolePreview,
  getSearchConsolePreviewCloseout,
  getSearchConsolePreviewReadiness,
  previewAuthorizationConfirmation,
  previewInstallConfirmation,
  previewProbeConfirmation,
  previewReadConfirmation,
  previewRollbackConfirmation,
  rollbackSearchConsolePreview,
  runSearchConsolePreviewPilot,
  setUeipPreviewPilotDbForTest,
} from "@/lib/ueip-preview-pilot";
import { setUeipRuntimeDependenciesForTest } from "@/lib/ueip-runtime-gateway";

const actor = { tenantId: "default", actorId: "admin@example.com" };
const siteUrl = "https://example.com/";
const previewEnv = {
  VERCEL_ENV: "preview",
  UEIP_PREVIEW_ENVIRONMENT_ID: "preview-1",
  UEIP_PREVIEW_DATABASE_FINGERPRINT: "preview-db",
  UEIP_PRODUCTION_DATABASE_FINGERPRINT: "production-db",
  GOOGLE_SEARCH_CONSOLE_SITE_URL: siteUrl,
  GOOGLE_OAUTH_CLIENT_ID: "client",
  GOOGLE_OAUTH_CLIENT_SECRET: "client-secret",
  GOOGLE_OAUTH_REFRESH_TOKEN: "refresh-secret",
} as NodeJS.ProcessEnv;

const restores: Array<() => void> = [];
afterEach(() => { while (restores.length) restores.pop()?.(); });

function createDb() {
  let identity: Record<string, unknown> | null = null;
  let credential: Record<string, unknown> | null = null;
  let installation: Record<string, unknown> | null = null;
  const authorizations: Array<Record<string, unknown>> = [];
  const controls: Array<Record<string, unknown>> = [];
  const audits: Array<Record<string, unknown>> = [];
  const health: Array<Record<string, unknown>> = [];
  const db: Record<string, unknown> = {};
  Object.assign(db, {
    async $transaction(callback: (tx: unknown) => Promise<unknown>) { return callback(db); },
    ueipEnvironmentIdentity: {
      async findUnique() { return identity; },
      async upsert(args: { create: Record<string, unknown>; update: Record<string, unknown> }) { identity = { ...(identity ?? { id: "identity-1" }), ...(identity ? args.update : args.create) }; return identity; },
    },
    connectorCredentialReference: {
      async upsert(args: { create: Record<string, unknown>; update: Record<string, unknown> }) { credential = { ...(credential ?? { id: "credential-1" }), ...(credential ? args.update : args.create) }; return credential; },
      async findFirst() { return credential; },
    },
    connectorInstallationState: {
      async findUnique() { return installation; },
      async upsert(args: { create: Record<string, unknown>; update: Record<string, unknown> }) { installation = { ...(installation ?? { id: "installation-1" }), ...(installation ? args.update : args.create) }; return installation; },
      async update(args: { data: Record<string, unknown> }) { installation = { ...(installation ?? { id: "installation-1", tenantId: "default", connectorId: "google_search_console" }), ...args.data }; return installation; },
    },
    ueipPilotAuthorization: {
      async create(args: { data: Record<string, unknown> }) { const item = { id: `authorization-${authorizations.length + 1}`, createdAt: new Date(), consumedAt: null, lockedAt: null, traceId: null, resultStatus: null, ...args.data }; authorizations.push(item); return item; },
      async findUnique(args: { where: { nonceHash: string } }) { return authorizations.find((item) => item.nonceHash === args.where.nonceHash) ?? null; },
      async update(args: { where: { id: string }; data: Record<string, unknown> }) { const item = authorizations.find((candidate) => candidate.id === args.where.id)!; Object.assign(item, args.data); return item; },
      async updateMany(args: { where: Record<string, unknown>; data: Record<string, unknown> }) {
        const item = authorizations.find((candidate) => candidate.nonceHash === args.where.nonceHash && candidate.status === "approved" && !candidate.consumedAt && candidate.expiresAt instanceof Date && candidate.expiresAt > (args.where.expiresAt as { gt: Date }).gt);
        if (!item) return { count: 0 };
        Object.assign(item, args.data);
        return { count: 1 };
      },
      async findMany() { return [...authorizations].reverse(); },
    },
    ueipPilotControlEvent: {
      async create(args: { data: Record<string, unknown> }) { const item = { id: `control-${controls.length + 1}`, createdAt: new Date(), ...args.data }; controls.push(item); return item; },
      async findMany(args: { orderBy?: { createdAt: string } }) { return args.orderBy?.createdAt === "asc" ? [...controls] : [...controls].reverse(); },
    },
    ueipGatewayAuditEvent: {
      async create(args: { data: Record<string, unknown> }) { const item = { id: `audit-${audits.length + 1}`, createdAt: new Date(), ...args.data }; audits.push(item); return item; },
      async findFirst() { return audits.length ? audits[audits.length - 1] : null; },
      async findMany() { return [...audits].reverse(); },
    },
    enterpriseConnectorHealthEvent: {
      async create(args: { data: Record<string, unknown> }) { health.push(args.data); return args.data; },
      async findMany() { return [...health].reverse(); },
    },
    businessDataSnapshot: { async findMany() { return []; } },
  });
  return { db, authorizations, controls, audits, getInstallation: () => installation };
}

function install(db: Record<string, unknown>, fetcher?: typeof fetch) {
  restores.push(setUeipPreviewPilotDbForTest(db as never));
  restores.push(setUeipRuntimeDependenciesForTest({ db: db as never, environment: "preview", fetcher: fetcher ?? (async (url) => {
    if (String(url).includes("oauth2.googleapis.com")) return new Response(JSON.stringify({ access_token: "access" }), { status: 200, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ rows: [{ keys: ["https://example.com/page"], clicks: 1, impressions: 10, ctr: 0.1, position: 2 }] }), { status: 200, headers: { "content-type": "application/json" } });
  }) }));
}

async function configureAndDrill() {
  await configureSearchConsolePreview({ actor, confirmation: previewInstallConfirmation, env: previewEnv });
  await rollbackSearchConsolePreview({ actor, confirmation: previewRollbackConfirmation, action: "drill_disable", env: previewEnv });
  await rollbackSearchConsolePreview({ actor, confirmation: previewRollbackConfirmation, action: "drill_restore", env: previewEnv });
  assert.equal((await getSearchConsolePreviewReadiness({ actor, env: previewEnv })).status, "ready");
}

test("Preview identity guard rejects Production and shared database fingerprints", async () => {
  const state = createDb();
  install(state.db);
  const production = await configureSearchConsolePreview({ actor, confirmation: previewInstallConfirmation, env: { ...previewEnv, VERCEL_ENV: "production" } });
  assert.equal(production.status, "blocked");
  const shared = await configureSearchConsolePreview({ actor, confirmation: previewInstallConfirmation, env: { ...previewEnv, UEIP_PRODUCTION_DATABASE_FINGERPRINT: "preview-db" } });
  assert.equal(shared.status, "blocked");
  assert.equal(state.getInstallation(), null);
});

test("installation is idempotent and authorization requires a completed rollback drill", async () => {
  const state = createDb();
  install(state.db);
  await configureSearchConsolePreview({ actor, confirmation: previewInstallConfirmation, env: previewEnv });
  await configureSearchConsolePreview({ actor, confirmation: previewInstallConfirmation, env: previewEnv });
  const blocked = await authorizeSearchConsolePreview({ actor, confirmation: previewAuthorizationConfirmation, env: previewEnv });
  assert.equal(blocked.status, "blocked");
  await configureAndDrill();
  const authorized = await authorizeSearchConsolePreview({ actor, confirmation: previewAuthorizationConfirmation, env: previewEnv });
  assert.equal(authorized.status, "authorized");
  assert.ok("nonce" in authorized && authorized.nonce.length > 20);
  assert.equal(JSON.stringify(state.authorizations).includes(authorized.nonce), false);
});

test("one authorization permits one read, locks the installation, and duplicate submission cannot call again", async () => {
  const state = createDb();
  let providerRequests = 0;
  install(state.db, async (url) => {
    providerRequests += 1;
    if (String(url).includes("oauth2.googleapis.com")) return new Response(JSON.stringify({ access_token: "access" }), { status: 200, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ rows: [] }), { status: 200, headers: { "content-type": "application/json" } });
  });
  await configureAndDrill();
  const authorization = await authorizeSearchConsolePreview({ actor, confirmation: previewAuthorizationConfirmation, env: previewEnv });
  assert.equal(authorization.status, "authorized");
  if (authorization.status !== "authorized") return;
  const first = await runSearchConsolePreviewPilot({ actor, confirmation: previewReadConfirmation, operation: "read", nonce: authorization.nonce, env: previewEnv });
  const duplicate = await runSearchConsolePreviewPilot({ actor, confirmation: previewReadConfirmation, operation: "read", nonce: authorization.nonce, env: previewEnv });
  assert.equal(first.status, "completed");
  assert.equal(duplicate.status, "locked");
  assert.equal(providerRequests, 2);
  assert.equal(state.getInstallation()?.enabled, false);
  assert.equal(state.authorizations[0].providerCallCount, 1);
  assert.deepEqual(state.audits.map((event) => event.sequenceNumber), [1, 2, 3]);
  assert.equal(state.audits[0].previousEventDigest, null);
  assert.equal(state.audits[1].previousEventDigest, state.audits[0].eventDigest);
  assert.equal(JSON.stringify({ first, audits: state.audits }).includes("client-secret"), false);
  assert.equal(JSON.stringify({ first, audits: state.audits }).includes("refresh-secret"), false);
});

test("blocked-site probe produces no provider access and supports closeout evidence", async () => {
  const state = createDb();
  let calls = 0;
  install(state.db, async () => { calls += 1; return new Response("{}", { status: 500, headers: { "content-type": "application/json" } }); });
  await configureAndDrill();
  const probe = await runSearchConsolePreviewPilot({ actor, confirmation: previewProbeConfirmation, operation: "blocked_probe", env: previewEnv });
  assert.equal(probe.status, "completed");
  assert.equal(probe.providerCalled, false);
  assert.equal(calls, 0);
  assert.ok(state.controls.some((event) => event.eventType === "blocked_site_probe" && event.decision === "passed"));
  const closeout = await getSearchConsolePreviewCloseout({ actor, env: previewEnv });
  assert.equal(closeout.status, "pilot_incomplete");
});
