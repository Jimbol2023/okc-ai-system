import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createAiEmployeeToolboxReadiness } from "@/lib/ai-employee-toolbox-readiness";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return NextResponse.json(await createAiEmployeeToolboxReadiness());
  } catch (error) {
    console.error("GET /api/company/toolbox-readiness failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load AI employee toolbox readiness.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
