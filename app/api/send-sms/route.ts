import { NextResponse } from "next/server";

import { runLiveOutreachPreflight } from "@/lib/outreach-preflight";

export const runtime = "nodejs";

type SendSmsPayload = {
  phoneNumbers?: string[];
  message?: string;
  dealId?: string;
  dealAddress?: string;
};

const boundaryMessage = "No SMS was sent. Provider execution is disabled.";

function invalidPayload(error: string) {
  return NextResponse.json(
    {
      ok: false,
      success: false,
      sent: false,
      providerCalled: false,
      dryRun: true,
      simulated: true,
      reason: "invalid_request",
      error,
    },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SendSmsPayload;
    const phoneNumbers = payload.phoneNumbers?.map((phone) => phone.trim()).filter(Boolean) ?? [];
    const message = payload.message?.trim();

    if (phoneNumbers.length === 0) {
      return invalidPayload("At least one phone number is required.");
    }

    if (!message) {
      return invalidPayload("Message is required.");
    }

    const preflight = runLiveOutreachPreflight({
      phone: phoneNumbers[0],
      message,
      operatorConfirmed: false,
    });

    return NextResponse.json({
      ok: true,
      success: true,
      sent: false,
      providerCalled: false,
      dryRun: true,
      simulated: true,
      mocked: true,
      provider: "mock",
      mode: "live_disabled",
      reason: "mock_only_boundary",
      message: boundaryMessage,
      wouldSend: false,
      liveOutreachDisabled: true,
      requestedRecipientCount: phoneNumbers.length,
      sentCount: 0,
      failedCount: 0,
      dealId: payload.dealId ?? null,
      dealAddress: payload.dealAddress ?? null,
      preflight: {
        ...preflight,
        allowed: false,
        wouldCallProvider: false,
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        success: false,
        sent: false,
        providerCalled: false,
        dryRun: true,
        simulated: true,
        reason: "invalid_json",
        error: "Invalid request body.",
      },
      { status: 400 },
    );
  }
}
