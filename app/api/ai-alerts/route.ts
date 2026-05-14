import { NextResponse, type NextRequest } from "next/server";

import { getAiAlerts } from "@/lib/ai-alerts";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";

/**
 * GET /api/ai-alerts
 * Returns actionable AI alert recommendations.
 */
export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const alerts = await getAiAlerts();

    return NextResponse.json({
      success: true,
      alerts,
    });
  } catch (error) {
    console.error("AI alerts GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch AI alerts.",
      },
      { status: 500 }
    );
  }
}
