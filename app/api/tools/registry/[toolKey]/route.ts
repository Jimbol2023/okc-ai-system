import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getToolReadiness } from "@/lib/tool-capability-manager";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ toolKey: string }> }) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { toolKey } = await params;
  const tool = getToolReadiness(toolKey);

  if (!tool) {
    return NextResponse.json(
      {
        ok: false,
        error: "Tool not found.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    tool,
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
