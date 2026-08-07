import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPrismaPropertyOpportunityDb } from "@/lib/property-opportunity-db";
import {
  manualDfdPropertyOpportunitySchema,
  upsertManualDfdPropertyOpportunity,
} from "@/lib/property-opportunity-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const context = await getAuthenticatedRequestContext(request);
    if (!context) return getUnauthorizedApiResponse();

    const payload = await request.json();
    const parsed = manualDfdPropertyOpportunitySchema.parse(payload);
    const result = await upsertManualDfdPropertyOpportunity(createPrismaPropertyOpportunityDb(prisma), parsed, context);

    return NextResponse.json(
      {
        ok: true,
        ...result,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid manual DFD property opportunity payload.",
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

    console.error("POST /api/company/property-opportunities/manual-dfd failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to save manual DFD property opportunity.",
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
