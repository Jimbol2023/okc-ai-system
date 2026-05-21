export type R48DryRunEnvelopeStatus =
  | "prohibited"
  | "blocked"
  | "dry_run_rejected"
  | "dry_run_ready"
  | "simulation_only_ready"
  | "planning_only";

export type R48DryRunReadinessDecision =
  | "prohibited"
  | "blocked"
  | "remediation_required"
  | "operator_review_required"
  | "simulation_only_ready"
  | "planning_only_ready";

export type R48DryRunAllowedAction =
  | "record_dry_run_request"
  | "evaluate_readiness_snapshot"
  | "simulate_provider_boundary"
  | "simulate_allowlist_check"
  | "simulate_kill_switch_check"
  | "prepare_future_audit_event"
  | "continue_planning_only";

export type R48DryRunProhibitedLiveAction =
  | "execute_activation"
  | "enable_provider"
  | "call_provider"
  | "send_sms"
  | "send_email"
  | "enable_live_execution"
  | "bypass_allowlist"
  | "bypass_kill_switch"
  | "write_runtime_audit_event";

export type R48DryRunReasonCode =
  | "r48g_dry_run_execution_envelope_contract_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "scenario_missing"
  | "readiness_decision_missing"
  | "readiness_decision_prohibited"
  | "readiness_decision_blocked"
  | "readiness_requires_remediation"
  | "readiness_requires_operator_review"
  | "provider_boundary_unsafe"
  | "kill_switch_unsafe"
  | "allowlist_missing_or_mismatch"
  | "audit_metadata_missing"
  | "audit_metadata_secret_detected"
  | "forbidden_activation_condition_detected"
  | "dry_run_ready"
  | "simulation_only_ready"
  | "planning_only_ready"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false";

export type R48DryRunScenarioSignal = {
  scenarioId?: string | null;
  scenarioName?: string | null;
  requestedBy?: string | null;
  requestedScope?: string | null;
  simulationOnly?: boolean;
  reasonCodes?: string[];
};

export type R48DryRunProviderBoundarySignal = {
  ok?: boolean;
  providerDisabled?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  activationAllowed?: boolean;
  reasonCodes?: string[];
};

export type R48DryRunKillSwitchSignal = {
  allowed?: boolean;
  killSwitchActive?: boolean;
  emergencyStopActive?: boolean;
  reasonCodes?: string[];
};

export type R48DryRunAllowlistSignal = {
  required?: boolean;
  allowed?: boolean;
  recipientMatched?: boolean;
  reasonCodes?: string[];
};

export type R48DryRunAuditMetadataSignal = {
  eventType?: string | null;
  correlationId?: string | null;
  operatorId?: string | null;
  scenarioId?: string | null;
  containsSecrets?: boolean;
  secretFieldNames?: string[];
  metadataWriteAttempted?: boolean;
  reasonCodes?: string[];
};

export type R48ControlledActivationDryRunExecutionEnvelopeInput = {
  scenario?: R48DryRunScenarioSignal;
  readinessGateDecision?: R48DryRunReadinessDecision;
  providerBoundary?: R48DryRunProviderBoundarySignal;
  killSwitch?: R48DryRunKillSwitchSignal;
  allowlist?: R48DryRunAllowlistSignal;
  auditMetadata?: R48DryRunAuditMetadataSignal;
  forbiddenActivationConditions?: string[];
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  reasonCodes?: string[];
};

export type R48ControlledActivationDryRunExecutionEnvelopeResult = {
  dryRunEnvelopeStatus: R48DryRunEnvelopeStatus;
  requestedActivationScenario: {
    scenarioId: string;
    scenarioName: string;
    requestedBy: string;
    requestedScope: string;
    simulationOnly: true;
  };
  readinessGateDecision: R48DryRunReadinessDecision | "missing";
  allowedDryRunActions: R48DryRunAllowedAction[];
  prohibitedLiveActions: R48DryRunProhibitedLiveAction[];
  requiredOperatorReviewItems: string[];
  futureAuditEventMetadata: {
    eventType: string;
    correlationId: string;
    operatorId: string;
    scenarioId: string;
    containsSecrets: false;
    metadataWriteAttempted: false;
  };
  providerBoundaryStatus: "safe_disabled" | "unsafe";
  killSwitchStatus: "safe" | "unsafe";
  allowlistStatus: "matched" | "missing_or_mismatch";
  finalSimulationOnlyOutcome: "rejected" | "ready" | "planning_only";
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  reasonCodes: string[];
  prohibitedFindings: string[];
  blockingFindings: string[];
  advisoryFindings: string[];
  forbiddenActivationConditions: string[];
  summary: string;
};

export type R48DryRunEnvelopeInvariantCheck = {
  passed: boolean;
  reasonCodes: Array<
    | "activation_executed_must_be_false"
    | "provider_activation_allowed_must_be_false"
    | "live_execution_allowed_must_be_false"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
    | "simulation_only_required"
    | "live_test_ready_must_be_false"
  >;
};

const maxListItems = 80;
const maxTextLength = 180;
const maxSummaryLength = 700;
const defaultText = "unspecified";
const secretPattern = /\b(api[_-]?key|secret|token|password|bearer|database_url|direct_url|auth|credential)\b/i;

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length <= maxTextLength) return normalizedValue;

  return `${normalizedValue.slice(0, maxTextLength)}...`;
}

function safeText(value?: string | null) {
  const boundedValue = boundText(value);

  if (!boundedValue) return defaultText;
  if (secretPattern.test(boundedValue)) return "redacted_secret_like_value";

  return boundedValue;
}

function boundSummary(value: string) {
  if (value.length <= maxSummaryLength) return value;

  return `${value.slice(0, maxSummaryLength)}...`;
}

function addUnique<T extends string>(list: T[], value: T) {
  if (value && !list.includes(value) && list.length < maxListItems) {
    list.push(value);
  }
}

function addUniqueText(list: string[], value: string) {
  const boundedValue = boundText(value);

  if (boundedValue && !list.includes(boundedValue) && list.length < maxListItems) {
    list.push(boundedValue);
  }
}

function addReason(reasonCodes: string[], reasonCode: R48DryRunReasonCode) {
  addUniqueText(reasonCodes, reasonCode);
}

function addAllowedAction(allowedDryRunActions: R48DryRunAllowedAction[], action: R48DryRunAllowedAction) {
  addUnique(allowedDryRunActions, action);
}

function addProhibitedAction(
  prohibitedLiveActions: R48DryRunProhibitedLiveAction[],
  action: R48DryRunProhibitedLiveAction,
) {
  addUnique(prohibitedLiveActions, action);
}

function collectExternalReasonCodes(reasonCodes: string[] | undefined, target: string[]) {
  for (const reasonCode of reasonCodes ?? []) {
    addUniqueText(target, reasonCode);
  }
}

function collectForbiddenActivationConditions(conditions: string[] | undefined, target: string[]) {
  for (const condition of conditions ?? []) {
    addUniqueText(target, condition);
  }
}

function addProhibited(prohibitedFindings: string[], finding: string) {
  addUniqueText(prohibitedFindings, finding);
}

function addBlocking(blockingFindings: string[], finding: string) {
  addUniqueText(blockingFindings, finding);
}

function addOperatorReview(requiredOperatorReviewItems: string[], finding: string) {
  addUniqueText(requiredOperatorReviewItems, finding);
}

function addAdvisory(advisoryFindings: string[], finding: string) {
  addUniqueText(advisoryFindings, finding);
}

function scenarioIsSafe(scenario?: R48DryRunScenarioSignal) {
  return Boolean(
    normalizeText(scenario?.scenarioId) &&
      normalizeText(scenario?.scenarioName) &&
      normalizeText(scenario?.requestedBy) &&
      normalizeText(scenario?.requestedScope) &&
      scenario?.simulationOnly === true,
  );
}

function providerBoundaryIsSafe(providerBoundary?: R48DryRunProviderBoundarySignal) {
  return (
    providerBoundary?.ok === true &&
    providerBoundary.providerDisabled === true &&
    providerBoundary.providerCalled !== true &&
    providerBoundary.sent !== true &&
    providerBoundary.activationAllowed !== true
  );
}

function killSwitchIsSafe(killSwitch?: R48DryRunKillSwitchSignal) {
  return (
    killSwitch?.allowed === true &&
    killSwitch.killSwitchActive !== true &&
    killSwitch.emergencyStopActive !== true
  );
}

function allowlistIsSafe(allowlist?: R48DryRunAllowlistSignal) {
  return allowlist?.required === true && allowlist.allowed === true && allowlist.recipientMatched === true;
}

function auditMetadataIsNonSecret(auditMetadata?: R48DryRunAuditMetadataSignal) {
  return (
    Boolean(
      normalizeText(auditMetadata?.eventType) &&
        normalizeText(auditMetadata?.correlationId) &&
        normalizeText(auditMetadata?.operatorId) &&
        normalizeText(auditMetadata?.scenarioId),
    ) &&
    auditMetadata?.containsSecrets !== true &&
    auditMetadata?.metadataWriteAttempted !== true &&
    (auditMetadata?.secretFieldNames?.length ?? 0) === 0 &&
    !secretPattern.test(
      [
        auditMetadata?.eventType,
        auditMetadata?.correlationId,
        auditMetadata?.operatorId,
        auditMetadata?.scenarioId,
      ]
        .map((value) => normalizeText(value))
        .join(" "),
    )
  );
}

export function assertR48ControlledActivationDryRunExecutionEnvelopeInvariants(
  result: Pick<
    R48ControlledActivationDryRunExecutionEnvelopeResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
  >,
): R48DryRunEnvelopeInvariantCheck {
  const reasonCodes: R48DryRunEnvelopeInvariantCheck["reasonCodes"] = [];

  if (result.activationExecuted !== false) reasonCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) reasonCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) reasonCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) reasonCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) reasonCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) reasonCodes.push("can_send_now_must_be_false");
  if (result.simulationOnly !== true) reasonCodes.push("simulation_only_required");
  if (result.liveTestReady !== false) reasonCodes.push("live_test_ready_must_be_false");

  return {
    passed: reasonCodes.length === 0,
    reasonCodes,
  };
}

export function summarizeR48ControlledActivationDryRunExecutionEnvelope(
  result: R48ControlledActivationDryRunExecutionEnvelopeResult,
) {
  const invariantCheck = assertR48ControlledActivationDryRunExecutionEnvelopeInvariants(result);

  return boundSummary(
    `R48G dry-run execution envelope status is ${result.dryRunEnvelopeStatus}. ` +
      `${result.allowedDryRunActions.length} dry-run actions are allowed and ${result.prohibitedLiveActions.length} live actions are prohibited. ` +
      `${result.requiredOperatorReviewItems.length} operator review items remain. ` +
      `${result.forbiddenActivationConditions.length} forbidden activation conditions are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Envelope is advisory, dry-run-only, and simulation-only; no provider activation, live execution, route execution, SMS/email send, DB write, env read, or automation activation is authorized.",
  );
}

export function createR48ControlledActivationDryRunExecutionEnvelope(
  input: R48ControlledActivationDryRunExecutionEnvelopeInput = {},
): R48ControlledActivationDryRunExecutionEnvelopeResult {
  const reasonCodes: string[] = [];
  const allowedDryRunActions: R48DryRunAllowedAction[] = [];
  const prohibitedLiveActions: R48DryRunProhibitedLiveAction[] = [];
  const requiredOperatorReviewItems: string[] = [];
  const prohibitedFindings: string[] = [];
  const blockingFindings: string[] = [];
  const advisoryFindings: string[] = [];
  const forbiddenActivationConditions: string[] = [];

  addReason(reasonCodes, "r48g_dry_run_execution_envelope_contract_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.scenario?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.providerBoundary?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.killSwitch?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.allowlist?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.auditMetadata?.reasonCodes, reasonCodes);
  collectForbiddenActivationConditions(input.forbiddenActivationConditions, forbiddenActivationConditions);

  for (const action of [
    "execute_activation",
    "enable_provider",
    "call_provider",
    "send_sms",
    "send_email",
    "enable_live_execution",
    "bypass_allowlist",
    "bypass_kill_switch",
    "write_runtime_audit_event",
  ] as const) {
    addProhibitedAction(prohibitedLiveActions, action);
  }

  if (input.activationExecuted === true) {
    addReason(reasonCodes, "activation_executed_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates activationExecuted:true.");
    addUniqueText(forbiddenActivationConditions, "activation_executed_true");
  }
  if (input.providerActivationAllowed === true) {
    addReason(reasonCodes, "provider_activation_allowed_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates providerActivationAllowed:true.");
    addUniqueText(forbiddenActivationConditions, "provider_activation_allowed_true");
  }
  if (input.liveExecutionAllowed === true) {
    addReason(reasonCodes, "live_execution_allowed_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates liveExecutionAllowed:true.");
    addUniqueText(forbiddenActivationConditions, "live_execution_allowed_true");
  }
  if (input.sent === true) {
    addReason(reasonCodes, "sent_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates sent:true.");
    addUniqueText(forbiddenActivationConditions, "sent_true");
  }
  if (input.providerCalled === true) {
    addReason(reasonCodes, "provider_called_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates providerCalled:true.");
    addUniqueText(forbiddenActivationConditions, "provider_called_true");
  }
  if (input.canSendNow === true) {
    addReason(reasonCodes, "can_send_now_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates canSendNow:true.");
    addUniqueText(forbiddenActivationConditions, "can_send_now_true");
  }
  if (input.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addProhibited(prohibitedFindings, "Input is not simulation-only.");
  }
  if (input.liveTestReady === true) {
    addReason(reasonCodes, "live_test_ready_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates liveTestReady:true.");
    addUniqueText(forbiddenActivationConditions, "live_test_ready_true");
  }

  if (!scenarioIsSafe(input.scenario)) {
    addReason(reasonCodes, "scenario_missing");
    addBlocking(blockingFindings, "Requested activation scenario is missing, incomplete, or not simulation-only.");
    addOperatorReview(requiredOperatorReviewItems, "Confirm dry-run scenario identity, requester, scope, and simulation-only mode.");
  }

  if (!input.readinessGateDecision) {
    addReason(reasonCodes, "readiness_decision_missing");
    addBlocking(blockingFindings, "Final readiness gate decision is missing.");
  } else if (input.readinessGateDecision === "prohibited") {
    addReason(reasonCodes, "readiness_decision_prohibited");
    addProhibited(prohibitedFindings, "Final readiness gate decision is prohibited.");
  } else if (input.readinessGateDecision === "blocked") {
    addReason(reasonCodes, "readiness_decision_blocked");
    addBlocking(blockingFindings, "Final readiness gate decision is blocked.");
  } else if (input.readinessGateDecision === "remediation_required") {
    addReason(reasonCodes, "readiness_requires_remediation");
    addBlocking(blockingFindings, "Final readiness gate requires remediation before dry-run readiness.");
  } else if (input.readinessGateDecision === "operator_review_required") {
    addReason(reasonCodes, "readiness_requires_operator_review");
    addBlocking(blockingFindings, "Final readiness gate requires operator review before dry-run readiness.");
    addOperatorReview(requiredOperatorReviewItems, "Complete final readiness operator review before dry-run.");
  }

  if (!providerBoundaryIsSafe(input.providerBoundary)) {
    addReason(reasonCodes, "provider_boundary_unsafe");
    addBlocking(blockingFindings, "Provider boundary is unsafe, enabled, missing, or indicates execution.");
    addOperatorReview(requiredOperatorReviewItems, "Verify provider boundary remains disabled before dry-run.");
  }

  if (!killSwitchIsSafe(input.killSwitch)) {
    addReason(reasonCodes, "kill_switch_unsafe");
    addBlocking(blockingFindings, "Kill-switch or emergency stop state is unsafe.");
    addOperatorReview(requiredOperatorReviewItems, "Verify kill-switch safe state before dry-run.");
  }

  if (!allowlistIsSafe(input.allowlist)) {
    addReason(reasonCodes, "allowlist_missing_or_mismatch");
    addBlocking(blockingFindings, "Allowlist is missing or mismatched.");
    addOperatorReview(requiredOperatorReviewItems, "Verify allowlist match before dry-run.");
  }

  if (!input.auditMetadata) {
    addReason(reasonCodes, "audit_metadata_missing");
    addBlocking(blockingFindings, "Future audit metadata is missing.");
  } else if (!auditMetadataIsNonSecret(input.auditMetadata)) {
    addReason(reasonCodes, "audit_metadata_secret_detected");
    addBlocking(blockingFindings, "Future audit metadata is missing required fields, contains secrets, or indicates a write attempt.");
    addOperatorReview(requiredOperatorReviewItems, "Remove secrets and runtime write attempts from future audit metadata.");
  }

  if (forbiddenActivationConditions.length > 0) {
    addReason(reasonCodes, "forbidden_activation_condition_detected");
    addProhibited(prohibitedFindings, "One or more forbidden activation conditions are present.");
  }

  let dryRunEnvelopeStatus: R48DryRunEnvelopeStatus = "dry_run_ready";

  if (prohibitedFindings.length > 0) {
    dryRunEnvelopeStatus = "prohibited";
  } else if (blockingFindings.length > 0) {
    dryRunEnvelopeStatus = "blocked";
  } else if (input.readinessGateDecision === "planning_only_ready") {
    dryRunEnvelopeStatus = "planning_only";
    addReason(reasonCodes, "planning_only_ready");
    addAllowedAction(allowedDryRunActions, "continue_planning_only");
  } else if (input.readinessGateDecision === "simulation_only_ready") {
    dryRunEnvelopeStatus = "simulation_only_ready";
    addReason(reasonCodes, "simulation_only_ready");
  } else {
    dryRunEnvelopeStatus = "dry_run_ready";
    addReason(reasonCodes, "dry_run_ready");
  }

  if (dryRunEnvelopeStatus === "simulation_only_ready" || dryRunEnvelopeStatus === "dry_run_ready") {
    addAllowedAction(allowedDryRunActions, "record_dry_run_request");
    addAllowedAction(allowedDryRunActions, "evaluate_readiness_snapshot");
    addAllowedAction(allowedDryRunActions, "simulate_provider_boundary");
    addAllowedAction(allowedDryRunActions, "simulate_allowlist_check");
    addAllowedAction(allowedDryRunActions, "simulate_kill_switch_check");
    addAllowedAction(allowedDryRunActions, "prepare_future_audit_event");
  }

  if (dryRunEnvelopeStatus === "blocked" && !prohibitedFindings.length) {
    dryRunEnvelopeStatus = "dry_run_rejected";
  }

  addAdvisory(advisoryFindings, "R48G dry-run envelope cannot authorize provider activation, live execution, or sending.");

  const result: R48ControlledActivationDryRunExecutionEnvelopeResult = {
    dryRunEnvelopeStatus,
    requestedActivationScenario: {
      scenarioId: safeText(input.scenario?.scenarioId),
      scenarioName: safeText(input.scenario?.scenarioName),
      requestedBy: safeText(input.scenario?.requestedBy),
      requestedScope: safeText(input.scenario?.requestedScope),
      simulationOnly: true,
    },
    readinessGateDecision: input.readinessGateDecision ?? "missing",
    allowedDryRunActions,
    prohibitedLiveActions,
    requiredOperatorReviewItems,
    futureAuditEventMetadata: {
      eventType: safeText(input.auditMetadata?.eventType),
      correlationId: safeText(input.auditMetadata?.correlationId),
      operatorId: safeText(input.auditMetadata?.operatorId),
      scenarioId: safeText(input.auditMetadata?.scenarioId),
      containsSecrets: false,
      metadataWriteAttempted: false,
    },
    providerBoundaryStatus: providerBoundaryIsSafe(input.providerBoundary) ? "safe_disabled" : "unsafe",
    killSwitchStatus: killSwitchIsSafe(input.killSwitch) ? "safe" : "unsafe",
    allowlistStatus: allowlistIsSafe(input.allowlist) ? "matched" : "missing_or_mismatch",
    finalSimulationOnlyOutcome:
      dryRunEnvelopeStatus === "planning_only"
        ? "planning_only"
        : dryRunEnvelopeStatus === "dry_run_ready" || dryRunEnvelopeStatus === "simulation_only_ready"
          ? "ready"
          : "rejected",
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    reasonCodes,
    prohibitedFindings,
    blockingFindings,
    advisoryFindings,
    forbiddenActivationConditions,
    summary: "R48G controlled activation dry-run execution envelope contract only.",
  };

  return {
    ...result,
    summary: summarizeR48ControlledActivationDryRunExecutionEnvelope(result),
  };
}
