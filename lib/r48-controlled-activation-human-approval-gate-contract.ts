export type R48HumanApprovalGateStatus =
  | "prohibited"
  | "blocked"
  | "requires_operator_approval"
  | "requires_compliance_review"
  | "requires_safety_review"
  | "simulation_only_approved"
  | "planning_only";

export type R48HumanApprovalRiskClassification =
  | "blocked"
  | "prohibited"
  | "unsafe"
  | "elevated_risk"
  | "controlled_simulation_only"
  | "planning_only";

export type R48HumanApprovalEscalationAction =
  | "prohibit_activation"
  | "require_operator_review"
  | "require_safety_remediation"
  | "require_audit_readiness"
  | "require_static_smoke_pass"
  | "require_provider_boundary_review"
  | "continue_simulation_only"
  | "planning_only_no_execution";

export type R48HumanApprovalGateReasonCode =
  | "r48e_human_approval_gate_contract_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "risk_classification_missing"
  | "risk_classification_prohibited"
  | "risk_classification_unsafe"
  | "risk_classification_blocked"
  | "risk_classification_elevated"
  | "escalation_prohibit_activation"
  | "operator_approval_missing"
  | "approval_timestamp_missing"
  | "approver_identity_missing"
  | "approval_scope_invalid"
  | "approval_expired"
  | "compliance_review_missing"
  | "dnc_review_missing"
  | "opt_out_review_missing"
  | "dnc_blocked"
  | "opt_out_blocked"
  | "kill_switch_unsafe"
  | "allowlist_missing_or_mismatch"
  | "provider_boundary_unsafe"
  | "audit_readiness_missing"
  | "audit_readiness_unsafe"
  | "static_smoke_missing"
  | "static_smoke_failed"
  | "forbidden_activation_condition_detected"
  | "simulation_only_approval_granted"
  | "planning_only_no_execution"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false";

export type R48HumanApprovalSignal = {
  approved?: boolean;
  approvedAt?: string | null;
  approverId?: string | null;
  scope?: string | null;
  expiresAt?: string | null;
  evaluatedAt?: string | null;
  expired?: boolean;
  reasonCodes?: string[];
};

export type R48HumanApprovalComplianceReviewSignal = {
  reviewed?: boolean;
  dncReviewed?: boolean;
  optOutReviewed?: boolean;
  dncBlocked?: boolean;
  optOutBlocked?: boolean;
  reasonCodes?: string[];
};

export type R48HumanApprovalKillSwitchSignal = {
  allowed?: boolean;
  killSwitchActive?: boolean;
  emergencyStopActive?: boolean;
  reasonCodes?: string[];
};

export type R48HumanApprovalAllowlistSignal = {
  allowed?: boolean;
  recipientMatched?: boolean;
  reasonCodes?: string[];
};

export type R48HumanApprovalProviderBoundarySignal = {
  ok?: boolean;
  providerDisabled?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  activationAllowed?: boolean;
  reasonCodes?: string[];
};

export type R48HumanApprovalAuditReadinessSignal = {
  ready?: boolean;
  persistenceExecuted?: boolean;
  dbWriteAttempted?: boolean;
  forbiddenFieldsDetected?: string[];
  reasonCodes?: string[];
};

export type R48HumanApprovalStaticSmokeSignal = {
  present?: boolean;
  passed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  reasonCodes?: string[];
};

export type R48ControlledActivationHumanApprovalGateInput = {
  riskClassification?: R48HumanApprovalRiskClassification;
  escalationActions?: R48HumanApprovalEscalationAction[];
  operatorApproval?: R48HumanApprovalSignal;
  requiredApprovalScope?: string;
  complianceReview?: R48HumanApprovalComplianceReviewSignal;
  killSwitch?: R48HumanApprovalKillSwitchSignal;
  allowlist?: R48HumanApprovalAllowlistSignal;
  providerBoundary?: R48HumanApprovalProviderBoundarySignal;
  auditReadiness?: R48HumanApprovalAuditReadinessSignal;
  staticSmoke?: R48HumanApprovalStaticSmokeSignal;
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

export type R48ControlledActivationHumanApprovalGateResult = {
  approvalGateStatus: R48HumanApprovalGateStatus;
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
  requiredHumanActions: string[];
  advisoryFindings: string[];
  forbiddenActivationConditions: string[];
  summary: string;
};

export type R48HumanApprovalGateInvariantCheck = {
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
const defaultRequiredApprovalScope = "controlled_live_test_simulation_only";

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

function addReason(reasonCodes: string[], reasonCode: R48HumanApprovalGateReasonCode) {
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

function addHumanAction(requiredHumanActions: string[], action: string) {
  addUnique(requiredHumanActions, action);
}

function addAdvisory(advisoryFindings: string[], finding: string) {
  addUnique(advisoryFindings, finding);
}

function approvalIsExpired(approval?: R48HumanApprovalSignal) {
  if (approval?.expired === true) return true;

  const expiresAt = normalizeText(approval?.expiresAt);
  const evaluatedAt = normalizeText(approval?.evaluatedAt);

  return Boolean(expiresAt && evaluatedAt && expiresAt <= evaluatedAt);
}

function killSwitchIsSafe(killSwitch?: R48HumanApprovalKillSwitchSignal) {
  return (
    killSwitch?.allowed === true &&
    killSwitch.killSwitchActive !== true &&
    killSwitch.emergencyStopActive !== true
  );
}

function allowlistIsSafe(allowlist?: R48HumanApprovalAllowlistSignal) {
  return allowlist?.allowed === true && allowlist.recipientMatched === true;
}

function providerBoundaryIsSafe(providerBoundary?: R48HumanApprovalProviderBoundarySignal) {
  return (
    providerBoundary?.ok === true &&
    providerBoundary.providerDisabled === true &&
    providerBoundary.providerCalled !== true &&
    providerBoundary.sent !== true &&
    providerBoundary.activationAllowed !== true
  );
}

function auditReadinessIsSafe(auditReadiness?: R48HumanApprovalAuditReadinessSignal) {
  return (
    auditReadiness?.ready === true &&
    auditReadiness.persistenceExecuted !== true &&
    auditReadiness.dbWriteAttempted !== true &&
    (auditReadiness.forbiddenFieldsDetected?.length ?? 0) === 0
  );
}

function staticSmokeIsSafe(staticSmoke?: R48HumanApprovalStaticSmokeSignal) {
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

export function assertR48ControlledActivationHumanApprovalGateInvariants(
  result: Pick<
    R48ControlledActivationHumanApprovalGateResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
  >,
): R48HumanApprovalGateInvariantCheck {
  const reasonCodes: R48HumanApprovalGateInvariantCheck["reasonCodes"] = [];

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

export function summarizeR48ControlledActivationHumanApprovalGate(
  result: R48ControlledActivationHumanApprovalGateResult,
) {
  const invariantCheck = assertR48ControlledActivationHumanApprovalGateInvariants(result);

  return boundSummary(
    `R48E controlled activation human approval gate is ${result.approvalGateStatus}. ` +
      `${result.prohibitedFindings.length} prohibited findings and ${result.blockingFindings.length} blocking findings are present. ` +
      `${result.requiredHumanActions.length} human actions remain. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Gate output is advisory only; no provider activation, live execution, route execution, SMS/email send, DB write, env read, or automation activation is authorized.",
  );
}

export function createR48ControlledActivationHumanApprovalGate(
  input: R48ControlledActivationHumanApprovalGateInput = {},
): R48ControlledActivationHumanApprovalGateResult {
  const reasonCodes: string[] = [];
  const prohibitedFindings: string[] = [];
  const blockingFindings: string[] = [];
  const requiredHumanActions: string[] = [];
  const advisoryFindings: string[] = [];
  const forbiddenActivationConditions: string[] = [];
  const escalationActions = input.escalationActions ?? [];
  const requiredScope = normalizeText(input.requiredApprovalScope) || defaultRequiredApprovalScope;

  addReason(reasonCodes, "r48e_human_approval_gate_contract_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.operatorApproval?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.complianceReview?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.killSwitch?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.allowlist?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.providerBoundary?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.auditReadiness?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.staticSmoke?.reasonCodes, reasonCodes);
  collectForbiddenActivationConditions(input.forbiddenActivationConditions, forbiddenActivationConditions);

  if (!input.riskClassification) {
    addReason(reasonCodes, "risk_classification_missing");
    addBlocking(blockingFindings, "R48C risk classification is missing.");
    addHumanAction(requiredHumanActions, "Classify activation risk before approval review.");
  }

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

  if (input.riskClassification === "prohibited") {
    addReason(reasonCodes, "risk_classification_prohibited");
    addProhibited(prohibitedFindings, "R48C risk classification is prohibited.");
  }
  if (input.riskClassification === "unsafe") {
    addReason(reasonCodes, "risk_classification_unsafe");
    addProhibited(prohibitedFindings, "R48C risk classification is unsafe.");
  }
  if (input.riskClassification === "blocked") {
    addReason(reasonCodes, "risk_classification_blocked");
    addBlocking(blockingFindings, "R48C risk classification is blocked.");
    addHumanAction(requiredHumanActions, "Resolve blocked activation risk before any approval.");
  }
  if (input.riskClassification === "elevated_risk") {
    addReason(reasonCodes, "risk_classification_elevated");
    addBlocking(blockingFindings, "R48C risk classification is elevated.");
    addHumanAction(requiredHumanActions, "Complete additional operator and compliance review for elevated risk.");
  }

  if (escalationActions.includes("prohibit_activation")) {
    addReason(reasonCodes, "escalation_prohibit_activation");
    addProhibited(prohibitedFindings, "R48D escalation requires prohibit_activation.");
  }

  if (!input.operatorApproval?.approved) {
    addReason(reasonCodes, "operator_approval_missing");
    addBlocking(blockingFindings, "Operator approval is missing.");
    addHumanAction(requiredHumanActions, "Capture explicit operator approval for the exact simulation-only scope.");
  }
  if (!normalizeText(input.operatorApproval?.approvedAt)) {
    addReason(reasonCodes, "approval_timestamp_missing");
    addBlocking(blockingFindings, "Approval timestamp is missing.");
  }
  if (!normalizeText(input.operatorApproval?.approverId)) {
    addReason(reasonCodes, "approver_identity_missing");
    addBlocking(blockingFindings, "Approver identity is missing.");
  }
  if (normalizeText(input.operatorApproval?.scope) !== requiredScope) {
    addReason(reasonCodes, "approval_scope_invalid");
    addBlocking(blockingFindings, "Approval scope is missing or does not match the required simulation-only scope.");
  }
  if (approvalIsExpired(input.operatorApproval)) {
    addReason(reasonCodes, "approval_expired");
    addBlocking(blockingFindings, "Operator approval is expired.");
    addHumanAction(requiredHumanActions, "Renew operator approval before continuing simulation-only planning.");
  }

  if (input.complianceReview?.reviewed !== true) {
    addReason(reasonCodes, "compliance_review_missing");
    addBlocking(blockingFindings, "Compliance review is missing.");
    addHumanAction(requiredHumanActions, "Complete compliance review before approval can pass.");
  }
  if (input.complianceReview?.dncReviewed !== true) {
    addReason(reasonCodes, "dnc_review_missing");
    addBlocking(blockingFindings, "DNC review is missing.");
  }
  if (input.complianceReview?.optOutReviewed !== true) {
    addReason(reasonCodes, "opt_out_review_missing");
    addBlocking(blockingFindings, "Opt-out review is missing.");
  }
  if (input.complianceReview?.dncBlocked === true) {
    addReason(reasonCodes, "dnc_blocked");
    addProhibited(prohibitedFindings, "Compliance review indicates DNC block.");
  }
  if (input.complianceReview?.optOutBlocked === true) {
    addReason(reasonCodes, "opt_out_blocked");
    addProhibited(prohibitedFindings, "Compliance review indicates opt-out block.");
  }

  if (!killSwitchIsSafe(input.killSwitch)) {
    addReason(reasonCodes, "kill_switch_unsafe");
    addProhibited(prohibitedFindings, "Kill-switch or emergency stop state is unsafe.");
  }
  if (!allowlistIsSafe(input.allowlist)) {
    addReason(reasonCodes, "allowlist_missing_or_mismatch");
    addBlocking(blockingFindings, "Allowlist approval is missing or mismatched.");
  }
  if (!providerBoundaryIsSafe(input.providerBoundary)) {
    addReason(reasonCodes, "provider_boundary_unsafe");
    addProhibited(prohibitedFindings, "Provider boundary is unsafe, enabled, missing, or indicates execution.");
  }
  if (!input.auditReadiness) {
    addReason(reasonCodes, "audit_readiness_missing");
    addBlocking(blockingFindings, "Audit readiness state is missing.");
  } else if (!auditReadinessIsSafe(input.auditReadiness)) {
    addReason(reasonCodes, "audit_readiness_unsafe");
    addBlocking(blockingFindings, "Audit readiness state is unsafe.");
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

  let approvalGateStatus: R48HumanApprovalGateStatus = "simulation_only_approved";

  if (prohibitedFindings.length > 0) {
    approvalGateStatus = "prohibited";
  } else if (
    reasonCodes.includes("compliance_review_missing") ||
    reasonCodes.includes("dnc_review_missing") ||
    reasonCodes.includes("opt_out_review_missing")
  ) {
    approvalGateStatus = "requires_compliance_review";
  } else if (
    reasonCodes.includes("audit_readiness_missing") ||
    reasonCodes.includes("audit_readiness_unsafe") ||
    reasonCodes.includes("static_smoke_missing") ||
    reasonCodes.includes("static_smoke_failed") ||
    input.riskClassification === "elevated_risk"
  ) {
    approvalGateStatus = "requires_safety_review";
  } else if (
    reasonCodes.includes("operator_approval_missing") ||
    reasonCodes.includes("approval_timestamp_missing") ||
    reasonCodes.includes("approver_identity_missing") ||
    reasonCodes.includes("approval_scope_invalid") ||
    reasonCodes.includes("approval_expired")
  ) {
    approvalGateStatus = "requires_operator_approval";
  } else if (blockingFindings.length > 0) {
    approvalGateStatus = "blocked";
  } else if (
    input.riskClassification === "planning_only" ||
    escalationActions.includes("planning_only_no_execution")
  ) {
    approvalGateStatus = "planning_only";
    addReason(reasonCodes, "planning_only_no_execution");
  } else {
    approvalGateStatus = "simulation_only_approved";
    addReason(reasonCodes, "simulation_only_approval_granted");
  }

  addAdvisory(advisoryFindings, "Human approval gate is advisory-only and cannot authorize live execution or provider activation.");

  const result: R48ControlledActivationHumanApprovalGateResult = {
    approvalGateStatus,
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
    requiredHumanActions,
    advisoryFindings,
    forbiddenActivationConditions,
    summary: "R48E controlled activation human approval gate contract only.",
  };

  return {
    ...result,
    summary: summarizeR48ControlledActivationHumanApprovalGate(result),
  };
}
