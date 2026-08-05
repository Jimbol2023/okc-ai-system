import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  recordOperatingLoopTrace,
  recordOperatingLoopTraceFailClosed,
  setOperatingLoopTraceDbForTest,
} from "./operating-loop-trace";
import type { prisma } from "./prisma";

type MockRecord = {
  id?: string;
  [key: string]: unknown;
};

let restoreDb: (() => void) | undefined;

afterEach(() => {
  restoreDb?.();
  restoreDb = undefined;
});

function createMockTraceDb(options: { failWrites?: boolean } = {}) {
  const auditEvents: MockRecord[] = [];
  const db = {
    revenueAuditEvent: {
      async create(args: { data: MockRecord; select?: Record<string, boolean> }) {
        if (options.failWrites) throw new Error("trace write failed");
        const created = { ...args.data, id: `audit-${auditEvents.length + 1}` };
        auditEvents.push(created);

        if (!args.select) return created;

        return Object.fromEntries(Object.keys(args.select).map((key) => [key, created[key]]));
      },
    },
  };

  return { db: db as unknown as typeof prisma, auditEvents };
}

describe("operating loop trace", () => {
  it("records deterministic operating loop transitions with safety flags", async () => {
    const { db, auditEvents } = createMockTraceDb();
    restoreDb = setOperatingLoopTraceDbForTest(db);

    const trace = await recordOperatingLoopTrace({
      tenantId: "tenant-alpha",
      traceId: "trace-1",
      sourceStep: "daily_mission",
      targetStep: "ceo_decision",
      entityType: "AiCompanyExecutiveDirective",
      entityId: "campaign-001",
      status: "prepared",
      idempotencyKey: "campaign-001:daily-mission:decision",
      sourceLabel: "daily_mission:test",
    });

    assert.equal(trace.traceId, "trace-1");
    assert.equal(trace.providerCalled, false);
    assert.equal(trace.liveExecutionAllowed, false);
    assert.equal(auditEvents.length, 1);
    assert.equal(auditEvents[0].action, "operating_loop.daily_mission.ceo_decision");
    assert.equal(auditEvents[0].requestId, "campaign-001:daily-mission:decision");
  });

  it("fails closed when trace persistence is unavailable", async () => {
    const { db } = createMockTraceDb({ failWrites: true });
    restoreDb = setOperatingLoopTraceDbForTest(db);

    const trace = await recordOperatingLoopTraceFailClosed({
      tenantId: "tenant-alpha",
      sourceStep: "audit",
      targetStep: "memory",
      entityType: "RevenueAuditEvent",
      entityId: "audit-1",
      status: "failed",
      sourceLabel: "operating_loop:test",
    });

    assert.equal(trace, null);
  });
});
