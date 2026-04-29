import { NextResponse } from "next/server";

import { classifySellerReply } from "@/lib/ai/seller-reply-brain";
import { detectOptOut } from "@/lib/opt-out-detector";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// =====================================================
// STEP 2B.7B — TWILIO INBOUND SMS WEBHOOK + AI REPLY BRAIN
// Handles seller replies, detects opt-outs, classifies intent,
// and safely updates lead intelligence.
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

    // Safety check: if Twilio sends an empty phone/body, do nothing but return 200.
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
    // STEP 2B.6D — DNC / OPT-OUT PROTECTION
    // This must run BEFORE AI reply classification.
    // =====================================================

    const optOutResult = detectOptOut(messageBody);

    if (optOutResult.isOptOut) {
      console.log("Opt-out detected:", optOutResult.reason);

      await prisma.lead.updateMany({
        where: {
          phone: fromPhone,
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

      // Stop here. Do not classify or prepare replies after opt-out.
      return new NextResponse(twimlResponse, {
        status: 200,
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    // =====================================================
    // STEP 2B.7 — AI REPLY BRAIN
    // Safe rule-based classification only.
    // No auto-send yet.
    // =====================================================

    const replyBrain = classifySellerReply(messageBody);

    console.log("Seller Reply Brain:", {
      fromPhone,
      intent: replyBrain.intent,
      confidence: replyBrain.confidence,
      reason: replyBrain.reason,
      requiresHumanApproval: replyBrain.requiresHumanApproval,
    });

    // =====================================================
    // STEP 2B.7B — SAFE LEAD UPDATE
    // We update existing lead intelligence only.
    // We do NOT send an automatic reply here.
    // =====================================================

    await prisma.lead.updateMany({
      where: {
        phone: fromPhone,
        doNotContact: false,
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

    // Always return 200 to Twilio so it does not keep retrying aggressively.
    return new NextResponse(twimlResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}