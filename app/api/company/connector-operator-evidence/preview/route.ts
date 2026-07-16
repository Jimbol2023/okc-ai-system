import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { assertConnectorOperatorEvidenceSafety, previewConnectorOperatorEvidence } from "@/lib/connector-operator-evidence-capture";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const body = (await request.json().catch(() => ({}))) as {
      grantedScopes?: unknown;
      operatorInitials?: unknown;
      note?: unknown;
    };
    const packet = await previewConnectorOperatorEvidence({
      grantedScopes: Array.isArray(body.grantedScopes) ? body.grantedScopes.filter((scope): scope is string => typeof scope === "string") : [],
      operatorInitials: typeof body.operatorInitials === "string" ? body.operatorInitials : undefined,
      note: typeof body.note === "string" ? body.note : undefined,
    });
    assertConnectorOperatorEvidenceSafety(packet);

    return NextResponse.json(packet);
  } catch (error) {
    console.error("POST /api/company/connector-operator-evidence/preview failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to preview connector operator evidence.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
