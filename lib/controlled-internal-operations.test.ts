import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  parseControlledInternalOperationAction,
  runControlledInternalOperation,
  setControlledInternalOperationsDepsForTest,
} from "./controlled-internal-operations";

let restoreDeps: (() => void) | undefined;

afterEach(() => {
  restoreDeps?.();
  restoreDeps = undefined;
});

function setupMockDeps() {
  const briefingSnapshots: unknown[] = [];
  const memoryEvents: unknown[] = [];
  const auditEvents: unknown[] = [];

  restoreDeps = setControlledInternalOperationsDepsForTest({
    db: {
      dailyBriefingSnapshot: {
        async create(args: unknown) {
          briefingSnapshots.push(args);
          return { id: `briefing-${briefingSnapshots.length}` };
        },
      },
      aiDepartmentMemoryEvent: {
        async upsert(args: unknown) {
          memoryEvents.push(args);
          return { id: `memory-${memoryEvents.length}` };
        },
      },
    },
    async loadDashboard() {
      return {
        productionReadinessCommand: { status: "blocked" },
        dailyStartup: {
          companyOperatingMode: "daily_startup_ready",
          approval_queue_summary: { awaiting_ceo_approval: 3, ready_for_review: 4, blocked: 0 },
        },
        morningBrief: {
          summary: "Internal morning brief ready.",
          recommendedWorkOrder: ["Review CEO agenda", "Run internal work"],
        },
        departmentIntelligence: { summary: "Department memory ready." },
        todayPriorities: [{ label: "Draft queue" }],
        connectorActivation: { totals: { connected: 0, internalReady: 5, credentialsMissing: 2, dataGaps: 1 } },
        dataGaps: ["schema gate remains blocked for dry run"],
      } as never;
    },
    async refreshIntelligence() {
      return {
        departments: [
          { memoryStatus: "memory_started" },
          { memoryStatus: "no_memory" },
        ],
      } as never;
    },
    async logAudit(input: unknown) {
      auditEvents.push(input);
      return { id: `audit-${auditEvents.length}` } as never;
    },
  });

  return { briefingSnapshots, memoryEvents, auditEvents };
}

describe("controlled internal operations", () => {
  it("rejects unsupported actions", () => {
    assert.throws(() => parseControlledInternalOperationAction("send_email"), /Unsupported controlled internal operation/);
  });

  it("creates a daily briefing snapshot and audit entry without external execution", async () => {
    const { briefingSnapshots, auditEvents } = setupMockDeps();

    const result = await runControlledInternalOperation("generate_morning_brief");

    assert.equal(result.ok, true);
    assert.equal(result.createdRecordType, "DailyBriefingSnapshot");
    assert.equal(result.recordsCreated, 1);
    assert.equal(result.auditEntryCreated, true);
    assert.equal(briefingSnapshots.length, 1);
    assert.equal(auditEvents.length, 1);
    assert.equal(result.providerCalled, false);
    assert.equal(result.sent, false);
    assert.equal(result.published, false);
    assert.equal(result.crmMutation, false);
    assert.equal(result.outreach, false);
    assert.equal(result.scraping, false);
    assert.equal(result.externalExecutionAllowed, false);
    assert.equal(result.liveExecutionAllowed, false);
  });

  it("records executive memory and audit evidence without provider access", async () => {
    const { memoryEvents, auditEvents } = setupMockDeps();

    const result = await runControlledInternalOperation("record_executive_memory", "tenant-okc");
    const upsert = memoryEvents[0] as { where: { memoryKey: string }; create: { tenantId: string } };

    assert.equal(result.createdRecordType, "AiDepartmentMemoryEvent");
    assert.equal(result.auditEntryCreated, true);
    assert.equal(memoryEvents.length, 1);
    assert.match(upsert.where.memoryKey, /tenant-okc/);
    assert.equal(upsert.create.tenantId, "tenant-okc");
    assert.equal(auditEvents.length, 1);
    assert.equal(result.providerCalled, false);
    assert.equal(result.sent, false);
    assert.equal(result.published, false);
    assert.equal(result.externalExecutionAllowed, false);
  });

  it("refreshes internal intelligence snapshots without external execution", async () => {
    const { auditEvents } = setupMockDeps();

    const result = await runControlledInternalOperation("refresh_internal_intelligence");

    assert.equal(result.createdRecordType, "AiDepartmentIntelligenceSnapshot");
    assert.equal(result.recordsUpdated, 2);
    assert.equal(result.stateTransition, "internal_operational");
    assert.equal(result.auditEntryCreated, true);
    assert.equal(auditEvents.length, 1);
    assert.equal(result.providerCalled, false);
    assert.equal(result.sent, false);
    assert.equal(result.published, false);
    assert.equal(result.crmMutation, false);
    assert.equal(result.externalExecutionAllowed, false);
  });
});
