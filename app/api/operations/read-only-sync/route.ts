import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest, isCronAuthorizedRequest } from "@/lib/auth";
import { readOnlyAdapterDefinitions, runReadOnlyBusinessSync, type BusinessDataCategory } from "@/lib/read-only-business-connections";
import { createUeipExecutionContext } from "@/lib/ueip-runtime-gateway";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const internalCategories: BusinessDataCategory[] = [
  "internal_website_lead_intake",
  "internal_lead_database",
  "internal_crm",
  "internal_property_pipeline",
];
const allowedCategories = new Set<BusinessDataCategory>([
  ...readOnlyAdapterDefinitions.map((definition) => definition.id),
  ...internalCategories,
]);

async function selectedCategories(request: Request) {
  const body = await request.json().catch(() => ({})) as { categories?: unknown };
  if (body.categories === undefined) return { categories: undefined };
  if (!Array.isArray(body.categories) || body.categories.length === 0 || body.categories.some((item) => typeof item !== "string" || !allowedCategories.has(item as BusinessDataCategory))) {
    return { error: "categories must be a non-empty list of registered read-only snapshot categories" };
  }
  return { categories: [...new Set(body.categories)] as BusinessDataCategory[] };
}

async function executionContextFor(request: Request) {
  if (await isCronAuthorizedRequest(request)) {
    return createUeipExecutionContext({ tenantId: "default", actorId: "system:cron", businessModule: "ai_core", requestOrigin: "system_cron" });
  }
  const auth = await getAuthenticatedRequestContext(request);
  if (!auth) return null;
  return createUeipExecutionContext({ tenantId: auth.tenantId, actorId: auth.actorId, businessModule: "ai_core", requestOrigin: "authenticated_admin" });
}

export async function POST(request: Request) {
  try {
    if (!(await isCronAuthorizedRequest(request)) && !(await isAdminRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const context = await executionContextFor(request);
    if (!context) return getUnauthorizedApiResponse();
    const selection = await selectedCategories(request);
    if (selection.error) {
      return NextResponse.json({ ok: false, error: selection.error, providerCalled: false, liveExecutionAllowed: false }, { status: 400 });
    }
    const report = await runReadOnlyBusinessSync(process.env, context, { categories: selection.categories });

    return NextResponse.json(report);
  } catch (error) {
    console.error("POST /api/operations/read-only-sync failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to run read-only business sync.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    if (!(await isCronAuthorizedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const context = await executionContextFor(request);
    if (!context) return getUnauthorizedApiResponse();
    const report = await runReadOnlyBusinessSync(process.env, context);

    return NextResponse.json(report);
  } catch (error) {
    console.error("GET /api/operations/read-only-sync failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to run scheduled read-only business sync.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
