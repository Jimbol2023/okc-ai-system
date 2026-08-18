import assert from "node:assert/strict";
import test from "node:test";

import type { PrismaClient } from "@/generated/prisma";
import { runAutonomousLeadQualification, setAutonomousLeadQualificationDbForTest } from "@/lib/autonomous-lead-qualification";
import { leadQualificationActionKey, leadQualificationLane } from "@/lib/autonomy-policy";
import type { StoredLead } from "@/lib/leads-storage";

const lead = { id: "lead-1", source: "website", score: 85, priority: "High", doNotContact: false, optOutReason: null } as StoredLead;

function fakeDb(options: { enabled?: boolean } = {}) {
  const writes: string[] = [];
  const tasks: Array<{ id: string; idempotencyKey: string }> = [];
  const policy = { tenantId: "default", policyKey: "lead-intake-qualification:create-crm-task:v1", lane: leadQualificationLane, actionKey: leadQualificationActionKey, maxAutonomyLevel: 2, effect: options.enabled ? "allow" : "deny", approvalRequired: !options.enabled, quotaPerDay: 50, killSwitchEnabled: !options.enabled, allowedActions: [leadQualificationActionKey], blockedActions: ["send_sms"], requiredEvidence: ["stored_lead", "source_attribution", "revenue_score", "no_dnc_or_opt_out"] };
  const tx = {
    autonomyPolicy: { findUnique: async () => policy },
    revenueTask: {
      count: async () => tasks.length,
      findUnique: async (args: { where: { tenantId_idempotencyKey: { idempotencyKey: string } } }) => tasks.find((item) => item.idempotencyKey === args.where.tenantId_idempotencyKey.idempotencyKey) ?? null,
      upsert: async (args: { create: { idempotencyKey: string } }) => { const found = tasks.find((item) => item.idempotencyKey === args.create.idempotencyKey); if (found) return found; writes.push("task"); const item = { id: "task-1", idempotencyKey: args.create.idempotencyKey }; tasks.push(item); return item; },
    },
    autonomousRunRecord: { findUnique: async () => tasks.length ? { id: "run-1" } : null, upsert: async () => { writes.push("run"); return { id: "run-1" }; }, update: async () => { writes.push("run-update"); return { id: "run-1" }; } },
    businessOutcomeEvent: { findUnique: async () => tasks.length ? { id: "outcome-1" } : null, upsert: async () => { writes.push("outcome"); return { id: "outcome-1" }; } },
    revenueAuditEvent: { create: async () => { writes.push("audit"); return { id: "audit-1" }; } },
    aiDepartmentMemoryEvent: { upsert: async () => { writes.push("memory"); return { id: "memory-1" }; } },
    connectorExecutionAttempt: { upsert: async () => { writes.push("connector-attempt"); return { id: "attempt-1" }; } },
  };
  const db = { ...tx, $transaction: async (callback: (client: typeof tx) => unknown) => callback(tx) } as unknown as PrismaClient;
  return { db, writes, tasks };
}

test("disabled policy performs zero writes", async () => {
  const state = fakeDb(); const restore = setAutonomousLeadQualificationDbForTest(state.db);
  try { const result = await runAutonomousLeadQualification({ tenantId: "default", lead, triggeredBy: "test" }); assert.equal(result.ok, false); assert.deepEqual(state.writes, []); } finally { restore(); }
});

test("DNC evidence failure performs zero writes", async () => {
  const state = fakeDb({ enabled: true }); const restore = setAutonomousLeadQualificationDbForTest(state.db);
  try { const result = await runAutonomousLeadQualification({ tenantId: "default", lead: { ...lead, doNotContact: true }, triggeredBy: "test" }); assert.equal(result.ok, false); assert.deepEqual(state.writes, []); } finally { restore(); }
});

test("authorized lane creates one task and retry creates no duplicate", async () => {
  const state = fakeDb({ enabled: true }); const restore = setAutonomousLeadQualificationDbForTest(state.db);
  try {
    const first = await runAutonomousLeadQualification({ tenantId: "default", lead, triggeredBy: "test" });
    const writesAfterFirst = [...state.writes];
    const second = await runAutonomousLeadQualification({ tenantId: "default", lead, triggeredBy: "test" });
    assert.equal(first.ok, true); assert.equal(second.ok, true); assert.equal(state.tasks.length, 1);
    assert.deepEqual(state.writes, writesAfterFirst);
    assert.equal(second.reason, "idempotent_replay");
    assert.equal(first.safety.providerCalled, false); assert.equal(first.safety.outreach, false); assert.equal(first.safety.liveExecutionAllowed, false);
  } finally { restore(); }
});
