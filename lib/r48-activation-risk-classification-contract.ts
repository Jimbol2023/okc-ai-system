export type R48ActivationRiskClassification =
  | "blocked"
  | "prohibited"
  | "unsafe"
  | "elevated_risk"
  | "controlled_simulation_only"
  | "planning_only";

export type R48ActivationRiskReasonCode =
  | "r48c_risk_classification_contract_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "operator_confirmation_missing"
  | "operator_confirmation_invalid"
  | "allowlist_missing"
  | "allowlist_mismatch"
  | "kill_switch_unsafe"
  | "provider_boundary_unsafe"
  | "audit_persistence_missing"
  | "audit_persistence_unsafe"
  | "static_smoke_missing"
  | "static_smoke_failed"
  | "safety_envelope_missing"
  | "safety_envelope_unsafe"
  | "forbidden_activation_condition_detected"
  | "planning_only_risk_classification"
  | "controlled_simulation_only_classification";

export type R48RiskOperatorConfirmationSignal = {
  required?: boolean;
  confirmed?: boolean;
  valid?: boolean;
  exactActionMatched?: boolean;
  notExpired?: boolean;
  simulationOnly?: boolean;
  reasonCodes?: string[];
};

export type R48RiskAllowlistSignal = {
  required?: boolean;
  allowed?: boolean;
  recipientMatched?: boolean;
  reasonCodes?: string[];
};

export type R48RiskKillSwitchSignal = {
  allowed?: boolean;
  killSwitchActive?: boolean;
  emergencyStopActive?: boolean;
  reasonCodes?: string[];
};

export type R48RiskProviderBoundarySignal = {
  ok?: boolean;
  providerDisabled?: boolean;
  providerMode?: string;
  providerCalled?: boolean;
  sent?: boolean;
  activationAllowed?: boolean;
  reasonCodes?: string[];
};

export type R48RiskAuditPersistenceSignal = {
  readyForFuturePersistence?: boolean;
  persistenceExecuted?: boolean;
  dbWriteAttempted?: boolean;
  forbiddenFieldsDetected?: string[];
  reasonCodes?: string[];
};

export type R48RiskStaticSmokeSignal = {
  present?: boolean;
  passed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  reasonCodes?: string[];
};

export type R48RiskSafetyEnvelopeSignal = {
  present?: boolean;
  mode?: string;
  executionBlocked?: boolean;
  providerDisabled?: boolean;
  liveExecutionEnabled?: boolean;
  reasonCodes?: string[];
};

export type R48ActivationRiskClassificationInput = {
  operatorConfirmation?: R48RiskOperatorConfirmationSignal;
  allowlist?: R48RiskAllowlistSignal;
  killSwitch?: R48RiskKillSwitchSignal;
  providerBoundary?: R48RiskProviderBoundarySignal;
  auditPersistence?: R48RiskAuditPersistenceSignal;
  staticSmoke?: R48RiskStaticSmokeSignal;
  safetyEnvelope?: R48RiskSafetyEnvelopeSignal;
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

export type R48ActivationRiskClassificationResult = {
  riskClassification: R48ActivationRiskClassification;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  reasonCodes: string[];
  riskFactors: string[];
  blockingFactors: string[];
  prohibitedFactors: string[];
  advisoryFactors: string[];
  forbiddenActivationConditions: string[];
  summary: string;
};

export type R48ActivationRiskClassificationInvariantCheck = {
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

function addReason(reasonCodes: string[], reasonCode: R48ActivationRiskReasonCode) {
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

function addRiskFactor(riskFactors: string[], factor: string) {
  addUnique(riskFactors, factor);
}

function addBlockingFactor(blockingFactors: string[], factor: string) {
  addUnique(blockingFactors, factor);
}

function addProhibitedFactor(prohibitedFactors: string[], factor: string) {
  addUnique(prohibitedFactors, factor);
}

function addAdvisoryFactor(advisoryFactors: string[], factor: string) {
  addUnique(advisoryFactors, factor);
}

function operatorConfirmationIsValid(operatorConfirmation?: R48RiskOperatorConfirmationSignal) {
  return (
    operatorConfirmation?.required === true &&
    operatorConfirmation.confirmed === true &&
    operatorConfirmation.valid === true &&
    operatorConfirmation.exactActionMatched === true &&
    operatorConfirmation.notExpired === true &&
    operatorConfirmation.simulationOnly === true
  );
}

function allowlistIsValid(allowlist?: R48RiskAllowlistSignal) {
  return allowlist?.required === true && allowlist.allowed === true && allowlist.recipientMatched === true;
}

function killSwitchIsSafe(killSwitch?: R48RiskKillSwitchSignal) {
  return (
    killSwitch?.allowed === true &&
    killSwitch.killSwitchActive !== true &&
    killSwitch.emergencyStopActive !== true
  );
}

function providerBoundaryIsSafe(providerBoundary?: R48RiskProviderBoundarySignal) {
  return (
    providerBoundary?.ok === true &&
    providerBoundary.providerDisabled === true &&
    providerBoundary.providerCalled !== true &&
    providerBoundary.sent !== true &&
    providerBoundary.activationAllowed !== true
  );
}

function auditPersistenceIsReady(auditPersistence?: R48RiskAuditPersistenceSignal) {
  return (
    auditPersistence?.readyForFuturePersistence === true &&
    auditPersistence.persistenceExecuted !== true &&
    auditPersistence.dbWriteAttempted !== true &&
    (auditPersistence.forbiddenFieldsDetected?.length ?? 0) === 0
  );
}

function staticSmokeIsSafe(staticSmoke?: R48RiskStaticSmokeSignal) {
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

function safetyEnvelopeIsSafe(safetyEnvelope?: R48RiskSafetyEnvelopeSignal) {
  return (
    safetyEnvelope?.present === true &&
    safetyEnvelope.mode === "simulation_only" &&
    safetyEnvelope.executionBlocked === true &&
    safetyEnvelope.providerDisabled === true &&
    safetyEnvelope.liveExecutionEnabled === false
  );
}

export function assertR48ActivationRiskClassificationInvariants(
  result: Pick<
    R48ActivationRiskClassificationResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
  >,
): R48ActivationRiskClassificationInvariantCheck {
  const reasonCodes: R48ActivationRiskClassificationInvariantCheck["reasonCodes"] = [];

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

export function summarizeR48ActivationRiskClassification(result: R48ActivationRiskClassificationResult) {
  const invariantCheck = assertR48ActivationRiskClassificationInvariants(result);

  return boundSummary(
    `R48C activation risk classification is ${result.riskClassification}. ` +
      `${result.prohibitedFactors.length} prohibited factors, ${result.blockingFactors.length} blocking factors, and ` +
      `${result.riskFactors.length} risk factors are present. ` +
      `${result.forbiddenActivationConditions.length} forbidden activation conditions are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Classification is advisory only; no provider activation, live execution, route execution, SMS/email send, DB write, env read, or automation activation is authorized.",
  );
}

export function createR48ActivationRiskClassification(
  input: R48ActivationRiskClassificationInput = {},
): R48ActivationRiskClassificationResult {
  const reasonCodes: string[] = [];
  const riskFactors: string[] = [];
  const blockingFactors: string[] = [];
  const prohibitedFactors: string[] = [];
  const advisoryFactors: string[] = [];
  const forbiddenActivationConditions: string[] = [];

  addReason(reasonCodes, "r48c_risk_classification_contract_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.operatorConfirmation?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.allowlist?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.killSwitch?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.providerBoundary?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.auditPersistence?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.staticSmoke?.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.safetyEnvelope?.reasonCodes, reasonCodes);
  collectForbiddenActivationConditions(input.forbiddenActivationConditions, forbiddenActivationConditions);

  if (input.activationExecuted === true) {
    addReason(reasonCodes, "activation_executed_must_be_false");
    addProhibitedFactor(prohibitedFactors, "Input indicates activationExecuted:true.");
    addUnique(forbiddenActivationConditions, "activation_executed_true");
  }
  if (input.providerActivationAllowed === true) {
    addReason(reasonCodes, "provider_activation_allowed_must_be_false");
    addProhibitedFactor(prohibitedFactors, "Input indicates providerActivationAllowed:true.");
    addUnique(forbiddenActivationConditions, "provider_activation_allowed_true");
  }
  if (input.liveExecutionAllowed === true) {
    addReason(reasonCodes, "live_execution_allowed_must_be_false");
    addProhibitedFactor(prohibitedFactors, "Input indicates liveExecutionAllowed:true.");
    addUnique(forbiddenActivationConditions, "live_execution_allowed_true");
  }
  if (input.sent === true) {
    addReason(reasonCodes, "sent_must_be_false");
    addProhibitedFactor(prohibitedFactors, "Input indicates sent:true.");
    addUnique(forbiddenActivationConditions, "sent_true");
  }
  if (input.providerCalled === true) {
    addReason(reasonCodes, "provider_called_must_be_false");
    addProhibitedFactor(prohibitedFactors, "Input indicates providerCalled:true.");
    addUnique(forbiddenActivationConditions, "provider_called_true");
  }
  if (input.canSendNow === true) {
    addReason(reasonCodes, "can_send_now_must_be_false");
    addProhibitedFactor(prohibitedFactors, "Input indicates canSendNow:true.");
    addUnique(forbiddenActivationConditions, "can_send_now_true");
  }
  if (input.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addProhibitedFactor(prohibitedFactors, "Input is not simulation-only.");
  }
  if (input.liveTestReady === true) {
    addReason(reasonCodes, "live_test_ready_must_be_false");
    addProhibitedFactor(prohibitedFactors, "Input indicates liveTestReady:true.");
    addUnique(forbiddenActivationConditions, "live_test_ready_true");
  }

  if (!operatorConfirmationIsValid(input.operatorConfirmation)) {
    addReason(reasonCodes, input.operatorConfirmation ? "operator_confirmation_invalid" : "operator_confirmation_missing");
    addBlockingFactor(blockingFactors, "Valid exact-action operator confirmation is missing.");
  }

  if (!allowlistIsValid(input.allowlist)) {
    addReason(reasonCodes, input.allowlist ? "allowlist_mismatch" : "allowlist_missing");
    addBlockingFactor(blockingFactors, "Recipient allowlist requirement is missing or mismatched.");
  }

  if (!killSwitchIsSafe(input.killSwitch)) {
    addReason(reasonCodes, "kill_switch_unsafe");
    addProhibitedFactor(prohibitedFactors, "Kill-switch or emergency stop state is unsafe.");
  }

  if (!providerBoundaryIsSafe(input.providerBoundary)) {
    addReason(reasonCodes, "provider_boundary_unsafe");
    addProhibitedFactor(prohibitedFactors, "Provider boundary is unsafe, enabled, missing, or indicates execution.");
  }

  if (!auditPersistenceIsReady(input.auditPersistence)) {
    addReason(reasonCodes, input.auditPersistence ? "audit_persistence_unsafe" : "audit_persistence_missing");
    addRiskFactor(riskFactors, "Audit persistence planning is missing or unsafe.");
  }

  if (!staticSmokeIsSafe(input.staticSmoke)) {
    addReason(reasonCodes, input.staticSmoke ? "static_smoke_failed" : "static_smoke_missing");
    addBlockingFactor(blockingFactors, "Static smoke contract is missing, failed, or contains execution signals.");
  }

  if (!safetyEnvelopeIsSafe(input.safetyEnvelope)) {
    addReason(reasonCodes, input.safetyEnvelope ? "safety_envelope_unsafe" : "safety_envelope_missing");
    addBlockingFactor(blockingFactors, "Safety envelope is missing or does not enforce simulation-only blocking.");
  }

  if (forbiddenActivationConditions.length > 0) {
    addReason(reasonCodes, "forbidden_activation_condition_detected");
    addProhibitedFactor(prohibitedFactors, "One or more forbidden activation conditions are present.");
  }

  let riskClassification: R48ActivationRiskClassification = "controlled_simulation_only";

  if (prohibitedFactors.length > 0) {
    riskClassification = "prohibited";
  } else if (blockingFactors.length > 0) {
    riskClassification = "blocked";
  } else if (riskFactors.length > 0) {
    riskClassification = "elevated_risk";
  } else if (input.operatorConfirmation?.confirmed === true) {
    riskClassification = "controlled_simulation_only";
    addReason(reasonCodes, "controlled_simulation_only_classification");
  } else {
    riskClassification = "planning_only";
    addReason(reasonCodes, "planning_only_risk_classification");
  }

  addAdvisoryFactor(
    advisoryFactors,
    "R48C classifies hypothetical activation risk only; it cannot authorize provider activation or live execution.",
  );

  const result: R48ActivationRiskClassificationResult = {
    riskClassification,
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    reasonCodes,
    riskFactors,
    blockingFactors,
    prohibitedFactors,
    advisoryFactors,
    forbiddenActivationConditions,
    summary: "R48C activation risk classification contract only.",
  };

  return {
    ...result,
    summary: summarizeR48ActivationRiskClassification(result),
  };
}
