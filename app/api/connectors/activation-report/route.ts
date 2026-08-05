import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createConnectorActivationReport } from "@/lib/connector-activation-report";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    const report = await createConnectorActivationReport(actor.tenantId);

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
