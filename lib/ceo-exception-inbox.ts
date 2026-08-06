import { prisma } from "@/lib/prisma";
import { hasSyntheticOrTestMarkers, internalOnlySafetyProof } from "@/lib/real-lead-acquisition-review-materializer";
import { requireTenantId } from "@/lib/tenant-context";

export const CEO_EXCEPTION_DECISION_VERSION = "v1";
export const CEO_EXCEPTION_MAX_ITEMS = 5;
export const CEO_EXCEPTION_MAX_REVIEW_MINUTES = 7;
export const CEO_EXCEPTION_FRESHNESS_DAYS = 30;

export type CeoExceptionType =
  | "acquisition_review"
  | "dnc_governance_review"
  | "evidence_blocker"
  | "exact_external_action"
  | "fresh_business_draft";

export type CeoExceptionInboxItem = {
  canonicalKey: string;
  exceptionType: CeoExceptionType;
  priority: "critical" | "high" | "medium" | "normal";
  riskLevel: string;
  sourceRecordType: "RevenueTask" | "UnifiedApprovalItem" | "AiCompanyDraftQueueItem";
  sourceRecordId: string;
  decisionRequested: string;
  businessReason: string;
  recommendedDecision: string;
  missingEvidence: string[];
  contactPosture: Record<string, unknown>;
  auditStatus: "complete" | "not_required_before_decision";
  reviewHref: string;
  reviewMinutes: number;
  prohibitedActions: string[];
  externalActionAuthorized: false;
};

export type CeoExceptionExcludedCounts = {
  syntheticItemsExcluded: number;
  staleDraftsExcluded: number;
  historicalAssignmentsExcluded: number;
  readinessDirectivesExcluded: number;
  legacyCampaignDirectiveExcluded: number;
  duplicateDecisionPacketsExcluded: number;
  resolvedApprovalsExcluded: number;
  reusedTasksExcluded: number;
  nonActionableItemsExcluded: number;
  reviewBudgetDeferred: number;
};

export type CeoExceptionInbox = {
  generatedAt: string;
  tenantId: string;
  status: "action_required" | "no_action_required";
  estimatedReviewMinutes: number;
  items: CeoExceptionInboxItem[];
  excludedCounts: CeoExceptionExcludedCounts;
  safety: typeof internalOnlySafetyProof & {
    readOnly: true;
    authenticatedContextRequired: true;
  };
};

type LeadRecord = {
  id: string;
  tenantId: string;
  source: string;
  propertyAddress: string;
  notes: string | null;
  doNotContact: boolean;
  optOutReason: string | null;
  consentStatus: string;
  contactPermission: string;
  consentSource: string | null;
  consentAt: Date | null;
};

type TaskRecord = {
  id: string;
  tenantId: string;
  leadId: string | null;
  title: string;
  taskType: string;
  status: string;
  recommendedAction: string;
  reason: string;
  idempotencyKey: string | null;
  materializationVersion: string | null;
  sourceProvenance: unknown;
  missingEvidence: unknown;
  contactPosture: unknown;
  providerCalled: boolean;
  outreach: boolean;
  sent: boolean;
  published: boolean;
  crmMutation: boolean;
  externalExecutionAllowed: boolean;
  liveExecutionAllowed: boolean;
  createdAt: Date;
};

type ApprovalRecord = {
  id: string;
  tenantId: string;
  itemType: string;
  sourceType: string;
  sourceId: string | null;
  title: string;
  sourceLabel: string;
  status: string;
  riskLevel: string;
  executionBlockedReason: string;
  payload: unknown;
  providerCalled: boolean;
  sent: boolean;
  published: boolean;
  liveExecutionAllowed: boolean;
  createdAt: Date;
};

type DraftRecord = {
  id: string;
  tenantId: string;
  directiveId: string;
  title: string;
  output: string;
  ownerDepartment: string;
  status: string;
  approvalStatus: string;
  priority: string;
  businessGoal: string;
  sourceLabel: string;
  providerCalled: boolean;
  sent: boolean;
  published: boolean;
  liveExecutionAllowed: boolean;
  createdAt: Date;
};

type DraftRevisionRecord = {
  tenantId: string;
  draftQueueItemId: string;
  action: string;
  createdAt: Date;
};

type DirectiveRecord = {
  id: string;
  tenantId: string;
  title: string;
  objective: string;
  businessGoal: string;
  status: string;
  approvalStatus: string;
  workflowState: string;
  createdAt: Date;
};

type AssignmentRecord = { tenantId: string; status: string };
type AuditRecord = {
  tenantId: string;
  action: string;
  targetId: string | null;
  requestId: string | null;
  result: string;
  safeMetadata: unknown;
};

export type CeoExceptionProjectionInput = {
  tenantId: string;
  now: Date;
  leads: LeadRecord[];
  tasks: TaskRecord[];
  approvals: ApprovalRecord[];
  drafts: DraftRecord[];
  draftRevisions: DraftRevisionRecord[];
  directives: DirectiveRecord[];
  assignments: AssignmentRecord[];
  audits: AuditRecord[];
};

type ExceptionCandidate = CeoExceptionInboxItem & { sortOrder: number; createdAt: Date };

const prohibitedActions = [
  "Provider calls",
  "Seller outreach",
  "Sending or publishing",
  "Scraping",
  "CRM status mutation",
  "External execution",
];
const unresolvedApprovalStatuses = new Set(["pending_review"]);
const unresolvedDraftStatuses = new Set(["pending_ceo_review", "changes_requested"]);
const currentDirectiveStatuses = new Set(["awaiting_ceo_approval", "ready_for_final_approval", "approved_internal_work"]);
const genericDirectivePattern = /\b(readiness|quality review|content refresh|architecture|connector|data gap|framework)\b/iu;
const substantiveRevisionPattern =
  /(^|[^a-z0-9])(edit|revise|revision|changes_requested|content_update|save)([^a-z0-9]|$)/iu;
const evidenceApprovalTypes = new Set(["evidence_review", "acquisition_evidence_review"]);

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function stringList(value: unknown) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function unsafeRecord(record: { providerCalled: boolean; sent: boolean; published: boolean; liveExecutionAllowed: boolean }) {
  return record.providerCalled || record.sent || record.published || record.liveExecutionAllowed;
}

function unsafeTask(task: TaskRecord) {
  return unsafeRecord(task) || task.outreach || task.crmMutation || task.externalExecutionAllowed;
}

function hasExplicitInternalOnlySafety(value: unknown) {
  const safety = objectValue(value);
  return ["providerCalled", "outreach", "sent", "published", "scraping", "crmMutation", "externalExecutionAllowed", "liveExecutionAllowed"]
    .every((field) => safety[field] === false);
}

function syntheticLead(lead: LeadRecord) {
  return hasSyntheticOrTestMarkers({ id: lead.id, source: lead.source, propertyAddress: lead.propertyAddress, notes: lead.notes });
}

function syntheticApproval(approval: ApprovalRecord, leads: Map<string, LeadRecord>) {
  const payload = objectValue(approval.payload);
  const leadId = typeof payload.leadId === "string" ? payload.leadId : approval.sourceId;
  const lead = leadId ? leads.get(leadId) : null;
  return hasSyntheticOrTestMarkers({
    id: lead?.id ?? leadId,
    source: `${approval.sourceType} ${approval.sourceLabel}`,
    propertyAddress: lead?.propertyAddress,
    notes: `${approval.title} ${JSON.stringify(payload)}`,
  });
}

function canonicalKey(tenantId: string, exceptionType: CeoExceptionType, primaryRecordId: string) {
  return `${tenantId}:${exceptionType}:${primaryRecordId}:${CEO_EXCEPTION_DECISION_VERSION}`;
}

function contactPostureFor(lead: LeadRecord, fallback: unknown) {
  return {
    ...objectValue(fallback),
    consentStatus: lead.consentStatus,
    contactPermission: lead.contactPermission,
    consentSource: lead.consentSource,
    consentAt: lead.consentAt?.toISOString() ?? null,
    doNotContact: lead.doNotContact,
    optOutReason: lead.optOutReason,
  };
}

function approvedExecutionSourceIds(approval: ApprovalRecord) {
  const payload = objectValue(approval.payload);
  const preparedAction = objectValue(payload.preparedAction);
  const actionPayload = objectValue(preparedAction.payload);
  return [approval.sourceId, actionPayload.sourceWorkOrderId, actionPayload.workOrderId, preparedAction.leadId]
    .filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
    .map((value) => value.trim());
}

function selectWithinReviewBudget(candidates: ExceptionCandidate[]) {
  const items: CeoExceptionInboxItem[] = [];
  let minutes = 0;
  for (const candidate of candidates) {
    if (items.length >= CEO_EXCEPTION_MAX_ITEMS || minutes + candidate.reviewMinutes > CEO_EXCEPTION_MAX_REVIEW_MINUTES) continue;
    const { sortOrder: _sortOrder, createdAt: _createdAt, ...item } = candidate;
    void _sortOrder;
    void _createdAt;
    items.push(item);
    minutes += item.reviewMinutes;
  }
  return { items, minutes, deferred: candidates.length - items.length };
}

export function projectCeoExceptionInbox(input: CeoExceptionProjectionInput): CeoExceptionInbox {
  const tenantId = requireTenantId(input.tenantId, "ceo_exception_inbox_projection");
  const freshnessCutoff = new Date(input.now.getTime() - CEO_EXCEPTION_FRESHNESS_DAYS * 24 * 60 * 60 * 1000);
  const leads = new Map(input.leads.filter((lead) => lead.tenantId === tenantId).map((lead) => [lead.id, lead]));
  const tasks = new Map(input.tasks.filter((task) => task.tenantId === tenantId).map((task) => [task.id, task]));
  const directives = new Map(input.directives.filter((directive) => directive.tenantId === tenantId).map((directive) => [directive.id, directive]));
  const approvals = input.approvals.filter((approval) => approval.tenantId === tenantId);
  const audits = input.audits.filter((audit) => audit.tenantId === tenantId);
  const candidates: ExceptionCandidate[] = [];
  const excluded: CeoExceptionExcludedCounts = {
    syntheticItemsExcluded: 0,
    staleDraftsExcluded: 0,
    historicalAssignmentsExcluded: input.assignments.filter((assignment) => assignment.tenantId === tenantId && assignment.status === "completed_internal").length,
    readinessDirectivesExcluded: 0,
    legacyCampaignDirectiveExcluded: 0,
    duplicateDecisionPacketsExcluded: 0,
    resolvedApprovalsExcluded: 0,
    reusedTasksExcluded: 0,
    nonActionableItemsExcluded: 0,
    reviewBudgetDeferred: 0,
  };

  const syntheticApprovalIds = new Set<string>();
  for (const approval of approvals) {
    if (syntheticApproval(approval, leads)) {
      syntheticApprovalIds.add(approval.id);
      if (approval.status === "pending_review") excluded.syntheticItemsExcluded += 1;
    } else if (!unresolvedApprovalStatuses.has(approval.status)) {
      excluded.resolvedApprovalsExcluded += 1;
    }
  }

  const pendingAcquisitionPackets = approvals.filter(
    (approval) => approval.itemType === "acquisition_review_packet" && approval.status === "pending_review" && !syntheticApprovalIds.has(approval.id),
  );
  const packetsByTask = new Map<string, ApprovalRecord[]>();
  for (const packet of pendingAcquisitionPackets) {
    if (!packet.sourceId) {
      excluded.nonActionableItemsExcluded += 1;
      continue;
    }
    const group = packetsByTask.get(packet.sourceId) ?? [];
    group.push(packet);
    packetsByTask.set(packet.sourceId, group);
  }

  for (const task of tasks.values()) {
    if (!["acquisition_review", "acquisition_governance_review"].includes(task.taskType) || task.status !== "open") {
      if (task.status !== "open" && task.materializationVersion) excluded.reusedTasksExcluded += 1;
      continue;
    }
    const lead = task.leadId ? leads.get(task.leadId) : null;
    const provenance = objectValue(task.sourceProvenance);
    const expectedTaskType = lead?.doNotContact ? "acquisition_governance_review" : "acquisition_review";
    if (!lead || syntheticLead(lead) || unsafeTask(task) || task.taskType !== expectedTaskType || !task.idempotencyKey || !provenance.source || !provenance.sourceDetail) {
      excluded.nonActionableItemsExcluded += 1;
      continue;
    }
    const packets = packetsByTask.get(task.id) ?? [];
    if (packets.length === 0) {
      excluded.nonActionableItemsExcluded += 1;
      continue;
    }
    packets.sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());
    const packet = packets[0];
    excluded.duplicateDecisionPacketsExcluded += Math.max(0, packets.length - 1);
    const packetPayload = objectValue(packet.payload);
    if (packetPayload.leadId !== lead.id || packetPayload.taskId !== task.id || packetPayload.taskAuditRequestId !== task.idempotencyKey || !hasExplicitInternalOnlySafety(packetPayload)) {
      excluded.nonActionableItemsExcluded += 1;
      continue;
    }
    const auditMatches = audits.filter(
      (audit) => {
        const metadata = objectValue(audit.safeMetadata);
        return audit.action === "real_lead_acquisition_review_materialized"
          && audit.targetId === task.id
          && audit.requestId === task.idempotencyKey
          && audit.result === "success"
          && metadata.leadId === lead.id
          && metadata.taskId === task.id
          && metadata.approvalItemId === packet.id
          && metadata.idempotencyKey === task.idempotencyKey
          && hasExplicitInternalOnlySafety(metadata);
      },
    );
    if (auditMatches.length !== 1 || unsafeRecord(packet)) {
      excluded.nonActionableItemsExcluded += 1;
      continue;
    }
    const exceptionType: CeoExceptionType = task.taskType === "acquisition_governance_review" || lead.doNotContact
      ? "dnc_governance_review"
      : "acquisition_review";
    const reviewMinutes = exceptionType === "dnc_governance_review" ? 2 : 3;
    candidates.push({
      canonicalKey: canonicalKey(tenantId, exceptionType, task.id),
      exceptionType,
      priority: exceptionType === "dnc_governance_review" ? "critical" : "high",
      riskLevel: packet.riskLevel,
      sourceRecordType: "RevenueTask",
      sourceRecordId: task.id,
      decisionRequested: exceptionType === "dnc_governance_review" ? "Review the DNC governance posture and evidence internally." : "Review the internal acquisition evidence packet.",
      businessReason: task.reason,
      recommendedDecision: task.recommendedAction,
      missingEvidence: stringList(task.missingEvidence).length > 0 ? stringList(task.missingEvidence) : stringList(packetPayload.missingEvidence),
      contactPosture: contactPostureFor(lead, task.contactPosture),
      auditStatus: "complete",
      reviewHref: "/dashboard/approvals",
      reviewMinutes,
      prohibitedActions,
      externalActionAuthorized: false,
      sortOrder: exceptionType === "dnc_governance_review" ? 1 : 2,
      createdAt: task.createdAt,
    });
  }

  for (const approval of approvals) {
    if (approval.status !== "pending_review" || syntheticApprovalIds.has(approval.id) || unsafeRecord(approval)) continue;
    if (evidenceApprovalTypes.has(approval.itemType)) {
      const source = approval.sourceId ? tasks.get(approval.sourceId) ?? leads.get(approval.sourceId) : null;
      if (!source || ("source" in source && syntheticLead(source as LeadRecord))) {
        excluded.nonActionableItemsExcluded += 1;
        continue;
      }
      const payload = objectValue(approval.payload);
      candidates.push({
        canonicalKey: canonicalKey(tenantId, "evidence_blocker", approval.id),
        exceptionType: "evidence_blocker",
        priority: "high",
        riskLevel: approval.riskLevel,
        sourceRecordType: "UnifiedApprovalItem",
        sourceRecordId: approval.id,
        decisionRequested: approval.title,
        businessReason: approval.executionBlockedReason,
        recommendedDecision: typeof payload.recommendedDecision === "string" ? payload.recommendedDecision : "Review the evidence blocker and record an internal decision.",
        missingEvidence: stringList(payload.missingEvidence),
        contactPosture: objectValue(payload.contactPosture),
        auditStatus: "not_required_before_decision",
        reviewHref: "/dashboard/approvals",
        reviewMinutes: 2,
        prohibitedActions,
        externalActionAuthorized: false,
        sortOrder: 3,
        createdAt: approval.createdAt,
      });
    }
    if (approval.itemType === "approved_execution") {
      const source = approvedExecutionSourceIds(approval)
        .map((sourceId) => tasks.get(sourceId) ?? leads.get(sourceId))
        .find((record) => Boolean(record));
      if (!source || ("source" in source && syntheticLead(source as LeadRecord))) {
        excluded.nonActionableItemsExcluded += 1;
        continue;
      }
      const payload = objectValue(approval.payload);
      const preparedAction = objectValue(payload.preparedAction);
      candidates.push({
        canonicalKey: canonicalKey(tenantId, "exact_external_action", approval.id),
        exceptionType: "exact_external_action",
        priority: "medium",
        riskLevel: approval.riskLevel,
        sourceRecordType: "UnifiedApprovalItem",
        sourceRecordId: approval.id,
        decisionRequested: approval.title,
        businessReason: approval.executionBlockedReason,
        recommendedDecision: `Review only the prepared ${String(preparedAction.actionType ?? "external action")}; approval remains separate from execution.`,
        missingEvidence: stringList(payload.missingEvidence),
        contactPosture: objectValue(payload.contactPosture),
        auditStatus: "not_required_before_decision",
        reviewHref: "/dashboard/approvals",
        reviewMinutes: 2,
        prohibitedActions,
        externalActionAuthorized: false,
        sortOrder: 4,
        createdAt: approval.createdAt,
      });
    }
  }

  const substantiveRevisionDates = new Map<string, Date>();
  for (const revision of input.draftRevisions) {
    if (revision.tenantId !== tenantId || !substantiveRevisionPattern.test(revision.action)) continue;
    const current = substantiveRevisionDates.get(revision.draftQueueItemId);
    if (!current || revision.createdAt > current) substantiveRevisionDates.set(revision.draftQueueItemId, revision.createdAt);
  }
  const referencedDirectiveIds = new Set<string>();
  for (const draft of input.drafts.filter((record) => record.tenantId === tenantId && unresolvedDraftStatuses.has(record.approvalStatus))) {
    const directive = directives.get(draft.directiveId);
    if (!directive || unsafeRecord(draft) || !currentDirectiveStatuses.has(directive.workflowState) || !draft.sourceLabel.trim()) {
      excluded.nonActionableItemsExcluded += 1;
      continue;
    }
    referencedDirectiveIds.add(directive.id);
    const substantiveDate = substantiveRevisionDates.get(draft.id) ?? draft.createdAt;
    if (substantiveDate < freshnessCutoff) {
      excluded.staleDraftsExcluded += 1;
      continue;
    }
    if (genericDirectivePattern.test(`${directive.title} ${directive.objective} ${directive.businessGoal}`)) {
      excluded.nonActionableItemsExcluded += 1;
      continue;
    }
    candidates.push({
      canonicalKey: canonicalKey(tenantId, "fresh_business_draft", draft.id),
      exceptionType: "fresh_business_draft",
      priority: "normal",
      riskLevel: "medium",
      sourceRecordType: "AiCompanyDraftQueueItem",
      sourceRecordId: draft.id,
      decisionRequested: `Review ${draft.title || draft.output}.`,
      businessReason: `Fresh ${draft.ownerDepartment} work supports ${draft.businessGoal}.`,
      recommendedDecision: "Approve, request changes, defer, or reject this internal draft. No publishing is authorized.",
      missingEvidence: [],
      contactPosture: {},
      auditStatus: "not_required_before_decision",
      reviewHref: "/dashboard/drafts",
      reviewMinutes: 1,
      prohibitedActions,
      externalActionAuthorized: false,
      sortOrder: 5,
      createdAt: substantiveDate,
    });
  }

  for (const directive of directives.values()) {
    if (genericDirectivePattern.test(`${directive.title} ${directive.objective} ${directive.businessGoal}`)) {
      excluded.readinessDirectivesExcluded += 1;
    } else if (!referencedDirectiveIds.has(directive.id) && directive.createdAt < freshnessCutoff) {
      excluded.legacyCampaignDirectiveExcluded += 1;
    } else if (referencedDirectiveIds.has(directive.id) && directive.createdAt < freshnessCutoff) {
      excluded.legacyCampaignDirectiveExcluded += 1;
    }
  }

  const deduplicated = [...new Map(candidates.map((candidate) => [candidate.canonicalKey, candidate])).values()]
    .sort((left, right) => left.sortOrder - right.sortOrder || left.createdAt.getTime() - right.createdAt.getTime());
  const selected = selectWithinReviewBudget(deduplicated);
  excluded.reviewBudgetDeferred = selected.deferred;

  return {
    generatedAt: input.now.toISOString(),
    tenantId,
    status: selected.items.length > 0 ? "action_required" : "no_action_required",
    estimatedReviewMinutes: selected.minutes,
    items: selected.items,
    excludedCounts: excluded,
    safety: {
      readOnly: true,
      authenticatedContextRequired: true,
      ...internalOnlySafetyProof,
    },
  };
}

type CeoExceptionInboxDb = Pick<
  typeof prisma,
  "lead" | "revenueTask" | "unifiedApprovalItem" | "aiCompanyDraftQueueItem" | "aiCompanyDraftRevision" | "aiCompanyExecutiveDirective" | "aiCompanyWorkAssignment" | "revenueAuditEvent"
>;
let db: CeoExceptionInboxDb = prisma;

export function setCeoExceptionInboxDbForTest(testDb: CeoExceptionInboxDb) {
  const previous = db;
  db = testDb;
  return () => {
    db = previous;
  };
}

export async function getCeoExceptionInbox({ tenantId: tenantIdValue, now = new Date() }: { tenantId: string; now?: Date }) {
  const tenantId = requireTenantId(tenantIdValue, "ceo_exception_inbox");
  const [leads, tasks, approvals, drafts, draftRevisions, directives, assignments, audits] = await Promise.all([
    db.lead.findMany({ where: { tenantId }, select: { id: true, tenantId: true, source: true, propertyAddress: true, notes: true, doNotContact: true, optOutReason: true, consentStatus: true, contactPermission: true, consentSource: true, consentAt: true } }),
    db.revenueTask.findMany({ where: { tenantId }, select: { id: true, tenantId: true, leadId: true, title: true, taskType: true, status: true, recommendedAction: true, reason: true, idempotencyKey: true, materializationVersion: true, sourceProvenance: true, missingEvidence: true, contactPosture: true, providerCalled: true, outreach: true, sent: true, published: true, crmMutation: true, externalExecutionAllowed: true, liveExecutionAllowed: true, createdAt: true } }),
    db.unifiedApprovalItem.findMany({ where: { tenantId }, select: { id: true, tenantId: true, itemType: true, sourceType: true, sourceId: true, title: true, sourceLabel: true, status: true, riskLevel: true, executionBlockedReason: true, payload: true, providerCalled: true, sent: true, published: true, liveExecutionAllowed: true, createdAt: true } }),
    db.aiCompanyDraftQueueItem.findMany({ where: { tenantId }, select: { id: true, tenantId: true, directiveId: true, title: true, output: true, ownerDepartment: true, status: true, approvalStatus: true, priority: true, businessGoal: true, sourceLabel: true, providerCalled: true, sent: true, published: true, liveExecutionAllowed: true, createdAt: true } }),
    db.aiCompanyDraftRevision.findMany({ where: { tenantId }, select: { tenantId: true, draftQueueItemId: true, action: true, createdAt: true } }),
    db.aiCompanyExecutiveDirective.findMany({ where: { tenantId }, select: { id: true, tenantId: true, title: true, objective: true, businessGoal: true, status: true, approvalStatus: true, workflowState: true, createdAt: true } }),
    db.aiCompanyWorkAssignment.findMany({ where: { tenantId }, select: { tenantId: true, status: true } }),
    db.revenueAuditEvent.findMany({ where: { tenantId }, select: { tenantId: true, action: true, targetId: true, requestId: true, result: true, safeMetadata: true } }),
  ]);

  return projectCeoExceptionInbox({ tenantId, now, leads, tasks, approvals, drafts, draftRevisions, directives, assignments, audits });
}
