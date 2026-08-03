import { expect, test } from "@playwright/test";
import { createHmac } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

function loadLocalEnvValue(name: string) {
  if (process.env[name]?.trim()) return process.env[name]?.trim() ?? "";
  for (const path of [".env.local", ".env"]) {
    if (!existsSync(path)) continue;
    const line = readFileSync(path, "utf8")
      .split(/\r?\n/u)
      .find((candidate) => candidate.match(new RegExp(`^\\s*${name}\\s*=`, "u")));
    if (!line) continue;
    const rawValue = line.replace(/^\s*[^=]+=/u, "").trim().replace(/^["']|["']$/gu, "");
    return rawValue.replace(new RegExp(`^${name}=`, "u"), "");
  }

  return "";
}

function toBase64Url(value: Buffer) {
  return value.toString("base64").replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/gu, "");
}

function createLocalSessionToken(email: string, secret: string) {
  const payload = {
    email: email.trim().toLowerCase(),
    tenantId: "default",
    actorId: email,
    sessionVersion: 1,
    exp: Date.now() + 1000 * 60 * 20,
  };
  const encodedPayload = toBase64Url(Buffer.from(JSON.stringify(payload), "utf8"));
  const signature = toBase64Url(createHmac("sha256", secret).update(encodedPayload).digest());

  return `${encodedPayload}.${signature}`;
}

const queueSummary = {
  total: 1,
  awaiting_ceo_approval: 1,
  ready_for_review: 1,
  blocked: 0,
  summary: "1 internal item is ready for review.",
};

const dashboardReport = {
  ok: true,
  widgets: [],
  productionReadinessCommand: {
    title: "Production Readiness Command",
    status: "blocked",
    schemaStatus: "schema_drift_detected",
    requiredMigration: "20260716100000_harden_business_data_snapshots",
    migrationPath: "prisma/migrations/20260716100000_harden_business_data_snapshots/migration.sql",
    missingColumns: ["version", "contractVersion", "evidenceHash", "observationStart", "observationEnd", "traceId", "reliability"],
    pendingMigration: true,
    blockerCount: 2,
    dataGapCount: 17,
    nextSafeAction: "Schema alignment remains blocked for dry-run only.",
    dryRunAllowed: false,
    departmentCompatibility: [
      {
        id: "draft-workspace",
        label: "Draft Workspace",
        status: "read_only",
        detail: "Internal draft decisions are available.",
        href: "/dashboard/drafts",
      },
    ],
    safetyFlags: {
      providerCalled: false,
      liveExecutionAllowed: false,
      crmMutationAllowed: false,
      publishingAllowed: false,
      outreachAllowed: false,
      scrapingAllowed: false,
      automationAllowed: false,
      vercelMutationAllowed: false,
      syntheticDataCreationAllowed: false,
    },
  },
  dailyStartup: {
    date: "2026-08-01T12:00:00.000Z",
    companyOperatingMode: "daily_startup_ready",
    executive_brief: "The AI company is ready for safe internal operation.",
    company_health: {
      score: 72,
      status: "watch",
      summary: "Company is ready for internal Daily Startup review.",
      sourceLabel: "daily_startup_internal_model",
      assumption: "Internal/manual state only.",
    },
    department_health: [{ department: "Marketing AI", status: "review_only", summary: "Ready for internal drafts.", approval_required: true }],
    active_executive_directives: [],
    opportunity_queue_summary: queueSummary,
    campaign_queue_summary: queueSummary,
    draft_queue_summary: queueSummary,
    approval_queue_summary: queueSummary,
    blocked_items: ["External execution remains blocked."],
    provider_readiness: {
      summary: "Provider readiness is informational.",
      missing: 1,
      ready: 0,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    government_policy_updates: [],
    news_intelligence_updates: [],
    engineering_progress: [],
    ceo_decision_agenda: [
      {
        id: "agenda-campaign-001",
        directive_id: "campaign-001",
        title: "Campaign 001",
        business_goal: "generate_revenue",
        reason: "Prepare internal campaign package.",
        expected_business_value: "Draft internal work products.",
        risk_level: "medium",
        departments_involved: ["Marketing AI"],
        recommended_action: "approve",
        approval_required: true,
        status: "awaiting_ceo_approval",
        sourceLabel: "executive_directive:campaign-001",
        assumption: "No external execution.",
      },
    ],
    activation_state: {
      assignments: [
        {
          id: "assignment-1",
          directiveId: "campaign-001",
          department: "Marketing AI",
          assignmentType: "department_work",
          requestedOutputs: ["Website draft"],
          status: "pending_internal_work",
          blocker: null,
          approvalRequired: true,
        },
      ],
      draftQueueItems: [],
      latestDecision: null,
    },
    safety: {
      internalOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      publishingBlocked: true,
      emailBlocked: true,
      smsBlocked: true,
      scrapingBlocked: true,
      adsBlocked: true,
      outreachBlocked: true,
      workflowExecutionBlocked: true,
      recommendationsOnly: true,
    },
  },
  morningBrief: {
    greeting: "Good morning Moses.",
    summary: "Internal morning brief ready.",
    keySignals: [],
    recommendedWorkOrder: ["Review CEO agenda"],
    memoryInsight: null,
    safetyBadges: ["providerCalled:false", "sent:false", "published:false", "liveExecution:false"],
  },
  todayPriorities: [],
  dataGaps: [],
  recentSystemActivity: [],
};

test("dashboard controlled internal operation buttons call safe endpoints and preserve external blocks", async ({ page }) => {
  const adminEmail = loadLocalEnvValue("ADMIN_EMAIL");
  const authSecret = loadLocalEnvValue("AUTH_SECRET");
  test.skip(!adminEmail || !authSecret, "Admin auth env is required for controlled internal operation browser smoke.");

  const calledActions: string[] = [];
  let internalWorkCalls = 0;
  let decisionCalls = 0;

  await page.route("**/api/executive-dashboard", async (route) => {
    await route.fulfill({ json: dashboardReport });
  });
  await page.route("**/api/company/internal-operations", async (route) => {
    const body = JSON.parse(route.request().postData() ?? "{}") as { action?: string };
    calledActions.push(body.action ?? "");
    await route.fulfill({
      json: {
        ok: true,
        action: body.action,
        createdRecordType: body.action === "record_executive_memory" ? "AiDepartmentMemoryEvent" : "DailyBriefingSnapshot",
        createdRecordId: `${body.action}-record`,
        recordsCreated: 1,
        recordsUpdated: 0,
        stateTransition: "internal_operational",
        auditEntryCreated: true,
        providerCalled: false,
        sent: false,
        published: false,
        crmMutation: false,
        outreach: false,
        scraping: false,
        externalExecutionAllowed: false,
        liveExecutionAllowed: false,
      },
    });
  });
  await page.route("**/api/company/internal-work/run", async (route) => {
    internalWorkCalls += 1;
    await route.fulfill({
      json: {
        ok: true,
        assignmentsAdvanced: 1,
        draftQueueItemsAdvanced: 1,
        directivesAdvanced: 1,
        completedInternalCount: 1,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
    });
  });
  await page.route("**/api/company/directives/*/decision", async (route) => {
    decisionCalls += 1;
    await route.fulfill({
      json: {
        ok: true,
        resultingStatus: "executive_approved",
        assignmentsTotal: 1,
        draftQueueItemsTotal: 1,
        decisionLogged: true,
        idempotent: false,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
    });
  });

  await page.context().addCookies([
    {
      name: "okcWholesaleAdminSession",
      value: createLocalSessionToken(adminEmail, authSecret),
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);

  await page.goto("/dashboard");
  const modeBanner = page.getByLabel("Controlled Internal Operating Mode");
  await expect(modeBanner.getByRole("heading", { name: "Controlled Internal Operating Mode" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Start the Company" })).toBeVisible();
  await expect(modeBanner.getByText("Internal Operational", { exact: true })).toBeVisible();
  await expect(modeBanner.getByText("External Execution Blocked", { exact: true })).toBeVisible();
  await expect(page.getByText("Schema Blocker", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Start the Company" }).click();
  await expect(page.getByText(/start company: internal_operational/i)).toBeVisible();
  await page.getByRole("button", { name: "Generate Morning Brief" }).click();
  await expect(page.getByText(/generate morning brief: internal_operational/i)).toBeVisible();
  await page.getByRole("button", { name: "Refresh Internal Intelligence" }).click();
  await expect(page.getByText(/refresh internal intelligence: internal_operational/i)).toBeVisible();
  await page.getByRole("button", { name: "Record Executive Memory" }).click();
  await expect(page.getByText(/record executive memory: internal_operational/i)).toBeVisible();
  await page.getByRole("button", { name: "Run Internal Work" }).click();
  await expect(page.getByText(/Internal work completed: 1 assignment/i)).toBeVisible();
  await page.getByRole("button", { name: "Approve" }).first().click();
  await expect(page.getByText(/Campaign 001 moved to executive_approved/i)).toBeVisible();

  expect(calledActions).toEqual(["start_company", "generate_morning_brief", "refresh_internal_intelligence", "record_executive_memory"]);
  expect(internalWorkCalls).toBeGreaterThanOrEqual(2);
  expect(decisionCalls).toBe(1);
  await expect(page.getByText("providerCalled:false", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("liveExecution:false", { exact: false }).first()).toBeVisible();
});
