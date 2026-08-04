import { expect, test } from "@playwright/test";

import { createExecutiveAutonomyLevel1IdempotencyKey, executiveAutonomyLevel1SafetyProof } from "@/lib/executive-autonomy-level-1";
import { prisma } from "@/lib/prisma";

type SafetyProof = typeof executiveAutonomyLevel1SafetyProof;

type PhaseResult = {
  id: string;
  status: string;
  recordsCreated: number;
  recordsUpdated: number;
  advisories: string[];
  safety: SafetyProof;
};

type AcceptanceRunResponse = {
  ok: boolean;
  state: "completed" | "completed_with_exceptions" | "already_completed";
  tenantId: string;
  businessDate: string;
  idempotencyKey: string;
  startedAt: string;
  completedAt: string;
  triggeredBy: "cron" | "manual" | "system";
  phases: PhaseResult[];
  morningBrief: {
    title: "CEO Morning Brief";
    summary: string;
    topCeoDecisions: string[];
    exceptions: string[];
    kpiChanges: string[];
    confidenceLevels: Array<{ label: string; confidence: number; status: string }>;
  };
  departmentCompletionSummary: {
    departmentsRun: number;
    assignmentsAdvanced: number;
    draftQueueItemsAdvanced: number;
    completedInternalCount: number;
  };
  leadPipeline: {
    leadsReviewed: number;
    leadsScored: number;
    recommendations: Array<{
      leadId: string;
      status: "advisory";
      approvalRequired: boolean;
      approvalItemId: string | null;
      duplicateWarnings: number;
    }>;
    approvalsCreated: number;
  };
  dataQuality: {
    status: "advisory";
    confidence: number;
    connectorGaps: string[];
    summary: string;
  };
  safety: SafetyProof;
};

const tenantId = "default";
const acceptanceLeadId = "acceptance-executive-autonomy-l1-lead";
const acceptanceSource = "acceptance:executive_autonomy_l1";

test.describe.configure({ mode: "serial" });

function centralBusinessDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getSkipReason() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    return "Executive Autonomy Level 1 acceptance is blocked in production.";
  }

  if (process.env.ALLOW_MUTATING_DEV_DB_TESTS !== "true") {
    return "Set ALLOW_MUTATING_DEV_DB_TESTS=true to run the DB-mutating Level 1 acceptance proof.";
  }

  if (!process.env.CRON_SECRET?.trim()) {
    return "CRON_SECRET is required for the scheduled route acceptance proof.";
  }

  return false;
}

function assertSafetyProof(value: SafetyProof) {
  expect(value).toEqual(executiveAutonomyLevel1SafetyProof);
}

async function seedAcceptanceLead() {
  const payload = {
    id: acceptanceLeadId,
    timestamp: new Date().toISOString(),
    firstName: "Acceptance",
    lastName: "Seller",
    email: "acceptance@example.test",
    phone: "555-010-L1",
    propertyAddress: "Executive Autonomy L1 Acceptance Property",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "Acceptance Seller",
    mailingAddress: "",
    county: "Oklahoma",
    parcelId: "ACCEPTANCE-L1",
    situationDetails: "Internal acceptance lead; do not contact. This record proves approval gating only.",
    source: acceptanceSource,
    status: "new",
    notes: [],
    followUps: [],
    analyzer: {
      arv: "220000",
      estimatedRepairs: "25000",
      desiredProfit: "25000",
    },
    distressFlags: {
      taxDelinquent: false,
      inheritedProperty: false,
      vacantProperty: true,
      foreclosureRisk: false,
      majorRepairs: true,
      tiredLandlord: false,
      urgentTimeline: true,
      outOfStateOwner: false,
    },
    opportunityScore: "High",
    score: 88,
    priority: "High",
    scoreBreakdown: "Acceptance record with high priority and DNC risk.",
    doNotContact: true,
    requiresHumanApproval: true,
    approvalStatus: "needs_human_review",
    isHot: true,
  };

  await prisma.lead.upsert({
    where: {
      tenantId_propertyAddress_phone: {
        tenantId,
        propertyAddress: payload.propertyAddress,
        phone: payload.phone,
      },
    },
    update: {
      id: acceptanceLeadId,
      name: "Acceptance Seller",
      source: acceptanceSource,
      status: "new",
      score: 88,
      priority: "High",
      notes: payload.situationDetails,
      payload: JSON.stringify(payload),
      doNotContact: true,
      requiresHumanApproval: true,
      approvalStatus: "needs_human_review",
      isHot: true,
    },
    create: {
      id: acceptanceLeadId,
      tenantId,
      name: "Acceptance Seller",
      phone: payload.phone,
      propertyAddress: payload.propertyAddress,
      source: acceptanceSource,
      status: "new",
      score: 88,
      priority: "High",
      notes: payload.situationDetails,
      payload: JSON.stringify(payload),
      doNotContact: true,
      requiresHumanApproval: true,
      approvalStatus: "needs_human_review",
      isHot: true,
    },
  });
}

async function resetTodayLevel1Evidence(idempotencyKey: string, businessDate: string) {
  await prisma.unifiedApprovalItem.deleteMany({
    where: {
      tenantId,
      sourceType: "executive_autonomy_l1",
      sourceId: {
        startsWith: idempotencyKey,
      },
    },
  });
  await prisma.revenueAuditEvent.deleteMany({
    where: {
      tenantId,
      action: "executive_autonomy_l1_daily_startup",
      targetId: idempotencyKey,
    },
  });
  await prisma.aiDepartmentMemoryEvent.deleteMany({
    where: {
      tenantId,
      memoryKey: idempotencyKey,
    },
  });
  await prisma.lead.deleteMany({
    where: {
      source: acceptanceSource,
      id: {
        not: acceptanceLeadId,
      },
    },
  });
  await prisma.unifiedApprovalItem.deleteMany({
    where: {
      tenantId,
      sourceType: "executive_autonomy_l1",
      sourceLabel: `executive_autonomy_l1:${businessDate}`,
      sourceId: {
        contains: acceptanceLeadId,
      },
    },
  });
}

test("rejects unauthenticated Level 1 daily startup requests", async ({ request }) => {
  const response = await request.get("/api/company/executive-autonomy/daily-startup");
  const body = (await response.json()) as { ok: boolean; error: string };

  expect(response.status()).toBe(401);
  expect(body).toEqual({ ok: false, error: "Unauthorized" });
});

test("proves one scheduled Level 1 cycle is operational, idempotent, evidenced, and internal-only", async ({ request }) => {
  test.setTimeout(120_000);

  const skipReason = getSkipReason();
  test.skip(Boolean(skipReason), skipReason || undefined);

  const businessDate = centralBusinessDate();
  const idempotencyKey = createExecutiveAutonomyLevel1IdempotencyKey(tenantId, businessDate);
  await resetTodayLevel1Evidence(idempotencyKey, businessDate);
  await seedAcceptanceLead();

  const headers = {
    authorization: `Bearer ${process.env.CRON_SECRET?.trim()}`,
  };
  const beforeFirstRun = new Date();
  const firstResponse = await request.get("/api/company/executive-autonomy/daily-startup", { headers });
  const first = (await firstResponse.json()) as AcceptanceRunResponse;

  expect(firstResponse.status()).toBe(200);
  expect(first.ok).toBe(true);
  expect(["completed", "completed_with_exceptions"]).toContain(first.state);
  expect(first.idempotencyKey).toBe(idempotencyKey);
  expect(first.triggeredBy).toBe("cron");
  assertSafetyProof(first.safety);

  const phaseIds = first.phases.map((phase) => phase.id);
  expect(phaseIds).toEqual(
    expect.arrayContaining(["idempotency_lock", "evidence_refresh", "department_autonomy", "lead_to_decision_pipeline", "morning_brief", "memory_and_audit"]),
  );
  for (const phase of first.phases) {
    expect(["completed", "advisory", "exception"]).toContain(phase.status);
    expect(typeof phase.recordsCreated).toBe("number");
    expect(typeof phase.recordsUpdated).toBe("number");
    expect(Array.isArray(phase.advisories)).toBe(true);
    assertSafetyProof(phase.safety);
  }

  expect(first.morningBrief.title).toBe("CEO Morning Brief");
  expect(first.morningBrief.summary.length).toBeGreaterThan(0);
  expect(Array.isArray(first.morningBrief.topCeoDecisions)).toBe(true);
  expect(Array.isArray(first.morningBrief.exceptions)).toBe(true);
  expect(first.morningBrief.exceptions.length).toBeGreaterThan(0);
  expect(Array.isArray(first.morningBrief.kpiChanges)).toBe(true);
  expect(first.morningBrief.kpiChanges.length).toBeGreaterThan(0);
  expect(first.morningBrief.confidenceLevels.map((item) => item.label)).toEqual(
    expect.arrayContaining(["Internal Operations", "Data Quality", "External Execution"]),
  );
  expect(first.morningBrief.confidenceLevels.find((item) => item.label === "External Execution")?.status).toBe("blocked_pending_approval");

  expect(first.departmentCompletionSummary).toEqual(
    expect.objectContaining({
      departmentsRun: expect.any(Number),
      assignmentsAdvanced: expect.any(Number),
      draftQueueItemsAdvanced: expect.any(Number),
      completedInternalCount: expect.any(Number),
    }),
  );
  expect(first.leadPipeline.leadsReviewed).toBeGreaterThan(0);
  expect(first.leadPipeline.leadsScored).toBeGreaterThan(0);
  expect(first.leadPipeline.recommendations.length).toBeGreaterThan(0);
  expect(first.leadPipeline.recommendations.some((item) => item.leadId === acceptanceLeadId && item.status === "advisory" && item.approvalRequired)).toBe(true);
  expect(first.leadPipeline.approvalsCreated).toBeGreaterThan(0);
  expect(first.dataQuality.status).toBe("advisory");

  const secondResponse = await request.get("/api/company/executive-autonomy/daily-startup", { headers });
  const second = (await secondResponse.json()) as AcceptanceRunResponse;

  expect(secondResponse.status()).toBe(200);
  expect(second.ok).toBe(true);
  expect(second.idempotencyKey).toBe(first.idempotencyKey);
  expect(second.state).toBe("already_completed");
  assertSafetyProof(second.safety);

  const memoryRecords = await prisma.aiDepartmentMemoryEvent.findMany({
    where: {
      tenantId,
      memoryKey: idempotencyKey,
    },
  });
  expect(memoryRecords).toHaveLength(1);
  const memory = memoryRecords[0];
  expect(["executive_autonomy_l1_completed", "executive_autonomy_l1_completed_with_exceptions"]).toContain(memory.outcome);
  expect(memory.providerCalled).toBe(false);
  expect(memory.sent).toBe(false);
  expect(memory.published).toBe(false);
  expect(memory.liveExecutionAllowed).toBe(false);
  expect(memory.metrics).toMatchObject({
    safety: executiveAutonomyLevel1SafetyProof,
    result: {
      idempotencyKey,
      safety: executiveAutonomyLevel1SafetyProof,
    },
  });

  const startupAuditEvents = await prisma.revenueAuditEvent.findMany({
    where: {
      tenantId,
      action: "executive_autonomy_l1_daily_startup",
      targetId: idempotencyKey,
    },
  });
  expect(startupAuditEvents).toHaveLength(1);
  expect(startupAuditEvents[0]?.source).toBe("executive_autonomy_l1");

  const approvalItems = await prisma.unifiedApprovalItem.findMany({
    where: {
      tenantId,
      sourceType: "executive_autonomy_l1",
      sourceId: {
        startsWith: idempotencyKey,
      },
    },
  });
  expect(approvalItems).toHaveLength(first.leadPipeline.approvalsCreated);
  expect(approvalItems.some((item) => item.sourceId?.includes(acceptanceLeadId))).toBe(true);
  for (const item of approvalItems) {
    expect(item.status).toBe("pending_review");
    expect(item.executionBlockedReason).toMatch(/External execution remains approval-gated and disabled/u);
    expect(item.providerCalled).toBe(false);
    expect(item.sent).toBe(false);
    expect(item.published).toBe(false);
    expect(item.liveExecutionAllowed).toBe(false);
  }

  const briefAudit = await prisma.revenueAuditEvent.findFirst({
    where: {
      tenantId,
      action: "controlled_internal_operation.generate_morning_brief",
      targetType: "DailyBriefingSnapshot",
      createdAt: {
        gte: beforeFirstRun,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  expect(briefAudit?.targetId).toBeTruthy();
  const briefingSnapshot = await prisma.dailyBriefingSnapshot.findUnique({
    where: {
      id: briefAudit?.targetId ?? "",
    },
  });
  expect(briefingSnapshot).toBeTruthy();
  expect(briefingSnapshot?.providerCalled).toBe(false);
  expect(briefingSnapshot?.sent).toBe(false);
  expect(briefingSnapshot?.published).toBe(false);
  expect(briefingSnapshot?.liveExecutionAllowed).toBe(false);
});
