import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { listToolCapabilities } from "@/lib/tool-capability-manager";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json({
    ok: true,
    health: listToolCapabilities().map((tool) => ({
      toolKey: tool.toolKey,
      name: tool.name,
      healthStatus: tool.healthStatus,
      lastSuccessfulRunAt: tool.lastSuccessfulRunAt,
      lastFailureAt: tool.lastFailureAt,
      retryPolicy: tool.retryPolicy,
      rateLimits: tool.rateLimits,
      providerCalled: false,
    })),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
