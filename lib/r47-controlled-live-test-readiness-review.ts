export type R47ControlledLiveTestPhase =
  | "R47B_runtime_contract_adapter"
  | "R47C_send_route_simulation_integration"
  | "R47D_operator_confirmation_runtime_design"
  | "R47E_audit_persistence_planning"
  | "R47F_live_test_readiness_summary"
  | "R47G_route_readiness_summary_integration"
  | "R47H_route_safety_response_envelope"
  | "R47I_static_route_safety_smoke_contract";

export type R47ControlledLiveTestReadinessReasonCode =
  | "r47_review_contract_only"
  | "phase_missing"
  | "phase_incomplete"
  | "phase_execution_signal_detected"
  | "phase_not_simulation_only"
  | "static_smoke_missing"
  | "static_smoke_failed"
  | "planning_stack_complete"
  | "controlled_live_test_planning_ready"
  | "live_execution_not_ready"
  | "provider_activation_forbidden"
  | "route_execution_forbidden"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "r48_planning_required_before_activation";

export type R47ControlledLiveTestPhaseSignal = {
  complete?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  reasonCodes?: string[];
};

export type R47StaticSmokeSignal = {
  passed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  reasonCodes?: string[];
};

export type R47ControlledLiveTestReadinessReviewInput = {
  phases?: Partial<Record<R47ControlledLiveTestPhase, R47ControlledLiveTestPhaseSignal>>;
  staticRouteSafetySmoke?: R47StaticSmokeSignal;
  reasonCodes?: string[];
};

export type R47ControlledLiveTestReadinessReviewResult = {
  r47Complete: boolean;
  controlledLiveTestPlanningReady: boolean;
  liveExecutionReady: false;
  providerActivationAllowed: false;
  routeExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  reasonCodes: string[];
  completedPhases: R47ControlledLiveTestPhase[];
  missingPhases: R47ControlledLiveTestPhase[];
  blockingFindings: string[];
  advisoryFindings: string[];
  recommendedNextStep: "R48A_controlled_live_test_activation_plan_planning_only";
  summary: string;
};

export type R47ControlledLiveTestReadinessInvariantCheck = {
  passed: boolean;
  reasonCodes: Array<
    | "live_execution_ready_must_be_false"
    | "provider_activation_allowed_must_be_false"
    | "route_execution_allowed_must_be_false"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
    | "simulation_only_required"
    | "live_test_ready_must_be_false"
  >;
};

export const r47ControlledLiveTestRequiredPhases: R47ControlledLiveTestPhase[] = [
  "R47B_runtime_contract_adapter",
  "R47C_send_route_simulation_integration",
  "R47D_operator_confirmation_runtime_design",
  "R47E_audit_persistence_planning",
  "R47F_live_test_readiness_summary",
  "R47G_route_readiness_summary_integration",
  "R47H_route_safety_response_envelope",
  "R47I_static_route_safety_smoke_contract",
];

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

function addReason(reasonCodes: string[], reasonCode: R47ControlledLiveTestReadinessReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function addBlocking(blockingFindings: string[], finding: string) {
  addUnique(blockingFindings, finding);
}

function addAdvisory(advisoryFindings: string[], finding: string) {
  addUnique(advisoryFindings, finding);
}

function collectExternalReasonCodes(reasonCodes: string[] | undefined, target: string[]) {
  for (const reasonCode of reasonCodes ?? []) {
    addUnique(target, reasonCode);
  }
}

function phaseHasExecutionSignal(phase: R47ControlledLiveTestPhaseSignal | R47StaticSmokeSignal) {
  return phase.sent === true || phase.providerCalled === true || phase.canSendNow === true || phase.liveTestReady === true;
}

function phaseIsSimulationOnly(phase: R47ControlledLiveTestPhaseSignal | R47StaticSmokeSignal) {
  return phase.simulationOnly === true;
}

export function assertR47ControlledLiveTestReadinessReviewInvariants(
  result: Pick<
    R47ControlledLiveTestReadinessReviewResult,
    | "liveExecutionReady"
    | "providerActivationAllowed"
    | "routeExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
  >,
): R47ControlledLiveTestReadinessInvariantCheck {
  const reasonCodes: R47ControlledLiveTestReadinessInvariantCheck["reasonCodes"] = [];

  if (result.liveExecutionReady !== false) reasonCodes.push("live_execution_ready_must_be_false");
  if (result.providerActivationAllowed !== false) reasonCodes.push("provider_activation_allowed_must_be_false");
  if (result.routeExecutionAllowed !== false) reasonCodes.push("route_execution_allowed_must_be_false");
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

export function summarizeR47ControlledLiveTestReadinessReview(result: R47ControlledLiveTestReadinessReviewResult) {
  const invariantCheck = assertR47ControlledLiveTestReadinessReviewInvariants(result);

  return boundSummary(
    `R47 controlled live-test planning review is ${result.r47Complete ? "complete" : "blocked"}. ` +
      `Planning ready: ${result.controlledLiveTestPlanningReady}. ` +
      `${result.completedPhases.length} phases complete and ${result.missingPhases.length} phases missing. ` +
      `${result.blockingFindings.length} blocking findings remain. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Live execution, provider activation, route execution, SMS/email sending, DB writes, env reads, and automation activation remain unauthorized.",
  );
}

export function createR47ControlledLiveTestReadinessReview(
  input: R47ControlledLiveTestReadinessReviewInput = {},
): R47ControlledLiveTestReadinessReviewResult {
  const reasonCodes: string[] = [];
  const completedPhases: R47ControlledLiveTestPhase[] = [];
  const missingPhases: R47ControlledLiveTestPhase[] = [];
  const blockingFindings: string[] = [];
  const advisoryFindings: string[] = [];

  addReason(reasonCodes, "r47_review_contract_only");
  addReason(reasonCodes, "live_execution_not_ready");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "route_execution_forbidden");
  addReason(reasonCodes, "r48_planning_required_before_activation");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);

  for (const phaseName of r47ControlledLiveTestRequiredPhases) {
    const phase = input.phases?.[phaseName];

    if (!phase) {
      addReason(reasonCodes, "phase_missing");
      addBlocking(blockingFindings, `${phaseName} signal is missing.`);
      missingPhases.push(phaseName);
      continue;
    }

    collectExternalReasonCodes(phase.reasonCodes, reasonCodes);

    if (phase.complete !== true) {
      addReason(reasonCodes, "phase_incomplete");
      addBlocking(blockingFindings, `${phaseName} is not marked complete.`);
      missingPhases.push(phaseName);
    } else {
      completedPhases.push(phaseName);
    }

    if (phaseHasExecutionSignal(phase)) {
      addReason(reasonCodes, "phase_execution_signal_detected");
      addBlocking(blockingFindings, `${phaseName} contains an execution-readiness signal.`);
    }

    if (!phaseIsSimulationOnly(phase)) {
      addReason(reasonCodes, "phase_not_simulation_only");
      addBlocking(blockingFindings, `${phaseName} is not marked simulation-only.`);
    }
  }

  const staticSmoke = input.staticRouteSafetySmoke;

  if (!staticSmoke) {
    addReason(reasonCodes, "static_smoke_missing");
    addBlocking(blockingFindings, "R47I static route safety smoke signal is missing.");
  } else {
    collectExternalReasonCodes(staticSmoke.reasonCodes, reasonCodes);

    if (staticSmoke.passed !== true) {
      addReason(reasonCodes, "static_smoke_failed");
      addBlocking(blockingFindings, "R47I static route safety smoke did not pass.");
    }

    if (phaseHasExecutionSignal(staticSmoke)) {
      addReason(reasonCodes, "phase_execution_signal_detected");
      addBlocking(blockingFindings, "R47I static route safety smoke contains an execution-readiness signal.");
    }

    if (!phaseIsSimulationOnly(staticSmoke)) {
      addReason(reasonCodes, "phase_not_simulation_only");
      addBlocking(blockingFindings, "R47I static route safety smoke is not marked simulation-only.");
    }
  }

  addReason(reasonCodes, "sent_must_be_false");
  addReason(reasonCodes, "provider_called_must_be_false");
  addReason(reasonCodes, "can_send_now_must_be_false");
  addReason(reasonCodes, "simulation_only_required");
  addReason(reasonCodes, "live_test_ready_must_be_false");
  addAdvisory(advisoryFindings, "R47 completion only authorizes R48A planning, not provider activation or live route execution.");

  const r47Complete =
    completedPhases.length === r47ControlledLiveTestRequiredPhases.length &&
    missingPhases.length === 0 &&
    blockingFindings.length === 0 &&
    staticSmoke?.passed === true;

  if (r47Complete) {
    addReason(reasonCodes, "planning_stack_complete");
    addReason(reasonCodes, "controlled_live_test_planning_ready");
  }

  const result: R47ControlledLiveTestReadinessReviewResult = {
    r47Complete,
    controlledLiveTestPlanningReady: r47Complete,
    liveExecutionReady: false,
    providerActivationAllowed: false,
    routeExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    reasonCodes,
    completedPhases,
    missingPhases,
    blockingFindings,
    advisoryFindings,
    recommendedNextStep: "R48A_controlled_live_test_activation_plan_planning_only",
    summary: "R47 controlled live-test readiness review contract only.",
  };

  return {
    ...result,
    summary: summarizeR47ControlledLiveTestReadinessReview(result),
  };
}
