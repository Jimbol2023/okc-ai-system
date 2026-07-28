import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createEnterpriseProfessionalCompetencyLibraryReport, createProfessionalPortfolioReport } from "@/lib/enterprise-professional-competency-library";
import { listTenantProfessionalRecords } from "@/lib/enterprise-professional-competency-records";
import { createEnterpriseProfessionalOperatingSystemReport, createExecutiveProfessionalPortfolio, professionalDepartments, type ProfessionalDepartment } from "@/lib/enterprise-professional-operating-system";
import { createConnectorIntakeEvidenceFromRecords, createProfessionalToolchainsReport } from "@/lib/professional-toolchains";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  const url = new URL(request.url);
  if (url.searchParams.get("includeRecords") !== "true") return NextResponse.json({ ...createEnterpriseProfessionalCompetencyLibraryReport(), operatingSystem: createEnterpriseProfessionalOperatingSystemReport(), professionalToolchains: createProfessionalToolchainsReport() });
  const records = await listTenantProfessionalRecords(actor.tenantId);
  const propertyProof = records.governance.find((item) => item.eventType === "property_intelligence_proof_gate");
  const propertyResult = propertyProof && typeof propertyProof.sanitizedData === "object" && propertyProof.sanitizedData && "result" in propertyProof.sanitizedData ? propertyProof.sanitizedData.result : null;
  const promotionResults = propertyResult === "passed" || propertyResult === "failed" ? { "Property Intelligence": propertyResult } as const : {};
  const departmentPromotionResults: Partial<Record<ProfessionalDepartment, "failed" | "passed">> = { ...promotionResults };
  for (const event of [...records.governance].reverse()) {
    if (event.eventType !== "department_professional_promotion_gate" || !event.sanitizedData || typeof event.sanitizedData !== "object" || Array.isArray(event.sanitizedData)) continue;
    const department = "department" in event.sanitizedData ? event.sanitizedData.department : null;
    const result = "result" in event.sanitizedData ? event.sanitizedData.result : null;
    if (professionalDepartments.includes(department as ProfessionalDepartment) && (result === "passed" || result === "failed")) departmentPromotionResults[department as ProfessionalDepartment] = result;
  }
  const operatingSystem = createEnterpriseProfessionalOperatingSystemReport();
  return NextResponse.json({ ...createEnterpriseProfessionalCompetencyLibraryReport(), operatingSystem: { ...operatingSystem, executivePortfolio: createExecutiveProfessionalPortfolio(departmentPromotionResults) }, professionalToolchains: createProfessionalToolchainsReport(createConnectorIntakeEvidenceFromRecords(records)), records, portfolio: createProfessionalPortfolioReport(records.certifications.map((item) => ({ ...item, certificationId: item.id, assessmentRecordIds: item.assessmentRecordIds as string[], state: item.state as never, effectiveAt: item.effectiveAt.toISOString(), expiresAt: item.expiresAt?.toISOString() ?? null, providerAccessGranted: false, approvalAuthorityGranted: false, externalExecutionGranted: false })), departmentPromotionResults) });
}
