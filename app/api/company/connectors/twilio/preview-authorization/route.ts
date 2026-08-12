import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { readBoundedJsonBody } from "@/lib/request-security";
import { authorizeTwilioDiagnosticPreview } from "@/lib/twilio-diagnostic-connector";
import { assertTwilioDiagnosticCapability } from "@/lib/twilio-diagnostic-adapter";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  const body = await readBoundedJsonBody(request, 8 * 1024);
  if (!body.ok) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: body.status, headers: { "Cache-Control": "no-store" } });
  const input = body.value as { confirmation?: string; capability?: string };
  try { assertTwilioDiagnosticCapability(input.capability ?? ""); } catch { return NextResponse.json({ status: "blocked", reasonCodes: ["capability_not_allowed"] }, { status: 400, headers: { "Cache-Control": "no-store" } }); }
  const result = await authorizeTwilioDiagnosticPreview({ actor: { tenantId: actor.tenantId, actorId: actor.actorId }, confirmation: input.confirmation ?? "", capability: input.capability });
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
