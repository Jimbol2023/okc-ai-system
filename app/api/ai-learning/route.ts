import { NextResponse, type NextRequest } from "next/server";

import { generateAiLearningInsights } from "@/lib/ai-learning-engine";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const insights = await generateAiLearningInsights();

    return NextResponse.json({
      success: true,
      insights,
    });
  } catch (error) {
    console.error("GET /api/ai-learning failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate AI learning insights.",
      },
      { status: 500 },
    );
  }
}
