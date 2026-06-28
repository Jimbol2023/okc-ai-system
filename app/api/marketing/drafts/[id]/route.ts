import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { updateMarketingDraft } from "@/lib/marketing-workflow";
import { updateMarketingDraftSchema } from "@/lib/validations/marketing-workflow";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { id } = await context.params;
    const payload = await request.json();
    const parsed = updateMarketingDraftSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const draft = await updateMarketingDraft(id, parsed.data);

    return NextResponse.json({
      ok: true,
      draft,
      providerCalled: false,
      published: false,
      sent: false,
    });
  } catch (error) {
    console.error("PATCH /api/marketing/drafts/[id] failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to update marketing draft." }, { status: 500 });
  }
}
