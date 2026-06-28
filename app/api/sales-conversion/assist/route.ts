import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createSalesConversionAssist } from "@/lib/sales-conversion-assist";
import { salesAssistRequestSchema } from "@/lib/validations/sales-conversion";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsed = salesAssistRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const assist = await createSalesConversionAssist(parsed.data);

    return NextResponse.json({
      ok: true,
      assist,
      sent: false,
      providerCalled: false,
      leadMutated: false,
    });
  } catch (error) {
    console.error("POST /api/sales-conversion/assist failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create sales conversion assist." },
      { status: 400 },
    );
  }
}
