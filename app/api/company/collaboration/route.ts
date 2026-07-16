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

    const commandCenter = await createAiWorkforceCommandCenter();

    return NextResponse.json({
      ok: true,
      generatedAt: commandCenter.generatedAt,
      requests: commandCenter.requests,
      dependencyChains: commandCenter.dependencyChains,
      managerEscalations: commandCenter.managerEscalations,
      ceoEscalations: commandCenter.ceoEscalations,
      safety: commandCenter.safety,
      providerCalled: false,
      liveExecutionAllowed: false,
    });
  } catch (error) {
    console.error("GET /api/company/collaboration failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load AI collaboration requests.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
