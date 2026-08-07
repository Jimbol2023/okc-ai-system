import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPrismaPropertyOpportunityDb } from "@/lib/property-opportunity-db";
import {
  listPropertyOpportunityFilters,
  savePropertyOpportunityFilter,
  savedPropertyOpportunityFilterSchema,
} from "@/lib/property-opportunity-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const context = await getAuthenticatedRequestContext(request);
    if (!context) return getUnauthorizedApiResponse();

    const result = await listPropertyOpportunityFilters(createPrismaPropertyOpportunityDb(prisma), context.tenantId);

    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET /api/company/property-opportunities/filters failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load property opportunity filters.",
        providerCalled: false,
        sent: false,
        published: false,
        crmMutated: false,
        liveExecutionAllowed: false,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(request: Request) {
  try {
    const context = await getAuthenticatedRequestContext(request);
    if (!context) return getUnauthorizedApiResponse();

    const payload = await request.json();
    const parsed = savedPropertyOpportunityFilterSchema.parse(payload);
    const result = await savePropertyOpportunityFilter(createPrismaPropertyOpportunityDb(prisma), parsed, context);

    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid property opportunity filter payload.",
          issues: error.flatten(),
          providerCalled: false,
          sent: false,
          published: false,
          crmMutated: false,
          liveExecutionAllowed: false,
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("POST /api/company/property-opportunities/filters failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to save property opportunity filter.",
        providerCalled: false,
        sent: false,
        published: false,
        crmMutated: false,
        liveExecutionAllowed: false,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
