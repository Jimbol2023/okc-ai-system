import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure server runtime

type SendSmsPayload = {
  phoneNumbers?: string[];
  message?: string;
  dealId?: string;
  dealAddress?: string;
};

// =====================================================
// SAFE SMS ROUTE — NO TWILIO SDK (Vercel-safe)
// =====================================================

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SendSmsPayload;

    const phoneNumbers = payload.phoneNumbers?.filter(Boolean) ?? [];
    const message = payload.message?.trim();

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

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    const hasTwilioConfig =
      Boolean(accountSid) &&
      Boolean(authToken) &&
      Boolean(fromNumber);

    // ============================================
    // MOCK MODE (SAFE FOR DEVELOPMENT)
    // ============================================
    if (!hasTwilioConfig) {
      console.log("📨 MOCK SMS:", { phoneNumbers, message });

      return NextResponse.json({
        success: true,
        mocked: true,
        provider: "mock",
        sentCount: phoneNumbers.length,
        failedCount: 0
      });
    }

    // ============================================
    // REAL TWILIO (REST API — NO SDK)
    // ============================================
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    let sentCount = 0;
    let failedCount = 0;

    for (const phone of phoneNumbers) {
      try {
        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              From: fromNumber!,
              To: phone,
              Body: message
            })
          }
        );

        if (!res.ok) {
          const err = await res.text();
          console.error("❌ Twilio REST error:", err);
          failedCount++;
        } else {
          sentCount++;
        }
      } catch (err) {
        console.error("❌ SMS send error:", err);
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      provider: "twilio-rest",
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