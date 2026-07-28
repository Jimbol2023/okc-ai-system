import { expect, test, type APIRequestContext } from "@playwright/test";

type DashboardResponse = {
  ok: boolean;
  safetyFlags?: {
    providerCalled?: boolean;
    outreachSent?: boolean;
    adsCreated?: boolean;
    scrapingStarted?: boolean;
  };
  dailyStartup?: {
    safety: {
      providerCalled: boolean;
      liveExecutionAllowed: boolean;
      publishingBlocked: boolean;
      emailBlocked: boolean;
      smsBlocked: boolean;
      scrapingBlocked: boolean;
      adsBlocked: boolean;
      outreachBlocked: boolean;
      workflowExecutionBlocked: boolean;
    };
  };
};

type DecisionResponse = {
  ok: boolean;
  error?: string;
  providerCalled?: boolean;
  sent?: boolean;
  published?: boolean;
  liveExecutionAllowed?: boolean;
  safetyFlags?: {
    providerCalled: boolean;
    sent: boolean;
    published: boolean;
    liveExecutionAllowed: boolean;
    outreachBlocked: boolean;
    workflowExecutionBlocked: boolean;
    scrapingBlocked: boolean;
    adsBlocked: boolean;
    emailBlocked: boolean;
    smsBlocked: boolean;
  };
};

type DepartmentIntelligenceResponse = {
  ok: boolean;
  departments?: Array<{
    department: string;
    memoryStatus: string;
    eventCount: number;
  }>;
  topRecommendations?: unknown[];
  safety?: {
    providerCalled: boolean;
    liveExecutionAllowed: boolean;
    published: boolean;
    sent: boolean;
    outreachBlocked: boolean;
    workflowExecutionBlocked: boolean;
    scrapingBlocked: boolean;
    adsBlocked: boolean;
    emailBlocked: boolean;
    smsBlocked: boolean;
  };
};

type TimingSummary = {
  count: number;
  p50: number;
  p95: number;
  max: number;
};

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const dashboardP95LimitMs = Number(process.env.PRESSURE_DASHBOARD_P95_MS ?? 8_000);
const decisionMaxLimitMs = Number(process.env.PRESSURE_DECISION_MAX_MS ?? 30_000);

function getSkipReason() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    return "Pressure tests are blocked in production.";
  }

  if (process.env.ALLOW_MUTATING_DEV_DB_TESTS !== "true") {
    return "Set ALLOW_MUTATING_DEV_DB_TESTS=true to run DB-mutating pressure tests.";
  }

  if (!adminEmail || !adminPassword) {
    return "ADMIN_EMAIL and ADMIN_PASSWORD are required for authenticated pressure tests.";
  }

  return false;
}

async function signIn(request: APIRequestContext) {
  const response = await request.post("/api/auth/login", {
    data: {
      email: adminEmail,
      password: adminPassword,
    },
  });

  expect(response.status()).toBe(200);
}

async function timed<T>(fn: () => Promise<T>) {
  const startedAt = performance.now();
  const value = await fn();

  return {
    value,
    durationMs: Math.round(performance.now() - startedAt),
  };
}

function summarizeTimings(values: number[]): TimingSummary {
  const sorted = [...values].sort((a, b) => a - b);
  const percentile = (percent: number) => sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * percent))] ?? 0;

  return {
    count: sorted.length,
    p50: percentile(0.5),
    p95: percentile(0.95),
    max: sorted.at(-1) ?? 0,
  };
}

function assertDashboardSafety(data: DashboardResponse) {
  expect(data.ok).toBe(true);
  expect(data.safetyFlags?.providerCalled).toBe(false);
  expect(data.safetyFlags?.outreachSent).toBe(false);
  expect(data.safetyFlags?.adsCreated).toBe(false);
  expect(data.safetyFlags?.scrapingStarted).toBe(false);
  expect(data.dailyStartup?.safety.providerCalled).toBe(false);
  expect(data.dailyStartup?.safety.liveExecutionAllowed).toBe(false);
  expect(data.dailyStartup?.safety.publishingBlocked).toBe(true);
  expect(data.dailyStartup?.safety.emailBlocked).toBe(true);
  expect(data.dailyStartup?.safety.smsBlocked).toBe(true);
  expect(data.dailyStartup?.safety.scrapingBlocked).toBe(true);
  expect(data.dailyStartup?.safety.adsBlocked).toBe(true);
  expect(data.dailyStartup?.safety.outreachBlocked).toBe(true);
  expect(data.dailyStartup?.safety.workflowExecutionBlocked).toBe(true);
}

function assertDecisionSafety(data: DecisionResponse) {
  expect(data.ok).toBe(true);
  expect(data.providerCalled).toBe(false);
  expect(data.sent).toBe(false);
  expect(data.published).toBe(false);
  expect(data.liveExecutionAllowed).toBe(false);
  expect(data.safetyFlags?.providerCalled).toBe(false);
  expect(data.safetyFlags?.sent).toBe(false);
  expect(data.safetyFlags?.published).toBe(false);
  expect(data.safetyFlags?.liveExecutionAllowed).toBe(false);
  expect(data.safetyFlags?.outreachBlocked).toBe(true);
  expect(data.safetyFlags?.workflowExecutionBlocked).toBe(true);
  expect(data.safetyFlags?.scrapingBlocked).toBe(true);
  expect(data.safetyFlags?.adsBlocked).toBe(true);
  expect(data.safetyFlags?.emailBlocked).toBe(true);
  expect(data.safetyFlags?.smsBlocked).toBe(true);
}

function assertDepartmentIntelligenceSafety(data: DepartmentIntelligenceResponse) {
  expect(data.ok).toBe(true);
  expect(data.departments?.length).toBe(21);
  expect((data.topRecommendations?.length ?? 0) > 0).toBe(true);
  expect(data.safety?.providerCalled).toBe(false);
  expect(data.safety?.liveExecutionAllowed).toBe(false);
  expect(data.safety?.published).toBe(false);
  expect(data.safety?.sent).toBe(false);
  expect(data.safety?.outreachBlocked).toBe(true);
  expect(data.safety?.workflowExecutionBlocked).toBe(true);
  expect(data.safety?.scrapingBlocked).toBe(true);
  expect(data.safety?.adsBlocked).toBe(true);
  expect(data.safety?.emailBlocked).toBe(true);
  expect(data.safety?.smsBlocked).toBe(true);
}

async function readDashboard(request: APIRequestContext) {
  const response = await request.get("/api/executive-dashboard");

  expect(response.status()).toBe(200);
  const data = (await response.json()) as DashboardResponse;
  assertDashboardSafety(data);

  return data;
}

async function submitDecision(request: APIRequestContext, decision: "approve" | "reject" | "request_changes" | "defer", note: string) {
  const response = await request.post("/api/company/directives/campaign-001/decision", {
    data: {
      decision,
      note,
      reviewReminderAt: decision === "defer" ? new Date(Date.now() + 86_400_000).toISOString() : undefined,
    },
  });

  expect(response.status()).toBe(200);
  const data = (await response.json()) as DecisionResponse;
  assertDecisionSafety(data);

  return data;
}

test.describe("safe AI company pressure", () => {
  test("dashboard reads, directive decisions, and Department Intelligence remain safe under pressure", async ({ context }) => {
    test.skip(Boolean(getSkipReason()), String(getSkipReason() || ""));

    await signIn(context.request);

    const dashboardTimings: number[] = [];
    const decisionTimings: number[] = [];

    for (let index = 0; index < 20; index += 1) {
      const { durationMs } = await timed(() => readDashboard(context.request));
      dashboardTimings.push(durationMs);
    }

    const concurrentReads = await Promise.all(Array.from({ length: 5 }, () => timed(() => readDashboard(context.request))));
    dashboardTimings.push(...concurrentReads.map((read) => read.durationMs));

    const sequentialDecisions = [
      ["approve", "Pressure test approves internal preparation only."],
      ["defer", "Pressure test defers without external execution."],
      ["request_changes", "Pressure test requests changes without external execution."],
      ["approve", "Pressure test re-approves internal preparation only."],
    ] as const;

    for (const [decision, note] of sequentialDecisions) {
      const { durationMs } = await timed(() => submitDecision(context.request, decision, note));
      decisionTimings.push(durationMs);
      expect(durationMs).toBeLessThanOrEqual(decisionMaxLimitMs);
    }

    const concurrentDecisions = await Promise.all(
      ([
        ["approve", "Concurrent pressure approve remains internal only."],
        ["reject", "Concurrent pressure reject remains internal only."],
        ["request_changes", "Concurrent pressure request changes remains internal only."],
        ["defer", "Concurrent pressure defer remains internal only."],
      ] as const).map(([decision, note]) => timed(() => submitDecision(context.request, decision, note))),
    );
    decisionTimings.push(...concurrentDecisions.map((decision) => decision.durationMs));

    for (const decision of concurrentDecisions) {
      expect(decision.durationMs).toBeLessThanOrEqual(decisionMaxLimitMs);
    }

    const departmentResponse = await context.request.get("/api/company/departments/intelligence");
    expect(departmentResponse.status()).toBe(200);
    const departmentData = (await departmentResponse.json()) as DepartmentIntelligenceResponse;
    assertDepartmentIntelligenceSafety(departmentData);

    await readDashboard(context.request);

    const dashboardSummary = summarizeTimings(dashboardTimings);
    const decisionSummary = summarizeTimings(decisionTimings);

    expect(dashboardSummary.p95).toBeLessThanOrEqual(dashboardP95LimitMs);

    console.log(
      JSON.stringify(
        {
          pressure: {
            dashboard: dashboardSummary,
            decisions: decisionSummary,
            departmentIntelligence: {
              departments: departmentData.departments?.length ?? 0,
              topRecommendations: departmentData.topRecommendations?.length ?? 0,
            },
            safety: {
              providerCalled: false,
              sent: false,
              published: false,
              outreachSent: false,
              liveExecutionAllowed: false,
            },
          },
        },
        null,
        2,
      ),
    );
  });
});
