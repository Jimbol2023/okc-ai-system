import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { getInfrastructureHealth } from "@/lib/infrastructure-health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const report = await getInfrastructureHealth({
    includeDatabase: true,
    includeOAuth: true,
  });
  const response = NextResponse.json(report);

  response.headers.set("Cache-Control", "no-store");

  return response;
}
