import { NextResponse } from "next/server";

import { detectOptOut } from "@/lib/opt-out-detector";
import { prisma } from "@/lib/prisma";

// =====================================================
// STEP 2B.6D — TWILIO INBOUND SMS WEBHOOK
// Handles seller replies and detects opt-outs
// =====================================================

export async function POST(request: Request) {
  const formData = await request.formData();

  const fromPhone = String(formData.get("From") ?? "");
  const messageBody = String(formData.get("Body") ?? "");

  console.log("📩 Incoming SMS:", { fromPhone, messageBody });

  const optOutResult = detectOptOut(messageBody);

  if (optOutResult.isOptOut && fromPhone) {
    console.log("🚫 Opt-out detected:", optOutResult.reason);

    await prisma.lead.updateMany({
      where: {
        phone: fromPhone
      },
      data: {
        doNotContact: true,
        optOutReason: optOutResult.reason,
        optOutAt: new Date(),
        automationStatus: "idle"
      }
    });
  }

  // Twilio requires XML response
  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;

  return new NextResponse(twimlResponse, {
    status: 200,
    headers: {
      "Content-Type": "text/xml"
    }
  });
}