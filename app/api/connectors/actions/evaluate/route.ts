import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { evaluateConnectorAction } from "@/lib/connector-platform";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const actionSchema = z.object({
  connectorId: z.string().trim().min(2).max(120).optional(),
  actionKey: z.string().trim().min(2).max(120),
  module: z.string().trim().min(2).max(120).optional(),
});

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const payload = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid connector action request.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    plan: evaluateConnectorAction(parsed.data),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}

