import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getDepartmentIntelligenceReport } from "@/lib/department-intelligence";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const report = await getDepartmentIntelligenceReport();

    return NextResponse.json({
      ok: true,
      ...report,
    });
  } catch (error) {
    console.error("GET /api/company/departments/intelligence failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load Department Intelligence.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
