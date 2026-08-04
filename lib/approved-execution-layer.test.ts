import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  approveAndExecuteApprovedAction,
  createApprovedExecutionPreparedAction,
  prepareApprovedExecution,
  setApprovedExecutionLayerServicesForTest,
} from "./approved-execution-layer";
import type { prisma } from "./prisma";

type MockRecord = {
  id?: string;
  [key: string]: unknown;
};

let restoreServices: (() => void) | undefined;
const originalApprovedExecutionEnabled = process.env.APPROVED_EXECUTION_ENABLED;
const originalApprovedExecutionProductionSmokePassed = process.env.APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED;
const originalVercelEnv = process.env.VERCEL_ENV;
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  restoreServices?.();
  restoreServices = undefined;
  process.env.APPROVED_EXECUTION_ENABLED = originalApprovedExecutionEnabled;
  process.env.APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED = originalApprovedExecutionProductionSmokePassed;
  process.env.VERCEL_ENV = originalVercelEnv;
  process.env.NODE_ENV = originalNodeEnv;
});

function createMockDb(options: { failAuditWrites?: boolean } = {}) {
  const approvalItems: MockRecord[] = [];
  const approvalDecisions: MockRecord[] = [];
  const auditEvents: MockRecord[] = [];
  const revenueTasks: MockRecord[] = [];

  const db = {
    unifiedApprovalItem: {
      async create(args: { data: MockRecord; select?: Record<string, boolean> }) {
        const created = { ...args.data, id: `approval-${approvalItems.length + 1}` };
        approvalItems.push(created);

        if (!args.select) return created;

        return Object.fromEntries(Object.keys(args.select).map((key) => [key, created[key]]));
      },
      async findUnique(args: { where: { id: string } }) {
        return approvalItems.find((item) => item.id === args.where.id) ?? null;
      },
      async findFirst(args: { where: { id?: string; tenantId?: string } }) {
        return approvalItems.find((item) =>
          (!args.where.id || item.id === args.where.id) &&
          (!args.where.tenantId || item.tenantId === args.where.tenantId)
        ) ?? null;
      },
      async update(args: { where: { id: string }; data: MockRecord }) {
        const index = approvalItems.findIndex((item) => item.id === args.where.id);
        if (index < 0) throw new Error(`Approval item not found: ${args.where.id}`);
        approvalItems[index] = { ...approvalItems[index], ...args.data };

        return approvalItems[index];
      },
    },
    unifiedApprovalDecision: {
      async create(args: { data: MockRecord }) {
        const created = { ...args.data, id: `decision-${approvalDecisions.length + 1}` };
        approvalDecisions.push(created);

        return created;
      },
    },
    revenueAuditEvent: {
      async create(args: { data: MockRecord; select?: Record<string, boolean> }) {
        if (options.failAuditWrites) {
          throw new Error("audit write failed for test");
        }
        const created = { ...args.data, id: `audit-${auditEvents.length + 1}` };
        auditEvents.push(created);

        if (!args.select) return created;

        return Object.fromEntries(Object.keys(args.select).map((key) => [key, created[key]]));
      },
    },
    revenueTask: {
      async create(args: { data: MockRecord; select?: Record<string, boolean> }) {
        const created = { ...args.data, id: `task-${revenueTasks.length + 1}` };
        revenueTasks.push(created);

        if (!args.select) return created;

        return Object.fromEntries(Object.keys(args.select).map((key) => [key, created[key]]));
      },
    },
  };

  return {
    db: db as unknown as typeof prisma,
    records: {
      approvalItems,
      approvalDecisions,
      auditEvents,
      revenueTasks,
    },
  };
}

describe("approved execution layer", () => {
  it("prepares exact approved execution actions with guarded connector contracts", () => {
    const email = createApprovedExecutionPreparedAction({
      actionType: "send_email",
      title: "Send approved email",
      sourceLabel: "test",
      payload: { to: "buyer@example.com", subject: "Hello", body: "Approved body" },
    });
    const task = createApprovedExecutionPreparedAction({
      actionType: "create_crm_task",
      title: "Create approved task",
      sourceLabel: "test",
      payload: { title: "Review package" },
    });

    assert.equal(email.connectorId, "gmail");
    assert.equal(email.actionKey, "gmail.users.messages.send");
    assert.equal(email.riskLevel, "high");
    assert.deepEqual(email.requiredApprovals, ["CEO approve-send", "recipient verification", "message body review"]);
    assert.equal(task.connectorId, "internal_crm");
    assert.equal(task.actionKey, "revenue_task.create");
    assert.equal(task.riskLevel, "low");
  });

  it("prepares a CEO approval item without provider calls or live execution", async () => {
    const { db, records } = createMockDb();
    restoreServices = setApprovedExecutionLayerServicesForTest({ db });

    const result = await prepareApprovedExecution({
      tenantId: "tenant-alpha",
      actionType: "create_crm_task",
      title: "Create approved CRM task",
      sourceLabel: "approved_execution_layer:test",
      payload: { title: "Review approved package" },
    });

    assert.equal(result.ok, true);
    assert.equal(result.approvalItem.id, "approval-1");
    assert.equal(result.approvalItem.status, "pending_review");
    assert.equal(result.providerCalled, false);
    assert.equal(result.sent, false);
    assert.equal(result.published, false);
    assert.equal(result.liveExecutionAllowed, false);
    assert.equal(records.approvalItems.length, 1);
    assert.equal(records.approvalItems[0].executionBlockedReason, "Awaiting CEO approve-execute decision for one exact action.");
  });

  it("executes one approved CRM task, logs audit, logs memory, and updates approval state", async () => {
    const { db, records } = createMockDb();
    restoreServices = setApprovedExecutionLayerServicesForTest({
      db,
      memoryLogger: async () => ({ logged: true, eventId: "memory-1", reason: null }),
    });
    const prepared = await prepareApprovedExecution({
      tenantId: "tenant-alpha",
      actionType: "create_crm_task",
      title: "Create approved CRM task",
      sourceLabel: "approved_execution_layer:test",
      preparedBy: "ceo@example.com",
      payload: {
        title: "Review final approved work package",
        taskType: "approved_execution",
        priority: "high",
        recommendedAction: "Review the final work package.",
        reason: "CEO approved execution.",
      },
    });

    const result = await approveAndExecuteApprovedAction({
      tenantId: "tenant-alpha",
      approvalId: prepared.approvalItem.id,
      approvedBy: "ceo@example.com",
      note: "Approve one exact CRM task.",
    });

    assert.equal(result.ok, true);
    assert.equal(result.decisionLogged, true);
    assert.equal(result.auditLogged, true);
    assert.equal(result.memoryLogged, true);
    assert.equal(result.result.status, "executed");
    assert.equal(result.result.crmTaskCreated, true);
    assert.equal(result.result.providerCalled, false);
    assert.equal(result.result.sent, false);
    assert.equal(result.result.published, false);
    assert.equal(records.revenueTasks.length, 1);
    assert.equal(records.revenueTasks[0].source, "approved_execution:approval-1");
    assert.equal(records.auditEvents.some((event) => event.action === "approved_execution.create_crm_task"), true);
    assert.equal(records.auditEvents.some((event) => event.action === "operating_loop.ceo_approval.approved_execution"), true);
    assert.equal(records.approvalDecisions.length, 1);
    assert.equal(records.approvalItems[0].status, "executed");
  });

  it("blocks external approved execution in production until production smoke approval is explicit", async () => {
    const { db, records } = createMockDb();
    restoreServices = setApprovedExecutionLayerServicesForTest({
      db,
      memoryLogger: async () => ({ logged: true, eventId: "memory-1", reason: null }),
    });
    process.env.APPROVED_EXECUTION_ENABLED = "true";
    process.env.APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED = "false";
    process.env.VERCEL_ENV = "production";
    const prepared = await prepareApprovedExecution({
      tenantId: "tenant-alpha",
      actionType: "send_email",
      title: "Send approved email",
      sourceLabel: "approved_execution_layer:test",
      payload: {
        to: "recipient@example.com",
        subject: "Approved subject",
        body: "Approved body",
      },
    });

    const result = await approveAndExecuteApprovedAction({
      tenantId: "tenant-alpha",
      approvalId: prepared.approvalItem.id,
      approvedBy: "ceo@example.com",
      note: "Approve one exact email.",
    });

    assert.equal(result.ok, false);
    assert.equal(result.result.status, "blocked");
    assert.equal(result.result.blockedReason, "APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED is not true.");
    assert.equal(result.result.providerCalled, false);
    assert.equal(result.result.sent, false);
    assert.equal(result.result.published, false);
    assert.equal(records.revenueTasks.length, 0);
    assert.equal(records.auditEvents.some((event) => event.action === "approved_execution.send_email"), true);
    assert.equal(records.auditEvents.some((event) => event.action === "operating_loop.ceo_approval.approved_execution"), true);
    assert.equal(records.approvalDecisions.length, 1);
    assert.equal(records.approvalItems[0].status, "execution_blocked");
  });

  it("fails closed when audit logging fails after an approved CRM task action", async () => {
    const { db, records } = createMockDb({ failAuditWrites: true });
    restoreServices = setApprovedExecutionLayerServicesForTest({
      db,
      memoryLogger: async () => ({ logged: true, eventId: "memory-1", reason: null }),
    });
    const prepared = await prepareApprovedExecution({
      tenantId: "tenant-alpha",
      actionType: "create_crm_task",
      title: "Create approved CRM task",
      sourceLabel: "approved_execution_layer:test",
      payload: { title: "Review final approved work package" },
    });

    const result = await approveAndExecuteApprovedAction({
      tenantId: "tenant-alpha",
      approvalId: prepared.approvalItem.id,
      approvedBy: "ceo@example.com",
      note: "Approve one exact CRM task.",
    });

    assert.equal(result.ok, false);
    assert.equal(result.auditLogged, false);
    assert.equal(result.memoryLogged, true);
    assert.equal(result.result.status, "failed");
    assert.equal(result.result.providerCalled, false);
    assert.equal(records.revenueTasks.length, 1);
    assert.equal(records.approvalItems[0].status, "execution_blocked");
  });

  it("fails closed when executive memory logging fails after an approved CRM task action", async () => {
    const { db, records } = createMockDb();
    restoreServices = setApprovedExecutionLayerServicesForTest({
      db,
      memoryLogger: async () => ({ logged: false, eventId: null, reason: "memory unavailable" }),
    });
    const prepared = await prepareApprovedExecution({
      tenantId: "tenant-alpha",
      actionType: "create_crm_task",
      title: "Create approved CRM task",
      sourceLabel: "approved_execution_layer:test",
      payload: { title: "Review final approved work package" },
    });

    const result = await approveAndExecuteApprovedAction({
      tenantId: "tenant-alpha",
      approvalId: prepared.approvalItem.id,
      approvedBy: "ceo@example.com",
      note: "Approve one exact CRM task.",
    });

    assert.equal(result.ok, false);
    assert.equal(result.auditLogged, true);
    assert.equal(result.memoryLogged, false);
    assert.equal(result.result.status, "failed");
    assert.equal(result.result.blockedReason, "Executive memory write failed: memory unavailable");
    assert.equal(records.revenueTasks.length, 1);
    assert.equal(records.approvalItems[0].status, "execution_blocked");
  });
});
