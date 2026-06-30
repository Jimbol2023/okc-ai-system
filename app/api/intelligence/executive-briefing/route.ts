import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createExecutiveBriefing } from "@/lib/phase2-intelligence";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { searchParams } = new URL(request.url);
  const cadence = searchParams.get("cadence");

  return NextResponse.json(createExecutiveBriefing(cadence === "weekly" || cadence === "monthly" ? cadence : "daily"));
}

