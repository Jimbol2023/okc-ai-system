import { prisma } from "@/lib/prisma";
import { createInitialDraftWorkspaceFields } from "@/lib/company-draft-workspace";
import { recordOperatingLoopTraceFailClosed, setOperatingLoopTraceDbForTest } from "@/lib/operating-loop-trace";
import {
  createDepartmentMemoryPlan,
  recordDepartmentMemoryEvents,
  refreshDepartmentIntelligenceSnapshots,
  type DepartmentMemoryWritableTx,
} from "@/lib/department-intelligence";
import {
  listExecutiveDirectives,
  ownerForOutput,
  type AiDepartmentName,
  type CeoDecisionType,
  type CompanyGoal,
  type DailyStartupActivationState,
  type ExecutiveDirective,
  type ExecutiveDirectiveStatus,
} from "@/lib/company-orchestrator";

const tenantId = "default";

export type CompanyDirectiveDecisionInput = {
  directiveId: string;
  decision: CeoDecisionType;
  note?: string;
  decidedBy?: string;
  reviewReminderAt?: string;
};

export type RevenuePriorityScore = {
  qualifiedLeadPotential: number;
  brandValue: number;
  speedToDraft: number;
  riskAdjustment: number;
  ceoWorkloadSaved: number;
  total: number;
};

export type CompanyActivationSnapshot = {
  directives: ExecutiveDirective[];
  assignments: DailyStartupActivationState["assignments"];
  draftQueueItems: DailyStartupActivationState["draftQueueItems"];
  latestDecision: DailyStartupActivationState["latestDecision"];
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type CompanyDirectiveDecisionResult = {
  ok: true;
  directive: ExecutiveDirective;
  previousStatus: string;
  resultingStatus: ExecutiveDirectiveStatus;
  workflowState: string;
  assignmentsCreated: number;
  draftQueueItemsCreated: number;
  assignmentsTotal: number;
  draftQueueItemsTotal: number;
  decisionLogged: true;
  unifiedApprovalLinked: true;
  providerCalled: false;
  sent: false;
  published: false;
  liveExecutionAllowed: false;
  safetyFlags: typeof safetyFlags;
};

export type InternalWorkStatus =
  | "pending_internal_work"
  | "in_progress"
  | "department_review"
  | "executive_review"
  | "ready_for_final_approval"
  | "completed_internal";

export type InternalWorkQueueItem = {
  id: string;
  itemType: "assignment" | "draft_queue_item";
  directiveId: string;
  department: AiDepartmentName;
  requestedOutputs: string[];
  status: string;
  blocker: string | null;
  sourceLabel: string;
  approvalRequired: true;
  providerCalled: false;
  sent: false;
  published: false;
  liveExecutionAllowed: false;
  safetyFlags: typeof safetyFlags;
};

export type InternalWorkQueueReport = {
  ok: true;
  queue: InternalWorkQueueItem[];
  totals: {
    assignments: number;
    draftQueueItems: number;
    readyForFinalApproval: number;
    completedInternal: number;
    blocked: number;
  };
  summary: string;
  approvalRequired: true;
  providerCalled: false;
  sent: false;
  published: false;
  scheduled: false;
  liveExecutionAllowed: false;
};

export type InternalWorkRunResult = {
  ok: true;
  ranAt: string;
  assignmentsAdvanced: number;
  draftQueueItemsAdvanced: number;
  directivesAdvanced: number;
  completedInternalCount: number;
  queue: InternalWorkQueueReport;
  approvalRequired: true;
  providerCalled: false;
  sent: false;
  published: false;
  scheduled: false;
  liveExecutionAllowed: false;
  safetyFlags: typeof safetyFlags;
};

export type DirectiveDecisionPlan = {
  resultingStatus: ExecutiveDirectiveStatus;
  workflowState: string;
  assignmentDepartments: AiDepartmentName[];
  draftOutputs: string[];
  revisionTaskRequired: boolean;
  safetyFlags: typeof safetyFlags;
};

const safetyFlags = {
  providerCalled: false,
  liveExecutionAllowed: false,
  published: false,
  sent: false,
  outreachBlocked: true,
  workflowExecutionBlocked: true,
  scrapingBlocked: true,
  adsBlocked: true,
  emailBlocked: true,
  smsBlocked: true,
} as const;

type ActivationRecord = {
  id: string;
  directiveId?: string;
  tenantId?: string;
  title?: string;
  businessGoal?: string;
  sourceDepartment?: string;
  assignedDepartments?: unknown;
  requestedOutputs?: unknown;
  status?: string;
  workflowState?: string;
  riskLevel?: ExecutiveDirective["risk_level"];
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
  body?: string;
  messaging?: string;
  cta?: string;
  metadata?: unknown;
  priority?: string;
  executiveSummary?: string;
  knowledgeTrace?: unknown;
  assumptions?: unknown;
  confidence?: number;
  approvalStatus?: string;
  revisionCount?: number;
  decision?: string;
  note?: string | null;
  resultingStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type ActivationDelegate<TRecord extends ActivationRecord> = {
  upsert(args: unknown): Promise<TRecord>;
  findMany(args?: unknown): Promise<TRecord[]>;
  findFirst(args?: unknown): Promise<TRecord | null>;
  findUnique(args: unknown): Promise<TRecord | null>;
  update(args: unknown): Promise<TRecord>;
  create(args: unknown): Promise<TRecord>;
  count(args: unknown): Promise<number>;
};

type ActivationTransaction = DepartmentMemoryWritableTx & {
  aiCompanyExecutiveDirective: ActivationDelegate<ActivationRecord>;
  aiCompanyWorkAssignment: ActivationDelegate<ActivationRecord>;
  aiCompanyDraftQueueItem: ActivationDelegate<ActivationRecord>;
  aiCompanyDecisionLog: ActivationDelegate<ActivationRecord>;
  unifiedApprovalItem: ActivationDelegate<ActivationRecord>;
};

type ActivationDb = Omit<typeof prisma, "$transaction"> &
  ActivationTransaction & {
    $transaction<TResult>(
      fn: (tx: ActivationTransaction) => Promise<TResult>,
      options?: { maxWait?: number; timeout?: number },
    ): Promise<TResult>;
  };

let db = prisma as unknown as ActivationDb;
const activationTransactionOptions = { maxWait: 10_000, timeout: 30_000 } as const;

export function setCompanyActivationDbForTest(testDb: ActivationDb) {
  const restoreTraceDb = setOperatingLoopTraceDbForTest(testDb as never);
  db = testDb;

  return () => {
    restoreTraceDb();
    db = prisma as unknown as ActivationDb;
  };
}

function asActivationRecord(record: unknown): ActivationRecord {
  return record as ActivationRecord;
}

function riskAdjustment(riskLevel: ExecutiveDirective["risk_level"]) {
  if (riskLevel === "low") return 18;
  if (riskLevel === "medium") return 12;

  return 6;
}

export function scoreExecutiveDirective(directive: ExecutiveDirective): RevenuePriorityScore {
  const isCampaign = directive.id === "campaign-001";
  const qualifiedLeadPotential = isCampaign || directive.business_goal === "generate_revenue" ? 28 : 16;
  const brandValue = directive.business_goal === "increase_brand_value" || isCampaign ? 22 : 14;
  const speedToDraft = directive.requested_outputs.length <= 6 ? 18 : 14;
  const ceoWorkloadSaved = directive.assigned_departments.length >= 4 ? 20 : 14;
  const risk = riskAdjustment(directive.risk_level);

  return {
    qualifiedLeadPotential,
    brandValue,
    speedToDraft,
    riskAdjustment: risk,
    ceoWorkloadSaved,
    total: qualifiedLeadPotential + brandValue + speedToDraft + risk + ceoWorkloadSaved,
  };
}

function toDirective(record: ActivationRecord): ExecutiveDirective {
  return {
    id: record.id,
    title: record.title ?? record.id,
    business_goal: record.businessGoal as CompanyGoal,
    source_department: record.sourceDepartment as AiDepartmentName,
    assigned_departments: record.assignedDepartments as AiDepartmentName[],
    requested_outputs: record.requestedOutputs as string[],
    approval_status: record.status as ExecutiveDirectiveStatus,
    approved_by: record.approvedBy ?? undefined,
    approved_at: record.approvedAt?.toISOString?.() ?? undefined,
    risk_level: record.riskLevel ?? "medium",
    expected_business_value: record.expectedBusinessValue ?? "Internal operating value requires CEO review.",
    governance_notes: record.governanceNotes as string[],
  };
}

function assignmentOutputs(directive: ExecutiveDirective, department: AiDepartmentName) {
  const outputs = directive.requested_outputs.filter((output) => ownerForOutput(output) === department);

  return outputs.length > 0 ? outputs : ["Internal preparation brief"];
}

function asStringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : fallback;
}

function sourceLabelForDirective(directiveId: string) {
  return `executive_directive:${directiveId}`;
}

function nextInternalWorkStatus(status?: string | null): InternalWorkStatus {
  if (status === "pending_internal_work") return "in_progress";
  if (status === "in_progress") return "department_review";
  if (status === "department_review") return "executive_review";
  if (status === "executive_review") return "ready_for_final_approval";

  return "completed_internal";
}

function toAssignmentQueueItem(record: ActivationRecord): InternalWorkQueueItem {
  const directiveId = record.directiveId ?? "";

  return {
    id: record.id,
    itemType: "assignment",
    directiveId,
    department: (record.department ?? "Executive AI") as AiDepartmentName,
    requestedOutputs: asStringArray(record.requestedOutputs, ["Internal preparation brief"]),
    status: record.status ?? "pending_internal_work",
    blocker: record.blocker ?? null,
    sourceLabel: sourceLabelForDirective(directiveId),
    approvalRequired: true,
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
    safetyFlags,
  };
}

function toDraftQueueItem(record: ActivationRecord): InternalWorkQueueItem {
  const directiveId = record.directiveId ?? "";
  const output = record.output ?? "Internal draft item";

  return {
    id: record.id,
    itemType: "draft_queue_item",
    directiveId,
    department: (record.ownerDepartment ?? "Executive AI") as AiDepartmentName,
    requestedOutputs: [output],
    status: record.status ?? "draft_required",
    blocker: "CEO final approval is still required before any public or external execution.",
    sourceLabel: record.sourceLabel ?? sourceLabelForDirective(directiveId),
    approvalRequired: true,
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
    safetyFlags,
  };
}

function nextStatusForDecision(decision: CeoDecisionType): ExecutiveDirectiveStatus {
  if (decision === "approve") return "executive_approved";
  if (decision === "request_changes") return "changes_requested";
  if (decision === "defer") return "deferred";

  return "rejected";
}

function workflowStateForDecision(decision: CeoDecisionType) {
  if (decision === "approve") return "draft_queue_populated";
  if (decision === "request_changes") return "changes_requested";
  if (decision === "defer") return "deferred";

  return "closed_rejected";
}

export function createDirectiveDecisionPlan(directive: ExecutiveDirective, decision: CeoDecisionType): DirectiveDecisionPlan {
  return {
    resultingStatus: nextStatusForDecision(decision),
    workflowState: workflowStateForDecision(decision),
    assignmentDepartments: decision === "approve" ? [...directive.assigned_departments] : [],
    draftOutputs: decision === "approve" ? [...directive.requested_outputs] : [],
    revisionTaskRequired: decision === "request_changes",
    safetyFlags,
  };
}

async function upsertUnifiedApprovalItem(tx: ActivationTransaction, directive: ExecutiveDirective, resultingStatus: ExecutiveDirectiveStatus) {
  const existing = await tx.unifiedApprovalItem.findFirst({
    where: {
      tenantId,
      sourceType: "executive_directive",
      sourceId: directive.id,
    },
  });
  const data = {
    tenantId,
    itemType: "ai_recommendation",
    sourceType: "executive_directive",
    sourceId: directive.id,
    title: directive.title,
    sourceLabel: "company_orchestrator",
    status: resultingStatus === "executive_approved" ? "approved" : resultingStatus === "rejected" ? "rejected" : "pending_review",
    riskLevel: directive.risk_level,
    requiredApprovals: ["CEO approval", "Brand review", "Security & Governance review", "CEO final approval"],
    connectorId: null,
    executionBlockedReason: "AI company activation is internal only; external execution remains blocked.",
    payload: {
      directiveId: directive.id,
      businessGoal: directive.business_goal,
      resultingStatus,
      safetyFlags,
    },
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
  };

  if (existing) {
    await tx.unifiedApprovalItem.update({
      where: { id: existing.id },
      data,
    });
    return;
  }

  await tx.unifiedApprovalItem.create({ data });
}

export async function upsertInitialExecutiveDirectives() {
  for (const directive of listExecutiveDirectives()) {
    await db.aiCompanyExecutiveDirective.upsert({
      where: { id: directive.id },
      create: {
        id: directive.id,
        tenantId,
        title: directive.title,
        businessGoal: directive.business_goal,
        sourceDepartment: directive.source_department,
        assignedDepartments: directive.assigned_departments,
        requestedOutputs: directive.requested_outputs,
        status: directive.approval_status,
        workflowState: directive.approval_status,
        riskLevel: directive.risk_level,
        expectedBusinessValue: directive.expected_business_value,
        governanceNotes: directive.governance_notes,
        revenuePriorityScore: scoreExecutiveDirective(directive),
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
      update: {
        title: directive.title,
        businessGoal: directive.business_goal,
        sourceDepartment: directive.source_department,
        assignedDepartments: directive.assigned_departments,
        requestedOutputs: directive.requested_outputs,
        riskLevel: directive.risk_level,
        expectedBusinessValue: directive.expected_business_value,
        governanceNotes: directive.governance_notes,
        revenuePriorityScore: scoreExecutiveDirective(directive),
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
    });
  }
}

export async function getCompanyActivationSnapshot(): Promise<CompanyActivationSnapshot> {
  await upsertInitialExecutiveDirectives();

  const [directives, assignments, draftQueueItems, latestDecision] = await Promise.all([
    db.aiCompanyExecutiveDirective.findMany({
      orderBy: [{ id: "asc" }],
    }),
    db.aiCompanyWorkAssignment.findMany({
      orderBy: [{ createdAt: "asc" }],
    }),
    db.aiCompanyDraftQueueItem.findMany({
      orderBy: [{ createdAt: "asc" }],
    }),
    db.aiCompanyDecisionLog.findFirst({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    directives: directives.map((record) => toDirective(asActivationRecord(record))),
    assignments: assignments.map((assignment) => ({
      id: assignment.id,
      directiveId: assignment.directiveId ?? "",
      department: assignment.department as AiDepartmentName,
      assignmentType: assignment.assignmentType ?? "department_work",
      requestedOutputs: assignment.requestedOutputs as string[],
      status: assignment.status ?? "pending_internal_work",
      blocker: assignment.blocker ?? null,
      approvalRequired: true,
    })),
    draftQueueItems: draftQueueItems.map((draft) => ({
      id: draft.id,
      directiveId: draft.directiveId ?? "",
      output: draft.output ?? "Internal draft item",
      ownerDepartment: draft.ownerDepartment as AiDepartmentName,
      status: draft.status ?? "draft_required",
      approvalRequired: true,
    })),
    latestDecision: latestDecision
      ? {
          decision: latestDecision.decision as CeoDecisionType,
          note: latestDecision.note ?? null,
          resultingStatus: latestDecision.resultingStatus as ExecutiveDirectiveStatus,
          createdAt: latestDecision.createdAt?.toISOString() ?? new Date().toISOString(),
        }
      : null,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export async function getInternalWorkQueue(): Promise<InternalWorkQueueReport> {
  await upsertInitialExecutiveDirectives();

  const [assignments, draftQueueItems] = await Promise.all([
    db.aiCompanyWorkAssignment.findMany({
      orderBy: [{ createdAt: "asc" }],
    }),
    db.aiCompanyDraftQueueItem.findMany({
      orderBy: [{ createdAt: "asc" }],
    }),
  ]);
  const assignmentItems = assignments.map((assignment) => toAssignmentQueueItem(asActivationRecord(assignment)));
  const draftItems = draftQueueItems.map((draft) => toDraftQueueItem(asActivationRecord(draft)));
  const queue = [...assignmentItems, ...draftItems];
  const readyForFinalApproval = queue.filter((item) => item.status === "ready_for_final_approval").length;
  const completedInternal = queue.filter((item) => item.status === "completed_internal").length;
  const blocked = queue.filter((item) => Boolean(item.blocker) && item.status !== "completed_internal").length;

  return {
    ok: true,
    queue,
    totals: {
      assignments: assignmentItems.length,
      draftQueueItems: draftItems.length,
      readyForFinalApproval,
      completedInternal,
      blocked,
    },
    summary:
      queue.length > 0
        ? `${queue.length} internal company work item(s) are visible. ${completedInternal} completed internally and ${readyForFinalApproval} ready for final approval.`
        : "No approved internal company work is visible yet. CEO approval is required before departments begin.",
    approvalRequired: true,
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
  };
}

function createInternalWorkPackage(record: ActivationRecord) {
  const outputs = asStringArray(record.requestedOutputs, ["Internal preparation brief"]);
  const department = record.department ?? "Executive AI";
  const lifecycle = [
    record.status ?? "pending_internal_work",
    nextInternalWorkStatus(record.status),
    "department_review",
    "executive_review",
    "ready_for_final_approval",
    "completed_internal",
  ];

  return {
    sourceLabel: sourceLabelForDirective(record.directiveId ?? ""),
    summary: `${department} completed internal preparation for ${outputs.join(", ")}.`,
    completedOutputs: outputs,
    lifecycle: [...new Set(lifecycle)],
    assumptions: [
      "Internal work completion means the department package is ready for CEO/final review only.",
      "No provider, outreach, publishing, scraping, ads, CRM mutation, or external workflow execution occurred.",
    ],
    safetyFlags,
  };
}

export async function runInternalCompanyWork(): Promise<InternalWorkRunResult> {
  await upsertInitialExecutiveDirectives();

  const ranAt = new Date().toISOString();
  const result = await db.$transaction(async (tx) => {
    const assignments = await tx.aiCompanyWorkAssignment.findMany({
      where: {
        status: {
          notIn: ["completed_internal", "changes_requested"],
        },
      },
      orderBy: [{ createdAt: "asc" }],
    });
    let assignmentsAdvanced = 0;
    let draftQueueItemsAdvanced = 0;
    const directiveIds = new Set<string>();

    for (const assignment of assignments) {
      const record = asActivationRecord(assignment);
      if (!record.directiveId) continue;
      directiveIds.add(record.directiveId);

      const workPackage = createInternalWorkPackage(record);
      await tx.aiCompanyWorkAssignment.update({
        where: { id: record.id },
        data: {
          status: "completed_internal",
          blocker: "Internal work package completed; CEO final approval is required before public or external execution.",
          providerCalled: false,
          sent: false,
          published: false,
          liveExecutionAllowed: false,
        },
      });
      assignmentsAdvanced += 1;

      await recordDepartmentMemoryEvents(tx, [
        {
          memoryKey: `directive:${record.directiveId}:internal-work:${record.department}`,
          department: (record.department ?? "Executive AI") as AiDepartmentName,
          directiveId: record.directiveId,
          assignmentId: record.id,
          eventType: "department_assignment",
          summary: workPackage.summary,
          lesson: "Approved CEO decisions now create completed internal department work packages before final approval.",
          recommendation: "Route the completed internal package to Executive AI and CEO final review without starting external execution.",
          metrics: {
            completedOutputCount: workPackage.completedOutputs.length,
            lifecycleStepCount: workPackage.lifecycle.length,
            providerCalled: false,
            liveExecutionAllowed: false,
          },
          evidenceLabels: [workPackage.sourceLabel, `department:${record.department ?? "Executive AI"}`, "sprint20_internal_work_engine"],
          confidence: 82,
          outcome: "approved_internal_workflow",
          assumptions: workPackage.assumptions,
        },
      ]);
    }

    const draftItems = await tx.aiCompanyDraftQueueItem.findMany({
      where: {
        directiveId: {
          in: [...directiveIds],
        },
      },
      orderBy: [{ createdAt: "asc" }],
    });

    for (const draft of draftItems) {
      const record = asActivationRecord(draft);
      if (record.status === "completed_internal" || record.status === "ready_for_final_approval") continue;

      await tx.aiCompanyDraftQueueItem.update({
        where: { id: record.id },
        data: {
          status: "ready_for_final_approval",
          approvalStatus: "pending_ceo_review",
          executiveSummary:
            `${record.output ?? "Internal draft item"} was prepared by ${record.ownerDepartment ?? "Executive AI"} and is ready for CEO final review. ` +
            "This internal completion does not authorize publishing, outreach, provider calls, scraping, CRM mutation, or workflow execution.",
          providerCalled: false,
          sent: false,
          published: false,
          liveExecutionAllowed: false,
        },
      });
      draftQueueItemsAdvanced += 1;
    }

    let directivesAdvanced = 0;
    for (const directiveId of directiveIds) {
      await tx.aiCompanyExecutiveDirective.update({
        where: { id: directiveId },
        data: {
          status: "ready_for_final_approval",
          workflowState: "ready_for_final_approval",
          providerCalled: false,
          sent: false,
          published: false,
          liveExecutionAllowed: false,
        },
      });
      directivesAdvanced += 1;
    }

    return {
      assignmentsAdvanced,
      draftQueueItemsAdvanced,
      directivesAdvanced,
    };
  }, activationTransactionOptions);

  void refreshDepartmentIntelligenceSnapshots().catch((error) => {
    console.error("Department Intelligence snapshot refresh failed closed:", error);
  });

  const queue = await getInternalWorkQueue();

  return {
    ok: true,
    ranAt,
    ...result,
    completedInternalCount: queue.totals.completedInternal,
    queue,
    approvalRequired: true,
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
    safetyFlags,
  };
}

export async function decideExecutiveDirective(input: CompanyDirectiveDecisionInput): Promise<CompanyDirectiveDecisionResult> {
  if ((input.decision === "reject" || input.decision === "request_changes") && !input.note?.trim()) {
    throw new Error("A note is required to reject or request changes.");
  }

  await upsertInitialExecutiveDirectives();

  const result: CompanyDirectiveDecisionResult = await db.$transaction(async (tx) => {
    const record = await tx.aiCompanyExecutiveDirective.findUnique({
      where: { id: input.directiveId },
    });

    if (!record) {
      throw new Error("Executive Directive not found.");
    }

    const directive = toDirective(record);
    const previousStatus = record.status ?? "awaiting_ceo_approval";
    const decisionPlan = createDirectiveDecisionPlan(directive, input.decision);
    const resultingStatus = decisionPlan.resultingStatus;
    const workflowState = decisionPlan.workflowState;
    const reviewReminderAt = input.reviewReminderAt ? new Date(input.reviewReminderAt) : null;

    await tx.aiCompanyExecutiveDirective.update({
      where: { id: input.directiveId },
      data: {
        status: resultingStatus,
        workflowState,
        reviewReminderAt,
        approvedBy: input.decision === "approve" ? input.decidedBy || "Moses Adebajo" : null,
        approvedAt: input.decision === "approve" ? new Date() : null,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
    });

    const beforeAssignments = await tx.aiCompanyWorkAssignment.count({ where: { directiveId: input.directiveId } });
    const beforeDrafts = await tx.aiCompanyDraftQueueItem.count({ where: { directiveId: input.directiveId } });

    if (input.decision === "approve") {
      for (const department of directive.assigned_departments) {
        await tx.aiCompanyWorkAssignment.upsert({
          where: {
            directiveId_department_assignmentType: {
              directiveId: input.directiveId,
              department,
              assignmentType: "department_work",
            },
          },
          create: {
            tenantId,
            directiveId: input.directiveId,
            department,
            assignmentType: "department_work",
            requestedOutputs: assignmentOutputs(directive, department),
            status: "pending_internal_work",
            blocker: "CEO final approval is still required before any public or external execution.",
            approvalRequired: true,
            providerCalled: false,
            sent: false,
            published: false,
            liveExecutionAllowed: false,
          },
          update: {
            requestedOutputs: assignmentOutputs(directive, department),
            status: "pending_internal_work",
            blocker: "CEO final approval is still required before any public or external execution.",
            approvalRequired: true,
            providerCalled: false,
            sent: false,
            published: false,
            liveExecutionAllowed: false,
          },
        });
        await recordOperatingLoopTraceFailClosed({
          tenantId,
          traceId: `directive:${input.directiveId}`,
          sourceStep: "ceo_decision",
          targetStep: "ai_coo_assignment",
          entityType: "AiCompanyWorkAssignment",
          entityId: `${input.directiveId}:${department}:department_work`,
          status: "prepared",
          idempotencyKey: `directive:${input.directiveId}:assignment:${department}`,
          sourceLabel: `executive_directive:${input.directiveId}`,
          metadata: {
            directiveId: input.directiveId,
            department,
            requestedOutputs: assignmentOutputs(directive, department),
          },
        });
        await recordOperatingLoopTraceFailClosed({
          tenantId,
          traceId: `directive:${input.directiveId}`,
          sourceStep: "ai_coo_assignment",
          targetStep: "department_work_order",
          entityType: "AiCompanyWorkAssignment",
          entityId: `${input.directiveId}:${department}:department_work`,
          status: "prepared",
          idempotencyKey: `directive:${input.directiveId}:work-order:${department}`,
          sourceLabel: `executive_directive:${input.directiveId}`,
          metadata: {
            directiveId: input.directiveId,
            department,
            approvalRequired: true,
          },
        });
      }

      for (const output of directive.requested_outputs) {
        const ownerDepartment = ownerForOutput(output);
        const sourceLabel = `executive_directive:${input.directiveId}`;
        const draftWorkspaceFields = createInitialDraftWorkspaceFields({
          output,
          ownerDepartment,
          directive: {
            id: directive.id,
            title: directive.title,
            businessGoal: directive.business_goal,
            expectedBusinessValue: directive.expected_business_value,
          },
          sourceLabel,
        });

        await tx.aiCompanyDraftQueueItem.upsert({
          where: {
            directiveId_output: {
              directiveId: input.directiveId,
              output,
            },
          },
          create: {
            tenantId,
            directiveId: input.directiveId,
            output,
            ownerDepartment,
            ...draftWorkspaceFields,
            status: "draft_required",
            sourceLabel,
            approvalRequired: true,
            providerCalled: false,
            sent: false,
            published: false,
            liveExecutionAllowed: false,
          },
          update: {
            ownerDepartment,
            title: draftWorkspaceFields.title,
            body: draftWorkspaceFields.body,
            messaging: draftWorkspaceFields.messaging,
            cta: draftWorkspaceFields.cta,
            metadata: draftWorkspaceFields.metadata,
            priority: draftWorkspaceFields.priority,
            businessGoal: draftWorkspaceFields.businessGoal,
            executiveSummary: draftWorkspaceFields.executiveSummary,
            knowledgeTrace: draftWorkspaceFields.knowledgeTrace,
            assumptions: draftWorkspaceFields.assumptions,
            confidence: draftWorkspaceFields.confidence,
            status: "draft_required",
            sourceLabel,
            approvalRequired: true,
            providerCalled: false,
            sent: false,
            published: false,
            liveExecutionAllowed: false,
          },
        });
        await recordOperatingLoopTraceFailClosed({
          tenantId,
          traceId: `directive:${input.directiveId}`,
          sourceStep: "department_work_order",
          targetStep: "draft_workspace",
          entityType: "AiCompanyDraftQueueItem",
          entityId: `${input.directiveId}:${output}`,
          status: "prepared",
          idempotencyKey: `directive:${input.directiveId}:draft:${output}`,
          sourceLabel,
          metadata: {
            directiveId: input.directiveId,
            ownerDepartment,
            output,
            artifactType: draftWorkspaceFields.metadata.artifactType,
            sourceConnectors: draftWorkspaceFields.metadata.sourceConnectors,
          },
        });
      }
    }

    if (input.decision === "request_changes") {
      await tx.aiCompanyWorkAssignment.upsert({
        where: {
          directiveId_department_assignmentType: {
            directiveId: input.directiveId,
            department: "Executive AI",
            assignmentType: "revision_task",
          },
        },
        create: {
          tenantId,
          directiveId: input.directiveId,
          department: "Executive AI",
          assignmentType: "revision_task",
          requestedOutputs: ["Revision task", "Executive summary update"],
          status: "changes_requested",
          blocker: input.note?.trim() || "CEO requested changes.",
          approvalRequired: true,
          providerCalled: false,
          sent: false,
          published: false,
          liveExecutionAllowed: false,
        },
        update: {
          requestedOutputs: ["Revision task", "Executive summary update"],
          status: "changes_requested",
          blocker: input.note?.trim() || "CEO requested changes.",
          approvalRequired: true,
          providerCalled: false,
          sent: false,
          published: false,
          liveExecutionAllowed: false,
        },
      });
    }

    await tx.aiCompanyDecisionLog.create({
      data: {
        tenantId,
        directiveId: input.directiveId,
        decision: input.decision,
        note: input.note?.trim() || null,
        decidedBy: input.decidedBy || "Moses Adebajo",
        previousStatus,
        resultingStatus,
        reviewReminderAt,
        safetyFlags,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
    });
    await recordOperatingLoopTraceFailClosed({
      tenantId,
      traceId: `directive:${input.directiveId}`,
      sourceStep: "daily_mission",
      targetStep: "ceo_decision",
      entityType: "AiCompanyExecutiveDirective",
      entityId: input.directiveId,
      status: input.decision === "approve" ? "completed" : input.decision === "reject" ? "blocked" : "prepared",
      idempotencyKey: `directive:${input.directiveId}:ceo-decision:${input.decision}`,
      sourceLabel: `executive_directive:${input.directiveId}`,
      metadata: {
        decision: input.decision,
        previousStatus,
        resultingStatus,
        decidedBy: input.decidedBy || "Moses Adebajo",
      },
    });

    await upsertUnifiedApprovalItem(tx, directive, resultingStatus);
    await recordDepartmentMemoryEvents(
      tx,
      createDepartmentMemoryPlan({
        directive,
        decision: input.decision,
        note: input.note,
      }),
    );

    const [updated, assignmentsTotal, draftQueueItemsTotal] = await Promise.all([
      tx.aiCompanyExecutiveDirective.findUnique({ where: { id: input.directiveId } }),
      tx.aiCompanyWorkAssignment.count({ where: { directiveId: input.directiveId } }),
      tx.aiCompanyDraftQueueItem.count({ where: { directiveId: input.directiveId } }),
    ]);

    return {
      ok: true,
      directive: toDirective(asActivationRecord(updated)),
      previousStatus,
      resultingStatus,
      workflowState,
      assignmentsCreated: assignmentsTotal - beforeAssignments,
      draftQueueItemsCreated: draftQueueItemsTotal - beforeDrafts,
      assignmentsTotal,
      draftQueueItemsTotal,
      decisionLogged: true,
      unifiedApprovalLinked: true,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
      safetyFlags,
    };
  }, activationTransactionOptions);

  void refreshDepartmentIntelligenceSnapshots().catch((error) => {
    console.error("Department Intelligence snapshot refresh failed closed:", error);
  });

  return result;
}
