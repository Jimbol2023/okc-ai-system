import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { logApprovalDecisionMemory } from "@/lib/ai-memory-logger";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    leadId: string;
  }>;
};

type ApprovalPayload = {
  action?: "approve" | "reject";
  message?: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(error: string, status = 400) {
  return NextResponse.json(
    {
      ok: false,
      error,
    },
    { status },
  );
}

function serializeApprovalLead(lead: {
  id: string;
  doNotContact: boolean;
  suggestedReply: string | null;
  requiresHumanApproval: boolean;
  automationStatus: string;
  lastFollowUpMessage: string | null;
  updatedAt: Date;
}) {
  return {
    id: lead.id,
    doNotContact: lead.doNotContact,
    suggestedReply: lead.suggestedReply,
    requiresHumanApproval: lead.requiresHumanApproval,
    automationStatus: lead.automationStatus,
    lastFollowUpMessage: lead.lastFollowUpMessage,
    updatedAt: lead.updatedAt.toISOString(),
  };
}

export async function POST(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;
    const payload = (await request.json()) as ApprovalPayload;

    if (payload.action !== "approve" && payload.action !== "reject") {
      return jsonError("Approval action must be approve or reject.");
    }

    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
    });

    if (!lead) {
      return jsonError("Lead not found.", 404);
    }

    if (payload.action === "reject") {
      const rejectedLead = await prisma.lead.update({
        where: {
          id: leadId,
        },
        data: {
          suggestedReply: null,
          requiresHumanApproval: false,
          automationStatus: "idle",
        },
      });
      await logApprovalDecisionMemory({
        leadId,
        approvalDecision: "rejected",
        aiSuggestedReply: lead.suggestedReply,
        humanFinalReply: null,
        source: "human_approval_gate",
        metadata: {
          whatHappened: "Human rejected an AI suggested reply.",
          whatAiSuggested: lead.suggestedReply,
          whatHumanChose: "reject",
          result: "suggested_reply_discarded",
          nextBestAction: "manual_follow_up_review",
        },
      });

      return NextResponse.json({
        ok: true,
        action: "reject",
        sent: false,
        message: "Reply rejected. No SMS or email was sent.",
        lead: serializeApprovalLead(rejectedLead),
      });
    }

    if (lead.doNotContact) {
      return jsonError("Lead is marked Do Not Contact. Approval was blocked.", 409);
    }

    const approvedMessage = payload.message?.trim() || lead.suggestedReply?.trim();

    if (!approvedMessage) {
      return jsonError("Approved message is required.");
    }

    const approvedLead = await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        suggestedReply: approvedMessage,
        requiresHumanApproval: false,
        lastFollowUpMessage: approvedMessage,
        automationStatus: "approved_pending_send",
      },
    });
    await logApprovalDecisionMemory({
      leadId,
      approvalDecision: "approved",
      aiSuggestedReply: lead.suggestedReply,
      humanFinalReply: approvedMessage,
      source: "human_approval_gate",
      metadata: {
        whatHappened: "Human approved an outbound reply.",
        whatAiSuggested: lead.suggestedReply,
        whatHumanChose: approvedMessage,
        result: "queued_for_controlled_send",
        nextBestAction: "send_approved_message",
        editedByHuman: approvedMessage !== lead.suggestedReply,
      },
    });

    return NextResponse.json({
      ok: true,
      action: "approve",
      sent: false,
      message: "Reply approved and queued. No SMS or email was sent.",
      lead: serializeApprovalLead(approvedLead),
    });
  } catch (error) {
    console.error("POST /api/leads/[leadId]/approval failed:", error);

    return jsonError("Unable to update approval right now.", 500);
  }
}
