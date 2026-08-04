import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest, isCronAuthorizedRequest } from "@/lib/auth";
import { runExecutiveDailyStartup } from "@/lib/executive-autonomy-level-1";
import { runReadOnlyBusinessSync, type BusinessDataCategory } from "@/lib/read-only-business-connections";
import { clearServerCacheKey } from "@/lib/server-cache";
import { createUeipExecutionContext } from "@/lib/ueip-runtime-gateway";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DailyStartupRouteDeps = {
  runDailyStartup: typeof runExecutiveDailyStartup;
  runInternalSync: typeof runReadOnlyBusinessSync;
};

let routeDeps: DailyStartupRouteDeps = {
  runDailyStartup: runExecutiveDailyStartup,
  runInternalSync: runReadOnlyBusinessSync,
};

export const dailyStartupInternalCategories = Object.freeze([
  "internal_website_lead_intake",
  "internal_lead_database",
  "internal_crm",
  "internal_property_pipeline",
] satisfies BusinessDataCategory[]);

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
    const tenantId = auth?.tenantId ?? "default";
    const executionContext = createUeipExecutionContext({
      tenantId,
      actorId: auth?.actorId ?? "system:cron",
      businessModule: "ai_core",
      requestOrigin: cron ? "system_cron" : "authenticated_admin",
    });
    const sync = await routeDeps.runInternalSync(process.env, executionContext, {
      categories: [...dailyStartupInternalCategories],
      persistDailyBriefing: false,
    });
    if (sync.providerCalled || sync.liveExecutionAllowed) {
      throw new Error("daily_startup_internal_sync_boundary_violation");
    }
    const result = await routeDeps.runDailyStartup({
      tenantId,
      triggeredBy: cron ? "cron" : "manual",
    });
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json({
      ...result,
      preflightSync: {
        generatedAt: sync.generatedAt,
        categories: sync.snapshots.map((snapshot) => snapshot.category),
        providerCalled: false,
        liveExecutionAllowed: false,
      },
    });
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
