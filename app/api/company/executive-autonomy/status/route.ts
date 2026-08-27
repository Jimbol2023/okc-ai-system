import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getExecutiveAutonomyStatusRouteDeps } from "@/lib/executive-autonomy-route-dependencies";
import { requireTenantId } from "@/lib/tenant-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const auth = await getAuthenticatedRequestContext(request);
    const status = await getExecutiveAutonomyStatusRouteDeps().getStatus({ tenantId: requireTenantId(auth?.tenantId, "executive_autonomy_status") });

    return NextResponse.json(status);
  } catch (error) {
    console.error("GET /api/company/executive-autonomy/status failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load Executive Autonomy Level 1 status.",
        providerCalled: false,
        sent: false,
        published: false,
        crmMutation: false,
        outreach: false,
        scraping: false,
        externalExecutionAllowed: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
