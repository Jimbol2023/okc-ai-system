import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getDbLeadById } from "@/lib/leads-db";
import { evaluateOutreachEligibility } from "@/lib/outreach-gating";

type RouteContext = {
  params: Promise<{
    leadId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request, context: RouteContext) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { leadId } = await context.params;
  const lead = await getDbLeadById(leadId);

  if (!lead) {
    return NextResponse.json(
      {
        ok: false,
        error: "Lead not found.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    leadId,
    eligibility: evaluateOutreachEligibility(lead),
  });
}
