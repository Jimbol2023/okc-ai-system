import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { validateProductionEnvironment } from "./env";

const trackedEnvKeys = [
  "DATABASE_URL",
  "DIRECT_URL",
  "AUTH_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "NEXT_PUBLIC_APP_URL",
  "PHASE4_LIVE_SMS_ENABLED",
  "PHASE4_SMS_KILL_SWITCH",
  "TWILIO_WEBHOOK_AUTH_TOKEN",
  "APPROVED_EXECUTION_ENABLED",
  "APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED",
  "NODE_ENV",
  "VERCEL_ENV",
] as const;

const originalEnv = Object.fromEntries(trackedEnvKeys.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of trackedEnvKeys) {
    if (originalEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalEnv[key];
    }
  }
});

function setProductionBaseEnv() {
  process.env.DATABASE_URL = "postgresql://user:password@example.com:5432/app";
  process.env.DIRECT_URL = "postgresql://user:password@example.com:5432/app";
  process.env.AUTH_SECRET = "production-auth-secret-at-least-32-chars";
  process.env.ADMIN_EMAIL = "admin@example.com";
  process.env.ADMIN_PASSWORD = "production-password";
  process.env.NEXT_PUBLIC_APP_URL = "https://example.com";
  process.env.PHASE4_LIVE_SMS_ENABLED = "false";
  process.env.PHASE4_SMS_KILL_SWITCH = "true";
  process.env.TWILIO_WEBHOOK_AUTH_TOKEN = "production-webhook-token";
  process.env.NODE_ENV = "production";
  process.env.VERCEL_ENV = "production";
}

describe("production environment validation", () => {
  it("keeps approved external execution blocked by default for first production start", () => {
    setProductionBaseEnv();
    delete process.env.APPROVED_EXECUTION_ENABLED;
    delete process.env.APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED;

    const report = validateProductionEnvironment();

    assert.equal(report.coreReady, true);
    assert.equal(report.approvedExecutionExternalEnabled, false);
    assert.equal(report.approvedExecutionProductionSmokePassed, false);
    assert.equal(report.approvedExecutionExternalReady, false);
    assert.equal(report.liveExecutionAllowed, false);
    assert.ok(!report.blockers.some((blocker) => blocker.includes("APPROVED_EXECUTION")));
  });

  it("blocks production external execution readiness when enabled before smoke approval", () => {
    setProductionBaseEnv();
    process.env.APPROVED_EXECUTION_ENABLED = "true";
    delete process.env.APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED;

    const report = validateProductionEnvironment();

    assert.equal(report.approvedExecutionExternalEnabled, true);
    assert.equal(report.approvedExecutionProductionSmokePassed, false);
    assert.equal(report.approvedExecutionExternalReady, false);
    assert.ok(report.blockers.some((blocker) => blocker.includes("APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED")));
  });

  it("marks approved external execution ready only after explicit production smoke approval", () => {
    setProductionBaseEnv();
    process.env.APPROVED_EXECUTION_ENABLED = "true";
    process.env.APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED = "true";

    const report = validateProductionEnvironment();

    assert.equal(report.approvedExecutionExternalEnabled, true);
    assert.equal(report.approvedExecutionProductionSmokePassed, true);
    assert.equal(report.approvedExecutionExternalReady, true);
  });
});
