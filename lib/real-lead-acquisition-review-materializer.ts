import { Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/prisma";
import { requireTenantId } from "@/lib/tenant-context";

export const REAL_LEAD_MATERIALIZER_SOURCE = "executive_autonomy_l1:real_lead_materializer:v1";
export const REAL_LEAD_MATERIALIZER_VERSION = "acquisition-review-v1";

export const internalOnlySafetyProof = {
  providerCalled: false,
  outreach: false,
  sent: false,
  published: false,
  crmMutation: false,
  externalExecutionAllowed: false,
  liveExecutionAllowed: false,
} as const;

export type InternalOnlySafetyProof = typeof internalOnlySafetyProof;
export type MaterializationResult = {
  status: "created" | "reused" | "excluded" | "blocked";
  eligibilityDecision: string;
  taskId: string | null;
  taskType: "acquisition_review" | "acquisition_governance_review" | null;
  idempotencyKey: string | null;
  missingEvidence: string[];
  safety: InternalOnlySafetyProof;
};

type MaterializerDb = Pick<typeof prisma, "$transaction" | "revenueTask">;
let db: MaterializerDb = prisma;

export function setRealLeadMaterializerDbForTest(testDb: MaterializerDb) {
  const previous = db;
  db = testDb;
  return () => {
    db = previous;
  };
}

const prohibitedMarker = /(^|[^a-z0-9])(acceptance|test|synthetic|demo|fixture|sample|seed|seeded)([^a-z0-9]|$)/iu;
const exactAcceptanceLeadId = "acceptance-executive-autonomy-l1-lead";
const activeStatuses = new Set(["new", "contacted", "negotiating", "under_contract"]);

function textHasProhibitedMarker(value: unknown) {
  return typeof value === "string" && prohibitedMarker.test(value);
}

export function hasSyntheticOrTestMarkers(input: {
  id?: unknown;
  source?: unknown;
  sourceDetail?: unknown;
  parcelId?: unknown;
  propertyAddress?: unknown;
  notes?: unknown;
}) {
  return input.id === exactAcceptanceLeadId || Object.values(input).some((value) =>
    Array.isArray(value) ? value.some(textHasProhibitedMarker) : textHasProhibitedMarker(value),
  );
}

function safelyParsePayload(value: string | null) {
  if (!value) return {} as Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {} as Record<string, unknown>;
  }
}

function capturedPropertyFacts(lead: { propertyAddress: string; payload: string | null }) {
  const payload = safelyParsePayload(lead.payload);
  const captured: Record<string, unknown> = { propertyAddress: lead.propertyAddress };
  for (const key of ["arv", "estimatedRepairs", "parcelId", "county", "ownerName", "title", "distressFlags"] as const) {
    if (payload[key] !== undefined && payload[key] !== null && payload[key] !== "") captured[key] = payload[key];
  }
  return captured;
}

function baseResult(input: Omit<MaterializationResult, "safety">): MaterializationResult {
  return { ...input, safety: internalOnlySafetyProof };
}

function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function materializeRealLeadAcquisitionReview(input: {
  tenantId: string;
  leadId: string;
}): Promise<MaterializationResult> {
  const tenantId = requireTenantId(input.tenantId, "real_lead_materializer");
  const leadId = input.leadId?.trim();
  if (!leadId) throw new Error("lead_id_required:real_lead_materializer");
  const idempotencyKey = `${REAL_LEAD_MATERIALIZER_VERSION}:${tenantId}:${leadId}`;

  try {
    return await db.$transaction(async (tx) => {
      const lead = await tx.lead.findFirst({ where: { id: leadId, tenantId } });
      if (!lead) {
        return baseResult({ status: "blocked", eligibilityDecision: "tenant_scoped_lead_not_found", taskId: null, taskType: null, idempotencyKey, missingEvidence: [] });
      }

      const provenance = await tx.revenueLeadSource.findFirst({
        where: { tenantId, leadId },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      });
      const latestScore = await tx.revenueLeadScore.findFirst({
        where: { tenantId, leadId },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      });
      const payload = safelyParsePayload(lead.payload);
      const markerFields = [lead.id, lead.source, provenance?.source, provenance?.sourceDetail, payload.parcelId, lead.propertyAddress, lead.notes];
      if (hasSyntheticOrTestMarkers({ id: lead.id, source: lead.source, sourceDetail: `${provenance?.source ?? ""} ${provenance?.sourceDetail ?? ""}`, parcelId: payload.parcelId, propertyAddress: lead.propertyAddress, notes: lead.notes }) || markerFields.some(textHasProhibitedMarker)) {
        return baseResult({ status: "excluded", eligibilityDecision: "synthetic_or_test_marker", taskId: null, taskType: null, idempotencyKey, missingEvidence: [] });
      }

      const missingEvidence: string[] = [];
      if (!lead.source.trim()) missingEvidence.push("lead_source");
      if (!provenance?.sourceDetail?.trim()) missingEvidence.push("source_detail");
      if (!lead.propertyAddress.trim()) missingEvidence.push("property_address");
      if (!lead.createdAt) missingEvidence.push("capture_timestamp");
      if (!activeStatuses.has(lead.status)) missingEvidence.push("active_lead_status");
      if (lead.approvalStatus === "rejected") missingEvidence.push("non_rejected_approval_status");
      if (missingEvidence.length > 0) {
        return baseResult({ status: "blocked", eligibilityDecision: "required_eligibility_evidence_missing", taskId: null, taskType: null, idempotencyKey, missingEvidence });
      }

      const existing = await tx.revenueTask.findUnique({ where: { tenantId_idempotencyKey: { tenantId, idempotencyKey } } });
      if (existing) {
        return baseResult({ status: "reused", eligibilityDecision: "existing_tenant_scoped_task_reused", taskId: existing.id, taskType: existing.taskType as MaterializationResult["taskType"], idempotencyKey, missingEvidence: (existing.missingEvidence as string[] | null) ?? [] });
      }

      const taskType = lead.doNotContact ? "acquisition_governance_review" : "acquisition_review";
      const factualGaps = ["verified_arv", "verified_repairs", "verified_parcel", "verified_county", "verified_owner", "verified_title", "verified_distress"];
      const allMissingEvidence = [...missingEvidence, ...factualGaps];
      const recommendedAction = lead.doNotContact
        ? "Review provenance, evidence completeness, and DNC governance internally. Do not contact the seller or mutate CRM status."
        : "Prepare an internal acquisition evidence review for CEO approval; no seller contact or external action is authorized.";
      const task = await tx.revenueTask.create({
        data: {
          tenantId,
          leadId,
          title: lead.doNotContact ? `DNC acquisition governance review: ${lead.propertyAddress}` : `Acquisition review: ${lead.propertyAddress}`,
          taskType,
          priority: latestScore?.priority ?? lead.priority,
          status: "open",
          recommendedAction,
          reason: "A verified, non-test, tenant-owned lead is eligible for internal-only acquisition preparation.",
          dueAt: null,
          assignedTo: "Acquisitions AI",
          requiresApproval: true,
          source: REAL_LEAD_MATERIALIZER_SOURCE,
          idempotencyKey,
          materializationVersion: REAL_LEAD_MATERIALIZER_VERSION,
          sourceProvenance: { source: lead.source, sourceDetail: provenance!.sourceDetail, sourceRecordId: provenance!.sourceRecordId, verified: provenance!.verified },
          captureTimestamp: lead.createdAt,
          scoreEvidence: latestScore
            ? { availability: "available", score: latestScore.score, confidence: latestScore.confidence, priority: latestScore.priority, scoredAt: latestScore.createdAt.toISOString() }
            : { availability: "unavailable" },
          propertyEvidence: JSON.parse(JSON.stringify({ captured: capturedPropertyFacts(lead), verified: {}, verificationStatus: "unverified_except_source_record" })) as Prisma.InputJsonObject,
          missingEvidence: allMissingEvidence,
          contactPosture: { doNotContact: lead.doNotContact, optOutReasonRecorded: Boolean(lead.optOutReason), externalContactAuthorized: false },
          ...internalOnlySafetyProof,
        },
      });
      await tx.revenueAuditEvent.create({
        data: {
          tenantId,
          actorId: "system:executive-autonomy",
          action: "real_lead_acquisition_review_materialized",
          targetType: "revenue_task",
          targetId: task.id,
          requestId: idempotencyKey,
          source: REAL_LEAD_MATERIALIZER_SOURCE,
          result: "success",
          safeMetadata: { tenantId, leadId, taskId: task.id, taskType, source: lead.source, idempotencyKey, eligibilityDecision: lead.doNotContact ? "eligible_dnc_governance_only" : "eligible_internal_acquisition_review", missingEvidence: allMissingEvidence, ...internalOnlySafetyProof },
        },
      });
      return baseResult({ status: "created", eligibilityDecision: lead.doNotContact ? "eligible_dnc_governance_only" : "eligible_internal_acquisition_review", taskId: task.id, taskType, idempotencyKey, missingEvidence: allMissingEvidence });
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const existing = await db.revenueTask.findUnique({ where: { tenantId_idempotencyKey: { tenantId, idempotencyKey } } });
    if (!existing) throw error;
    return baseResult({ status: "reused", eligibilityDecision: "concurrent_tenant_scoped_task_reused", taskId: existing.id, taskType: existing.taskType as MaterializationResult["taskType"], idempotencyKey, missingEvidence: (existing.missingEvidence as string[] | null) ?? [] });
  }
}
