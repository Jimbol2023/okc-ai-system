import { NextResponse } from "next/server";

import { classifySellerReply } from "@/lib/ai/seller-reply-brain";
import { detectOptOut } from "@/lib/opt-out-detector";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// =====================================================
// STEP 2B.7C — TWILIO INBOUND SMS WEBHOOK
// Safe version for testing with the SAME phone number
//
// IMPORTANT:
// - Finds the newest lead with this phone number
// - Updates ONLY that one lead by ID
// - Preserves DNC / STOP protection
// - Does NOT auto-send AI replies
// =====================================================

export async function POST(request: Request) {
  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;

  try {
    const formData = await request.formData();

    const fromPhone = String(formData.get("From") ?? "").trim();
    const messageBody = String(formData.get("Body") ?? "").trim();

    console.log("Incoming SMS:", {
      fromPhone,
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

    // =====================================================
    // STEP 1 — Find newest matching lead
    // This prevents one shared test number from updating
    // every lead in the database.
    // =====================================================

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

    // =====================================================
    // STEP 2 — DNC / OPT-OUT PROTECTION
    // STOP must run before AI Reply Brain.
    // =====================================================

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
        },
      });

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    // If this newest lead is already DNC, do not reactivate it.
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

    // =====================================================
    // STEP 3 — AI REPLY BRAIN
    // Classify seller reply safely.
    // No auto-send yet.
    // =====================================================

    const replyBrain = classifySellerReply(messageBody);

    console.log("Seller Reply Brain:", {
      leadId: lead.id,
      fromPhone,
      intent: replyBrain.intent,
      confidence: replyBrain.confidence,
      reason: replyBrain.reason,
      requiresHumanApproval: replyBrain.requiresHumanApproval,
    });

    // =====================================================
    // STEP 4 — Safe lead update
    // Updates ONLY this lead by ID.
    // =====================================================

    await prisma.lead.update({
      where: {
        id: lead.id,
      },
      data: {
        lastContactedAt: new Date(),
        lastFollowUpMessage: messageBody,

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