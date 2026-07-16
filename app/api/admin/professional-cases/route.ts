import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { isTenantFeatureEnabled } from "@/lib/governed-feature-flags";
import { appendProfessionalCaseOutcome, appendProfessionalContribution, appendProfessionalDecision, appendProfessionalReview, claimProfessionalAssignment, createProfessionalCase, listProfessionalWorkCompatibilityView, requestProfessionalCaseQa } from "@/lib/professional-case-runtime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return getUnauthorizedApiResponse();
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  const view = await listProfessionalWorkCompatibilityView(actor.tenantId);
  return NextResponse.json({ ok: true, records: view.professionalCases, legacyAssignments: view.legacyAssignments, dualReadComparison: view.dualReadComparison, tenantId: actor.tenantId, runtimeWriteEnabled: await isTenantFeatureEnabled(actor.tenantId, "professional_case_runtime"), providerCalled: false, externalActionsAllowed: false });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return getUnauthorizedApiResponse();
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  if (!(await isTenantFeatureEnabled(actor.tenantId, "professional_case_runtime"))) return NextResponse.json({ ok: false, error: "professional_case_runtime_disabled" }, { status: 409 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || body.confirmation !== "RECORD_INTERNAL_PROFESSIONAL_CASE_WORK") return NextResponse.json({ ok: false, error: "exact_confirmation_required" }, { status: 400 });
  const trustedActor = { tenantId: actor.tenantId, actorId: actor.actorId };
  const key = request.headers.get("idempotency-key") ?? "";
  try {
    const record = body.operation === "create_case"
      ? await createProfessionalCase({ actor: trustedActor, idempotencyKey: key, caseType: body.caseType, title: body.title, objective: body.objective, sourceLabel: body.sourceLabel, sourceReference: body.sourceReference, leadProfessionalId: body.leadProfessionalId, independentReviewerId: body.independentReviewerId, department: body.department, businessModule: body.businessModule, evidenceSnapshot: body.evidenceSnapshot, limitations: body.limitations })
        : body.operation === "claim_assignment"
          ? await claimProfessionalAssignment({ actor: trustedActor, idempotencyKey: key, assignmentId: body.assignmentId, leaseSeconds: typeof body.leaseSeconds === "number" ? body.leaseSeconds : undefined })
        : body.operation === "request_qa"
          ? await requestProfessionalCaseQa({ actor: trustedActor, caseId: body.caseId, idempotencyKey: key })
        : body.operation === "contribution"
          ? await appendProfessionalContribution({ actor: trustedActor, caseId: body.caseId, idempotencyKey: key, professionalId: body.professionalId, department: body.department, contributionType: body.contributionType, sourceLabel: body.sourceLabel, sourceReferences: body.sourceReferences, content: body.content, limitations: body.limitations, dataGap: body.dataGap === true })
          : body.operation === "review"
            ? await appendProfessionalReview({ actor: trustedActor, caseId: body.caseId, idempotencyKey: key, deliverableId: body.deliverableId, generatorId: body.generatorId, reviewerId: body.reviewerId, status: body.status, rubricVersion: body.rubricVersion, checks: body.checks, blockingDefects: body.blockingDefects, rationale: body.rationale })
            : body.operation === "decision"
              ? await appendProfessionalDecision({ actor: trustedActor, caseId: body.caseId, idempotencyKey: key, decision: body.decision, rationale: body.rationale, evidenceReferences: body.evidenceReferences, executionAuthorized: body.executionAuthorized === true })
              : body.operation === "outcome"
                ? await appendProfessionalCaseOutcome({ actor: trustedActor, caseId: body.caseId, idempotencyKey: key, sourceLabel: body.sourceLabel, evidenceReferences: body.evidenceReferences, metrics: body.metrics, verified: body.verified === true, learningApplied: body.learningApplied === true })
              : null;
    if (!record) return NextResponse.json({ ok: false, error: "unsupported_operation" }, { status: 400 });
    return NextResponse.json({ ok: true, recordId: record.id, tenantId: actor.tenantId, providerCalled: false, externalActionsAllowed: false }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "professional_case_operation_failed";
    const prismaCode = error && typeof error === "object" && "code" in error ? error.code : null;
    const safeError = prismaCode === "P2028"
      ? "professional_case_transaction_capacity_timeout"
      : prismaCode === "P2034"
        ? "professional_case_transaction_conflict"
        : /^[a-z0-9_:.-]{1,160}$/.test(message)
          ? message
          : "professional_case_operation_failed";
    const conflict = /idempotency|already_claimed|not_ready|not_awaiting/i.test(safeError);
    return NextResponse.json({ ok: false, error: safeError }, { status: conflict ? 409 : 400 });
  }
}
