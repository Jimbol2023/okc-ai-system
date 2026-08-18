import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse } from "@/lib/auth";
import { autonomySafetyFlags } from "@/lib/autonomy-policy";
import { getAutonomyStatusRouteDeps } from "./route-support";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const routeDeps = getAutonomyStatusRouteDeps();
    const auth = await routeDeps.getAuth(request);
    if (!auth) return getUnauthorizedApiResponse();
    const status = await routeDeps.getStatus(auth.tenantId);
    return NextResponse.json(status, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET /api/company/autonomy/status failed:", error);
    return NextResponse.json({ ok: false, error: "Unable to load autonomy status.", safety: autonomySafetyFlags }, { status: 500 });
  }
}
