import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createCorePlatformRegistryReport } from "@/lib/core-platform-registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const report = createCorePlatformRegistryReport();

  return NextResponse.json({
    ok: true,
    modules: report.businessModules,
    totals: report.totals,
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
