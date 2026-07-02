import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createEnterpriseSecurityPlatformReport, evaluateAiSecurityEvent } from "@/lib/enterprise-security-platform";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const aiSecurityEventSchema = z.object({
  prompt: z.string().trim().max(4000).optional(),
  requestedAction: z.string().trim().min(2).max(120).optional(),
  requestedToolKey: z.string().trim().min(2).max(120).optional(),
  userRole: z.string().trim().min(2).max(80).optional(),
  dataClasses: z.array(z.string().trim().min(2).max(80)).max(20).optional(),
  sourceLabel: z.string().trim().min(2).max(120).optional(),
});

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json({
    ok: true,
    report: createEnterpriseSecurityPlatformReport(),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const payload = await request.json().catch(() => null);
  const parsed = aiSecurityEventSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid AI security event request.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    decision: evaluateAiSecurityEvent(parsed.data),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
