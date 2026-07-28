import assert from "node:assert/strict";
import { test } from "node:test";

import { createApprovedExecutionPreparedAction } from "@/lib/approved-execution-layer";
import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import {
  assertDailyOperatingReviewSafety,
  assertDailyRevenueOperatingLoopSafety,
  createCrmTaskApprovalInputFromWorkOrder,
  createDailyOperatingReviewMemoryPayload,
  createDailyRevenueOperatingLoopFromInputs,
  dailyOperatingReviewDecisions,
  dailyWorkOrderOutcomes,
  isDailyOperatingReviewDecision,
  isDailyWorkOrderOutcome,
  reviewDailyWorkOrderFromReport,
  type DailyRevenueOperatingLoopReport,
} from "@/lib/daily-revenue-operating-loop";
import type { RevenueCommandCenterReport } from "@/lib/revenue-spine";

function revenueReport(): RevenueCommandCenterReport {
  return {
    ok: true,
    providerCalled: false,
    outreachSent: false,
    summary: {
      totalLeads: 2,
      qualifiedLeads: 1,
      openTasks: 0,
      followUpDue: 1,
      duplicateWarnings: 0,
      missingDataRecords: 1,
      inactiveConnectors: 2,
    },
    inbox: [
      {
        lead: {
          id: "lead-001",
          source: "website form",
          propertyAddress: "123 Internal Review Ave",
          priority: "High",
          score: 82,
          status: "new",
          phone: "",
          email: "",
          ownerName: "Test Owner",
          parcelId: "",
          county: "Oklahoma",
          situationDetails: "Seller may need a quick internal review.",
          distressFlags: [],
          lastSellerReply: "",
          lastContactedAt: null,
          nextFollowUpAt: null,
          doNotContact: false,
          approvalStatus: "pending",
          isHot: true,
        },
        latestScore: {
          score: 82,
          confidence: 70,
          priority: "High",
          explanation: "High-priority internal test lead with enough context for manual review.",
          recommendedNextAction: "Prepare an internal acquisition review task for the highest-priority seller lead.",
          missingData: ["seller contact"],
          scoreBreakdown: {},
          assumptions: [],
          dataUsed: ["stored lead source"],
        },
        duplicateWarnings: [],
        followUpFlags: ["High-potential lead needs owner review"],
        recommendedAction: "Prepare an internal acquisition review task for the highest-priority seller lead.",
      },
    ],
    sourcePerformance: [],
    referralPerformance: [],
    tasks: [],
    auditEvents: [],
    connectors: [],
    decisionLogs: [],
    connectorHealth: {
      total: 0,
      active: 0,
      readinessOnly: 0,
      inactive: 0,
      providerCallsAllowed: 0,
      approvalRequired: 0,
    },
    decisionFeedback: {
      total: 0,
      pending: 0,
      accepted: 0,
      modified: 0,
      ignored: 0,
      unknownOutcome: 0,
    },
    agentGovernance: {
      providerCalled: false,
      outreachSent: false,
      scrapingEnabled: false,
      browserAutomationEnabled: false,
      executionRequiresApproval: true,
      advisoryOnly: true,
      supportedDataSources: ["manual entry"],
      disabledByDefaultSources: ["external provider writes"],
      aiAgentRoles: ["Revenue Performance AI"],
    },
    executiveBriefing: {
      title: "Internal revenue briefing",
      summary: "One high-priority lead requires internal review.",
      risks: ["Seller contact is missing."],
      recommendedActions: ["Prepare CRM task for internal review."],
    },
  } as RevenueCommandCenterReport;
}

function report(): DailyRevenueOperatingLoopReport {
  return createDailyRevenueOperatingLoopFromInputs({
    workforce: createAiWorkforceReportFromInputs({ generatedAt: "2026-07-09T13:00:00.000Z" }),
    revenueCommandCenter: revenueReport(),
    generatedAt: "2026-07-09T13:00:00.000Z",
  });
}

test("daily revenue operating loop generates internal work orders owned by AI employees", () => {
  const loop = report();

  assert.equal(loop.ok, true);
  assert.equal(loop.company, "J Capital Property Group");
  assert.equal(loop.safety.internalOnly, true);
  assert.equal(loop.safety.providerCalled, false);
  assert.equal(loop.safety.liveExecutionAllowed, false);
  assert.equal(loop.safety.externalProviderWritesAllowed, false);
  assert.equal(loop.departmentQueues.length, 16);
  assert.ok(loop.workOrders.length >= 39);

  for (const order of loop.workOrders) {
    assert.ok(order.id);
    assert.ok(order.department);
    assert.ok(order.aiManager);
    assert.ok(order.aiEmployee);
    assert.ok(order.aiEmployeeId);
    assert.ok(order.dailyInput.length > 0);
    assert.ok(order.dailyOutput.length > 0);
    assert.ok(order.revenueObjective);
    assert.ok(order.successKpi.length > 0);
    assert.ok(order.recommendedAction);
    assert.ok(order.reason);
    assert.ok(order.approvalRule);
    assert.ok(order.handoffTarget.length > 0);
    assert.ok(order.dueDate);
    assert.equal(order.providerCalled, false);
    assert.equal(order.liveExecutionAllowed, false);
  }
});

test("every AI employee has mandatory daily operating contract fields", () => {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt: "2026-07-09T13:00:00.000Z" });

  for (const employee of workforce.employees) {
    assert.ok(employee.dailyOperatingContract.dailyInput.length > 0, employee.name);
    assert.ok(employee.dailyOperatingContract.dailyOutput.length > 0, employee.name);
    assert.ok(employee.dailyOperatingContract.successKpi.length > 0, employee.name);
    assert.ok(employee.dailyOperatingContract.handoffTarget.length > 0, employee.name);
    assert.ok(employee.dailyOperatingContract.approvalRule, employee.name);
  }
});

test("CEO dashboard exposes revenue priorities and department status", () => {
  const loop = report();

  assert.equal(loop.highestPriorityLead?.leadId, "lead-001");
  assert.ok(loop.ceoDashboard.todaysRevenueOpportunities > 0);
  assert.ok(loop.ceoDashboard.aiEmployeesAssigned >= 39);
  assert.ok(loop.ceoDashboard.tasksReady > 0);
  assert.ok(loop.ceoDashboard.departmentsWorking.includes("CRM"));
  assert.ok(loop.ceoDashboard.connectorIssues.length > 0);
  assert.ok(loop.tomorrowRecommendations.length > 0);
});

test("only create_crm_task is eligible for safe internal approval preparation", () => {
  const loop = report();
  const crmOrder = loop.workOrders.find((order) => order.canCreateCrmTask);

  assert.ok(crmOrder);
  assert.equal(crmOrder.allowedInternalAction, "create_crm_task");

  const approvalInput = createCrmTaskApprovalInputFromWorkOrder(crmOrder);
  const prepared = createApprovedExecutionPreparedAction(approvalInput);

  assert.equal(approvalInput.actionType, "create_crm_task");
  assert.equal(prepared.connectorId, "internal_crm");
  assert.equal(prepared.actionKey, "revenue_task.create");
  assert.equal(prepared.riskLevel, "low");
  assert.deepEqual(prepared.requiredApprovals, ["CEO task creation approval"]);
  assert.equal(approvalInput.payload.providerCalled, false);
  assert.equal(approvalInput.payload.liveExecutionAllowed, false);
});

test("work order safety contract blocks provider execution drift", () => {
  const loop = report();

  assert.doesNotThrow(() => assertDailyRevenueOperatingLoopSafety(loop));

  const unsafe = {
    ...loop,
    workOrders: [
      {
        ...loop.workOrders[0],
        liveExecutionAllowed: true,
      },
    ],
  } as DailyRevenueOperatingLoopReport;

  assert.throws(() => assertDailyRevenueOperatingLoopSafety(unsafe), /provider execution safety/i);
});

test("daily work order outcomes are explicit and pending is not terminal", () => {
  assert.equal(isDailyWorkOrderOutcome("completed"), true);
  assert.equal(isDailyWorkOrderOutcome("revenue_produced"), true);
  assert.equal(isDailyWorkOrderOutcome("sent_email"), false);
  assert.ok(dailyWorkOrderOutcomes.includes("needs_ceo_approval"));
});

test("daily operating review decisions are explicit and exclude external actions", () => {
  assert.equal(isDailyOperatingReviewDecision("approve_crm_task"), true);
  assert.equal(isDailyOperatingReviewDecision("defer"), true);
  assert.equal(isDailyOperatingReviewDecision("send_email"), false);
  assert.equal(isDailyOperatingReviewDecision("publish_article"), false);
  assert.equal(isDailyOperatingReviewDecision("schedule_post"), false);
  assert.deepEqual([...dailyOperatingReviewDecisions].sort(), [
    "approve_crm_task",
    "block",
    "defer",
    "mark_completed",
    "no_opportunity",
  ].sort());
});

test("daily operating review rejects missing work orders", async () => {
  const result = await reviewDailyWorkOrderFromReport(report(), {
    workOrderId: "missing-work-order",
    decision: "defer",
    reviewedBy: "ceo@example.com",
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, "invalid");
  assert.equal(result.workOrder, null);
  assert.equal(result.providerCalled, false);
  assert.equal(result.liveExecutionAllowed, false);
});

test("approve_crm_task review prepares only an internal CRM task approval input", async () => {
  const loop = report();
  const crmOrder = loop.workOrders.find((order) => order.canCreateCrmTask);

  assert.ok(crmOrder);

  const result = await reviewDailyWorkOrderFromReport(loop, {
    workOrderId: crmOrder.id,
    decision: "approve_crm_task",
    reviewedBy: "ceo@example.com",
  });

  assert.equal(result.ok, true);
  assert.equal(result.status, "approval_prepared");
  assert.equal(result.providerCalled, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.ok(result.approvalInput);
  assert.equal(result.approvalInput.actionType, "create_crm_task");
  assert.equal(result.approvalInput.sourceLabel, `daily-revenue-operating-loop:${crmOrder.id}`);
  assert.doesNotThrow(() => assertDailyOperatingReviewSafety(result));
});

test("non-CRM review decisions log memory and do not prepare execution", async () => {
  const loop = report();
  const order = loop.workOrders[0];
  const loggedPayloads: unknown[] = [];

  const result = await reviewDailyWorkOrderFromReport(
    loop,
    {
      workOrderId: order.id,
      decision: "block",
      note: "Blocked until missing data is resolved.",
      reviewedBy: "ceo@example.com",
    },
    {
      memoryLogger: async (payload) => {
        loggedPayloads.push(payload);

        return { logged: true, mode: "prisma", eventId: "memory-1" };
      },
    },
  );

  assert.equal(result.ok, true);
  assert.equal(result.status, "memory_logged");
  assert.equal(result.approvalInput, undefined);
  assert.equal(result.providerCalled, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(loggedPayloads.length, 1);
  assert.equal((loggedPayloads[0] as { outcome: string }).outcome, "blocked");
});

test("daily operating review memory payload preserves internal-only safety flags", () => {
  const loop = report();
  const payload = createDailyOperatingReviewMemoryPayload(loop.workOrders[0], {
    workOrderId: loop.workOrders[0].id,
    decision: "no_opportunity",
    reviewedBy: "ceo@example.com",
  });

  assert.equal(payload.eventType, "daily_operating_review_decision");
  assert.equal(payload.outcome, "no_opportunity");
  assert.equal(payload.metadata.providerCalled, false);
  assert.equal(payload.metadata.liveExecutionAllowed, false);
});
