import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  checkGoogleOAuthReadiness,
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

  it("warns for Preview connector gaps and blocks Production connector gaps", async () => {
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
    assert.equal(production.ok, false);
    assert.ok(production.blockers.some((blocker) => blocker.includes("GOOGLE_BUSINESS_PROFILE_LOCATION_ID")));
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
