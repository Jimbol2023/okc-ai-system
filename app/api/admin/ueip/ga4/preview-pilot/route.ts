import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { runGa4PreviewPilot } from "@/lib/ueip-preview-pilot";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return getUnauthorizedApiResponse();
  const auth = await getAuthenticatedRequestContext(request);
  if (!auth) return getUnauthorizedApiResponse();
  const body = await request.json().catch(() => ({})) as { confirmation?: string; operation?: string; nonce?: string };
  if (body.operation !== "read" && body.operation !== "blocked_probe") return NextResponse.json({ status: "blocked", reasonCodes: ["operation_invalid"], providerCalled: false, liveExecutionAllowed: false }, { status: 400 });
  return NextResponse.json(await runGa4PreviewPilot({ actor: { tenantId: auth.tenantId, actorId: auth.actorId }, confirmation: body.confirmation ?? "", operation: body.operation, nonce: body.nonce }));
}
