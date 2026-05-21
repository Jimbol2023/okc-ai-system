export type R51SemanticAriaGovernanceStatus =
  | "semantic_aria_scope_blocked"
  | "semantic_aria_review_required"
  | "semantic_aria_governance_planned";

export type R51SemanticAriaReadinessStatus = "missing" | "review_required" | "planned";

export type R51SemanticAriaWarningCode =
  | "r51c_semantic_aria_governance_contract_only"
  | "input_missing"
  | "semantic_html_expectations_required"
  | "screen_reader_readiness_required"
  | "heading_hierarchy_required"
  | "landmark_region_required"
  | "accessible_name_required"
  | "accessible_description_required"
  | "form_label_required"
  | "error_message_required"
  | "aria_usage_governance_required"
  | "aria_misuse_prevention_required"
  | "status_announcement_required"
  | "table_semantics_required"
  | "badge_status_text_alternative_required"
  | "semantic_testing_required"
  | "inaccessible_semantic_structure_rejected"
  | "missing_heading_hierarchy_rejected"
  | "inaccessible_form_labeling_rejected"
  | "inaccessible_table_semantics_rejected"
  | "aria_misuse_rejected"
  | "status_badge_color_only_rejected"
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

export type R51ScreenReaderSemanticHtmlAriaGovernanceInput = {
  semanticHTMLExpectationsPlanned?: boolean;
  screenReaderReadinessPlanned?: boolean;
  headingHierarchyGovernancePlanned?: boolean;
  landmarkRegionGovernancePlanned?: boolean;
  accessibleNameGovernancePlanned?: boolean;
  accessibleDescriptionGovernancePlanned?: boolean;
  formLabelGovernancePlanned?: boolean;
  accessibleErrorMessagePlanned?: boolean;
  ariaUsageGovernancePlanned?: boolean;
  ariaMisusePreventionPlanned?: boolean;
  statusMessageAnnouncementPlanned?: boolean;
  tableSemanticExpectationsPlanned?: boolean;
  badgeStatusTextAlternativePlanned?: boolean;
  semanticAccessibilityTestingPlanned?: boolean;
  inaccessibleSemanticStructureApproved?: boolean;
  missingHeadingHierarchyApproved?: boolean;
  inaccessibleFormLabelingApproved?: boolean;
  inaccessibleTableSemanticsApproved?: boolean;
  ariaMisuseApproved?: boolean;
  statusBadgeColorOnlyApproved?: boolean;
  runtimeAccessibilityMutationAttempted?: boolean;
  uiRewriteRequested?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  accessibilityGovernanceOnly?: boolean;
  accessibilityReviewNotes?: string[];
  operatorRecommendations?: string[];
  semanticReviewActions?: string[];
  ariaReviewActions?: string[];
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
};

export type R51ScreenReaderSemanticHtmlAriaGovernanceResult = {
  semanticAriaGovernanceStatus: R51SemanticAriaGovernanceStatus;
  semanticHTMLStatus: R51SemanticAriaReadinessStatus;
  screenReaderReadinessStatus: R51SemanticAriaReadinessStatus;
  headingHierarchyStatus: R51SemanticAriaReadinessStatus;
  landmarkRegionStatus: R51SemanticAriaReadinessStatus;
  accessibleNameStatus: R51SemanticAriaReadinessStatus;
  accessibleDescriptionStatus: R51SemanticAriaReadinessStatus;
  formLabelStatus: R51SemanticAriaReadinessStatus;
  errorMessageStatus: R51SemanticAriaReadinessStatus;
  ariaUsageStatus: R51SemanticAriaReadinessStatus;
  ariaMisusePreventionStatus: R51SemanticAriaReadinessStatus;
  statusAnnouncementStatus: R51SemanticAriaReadinessStatus;
  tableSemanticStatus: R51SemanticAriaReadinessStatus;
  badgeStatusTextAlternativeStatus: R51SemanticAriaReadinessStatus;
  semanticTestingStatus: R51SemanticAriaReadinessStatus;
  advisoryOnly: true;
  simulationOnly: true;
  accessibilityGovernanceOnly: true;
  runtimeMutationAllowed: false;
  uiRewriteAllowed: false;
  persistenceAllowedNow: false;
  warningCodes: string[];
  accessibilityReviewNotes: string[];
  operatorRecommendations: string[];
  semanticReviewActions: string[];
  ariaReviewActions: string[];
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

export type R51SemanticAriaInvariantCheck = {
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

function addWarning(warningCodes: string[], warningCode: R51SemanticAriaWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function plannedStatus(value: boolean | undefined): R51SemanticAriaReadinessStatus {
  return value === true ? "planned" : "missing";
}

function addMissingPlanningFinding(
  planned: boolean | undefined,
  warningCode: R51SemanticAriaWarningCode,
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

function hasExecutionIndicators(input: R51ScreenReaderSemanticHtmlAriaGovernanceInput) {
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

export function assertR51ScreenReaderSemanticHtmlAriaInvariants(
  result: Pick<
    R51ScreenReaderSemanticHtmlAriaGovernanceResult,
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
): R51SemanticAriaInvariantCheck {
  const warningCodes: R51SemanticAriaInvariantCheck["warningCodes"] = [];

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

export function summarizeR51ScreenReaderSemanticHtmlAriaGovernance(
  result: R51ScreenReaderSemanticHtmlAriaGovernanceResult,
) {
  const invariantCheck = assertR51ScreenReaderSemanticHtmlAriaInvariants(result);

  return boundSummary(
    `R51C screen-reader semantic HTML ARIA governance is ${result.semanticAriaGovernanceStatus}. ` +
      `Semantic HTML: ${result.semanticHTMLStatus}; screen reader: ${result.screenReaderReadinessStatus}; heading hierarchy: ${result.headingHierarchyStatus}; ` +
      `ARIA usage: ${result.ariaUsageStatus}; ARIA misuse prevention: ${result.ariaMisusePreventionStatus}; semantic testing: ${result.semanticTestingStatus}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Contract is advisory-only, simulation-only, and accessibility-governance-only; it performs no UI rewrite, ARIA injection, runtime mutation, provider activation, persistence, or live execution.",
  );
}

export function createR51ScreenReaderSemanticHtmlAriaGovernance(
  input: R51ScreenReaderSemanticHtmlAriaGovernanceInput = {},
): R51ScreenReaderSemanticHtmlAriaGovernanceResult {
  const warningCodes: string[] = [];
  const accessibilityReviewNotes = collectText(input.accessibilityReviewNotes);
  const operatorRecommendations = collectText(input.operatorRecommendations);
  const semanticReviewActions = collectText(input.semanticReviewActions);
  const ariaReviewActions = collectText(input.ariaReviewActions);
  const blockingFindings: string[] = [];
  const prohibitedFindings: string[] = [];

  addWarning(warningCodes, "r51c_semantic_aria_governance_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) {
    addWarning(warningCodes, "input_missing");
    addUnique(prohibitedFindings, "Screen-reader, semantic HTML, and ARIA governance input is missing.");
  }

  addMissingPlanningFinding(input.semanticHTMLExpectationsPlanned, "semantic_html_expectations_required", "Plan semantic HTML expectations.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.screenReaderReadinessPlanned, "screen_reader_readiness_required", "Plan screen-reader readiness expectations.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.headingHierarchyGovernancePlanned, "heading_hierarchy_required", "Plan heading hierarchy governance.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.landmarkRegionGovernancePlanned, "landmark_region_required", "Plan landmark region governance.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.accessibleNameGovernancePlanned, "accessible_name_required", "Plan accessible-name governance.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.accessibleDescriptionGovernancePlanned, "accessible_description_required", "Plan accessible-description governance.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.formLabelGovernancePlanned, "form_label_required", "Plan form-label governance.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.accessibleErrorMessagePlanned, "error_message_required", "Plan accessible error-message expectations.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.ariaUsageGovernancePlanned, "aria_usage_governance_required", "Plan ARIA usage governance.", warningCodes, blockingFindings, ariaReviewActions);
  addMissingPlanningFinding(input.ariaMisusePreventionPlanned, "aria_misuse_prevention_required", "Plan ARIA misuse prevention.", warningCodes, blockingFindings, ariaReviewActions);
  addMissingPlanningFinding(input.statusMessageAnnouncementPlanned, "status_announcement_required", "Plan status and message announcement expectations.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.tableSemanticExpectationsPlanned, "table_semantics_required", "Plan table semantic expectations.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.badgeStatusTextAlternativePlanned, "badge_status_text_alternative_required", "Plan badge/status text alternative expectations.", warningCodes, blockingFindings, semanticReviewActions);
  addMissingPlanningFinding(input.semanticAccessibilityTestingPlanned, "semantic_testing_required", "Plan semantic and ARIA accessibility testing expectations.", warningCodes, blockingFindings, semanticReviewActions);

  if (input.inaccessibleSemanticStructureApproved === true) {
    addWarning(warningCodes, "inaccessible_semantic_structure_rejected");
    addUnique(prohibitedFindings, "Inaccessible semantic structure approval is rejected.");
  }
  if (input.missingHeadingHierarchyApproved === true) {
    addWarning(warningCodes, "missing_heading_hierarchy_rejected");
    addUnique(prohibitedFindings, "Missing heading hierarchy approval is rejected.");
  }
  if (input.inaccessibleFormLabelingApproved === true) {
    addWarning(warningCodes, "inaccessible_form_labeling_rejected");
    addUnique(prohibitedFindings, "Inaccessible form labeling approval is rejected.");
  }
  if (input.inaccessibleTableSemanticsApproved === true) {
    addWarning(warningCodes, "inaccessible_table_semantics_rejected");
    addUnique(prohibitedFindings, "Inaccessible table semantic approval is rejected.");
  }
  if (input.ariaMisuseApproved === true) {
    addWarning(warningCodes, "aria_misuse_rejected");
    addUnique(prohibitedFindings, "ARIA misuse approval is rejected.");
  }
  if (input.statusBadgeColorOnlyApproved === true) {
    addWarning(warningCodes, "status_badge_color_only_rejected");
    addUnique(prohibitedFindings, "Status or badge color-only signaling approval is rejected.");
  }
  if (input.runtimeAccessibilityMutationAttempted === true) {
    addWarning(warningCodes, "runtime_accessibility_mutation_rejected");
    addUnique(prohibitedFindings, "Runtime accessibility mutation attempts are rejected in R51C.");
  }
  if (input.uiRewriteRequested === true) {
    addWarning(warningCodes, "ui_rewrite_not_allowed");
    addUnique(prohibitedFindings, "UI rewrite is not allowed in R51C planning.");
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

  const semanticAriaGovernanceStatus: R51SemanticAriaGovernanceStatus =
    prohibitedFindings.length > 0
      ? "semantic_aria_scope_blocked"
      : blockingFindings.length > 0
        ? "semantic_aria_review_required"
        : "semantic_aria_governance_planned";

  const result: R51ScreenReaderSemanticHtmlAriaGovernanceResult = {
    semanticAriaGovernanceStatus,
    semanticHTMLStatus: plannedStatus(input.semanticHTMLExpectationsPlanned),
    screenReaderReadinessStatus: plannedStatus(input.screenReaderReadinessPlanned),
    headingHierarchyStatus: plannedStatus(input.headingHierarchyGovernancePlanned),
    landmarkRegionStatus: plannedStatus(input.landmarkRegionGovernancePlanned),
    accessibleNameStatus: plannedStatus(input.accessibleNameGovernancePlanned),
    accessibleDescriptionStatus: plannedStatus(input.accessibleDescriptionGovernancePlanned),
    formLabelStatus: plannedStatus(input.formLabelGovernancePlanned),
    errorMessageStatus: plannedStatus(input.accessibleErrorMessagePlanned),
    ariaUsageStatus: plannedStatus(input.ariaUsageGovernancePlanned),
    ariaMisusePreventionStatus: plannedStatus(input.ariaMisusePreventionPlanned),
    statusAnnouncementStatus: plannedStatus(input.statusMessageAnnouncementPlanned),
    tableSemanticStatus: plannedStatus(input.tableSemanticExpectationsPlanned),
    badgeStatusTextAlternativeStatus: plannedStatus(input.badgeStatusTextAlternativePlanned),
    semanticTestingStatus: plannedStatus(input.semanticAccessibilityTestingPlanned),
    advisoryOnly: true,
    simulationOnly: true,
    accessibilityGovernanceOnly: true,
    runtimeMutationAllowed: false,
    uiRewriteAllowed: false,
    persistenceAllowedNow: false,
    warningCodes,
    accessibilityReviewNotes,
    operatorRecommendations,
    semanticReviewActions,
    ariaReviewActions,
    blockingFindings,
    prohibitedFindings,
    summary: "R51C screen-reader semantic HTML ARIA governance contract only.",
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
    summary: summarizeR51ScreenReaderSemanticHtmlAriaGovernance(result),
  };
}
