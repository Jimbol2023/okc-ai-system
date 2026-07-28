import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { assertConnectorActivationGateSafety, createConnectorActivationGate } from "@/lib/connector-activation-gate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const report = await createConnectorActivationGate();
    assertConnectorActivationGateSafety(report);

    return NextResponse.json(report);
  } catch (error) {
    console.error("GET /api/company/connector-activation-gate failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load connector activation gate.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
