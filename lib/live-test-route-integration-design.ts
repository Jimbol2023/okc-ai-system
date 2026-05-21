import { createApprovalSendPathPreview } from "@/lib/approval-send-path-design";
import { createControlledSendSimulation, type ControlledSendSimulationResult } from "@/lib/controlled-send-simulation";
import { evaluateExecutionPolicy, type ExecutionMode } from "@/lib/execution-policy";
import {
  createLiveTestAuditEvent,
  type LiveTestAuditEventType,
  type LiveTestAuditOutput,
} from "@/lib/live-test-audit-log-contract";
import {
  evaluateLiveTestAllowlist,
  type LiveTestAllowlistMode,
} from "@/lib/live-test-allowlist-policy";
import { evaluateLiveTestKillSwitch } from "@/lib/live-test-kill-switch-policy";
import { evaluateProviderBoundary, type ProviderMode } from "@/lib/provider-boundary";

export type LiveTestRouteIntegrationStage =
  | "parse_request"
  | "validate_channel"
  | "validate_message"
  | "verify_approval_context"
  | "verify_dnc_clear"
  | "evaluate_allowlist"
  | "evaluate_kill_switch"
  | "evaluate_execution_policy"
  | "evaluate_provider_boundary"
  | "create_controlled_simulation"
  | "create_audit_events"
  | "return_bounded_response";

export type LiveTestRouteIntegrationInput = {
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
};

export type LiveTestRouteIntegrationStageResult = {
  stage: LiveTestRouteIntegrationStage;
  passed: boolean;
  reasonCodes: string[];
};

export type LiveTestRouteIntegrationInvariantCheck = {
  passed: boolean;
  reasonCodes: Array<
    | "design_only_required"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
    | "simulation_only_required"
    | "audit_persistence_forbidden"
    | "route_mutation_forbidden"
  >;
};

export type LiveTestRouteIntegrationPreview = {
  ok: boolean;
  designOnly: true;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  stages: LiveTestRouteIntegrationStageResult[];
  reasonCodes: string[];
  auditEvents: LiveTestAuditOutput[];
  controlledSimulation: ControlledSendSimulationResult;
  safetySummary: string;
};

const liveTestRouteIntegrationStages: LiveTestRouteIntegrationStage[] = [
  "parse_request",
  "validate_channel",
  "validate_message",
  "verify_approval_context",
  "verify_dnc_clear",
  "evaluate_allowlist",
  "evaluate_kill_switch",
  "evaluate_execution_policy",
  "evaluate_provider_boundary",
  "create_controlled_simulation",
  "create_audit_events",
  "return_bounded_response",
];

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

function buildStage(stage: LiveTestRouteIntegrationStage, passed: boolean, reasonCodes: string[] = []) {
  return {
    stage,
    passed,
    reasonCodes: uniqueReasonCodes(reasonCodes),
  };
}

function createRecipientFingerprint(recipient?: string) {
  const normalizedRecipient = normalizeText(recipient).toLowerCase();

  if (!normalizedRecipient) return "";

  return `fingerprint:length-${normalizedRecipient.length}:suffix-${normalizedRecipient.slice(-4)}`;
}

function createRouteAuditEvent({
  eventType,
  input,
  reasonCodes,
}: {
  eventType: LiveTestAuditEventType;
  input: LiveTestRouteIntegrationInput;
  reasonCodes: string[];
}) {
  return createLiveTestAuditEvent({
    eventType,
    leadId: normalizeText(input.leadId),
    channel: input.channel,
    recipientFingerprint: createRecipientFingerprint(input.recipient),
    policyMode: input.executionMode ?? "live_disabled",
    reasonCodes,
    metadata: {
      designOnly: true,
      routeMutation: false,
      providerCalled: false,
      auditPersisted: false,
    },
  });
}

function getRouteClosedReasonCodes({
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
  addReason(reasonCodes, "route_integration_design_only");
  addReason(reasonCodes, "live_execution_not_activated");

  return reasonCodes;
}

export function listLiveTestRouteIntegrationStages() {
  return [...liveTestRouteIntegrationStages];
}

export function assertRouteIntegrationDesignInvariants(
  preview: Pick<
    LiveTestRouteIntegrationPreview,
    "designOnly" | "sent" | "providerCalled" | "canSendNow" | "simulationOnly" | "auditEvents"
  >,
): LiveTestRouteIntegrationInvariantCheck {
  const reasonCodes: LiveTestRouteIntegrationInvariantCheck["reasonCodes"] = [];

  if (preview.designOnly !== true) reasonCodes.push("design_only_required");
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

export function summarizeLiveTestRouteIntegration(preview: LiveTestRouteIntegrationPreview) {
  const invariantCheck = assertRouteIntegrationDesignInvariants(preview);
  const blockedStageCount = preview.stages.filter((stage) => !stage.passed).length;

  return (
    `Route integration design reviewed ${preview.stages.length} stages. ` +
    `${blockedStageCount} stages fail closed or require later implementation review. ` +
    `Design invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "No SMS, email, provider call, audit persistence, API route mutation, automation execution, env read, or DB write occurred."
  );
}

export function createLiveTestRouteIntegrationPreview(
  input: LiveTestRouteIntegrationInput,
): LiveTestRouteIntegrationPreview {
  const leadId = normalizeText(input.leadId);
  const message = normalizeText(input.message);
  const recipient = normalizeText(input.recipient);
  const approvalStatus = normalizeText(input.approvalStatus);
  const approved = approvalStatus === "approved_for_outreach";
  const dncBlocked = Boolean(input.doNotContact || input.optOutReason);
  const executionMode = input.executionMode ?? "live_disabled";
  const providerMode = input.providerMode ?? "mock";
  const allowlistMode = input.allowlistMode ?? "simulation_only";
  const reasonCodes: string[] = [];

  if (!leadId) addReason(reasonCodes, "missing_lead_id");
  if (!recipient) addReason(reasonCodes, "missing_recipient");
  if (!message) addReason(reasonCodes, "missing_message");
  if (!approvalStatus) addReason(reasonCodes, "missing_approval_status");
  if (!approved) addReason(reasonCodes, "unapproved_for_outreach");
  if (input.doNotContact) addReason(reasonCodes, "dnc_blocked");
  if (input.optOutReason) addReason(reasonCodes, "opt_out_blocked");

  const approvalPreview = createApprovalSendPathPreview({
    leadId,
    message,
    channel: input.channel,
    approvalStatus,
    doNotContact: input.doNotContact,
    optOutReason: input.optOutReason,
    operatorConfirmed: input.operatorConfirmed,
    executionMode,
  });
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
  const executionPolicy = evaluateExecutionPolicy({
    action: input.channel,
    mode: executionMode,
    hasHumanApproval: approved,
    doNotContact: input.doNotContact,
    optedOut: Boolean(input.optOutReason),
    requestedProviderCall: providerMode === "future_live_test",
    futureLiveTestExplicitlyEnabled: false,
  });
  const providerBoundary = evaluateProviderBoundary({
    action: input.channel,
    to: recipient || leadId,
    message,
    leadId,
    approved,
    dncBlocked,
    executionMode,
    providerMode,
    futureLiveTestExplicitlyEnabled: false,
  });
  const controlledSimulation = createControlledSendSimulation({
    leadId,
    message,
    channel: input.channel,
    approvalStatus,
    doNotContact: input.doNotContact,
    optOutReason: input.optOutReason,
    operatorConfirmed: input.operatorConfirmed,
    executionMode,
    providerMode,
  });
  const closedReasonCodes = getRouteClosedReasonCodes({
    dncBlocked,
    allowlistAllowed: allowlistDecision.allowed,
    killSwitchAllowed: killSwitchDecision.allowed,
    approved,
    operatorConfirmed: input.operatorConfirmed === true,
  });

  for (const reasonCode of approvalPreview.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of allowlistDecision.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of killSwitchDecision.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of executionPolicy.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of providerBoundary.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of controlledSimulation.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of closedReasonCodes) addReason(reasonCodes, reasonCode);

  const auditEvents = [
    createRouteAuditEvent({
      eventType: "live_test_precheck",
      input,
      reasonCodes: ["route_integration_design_only", "live_execution_not_activated"],
    }),
    createRouteAuditEvent({
      eventType: "allowlist_check",
      input,
      reasonCodes: allowlistDecision.reasonCodes,
    }),
    createRouteAuditEvent({
      eventType: "kill_switch_check",
      input,
      reasonCodes: killSwitchDecision.reasonCodes,
    }),
    createRouteAuditEvent({
      eventType: "approval_gate_check",
      input,
      reasonCodes: approved ? ["approval_alone_does_not_permit_send"] : ["unapproved_for_outreach"],
    }),
    createRouteAuditEvent({
      eventType: "provider_boundary_check",
      input,
      reasonCodes: providerBoundary.reasonCodes,
    }),
    createRouteAuditEvent({
      eventType: "send_simulation",
      input,
      reasonCodes: controlledSimulation.reasonCodes,
    }),
    createRouteAuditEvent({
      eventType:
        dncBlocked || !allowlistDecision.allowed || !killSwitchDecision.allowed ? "live_test_blocked" : "live_test_ready",
      input,
      reasonCodes: closedReasonCodes,
    }),
  ];
  const stages: LiveTestRouteIntegrationStageResult[] = [
    buildStage("parse_request", true),
    buildStage("validate_channel", input.channel === "sms" || input.channel === "email", []),
    buildStage("validate_message", Boolean(message), message ? [] : ["missing_message"]),
    buildStage("verify_approval_context", approved, approved ? [] : ["unapproved_for_outreach"]),
    buildStage("verify_dnc_clear", !dncBlocked, dncBlocked ? ["dnc_or_opt_out_fail_closed"] : []),
    buildStage("evaluate_allowlist", allowlistDecision.allowed, allowlistDecision.reasonCodes),
    buildStage("evaluate_kill_switch", killSwitchDecision.allowed, killSwitchDecision.reasonCodes),
    buildStage("evaluate_execution_policy", executionPolicy.allowed, executionPolicy.reasonCodes),
    buildStage("evaluate_provider_boundary", providerBoundary.ok, providerBoundary.reasonCodes),
    buildStage("create_controlled_simulation", controlledSimulation.simulationOnly, controlledSimulation.reasonCodes),
    buildStage("create_audit_events", auditEvents.every((auditEvent) => auditEvent.nonSecret), []),
    buildStage("return_bounded_response", true, ["route_integration_design_only"]),
  ];
  const preview: LiveTestRouteIntegrationPreview = {
    ok: !dncBlocked && allowlistDecision.allowed && killSwitchDecision.allowed,
    designOnly: true,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    stages,
    reasonCodes: uniqueReasonCodes(reasonCodes),
    auditEvents,
    controlledSimulation,
    safetySummary: "Route integration design only. No runtime route behavior or live execution is enabled.",
  };

  return {
    ...preview,
    safetySummary: summarizeLiveTestRouteIntegration(preview),
  };
}
