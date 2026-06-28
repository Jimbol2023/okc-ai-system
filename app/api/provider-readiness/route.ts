import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createProviderReadinessReport } from "@/lib/provider-readiness";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return NextResponse.json(createProviderReadinessReport());
  } catch (error) {
    console.error("GET /api/provider-readiness failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load provider readiness.",
        providerCalled: false,
        liveCallsAllowed: false,
      },
      { status: 500 },
    );
  }
}
