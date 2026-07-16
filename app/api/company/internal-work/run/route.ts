import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { runInternalCompanyWork } from "@/lib/company-activation";
import { clearServerCacheKey } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const result = await runInternalCompanyWork();
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/company/internal-work/run failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to run internal company work.",
        approvalRequired: true,
        providerCalled: false,
        sent: false,
        published: false,
        scheduled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
