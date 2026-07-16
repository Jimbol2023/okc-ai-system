import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedAdmin, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { prepareApprovedExecution } from "@/lib/approved-execution-layer";
import {
  createCrmTaskApprovalInputFromWorkOrder,
  createDailyRevenueOperatingLoop,
  findDailyWorkOrder,
} from "@/lib/daily-revenue-operating-loop";
import { clearServerCacheKey } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const prepareCrmTaskSchema = z.object({
  workOrderId: z.string().trim().min(8).max(320),
});

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const body = await request.json().catch(() => null);
    const parsed = prepareCrmTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid daily revenue CRM task preparation request.",
          errors: parsed.error.flatten(),
          providerCalled: false,
          liveExecutionAllowed: false,
        },
        { status: 400 },
      );
    }

    const report = await createDailyRevenueOperatingLoop();
    const workOrder = findDailyWorkOrder(report, parsed.data.workOrderId);

    if (!workOrder) {
      return NextResponse.json(
        {
          ok: false,
          error: "Daily work order was not found in the current operating loop.",
          providerCalled: false,
          liveExecutionAllowed: false,
        },
        { status: 404 },
      );
    }

    if (!workOrder.canCreateCrmTask || workOrder.allowedInternalAction !== "create_crm_task") {
      return NextResponse.json(
        {
          ok: false,
          error: "This daily work order is not eligible for CRM task preparation.",
          providerCalled: false,
          liveExecutionAllowed: false,
        },
        { status: 409 },
      );
    }

    const admin = await getAuthenticatedAdmin();
    const input = createCrmTaskApprovalInputFromWorkOrder(workOrder);
    const result = await prepareApprovedExecution({
      ...input,
      preparedBy: admin?.email ?? input.preparedBy ?? workOrder.aiEmployee,
    });
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json({
      ...result,
      workOrderId: workOrder.id,
      providerCalled: false,
      liveExecutionAllowed: false,
    });
  } catch (error) {
    console.error("POST /api/company/daily-revenue-operating-loop/prepare-crm-task failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to prepare CRM task approval item.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
