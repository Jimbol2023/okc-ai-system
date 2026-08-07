import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { listDbLeads } from "@/lib/leads-db";
import { prisma } from "@/lib/prisma";
import { createPrismaPropertyOpportunityDb } from "@/lib/property-opportunity-db";
import { adaptExistingLeadsToPropertyOpportunities } from "@/lib/property-opportunity-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const context = await getAuthenticatedRequestContext(request);
    if (!context) return getUnauthorizedApiResponse();

    const leads = await listDbLeads({ tenantId: context.tenantId });
    const report = await adaptExistingLeadsToPropertyOpportunities(createPrismaPropertyOpportunityDb(prisma), leads, context);

    return NextResponse.json(
      {
        ok: true,
        report,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("POST /api/company/property-opportunities/adapt-existing failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to adapt existing leads into property opportunities.",
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
