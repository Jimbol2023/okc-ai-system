import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createEnterpriseOperatingCompanyReport } from "@/lib/enterprise-operating-company";
import { createProfessionalDefinitionRegistry } from "@/lib/enterprise-professional-competency-library";
import { listTenantProfessionalRecords } from "@/lib/enterprise-professional-competency-records";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  const includeRecords = new URL(request.url).searchParams.get("includeRecords") === "true";
  const records = includeRecords ? await listTenantProfessionalRecords(actor.tenantId) : null;
  const operatingEvidence = records ? { outcomes: records.outcomes, governance: records.governance.filter((item) => item.eventType.startsWith("operating_company_") || item.eventType === "department_professional_promotion_gate" || item.eventType === "property_intelligence_proof_gate") } : null;
  return NextResponse.json({ ok: true, tenantId: actor.tenantId, operatingCompany: createEnterpriseOperatingCompanyReport(), professionalRegistry: createProfessionalDefinitionRegistry(), operatingEvidence, providerCalled: false, liveExecutionAllowed: false, externalWritesAllowed: false });
}
