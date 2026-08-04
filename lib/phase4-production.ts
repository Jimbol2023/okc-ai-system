import twilio from "twilio";

import { getConnectorHealth } from "@/lib/connector-platform";
import { getPhase4LiveSmsConfig, validateProductionEnvironment } from "@/lib/env";
import { evaluateExecutionPolicy } from "@/lib/execution-policy";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { evaluateLiveTestAllowlist, normalizeAllowlistRecipient } from "@/lib/live-test-allowlist-policy";
import { evaluateLiveTestKillSwitch } from "@/lib/live-test-kill-switch-policy";
import { createOperatorConfirmationRuntimeDesign } from "@/lib/operator-confirmation-runtime-design";
import { prisma } from "@/lib/prisma";
import { logRevenueAuditEvent, sanitizeAuditMetadata } from "@/lib/revenue-spine";
import { evaluateSafeAutomation } from "@/lib/safe-auto-mode";
import { requireTenantId } from "@/lib/tenant-context";

export type Phase4TimelineEventInput = {
  eventType: string;
  entityType: string;
  entityId?: string | null;
  leadId?: string | null;
  propertyAddress?: string | null;
  campaignId?: string | null;
  userId?: string | null;
  aiAgent?: string | null;
  connectorId?: string | null;
  status: "prepared" | "blocked" | "executed" | "failed";
  sourceLabel: string;
  reasonCodes: string[];
  metadata?: Record<string, unknown>;
  tenantId: string;
};

export type ControlledLiveSmsInput = {
  tenantId: string;
  leadId?: string;
  recipient: string;
  message: string;
  approvalStatus?: string;
  doNotContact?: boolean;
  optOutReason?: string | null;
  operatorConfirmed?: boolean;
  operatorId?: string;
  operatorConfirmationIntent?: string;
  expectedActionFingerprint: string;
  confirmationActionFingerprint?: string;
  confirmationContextId?: string;
  expectedConfirmationContextId?: string;
  confirmationCreatedAtMs?: number;
  evaluatedAtMs?: number;
  expiresAfterMs?: number;
};

export type ControlledLiveSmsResult = {
  ok: boolean;
  sent: boolean;
  providerCalled: boolean;
  canSendNow: boolean;
  simulationOnly: false;
  mode: "controlled_live_test";
  provider: "twilio";
  providerMessageId: string | null;
  deliveryStatus: "queued" | "sent" | "failed" | "blocked";
  auditEventId: string | null;
  timelineEventId: string | null;
  redactedRecipient: string;
  reasonCodes: string[];
  requiredNextHumanActions: string[];
  safetySummary: string;
};

function addReason(reasonCodes: string[], reasonCode: string) {
  if (!reasonCodes.includes(reasonCode)) {
    reasonCodes.push(reasonCode);
  }
}

function unique(reasonCodes: string[]) {
  return Array.from(new Set(reasonCodes.filter(Boolean)));
}

export function redactPhone(phone: string) {
  const normalized = normalizeAllowlistRecipient(phone, "sms");

  if (!normalized) return "";

  return `${"*".repeat(Math.max(0, normalized.length - 4))}${normalized.slice(-4)}`;
}

function safeMessageSummary(message: string) {
  return `sms_length_${message.length}`;
}

function getPrismaWithPhase4Models() {
  return prisma as typeof prisma & {
    operationsTimelineEvent?: {
      create: (args: { data: Record<string, unknown> }) => Promise<{ id: string }>;
      findMany: (args: Record<string, unknown>) => Promise<Array<Record<string, unknown>>>;
      count: (args?: Record<string, unknown>) => Promise<number>;
    };
  };
}

export async function writeOperationsTimelineEvent(input: Phase4TimelineEventInput) {
  const client = getPrismaWithPhase4Models();

  if (!client.operationsTimelineEvent) {
    return null;
  }

  return client.operationsTimelineEvent.create({
    data: {
      tenantId: requireTenantId(input.tenantId, "operations_timeline"),
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      leadId: input.leadId ?? null,
      propertyAddress: input.propertyAddress ?? null,
      campaignId: input.campaignId ?? null,
      userId: input.userId ?? null,
      aiAgent: input.aiAgent ?? null,
      connectorId: input.connectorId ?? null,
      status: input.status,
      sourceLabel: input.sourceLabel,
      reasonCodes: unique(input.reasonCodes),
      safeMetadata: sanitizeAuditMetadata(input.metadata ?? {}),
      providerCalled: input.status === "executed",
      sent: input.eventType === "sms_sent" && input.status === "executed",
      published: false,
      liveExecutionAllowed: input.status === "executed",
    },
  });
}

export async function listOperationsTimelineEvents(filters: {
  leadId?: string | null;
  propertyAddress?: string | null;
  campaignId?: string | null;
  userId?: string | null;
  aiAgent?: string | null;
  connectorId?: string | null;
  eventType?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  take?: number;
}) {
  const client = getPrismaWithPhase4Models();

  if (!client.operationsTimelineEvent) {
    return [];
  }

  const where: Record<string, unknown> = {};
  const createdAt: Record<string, Date> = {};

  for (const key of ["leadId", "propertyAddress", "campaignId", "userId", "aiAgent", "connectorId", "eventType"] as const) {
    if (filters[key]) where[key] = filters[key];
  }

  if (filters.dateFrom) createdAt.gte = new Date(filters.dateFrom);
  if (filters.dateTo) createdAt.lte = new Date(filters.dateTo);
  if (Object.keys(createdAt).length > 0) where.createdAt = createdAt;

  return client.operationsTimelineEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(filters.take ?? 50, 1), 100),
  });
}

export function getPhase4GovernanceStatus() {
  const env = validateProductionEnvironment();
  const connectorHealth = getConnectorHealth();
  const twilioHealth = connectorHealth.find((connector) => connector.connectorId === "twilio") ?? null;
  const liveSmsFeatureEnabled = isFeatureEnabled("phase4_controlled_live_sms");

  return {
    ok: env.coreReady,
    environment: env,
    featureFlags: {
      phase4ProductionReadiness: isFeatureEnabled("phase4_production_readiness"),
      phase4OperationsTimeline: isFeatureEnabled("phase4_operations_timeline"),
      phase4ExecutiveAssistant: isFeatureEnabled("phase4_executive_assistant"),
      phase4ControlledLiveSms: liveSmsFeatureEnabled,
    },
    twilioReadiness: {
      connectorId: "twilio",
      featureEnabled: liveSmsFeatureEnabled,
      healthStatus: twilioHealth?.healthStatus ?? "unknown",
      envReady: env.phase4LiveSmsReady,
      killSwitchActive: env.killSwitchActive,
      controlledLiveTestEligible: liveSmsFeatureEnabled && env.phase4LiveSmsReady && env.killSwitchActive === false,
    },
    governanceBlockers: [
      ...env.blockers,
      ...(liveSmsFeatureEnabled ? [] : ["phase4_controlled_live_sms feature flag is disabled."]),
      ...(env.killSwitchActive ? ["PHASE4_SMS_KILL_SWITCH is active."] : []),
    ],
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function createBlockedLiveSmsResult(input: ControlledLiveSmsInput, reasonCodes: string[], requiredNextHumanActions: string[]): ControlledLiveSmsResult {
  return {
    ok: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: false,
    mode: "controlled_live_test",
    provider: "twilio",
    providerMessageId: null,
    deliveryStatus: "blocked",
    auditEventId: null,
    timelineEventId: null,
    redactedRecipient: redactPhone(input.recipient),
    reasonCodes: unique(reasonCodes),
    requiredNextHumanActions,
    safetySummary: "Controlled live SMS blocked before provider execution. No Twilio call occurred.",
  };
}

export async function executeControlledLiveSms(input: ControlledLiveSmsInput): Promise<ControlledLiveSmsResult> {
  const reasonCodes: string[] = [];
  const requiredNextHumanActions: string[] = [];
  const config = getPhase4LiveSmsConfig();
  const env = validateProductionEnvironment();
  const normalizedRecipient = normalizeAllowlistRecipient(input.recipient, "sms");
  const approved = input.approvalStatus === "approved_for_outreach";
  const dncBlocked = Boolean(input.doNotContact || input.optOutReason);
  const allowlistDecision = evaluateLiveTestAllowlist({
    channel: "sms",
    recipient: input.recipient,
    allowlistedRecipients: config.allowlistedRecipients,
    allowlistMode: "live_test",
    operatorConfirmed: input.operatorConfirmed,
  });
  const killSwitchDecision = evaluateLiveTestKillSwitch({
    action: "sms",
    killSwitchActive: config.smsKillSwitchActive,
    emergencyStopActive: false,
  });
  const policyDecision = evaluateExecutionPolicy({
    action: "sms",
    mode: "controlled_live_test",
    hasHumanApproval: approved,
    doNotContact: input.doNotContact,
    optedOut: Boolean(input.optOutReason),
    requestedProviderCall: true,
    futureLiveTestExplicitlyEnabled: config.liveSmsEnabled,
  });
  const safeAutoDecision = evaluateSafeAutomation({
    requestedAction: "queue_sms_draft",
    preferredToolKey: "twilio",
    module: "Phase 4 Controlled Live SMS",
  });
  const phase4TwilioReady = env.phase4LiveSmsReady && !config.smsKillSwitchActive;
  const confirmation = createOperatorConfirmationRuntimeDesign({
    runtimeContract: {
      ok: true,
      adapterOnly: true,
      sent: false,
      providerCalled: false,
      canSendNow: false,
      simulationOnly: true,
      reasonCodes: ["controlled_live_test_precheck"],
      safetySummary: "Controlled live test precheck context.",
    },
    confirmationRequested: true,
    operatorConfirmed: input.operatorConfirmed,
    operatorId: input.operatorId,
    confirmationIntent: input.operatorConfirmationIntent,
    expectedActionFingerprint: input.expectedActionFingerprint,
    confirmationActionFingerprint: input.confirmationActionFingerprint,
    expectedConfirmationContextId: input.expectedConfirmationContextId,
    confirmationContextId: input.confirmationContextId,
    confirmationCreatedAtMs: input.confirmationCreatedAtMs,
    evaluatedAtMs: input.evaluatedAtMs ?? Date.now(),
    expiresAfterMs: input.expiresAfterMs ?? 5 * 60 * 1000,
  });

  for (const reasonCode of env.blockers) addReason(reasonCodes, reasonCode);
  for (const reasonCode of allowlistDecision.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of killSwitchDecision.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of policyDecision.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of confirmation.reasonCodes) addReason(reasonCodes, reasonCode);

  if (!isFeatureEnabled("phase4_controlled_live_sms")) addReason(reasonCodes, "phase4_controlled_live_sms_disabled");
  if (!config.liveSmsEnabled) addReason(reasonCodes, "phase4_live_sms_disabled");
  if (!normalizedRecipient) addReason(reasonCodes, "recipient_invalid");
  if (!approved) addReason(reasonCodes, "lead_not_approved_for_outreach");
  if (dncBlocked) addReason(reasonCodes, "dnc_or_opt_out_blocked");
  if (safeAutoDecision.status === "blocked") addReason(reasonCodes, "safe_auto_mode_blocked");
  if (!phase4TwilioReady) addReason(reasonCodes, "phase4_twilio_connector_not_ready");
  if (!allowlistDecision.allowed) requiredNextHumanActions.push("Add recipient to PHASE4_ALLOWLISTED_SMS_RECIPIENTS and confirm operator intent.");
  if (!approved) requiredNextHumanActions.push("Set lead approval status to approved_for_outreach before live SMS.");
  if (!confirmation.confirmationValid) requiredNextHumanActions.push("Provide valid operator confirmation with matching action fingerprint and context.");
  if (!env.phase4LiveSmsReady) requiredNextHumanActions.push("Complete Phase 4 Twilio environment configuration and disable kill switch only for approved tests.");

  const canCallTwilio =
    env.phase4LiveSmsReady &&
    isFeatureEnabled("phase4_controlled_live_sms") &&
    config.liveSmsEnabled &&
    !config.smsKillSwitchActive &&
    allowlistDecision.allowed &&
    killSwitchDecision.allowed &&
    policyDecision.allowed &&
    confirmation.confirmationValid &&
    approved &&
    !dncBlocked &&
    Boolean(normalizedRecipient) &&
    safeAutoDecision.status !== "blocked" &&
    phase4TwilioReady;

  if (!canCallTwilio) {
    await writeOperationsTimelineEvent({
      tenantId: input.tenantId,
      eventType: "sms_blocked",
      entityType: "lead",
      entityId: input.leadId ?? null,
      leadId: input.leadId ?? null,
      connectorId: "twilio",
      status: "blocked",
      sourceLabel: "phase4_controlled_live_sms",
      reasonCodes,
      metadata: {
        redactedRecipient: redactPhone(input.recipient),
        messageSummary: safeMessageSummary(input.message),
        providerCalled: false,
        sent: false,
      },
    }).catch(() => null);

    return createBlockedLiveSmsResult(input, reasonCodes, requiredNextHumanActions);
  }

  const auditEvent = await logRevenueAuditEvent({
    tenantId: input.tenantId,
    action: "controlled_live_sms_preflight",
    targetType: "lead",
    targetId: input.leadId ?? null,
    source: "phase4_controlled_live_sms",
    result: "success",
    actorId: input.operatorId ?? null,
    metadata: {
      connectorId: "twilio",
      redactedRecipient: redactPhone(input.recipient),
      messageSummary: safeMessageSummary(input.message),
      providerCalled: false,
      sent: false,
      actionFingerprint: input.expectedActionFingerprint,
    },
  });

  try {
    const client = twilio(config.twilioAccountSid, config.twilioAuthToken);
    const message = await client.messages.create({
      to: normalizedRecipient,
      from: config.twilioFromNumber,
      body: input.message,
    });
    const timelineEvent = await writeOperationsTimelineEvent({
      tenantId: input.tenantId,
      eventType: "sms_sent",
      entityType: "lead",
      entityId: input.leadId ?? null,
      leadId: input.leadId ?? null,
      connectorId: "twilio",
      status: "executed",
      sourceLabel: "phase4_controlled_live_sms",
      reasonCodes: ["controlled_live_test_allowed", "twilio_provider_called"],
      metadata: {
        redactedRecipient: redactPhone(input.recipient),
        messageSummary: safeMessageSummary(input.message),
        providerMessageId: message.sid,
        deliveryStatus: message.status,
      },
    });

    if (input.leadId) {
      await prisma.revenueCommunicationEvent.create({
        data: {
          tenantId: input.tenantId,
          leadId: input.leadId,
          channel: "sms",
          direction: "outbound",
          status: "sent",
          approvalStatus: "approved_for_outreach",
          provider: "twilio",
          providerCalled: true,
          messageSummary: safeMessageSummary(input.message),
          requiresApproval: true,
          createdBy: input.operatorId ?? null,
        },
      });
    }

    return {
      ok: true,
      sent: true,
      providerCalled: true,
      canSendNow: false,
      simulationOnly: false,
      mode: "controlled_live_test",
      provider: "twilio",
      providerMessageId: message.sid,
      deliveryStatus: message.status === "failed" || message.status === "undelivered" ? "failed" : message.status === "sent" ? "sent" : "queued",
      auditEventId: auditEvent.id,
      timelineEventId: timelineEvent?.id ?? null,
      redactedRecipient: redactPhone(input.recipient),
      reasonCodes: ["controlled_live_test_allowed", "twilio_provider_called"],
      requiredNextHumanActions: ["Review Twilio delivery status and lead outcome before expanding allowlist."],
      safetySummary: "Controlled live SMS executed through Twilio after all Phase 4 gates passed. General production sending remains disabled.",
    };
  } catch (error) {
    const timelineEvent = await writeOperationsTimelineEvent({
      tenantId: input.tenantId,
      eventType: "sms_failed",
      entityType: "lead",
      entityId: input.leadId ?? null,
      leadId: input.leadId ?? null,
      connectorId: "twilio",
      status: "failed",
      sourceLabel: "phase4_controlled_live_sms",
      reasonCodes: ["twilio_provider_error"],
      metadata: {
        redactedRecipient: redactPhone(input.recipient),
        messageSummary: safeMessageSummary(input.message),
        errorType: error instanceof Error ? error.name : "unknown_error",
      },
    });

    return {
      ok: false,
      sent: false,
      providerCalled: true,
      canSendNow: false,
      simulationOnly: false,
      mode: "controlled_live_test",
      provider: "twilio",
      providerMessageId: null,
      deliveryStatus: "failed",
      auditEventId: auditEvent.id,
      timelineEventId: timelineEvent?.id ?? null,
      redactedRecipient: redactPhone(input.recipient),
      reasonCodes: ["twilio_provider_error"],
      requiredNextHumanActions: ["Review Twilio credentials, account status, rate limits, and recipient allowlist before retry."],
      safetySummary: "Twilio provider call failed. The failure was recorded without fabricating delivery status.",
    };
  }
}

export async function getTimelineIntegritySummary() {
  const client = getPrismaWithPhase4Models();

  if (!client.operationsTimelineEvent) {
    return {
      available: false,
      count: 0,
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  }

  const count = await client.operationsTimelineEvent.count().catch(() => 0);

  return {
    available: true,
    count,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}
