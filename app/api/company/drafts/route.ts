import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { draftWorkspaceSafetyFlags, getCeoDraftWorkspaceReport } from "@/lib/company-draft-workspace";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    return NextResponse.json(await getCeoDraftWorkspaceReport(actor.tenantId));
  } catch (error) {
    console.error("GET /api/company/drafts failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load CEO Draft Workspace.",
        safetyFlags: draftWorkspaceSafetyFlags,
      },
      { status: 500 },
    );
  }
}
