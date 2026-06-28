import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { reviewMarketingDraft } from "@/lib/marketing-workflow";
import { marketingApprovalSchema } from "@/lib/validations/marketing-workflow";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { id } = await context.params;
    const payload = await request.json();
    const parsed = marketingApprovalSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const result = await reviewMarketingDraft(id, parsed.data);

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("POST /api/marketing/drafts/[id]/approval failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to review marketing draft.",
      },
      { status: 400 },
    );
  }
}
