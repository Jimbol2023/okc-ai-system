import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";

import {
  checkGoogleOAuthReadiness,
  evaluateBusinessDataSnapshotSchemaReadiness,
  evaluateEnvironmentHealth,
  getInfrastructureHealth,
} from "./infrastructure-health";
import { GET as getInfrastructureHealthRoute } from "../app/api/admin/infrastructure-health/route";

function createBaseEnv(overrides: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  return {
    DATABASE_URL: "postgresql://user:password@db.jcapital.test:5432/app",
    DIRECT_URL: "postgresql://user:password@db.jcapital.test:5432/app",
    AUTH_SECRET: "production-auth-secret-at-least-32-chars",
    ADMIN_EMAIL: "admin@jcapital.test",
    ADMIN_PASSWORD: "production-password",
    ADMIN_TENANT_ID: "default",
    GOOGLE_OAUTH_CLIENT_ID: "google-client",
    GOOGLE_OAUTH_CLIENT_SECRET: "google-secret",
    GOOGLE_OAUTH_REFRESH_TOKEN: "google-refresh",
    GOOGLE_ANALYTICS_PROPERTY_ID: "123456789",
    GOOGLE_SEARCH_CONSOLE_SITE_URL: "https://jcapitalpropertygroup.com/",
    YOUTUBE_CHANNEL_ID: "UC123",
    GOOGLE_BUSINESS_PROFILE_LOCATION_ID: "locations/123",
    CRON_SECRET: "cron-secret-at-least-32-characters",
    VERCEL_ENV: "production",
    ...overrides,
  };
}

describe("infrastructure health", () => {
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

  it("accepts the synthetic CI admin fixture without weakening placeholder rejection", async () => {
    const ciEnv = createBaseEnv({
      CI: "true",
      VERCEL_ENV: "development",
      DATABASE_URL: "postgresql://ci:ci@localhost:5432/okc_wholesale_ci?schema=public",
      DIRECT_URL: "postgresql://ci:ci@localhost:5432/okc_wholesale_ci?schema=public",
      AUTH_SECRET: "ci-build-only-auth-secret-not-for-runtime",
      ADMIN_EMAIL: "ci-admin@jcapital.test",
      ADMIN_PASSWORD: "ci-password-not-a-secret",
      ADMIN_TENANT_ID: "default",
    });

    const fixtureHealth = evaluateEnvironmentHealth(ciEnv, "development");
    const report = await getInfrastructureHealth({ env: ciEnv, includeDatabase: false, includeOAuth: false });

    assert.equal(fixtureHealth.items.find((item) => item.key === "ADMIN_EMAIL")?.status, "present");
    assert.equal(ciEnv.ADMIN_EMAIL, "ci-admin@jcapital.test");
    assert.equal(ciEnv.ADMIN_PASSWORD, "ci-password-not-a-secret");
    assert.equal(ciEnv.ADMIN_TENANT_ID, "default");
    assert.deepEqual(fixtureHealth.placeholders, []);
    assert.deepEqual(report.blockers, []);

    const rejected = evaluateEnvironmentHealth({ ...ciEnv, ADMIN_EMAIL: "ci-admin@example.test" }, "development");
    assert.ok(rejected.placeholders.includes("ADMIN_EMAIL"));
  });

  it("reports missing, empty, and placeholder env status without exposing values", () => {
    const env = createBaseEnv({
      GOOGLE_SEARCH_CONSOLE_SITE_URL: "",
      YOUTUBE_CHANNEL_ID: "replace-with-youtube-channel",
    });
    delete env.GOOGLE_BUSINESS_PROFILE_LOCATION_ID;

    const report = evaluateEnvironmentHealth(env, "production");
    const serialized = JSON.stringify(report);

    assert.ok(report.empty.includes("GOOGLE_SEARCH_CONSOLE_SITE_URL"));
    assert.ok(report.missing.includes("GOOGLE_BUSINESS_PROFILE_LOCATION_ID"));
    assert.ok(report.placeholders.includes("YOUTUBE_CHANNEL_ID"));
    assert.equal(serialized.includes("google-secret"), false);
    assert.equal(serialized.includes("google-refresh"), false);
  });

  it("confirms the hardened BusinessDataSnapshot schema when migration columns exist", () => {
    const readiness = evaluateBusinessDataSnapshotSchemaReadiness(hardenedBusinessDataSnapshotColumns);

    assert.equal(readiness.status, "ready");
    assert.equal(readiness.pendingMigration, false);
    assert.equal(readiness.missingColumns.length, 0);
    assert.equal(readiness.requiredMigration, "20260716100000_harden_business_data_snapshots");
    assert.equal(readiness.migrationPath, "prisma/migrations/20260716100000_harden_business_data_snapshots/migration.sql");
    assert.equal(readiness.safety.providerCalled, false);
    assert.equal(readiness.safety.liveExecutionAllowed, false);
    assert.equal(readiness.safety.migrationApplied, false);
  });

  it("confirms the hardened BusinessDataSnapshot migration is present in the deployment path", () => {
    const readiness = evaluateBusinessDataSnapshotSchemaReadiness(hardenedBusinessDataSnapshotColumns);

    assert.equal(existsSync(readiness.migrationPath), true);
  });

  it("reports BusinessDataSnapshot schema drift as a pending migration, not a provider action", async () => {
    const report = await getInfrastructureHealth({
      env: createBaseEnv(),
      includeDatabase: false,
      includeSchemaReadiness: true,
      includeOAuth: false,
      businessDataSnapshotColumns: hardenedBusinessDataSnapshotColumns.filter((column) => column !== "version"),
    });
    const readiness = report.schemaReadiness.businessDataSnapshot;
    const serialized = JSON.stringify(report);

    assert.equal(report.ok, false);
    assert.equal(report.status, "blocked");
    assert.equal(readiness.status, "schema_drift_detected");
    assert.equal(readiness.pendingMigration, true);
    assert.deepEqual(readiness.missingColumns, ["version"]);
    assert.ok(report.blockers.some((blocker) => blocker.includes("BusinessDataSnapshot schema drift")));
    assert.ok(report.blockers.some((blocker) => blocker.includes("20260716100000_harden_business_data_snapshots")));
    assert.ok(report.operatorActions.some((action) => action.includes("approved production deployment path")));
    assert.equal(readiness.safety.providerCalled, false);
    assert.equal(readiness.safety.externalWritesAllowed, false);
    assert.equal(readiness.safety.crmMutationAllowed, false);
    assert.equal(readiness.safety.outreachAllowed, false);
    assert.equal(readiness.safety.automationAllowed, false);
    assert.equal(readiness.safety.migrationApplied, false);
    assert.equal(report.liveExecutionAllowed, false);
    assert.equal(serialized.includes("provider action is authorized"), false);
  });

  it("keeps BusinessDataSnapshot schema readiness not checked when database diagnostics are disabled", async () => {
    const report = await getInfrastructureHealth({
      env: createBaseEnv(),
      includeDatabase: false,
      includeSchemaReadiness: false,
      includeOAuth: false,
    });
    const readiness = report.schemaReadiness.businessDataSnapshot;

    assert.equal(report.ok, true);
    assert.equal(report.certificationScope, "configuration");
    assert.equal(report.readinessState, "CONFIGURATION_READY_RUNTIME_NOT_VERIFIED");
    assert.equal(readiness.status, "not_checked");
    assert.equal(readiness.pendingMigration, false);
    assert.equal(readiness.safety.providerCalled, false);
    assert.equal(readiness.safety.liveExecutionAllowed, false);
    assert.equal(report.auditTrail.status, "not_checked");
    assert.equal(report.auditTrail.engineeringException, false);
  });

  it("reports runtime readiness only when database-backed audit visibility is available", async () => {
    const report = await getInfrastructureHealth({
      env: createBaseEnv(),
      includeDatabase: true,
      includeSchemaReadiness: true,
      includeOAuth: false,
      databaseCheckResult: { checked: true, ok: true, status: "ok" },
      businessDataSnapshotColumns: hardenedBusinessDataSnapshotColumns,
    });

    assert.equal(report.certificationScope, "runtime");
    assert.equal(report.readinessState, "RUNTIME_READY");
    assert.equal(report.auditTrail.status, "available");
    assert.equal(report.auditTrail.requiredForOperationalHealth, true);
    assert.equal(report.auditTrail.engineeringException, false);
  });

  it("fails closed to an engineering exception when audit evidence is required but unavailable", async () => {
    const report = await getInfrastructureHealth({
      env: createBaseEnv(),
      includeDatabase: true,
      includeSchemaReadiness: true,
      includeOAuth: false,
    });

    if (report.database.ok) return;

    assert.equal(report.certificationScope, "runtime");
    assert.equal(report.readinessState, "RUNTIME_BLOCKED");
    assert.equal(report.auditTrail.status, "blocked");
    assert.equal(report.auditTrail.engineeringException, true);
  });

  it("refreshes Google OAuth with a redacted success result", async () => {
    const result = await checkGoogleOAuthReadiness(createBaseEnv(), {
      fetcher: async () => Response.json({ access_token: "access-token" }),
    });
    const serialized = JSON.stringify(result);

    assert.equal(result.attempted, true);
    assert.equal(result.ok, true);
    assert.equal(result.status, 200);
    assert.equal(result.providerCalled, true);
    assert.equal(serialized.includes("access-token"), false);
  });

  it("redacts provider rejection and network errors", async () => {
    const rejected = await checkGoogleOAuthReadiness(createBaseEnv(), {
      fetcher: async () => Response.json({ error: "invalid_grant", refresh_token: "leaked" }, { status: 400 }),
    });
    const network = await checkGoogleOAuthReadiness(createBaseEnv(), {
      fetcher: async () => {
        throw new Error("network down");
      },
    });

    assert.equal(rejected.ok, false);
    assert.equal(rejected.errorType, "provider_rejected");
    assert.equal(JSON.stringify(rejected).includes("invalid_grant"), false);
    assert.equal(network.ok, false);
    assert.equal(network.errorType, "network_error");
  });

  it("keeps connector gaps department-scoped in Preview and Production", async () => {
    const preview = await getInfrastructureHealth({
      env: createBaseEnv({ VERCEL_ENV: "preview", GOOGLE_BUSINESS_PROFILE_LOCATION_ID: "" }),
      includeDatabase: false,
      includeOAuth: false,
    });
    const production = await getInfrastructureHealth({
      env: createBaseEnv({ GOOGLE_BUSINESS_PROFILE_LOCATION_ID: "" }),
      includeDatabase: false,
      includeOAuth: false,
    });

    assert.equal(preview.ok, true);
    assert.ok(preview.warnings.some((warning) => warning.includes("GOOGLE_BUSINESS_PROFILE_LOCATION_ID")));
    assert.equal(production.ok, true);
    assert.equal(production.status, "warning");
    assert.equal(production.blockers.some((blocker) => blocker.includes("GOOGLE_BUSINESS_PROFILE_LOCATION_ID")), false);
    assert.ok(production.warnings.some((warning) => warning.includes("GOOGLE_BUSINESS_PROFILE_LOCATION_ID")));

    const businessProfile = production.connectors.find((connector) => connector.connectorId === "google_business_profile");
    assert.equal(businessProfile?.deploymentScope, "department");
    assert.equal(businessProfile?.departmentEnablement, "advisory");
    assert.equal(businessProfile?.safeInternalFallbackAvailable, true);
    assert.ok(businessProfile?.affectedDepartments.includes("Marketing Intelligence"));
  });

  it("allows Production deployment when Search Console is missing and marks Search Intelligence advisory", async () => {
    const report = await getInfrastructureHealth({
      env: createBaseEnv({ GOOGLE_SEARCH_CONSOLE_SITE_URL: "" }),
      includeDatabase: false,
      includeOAuth: false,
    });
    const searchConsole = report.connectors.find((connector) => connector.connectorId === "google_search_console");

    assert.equal(report.ok, true);
    assert.equal(report.blockers.length, 0);
    assert.ok(report.warnings.some((warning) => warning.includes("GOOGLE_SEARCH_CONSOLE_SITE_URL")));
    assert.equal(searchConsole?.status, "missing_configuration");
    assert.equal(searchConsole?.departmentEnablement, "advisory");
    assert.ok(searchConsole?.affectedDepartments.includes("Search Intelligence"));
    assert.equal(searchConsole?.safeInternalFallbackAvailable, true);
    assert.equal(report.liveExecutionAllowed, false);
  });

  it("keeps every missing department connector out of the global deployment gate", async () => {
    const cases = [
      {
        envKey: "GOOGLE_ANALYTICS_PROPERTY_ID",
        connectorId: "google_analytics",
        affectedDepartment: "Lead Generation",
      },
      {
        envKey: "GOOGLE_BUSINESS_PROFILE_LOCATION_ID",
        connectorId: "google_business_profile",
        affectedDepartment: "Marketing",
      },
      {
        envKey: "YOUTUBE_CHANNEL_ID",
        connectorId: "youtube",
        affectedDepartment: "Content",
      },
    ] as const;

    for (const testCase of cases) {
      const report = await getInfrastructureHealth({
        env: createBaseEnv({ [testCase.envKey]: "" }),
        includeDatabase: false,
        includeOAuth: false,
      });
      const connector = report.connectors.find((item) => item.connectorId === testCase.connectorId);

      assert.equal(report.ok, true);
      assert.equal(report.blockers.length, 0);
      assert.ok(report.warnings.some((warning) => warning.includes(testCase.envKey)));
      assert.equal(connector?.departmentEnablement, "advisory");
      assert.ok(connector?.affectedDepartments.includes(testCase.affectedDepartment));
    }
  });

  it("identifies all departments affected by missing shared Google OAuth configuration", async () => {
    const report = await getInfrastructureHealth({
      env: createBaseEnv({ GOOGLE_OAUTH_REFRESH_TOKEN: "" }),
      includeDatabase: false,
      includeOAuth: false,
    });
    const affectedDepartments = new Set(report.connectors.flatMap((connector) => connector.affectedDepartments));

    assert.equal(report.ok, true);
    assert.equal(report.blockers.length, 0);
    assert.ok(report.warnings.some((warning) => warning.includes("GOOGLE_OAUTH_REFRESH_TOKEN")));
    assert.ok(report.connectors.every((connector) => connector.departmentEnablement === "advisory"));
    assert.ok(affectedDepartments.has("Search Intelligence"));
    assert.ok(affectedDepartments.has("Marketing Intelligence"));
    assert.ok(affectedDepartments.has("Lead Generation"));
    assert.ok(affectedDepartments.has("Content"));
  });

  it("keeps OAuth rejection department-scoped and redacted in Production", async () => {
    const report = await getInfrastructureHealth({
      env: createBaseEnv(),
      includeDatabase: false,
      includeOAuth: true,
      fetcher: async () => Response.json({ error: "invalid_grant", refresh_token: "leaked" }, { status: 400 }),
    });

    assert.equal(report.ok, true);
    assert.equal(report.blockers.length, 0);
    assert.ok(report.warnings.some((warning) => warning.includes("Google OAuth token exchange failed")));
    assert.ok(report.connectors.every((connector) => connector.departmentEnablement === "advisory"));
    assert.equal(JSON.stringify(report).includes("invalid_grant"), false);
    assert.equal(JSON.stringify(report).includes("leaked"), false);
  });

  it("keeps platform-critical configuration as a Production deployment blocker", async () => {
    const env = createBaseEnv({ AUTH_SECRET: "" });
    const report = await getInfrastructureHealth({
      env,
      includeDatabase: false,
      includeOAuth: false,
    });

    assert.equal(report.ok, false);
    assert.equal(report.status, "blocked");
    assert.ok(report.blockers.some((blocker) => blocker.includes("AUTH_SECRET")));
  });

  it("keeps approved execution blocked until smoke approval", async () => {
    const report = await getInfrastructureHealth({
      env: createBaseEnv({
        APPROVED_EXECUTION_ENABLED: "true",
        APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED: "false",
      }),
      includeDatabase: false,
      includeOAuth: false,
    });

    assert.equal(report.ok, false);
    assert.equal(report.safetyGates.liveExecutionAllowed, false);
    assert.ok(report.blockers.some((blocker) => blocker.includes("APPROVED_EXECUTION_ENABLED")));
  });

  it("keeps the infrastructure health API admin-only", async () => {
    const response = await getInfrastructureHealthRoute(new Request("https://example.test/api/admin/infrastructure-health"));
    const body = (await response.json()) as { ok: boolean; error: string };

    assert.equal(response.status, 401);
    assert.equal(body.ok, false);
    assert.equal(body.error, "Unauthorized");
  });
});
