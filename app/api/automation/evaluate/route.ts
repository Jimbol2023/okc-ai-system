import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { evaluateSafeAutomation, getSafeAutoDefaults } from "@/lib/safe-auto-mode";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const safeModeSchema = z.object({
  requestedAction: z.string().trim().min(2).max(120),
  preferredToolKey: z.string().trim().min(2).max(120).optional(),
  module: z.string().trim().min(2).max(120).optional(),
  expectedRoi: z.enum(["low", "medium", "high"]).optional(),
});

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json({
    ok: true,
    defaults: getSafeAutoDefaults(),
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const payload = await request.json().catch(() => null);
  const parsed = safeModeSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid safe automation request.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    decision: evaluateSafeAutomation(parsed.data),
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
  });
}
