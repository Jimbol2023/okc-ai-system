import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { isTenantFeatureEnabled } from "@/lib/governed-feature-flags";
import { prepareSearchMarketIntelligence, readSearchMarketIntelligence } from "@/lib/search-market-intelligence-runtime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  return NextResponse.json({ ok: true, ...(await readSearchMarketIntelligence(actor.tenantId)) });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return getUnauthorizedApiResponse();
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  const [searchEnabled, casesEnabled] = await Promise.all([isTenantFeatureEnabled(actor.tenantId, "search_market_intelligence_runtime"), isTenantFeatureEnabled(actor.tenantId, "professional_case_runtime")]);
  if (!searchEnabled || !casesEnabled) return NextResponse.json({ ok: false, error: "search_market_intelligence_runtime_disabled", providerCalled: false, externalWritesAllowed: false, liveExecutionAllowed: false }, { status: 409 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || body.confirmation !== "PREPARE_INTERNAL_SEARCH_MARKET_INTELLIGENCE") return NextResponse.json({ ok: false, error: "exact_confirmation_required" }, { status: 400 });
  if (body.operation !== "prepare_delta" && body.operation !== "prepare_monday_packet") return NextResponse.json({ ok: false, error: "unsupported_operation" }, { status: 400 });
  const key = request.headers.get("idempotency-key") ?? "";
  try {
    const result = await prepareSearchMarketIntelligence({ actor: { tenantId: actor.tenantId, actorId: actor.actorId }, packetKind: body.operation === "prepare_delta" ? "delta" : "monday", requestIdempotencyKey: key });
    return NextResponse.json({ ok: true, tenantId: actor.tenantId, ...result }, { status: result.created ? 201 : 200 });
  } catch (error) {
    const message = error instanceof Error && /^[a-z0-9_:.-]{1,160}$/.test(error.message) ? error.message : "search_market_intelligence_preparation_failed";
    const status = /idempotency|cap_reached|already_claimed/.test(message) ? 409 : 400;
    return NextResponse.json({ ok: false, error: message, providerCalled: false, externalWritesAllowed: false, liveExecutionAllowed: false }, { status });
  }
}
