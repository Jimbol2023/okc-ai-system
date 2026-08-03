import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest, isCronAuthorizedRequest } from "@/lib/auth";
import { runExecutiveDailyStartup } from "@/lib/executive-autonomy-level-1";
import { clearServerCacheKey } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DailyStartupRouteDeps = {
  runDailyStartup: typeof runExecutiveDailyStartup;
};

let routeDeps: DailyStartupRouteDeps = {
  runDailyStartup: runExecutiveDailyStartup,
};

export function setExecutiveAutonomyDailyStartupRouteDepsForTest(testDeps: Partial<DailyStartupRouteDeps>) {
  const previous = routeDeps;
  routeDeps = { ...routeDeps, ...testDeps };

  return () => {
    routeDeps = previous;
  };
}

async function runDailyStartupRequest(request: Request, allowAdminSession: boolean) {
  try {
    const cron = await isCronAuthorizedRequest(request);
    if (!cron && (!allowAdminSession || !(await isAdminRequest(request)))) {
      return getUnauthorizedApiResponse();
    }

    const auth = cron ? null : await getAuthenticatedRequestContext(request);
    const result = await routeDeps.runDailyStartup({
      tenantId: auth?.tenantId ?? "default",
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
