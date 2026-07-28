import { NextResponse } from "next/server";

import { getAuthenticatedAdmin, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { decideExecutiveDirective } from "@/lib/company-activation";
import { clearServerCacheKey } from "@/lib/server-cache";
import { companyDirectiveDecisionSchema } from "@/lib/validations/company-activation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ directiveId: string }> }) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { directiveId } = await params;
    const payload = await request.json().catch(() => null);
    const parsed = companyDirectiveDecisionSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid company directive decision.",
          errors: parsed.error.flatten(),
          providerCalled: false,
          liveExecutionAllowed: false,
        },
        { status: 400 },
      );
    }

    const admin = await getAuthenticatedAdmin();
    const result = await decideExecutiveDirective({
      directiveId,
      decision: parsed.data.decision,
      note: parsed.data.note,
      reviewReminderAt: parsed.data.reviewReminderAt || undefined,
      decidedBy: admin?.email || "Moses Adebajo",
    });
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/company/directives/[directiveId]/decision failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to update company directive decision.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
