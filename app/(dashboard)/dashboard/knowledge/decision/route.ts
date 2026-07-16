import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedAdmin, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { decideExecutiveDirective } from "@/lib/company-activation";
import { clearServerCacheKey } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const knowledgeDecisionSchema = z.object({
  directiveId: z.string().trim().min(1).default("campaign-001"),
  decision: z.enum(["approve", "reject", "request_changes", "defer"]),
  note: z.string().trim().max(1000, "Note must stay under 1,000 characters.").optional(),
  reviewReminderAt: z.string().trim().datetime("Use a valid reminder date.").optional().or(z.literal("")),
});

function jsonError(error: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json(
    {
      ok: false,
      error,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
      ...extra,
    },
    { status },
  );
}

export async function GET() {
  return jsonError("Use POST to submit a CEO decision.", 405);
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json().catch(() => null);
    const parsed = knowledgeDecisionSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError("Invalid knowledge page decision request.", 400, {
        errors: parsed.error.flatten(),
      });
    }

    const admin = await getAuthenticatedAdmin();
    const result = await decideExecutiveDirective({
      directiveId: parsed.data.directiveId,
      decision: parsed.data.decision,
      note: parsed.data.note,
      reviewReminderAt: parsed.data.reviewReminderAt || undefined,
      decidedBy: admin?.email || "Moses Adebajo",
    });
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json({
      ...result,
      compatibilityRoute: "/dashboard/knowledge/decision",
      externalExecutionAllowed: false,
    });
  } catch (error) {
    console.error("POST /dashboard/knowledge/decision failed:", error);

    return jsonError(error instanceof Error ? error.message : "Unable to update CEO decision.", 500);
  }
}
