import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { materializeRealLeadAcquisitionReview, setRealLeadMaterializerDbForTest } from "@/lib/real-lead-acquisition-review-materializer";

const restores: Array<() => void> = [];
afterEach(() => { while (restores.length) restores.pop()?.(); });

function fakeDb(overrides: { dnc?: boolean; id?: string; source?: string; sourceDetail?: string; auditFails?: boolean } = {}) {
  const tasks: Array<Record<string, unknown>> = [];
  const audits: Array<Record<string, unknown>> = [];
  const approvals: Array<Record<string, unknown>> = [];
  const lead = {
    id: overrides.id ?? "real-lead-1", tenantId: "default", source: overrides.source ?? "website_form", propertyAddress: "123 Main Street",
    payload: null, notes: null, createdAt: new Date("2026-08-06T12:00:00Z"), status: "new", approvalStatus: "pending_review",
    doNotContact: overrides.dnc ?? false, optOutReason: overrides.dnc ? "Seller requested no contact" : null, priority: "High",
    consentStatus: overrides.dnc ? "not_granted" : "affirmed", contactPermission: overrides.dnc ? "internal_review_only" : "contact_requested", consentSource: "public_seller_form", consentAt: new Date("2026-08-06T12:00:00Z"),
  };
  const tx = {
    lead: { findFirst: async (args: unknown) => { const where = (args as { where: { id: string; tenantId: string } }).where; return where.id === lead.id && where.tenantId === lead.tenantId ? lead : null; } },
    revenueLeadSource: { findFirst: async () => ({ source: lead.source, sourceDetail: overrides.sourceDetail ?? "owned website intake", sourceRecordId: "form-1", verified: true, createdAt: new Date(), id: "source-1" }) },
    revenueLeadScore: { findFirst: async () => null },
    revenueTask: {
      findUnique: async (args: unknown) => { const key = (args as { where: { tenantId_idempotencyKey: { tenantId: string; idempotencyKey: string } } }).where.tenantId_idempotencyKey; return tasks.find((task) => task.tenantId === key.tenantId && task.idempotencyKey === key.idempotencyKey) ?? null; },
      create: async (args: unknown) => { const data = (args as { data: Record<string, unknown> }).data; const task = { id: `task-${tasks.length + 1}`, ...data }; tasks.push(task); return task; },
    },
    revenueAuditEvent: { create: async (args: unknown) => { const data = (args as { data: Record<string, unknown> }).data; if (overrides.auditFails) throw new Error("audit_failed"); audits.push(data); return data; } },
    unifiedApprovalItem: { create: async (args: unknown) => { const data = (args as { data: Record<string, unknown> }).data; const item = { id: `approval-${approvals.length + 1}`, ...data }; approvals.push(item); return item; } },
  };
  const database = {
    revenueTask: tx.revenueTask,
    $transaction: async (work: (transaction: typeof tx) => Promise<unknown>) => {
      const taskCount = tasks.length; const auditCount = audits.length; const approvalCount = approvals.length;
      try { return await work(tx); } catch (error) { tasks.splice(taskCount); audits.splice(auditCount); approvals.splice(approvalCount); throw error; }
    },
  };
  return { database, tasks, audits, approvals };
}

describe("real lead acquisition review materializer", () => {
  it("creates one internal task and audit, then reuses it", async () => {
    const fake = fakeDb(); restores.push(setRealLeadMaterializerDbForTest(fake.database as never));
    const first = await materializeRealLeadAcquisitionReview({ tenantId: "default", leadId: "real-lead-1" });
    const retry = await materializeRealLeadAcquisitionReview({ tenantId: "default", leadId: "real-lead-1" });
    assert.equal(first.status, "created"); assert.equal(first.taskType, "acquisition_review"); assert.equal(retry.status, "reused");
    assert.equal(fake.tasks.length, 1); assert.equal(fake.audits.length, 1); assert.equal(fake.approvals.length, 1);
    for (const flag of ["providerCalled", "outreach", "sent", "published", "crmMutation", "externalExecutionAllowed", "liveExecutionAllowed"]) assert.equal(fake.tasks[0][flag], false);
  });

  it("excludes acceptance/test data and fails closed across tenants", async () => {
    const synthetic = fakeDb({ id: "acceptance-executive-autonomy-l1-lead" }); restores.push(setRealLeadMaterializerDbForTest(synthetic.database as never));
    assert.equal((await materializeRealLeadAcquisitionReview({ tenantId: "default", leadId: "acceptance-executive-autonomy-l1-lead" })).status, "excluded");
    assert.equal((await materializeRealLeadAcquisitionReview({ tenantId: "other", leadId: "acceptance-executive-autonomy-l1-lead" })).status, "blocked");
    assert.equal(synthetic.tasks.length, 0);
  });

  it("routes DNC to governance-only work and rolls back when audit persistence fails", async () => {
    const dnc = fakeDb({ dnc: true }); restores.push(setRealLeadMaterializerDbForTest(dnc.database as never));
    const result = await materializeRealLeadAcquisitionReview({ tenantId: "default", leadId: "real-lead-1" });
    assert.equal(result.taskType, "acquisition_governance_review"); assert.match(String(dnc.tasks[0].recommendedAction), /Do not contact/i);
    restores.pop()?.();
    const failing = fakeDb({ auditFails: true }); restores.push(setRealLeadMaterializerDbForTest(failing.database as never));
    await assert.rejects(materializeRealLeadAcquisitionReview({ tenantId: "default", leadId: "real-lead-1" }), /audit_failed/);
    assert.equal(failing.tasks.length, 0); assert.equal(failing.audits.length, 0); assert.equal(failing.approvals.length, 0);
  });

  it("rejects missing tenant before database access", async () => {
    await assert.rejects(materializeRealLeadAcquisitionReview({ tenantId: "", leadId: "real-lead-1" }), /tenant_id_required/);
  });
});
