import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest, isCronAuthorizedRequest } from "@/lib/auth";
import { clearServerCacheKey } from "@/lib/server-cache";
import { requireTenantId } from "@/lib/tenant-context";
import { getExecutiveAutonomyDailyStartupRouteDeps } from "./route-support";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function runDailyStartupRequest(request: Request, allowAdminSession: boolean) {
  try {
    const cron = await isCronAuthorizedRequest(request);
    if (!cron && (!allowAdminSession || !(await isAdminRequest(request)))) {
      return getUnauthorizedApiResponse();
    }

    const auth = cron ? null : await getAuthenticatedRequestContext(request);
    const tenantId = requireTenantId(auth?.tenantId ?? process.env.CRON_TENANT_ID, cron ? "cron_configuration" : "admin_session");
    const routeDeps = getExecutiveAutonomyDailyStartupRouteDeps();
    const result = await routeDeps.runDailyStartup({
      tenantId,
      triggeredBy: cron ? "cron" : "manual",
    });
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/company/executive-autonomy/daily-startup failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to run Executive Autonomy Level 1 daily startup.",
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

export async function GET(request: Request) {
  return runDailyStartupRequest(request, false);
}

export async function POST(request: Request) {
  return runDailyStartupRequest(request, true);
}
