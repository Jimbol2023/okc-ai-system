import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getConnectorHealth } from "@/lib/connector-platform";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ connectorId: string }> }) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { connectorId } = await params;
  const health = getConnectorHealth(connectorId);

  if (health.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Connector not found.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    health: health[0],
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}

