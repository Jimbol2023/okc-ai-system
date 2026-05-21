export type R50AuditPersistenceRecordStatus =
  | "not_persistable"
  | "shape_blocked"
  | "shape_ready_for_review"
  | "future_safe_shape_ready";

export type R50AuditPersistenceEventStatus =
  | "prohibited"
  | "blocked"
  | "rejected"
  | "recorded_simulation_only"
  | "recorded_planning_only"
  | "missing";

export type R50AuditPersistenceDecision =
  | "prohibited"
  | "blocked"
  | "dry_run_rejected"
  | "dry_run_ready"
  | "simulation_only_ready"
  | "planning_only"
  | "missing";

export type R50GovernanceStatus =
  | "stack_incomplete"
  | "activation_prohibited"
  | "remediation_required"
  | "operator_review_required"
  | "simulation_stack_complete"
  | "planning_stack_complete"
  | "missing";

export type R50AuditPersistenceRecordShapeReasonCode =
  | "r50b_record_shape_contract_only"
  | "input_missing"
  | "event_type_missing"
  | "event_status_missing"
  | "decision_missing"
  | "future_persistence_shape_only"
  | "advisory_only_required"
  | "secret_redaction_applied"
  | "forbidden_field_rejected"
  | "phone_value_masked"
  | "message_body_summarized"
  | "metadata_bounded"
  | "metadata_non_primitive_omitted"
  | "persistence_not_allowed_now"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false";

export type R50AuditPersistenceRecordShapeInput = {
  eventType?: string | null;
  eventStatus?: R50AuditPersistenceEventStatus;
  decision?: R50AuditPersistenceDecision;
  governanceStatus?: R50GovernanceStatus;
  reasonCodes?: string[];
  operatorReviewRequired?: boolean;
  providerBoundaryStatus?: string | null;
  killSwitchStatus?: string | null;
  allowlistStatus?: string | null;
  createdAt?: string | null;
  remainingBlockers?: string[];
  requiredOperatorActions?: string[];
  metadata?: Record<string, unknown>;
  phone?: string | null;
  messageBody?: string | null;
  forbiddenFields?: Record<string, unknown>;
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
};

export type R50AuditPersistenceRecordShapeResult = {
  recordStatus: R50AuditPersistenceRecordStatus;
  futureStorageTarget: "future_governance_audit_log" | "none";
  eventType: string;
  eventStatus: R50AuditPersistenceEventStatus;
  decision: R50AuditPersistenceDecision;
  governanceStatus: R50GovernanceStatus;
  reasonCodes: string[];
  operatorReviewRequired: boolean;
  providerBoundaryStatus: string;
  killSwitchStatus: string;
  allowlistStatus: string;
  advisoryOnly: true;
  simulationOnly: true;
  secretRedactionApplied: true;
  createdAtSource: "provided" | "omitted";
  createdAt: string | null;
  remainingBlockers: string[];
  requiredOperatorActions: string[];
  sanitizedMetadata: Record<string, string | number | boolean | null>;
  maskedPhoneSuffix: string | null;
  messageSummary: string | null;
  rejectedFieldNames: string[];
  prohibitedFindings: string[];
  advisoryFindings: string[];
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  liveTestReady: false;
  persistenceAllowedNow: false;
  summary: string;
};

export type R50AuditPersistenceRecordShapeInvariantCheck = {
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
const maxTextLength = 180;
const maxSummaryLength = 700;
const maxMessageSummaryLength = 140;
const defaultText = "unspecified";
const secretPattern = /\b(api[_-]?key|secret|token|password|bearer|database_url|direct_url|credential|authorization|auth|cookie|session)\b/i;
const phonePattern = /\+?\d[\d\s().-]{7,}\d/g;

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null, maxLength = maxTextLength) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length <= maxLength) return normalizedValue;

  return `${normalizedValue.slice(0, maxLength)}...`;
}

function maskPhone(value?: string | null) {
  const digits = normalizeText(value).replace(/\D/g, "");

  if (!digits) return null;
  if (digits.length <= 4) return "****";

  return `***-***-${digits.slice(-4)}`;
}

function maskPhoneValues(value: string) {
  return value.replace(phonePattern, (match) => maskPhone(match) ?? "***-***-****");
}

function sanitizeText(value?: string | null) {
  const boundedValue = boundText(value);

  if (!boundedValue) return defaultText;
  if (secretPattern.test(boundedValue)) return "[REDACTED]";

  return maskPhoneValues(boundedValue);
}

function summarizeMessageBody(value?: string | null) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) return null;

  const sanitizedValue = sanitizeText(normalizedValue);

  if (sanitizedValue.length <= maxMessageSummaryLength) return sanitizedValue;

  return `${sanitizedValue.slice(0, maxMessageSummaryLength)}...`;
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

function addReason(reasonCodes: string[], reasonCode: R50AuditPersistenceRecordShapeReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, sanitizeText(value));
  }

  return result;
}

function metadataContainsPhone(metadata?: Record<string, unknown>) {
  return Object.values(metadata ?? {}).some((value) => typeof value === "string" && phonePattern.test(value));
}

function sanitizeMetadata(metadata: Record<string, unknown> | undefined, reasonCodes: string[], advisoryFindings: string[]) {
  const sanitizedMetadata: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(metadata ?? {}).slice(0, maxListItems)) {
    const boundedKey = boundText(key) || defaultText;

    if (secretPattern.test(key)) {
      sanitizedMetadata[boundedKey] = "[REDACTED]";
      addReason(reasonCodes, "secret_redaction_applied");
      addUnique(advisoryFindings, "Secret-like metadata key was redacted.");
      continue;
    }

    if (typeof value === "string") {
      sanitizedMetadata[boundedKey] = sanitizeText(value);
      if (secretPattern.test(value)) {
        addReason(reasonCodes, "secret_redaction_applied");
        addUnique(advisoryFindings, "Secret-like metadata value was redacted.");
      }
      continue;
    }

    if (typeof value === "number" || typeof value === "boolean" || value === null) {
      sanitizedMetadata[boundedKey] = value;
      continue;
    }

    sanitizedMetadata[boundedKey] = "[OMITTED_NON_PRIMITIVE]";
    addReason(reasonCodes, "metadata_non_primitive_omitted");
    addUnique(advisoryFindings, "Non-primitive metadata value was omitted.");
  }

  if (Object.keys(metadata ?? {}).length > maxListItems) {
    addReason(reasonCodes, "metadata_bounded");
    addUnique(advisoryFindings, "Metadata was bounded to the maximum allowed field count.");
  }

  return sanitizedMetadata;
}

function collectRejectedFieldNames(input: R50AuditPersistenceRecordShapeInput) {
  const rejected = new Set<string>();
  const explicitForbiddenFieldNames = Object.keys(input.forbiddenFields ?? {});

  for (const fieldName of explicitForbiddenFieldNames) {
    rejected.add(sanitizeText(fieldName));
  }

  if (input.activationExecuted === true) rejected.add("activationExecuted");
  if (input.providerActivationAllowed === true) rejected.add("providerActivationAllowed");
  if (input.liveExecutionAllowed === true) rejected.add("liveExecutionAllowed");
  if (input.sent === true) rejected.add("sent");
  if (input.providerCalled === true) rejected.add("providerCalled");
  if (input.canSendNow === true) rejected.add("canSendNow");
  if (input.liveTestReady === true) rejected.add("liveTestReady");
  if (input.persistenceAllowedNow === true) rejected.add("persistenceAllowedNow");

  return Array.from(rejected).slice(0, maxListItems);
}

function inputHasExecutionIndicators(input: R50AuditPersistenceRecordShapeInput) {
  return (
    input.activationExecuted === true ||
    input.providerActivationAllowed === true ||
    input.liveExecutionAllowed === true ||
    input.sent === true ||
    input.providerCalled === true ||
    input.canSendNow === true ||
    input.liveTestReady === true ||
    input.persistenceAllowedNow === true
  );
}

export function assertR50AuditPersistenceRecordShapeInvariants(
  result: Pick<
    R50AuditPersistenceRecordShapeResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
    | "persistenceAllowedNow"
    | "advisoryOnly"
  >,
): R50AuditPersistenceRecordShapeInvariantCheck {
  const reasonCodes: R50AuditPersistenceRecordShapeInvariantCheck["reasonCodes"] = [];

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

export function summarizeR50AuditPersistenceRecordShape(result: R50AuditPersistenceRecordShapeResult) {
  const invariantCheck = assertR50AuditPersistenceRecordShapeInvariants(result);

  return boundSummary(
    `R50B audit persistence record shape is ${result.recordStatus}. ` +
      `${result.reasonCodes.length} reason codes, ${result.rejectedFieldNames.length} rejected field names, and ` +
      `${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Future storage target is ${result.futureStorageTarget}; persistence allowed now: ${result.persistenceAllowedNow}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Record shape is advisory-only and non-persistent; it cannot authorize DB writes, live execution, provider activation, sending, env reads, network calls, routes, or automation.",
  );
}

export function createR50AuditPersistenceRecordShape(
  input: R50AuditPersistenceRecordShapeInput = {},
): R50AuditPersistenceRecordShapeResult {
  const reasonCodes: string[] = [];
  const prohibitedFindings: string[] = [];
  const advisoryFindings: string[] = [];
  const rejectedFieldNames = collectRejectedFieldNames(input);
  const remainingBlockers = collectText(input.remainingBlockers);
  const requiredOperatorActions = collectText(input.requiredOperatorActions);
  const sanitizedMetadata = sanitizeMetadata(input.metadata, reasonCodes, advisoryFindings);
  const maskedPhoneSuffix = maskPhone(input.phone);
  const messageSummary = summarizeMessageBody(input.messageBody);

  addReason(reasonCodes, "r50b_record_shape_contract_only");
  addReason(reasonCodes, "future_persistence_shape_only");
  addReason(reasonCodes, "secret_redaction_applied");
  addReason(reasonCodes, "persistence_not_allowed_now");

  for (const reasonCode of input.reasonCodes ?? []) {
    addUnique(reasonCodes, sanitizeText(reasonCode));
  }

  if (Object.keys(input).length === 0) {
    addReason(reasonCodes, "input_missing");
    addUnique(prohibitedFindings, "Audit persistence record shape input is missing.");
  }

  if (!normalizeText(input.eventType)) {
    addReason(reasonCodes, "event_type_missing");
    addUnique(prohibitedFindings, "Event type is missing.");
  }
  if (!input.eventStatus) {
    addReason(reasonCodes, "event_status_missing");
    addUnique(prohibitedFindings, "Event status is missing.");
  }
  if (!input.decision) {
    addReason(reasonCodes, "decision_missing");
    addUnique(prohibitedFindings, "Decision is missing.");
  }
  if (input.advisoryOnly !== true) {
    addReason(reasonCodes, "advisory_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly advisory-only.");
  }
  if (input.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly simulation-only.");
  }
  if (inputHasExecutionIndicators(input)) {
    addUnique(prohibitedFindings, "Input contains execution, provider activation, live readiness, sending, or persistence indicators.");
  }
  if (input.activationExecuted === true) addReason(reasonCodes, "activation_executed_must_be_false");
  if (input.providerActivationAllowed === true) addReason(reasonCodes, "provider_activation_allowed_must_be_false");
  if (input.liveExecutionAllowed === true) addReason(reasonCodes, "live_execution_allowed_must_be_false");
  if (input.sent === true) addReason(reasonCodes, "sent_must_be_false");
  if (input.providerCalled === true) addReason(reasonCodes, "provider_called_must_be_false");
  if (input.canSendNow === true) addReason(reasonCodes, "can_send_now_must_be_false");
  if (input.liveTestReady === true) addReason(reasonCodes, "live_test_ready_must_be_false");

  if (input.persistenceAllowedNow === true) {
    addReason(reasonCodes, "persistence_not_allowed_now");
  }

  if (rejectedFieldNames.length > 0) {
    addReason(reasonCodes, "forbidden_field_rejected");
    addUnique(advisoryFindings, "Forbidden or execution-enabling fields were rejected from the shaped record.");
  }
  if (maskedPhoneSuffix || metadataContainsPhone(input.metadata) || phonePattern.test(normalizeText(input.messageBody))) {
    addReason(reasonCodes, "phone_value_masked");
    addUnique(advisoryFindings, "Phone-like values were masked.");
  }
  if (messageSummary) {
    addReason(reasonCodes, "message_body_summarized");
    addUnique(advisoryFindings, "Message body was summarized and sanitized.");
  }

  const recordStatus: R50AuditPersistenceRecordStatus =
    prohibitedFindings.length > 0
      ? "shape_blocked"
      : rejectedFieldNames.length > 0
        ? "shape_ready_for_review"
        : "future_safe_shape_ready";

  const result: R50AuditPersistenceRecordShapeResult = {
    recordStatus,
    futureStorageTarget: recordStatus === "future_safe_shape_ready" ? "future_governance_audit_log" : "none",
    eventType: sanitizeText(input.eventType) || "r50_governance_audit_event",
    eventStatus: input.eventStatus ?? "missing",
    decision: input.decision ?? "missing",
    governanceStatus: input.governanceStatus ?? "missing",
    reasonCodes,
    operatorReviewRequired: input.operatorReviewRequired === true || recordStatus !== "future_safe_shape_ready",
    providerBoundaryStatus: sanitizeText(input.providerBoundaryStatus),
    killSwitchStatus: sanitizeText(input.killSwitchStatus),
    allowlistStatus: sanitizeText(input.allowlistStatus),
    advisoryOnly: true,
    simulationOnly: true,
    secretRedactionApplied: true,
    createdAtSource: normalizeText(input.createdAt) ? "provided" : "omitted",
    createdAt: normalizeText(input.createdAt) || null,
    remainingBlockers,
    requiredOperatorActions,
    sanitizedMetadata,
    maskedPhoneSuffix,
    messageSummary,
    rejectedFieldNames,
    prohibitedFindings,
    advisoryFindings,
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    liveTestReady: false,
    persistenceAllowedNow: false,
    summary: "R50B audit persistence record shape contract only.",
  };

  return {
    ...result,
    summary: summarizeR50AuditPersistenceRecordShape(result),
  };
}
