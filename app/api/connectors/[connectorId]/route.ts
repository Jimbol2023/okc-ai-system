import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getEnterpriseConnector } from "@/lib/connector-platform";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ connectorId: string }> }) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { connectorId } = await params;
  const connector = getEnterpriseConnector(connectorId);

  if (!connector) {
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
    connector,
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}

