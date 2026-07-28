import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { assertConnectorOperatorEvidenceSafety, createConnectorOperatorRunbook } from "@/lib/connector-operator-evidence-capture";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const packet = await createConnectorOperatorRunbook();
    assertConnectorOperatorEvidenceSafety(packet);

    return NextResponse.json(packet);
  } catch (error) {
    console.error("GET /api/company/connector-operator-runbook failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load connector operator runbook.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
