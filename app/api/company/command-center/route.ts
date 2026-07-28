import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createAiWorkforceCommandCenter } from "@/lib/ai-collaboration-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return NextResponse.json(await createAiWorkforceCommandCenter());
  } catch (error) {
    console.error("GET /api/company/command-center failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load AI workforce command center.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
