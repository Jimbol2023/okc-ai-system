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
  VERCEL_GIT_COMMIT_REF: "agent/runtime-consistency-repair",
  VERCEL_GIT_COMMIT_SHA: "abc123runtimepreflight",
  DATABASE_URL: "postgresql://preview_user:preview_password@ep-shiny-glitter-at7sr22n-pooler.us-east-2.aws.neon.tech/jcapital_preview",
  DIRECT_URL: "postgresql://preview_user:preview_password@ep-shiny-glitter-at7sr22n.us-east-2.aws.neon.tech/jcapital_preview",
  UEIP_PREVIEW_NEON_PROJECT_ID: "summer-star-72148368",
  UEIP_PREVIEW_NEON_BRANCH_ID: "br-vercel-preview-123456",
  UEIP_PREVIEW_NEON_BRANCH_NAME: "vercel-preview",
  UEIP_PREVIEW_NEON_ENDPOINT_ID: "ep-shiny-glitter-at7sr22n",
  UEIP_PREVIEW_NEON_DATABASE_NAME: "jcapital_preview",
  UEIP_PREVIEW_NEON_REGION: "us-east-2",
  UEIP_PREVIEW_ENVIRONMENT_ID: "preview",
  UEIP_PREVIEW_FINGERPRINT_V2: "preview-fingerprint-v2",
  UEIP_PRODUCTION_NEON_ENDPOINT_ID: "ep-production-main-123456",
  UEIP_PRODUCTION_FINGERPRINT_V2: "production-fingerprint-v2",
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

function observedEndpointIdentity(endpointId = "ep-shiny-glitter-at7sr22n") {
  return {
    observedServerIdentity: endpointId,
    observedDatabaseName: "jcapital_preview",
    observedBranchIdentity: null,
  };
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

  it("accepts exact-SHA Preview deployments from governed feature branches when Neon Preview identity agrees", async () => {
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity(),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      databaseIdentity: {
        status: string;
        expectedNeonProjectMatched: boolean;
        databaseNameMatches: boolean;
        diagnostics: {
          configuredProjectId: string;
          configuredEndpointId: string;
          observedEndpointId: string;
          configuredBranchId: string;
          configuredBranchName: string;
          configuredDatabaseName: string;
          expectedProjectIdentity: string;
          expectedEndpointIdentity: string;
          projectIdentitySource: string;
          endpointIdentitySource: string[];
          projectMatch: boolean;
          endpointMatch: boolean;
          databaseNameMatch: boolean;
          directPooledAgreement: boolean;
          previewDistinctFromProduction: boolean;
          ambiguityDetected: boolean;
          branchEvidenceAvailable: boolean;
          branchMatch: boolean;
        };
      };
      providerCalled: boolean;
      liveExecutionAllowed: boolean;
      vercel: { commitRef: string };
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_READY");
    assert.equal(body.vercel.commitRef, "agent/runtime-consistency-repair");
    assert.equal(body.databaseIdentity.status, "PREVIEW_DATABASE_IDENTITY_CERTIFIED");
    assert.equal(body.databaseIdentity.expectedNeonProjectMatched, true);
    assert.equal(body.databaseIdentity.databaseNameMatches, true);
    assert.equal(body.databaseIdentity.diagnostics.configuredProjectId, "summer-star-72148368");
    assert.equal(body.databaseIdentity.diagnostics.configuredEndpointId, "ep-shiny-glitter-at7sr22n");
    assert.equal(body.databaseIdentity.diagnostics.observedEndpointId, "ep-shiny-glitter-at7sr22n");
    assert.equal(body.databaseIdentity.diagnostics.configuredBranchId, "br-vercel-preview-123456");
    assert.equal(body.databaseIdentity.diagnostics.configuredBranchName, "vercel-preview");
    assert.equal(body.databaseIdentity.diagnostics.configuredDatabaseName, "jcapital_preview");
    assert.equal(body.databaseIdentity.diagnostics.expectedProjectIdentity, "summer-star-72148368");
    assert.equal(body.databaseIdentity.diagnostics.expectedEndpointIdentity, "ep-shiny-glitter-at7sr22n");
    assert.equal(body.databaseIdentity.diagnostics.projectIdentitySource, "UEIP_PREVIEW_NEON_PROJECT_ID");
    assert.deepEqual(body.databaseIdentity.diagnostics.endpointIdentitySource, [
      "UEIP_PREVIEW_NEON_ENDPOINT_ID",
      "databaseUrlHost",
      "directUrlHost",
      "postgresServerIdentity",
    ]);
    assert.equal(body.databaseIdentity.diagnostics.projectMatch, true);
    assert.equal(body.databaseIdentity.diagnostics.endpointMatch, true);
    assert.equal(body.databaseIdentity.diagnostics.databaseNameMatch, true);
    assert.equal(body.databaseIdentity.diagnostics.directPooledAgreement, true);
    assert.equal(body.databaseIdentity.diagnostics.previewDistinctFromProduction, true);
    assert.equal(body.databaseIdentity.diagnostics.ambiguityDetected, false);
    assert.equal(body.databaseIdentity.diagnostics.branchEvidenceAvailable, true);
    assert.equal(body.databaseIdentity.diagnostics.branchMatch, true);
    assert.equal(body.providerCalled, false);
    assert.equal(body.liveExecutionAllowed, false);
  });

  it("rejects a Preview deployment that is aliased as Production", async () => {
    replaceEnv({
      ...previewEnv,
      VERCEL_URL: "jcapitalpropertygroup.com",
      VERCEL_PROJECT_PRODUCTION_URL: "jcapitalpropertygroup.com",
    });
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity(),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      blockers: string[];
      vercel: { previewEndpointDiffersFromProduction: boolean };
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.vercel.previewEndpointDiffersFromProduction, false);
    assert.ok(body.blockers.some((blocker) => blocker.includes("Preview endpoint must differ from Production endpoint")));
  });

  it("rejects unknown deployment identity without an immutable SHA", async () => {
    const envWithoutSha = { ...previewEnv };
    delete envWithoutSha.VERCEL_GIT_COMMIT_SHA;
    replaceEnv(envWithoutSha);
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity(),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      blockers: string[];
      vercel: { commitShaPresent: boolean };
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.vercel.commitShaPresent, false);
    assert.ok(body.blockers.some((blocker) => blocker.includes("immutable Vercel Git commit SHA")));
  });

  it("rejects when endpoint ID would only pass by being synthesized from the project ID", async () => {
    replaceEnv({
      ...previewEnv,
      DATABASE_URL: "postgresql://preview_user:preview_password@ep-summer-star-72148368-pooler.us-east-2.aws.neon.tech/jcapital_preview",
      DIRECT_URL: "postgresql://preview_user:preview_password@ep-summer-star-72148368.us-east-2.aws.neon.tech/jcapital_preview",
      UEIP_PREVIEW_NEON_ENDPOINT_ID: "ep-summer-star-72148368",
    });
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity("ep-summer-star-72148368"),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      databaseIdentity: { status: string; diagnostics: { endpointMatch: boolean; projectMatch: boolean } };
      blockers: string[];
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.databaseIdentity.status, "PREVIEW_DATABASE_IDENTITY_BLOCKED");
    assert.equal(body.databaseIdentity.diagnostics.projectMatch, true);
    assert.equal(body.databaseIdentity.diagnostics.endpointMatch, false);
    assert.ok(body.blockers.some((blocker) => blocker.includes("configured_preview_neon_endpoint_mismatch")));
  });

  it("rejects a Production Neon endpoint identity in Preview", async () => {
    replaceEnv({
      ...previewEnv,
      DATABASE_URL: "postgresql://preview_user:preview_password@production-db.internal/jcapital_preview",
      DIRECT_URL: "postgresql://preview_user:preview_password@production-db-direct.internal/jcapital_preview",
      UEIP_PREVIEW_NEON_ENDPOINT_ID: "ep-production-main-123456",
    });
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity("ep-production-main-123456"),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      databaseIdentity: { status: string; expectedNeonProjectMatched: boolean };
      blockers: string[];
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.databaseIdentity.status, "PREVIEW_DATABASE_IDENTITY_BLOCKED");
    assert.equal(body.databaseIdentity.expectedNeonProjectMatched, false);
    assert.ok(body.blockers.some((blocker) => blocker.includes("expected_preview_neon_project_not_detected")));
  });

  it("rejects a wrong structured Neon project identity", async () => {
    replaceEnv({
      ...previewEnv,
      UEIP_PREVIEW_NEON_PROJECT_ID: "wrong-project-123456",
    });
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity(),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      databaseIdentity: { expectedNeonProjectMatched: boolean };
      blockers: string[];
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.databaseIdentity.expectedNeonProjectMatched, false);
    assert.ok(body.blockers.some((blocker) => blocker.includes("configured_preview_neon_project_mismatch")));
  });

  it("rejects a wrong explicit Neon endpoint identity", async () => {
    replaceEnv({
      ...previewEnv,
      NEON_ENDPOINT_ID: "ep-wrong-project-123456",
      UEIP_PREVIEW_NEON_ENDPOINT_ID: "ep-wrong-endpoint-123456",
    });
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity(),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      databaseIdentity: { expectedNeonProjectMatched: boolean };
      blockers: string[];
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.databaseIdentity.expectedNeonProjectMatched, false);
    assert.ok(body.blockers.some((blocker) => blocker.includes("preview_neon_identity_ambiguous")));
  });

  it("rejects a branch mismatch", async () => {
    replaceEnv({
      ...previewEnv,
      UEIP_PREVIEW_NEON_BRANCH_NAME: "main",
    });
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity(),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      databaseIdentity: { diagnostics: { branchMatch: boolean } };
      blockers: string[];
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.databaseIdentity.diagnostics.branchMatch, false);
    assert.ok(body.blockers.some((blocker) => blocker.includes("configured_preview_neon_branch_mismatch")));
  });

  it("rejects DATABASE_URL and DIRECT_URL endpoint disagreement", async () => {
    replaceEnv({
      ...previewEnv,
      DIRECT_URL: "postgresql://preview_user:preview_password@ep-other-preview-123456.us-east-2.aws.neon.tech/jcapital_preview",
    });
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity(),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      databaseIdentity: { diagnostics: { directPooledAgreement: boolean; ambiguityDetected: boolean } };
      blockers: string[];
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.databaseIdentity.diagnostics.directPooledAgreement, false);
    assert.equal(body.databaseIdentity.diagnostics.ambiguityDetected, true);
    assert.ok(body.blockers.some((blocker) => blocker.includes("database_url_and_direct_url_endpoint_mismatch")));
  });

  it("does not infer project ID from endpoint text", async () => {
    const missingProjectEnv = { ...previewEnv };
    delete missingProjectEnv.UEIP_PREVIEW_NEON_PROJECT_ID;
    replaceEnv(missingProjectEnv);
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity(),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      databaseIdentity: { diagnostics: { configuredProjectId: null; projectMatch: boolean; endpointMatch: boolean } };
      blockers: string[];
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.databaseIdentity.diagnostics.configuredProjectId, null);
    assert.equal(body.databaseIdentity.diagnostics.projectMatch, false);
    assert.equal(body.databaseIdentity.diagnostics.endpointMatch, true);
    assert.ok(body.blockers.some((blocker) => blocker.includes("preview_neon_identity_missing")));
  });

  it("rejects malformed Neon identity evidence", async () => {
    replaceEnv({
      ...previewEnv,
      DATABASE_URL: "postgresql://preview_user:preview_password@summer-star-72148368-pooler.us-east-2.aws.neon.tech/jcapital_preview",
      DIRECT_URL: "postgresql://preview_user:preview_password@summer-star-72148368.us-east-2.aws.neon.tech/jcapital_preview",
    });
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity(),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      databaseIdentity: { expectedNeonProjectMatched: boolean };
      blockers: string[];
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.databaseIdentity.expectedNeonProjectMatched, false);
    assert.ok(body.blockers.some((blocker) => blocker.includes("preview_neon_identity_malformed")));
  });

  it("rejects ambiguous Neon identity evidence", async () => {
    replaceEnv({
      ...previewEnv,
      DATABASE_URL: "postgresql://preview_user:preview_password@ep-summer-star-72148368-pooler.us-east-2.aws.neon.tech/jcapital_preview",
      DIRECT_URL: "postgresql://preview_user:preview_password@ep-other-preview-123456.us-east-2.aws.neon.tech/jcapital_preview",
    });
    restorePreflight = setRuntimePreflightTestOverridesForTest({
      infrastructureReport: await createReport(process.env),
      databaseIdentityQuery: async () => observedEndpointIdentity(),
      auditEvidenceResult: { available: true, status: "available", requiredTablesPresent: true },
    });

    const response = await GET(await adminRequest());
    const body = await response.json() as {
      readinessState: string;
      databaseIdentity: { expectedNeonProjectMatched: boolean };
      blockers: string[];
    };

    assert.equal(response.status, 200);
    assert.equal(body.readinessState, "RUNTIME_BLOCKED");
    assert.equal(body.databaseIdentity.expectedNeonProjectMatched, false);
    assert.ok(body.blockers.some((blocker) => blocker.includes("preview_neon_identity_ambiguous")));
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
