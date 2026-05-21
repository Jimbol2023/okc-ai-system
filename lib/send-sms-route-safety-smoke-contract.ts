export type SendSmsRouteSmokeLevel = "static_contract";

export type SendSmsRouteSafetyReasonCode =
  | "static_contract_only"
  | "route_snapshot_missing"
  | "provider_execution_blocked"
  | "twilio_activation_absent"
  | "env_secret_reads_absent"
  | "fetch_network_calls_absent"
  | "db_prisma_mutation_absent"
  | "automation_cycle_activation_absent"
  | "safety_envelope_present"
  | "validation_error_paths_preserve_invariants"
  | "live_execution_branch_absent"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "safety_envelope_missing"
  | "provider_execution_detected"
  | "twilio_activation_detected"
  | "env_secret_read_detected"
  | "fetch_network_call_detected"
  | "db_prisma_mutation_detected"
  | "automation_cycle_activation_detected"
  | "validation_error_invariants_missing"
  | "live_execution_branch_detected"
  | "passed_does_not_authorize_live_execution";

export type SendSmsRouteSafetyEnvelopeSignal = {
  present?: boolean;
  mode?: string;
  executionBlocked?: boolean;
  providerDisabled?: boolean;
  liveExecutionEnabled?: boolean;
  reasonCodes?: string[];
};

export type SendSmsRouteSafetySmokeInput = {
  routeSnapshotProvided?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  providerExecutionBlocked?: boolean;
  twilioActivationAbsent?: boolean;
  envSecretReadsAbsent?: boolean;
  fetchNetworkCallsAbsent?: boolean;
  dbPrismaMutationAbsent?: boolean;
  automationCycleActivationAbsent?: boolean;
  safetyEnvelope?: SendSmsRouteSafetyEnvelopeSignal;
  validationErrorPathsPreserveInvariants?: boolean;
  liveExecutionBranchAbsent?: boolean;
  reasonCodes?: string[];
};

export type SendSmsRouteSafetySmokeResult = {
  passed: boolean;
  route: "send-sms";
  smokeLevel: SendSmsRouteSmokeLevel;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  reasonCodes: string[];
  blockingFindings: string[];
  advisoryFindings: string[];
};

export type SendSmsRouteSafetySmokeInvariantCheck = {
  passed: boolean;
  reasonCodes: Array<
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
    | "simulation_only_required"
    | "live_test_ready_must_be_false"
  >;
};

const maxListItems = 50;
const maxTextLength = 160;

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length <= maxTextLength) return normalizedValue;

  return `${normalizedValue.slice(0, maxTextLength)}...`;
}

function addUnique(list: string[], value: string) {
  const boundedValue = boundText(value);

  if (boundedValue && !list.includes(boundedValue) && list.length < maxListItems) {
    list.push(boundedValue);
  }
}

function addReason(reasonCodes: string[], reasonCode: SendSmsRouteSafetyReasonCode) {
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

function isSafetyEnvelopeValid(safetyEnvelope?: SendSmsRouteSafetyEnvelopeSignal) {
  return (
    safetyEnvelope?.present === true &&
    safetyEnvelope.mode === "simulation_only" &&
    safetyEnvelope.executionBlocked === true &&
    safetyEnvelope.providerDisabled === true &&
    safetyEnvelope.liveExecutionEnabled === false
  );
}

export function assertSendSmsRouteSafetySmokeInvariants(
  result: Pick<SendSmsRouteSafetySmokeResult, "sent" | "providerCalled" | "canSendNow" | "simulationOnly" | "liveTestReady">,
): SendSmsRouteSafetySmokeInvariantCheck {
  const reasonCodes: SendSmsRouteSafetySmokeInvariantCheck["reasonCodes"] = [];

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

export function summarizeSendSmsRouteSafetySmoke(result: SendSmsRouteSafetySmokeResult) {
  const invariantCheck = assertSendSmsRouteSafetySmokeInvariants(result);

  return (
    `send-sms static route safety smoke ${result.passed ? "passed" : "failed"}. ` +
    `${result.blockingFindings.length} blocking findings and ${result.advisoryFindings.length} advisory findings are present. ` +
    `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "Passing this smoke contract does not authorize live execution, provider calls, env reads, DB writes, or automation execution."
  );
}

export function createSendSmsRouteSafetySmokeContract(
  input: SendSmsRouteSafetySmokeInput = {},
): SendSmsRouteSafetySmokeResult {
  const reasonCodes: string[] = [];
  const blockingFindings: string[] = [];
  const advisoryFindings: string[] = [];

  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectExternalReasonCodes(input.safetyEnvelope?.reasonCodes, reasonCodes);
  addReason(reasonCodes, "static_contract_only");

  if (input.routeSnapshotProvided !== true) {
    addReason(reasonCodes, "route_snapshot_missing");
    addBlocking(blockingFindings, "Static route safety snapshot was not provided.");
  }

  if (input.sent === true) {
    addReason(reasonCodes, "sent_must_be_false");
    addBlocking(blockingFindings, "Static route signal indicates sent:true.");
  }
  if (input.providerCalled === true) {
    addReason(reasonCodes, "provider_called_must_be_false");
    addBlocking(blockingFindings, "Static route signal indicates providerCalled:true.");
  }
  if (input.canSendNow === true) {
    addReason(reasonCodes, "can_send_now_must_be_false");
    addBlocking(blockingFindings, "Static route signal indicates canSendNow:true.");
  }
  if (input.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addBlocking(blockingFindings, "Static route signal is not simulation-only.");
  }
  if (input.liveTestReady === true) {
    addReason(reasonCodes, "live_test_ready_must_be_false");
    addBlocking(blockingFindings, "Static route signal indicates liveTestReady:true.");
  }

  if (input.providerExecutionBlocked === true) {
    addReason(reasonCodes, "provider_execution_blocked");
  } else {
    addReason(reasonCodes, "provider_execution_detected");
    addBlocking(blockingFindings, "Provider execution is not statically blocked.");
  }

  if (input.twilioActivationAbsent === true) {
    addReason(reasonCodes, "twilio_activation_absent");
  } else {
    addReason(reasonCodes, "twilio_activation_detected");
    addBlocking(blockingFindings, "Twilio activation is not statically absent.");
  }

  if (input.envSecretReadsAbsent === true) {
    addReason(reasonCodes, "env_secret_reads_absent");
  } else {
    addReason(reasonCodes, "env_secret_read_detected");
    addBlocking(blockingFindings, "Provider/env secret reads are not statically absent.");
  }

  if (input.fetchNetworkCallsAbsent === true) {
    addReason(reasonCodes, "fetch_network_calls_absent");
  } else {
    addReason(reasonCodes, "fetch_network_call_detected");
    addBlocking(blockingFindings, "Fetch or network provider calls are not statically absent.");
  }

  if (input.dbPrismaMutationAbsent === true) {
    addReason(reasonCodes, "db_prisma_mutation_absent");
  } else {
    addReason(reasonCodes, "db_prisma_mutation_detected");
    addBlocking(blockingFindings, "DB or Prisma mutation is not statically absent.");
  }

  if (input.automationCycleActivationAbsent === true) {
    addReason(reasonCodes, "automation_cycle_activation_absent");
  } else {
    addReason(reasonCodes, "automation_cycle_activation_detected");
    addBlocking(blockingFindings, "Automation cycle activation is not statically absent.");
  }

  if (isSafetyEnvelopeValid(input.safetyEnvelope)) {
    addReason(reasonCodes, "safety_envelope_present");
  } else {
    addReason(reasonCodes, "safety_envelope_missing");
    addBlocking(blockingFindings, "Route safety envelope is missing or does not preserve simulation-only blocking.");
  }

  if (input.validationErrorPathsPreserveInvariants === true) {
    addReason(reasonCodes, "validation_error_paths_preserve_invariants");
  } else {
    addReason(reasonCodes, "validation_error_invariants_missing");
    addBlocking(blockingFindings, "Validation or error paths do not statically preserve safety invariants.");
  }

  if (input.liveExecutionBranchAbsent === true) {
    addReason(reasonCodes, "live_execution_branch_absent");
  } else {
    addReason(reasonCodes, "live_execution_branch_detected");
    addBlocking(blockingFindings, "A live execution branch is not statically absent.");
  }

  addReason(reasonCodes, "passed_does_not_authorize_live_execution");
  addAdvisory(advisoryFindings, "Static smoke contract only; it does not execute the route or authorize live sending.");

  return {
    passed: blockingFindings.length === 0,
    route: "send-sms",
    smokeLevel: "static_contract",
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    reasonCodes,
    blockingFindings,
    advisoryFindings,
  };
}
