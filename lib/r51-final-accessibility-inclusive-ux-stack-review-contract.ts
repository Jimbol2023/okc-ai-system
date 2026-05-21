export type R51FinalAccessibilityStackReviewStatus =
  | "accessibility_stack_blocked"
  | "accessibility_stack_incomplete"
  | "accessibility_review_required"
  | "r51_accessibility_planning_complete";

export type R51FinalAccessibilityConsistencyStatus = "inconsistent" | "needs_review" | "consistent";

export type R51FinalAccessibilityLayerStatus =
  | "missing"
  | "blocked"
  | "review_required"
  | "planned";

export type R51FinalAccessibilityWarningCode =
  | "r51f_final_accessibility_stack_review_contract_only"
  | "input_missing"
  | "baseline_scope_not_planned"
  | "keyboard_focus_not_planned"
  | "semantic_aria_not_planned"
  | "forms_dashboard_not_planned"
  | "visual_accessibility_not_planned"
  | "wcag_direction_not_confirmed"
  | "keyboard_consistency_not_confirmed"
  | "semantic_consistency_not_confirmed"
  | "screen_reader_consistency_not_confirmed"
  | "forms_dashboard_consistency_not_confirmed"
  | "contrast_motion_consistency_not_confirmed"
  | "non_color_indicator_consistency_not_confirmed"
  | "bounded_output_consistency_not_confirmed"
  | "invariant_consistency_not_confirmed"
  | "runtime_mutation_rejected"
  | "ui_component_mutation_rejected"
  | "theme_mutation_rejected"
  | "accessibility_governance_weakening_rejected"
  | "inaccessible_workflow_approval_rejected"
  | "color_only_communication_rejected"
  | "keyboard_expectation_weakening_rejected"
  | "semantic_aria_weakening_rejected"
  | "reduced_motion_weakening_rejected"
  | "unbounded_accessibility_scope_rejected"
  | "advisory_only_required"
  | "accessibility_governance_only_required"
  | "accessibility_implementation_not_allowed_now"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "persistence_not_allowed_now";

export type R51FinalAccessibilityInclusiveUxStackReviewInput = {
  baselineScopeStatus?: R51FinalAccessibilityLayerStatus;
  keyboardFocusStatus?: R51FinalAccessibilityLayerStatus;
  semanticAriaStatus?: R51FinalAccessibilityLayerStatus;
  formsDashboardStatus?: R51FinalAccessibilityLayerStatus;
  visualAccessibilityStatus?: R51FinalAccessibilityLayerStatus;
  wcagDirectionConsistent?: boolean;
  keyboardAccessibilityConsistent?: boolean;
  semanticAccessibilityConsistent?: boolean;
  screenReaderReadinessConsistent?: boolean;
  formsTablesDashboardConsistent?: boolean;
  contrastReducedMotionConsistent?: boolean;
  nonColorIndicatorConsistent?: boolean;
  boundedOutputsConfirmed?: boolean;
  invariantsPreserved?: boolean;
  runtimeMutationIntroduced?: boolean;
  uiComponentMutationIntroduced?: boolean;
  themeMutationIntroduced?: boolean;
  accessibilityGovernanceWeakened?: boolean;
  inaccessibleWorkflowApproved?: boolean;
  colorOnlyCommunicationApproved?: boolean;
  keyboardExpectationsWeakened?: boolean;
  semanticAriaGovernanceWeakened?: boolean;
  reducedMotionExpectationsWeakened?: boolean;
  unboundedAccessibilityScopesPresent?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  accessibilityGovernanceOnly?: boolean;
  accessibilityImplementationAllowedNow?: boolean;
  accessibilityReviewNotes?: string[];
  operatorRecommendations?: string[];
  accessibilityRemediationRecommendations?: string[];
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
};

export type R51FinalAccessibilityInclusiveUxStackReviewResult = {
  accessibilityStackReviewStatus: R51FinalAccessibilityStackReviewStatus;
  consistencyStatus: R51FinalAccessibilityConsistencyStatus;
  baselineScopeStatus: R51FinalAccessibilityLayerStatus;
  keyboardFocusStatus: R51FinalAccessibilityLayerStatus;
  semanticAriaStatus: R51FinalAccessibilityLayerStatus;
  formsDashboardStatus: R51FinalAccessibilityLayerStatus;
  visualAccessibilityStatus: R51FinalAccessibilityLayerStatus;
  advisoryOnly: true;
  simulationOnly: true;
  accessibilityGovernanceOnly: true;
  runtimeMutationAllowed: false;
  uiRewriteAllowed: false;
  componentMutationAllowed: false;
  themeMutationAllowed: false;
  accessibilityImplementationAllowedNow: false;
  persistenceAllowedNow: false;
  warningCodes: string[];
  accessibilityReviewNotes: string[];
  operatorRecommendations: string[];
  accessibilityRemediationRecommendations: string[];
  blockingFindings: string[];
  prohibitedFindings: string[];
  reviewSummary: string;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  liveTestReady: false;
};

export type R51FinalAccessibilityInvariantCheck = {
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
    | "accessibility_implementation_not_allowed_now"
  >;
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 820;

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

function addWarning(warningCodes: string[], warningCode: R51FinalAccessibilityWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function normalizeLayerStatus(value: R51FinalAccessibilityLayerStatus | undefined): R51FinalAccessibilityLayerStatus {
  return value ?? "missing";
}

function hasExecutionIndicators(input: R51FinalAccessibilityInclusiveUxStackReviewInput) {
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

export function assertR51FinalAccessibilityInclusiveUxStackInvariants(
  result: Pick<
    R51FinalAccessibilityInclusiveUxStackReviewResult,
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
    | "accessibilityImplementationAllowedNow"
  >,
): R51FinalAccessibilityInvariantCheck {
  const warningCodes: R51FinalAccessibilityInvariantCheck["warningCodes"] = [];

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
  if (result.accessibilityImplementationAllowedNow !== false) warningCodes.push("accessibility_implementation_not_allowed_now");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR51FinalAccessibilityInclusiveUxStackReview(result: R51FinalAccessibilityInclusiveUxStackReviewResult) {
  const invariantCheck = assertR51FinalAccessibilityInclusiveUxStackInvariants(result);

  return boundSummary(
    `R51F final accessibility inclusive UX stack review is ${result.accessibilityStackReviewStatus}. ` +
      `Consistency is ${result.consistencyStatus}. Baseline: ${result.baselineScopeStatus}; keyboard/focus: ${result.keyboardFocusStatus}; ` +
      `semantic/ARIA: ${result.semanticAriaStatus}; forms/dashboard: ${result.formsDashboardStatus}; visual accessibility: ${result.visualAccessibilityStatus}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Implementation allowed now: ${result.accessibilityImplementationAllowedNow}. Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Review is advisory-only, planning-only, accessibility-governance-only, non-runtime-mutating, and cannot authorize UI rewrites, component mutation, CSS/theme edits, runtime handlers, providers, persistence, or live execution.",
  );
}

export function createR51FinalAccessibilityInclusiveUxStackReview(
  input: R51FinalAccessibilityInclusiveUxStackReviewInput = {},
): R51FinalAccessibilityInclusiveUxStackReviewResult {
  const warningCodes: string[] = [];
  const accessibilityReviewNotes = collectText(input.accessibilityReviewNotes);
  const operatorRecommendations = collectText(input.operatorRecommendations);
  const accessibilityRemediationRecommendations = collectText(input.accessibilityRemediationRecommendations);
  const blockingFindings: string[] = [];
  const prohibitedFindings: string[] = [];
  const baselineScopeStatus = normalizeLayerStatus(input.baselineScopeStatus);
  const keyboardFocusStatus = normalizeLayerStatus(input.keyboardFocusStatus);
  const semanticAriaStatus = normalizeLayerStatus(input.semanticAriaStatus);
  const formsDashboardStatus = normalizeLayerStatus(input.formsDashboardStatus);
  const visualAccessibilityStatus = normalizeLayerStatus(input.visualAccessibilityStatus);

  addWarning(warningCodes, "r51f_final_accessibility_stack_review_contract_only");
  addWarning(warningCodes, "accessibility_implementation_not_allowed_now");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) {
    addWarning(warningCodes, "input_missing");
    addUnique(prohibitedFindings, "R51 final accessibility stack review input is missing.");
  }

  if (baselineScopeStatus !== "planned") {
    addWarning(warningCodes, "baseline_scope_not_planned");
    addUnique(blockingFindings, "R51A baseline accessibility scope is not planned.");
  }
  if (keyboardFocusStatus !== "planned") {
    addWarning(warningCodes, "keyboard_focus_not_planned");
    addUnique(blockingFindings, "R51B keyboard/focus governance is not planned.");
  }
  if (semanticAriaStatus !== "planned") {
    addWarning(warningCodes, "semantic_aria_not_planned");
    addUnique(blockingFindings, "R51C semantic HTML/ARIA governance is not planned.");
  }
  if (formsDashboardStatus !== "planned") {
    addWarning(warningCodes, "forms_dashboard_not_planned");
    addUnique(blockingFindings, "R51D forms/errors/tables/dashboard governance is not planned.");
  }
  if (visualAccessibilityStatus !== "planned") {
    addWarning(warningCodes, "visual_accessibility_not_planned");
    addUnique(blockingFindings, "R51E visual accessibility governance is not planned.");
  }

  if (input.wcagDirectionConsistent !== true) {
    addWarning(warningCodes, "wcag_direction_not_confirmed");
    addUnique(blockingFindings, "WCAG direction consistency is not confirmed.");
  }
  if (input.keyboardAccessibilityConsistent !== true) {
    addWarning(warningCodes, "keyboard_consistency_not_confirmed");
    addUnique(blockingFindings, "Keyboard accessibility consistency is not confirmed.");
  }
  if (input.semanticAccessibilityConsistent !== true) {
    addWarning(warningCodes, "semantic_consistency_not_confirmed");
    addUnique(blockingFindings, "Semantic accessibility consistency is not confirmed.");
  }
  if (input.screenReaderReadinessConsistent !== true) {
    addWarning(warningCodes, "screen_reader_consistency_not_confirmed");
    addUnique(blockingFindings, "Screen-reader readiness consistency is not confirmed.");
  }
  if (input.formsTablesDashboardConsistent !== true) {
    addWarning(warningCodes, "forms_dashboard_consistency_not_confirmed");
    addUnique(blockingFindings, "Forms, tables, and dashboard accessibility consistency is not confirmed.");
  }
  if (input.contrastReducedMotionConsistent !== true) {
    addWarning(warningCodes, "contrast_motion_consistency_not_confirmed");
    addUnique(blockingFindings, "Contrast and reduced-motion consistency is not confirmed.");
  }
  if (input.nonColorIndicatorConsistent !== true) {
    addWarning(warningCodes, "non_color_indicator_consistency_not_confirmed");
    addUnique(blockingFindings, "Non-color-only indicator consistency is not confirmed.");
  }
  if (input.boundedOutputsConfirmed !== true) {
    addWarning(warningCodes, "bounded_output_consistency_not_confirmed");
    addUnique(blockingFindings, "Bounded output consistency is not confirmed.");
  }
  if (input.invariantsPreserved !== true) {
    addWarning(warningCodes, "invariant_consistency_not_confirmed");
    addUnique(blockingFindings, "Invariant preservation consistency is not confirmed.");
  }

  if (input.runtimeMutationIntroduced === true) {
    addWarning(warningCodes, "runtime_mutation_rejected");
    addUnique(prohibitedFindings, "Runtime accessibility mutation is rejected.");
  }
  if (input.uiComponentMutationIntroduced === true) {
    addWarning(warningCodes, "ui_component_mutation_rejected");
    addUnique(prohibitedFindings, "UI or component mutation is rejected.");
  }
  if (input.themeMutationIntroduced === true) {
    addWarning(warningCodes, "theme_mutation_rejected");
    addUnique(prohibitedFindings, "Theme or CSS mutation is rejected.");
  }
  if (input.accessibilityGovernanceWeakened === true) {
    addWarning(warningCodes, "accessibility_governance_weakening_rejected");
    addUnique(prohibitedFindings, "Accessibility governance weakening is rejected.");
  }
  if (input.inaccessibleWorkflowApproved === true) {
    addWarning(warningCodes, "inaccessible_workflow_approval_rejected");
    addUnique(prohibitedFindings, "Inaccessible workflow approval is rejected.");
  }
  if (input.colorOnlyCommunicationApproved === true) {
    addWarning(warningCodes, "color_only_communication_rejected");
    addUnique(prohibitedFindings, "Color-only communication approval is rejected.");
  }
  if (input.keyboardExpectationsWeakened === true) {
    addWarning(warningCodes, "keyboard_expectation_weakening_rejected");
    addUnique(prohibitedFindings, "Keyboard expectation weakening is rejected.");
  }
  if (input.semanticAriaGovernanceWeakened === true) {
    addWarning(warningCodes, "semantic_aria_weakening_rejected");
    addUnique(prohibitedFindings, "Semantic/ARIA governance weakening is rejected.");
  }
  if (input.reducedMotionExpectationsWeakened === true) {
    addWarning(warningCodes, "reduced_motion_weakening_rejected");
    addUnique(prohibitedFindings, "Reduced-motion expectation weakening is rejected.");
  }
  if (input.unboundedAccessibilityScopesPresent === true) {
    addWarning(warningCodes, "unbounded_accessibility_scope_rejected");
    addUnique(prohibitedFindings, "Unbounded accessibility scopes are rejected.");
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
  if (input.accessibilityImplementationAllowedNow === true) {
    addWarning(warningCodes, "accessibility_implementation_not_allowed_now");
    addUnique(prohibitedFindings, "Accessibility implementation is not allowed by the R51F planning review contract.");
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

  const consistencyStatus: R51FinalAccessibilityConsistencyStatus =
    prohibitedFindings.length > 0 ? "inconsistent" : blockingFindings.length > 0 ? "needs_review" : "consistent";
  const accessibilityStackReviewStatus: R51FinalAccessibilityStackReviewStatus =
    prohibitedFindings.length > 0
      ? "accessibility_stack_blocked"
      : baselineScopeStatus !== "planned" ||
          keyboardFocusStatus !== "planned" ||
          semanticAriaStatus !== "planned" ||
          formsDashboardStatus !== "planned" ||
          visualAccessibilityStatus !== "planned"
        ? "accessibility_stack_incomplete"
        : blockingFindings.length > 0
          ? "accessibility_review_required"
          : "r51_accessibility_planning_complete";

  const result: R51FinalAccessibilityInclusiveUxStackReviewResult = {
    accessibilityStackReviewStatus,
    consistencyStatus,
    baselineScopeStatus,
    keyboardFocusStatus,
    semanticAriaStatus,
    formsDashboardStatus,
    visualAccessibilityStatus,
    advisoryOnly: true,
    simulationOnly: true,
    accessibilityGovernanceOnly: true,
    runtimeMutationAllowed: false,
    uiRewriteAllowed: false,
    componentMutationAllowed: false,
    themeMutationAllowed: false,
    accessibilityImplementationAllowedNow: false,
    persistenceAllowedNow: false,
    warningCodes,
    accessibilityReviewNotes,
    operatorRecommendations,
    accessibilityRemediationRecommendations,
    blockingFindings,
    prohibitedFindings,
    reviewSummary: "R51F final accessibility inclusive UX stack review contract only.",
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
    reviewSummary: summarizeR51FinalAccessibilityInclusiveUxStackReview(result),
  };
}
