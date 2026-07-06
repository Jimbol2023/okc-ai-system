import { NextResponse } from "next/server";

import { getAuthenticatedAdmin, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { draftWorkspaceSafetyFlags, updateCeoDraft } from "@/lib/company-draft-workspace";
import { companyDraftEditSchema } from "@/lib/validations/company-drafts";

type RouteContext = {
  params: Promise<{
    draftId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { draftId } = await context.params;
    const payload = await request.json().catch(() => null);
    const parsed = companyDraftEditSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid draft edit.",
          errors: parsed.error.flatten(),
          safetyFlags: draftWorkspaceSafetyFlags,
        },
        { status: 400 },
      );
    }

    const admin = await getAuthenticatedAdmin();

    return NextResponse.json(await updateCeoDraft(draftId, parsed.data, admin?.email || "CEO"));
  } catch (error) {
    console.error("PATCH /api/company/drafts/[draftId] failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to update draft.",
        safetyFlags: draftWorkspaceSafetyFlags,
      },
      { status: 500 },
    );
  }
}
