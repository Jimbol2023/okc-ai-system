import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import {
  assertConnectorCredentialScopeVerificationSafety,
  createConnectorCredentialScopeVerification,
} from "@/lib/connector-credential-scope-verification";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const report = await createConnectorCredentialScopeVerification();
    assertConnectorCredentialScopeVerificationSafety(report);

    return NextResponse.json(report);
  } catch (error) {
    console.error("GET /api/company/connector-credential-scope-verification failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load connector credential/scope verification.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
