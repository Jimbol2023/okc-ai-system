export type LiveTestKillSwitchAction = "sms" | "email" | "automation" | "live_test";

export type LiveTestKillSwitchReasonCode =
  | "action_missing"
  | "action_invalid"
  | "kill_switch_active"
  | "emergency_stop_active"
  | "operator_override_requested"
  | "operator_override_required"
  | "operator_override_policy_ready"
  | "policy_ready";

export type LiveTestKillSwitchInput = {
  action?: LiveTestKillSwitchAction | string | null;
  killSwitchActive?: boolean;
  emergencyStopActive?: boolean;
  operatorOverrideRequested?: boolean;
  operatorOverrideApproved?: boolean;
  reason?: string | null;
};

export type LiveTestKillSwitchDecision = {
  allowed: boolean;
  blocked: boolean;
  action: LiveTestKillSwitchAction | "unknown";
  killSwitchActive: boolean;
  emergencyStopActive: boolean;
  operatorOverrideRequired: boolean;
  operatorOverrideApproved: boolean;
  reasonCodes: LiveTestKillSwitchReasonCode[];
  safetySummary: string;
};

const validActions: LiveTestKillSwitchAction[] = ["sms", "email", "automation", "live_test"];

function addReason(reasonCodes: LiveTestKillSwitchReasonCode[], reasonCode: LiveTestKillSwitchReasonCode) {
  if (!reasonCodes.includes(reasonCode)) {
    reasonCodes.push(reasonCode);
  }
}

function normalizeAction(action?: LiveTestKillSwitchInput["action"]): LiveTestKillSwitchAction | "unknown" {
  if (!action) return "unknown";

  return validActions.includes(action as LiveTestKillSwitchAction) ? (action as LiveTestKillSwitchAction) : "unknown";
}

function buildDecision({
  allowed,
  input,
  action,
  reasonCodes,
}: {
  allowed: boolean;
  input: LiveTestKillSwitchInput;
  action: LiveTestKillSwitchAction | "unknown";
  reasonCodes: LiveTestKillSwitchReasonCode[];
}): LiveTestKillSwitchDecision {
  return {
    allowed,
    blocked: !allowed,
    action,
    killSwitchActive: input.killSwitchActive === true,
    emergencyStopActive: input.emergencyStopActive === true,
    operatorOverrideRequired: input.operatorOverrideRequested === true && input.operatorOverrideApproved !== true,
    operatorOverrideApproved: input.operatorOverrideApproved === true,
    reasonCodes,
    safetySummary:
      "Kill-switch policy evaluated without side effects. No SMS, email, provider call, automation execution, env read, or DB read occurred.",
  };
}

export function summarizeKillSwitchDecision(decision: LiveTestKillSwitchDecision) {
  if (decision.allowed) {
    return "Kill-switch policy is ready for later controlled live-test planning only. No execution occurred.";
  }

  return `Kill-switch policy blocked ${decision.action}. Reasons: ${decision.reasonCodes.join(", ")}. No execution occurred.`;
}

export function createKillSwitchBlockedDecision(
  input: LiveTestKillSwitchInput = {},
  reasonCodes: LiveTestKillSwitchReasonCode[] = ["kill_switch_active"],
): LiveTestKillSwitchDecision {
  return buildDecision({
    allowed: false,
    input,
    action: normalizeAction(input.action),
    reasonCodes,
  });
}

export function createKillSwitchAllowedDecision(input: LiveTestKillSwitchInput): LiveTestKillSwitchDecision {
  return evaluateLiveTestKillSwitch({
    ...input,
    killSwitchActive: false,
    emergencyStopActive: false,
    operatorOverrideRequested: input.operatorOverrideRequested,
    operatorOverrideApproved: input.operatorOverrideApproved,
  });
}

export function evaluateLiveTestKillSwitch(input: LiveTestKillSwitchInput = {}): LiveTestKillSwitchDecision {
  const action = normalizeAction(input.action);
  const reasonCodes: LiveTestKillSwitchReasonCode[] = [];

  if (!input.action) addReason(reasonCodes, "action_missing");
  if (input.action && action === "unknown") addReason(reasonCodes, "action_invalid");
  if (input.killSwitchActive) addReason(reasonCodes, "kill_switch_active");
  if (input.emergencyStopActive) addReason(reasonCodes, "emergency_stop_active");

  if (input.operatorOverrideRequested) {
    addReason(reasonCodes, "operator_override_requested");

    if (!input.operatorOverrideApproved) {
      addReason(reasonCodes, "operator_override_required");
    }
  }

  if (input.operatorOverrideApproved) {
    addReason(reasonCodes, "operator_override_policy_ready");
  }

  const allowed =
    action !== "unknown" &&
    input.killSwitchActive !== true &&
    input.emergencyStopActive !== true &&
    (!input.operatorOverrideRequested || input.operatorOverrideApproved === true);

  if (allowed) {
    addReason(reasonCodes, "policy_ready");
  }

  return buildDecision({
    allowed,
    input,
    action,
    reasonCodes,
  });
}
