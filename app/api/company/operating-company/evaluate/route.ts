import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import {
  createCompanyDecisionPacket,
  createCompanyOutcomeCase,
  createRevenueDepartmentContribution,
  evaluateOperatingCompanyPilot,
  type CompanyOutcomeCaseV1,
  type DepartmentWorkAssignmentV1,
  type OperatingCompanyPilotCaseV1,
  type RevenueProfessionalInputSnapshotV1,
} from "@/lib/enterprise-operating-company";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_operating_company_request");
  return value as Record<string, unknown>;
}

export async function POST(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  try {
    const body = object(await request.json().catch(() => null));
    let result: unknown;
    if (body.mode === "company_case") {
      const input = object(body.input);
      const companyCaseInput = input as unknown as Parameters<typeof createCompanyOutcomeCase>[0];
      result = createCompanyOutcomeCase({ ...companyCaseInput, tenantId: actor.tenantId });
    } else if (body.mode === "revenue_contribution") {
      const snapshot = object(body.snapshot) as unknown as RevenueProfessionalInputSnapshotV1;
      const assignment = object(body.assignment) as unknown as DepartmentWorkAssignmentV1;
      result = createRevenueDepartmentContribution({ caseId: String(body.caseId ?? ""), snapshot: { ...snapshot, tenantId: actor.tenantId }, assignment });
    } else if (body.mode === "decision_packet") {
      const companyCase = object(body.companyCase) as unknown as CompanyOutcomeCaseV1;
      if (companyCase.tenantId !== actor.tenantId) throw new Error("cross_tenant_company_case_blocked");
      result = createCompanyDecisionPacket({ companyCase, responsibleHumanOwner: String(body.responsibleHumanOwner ?? ""), expectedOutcome: String(body.expectedOutcome ?? ""), measurementDate: typeof body.measurementDate === "string" ? body.measurementDate : null, connectorGaps: Array.isArray(body.connectorGaps) ? body.connectorGaps.filter((item): item is string => typeof item === "string") : [] });
    } else if (body.mode === "pilot") {
      if (!Array.isArray(body.records) || body.records.length > 100) throw new Error("invalid_pilot_records");
      result = evaluateOperatingCompanyPilot(body.records as OperatingCompanyPilotCaseV1[]);
    } else throw new Error("unsupported_operating_company_mode");
    return NextResponse.json({ ok: true, result, tenantId: actor.tenantId, advisoryOnly: true, providerCalled: false, liveExecutionAllowed: false, externalWritesAllowed: false });
  } catch (error) {
    const message = error instanceof Error && /^[a-z0-9_:.-]{1,160}$/.test(error.message) ? error.message : "invalid_operating_company_request";
    return NextResponse.json({ ok: false, error: message, providerCalled: false, liveExecutionAllowed: false, externalWritesAllowed: false }, { status: 400 });
  }
}
