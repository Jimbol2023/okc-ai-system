export type R50AuditAccessControlPlanStatus =
  | "access_control_blocked"
  | "access_review_required"
  | "future_access_plan_ready";

export type R50AuditAccessPermissionStatus =
  | "not_requested"
  | "blocked"
  | "requires_review"
  | "future_allowed_after_review";

export type R50AuditAccessRole =
  | "operator"
  | "compliance_reviewer"
  | "legal_reviewer"
  | "admin_reviewer"
  | "auditor";

export type R50AuditAccessControlReasonCode =
  | "r50d_access_control_planning_contract_only"
  | "input_missing"
  | "role_missing"
  | "unknown_role_rejected"
  | "unbounded_admin_access_rejected"
  | "self_approved_write_rejected"
  | "export_review_required"
  | "deletion_review_required"
  | "legal_admin_review_required"
  | "operator_approval_required"
  | "secret_bearing_metadata_rejected"
  | "provider_payload_rejected"
  | "raw_phone_rejected"
  | "raw_message_body_rejected"
  | "metadata_bounded"
  | "metadata_non_primitive_omitted"
  | "future_access_plan_only"
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

export type R50AuditPersistenceAccessControlPlanningInput = {
  requestedRole?: string | null;
  requestedViewerAccess?: boolean;
  requestedWriterAccess?: boolean;
  requestedExportAccess?: boolean;
  requestedDeletionAccess?: boolean;
  legalAdminReviewCompleted?: boolean;
  operatorApprovalCompleted?: boolean;
  exportReviewCompleted?: boolean;
  deletionReviewCompleted?: boolean;
  selfApprovedWriteAccess?: boolean;
  unboundedAdminAccessRequested?: boolean;
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

export type R50AuditPersistenceAccessControlPlanningResult = {
  planStatus: R50AuditAccessControlPlanStatus;
  viewerPermissionStatus: R50AuditAccessPermissionStatus;
  writerPermissionStatus: R50AuditAccessPermissionStatus;
  exportPermissionStatus: R50AuditAccessPermissionStatus;
  deletionPermissionStatus: R50AuditAccessPermissionStatus;
  requestedRole: R50AuditAccessRole | "unknown" | "missing";
  legalAdminReviewRequired: boolean;
  operatorApprovalRequired: boolean;
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

export type R50AuditAccessControlInvariantCheck = {
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

const allowedRoles: R50AuditAccessRole[] = ["operator", "compliance_reviewer", "legal_reviewer", "admin_reviewer", "auditor"];
const maxListItems = 40;
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

function addReason(reasonCodes: string[], reasonCode: R50AuditAccessControlReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function normalizeRole(value?: string | null): R50AuditAccessRole | "unknown" | "missing" {
  const normalizedValue = normalizeText(value).toLowerCase();

  if (!normalizedValue) return "missing";

  return allowedRoles.includes(normalizedValue as R50AuditAccessRole) ? (normalizedValue as R50AuditAccessRole) : "unknown";
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

function inputHasExecutionIndicators(input: R50AuditPersistenceAccessControlPlanningInput) {
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

function collectRejectedFieldNames(input: R50AuditPersistenceAccessControlPlanningInput) {
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

function requestedPermissionStatus(
  requested: boolean | undefined,
  reviewCompleted: boolean,
  role: R50AuditAccessRole | "unknown" | "missing",
  roleAllowed: boolean,
): R50AuditAccessPermissionStatus {
  if (requested !== true) return "not_requested";
  if (role === "unknown" || role === "missing" || !roleAllowed) return "blocked";
  if (!reviewCompleted) return "requires_review";

  return "future_allowed_after_review";
}

export function assertR50AuditAccessControlPlanningInvariants(
  result: Pick<
    R50AuditPersistenceAccessControlPlanningResult,
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
): R50AuditAccessControlInvariantCheck {
  const reasonCodes: R50AuditAccessControlInvariantCheck["reasonCodes"] = [];

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

export function summarizeR50AuditAccessControlPlanning(result: R50AuditPersistenceAccessControlPlanningResult) {
  const invariantCheck = assertR50AuditAccessControlPlanningInvariants(result);

  return boundSummary(
    `R50D access control plan is ${result.planStatus}. ` +
      `Viewer access is ${result.viewerPermissionStatus}; writer access is ${result.writerPermissionStatus}; ` +
      `export access is ${result.exportPermissionStatus}; deletion access is ${result.deletionPermissionStatus}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Persistence allowed now: ${result.persistenceAllowedNow}. Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Plan is advisory-only and non-persistent; it cannot authorize DB writes, live execution, provider activation, sending, env reads, network calls, routes, UI, or automation.",
  );
}

export function createR50AuditPersistenceAccessControlPlan(
  input: R50AuditPersistenceAccessControlPlanningInput = {},
): R50AuditPersistenceAccessControlPlanningResult {
  const reasonCodes: string[] = [];
  const requiredOperatorActions = collectText(input.requiredOperatorActions);
  const prohibitedFindings: string[] = [];
  const blockingFindings: string[] = [];
  const advisoryFindings: string[] = [];
  const rejectedFieldNames = collectRejectedFieldNames(input);
  const sanitizedMetadata = sanitizeMetadata(input.metadata, reasonCodes, advisoryFindings);
  const requestedRole = normalizeRole(input.requestedRole);

  addReason(reasonCodes, "r50d_access_control_planning_contract_only");
  addReason(reasonCodes, "future_access_plan_only");
  addReason(reasonCodes, "persistence_not_allowed_now");

  for (const reasonCode of input.reasonCodes ?? []) {
    addUnique(reasonCodes, reasonCode);
  }

  if (Object.keys(input).length === 0) {
    addReason(reasonCodes, "input_missing");
    addUnique(prohibitedFindings, "Access control planning input is missing.");
  }

  if (requestedRole === "missing") {
    addReason(reasonCodes, "role_missing");
    addUnique(prohibitedFindings, "Requester role is missing.");
  }
  if (requestedRole === "unknown") {
    addReason(reasonCodes, "unknown_role_rejected");
    addUnique(prohibitedFindings, "Unknown requester role is rejected.");
  }

  if (input.unboundedAdminAccessRequested === true) {
    addReason(reasonCodes, "unbounded_admin_access_rejected");
    addUnique(prohibitedFindings, "Unbounded admin access is rejected.");
  }
  if (input.selfApprovedWriteAccess === true) {
    addReason(reasonCodes, "self_approved_write_rejected");
    addUnique(prohibitedFindings, "Self-approved write access is rejected.");
  }
  if (input.requestedExportAccess === true && input.exportReviewCompleted !== true) {
    addReason(reasonCodes, "export_review_required");
    addUnique(blockingFindings, "Export access requires completed export review.");
  }
  if (input.requestedDeletionAccess === true && input.deletionReviewCompleted !== true) {
    addReason(reasonCodes, "deletion_review_required");
    addUnique(blockingFindings, "Deletion access requires completed deletion review.");
  }
  if (input.legalAdminReviewCompleted !== true) {
    addReason(reasonCodes, "legal_admin_review_required");
    addUnique(blockingFindings, "Legal/admin review is required before future audit access planning can complete.");
  }
  if (input.operatorApprovalCompleted !== true) {
    addReason(reasonCodes, "operator_approval_required");
    addUnique(blockingFindings, "Operator approval is required before future audit access planning can complete.");
  }

  if (metadataContainsSecret(input.metadata)) {
    addReason(reasonCodes, "secret_bearing_metadata_rejected");
    addUnique(prohibitedFindings, "Secret-bearing metadata is rejected from future access planning.");
  }
  if (metadataContainsPhone(input.metadata) || normalizeText(input.rawPhone)) {
    addReason(reasonCodes, "raw_phone_rejected");
    addUnique(prohibitedFindings, "Raw phone values are rejected from future access planning.");
  }
  if (normalizeText(input.rawMessageBody)) {
    addReason(reasonCodes, "raw_message_body_rejected");
    addUnique(prohibitedFindings, "Raw message bodies are rejected from future access planning.");
  }
  if (input.providerPayload !== undefined) {
    addReason(reasonCodes, "provider_payload_rejected");
    addUnique(prohibitedFindings, "Raw provider payloads are rejected from future access planning.");
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
    addUnique(requiredOperatorActions, "Complete operator approval for future audit access control planning.");
  }

  const reviewCompleted = input.legalAdminReviewCompleted === true && input.operatorApprovalCompleted === true;
  const writerRoleAllowed = requestedRole === "admin_reviewer" || requestedRole === "legal_reviewer";
  const exportRoleAllowed = requestedRole === "admin_reviewer" || requestedRole === "legal_reviewer" || requestedRole === "auditor";
  const deletionRoleAllowed = requestedRole === "admin_reviewer" || requestedRole === "legal_reviewer";

  const viewerPermissionStatus = requestedPermissionStatus(input.requestedViewerAccess, reviewCompleted, requestedRole, true);
  const writerPermissionStatus = requestedPermissionStatus(input.requestedWriterAccess, reviewCompleted, requestedRole, writerRoleAllowed);
  const exportPermissionStatus = requestedPermissionStatus(
    input.requestedExportAccess,
    reviewCompleted && input.exportReviewCompleted === true,
    requestedRole,
    exportRoleAllowed,
  );
  const deletionPermissionStatus = requestedPermissionStatus(
    input.requestedDeletionAccess,
    reviewCompleted && input.deletionReviewCompleted === true,
    requestedRole,
    deletionRoleAllowed,
  );

  if (input.requestedWriterAccess === true && !writerRoleAllowed) {
    addUnique(blockingFindings, "Requested writer access requires legal or admin reviewer role.");
  }
  if (input.requestedExportAccess === true && !exportRoleAllowed) {
    addUnique(blockingFindings, "Requested export access requires legal, admin, or auditor role.");
  }
  if (input.requestedDeletionAccess === true && !deletionRoleAllowed) {
    addUnique(blockingFindings, "Requested deletion access requires legal or admin reviewer role.");
  }

  const legalAdminReviewRequired = input.legalAdminReviewCompleted !== true;
  const operatorApprovalRequired = input.operatorApprovalCompleted !== true;
  const planStatus: R50AuditAccessControlPlanStatus =
    prohibitedFindings.length > 0
      ? "access_control_blocked"
      : blockingFindings.length > 0 || legalAdminReviewRequired || operatorApprovalRequired
        ? "access_review_required"
        : "future_access_plan_ready";

  addUnique(advisoryFindings, "R50D plans future access control only; it grants no current read or write permission.");

  const result: R50AuditPersistenceAccessControlPlanningResult = {
    planStatus,
    viewerPermissionStatus,
    writerPermissionStatus,
    exportPermissionStatus,
    deletionPermissionStatus,
    requestedRole,
    legalAdminReviewRequired,
    operatorApprovalRequired,
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
    summary: "R50D audit persistence access control planning contract only.",
  };

  return {
    ...result,
    summary: summarizeR50AuditAccessControlPlanning(result),
  };
}
