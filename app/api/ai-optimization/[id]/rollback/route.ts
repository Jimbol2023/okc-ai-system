import { NextResponse, type NextRequest } from "next/server";

import { getUnauthorizedApiResponse, isAdminRequest, isAuthenticatedRequest } from "@/lib/auth";
import { AI_CONFIG } from "@/lib/ai-config";
import { rollbackPromotedStrategy } from "@/lib/ai-optimization-engine";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getAdminRequiredResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Admin authorization is required for AI optimization rollback.",
    },
    { status: 403 },
  );
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    if (AI_CONFIG.enableOptimization !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "AI optimization rollback is disabled by feature flag.",
        },
        { status: 403 },
      );
    }

    if (AI_CONFIG.requireAdminForOptimizationMutations && !(await isAdminRequest(request))) {
      return getAdminRequiredResponse();
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const reason =
      typeof body?.reason === "string" && body.reason.trim()
        ? body.reason.trim()
        : null;

    if (!reason) {
      return NextResponse.json(
        {
          success: false,
          error: "Rollback requires a non-empty audit reason.",
        },
        { status: 400 },
      );
    }

    const result = await rollbackPromotedStrategy(id, reason);

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      rolledBack: true,
      recommendation: {
        ...result.recommendation,
        createdAt: result.recommendation.createdAt.toISOString(),
        reviewedAt: result.recommendation.reviewedAt?.toISOString() ?? null,
        appliedAt: result.recommendation.appliedAt?.toISOString() ?? null,
        promotedAt: result.recommendation.promotedAt?.toISOString() ?? null,
      },
      message: "AI strategy rolled back by human override.",
    });
  } catch (error) {
    console.error("POST /api/ai-optimization/[id]/rollback failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to roll back AI strategy.",
      },
      { status: 500 },
    );
  }
}
