export type R63OperatorWorkQueueScopeStatus =
  | "operator_work_queue_scope_blocked"
  | "operator_review_required"
  | "operator_work_queue_scope_ready";

export type R63WorkQueueCategory =
  | "governance_stop_visibility"
  | "highest_priority_operator_review"
  | "overdue_operational_review"
  | "workflow_bottleneck_visibility"
  | "stale_workflow_visibility"
  | "revenue_priority_workload_review"
  | "operator_workload_pressure_review"
  | "assignment_readiness_workload_review"
  | "buyer_review_workload_visibility"
  | "acquisition_follow_up_workload_visibility"
  | "blocked_workflow_visibility"
  | "incomplete_operational_workflow_visibility"
  | "operational_readiness_review"
  | "operator_attention_guidance"
  | "queue_pressure_visibility"
  | "workflow_aging_visibility"
  | "delayed_review_visibility"
  | "high_value_review_priority"
  | "workload_balancing_visibility"
  | "manual_review_guidance"
  | "workflow_stagnation_visibility"
  | "operational_momentum_review"
  | "revenue_risk_visibility"
  | "review_needed_prioritization";

export type R63WorkQueueRankingConcept = {
  concept: R63WorkQueueCategory;
  rank: number;
  revenueReason: string;
  safeOperatorGuidance: string;
  boundary: string;
};

export type R63ForbiddenWorkflowSemantic =
  | "auto assign tasks"
  | "auto execute workflows"
  | "auto contact sellers"
  | "auto contact buyers"
  | "launch campaign"
  | "activate provider"
  | "auto dial"
  | "send SMS"
  | "send email"
  | "execute workflow"
  | "autonomous negotiation"
  | "autonomous outreach"
  | "auto escalation"
  | "auto approval"
  | "autonomous workflow routing"
  | "AI closes deals automatically"
  | "AI negotiates automatically"
  | "AI manages workflow automatically"
  | "hidden execution affordances";

export type R63ScopeWarningCode =
  | "r63a_scope_contract_only"
  | "input_missing"
  | "r62f_lockdown_review_required"
  | "workload_categories_review_required"
  | "stale_workflow_review_required"
  | "bottleneck_review_required"
  | "review_priority_review_required"
  | "revenue_priority_review_required"
  | "queue_pressure_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "email_sms_sending_rejected"
  | "outreach_execution_rejected"
  | "campaign_launch_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
  | "autonomous_workflow_rejected"
  | "autonomous_negotiation_rejected"
  | "approval_grants_execution_rejected"
  | "read_only_required"
  | "advisory_only_required"
  | "simulation_only_required"
  | "provider_called_must_be_false"
  | "sent_must_be_false"
  | "persistence_not_allowed_now"
  | "polling_not_allowed"
  | "runtime_activation_not_allowed"
  | "provider_activation_allowed_must_be_false"
  | "approval_grants_execution_must_be_false"
  | "ui_implementation_not_allowed_now";

export type R63ScopeInput = {
  r62fLockdownReviewed?: boolean;
  workloadCategoriesReviewed?: boolean;
  staleWorkflowReviewed?: boolean;
  bottleneckReviewed?: boolean;
  reviewPriorityReviewed?: boolean;
  revenuePriorityReviewed?: boolean;
  queuePressureReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  emailSmsSendingRequested?: boolean;
  outreachExecutionRequested?: boolean;
  campaignLaunchRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
  autonomousWorkflowRequested?: boolean;
  autonomousNegotiationRequested?: boolean;
  approvalGrantsExecution?: boolean;
  readOnly?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  persistenceAllowedNow?: boolean;
  pollingAllowed?: boolean;
  runtimeActivationAllowed?: boolean;
  providerActivationAllowed?: boolean;
  uiImplementationAllowedNow?: boolean;
  extraScopeNotes?: string[];
};

export type R63ScopeSafetyFlags = {
  readOnly: true;
  advisoryOnly: true;
  simulationOnly: true;
  providerCalled: false;
  sent: false;
  persistenceAllowedNow: false;
  pollingAllowed: false;
  runtimeActivationAllowed: false;
  providerActivationAllowed: false;
  approvalGrantsExecution: false;
  uiImplementationAllowedNow: false;
};

export type R63PreImplementationAuditFinding = {
  classification:
    | "Required before implementation"
    | "Safe to include now"
    | "Future upgrade"
    | "Optional optimization"
    | "Forbidden because it violates governance";
  finding: string;
};

export type R63ScopeResult = R63ScopeSafetyFlags & {
  phase: "R63A";
  surface: "operator_work_queue_intelligence_scope";
  scopeStatus: R63OperatorWorkQueueScopeStatus;
  workloadCategories: R63WorkQueueCategory[];
  rankingConcepts: R63WorkQueueRankingConcept[];
  staleWorkflowConcepts: string[];
  bottleneckConcepts: string[];
  reviewPriorityConcepts: string[];
  revenuePriorityConcepts: string[];
  queuePressureConcepts: string[];
  governanceBoundaries: string[];
  safeOperatorGuidanceWording: string[];
  forbiddenWorkflowSemantics: R63ForbiddenWorkflowSemantic[];
  deterministicInvariants: string[];
  accessibilityRequirements: string[];
  preImplementationAuditFindings: R63PreImplementationAuditFinding[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R63ScopeSafetyFlags;
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R63ScopeInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 850;

const safetyFlags: R63ScopeSafetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  uiImplementationAllowedNow: false,
};

const workloadCategories: R63WorkQueueCategory[] = [
  "governance_stop_visibility",
  "highest_priority_operator_review",
  "overdue_operational_review",
  "workflow_bottleneck_visibility",
  "stale_workflow_visibility",
  "revenue_priority_workload_review",
  "operator_workload_pressure_review",
  "assignment_readiness_workload_review",
  "buyer_review_workload_visibility",
  "acquisition_follow_up_workload_visibility",
  "blocked_workflow_visibility",
  "incomplete_operational_workflow_visibility",
  "operational_readiness_review",
  "operator_attention_guidance",
  "queue_pressure_visibility",
  "workflow_aging_visibility",
  "delayed_review_visibility",
  "high_value_review_priority",
  "workload_balancing_visibility",
  "manual_review_guidance",
  "workflow_stagnation_visibility",
  "operational_momentum_review",
  "revenue_risk_visibility",
  "review_needed_prioritization",
];

const rankingConcepts: R63WorkQueueRankingConcept[] = workloadCategories.map((concept, index) => ({
  concept,
  rank: index + 1,
  revenueReason:
    concept === "governance_stop_visibility"
      ? "Governance stops protect compliance and must outrank urgency, workload pressure, stale workflows, revenue priority, and operational momentum."
      : "This signal helps a human operator focus review on revenue risk, workload pressure, bottlenecks, or stale workflow recovery.",
  safeOperatorGuidance:
    concept === "governance_stop_visibility"
      ? "Governance stop signals must be resolved first."
      : "Manual review may be beneficial.",
  boundary:
    "Operational priority is advisory only and never means execute, contact, activate, automate, launch, send, or route automatically.",
}));

const staleWorkflowConcepts = [
  "stale workflow visibility",
  "workflow aging visibility",
  "delayed-review visibility",
  "workflow stagnation visibility",
  "operational momentum review",
  "manual stale-workflow recovery review only",
];

const bottleneckConcepts = [
  "workflow bottleneck visibility",
  "blocked workflow visibility",
  "incomplete operational workflow visibility",
  "revenue-risk visibility",
  "bottleneck labels cannot assign work, mutate workflow state, persist, poll, or execute",
];

const reviewPriorityConcepts = [
  "highest-priority operator review",
  "review-needed prioritization",
  "high-value review priority",
  "operator attention guidance",
  "manual-review guidance",
];

const revenuePriorityConcepts = [
  "revenue-priority workload review",
  "high-value review priority",
  "revenue-risk visibility",
  "operational readiness review",
  "priority means manual review may be beneficial",
];

const queuePressureConcepts = [
  "operator workload pressure review",
  "queue pressure visibility",
  "workload balancing visibility",
  "acquisition follow-up workload visibility",
  "buyer-review workload visibility",
  "assignment-readiness workload review",
  "not an execution queue",
];

const governanceBoundaries = [
  "R63A is a scope-contract-only phase and cannot authorize UI implementation.",
  "Governance stop signals must render first in later UI and outrank urgency, workload pressure, stale workflow pressure, revenue priority, and operational momentum.",
  "Operational priority only means manual review may be beneficial, operator attention may be warranted, or workflow review may deserve prioritization.",
  "Operational priority never means execute, contact, activate, automate, launch, send, or route automatically.",
  "No lead, property, buyer, seller, workflow, or task facts may be invented.",
];

const safeOperatorGuidanceWording = [
  "Manual review may be beneficial.",
  "Operator attention may be warranted.",
  "Workflow review may deserve prioritization.",
  "Governance stop signals must be resolved first.",
  "Operational priority label is advisory only.",
  "Queue pressure is visibility only.",
];

const forbiddenWorkflowSemantics: R63ForbiddenWorkflowSemantic[] = [
  "auto assign tasks",
  "auto execute workflows",
  "auto contact sellers",
  "auto contact buyers",
  "launch campaign",
  "activate provider",
  "auto dial",
  "send SMS",
  "send email",
  "execute workflow",
  "autonomous negotiation",
  "autonomous outreach",
  "auto escalation",
  "auto approval",
  "autonomous workflow routing",
  "AI closes deals automatically",
  "AI negotiates automatically",
  "AI manages workflow automatically",
  "hidden execution affordances",
];

const deterministicInvariants = [
  "readOnly must remain true.",
  "advisoryOnly must remain true.",
  "simulationOnly must remain true.",
  "providerCalled must remain false.",
  "sent must remain false.",
  "persistenceAllowedNow must remain false.",
  "pollingAllowed must remain false.",
  "runtimeActivationAllowed must remain false.",
  "providerActivationAllowed must remain false.",
  "approvalGrantsExecution must remain false.",
  "uiImplementationAllowedNow must remain false in R63A.",
  "Governance stop signals must rank first.",
  "Deterministic behavior must remain bounded, explainable, fail-closed, and manual-first.",
];

const accessibilityRequirements = [
  "Future UI must use semantic headings.",
  "Future UI must use readable labels and screen-reader-friendly summaries.",
  "Status meaning must be text-based and never depend on color alone.",
  "No motion dependency, focus movement, auto-refresh, or polling is allowed.",
  "Reading order must keep governance stop visibility before advisory operational guidance.",
];

const preImplementationAuditFindings: R63PreImplementationAuditFinding[] = [
  { classification: "Required before implementation", finding: "Governance stop dominance must be preserved." },
  { classification: "Safe to include now", finding: "Read-only workload, stale workflow, bottleneck, and queue pressure concepts." },
  { classification: "Future upgrade", finding: "Additional visualization may be scoped after UI boundaries are audited." },
  { classification: "Optional optimization", finding: "Shared ranking helpers may be extracted later if repeated across phases." },
  { classification: "Forbidden because it violates governance", finding: "Any auto assignment, outreach, provider activation, campaign, or workflow execution behavior." },
];

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalized = normalizeText(value);
  return normalized.length <= maxTextLength ? normalized : `${normalized.slice(0, maxTextLength)}...`;
}

function boundSummary(value: string) {
  return value.length <= maxSummaryLength ? value : `${value.slice(0, maxSummaryLength)}...`;
}

function addUnique(list: string[], value: string) {
  const bounded = boundText(value);
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R63ScopeWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);
  return notes;
}

function hasForbiddenRequest(input: R63ScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.emailSmsSendingRequested === true ||
    input.outreachExecutionRequested === true ||
    input.campaignLaunchRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.redesignRequested === true ||
    input.autonomousWorkflowRequested === true ||
    input.autonomousNegotiationRequested === true ||
    input.approvalGrantsExecution === true ||
    input.readOnly === false ||
    input.advisoryOnly === false ||
    input.simulationOnly === false ||
    input.providerCalled === true ||
    input.sent === true ||
    input.persistenceAllowedNow === true ||
    input.pollingAllowed === true ||
    input.runtimeActivationAllowed === true ||
    input.providerActivationAllowed === true ||
    input.uiImplementationAllowedNow === true
  );
}

export function assertR63OperatorWorkQueueScopeInvariants(
  result: Pick<
    R63ScopeResult,
    | "readOnly"
    | "advisoryOnly"
    | "simulationOnly"
    | "providerCalled"
    | "sent"
    | "persistenceAllowedNow"
    | "pollingAllowed"
    | "runtimeActivationAllowed"
    | "providerActivationAllowed"
    | "approvalGrantsExecution"
    | "uiImplementationAllowedNow"
  >,
): R63ScopeInvariantCheck {
  const warningCodes: string[] = [];
  if (result.readOnly !== true) warningCodes.push("read_only_required");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.pollingAllowed !== false) warningCodes.push("polling_not_allowed");
  if (result.runtimeActivationAllowed !== false) warningCodes.push("runtime_activation_not_allowed");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.approvalGrantsExecution !== false) warningCodes.push("approval_grants_execution_must_be_false");
  if (result.uiImplementationAllowedNow !== false) warningCodes.push("ui_implementation_not_allowed_now");
  return { passed: warningCodes.length === 0, warningCodes };
}

export function summarizeR63OperatorWorkQueueScope(result: R63ScopeResult) {
  const invariantCheck = assertR63OperatorWorkQueueScopeInvariants(result);
  return boundSummary(
    `R63A ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.workloadCategories.length} workload categories and ${result.rankingConcepts.length} ranking concepts are scoped. ` +
      `${result.forbiddenWorkflowSemantics.length} forbidden workflow semantics are blocked. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract cannot authorize UI implementation, routes, providers, outreach, campaigns, persistence, polling, execution controls, autonomous workflows, autonomous negotiation, or runtime activation.",
  );
}

export function createR63OperatorWorkQueueIntelligenceScopeContract(input: R63ScopeInput = {}): R63ScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r63a_scope_contract_only");
  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r62fLockdownReviewed !== true) addWarning(warningCodes, "r62f_lockdown_review_required");
  if (input.workloadCategoriesReviewed !== true) addWarning(warningCodes, "workload_categories_review_required");
  if (input.staleWorkflowReviewed !== true) addWarning(warningCodes, "stale_workflow_review_required");
  if (input.bottleneckReviewed !== true) addWarning(warningCodes, "bottleneck_review_required");
  if (input.reviewPriorityReviewed !== true) addWarning(warningCodes, "review_priority_review_required");
  if (input.revenuePriorityReviewed !== true) addWarning(warningCodes, "revenue_priority_review_required");
  if (input.queuePressureReviewed !== true) addWarning(warningCodes, "queue_pressure_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.emailSmsSendingRequested === true) addWarning(warningCodes, "email_sms_sending_rejected");
  if (input.outreachExecutionRequested === true) addWarning(warningCodes, "outreach_execution_rejected");
  if (input.campaignLaunchRequested === true) addWarning(warningCodes, "campaign_launch_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
  if (input.autonomousWorkflowRequested === true) addWarning(warningCodes, "autonomous_workflow_rejected");
  if (input.autonomousNegotiationRequested === true) addWarning(warningCodes, "autonomous_negotiation_rejected");
  if (input.approvalGrantsExecution === true) addWarning(warningCodes, "approval_grants_execution_rejected");
  if (input.readOnly === false) addWarning(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addWarning(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addWarning(warningCodes, "simulation_only_required");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addWarning(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addWarning(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.uiImplementationAllowedNow === true) addWarning(warningCodes, "ui_implementation_not_allowed_now");

  for (const warningCode of warningCodes) {
    if (warningCode.endsWith("_rejected") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingRequiredReview =
    input.r62fLockdownReviewed !== true ||
    input.workloadCategoriesReviewed !== true ||
    input.staleWorkflowReviewed !== true ||
    input.bottleneckReviewed !== true ||
    input.reviewPriorityReviewed !== true ||
    input.revenuePriorityReviewed !== true ||
    input.queuePressureReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R63OperatorWorkQueueScopeStatus = hasForbiddenRequest(input)
    ? "operator_work_queue_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "operator_work_queue_scope_ready";
  const result: R63ScopeResult = {
    phase: "R63A",
    surface: "operator_work_queue_intelligence_scope",
    scopeStatus,
    workloadCategories,
    rankingConcepts,
    staleWorkflowConcepts,
    bottleneckConcepts,
    reviewPriorityConcepts,
    revenuePriorityConcepts,
    queuePressureConcepts,
    governanceBoundaries,
    safeOperatorGuidanceWording,
    forbiddenWorkflowSemantics,
    deterministicInvariants,
    accessibilityRequirements,
    preImplementationAuditFindings,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R63B - Operator Work Queue Intelligence UI Scope Audit",
    summary: "R63A operator work queue intelligence scope contract only.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR63OperatorWorkQueueScope(result) };
}
