export type R48AuditPersistencePlanStatus =
  | "not_persistable"
  | "persistence_blocked"
  | "persistence_ready_for_review"
  | "persistence_plan_ready"
  | "simulation_only_persistence_recommended";

export type R48AuditPersistenceEventStatus =
  | "prohibited"
  | "blocked"
  | "rejected"
  | "recorded_simulation_only"
  | "recorded_planning_only";

export type R48AuditPersistenceEventDecision =
  | "prohibited"
  | "blocked"
  | "dry_run_rejected"
  | "dry_run_ready"
  | "simulation_only_ready"
  | "planning_only"
  | "missing";

export type R48AuditPersistencePlanReasonCode =
  | "r48i_audit_persistence_plan_contract_only"
  | "activation_not_executed"
  | "provider_activation_forbidden"
  | "live_execution_forbidden"
  | "persistence_not_allowed_now"
  | "event_missing"
  | "event_not_simulation_only"
  | "event_invariants_unsafe"
  | "event_secret_redaction_missing"
  | "event_non_secret_requirement_failed"
  | "event_status_prohibited"
  | "event_status_blocked"
  | "event_status_rejected"
  | "event_decision_missing"
  | "operator_review_required"
  | "schema_review_required"
  | "retention_policy_required"
  | "failure_handling_required"
  | "secret_redaction_review_required"
  | "future_audit_persistence_recommended"
  | "persistence_plan_ready"
  | "no_db_write_performed"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false";

export type R48AuditPersistenceEventSignal = {
  eventType?: string | null;
  eventStatus?: R48AuditPersistenceEventStatus;
  decision?: R48AuditPersistenceEventDecision;
  reasonCodes?: string[];
  operatorReviewRequired?: boolean;
  secretRedactionApplied?: boolean;
  persistenceRecommended?: boolean;
  persistenceExecuted?: boolean;
  sanitizedMetadata?: Record<string, string | number | boolean | null>;
  createdAtSource?: "provided" | "omitted";
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
};

export type R48ControlledActivationAuditPersistencePlanInput = {
  auditEvent?: R48AuditPersistenceEventSignal;
  schemaReviewed?: boolean;
  retentionPolicyDefined?: boolean;
  failureHandlingDefined?: boolean;
  secretRedactionReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  reasonCodes?: string[];
};

export type R48ControlledActivationAuditPersistencePlanResult = {
  planStatus: R48AuditPersistencePlanStatus;
  persistenceRecommended: boolean;
  persistenceAllowedNow: false;
  requiresOperatorReview: boolean;
  requiresSchemaReview: boolean;
  requiresRetentionPolicy: boolean;
  requiresSecretRedaction: boolean;
  requiresFailureHandling: boolean;
  eventStatus: R48AuditPersistenceEventStatus | "missing";
  eventDecision: R48AuditPersistenceEventDecision | "missing";
  reasonCodes: string[];
  storageTarget: "future_audit_log" | "none";
  nonSecretOnly: true;
  simulationOnly: true;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  liveTestReady: false;
  prohibitedFindings: string[];
  blockingFindings: string[];
  advisoryFindings: string[];
  summary: string;
};

export type R48AuditPersistencePlanInvariantCheck = {
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
  >;
};

const maxListItems = 80;
const maxTextLength = 180;
const maxSummaryLength = 700;
const secretPattern = /\b(api[_-]?key|secret|token|password|bearer|database_url|direct_url|credential|authorization|auth)\b/i;

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

function addReason(reasonCodes: string[], reasonCode: R48AuditPersistencePlanReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function collectExternalReasonCodes(reasonCodes: string[] | undefined, target: string[]) {
  for (const reasonCode of reasonCodes ?? []) {
    addUnique(target, reasonCode);
  }
}

function addProhibited(prohibitedFindings: string[], finding: string) {
  addUnique(prohibitedFindings, finding);
}

function addBlocking(blockingFindings: string[], finding: string) {
  addUnique(blockingFindings, finding);
}

function addAdvisory(advisoryFindings: string[], finding: string) {
  addUnique(advisoryFindings, finding);
}

function metadataIsNonSecret(metadata?: Record<string, string | number | boolean | null>) {
  return Object.entries(metadata ?? {}).every(([key, value]) => {
    return !secretPattern.test(key) && !(typeof value === "string" && secretPattern.test(value));
  });
}

function auditEventInvariantsAreSafe(auditEvent?: R48AuditPersistenceEventSignal) {
  return (
    auditEvent?.activationExecuted !== true &&
    auditEvent?.providerActivationAllowed !== true &&
    auditEvent?.liveExecutionAllowed !== true &&
    auditEvent?.sent !== true &&
    auditEvent?.providerCalled !== true &&
    auditEvent?.canSendNow !== true &&
    auditEvent?.simulationOnly === true &&
    auditEvent?.liveTestReady !== true &&
    auditEvent?.persistenceExecuted !== true
  );
}

export function assertR48ControlledActivationAuditPersistencePlanInvariants(
  result: Pick<
    R48ControlledActivationAuditPersistencePlanResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
    | "persistenceAllowedNow"
  >,
): R48AuditPersistencePlanInvariantCheck {
  const reasonCodes: R48AuditPersistencePlanInvariantCheck["reasonCodes"] = [];

  if (result.activationExecuted !== false) reasonCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) reasonCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) reasonCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) reasonCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) reasonCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) reasonCodes.push("can_send_now_must_be_false");
  if (result.simulationOnly !== true) reasonCodes.push("simulation_only_required");
  if (result.liveTestReady !== false) reasonCodes.push("live_test_ready_must_be_false");
  if (result.persistenceAllowedNow !== false) reasonCodes.push("persistence_not_allowed_now");

  return {
    passed: reasonCodes.length === 0,
    reasonCodes,
  };
}

export function summarizeR48ControlledActivationAuditPersistencePlan(
  result: R48ControlledActivationAuditPersistencePlanResult,
) {
  const invariantCheck = assertR48ControlledActivationAuditPersistencePlanInvariants(result);

  return boundSummary(
    `R48I audit persistence plan is ${result.planStatus}. ` +
      `Persistence recommended: ${result.persistenceRecommended}; allowed now: ${result.persistenceAllowedNow}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Storage target is ${result.storageTarget}. Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Plan is advisory and planning-only; no DB write, Prisma call, route execution, provider activation, SMS/email send, env read, network call, or automation activation is authorized.",
  );
}

export function createR48ControlledActivationAuditPersistencePlan(
  input: R48ControlledActivationAuditPersistencePlanInput = {},
): R48ControlledActivationAuditPersistencePlanResult {
  const reasonCodes: string[] = [];
  const prohibitedFindings: string[] = [];
  const blockingFindings: string[] = [];
  const advisoryFindings: string[] = [];
  const auditEvent = input.auditEvent;

  addReason(reasonCodes, "r48i_audit_persistence_plan_contract_only");
  addReason(reasonCodes, "activation_not_executed");
  addReason(reasonCodes, "provider_activation_forbidden");
  addReason(reasonCodes, "live_execution_forbidden");
  addReason(reasonCodes, "persistence_not_allowed_now");
  addReason(reasonCodes, "no_db_write_performed");
  collectExternalReasonCodes(input.reasonCodes, reasonCodes);
  collectExternalReasonCodes(auditEvent?.reasonCodes, reasonCodes);

  if (!auditEvent) {
    addReason(reasonCodes, "event_missing");
    addProhibited(prohibitedFindings, "Audit event is missing.");
  } else {
    if (auditEvent.simulationOnly !== true) {
      addReason(reasonCodes, "event_not_simulation_only");
      addProhibited(prohibitedFindings, "Audit event is not simulation-only.");
    }

    if (!auditEventInvariantsAreSafe(auditEvent)) {
      addReason(reasonCodes, "event_invariants_unsafe");
      addProhibited(prohibitedFindings, "Audit event indicates execution, sending, provider activation, live readiness, or persistence.");
    }

    if (auditEvent.secretRedactionApplied !== true) {
      addReason(reasonCodes, "event_secret_redaction_missing");
      addBlocking(blockingFindings, "Secret redaction was not applied to the audit event.");
    }

    if (!metadataIsNonSecret(auditEvent.sanitizedMetadata)) {
      addReason(reasonCodes, "event_non_secret_requirement_failed");
      addBlocking(blockingFindings, "Sanitized metadata still contains secret-like fields or values.");
    }

    if (auditEvent.eventStatus === "prohibited") {
      addReason(reasonCodes, "event_status_prohibited");
      addAdvisory(advisoryFindings, "Prohibited event should be retained for future audit review only.");
    }
    if (auditEvent.eventStatus === "blocked") {
      addReason(reasonCodes, "event_status_blocked");
      addAdvisory(advisoryFindings, "Blocked event should be retained for future audit review only.");
    }
    if (auditEvent.eventStatus === "rejected") {
      addReason(reasonCodes, "event_status_rejected");
      addAdvisory(advisoryFindings, "Rejected dry-run event should be retained for future audit review only.");
    }
    if (!auditEvent.decision || auditEvent.decision === "missing") {
      addReason(reasonCodes, "event_decision_missing");
      addBlocking(blockingFindings, "Audit event decision is missing.");
    }
  }

  const requiresOperatorReview = input.operatorReviewCompleted !== true || auditEvent?.operatorReviewRequired === true;
  const requiresSchemaReview = input.schemaReviewed !== true;
  const requiresRetentionPolicy = input.retentionPolicyDefined !== true;
  const requiresSecretRedaction = input.secretRedactionReviewed !== true || auditEvent?.secretRedactionApplied !== true;
  const requiresFailureHandling = input.failureHandlingDefined !== true;

  if (requiresOperatorReview) {
    addReason(reasonCodes, "operator_review_required");
    addBlocking(blockingFindings, "Operator review is required before future persistence planning can complete.");
  }
  if (requiresSchemaReview) {
    addReason(reasonCodes, "schema_review_required");
    addBlocking(blockingFindings, "Schema review is required before future audit persistence.");
  }
  if (requiresRetentionPolicy) {
    addReason(reasonCodes, "retention_policy_required");
    addBlocking(blockingFindings, "Retention policy is required before future audit persistence.");
  }
  if (requiresSecretRedaction) {
    addReason(reasonCodes, "secret_redaction_review_required");
    addBlocking(blockingFindings, "Secret redaction review is required before future audit persistence.");
  }
  if (requiresFailureHandling) {
    addReason(reasonCodes, "failure_handling_required");
    addBlocking(blockingFindings, "Failure handling plan is required before future audit persistence.");
  }

  const persistenceRecommended = auditEvent?.persistenceRecommended === true && prohibitedFindings.length === 0;
  let planStatus: R48AuditPersistencePlanStatus = "not_persistable";

  if (prohibitedFindings.length > 0) {
    planStatus = "not_persistable";
  } else if (blockingFindings.length > 0) {
    planStatus = persistenceRecommended ? "persistence_blocked" : "persistence_ready_for_review";
  } else if (persistenceRecommended && auditEvent?.eventStatus === "recorded_simulation_only") {
    planStatus = "simulation_only_persistence_recommended";
    addReason(reasonCodes, "future_audit_persistence_recommended");
  } else if (persistenceRecommended) {
    planStatus = "persistence_plan_ready";
    addReason(reasonCodes, "persistence_plan_ready");
  } else {
    planStatus = "persistence_ready_for_review";
  }

  addAdvisory(advisoryFindings, "R48I plans future audit persistence only and cannot write to storage.");

  const result: R48ControlledActivationAuditPersistencePlanResult = {
    planStatus,
    persistenceRecommended,
    persistenceAllowedNow: false,
    requiresOperatorReview,
    requiresSchemaReview,
    requiresRetentionPolicy,
    requiresSecretRedaction,
    requiresFailureHandling,
    eventStatus: auditEvent?.eventStatus ?? "missing",
    eventDecision: auditEvent?.decision ?? "missing",
    reasonCodes,
    storageTarget: persistenceRecommended ? "future_audit_log" : "none",
    nonSecretOnly: true,
    simulationOnly: true,
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    liveTestReady: false,
    prohibitedFindings,
    blockingFindings,
    advisoryFindings,
    summary: "R48I controlled activation audit persistence plan contract only.",
  };

  return {
    ...result,
    summary: summarizeR48ControlledActivationAuditPersistencePlan(result),
  };
}
