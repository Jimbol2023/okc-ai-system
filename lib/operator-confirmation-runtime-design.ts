import type { LiveTestRuntimeContractPreview } from "@/lib/live-test-runtime-contract-adapter";

export type OperatorConfirmationState =
  | "not_requested"
  | "missing_operator_confirmation"
  | "operator_confirmed_simulation_only"
  | "confirmation_expired"
  | "confirmation_mismatch"
  | "blocked_by_runtime_contract"
  | "invalid_confirmation_context";

export type OperatorConfirmationReasonCode =
  | "operator_confirmation_not_requested"
  | "operator_confirmation_missing"
  | "operator_confirmation_intent_missing"
  | "operator_confirmation_intent_invalid"
  | "operator_confirmation_action_fingerprint_missing"
  | "expected_action_fingerprint_missing"
  | "operator_confirmation_action_mismatch"
  | "operator_confirmation_context_mismatch"
  | "operator_confirmation_timestamp_missing"
  | "operator_confirmation_timestamp_invalid"
  | "operator_confirmation_expiration_missing"
  | "operator_confirmation_expired"
  | "runtime_contract_missing"
  | "runtime_contract_blocked"
  | "runtime_contract_not_adapter_only"
  | "runtime_contract_sent_must_be_false"
  | "runtime_contract_provider_called_must_be_false"
  | "runtime_contract_can_send_now_must_be_false"
  | "runtime_contract_simulation_only_required"
  | "operator_confirmation_valid_for_simulation_only"
  | "live_execution_not_available";

export type OperatorConfirmationRuntimeInput = {
  runtimeContract?: Pick<
    LiveTestRuntimeContractPreview,
    | "ok"
    | "adapterOnly"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "reasonCodes"
    | "safetySummary"
  >;
  confirmationRequested?: boolean;
  operatorConfirmed?: boolean;
  operatorId?: string;
  confirmationIntent?: "confirm_simulated_live_test_action" | string | null;
  expectedActionFingerprint?: string;
  confirmationActionFingerprint?: string;
  expectedConfirmationContextId?: string;
  confirmationContextId?: string;
  confirmationCreatedAtMs?: number;
  evaluatedAtMs?: number;
  expiresAfterMs?: number;
};

export type OperatorConfirmationAuditSummary = {
  nonSecret: true;
  advisoryOnly: true;
  simulationOnly: true;
  operatorId: string;
  confirmationIntent: string;
  expectedActionFingerprint: string;
  confirmationActionFingerprint: string;
  expectedConfirmationContextId: string;
  confirmationContextId: string;
  confirmationCreatedAtMs: number | null;
  evaluatedAtMs: number | null;
  expiresAtMs: number | null;
  runtimeContractOk: boolean;
  runtimeReasonCodes: string[];
  safetySummary: string;
};

export type OperatorConfirmationRuntimeResult = {
  operatorConfirmed: boolean;
  confirmationValid: boolean;
  state: OperatorConfirmationState;
  canProceedToLiveTest: false;
  simulationOnly: true;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  reasonCodes: OperatorConfirmationReasonCode[];
  auditSummary: OperatorConfirmationAuditSummary;
};

export type OperatorConfirmationInvariantCheck = {
  passed: boolean;
  reasonCodes: Array<
    | "can_proceed_to_live_test_must_be_false"
    | "simulation_only_required"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
  >;
};

const validConfirmationIntent = "confirm_simulated_live_test_action";
const maxTextLength = 120;

function addReason(reasonCodes: OperatorConfirmationReasonCode[], reasonCode: OperatorConfirmationReasonCode) {
  if (!reasonCodes.includes(reasonCode)) {
    reasonCodes.push(reasonCode);
  }
}

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const trimmedValue = normalizeText(value);

  if (trimmedValue.length <= maxTextLength) return trimmedValue;

  return `${trimmedValue.slice(0, maxTextLength)}...`;
}

function isFiniteNonNegativeNumber(value?: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function normalizeTimestamp(value?: number): number | null {
  return isFiniteNonNegativeNumber(value) ? (value as number) : null;
}

function resolveState({
  confirmationRequested,
  operatorConfirmed,
  runtimeContractBlocked,
  invalidContext,
  expired,
  mismatch,
  valid,
}: {
  confirmationRequested: boolean;
  operatorConfirmed: boolean;
  runtimeContractBlocked: boolean;
  invalidContext: boolean;
  expired: boolean;
  mismatch: boolean;
  valid: boolean;
}): OperatorConfirmationState {
  if (!confirmationRequested) return "not_requested";
  if (runtimeContractBlocked) return "blocked_by_runtime_contract";
  if (!operatorConfirmed) return "missing_operator_confirmation";
  if (invalidContext) return "invalid_confirmation_context";
  if (expired) return "confirmation_expired";
  if (mismatch) return "confirmation_mismatch";
  if (valid) return "operator_confirmed_simulation_only";

  return "invalid_confirmation_context";
}

export function assertOperatorConfirmationRuntimeInvariants(
  result: Pick<
    OperatorConfirmationRuntimeResult,
    "canProceedToLiveTest" | "simulationOnly" | "sent" | "providerCalled" | "canSendNow"
  >,
): OperatorConfirmationInvariantCheck {
  const reasonCodes: OperatorConfirmationInvariantCheck["reasonCodes"] = [];

  if (result.canProceedToLiveTest !== false) reasonCodes.push("can_proceed_to_live_test_must_be_false");
  if (result.simulationOnly !== true) reasonCodes.push("simulation_only_required");
  if (result.sent !== false) reasonCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) reasonCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) reasonCodes.push("can_send_now_must_be_false");

  return {
    passed: reasonCodes.length === 0,
    reasonCodes,
  };
}

export function summarizeOperatorConfirmationRuntimeDesign(result: OperatorConfirmationRuntimeResult) {
  const invariantCheck = assertOperatorConfirmationRuntimeInvariants(result);

  return (
    `Operator confirmation state is ${result.state}. ` +
    `Confirmation valid: ${result.confirmationValid}. ` +
    `Runtime invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "No SMS, email, provider call, live execution, automation execution, env read, DB write, or audit persistence occurred."
  );
}

export function createOperatorConfirmationRuntimeDesign(
  input: OperatorConfirmationRuntimeInput,
): OperatorConfirmationRuntimeResult {
  const reasonCodes: OperatorConfirmationReasonCode[] = [];
  const runtimeContract = input.runtimeContract;
  const confirmationRequested = input.confirmationRequested === true;
  const operatorConfirmed = input.operatorConfirmed === true;
  const confirmationIntent = normalizeText(input.confirmationIntent);
  const expectedActionFingerprint = normalizeText(input.expectedActionFingerprint);
  const confirmationActionFingerprint = normalizeText(input.confirmationActionFingerprint);
  const expectedConfirmationContextId = normalizeText(input.expectedConfirmationContextId);
  const confirmationContextId = normalizeText(input.confirmationContextId);
  const hasExpectedContext = Boolean(expectedConfirmationContextId);
  const hasConfirmationContext = Boolean(confirmationContextId);
  const runtimeContractMissing = !runtimeContract;
  const runtimeContractBlocked =
    runtimeContractMissing ||
    runtimeContract.ok !== true ||
    runtimeContract.adapterOnly !== true ||
    runtimeContract.sent !== false ||
    runtimeContract.providerCalled !== false ||
    runtimeContract.canSendNow !== false ||
    runtimeContract.simulationOnly !== true;
  const hasValidTimestampInputs =
    isFiniteNonNegativeNumber(input.confirmationCreatedAtMs) &&
    isFiniteNonNegativeNumber(input.evaluatedAtMs) &&
    isFiniteNonNegativeNumber(input.expiresAfterMs);
  const confirmationCreatedAtMs = normalizeTimestamp(input.confirmationCreatedAtMs);
  const evaluatedAtMs = normalizeTimestamp(input.evaluatedAtMs);
  const expiresAfterMs = normalizeTimestamp(input.expiresAfterMs);
  const expiresAtMs = hasValidTimestampInputs
    ? (confirmationCreatedAtMs as number) + (expiresAfterMs as number)
    : null;
  const expired = expiresAtMs !== null && (evaluatedAtMs as number) > expiresAtMs;
  const fingerprintMismatch =
    Boolean(expectedActionFingerprint && confirmationActionFingerprint) &&
    expectedActionFingerprint !== confirmationActionFingerprint;
  const contextMismatch =
    hasExpectedContext && hasConfirmationContext && expectedConfirmationContextId !== confirmationContextId;

  if (!confirmationRequested) addReason(reasonCodes, "operator_confirmation_not_requested");
  if (confirmationRequested && !operatorConfirmed) addReason(reasonCodes, "operator_confirmation_missing");
  if (confirmationRequested && !confirmationIntent) addReason(reasonCodes, "operator_confirmation_intent_missing");
  if (confirmationIntent && confirmationIntent !== validConfirmationIntent) {
    addReason(reasonCodes, "operator_confirmation_intent_invalid");
  }
  if (confirmationRequested && !confirmationActionFingerprint) {
    addReason(reasonCodes, "operator_confirmation_action_fingerprint_missing");
  }
  if (confirmationRequested && !expectedActionFingerprint) addReason(reasonCodes, "expected_action_fingerprint_missing");
  if (fingerprintMismatch) addReason(reasonCodes, "operator_confirmation_action_mismatch");
  if (contextMismatch || (hasExpectedContext && !hasConfirmationContext)) {
    addReason(reasonCodes, "operator_confirmation_context_mismatch");
  }
  if (confirmationRequested && !isFiniteNonNegativeNumber(input.confirmationCreatedAtMs)) {
    addReason(reasonCodes, "operator_confirmation_timestamp_missing");
  }
  if (confirmationRequested && !isFiniteNonNegativeNumber(input.evaluatedAtMs)) {
    addReason(reasonCodes, "operator_confirmation_timestamp_missing");
  }
  if (confirmationRequested && !isFiniteNonNegativeNumber(input.expiresAfterMs)) {
    addReason(reasonCodes, "operator_confirmation_expiration_missing");
  }
  if (
    input.confirmationCreatedAtMs !== undefined &&
    input.evaluatedAtMs !== undefined &&
    confirmationCreatedAtMs !== null &&
    evaluatedAtMs !== null &&
    confirmationCreatedAtMs > evaluatedAtMs
  ) {
    addReason(reasonCodes, "operator_confirmation_timestamp_invalid");
  }
  if (expired) addReason(reasonCodes, "operator_confirmation_expired");
  if (runtimeContractMissing) addReason(reasonCodes, "runtime_contract_missing");
  if (runtimeContract?.ok !== true) addReason(reasonCodes, "runtime_contract_blocked");
  if (runtimeContract && runtimeContract.adapterOnly !== true) addReason(reasonCodes, "runtime_contract_not_adapter_only");
  if (runtimeContract && runtimeContract.sent !== false) addReason(reasonCodes, "runtime_contract_sent_must_be_false");
  if (runtimeContract && runtimeContract.providerCalled !== false) {
    addReason(reasonCodes, "runtime_contract_provider_called_must_be_false");
  }
  if (runtimeContract && runtimeContract.canSendNow !== false) {
    addReason(reasonCodes, "runtime_contract_can_send_now_must_be_false");
  }
  if (runtimeContract && runtimeContract.simulationOnly !== true) {
    addReason(reasonCodes, "runtime_contract_simulation_only_required");
  }

  const invalidContext =
    !confirmationIntent ||
    confirmationIntent !== validConfirmationIntent ||
    !expectedActionFingerprint ||
    !confirmationActionFingerprint ||
    !hasValidTimestampInputs ||
    (confirmationCreatedAtMs !== null && evaluatedAtMs !== null && confirmationCreatedAtMs > evaluatedAtMs);
  const mismatch = fingerprintMismatch || contextMismatch || (hasExpectedContext && !hasConfirmationContext);
  const confirmationValid =
    confirmationRequested &&
    operatorConfirmed &&
    !runtimeContractBlocked &&
    !invalidContext &&
    !mismatch &&
    !expired;

  if (confirmationValid) addReason(reasonCodes, "operator_confirmation_valid_for_simulation_only");
  addReason(reasonCodes, "live_execution_not_available");

  const state = resolveState({
    confirmationRequested,
    operatorConfirmed,
    runtimeContractBlocked,
    invalidContext,
    expired,
    mismatch,
    valid: confirmationValid,
  });
  const result: OperatorConfirmationRuntimeResult = {
    operatorConfirmed,
    confirmationValid,
    state,
    canProceedToLiveTest: false,
    simulationOnly: true,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    reasonCodes,
    auditSummary: {
      nonSecret: true,
      advisoryOnly: true,
      simulationOnly: true,
      operatorId: boundText(input.operatorId),
      confirmationIntent: boundText(input.confirmationIntent),
      expectedActionFingerprint: boundText(input.expectedActionFingerprint),
      confirmationActionFingerprint: boundText(input.confirmationActionFingerprint),
      expectedConfirmationContextId: boundText(input.expectedConfirmationContextId),
      confirmationContextId: boundText(input.confirmationContextId),
      confirmationCreatedAtMs,
      evaluatedAtMs,
      expiresAtMs,
      runtimeContractOk: runtimeContract?.ok === true,
      runtimeReasonCodes: runtimeContract?.reasonCodes ?? ["runtime_contract_missing"],
      safetySummary: "Operator confirmation runtime design is advisory only. Confirmation cannot send or call providers in R47D.",
    },
  };

  return {
    ...result,
    auditSummary: {
      ...result.auditSummary,
      safetySummary: summarizeOperatorConfirmationRuntimeDesign(result),
    },
  };
}
