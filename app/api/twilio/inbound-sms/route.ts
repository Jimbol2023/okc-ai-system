import { NextResponse } from "next/server";

import { classifySellerReply } from "@/lib/ai/seller-reply-brain";
import { detectOptOut } from "@/lib/opt-out-detector";
import { prisma } from "@/lib/prisma";
import { claimWebhookReceipt, completeWebhookReceipt, releaseWebhookReceipt } from "@/lib/security-controls";
import { securityLog } from "@/lib/security-log";
import { verifyTwilioWebhookRequest } from "@/lib/twilio-webhook-security";
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

  const verified = await verifyTwilioWebhookRequest(request);
  if (!verified.ok) {
    securityLog("warn", "twilio.webhook.rejected", { reason: verified.reason, status: verified.status });
    return NextResponse.json({ ok: false, error: "Webhook request rejected." }, { status: verified.status });
  }

  const { payload, tenantId } = verified;
  const receipt = await claimWebhookReceipt({ tenantId, provider: "twilio", messageId: payload.MessageSid });
  if (!receipt.claimed) {
    securityLog("info", "twilio.webhook.duplicate", { tenantId, messageIdHash: receipt.messageIdHash });
    return new NextResponse(twimlResponse, { status: 200, headers: { "Content-Type": "text/xml" } });
  }

  try {
    const rawPhone = payload.From;
    const fromPhone = normalizePhone(rawPhone);
    const messageBody = payload.Body;

    if (!fromPhone || !messageBody) {
      await completeWebhookReceipt(receipt);
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
        tenantId,
        phone: fromPhone,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lead) {
      securityLog("info", "twilio.webhook.lead_not_found", { tenantId, messageIdHash: receipt.messageIdHash });
      await completeWebhookReceipt(receipt);
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

      securityLog("info", "twilio.webhook.opt_out_recorded", { tenantId, leadId: lead.id, reason: optOutResult.reason });
      await completeWebhookReceipt(receipt);

      return new NextResponse(twimlResponse, {
        status: 200,
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    // Never reactivate a DNC lead.
    if (lead.doNotContact) {
      securityLog("info", "twilio.webhook.dnc_ignored", { tenantId, leadId: lead.id });
      await completeWebhookReceipt(receipt);
      return new NextResponse(twimlResponse, {
        status: 200,
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    // AI Reply Brain classification only. No auto-send.
    const replyBrain = classifySellerReply(messageBody);

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

    securityLog("info", "twilio.webhook.reply_classified", {
      tenantId,
      leadId: lead.id,
      intent: replyBrain.intent,
      requiresHumanApproval: replyBrain.requiresHumanApproval,
    });
    await completeWebhookReceipt(receipt);

    return new NextResponse(twimlResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    await releaseWebhookReceipt(receipt).catch(() => undefined);
    securityLog("error", "twilio.webhook.processing_failed", { tenantId, error });

    return NextResponse.json({ ok: false, error: "Webhook processing failed." }, { status: 500 });
  }
}
