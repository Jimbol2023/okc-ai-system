import { NextResponse } from "next/server";

import {
  getUnauthorizedApiResponse,
  isAuthenticatedRequest
} from "@/lib/auth";
import { logDealOutcomeMemory, logAiMemoryEvent } from "@/lib/ai-memory-logger";
import { getDbLeadById, updateDbLeadStatus } from "@/lib/leads-db";
import type { LeadStatus } from "@/lib/leads-storage";

type RouteContext = {
  params: Promise<{
    leadId: string;
  }>;
};

export const runtime = "nodejs";

const ALLOWED_STATUSES: readonly LeadStatus[] = [
  "new",
  "contacted",
  "negotiating",
  "under_contract",
  "closed"
];

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;

    const existingLead = await getDbLeadById(leadId);

    if (!existingLead) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead not found."
        },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => null);
    const nextStatus = body?.status;

    if (
      typeof nextStatus !== "string" ||
      !ALLOWED_STATUSES.includes(nextStatus as LeadStatus)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid status value."
        },
        { status: 400 }
      );
    }

    const updatedLead = await updateDbLeadStatus(
      leadId,
      nextStatus as LeadStatus
    );
    await logDealOutcomeMemory({
      leadId,
      outcome: nextStatus,
      source: "lead_status_update",
      metadata: {
        whatHappened: "Lead pipeline status changed.",
        previousStatus: existingLead.status,
        nextStatus,
        result: nextStatus,
        nextBestAction:
          nextStatus === "closed"
            ? "analyze_conversion"
            : nextStatus === "under_contract"
              ? "track_contract_progress"
              : "continue_pipeline_follow_up",
      },
    });

    if (nextStatus === "contacted") {
      await logAiMemoryEvent({
        leadId,
        eventType: "follow_up_completed",
        source: "lead_status_update",
        outcome: "contacted",
        metadata: {
          whatHappened: "Lead was marked contacted.",
          previousStatus: existingLead.status,
          nextStatus,
          nextBestAction: "monitor_seller_response",
        },
      });
    }

    return NextResponse.json({
      ok: true,
      lead: updatedLead
    });
  } catch (error) {
    console.error("Lead status PATCH error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to update lead status."
      },
      { status: 500 }
    );
  }
}
