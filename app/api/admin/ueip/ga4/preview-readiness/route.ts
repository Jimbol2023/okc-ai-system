import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { getGa4PreviewCloseout, getGa4PreviewReadiness } from "@/lib/ueip-preview-pilot";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return getUnauthorizedApiResponse();
  const auth = await getAuthenticatedRequestContext(request);
  if (!auth) return getUnauthorizedApiResponse();
  const actor = { tenantId: auth.tenantId, actorId: auth.actorId };
  return NextResponse.json({ readiness: await getGa4PreviewReadiness({ actor }), closeout: await getGa4PreviewCloseout({ actor }) });
}
