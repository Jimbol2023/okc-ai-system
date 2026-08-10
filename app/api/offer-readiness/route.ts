import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { getOfferReadinessWorkspace } from "@/lib/offer-readiness";
import { offerReadinessSafetyFlags } from "@/lib/offer-readiness-core";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    const workspace = await getOfferReadinessWorkspace(actor.tenantId);

    return NextResponse.json({
      success: true,
      ...workspace,
    });
  } catch (error) {
    console.error("GET /api/offer-readiness failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load offer readiness workspace right now.",
        safetyFlags: offerReadinessSafetyFlags,
      },
      { status: 500 }
    );
  }
}
