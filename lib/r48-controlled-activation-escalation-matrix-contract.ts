export type R48ControlledActivationRiskState =
  | "blocked"
  | "prohibited"
  | "unsafe"
  | "elevated_risk"
  | "controlled_simulation_only"
  | "planning_only";

export type R48ControlledActivationEscalationAction =
  | "prohibit_activation"
  | "require_operator_review"
  | "require_safety_remediation"
  | "require_audit_readiness"
  | "require_static_smoke_pass"
  | "require_provider_boundary_review"
  | "continue_simulation_only"
  | "planning_only_no_execution";

export type R48ControlledActivationEscalationReasonCode =
  | "r48d_escalation_matrix_contract_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "risk_state_missing"
  | "risk_state_prohibited"
  | "risk_state_unsafe"
  | "risk_state_blocked"
  | "risk_state_elevated"
  | "risk_state_controlled_simulation_only"
  | "risk_state_planning_only"
  | "operator_review_required"
  | "safety_remediation_required"
  | "audit_readiness_required"
  | "static_smoke_pass_required"
  | "provider_boundary_review_required"
  | "simulation_only_continuation_required"
  | "planning_only_no_execution_required"
  | "forbidden_activation_condition_detected"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false";

export type R48ControlledActivationEscalationMatrixInput = {
  riskState?: R48ControlledActivationRiskState;
  operatorReviewRequired?: boolean;
  safetyRemediationRequired?: boolean;
  auditReadinessRequired?: boolean;
  staticSmokePassRequired?: boolean;
  providerBoundaryReviewRequired?: boolean;
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

export type R48ControlledActivationEscalationMatrixResult = {
  escalationActions: R48ControlledActivationEscalationAction[];
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  reasonCodes: string[];
  blockingFindings: string[];
  prohibitedFindings: string[];
  advisoryFindings: string[];
  forbiddenActivationConditions: string[];
  summary: string;
};

export type R48ControlledActivationEscalationMatrixInvariantCheck = {
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

const maxListItems = 60;
const maxTextLength = 180;
const maxSummaryLength = 600;

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length <= maxTextLength) return normalizedValue;

  return `${normalizedValue.slice(0, maxTextLength)}...`;
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

function addReason(reasonCodes: string[], reasonCode: R48ControlledActivationEscalationReasonCode) {
  addUniqueText(reasonCodes, reasonCode);
}

function addAction(actions: R48ControlledActivationEscalationAction[], action: R48ControlledActivationEscalationAction) {
  addUnique(actions, action);
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

function addBlocking(blockingFindings: string[], finding: string) {
  addUniqueText(blockingFindings, finding);
}

function addProhibited(prohibitedFindings: string[], finding: string) {
  addUniqueText(prohibitedFindings, finding);
}

function addAdvisory(advisoryFindings: string[], finding: string) {
  addUniqueText(advisoryFindings, finding);
}

export function assertR48ControlledActivationEscalationMatrixInvariants(
  result: Pick<
    R48ControlledActivationEscalationMatrixResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
  >,
): R48ControlledActivationEscalationMatrixInvariantCheck {
  const reasonCodes: R48ControlledActivationEscalationMatrixInvariantCheck["reasonCodes"] = [];

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

export function summarizeR48ControlledActivationEscalationMatrix(
  result: R48ControlledActivationEscalationMatrixResult,
) {
  const invariantCheck = assertR48ControlledActivationEscalationMatrixInvariants(result);

  return boundSummary(
    `R48D controlled activation escalation matrix selected ${result.escalationActions.length} governance actions. ` +
      `${result.prohibitedFindings.length} prohibited findings and ${result.blockingFindings.length} blocking findings are present. ` +
      `${result.forbiddenActivationConditions.length} forbidden activation conditions are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Escalation is advisory only; no provider activation, live execution, route execution, SMS/email send, DB write, env read, or automation activation is authorized.",
  );
}

export function createR48ControlledActivationEscalationMatrix(
  input: R48ControlledActivationEscalationMatrixInput = {},
): R48ControlledActivationEscalationMatrixResult {
  const escalationActions: R48ControlledActivationEscalationAction[] = [];
  const reasonCodes: string[] = [];
  const blockingFindings: string[] = [];
  const prohibitedFindings: string[] = [];
  const advisoryFindings: string[] = [];
  const forbiddenActivationConditions: string[] = [];

  addReason(reasonCodes, "r48d_escalation_matrix_contract_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectForbiddenActivationConditions(input.forbiddenActivationConditions, forbiddenActivationConditions);

  if (!input.riskState) {
    addReason(reasonCodes, "risk_state_missing");
    addAction(escalationActions, "prohibit_activation");
    addAction(escalationActions, "require_operator_review");
    addBlocking(blockingFindings, "Risk state is missing.");
  }

  if (input.activationExecuted === true) {
    addReason(reasonCodes, "activation_executed_must_be_false");
    addAction(escalationActions, "prohibit_activation");
    addProhibited(prohibitedFindings, "Input indicates activationExecuted:true.");
    addUniqueText(forbiddenActivationConditions, "activation_executed_true");
  }
  if (input.providerActivationAllowed === true) {
    addReason(reasonCodes, "provider_activation_allowed_must_be_false");
    addAction(escalationActions, "prohibit_activation");
    addAction(escalationActions, "require_provider_boundary_review");
    addProhibited(prohibitedFindings, "Input indicates providerActivationAllowed:true.");
    addUniqueText(forbiddenActivationConditions, "provider_activation_allowed_true");
  }
  if (input.liveExecutionAllowed === true) {
    addReason(reasonCodes, "live_execution_allowed_must_be_false");
    addAction(escalationActions, "prohibit_activation");
    addProhibited(prohibitedFindings, "Input indicates liveExecutionAllowed:true.");
    addUniqueText(forbiddenActivationConditions, "live_execution_allowed_true");
  }
  if (input.sent === true) {
    addReason(reasonCodes, "sent_must_be_false");
    addAction(escalationActions, "prohibit_activation");
    addProhibited(prohibitedFindings, "Input indicates sent:true.");
    addUniqueText(forbiddenActivationConditions, "sent_true");
  }
  if (input.providerCalled === true) {
    addReason(reasonCodes, "provider_called_must_be_false");
    addAction(escalationActions, "prohibit_activation");
    addAction(escalationActions, "require_provider_boundary_review");
    addProhibited(prohibitedFindings, "Input indicates providerCalled:true.");
    addUniqueText(forbiddenActivationConditions, "provider_called_true");
  }
  if (input.canSendNow === true) {
    addReason(reasonCodes, "can_send_now_must_be_false");
    addAction(escalationActions, "prohibit_activation");
    addProhibited(prohibitedFindings, "Input indicates canSendNow:true.");
    addUniqueText(forbiddenActivationConditions, "can_send_now_true");
  }
  if (input.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addAction(escalationActions, "prohibit_activation");
    addAction(escalationActions, "require_safety_remediation");
    addProhibited(prohibitedFindings, "Input is not simulation-only.");
  }
  if (input.liveTestReady === true) {
    addReason(reasonCodes, "live_test_ready_must_be_false");
    addAction(escalationActions, "prohibit_activation");
    addProhibited(prohibitedFindings, "Input indicates liveTestReady:true.");
    addUniqueText(forbiddenActivationConditions, "live_test_ready_true");
  }

  if (forbiddenActivationConditions.length > 0) {
    addReason(reasonCodes, "forbidden_activation_condition_detected");
    addAction(escalationActions, "prohibit_activation");
    addProhibited(prohibitedFindings, "One or more forbidden activation conditions are present.");
  }

  if (input.riskState === "prohibited") {
    addReason(reasonCodes, "risk_state_prohibited");
    addAction(escalationActions, "prohibit_activation");
    addProhibited(prohibitedFindings, "Risk state is prohibited.");
  }
  if (input.riskState === "unsafe") {
    addReason(reasonCodes, "risk_state_unsafe");
    addAction(escalationActions, "prohibit_activation");
    addAction(escalationActions, "require_safety_remediation");
    addProhibited(prohibitedFindings, "Risk state is unsafe.");
  }
  if (input.riskState === "blocked") {
    addReason(reasonCodes, "risk_state_blocked");
    addAction(escalationActions, "require_operator_review");
    addAction(escalationActions, "require_safety_remediation");
    addBlocking(blockingFindings, "Risk state is blocked.");
  }
  if (input.riskState === "elevated_risk") {
    addReason(reasonCodes, "risk_state_elevated");
    addAction(escalationActions, "require_operator_review");
    addAction(escalationActions, "require_audit_readiness");
    addAction(escalationActions, "continue_simulation_only");
    addBlocking(blockingFindings, "Risk state is elevated and cannot proceed to live readiness.");
  }
  if (input.riskState === "controlled_simulation_only") {
    addReason(reasonCodes, "risk_state_controlled_simulation_only");
    addAction(escalationActions, "continue_simulation_only");
    addAction(escalationActions, "planning_only_no_execution");
    addAdvisory(advisoryFindings, "Controlled simulation-only state remains non-executable.");
  }
  if (input.riskState === "planning_only") {
    addReason(reasonCodes, "risk_state_planning_only");
    addAction(escalationActions, "planning_only_no_execution");
    addAdvisory(advisoryFindings, "Planning-only state remains non-executable.");
  }

  if (input.operatorReviewRequired === true) {
    addReason(reasonCodes, "operator_review_required");
    addAction(escalationActions, "require_operator_review");
  }
  if (input.safetyRemediationRequired === true) {
    addReason(reasonCodes, "safety_remediation_required");
    addAction(escalationActions, "require_safety_remediation");
  }
  if (input.auditReadinessRequired === true) {
    addReason(reasonCodes, "audit_readiness_required");
    addAction(escalationActions, "require_audit_readiness");
  }
  if (input.staticSmokePassRequired === true) {
    addReason(reasonCodes, "static_smoke_pass_required");
    addAction(escalationActions, "require_static_smoke_pass");
  }
  if (input.providerBoundaryReviewRequired === true) {
    addReason(reasonCodes, "provider_boundary_review_required");
    addAction(escalationActions, "require_provider_boundary_review");
  }

  if (escalationActions.includes("continue_simulation_only")) {
    addReason(reasonCodes, "simulation_only_continuation_required");
  }
  if (escalationActions.includes("planning_only_no_execution")) {
    addReason(reasonCodes, "planning_only_no_execution_required");
  }

  const result: R48ControlledActivationEscalationMatrixResult = {
    escalationActions,
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    reasonCodes,
    blockingFindings,
    prohibitedFindings,
    advisoryFindings,
    forbiddenActivationConditions,
    summary: "R48D controlled activation escalation matrix contract only.",
  };

  return {
    ...result,
    summary: summarizeR48ControlledActivationEscalationMatrix(result),
  };
}
