export type R51FormsDashboardGovernanceStatus =
  | "forms_dashboard_scope_blocked"
  | "forms_dashboard_review_required"
  | "forms_dashboard_governance_planned";

export type R51FormsDashboardReadinessStatus = "missing" | "review_required" | "planned";

export type R51FormsDashboardWarningCode =
  | "r51d_forms_dashboard_governance_contract_only"
  | "input_missing"
  | "form_label_expectations_required"
  | "required_field_indicator_required"
  | "helper_text_accessibility_required"
  | "validation_message_accessibility_required"
  | "field_error_message_required"
  | "error_summary_required"
  | "table_structure_required"
  | "table_header_caption_required"
  | "sortable_filterable_table_accessibility_required"
  | "dashboard_kpi_accessibility_required"
  | "dashboard_card_accessibility_required"
  | "status_badge_accessibility_required"
  | "non_color_status_communication_required"
  | "dashboard_testing_review_required"
  | "inaccessible_form_rejected"
  | "inaccessible_validation_error_rejected"
  | "inaccessible_table_rejected"
  | "inaccessible_dashboard_kpi_rejected"
  | "color_only_badge_status_rejected"
  | "inaccessible_sort_filter_rejected"
  | "inaccessible_error_summary_rejected"
  | "runtime_accessibility_mutation_rejected"
  | "ui_rewrite_not_allowed"
  | "unbounded_accessibility_scope_rejected"
  | "advisory_only_required"
  | "accessibility_governance_only_required"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "persistence_not_allowed_now";

export type R51FormsErrorsTablesDashboardAccessibilityGovernanceInput = {
  formLabelExpectationsPlanned?: boolean;
  requiredFieldIndicatorExpectationsPlanned?: boolean;
  helperTextAccessibilityPlanned?: boolean;
  validationMessageAccessibilityPlanned?: boolean;
  fieldLevelErrorMessagePlanned?: boolean;
  errorSummaryExpectationsPlanned?: boolean;
  accessibleTableStructurePlanned?: boolean;
  tableHeaderCaptionExpectationsPlanned?: boolean;
  sortableFilterableTableAccessibilityPlanned?: boolean;
  dashboardKPIAccessibilityPlanned?: boolean;
  dashboardCardAccessibilityPlanned?: boolean;
  statusBadgeAccessibilityPlanned?: boolean;
  nonColorOnlyStatusCommunicationPlanned?: boolean;
  accessibilityDashboardTestingReviewPlanned?: boolean;
  inaccessibleFormApproved?: boolean;
  inaccessibleValidationErrorApproved?: boolean;
  inaccessibleTableApproved?: boolean;
  inaccessibleDashboardKPIApproved?: boolean;
  colorOnlyBadgeStatusApproved?: boolean;
  inaccessibleSortableFilterableWorkflowApproved?: boolean;
  inaccessibleErrorSummaryApproved?: boolean;
  runtimeAccessibilityMutationAttempted?: boolean;
  uiRewriteRequested?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  accessibilityGovernanceOnly?: boolean;
  accessibilityReviewNotes?: string[];
  operatorRecommendations?: string[];
  accessibilityRemediationRecommendations?: string[];
  accessibilityReviewActions?: string[];
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
};

export type R51FormsErrorsTablesDashboardAccessibilityGovernanceResult = {
  formsDashboardGovernanceStatus: R51FormsDashboardGovernanceStatus;
  formLabelStatus: R51FormsDashboardReadinessStatus;
  requiredFieldIndicatorStatus: R51FormsDashboardReadinessStatus;
  helperTextStatus: R51FormsDashboardReadinessStatus;
  validationMessageStatus: R51FormsDashboardReadinessStatus;
  fieldErrorMessageStatus: R51FormsDashboardReadinessStatus;
  errorSummaryStatus: R51FormsDashboardReadinessStatus;
  tableStructureStatus: R51FormsDashboardReadinessStatus;
  tableHeaderCaptionStatus: R51FormsDashboardReadinessStatus;
  sortableFilterableTableStatus: R51FormsDashboardReadinessStatus;
  dashboardKPIStatus: R51FormsDashboardReadinessStatus;
  dashboardCardStatus: R51FormsDashboardReadinessStatus;
  statusBadgeStatus: R51FormsDashboardReadinessStatus;
  nonColorStatusCommunicationStatus: R51FormsDashboardReadinessStatus;
  dashboardTestingReviewStatus: R51FormsDashboardReadinessStatus;
  advisoryOnly: true;
  simulationOnly: true;
  accessibilityGovernanceOnly: true;
  runtimeMutationAllowed: false;
  uiRewriteAllowed: false;
  persistenceAllowedNow: false;
  warningCodes: string[];
  accessibilityReviewNotes: string[];
  operatorRecommendations: string[];
  accessibilityRemediationRecommendations: string[];
  accessibilityReviewActions: string[];
  blockingFindings: string[];
  prohibitedFindings: string[];
  summary: string;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  liveTestReady: false;
};

export type R51FormsDashboardInvariantCheck = {
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
    | "accessibility_governance_only_required"
  >;
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 780;

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

function addWarning(warningCodes: string[], warningCode: R51FormsDashboardWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function plannedStatus(value: boolean | undefined): R51FormsDashboardReadinessStatus {
  return value === true ? "planned" : "missing";
}

function addMissingPlanningFinding(
  planned: boolean | undefined,
  warningCode: R51FormsDashboardWarningCode,
  finding: string,
  warningCodes: string[],
  blockingFindings: string[],
  reviewActions: string[],
) {
  if (planned === true) return;

  addWarning(warningCodes, warningCode);
  addUnique(blockingFindings, finding);
  addUnique(reviewActions, finding);
}

function hasExecutionIndicators(input: R51FormsErrorsTablesDashboardAccessibilityGovernanceInput) {
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

export function assertR51FormsErrorsTablesDashboardAccessibilityInvariants(
  result: Pick<
    R51FormsErrorsTablesDashboardAccessibilityGovernanceResult,
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
    | "accessibilityGovernanceOnly"
  >,
): R51FormsDashboardInvariantCheck {
  const warningCodes: R51FormsDashboardInvariantCheck["warningCodes"] = [];

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
  if (result.accessibilityGovernanceOnly !== true) warningCodes.push("accessibility_governance_only_required");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR51FormsErrorsTablesDashboardAccessibilityGovernance(
  result: R51FormsErrorsTablesDashboardAccessibilityGovernanceResult,
) {
  const invariantCheck = assertR51FormsErrorsTablesDashboardAccessibilityInvariants(result);

  return boundSummary(
    `R51D forms errors tables dashboard accessibility governance is ${result.formsDashboardGovernanceStatus}. ` +
      `Forms: ${result.formLabelStatus}; validation: ${result.validationMessageStatus}; error summary: ${result.errorSummaryStatus}; ` +
      `tables: ${result.tableStructureStatus}; dashboard KPIs: ${result.dashboardKPIStatus}; status badges: ${result.statusBadgeStatus}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Contract is advisory-only, simulation-only, and accessibility-governance-only; it performs no UI rewrite, validation handler change, runtime mutation, provider activation, persistence, or live execution.",
  );
}

export function createR51FormsErrorsTablesDashboardAccessibilityGovernance(
  input: R51FormsErrorsTablesDashboardAccessibilityGovernanceInput = {},
): R51FormsErrorsTablesDashboardAccessibilityGovernanceResult {
  const warningCodes: string[] = [];
  const accessibilityReviewNotes = collectText(input.accessibilityReviewNotes);
  const operatorRecommendations = collectText(input.operatorRecommendations);
  const accessibilityRemediationRecommendations = collectText(input.accessibilityRemediationRecommendations);
  const accessibilityReviewActions = collectText(input.accessibilityReviewActions);
  const blockingFindings: string[] = [];
  const prohibitedFindings: string[] = [];

  addWarning(warningCodes, "r51d_forms_dashboard_governance_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) {
    addWarning(warningCodes, "input_missing");
    addUnique(prohibitedFindings, "Forms, errors, tables, and dashboard accessibility governance input is missing.");
  }

  addMissingPlanningFinding(input.formLabelExpectationsPlanned, "form_label_expectations_required", "Plan accessible form label expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.requiredFieldIndicatorExpectationsPlanned, "required_field_indicator_required", "Plan required-field indicator expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.helperTextAccessibilityPlanned, "helper_text_accessibility_required", "Plan helper-text accessibility expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.validationMessageAccessibilityPlanned, "validation_message_accessibility_required", "Plan validation-message accessibility expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.fieldLevelErrorMessagePlanned, "field_error_message_required", "Plan field-level error-message expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.errorSummaryExpectationsPlanned, "error_summary_required", "Plan error-summary expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.accessibleTableStructurePlanned, "table_structure_required", "Plan accessible table structure expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.tableHeaderCaptionExpectationsPlanned, "table_header_caption_required", "Plan table header and caption expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.sortableFilterableTableAccessibilityPlanned, "sortable_filterable_table_accessibility_required", "Plan sortable and filterable table accessibility expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.dashboardKPIAccessibilityPlanned, "dashboard_kpi_accessibility_required", "Plan dashboard KPI accessibility expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.dashboardCardAccessibilityPlanned, "dashboard_card_accessibility_required", "Plan dashboard card accessibility expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.statusBadgeAccessibilityPlanned, "status_badge_accessibility_required", "Plan status badge accessibility expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.nonColorOnlyStatusCommunicationPlanned, "non_color_status_communication_required", "Plan non-color-only status communication expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.accessibilityDashboardTestingReviewPlanned, "dashboard_testing_review_required", "Plan accessibility dashboard and testing review expectations.", warningCodes, blockingFindings, accessibilityReviewActions);

  if (input.inaccessibleFormApproved === true) {
    addWarning(warningCodes, "inaccessible_form_rejected");
    addUnique(prohibitedFindings, "Inaccessible form approval is rejected.");
  }
  if (input.inaccessibleValidationErrorApproved === true) {
    addWarning(warningCodes, "inaccessible_validation_error_rejected");
    addUnique(prohibitedFindings, "Inaccessible validation or error approval is rejected.");
  }
  if (input.inaccessibleTableApproved === true) {
    addWarning(warningCodes, "inaccessible_table_rejected");
    addUnique(prohibitedFindings, "Inaccessible table approval is rejected.");
  }
  if (input.inaccessibleDashboardKPIApproved === true) {
    addWarning(warningCodes, "inaccessible_dashboard_kpi_rejected");
    addUnique(prohibitedFindings, "Inaccessible dashboard or KPI approval is rejected.");
  }
  if (input.colorOnlyBadgeStatusApproved === true) {
    addWarning(warningCodes, "color_only_badge_status_rejected");
    addUnique(prohibitedFindings, "Color-only badge or status approval is rejected.");
  }
  if (input.inaccessibleSortableFilterableWorkflowApproved === true) {
    addWarning(warningCodes, "inaccessible_sort_filter_rejected");
    addUnique(prohibitedFindings, "Inaccessible sortable or filterable workflow approval is rejected.");
  }
  if (input.inaccessibleErrorSummaryApproved === true) {
    addWarning(warningCodes, "inaccessible_error_summary_rejected");
    addUnique(prohibitedFindings, "Inaccessible error-summary approval is rejected.");
  }
  if (input.runtimeAccessibilityMutationAttempted === true) {
    addWarning(warningCodes, "runtime_accessibility_mutation_rejected");
    addUnique(prohibitedFindings, "Runtime accessibility mutation attempts are rejected in R51D.");
  }
  if (input.uiRewriteRequested === true) {
    addWarning(warningCodes, "ui_rewrite_not_allowed");
    addUnique(prohibitedFindings, "UI rewrite is not allowed in R51D planning.");
  }
  if (input.advisoryOnly !== true) {
    addWarning(warningCodes, "advisory_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly advisory-only.");
  }
  if (input.simulationOnly !== true) {
    addWarning(warningCodes, "simulation_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly simulation-only.");
  }
  if (input.accessibilityGovernanceOnly !== true) {
    addWarning(warningCodes, "accessibility_governance_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly accessibility-governance-only.");
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

  if (warningCodes.length >= maxListItems) {
    addWarning(warningCodes, "unbounded_accessibility_scope_rejected");
  }

  const formsDashboardGovernanceStatus: R51FormsDashboardGovernanceStatus =
    prohibitedFindings.length > 0
      ? "forms_dashboard_scope_blocked"
      : blockingFindings.length > 0
        ? "forms_dashboard_review_required"
        : "forms_dashboard_governance_planned";

  const result: R51FormsErrorsTablesDashboardAccessibilityGovernanceResult = {
    formsDashboardGovernanceStatus,
    formLabelStatus: plannedStatus(input.formLabelExpectationsPlanned),
    requiredFieldIndicatorStatus: plannedStatus(input.requiredFieldIndicatorExpectationsPlanned),
    helperTextStatus: plannedStatus(input.helperTextAccessibilityPlanned),
    validationMessageStatus: plannedStatus(input.validationMessageAccessibilityPlanned),
    fieldErrorMessageStatus: plannedStatus(input.fieldLevelErrorMessagePlanned),
    errorSummaryStatus: plannedStatus(input.errorSummaryExpectationsPlanned),
    tableStructureStatus: plannedStatus(input.accessibleTableStructurePlanned),
    tableHeaderCaptionStatus: plannedStatus(input.tableHeaderCaptionExpectationsPlanned),
    sortableFilterableTableStatus: plannedStatus(input.sortableFilterableTableAccessibilityPlanned),
    dashboardKPIStatus: plannedStatus(input.dashboardKPIAccessibilityPlanned),
    dashboardCardStatus: plannedStatus(input.dashboardCardAccessibilityPlanned),
    statusBadgeStatus: plannedStatus(input.statusBadgeAccessibilityPlanned),
    nonColorStatusCommunicationStatus: plannedStatus(input.nonColorOnlyStatusCommunicationPlanned),
    dashboardTestingReviewStatus: plannedStatus(input.accessibilityDashboardTestingReviewPlanned),
    advisoryOnly: true,
    simulationOnly: true,
    accessibilityGovernanceOnly: true,
    runtimeMutationAllowed: false,
    uiRewriteAllowed: false,
    persistenceAllowedNow: false,
    warningCodes,
    accessibilityReviewNotes,
    operatorRecommendations,
    accessibilityRemediationRecommendations,
    accessibilityReviewActions,
    blockingFindings,
    prohibitedFindings,
    summary: "R51D forms errors tables dashboard accessibility governance contract only.",
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
    summary: summarizeR51FormsErrorsTablesDashboardAccessibilityGovernance(result),
  };
}
