import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { approveAndExecuteApprovedAction } from "@/lib/approved-execution-layer";
import { clearServerCacheKey } from "@/lib/server-cache";
import { requireTenantId } from "@/lib/tenant-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const approvedExecutionRunSchema = z.object({
  note: z.string().trim().max(1000).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { approvalId } = await params;
    const body = await request.json().catch(() => ({}));
    const parsed = approvedExecutionRunSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid approved execution request.",
          errors: parsed.error.flatten(),
          providerCalled: false,
          sent: false,
          published: false,
          liveExecutionAllowed: false,
        },
        { status: 400 },
      );
    }

    const admin = await getAuthenticatedRequestContext(request);
    const result = await approveAndExecuteApprovedAction({
      tenantId: requireTenantId(admin?.tenantId, "approved_execution_session"),
      approvalId,
      approvedBy: admin?.actorId ?? "CEO",
      note: parsed.data.note,
    });
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/approved-execution/[approvalId]/execute failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to execute approved action.",
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
