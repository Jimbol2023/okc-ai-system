export type R48ActivationPlanReadinessLevel = "blocked" | "planning_ready";

export type R48ActivationPlanReasonCode =
  | "r48_activation_plan_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "operator_confirmation_required"
  | "allowlist_required"
  | "kill_switch_must_be_safe"
  | "provider_boundary_required"
  | "audit_persistence_ready_required"
  | "safety_envelope_required"
  | "static_smoke_required"
  | "forbidden_activation_condition_detected"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_does_not_authorize_execution"
  | "activation_prerequisites_satisfied_for_planning";

export type R48OperatorConfirmationSignal = {
  confirmed?: boolean;
  valid?: boolean;
  exactActionMatched?: boolean;
  notExpired?: boolean;
  simulationOnly?: boolean;
  reasonCodes?: string[];
};

export type R48AllowlistSignal = {
  allowed?: boolean;
  recipientMatched?: boolean;
  mode?: string;
  reasonCodes?: string[];
};

export type R48KillSwitchSignal = {
  allowed?: boolean;
  killSwitchActive?: boolean;
  emergencyStopActive?: boolean;
  reasonCodes?: string[];
};

export type R48ProviderBoundarySignal = {
  ok?: boolean;
  providerMode?: string;
  providerDisabled?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  reasonCodes?: string[];
};

export type R48AuditPersistenceSignal = {
  readyForFuturePersistence?: boolean;
  persistenceExecuted?: boolean;
  dbWriteAttempted?: boolean;
  forbiddenFieldsDetected?: string[];
  reasonCodes?: string[];
};

export type R48SafetyEnvelopeSignal = {
  present?: boolean;
  mode?: string;
  executionBlocked?: boolean;
  providerDisabled?: boolean;
  liveExecutionEnabled?: boolean;
  reasonCodes?: string[];
};

export type R48StaticSmokeSignal = {
  passed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  reasonCodes?: string[];
};

export type R48ControlledLiveTestActivationPlanInput = {
  operatorConfirmation?: R48OperatorConfirmationSignal;
  allowlist?: R48AllowlistSignal;
  killSwitch?: R48KillSwitchSignal;
  providerBoundary?: R48ProviderBoundarySignal;
  auditPersistence?: R48AuditPersistenceSignal;
  safetyEnvelope?: R48SafetyEnvelopeSignal;
  staticSmoke?: R48StaticSmokeSignal;
  forbiddenActivationConditions?: string[];
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  reasonCodes?: string[];
};

export type R48ControlledLiveTestActivationPlanResult = {
  activationPlanned: true;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  readinessLevel: R48ActivationPlanReadinessLevel;
  reasonCodes: string[];
  prerequisitesSatisfied: string[];
  blockers: string[];
  forbiddenActivationConditions: string[];
  nextHumanActions: string[];
  summary: string;
};

export type R48ControlledLiveTestActivationPlanInvariantCheck = {
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

function addReason(reasonCodes: string[], reasonCode: R48ActivationPlanReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function addBlocker(blockers: string[], blocker: string) {
  addUnique(blockers, blocker);
}

function addPrerequisite(prerequisitesSatisfied: string[], prerequisite: string) {
  addUnique(prerequisitesSatisfied, prerequisite);
}

function addHumanAction(nextHumanActions: string[], action: string) {
  addUnique(nextHumanActions, action);
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

function safetyEnvelopeIsValid(safetyEnvelope?: R48SafetyEnvelopeSignal) {
  return (
    safetyEnvelope?.present === true &&
    safetyEnvelope.mode === "simulation_only" &&
    safetyEnvelope.executionBlocked === true &&
    safetyEnvelope.providerDisabled === true &&
    safetyEnvelope.liveExecutionEnabled === false
  );
}

export function assertR48ControlledLiveTestActivationPlanInvariants(
  result: Pick<
    R48ControlledLiveTestActivationPlanResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
  >,
): R48ControlledLiveTestActivationPlanInvariantCheck {
  const reasonCodes: R48ControlledLiveTestActivationPlanInvariantCheck["reasonCodes"] = [];

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

export function summarizeR48ControlledLiveTestActivationPlan(result: R48ControlledLiveTestActivationPlanResult) {
  const invariantCheck = assertR48ControlledLiveTestActivationPlanInvariants(result);

  return boundSummary(
    `R48 controlled live-test activation plan is ${result.readinessLevel}. ` +
      `${result.prerequisitesSatisfied.length} prerequisites are satisfied and ${result.blockers.length} blockers remain. ` +
      `${result.forbiddenActivationConditions.length} forbidden activation conditions are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Activation is planned only; no provider activation, live execution, route execution, SMS/email send, DB write, env read, or automation activation is authorized.",
  );
}

export function createR48ControlledLiveTestActivationPlan(
  input: R48ControlledLiveTestActivationPlanInput = {},
): R48ControlledLiveTestActivationPlanResult {
  const reasonCodes: string[] = [];
  const prerequisitesSatisfied: string[] = [];
  const blockers: string[] = [];
  const forbiddenActivationConditions: string[] = [];
  const nextHumanActions: string[] = [];

  addReason(reasonCodes, "r48_activation_plan_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectForbiddenActivationConditions(input.forbiddenActivationConditions, forbiddenActivationConditions);

  if (input.sent === true) {
    addReason(reasonCodes, "sent_must_be_false");
    addBlocker(blockers, "Top-level input indicates sent:true.");
    addUnique(forbiddenActivationConditions, "sent_true");
  }
  if (input.providerCalled === true) {
    addReason(reasonCodes, "provider_called_must_be_false");
    addBlocker(blockers, "Top-level input indicates providerCalled:true.");
    addUnique(forbiddenActivationConditions, "provider_called_true");
  }
  if (input.canSendNow === true) {
    addReason(reasonCodes, "can_send_now_must_be_false");
    addBlocker(blockers, "Top-level input indicates canSendNow:true.");
    addUnique(forbiddenActivationConditions, "can_send_now_true");
  }
  if (input.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addBlocker(blockers, "Top-level input is not simulation-only.");
    addHumanAction(nextHumanActions, "Rebuild the activation plan from simulation-only contract outputs.");
  }
  if (input.liveTestReady === true) {
    addReason(reasonCodes, "live_test_ready_does_not_authorize_execution");
    addBlocker(blockers, "Top-level input indicates liveTestReady:true, which R48A cannot authorize.");
    addUnique(forbiddenActivationConditions, "live_test_ready_true");
  }

  collectExternalReasonCodes(input.operatorConfirmation?.reasonCodes, reasonCodes);
  if (
    input.operatorConfirmation?.confirmed === true &&
    input.operatorConfirmation.valid === true &&
    input.operatorConfirmation.exactActionMatched === true &&
    input.operatorConfirmation.notExpired === true &&
    input.operatorConfirmation.simulationOnly === true
  ) {
    addPrerequisite(prerequisitesSatisfied, "Operator confirmed the exact simulated action in a simulation-only context.");
  } else {
    addReason(reasonCodes, "operator_confirmation_required");
    addBlocker(blockers, "Valid operator confirmation for the exact simulated action is missing.");
    addHumanAction(nextHumanActions, "Collect exact-action operator confirmation after reviewing all safety gates.");
  }

  collectExternalReasonCodes(input.allowlist?.reasonCodes, reasonCodes);
  if (input.allowlist?.allowed === true && input.allowlist.recipientMatched === true) {
    addPrerequisite(prerequisitesSatisfied, "Recipient is allowlist-approved for the planned live-test scope.");
  } else {
    addReason(reasonCodes, "allowlist_required");
    addBlocker(blockers, "Recipient allowlist approval is missing or mismatched.");
    addHumanAction(nextHumanActions, "Verify the exact recipient is present in the approved allowlist.");
  }

  collectExternalReasonCodes(input.killSwitch?.reasonCodes, reasonCodes);
  if (
    input.killSwitch?.allowed === true &&
    input.killSwitch.killSwitchActive !== true &&
    input.killSwitch.emergencyStopActive !== true
  ) {
    addPrerequisite(prerequisitesSatisfied, "Kill-switch and emergency stop are inactive.");
  } else {
    addReason(reasonCodes, "kill_switch_must_be_safe");
    addBlocker(blockers, "Kill-switch or emergency stop state is unsafe or missing.");
    addHumanAction(nextHumanActions, "Confirm kill-switch and emergency stop are inactive before any future activation scope.");
  }

  collectExternalReasonCodes(input.providerBoundary?.reasonCodes, reasonCodes);
  if (
    input.providerBoundary?.ok === true &&
    input.providerBoundary.providerDisabled === true &&
    input.providerBoundary.providerCalled !== true &&
    input.providerBoundary.sent !== true
  ) {
    addPrerequisite(prerequisitesSatisfied, "Provider boundary is safe and provider execution remains disabled.");
  } else {
    addReason(reasonCodes, "provider_boundary_required");
    addBlocker(blockers, "Provider boundary is missing, unsafe, or indicates execution.");
    addHumanAction(nextHumanActions, "Keep provider boundary disabled until a separately authorized activation phase.");
  }

  collectExternalReasonCodes(input.auditPersistence?.reasonCodes, reasonCodes);
  if (
    input.auditPersistence?.readyForFuturePersistence === true &&
    input.auditPersistence.persistenceExecuted !== true &&
    input.auditPersistence.dbWriteAttempted !== true &&
    (input.auditPersistence.forbiddenFieldsDetected?.length ?? 0) === 0
  ) {
    addPrerequisite(prerequisitesSatisfied, "Audit persistence plan is ready for future non-secret persistence.");
  } else {
    addReason(reasonCodes, "audit_persistence_ready_required");
    addBlocker(blockers, "Audit persistence is not ready or indicates forbidden persistence activity.");
    addHumanAction(nextHumanActions, "Resolve audit persistence readiness without writing to DB/storage.");
  }

  collectExternalReasonCodes(input.safetyEnvelope?.reasonCodes, reasonCodes);
  if (safetyEnvelopeIsValid(input.safetyEnvelope)) {
    addPrerequisite(prerequisitesSatisfied, "Route safety envelope is present and keeps live execution disabled.");
  } else {
    addReason(reasonCodes, "safety_envelope_required");
    addBlocker(blockers, "Route safety envelope is missing or unsafe.");
    addHumanAction(nextHumanActions, "Confirm safety envelope remains simulation_only with execution blocked.");
  }

  collectExternalReasonCodes(input.staticSmoke?.reasonCodes, reasonCodes);
  if (
    input.staticSmoke?.passed === true &&
    input.staticSmoke.sent !== true &&
    input.staticSmoke.providerCalled !== true &&
    input.staticSmoke.canSendNow !== true &&
    input.staticSmoke.simulationOnly === true
  ) {
    addPrerequisite(prerequisitesSatisfied, "Static route safety smoke passed as simulation-only.");
  } else {
    addReason(reasonCodes, "static_smoke_required");
    addBlocker(blockers, "Static route safety smoke is missing, failed, or contains execution signals.");
    addHumanAction(nextHumanActions, "Run or review the static route safety smoke contract before activation planning continues.");
  }
  if (input.staticSmoke?.liveTestReady === true) {
    addReason(reasonCodes, "live_test_ready_does_not_authorize_execution");
    addBlocker(blockers, "Static smoke signal indicates liveTestReady:true, which R48A cannot authorize.");
    addUnique(forbiddenActivationConditions, "static_smoke_live_test_ready_true");
  }

  if (forbiddenActivationConditions.length > 0) {
    addReason(reasonCodes, "forbidden_activation_condition_detected");
    addBlocker(blockers, "One or more forbidden activation conditions are present.");
    addHumanAction(nextHumanActions, "Clear forbidden activation conditions before any future activation discussion.");
  }

  if (blockers.length === 0) {
    addReason(reasonCodes, "activation_prerequisites_satisfied_for_planning");
    addHumanAction(nextHumanActions, "Proceed only to R48B checklist planning; do not activate providers or live execution.");
  }

  const readinessLevel: R48ActivationPlanReadinessLevel = blockers.length === 0 ? "planning_ready" : "blocked";
  const result: R48ControlledLiveTestActivationPlanResult = {
    activationPlanned: true,
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    readinessLevel,
    reasonCodes,
    prerequisitesSatisfied,
    blockers,
    forbiddenActivationConditions,
    nextHumanActions,
    summary: "R48 controlled live-test activation plan only.",
  };

  return {
    ...result,
    summary: summarizeR48ControlledLiveTestActivationPlan(result),
  };
}
