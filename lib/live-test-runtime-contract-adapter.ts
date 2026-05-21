import { type ExecutionMode } from "@/lib/execution-policy";
import {
  createLiveTestAuditEvent,
  type LiveTestAuditEventType,
  type LiveTestAuditOutput,
} from "@/lib/live-test-audit-log-contract";
import {
  evaluateLiveTestAllowlist,
  type LiveTestAllowlistDecision,
  type LiveTestAllowlistMode,
} from "@/lib/live-test-allowlist-policy";
import { evaluateLiveTestKillSwitch, type LiveTestKillSwitchDecision } from "@/lib/live-test-kill-switch-policy";
import {
  createLiveTestRouteIntegrationPreview,
  type LiveTestRouteIntegrationPreview,
} from "@/lib/live-test-route-integration-design";
import { type ControlledSendSimulationResult } from "@/lib/controlled-send-simulation";
import { type ProviderMode } from "@/lib/provider-boundary";

export type LiveTestRuntimeContractAdapterInput = {
  leadId?: string;
  channel: "sms" | "email";
  recipient?: string;
  message?: string;
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

export type LiveTestRuntimeContractAdapterInvariantCheck = {
  passed: boolean;
  reasonCodes: Array<
    | "adapter_only_required"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
    | "simulation_only_required"
    | "audit_persistence_forbidden"
    | "route_mutation_forbidden"
  >;
};

export type LiveTestRuntimeContractPreview = {
  ok: boolean;
  adapterOnly: true;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  allowlistDecision: LiveTestAllowlistDecision;
  killSwitchDecision: LiveTestKillSwitchDecision;
  routeIntegrationPreview: LiveTestRouteIntegrationPreview;
  controlledSimulation: ControlledSendSimulationResult;
  auditEvents: LiveTestAuditOutput[];
  reasonCodes: string[];
  safetySummary: string;
};

function addReason(reasonCodes: string[], reasonCode: string) {
  if (!reasonCodes.includes(reasonCode)) {
    reasonCodes.push(reasonCode);
  }
}

function uniqueReasonCodes(reasonCodes: string[]) {
  return reasonCodes.filter((reasonCode, index) => reasonCodes.indexOf(reasonCode) === index);
}

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function createRecipientFingerprint(recipient?: string) {
  const normalizedRecipient = normalizeText(recipient).toLowerCase();

  if (!normalizedRecipient) return "";

  return `fingerprint:length-${normalizedRecipient.length}:suffix-${normalizedRecipient.slice(-4)}`;
}

function collectAdapterClosedReasons({
  dncBlocked,
  allowlistAllowed,
  killSwitchAllowed,
  approved,
  operatorConfirmed,
}: {
  dncBlocked: boolean;
  allowlistAllowed: boolean;
  killSwitchAllowed: boolean;
  approved: boolean;
  operatorConfirmed: boolean;
}) {
  const reasonCodes: string[] = [];

  if (dncBlocked) addReason(reasonCodes, "dnc_or_opt_out_fail_closed");
  if (!allowlistAllowed) addReason(reasonCodes, "allowlist_fail_closed");
  if (!killSwitchAllowed) addReason(reasonCodes, "kill_switch_fail_closed");
  if (approved) addReason(reasonCodes, "approval_alone_does_not_permit_send");
  if (operatorConfirmed) addReason(reasonCodes, "operator_confirmation_alone_does_not_permit_send");
  addReason(reasonCodes, "runtime_contract_adapter_only");
  addReason(reasonCodes, "live_execution_not_activated");

  return reasonCodes;
}

function createAdapterAuditEvent({
  eventType,
  input,
  reasonCodes,
}: {
  eventType: LiveTestAuditEventType;
  input: LiveTestRuntimeContractAdapterInput;
  reasonCodes: string[];
}) {
  return createLiveTestAuditEvent({
    eventType,
    leadId: normalizeText(input.leadId),
    channel: input.channel,
    recipientFingerprint: createRecipientFingerprint(input.recipient),
    operatorId: normalizeText(input.operatorId),
    policyMode: input.executionMode ?? "live_disabled",
    reasonCodes,
    metadata: {
      adapterOnly: true,
      routeMutation: false,
      providerCalled: false,
      auditPersisted: false,
      simulationOnly: true,
    },
  });
}

export function assertRuntimeContractAdapterInvariants(
  preview: Pick<
    LiveTestRuntimeContractPreview,
    "adapterOnly" | "sent" | "providerCalled" | "canSendNow" | "simulationOnly" | "auditEvents"
  >,
): LiveTestRuntimeContractAdapterInvariantCheck {
  const reasonCodes: LiveTestRuntimeContractAdapterInvariantCheck["reasonCodes"] = [];

  if (preview.adapterOnly !== true) reasonCodes.push("adapter_only_required");
  if (preview.sent !== false) reasonCodes.push("sent_must_be_false");
  if (preview.providerCalled !== false) reasonCodes.push("provider_called_must_be_false");
  if (preview.canSendNow !== false) reasonCodes.push("can_send_now_must_be_false");
  if (preview.simulationOnly !== true) reasonCodes.push("simulation_only_required");
  if (preview.auditEvents.some((auditEvent) => auditEvent.auditFields.invariants.persistedNow !== false)) {
    reasonCodes.push("audit_persistence_forbidden");
  }
  if (preview.auditEvents.some((auditEvent) => auditEvent.auditFields.invariants.routeBehaviorAllowed !== false)) {
    reasonCodes.push("route_mutation_forbidden");
  }

  return {
    passed: reasonCodes.length === 0,
    reasonCodes,
  };
}

export function summarizeLiveTestRuntimeContractPreview(preview: LiveTestRuntimeContractPreview) {
  const invariantCheck = assertRuntimeContractAdapterInvariants(preview);
  const blockedStageCount = preview.routeIntegrationPreview.stages.filter((stage) => !stage.passed).length;

  return (
    `Runtime contract adapter reviewed ${preview.routeIntegrationPreview.stages.length} route integration stages. ` +
    `${blockedStageCount} stages fail closed or require later implementation review. ` +
    `Adapter invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "No SMS, email, provider call, audit persistence, API route mutation, automation execution, env read, or DB write occurred."
  );
}

export function createLiveTestRuntimeContractPreview(
  input: LiveTestRuntimeContractAdapterInput,
): LiveTestRuntimeContractPreview {
  const leadId = normalizeText(input.leadId);
  const recipient = normalizeText(input.recipient);
  const message = normalizeText(input.message);
  const approvalStatus = normalizeText(input.approvalStatus);
  const approved = approvalStatus === "approved_for_outreach";
  const dncBlocked = Boolean(input.doNotContact || input.optOutReason);
  const allowlistMode = input.allowlistMode ?? "simulation_only";
  const reasonCodes: string[] = [];

  if (!leadId) addReason(reasonCodes, "missing_lead_id");
  if (!recipient) addReason(reasonCodes, "missing_recipient");
  if (!message) addReason(reasonCodes, "missing_message");
  if (!approvalStatus) addReason(reasonCodes, "missing_approval_status");
  if (!approved) addReason(reasonCodes, "unapproved_for_outreach");
  if (input.doNotContact) addReason(reasonCodes, "dnc_blocked");
  if (input.optOutReason) addReason(reasonCodes, "opt_out_blocked");

  const allowlistDecision = evaluateLiveTestAllowlist({
    channel: input.channel,
    recipient,
    leadId,
    allowlistedRecipients: input.allowlistedRecipients,
    allowlistMode,
    operatorConfirmed: input.operatorConfirmed,
  });
  const killSwitchDecision = evaluateLiveTestKillSwitch({
    action: input.channel,
    killSwitchActive: input.killSwitchActive,
    emergencyStopActive: input.emergencyStopActive,
  });
  const routeIntegrationPreview = createLiveTestRouteIntegrationPreview({
    leadId,
    channel: input.channel,
    recipient,
    message,
    approvalStatus,
    doNotContact: input.doNotContact,
    optOutReason: input.optOutReason,
    operatorConfirmed: input.operatorConfirmed,
    allowlistedRecipients: input.allowlistedRecipients,
    allowlistMode,
    killSwitchActive: input.killSwitchActive,
    emergencyStopActive: input.emergencyStopActive,
    executionMode: input.executionMode,
    providerMode: input.providerMode,
  });
  const controlledSimulation = routeIntegrationPreview.controlledSimulation;
  const closedReasonCodes = collectAdapterClosedReasons({
    dncBlocked,
    allowlistAllowed: allowlistDecision.allowed,
    killSwitchAllowed: killSwitchDecision.allowed,
    approved,
    operatorConfirmed: input.operatorConfirmed === true,
  });

  for (const reasonCode of allowlistDecision.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of killSwitchDecision.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of routeIntegrationPreview.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of controlledSimulation.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of closedReasonCodes) addReason(reasonCodes, reasonCode);

  const adapterAuditEvents = [
    createAdapterAuditEvent({
      eventType: "live_test_precheck",
      input,
      reasonCodes: ["runtime_contract_adapter_only", "live_execution_not_activated"],
    }),
    createAdapterAuditEvent({
      eventType:
        dncBlocked || !allowlistDecision.allowed || !killSwitchDecision.allowed ? "live_test_blocked" : "live_test_ready",
      input,
      reasonCodes: closedReasonCodes,
    }),
  ];
  const auditEvents = [...routeIntegrationPreview.auditEvents, ...adapterAuditEvents];
  const preview: LiveTestRuntimeContractPreview = {
    ok: routeIntegrationPreview.ok && allowlistDecision.allowed && killSwitchDecision.allowed && !dncBlocked,
    adapterOnly: true,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    allowlistDecision,
    killSwitchDecision,
    routeIntegrationPreview,
    controlledSimulation,
    auditEvents,
    reasonCodes: uniqueReasonCodes(reasonCodes),
    safetySummary: "Runtime contract adapter only. No route behavior, provider execution, audit persistence, or live send is enabled.",
  };

  return {
    ...preview,
    safetySummary: summarizeLiveTestRuntimeContractPreview(preview),
  };
}
