import { NextResponse, type NextRequest } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import {
  analyzeOverridePerformance,
  compareBeforeAfterMetrics,
} from "@/lib/ai-impact-analyzer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const [overridePerformance, improvementMetrics] = await Promise.all([
      analyzeOverridePerformance(),
      compareBeforeAfterMetrics(),
    ]);

    return NextResponse.json({
      success: true,
      overridePerformance,
      improvementMetrics: {
        responseLift: improvementMetrics.responseLift,
        conversionLift: improvementMetrics.conversionLift,
        followUpLift: improvementMetrics.followUpLift,
        before: improvementMetrics.before,
        after: improvementMetrics.after,
      },
      message: "AI optimization impact is measured only. No strategies were promoted.",
    });
  } catch (error) {
    console.error("GET /api/ai-impact failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load AI optimization impact.",
      },
      { status: 500 },
    );
  }
}
