import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { prepareConnectorWizardAction } from "@/lib/phase3-production-execution";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ connectorId: string }> }) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { connectorId } = await params;

  return NextResponse.json(prepareConnectorWizardAction(connectorId, "install"));
}
