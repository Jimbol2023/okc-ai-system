import { NextResponse } from "next/server";

import { createLiveTestRuntimeContractPreview } from "@/lib/live-test-runtime-contract-adapter";
import type { ExecutionMode } from "@/lib/execution-policy";
import type { LiveTestAllowlistMode } from "@/lib/live-test-allowlist-policy";
import type { ProviderMode } from "@/lib/provider-boundary";

export const runtime = "nodejs";

type SendSmsPayload = {
  phoneNumbers?: string[];
  message?: string;
  dealId?: string;
  dealAddress?: string;
  approvalStatus?: string;
  doNotContact?: boolean;
  optOutReason?: string | null;
  operatorConfirmed?: boolean;
  allowlistedRecipients?: string[];
  allowlistMode?: LiveTestAllowlistMode;
  killSwitchActive?: boolean;
  emergencyStopActive?: boolean;
  executionMode?: ExecutionMode;
  providerMode?: ProviderMode;
  operatorId?: string;
};

const boundaryMessage = "No SMS was sent. Provider execution is disabled.";

function invalidPayload(error: string) {
  return NextResponse.json(
    {
      ok: false,
      success: false,
      sent: false,
      providerCalled: false,
      canSendNow: false,
      simulationOnly: true,
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

    const runtimeContract = createLiveTestRuntimeContractPreview({
      leadId: payload.dealId,
      channel: "sms",
      recipient: phoneNumbers[0],
      message,
      approvalStatus: payload.approvalStatus,
      doNotContact: payload.doNotContact,
      optOutReason: payload.optOutReason,
      operatorConfirmed: payload.operatorConfirmed,
      allowlistedRecipients: payload.allowlistedRecipients,
      allowlistMode: payload.allowlistMode,
      killSwitchActive: payload.killSwitchActive,
      emergencyStopActive: payload.emergencyStopActive,
      executionMode: payload.executionMode,
      providerMode: payload.providerMode,
      operatorId: payload.operatorId,
    });

    return NextResponse.json({
      ok: runtimeContract.ok,
      success: true,
      sent: false,
      providerCalled: false,
      canSendNow: false,
      simulationOnly: true,
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
      runtimeContract: {
        ok: runtimeContract.ok,
        adapterOnly: runtimeContract.adapterOnly,
        sent: runtimeContract.sent,
        providerCalled: runtimeContract.providerCalled,
        canSendNow: runtimeContract.canSendNow,
        simulationOnly: runtimeContract.simulationOnly,
        reasonCodes: runtimeContract.reasonCodes,
        safetySummary: runtimeContract.safetySummary,
        allowlist: {
          allowed: runtimeContract.allowlistDecision.allowed,
          allowlistMode: runtimeContract.allowlistDecision.allowlistMode,
          reasonCodes: runtimeContract.allowlistDecision.reasonCodes,
          requiresOperatorConfirmation: runtimeContract.allowlistDecision.requiresOperatorConfirmation,
        },
        killSwitch: {
          allowed: runtimeContract.killSwitchDecision.allowed,
          blocked: runtimeContract.killSwitchDecision.blocked,
          reasonCodes: runtimeContract.killSwitchDecision.reasonCodes,
          killSwitchActive: runtimeContract.killSwitchDecision.killSwitchActive,
          emergencyStopActive: runtimeContract.killSwitchDecision.emergencyStopActive,
        },
        routeIntegration: {
          ok: runtimeContract.routeIntegrationPreview.ok,
          designOnly: runtimeContract.routeIntegrationPreview.designOnly,
          sent: runtimeContract.routeIntegrationPreview.sent,
          providerCalled: runtimeContract.routeIntegrationPreview.providerCalled,
          canSendNow: runtimeContract.routeIntegrationPreview.canSendNow,
          simulationOnly: runtimeContract.routeIntegrationPreview.simulationOnly,
          reasonCodes: runtimeContract.routeIntegrationPreview.reasonCodes,
        },
        controlledSimulation: {
          ok: runtimeContract.controlledSimulation.ok,
          sent: runtimeContract.controlledSimulation.sent,
          providerCalled: runtimeContract.controlledSimulation.providerCalled,
          canSendNow: runtimeContract.controlledSimulation.canSendNow,
          simulationOnly: runtimeContract.controlledSimulation.simulationOnly,
          reasonCodes: runtimeContract.controlledSimulation.reasonCodes,
        },
        auditEvents: runtimeContract.auditEvents.map((auditEvent) => ({
          ok: auditEvent.ok,
          eventType: auditEvent.eventType,
          severity: auditEvent.severity,
          nonSecret: auditEvent.nonSecret,
          redacted: auditEvent.redacted,
          reasonCodes: auditEvent.reasonCodes,
          safetySummary: auditEvent.safetySummary,
        })),
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        success: false,
        sent: false,
        providerCalled: false,
        canSendNow: false,
        simulationOnly: true,
        dryRun: true,
        simulated: true,
        reason: "invalid_json",
        error: "Invalid request body.",
      },
      { status: 400 },
    );
  }
}
