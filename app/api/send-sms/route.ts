import { NextResponse } from "next/server";

import { createAuditPersistencePlanning } from "@/lib/audit-persistence-planning";
import { createLiveTestReadinessSummary } from "@/lib/live-test-readiness-summary-contract";
import { createLiveTestRuntimeContractPreview } from "@/lib/live-test-runtime-contract-adapter";
import { createOperatorConfirmationRuntimeDesign } from "@/lib/operator-confirmation-runtime-design";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import type { ExecutionMode } from "@/lib/execution-policy";
import type { LiveTestAllowlistMode } from "@/lib/live-test-allowlist-policy";
import { executeControlledLiveSms } from "@/lib/phase4-production";
import type { ProviderMode } from "@/lib/provider-boundary";
import { prisma } from "@/lib/prisma";

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
  operatorConfirmationIntent?: string;
  confirmationActionFingerprint?: string;
  confirmationContextId?: string;
  confirmationCreatedAtMs?: number;
};

const boundaryMessage = "No SMS was sent. Provider execution is disabled.";
const baseSafetyReasonCodes = ["simulation_only", "provider_disabled", "live_execution_blocked"];
const maxSafetyReasonCodes = 40;
const maxSafetyReasonCodeLength = 80;

function normalizeSafetyReasonCode(reasonCode: string) {
  return reasonCode.trim().slice(0, maxSafetyReasonCodeLength);
}

function createSafetyEnvelope(reasonCodes: string[] = []) {
  const boundedReasonCodes = [...baseSafetyReasonCodes, ...reasonCodes]
    .map(normalizeSafetyReasonCode)
    .filter(Boolean);

  return {
    mode: "simulation_only" as const,
    executionBlocked: true,
    providerDisabled: true,
    liveExecutionEnabled: false,
    reasonCodes: Array.from(new Set(boundedReasonCodes)).slice(0, maxSafetyReasonCodes),
  };
}

function createSendRouteActionFingerprint({
  dealId,
  recipient,
  message,
}: {
  dealId?: string;
  recipient: string;
  message: string;
}) {
  const normalizedRecipient = recipient.trim().toLowerCase();
  const normalizedDealId = dealId?.trim() || "no-deal-id";

  return `send-sms:${normalizedDealId}:recipient-length-${normalizedRecipient.length}:recipient-suffix-${normalizedRecipient.slice(
    -4,
  )}:message-length-${message.length}`;
}

function invalidPayload(error: string) {
  return NextResponse.json(
    {
      ok: false,
      success: false,
      sent: false,
      providerCalled: false,
      canSendNow: false,
      simulationOnly: true,
      liveTestReady: false,
      dryRun: true,
      simulated: true,
      reason: "invalid_request",
      reasonCodes: ["invalid_request"],
      error,
      safetyEnvelope: createSafetyEnvelope(["invalid_request"]),
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

    const actionFingerprint = createSendRouteActionFingerprint({
      dealId: payload.dealId,
      recipient: phoneNumbers[0],
      message,
    });

    if (payload.executionMode === "controlled_live_test") {
      if (!(await isAuthenticatedRequest(request))) {
        return getUnauthorizedApiResponse();
      }
      const actor = await getAuthenticatedRequestContext(request);
      if (!actor) return getUnauthorizedApiResponse();

      if (!payload.dealId) {
        return invalidPayload("Lead/deal ID is required for controlled live SMS.");
      }

      const lead = await prisma.lead.findFirst({
        where: {
          id: payload.dealId,
          tenantId: actor.tenantId,
        },
        select: {
          id: true,
          approvalStatus: true,
          doNotContact: true,
          optOutReason: true,
        },
      });

      if (!lead) {
        return invalidPayload("Lead was not found for controlled live SMS.");
      }

      const liveResult = await executeControlledLiveSms({
        tenantId: actor.tenantId,
        leadId: lead.id,
        recipient: phoneNumbers[0],
        message,
        approvalStatus: lead.approvalStatus,
        doNotContact: lead.doNotContact,
        optOutReason: lead.optOutReason,
        operatorConfirmed: payload.operatorConfirmed,
        operatorId: payload.operatorId,
        operatorConfirmationIntent: payload.operatorConfirmationIntent,
        expectedActionFingerprint: actionFingerprint,
        confirmationActionFingerprint: payload.confirmationActionFingerprint,
        expectedConfirmationContextId: lead.id,
        confirmationContextId: payload.confirmationContextId,
        confirmationCreatedAtMs: payload.confirmationCreatedAtMs,
      });

      return NextResponse.json({
        ...liveResult,
        success: liveResult.ok,
        liveTestReady: liveResult.ok,
        dryRun: false,
        simulated: false,
        mocked: false,
        wouldSend: false,
        liveOutreachDisabled: false,
        requestedRecipientCount: phoneNumbers.length,
        sentCount: liveResult.sent ? 1 : 0,
        failedCount: liveResult.ok ? 0 : 1,
        dealId: lead.id,
        dealAddress: payload.dealAddress ?? null,
        safetyEnvelope: {
          mode: "controlled_live_test",
          executionBlocked: !liveResult.sent,
          providerDisabled: !liveResult.providerCalled,
          liveExecutionEnabled: liveResult.sent,
          reasonCodes: liveResult.reasonCodes,
        },
      });
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
    const operatorConfirmation = createOperatorConfirmationRuntimeDesign({
      runtimeContract,
      confirmationRequested: payload.operatorConfirmed === true,
      operatorConfirmed: payload.operatorConfirmed,
      operatorId: payload.operatorId,
      expectedActionFingerprint: actionFingerprint,
      confirmationActionFingerprint: "",
    });
    const auditPersistence = createAuditPersistencePlanning({
      configuredForFuturePersistence: true,
      eventType: "send_sms_route_readiness_summary",
      actionFingerprint,
      leadId: payload.dealId,
      dealId: payload.dealId,
      operatorConfirmationState: operatorConfirmation.state,
      runtimeContractState: runtimeContract.ok ? "runtime_contract_ok" : "runtime_contract_blocked",
      simulationOnly: true,
      sent: false,
      providerCalled: false,
      canSendNow: false,
      reasonCodes: runtimeContract.reasonCodes,
      metadata: {
        routeSimulationOnly: true,
        requestedRecipientCount: phoneNumbers.length,
        providerCalled: false,
        sent: false,
        canSendNow: false,
      },
    });
    const readinessSummary = createLiveTestReadinessSummary({
      runtimeContract,
      operatorConfirmation,
      auditPersistence,
      executionPolicy: runtimeContract.controlledSimulation.policyDecision,
      providerBoundary: runtimeContract.controlledSimulation.providerDecision,
      approvalStatus: payload.approvalStatus,
      doNotContact: payload.doNotContact,
      optOutReason: payload.optOutReason,
      allowlistAllowed: runtimeContract.allowlistDecision.allowed,
      killSwitchAllowed: runtimeContract.killSwitchDecision.allowed,
      killSwitchActive: runtimeContract.killSwitchDecision.killSwitchActive,
      emergencyStopActive: runtimeContract.killSwitchDecision.emergencyStopActive,
      simulationOnly: true,
      reasonCodes: runtimeContract.reasonCodes,
    });

    return NextResponse.json({
      ok: runtimeContract.ok,
      success: true,
      sent: false,
      providerCalled: false,
      canSendNow: false,
      simulationOnly: true,
      liveTestReady: false,
      dryRun: true,
      simulated: true,
      mocked: true,
      provider: "mock",
      mode: "live_disabled",
      reason: "mock_only_boundary",
      message: boundaryMessage,
      safetyEnvelope: createSafetyEnvelope(["mock_only_boundary", ...readinessSummary.reasonCodes]),
      wouldSend: false,
      liveOutreachDisabled: true,
      requestedRecipientCount: phoneNumbers.length,
      sentCount: 0,
      failedCount: 0,
      dealId: payload.dealId ?? null,
      dealAddress: payload.dealAddress ?? null,
      readinessSummary: {
        readinessLevel: readinessSummary.readinessLevel,
        liveTestReady: readinessSummary.liveTestReady,
        canSendNow: readinessSummary.canSendNow,
        sent: readinessSummary.sent,
        providerCalled: readinessSummary.providerCalled,
        simulationOnly: readinessSummary.simulationOnly,
        reasonCodes: readinessSummary.reasonCodes,
        blockingFactors: readinessSummary.blockingFactors,
        advisoryFactors: readinessSummary.advisoryFactors,
        requiredNextHumanActions: readinessSummary.requiredNextHumanActions,
        summary: readinessSummary.summary,
      },
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
        operatorConfirmation: {
          operatorConfirmed: operatorConfirmation.operatorConfirmed,
          confirmationValid: operatorConfirmation.confirmationValid,
          state: operatorConfirmation.state,
          canProceedToLiveTest: operatorConfirmation.canProceedToLiveTest,
          sent: operatorConfirmation.sent,
          providerCalled: operatorConfirmation.providerCalled,
          canSendNow: operatorConfirmation.canSendNow,
          simulationOnly: operatorConfirmation.simulationOnly,
          reasonCodes: operatorConfirmation.reasonCodes,
          auditSummary: operatorConfirmation.auditSummary,
        },
        auditPersistence: {
          persistencePlanned: auditPersistence.persistencePlanned,
          persistenceExecuted: auditPersistence.persistenceExecuted,
          dbWriteAttempted: auditPersistence.dbWriteAttempted,
          readinessState: auditPersistence.readinessState,
          sent: auditPersistence.sent,
          providerCalled: auditPersistence.providerCalled,
          canSendNow: auditPersistence.canSendNow,
          simulationOnly: auditPersistence.simulationOnly,
          reasonCodes: auditPersistence.reasonCodes,
          forbiddenFieldsDetected: auditPersistence.forbiddenFieldsDetected,
          safetySummary: auditPersistence.safetySummary,
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
        liveTestReady: false,
        dryRun: true,
        simulated: true,
        reason: "invalid_json",
        reasonCodes: ["invalid_json"],
        error: "Invalid request body.",
        safetyEnvelope: createSafetyEnvelope(["invalid_json"]),
      },
      { status: 400 },
    );
  }
}
