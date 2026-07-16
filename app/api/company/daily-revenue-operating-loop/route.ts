import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createDailyRevenueOperatingLoop } from "@/lib/daily-revenue-operating-loop";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return NextResponse.json(await createDailyRevenueOperatingLoop());
  } catch (error) {
    console.error("GET /api/company/daily-revenue-operating-loop failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load daily revenue operating loop.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
