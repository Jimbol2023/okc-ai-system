import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createAiWorkforceReport } from "@/lib/ai-workforce";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return NextResponse.json(await createAiWorkforceReport());
  } catch (error) {
    console.error("GET /api/company/workforce failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load AI workforce report.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
