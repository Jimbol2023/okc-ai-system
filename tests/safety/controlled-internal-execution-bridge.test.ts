import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  approveAndExecuteApprovedAction,
  prepareApprovedExecution,
  setApprovedExecutionLayerServicesForTest,
} from "@/lib/approved-execution-layer";
import {
  createControlledInternalExecutionOutcome,
  isControlledInternalExecutionAction,
} from "@/lib/controlled-execution-maturity";
import type { prisma } from "@/lib/prisma";

type MockRecord = {
  id?: string;
  [key: string]: unknown;
};

let restoreServices: (() => void) | undefined;

afterEach(() => {
  restoreServices?.();
  restoreServices = undefined;
});

function createMockDb() {
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
      async findFirst(args: { where: { sourceLabel?: string; status?: { in?: string[] }; payload?: { equals?: string } } }) {
        return (
          approvalItems.find((item) => {
            const payload = item.payload as { preparedAction?: { actionType?: string } } | undefined;
            const status = typeof item.status === "string" ? item.status : "";

            return (
              item.sourceLabel === args.where.sourceLabel &&
              (args.where.status?.in?.includes(status) ?? true) &&
              payload?.preparedAction?.actionType === args.where.payload?.equals
            );
          }) ?? null
        );
      },
      async findUnique(args: { where: { id: string } }) {
        return approvalItems.find((item) => item.id === args.where.id) ?? null;
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

describe("Sprint 7A controlled internal execution bridge", () => {
  it("allows only internal CRM task and note actions into the internal bridge", () => {
    assert.equal(isControlledInternalExecutionAction("create_crm_task"), true);
    assert.equal(isControlledInternalExecutionAction("create_crm_note"), true);
    assert.equal(isControlledInternalExecutionAction("send_email"), false);
    assert.equal(isControlledInternalExecutionAction("create_drive_doc"), false);
  });

  it("executes one CEO-approved internal CRM note without provider calls or RevenueTask mutation", async () => {
    const { db, records } = createMockDb();
    restoreServices = setApprovedExecutionLayerServicesForTest({
      db,
      memoryLogger: async () => ({ logged: true, eventId: "memory-1", reason: null }),
    });
    const prepared = await prepareApprovedExecution({
      actionType: "create_crm_note",
      title: "Record internal seller follow-up note",
      sourceLabel: "daily-revenue-operating-loop:work-order-1:create_crm_note",
      preparedBy: "CRM Manager AI",
      payload: {
        note: "CEO approved an internal note summarizing missing seller motivation data.",
        sourceWorkOrderId: "work-order-1",
        signalId: "signal-1",
        aiEmployee: "CRM Manager AI",
        department: "CRM",
        kpiAffected: ["follow_up_discipline"],
      },
    });

    const run = await approveAndExecuteApprovedAction({
      approvalId: prepared.approvalItem.id,
      approvedBy: "CEO",
      note: "Record internal note only.",
    });
    const outcome = createControlledInternalExecutionOutcome(run, {
      actionType: "create_crm_note",
      sourceLabel: "daily-revenue-operating-loop:work-order-1:create_crm_note",
      signalId: "signal-1",
      workOrderId: "work-order-1",
      aiEmployee: "CRM Manager AI",
      department: "CRM",
      kpiAffected: ["follow_up_discipline"],
    });

    assert.equal(run.ok, true);
    assert.equal(run.result.internalNoteCreated, true);
    assert.equal(run.result.providerCalled, false);
    assert.equal(run.result.sent, false);
    assert.equal(run.result.published, false);
    assert.equal(run.result.scheduled, false);
    assert.equal(records.revenueTasks.length, 0);
    assert.equal(records.auditEvents.some((event) => event.action === "approved_execution.create_crm_note"), true);
    assert.equal(records.approvalDecisions.length, 1);
    assert.equal(outcome.state, "internal_note_created");
    assert.equal(outcome.trace.noteId, "internal-crm-note:approval-1");
    assert.equal(outcome.trace.providerCalled, false);
    assert.equal(outcome.liveExecutionAllowed, false);
  });

  it("keeps approved CRM task execution internal and traceable", async () => {
    const { db, records } = createMockDb();
    restoreServices = setApprovedExecutionLayerServicesForTest({
      db,
      memoryLogger: async () => ({ logged: true, eventId: "memory-1", reason: null }),
    });
    const prepared = await prepareApprovedExecution({
      actionType: "create_crm_task",
      title: "Create follow-up task",
      sourceLabel: "daily-revenue-operating-loop:work-order-2:create_crm_task",
      preparedBy: "Follow-Up Coordinator AI",
      payload: {
        title: "Review seller follow-up readiness",
        sourceWorkOrderId: "work-order-2",
        signalId: "signal-2",
        assignedTo: "Follow-Up Coordinator AI",
        department: "Seller Acquisition",
        kpiAffected: ["seller_appointment_rate"],
      },
    });

    const run = await approveAndExecuteApprovedAction({
      approvalId: prepared.approvalItem.id,
      approvedBy: "CEO",
      note: "Approve one CRM task.",
    });
    const outcome = createControlledInternalExecutionOutcome(run, {
      actionType: "create_crm_task",
      sourceLabel: "daily-revenue-operating-loop:work-order-2:create_crm_task",
      signalId: "signal-2",
      workOrderId: "work-order-2",
      aiEmployee: "Follow-Up Coordinator AI",
      department: "Seller Acquisition",
      kpiAffected: ["seller_appointment_rate"],
    });

    assert.equal(run.ok, true);
    assert.equal(run.result.crmTaskCreated, true);
    assert.equal(run.result.providerCalled, false);
    assert.equal(records.revenueTasks.length, 1);
    assert.equal(outcome.state, "internal_task_created");
    assert.equal(outcome.trace.taskId, "task-1");
    assert.deepEqual(outcome.trace.kpiAffected, ["seller_appointment_rate"]);
  });
});
