import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  createDirectiveDecisionPlan,
  decideExecutiveDirective,
  getInternalWorkQueue,
  runInternalCompanyWork,
  scoreExecutiveDirective,
  setCompanyActivationDbForTest,
} from "./company-activation";
import { createInitialDraftWorkspaceFields } from "./company-draft-workspace";
import { createInheritedPropertyCampaignDirective } from "./company-orchestrator";

type MockRecord = {
  id: string;
  tenantId?: string;
  directiveId?: string;
  title?: string;
  businessGoal?: string;
  sourceDepartment?: string;
  assignedDepartments?: unknown;
  requestedOutputs?: unknown;
  status?: string;
  workflowState?: string;
  riskLevel?: "low" | "medium" | "high";
  expectedBusinessValue?: string;
  governanceNotes?: unknown;
  approvedBy?: string | null;
  approvedAt?: Date | null;
  department?: string;
  assignmentType?: string;
  blocker?: string | null;
  output?: string;
  ownerDepartment?: string;
  sourceLabel?: string;
  approvalStatus?: string;
  executiveSummary?: string;
  decision?: string;
  note?: string | null;
  resultingStatus?: string;
  createdAt?: Date;
  [key: string]: unknown;
};

let restoreDb: (() => void) | undefined;

afterEach(() => {
  restoreDb?.();
  restoreDb = undefined;
});

function matchesWhere(record: MockRecord, where: Record<string, unknown> = {}) {
  return Object.entries(where).every(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const filter = value as { in?: unknown[]; notIn?: unknown[] };

      if (filter.in) return filter.in.includes(record[key]);
      if (filter.notIn) return !filter.notIn.includes(record[key]);
    }

    return record[key] === value;
  });
}

function createMockDb() {
  const directives: MockRecord[] = [];
  const assignments: MockRecord[] = [];
  const drafts: MockRecord[] = [];
  const decisions: MockRecord[] = [];
  const approvals: MockRecord[] = [];
  const auditEvents: MockRecord[] = [];
  const memoryEvents: MockRecord[] = [];
  const snapshots: MockRecord[] = [];

  function upsertById(collection: MockRecord[], args: { where: Record<string, unknown>; create: MockRecord; update: Partial<MockRecord> }) {
    const id = (args.where.id as string) ?? args.create.id;
    const index = collection.findIndex((item) => item.id === id);

    if (index >= 0) {
      collection[index] = { ...collection[index], ...args.update };
      return collection[index];
    }

    collection.push({ ...args.create, createdAt: new Date("2026-07-06T10:00:00.000Z") });
    return collection[collection.length - 1];
  }

  function createDelegate(collection: MockRecord[]) {
    return {
      async upsert(args: { where: Record<string, unknown>; create: MockRecord; update: Partial<MockRecord> }) {
        if (args.where.directiveId_department_assignmentType) {
          const key = args.where.directiveId_department_assignmentType as { directiveId: string; department: string; assignmentType: string };
          const index = collection.findIndex(
            (item) => item.directiveId === key.directiveId && item.department === key.department && item.assignmentType === key.assignmentType,
          );
          if (index >= 0) {
            collection[index] = { ...collection[index], ...args.update };
            return collection[index];
          }
        }

        if (args.where.directiveId_output) {
          const key = args.where.directiveId_output as { directiveId: string; output: string };
          const index = collection.findIndex((item) => item.directiveId === key.directiveId && item.output === key.output);
          if (index >= 0) {
            collection[index] = { ...collection[index], ...args.update };
            return collection[index];
          }
        }

        if (args.where.memoryKey) {
          const index = collection.findIndex((item) => item.memoryKey === args.where.memoryKey);
          if (index >= 0) {
            collection[index] = { ...collection[index], ...args.update };
            return collection[index];
          }
        }

        const created = { ...args.create, id: args.create.id ?? `${collection.length + 1}`, createdAt: new Date("2026-07-06T10:00:00.000Z") };
        collection.push(created);
        return created;
      },
      async findMany(args?: { where?: Record<string, unknown> }) {
        return args?.where ? collection.filter((item) => matchesWhere(item, args.where)) : [...collection];
      },
      async findFirst(args?: { where?: Record<string, unknown> }) {
        return (args?.where ? collection.find((item) => matchesWhere(item, args.where)) : collection[0]) ?? null;
      },
      async findUnique(args: { where: { id: string } }) {
        return collection.find((item) => item.id === args.where.id) ?? null;
      },
      async update(args: { where: { id: string }; data: Partial<MockRecord> }) {
        const index = collection.findIndex((item) => item.id === args.where.id);
        if (index < 0) throw new Error(`Record not found: ${args.where.id}`);
        collection[index] = { ...collection[index], ...args.data };
        return collection[index];
      },
      async create(args: { data: MockRecord }) {
        const created = { ...args.data, id: args.data.id ?? `${collection.length + 1}`, createdAt: new Date("2026-07-06T10:00:00.000Z") };
        collection.push(created);
        return created;
      },
      async count(args: { where?: Record<string, unknown> }) {
        return args.where ? collection.filter((item) => matchesWhere(item, args.where)).length : collection.length;
      },
    };
  }

  const mockDb = {
    aiCompanyExecutiveDirective: {
      ...createDelegate(directives),
      async upsert(args: { where: Record<string, unknown>; create: MockRecord; update: Partial<MockRecord> }) {
        return upsertById(directives, args);
      },
    },
    aiCompanyWorkAssignment: createDelegate(assignments),
    aiCompanyDraftQueueItem: createDelegate(drafts),
    aiCompanyDecisionLog: createDelegate(decisions),
    unifiedApprovalItem: createDelegate(approvals),
    revenueAuditEvent: createDelegate(auditEvents),
    aiDepartmentMemoryEvent: createDelegate(memoryEvents),
    aiDepartmentIntelligenceSnapshot: createDelegate(snapshots),
    async $transaction<TResult>(fn: (tx: unknown) => Promise<TResult>) {
      return fn(mockDb);
    },
  };

  restoreDb = setCompanyActivationDbForTest(mockDb as never);

  return { directives, assignments, drafts, memoryEvents, auditEvents };
}

describe("AI company activation", () => {
  it("scores Campaign 001 as a high-ROI internal directive", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const score = scoreExecutiveDirective(directive);

    assert.equal(score.qualifiedLeadPotential, 28);
    assert.equal(score.brandValue, 22);
    assert.ok(score.total >= 90);
  });

  it("plans approval as internal work assignment and draft queue generation only", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const plan = createDirectiveDecisionPlan(directive, "approve");

    assert.equal(plan.resultingStatus, "executive_approved");
    assert.equal(plan.workflowState, "draft_queue_populated");
    assert.deepEqual(plan.assignmentDepartments, directive.assigned_departments);
    assert.deepEqual(plan.draftOutputs, directive.requested_outputs);
    assert.equal(plan.revisionTaskRequired, false);
    assert.equal(plan.safetyFlags.providerCalled, false);
    assert.equal(plan.safetyFlags.liveExecutionAllowed, false);
    assert.equal(plan.safetyFlags.published, false);
    assert.equal(plan.safetyFlags.sent, false);
    assert.equal(plan.safetyFlags.outreachBlocked, true);
    assert.equal(plan.safetyFlags.workflowExecutionBlocked, true);
    assert.equal(plan.safetyFlags.scrapingBlocked, true);
    assert.equal(plan.safetyFlags.adsBlocked, true);
    assert.equal(plan.safetyFlags.emailBlocked, true);
    assert.equal(plan.safetyFlags.smsBlocked, true);
  });

  it("creates internal-only draft workspace fields for activation draft queue items", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const fields = createInitialDraftWorkspaceFields({
      output: directive.requested_outputs[0],
      ownerDepartment: directive.assigned_departments[0],
      directive: {
        id: directive.id,
        title: directive.title,
        businessGoal: directive.business_goal,
        expectedBusinessValue: directive.expected_business_value,
      },
      sourceLabel: `executive_directive:${directive.id}`,
    });

    assert.ok(fields.title.includes(directive.requested_outputs[0]));
    assert.equal(fields.approvalStatus, "pending_ceo_review");
    assert.equal(fields.revisionCount, 0);
    assert.equal(fields.metadata.sourceLabel, "executive_directive:campaign-001");
    assert.ok(fields.knowledgeTrace.some((entry) => entry.type === "knowledge_pack"));
    assert.ok(fields.knowledgeTrace.some((entry) => entry.type === "source_registry_entry"));
    assert.ok(fields.executiveSummary.includes("External execution remains blocked"));
    assert.equal(fields.metadata.approvalRequired, true);
    assert.equal(fields.metadata.providerCalled, false);
    assert.equal(fields.metadata.liveExecutionAllowed, false);
  });

  it("routes request changes back to Executive AI without creating drafts", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const plan = createDirectiveDecisionPlan(directive, "request_changes");

    assert.equal(plan.resultingStatus, "changes_requested");
    assert.equal(plan.workflowState, "changes_requested");
    assert.deepEqual(plan.assignmentDepartments, []);
    assert.deepEqual(plan.draftOutputs, []);
    assert.equal(plan.revisionTaskRequired, true);
    assert.equal(plan.safetyFlags.providerCalled, false);
  });

  it("rejects and defers directives without activating departments", () => {
    const directive = createInheritedPropertyCampaignDirective();
    const rejected = createDirectiveDecisionPlan(directive, "reject");
    const deferred = createDirectiveDecisionPlan(directive, "defer");

    assert.equal(rejected.resultingStatus, "rejected");
    assert.equal(rejected.workflowState, "closed_rejected");
    assert.deepEqual(rejected.assignmentDepartments, []);
    assert.deepEqual(rejected.draftOutputs, []);

    assert.equal(deferred.resultingStatus, "deferred");
    assert.equal(deferred.workflowState, "deferred");
    assert.deepEqual(deferred.assignmentDepartments, []);
    assert.deepEqual(deferred.draftOutputs, []);
    assert.equal(deferred.safetyFlags.liveExecutionAllowed, false);
  });

  it("makes approved CEO decisions visible in the internal work queue", async () => {
    createMockDb();

    const decision = await decideExecutiveDirective({
      directiveId: "campaign-001",
      decision: "approve",
      note: "Go live internally.",
      decidedBy: "ceo@example.com",
    });
    const queue = await getInternalWorkQueue();

    assert.equal(decision.resultingStatus, "executive_approved");
    assert.ok(decision.assignmentsTotal > 0);
    assert.ok(decision.draftQueueItemsTotal > 0);
    assert.ok(queue.queue.length > 0);
    assert.ok(queue.totals.assignments > 0);
    assert.ok(queue.totals.draftQueueItems > 0);
    assert.ok(queue.queue.some((item) => item.directiveId === "campaign-001" && item.itemType === "assignment"));
    assert.ok(queue.queue.some((item) => item.directiveId === "campaign-001" && item.itemType === "draft_queue_item"));
    assert.equal(queue.approvalRequired, true);
    assert.ok(queue.queue.every((item) => item.approvalRequired === true));
    assert.ok(queue.queue.every((item) => item.sourceLabel.length > 0));
    assert.equal(queue.providerCalled, false);
    assert.equal(queue.sent, false);
    assert.equal(queue.published, false);
    assert.equal(queue.liveExecutionAllowed, false);
  });

  it("runs approved internal company work to completed internal review without external execution", async () => {
    const { assignments, drafts, memoryEvents } = createMockDb();

    await decideExecutiveDirective({
      directiveId: "campaign-001",
      decision: "approve",
      note: "Prepare internal department work.",
      decidedBy: "ceo@example.com",
    });

    const run = await runInternalCompanyWork();

    assert.equal(run.ok, true);
    assert.ok(run.assignmentsAdvanced > 0);
    assert.ok(run.draftQueueItemsAdvanced > 0);
    assert.ok(run.directivesAdvanced > 0);
    assert.ok(run.completedInternalCount > 0);
    assert.ok(assignments.every((assignment) => assignment.status === "completed_internal"));
    assert.ok(drafts.every((draft) => draft.status === "ready_for_final_approval"));
    assert.ok(memoryEvents.some((event) => String(event.memoryKey).includes("internal-work")));
    assert.equal(run.providerCalled, false);
    assert.equal(run.sent, false);
    assert.equal(run.published, false);
    assert.equal(run.scheduled, false);
    assert.equal(run.liveExecutionAllowed, false);
    assert.equal(run.approvalRequired, true);
    assert.equal(run.safetyFlags.providerCalled, false);
    assert.equal(run.safetyFlags.liveExecutionAllowed, false);
    assert.equal(run.safetyFlags.workflowExecutionBlocked, true);
  });

  it("does not activate department production work for rejected or deferred directives", async () => {
    const rejectedDb = createMockDb();

    await decideExecutiveDirective({
      directiveId: "campaign-001",
      decision: "reject",
      note: "Not aligned.",
      decidedBy: "ceo@example.com",
    });

    assert.equal(rejectedDb.assignments.length, 0);
    assert.equal(rejectedDb.drafts.length, 0);

    const deferredDb = createMockDb();

    await decideExecutiveDirective({
      directiveId: "campaign-001",
      decision: "defer",
      note: "Later.",
      decidedBy: "ceo@example.com",
    });

    assert.equal(deferredDb.assignments.length, 0);
    assert.equal(deferredDb.drafts.length, 0);
  });

  it("routes request changes only to Executive AI revision work", async () => {
    const { assignments, drafts } = createMockDb();

    await decideExecutiveDirective({
      directiveId: "campaign-001",
      decision: "request_changes",
      note: "Tighten the campaign package.",
      decidedBy: "ceo@example.com",
    });

    assert.equal(assignments.length, 1);
    assert.equal(assignments[0].department, "Executive AI");
    assert.equal(assignments[0].assignmentType, "revision_task");
    assert.equal(assignments[0].status, "changes_requested");
    assert.equal(drafts.length, 0);
  });
});
