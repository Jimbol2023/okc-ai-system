import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import {
  assertNoTenantOverride,
  correctionRecordingSchema,
  recordRevenueLedgerCorrection,
  recordRevenueLedgerEvent,
  revenueRecordingRequestSchema,
  type RevenueRecordingContext,
} from "@/lib/revenue-attribution-recording";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to record revenue attribution outcome.";
  const status = message.includes("unauthorized") ? 403 : message.includes("tenant_override_denied") ? 400 : 422;

  return NextResponse.json(
    {
      ok: false,
      error: message,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    { status },
  );
}

export async function POST(request: Request) {
  try {
    const authContext = await getAuthenticatedRequestContext(request);

    if (!authContext) {
      return getUnauthorizedApiResponse();
    }

    if (!(await isAdminRequest(request))) {
      return errorResponse(new Error("unauthorized_ledger_write:admin_required"));
    }

    const body = await request.json();
    assertNoTenantOverride(body);

    const context: RevenueRecordingContext = {
      tenantId: authContext.tenantId,
      actorId: authContext.actorId,
      role: "ceo_admin",
    };

    if (body?.action === "correction") {
      const correction = correctionRecordingSchema.parse(body.correction ?? body);
      return NextResponse.json(await recordRevenueLedgerCorrection(correction, context));
    }

    const record = revenueRecordingRequestSchema.parse(body.record ?? body);
    return NextResponse.json(await recordRevenueLedgerEvent(record, context));
  } catch (error) {
    console.error("POST /api/revenue/attribution-ledger/record failed:", error);
    return errorResponse(error);
  }
}
