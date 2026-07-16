import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedAdmin, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { approvedExecutionActionTypes, prepareApprovedExecution } from "@/lib/approved-execution-layer";
import { clearServerCacheKey } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const approvedExecutionPrepareSchema = z.object({
  actionType: z.enum(approvedExecutionActionTypes),
  title: z.string().trim().min(2).max(200),
  sourceLabel: z.string().trim().min(2).max(160),
  leadId: z.string().trim().max(120).optional(),
  payload: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const body = await request.json().catch(() => null);
    const parsed = approvedExecutionPrepareSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid approved execution preparation request.",
          errors: parsed.error.flatten(),
          providerCalled: false,
          sent: false,
          published: false,
          liveExecutionAllowed: false,
        },
        { status: 400 },
      );
    }

    const admin = await getAuthenticatedAdmin();
    const result = await prepareApprovedExecution({
      ...parsed.data,
      preparedBy: admin?.email ?? "CEO",
    });
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/approved-execution/prepare failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to prepare approved execution item.",
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
