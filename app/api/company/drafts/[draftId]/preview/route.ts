import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { draftWorkspaceSafetyFlags, previewCeoDraft } from "@/lib/company-draft-workspace";

type RouteContext = {
  params: Promise<{
    draftId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request, context: RouteContext) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    const { draftId } = await context.params;

    return NextResponse.json(await previewCeoDraft(actor.tenantId, draftId));
  } catch (error) {
    console.error("GET /api/company/drafts/[draftId]/preview failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to preview draft.",
        safetyFlags: draftWorkspaceSafetyFlags,
      },
      { status: 500 },
    );
  }
}
