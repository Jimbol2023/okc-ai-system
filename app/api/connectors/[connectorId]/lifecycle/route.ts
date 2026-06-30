import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { evaluateConnectorLifecycle } from "@/lib/connector-platform";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const lifecycleSchema = z.object({
  lifecycleAction: z.enum(["install", "configure", "authenticate", "test", "enable", "disable", "upgrade", "rollback", "remove", "monitor"]),
});

export async function POST(request: Request, { params }: { params: Promise<{ connectorId: string }> }) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { connectorId } = await params;
  const payload = await request.json().catch(() => null);
  const parsed = lifecycleSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid lifecycle request.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(evaluateConnectorLifecycle({ connectorId, lifecycleAction: parsed.data.lifecycleAction }));
}

