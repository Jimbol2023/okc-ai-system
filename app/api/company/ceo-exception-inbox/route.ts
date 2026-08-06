import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getCeoExceptionInbox, internalOnlyExceptionInboxFailure } from "@/lib/ceo-exception-inbox-route-contract";
import { requireTenantId } from "@/lib/tenant-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CeoExceptionInboxRouteDeps = {
  getInbox: typeof getCeoExceptionInbox;
};

let routeDeps: CeoExceptionInboxRouteDeps = { getInbox: getCeoExceptionInbox };

export function setCeoExceptionInboxRouteDepsForTest(testDeps: Partial<CeoExceptionInboxRouteDeps>) {
  const previous = routeDeps;
  routeDeps = { ...routeDeps, ...testDeps };
  return () => {
    routeDeps = previous;
  };
}

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) return getUnauthorizedApiResponse();
    const actor = await getAuthenticatedRequestContext(request);
    const tenantId = requireTenantId(actor?.tenantId, "ceo_exception_inbox_route");
    return NextResponse.json({ ok: true, ...(await routeDeps.getInbox({ tenantId })) });
  } catch (error) {
    console.error("GET /api/company/ceo-exception-inbox failed:", error);
    return NextResponse.json(internalOnlyExceptionInboxFailure, { status: 500 });
  }
}
