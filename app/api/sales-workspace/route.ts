import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { getSalesWorkspace } from "@/lib/sales-workspace";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    const workspace = await getSalesWorkspace(actor.tenantId);

    return NextResponse.json({
      success: true,
      ...workspace,
    });
  } catch (error) {
    console.error("GET /api/sales-workspace failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load sales follow-up workspace right now.",
        safetyFlags: {
          sent: false,
          wouldSend: false,
          providerCalled: false,
          automationTriggered: false,
          crmAutoMutation: false,
          externalFetch: false,
        },
      },
      { status: 500 }
    );
  }
}
