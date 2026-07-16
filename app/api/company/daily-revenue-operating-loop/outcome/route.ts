import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import {
  createDailyRevenueOperatingLoop,
  dailyWorkOrderOutcomes,
  findDailyWorkOrder,
  logDailyWorkOrderOutcome,
} from "@/lib/daily-revenue-operating-loop";
import { clearServerCacheKey } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const terminalOutcomes = dailyWorkOrderOutcomes.filter((outcome) => outcome !== "pending") as [
  Exclude<(typeof dailyWorkOrderOutcomes)[number], "pending">,
  ...Array<Exclude<(typeof dailyWorkOrderOutcomes)[number], "pending">>,
];

const outcomeSchema = z.object({
  workOrderId: z.string().trim().min(8).max(320),
  outcome: z.enum(terminalOutcomes),
  note: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const body = await request.json().catch(() => null);
    const parsed = outcomeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid daily revenue work order outcome request.",
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

    const memory = await logDailyWorkOrderOutcome(workOrder, parsed.data);
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json({
      ok: true,
      workOrderId: workOrder.id,
      outcome: parsed.data.outcome,
      memory,
      providerCalled: false,
      liveExecutionAllowed: false,
    });
  } catch (error) {
    console.error("POST /api/company/daily-revenue-operating-loop/outcome failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to log daily work order outcome.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
