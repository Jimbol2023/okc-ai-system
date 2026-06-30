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
    queue: [],
    summary: "Safe automation queue is ready. No live external actions are queued in v1.",
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
  });
}
