export type R53ObservabilityPlanStatus =
  | "observability_planning_blocked"
  | "operator_review_required"
  | "observability_plan_ready";

export type R53MetricDataSourceSafety =
  | "safe_read_only_now"
  | "safe_future_derived_metric"
  | "requires_audit_persistence_first"
  | "unsafe_until_runtime_activation_exists";

export type R53MetricCategory =
  | "manual_revenue"
  | "operator_workflow"
  | "governance_safety"
  | "excluded";

export type R53FirstVisibilitySurface = "dashboard_overview";

export type R53ObservabilityWarningCode =
  | "r53a_observability_planning_contract_only"
  | "input_missing"
  | "manual_metrics_review_required"
  | "operator_metrics_review_required"
  | "governance_metrics_review_required"
  | "excluded_metrics_review_required"
  | "data_source_review_required"
  | "visibility_surface_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "workflow_mutation_rejected"
  | "persistence_write_rejected"
  | "advisory_to_permission_rejected"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "persistence_not_allowed_now";

export type R53RevenueOperationsObservabilityPlanningInput = {
  manualRevenueMetricsReviewed?: boolean;
  operatorWorkflowMetricsReviewed?: boolean;
  governanceSafetyMetricsReviewed?: boolean;
  excludedMetricsReviewed?: boolean;
  dataSourceSafetyReviewed?: boolean;
  visibilitySurfaceReviewed?: boolean;
  accessibilityRequirementsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  workflowMutationRequested?: boolean;
  persistenceWriteRequested?: boolean;
  advisoryConvertedToPermission?: boolean;
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
  extraPlanningNotes?: string[];
};

export type R53ObservabilityMetric = {
  id: string;
  label: string;
  category: R53MetricCategory;
  dataSourceSafety: R53MetricDataSourceSafety;
  operatorValue: string;
  safetyConstraint: string;
};

export type R53AccessibilityRequirement = {
  requirement: string;
  reason: string;
};

export type R53RevenueOperationsObservabilityPlanningResult = {
  planStatus: R53ObservabilityPlanStatus;
  firstVisibilitySurface: R53FirstVisibilitySurface;
  firstVisibilityReason: string;
  manualRevenueMetrics: R53ObservabilityMetric[];
  operatorWorkflowMetrics: R53ObservabilityMetric[];
  governanceSafetyMetrics: R53ObservabilityMetric[];
  excludedMetrics: R53ObservabilityMetric[];
  dataSourceSafetyClassification: R53ObservabilityMetric[];
  accessibilityRequirements: R53AccessibilityRequirement[];
  implementationOrder: string[];
  operatorReviewRequired: boolean;
  warningCodes: string[];
  operatorNotes: string[];
  summary: string;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  persistenceAllowedNow: false;
};

export type R53RevenueOperationsObservabilityInvariantCheck = {
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
  >;
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalized = normalizeText(value);

  if (normalized.length <= maxTextLength) return normalized;

  return `${normalized.slice(0, maxTextLength)}...`;
}

function boundSummary(value: string) {
  if (value.length <= maxSummaryLength) return value;

  return `${value.slice(0, maxSummaryLength)}...`;
}

function addUnique(list: string[], value: string) {
  const bounded = boundText(value);

  if (bounded && !list.includes(bounded) && list.length < maxListItems) {
    list.push(bounded);
  }
}

function addWarning(warningCodes: string[], warningCode: R53ObservabilityWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenObservabilityRequest(input: R53RevenueOperationsObservabilityPlanningInput) {
  return (
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.workflowMutationRequested === true ||
    input.persistenceWriteRequested === true ||
    input.advisoryConvertedToPermission === true ||
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

const manualRevenueMetrics: R53ObservabilityMetric[] = [
  {
    id: "new_leads_reviewed",
    label: "New leads reviewed",
    category: "manual_revenue",
    dataSourceSafety: "safe_future_derived_metric",
    operatorValue: "Shows whether fresh leads are being worked manually.",
    safetyConstraint: "Must be derived read-only from lead status/timestamps until review tracking exists.",
  },
  {
    id: "seller_calls_completed_manually",
    label: "Seller calls completed manually",
    category: "manual_revenue",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Measures real manual seller contact activity through recorded outcomes.",
    safetyConstraint: "Must not imply calls were placed by the app.",
  },
  {
    id: "seller_outcomes_recorded",
    label: "Seller outcomes recorded",
    category: "manual_revenue",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Shows whether manual seller conversations are becoming structured follow-up data.",
    safetyConstraint: "Must remain read-only and not trigger follow-up.",
  },
  {
    id: "follow_ups_due_manually",
    label: "Follow-ups due manually",
    category: "manual_revenue",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Identifies manual follow-up workload due now.",
    safetyConstraint: "Must not auto-send or auto-schedule outreach.",
  },
  {
    id: "follow_ups_overdue_manually",
    label: "Follow-ups overdue manually",
    category: "manual_revenue",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Highlights delayed manual work that may affect revenue.",
    safetyConstraint: "Must not create polling or automatic reminders.",
  },
  {
    id: "buyer_ready_leads",
    label: "Buyer-ready leads",
    category: "manual_revenue",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Shows leads approaching disposition review.",
    safetyConstraint: "Must require human package review before sharing.",
  },
  {
    id: "incomplete_buyer_packages",
    label: "Incomplete buyer packages",
    category: "manual_revenue",
    dataSourceSafety: "safe_future_derived_metric",
    operatorValue: "Shows missing disposition package work.",
    safetyConstraint: "Must label assumptions and avoid inventing property facts.",
  },
  {
    id: "near_contract_opportunities",
    label: "Near-contract opportunities",
    category: "manual_revenue",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Focuses operator attention on likely revenue movement.",
    safetyConstraint: "Must not auto-move pipeline stage.",
  },
  {
    id: "near_close_opportunities",
    label: "Near-close opportunities",
    category: "manual_revenue",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Highlights closing workflow attention.",
    safetyConstraint: "Must not imply title, contract, or closing facts are verified unless present.",
  },
  {
    id: "blocked_leads",
    label: "Blocked leads",
    category: "manual_revenue",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Shows leads that should not receive manual outreach.",
    safetyConstraint: "Must preserve blocker visibility and fail closed.",
  },
  {
    id: "dnc_opt_out_blocked_leads",
    label: "DNC/opt-out blocked leads",
    category: "manual_revenue",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Separates compliance blockers from ordinary bottlenecks.",
    safetyConstraint: "Must never create override controls.",
  },
];

const operatorWorkflowMetrics: R53ObservabilityMetric[] = [
  {
    id: "daily_review_completion",
    label: "Daily review completion",
    category: "operator_workflow",
    dataSourceSafety: "requires_audit_persistence_first",
    operatorValue: "Shows whether the operator completed the daily SOP.",
    safetyConstraint: "Requires future audited checkoff persistence before tracking.",
  },
  {
    id: "triage_completion",
    label: "Triage completion",
    category: "operator_workflow",
    dataSourceSafety: "safe_future_derived_metric",
    operatorValue: "Shows whether new leads have been assigned a review state.",
    safetyConstraint: "Must derive from existing lead states, not create new workflow writes.",
  },
  {
    id: "seller_call_outcome_completion",
    label: "Seller call outcome completion",
    category: "operator_workflow",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Shows whether manual seller calls are being captured.",
    safetyConstraint: "Must not trigger outreach from captured outcomes.",
  },
  {
    id: "approval_queue_review_completion",
    label: "Approval queue review completion",
    category: "operator_workflow",
    dataSourceSafety: "safe_future_derived_metric",
    operatorValue: "Shows whether pending review work is shrinking.",
    safetyConstraint: "Approval remains review-only and does not send.",
  },
  {
    id: "buyer_readiness_review_completion",
    label: "Buyer readiness review completion",
    category: "operator_workflow",
    dataSourceSafety: "safe_future_derived_metric",
    operatorValue: "Shows whether disposition review is being completed.",
    safetyConstraint: "Must not share buyer packages automatically.",
  },
  {
    id: "disposition_package_readiness",
    label: "Disposition package readiness",
    category: "operator_workflow",
    dataSourceSafety: "safe_future_derived_metric",
    operatorValue: "Shows which leads are missing package pieces.",
    safetyConstraint: "Must label missing data instead of fabricating facts.",
  },
  {
    id: "bottleneck_count",
    label: "Bottleneck count",
    category: "operator_workflow",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Shows how much revenue work is trapped behind blockers.",
    safetyConstraint: "Must stay read-only and not auto-resolve blockers.",
  },
];

const governanceSafetyMetrics: R53ObservabilityMetric[] = [
  {
    id: "simulation_only_status",
    label: "Simulation-only status",
    category: "governance_safety",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Confirms the system remains non-executing.",
    safetyConstraint: "Must never become execution permission.",
  },
  {
    id: "providers_disabled_status",
    label: "Providers disabled status",
    category: "governance_safety",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Confirms provider activation remains blocked.",
    safetyConstraint: "Must not expose provider toggles.",
  },
  {
    id: "manual_review_required_count",
    label: "Manual review required count",
    category: "governance_safety",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Shows how much work still needs human review.",
    safetyConstraint: "Must not bulk-approve or auto-review items.",
  },
  {
    id: "blocked_governance_count",
    label: "Blocked governance count",
    category: "governance_safety",
    dataSourceSafety: "safe_future_derived_metric",
    operatorValue: "Shows governance blockers affecting manual operations.",
    safetyConstraint: "Must not create override controls.",
  },
  {
    id: "incomplete_data_risk_count",
    label: "Incomplete data risk count",
    category: "governance_safety",
    dataSourceSafety: "safe_future_derived_metric",
    operatorValue: "Shows risk created by missing lead or package data.",
    safetyConstraint: "Must not invent missing values.",
  },
  {
    id: "dnc_opt_out_risk_count",
    label: "DNC/opt-out risk count",
    category: "governance_safety",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Shows compliance blockers that stop outreach.",
    safetyConstraint: "Must remain non-overridable.",
  },
  {
    id: "approval_does_not_send_confirmation",
    label: "Approval does not send confirmation",
    category: "governance_safety",
    dataSourceSafety: "safe_read_only_now",
    operatorValue: "Reinforces the approval boundary.",
    safetyConstraint: "Must keep sent:false and providerCalled:false expectations visible.",
  },
];

const excludedMetrics: R53ObservabilityMetric[] = [
  {
    id: "live_send_counts",
    label: "Live send counts",
    category: "excluded",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    operatorValue: "Excluded because live sending is not active.",
    safetyConstraint: "Would imply execution that does not exist.",
  },
  {
    id: "automated_outreach_counts",
    label: "Automated outreach counts",
    category: "excluded",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    operatorValue: "Excluded because outreach automation remains blocked.",
    safetyConstraint: "Would incentivize automation before governance is operational.",
  },
  {
    id: "provider_delivery_metrics",
    label: "Provider delivery metrics",
    category: "excluded",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    operatorValue: "Excluded because providers are disabled.",
    safetyConstraint: "Would require provider execution data.",
  },
  {
    id: "twilio_success_failure_metrics",
    label: "Twilio success/failure metrics",
    category: "excluded",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    operatorValue: "Excluded because Twilio is not activated for outbound sending.",
    safetyConstraint: "Must not read or rely on provider execution.",
  },
  {
    id: "autonomous_follow_up_metrics",
    label: "Autonomous follow-up metrics",
    category: "excluded",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    operatorValue: "Excluded because follow-up must remain manual.",
    safetyConstraint: "Must not create autonomous execution pressure.",
  },
  {
    id: "automation_agent_cycle_metrics",
    label: "Automation-agent cycle metrics",
    category: "excluded",
    dataSourceSafety: "unsafe_until_runtime_activation_exists",
    operatorValue: "Excluded because automation-agent runtime remains blocked.",
    safetyConstraint: "Must not reconnect live-capable automation seams.",
  },
  {
    id: "persistence_backed_audit_logs",
    label: "Persistence-backed audit logs",
    category: "excluded",
    dataSourceSafety: "requires_audit_persistence_first",
    operatorValue: "Excluded until audit persistence is explicitly implemented.",
    safetyConstraint: "Must not write audit records in planning-only observability.",
  },
];

const accessibilityRequirements: R53AccessibilityRequirement[] = [
  {
    requirement: "Use readable metric labels with plain-language definitions.",
    reason: "Operators need to understand what each metric does and does not mean.",
  },
  {
    requirement: "Use text labels and counts, not color alone.",
    reason: "Safety, blockers, and revenue status must remain accessible.",
  },
  {
    requirement: "Use keyboard-friendly cards or tables.",
    reason: "Manual workflow review should not depend on mouse-only navigation.",
  },
  {
    requirement: "Keep the first dashboard slice low-density.",
    reason: "Observability should reduce cognitive load instead of creating a noisy cockpit.",
  },
  {
    requirement: "Avoid auto-refresh and motion-dependent status.",
    reason: "Manual metrics must not feel like polling or runtime automation.",
  },
];

const implementationOrder = [
  "Create planning contract for manual revenue observability.",
  "Create a pure read-only derived metric helper from existing lead/readiness state.",
  "Add dashboard visibility as the first surface.",
  "Run smoke and safety regression audit.",
  "Run accessibility audit for labels, keyboard order, and non-color-only status.",
  "Only later consider audit persistence after R50 controls are implemented.",
];

const allMetricClassifications = [
  ...manualRevenueMetrics,
  ...operatorWorkflowMetrics,
  ...governanceSafetyMetrics,
  ...excludedMetrics,
];

export function assertR53RevenueOperationsObservabilityInvariants(
  result: Pick<
    R53RevenueOperationsObservabilityPlanningResult,
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
): R53RevenueOperationsObservabilityInvariantCheck {
  const warningCodes: R53RevenueOperationsObservabilityInvariantCheck["warningCodes"] = [];

  if (result.activationExecuted !== false) warningCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) warningCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) warningCodes.push("can_send_now_must_be_false");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.liveTestReady !== false) warningCodes.push("live_test_ready_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR53RevenueOperationsObservability(
  result: R53RevenueOperationsObservabilityPlanningResult,
) {
  const invariantCheck = assertR53RevenueOperationsObservabilityInvariants(result);

  return boundSummary(
    `R53A revenue operations observability status is ${result.planStatus}. ` +
      `${result.manualRevenueMetrics.length} manual revenue metrics, ${result.operatorWorkflowMetrics.length} operator workflow metrics, ` +
      `${result.governanceSafetyMetrics.length} governance metrics, and ${result.excludedMetrics.length} excluded metrics are defined. ` +
      `First visibility surface is ${result.firstVisibilitySurface}. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is planning-only, advisory-only, simulation-only, non-persistent, and cannot authorize automation, providers, live sending, polling, persistence writes, or execution.",
  );
}

export function createR53RevenueOperationsObservabilityPlanningContract(
  input: R53RevenueOperationsObservabilityPlanningInput = {},
): R53RevenueOperationsObservabilityPlanningResult {
  const warningCodes: string[] = [];
  const operatorNotes = collectNotes(input.extraPlanningNotes);

  addWarning(warningCodes, "r53a_observability_planning_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.manualRevenueMetricsReviewed !== true) addWarning(warningCodes, "manual_metrics_review_required");
  if (input.operatorWorkflowMetricsReviewed !== true) addWarning(warningCodes, "operator_metrics_review_required");
  if (input.governanceSafetyMetricsReviewed !== true) addWarning(warningCodes, "governance_metrics_review_required");
  if (input.excludedMetricsReviewed !== true) addWarning(warningCodes, "excluded_metrics_review_required");
  if (input.dataSourceSafetyReviewed !== true) addWarning(warningCodes, "data_source_review_required");
  if (input.visibilitySurfaceReviewed !== true) addWarning(warningCodes, "visibility_surface_review_required");
  if (input.accessibilityRequirementsReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.workflowMutationRequested === true) addWarning(warningCodes, "workflow_mutation_rejected");
  if (input.persistenceWriteRequested === true) addWarning(warningCodes, "persistence_write_rejected");
  if (input.advisoryConvertedToPermission === true) addWarning(warningCodes, "advisory_to_permission_rejected");
  if (input.activationExecuted === true) addWarning(warningCodes, "activation_executed_must_be_false");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.liveExecutionAllowed === true) addWarning(warningCodes, "live_execution_allowed_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.canSendNow === true) addWarning(warningCodes, "can_send_now_must_be_false");
  if (input.simulationOnly !== true) addWarning(warningCodes, "simulation_only_required");
  if (input.liveTestReady === true) addWarning(warningCodes, "live_test_ready_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const planStatus: R53ObservabilityPlanStatus = hasForbiddenObservabilityRequest(input)
    ? "observability_planning_blocked"
    : operatorReviewRequired ||
        input.manualRevenueMetricsReviewed !== true ||
        input.operatorWorkflowMetricsReviewed !== true ||
        input.governanceSafetyMetricsReviewed !== true ||
        input.excludedMetricsReviewed !== true ||
        input.dataSourceSafetyReviewed !== true ||
        input.visibilitySurfaceReviewed !== true ||
        input.accessibilityRequirementsReviewed !== true
      ? "operator_review_required"
      : "observability_plan_ready";

  const result: R53RevenueOperationsObservabilityPlanningResult = {
    planStatus,
    firstVisibilitySurface: "dashboard_overview",
    firstVisibilityReason:
      "The dashboard is the safest first surface because it already hosts day-start safety state, high-level counts, and manual SOP visibility without needing lead mutation behavior.",
    manualRevenueMetrics,
    operatorWorkflowMetrics,
    governanceSafetyMetrics,
    excludedMetrics,
    dataSourceSafetyClassification: allMetricClassifications,
    accessibilityRequirements,
    implementationOrder,
    operatorReviewRequired,
    warningCodes,
    operatorNotes,
    summary: "R53A revenue operations observability planning contract only.",
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    persistenceAllowedNow: false,
  };

  return {
    ...result,
    summary: summarizeR53RevenueOperationsObservability(result),
  };
}
