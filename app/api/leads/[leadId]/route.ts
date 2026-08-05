import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { deleteDbLead, getDbLeadById, updateDbLead } from "@/lib/leads-db";
import { prisma } from "@/lib/prisma";
import { storedLeadSchema } from "@/lib/validations/stored-lead";

type RouteContext = {
  params: Promise<{
    leadId: string;
  }>;
};

export const runtime = "nodejs";

// =====================================================
// LEAD DETAIL API — SAFE FULL VERSION
// -----------------------------------------------------
// PURPOSE:
// - Load one lead by ID
// - Preserve existing StoredLead mapping
// - Add AI Reply Brain fields from Prisma DB
// - Keep auth protection
// - Keep PATCH and DELETE behavior safe
// -----------------------------------------------------
// IMPORTANT:
// - Does NOT touch Twilio
// - Does NOT touch automation
// - Does NOT change Prisma schema
// - Does NOT change routes
// =====================================================

export async function GET(request: Request, context: RouteContext) {
  try {
    // =====================================================
    // AUTH CHECK
    // =====================================================

    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;

    // =====================================================
    // LOAD EXISTING APP-MAPPED LEAD
    // -----------------------------------------------------
    // This preserves your current dashboard/StoredLead shape.
    // =====================================================

    const lead = await getDbLeadById(actor, leadId);

    if (!lead) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead not found.",
        },
        { status: 404 },
      );
    }

    // =====================================================
    // LOAD RAW PRISMA LEAD FOR NEW AI FIELDS
    // -----------------------------------------------------
    // Some older mapper/helper functions may not yet include
    // the new AI Reply Brain fields. This guarantees the
    // detail UI receives them safely.
    // =====================================================

    const dbLead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        tenantId: actor.tenantId,
      },
    });

    if (!dbLead) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead not found.",
        },
        { status: 404 },
      );
    }

    // =====================================================
    // MERGE EXISTING LEAD DATA + AI REPLY INTELLIGENCE
    // =====================================================

    const enhancedLead = {
      ...lead,

      // DNC / compliance safety
      doNotContact: dbLead.doNotContact,
      optOutReason: dbLead.optOutReason,
      optOutAt: dbLead.optOutAt?.toISOString() ?? null,

      // AI Reply Brain persistence fields
      lastSellerReply: dbLead.lastSellerReply,
      lastSellerReplyAt: dbLead.lastSellerReplyAt?.toISOString() ?? null,
      lastSellerReplyIntent: dbLead.lastSellerReplyIntent,
      lastSellerReplyConfidence: dbLead.lastSellerReplyConfidence,
      suggestedReply: dbLead.suggestedReply,
      requiresHumanApproval: dbLead.requiresHumanApproval,

      // Follow-up automation fields
      lastContactedAt: dbLead.lastContactedAt?.toISOString() ?? null,
      nextFollowUpAt: dbLead.nextFollowUpAt?.toISOString() ?? null,
      followUpCount: dbLead.followUpCount,
      lastFollowUpMessage: dbLead.lastFollowUpMessage,
      automationStatus: dbLead.automationStatus,
      approvalStatus: dbLead.approvalStatus,
      isHot: dbLead.isHot,
    };

    return NextResponse.json({
      ok: true,
      lead: enhancedLead,
    });
  } catch (error) {
    console.error("GET /api/leads/[leadId] failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load the lead right now.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    // =====================================================
    // AUTH CHECK
    // =====================================================

    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;
    const payload = await request.json();

    // =====================================================
    // VALIDATE EXISTING STORED LEAD SHAPE
    // -----------------------------------------------------
    // Keeps existing dashboard update behavior safe.
    // =====================================================

    const parsedLead = storedLeadSchema.safeParse(payload);

    if (!parsedLead.success) {
      return NextResponse.json(
        {
          ok: false,
          errors: parsedLead.error.flatten(),
        },
        { status: 400 },
      );
    }

    if (parsedLead.data.id !== leadId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead ID mismatch.",
        },
        { status: 400 },
      );
    }

    const updatedLead = await updateDbLead(actor, parsedLead.data);

    // =====================================================
    // PRESERVE AI FIELDS IF CLIENT SENDS THEM
    // -----------------------------------------------------
    // This prevents AI reply fields from being lost when the
    // lead detail page updates notes/follow-ups/analyzer data.
    // =====================================================

    const aiPatchData: {
      suggestedReply?: string | null;
      requiresHumanApproval?: boolean;
    } = {};

    if ("suggestedReply" in payload) {
      aiPatchData.suggestedReply = payload.suggestedReply ?? null;
    }

    if ("requiresHumanApproval" in payload) {
      aiPatchData.requiresHumanApproval = Boolean(payload.requiresHumanApproval);
    }

    if (Object.keys(aiPatchData).length > 0) {
      await prisma.lead.updateMany({
        where: { id: leadId, tenantId: actor.tenantId },
        data: aiPatchData,
      });
    }

    const dbLead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        tenantId: actor.tenantId,
      },
    });

    const enhancedLead = dbLead
      ? {
          ...updatedLead,
          doNotContact: dbLead.doNotContact,
          optOutReason: dbLead.optOutReason,
          optOutAt: dbLead.optOutAt?.toISOString() ?? null,
          lastSellerReply: dbLead.lastSellerReply,
          lastSellerReplyAt: dbLead.lastSellerReplyAt?.toISOString() ?? null,
          lastSellerReplyIntent: dbLead.lastSellerReplyIntent,
          lastSellerReplyConfidence: dbLead.lastSellerReplyConfidence,
          suggestedReply: dbLead.suggestedReply,
          requiresHumanApproval: dbLead.requiresHumanApproval,
          lastContactedAt: dbLead.lastContactedAt?.toISOString() ?? null,
          nextFollowUpAt: dbLead.nextFollowUpAt?.toISOString() ?? null,
          followUpCount: dbLead.followUpCount,
          lastFollowUpMessage: dbLead.lastFollowUpMessage,
          automationStatus: dbLead.automationStatus,
          approvalStatus: dbLead.approvalStatus,
          isHot: dbLead.isHot,
        }
      : updatedLead;

    return NextResponse.json({
      ok: true,
      lead: enhancedLead,
    });
  } catch (error) {
    console.error("PATCH /api/leads/[leadId] failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to update the lead right now.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    // =====================================================
    // AUTH CHECK
    // =====================================================

    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;
    const leads = await deleteDbLead(actor, leadId);

    return NextResponse.json({
      ok: true,
      leads,
    });
  } catch (error) {
    console.error("DELETE /api/leads/[leadId] failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to delete the lead right now.",
      },
      { status: 500 },
    );
  }
}
