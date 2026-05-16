import { NextResponse, type NextRequest } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import {
  evaluateRevenueReadiness,
  generateNextActions,
  generateRiskFlags,
} from "@/lib/system-readiness";
import { getSystemHealth } from "@/lib/system-health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const [systemHealth, revenueReadiness] = await Promise.all([
      getSystemHealth(),
      evaluateRevenueReadiness(),
    ]);
    const riskFlags = await generateRiskFlags(systemHealth, revenueReadiness);
    const recommendedNextActions = generateNextActions(
      revenueReadiness,
      riskFlags,
    );

    return NextResponse.json({
      success: true,
      systemHealth,
      revenueReadiness,
      riskFlags,
      recommendedNextActions,
    });
  } catch (error) {
    console.error("GET /api/system-readiness failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load system readiness.",
      },
      { status: 500 },
    );
  }
}
