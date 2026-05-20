export type ExecutionMode =
  | "blocked"
  | "simulation"
  | "dry_run"
  | "approval_required"
  | "approved_pending"
  | "live_disabled"
  | "future_live_test";

export type ExecutionActionCategory =
  | "sms"
  | "email"
  | "automation"
  | "mock_outreach"
  | "approval_update"
  | "eligibility_check";

export type ExecutionPolicyReasonCode =
  | "blocked_by_policy"
  | "simulation_only"
  | "dry_run_only"
  | "live_disabled"
  | "dnc_blocked"
  | "opt_out_blocked"
  | "human_approval_required"
  | "approval_is_not_send_permission"
  | "provider_forbidden"
  | "automation_execution_blocked"
  | "future_live_test_not_enabled"
  | "future_live_test_requires_approval"
  | "future_live_test_requires_dnc_clear"
  | "future_live_test_allowed";

export type ExecutionPolicyInput = {
  action: ExecutionActionCategory;
  mode?: ExecutionMode;
  hasHumanApproval?: boolean;
  doNotContact?: boolean;
  optedOut?: boolean;
  requestedProviderCall?: boolean;
  requestedAutomationExecution?: boolean;
  futureLiveTestExplicitlyEnabled?: boolean;
};

export type ExecutionPolicyDecision = {
  allowed: boolean;
  mode: ExecutionMode;
  sent: false;
  providerCalled: false;
  automationExecuted: false;
  requiresHumanApproval: boolean;
  dncBlocked: boolean;
  reasonCodes: ExecutionPolicyReasonCode[];
  safetySummary: string;
};

const nonSendingModes = new Set<ExecutionMode>([
  "blocked",
  "simulation",
  "dry_run",
  "approval_required",
  "approved_pending",
  "live_disabled",
]);

function addReason(reasonCodes: ExecutionPolicyReasonCode[], reasonCode: ExecutionPolicyReasonCode) {
  if (!reasonCodes.includes(reasonCode)) {
    reasonCodes.push(reasonCode);
  }
}

function isOutboundAction(action: ExecutionActionCategory) {
  return action === "sms" || action === "email" || action === "automation";
}

function buildDecision({
  allowed,
  mode,
  requiresHumanApproval,
  dncBlocked,
  reasonCodes,
}: {
  allowed: boolean;
  mode: ExecutionMode;
  requiresHumanApproval: boolean;
  dncBlocked: boolean;
  reasonCodes: ExecutionPolicyReasonCode[];
}): ExecutionPolicyDecision {
  return {
    allowed,
    mode,
    sent: false,
    providerCalled: false,
    automationExecuted: false,
    requiresHumanApproval,
    dncBlocked,
    reasonCodes,
    safetySummary:
      "Execution policy evaluated without side effects. No SMS, email, provider call, automation execution, or DB write occurred.",
  };
}

export function createBlockedExecutionDecision(
  reasonCodes: ExecutionPolicyReasonCode[] = ["blocked_by_policy"],
): ExecutionPolicyDecision {
  return buildDecision({
    allowed: false,
    mode: "blocked",
    requiresHumanApproval: true,
    dncBlocked: reasonCodes.includes("dnc_blocked") || reasonCodes.includes("opt_out_blocked"),
    reasonCodes,
  });
}

export function createSimulationExecutionDecision(
  reasonCodes: ExecutionPolicyReasonCode[] = ["simulation_only", "provider_forbidden"],
): ExecutionPolicyDecision {
  return buildDecision({
    allowed: false,
    mode: "simulation",
    requiresHumanApproval: true,
    dncBlocked: reasonCodes.includes("dnc_blocked") || reasonCodes.includes("opt_out_blocked"),
    reasonCodes,
  });
}

export function createDryRunExecutionDecision(
  reasonCodes: ExecutionPolicyReasonCode[] = ["dry_run_only", "automation_execution_blocked", "provider_forbidden"],
): ExecutionPolicyDecision {
  return buildDecision({
    allowed: false,
    mode: "dry_run",
    requiresHumanApproval: true,
    dncBlocked: reasonCodes.includes("dnc_blocked") || reasonCodes.includes("opt_out_blocked"),
    reasonCodes,
  });
}

export function evaluateExecutionPolicy(input: ExecutionPolicyInput): ExecutionPolicyDecision {
  const mode = input.mode ?? "live_disabled";
  const reasonCodes: ExecutionPolicyReasonCode[] = [];
  const dncBlocked = Boolean(input.doNotContact || input.optedOut);
  const requiresHumanApproval = isOutboundAction(input.action) && !input.hasHumanApproval;

  if (input.doNotContact) addReason(reasonCodes, "dnc_blocked");
  if (input.optedOut) addReason(reasonCodes, "opt_out_blocked");
  if (requiresHumanApproval) addReason(reasonCodes, "human_approval_required");

  if (mode === "blocked") addReason(reasonCodes, "blocked_by_policy");
  if (mode === "simulation") addReason(reasonCodes, "simulation_only");
  if (mode === "dry_run") addReason(reasonCodes, "dry_run_only");
  if (mode === "live_disabled") addReason(reasonCodes, "live_disabled");
  if (mode === "approval_required") addReason(reasonCodes, "human_approval_required");
  if (mode === "approved_pending" && isOutboundAction(input.action)) {
    addReason(reasonCodes, "approval_is_not_send_permission");
  }

  if (input.requestedProviderCall && mode !== "future_live_test") {
    addReason(reasonCodes, "provider_forbidden");
  }

  if (input.requestedAutomationExecution || (input.action === "automation" && mode !== "future_live_test")) {
    addReason(reasonCodes, "automation_execution_blocked");
  }

  if (nonSendingModes.has(mode)) {
    if (isOutboundAction(input.action)) addReason(reasonCodes, "provider_forbidden");

    return buildDecision({
      allowed:
        input.action === "eligibility_check" ||
        (!dncBlocked && (input.action === "approval_update" || input.action === "mock_outreach")),
      mode,
      requiresHumanApproval,
      dncBlocked,
      reasonCodes,
    });
  }

  if (mode === "future_live_test") {
    if (!input.futureLiveTestExplicitlyEnabled) addReason(reasonCodes, "future_live_test_not_enabled");
    if (!input.hasHumanApproval) addReason(reasonCodes, "future_live_test_requires_approval");
    if (dncBlocked) addReason(reasonCodes, "future_live_test_requires_dnc_clear");

    const allowed =
      input.futureLiveTestExplicitlyEnabled === true &&
      input.hasHumanApproval === true &&
      !dncBlocked &&
      isOutboundAction(input.action);

    if (allowed) addReason(reasonCodes, "future_live_test_allowed");

    return buildDecision({
      allowed,
      mode,
      requiresHumanApproval: !input.hasHumanApproval,
      dncBlocked,
      reasonCodes,
    });
  }

  return createBlockedExecutionDecision(reasonCodes.length > 0 ? reasonCodes : ["blocked_by_policy"]);
}
