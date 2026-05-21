import type { R48FinalStackReviewOutcome } from "./r48-final-controlled-activation-stack-review-contract";

export type R49GovernanceStatusPhase = "R49_read_only_visibility";

export type R49GovernanceStatusValue = R48FinalStackReviewOutcome;

export type R49GovernanceStatusInput = {
  status?: R49GovernanceStatusValue;
  conclusion?: string;
  remainingBlockers?: string[];
  requiredOperatorActions?: string[];
  reasonCodes?: string[];
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
};

export type R49GovernanceStatusResult = {
  governanceStatus: {
    phase: R49GovernanceStatusPhase;
    status: R49GovernanceStatusValue;
    conclusion: string;
    simulationOnly: true;
    advisoryOnly: true;
    activationExecuted: false;
    providerActivationAllowed: false;
    liveExecutionAllowed: false;
    sent: false;
    providerCalled: false;
    canSendNow: false;
    liveTestReady: false;
    persistenceAllowedNow: false;
    remainingBlockers: string[];
    requiredOperatorActions: string[];
    reasonCodes: string[];
  };
};

export type R49GovernanceStatusInvariantCheck = {
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
    | "advisory_only_required"
  >;
};

const maxListItems = 40;
const maxTextLength = 160;
const maxConclusionLength = 360;

const allowedStatuses: R49GovernanceStatusValue[] = [
  "stack_incomplete",
  "activation_prohibited",
  "remediation_required",
  "operator_review_required",
  "simulation_stack_complete",
  "planning_stack_complete",
];

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null, maxLength = maxTextLength) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length <= maxLength) return normalizedValue;

  return `${normalizedValue.slice(0, maxLength)}...`;
}

function addUnique(list: string[], value: string) {
  const boundedValue = boundText(value);

  if (boundedValue && !list.includes(boundedValue) && list.length < maxListItems) {
    list.push(boundedValue);
  }
}

function collectBounded(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function resolveStatus(status?: R49GovernanceStatusValue) {
  return status && allowedStatuses.includes(status) ? status : "stack_incomplete";
}

function defaultConclusion(status: R49GovernanceStatusValue) {
  if (status === "activation_prohibited") {
    return "Activation is prohibited. Read-only governance visibility cannot authorize execution.";
  }

  if (status === "remediation_required") {
    return "Remediation is required before governance can be considered complete.";
  }

  if (status === "operator_review_required") {
    return "Operator review is required. No live execution is authorized.";
  }

  if (status === "simulation_stack_complete") {
    return "Simulation-only governance visibility is complete. Live execution remains blocked.";
  }

  if (status === "planning_stack_complete") {
    return "Planning-only governance visibility is complete. Live execution remains blocked.";
  }

  return "Governance status is incomplete by default. Read-only visibility remains fail-closed.";
}

function collectInvariantInputFindings(input: R49GovernanceStatusInput, blockers: string[], reasonCodes: string[]) {
  if (input.activationExecuted === true) {
    addUnique(blockers, "Input indicates activationExecuted:true.");
    addUnique(reasonCodes, "activation_executed_must_be_false");
  }
  if (input.providerActivationAllowed === true) {
    addUnique(blockers, "Input indicates providerActivationAllowed:true.");
    addUnique(reasonCodes, "provider_activation_allowed_must_be_false");
  }
  if (input.liveExecutionAllowed === true) {
    addUnique(blockers, "Input indicates liveExecutionAllowed:true.");
    addUnique(reasonCodes, "live_execution_allowed_must_be_false");
  }
  if (input.sent === true) {
    addUnique(blockers, "Input indicates sent:true.");
    addUnique(reasonCodes, "sent_must_be_false");
  }
  if (input.providerCalled === true) {
    addUnique(blockers, "Input indicates providerCalled:true.");
    addUnique(reasonCodes, "provider_called_must_be_false");
  }
  if (input.canSendNow === true) {
    addUnique(blockers, "Input indicates canSendNow:true.");
    addUnique(reasonCodes, "can_send_now_must_be_false");
  }
  if (input.simulationOnly !== true) {
    addUnique(blockers, "Input is not explicitly simulation-only.");
    addUnique(reasonCodes, "simulation_only_required");
  }
  if (input.liveTestReady === true) {
    addUnique(blockers, "Input indicates liveTestReady:true.");
    addUnique(reasonCodes, "live_test_ready_must_be_false");
  }
  if (input.persistenceAllowedNow === true) {
    addUnique(blockers, "Input indicates persistenceAllowedNow:true.");
    addUnique(reasonCodes, "persistence_not_allowed_now");
  }
}

export function assertR49GovernanceStatusInvariants(
  result: R49GovernanceStatusResult["governanceStatus"],
): R49GovernanceStatusInvariantCheck {
  const reasonCodes: R49GovernanceStatusInvariantCheck["reasonCodes"] = [];

  if (result.activationExecuted !== false) reasonCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) reasonCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) reasonCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) reasonCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) reasonCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) reasonCodes.push("can_send_now_must_be_false");
  if (result.simulationOnly !== true) reasonCodes.push("simulation_only_required");
  if (result.liveTestReady !== false) reasonCodes.push("live_test_ready_must_be_false");
  if (result.persistenceAllowedNow !== false) reasonCodes.push("persistence_not_allowed_now");
  if (result.advisoryOnly !== true) reasonCodes.push("advisory_only_required");

  return {
    passed: reasonCodes.length === 0,
    reasonCodes,
  };
}

export function createR49GovernanceStatus(input: R49GovernanceStatusInput = {}): R49GovernanceStatusResult {
  const status = resolveStatus(input.status);
  const remainingBlockers = collectBounded(input.remainingBlockers);
  const requiredOperatorActions = collectBounded(input.requiredOperatorActions);
  const reasonCodes = collectBounded(input.reasonCodes);

  addUnique(reasonCodes, "r49_read_only_visibility");
  addUnique(reasonCodes, "advisory_only");
  addUnique(reasonCodes, "simulation_only");
  addUnique(reasonCodes, "live_execution_forbidden");
  addUnique(reasonCodes, "provider_activation_forbidden");
  addUnique(reasonCodes, "persistence_not_allowed_now");

  if (!input.status) {
    addUnique(reasonCodes, "governance_status_missing");
    addUnique(remainingBlockers, "Governance status source is missing.");
  }

  collectInvariantInputFindings(input, remainingBlockers, reasonCodes);

  const governanceStatus: R49GovernanceStatusResult["governanceStatus"] = {
    phase: "R49_read_only_visibility",
    status,
    conclusion: boundText(input.conclusion, maxConclusionLength) || defaultConclusion(status),
    simulationOnly: true,
    advisoryOnly: true,
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    liveTestReady: false,
    persistenceAllowedNow: false,
    remainingBlockers,
    requiredOperatorActions,
    reasonCodes,
  };

  return {
    governanceStatus,
  };
}
