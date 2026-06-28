import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createExecutiveDashboardReport } from "@/lib/executive-dashboard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return NextResponse.json(await createExecutiveDashboardReport());
  } catch (error) {
    console.error("GET /api/executive-dashboard failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load executive dashboard.",
        providerCalled: false,
        outreachSent: false,
        adsCreated: false,
      },
      { status: 500 },
    );
  }
}
