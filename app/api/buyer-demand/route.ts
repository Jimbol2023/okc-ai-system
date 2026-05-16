import { NextResponse, type NextRequest } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getBuyerDemandSignals } from "@/lib/buyer-demand";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const demandSignals = await getBuyerDemandSignals();

    return NextResponse.json({
      success: true,
      demandSignals,
    });
  } catch (error) {
    console.error("GET /api/buyer-demand failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load buyer demand signals.",
      },
      { status: 500 },
    );
  }
}
