import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { authorizeGa4Preview } from "@/lib/ueip-preview-pilot";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return getUnauthorizedApiResponse();
  const auth = await getAuthenticatedRequestContext(request);
  if (!auth) return getUnauthorizedApiResponse();
  const body = await request.json().catch(() => ({})) as { confirmation?: string };
  return NextResponse.json(await authorizeGa4Preview({ actor: { tenantId: auth.tenantId, actorId: auth.actorId }, confirmation: body.confirmation ?? "" }));
}
