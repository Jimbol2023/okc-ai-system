import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { rollbackGa4Preview } from "@/lib/ueip-preview-pilot";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return getUnauthorizedApiResponse();
  const auth = await getAuthenticatedRequestContext(request);
  if (!auth) return getUnauthorizedApiResponse();
  const body = await request.json().catch(() => ({})) as { confirmation?: string; action?: string };
  if (!body.action || !["drill_disable", "drill_restore", "emergency_disable"].includes(body.action)) return NextResponse.json({ status: "blocked", reasonCodes: ["rollback_action_invalid"], providerCalled: false, liveExecutionAllowed: false }, { status: 400 });
  return NextResponse.json(await rollbackGa4Preview({ actor: { tenantId: auth.tenantId, actorId: auth.actorId }, confirmation: body.confirmation ?? "", action: body.action as "drill_disable" | "drill_restore" | "emergency_disable" }));
}
