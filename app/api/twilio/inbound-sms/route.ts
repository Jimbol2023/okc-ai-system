import { NextResponse } from "next/server";

import { classifySellerReply } from "@/lib/ai/seller-reply-brain";
import { detectOptOut } from "@/lib/opt-out-detector";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/utils";

export const runtime = "nodejs";

// =====================================================
// STEP 2B.7G — TWILIO INBOUND SMS WEBHOOK
//
// SAFE VERSION:
// - Normalizes Twilio phone number
// - Finds newest matching lead only
// - Preserves DNC / STOP protection
// - Stores AI Reply Brain intelligence
// - Does NOT auto-send replies yet
// =====================================================

export async function POST(request: Request) {
  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;

  try {
    const formData = await request.formData();

    const rawPhone = String(formData.get("From") ?? "").trim();
    const fromPhone = normalizePhone(rawPhone);
    const messageBody = String(formData.get("Body") ?? "").trim();

    console.log("Incoming SMS:", {
      rawPhone,
      normalizedPhone: fromPhone,
      messageBody,
    });

    if (!fromPhone || !messageBody) {
      console.log("Inbound SMS missing phone or message body.");

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    // Find newest matching lead only.
    const lead = await prisma.lead.findFirst({
      where: {
        phone: fromPhone,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lead) {
      console.log("No matching lead found for inbound SMS:", fromPhone);

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    // DNC / opt-out protection must run before AI Reply Brain.
    const optOutResult = detectOptOut(messageBody);

    if (optOutResult.isOptOut) {
      console.log("Opt-out detected:", {
        leadId: lead.id,
        reason: optOutResult.reason,
      });

      await prisma.lead.update({
        where: {
          id: lead.id,
        },
        data: {
          doNotContact: true,
          optOutReason: optOutResult.reason,
          optOutAt: new Date(),

          automationStatus: "idle",
          lastContactedAt: new Date(),
          lastFollowUpMessage: messageBody,
          isHot: false,

          // Step 2B.7G — Persist opt-out reply intelligence
          lastSellerReply: messageBody,
          lastSellerReplyAt: new Date(),
          lastSellerReplyIntent: "stop",
          lastSellerReplyConfidence: 0.99,
          suggestedReply: null,
          requiresHumanApproval: false,
        },
      });

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    // Never reactivate a DNC lead.
    if (lead.doNotContact) {
      console.log("Lead is already do-not-contact. No AI processing:", {
        leadId: lead.id,
        fromPhone,
      });

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    // AI Reply Brain classification only. No auto-send.
    const replyBrain = classifySellerReply(messageBody);

    console.log("Seller Reply Brain:", {
      leadId: lead.id,
      intent: replyBrain.intent,
      confidence: replyBrain.confidence,
      reason: replyBrain.reason,
      requiresHumanApproval: replyBrain.requiresHumanApproval,
    });

    await prisma.lead.update({
      where: {
        id: lead.id,
      },
      data: {
        lastContactedAt: new Date(),
        lastFollowUpMessage: messageBody,

        // Step 2B.7G — Persist AI Reply Brain intelligence
        lastSellerReply: messageBody,
        lastSellerReplyAt: new Date(),
        lastSellerReplyIntent: replyBrain.intent,
        lastSellerReplyConfidence: replyBrain.confidence,
        suggestedReply: replyBrain.suggestedReply,
        requiresHumanApproval: replyBrain.requiresHumanApproval,

        automationStatus:
          replyBrain.intent === "interested" ||
          replyBrain.intent === "question" ||
          replyBrain.intent === "angry" ||
          replyBrain.intent === "needs_human"
            ? "needs_human"
            : "idle",

        isHot: replyBrain.intent === "interested",
      },
    });

    return new NextResponse(twimlResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Inbound SMS webhook failed:", error);

    return new NextResponse(twimlResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}