import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { getTwilioDiagnosticReadiness } from "@/lib/twilio-diagnostic-connector";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  const result = await getTwilioDiagnosticReadiness({ tenantId: actor.tenantId, actorId: actor.actorId });
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
