import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getSalesConversionDashboard } from "@/lib/sales-conversion-assist";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const dashboard = await getSalesConversionDashboard();

    return NextResponse.json({
      ok: true,
      ...dashboard,
    });
  } catch (error) {
    console.error("GET /api/sales-conversion failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to load sales conversion dashboard." }, { status: 500 });
  }
}
