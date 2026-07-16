import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { runProductionDryRun } from "@/lib/production-dry-run";
import { clearServerCacheKey } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const report = await runProductionDryRun();
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json(report);
  } catch (error) {
    console.error("POST /api/company/production-dry-run failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to run production dry run.",
        providerCalled: false,
        sent: false,
        published: false,
        workflowStarted: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
