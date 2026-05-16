import { NextResponse, type NextRequest } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import {
  getAiPerformanceMetrics,
  getLatestAiPerformanceMetric,
} from "@/lib/ai-performance";
import { calculateAiPerformanceRates } from "@/lib/ai-performance-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/ai-performance
 * Returns latest AI performance snapshot and recent history.
 */
export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const [latest, history, performance] = await Promise.all([
      getLatestAiPerformanceMetric(),
      getAiPerformanceMetrics(),
      calculateAiPerformanceRates(),
    ]);

    return NextResponse.json({
      success: true,
      latest,
      history,
      responseRate: performance.responseRate,
      approvalRate: performance.approvalRate,
      rejectionRate: performance.rejectionRate,
      conversionRate: performance.conversionRate,
      followUpEffectiveness: performance.followUpEffectiveness,
      performance,
    });
  } catch (error) {
    console.error("AI performance GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch AI performance metrics.",
      },
      { status: 500 }
    );
  }
}
