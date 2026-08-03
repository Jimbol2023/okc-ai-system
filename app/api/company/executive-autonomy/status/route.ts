import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getExecutiveAutonomyLevel1Status } from "@/lib/executive-autonomy-level-1";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type StatusRouteDeps = {
  getStatus: typeof getExecutiveAutonomyLevel1Status;
};

let routeDeps: StatusRouteDeps = {
  getStatus: getExecutiveAutonomyLevel1Status,
};

export function setExecutiveAutonomyStatusRouteDepsForTest(testDeps: Partial<StatusRouteDeps>) {
  const previous = routeDeps;
  routeDeps = { ...routeDeps, ...testDeps };

  return () => {
    routeDeps = previous;
  };
}

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const auth = await getAuthenticatedRequestContext(request);
    const status = await routeDeps.getStatus({ tenantId: auth?.tenantId ?? "default" });

    return NextResponse.json(status);
  } catch (error) {
    console.error("GET /api/company/executive-autonomy/status failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load Executive Autonomy Level 1 status.",
        providerCalled: false,
        sent: false,
        published: false,
        crmMutation: false,
        outreach: false,
        scraping: false,
        externalExecutionAllowed: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
