export type R50RetentionExpiryPlanStatus =
  | "not_planned"
  | "retention_blocked"
  | "review_required"
  | "future_retention_plan_ready";

export type R50RetentionPolicyStatus =
  | "missing"
  | "bounded"
  | "unbounded_rejected"
  | "permanent_review_required";

export type R50ExpiryPolicyStatus = "missing" | "defined" | "blocked";

export type R50DeletionRollbackReviewStatus = "missing" | "review_required" | "reviewed";

export type R50RetentionExpiryReasonCode =
  | "r50c_retention_expiry_planning_contract_only"
  | "input_missing"
  | "retention_policy_missing"
  | "retention_window_unbounded"
  | "retention_window_exceeds_maximum"
  | "permanent_retention_review_required"
  | "expiry_policy_missing"
  | "deletion_rollback_review_missing"
  | "operator_review_required"
  | "secret_bearing_metadata_rejected"
  | "provider_payload_rejected"
  | "raw_phone_rejected"
  | "raw_message_body_rejected"
  | "metadata_bounded"
  | "metadata_non_primitive_omitted"
  | "future_retention_plan_only"
  | "persistence_not_allowed_now"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "advisory_only_required";

export type R50RetentionExpiryPlanningInput = {
  retentionWindowDays?: number | null;
  permanentRetentionRequested?: boolean;
  explicitFutureGovernanceReview?: boolean;
  expiryPolicyDefined?: boolean;
  deletionRollbackReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  reasonCodes?: string[];
  requiredOperatorActions?: string[];
  metadata?: Record<string, unknown>;
  providerPayload?: unknown;
  rawPhone?: string | null;
  rawMessageBody?: string | null;
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

export type R50RetentionExpiryPlanningResult = {
  planStatus: R50RetentionExpiryPlanStatus;
  retentionPolicyStatus: R50RetentionPolicyStatus;
  expiryPolicyStatus: R50ExpiryPolicyStatus;
  deletionRollbackReviewStatus: R50DeletionRollbackReviewStatus;
  retentionWindowDays: number | null;
  maximumRetentionWindowDays: number;
  permanentRetentionRequested: boolean;
  explicitFutureGovernanceReview: boolean;
  requiresOperatorReview: boolean;
  requiresExpiryPolicy: boolean;
  requiresDeletionRollbackReview: boolean;
  advisoryOnly: true;
  simulationOnly: true;
  persistenceAllowedNow: false;
  sanitizedMetadata: Record<string, string | number | boolean | null>;
  rejectedFieldNames: string[];
  reasonCodes: string[];
  requiredOperatorActions: string[];
  prohibitedFindings: string[];
  blockingFindings: string[];
  advisoryFindings: string[];
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  liveTestReady: false;
  summary: string;
};

export type R50RetentionExpiryInvariantCheck = {
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
const maxRetentionWindowDays = 2555;
const secretPattern = /\b(api[_-]?key|secret|token|password|bearer|database_url|direct_url|credential|authorization|auth|cookie|session)\b/i;
const phonePattern = /\+?\d[\d\s().-]{7,}\d/g;

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

function addReason(reasonCodes: string[], reasonCode: R50RetentionExpiryReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function metadataContainsSecret(metadata?: Record<string, unknown>) {
  return Object.entries(metadata ?? {}).some(([key, value]) => {
    return secretPattern.test(key) || (typeof value === "string" && secretPattern.test(value));
  });
}

function metadataContainsPhone(metadata?: Record<string, unknown>) {
  return Object.values(metadata ?? {}).some((value) => typeof value === "string" && phonePattern.test(value));
}

function sanitizeMetadata(metadata: Record<string, unknown> | undefined, reasonCodes: string[], advisoryFindings: string[]) {
  const sanitizedMetadata: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(metadata ?? {}).slice(0, maxListItems)) {
    const boundedKey = boundText(key) || "unspecified";

    if (secretPattern.test(key)) {
      sanitizedMetadata[boundedKey] = "[REDACTED]";
      continue;
    }

    if (typeof value === "string") {
      sanitizedMetadata[boundedKey] = secretPattern.test(value) || phonePattern.test(value) ? "[REDACTED]" : boundText(value);
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

function inputHasExecutionIndicators(input: R50RetentionExpiryPlanningInput) {
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

function collectRejectedFieldNames(input: R50RetentionExpiryPlanningInput) {
  const rejected = new Set<string>();

  if (input.providerPayload !== undefined) rejected.add("providerPayload");
  if (normalizeText(input.rawPhone)) rejected.add("rawPhone");
  if (normalizeText(input.rawMessageBody)) rejected.add("rawMessageBody");
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

export function assertR50RetentionExpiryPlanningInvariants(
  result: Pick<
    R50RetentionExpiryPlanningResult,
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
): R50RetentionExpiryInvariantCheck {
  const reasonCodes: R50RetentionExpiryInvariantCheck["reasonCodes"] = [];

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

export function summarizeR50RetentionExpiryPlanning(result: R50RetentionExpiryPlanningResult) {
  const invariantCheck = assertR50RetentionExpiryPlanningInvariants(result);

  return boundSummary(
    `R50C retention and expiry plan is ${result.planStatus}. ` +
      `Retention status is ${result.retentionPolicyStatus}; expiry status is ${result.expiryPolicyStatus}; ` +
      `deletion rollback review is ${result.deletionRollbackReviewStatus}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Persistence allowed now: ${result.persistenceAllowedNow}. Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Plan is advisory-only and non-persistent; it cannot authorize DB writes, live execution, provider activation, sending, env reads, network calls, routes, UI, or automation.",
  );
}

export function createR50AuditPersistenceRetentionExpiryPlan(
  input: R50RetentionExpiryPlanningInput = {},
): R50RetentionExpiryPlanningResult {
  const reasonCodes: string[] = [];
  const requiredOperatorActions = collectText(input.requiredOperatorActions);
  const prohibitedFindings: string[] = [];
  const blockingFindings: string[] = [];
  const advisoryFindings: string[] = [];
  const rejectedFieldNames = collectRejectedFieldNames(input);
  const sanitizedMetadata = sanitizeMetadata(input.metadata, reasonCodes, advisoryFindings);

  addReason(reasonCodes, "r50c_retention_expiry_planning_contract_only");
  addReason(reasonCodes, "future_retention_plan_only");
  addReason(reasonCodes, "persistence_not_allowed_now");

  for (const reasonCode of input.reasonCodes ?? []) {
    addUnique(reasonCodes, reasonCode);
  }

  if (Object.keys(input).length === 0) {
    addReason(reasonCodes, "input_missing");
    addUnique(prohibitedFindings, "Retention and expiry planning input is missing.");
  }

  let retentionPolicyStatus: R50RetentionPolicyStatus = "missing";
  const retentionWindowDays =
    typeof input.retentionWindowDays === "number" && Number.isFinite(input.retentionWindowDays)
      ? Math.trunc(input.retentionWindowDays)
      : null;

  if (input.permanentRetentionRequested === true) {
    retentionPolicyStatus = input.explicitFutureGovernanceReview === true ? "permanent_review_required" : "unbounded_rejected";
    addReason(reasonCodes, "permanent_retention_review_required");
    addUnique(blockingFindings, "Permanent retention requires explicit future governance review.");
  } else if (retentionWindowDays === null) {
    addReason(reasonCodes, "retention_policy_missing");
    addUnique(prohibitedFindings, "Retention window is missing.");
  } else if (retentionWindowDays <= 0) {
    retentionPolicyStatus = "unbounded_rejected";
    addReason(reasonCodes, "retention_window_unbounded");
    addUnique(prohibitedFindings, "Retention window is unbounded or non-positive.");
  } else if (retentionWindowDays > maxRetentionWindowDays) {
    retentionPolicyStatus = "unbounded_rejected";
    addReason(reasonCodes, "retention_window_exceeds_maximum");
    addUnique(prohibitedFindings, "Retention window exceeds the maximum allowed planning bound.");
  } else {
    retentionPolicyStatus = "bounded";
  }

  const expiryPolicyStatus: R50ExpiryPolicyStatus =
    input.expiryPolicyDefined === true && prohibitedFindings.length === 0 ? "defined" : input.expiryPolicyDefined === true ? "blocked" : "missing";

  if (input.expiryPolicyDefined !== true) {
    addReason(reasonCodes, "expiry_policy_missing");
    addUnique(blockingFindings, "Expiry policy is missing.");
  }

  const deletionRollbackReviewStatus: R50DeletionRollbackReviewStatus =
    input.deletionRollbackReviewed === true ? "reviewed" : input.operatorReviewCompleted === true ? "review_required" : "missing";

  if (input.deletionRollbackReviewed !== true) {
    addReason(reasonCodes, "deletion_rollback_review_missing");
    addUnique(blockingFindings, "Deletion and rollback review is missing.");
  }

  if (input.operatorReviewCompleted !== true) {
    addReason(reasonCodes, "operator_review_required");
    addUnique(blockingFindings, "Operator review is required before any future retention plan can complete.");
  }

  if (metadataContainsSecret(input.metadata)) {
    addReason(reasonCodes, "secret_bearing_metadata_rejected");
    addUnique(prohibitedFindings, "Secret-bearing metadata is rejected from future persistence planning.");
  }
  if (metadataContainsPhone(input.metadata) || normalizeText(input.rawPhone)) {
    addReason(reasonCodes, "raw_phone_rejected");
    addUnique(prohibitedFindings, "Raw phone values are rejected from future retention planning.");
  }
  if (normalizeText(input.rawMessageBody)) {
    addReason(reasonCodes, "raw_message_body_rejected");
    addUnique(prohibitedFindings, "Raw message bodies are rejected from future retention planning.");
  }
  if (input.providerPayload !== undefined) {
    addReason(reasonCodes, "provider_payload_rejected");
    addUnique(prohibitedFindings, "Raw provider payloads are rejected from future retention planning.");
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
  if (input.persistenceAllowedNow === true) addReason(reasonCodes, "persistence_not_allowed_now");

  if (requiredOperatorActions.length === 0 && input.operatorReviewCompleted !== true) {
    addUnique(requiredOperatorActions, "Complete operator review for retention, expiry, deletion, and rollback planning.");
  }

  const requiresOperatorReview =
    input.operatorReviewCompleted !== true ||
    retentionPolicyStatus === "permanent_review_required" ||
    deletionRollbackReviewStatus !== "reviewed" ||
    rejectedFieldNames.length > 0;
  const requiresExpiryPolicy = expiryPolicyStatus !== "defined";
  const requiresDeletionRollbackReview = deletionRollbackReviewStatus !== "reviewed";

  const planStatus: R50RetentionExpiryPlanStatus =
    prohibitedFindings.length > 0
      ? "retention_blocked"
      : blockingFindings.length > 0 || requiresOperatorReview
        ? "review_required"
        : "future_retention_plan_ready";

  addUnique(advisoryFindings, "R50C plans retention and expiry only; it performs no persistence.");

  const result: R50RetentionExpiryPlanningResult = {
    planStatus,
    retentionPolicyStatus,
    expiryPolicyStatus,
    deletionRollbackReviewStatus,
    retentionWindowDays: retentionPolicyStatus === "bounded" ? retentionWindowDays : null,
    maximumRetentionWindowDays: maxRetentionWindowDays,
    permanentRetentionRequested: input.permanentRetentionRequested === true,
    explicitFutureGovernanceReview: input.explicitFutureGovernanceReview === true,
    requiresOperatorReview,
    requiresExpiryPolicy,
    requiresDeletionRollbackReview,
    advisoryOnly: true,
    simulationOnly: true,
    persistenceAllowedNow: false,
    sanitizedMetadata,
    rejectedFieldNames,
    reasonCodes,
    requiredOperatorActions,
    prohibitedFindings,
    blockingFindings,
    advisoryFindings,
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    liveTestReady: false,
    summary: "R50C audit persistence retention and expiry planning contract only.",
  };

  return {
    ...result,
    summary: summarizeR50RetentionExpiryPlanning(result),
  };
}
