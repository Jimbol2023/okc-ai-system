import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type CeoExceptionProjectionInput,
  getCeoExceptionInbox,
  projectCeoExceptionInbox,
  setCeoExceptionInboxDbForTest,
} from "@/lib/ceo-exception-inbox";

const now = new Date("2026-08-06T18:00:00.000Z");

function input(overrides: Partial<CeoExceptionProjectionInput> = {}): CeoExceptionProjectionInput {
  return {
    tenantId: "default",
    now,
    leads: [],
    tasks: [],
    approvals: [],
    drafts: [],
    draftRevisions: [],
    directives: [],
    assignments: [],
    audits: [],
    ...overrides,
  };
}

function lead(id = "lead-real-1", tenantId = "default", doNotContact = false) {
  return {
    id,
    tenantId,
    source: "operator_referral",
    propertyAddress: "4100 Meridian Avenue",
    notes: "Seller requested an internal property review.",
    doNotContact,
    optOutReason: doNotContact ? "Owner requested no contact" : null,
    consentStatus: doNotContact ? "not_granted" : "affirmed",
    contactPermission: doNotContact ? "internal_review_only" : "contact_requested",
    consentSource: "seller_web_form",
    consentAt: now,
  };
}

function task(id = "task-1", leadId = "lead-real-1", taskType = "acquisition_review", tenantId = "default") {
  return {
    id,
    tenantId,
    leadId,
    title: "Acquisition review",
    taskType,
    status: "open",
    recommendedAction: "Review internal acquisition evidence.",
    reason: "A verified tenant-owned lead is ready for internal review.",
    idempotencyKey: `acquisition-review-v1:${tenantId}:${leadId}`,
    materializationVersion: "acquisition-review-v1",
    sourceProvenance: { source: "operator_referral", sourceDetail: "operator-entered referral", verified: true },
    missingEvidence: ["verified_arv"],
    contactPosture: { externalContactAuthorized: false },
    providerCalled: false,
    outreach: false,
    sent: false,
    published: false,
    crmMutation: false,
    externalExecutionAllowed: false,
    liveExecutionAllowed: false,
    createdAt: now,
  };
}

function approval(
  id = "approval-1",
  sourceId: string | null = "task-1",
  itemType = "acquisition_review_packet",
  tenantId = "default",
  leadId = "lead-real-1",
  requestId = "acquisition-review-v1:default:lead-real-1",
) {
  return {
    id,
    tenantId,
    itemType,
    sourceType: "executive_autonomy_l1:real_lead_materializer:v1",
    sourceId,
    title: "CEO acquisition review",
    sourceLabel: "operator_referral:lead-real-1",
    status: "pending_review",
    riskLevel: "high",
    executionBlockedReason: "Internal evidence review only; execution remains blocked.",
    payload: {
      leadId, taskId: sourceId, taskAuditRequestId: requestId, missingEvidence: ["verified_arv"],
      providerCalled: false, outreach: false, sent: false, published: false, scraping: false, crmMutation: false, externalExecutionAllowed: false, liveExecutionAllowed: false,
    },
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
    createdAt: now,
  };
}

function audit(taskId = "task-1", requestId = "acquisition-review-v1:default:lead-real-1", tenantId = "default", leadId = "lead-real-1", approvalItemId = "approval-1") {
  return {
    tenantId, action: "real_lead_acquisition_review_materialized", targetId: taskId, requestId, result: "success",
    safeMetadata: {
      leadId, taskId, approvalItemId, idempotencyKey: requestId,
      providerCalled: false, outreach: false, sent: false, published: false, scraping: false, crmMutation: false, externalExecutionAllowed: false, liveExecutionAllowed: false,
    },
  };
}

describe("CEO Exception Inbox projection", () => {
  it("requires tenant context before database access", async () => {
    let calls = 0;
    const findMany = async () => { calls += 1; return []; };
    const restore = setCeoExceptionInboxDbForTest({
      lead: { findMany }, revenueTask: { findMany }, unifiedApprovalItem: { findMany },
      aiCompanyDraftQueueItem: { findMany }, aiCompanyDraftRevision: { findMany },
      aiCompanyExecutiveDirective: { findMany }, aiCompanyWorkAssignment: { findMany },
      revenueAuditEvent: { findMany },
    } as never);
    try {
      await assert.rejects(() => getCeoExceptionInbox({ tenantId: "" }), /tenant/i);
      assert.equal(calls, 0);
    } finally {
      restore();
    }
  });

  it("applies the authenticated tenant to every database query", async () => {
    const whereClauses: unknown[] = [];
    const findMany = async (args: unknown) => {
      whereClauses.push((args as { where: unknown }).where);
      return [];
    };
    const restore = setCeoExceptionInboxDbForTest({
      lead: { findMany }, revenueTask: { findMany }, unifiedApprovalItem: { findMany },
      aiCompanyDraftQueueItem: { findMany }, aiCompanyDraftRevision: { findMany },
      aiCompanyExecutiveDirective: { findMany }, aiCompanyWorkAssignment: { findMany },
      revenueAuditEvent: { findMany },
    } as never);
    try {
      const result = await getCeoExceptionInbox({ tenantId: "tenant-alpha", now });
      assert.equal(result.tenantId, "tenant-alpha");
      assert.equal(whereClauses.length, 8);
      assert.ok(whereClauses.every((where) => assert.deepEqual(where, { tenantId: "tenant-alpha" }) === undefined));
    } finally {
      restore();
    }
  });

  it("returns the exact no-action state with a zero-minute review budget", () => {
    const result = projectCeoExceptionInbox(input());
    assert.equal(result.status, "no_action_required");
    assert.equal(result.estimatedReviewMinutes, 0);
    assert.deepEqual(result.items, []);
    assert.equal(result.safety.readOnly, true);
    assert.equal(result.safety.externalExecutionAllowed, false);
  });

  it("includes one complete acquisition review and uses a stable date-independent key", () => {
    const data = input({ leads: [lead()], tasks: [task()], approvals: [approval()], audits: [audit()] });
    const first = projectCeoExceptionInbox(data);
    const nextDay = projectCeoExceptionInbox({ ...data, now: new Date("2026-08-07T18:00:00.000Z") });
    assert.equal(first.items[0]?.exceptionType, "acquisition_review");
    assert.equal(first.items[0]?.canonicalKey, "default:acquisition_review:task-1:v1");
    assert.equal(nextDay.items[0]?.canonicalKey, first.items[0]?.canonicalKey);
    assert.equal(first.estimatedReviewMinutes, 3);
    assert.equal(first.items[0]?.auditStatus, "complete");
  });

  it("routes a real DNC lead to governance-only review", () => {
    const dncTask = task("task-dnc", "lead-dnc", "acquisition_governance_review");
    const result = projectCeoExceptionInbox(input({
      leads: [lead("lead-dnc", "default", true)],
      tasks: [dncTask],
      approvals: [approval("approval-dnc", "task-dnc", "acquisition_review_packet", "default", "lead-dnc", dncTask.idempotencyKey!)],
      audits: [audit("task-dnc", dncTask.idempotencyKey!, "default", "lead-dnc", "approval-dnc")],
    }));
    assert.equal(result.items[0]?.exceptionType, "dnc_governance_review");
    assert.equal(result.items[0]?.reviewMinutes, 2);
    assert.match(result.items[0]?.decisionRequested ?? "", /DNC governance/i);
    assert.equal(result.items[0]?.contactPosture.doNotContact, true);
  });

  it("fails closed on cross-tenant acquisition linkage", () => {
    const result = projectCeoExceptionInbox(input({
      leads: [lead("lead-real-1", "tenant-beta")],
      tasks: [task()],
      approvals: [approval()],
      audits: [audit()],
    }));
    assert.equal(result.items.length, 0);
    assert.equal(result.excludedCounts.nonActionableItemsExcluded, 1);
  });

  it("excludes every bounded synthetic marker", () => {
    for (const marker of ["acceptance", "test", "synthetic", "demo", "fixture", "sample", "seed", "seeded"]) {
      const synthetic = approval(`approval-${marker}`, null, "lead_recommendation");
      synthetic.sourceType = `executive_${marker}`;
      synthetic.payload = { leadId: `lead-${marker}` };
      const result = projectCeoExceptionInbox(input({ approvals: [synthetic] }));
      assert.equal(result.items.length, 0, marker);
      assert.equal(result.excludedCounts.syntheticItemsExcluded, 1, marker);
    }
  });

  it("matches the audited current Production-shaped exclusions", () => {
    const createdAt = new Date("2026-07-05T01:00:00.000Z");
    const syntheticApprovals = Array.from({ length: 4 }, (_, index) => ({
      ...approval(`synthetic-${index}`, `acceptance-executive-autonomy-l1-lead`, "lead_recommendation"),
      sourceType: "executive_autonomy_l1",
      sourceLabel: "acceptance daily run",
      payload: { leadId: "acceptance-executive-autonomy-l1-lead" },
    }));
    const directives = [
      ["campaign-001", "Inherited Property Campaign", "generate_revenue"],
      ["brand", "Brand Readiness Review", "improve_brand"],
      ["content", "Content Refresh Review", "improve_content"],
      ["source", "Lead Source Quality Review", "improve_sources"],
    ].map(([id, title, businessGoal]) => ({ id, tenantId: "default", title, objective: title, businessGoal, status: "awaiting_ceo_approval", approvalStatus: "awaiting_ceo_approval", workflowState: "awaiting_ceo_approval", createdAt }));
    const drafts = Array.from({ length: 18 }, (_, index) => ({
      id: `draft-${index}`, tenantId: "default", directiveId: "campaign-001", title: `Draft ${index}`, output: `Output ${index}`, ownerDepartment: "Marketing AI",
      status: "ready_for_final_approval", approvalStatus: "pending_ceo_review", priority: "normal", businessGoal: "generate_revenue", sourceLabel: "executive_directive:campaign-001",
      providerCalled: false, sent: false, published: false, liveExecutionAllowed: false, createdAt,
    }));
    const result = projectCeoExceptionInbox(input({
      approvals: syntheticApprovals,
      directives,
      drafts,
      assignments: Array.from({ length: 8 }, () => ({ tenantId: "default", status: "completed_internal" })),
    }));
    assert.equal(result.status, "no_action_required");
    assert.equal(result.excludedCounts.syntheticItemsExcluded, 4);
    assert.equal(result.excludedCounts.staleDraftsExcluded, 18);
    assert.equal(result.excludedCounts.historicalAssignmentsExcluded, 8);
    assert.equal(result.excludedCounts.readinessDirectivesExcluded, 3);
    assert.equal(result.excludedCounts.legacyCampaignDirectiveExcluded, 1);
  });

  it("does not let an orchestration touch refresh a stale draft", () => {
    const staleDate = new Date("2026-07-01T00:00:00.000Z");
    const directive = { id: "campaign-old", tenantId: "default", title: "Seller Education Campaign", objective: "Educate sellers", businessGoal: "generate_revenue", status: "ready_for_final_approval", approvalStatus: "awaiting_ceo_approval", workflowState: "ready_for_final_approval", createdAt: staleDate };
    const draft = { id: "draft-old", tenantId: "default", directiveId: directive.id, title: "Seller guide", output: "Website draft", ownerDepartment: "Marketing AI", status: "ready_for_final_approval", approvalStatus: "pending_ceo_review", priority: "normal", businessGoal: "generate_revenue", sourceLabel: "executive_directive:campaign-old", providerCalled: false, sent: false, published: false, liveExecutionAllowed: false, createdAt: staleDate };
    const result = projectCeoExceptionInbox(input({ directives: [directive], drafts: [draft], draftRevisions: [{ tenantId: "default", draftQueueItemId: draft.id, action: "scheduled_orchestration_touch", createdAt: now }] }));
    assert.equal(result.items.length, 0);
    assert.equal(result.excludedCounts.staleDraftsExcluded, 1);
  });

  it("includes a fresh substantively revised business draft", () => {
    const directive = { id: "campaign-new", tenantId: "default", title: "Property Seller Campaign", objective: "Support active seller education", businessGoal: "generate_revenue", status: "ready_for_final_approval", approvalStatus: "awaiting_ceo_approval", workflowState: "ready_for_final_approval", createdAt: now };
    const draft = { id: "draft-new", tenantId: "default", directiveId: directive.id, title: "Seller guide", output: "Website draft", ownerDepartment: "Marketing AI", status: "ready_for_final_approval", approvalStatus: "pending_ceo_review", priority: "normal", businessGoal: "generate_revenue", sourceLabel: "executive_directive:campaign-new", providerCalled: false, sent: false, published: false, liveExecutionAllowed: false, createdAt: new Date("2026-06-01T00:00:00.000Z") };
    const result = projectCeoExceptionInbox(input({ directives: [directive], drafts: [draft], draftRevisions: [{ tenantId: "default", draftQueueItemId: draft.id, action: "content_revision", createdAt: now }] }));
    assert.equal(result.items[0]?.exceptionType, "fresh_business_draft");
    assert.equal(result.items[0]?.reviewMinutes, 1);
  });

  it("deduplicates acquisition packets and excludes resolved approvals", () => {
    const resolved = { ...approval("resolved", "task-1", "lead_recommendation"), status: "approved" };
    const result = projectCeoExceptionInbox(input({
      leads: [lead()], tasks: [task()], approvals: [approval(), approval("approval-duplicate"), resolved], audits: [audit()],
    }));
    assert.equal(result.items.length, 1);
    assert.equal(result.excludedCounts.duplicateDecisionPacketsExcluded, 1);
    assert.equal(result.excludedCounts.resolvedApprovalsExcluded, 1);
  });

  it("includes tenant-linked evidence and exact-action approvals but grants no execution authority", () => {
    const evidence = approval("evidence-1", "lead-real-1", "evidence_review");
    evidence.payload = { missingEvidence: ["title_evidence"], recommendedDecision: "Choose whether to pause internal analysis." };
    const exact = approval("exact-1", "lead-real-1", "approved_execution");
    exact.sourceType = "approved_execution_layer";
    exact.payload = { preparedAction: { actionType: "create_crm_task", payload: { sourceWorkOrderId: "task-1" } } };
    const result = projectCeoExceptionInbox(input({ leads: [lead()], tasks: [task()], approvals: [evidence, exact] }));
    assert.deepEqual(result.items.map((item) => item.exceptionType), ["evidence_blocker", "exact_external_action"]);
    assert.ok(result.items.every((item) => item.externalActionAuthorized === false));
    assert.equal(result.safety.providerCalled, false);
  });

  it("caps the agenda at seven minutes and defers lower-priority decisions", () => {
    const leads = [lead("lead-a"), lead("lead-b"), lead("lead-c")];
    const tasks = leads.map((record, index) => task(`task-${index}`, record.id));
    const approvals = tasks.map((record, index) => approval(`approval-${index}`, record.id, "acquisition_review_packet", "default", record.leadId!, record.idempotencyKey!));
    const audits = tasks.map((record, index) => audit(record.id, record.idempotencyKey!, "default", record.leadId!, `approval-${index}`));
    const result = projectCeoExceptionInbox(input({ leads, tasks, approvals, audits }));
    assert.equal(result.items.length, 2);
    assert.equal(result.estimatedReviewMinutes, 6);
    assert.equal(result.excludedCounts.reviewBudgetDeferred, 1);
    assert.ok(result.estimatedReviewMinutes <= 7);
  });
});
