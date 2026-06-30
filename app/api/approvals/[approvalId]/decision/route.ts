import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { decideUnifiedApproval } from "@/lib/phase3-production-execution";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const decisionSchema = z.object({
  decision: z.enum(["approve", "reject", "edit", "reschedule", "delegate", "block"]),
  note: z.string().trim().max(1000).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ approvalId: string }> }) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { approvalId } = await params;
  const payload = await request.json().catch(() => null);
  const parsed = decisionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid approval decision.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(decideUnifiedApproval({ approvalId, ...parsed.data }));
}
