import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import {
  createCompanyOpportunityQueueItem,
  listCompanyOpportunityQueue,
  opportunityQueueInputSchema,
} from "@/lib/business-activation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const opportunities = await listCompanyOpportunityQueue();

    return NextResponse.json({
      ok: true,
      opportunities,
      providerCalled: false,
      liveExecutionAllowed: false,
    });
  } catch (error) {
    console.error("GET /api/company/opportunities failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load opportunity queue.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json().catch(() => null);
    const parsed = opportunityQueueInputSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          errors: parsed.error.flatten(),
          providerCalled: false,
          liveExecutionAllowed: false,
        },
        { status: 400 },
      );
    }

    const result = await createCompanyOpportunityQueueItem(parsed.data);

    return NextResponse.json({
      ok: true,
      ...result,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    });
  } catch (error) {
    console.error("POST /api/company/opportunities failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to create opportunity queue item.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
