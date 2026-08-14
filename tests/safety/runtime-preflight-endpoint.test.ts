import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { GET } from "@/app/api/admin/runtime-preflight/route";
import { AUTH_COOKIE_NAME, createSessionToken } from "@/lib/auth";
import { getInfrastructureHealth, type InfrastructureHealthReport } from "@/lib/infrastructure-health";
import { setRuntimePreflightTestOverridesForTest } from "@/lib/runtime-preflight";

const hardenedBusinessDataSnapshotColumns = [
  "id",
  "tenantId",
  "version",
  "contractVersion",
  "evidenceHash",
  "observationStart",
  "observationEnd",
  "traceId",
  "reliability",
  "snapshotDate",
];

const previewEnv: NodeJS.ProcessEnv = {
  VERCEL: "1",
  VERCEL_ENV: "preview",
  VERCEL_URL: "jcapital-preview-git-vercel-preview-jcapital.vercel.app",
  VERCEL_PROJECT_PRODUCTION_URL: "jcapitalpropertygroup.com",
  VERCEL_GIT_COMMIT_REF: "vercel-preview",
  VERCEL_GIT_COMMIT_SHA: "abc123runtimepreflight",
  DATABASE_URL: "postgresql://preview_user:preview_password@summer-star-72148368-pooler.neon.tech/jcapital_preview",
  DIRECT_URL: "postgresql://preview_user:preview_password@summer-star-72148368.neon.tech/jcapital_preview",
  AUTH_SECRET: "preview-auth-secret-at-least-32-chars",
  ADMIN_EMAIL: "admin@jcapital.test",
  ADMIN_PASSWORD: "preview-admin-password",
  GOOGLE_OAUTH_CLIENT_ID: "google-client",
  GOOGLE_OAUTH_CLIENT_SECRET: "google-secret",
  GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh",
  GOOGLE_ANALYTICS_PROPERTY_ID: "123456789",
  GOOGLE_SEARCH_CONSOLE_SITE_URL: "https://jcapitalpropertygroup.com/",
  YOUTUBE_CHANNEL_ID: "UC123",
  GOOGLE_BUSINESS_PROFILE_LOCATION_ID: "locations/123",
  CRON_SECRET: "cron-secret-at-least-32-characters",
};

const credentialValues = [
  previewEnv.DATABASE_URL,
  previewEnv.DIRECT_URL,
  previewEnv.AUTH_SECRET,
  previewEnv.ADMIN_PASSWORD,
  "preview_password",
  "google-secret",
  "google-refresh",
].filter(Boolean) as string[];

const originalEnv = { ...process.env };
let restorePreflight = () => undefined;

function replaceEnv(env: NodeJS.ProcessEnv) {
  for (const key of Object.keys(process.env)) {
    delete process.env[key];
  }
  Object.assign(process.env, env);
}

async function createReport(env: NodeJS.ProcessEnv, databaseOk = true): Promise<InfrastructureHealthReport> {
  return getInfrastructureHealth({
    env,
    includeDatabase: true,
    includeSchemaReadiness: true,
    includeOAuth: false,
    databaseCheckResult: { checked: true, ok: databaseOk, status: databaseOk ? "ok" : "error" },
    businessDataSnapshotColumns: databaseOk ? hardenedBusinessDataSnapshotColumns : undefined,
  });
}

async function adminRequest() {
  const token = await createSessionToken(previewEnv.ADMIN_EMAIL!, {
    tenantId: "tenant-preview",
    actorId: "admin-preview",
  });

  return new Request("https://preview.example.test/api/admin/runtime-preflight", {
    headers: {
      cookie: `${AUTH_COOKIE_NAME}=${token}`,
    },
  });
}

beforeEach(() => {
  replaceEnv(previewEnv);
});

afterEach(() => {
  restorePreflight();
  restorePreflight = () => undefined;
  replaceEnv(originalEnv);
});

describe("admin runtime preflight endpoint", () => {
  it("returns 401 for unauthenticated callers", async () => {
    const response = await GET(new Request("https://preview.example.test/api/admin/runtime-preflight"));
    const body = await response.json() as { ok: boolean; error: string };

    assert.equal(response.status, 401);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(body.ok, false);
    assert.equal(body.error, "Unauthorized");
  });

  it("denies Production runtime execution", async () => {
    replaceEnv({ ...previewEnv, VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "main" });
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityResult: {
        certified: true,
        status: "PREVIEW_DATABASE_IDENTITY_CERTIFIED",
        reasons: [],
        databaseNameMatches: true,
        expectedNeonProjectMatched: true,
      },
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as { readinessState: string; blockers: string[] };

    assert.equal(response.status, 403);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.ok(body.blockers.some((blocker) => blocker.includes("VERCEL_ENV must be preview")));
  });

  it("returns a sanitized Preview runtime readiness response", async () => {
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityResult: {
        certified: true,
        status: "PREVIEW_DATABASE_IDENTITY_CERTIFIED",
        reasons: [],
        databaseNameMatches: true,
        expectedNeonProjectMatched: true,
      },
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      environment: string;
      tenantId: string;
      databaseConnectivity: string;
      databaseIdentity: { status: string };
      auditTrail: string;
      readinessState: string;
      providerCalled: boolean;
      liveExecutionAllowed: boolean;
    };
    const serialized = JSON.stringify(body);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(body.environment, "preview");
    assert.equal(body.tenantId, "tenant-preview");
    assert.equal(body.databaseConnectivity, "ready");
    assert.equal(body.databaseIdentity.status, "PREVIEW_DATABASE_IDENTITY_CERTIFIED");
    assert.equal(body.auditTrail, "available");
    assert.equal(body.readinessState, "RUNTIME_READY");
    assert.equal(body.providerCalled, false);
    assert.equal(body.liveExecutionAllowed, false);
    assert.equal(credentialValues.some((value) => serialized.includes(value)), false);
  });

  it("reports RUNTIME_BLOCKED when the database is unavailable", async () => {
    const blockedEnv = { ...previewEnv };
    delete blockedEnv.DATABASE_URL;
    replaceEnv(blockedEnv);
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env, false),
      databaseIdentityResult: {
        certified: false,
        status: "PREVIEW_DATABASE_IDENTITY_BLOCKED",
        reasons: ["database_url_missing_or_invalid"],
        databaseNameMatches: false,
        expectedNeonProjectMatched: true,
      },
      auditEvidenceResult: { available: false, status: "blocked", requiredTablesPresent: false },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as { readinessState: string; secrets: { databaseUrlPresent: boolean }; databaseConnectivity: string };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.secrets.databaseUrlPresent, false);
    assert.equal(body.databaseConnectivity, "blocked");
  });

  it("reports RUNTIME_BLOCKED on Preview database identity mismatch", async () => {
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityResult: {
        certified: false,
        status: "PREVIEW_DATABASE_IDENTITY_BLOCKED",
        reasons: ["expected_preview_neon_project_not_detected"],
        databaseNameMatches: true,
        expectedNeonProjectMatched: false,
      },
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as { readinessState: string; databaseIdentity: { status: string; expectedNeonProjectMatched: boolean } };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.databaseIdentity.status, "PREVIEW_DATABASE_IDENTITY_BLOCKED");
    assert.equal(body.databaseIdentity.expectedNeonProjectMatched, false);
  });

  it("reports RUNTIME_BLOCKED when audit evidence is unavailable", async () => {
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityResult: {
        certified: true,
        status: "PREVIEW_DATABASE_IDENTITY_CERTIFIED",
        reasons: [],
        databaseNameMatches: true,
        expectedNeonProjectMatched: true,
      },
      auditEvidenceResult: { available: false, status: "blocked", requiredTablesPresent: false },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as { readinessState: string; auditTrail: string; providerCalled: boolean; liveExecutionAllowed: boolean };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.auditTrail, "blocked");
    assert.equal(body.providerCalled, false);
    assert.equal(body.liveExecutionAllowed, false);
  });
});
