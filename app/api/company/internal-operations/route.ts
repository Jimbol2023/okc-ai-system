import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { parseControlledInternalOperationAction, runControlledInternalOperation } from "@/lib/controlled-internal-operations";
import { clearServerCacheKey } from "@/lib/server-cache";
import { requireTenantId } from "@/lib/tenant-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json().catch(() => null);
    const action = parseControlledInternalOperationAction(payload?.action);
    const auth = await getAuthenticatedRequestContext(request);
    const result = await runControlledInternalOperation(action, requireTenantId(auth?.tenantId, "internal_operation_session"));
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/company/internal-operations failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to run controlled internal operation.",
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
