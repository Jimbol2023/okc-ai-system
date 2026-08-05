import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { prepareApprovedExecution, setApprovedExecutionLayerServicesForTest } from "@/lib/approved-execution-layer";
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
    },
  };

  return {
    db: db as unknown as typeof prisma,
    records: { approvalItems },
  };
}

describe("Sprint 7B internal execution idempotency", () => {
  it("reuses an existing pending approval for the same source label and exact action", async () => {
    const { db, records } = createMockDb();
    restoreServices = setApprovedExecutionLayerServicesForTest({ db });
    const sourceLabel = "internal-execution:work-order-3:create_crm_task";

    const first = await prepareApprovedExecution({
      tenantId: "tenant-alpha",
      actionType: "create_crm_task",
      title: "Create internal task",
      sourceLabel,
      payload: {
        title: "Create internal task",
        workOrderId: "work-order-3",
      },
    });
    const second = await prepareApprovedExecution({
      tenantId: "tenant-alpha",
      actionType: "create_crm_task",
      title: "Create duplicate internal task",
      sourceLabel,
      payload: {
        title: "Create duplicate internal task",
        workOrderId: "work-order-3",
      },
    });

    assert.equal(first.approvalItem.id, "approval-1");
    assert.equal(second.approvalItem.id, "approval-1");
    assert.equal(records.approvalItems.length, 1);
    assert.equal(records.approvalItems[0].sourceLabel, sourceLabel);
  });

  it("does not reuse an approval when the exact action differs", async () => {
    const { db, records } = createMockDb();
    restoreServices = setApprovedExecutionLayerServicesForTest({ db });
    const sourceLabel = "internal-execution:work-order-4";

    const task = await prepareApprovedExecution({
      tenantId: "tenant-alpha",
      actionType: "create_crm_task",
      title: "Create internal task",
      sourceLabel,
      payload: { title: "Create internal task", workOrderId: "work-order-4" },
    });
    const note = await prepareApprovedExecution({
      tenantId: "tenant-alpha",
      actionType: "create_crm_note",
      title: "Create internal note",
      sourceLabel,
      payload: { note: "Create internal note.", workOrderId: "work-order-4" },
    });

    assert.equal(task.approvalItem.id, "approval-1");
    assert.equal(note.approvalItem.id, "approval-2");
    assert.equal(records.approvalItems.length, 2);
  });
});
