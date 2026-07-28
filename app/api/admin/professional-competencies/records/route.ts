import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { appendAssessmentRecord, appendCapabilityQualificationRecord, appendCertificationRecord, appendCompanyDecisionEvidence, appendDepartmentProofGateRecord, appendOperatingCompanyPilotEvidence, appendProfessionalOutcome, appendProfessionalRemediationRecord, appendPropertyProofGateRecord } from "@/lib/enterprise-professional-competency-records";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return getUnauthorizedApiResponse();
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  const idempotencyKey = request.headers.get("idempotency-key") ?? "";
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || body.confirmation !== "RECORD_EPC_GOVERNED_EVIDENCE") return NextResponse.json({ ok: false, error: "exact_confirmation_required" }, { status: 400 });
  try {
    const trustedActor = { tenantId: actor.tenantId, actorId: actor.actorId };
    const record = body.operation === "assessment"
      ? await appendAssessmentRecord({ actor: trustedActor, idempotencyKey, professionalId: body.professionalId, profileVersion: body.profileVersion, competencyId: body.competencyId, competencyVersion: body.competencyVersion, assessmentMethod: body.assessmentMethod, evidenceReferences: body.evidenceReferences, result: body.result, reason: body.reason })
      : body.operation === "certification"
        ? await appendCertificationRecord({ actor: trustedActor, idempotencyKey, professionalId: body.professionalId, profileVersion: body.profileVersion, competencyId: body.competencyId, competencyVersion: body.competencyVersion, sopId: body.sopId, sopVersion: body.sopVersion, deliverableId: body.deliverableId, deliverableVersion: body.deliverableVersion, businessModule: body.businessModule, state: body.state, assessmentRecordIds: body.assessmentRecordIds, reason: body.reason, expiresAt: body.expiresAt })
        : body.operation === "outcome"
          ? await appendProfessionalOutcome({ actor: trustedActor, idempotencyKey, outcome: body.outcome as never, reason: body.reason })
          : body.operation === "property_proof_gate"
            ? await appendPropertyProofGateRecord({ actor: trustedActor, idempotencyKey, metrics: body.metrics as never, reason: body.reason })
          : body.operation === "department_proof_gate"
            ? await appendDepartmentProofGateRecord({ actor: trustedActor, idempotencyKey, department: body.department, metrics: body.metrics as never, reason: body.reason })
          : body.operation === "capability_qualification"
            ? await appendCapabilityQualificationRecord({ actor: trustedActor, idempotencyKey, qualificationId: body.qualificationId, professionalId: body.professionalId, evidenceReferences: body.evidenceReferences, expiresAt: body.expiresAt, reason: body.reason })
          : body.operation === "remediation"
            ? await appendProfessionalRemediationRecord({ actor: trustedActor, idempotencyKey, professionalId: body.professionalId, failureCategory: body.failureCategory, rootCause: body.rootCause, affectedDefinitionIds: body.affectedDefinitionIds, correctiveAction: body.correctiveAction, residualRisk: body.residualRisk, reason: body.reason })
          : body.operation === "company_decision"
            ? await appendCompanyDecisionEvidence({ actor: trustedActor, idempotencyKey, caseId: body.caseId, inputSnapshotVersion: body.inputSnapshotVersion, decision: body.decision, rationale: body.rationale, evidenceReferences: body.evidenceReferences, reason: body.reason })
          : body.operation === "operating_company_pilot"
            ? await appendOperatingCompanyPilotEvidence({ actor: trustedActor, idempotencyKey, records: body.records as never, reason: body.reason })
          : null;
    if (!record) return NextResponse.json({ ok: false, error: "unsupported_operation" }, { status: 400 });
    const recordId = "id" in record ? record.id : record.record.id;
    return NextResponse.json({ ok: true, state: "recorded", recordId, tenantId: actor.tenantId, providerCalled: false, liveExecutionAllowed: false, externalWritesAllowed: false }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "record_failed";
    const conflict = /idempotency|unique/i.test(message);
    const safeError = /^[a-z0-9_:.-]{1,160}$/.test(message) ? message : "governed_record_validation_failed";
    return NextResponse.json({ ok: false, error: conflict ? "duplicate_evidence_submission" : safeError }, { status: conflict ? 409 : 400 });
  }
}
