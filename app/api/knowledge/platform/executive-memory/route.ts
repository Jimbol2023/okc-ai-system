import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAdminRequest, isAuthenticatedRequest } from "@/lib/auth";
import { createExecutiveDecisionMemoryPreview, recordExecutiveDecisionMemory } from "@/lib/enterprise-knowledge-platform";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json({
    ok: true,
    decisionMemory: [createExecutiveDecisionMemoryPreview()],
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  try {
    const result = await recordExecutiveDecisionMemory({ actorId: "admin" });

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/knowledge/platform/executive-memory failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to record executive memory. Confirm the ExecutiveDecisionMemory migration has been applied.",
        providerCalled: false,
        sent: false,
        published: false,
        scraped: false,
        outreachSent: false,
        workflowStarted: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
