import { NextResponse } from "next/server";

export const runtime = "nodejs";

// =====================================================
// STEP 2B.4 + 2B.5 — SAFE SMS SEND ROUTE (TWILIO)
// Includes:
// - Node runtime fix (prevents fs error)
// - Dynamic Twilio import (prevents Vercel build crash)
// - Safe fallback (mock mode)
// - Error isolation per number
// =====================================================

type SendSmsPayload = {
  phoneNumbers?: string[];
  message?: string;
  dealId?: string;
  dealAddress?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SendSmsPayload;

    const phoneNumbers = payload.phoneNumbers?.filter(Boolean) ?? [];
    const message = payload.message?.trim();

    // ============================
    // INPUT VALIDATION
    // ============================
    if (phoneNumbers.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one phone number is required." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    // ============================
    // CHECK TWILIO CONFIG
    // ============================
    const hasTwilioConfig =
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER;

    // ============================
    // SAFE MOCK MODE (NO CONFIG)
    // ============================
    if (!hasTwilioConfig) {
      console.log("⚠️ Mock SMS mode (Twilio not configured)");

      return NextResponse.json({
        success: true,
        mocked: true,
        provider: "mock",
        sentCount: phoneNumbers.length,
        message
      });
    }

    // ============================
    // ✅ SAFE DYNAMIC IMPORT (KEY FIX)
    // ============================
    const twilioModule = await import("twilio");
    const twilio = twilioModule.default;

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    let sentCount = 0;
    let failedCount = 0;

    // ============================
    // SEND SMS (SAFE LOOP)
    // ============================
    for (const phone of phoneNumbers) {
      try {
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        });

        sentCount++;
      } catch (err) {
        console.error("❌ Failed to send to:", phone, err);
        failedCount++;
      }
    }

    // ============================
    // RESPONSE
    // ============================
    return NextResponse.json({
      success: true,
      provider: "twilio",
      sentCount,
      failedCount
    });

  } catch (error) {
    console.error("🔥 SMS ROUTE ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to send SMS." },
      { status: 500 }
    );
  }
}