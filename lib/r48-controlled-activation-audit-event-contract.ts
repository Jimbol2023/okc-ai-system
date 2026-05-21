export type R48ActivationAuditEventStatus =
  | "prohibited"
  | "blocked"
  | "rejected"
  | "recorded_simulation_only"
  | "recorded_planning_only";

export type R48ActivationAuditDecision =
  | "prohibited"
  | "blocked"
  | "dry_run_rejected"
  | "dry_run_ready"
  | "simulation_only_ready"
  | "planning_only"
  | "missing";

export type R48ActivationAuditReasonCode =
  | "r48h_audit_event_contract_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "input_missing"
  | "decision_missing"
  | "decision_prohibited"
  | "decision_blocked"
  | "decision_rejected"
  | "attempted_execution_indicator_detected"
  | "secret_redaction_applied"
  | "phone_value_masked"
  | "message_body_summarized"
  | "persistence_recommended_later"
  | "no_db_write_performed"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false";

export type R48ActivationAuditEventInput = {
  eventType?: string | null;
  eventStatus?: R48ActivationAuditEventStatus;
  decision?: R48ActivationAuditDecision;
  reasonCodes?: string[];
  operatorReviewRequired?: boolean;
  providerBoundaryStatus?: string | null;
  killSwitchStatus?: string | null;
  allowlistStatus?: string | null;
  persistenceRecommended?: boolean;
  createdAt?: string | null;
  metadata?: Record<string, unknown>;
  phone?: string | null;
  messageBody?: string | null;
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
};

export type R48ActivationAuditEventRecord = {
  eventType: string;
  eventStatus: R48ActivationAuditEventStatus;
  decision: R48ActivationAuditDecision;
  reasonCodes: string[];
  operatorReviewRequired: boolean;
  providerBoundaryStatus: string;
  killSwitchStatus: string;
  allowlistStatus: string;
  simulationOnly: true;
  activationExecuted: false;
  liveExecutionAllowed: false;
  providerActivationAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  liveTestReady: false;
  secretRedactionApplied: true;
  persistenceRecommended: boolean;
  persistenceExecuted: false;
  createdAtSource: "provided" | "omitted";
  createdAt: string | null;
  sanitizedMetadata: Record<string, string | number | boolean | null>;
  maskedPhone: string | null;
  messageSummary: string | null;
  prohibitedFindings: string[];
  advisoryFindings: string[];
  summary: string;
};

export type R48ActivationAuditEventInvariantCheck = {
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

const maxListItems = 80;
const maxTextLength = 180;
const maxSummaryLength = 700;
const maxMessageSummaryLength = 120;
const defaultText = "unspecified";
const secretPattern = /\b(api[_-]?key|secret|token|password|bearer|database_url|direct_url|credential|authorization|auth)\b/i;
const phonePattern = /\+?\d[\d\s().-]{7,}\d/g;

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length <= maxTextLength) return normalizedValue;

  return `${normalizedValue.slice(0, maxTextLength)}...`;
}

function sanitizeText(value?: string | null) {
  const boundedValue = boundText(value);

  if (!boundedValue) return defaultText;
  if (secretPattern.test(boundedValue)) return "[REDACTED]";

  return maskPhoneValues(boundedValue);
}

function maskPhoneValues(value: string) {
  return value.replace(phonePattern, (match) => maskPhone(match) ?? "***-***-****");
}

function maskPhone(value?: string | null) {
  const digits = normalizeText(value).replace(/\D/g, "");

  if (!digits) return null;
  if (digits.length <= 4) return "****";

  return `***-***-${digits.slice(-4)}`;
}

function summarizeMessageBody(value?: string | null) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) return null;

  const maskedValue = maskPhoneValues(normalizedValue).replace(secretPattern, "[REDACTED]");

  if (maskedValue.length <= maxMessageSummaryLength) return maskedValue;

  return `${maskedValue.slice(0, maxMessageSummaryLength)}...`;
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

function addReason(reasonCodes: string[], reasonCode: R48ActivationAuditReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function addProhibited(prohibitedFindings: string[], finding: string) {
  addUnique(prohibitedFindings, finding);
}

function addAdvisory(advisoryFindings: string[], finding: string) {
  addUnique(advisoryFindings, finding);
}

function collectExternalReasonCodes(reasonCodes: string[] | undefined, target: string[]) {
  for (const reasonCode of reasonCodes ?? []) {
    addUnique(target, sanitizeText(reasonCode));
  }
}

function sanitizeMetadata(metadata?: Record<string, unknown>) {
  const sanitizedMetadata: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(metadata ?? {}).slice(0, maxListItems)) {
    if (secretPattern.test(key)) {
      sanitizedMetadata[boundText(key) || defaultText] = "[REDACTED]";
      continue;
    }

    if (typeof value === "string") {
      sanitizedMetadata[boundText(key) || defaultText] = sanitizeText(value);
    } else if (typeof value === "number" || typeof value === "boolean" || value === null) {
      sanitizedMetadata[boundText(key) || defaultText] = value;
    } else {
      sanitizedMetadata[boundText(key) || defaultText] = "[OMITTED_NON_PRIMITIVE]";
    }
  }

  return sanitizedMetadata;
}

function metadataContainsSecretLikeFields(metadata?: Record<string, unknown>) {
  return Object.entries(metadata ?? {}).some(([key, value]) => {
    return secretPattern.test(key) || (typeof value === "string" && secretPattern.test(value));
  });
}

function metadataContainsPhoneLikeValues(metadata?: Record<string, unknown>) {
  return Object.values(metadata ?? {}).some((value) => typeof value === "string" && phonePattern.test(value));
}

function decisionToEventStatus(decision: R48ActivationAuditDecision): R48ActivationAuditEventStatus {
  if (decision === "prohibited") return "prohibited";
  if (decision === "blocked") return "blocked";
  if (decision === "dry_run_rejected") return "rejected";
  if (decision === "planning_only") return "recorded_planning_only";
  if (decision === "dry_run_ready" || decision === "simulation_only_ready") return "recorded_simulation_only";

  return "blocked";
}

export function assertR48ActivationAuditEventInvariants(
  result: Pick<
    R48ActivationAuditEventRecord,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
  >,
): R48ActivationAuditEventInvariantCheck {
  const reasonCodes: R48ActivationAuditEventInvariantCheck["reasonCodes"] = [];

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

export function summarizeR48ActivationAuditEvent(result: R48ActivationAuditEventRecord) {
  const invariantCheck = assertR48ActivationAuditEventInvariants(result);

  return boundSummary(
    `R48H audit event ${result.eventType} is ${result.eventStatus} for decision ${result.decision}. ` +
      `${result.reasonCodes.length} reason codes and ${result.prohibitedFindings.length} prohibited findings are recorded. ` +
      `Persistence recommended: ${result.persistenceRecommended}. Secret redaction applied: ${result.secretRedactionApplied}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Audit event is contract-only; no DB write, provider activation, live execution, SMS/email send, env read, network call, route execution, or automation activation is authorized.",
  );
}

export function createR48ControlledActivationAuditEvent(
  input: R48ActivationAuditEventInput = {},
): R48ActivationAuditEventRecord {
  const reasonCodes: string[] = [];
  const prohibitedFindings: string[] = [];
  const advisoryFindings: string[] = [];
  const decision = input.decision ?? "missing";
  const eventStatus = input.eventStatus ?? decisionToEventStatus(decision);
  const sanitizedMetadata = sanitizeMetadata(input.metadata);
  const maskedPhone = maskPhone(input.phone);
  const messageSummary = summarizeMessageBody(input.messageBody);

  addReason(reasonCodes, "r48h_audit_event_contract_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  addReason(reasonCodes, "secret_redaction_applied");
  addReason(reasonCodes, "no_db_write_performed");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);

  if (Object.keys(input).length === 0) {
    addReason(reasonCodes, "input_missing");
    addProhibited(prohibitedFindings, "Audit event input is missing.");
  }

  if (!input.decision) {
    addReason(reasonCodes, "decision_missing");
    addProhibited(prohibitedFindings, "Audit event decision is missing.");
  } else if (input.decision === "prohibited") {
    addReason(reasonCodes, "decision_prohibited");
    addProhibited(prohibitedFindings, "Audit decision is prohibited.");
  } else if (input.decision === "blocked") {
    addReason(reasonCodes, "decision_blocked");
    addProhibited(prohibitedFindings, "Audit decision is blocked.");
  } else if (input.decision === "dry_run_rejected") {
    addReason(reasonCodes, "decision_rejected");
    addProhibited(prohibitedFindings, "Audit decision rejected the dry-run.");
  }

  if (input.activationExecuted === true) {
    addReason(reasonCodes, "activation_executed_must_be_false");
    addReason(reasonCodes, "attempted_execution_indicator_detected");
    addProhibited(prohibitedFindings, "Input indicates activationExecuted:true.");
  }
  if (input.providerActivationAllowed === true) {
    addReason(reasonCodes, "provider_activation_allowed_must_be_false");
    addReason(reasonCodes, "attempted_execution_indicator_detected");
    addProhibited(prohibitedFindings, "Input indicates providerActivationAllowed:true.");
  }
  if (input.liveExecutionAllowed === true) {
    addReason(reasonCodes, "live_execution_allowed_must_be_false");
    addReason(reasonCodes, "attempted_execution_indicator_detected");
    addProhibited(prohibitedFindings, "Input indicates liveExecutionAllowed:true.");
  }
  if (input.sent === true) {
    addReason(reasonCodes, "sent_must_be_false");
    addReason(reasonCodes, "attempted_execution_indicator_detected");
    addProhibited(prohibitedFindings, "Input indicates sent:true.");
  }
  if (input.providerCalled === true) {
    addReason(reasonCodes, "provider_called_must_be_false");
    addReason(reasonCodes, "attempted_execution_indicator_detected");
    addProhibited(prohibitedFindings, "Input indicates providerCalled:true.");
  }
  if (input.canSendNow === true) {
    addReason(reasonCodes, "can_send_now_must_be_false");
    addReason(reasonCodes, "attempted_execution_indicator_detected");
    addProhibited(prohibitedFindings, "Input indicates canSendNow:true.");
  }
  if (input.simulationOnly !== true) {
    addReason(reasonCodes, "simulation_only_required");
    addProhibited(prohibitedFindings, "Input is not simulation-only.");
  }
  if (input.liveTestReady === true) {
    addReason(reasonCodes, "live_test_ready_must_be_false");
    addReason(reasonCodes, "attempted_execution_indicator_detected");
    addProhibited(prohibitedFindings, "Input indicates liveTestReady:true.");
  }

  if (metadataContainsSecretLikeFields(input.metadata)) {
    addReason(reasonCodes, "secret_redaction_applied");
    addAdvisory(advisoryFindings, "Secret-like metadata was redacted.");
  }
  if (metadataContainsPhoneLikeValues(input.metadata) || maskedPhone || phonePattern.test(normalizeText(input.messageBody))) {
    addReason(reasonCodes, "phone_value_masked");
    addAdvisory(advisoryFindings, "Phone-like values were masked.");
  }
  if (messageSummary) {
    addReason(reasonCodes, "message_body_summarized");
    addAdvisory(advisoryFindings, "Message body was summarized and sanitized.");
  }
  if (input.persistenceRecommended === true) {
    addReason(reasonCodes, "persistence_recommended_later");
  }

  addAdvisory(advisoryFindings, "R48H produces a sanitized future audit record only and performs no persistence.");

  const result: R48ActivationAuditEventRecord = {
    eventType: sanitizeText(input.eventType) || "r48_controlled_activation_audit_event",
    eventStatus,
    decision,
    reasonCodes,
    operatorReviewRequired: input.operatorReviewRequired === true || prohibitedFindings.length > 0,
    providerBoundaryStatus: sanitizeText(input.providerBoundaryStatus),
    killSwitchStatus: sanitizeText(input.killSwitchStatus),
    allowlistStatus: sanitizeText(input.allowlistStatus),
    simulationOnly: true,
    activationExecuted: false,
    liveExecutionAllowed: false,
    providerActivationAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    liveTestReady: false,
    secretRedactionApplied: true,
    persistenceRecommended: input.persistenceRecommended === true && prohibitedFindings.length === 0,
    persistenceExecuted: false,
    createdAtSource: normalizeText(input.createdAt) ? "provided" : "omitted",
    createdAt: normalizeText(input.createdAt) || null,
    sanitizedMetadata,
    maskedPhone,
    messageSummary,
    prohibitedFindings,
    advisoryFindings,
    summary: "R48H controlled activation audit event contract only.",
  };

  return {
    ...result,
    summary: summarizeR48ActivationAuditEvent(result),
  };
}
