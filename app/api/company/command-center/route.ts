import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createAiWorkforceCommandCenter } from "@/lib/ai-collaboration-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    return NextResponse.json(await createAiWorkforceCommandCenter(actor.tenantId));
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
