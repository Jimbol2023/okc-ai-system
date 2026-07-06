import { NextResponse } from "next/server";

import { getAuthenticatedAdmin, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { decideCeoDraft, draftWorkspaceSafetyFlags } from "@/lib/company-draft-workspace";
import { companyDraftDecisionSchema } from "@/lib/validations/company-drafts";

type RouteContext = {
  params: Promise<{
    draftId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { draftId } = await context.params;
    const payload = await request.json().catch(() => null);
    const parsed = companyDraftDecisionSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid draft decision.",
          errors: parsed.error.flatten(),
          safetyFlags: draftWorkspaceSafetyFlags,
        },
        { status: 400 },
      );
    }

    const admin = await getAuthenticatedAdmin();

    return NextResponse.json(await decideCeoDraft(draftId, parsed.data, admin?.email || "CEO"));
  } catch (error) {
    console.error("POST /api/company/drafts/[draftId]/decision failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to update draft decision.",
        safetyFlags: draftWorkspaceSafetyFlags,
      },
      { status: 500 },
    );
  }
}
