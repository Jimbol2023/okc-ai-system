import { NextResponse, type NextRequest } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { generateBuyerDemandForecast } from "@/lib/predictive-buyer-demand";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const forecast = await generateBuyerDemandForecast();

    return NextResponse.json({
      success: true,
      forecast,
    });
  } catch (error) {
    console.error("GET /api/buyer-demand-forecast failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load buyer demand forecast.",
      },
      { status: 500 },
    );
  }
}
