export type R48GovernanceConclusion =
  | "activation_prohibited"
  | "activation_blocked"
  | "remediation_required"
  | "operator_review_required"
  | "simulation_only_governed"
  | "planning_only_complete";

export type R48GovernanceReasonCode =
  | "r48j_governance_summary_contract_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "persistence_not_allowed_now"
  | "activation_plan_missing"
  | "activation_plan_blocked"
  | "prerequisite_checklist_missing"
  | "prerequisite_checklist_incomplete"
  | "risk_classification_missing"
  | "risk_classification_prohibited"
  | "risk_classification_blocked"
  | "risk_classification_elevated"
  | "escalation_prohibited"
  | "escalation_blocked"
  | "approval_missing"
  | "approval_prohibited"
  | "approval_blocked"
  | "approval_review_required"
  | "final_readiness_missing"
  | "final_readiness_prohibited"
  | "final_readiness_blocked"
  | "final_readiness_remediation_required"
  | "final_readiness_operator_review_required"
  | "dry_run_missing"
  | "dry_run_prohibited"
  | "dry_run_blocked"
  | "dry_run_rejected"
  | "audit_event_missing"
  | "audit_event_prohibited"
  | "audit_event_blocked"
  | "audit_event_rejected"
  | "audit_persistence_missing"
  | "audit_persistence_not_persistable"
  | "audit_persistence_blocked"
  | "system_health_missing"
  | "system_health_unsafe"
  | "system_readiness_not_ready"
  | "operator_action_required"
  | "simulation_only_governance_complete"
  | "planning_only_governance_complete"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false";

export type R48GovernanceActivationPlanStatus = "ready" | "missing" | "blocked";
export type R48GovernanceChecklistStatus = "complete" | "missing" | "incomplete";
export type R48GovernanceRiskClassification =
  | "blocked"
  | "prohibited"
  | "unsafe"
  | "elevated_risk"
  | "controlled_simulation_only"
  | "planning_only";
export type R48GovernanceEscalationResult =
  | "prohibit_activation"
  | "require_operator_review"
  | "require_safety_remediation"
  | "require_audit_readiness"
  | "require_static_smoke_pass"
  | "require_provider_boundary_review"
  | "continue_simulation_only"
  | "planning_only_no_execution";
export type R48GovernanceApprovalStatus =
  | "prohibited"
  | "blocked"
  | "requires_operator_approval"
  | "requires_compliance_review"
  | "requires_safety_review"
  | "simulation_only_approved"
  | "planning_only";
export type R48GovernanceReadinessDecision =
  | "prohibited"
  | "blocked"
  | "remediation_required"
  | "operator_review_required"
  | "simulation_only_ready"
  | "planning_only_ready";
export type R48GovernanceDryRunStatus =
  | "prohibited"
  | "blocked"
  | "dry_run_rejected"
  | "dry_run_ready"
  | "simulation_only_ready"
  | "planning_only";
export type R48GovernanceAuditEventStatus =
  | "prohibited"
  | "blocked"
  | "rejected"
  | "recorded_simulation_only"
  | "recorded_planning_only";
export type R48GovernanceAuditPersistenceStatus =
  | "not_persistable"
  | "persistence_blocked"
  | "persistence_ready_for_review"
  | "persistence_plan_ready"
  | "simulation_only_persistence_recommended";

export type R48GovernanceSystemHealthSignal = {
  database?: "ok" | "error";
  status?: "healthy" | "warning" | "critical";
  readinessReady?: boolean;
  reasonCodes?: string[];
};

export type R48ControlledActivationGovernanceSummaryInput = {
  activationPlanStatus?: R48GovernanceActivationPlanStatus;
  prerequisiteChecklistStatus?: R48GovernanceChecklistStatus;
  riskClassification?: R48GovernanceRiskClassification;
  escalationActions?: R48GovernanceEscalationResult[];
  humanApprovalGateStatus?: R48GovernanceApprovalStatus;
  finalReadinessGateResult?: R48GovernanceReadinessDecision;
  dryRunExecutionEnvelopeResult?: R48GovernanceDryRunStatus;
  auditEventResult?: R48GovernanceAuditEventStatus;
  auditPersistencePlanResult?: R48GovernanceAuditPersistenceStatus;
  systemHealth?: R48GovernanceSystemHealthSignal;
  remainingBlockers?: string[];
  requiredOperatorActions?: string[];
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
  reasonCodes?: string[];
};

export type R48ControlledActivationGovernanceSummaryResult = {
  finalGovernanceConclusion: R48GovernanceConclusion;
  activationPlanStatus: R48GovernanceActivationPlanStatus | "missing";
  prerequisiteChecklistStatus: R48GovernanceChecklistStatus | "missing";
  riskClassification: R48GovernanceRiskClassification | "missing";
  escalationMatrixResult: R48GovernanceEscalationResult[];
  humanApprovalGateResult: R48GovernanceApprovalStatus | "missing";
  finalReadinessGateResult: R48GovernanceReadinessDecision | "missing";
  dryRunExecutionEnvelopeResult: R48GovernanceDryRunStatus | "missing";
  auditEventResult: R48GovernanceAuditEventStatus | "missing";
  auditPersistencePlanResult: R48GovernanceAuditPersistenceStatus | "missing";
  systemHealthStatus: "healthy" | "warning" | "critical" | "missing";
  remainingBlockers: string[];
  requiredOperatorActions: string[];
  reasonCodes: string[];
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  persistenceAllowedNow: false;
  advisoryFindings: string[];
  summary: string;
};

export type R48GovernanceSummaryInvariantCheck = {
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
    | "persistence_not_allowed_now"
  >;
};

const maxListItems = 80;
const maxTextLength = 180;
const maxSummaryLength = 800;

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

function addReason(reasonCodes: string[], reasonCode: R48GovernanceReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function collectExternalReasonCodes(reasonCodes: string[] | undefined, target: string[]) {
  for (const reasonCode of reasonCodes ?? []) {
    addUnique(target, reasonCode);
  }
}

function collectText(values: string[] | undefined, target: string[]) {
  for (const value of values ?? []) {
    addUnique(target, value);
  }
}

function systemHealthIsSafe(systemHealth?: R48GovernanceSystemHealthSignal) {
  return (
    systemHealth?.database === "ok" &&
    systemHealth.status !== "critical" &&
    systemHealth.readinessReady !== false
  );
}

export function assertR48ControlledActivationGovernanceSummaryInvariants(
  result: Pick<
    R48ControlledActivationGovernanceSummaryResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
    | "persistenceAllowedNow"
  >,
): R48GovernanceSummaryInvariantCheck {
  const reasonCodes: R48GovernanceSummaryInvariantCheck["reasonCodes"] = [];

  if (result.activationExecuted !== false) reasonCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) reasonCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) reasonCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) reasonCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) reasonCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) reasonCodes.push("can_send_now_must_be_false");
  if (result.simulationOnly !== true) reasonCodes.push("simulation_only_required");
  if (result.liveTestReady !== false) reasonCodes.push("live_test_ready_must_be_false");
  if (result.persistenceAllowedNow !== false) reasonCodes.push("persistence_not_allowed_now");

  return {
    passed: reasonCodes.length === 0,
    reasonCodes,
  };
}

export function summarizeR48ControlledActivationGovernanceSummary(
  result: R48ControlledActivationGovernanceSummaryResult,
) {
  const invariantCheck = assertR48ControlledActivationGovernanceSummaryInvariants(result);

  return boundSummary(
    `R48J governance conclusion is ${result.finalGovernanceConclusion}. ` +
      `${result.remainingBlockers.length} blockers and ${result.requiredOperatorActions.length} operator actions remain. ` +
      `Risk is ${result.riskClassification}; readiness is ${result.finalReadinessGateResult}; dry-run is ${result.dryRunExecutionEnvelopeResult}. ` +
      `Persistence allowed now: ${result.persistenceAllowedNow}. Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Summary is advisory-only and cannot authorize live execution, provider activation, sending, persistence, route execution, env reads, network calls, or automation.",
  );
}

export function createR48ControlledActivationGovernanceSummary(
  input: R48ControlledActivationGovernanceSummaryInput = {},
): R48ControlledActivationGovernanceSummaryResult {
  const reasonCodes: string[] = [];
  const remainingBlockers: string[] = [];
  const requiredOperatorActions: string[] = [];
  const advisoryFindings: string[] = [];
  const escalationActions = input.escalationActions ?? [];

  addReason(reasonCodes, "r48j_governance_summary_contract_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  addReason(reasonCodes, "persistence_not_allowed_now");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.systemHealth?.reasonCodes, reasonCodes);
  collectText(input.remainingBlockers, remainingBlockers);
  collectText(input.requiredOperatorActions, requiredOperatorActions);

  if (input.activationExecuted === true) {
    addReason(reasonCodes, "activation_executed_must_be_false");
    addUnique(remainingBlockers, "Input indicates activationExecuted:true.");
  }
  if (input.providerActivationAllowed === true) {
    addReason(reasonCodes, "provider_activation_allowed_must_be_false");
    addUnique(remainingBlockers, "Input indicates providerActivationAllowed:true.");
  }
  if (input.liveExecutionAllowed === true) {
    addReason(reasonCodes, "live_execution_allowed_must_be_false");
    addUnique(remainingBlockers, "Input indicates liveExecutionAllowed:true.");
  }
  if (input.sent === true) {
    addReason(reasonCodes, "sent_must_be_false");
    addUnique(remainingBlockers, "Input indicates sent:true.");
  }
  if (input.providerCalled === true) {
    addReason(reasonCodes, "provider_called_must_be_false");
    addUnique(remainingBlockers, "Input indicates providerCalled:true.");
  }
  if (input.canSendNow === true) {
    addReason(reasonCodes, "can_send_now_must_be_false");
    addUnique(remainingBlockers, "Input indicates canSendNow:true.");
  }
  if (input.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addUnique(remainingBlockers, "Input is not simulation-only.");
  }
  if (input.liveTestReady === true) {
    addReason(reasonCodes, "live_test_ready_must_be_false");
    addUnique(remainingBlockers, "Input indicates liveTestReady:true.");
  }
  if (input.persistenceAllowedNow === true) {
    addReason(reasonCodes, "persistence_not_allowed_now");
    addUnique(remainingBlockers, "Input indicates persistenceAllowedNow:true.");
  }

  if (!input.activationPlanStatus) {
    addReason(reasonCodes, "activation_plan_missing");
    addUnique(remainingBlockers, "Activation plan status is missing.");
  } else if (input.activationPlanStatus !== "ready") {
    addReason(reasonCodes, "activation_plan_blocked");
    addUnique(remainingBlockers, "Activation plan is not ready.");
  }

  if (!input.prerequisiteChecklistStatus) {
    addReason(reasonCodes, "prerequisite_checklist_missing");
    addUnique(remainingBlockers, "Prerequisite checklist status is missing.");
  } else if (input.prerequisiteChecklistStatus !== "complete") {
    addReason(reasonCodes, "prerequisite_checklist_incomplete");
    addUnique(remainingBlockers, "Prerequisite checklist is incomplete.");
  }

  if (!input.riskClassification) {
    addReason(reasonCodes, "risk_classification_missing");
    addUnique(remainingBlockers, "Risk classification is missing.");
  } else if (input.riskClassification === "prohibited" || input.riskClassification === "unsafe") {
    addReason(reasonCodes, "risk_classification_prohibited");
    addUnique(remainingBlockers, "Risk classification prohibits activation.");
  } else if (input.riskClassification === "blocked") {
    addReason(reasonCodes, "risk_classification_blocked");
    addUnique(remainingBlockers, "Risk classification is blocked.");
  } else if (input.riskClassification === "elevated_risk") {
    addReason(reasonCodes, "risk_classification_elevated");
    addUnique(remainingBlockers, "Risk classification requires remediation.");
  }

  if (escalationActions.includes("prohibit_activation")) {
    addReason(reasonCodes, "escalation_prohibited");
    addUnique(remainingBlockers, "Escalation matrix prohibits activation.");
  }
  if (
    escalationActions.includes("require_safety_remediation") ||
    escalationActions.includes("require_audit_readiness") ||
    escalationActions.includes("require_static_smoke_pass") ||
    escalationActions.includes("require_provider_boundary_review")
  ) {
    addReason(reasonCodes, "escalation_blocked");
    addUnique(remainingBlockers, "Escalation matrix requires remediation before governance can complete.");
  }
  if (escalationActions.includes("require_operator_review")) {
    addReason(reasonCodes, "operator_action_required");
    addUnique(requiredOperatorActions, "Complete escalation operator review.");
  }

  if (!input.humanApprovalGateStatus) {
    addReason(reasonCodes, "approval_missing");
    addUnique(requiredOperatorActions, "Provide human approval gate result.");
  } else if (input.humanApprovalGateStatus === "prohibited") {
    addReason(reasonCodes, "approval_prohibited");
    addUnique(remainingBlockers, "Human approval gate prohibits activation.");
  } else if (input.humanApprovalGateStatus === "blocked") {
    addReason(reasonCodes, "approval_blocked");
    addUnique(remainingBlockers, "Human approval gate is blocked.");
  } else if (
    input.humanApprovalGateStatus === "requires_operator_approval" ||
    input.humanApprovalGateStatus === "requires_compliance_review" ||
    input.humanApprovalGateStatus === "requires_safety_review"
  ) {
    addReason(reasonCodes, "approval_review_required");
    addUnique(requiredOperatorActions, "Complete remaining human approval review.");
  }

  if (!input.finalReadinessGateResult) {
    addReason(reasonCodes, "final_readiness_missing");
    addUnique(remainingBlockers, "Final readiness gate result is missing.");
  } else if (input.finalReadinessGateResult === "prohibited") {
    addReason(reasonCodes, "final_readiness_prohibited");
    addUnique(remainingBlockers, "Final readiness gate prohibits activation.");
  } else if (input.finalReadinessGateResult === "blocked") {
    addReason(reasonCodes, "final_readiness_blocked");
    addUnique(remainingBlockers, "Final readiness gate is blocked.");
  } else if (input.finalReadinessGateResult === "remediation_required") {
    addReason(reasonCodes, "final_readiness_remediation_required");
    addUnique(remainingBlockers, "Final readiness gate requires remediation.");
  } else if (input.finalReadinessGateResult === "operator_review_required") {
    addReason(reasonCodes, "final_readiness_operator_review_required");
    addUnique(requiredOperatorActions, "Complete final readiness operator review.");
  }

  if (!input.dryRunExecutionEnvelopeResult) {
    addReason(reasonCodes, "dry_run_missing");
    addUnique(remainingBlockers, "Dry-run execution envelope result is missing.");
  } else if (input.dryRunExecutionEnvelopeResult === "prohibited") {
    addReason(reasonCodes, "dry_run_prohibited");
    addUnique(remainingBlockers, "Dry-run execution envelope is prohibited.");
  } else if (input.dryRunExecutionEnvelopeResult === "blocked") {
    addReason(reasonCodes, "dry_run_blocked");
    addUnique(remainingBlockers, "Dry-run execution envelope is blocked.");
  } else if (input.dryRunExecutionEnvelopeResult === "dry_run_rejected") {
    addReason(reasonCodes, "dry_run_rejected");
    addUnique(remainingBlockers, "Dry-run execution envelope rejected the dry-run.");
  }

  if (!input.auditEventResult) {
    addReason(reasonCodes, "audit_event_missing");
    addUnique(remainingBlockers, "Audit event result is missing.");
  } else if (input.auditEventResult === "prohibited") {
    addReason(reasonCodes, "audit_event_prohibited");
    addUnique(remainingBlockers, "Audit event is prohibited.");
  } else if (input.auditEventResult === "blocked") {
    addReason(reasonCodes, "audit_event_blocked");
    addUnique(remainingBlockers, "Audit event is blocked.");
  } else if (input.auditEventResult === "rejected") {
    addReason(reasonCodes, "audit_event_rejected");
    addUnique(remainingBlockers, "Audit event is rejected.");
  }

  if (!input.auditPersistencePlanResult) {
    addReason(reasonCodes, "audit_persistence_missing");
    addUnique(remainingBlockers, "Audit persistence plan result is missing.");
  } else if (input.auditPersistencePlanResult === "not_persistable") {
    addReason(reasonCodes, "audit_persistence_not_persistable");
    addUnique(remainingBlockers, "Audit persistence plan is not persistable.");
  } else if (input.auditPersistencePlanResult === "persistence_blocked") {
    addReason(reasonCodes, "audit_persistence_blocked");
    addUnique(remainingBlockers, "Audit persistence plan is blocked.");
  }

  if (!input.systemHealth) {
    addReason(reasonCodes, "system_health_missing");
    addUnique(remainingBlockers, "System health is missing.");
  } else if (!systemHealthIsSafe(input.systemHealth)) {
    addReason(reasonCodes, "system_health_unsafe");
    addUnique(remainingBlockers, "System health is unsafe.");
  }
  if (input.systemHealth?.readinessReady === false) {
    addReason(reasonCodes, "system_readiness_not_ready");
    addUnique(remainingBlockers, "System readiness is not ready.");
  }

  let finalGovernanceConclusion: R48GovernanceConclusion = "simulation_only_governed";

  if (
    reasonCodes.includes("activation_executed_must_be_false") ||
    reasonCodes.includes("provider_activation_allowed_must_be_false") ||
    reasonCodes.includes("live_execution_allowed_must_be_false") ||
    reasonCodes.includes("sent_must_be_false") ||
    reasonCodes.includes("provider_called_must_be_false") ||
    reasonCodes.includes("can_send_now_must_be_false") ||
    reasonCodes.includes("risk_classification_prohibited") ||
    reasonCodes.includes("escalation_prohibited") ||
    reasonCodes.includes("approval_prohibited") ||
    reasonCodes.includes("final_readiness_prohibited") ||
    reasonCodes.includes("dry_run_prohibited") ||
    reasonCodes.includes("audit_event_prohibited")
  ) {
    finalGovernanceConclusion = "activation_prohibited";
  } else if (
    reasonCodes.includes("risk_classification_elevated") ||
    reasonCodes.includes("escalation_blocked") ||
    reasonCodes.includes("final_readiness_remediation_required") ||
    reasonCodes.includes("system_health_unsafe") ||
    reasonCodes.includes("system_readiness_not_ready")
  ) {
    finalGovernanceConclusion = "remediation_required";
  } else if (remainingBlockers.length > 0) {
    finalGovernanceConclusion = "activation_blocked";
  } else if (requiredOperatorActions.length > 0) {
    finalGovernanceConclusion = "operator_review_required";
  } else if (
    input.riskClassification === "planning_only" ||
    input.finalReadinessGateResult === "planning_only_ready" ||
    input.dryRunExecutionEnvelopeResult === "planning_only" ||
    input.auditEventResult === "recorded_planning_only"
  ) {
    finalGovernanceConclusion = "planning_only_complete";
    addReason(reasonCodes, "planning_only_governance_complete");
  } else {
    finalGovernanceConclusion = "simulation_only_governed";
    addReason(reasonCodes, "simulation_only_governance_complete");
  }

  addUnique(advisoryFindings, "R48J is summary-only and cannot authorize activation, sending, provider calls, or persistence.");

  const result: R48ControlledActivationGovernanceSummaryResult = {
    finalGovernanceConclusion,
    activationPlanStatus: input.activationPlanStatus ?? "missing",
    prerequisiteChecklistStatus: input.prerequisiteChecklistStatus ?? "missing",
    riskClassification: input.riskClassification ?? "missing",
    escalationMatrixResult: escalationActions,
    humanApprovalGateResult: input.humanApprovalGateStatus ?? "missing",
    finalReadinessGateResult: input.finalReadinessGateResult ?? "missing",
    dryRunExecutionEnvelopeResult: input.dryRunExecutionEnvelopeResult ?? "missing",
    auditEventResult: input.auditEventResult ?? "missing",
    auditPersistencePlanResult: input.auditPersistencePlanResult ?? "missing",
    systemHealthStatus: input.systemHealth?.status ?? "missing",
    remainingBlockers,
    requiredOperatorActions,
    reasonCodes,
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    persistenceAllowedNow: false,
    advisoryFindings,
    summary: "R48J controlled activation governance summary contract only.",
  };

  return {
    ...result,
    summary: summarizeR48ControlledActivationGovernanceSummary(result),
  };
}
