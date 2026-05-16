import { NextResponse, type NextRequest } from "next/server";

import { getUnauthorizedApiResponse, isAdminRequest, isAuthenticatedRequest } from "@/lib/auth";
import { AI_CONFIG } from "@/lib/ai-config";
import {
  getActiveAiStrategies,
  getPromotionCandidates,
  promoteWinningStrategies,
} from "@/lib/ai-optimization-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PromotionRequestBody = {
  dryRun?: boolean;
  approvePromotion?: boolean;
  dryRunAcknowledged?: boolean;
  auditReason?: unknown;
};

function getAdminRequiredResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Admin authorization is required for AI optimization mutation.",
    },
    { status: 403 },
  );
}

function getAuditReason(body: PromotionRequestBody | null) {
  return typeof body?.auditReason === "string" && body.auditReason.trim()
    ? body.auditReason.trim()
    : null;
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const [activeStrategies, candidates] = await Promise.all([
      getActiveAiStrategies(),
      getPromotionCandidates(),
    ]);

    return NextResponse.json({
      success: true,
      activeStrategies,
      candidates,
      message: "Controlled AI optimization status returned. No strategy was changed.",
    });
  } catch (error) {
    console.error("GET /api/ai-optimization failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load AI optimization status.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const body = await request.json().catch(() => null) as PromotionRequestBody | null;

    if (body?.dryRun === true) {
      const [activeStrategies, candidates] = await Promise.all([
        getActiveAiStrategies(),
        getPromotionCandidates(),
      ]);

      return NextResponse.json({
        success: true,
        dryRun: true,
        activeStrategies,
        candidates,
        message: "Dry run complete. No AI strategy was changed.",
      });
    }

    if (AI_CONFIG.enableOptimization !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "AI optimization mutation is disabled by feature flag.",
        },
        { status: 403 },
      );
    }

    if (AI_CONFIG.requireAdminForOptimizationMutations && !(await isAdminRequest(request))) {
      return getAdminRequiredResponse();
    }

    const auditReason = getAuditReason(body);

    if (body?.approvePromotion !== true || body?.dryRunAcknowledged !== true || !auditReason) {
      return NextResponse.json(
        {
          success: false,
          error: "Promotion requires explicit approval, dry-run acknowledgement, and a non-empty audit reason.",
        },
        { status: 400 },
      );
    }

    const result = await promoteWinningStrategies({
      auditReason,
      approvedBy: "admin_authorized_request",
      dryRunAcknowledged: true,
    });

    return NextResponse.json({
      success: true,
      ...result,
      message:
        "Promotion criteria evaluated. Only threshold-qualified strategies were promoted.",
    });
  } catch (error) {
    console.error("POST /api/ai-optimization failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to run controlled AI optimization promotion.",
      },
      { status: 500 },
    );
  }
}
