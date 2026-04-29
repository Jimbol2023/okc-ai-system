import { NextResponse } from "next/server";

export const runtime = "nodejs";

type SendSmsPayload = {
  phoneNumbers?: string[];
  message?: string;
};

async function sendTwilioSms(phone: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return { success: true, mocked: true };
  }

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: phone,
        Body: message
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Twilio REST SMS failed:", errorText);
    return { success: false, mocked: false };
  }

  return { success: true, mocked: false };
}

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

    let sentCount = 0;
    let failedCount = 0;

    for (const phone of phoneNumbers) {
      const result = await sendTwilioSms(phone, message);

      if (result.success) {
        sentCount++;
      } else {
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
    console.error("SMS ROUTE ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to send SMS." },
      { status: 500 }
    );
  }
}