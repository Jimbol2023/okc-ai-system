import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createMobileCommandCenter, createVerticalSliceSimulation } from "@/lib/phase3-production-execution";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { searchParams } = new URL(request.url);

  return NextResponse.json(searchParams.get("includeVerticalSlice") === "true" ? createVerticalSliceSimulation() : createMobileCommandCenter());
}
