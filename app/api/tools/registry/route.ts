import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createToolRegistrySummary, listToolCapabilities } from "@/lib/tool-capability-manager";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json({
    ok: true,
    tools: listToolCapabilities(),
    summary: createToolRegistrySummary(),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
