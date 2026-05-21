export type AuditPersistenceReadinessState =
  | "not_configured"
  | "planning_only"
  | "ready_for_future_persistence"
  | "blocked_missing_event"
  | "blocked_secret_detected"
  | "blocked_unbounded_payload"
  | "blocked_runtime_execution"
  | "blocked_provider_execution"
  | "blocked_invalid_context";

export type AuditPersistenceReasonCode =
  | "persistence_not_configured"
  | "audit_persistence_planning_only"
  | "missing_event_type"
  | "missing_action_identity"
  | "secret_like_field_detected"
  | "secret_like_value_detected"
  | "unbounded_metadata_detected"
  | "unbounded_reason_codes_detected"
  | "unbounded_string_detected"
  | "unsupported_value_detected"
  | "runtime_sent_blocked"
  | "provider_called_blocked"
  | "can_send_now_blocked"
  | "simulation_only_required"
  | "safe_for_future_persistence_preview"
  | "persistence_not_executed"
  | "db_write_not_attempted";

export type AuditPersistencePrimitive = string | number | boolean | null | undefined;

export type AuditPersistenceMetadata = Record<string, AuditPersistencePrimitive>;

export type AuditPersistencePlanningInput = {
  configuredForFuturePersistence?: boolean;
  eventType?: string;
  actionId?: string;
  actionFingerprint?: string;
  leadId?: string;
  dealId?: string;
  operatorConfirmationState?: string;
  runtimeContractState?: string;
  simulationOnly?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  reasonCodes?: string[];
  createdAtMs?: number;
  metadata?: AuditPersistenceMetadata;
};

export type SafeFutureAuditPersistencePayload = {
  eventType: string;
  actionId: string;
  actionFingerprint: string;
  leadId: string;
  dealId: string;
  operatorConfirmationState: string;
  runtimeContractState: string;
  simulationOnly: true;
  providerCalled: false;
  sent: false;
  canSendNow: false;
  reasonCodes: string[];
  createdAtMs: number | null;
  metadata: Record<string, string | number | boolean | null>;
};

export type AuditPersistencePlanningResult = {
  persistencePlanned: boolean;
  persistenceExecuted: false;
  dbWriteAttempted: false;
  simulationOnly: true;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  readinessState: AuditPersistenceReadinessState;
  reasonCodes: AuditPersistenceReasonCode[];
  safePayloadPreview: SafeFutureAuditPersistencePayload | null;
  forbiddenFieldsDetected: string[];
  safetySummary: string;
};

export type AuditPersistencePlanningInvariantCheck = {
  passed: boolean;
  reasonCodes: Array<
    | "persistence_executed_must_be_false"
    | "db_write_attempted_must_be_false"
    | "simulation_only_required"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
  >;
};

const maxStringLength = 160;
const maxReasonCodes = 40;
const maxMetadataKeys = 30;
const maxKeyLength = 64;

const forbiddenKeyPattern =
  /(secret|token|password|credential|api[_-]?key|auth|twilio|sid|env|phone|recipient|message|body|provider[_-]?response|network[_-]?response|headers?|cookies?|stack|trace|autonomous|execution[_-]?trace)/i;
const forbiddenValuePattern =
  /(Bearer\s+[A-Za-z0-9._-]+|sk_(live|test)_[A-Za-z0-9_-]+|AC[a-f0-9]{32}|SG\.[A-Za-z0-9_-]+|\+?\d[\d\s().-]{7,}\d)/i;

function addReason(reasonCodes: AuditPersistenceReasonCode[], reasonCode: AuditPersistenceReasonCode) {
  if (!reasonCodes.includes(reasonCode)) {
    reasonCodes.push(reasonCode);
  }
}

function addForbiddenField(forbiddenFields: string[], field: string) {
  if (!forbiddenFields.includes(field)) {
    forbiddenFields.push(field);
  }
}

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function isBoundedText(value: string) {
  return value.trim().length <= maxStringLength;
}

function boundText(value?: string | null) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length <= maxStringLength) return normalizedValue;

  return `${normalizedValue.slice(0, maxStringLength)}...`;
}

function normalizeTimestamp(value?: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function scanTextValue(value: string) {
  return forbiddenValuePattern.test(value);
}

function scanMetadata(metadata: AuditPersistenceMetadata = {}) {
  const safeMetadata: Record<string, string | number | boolean | null> = {};
  const forbiddenFieldsDetected: string[] = [];
  const reasonCodes: AuditPersistenceReasonCode[] = [];
  const entries = Object.entries(metadata);

  if (entries.length > maxMetadataKeys) {
    addReason(reasonCodes, "unbounded_metadata_detected");
  }

  for (const [rawKey, rawValue] of entries.slice(0, maxMetadataKeys)) {
    const key = normalizeText(rawKey);

    if (!key || key.length > maxKeyLength) {
      addReason(reasonCodes, "unbounded_metadata_detected");
      addForbiddenField(forbiddenFieldsDetected, rawKey || "[empty_key]");
      continue;
    }

    if (forbiddenKeyPattern.test(key)) {
      addReason(reasonCodes, "secret_like_field_detected");
      addForbiddenField(forbiddenFieldsDetected, key);
      continue;
    }

    if (typeof rawValue === "string") {
      if (!isBoundedText(rawValue)) {
        addReason(reasonCodes, "unbounded_string_detected");
        addForbiddenField(forbiddenFieldsDetected, key);
        continue;
      }

      if (scanTextValue(rawValue)) {
        addReason(reasonCodes, "secret_like_value_detected");
        addForbiddenField(forbiddenFieldsDetected, key);
        continue;
      }

      safeMetadata[key] = rawValue.trim();
      continue;
    }

    if (typeof rawValue === "number") {
      if (!Number.isFinite(rawValue)) {
        addReason(reasonCodes, "unsupported_value_detected");
        addForbiddenField(forbiddenFieldsDetected, key);
        continue;
      }

      safeMetadata[key] = rawValue;
      continue;
    }

    if (typeof rawValue === "boolean" || rawValue === null) {
      safeMetadata[key] = rawValue;
      continue;
    }

    if (rawValue !== undefined) {
      addReason(reasonCodes, "unsupported_value_detected");
      addForbiddenField(forbiddenFieldsDetected, key);
    }
  }

  return {
    safeMetadata,
    forbiddenFieldsDetected,
    reasonCodes,
  };
}

function normalizeReasonCodes(reasonCodes?: string[]) {
  const normalizedReasonCodes: string[] = [];
  const planningReasonCodes: AuditPersistenceReasonCode[] = [];
  const forbiddenFieldsDetected: string[] = [];

  if ((reasonCodes ?? []).length > maxReasonCodes) {
    addReason(planningReasonCodes, "unbounded_reason_codes_detected");
    addForbiddenField(forbiddenFieldsDetected, "reasonCodes");
  }

  for (const reasonCode of (reasonCodes ?? []).slice(0, maxReasonCodes)) {
    const normalizedReasonCode = normalizeText(reasonCode);

    if (!normalizedReasonCode) continue;

    if (!isBoundedText(normalizedReasonCode)) {
      addReason(planningReasonCodes, "unbounded_string_detected");
      addForbiddenField(forbiddenFieldsDetected, "reasonCodes");
      continue;
    }

    if (scanTextValue(normalizedReasonCode)) {
      addReason(planningReasonCodes, "secret_like_value_detected");
      addForbiddenField(forbiddenFieldsDetected, "reasonCodes");
      continue;
    }

    if (!normalizedReasonCodes.includes(normalizedReasonCode)) {
      normalizedReasonCodes.push(normalizedReasonCode);
    }
  }

  return {
    normalizedReasonCodes,
    planningReasonCodes,
    forbiddenFieldsDetected,
  };
}

function determineReadinessState({
  configuredForFuturePersistence,
  hasBlockingReason,
  missingEvent,
  secretDetected,
  unboundedDetected,
  runtimeExecutionBlocked,
  providerExecutionBlocked,
}: {
  configuredForFuturePersistence: boolean;
  hasBlockingReason: boolean;
  missingEvent: boolean;
  secretDetected: boolean;
  unboundedDetected: boolean;
  runtimeExecutionBlocked: boolean;
  providerExecutionBlocked: boolean;
}): AuditPersistenceReadinessState {
  if (missingEvent) return "blocked_missing_event";
  if (secretDetected) return "blocked_secret_detected";
  if (unboundedDetected) return "blocked_unbounded_payload";
  if (runtimeExecutionBlocked) return "blocked_runtime_execution";
  if (providerExecutionBlocked) return "blocked_provider_execution";
  if (hasBlockingReason) return "blocked_invalid_context";
  if (!configuredForFuturePersistence) return "not_configured";

  return "ready_for_future_persistence";
}

export function assertAuditPersistencePlanningInvariants(
  result: Pick<
    AuditPersistencePlanningResult,
    "persistenceExecuted" | "dbWriteAttempted" | "simulationOnly" | "sent" | "providerCalled" | "canSendNow"
  >,
): AuditPersistencePlanningInvariantCheck {
  const reasonCodes: AuditPersistencePlanningInvariantCheck["reasonCodes"] = [];

  if (result.persistenceExecuted !== false) reasonCodes.push("persistence_executed_must_be_false");
  if (result.dbWriteAttempted !== false) reasonCodes.push("db_write_attempted_must_be_false");
  if (result.simulationOnly !== true) reasonCodes.push("simulation_only_required");
  if (result.sent !== false) reasonCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) reasonCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) reasonCodes.push("can_send_now_must_be_false");

  return {
    passed: reasonCodes.length === 0,
    reasonCodes,
  };
}

export function summarizeAuditPersistencePlanning(result: AuditPersistencePlanningResult) {
  const invariantCheck = assertAuditPersistencePlanningInvariants(result);

  return (
    `Audit persistence readiness is ${result.readinessState}. ` +
    `Future persistence planned: ${result.persistencePlanned}. ` +
    `Forbidden fields detected: ${result.forbiddenFieldsDetected.length}. ` +
    `Planning invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "No audit row was persisted, no DB write was attempted, and no SMS, email, provider call, env read, or live execution occurred."
  );
}

export function createAuditPersistencePlanning(input: AuditPersistencePlanningInput): AuditPersistencePlanningResult {
  const reasonCodes: AuditPersistenceReasonCode[] = [];
  const forbiddenFieldsDetected: string[] = [];
  const configuredForFuturePersistence = input.configuredForFuturePersistence === true;
  const eventType = boundText(input.eventType);
  const actionId = boundText(input.actionId);
  const actionFingerprint = boundText(input.actionFingerprint);
  const reasonCodeResult = normalizeReasonCodes(input.reasonCodes);
  const metadataResult = scanMetadata(input.metadata);

  if (!configuredForFuturePersistence) addReason(reasonCodes, "persistence_not_configured");
  addReason(reasonCodes, "audit_persistence_planning_only");
  if (!eventType) addReason(reasonCodes, "missing_event_type");
  if (!actionId && !actionFingerprint) addReason(reasonCodes, "missing_action_identity");
  if (input.sent === true) addReason(reasonCodes, "runtime_sent_blocked");
  if (input.providerCalled === true) addReason(reasonCodes, "provider_called_blocked");
  if (input.canSendNow === true) addReason(reasonCodes, "can_send_now_blocked");
  if (input.simulationOnly !== true) addReason(reasonCodes, "simulation_only_required");

  for (const reasonCode of reasonCodeResult.planningReasonCodes) addReason(reasonCodes, reasonCode);
  for (const reasonCode of metadataResult.reasonCodes) addReason(reasonCodes, reasonCode);
  for (const field of reasonCodeResult.forbiddenFieldsDetected) addForbiddenField(forbiddenFieldsDetected, field);
  for (const field of metadataResult.forbiddenFieldsDetected) addForbiddenField(forbiddenFieldsDetected, field);

  const secretDetected = reasonCodes.includes("secret_like_field_detected") || reasonCodes.includes("secret_like_value_detected");
  const unboundedDetected =
    reasonCodes.includes("unbounded_metadata_detected") ||
    reasonCodes.includes("unbounded_reason_codes_detected") ||
    reasonCodes.includes("unbounded_string_detected");
  const runtimeExecutionBlocked =
    reasonCodes.includes("runtime_sent_blocked") ||
    reasonCodes.includes("can_send_now_blocked") ||
    reasonCodes.includes("simulation_only_required");
  const providerExecutionBlocked = reasonCodes.includes("provider_called_blocked");
  const missingEvent = reasonCodes.includes("missing_event_type");
  const readinessState = determineReadinessState({
    configuredForFuturePersistence,
    hasBlockingReason: reasonCodes.includes("missing_action_identity"),
    missingEvent,
    secretDetected,
    unboundedDetected,
    runtimeExecutionBlocked,
    providerExecutionBlocked,
  });
  const persistencePlanned = readinessState === "ready_for_future_persistence";

  if (persistencePlanned) addReason(reasonCodes, "safe_for_future_persistence_preview");
  addReason(reasonCodes, "persistence_not_executed");
  addReason(reasonCodes, "db_write_not_attempted");

  const safePayloadPreview: SafeFutureAuditPersistencePayload | null = persistencePlanned
    ? {
        eventType,
        actionId,
        actionFingerprint,
        leadId: boundText(input.leadId),
        dealId: boundText(input.dealId),
        operatorConfirmationState: boundText(input.operatorConfirmationState),
        runtimeContractState: boundText(input.runtimeContractState),
        simulationOnly: true,
        providerCalled: false,
        sent: false,
        canSendNow: false,
        reasonCodes: reasonCodeResult.normalizedReasonCodes,
        createdAtMs: normalizeTimestamp(input.createdAtMs),
        metadata: metadataResult.safeMetadata,
      }
    : null;
  const result: AuditPersistencePlanningResult = {
    persistencePlanned,
    persistenceExecuted: false,
    dbWriteAttempted: false,
    simulationOnly: true,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    readinessState,
    reasonCodes,
    safePayloadPreview,
    forbiddenFieldsDetected,
    safetySummary: "Audit persistence planning only. No audit record was persisted and no DB write was attempted.",
  };

  return {
    ...result,
    safetySummary: summarizeAuditPersistencePlanning(result),
  };
}
