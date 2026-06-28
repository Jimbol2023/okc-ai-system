import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getOfferReadinessWorkspace } from "@/lib/offer-readiness";
import { offerReadinessSafetyFlags } from "@/lib/offer-readiness-core";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const workspace = await getOfferReadinessWorkspace();

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
