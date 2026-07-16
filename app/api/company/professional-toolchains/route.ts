import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { listTenantProfessionalRecords } from "@/lib/enterprise-professional-competency-records";
import { createConnectorIntakeEvidenceFromRecords, createProfessionalToolchainsReport } from "@/lib/professional-toolchains";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  const includeRecords = new URL(request.url).searchParams.get("includeRecords") === "true";
  if (!includeRecords) return NextResponse.json({ ok: true, tenantId: actor.tenantId, ...createProfessionalToolchainsReport() });

  const records = await listTenantProfessionalRecords(actor.tenantId);
  const evidence = createConnectorIntakeEvidenceFromRecords(records);
  return NextResponse.json({
    ok: true,
    tenantId: actor.tenantId,
    ...createProfessionalToolchainsReport(evidence),
    evidenceSummary: {
      activeCertifiedProfessionals: evidence.activeCertifiedProfessionalIds.length,
      activeCapabilityQualifications: evidence.activeQualificationIds.length,
      securityApprovedConnectors: evidence.securityApprovedConnectorIds.length,
      recordsIncluded: true,
    },
  });
}
