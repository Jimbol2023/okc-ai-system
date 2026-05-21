export type R48FinalStackReviewOutcome =
  | "stack_incomplete"
  | "activation_prohibited"
  | "remediation_required"
  | "operator_review_required"
  | "simulation_stack_complete"
  | "planning_stack_complete";

export type R48StackLayerStatus = "complete" | "missing" | "blocked" | "prohibited" | "review_required";

export type R48StackGovernanceConclusion =
  | "activation_prohibited"
  | "activation_blocked"
  | "remediation_required"
  | "operator_review_required"
  | "simulation_only_governed"
  | "planning_only_complete";

export type R48FinalStackReviewReasonCode =
  | "r48k_final_stack_review_contract_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "persistence_not_allowed_now"
  | "r48a_activation_plan_missing"
  | "r48b_prerequisite_checklist_missing"
  | "r48c_risk_classification_missing"
  | "r48d_escalation_matrix_missing"
  | "r48e_human_approval_gate_missing"
  | "r48f_final_readiness_gate_missing"
  | "r48g_dry_run_envelope_missing"
  | "r48h_audit_event_missing"
  | "r48i_audit_persistence_plan_missing"
  | "r48j_governance_summary_missing"
  | "child_layer_incomplete"
  | "child_layer_prohibited"
  | "governance_summary_prohibited"
  | "governance_summary_blocked"
  | "governance_summary_remediation_required"
  | "operator_review_required"
  | "system_health_missing"
  | "system_health_unsafe"
  | "staging_db_readiness_missing"
  | "staging_db_readiness_unsafe"
  | "remaining_blockers_present"
  | "simulation_stack_complete"
  | "planning_stack_complete"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false";

export type R48FinalStackSystemHealthSignal = {
  database?: "ok" | "error";
  status?: "healthy" | "warning" | "critical";
  readinessReady?: boolean;
  reasonCodes?: string[];
};

export type R48FinalStackStagingDbReadinessSignal = {
  connected?: boolean;
  migrationsApplied?: boolean;
  tablesReady?: boolean;
  schemaMismatchDetected?: boolean;
  reasonCodes?: string[];
};

export type R48FinalControlledActivationStackReviewInput = {
  r48aActivationPlan?: R48StackLayerStatus;
  r48bPrerequisiteChecklist?: R48StackLayerStatus;
  r48cRiskClassification?: R48StackLayerStatus;
  r48dEscalationMatrix?: R48StackLayerStatus;
  r48eHumanApprovalGate?: R48StackLayerStatus;
  r48fFinalReadinessGate?: R48StackLayerStatus;
  r48gDryRunExecutionEnvelope?: R48StackLayerStatus;
  r48hAuditEventContract?: R48StackLayerStatus;
  r48iAuditPersistencePlan?: R48StackLayerStatus;
  r48jGovernanceSummary?: R48StackLayerStatus;
  governanceConclusion?: R48StackGovernanceConclusion;
  systemHealth?: R48FinalStackSystemHealthSignal;
  stagingDbReadiness?: R48FinalStackStagingDbReadinessSignal;
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

export type R48FinalControlledActivationStackReviewResult = {
  finalStackReviewOutcome: R48FinalStackReviewOutcome;
  finalCompletionRecommendation: string;
  r48aActivationPlan: R48StackLayerStatus | "missing";
  r48bPrerequisiteChecklist: R48StackLayerStatus | "missing";
  r48cRiskClassification: R48StackLayerStatus | "missing";
  r48dEscalationMatrix: R48StackLayerStatus | "missing";
  r48eHumanApprovalGate: R48StackLayerStatus | "missing";
  r48fFinalReadinessGate: R48StackLayerStatus | "missing";
  r48gDryRunExecutionEnvelope: R48StackLayerStatus | "missing";
  r48hAuditEventContract: R48StackLayerStatus | "missing";
  r48iAuditPersistencePlan: R48StackLayerStatus | "missing";
  r48jGovernanceSummary: R48StackLayerStatus | "missing";
  governanceConclusion: R48StackGovernanceConclusion | "missing";
  systemHealthStatus: "healthy" | "warning" | "critical" | "missing";
  stagingDbReady: boolean;
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

export type R48FinalStackReviewInvariantCheck = {
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

const maxListItems = 100;
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

function addReason(reasonCodes: string[], reasonCode: R48FinalStackReviewReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function collectText(values: string[] | undefined, target: string[]) {
  for (const value of values ?? []) {
    addUnique(target, value);
  }
}

function collectExternalReasonCodes(reasonCodes: string[] | undefined, target: string[]) {
  for (const reasonCode of reasonCodes ?? []) {
    addUnique(target, reasonCode);
  }
}

function layerIsMissing(status?: R48StackLayerStatus) {
  return !status || status === "missing";
}

function layerIsIncomplete(status?: R48StackLayerStatus) {
  return layerIsMissing(status) || status === "blocked" || status === "review_required";
}

function layerIsProhibited(status?: R48StackLayerStatus) {
  return status === "prohibited";
}

function systemHealthIsSafe(systemHealth?: R48FinalStackSystemHealthSignal) {
  return (
    systemHealth?.database === "ok" &&
    systemHealth.status !== "critical" &&
    systemHealth.readinessReady !== false
  );
}

function stagingDbIsReady(stagingDbReadiness?: R48FinalStackStagingDbReadinessSignal) {
  return (
    stagingDbReadiness?.connected === true &&
    stagingDbReadiness.migrationsApplied === true &&
    stagingDbReadiness.tablesReady === true &&
    stagingDbReadiness.schemaMismatchDetected !== true
  );
}

export function assertR48FinalControlledActivationStackReviewInvariants(
  result: Pick<
    R48FinalControlledActivationStackReviewResult,
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
): R48FinalStackReviewInvariantCheck {
  const reasonCodes: R48FinalStackReviewInvariantCheck["reasonCodes"] = [];

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

export function summarizeR48FinalControlledActivationStackReview(
  result: R48FinalControlledActivationStackReviewResult,
) {
  const invariantCheck = assertR48FinalControlledActivationStackReviewInvariants(result);

  return boundSummary(
    `R48K final controlled activation stack review outcome is ${result.finalStackReviewOutcome}. ` +
      `${result.remainingBlockers.length} blockers and ${result.requiredOperatorActions.length} operator actions remain. ` +
      `Governance conclusion is ${result.governanceConclusion}; staging DB ready is ${result.stagingDbReady}. ` +
      `Persistence allowed now: ${result.persistenceAllowedNow}. Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Review is advisory-only and cannot authorize live execution, provider activation, sending, persistence, route execution, env reads, network calls, or automation.",
  );
}

export function createR48FinalControlledActivationStackReview(
  input: R48FinalControlledActivationStackReviewInput = {},
): R48FinalControlledActivationStackReviewResult {
  const reasonCodes: string[] = [];
  const remainingBlockers: string[] = [];
  const requiredOperatorActions: string[] = [];
  const advisoryFindings: string[] = [];
  const layers = [
    ["r48aActivationPlan", input.r48aActivationPlan, "r48a_activation_plan_missing"],
    ["r48bPrerequisiteChecklist", input.r48bPrerequisiteChecklist, "r48b_prerequisite_checklist_missing"],
    ["r48cRiskClassification", input.r48cRiskClassification, "r48c_risk_classification_missing"],
    ["r48dEscalationMatrix", input.r48dEscalationMatrix, "r48d_escalation_matrix_missing"],
    ["r48eHumanApprovalGate", input.r48eHumanApprovalGate, "r48e_human_approval_gate_missing"],
    ["r48fFinalReadinessGate", input.r48fFinalReadinessGate, "r48f_final_readiness_gate_missing"],
    ["r48gDryRunExecutionEnvelope", input.r48gDryRunExecutionEnvelope, "r48g_dry_run_envelope_missing"],
    ["r48hAuditEventContract", input.r48hAuditEventContract, "r48h_audit_event_missing"],
    ["r48iAuditPersistencePlan", input.r48iAuditPersistencePlan, "r48i_audit_persistence_plan_missing"],
    ["r48jGovernanceSummary", input.r48jGovernanceSummary, "r48j_governance_summary_missing"],
  ] as const;

  addReason(reasonCodes, "r48k_final_stack_review_contract_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  addReason(reasonCodes, "persistence_not_allowed_now");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.systemHealth?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.stagingDbReadiness?.reasonCodes, reasonCodes);
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

  for (const [label, status, missingReasonCode] of layers) {
    if (layerIsMissing(status)) {
      addReason(reasonCodes, missingReasonCode);
      addReason(reasonCodes, "child_layer_incomplete");
      addUnique(remainingBlockers, `${label} is missing.`);
    } else if (layerIsProhibited(status)) {
      addReason(reasonCodes, "child_layer_prohibited");
      addUnique(remainingBlockers, `${label} is prohibited.`);
    } else if (layerIsIncomplete(status)) {
      addReason(reasonCodes, "child_layer_incomplete");
      addUnique(remainingBlockers, `${label} is ${status}.`);
    }
  }

  if (!input.governanceConclusion) {
    addReason(reasonCodes, "r48j_governance_summary_missing");
    addReason(reasonCodes, "child_layer_incomplete");
    addUnique(remainingBlockers, "Governance conclusion is missing.");
  } else if (input.governanceConclusion === "activation_prohibited") {
    addReason(reasonCodes, "governance_summary_prohibited");
    addUnique(remainingBlockers, "Governance summary prohibits activation.");
  } else if (input.governanceConclusion === "activation_blocked") {
    addReason(reasonCodes, "governance_summary_blocked");
    addUnique(remainingBlockers, "Governance summary is blocked.");
  } else if (input.governanceConclusion === "remediation_required") {
    addReason(reasonCodes, "governance_summary_remediation_required");
    addUnique(remainingBlockers, "Governance summary requires remediation.");
  } else if (input.governanceConclusion === "operator_review_required") {
    addReason(reasonCodes, "operator_review_required");
    addUnique(requiredOperatorActions, "Complete governance summary operator review.");
  }

  if (!input.systemHealth) {
    addReason(reasonCodes, "system_health_missing");
    addUnique(remainingBlockers, "System health is missing.");
  } else if (!systemHealthIsSafe(input.systemHealth)) {
    addReason(reasonCodes, "system_health_unsafe");
    addUnique(remainingBlockers, "System health/readiness is unsafe.");
  }

  if (!input.stagingDbReadiness) {
    addReason(reasonCodes, "staging_db_readiness_missing");
    addUnique(remainingBlockers, "Staging DB readiness is missing.");
  } else if (!stagingDbIsReady(input.stagingDbReadiness)) {
    addReason(reasonCodes, "staging_db_readiness_unsafe");
    addUnique(remainingBlockers, "Staging DB readiness is unsafe.");
  }

  let finalStackReviewOutcome: R48FinalStackReviewOutcome = "simulation_stack_complete";

  if (
    reasonCodes.includes("activation_executed_must_be_false") ||
    reasonCodes.includes("provider_activation_allowed_must_be_false") ||
    reasonCodes.includes("live_execution_allowed_must_be_false") ||
    reasonCodes.includes("sent_must_be_false") ||
    reasonCodes.includes("provider_called_must_be_false") ||
    reasonCodes.includes("can_send_now_must_be_false") ||
    reasonCodes.includes("child_layer_prohibited") ||
    reasonCodes.includes("governance_summary_prohibited")
  ) {
    finalStackReviewOutcome = "activation_prohibited";
  } else if (reasonCodes.includes("system_health_unsafe") || reasonCodes.includes("staging_db_readiness_unsafe")) {
    finalStackReviewOutcome = "remediation_required";
  } else if (reasonCodes.includes("child_layer_incomplete") || remainingBlockers.length > 0) {
    finalStackReviewOutcome = "stack_incomplete";
  } else if (reasonCodes.includes("operator_review_required") || requiredOperatorActions.length > 0) {
    finalStackReviewOutcome = "operator_review_required";
  } else if (input.governanceConclusion === "planning_only_complete") {
    finalStackReviewOutcome = "planning_stack_complete";
    addReason(reasonCodes, "planning_stack_complete");
  } else {
    finalStackReviewOutcome = "simulation_stack_complete";
    addReason(reasonCodes, "simulation_stack_complete");
  }

  const finalCompletionRecommendation =
    finalStackReviewOutcome === "simulation_stack_complete"
      ? "R48 simulation-only governance stack is complete; continue to preserve non-execution controls."
      : finalStackReviewOutcome === "planning_stack_complete"
        ? "R48 planning-only governance stack is complete; no live activation is authorized."
        : finalStackReviewOutcome === "operator_review_required"
          ? "Complete required operator review before considering the stack complete."
          : finalStackReviewOutcome === "remediation_required"
            ? "Complete remediation for unsafe system or staging readiness before continuing."
            : finalStackReviewOutcome === "activation_prohibited"
              ? "Activation remains prohibited; investigate prohibited governance or execution indicators."
              : "Complete all missing or incomplete R48 layers before continuing.";

  addUnique(advisoryFindings, "R48K is a final review contract only and cannot authorize live activation.");

  const result: R48FinalControlledActivationStackReviewResult = {
    finalStackReviewOutcome,
    finalCompletionRecommendation,
    r48aActivationPlan: input.r48aActivationPlan ?? "missing",
    r48bPrerequisiteChecklist: input.r48bPrerequisiteChecklist ?? "missing",
    r48cRiskClassification: input.r48cRiskClassification ?? "missing",
    r48dEscalationMatrix: input.r48dEscalationMatrix ?? "missing",
    r48eHumanApprovalGate: input.r48eHumanApprovalGate ?? "missing",
    r48fFinalReadinessGate: input.r48fFinalReadinessGate ?? "missing",
    r48gDryRunExecutionEnvelope: input.r48gDryRunExecutionEnvelope ?? "missing",
    r48hAuditEventContract: input.r48hAuditEventContract ?? "missing",
    r48iAuditPersistencePlan: input.r48iAuditPersistencePlan ?? "missing",
    r48jGovernanceSummary: input.r48jGovernanceSummary ?? "missing",
    governanceConclusion: input.governanceConclusion ?? "missing",
    systemHealthStatus: input.systemHealth?.status ?? "missing",
    stagingDbReady: stagingDbIsReady(input.stagingDbReadiness),
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
    summary: "R48K final controlled activation stack review contract only.",
  };

  return {
    ...result,
    summary: summarizeR48FinalControlledActivationStackReview(result),
  };
}
