import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { selectToolForAction } from "@/lib/tool-capability-manager";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const toolDecisionSchema = z.object({
  requestedAction: z.string().trim().min(2).max(120),
  preferredToolKey: z.string().trim().min(2).max(120).optional(),
  module: z.string().trim().min(2).max(120).optional(),
});

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const payload = await request.json().catch(() => null);
  const parsed = toolDecisionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid tool decision request.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    decision: selectToolForAction(parsed.data),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
