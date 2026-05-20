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
  action?: "approve" | "reject" | "pending_review" | "needs_human_review" | "follow_up_only";
  message?: string;
  note?: string;
};

type ApprovalAction = NonNullable<ApprovalPayload["action"]>;

type ApprovalHistoryItem = {
  action: ApprovalAction;
  fromStatus: string;
  toStatus: string;
  note?: string;
  at: string;
};

type LeadPayload = Record<string, unknown> & {
  latestApprovalAction?: ApprovalAction;
  latestApprovalNote?: string | null;
  latestApprovalAt?: string;
  approvalHistory?: ApprovalHistoryItem[];
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
  approvalStatus: string;
  lastFollowUpMessage: string | null;
  updatedAt: Date;
  payload: string | null;
}) {
  const payload = parseLeadPayload(lead.payload);

  return {
    id: lead.id,
    doNotContact: lead.doNotContact,
    suggestedReply: lead.suggestedReply,
    requiresHumanApproval: lead.requiresHumanApproval,
    automationStatus: lead.automationStatus,
    approvalStatus: lead.approvalStatus,
    lastFollowUpMessage: lead.lastFollowUpMessage,
    updatedAt: lead.updatedAt.toISOString(),
    latestApprovalAction: payload.latestApprovalAction ?? null,
    latestApprovalNote: payload.latestApprovalNote ?? null,
    latestApprovalAt: payload.latestApprovalAt ?? null,
    approvalHistory: payload.approvalHistory ?? [],
  };
}

function parseLeadPayload(rawPayload: string | null): LeadPayload {
  if (!rawPayload) {
    return {};
  }

  try {
    const parsedPayload = JSON.parse(rawPayload) as LeadPayload;

    return parsedPayload && typeof parsedPayload === "object" ? parsedPayload : {};
  } catch {
    return {};
  }
}

function buildApprovalPayload({
  rawPayload,
  action,
  fromStatus,
  toStatus,
  note,
}: {
  rawPayload: string | null;
  action: ApprovalAction;
  fromStatus: string;
  toStatus: string;
  note?: string;
}) {
  const leadPayload = parseLeadPayload(rawPayload);
  const at = new Date().toISOString();
  const history = Array.isArray(leadPayload.approvalHistory) ? leadPayload.approvalHistory : [];
  const activity: ApprovalHistoryItem = {
    action,
    fromStatus,
    toStatus,
    ...(note ? { note } : {}),
    at,
  };

  return {
    ...leadPayload,
    latestApprovalAction: action,
    latestApprovalNote: note || null,
    latestApprovalAt: at,
    approvalHistory: [activity, ...history].slice(0, 8),
  };
}

function getApprovalPayloadUpdate({
  lead,
  action,
  toStatus,
  note,
}: {
  lead: { payload: string | null; approvalStatus: string };
  action: ApprovalAction;
  toStatus: string;
  note?: string;
}) {
  return JSON.stringify(
    buildApprovalPayload({
      rawPayload: lead.payload,
      action,
      fromStatus: lead.approvalStatus || "pending_review",
      toStatus,
      note,
    }),
  );
}

export async function POST(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;
    const payload = (await request.json()) as ApprovalPayload;
    const decisionNote = payload.note?.trim().slice(0, 500);

    if (
      payload.action !== "approve" &&
      payload.action !== "reject" &&
      payload.action !== "pending_review" &&
      payload.action !== "needs_human_review" &&
      payload.action !== "follow_up_only"
    ) {
      return jsonError("Approval action must be approve, reject, pending_review, needs_human_review, or follow_up_only.");
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
      if (!decisionNote) {
        return jsonError("A short rejection note is required.");
      }

      const rejectedLead = await prisma.lead.update({
        where: {
          id: leadId,
        },
        data: {
          suggestedReply: null,
          requiresHumanApproval: false,
          automationStatus: "idle",
          approvalStatus: "rejected",
          payload: getApprovalPayloadUpdate({
            lead,
            action: payload.action,
            toStatus: "rejected",
            note: decisionNote,
          }),
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
          whatHumanChose: decisionNote,
          result: "suggested_reply_discarded",
          nextBestAction: "manual_follow_up_review",
          decisionNote,
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

    if (payload.action === "pending_review") {
      const pendingLead = await prisma.lead.update({
        where: {
          id: leadId,
        },
        data: {
          requiresHumanApproval: true,
          automationStatus: "scheduled",
          approvalStatus: "pending_review",
          payload: getApprovalPayloadUpdate({
            lead,
            action: payload.action,
            toStatus: "pending_review",
            note: decisionNote,
          }),
        },
      });

      return NextResponse.json({
        ok: true,
        action: "pending_review",
        sent: false,
        message: "Lead returned to pending review. No SMS or email was sent.",
        lead: serializeApprovalLead(pendingLead),
      });
    }

    if (payload.action === "needs_human_review") {
      const reviewLead = await prisma.lead.update({
        where: {
          id: leadId,
        },
        data: {
          requiresHumanApproval: true,
          automationStatus: "scheduled",
          approvalStatus: "needs_human_review",
          payload: getApprovalPayloadUpdate({
            lead,
            action: payload.action,
            toStatus: "needs_human_review",
            note: decisionNote,
          }),
        },
      });

      return NextResponse.json({
        ok: true,
        action: "needs_human_review",
        sent: false,
        message: "Lead marked for human review. No SMS or email was sent.",
        lead: serializeApprovalLead(reviewLead),
      });
    }

    if (payload.action === "follow_up_only") {
      const followUpLead = await prisma.lead.update({
        where: {
          id: leadId,
        },
        data: {
          requiresHumanApproval: false,
          automationStatus: "scheduled",
          approvalStatus: "follow_up_only",
          payload: getApprovalPayloadUpdate({
            lead,
            action: payload.action,
            toStatus: "follow_up_only",
            note: decisionNote,
          }),
        },
      });

      return NextResponse.json({
        ok: true,
        action: "follow_up_only",
        sent: false,
        message: "Lead marked follow-up only. No SMS or email was sent.",
        lead: serializeApprovalLead(followUpLead),
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
        approvalStatus: "approved_for_outreach",
        payload: getApprovalPayloadUpdate({
          lead,
          action: payload.action,
          toStatus: "approved_for_outreach",
          note: decisionNote,
        }),
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
        decisionNote,
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
