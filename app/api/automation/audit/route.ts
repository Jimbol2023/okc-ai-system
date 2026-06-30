import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json({
    ok: true,
    auditEvents: [],
    summary: "Safe automation audit endpoint is ready for durable audit persistence. V1 returns no live execution events.",
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
  });
}
