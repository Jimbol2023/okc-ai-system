export type R50ExportDeletionLegalHoldPlanStatus =
  | "export_deletion_blocked"
  | "legal_review_required"
  | "future_export_deletion_plan_ready";

export type R50ReviewStatus = "not_requested" | "missing" | "review_required" | "reviewed";

export type R50LegalHoldStatus =
  | "not_requested"
  | "temporary_hold_reviewed"
  | "permanent_hold_review_required"
  | "blocked";

export type R50PreservationLockStatus = "not_requested" | "review_required" | "reviewed" | "blocked";

export type R50BoundedScopeStatus = "not_requested" | "bounded" | "unbounded_rejected";

export type R50ExportDeletionLegalHoldReasonCode =
  | "r50e_export_deletion_legal_hold_planning_contract_only"
  | "input_missing"
  | "export_review_required"
  | "deletion_review_required"
  | "rollback_review_required"
  | "legal_admin_review_required"
  | "operator_approval_required"
  | "permanent_legal_hold_review_required"
  | "preservation_lock_review_required"
  | "unbounded_export_scope_rejected"
  | "unbounded_deletion_scope_rejected"
  | "unbounded_rollback_scope_rejected"
  | "secret_bearing_metadata_rejected"
  | "provider_payload_rejected"
  | "raw_phone_rejected"
  | "raw_message_body_rejected"
  | "metadata_bounded"
  | "metadata_non_primitive_omitted"
  | "future_export_deletion_plan_only"
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

export type R50AuditPersistenceExportDeletionLegalHoldPlanningInput = {
  exportRequested?: boolean;
  deletionRequested?: boolean;
  rollbackRequested?: boolean;
  legalHoldRequested?: boolean;
  permanentLegalHoldRequested?: boolean;
  preservationLockRequested?: boolean;
  exportReviewCompleted?: boolean;
  deletionReviewCompleted?: boolean;
  rollbackReviewCompleted?: boolean;
  legalAdminReviewCompleted?: boolean;
  operatorApprovalCompleted?: boolean;
  permanentLegalHoldGovernanceReviewCompleted?: boolean;
  preservationLockReviewCompleted?: boolean;
  exportScope?: string[] | null;
  deletionScope?: string[] | null;
  rollbackScope?: string[] | null;
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

export type R50AuditPersistenceExportDeletionLegalHoldPlanningResult = {
  planStatus: R50ExportDeletionLegalHoldPlanStatus;
  exportReviewStatus: R50ReviewStatus;
  deletionReviewStatus: R50ReviewStatus;
  rollbackReviewStatus: R50ReviewStatus;
  legalHoldStatus: R50LegalHoldStatus;
  preservationLockStatus: R50PreservationLockStatus;
  exportScopeStatus: R50BoundedScopeStatus;
  deletionScopeStatus: R50BoundedScopeStatus;
  rollbackScopeStatus: R50BoundedScopeStatus;
  exportScope: string[];
  deletionScope: string[];
  rollbackScope: string[];
  operatorApprovalRequired: boolean;
  legalAdminReviewRequired: boolean;
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

export type R50ExportDeletionLegalHoldInvariantCheck = {
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
const maxScopeItems = 25;
const maxTextLength = 180;
const maxSummaryLength = 700;
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

function addReason(reasonCodes: string[], reasonCode: R50ExportDeletionLegalHoldReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function collectBoundedScope(values: string[] | null | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    const normalizedValue = boundText(value);

    if (normalizedValue && !secretPattern.test(normalizedValue) && !phonePattern.test(normalizedValue) && !result.includes(normalizedValue) && result.length < maxScopeItems) {
      result.push(normalizedValue);
    }
  }

  return result;
}

function scopeStatus(requested: boolean | undefined, scope: string[] | null | undefined): R50BoundedScopeStatus {
  if (requested !== true) return "not_requested";

  const boundedScope = collectBoundedScope(scope);

  return boundedScope.length > 0 && (scope?.length ?? 0) <= maxScopeItems ? "bounded" : "unbounded_rejected";
}

function reviewStatus(requested: boolean | undefined, reviewed: boolean | undefined): R50ReviewStatus {
  if (requested !== true) return "not_requested";
  if (reviewed === true) return "reviewed";

  return "review_required";
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

function inputHasExecutionIndicators(input: R50AuditPersistenceExportDeletionLegalHoldPlanningInput) {
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

function collectRejectedFieldNames(input: R50AuditPersistenceExportDeletionLegalHoldPlanningInput) {
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

export function assertR50ExportDeletionLegalHoldPlanningInvariants(
  result: Pick<
    R50AuditPersistenceExportDeletionLegalHoldPlanningResult,
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
): R50ExportDeletionLegalHoldInvariantCheck {
  const reasonCodes: R50ExportDeletionLegalHoldInvariantCheck["reasonCodes"] = [];

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

export function summarizeR50ExportDeletionLegalHoldPlanning(result: R50AuditPersistenceExportDeletionLegalHoldPlanningResult) {
  const invariantCheck = assertR50ExportDeletionLegalHoldPlanningInvariants(result);

  return boundSummary(
    `R50E export deletion legal hold plan is ${result.planStatus}. ` +
      `Export review is ${result.exportReviewStatus}; deletion review is ${result.deletionReviewStatus}; rollback review is ${result.rollbackReviewStatus}. ` +
      `Legal hold is ${result.legalHoldStatus}; preservation lock is ${result.preservationLockStatus}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Persistence allowed now: ${result.persistenceAllowedNow}. Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Plan is advisory-only and non-persistent; it cannot authorize DB writes, live execution, provider activation, sending, env reads, network calls, routes, UI, or automation.",
  );
}

export function createR50AuditPersistenceExportDeletionLegalHoldPlan(
  input: R50AuditPersistenceExportDeletionLegalHoldPlanningInput = {},
): R50AuditPersistenceExportDeletionLegalHoldPlanningResult {
  const reasonCodes: string[] = [];
  const requiredOperatorActions = collectText(input.requiredOperatorActions);
  const prohibitedFindings: string[] = [];
  const blockingFindings: string[] = [];
  const advisoryFindings: string[] = [];
  const rejectedFieldNames = collectRejectedFieldNames(input);
  const sanitizedMetadata = sanitizeMetadata(input.metadata, reasonCodes, advisoryFindings);
  const exportScope = collectBoundedScope(input.exportScope);
  const deletionScope = collectBoundedScope(input.deletionScope);
  const rollbackScope = collectBoundedScope(input.rollbackScope);
  const exportScopeStatus = scopeStatus(input.exportRequested, input.exportScope);
  const deletionScopeStatus = scopeStatus(input.deletionRequested, input.deletionScope);
  const rollbackScopeStatus = scopeStatus(input.rollbackRequested, input.rollbackScope);

  addReason(reasonCodes, "r50e_export_deletion_legal_hold_planning_contract_only");
  addReason(reasonCodes, "future_export_deletion_plan_only");
  addReason(reasonCodes, "persistence_not_allowed_now");

  for (const reasonCode of input.reasonCodes ?? []) {
    addUnique(reasonCodes, reasonCode);
  }

  if (Object.keys(input).length === 0) {
    addReason(reasonCodes, "input_missing");
    addUnique(prohibitedFindings, "Export, deletion, rollback, and legal hold planning input is missing.");
  }

  const exportReviewStatus = reviewStatus(input.exportRequested, input.exportReviewCompleted);
  const deletionReviewStatus = reviewStatus(input.deletionRequested, input.deletionReviewCompleted);
  const rollbackReviewStatus = reviewStatus(input.rollbackRequested, input.rollbackReviewCompleted);

  if (input.exportRequested === true && input.exportReviewCompleted !== true) {
    addReason(reasonCodes, "export_review_required");
    addUnique(blockingFindings, "Export requires completed review.");
  }
  if (input.deletionRequested === true && input.deletionReviewCompleted !== true) {
    addReason(reasonCodes, "deletion_review_required");
    addUnique(blockingFindings, "Deletion requires completed review.");
  }
  if (input.rollbackRequested === true && input.rollbackReviewCompleted !== true) {
    addReason(reasonCodes, "rollback_review_required");
    addUnique(blockingFindings, "Rollback requires completed review.");
  }

  if (exportScopeStatus === "unbounded_rejected") {
    addReason(reasonCodes, "unbounded_export_scope_rejected");
    addUnique(prohibitedFindings, "Export scope is missing, unbounded, secret-bearing, phone-bearing, or exceeds the maximum scope bound.");
  }
  if (deletionScopeStatus === "unbounded_rejected") {
    addReason(reasonCodes, "unbounded_deletion_scope_rejected");
    addUnique(prohibitedFindings, "Deletion scope is missing, unbounded, secret-bearing, phone-bearing, or exceeds the maximum scope bound.");
  }
  if (rollbackScopeStatus === "unbounded_rejected") {
    addReason(reasonCodes, "unbounded_rollback_scope_rejected");
    addUnique(prohibitedFindings, "Rollback scope is missing, unbounded, secret-bearing, phone-bearing, or exceeds the maximum scope bound.");
  }

  const legalHoldStatus: R50LegalHoldStatus =
    input.legalHoldRequested !== true
      ? "not_requested"
      : input.permanentLegalHoldRequested === true && input.permanentLegalHoldGovernanceReviewCompleted !== true
        ? "permanent_hold_review_required"
        : input.legalAdminReviewCompleted === true
          ? "temporary_hold_reviewed"
          : "blocked";

  if (input.permanentLegalHoldRequested === true && input.permanentLegalHoldGovernanceReviewCompleted !== true) {
    addReason(reasonCodes, "permanent_legal_hold_review_required");
    addUnique(blockingFindings, "Permanent legal hold requires explicit governance review.");
  }

  const preservationLockStatus: R50PreservationLockStatus =
    input.preservationLockRequested !== true
      ? "not_requested"
      : input.preservationLockReviewCompleted === true
        ? "reviewed"
        : input.legalAdminReviewCompleted === true
          ? "review_required"
          : "blocked";

  if (input.preservationLockRequested === true && input.preservationLockReviewCompleted !== true) {
    addReason(reasonCodes, "preservation_lock_review_required");
    addUnique(blockingFindings, "Preservation lock requires completed review.");
  }

  if (input.legalAdminReviewCompleted !== true) {
    addReason(reasonCodes, "legal_admin_review_required");
    addUnique(blockingFindings, "Legal/admin review is required before future export, deletion, rollback, or legal hold planning can complete.");
  }
  if (input.operatorApprovalCompleted !== true) {
    addReason(reasonCodes, "operator_approval_required");
    addUnique(blockingFindings, "Operator approval is required before future export, deletion, rollback, or legal hold planning can complete.");
  }

  if (metadataContainsSecret(input.metadata)) {
    addReason(reasonCodes, "secret_bearing_metadata_rejected");
    addUnique(prohibitedFindings, "Secret-bearing metadata is rejected from future export/deletion planning.");
  }
  if (metadataContainsPhone(input.metadata) || normalizeText(input.rawPhone)) {
    addReason(reasonCodes, "raw_phone_rejected");
    addUnique(prohibitedFindings, "Raw phone values are rejected from future export/deletion planning.");
  }
  if (normalizeText(input.rawMessageBody)) {
    addReason(reasonCodes, "raw_message_body_rejected");
    addUnique(prohibitedFindings, "Raw message bodies are rejected from future export/deletion planning.");
  }
  if (input.providerPayload !== undefined) {
    addReason(reasonCodes, "provider_payload_rejected");
    addUnique(prohibitedFindings, "Raw provider payloads are rejected from future export/deletion planning.");
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

  if (requiredOperatorActions.length === 0 && input.operatorApprovalCompleted !== true) {
    addUnique(requiredOperatorActions, "Complete operator approval for future export, deletion, rollback, and legal hold planning.");
  }

  const operatorApprovalRequired = input.operatorApprovalCompleted !== true;
  const legalAdminReviewRequired = input.legalAdminReviewCompleted !== true || legalHoldStatus === "permanent_hold_review_required";
  const planStatus: R50ExportDeletionLegalHoldPlanStatus =
    prohibitedFindings.length > 0
      ? "export_deletion_blocked"
      : blockingFindings.length > 0 || operatorApprovalRequired || legalAdminReviewRequired
        ? "legal_review_required"
        : "future_export_deletion_plan_ready";

  addUnique(advisoryFindings, "R50E plans future export, deletion, rollback, and legal hold only; it performs no persistence.");

  const result: R50AuditPersistenceExportDeletionLegalHoldPlanningResult = {
    planStatus,
    exportReviewStatus,
    deletionReviewStatus,
    rollbackReviewStatus,
    legalHoldStatus,
    preservationLockStatus,
    exportScopeStatus,
    deletionScopeStatus,
    rollbackScopeStatus,
    exportScope,
    deletionScope,
    rollbackScope,
    operatorApprovalRequired,
    legalAdminReviewRequired,
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
    summary: "R50E audit persistence export deletion legal hold planning contract only.",
  };

  return {
    ...result,
    summary: summarizeR50ExportDeletionLegalHoldPlanning(result),
  };
}
