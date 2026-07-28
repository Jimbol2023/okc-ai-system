import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createProfessionalWorkforceReport } from "@/lib/enterprise-professional-workforce";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) return getUnauthorizedApiResponse();
  return NextResponse.json(createProfessionalWorkforceReport());
}
