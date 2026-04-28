import { NextResponse } from "next/server";
import twilio from "twilio";

type SendSmsPayload = {
  phoneNumbers?: string[];
  message?: string;
  dealId?: string;
  dealAddress?: string;
};

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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

    const hasTwilioConfig =
      Boolean(process.env.TWILIO_ACCOUNT_SID) &&
      Boolean(process.env.TWILIO_AUTH_TOKEN) &&
      Boolean(process.env.TWILIO_PHONE_NUMBER);

    // 🔒 SAFETY: fallback to mock if config missing
    if (!hasTwilioConfig) {
      return NextResponse.json({
        success: true,
        mocked: true,
        provider: "mock",
        sentCount: phoneNumbers.length,
        message
      });
    }

    let sentCount = 0;

    for (const phone of phoneNumbers) {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });

      sentCount++;
    }

    return NextResponse.json({
      success: true,
      provider: "twilio",
      sentCount
    });
  } catch (error) {
    console.error("SMS ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to send SMS." },
      { status: 500 }
    );
  }
}