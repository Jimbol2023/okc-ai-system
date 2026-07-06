import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { draftWorkspaceSafetyFlags, getCeoDraftWorkspaceReport } from "@/lib/company-draft-workspace";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return NextResponse.json(await getCeoDraftWorkspaceReport());
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
