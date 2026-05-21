export type R48ActivationPrerequisiteChecklistReasonCode =
  | "r48b_checklist_contract_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "r47_final_readiness_review_required"
  | "r48_activation_plan_required"
  | "operator_confirmation_requirement_missing"
  | "allowlist_requirement_missing"
  | "kill_switch_safe_state_requirement_missing"
  | "provider_boundary_disabled_or_planned_state_required"
  | "audit_persistence_planning_required"
  | "static_smoke_contract_required"
  | "safety_envelope_required"
  | "forbidden_activation_condition_detected"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "activation_checklist_complete";

export type R48ChecklistReadinessReviewSignal = {
  r47Complete?: boolean;
  controlledLiveTestPlanningReady?: boolean;
  liveExecutionReady?: boolean;
  providerActivationAllowed?: boolean;
  routeExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  reasonCodes?: string[];
};

export type R48ChecklistActivationPlanSignal = {
  activationPlanned?: boolean;
  readinessLevel?: string;
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  forbiddenActivationConditions?: string[];
  reasonCodes?: string[];
};

export type R48ActivationPrerequisiteChecklistInput = {
  r47FinalReadinessReview?: R48ChecklistReadinessReviewSignal;
  r48ActivationPlan?: R48ChecklistActivationPlanSignal;
  operatorConfirmationRequired?: boolean;
  allowlistRequired?: boolean;
  killSwitchSafeStateRequired?: boolean;
  providerBoundaryDisabledOrPlannedStateRequired?: boolean;
  auditPersistencePlanningRequired?: boolean;
  staticSmokeContractRequired?: boolean;
  safetyEnvelopeRequired?: boolean;
  forbiddenActivationConditions?: string[];
  reasonCodes?: string[];
};

export type R48ActivationPrerequisiteChecklistResult = {
  activationChecklistComplete: boolean;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  reasonCodes: string[];
  satisfiedPrerequisites: string[];
  blockers: string[];
  forbiddenActivationConditions: string[];
  summary: string;
};

export type R48ActivationPrerequisiteChecklistInvariantCheck = {
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

function addUnique(list: string[], value: string) {
  const boundedValue = boundText(value);

  if (boundedValue && !list.includes(boundedValue) && list.length < maxListItems) {
    list.push(boundedValue);
  }
}

function addReason(reasonCodes: string[], reasonCode: R48ActivationPrerequisiteChecklistReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function addSatisfied(satisfiedPrerequisites: string[], prerequisite: string) {
  addUnique(satisfiedPrerequisites, prerequisite);
}

function addBlocker(blockers: string[], blocker: string) {
  addUnique(blockers, blocker);
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

function addExecutionInvariantBlockers(
  signal:
    | R48ChecklistReadinessReviewSignal
    | R48ChecklistActivationPlanSignal
    | undefined,
  reasonCodes: string[],
  blockers: string[],
) {
  if (!signal) return;

  if ("activationExecuted" in signal && signal.activationExecuted === true) {
    addReason(reasonCodes, "activation_executed_must_be_false");
    addBlocker(blockers, "Activation plan indicates activationExecuted:true.");
  }
  if (signal.providerActivationAllowed === true) {
    addReason(reasonCodes, "provider_activation_allowed_must_be_false");
    addBlocker(blockers, "Signal indicates provider activation is allowed.");
  }
  if ("liveExecutionAllowed" in signal && signal.liveExecutionAllowed === true) {
    addReason(reasonCodes, "live_execution_allowed_must_be_false");
    addBlocker(blockers, "Activation plan indicates live execution is allowed.");
  }
  if ("liveExecutionReady" in signal && signal.liveExecutionReady === true) {
    addReason(reasonCodes, "live_execution_allowed_must_be_false");
    addBlocker(blockers, "R47 review indicates live execution readiness.");
  }
  if (signal.sent === true) {
    addReason(reasonCodes, "sent_must_be_false");
    addBlocker(blockers, "Signal indicates sent:true.");
  }
  if (signal.providerCalled === true) {
    addReason(reasonCodes, "provider_called_must_be_false");
    addBlocker(blockers, "Signal indicates providerCalled:true.");
  }
  if (signal.canSendNow === true) {
    addReason(reasonCodes, "can_send_now_must_be_false");
    addBlocker(blockers, "Signal indicates canSendNow:true.");
  }
  if (signal.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addBlocker(blockers, "Signal is not simulation-only.");
  }
  if (signal.liveTestReady === true) {
    addReason(reasonCodes, "live_test_ready_must_be_false");
    addBlocker(blockers, "Signal indicates liveTestReady:true.");
  }
}

export function assertR48ActivationPrerequisiteChecklistInvariants(
  result: Pick<
    R48ActivationPrerequisiteChecklistResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
  >,
): R48ActivationPrerequisiteChecklistInvariantCheck {
  const reasonCodes: R48ActivationPrerequisiteChecklistInvariantCheck["reasonCodes"] = [];

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

export function summarizeR48ActivationPrerequisiteChecklist(result: R48ActivationPrerequisiteChecklistResult) {
  const invariantCheck = assertR48ActivationPrerequisiteChecklistInvariants(result);

  return boundSummary(
    `R48B activation prerequisite checklist is ${result.activationChecklistComplete ? "complete" : "blocked"}. ` +
      `${result.satisfiedPrerequisites.length} prerequisites are satisfied and ${result.blockers.length} blockers remain. ` +
      `${result.forbiddenActivationConditions.length} forbidden activation conditions are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Checklist completion is advisory only; no provider activation, live execution, route execution, SMS/email send, DB write, env read, or automation activation is authorized.",
  );
}

export function createR48ActivationPrerequisiteChecklist(
  input: R48ActivationPrerequisiteChecklistInput = {},
): R48ActivationPrerequisiteChecklistResult {
  const reasonCodes: string[] = [];
  const satisfiedPrerequisites: string[] = [];
  const blockers: string[] = [];
  const forbiddenActivationConditions: string[] = [];

  addReason(reasonCodes, "r48b_checklist_contract_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.r47FinalReadinessReview?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.r48ActivationPlan?.reasonCodes, reasonCodes);
  collectForbiddenActivationConditions(input.forbiddenActivationConditions, forbiddenActivationConditions);
  collectForbiddenActivationConditions(input.r48ActivationPlan?.forbiddenActivationConditions, forbiddenActivationConditions);

  const r47Review = input.r47FinalReadinessReview;
  if (
    r47Review?.r47Complete === true &&
    r47Review.controlledLiveTestPlanningReady === true &&
    r47Review.liveExecutionReady !== true &&
    r47Review.providerActivationAllowed !== true &&
    r47Review.routeExecutionAllowed !== true
  ) {
    addSatisfied(satisfiedPrerequisites, "R47 final readiness review is complete and planning-only.");
  } else {
    addReason(reasonCodes, "r47_final_readiness_review_required");
    addBlocker(blockers, "R47 final readiness review is missing, incomplete, or not planning-only.");
  }
  addExecutionInvariantBlockers(r47Review, reasonCodes, blockers);

  const activationPlan = input.r48ActivationPlan;
  if (
    activationPlan?.activationPlanned === true &&
    activationPlan.readinessLevel === "planning_ready" &&
    activationPlan.activationExecuted !== true &&
    activationPlan.providerActivationAllowed !== true &&
    activationPlan.liveExecutionAllowed !== true
  ) {
    addSatisfied(satisfiedPrerequisites, "R48 activation plan exists in planning-ready state.");
  } else {
    addReason(reasonCodes, "r48_activation_plan_required");
    addBlocker(blockers, "R48 activation plan is missing, blocked, or contains execution authorization.");
  }
  addExecutionInvariantBlockers(activationPlan, reasonCodes, blockers);

  if (input.operatorConfirmationRequired === true) {
    addSatisfied(satisfiedPrerequisites, "Operator confirmation requirement is present.");
  } else {
    addReason(reasonCodes, "operator_confirmation_requirement_missing");
    addBlocker(blockers, "Operator confirmation requirement is missing.");
  }

  if (input.allowlistRequired === true) {
    addSatisfied(satisfiedPrerequisites, "Recipient allowlist requirement is present.");
  } else {
    addReason(reasonCodes, "allowlist_requirement_missing");
    addBlocker(blockers, "Recipient allowlist requirement is missing.");
  }

  if (input.killSwitchSafeStateRequired === true) {
    addSatisfied(satisfiedPrerequisites, "Kill-switch safe-state requirement is present.");
  } else {
    addReason(reasonCodes, "kill_switch_safe_state_requirement_missing");
    addBlocker(blockers, "Kill-switch safe-state requirement is missing.");
  }

  if (input.providerBoundaryDisabledOrPlannedStateRequired === true) {
    addSatisfied(satisfiedPrerequisites, "Provider boundary disabled/planned-state requirement is present.");
  } else {
    addReason(reasonCodes, "provider_boundary_disabled_or_planned_state_required");
    addBlocker(blockers, "Provider boundary disabled/planned-state requirement is missing.");
  }

  if (input.auditPersistencePlanningRequired === true) {
    addSatisfied(satisfiedPrerequisites, "Audit persistence planning requirement is present.");
  } else {
    addReason(reasonCodes, "audit_persistence_planning_required");
    addBlocker(blockers, "Audit persistence planning requirement is missing.");
  }

  if (input.staticSmokeContractRequired === true) {
    addSatisfied(satisfiedPrerequisites, "Static smoke contract requirement is present.");
  } else {
    addReason(reasonCodes, "static_smoke_contract_required");
    addBlocker(blockers, "Static smoke contract requirement is missing.");
  }

  if (input.safetyEnvelopeRequired === true) {
    addSatisfied(satisfiedPrerequisites, "Safety envelope requirement is present.");
  } else {
    addReason(reasonCodes, "safety_envelope_required");
    addBlocker(blockers, "Safety envelope requirement is missing.");
  }

  if (forbiddenActivationConditions.length > 0) {
    addReason(reasonCodes, "forbidden_activation_condition_detected");
    addBlocker(blockers, "One or more forbidden activation conditions are present.");
  }

  if (blockers.length === 0) {
    addReason(reasonCodes, "activation_checklist_complete");
  }

  const result: R48ActivationPrerequisiteChecklistResult = {
    activationChecklistComplete: blockers.length === 0,
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    reasonCodes,
    satisfiedPrerequisites,
    blockers,
    forbiddenActivationConditions,
    summary: "R48B activation prerequisite checklist contract only.",
  };

  return {
    ...result,
    summary: summarizeR48ActivationPrerequisiteChecklist(result),
  };
}
