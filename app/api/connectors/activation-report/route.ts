import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createConnectorActivationReport } from "@/lib/connector-activation-report";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const report = await createConnectorActivationReport();

    return NextResponse.json(report);
  } catch (error) {
    console.error("GET /api/connectors/activation-report failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load connector activation report.",
        providerCalled: false,
        liveExecutionAllowed: false,
        workflowStarted: false,
        published: false,
        sent: false,
      },
      { status: 500 },
    );
  }
}
