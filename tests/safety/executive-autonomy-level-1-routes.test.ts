import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { GET as GET_DAILY_STARTUP, POST, setExecutiveAutonomyDailyStartupRouteDepsForTest } from "@/app/api/company/executive-autonomy/daily-startup/route";
import { GET, setExecutiveAutonomyStatusRouteDepsForTest } from "@/app/api/company/executive-autonomy/status/route";
import { executiveAutonomyLevel1SafetyProof } from "@/lib/executive-autonomy-level-1";

const restores: Array<() => void> = [];
let previousCronSecret: string | undefined;
let previousCronTenantId: string | undefined;

beforeEach(() => {
  previousCronTenantId = process.env.CRON_TENANT_ID;
  process.env.CRON_TENANT_ID = "tenant-alpha";
});

afterEach(() => {
  while (restores.length > 0) {
    restores.pop()?.();
  }
  if (previousCronSecret === undefined) {
    delete process.env.CRON_SECRET;
  } else {
    process.env.CRON_SECRET = previousCronSecret;
  }
  if (previousCronTenantId === undefined) delete process.env.CRON_TENANT_ID;
  else process.env.CRON_TENANT_ID = previousCronTenantId;
});

describe("Executive Autonomy Level 1 routes", () => {
  it("rejects unauthenticated manual daily startup requests", async () => {
    previousCronSecret = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-cron-secret";

    const response = await POST(new Request("https://example.test/api/company/executive-autonomy/daily-startup", { method: "POST" }));
    const body = (await response.json()) as { ok: boolean; error: string };

    assert.equal(response.status, 401);
    assert.equal(body.ok, false);
    assert.equal(body.error, "Unauthorized");
  });

  it("allows CRON_SECRET-authorized startup and preserves internal-only safety proof", async () => {
    previousCronSecret = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-cron-secret";
    const calls: string[] = [];
    restores.push(
      setExecutiveAutonomyDailyStartupRouteDepsForTest({
        runDailyStartup: async ({ tenantId, triggeredBy }) => {
          calls.push("autonomy");
          assert.equal(tenantId, "tenant-alpha");
          assert.equal(triggeredBy, "cron");
          return ({
            ok: true,
            level: 1,
            mode: "executive_autonomy_level_1_internal",
            state: "completed",
            tenantId: "tenant-alpha",
            businessDate: "2026-08-02",
            idempotencyKey: "executive-autonomy-l1:tenant-alpha:2026-08-02:week1-level1-ordered-pipeline-v1",
            pipelineVersion: "week1-level1-ordered-pipeline-v1",
            startedAt: "2026-08-02T13:00:00.000Z",
            completedAt: "2026-08-02T13:01:00.000Z",
            triggeredBy: "cron",
            phases: [],
            morningBrief: {
              title: "CEO Morning Brief",
              summary: "Daily Startup completed safely.",
              topCeoDecisions: [],
              exceptions: [],
              kpiChanges: [],
              confidenceLevels: [],
            },
            departmentCompletionSummary: {
              departmentsRun: 1,
              assignmentsAdvanced: 1,
              draftQueueItemsAdvanced: 0,
              completedInternalCount: 1,
            },
            leadPipeline: {
              leadsReviewed: 0,
              leadsScored: 0,
              recommendations: [],
              approvalsCreated: 0,
            },
            orderedSync: {
              completed: true,
              generatedAt: "2026-08-02T13:00:00.000Z",
              categories: [],
              providerCalled: false,
              liveExecutionAllowed: false,
            },
            snapshotVerification: { ok: true, freshCategories: [], advisoryExceptions: [], requiredFields: [] },
            dfdPrioritization: { prioritiesPresent: false, topPriorities: [] },
            certificationEvidence: {
              orderedSyncCompleted: true,
              syncBeforeAutonomy: true,
              tenantIsolationPassed: true,
              startupCompleted: true,
              startupIdempotent: true,
              morningBriefPersisted: true,
              dfdPrioritiesPresent: false,
              approvalsPresent: false,
              exceptionsPresent: false,
              executiveMemoryPersisted: true,
              auditTraceComplete: true,
              duplicateBusinessActions: 0,
              providerWrites: 0,
              sent: false,
              published: false,
              crmMutation: false,
              outreach: false,
              scraping: false,
              externalExecutionAllowed: false,
              liveExecutionAllowed: false,
            },
            dataQuality: {
              status: "advisory",
              confidence: 80,
              connectorGaps: [],
              summary: "Confidence advisory.",
            },
            nextRunAt: "2026-08-03T13:00:00.000Z",
            manualControls: ["run_daily_startup_now", "retry_failed_internal_step", "regenerate_morning_brief"],
            safety: executiveAutonomyLevel1SafetyProof,
          }) as never;
        },
      }),
    );

    const response = await POST(
      new Request("https://example.test/api/company/executive-autonomy/daily-startup", {
        method: "POST",
        headers: {
          authorization: "Bearer test-cron-secret",
        },
      }),
    );
    const body = (await response.json()) as {
      ok: boolean;
      safety: typeof executiveAutonomyLevel1SafetyProof;
      state: string;
    };

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.state, "completed");
    assert.deepEqual(body.safety, executiveAutonomyLevel1SafetyProof);
    assert.deepEqual(calls, ["autonomy"]);
  });

  it("returns internal-only failure proof when the startup authority fails closed", async () => {
    previousCronSecret = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-cron-secret";
    let autonomyCalled = false;
    restores.push(
      setExecutiveAutonomyDailyStartupRouteDepsForTest({
        runDailyStartup: async () => {
          autonomyCalled = true;
          throw new Error("week1_level1_sync_provider_boundary_violation");
        },
      }),
    );

    const response = await GET_DAILY_STARTUP(new Request("https://example.test/api/company/executive-autonomy/daily-startup", {
      headers: { authorization: "Bearer test-cron-secret" },
    }));
    const body = (await response.json()) as { ok: boolean; providerCalled: boolean; externalExecutionAllowed: boolean };

    assert.equal(response.status, 500);
    assert.equal(body.ok, false);
    assert.equal(body.providerCalled, false);
    assert.equal(body.externalExecutionAllowed, false);
    assert.equal(autonomyCalled, true);
  });

  it("allows Vercel Cron GET only with the exact CRON_SECRET bearer token", async () => {
    previousCronSecret = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-cron-secret";
    restores.push(
      setExecutiveAutonomyDailyStartupRouteDepsForTest({
        runDailyStartup: async ({ triggeredBy }) => ({
          ok: true,
          triggeredBy,
          safety: executiveAutonomyLevel1SafetyProof,
        }) as never,
      }),
    );

    const unauthorized = await GET_DAILY_STARTUP(
      new Request("https://example.test/api/company/executive-autonomy/daily-startup", {
        headers: { authorization: "Bearer wrong-secret" },
      }),
    );
    assert.equal(unauthorized.status, 401);

    const authorized = await GET_DAILY_STARTUP(
      new Request("https://example.test/api/company/executive-autonomy/daily-startup", {
        headers: { authorization: "Bearer test-cron-secret" },
      }),
    );
    const body = (await authorized.json()) as { triggeredBy: string };
    assert.equal(authorized.status, 200);
    assert.equal(body.triggeredBy, "cron");
  });

  it("rejects unauthenticated status reads", async () => {
    restores.push(
      setExecutiveAutonomyStatusRouteDepsForTest({
        getStatus: async () => {
          throw new Error("status loader should not run for unauthorized requests");
        },
      }),
    );

    const response = await GET(new Request("https://example.test/api/company/executive-autonomy/status", { method: "GET" }));
    const body = (await response.json()) as { ok: boolean; error: string };

    assert.equal(response.status, 401);
    assert.equal(body.ok, false);
    assert.equal(body.error, "Unauthorized");
  });
});
