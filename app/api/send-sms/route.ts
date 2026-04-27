import { NextResponse } from "next/server";

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

    if (!hasTwilioConfig) {
      return NextResponse.json({
        success: true,
        mocked: true,
        provider: "mock",
        sentCount: phoneNumbers.length,
        dealId: payload.dealId ?? null,
        dealAddress: payload.dealAddress ?? null,
        message
      });
    }

    return NextResponse.json({
      success: false,
      error: "Twilio config detected, but real Twilio sending is not connected yet."
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid SMS request." },
      { status: 400 }
    );
  }
}