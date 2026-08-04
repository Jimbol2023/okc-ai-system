import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { dailyStartupInternalCategories, GET as GET_DAILY_STARTUP, POST, setExecutiveAutonomyDailyStartupRouteDepsForTest } from "@/app/api/company/executive-autonomy/daily-startup/route";
import { GET, setExecutiveAutonomyStatusRouteDepsForTest } from "@/app/api/company/executive-autonomy/status/route";
import { executiveAutonomyLevel1SafetyProof } from "@/lib/executive-autonomy-level-1";

const restores: Array<() => void> = [];
let previousCronSecret: string | undefined;

beforeEach(() => {
  restores.push(
    setExecutiveAutonomyDailyStartupRouteDepsForTest({
      runInternalSync: async (_env, _context, options) => ({
        ok: true,
        generatedAt: "2026-08-02T13:00:00.000Z",
        snapshots: (options.categories ?? []).map((category) => ({ category })),
        providerCalled: false,
        liveExecutionAllowed: false,
      }) as never,
    }),
  );
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
        runInternalSync: async (_env, context, options) => {
          calls.push("sync");
          assert.equal(context.tenantId, "default");
          assert.equal(context.requestOrigin, "system_cron");
          assert.deepEqual(options.categories, dailyStartupInternalCategories);
          assert.equal(options.persistDailyBriefing, false);
          return {
            ok: true,
            generatedAt: "2026-08-02T13:00:00.000Z",
            snapshots: options.categories?.map((category) => ({ category })) ?? [],
            providerCalled: false,
            liveExecutionAllowed: false,
          } as never;
        },
        runDailyStartup: async () => {
          calls.push("autonomy");
          return ({
            ok: true,
            level: 1,
            mode: "executive_autonomy_level_1_internal",
            state: "completed",
            tenantId: "default",
            businessDate: "2026-08-02",
            idempotencyKey: "executive-autonomy-l1:default:2026-08-02",
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
      preflightSync: { categories: string[]; providerCalled: boolean; liveExecutionAllowed: boolean };
    };

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.state, "completed");
    assert.deepEqual(body.safety, executiveAutonomyLevel1SafetyProof);
    assert.deepEqual(calls, ["sync", "autonomy"]);
    assert.deepEqual(body.preflightSync.categories, dailyStartupInternalCategories);
    assert.equal(body.preflightSync.providerCalled, false);
    assert.equal(body.preflightSync.liveExecutionAllowed, false);
  });

  it("fails closed before autonomy when the internal sync crosses a provider boundary", async () => {
    previousCronSecret = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-cron-secret";
    let autonomyCalled = false;
    restores.push(
      setExecutiveAutonomyDailyStartupRouteDepsForTest({
        runInternalSync: async () => ({
          ok: true,
          generatedAt: "2026-08-02T13:00:00.000Z",
          snapshots: [],
          providerCalled: true,
          liveExecutionAllowed: false,
        }) as never,
        runDailyStartup: async () => {
          autonomyCalled = true;
          throw new Error("must not run");
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
    assert.equal(autonomyCalled, false);
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
