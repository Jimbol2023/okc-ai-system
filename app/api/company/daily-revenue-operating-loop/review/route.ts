import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedAdmin, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { prepareApprovedExecution } from "@/lib/approved-execution-layer";
import {
  createDailyRevenueOperatingLoop,
  dailyOperatingReviewDecisions,
  reviewDailyWorkOrderFromReport,
} from "@/lib/daily-revenue-operating-loop";
import { clearServerCacheKey } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const reviewSchema = z.object({
  workOrderId: z.string().trim().min(8).max(320),
  decision: z.enum(dailyOperatingReviewDecisions),
  note: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const body = await request.json().catch(() => null);
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid daily operating review request.",
          errors: parsed.error.flatten(),
          providerCalled: false,
          liveExecutionAllowed: false,
        },
        { status: 400 },
      );
    }

    const admin = await getAuthenticatedAdmin();
    const reviewedBy = admin?.email ?? "CEO";
    if (!admin?.tenantId) return getUnauthorizedApiResponse();
    const report = await createDailyRevenueOperatingLoop(admin.tenantId);
    const review = await reviewDailyWorkOrderFromReport(report, {
      ...parsed.data,
      reviewedBy,
    });

    if (!review.ok) {
      return NextResponse.json(review, { status: review.status === "invalid" ? 404 : 409 });
    }

    if (review.decision === "approve_crm_task") {
      if (!review.approvalInput) {
        return NextResponse.json(
          {
            ...review,
            ok: false,
            status: "blocked",
            error: "CRM task approval input was not prepared.",
            providerCalled: false,
            liveExecutionAllowed: false,
          },
          { status: 409 },
        );
      }

      const prepared = await prepareApprovedExecution({
        ...review.approvalInput,
        preparedBy: reviewedBy,
      });
      clearServerCacheKey("executive-dashboard-report");

      return NextResponse.json({
        ok: true,
        decision: review.decision,
        workOrderId: review.workOrderId,
        status: "approval_prepared",
        approvalItem: prepared.approvalItem,
        providerCalled: false,
        liveExecutionAllowed: false,
      });
    }

    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json({
      ok: true,
      decision: review.decision,
      workOrderId: review.workOrderId,
      status: review.status,
      memory: review.memory,
      providerCalled: false,
      liveExecutionAllowed: false,
    });
  } catch (error) {
    console.error("POST /api/company/daily-revenue-operating-loop/review failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to review daily work order.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
