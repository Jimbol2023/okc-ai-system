import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPrismaPropertyOpportunityDb } from "@/lib/property-opportunity-db";
import { createPropertyOpportunityAcquisitionReviewTask } from "@/lib/property-opportunity-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ opportunityId: string }> },
) {
  try {
    const context = await getAuthenticatedRequestContext(request);
    if (!context) return getUnauthorizedApiResponse();

    const { opportunityId } = await params;
    const task = await createPropertyOpportunityAcquisitionReviewTask(createPrismaPropertyOpportunityDb(prisma), opportunityId, context);

    return NextResponse.json(
      {
        ok: true,
        task,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "property_opportunity_not_found") {
      return NextResponse.json(
        {
          ok: false,
          error: "Property opportunity not found.",
          providerCalled: false,
          sent: false,
          published: false,
          crmMutated: false,
          liveExecutionAllowed: false,
        },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("POST /api/company/property-opportunities/[opportunityId]/acquisition-review-task failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to create property opportunity acquisition review task.",
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
