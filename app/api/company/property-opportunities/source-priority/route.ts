import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { listDbLeads } from "@/lib/leads-db";
import { prisma } from "@/lib/prisma";
import { createPrismaPropertyOpportunityDb } from "@/lib/property-opportunity-db";
import { listPropertyOpportunities, type PropertyOpportunityRecord } from "@/lib/property-opportunity-engine";
import { createPropertyProviderSourcePriorityReport } from "@/lib/property-provider-source-priority";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isMissingPropertyOpportunityTableError(error: unknown) {
  return error instanceof Error && /PropertyOpportunity|relation .* does not exist|table .* does not exist|does not exist/i.test(error.message);
}

export async function GET(request: Request) {
  try {
    const context = await getAuthenticatedRequestContext(request);
    if (!context) return getUnauthorizedApiResponse();

    const leads = await listDbLeads({ tenantId: context.tenantId });
    let opportunityDataAccessIssue: string | null = null;
    let opportunities: PropertyOpportunityRecord[] = [];

    try {
      const result = await listPropertyOpportunities(createPrismaPropertyOpportunityDb(prisma), context.tenantId);
      opportunities = result.opportunities;
    } catch (error) {
      if (!isMissingPropertyOpportunityTableError(error)) throw error;
      opportunityDataAccessIssue = "PropertyOpportunity persisted evidence is not readable yet; source priority remains internal/read-only and fails closed for provider activation.";
    }

    const report = createPropertyProviderSourcePriorityReport({
      opportunities,
      leads,
      opportunityDataAccessIssue,
    });

    return NextResponse.json(
      {
        ok: true,
        report,
        providerCalled: false,
        sent: false,
        published: false,
        crmMutated: false,
        liveExecutionAllowed: false,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/company/property-opportunities/source-priority failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load property provider source priority report.",
        providerCalled: false,
        sent: false,
        published: false,
        crmMutated: false,
        liveExecutionAllowed: false,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
