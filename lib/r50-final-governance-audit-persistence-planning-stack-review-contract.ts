export type R50FinalAuditPersistenceStackReviewStatus =
  | "stack_incomplete"
  | "review_blocked"
  | "legal_review_required"
  | "operator_review_required"
  | "r50_persistence_planning_complete";

export type R50FinalAuditPersistenceConsistencyStatus = "inconsistent" | "needs_review" | "consistent";

export type R50FinalAuditPersistenceBoundaryStatus = "missing" | "planned" | "blocked";

export type R50FinalAuditPersistenceRecordShapeStatus =
  | "missing"
  | "not_persistable"
  | "shape_blocked"
  | "shape_ready_for_review"
  | "future_safe_shape_ready";

export type R50FinalAuditPersistenceRetentionStatus =
  | "missing"
  | "not_planned"
  | "retention_blocked"
  | "review_required"
  | "future_retention_plan_ready";

export type R50FinalAuditPersistenceAccessStatus =
  | "missing"
  | "access_control_blocked"
  | "access_review_required"
  | "future_access_plan_ready";

export type R50FinalAuditPersistenceExportDeletionStatus =
  | "missing"
  | "export_deletion_blocked"
  | "legal_review_required"
  | "future_export_deletion_plan_ready";

export type R50FinalAuditPersistenceWarningCode =
  | "r50f_final_stack_review_contract_only"
  | "input_missing"
  | "boundary_planning_missing"
  | "record_shape_not_ready"
  | "retention_planning_not_ready"
  | "access_control_not_ready"
  | "export_deletion_legal_hold_not_ready"
  | "operator_review_required"
  | "legal_admin_review_required"
  | "metadata_sanitization_required"
  | "bounded_output_required"
  | "unbounded_scope_rejected"
  | "unsafe_retention_rejected"
  | "unsafe_export_deletion_rejected"
  | "secret_or_raw_payload_rejected"
  | "provider_payload_rejected"
  | "raw_phone_rejected"
  | "raw_message_body_rejected"
  | "runtime_capability_rejected"
  | "activation_semantics_rejected"
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

export type R50FinalGovernanceAuditPersistencePlanningStackReviewInput = {
  boundaryPlanningStatus?: R50FinalAuditPersistenceBoundaryStatus;
  recordShapeStatus?: R50FinalAuditPersistenceRecordShapeStatus;
  retentionPlanningStatus?: R50FinalAuditPersistenceRetentionStatus;
  accessControlStatus?: R50FinalAuditPersistenceAccessStatus;
  exportDeletionLegalHoldStatus?: R50FinalAuditPersistenceExportDeletionStatus;
  operatorReviewCompleted?: boolean;
  legalAdminReviewCompleted?: boolean;
  metadataSanitized?: boolean;
  boundedOutputsConfirmed?: boolean;
  unboundedScopesPresent?: boolean;
  unsafeRetentionPresent?: boolean;
  unsafeExportDeletionPresent?: boolean;
  secretsOrRawPayloadsPresent?: boolean;
  providerPayloadPresent?: boolean;
  rawPhonePresent?: boolean;
  rawMessageBodyPresent?: boolean;
  runtimeCapabilityIntroduced?: boolean;
  activationSemanticsIntroduced?: boolean;
  warningCodes?: string[];
  reviewNotes?: string[];
  operatorActionRecommendations?: string[];
  metadata?: Record<string, unknown>;
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

export type R50FinalGovernanceAuditPersistencePlanningStackReviewResult = {
  governanceReviewStatus: R50FinalAuditPersistenceStackReviewStatus;
  consistencyStatus: R50FinalAuditPersistenceConsistencyStatus;
  boundaryPlanningStatus: R50FinalAuditPersistenceBoundaryStatus;
  recordShapeStatus: R50FinalAuditPersistenceRecordShapeStatus;
  retentionPlanningStatus: R50FinalAuditPersistenceRetentionStatus;
  accessControlStatus: R50FinalAuditPersistenceAccessStatus;
  exportDeletionLegalHoldStatus: R50FinalAuditPersistenceExportDeletionStatus;
  advisoryOnly: true;
  simulationOnly: true;
  persistenceAllowedNow: false;
  metadataSanitized: boolean;
  boundedOutputsConfirmed: boolean;
  operatorReviewRequired: boolean;
  legalAdminReviewRequired: boolean;
  warningCodes: string[];
  reviewNotes: string[];
  operatorActionRecommendations: string[];
  sanitizedMetadata: Record<string, string | number | boolean | null>;
  prohibitedFindings: string[];
  blockingFindings: string[];
  advisoryFindings: string[];
  reviewSummary: string;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  liveTestReady: false;
};

export type R50FinalAuditPersistenceStackInvariantCheck = {
  passed: boolean;
  warningCodes: Array<
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
const maxSummaryLength = 800;
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

function addWarning(warningCodes: string[], warningCode: R50FinalAuditPersistenceWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function sanitizeMetadata(metadata: Record<string, unknown> | undefined, warningCodes: string[], advisoryFindings: string[]) {
  const sanitizedMetadata: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(metadata ?? {}).slice(0, maxListItems)) {
    const boundedKey = boundText(key) || "unspecified";

    if (secretPattern.test(key)) {
      sanitizedMetadata[boundedKey] = "[REDACTED]";
      addWarning(warningCodes, "secret_or_raw_payload_rejected");
      continue;
    }

    if (typeof value === "string") {
      sanitizedMetadata[boundedKey] = secretPattern.test(value) || phonePattern.test(value) ? "[REDACTED]" : boundText(value);
      if (secretPattern.test(value) || phonePattern.test(value)) addWarning(warningCodes, "secret_or_raw_payload_rejected");
      continue;
    }

    if (typeof value === "number" || typeof value === "boolean" || value === null) {
      sanitizedMetadata[boundedKey] = value;
      continue;
    }

    sanitizedMetadata[boundedKey] = "[OMITTED_NON_PRIMITIVE]";
    addUnique(advisoryFindings, "Non-primitive metadata value was omitted.");
  }

  if (Object.keys(metadata ?? {}).length > maxListItems) {
    addUnique(advisoryFindings, "Metadata was bounded to the maximum allowed field count.");
  }

  return sanitizedMetadata;
}

function hasExecutionIndicators(input: R50FinalGovernanceAuditPersistencePlanningStackReviewInput) {
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

export function assertR50FinalAuditPersistenceStackReviewInvariants(
  result: Pick<
    R50FinalGovernanceAuditPersistencePlanningStackReviewResult,
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
): R50FinalAuditPersistenceStackInvariantCheck {
  const warningCodes: R50FinalAuditPersistenceStackInvariantCheck["warningCodes"] = [];

  if (result.activationExecuted !== false) warningCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) warningCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) warningCodes.push("can_send_now_must_be_false");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.liveTestReady !== false) warningCodes.push("live_test_ready_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR50FinalAuditPersistenceStackReview(result: R50FinalGovernanceAuditPersistencePlanningStackReviewResult) {
  const invariantCheck = assertR50FinalAuditPersistenceStackReviewInvariants(result);

  return boundSummary(
    `R50F final governance audit persistence planning stack review is ${result.governanceReviewStatus}. ` +
      `Consistency is ${result.consistencyStatus}. Boundary: ${result.boundaryPlanningStatus}; shape: ${result.recordShapeStatus}; ` +
      `retention: ${result.retentionPlanningStatus}; access: ${result.accessControlStatus}; export/deletion/legal hold: ${result.exportDeletionLegalHoldStatus}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Persistence allowed now: ${result.persistenceAllowedNow}. Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Review is advisory-only, simulation-only, non-persistent, and cannot authorize DB writes, runtime execution, live sending, provider activation, routes, UI, env reads, network calls, or automation.",
  );
}

export function createR50FinalGovernanceAuditPersistencePlanningStackReview(
  input: R50FinalGovernanceAuditPersistencePlanningStackReviewInput = {},
): R50FinalGovernanceAuditPersistencePlanningStackReviewResult {
  const warningCodes = collectText(input.warningCodes);
  const reviewNotes = collectText(input.reviewNotes);
  const operatorActionRecommendations = collectText(input.operatorActionRecommendations);
  const prohibitedFindings: string[] = [];
  const blockingFindings: string[] = [];
  const advisoryFindings: string[] = [];
  const sanitizedMetadata = sanitizeMetadata(input.metadata, warningCodes, advisoryFindings);

  addWarning(warningCodes, "r50f_final_stack_review_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  const boundaryPlanningStatus = input.boundaryPlanningStatus ?? "missing";
  const recordShapeStatus = input.recordShapeStatus ?? "missing";
  const retentionPlanningStatus = input.retentionPlanningStatus ?? "missing";
  const accessControlStatus = input.accessControlStatus ?? "missing";
  const exportDeletionLegalHoldStatus = input.exportDeletionLegalHoldStatus ?? "missing";

  if (Object.keys(input).length === 0) {
    addWarning(warningCodes, "input_missing");
    addUnique(prohibitedFindings, "R50 final stack review input is missing.");
  }

  if (boundaryPlanningStatus !== "planned") {
    addWarning(warningCodes, "boundary_planning_missing");
    addUnique(blockingFindings, "R50A boundary planning is missing or blocked.");
  }
  if (recordShapeStatus !== "future_safe_shape_ready") {
    addWarning(warningCodes, "record_shape_not_ready");
    addUnique(blockingFindings, "R50B record-shape planning is not complete.");
  }
  if (retentionPlanningStatus !== "future_retention_plan_ready") {
    addWarning(warningCodes, "retention_planning_not_ready");
    addUnique(blockingFindings, "R50C retention and expiry planning is not complete.");
  }
  if (accessControlStatus !== "future_access_plan_ready") {
    addWarning(warningCodes, "access_control_not_ready");
    addUnique(blockingFindings, "R50D access-control planning is not complete.");
  }
  if (exportDeletionLegalHoldStatus !== "future_export_deletion_plan_ready") {
    addWarning(warningCodes, "export_deletion_legal_hold_not_ready");
    addUnique(blockingFindings, "R50E export/deletion/legal-hold planning is not complete.");
  }

  if (input.operatorReviewCompleted !== true) {
    addWarning(warningCodes, "operator_review_required");
    addUnique(blockingFindings, "Operator review is required before R50 can be considered complete.");
  }
  if (input.legalAdminReviewCompleted !== true) {
    addWarning(warningCodes, "legal_admin_review_required");
    addUnique(blockingFindings, "Legal/admin review is required before R50 can be considered complete.");
  }
  if (input.metadataSanitized !== true) {
    addWarning(warningCodes, "metadata_sanitization_required");
    addUnique(blockingFindings, "Metadata sanitization consistency is not confirmed.");
  }
  if (input.boundedOutputsConfirmed !== true) {
    addWarning(warningCodes, "bounded_output_required");
    addUnique(blockingFindings, "Bounded output consistency is not confirmed.");
  }

  if (input.unboundedScopesPresent === true) {
    addWarning(warningCodes, "unbounded_scope_rejected");
    addUnique(prohibitedFindings, "Unbounded scopes are rejected.");
  }
  if (input.unsafeRetentionPresent === true) {
    addWarning(warningCodes, "unsafe_retention_rejected");
    addUnique(prohibitedFindings, "Unsafe retention planning is rejected.");
  }
  if (input.unsafeExportDeletionPresent === true) {
    addWarning(warningCodes, "unsafe_export_deletion_rejected");
    addUnique(prohibitedFindings, "Unsafe export/deletion planning is rejected.");
  }
  if (input.secretsOrRawPayloadsPresent === true) {
    addWarning(warningCodes, "secret_or_raw_payload_rejected");
    addUnique(prohibitedFindings, "Secrets or raw payloads are rejected.");
  }
  if (input.providerPayloadPresent === true) {
    addWarning(warningCodes, "provider_payload_rejected");
    addUnique(prohibitedFindings, "Provider payloads are rejected.");
  }
  if (input.rawPhonePresent === true) {
    addWarning(warningCodes, "raw_phone_rejected");
    addUnique(prohibitedFindings, "Raw phone values are rejected.");
  }
  if (input.rawMessageBodyPresent === true) {
    addWarning(warningCodes, "raw_message_body_rejected");
    addUnique(prohibitedFindings, "Raw message bodies are rejected.");
  }
  if (input.runtimeCapabilityIntroduced === true) {
    addWarning(warningCodes, "runtime_capability_rejected");
    addUnique(prohibitedFindings, "Runtime capability introduction is rejected.");
  }
  if (input.activationSemanticsIntroduced === true) {
    addWarning(warningCodes, "activation_semantics_rejected");
    addUnique(prohibitedFindings, "Activation semantics are rejected.");
  }
  if (input.advisoryOnly !== true) {
    addWarning(warningCodes, "advisory_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly advisory-only.");
  }
  if (input.simulationOnly !== true) {
    addWarning(warningCodes, "simulation_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly simulation-only.");
  }
  if (hasExecutionIndicators(input)) {
    addUnique(prohibitedFindings, "Input contains execution, provider activation, live readiness, sending, or persistence indicators.");
  }
  if (input.activationExecuted === true) addWarning(warningCodes, "activation_executed_must_be_false");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.liveExecutionAllowed === true) addWarning(warningCodes, "live_execution_allowed_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.canSendNow === true) addWarning(warningCodes, "can_send_now_must_be_false");
  if (input.liveTestReady === true) addWarning(warningCodes, "live_test_ready_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");

  if (operatorActionRecommendations.length === 0 && input.operatorReviewCompleted !== true) {
    addUnique(operatorActionRecommendations, "Complete final operator review of the R50 audit persistence planning stack.");
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const legalAdminReviewRequired = input.legalAdminReviewCompleted !== true;
  const consistencyStatus: R50FinalAuditPersistenceConsistencyStatus =
    prohibitedFindings.length > 0 ? "inconsistent" : blockingFindings.length > 0 ? "needs_review" : "consistent";
  const governanceReviewStatus: R50FinalAuditPersistenceStackReviewStatus =
    prohibitedFindings.length > 0
      ? "review_blocked"
      : boundaryPlanningStatus !== "planned" ||
          recordShapeStatus !== "future_safe_shape_ready" ||
          retentionPlanningStatus !== "future_retention_plan_ready" ||
          accessControlStatus !== "future_access_plan_ready" ||
          exportDeletionLegalHoldStatus !== "future_export_deletion_plan_ready"
        ? "stack_incomplete"
        : legalAdminReviewRequired
          ? "legal_review_required"
          : operatorReviewRequired
            ? "operator_review_required"
            : "r50_persistence_planning_complete";

  addUnique(advisoryFindings, "R50F is a final review contract only; it performs no persistence and grants no runtime permission.");

  const result: R50FinalGovernanceAuditPersistencePlanningStackReviewResult = {
    governanceReviewStatus,
    consistencyStatus,
    boundaryPlanningStatus,
    recordShapeStatus,
    retentionPlanningStatus,
    accessControlStatus,
    exportDeletionLegalHoldStatus,
    advisoryOnly: true,
    simulationOnly: true,
    persistenceAllowedNow: false,
    metadataSanitized: input.metadataSanitized === true,
    boundedOutputsConfirmed: input.boundedOutputsConfirmed === true,
    operatorReviewRequired,
    legalAdminReviewRequired,
    warningCodes,
    reviewNotes,
    operatorActionRecommendations,
    sanitizedMetadata,
    prohibitedFindings,
    blockingFindings,
    advisoryFindings,
    reviewSummary: "R50F final governance audit persistence planning stack review contract only.",
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    liveTestReady: false,
  };

  return {
    ...result,
    reviewSummary: summarizeR50FinalAuditPersistenceStackReview(result),
  };
}
