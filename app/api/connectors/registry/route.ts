import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getFeatureFlagSnapshot } from "@/lib/feature-flags";
import { listEnterpriseConnectors } from "@/lib/connector-platform";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json({
    ok: true,
    connectors: listEnterpriseConnectors(),
    featureFlags: getFeatureFlagSnapshot(),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}

