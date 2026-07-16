import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { canonicalProfessionalIdentityRegistry, canonicalProfessionalProfileIds, resolveCanonicalCompanyOrgUnit } from "@/lib/enterprise-professional-operating-system";

export const professionalCaseStatuses = ["intake", "routed", "assigned", "working", "dependency_waiting", "qa_required", "executive_review", "decided", "outcome_due", "closed"] as const;
export type ProfessionalCaseStatus = (typeof professionalCaseStatuses)[number];
export type ProfessionalCaseActor = { tenantId: string; actorId: string };
export const scheduledProfessionalCaseProductionCap = 15;
const professionalCaseTransactionOptions = { maxWait: 10_000, timeout: 30_000 } as const;

export function boundedScheduledProfessionalCaseBatch<T>(candidates: readonly T[]) {
  return candidates.slice(0, scheduledProfessionalCaseProductionCap);
}

const allowedTransitions: Record<ProfessionalCaseStatus, ProfessionalCaseStatus[]> = {
  intake: ["routed", "assigned"],
  routed: ["assigned"],
  assigned: ["working", "dependency_waiting"],
  working: ["dependency_waiting", "qa_required"],
  dependency_waiting: ["working", "qa_required"],
  qa_required: ["working", "executive_review"],
  executive_review: ["working", "decided"],
  decided: ["outcome_due", "closed"],
  outcome_due: ["closed"],
  closed: [],
};

function text(value: unknown, field: string, max = 500) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new Error(`invalid_${field}`);
  return value.trim();
}

function idempotencyKey(value: unknown) {
  const key = text(value, "idempotency_key", 120);
  if (!/^[A-Za-z0-9._:-]{12,120}$/.test(key)) throw new Error("invalid_idempotency_key");
  return key;
}

function jsonObject(value: unknown, field: string): Prisma.InputJsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`invalid_${field}`);
  return value as Prisma.InputJsonObject;
}

function stringList(value: unknown, field: string, maxItems = 100) {
  if (!Array.isArray(value) || value.length > maxItems || value.some((item) => typeof item !== "string" || !item.trim() || item.length > 500)) throw new Error(`invalid_${field}`);
  return value.map((item) => item.trim());
}

function assertProfessional(professionalId: string) {
  if (!canonicalProfessionalProfileIds.has(professionalId) || !canonicalProfessionalIdentityRegistry.some((identity) => identity.professionalProfileIds.includes(professionalId))) throw new Error("canonical_professional_not_found");
}

function canonicalDepartment(department: string) {
  const unit = resolveCanonicalCompanyOrgUnit(department);
  if (!unit) throw new Error("invalid_professional_department");
  return unit.name;
}

function hasPrismaCode(error: unknown, code: string) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === code);
}

export function assertProfessionalCaseTransition(from: ProfessionalCaseStatus, to: ProfessionalCaseStatus) {
  if (!allowedTransitions[from]?.includes(to)) throw new Error("invalid_professional_case_transition");
}

export async function createProfessionalCase(input: {
  actor: ProfessionalCaseActor;
  idempotencyKey: unknown;
  caseType: unknown;
  title: unknown;
  objective: unknown;
  sourceLabel: unknown;
  sourceReference: unknown;
  leadProfessionalId: unknown;
  independentReviewerId: unknown;
  department: unknown;
  businessModule?: unknown;
  evidenceSnapshot: unknown;
  limitations?: unknown;
}) {
  const key = idempotencyKey(input.idempotencyKey);
  const caseType = text(input.caseType, "case_type", 120);
  const title = text(input.title, "title", 300);
  const objective = text(input.objective, "objective", 2_000);
  const sourceLabel = text(input.sourceLabel, "source_label", 200);
  const sourceReference = text(input.sourceReference, "source_reference", 500);
  const leadProfessionalId = text(input.leadProfessionalId, "lead_professional_id", 200);
  const independentReviewerId = text(input.independentReviewerId, "independent_reviewer_id", 200);
  const department = canonicalDepartment(text(input.department, "department", 200));
  const businessModule = input.businessModule == null ? "ai-core" : text(input.businessModule, "business_module", 120);
  const evidenceSnapshot = jsonObject(input.evidenceSnapshot, "evidence_snapshot");
  const limitations = input.limitations == null ? ({ items: [] } as Prisma.InputJsonObject) : jsonObject(input.limitations, "limitations");
  assertProfessional(leadProfessionalId);
  assertProfessional(independentReviewerId);
  if (leadProfessionalId === independentReviewerId) throw new Error("self_review_blocked");

  const assertMatchingPayload = (record: { caseType: string; sourceReference: string; leadProfessionalId: string; independentReviewerId: string }) => {
    if (record.caseType !== caseType || record.sourceReference !== sourceReference || record.leadProfessionalId !== leadProfessionalId || record.independentReviewerId !== independentReviewerId) throw new Error("idempotency_payload_conflict");
  };
  try {
    return await prisma.$transaction(async (tx) => {
      const record = await tx.professionalCase.upsert({
        where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } },
        update: {},
        create: { tenantId: input.actor.tenantId, idempotencyKey: key, caseType, title, objective, sourceLabel, sourceReference, status: "assigned", leadProfessionalId, independentReviewerId, department, businessModule, evidenceSnapshot, limitations, createdBy: input.actor.actorId },
      });
      assertMatchingPayload(record);
      await Promise.all([
        tx.professionalAssignment.upsert({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: `${key}:lead` } }, update: {}, create: { tenantId: input.actor.tenantId, caseId: record.id, idempotencyKey: `${key}:lead`, professionalId: leadProfessionalId, department, assignmentRole: "lead" } }),
        tx.professionalAssignment.upsert({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: `${key}:reviewer` } }, update: {}, create: { tenantId: input.actor.tenantId, caseId: record.id, idempotencyKey: `${key}:reviewer`, professionalId: independentReviewerId, department: "Professional Standards and Independent QA", assignmentRole: "independent_reviewer" } }),
        tx.professionalCaseEvent.upsert({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: `${key}:created` } }, update: {}, create: { tenantId: input.actor.tenantId, caseId: record.id, idempotencyKey: `${key}:created`, actorId: input.actor.actorId, eventType: "case_created", sourceLabel: "professional_case_runtime", sanitizedData: { status: "assigned", department, providerCalled: false, externalActionAuthorized: false } } }),
      ]);
      return record;
    }, professionalCaseTransactionOptions);
  } catch (error) {
    if (!hasPrismaCode(error, "P2002")) throw error;
    const winner = await prisma.professionalCase.findUnique({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } } });
    if (!winner) throw error;
    assertMatchingPayload(winner);
    return winner;
  }
}

export async function listProfessionalCases(tenantId: string, take = 50) {
  return prisma.professionalCase.findMany({
    where: { tenantId },
    orderBy: { updatedAt: "desc" },
    take: Math.min(Math.max(take, 1), 100),
    include: { assignments: true, contributions: { orderBy: { createdAt: "asc" } }, reviews: { orderBy: { createdAt: "asc" } }, decisions: { orderBy: { createdAt: "asc" } }, outcomes: { orderBy: { createdAt: "asc" } }, events: { orderBy: { createdAt: "asc" } } },
  });
}

export async function listProfessionalWorkCompatibilityView(tenantId: string, take = 50) {
  const boundedTake = Math.min(Math.max(take, 1), 100);
  const [professionalCases, legacyAssignments] = await Promise.all([
    listProfessionalCases(tenantId, boundedTake),
    prisma.aiCompanyWorkAssignment.findMany({ where: { tenantId }, orderBy: { updatedAt: "desc" }, take: boundedTake }),
  ]);
  return {
    professionalCases,
    legacyAssignments: legacyAssignments.map((assignment) => ({ ...assignment, compatibilitySource: "legacy_ai_company_work_assignment" as const, migrated: false as const })),
    dualReadComparison: process.env.NODE_ENV === "development" ? { professionalCaseCount: professionalCases.length, legacyAssignmentCount: legacyAssignments.length, automaticBackfillPerformed: false } : null,
  };
}

export async function claimProfessionalAssignment(input: { actor: ProfessionalCaseActor; assignmentId: unknown; idempotencyKey: unknown; leaseSeconds?: number }) {
  const assignmentId = text(input.assignmentId, "assignment_id", 100);
  const key = idempotencyKey(input.idempotencyKey);
  const leaseSeconds = Math.min(Math.max(input.leaseSeconds ?? 300, 30), 1_800);
  const now = new Date();
  const leaseExpiresAt = new Date(now.getTime() + leaseSeconds * 1_000);
  return prisma.$transaction(async (tx) => {
    const retryEvent = await tx.professionalCaseEvent.findUnique({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } } });
    if (retryEvent) {
      const retriedAssignment = await tx.professionalAssignment.findFirst({ where: { id: assignmentId, tenantId: input.actor.tenantId, claimedBy: input.actor.actorId } });
      if (!retriedAssignment || retryEvent.caseId !== retriedAssignment.caseId) throw new Error("idempotency_payload_conflict");
      return retriedAssignment;
    }
    const claimed = await tx.professionalAssignment.updateMany({ where: { id: assignmentId, tenantId: input.actor.tenantId, OR: [{ status: "assigned", claimedBy: null }, { status: "working", leaseExpiresAt: { lt: now } }] }, data: { status: "working", claimedBy: input.actor.actorId, claimedAt: now, leaseExpiresAt, version: { increment: 1 } } });
    const assignment = await tx.professionalAssignment.findFirst({ where: { id: assignmentId, tenantId: input.actor.tenantId } });
    if (!assignment) throw new Error("assignment_not_found");
    if (claimed.count !== 1) {
      const concurrentRetryEvent = await tx.professionalCaseEvent.findUnique({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } } });
      if (assignment.claimedBy === input.actor.actorId && concurrentRetryEvent?.caseId === assignment.caseId && concurrentRetryEvent.eventType === "assignment_claimed") return assignment;
      throw new Error("assignment_already_claimed");
    }
    await tx.professionalCase.updateMany({ where: { id: assignment.caseId, tenantId: input.actor.tenantId, status: "assigned" }, data: { status: "working", version: { increment: 1 } } });
    await tx.professionalCaseEvent.create({ data: { tenantId: input.actor.tenantId, caseId: assignment.caseId, idempotencyKey: key, actorId: input.actor.actorId, eventType: "assignment_claimed", sourceLabel: "professional_case_runtime", sanitizedData: { assignmentId, leaseExpiresAt: leaseExpiresAt.toISOString(), providerCalled: false, externalActionAuthorized: false } } });
    return assignment;
  }, professionalCaseTransactionOptions);
}

export async function appendProfessionalContribution(input: { actor: ProfessionalCaseActor; caseId: unknown; idempotencyKey: unknown; professionalId: unknown; department: unknown; contributionType: unknown; sourceLabel: unknown; sourceReferences: unknown; content: unknown; limitations?: unknown; dataGap?: boolean }) {
  const caseId = text(input.caseId, "case_id", 100);
  const key = idempotencyKey(input.idempotencyKey);
  const professionalId = text(input.professionalId, "professional_id", 200);
  const department = canonicalDepartment(text(input.department, "department", 200));
  const contributionType = text(input.contributionType, "contribution_type", 120);
  const sourceLabel = text(input.sourceLabel, "source_label", 200);
  const sourceReferences = stringList(input.sourceReferences, "source_references");
  const content = jsonObject(input.content, "content");
  const limitations = input.limitations == null ? ({ items: [] } as Prisma.InputJsonObject) : jsonObject(input.limitations, "limitations");
  assertProfessional(professionalId);
  if (sourceReferences.length === 0 && !input.dataGap) throw new Error("source_reference_or_data_gap_required");
  const professionalCase = await prisma.professionalCase.findFirst({ where: { id: caseId, tenantId: input.actor.tenantId } });
  if (!professionalCase) throw new Error("professional_case_not_found");
  try {
    return await prisma.professionalContribution.upsert({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } }, update: {}, create: { tenantId: input.actor.tenantId, caseId, idempotencyKey: key, professionalId, department, contributionType, sourceLabel, sourceReferences, content, dataGap: input.dataGap === true, limitations } });
  } catch (error) {
    if (!hasPrismaCode(error, "P2002")) throw error;
    const winner = await prisma.professionalContribution.findUnique({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } } });
    if (!winner || winner.caseId !== caseId || winner.professionalId !== professionalId || winner.contributionType !== contributionType) throw error;
    return winner;
  }
}

export async function requestProfessionalCaseQa(input: { actor: ProfessionalCaseActor; caseId: unknown; idempotencyKey: unknown }) {
  const caseId = text(input.caseId, "case_id", 100);
  const key = idempotencyKey(input.idempotencyKey);
  return prisma.$transaction(async (tx) => {
    const retryEvent = await tx.professionalCaseEvent.findUnique({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } } });
    if (retryEvent) {
      if (retryEvent.caseId !== caseId || retryEvent.eventType !== "qa_requested") throw new Error("idempotency_payload_conflict");
      return retryEvent;
    }
    const professionalCase = await tx.professionalCase.findFirst({ where: { id: caseId, tenantId: input.actor.tenantId } });
    if (!professionalCase) throw new Error("professional_case_not_found");
    if (professionalCase.status !== "working" && professionalCase.status !== "dependency_waiting") {
      // Under read-committed isolation another identical request can commit after
      // the first event lookup but before this case read. Re-read the event so
      // the losing caller observes the durable idempotent result.
      const concurrentRetryEvent = await tx.professionalCaseEvent.findUnique({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } } });
      if (concurrentRetryEvent?.caseId === caseId && concurrentRetryEvent.eventType === "qa_requested") return concurrentRetryEvent;
      throw new Error("case_not_ready_for_qa");
    }
    const contributions = await tx.professionalContribution.count({ where: { tenantId: input.actor.tenantId, caseId } });
    if (contributions === 0) throw new Error("professional_contribution_required_before_qa");
    const transitioned = await tx.professionalCase.updateMany({ where: { id: caseId, tenantId: input.actor.tenantId, status: { in: ["working", "dependency_waiting"] } }, data: { status: "qa_required", version: { increment: 1 } } });
    if (transitioned.count !== 1) {
      const concurrentRetryEvent = await tx.professionalCaseEvent.findUnique({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } } });
      if (concurrentRetryEvent?.caseId === caseId && concurrentRetryEvent.eventType === "qa_requested") return concurrentRetryEvent;
      throw new Error("case_not_ready_for_qa");
    }
    return tx.professionalCaseEvent.create({ data: { tenantId: input.actor.tenantId, caseId, idempotencyKey: key, actorId: input.actor.actorId, eventType: "qa_requested", sourceLabel: "professional_case_runtime", sanitizedData: { contributionCount: contributions, providerCalled: false, externalActionAuthorized: false } } });
  }, professionalCaseTransactionOptions);
}

export async function appendProfessionalReview(input: { actor: ProfessionalCaseActor; caseId: unknown; idempotencyKey: unknown; deliverableId: unknown; generatorId: unknown; reviewerId: unknown; status: unknown; rubricVersion: unknown; checks: unknown; blockingDefects: unknown; rationale: unknown }) {
  const caseId = text(input.caseId, "case_id", 100);
  const key = idempotencyKey(input.idempotencyKey);
  const deliverableId = text(input.deliverableId, "deliverable_id", 200);
  const generatorId = text(input.generatorId, "generator_id", 200);
  const reviewerId = text(input.reviewerId, "reviewer_id", 200);
  if (generatorId === reviewerId) throw new Error("self_review_blocked");
  if (input.status !== "passed" && input.status !== "failed") throw new Error("invalid_review_status");
  const status = input.status;
  const rubricVersion = text(input.rubricVersion, "rubric_version", 40);
  const checks = jsonObject(input.checks, "checks");
  const blockingDefects = stringList(input.blockingDefects, "blocking_defects");
  const rationale = text(input.rationale, "rationale", 2_000);
  const professionalCase = await prisma.professionalCase.findFirst({ where: { id: caseId, tenantId: input.actor.tenantId } });
  if (!professionalCase) throw new Error("professional_case_not_found");
  if (professionalCase.independentReviewerId !== reviewerId) throw new Error("independent_reviewer_mismatch");
  if (status === "passed" && blockingDefects.length) throw new Error("blocking_defects_prevent_qa_pass");
  return prisma.$transaction(async (tx) => {
    const retryReview = await tx.professionalReview.findUnique({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } } });
    if (retryReview) {
      if (retryReview.caseId !== caseId || retryReview.deliverableId !== deliverableId || retryReview.reviewerId !== reviewerId || retryReview.status !== status) throw new Error("idempotency_payload_conflict");
      return retryReview;
    }
    const review = await tx.professionalReview.upsert({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } }, update: {}, create: { tenantId: input.actor.tenantId, caseId, idempotencyKey: key, deliverableId, generatorId, reviewerId, status, rubricVersion, checks, blockingDefects, rationale } });
    const transitioned = await tx.professionalCase.updateMany({ where: { id: caseId, tenantId: input.actor.tenantId, status: "qa_required" }, data: { status: status === "passed" ? "executive_review" : "working", version: { increment: 1 } } });
    if (transitioned.count !== 1) throw new Error("case_not_awaiting_qa");
    await tx.professionalCaseEvent.upsert({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: `${key}:event` } }, update: {}, create: { tenantId: input.actor.tenantId, caseId, idempotencyKey: `${key}:event`, actorId: input.actor.actorId, eventType: status === "passed" ? "qa_passed" : "qa_failed", sourceLabel: "professional_case_runtime", sanitizedData: { reviewId: review.id, blockingDefectCount: blockingDefects.length, providerCalled: false, externalActionAuthorized: false } } });
    return review;
  }, professionalCaseTransactionOptions);
}

export async function appendProfessionalDecision(input: { actor: ProfessionalCaseActor; caseId: unknown; idempotencyKey: unknown; decision: unknown; rationale: unknown; evidenceReferences: unknown; executionAuthorized?: boolean }) {
  const caseId = text(input.caseId, "case_id", 100);
  const key = idempotencyKey(input.idempotencyKey);
  const decision = text(input.decision, "decision", 120);
  const rationale = text(input.rationale, "rationale", 2_000);
  const evidenceReferences = stringList(input.evidenceReferences, "evidence_references");
  if (input.executionAuthorized) throw new Error("external_execution_authority_blocked");
  return prisma.$transaction(async (tx) => {
    const retryDecision = await tx.professionalDecision.findUnique({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } } });
    if (retryDecision) {
      if (retryDecision.caseId !== caseId || retryDecision.decision !== decision) throw new Error("idempotency_payload_conflict");
      return retryDecision;
    }
    const professionalCase = await tx.professionalCase.findFirst({ where: { id: caseId, tenantId: input.actor.tenantId } });
    if (!professionalCase) throw new Error("professional_case_not_found");
    if (professionalCase.status !== "executive_review") throw new Error("case_not_awaiting_executive_decision");
    const latestReview = await tx.professionalReview.findFirst({ where: { tenantId: input.actor.tenantId, caseId }, orderBy: { createdAt: "desc" } });
    if (latestReview?.status !== "passed") throw new Error("qa_pass_required_before_decision");
    const record = await tx.professionalDecision.upsert({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } }, update: {}, create: { tenantId: input.actor.tenantId, caseId, idempotencyKey: key, actorId: input.actor.actorId, decision, rationale, evidenceReferences, executionAuthorized: false } });
    const transitioned = await tx.professionalCase.updateMany({ where: { id: caseId, tenantId: input.actor.tenantId, status: "executive_review" }, data: { status: "decided", version: { increment: 1 } } });
    if (transitioned.count !== 1) throw new Error("case_not_awaiting_executive_decision");
    await tx.professionalCaseEvent.upsert({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: `${key}:event` } }, update: {}, create: { tenantId: input.actor.tenantId, caseId, idempotencyKey: `${key}:event`, actorId: input.actor.actorId, eventType: "executive_decision_recorded", sourceLabel: "professional_case_runtime", sanitizedData: { decisionId: record.id, decision, executionAuthorized: false, providerCalled: false } } });
    return record;
  }, professionalCaseTransactionOptions);
}

export async function appendProfessionalCaseOutcome(input: { actor: ProfessionalCaseActor; caseId: unknown; idempotencyKey: unknown; sourceLabel: unknown; evidenceReferences: unknown; metrics: unknown; verified?: boolean; learningApplied?: boolean }) {
  const caseId = text(input.caseId, "case_id", 100);
  const key = idempotencyKey(input.idempotencyKey);
  const sourceLabel = text(input.sourceLabel, "source_label", 200);
  const evidenceReferences = stringList(input.evidenceReferences, "evidence_references");
  const metrics = jsonObject(input.metrics, "metrics");
  if (input.verified && evidenceReferences.length === 0) throw new Error("verified_outcome_evidence_required");
  if (input.learningApplied) throw new Error("automatic_learning_application_blocked");
  return prisma.$transaction(async (tx) => {
    const retryOutcome = await tx.professionalOutcome.findUnique({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } } });
    if (retryOutcome) {
      if (retryOutcome.caseId !== caseId || retryOutcome.sourceLabel !== sourceLabel || retryOutcome.verified !== (input.verified === true)) throw new Error("idempotency_payload_conflict");
      return retryOutcome;
    }
    const professionalCase = await tx.professionalCase.findFirst({ where: { id: caseId, tenantId: input.actor.tenantId } });
    if (!professionalCase) throw new Error("professional_case_not_found");
    if (professionalCase.status !== "decided" && professionalCase.status !== "outcome_due") throw new Error("case_decision_required_before_outcome");
    const outcome = await tx.professionalOutcome.upsert({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: key } }, update: {}, create: { tenantId: input.actor.tenantId, caseId, idempotencyKey: key, recordedBy: input.actor.actorId, sourceLabel, evidenceReferences, metrics, verified: input.verified === true, learningApplied: false } });
    const nextStatus = input.verified ? "closed" : "outcome_due";
    const allowedStatus: Prisma.StringFilter = input.verified ? { in: ["decided", "outcome_due"] } : { equals: "decided" };
    const transitioned = await tx.professionalCase.updateMany({ where: { id: caseId, tenantId: input.actor.tenantId, status: allowedStatus }, data: { status: nextStatus, closedAt: input.verified ? new Date() : null, version: { increment: 1 } } });
    if (transitioned.count !== 1) throw new Error("case_not_awaiting_outcome");
    await tx.professionalCaseEvent.upsert({ where: { tenantId_idempotencyKey: { tenantId: input.actor.tenantId, idempotencyKey: `${key}:event` } }, update: {}, create: { tenantId: input.actor.tenantId, caseId, idempotencyKey: `${key}:event`, actorId: input.actor.actorId, eventType: input.verified ? "verified_outcome_recorded" : "outcome_due", sourceLabel: "professional_case_runtime", sanitizedData: { outcomeId: outcome.id, verified: input.verified === true, learningApplied: false, providerCalled: false, externalActionAuthorized: false } } });
    return outcome;
  }, professionalCaseTransactionOptions);
}
