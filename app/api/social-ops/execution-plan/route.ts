import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createSocialExecutionPlan } from "@/lib/phase3-production-execution";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const executionPlanSchema = z.object({
  draftId: z.string().trim().min(2).max(120),
  connectorId: z.string().trim().min(2).max(120).optional(),
  actionKey: z.string().trim().min(2).max(120).optional(),
});

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const payload = await request.json().catch(() => null);
  const parsed = executionPlanSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid social execution plan request.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(createSocialExecutionPlan(parsed.data));
}
