import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { getSalesConversionDashboard } from "@/lib/sales-conversion-assist";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    const dashboard = await getSalesConversionDashboard(actor.tenantId);

    return NextResponse.json({
      ok: true,
      ...dashboard,
    });
  } catch (error) {
    console.error("GET /api/sales-conversion failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to load sales conversion dashboard." }, { status: 500 });
  }
}
