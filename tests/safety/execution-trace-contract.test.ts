import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { assertExecutionTraceContract, buildExecutionTraceContract } from "@/lib/controlled-execution-maturity";

describe("Sprint 7 execution trace contract", () => {
  it("requires every internal task outcome to trace source, approval, task, employee, department, and KPI", () => {
    const trace = buildExecutionTraceContract({
      actionType: "create_crm_task",
      outcome: "internal_task_created",
      signalId: "signal-1",
      workOrderId: "work-order-1",
      approvalId: "approval-1",
      taskId: "task-1",
      aiEmployee: "CRM Manager AI",
      department: "CRM",
      kpiAffected: ["follow_up_discipline", "seller_appointment_rate"],
      sourceLabel: "daily-revenue-operating-loop:work-order-1",
    });

    assert.doesNotThrow(() => assertExecutionTraceContract(trace));
    assert.equal(trace.providerCalled, false);
    assert.equal(trace.sent, false);
    assert.equal(trace.published, false);
    assert.equal(trace.scheduled, false);
    assert.equal(trace.liveExecutionAllowed, false);
    assert.equal(trace.taskId, "task-1");
    assert.equal(trace.noteId, null);
  });

  it("fails closed when an executed internal task trace has no task ID", () => {
    const trace = buildExecutionTraceContract({
      actionType: "create_crm_task",
      outcome: "internal_task_created",
      approvalId: "approval-1",
      sourceLabel: "daily-revenue-operating-loop:work-order-1",
    });

    assert.throws(() => assertExecutionTraceContract(trace), /task ID/);
  });

  it("fails closed if a Sprint 7 trace claims external execution side effects", () => {
    const trace = {
      ...buildExecutionTraceContract({
        actionType: "create_crm_note",
        outcome: "internal_note_created",
        approvalId: "approval-1",
        noteId: "internal-crm-note:approval-1",
        sourceLabel: "daily-revenue-operating-loop:work-order-1",
      }),
      sent: true as false,
    };

    assert.throws(() => assertExecutionTraceContract(trace), /provider calls/);
  });
});
