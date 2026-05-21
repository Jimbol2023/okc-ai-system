export type R48FinalReadinessGateDecision =
  | "prohibited"
  | "blocked"
  | "remediation_required"
  | "operator_review_required"
  | "simulation_only_ready"
  | "planning_only_ready";

export type R48FinalReadinessRiskClassification =
  | "blocked"
  | "prohibited"
  | "unsafe"
  | "elevated_risk"
  | "controlled_simulation_only"
  | "planning_only";

export type R48FinalReadinessEscalationAction =
  | "prohibit_activation"
  | "require_operator_review"
  | "require_safety_remediation"
  | "require_audit_readiness"
  | "require_static_smoke_pass"
  | "require_provider_boundary_review"
  | "continue_simulation_only"
  | "planning_only_no_execution";

export type R48FinalReadinessApprovalGateStatus =
  | "prohibited"
  | "blocked"
  | "requires_operator_approval"
  | "requires_compliance_review"
  | "requires_safety_review"
  | "simulation_only_approved"
  | "planning_only";

export type R48FinalReadinessReasonCode =
  | "r48f_final_readiness_gate_contract_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "activation_plan_missing"
  | "activation_plan_not_ready"
  | "prerequisite_checklist_missing"
  | "prerequisite_checklist_incomplete"
  | "risk_classification_missing"
  | "risk_classification_prohibited"
  | "risk_classification_unsafe"
  | "risk_classification_blocked"
  | "risk_classification_elevated"
  | "escalation_prohibit_activation"
  | "escalation_operator_review_required"
  | "escalation_safety_remediation_required"
  | "human_approval_missing"
  | "human_approval_prohibited"
  | "human_approval_blocked"
  | "human_approval_review_required"
  | "system_health_missing"
  | "system_health_failed"
  | "system_readiness_not_ready"
  | "provider_boundary_unsafe"
  | "kill_switch_unsafe"
  | "allowlist_missing_or_mismatch"
  | "audit_readiness_missing"
  | "audit_readiness_unsafe"
  | "static_smoke_missing"
  | "static_smoke_failed"
  | "forbidden_activation_condition_detected"
  | "simulation_only_final_ready"
  | "planning_only_final_ready"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false";

export type R48FinalReadinessPlanSignal = {
  exists?: boolean;
  ready?: boolean;
  simulationOnly?: boolean;
  reasonCodes?: string[];
};

export type R48FinalReadinessPrerequisiteChecklistSignal = {
  activationChecklistComplete?: boolean;
  reasonCodes?: string[];
};

export type R48FinalReadinessSystemHealthSignal = {
  database?: "ok" | "error";
  status?: "healthy" | "warning" | "critical";
  readinessReady?: boolean;
  reasonCodes?: string[];
};

export type R48FinalReadinessProviderBoundarySignal = {
  ok?: boolean;
  providerDisabled?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  activationAllowed?: boolean;
  reasonCodes?: string[];
};

export type R48FinalReadinessKillSwitchSignal = {
  allowed?: boolean;
  killSwitchActive?: boolean;
  emergencyStopActive?: boolean;
  reasonCodes?: string[];
};

export type R48FinalReadinessAllowlistSignal = {
  required?: boolean;
  allowed?: boolean;
  recipientMatched?: boolean;
  reasonCodes?: string[];
};

export type R48FinalReadinessAuditReadinessSignal = {
  ready?: boolean;
  persistenceExecuted?: boolean;
  dbWriteAttempted?: boolean;
  forbiddenFieldsDetected?: string[];
  reasonCodes?: string[];
};

export type R48FinalReadinessStaticSmokeSignal = {
  present?: boolean;
  passed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  reasonCodes?: string[];
};

export type R48ControlledActivationFinalReadinessGateInput = {
  activationPlan?: R48FinalReadinessPlanSignal;
  prerequisiteChecklist?: R48FinalReadinessPrerequisiteChecklistSignal;
  riskClassification?: R48FinalReadinessRiskClassification;
  escalationActions?: R48FinalReadinessEscalationAction[];
  humanApprovalGateStatus?: R48FinalReadinessApprovalGateStatus;
  systemHealth?: R48FinalReadinessSystemHealthSignal;
  providerBoundary?: R48FinalReadinessProviderBoundarySignal;
  killSwitch?: R48FinalReadinessKillSwitchSignal;
  allowlist?: R48FinalReadinessAllowlistSignal;
  auditReadiness?: R48FinalReadinessAuditReadinessSignal;
  staticSmoke?: R48FinalReadinessStaticSmokeSignal;
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

export type R48ControlledActivationFinalReadinessGateResult = {
  finalReadinessDecision: R48FinalReadinessGateDecision;
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
  remediationFindings: string[];
  operatorReviewFindings: string[];
  advisoryFindings: string[];
  forbiddenActivationConditions: string[];
  summary: string;
};

export type R48FinalReadinessGateInvariantCheck = {
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

function addUnique(list: string[], value: string) {
  const boundedValue = boundText(value);

  if (boundedValue && !list.includes(boundedValue) && list.length < maxListItems) {
    list.push(boundedValue);
  }
}

function addReason(reasonCodes: string[], reasonCode: R48FinalReadinessReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function collectExternalReasonCodes(reasonCodes: string[] | undefined, target: string[]) {
  for (const reasonCode of reasonCodes ?? []) {
    addUnique(target, reasonCode);
  }
}

function collectForbiddenActivationConditions(conditions: string[] | undefined, target: string[]) {
  for (const condition of conditions ?? []) {
    addUnique(target, condition);
  }
}

function addProhibited(prohibitedFindings: string[], finding: string) {
  addUnique(prohibitedFindings, finding);
}

function addBlocking(blockingFindings: string[], finding: string) {
  addUnique(blockingFindings, finding);
}

function addRemediation(remediationFindings: string[], finding: string) {
  addUnique(remediationFindings, finding);
}

function addOperatorReview(operatorReviewFindings: string[], finding: string) {
  addUnique(operatorReviewFindings, finding);
}

function addAdvisory(advisoryFindings: string[], finding: string) {
  addUnique(advisoryFindings, finding);
}

function activationPlanIsReady(activationPlan?: R48FinalReadinessPlanSignal) {
  return activationPlan?.exists === true && activationPlan.ready === true && activationPlan.simulationOnly === true;
}

function prerequisiteChecklistIsComplete(prerequisiteChecklist?: R48FinalReadinessPrerequisiteChecklistSignal) {
  return prerequisiteChecklist?.activationChecklistComplete === true;
}

function systemHealthIsSafe(systemHealth?: R48FinalReadinessSystemHealthSignal) {
  return (
    systemHealth?.database === "ok" &&
    systemHealth.status !== "critical" &&
    systemHealth.readinessReady !== false
  );
}

function providerBoundaryIsSafe(providerBoundary?: R48FinalReadinessProviderBoundarySignal) {
  return (
    providerBoundary?.ok === true &&
    providerBoundary.providerDisabled === true &&
    providerBoundary.providerCalled !== true &&
    providerBoundary.sent !== true &&
    providerBoundary.activationAllowed !== true
  );
}

function killSwitchIsSafe(killSwitch?: R48FinalReadinessKillSwitchSignal) {
  return (
    killSwitch?.allowed === true &&
    killSwitch.killSwitchActive !== true &&
    killSwitch.emergencyStopActive !== true
  );
}

function allowlistIsSafe(allowlist?: R48FinalReadinessAllowlistSignal) {
  return allowlist?.required === true && allowlist.allowed === true && allowlist.recipientMatched === true;
}

function auditReadinessIsSafe(auditReadiness?: R48FinalReadinessAuditReadinessSignal) {
  return (
    auditReadiness?.ready === true &&
    auditReadiness.persistenceExecuted !== true &&
    auditReadiness.dbWriteAttempted !== true &&
    (auditReadiness.forbiddenFieldsDetected?.length ?? 0) === 0
  );
}

function staticSmokeIsSafe(staticSmoke?: R48FinalReadinessStaticSmokeSignal) {
  return (
    staticSmoke?.present === true &&
    staticSmoke.passed === true &&
    staticSmoke.sent !== true &&
    staticSmoke.providerCalled !== true &&
    staticSmoke.canSendNow !== true &&
    staticSmoke.simulationOnly === true &&
    staticSmoke.liveTestReady !== true
  );
}

export function assertR48ControlledActivationFinalReadinessGateInvariants(
  result: Pick<
    R48ControlledActivationFinalReadinessGateResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
  >,
): R48FinalReadinessGateInvariantCheck {
  const reasonCodes: R48FinalReadinessGateInvariantCheck["reasonCodes"] = [];

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

export function summarizeR48ControlledActivationFinalReadinessGate(
  result: R48ControlledActivationFinalReadinessGateResult,
) {
  const invariantCheck = assertR48ControlledActivationFinalReadinessGateInvariants(result);

  return boundSummary(
    `R48F final readiness gate decision is ${result.finalReadinessDecision}. ` +
      `${result.prohibitedFindings.length} prohibited findings, ${result.blockingFindings.length} blocking findings, ` +
      `${result.remediationFindings.length} remediation findings, and ${result.operatorReviewFindings.length} operator review findings are present. ` +
      `${result.forbiddenActivationConditions.length} forbidden activation conditions are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Final gate output is advisory, planning-only, and simulation-only; no provider activation, live execution, route execution, SMS/email send, DB write, env read, or automation activation is authorized.",
  );
}

export function createR48ControlledActivationFinalReadinessGate(
  input: R48ControlledActivationFinalReadinessGateInput = {},
): R48ControlledActivationFinalReadinessGateResult {
  const reasonCodes: string[] = [];
  const prohibitedFindings: string[] = [];
  const blockingFindings: string[] = [];
  const remediationFindings: string[] = [];
  const operatorReviewFindings: string[] = [];
  const advisoryFindings: string[] = [];
  const forbiddenActivationConditions: string[] = [];
  const escalationActions = input.escalationActions ?? [];

  addReason(reasonCodes, "r48f_final_readiness_gate_contract_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.activationPlan?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.prerequisiteChecklist?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.systemHealth?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.providerBoundary?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.killSwitch?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.allowlist?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.auditReadiness?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.staticSmoke?.reasonCodes, reasonCodes);
  collectForbiddenActivationConditions(input.forbiddenActivationConditions, forbiddenActivationConditions);

  if (input.activationExecuted === true) {
    addReason(reasonCodes, "activation_executed_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates activationExecuted:true.");
    addUnique(forbiddenActivationConditions, "activation_executed_true");
  }
  if (input.providerActivationAllowed === true) {
    addReason(reasonCodes, "provider_activation_allowed_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates providerActivationAllowed:true.");
    addUnique(forbiddenActivationConditions, "provider_activation_allowed_true");
  }
  if (input.liveExecutionAllowed === true) {
    addReason(reasonCodes, "live_execution_allowed_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates liveExecutionAllowed:true.");
    addUnique(forbiddenActivationConditions, "live_execution_allowed_true");
  }
  if (input.sent === true) {
    addReason(reasonCodes, "sent_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates sent:true.");
    addUnique(forbiddenActivationConditions, "sent_true");
  }
  if (input.providerCalled === true) {
    addReason(reasonCodes, "provider_called_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates providerCalled:true.");
    addUnique(forbiddenActivationConditions, "provider_called_true");
  }
  if (input.canSendNow === true) {
    addReason(reasonCodes, "can_send_now_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates canSendNow:true.");
    addUnique(forbiddenActivationConditions, "can_send_now_true");
  }
  if (input.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addProhibited(prohibitedFindings, "Input is not simulation-only.");
  }
  if (input.liveTestReady === true) {
    addReason(reasonCodes, "live_test_ready_must_be_false");
    addProhibited(prohibitedFindings, "Input indicates liveTestReady:true.");
    addUnique(forbiddenActivationConditions, "live_test_ready_true");
  }

  if (!input.activationPlan) {
    addReason(reasonCodes, "activation_plan_missing");
    addBlocking(blockingFindings, "Activation plan signal is missing.");
  } else if (!activationPlanIsReady(input.activationPlan)) {
    addReason(reasonCodes, "activation_plan_not_ready");
    addBlocking(blockingFindings, "Activation plan is not ready or not simulation-only.");
  }

  if (!input.prerequisiteChecklist) {
    addReason(reasonCodes, "prerequisite_checklist_missing");
    addBlocking(blockingFindings, "Prerequisite checklist signal is missing.");
  } else if (!prerequisiteChecklistIsComplete(input.prerequisiteChecklist)) {
    addReason(reasonCodes, "prerequisite_checklist_incomplete");
    addBlocking(blockingFindings, "Prerequisite checklist is incomplete.");
  }

  if (!input.riskClassification) {
    addReason(reasonCodes, "risk_classification_missing");
    addBlocking(blockingFindings, "R48C risk classification is missing.");
  } else if (input.riskClassification === "prohibited") {
    addReason(reasonCodes, "risk_classification_prohibited");
    addProhibited(prohibitedFindings, "R48C risk classification is prohibited.");
  } else if (input.riskClassification === "unsafe") {
    addReason(reasonCodes, "risk_classification_unsafe");
    addProhibited(prohibitedFindings, "R48C risk classification is unsafe.");
  } else if (input.riskClassification === "blocked") {
    addReason(reasonCodes, "risk_classification_blocked");
    addBlocking(blockingFindings, "R48C risk classification is blocked.");
  } else if (input.riskClassification === "elevated_risk") {
    addReason(reasonCodes, "risk_classification_elevated");
    addRemediation(remediationFindings, "R48C risk classification is elevated.");
    addOperatorReview(operatorReviewFindings, "Elevated risk requires operator review before simulation-only readiness.");
  }

  if (escalationActions.includes("prohibit_activation")) {
    addReason(reasonCodes, "escalation_prohibit_activation");
    addProhibited(prohibitedFindings, "R48D escalation includes prohibit_activation.");
  }
  if (escalationActions.includes("require_operator_review")) {
    addReason(reasonCodes, "escalation_operator_review_required");
    addOperatorReview(operatorReviewFindings, "R48D escalation requires operator review.");
  }
  if (escalationActions.includes("require_safety_remediation")) {
    addReason(reasonCodes, "escalation_safety_remediation_required");
    addRemediation(remediationFindings, "R48D escalation requires safety remediation.");
  }

  if (!input.humanApprovalGateStatus) {
    addReason(reasonCodes, "human_approval_missing");
    addOperatorReview(operatorReviewFindings, "R48E human approval gate result is missing.");
  } else if (input.humanApprovalGateStatus === "prohibited") {
    addReason(reasonCodes, "human_approval_prohibited");
    addProhibited(prohibitedFindings, "R48E human approval gate is prohibited.");
  } else if (input.humanApprovalGateStatus === "blocked") {
    addReason(reasonCodes, "human_approval_blocked");
    addBlocking(blockingFindings, "R48E human approval gate is blocked.");
  } else if (
    input.humanApprovalGateStatus === "requires_operator_approval" ||
    input.humanApprovalGateStatus === "requires_compliance_review" ||
    input.humanApprovalGateStatus === "requires_safety_review"
  ) {
    addReason(reasonCodes, "human_approval_review_required");
    addOperatorReview(operatorReviewFindings, "R48E human approval gate requires additional review.");
  }

  if (!input.systemHealth) {
    addReason(reasonCodes, "system_health_missing");
    addBlocking(blockingFindings, "System health signal is missing.");
  } else if (!systemHealthIsSafe(input.systemHealth)) {
    addReason(reasonCodes, "system_health_failed");
    addBlocking(blockingFindings, "System health is failed, critical, or explicitly not ready.");
  }
  if (input.systemHealth?.readinessReady === false) {
    addReason(reasonCodes, "system_readiness_not_ready");
    addBlocking(blockingFindings, "System readiness reports not ready.");
  }

  if (!providerBoundaryIsSafe(input.providerBoundary)) {
    addReason(reasonCodes, "provider_boundary_unsafe");
    addProhibited(prohibitedFindings, "Provider boundary is unsafe, enabled, missing, or indicates execution.");
  }
  if (!killSwitchIsSafe(input.killSwitch)) {
    addReason(reasonCodes, "kill_switch_unsafe");
    addProhibited(prohibitedFindings, "Kill-switch or emergency stop state is unsafe.");
  }
  if (!allowlistIsSafe(input.allowlist)) {
    addReason(reasonCodes, "allowlist_missing_or_mismatch");
    addBlocking(blockingFindings, "Allowlist state is missing or mismatched.");
  }
  if (!input.auditReadiness) {
    addReason(reasonCodes, "audit_readiness_missing");
    addBlocking(blockingFindings, "Audit readiness signal is missing.");
  } else if (!auditReadinessIsSafe(input.auditReadiness)) {
    addReason(reasonCodes, "audit_readiness_unsafe");
    addBlocking(blockingFindings, "Audit readiness is unsafe.");
  }
  if (!input.staticSmoke) {
    addReason(reasonCodes, "static_smoke_missing");
    addBlocking(blockingFindings, "Static smoke status is missing.");
  } else if (!staticSmokeIsSafe(input.staticSmoke)) {
    addReason(reasonCodes, "static_smoke_failed");
    addBlocking(blockingFindings, "Static smoke status failed or contains execution signals.");
  }

  if (forbiddenActivationConditions.length > 0) {
    addReason(reasonCodes, "forbidden_activation_condition_detected");
    addProhibited(prohibitedFindings, "One or more forbidden activation conditions are present.");
  }

  let finalReadinessDecision: R48FinalReadinessGateDecision = "simulation_only_ready";

  if (prohibitedFindings.length > 0) {
    finalReadinessDecision = "prohibited";
  } else if (blockingFindings.length > 0) {
    finalReadinessDecision = "blocked";
  } else if (remediationFindings.length > 0) {
    finalReadinessDecision = "remediation_required";
  } else if (operatorReviewFindings.length > 0) {
    finalReadinessDecision = "operator_review_required";
  } else if (
    input.riskClassification === "planning_only" ||
    input.humanApprovalGateStatus === "planning_only" ||
    escalationActions.includes("planning_only_no_execution")
  ) {
    finalReadinessDecision = "planning_only_ready";
    addReason(reasonCodes, "planning_only_final_ready");
  } else {
    finalReadinessDecision = "simulation_only_ready";
    addReason(reasonCodes, "simulation_only_final_ready");
  }

  addAdvisory(advisoryFindings, "R48F final readiness gate is advisory-only and cannot authorize live execution.");

  const result: R48ControlledActivationFinalReadinessGateResult = {
    finalReadinessDecision,
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
    remediationFindings,
    operatorReviewFindings,
    advisoryFindings,
    forbiddenActivationConditions,
    summary: "R48F controlled activation final readiness gate contract only.",
  };

  return {
    ...result,
    summary: summarizeR48ControlledActivationFinalReadinessGate(result),
  };
}
