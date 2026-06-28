import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createSalesAttribution } from "@/lib/sales-conversion-assist";
import { salesAttributionSchema } from "@/lib/validations/sales-conversion";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsed = salesAttributionSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const attribution = await createSalesAttribution(parsed.data);

    return NextResponse.json({
      ok: true,
      attribution,
      leadMutated: false,
      providerCalled: false,
    });
  } catch (error) {
    console.error("POST /api/sales-conversion/attribution failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create sales attribution." },
      { status: 400 },
    );
  }
}
