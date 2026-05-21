export type R51VisualAccessibilityGovernanceStatus =
  | "visual_accessibility_scope_blocked"
  | "visual_accessibility_review_required"
  | "visual_accessibility_governance_planned";

export type R51VisualAccessibilityReadinessStatus = "missing" | "review_required" | "planned";

export type R51VisualAccessibilityWarningCode =
  | "r51e_visual_accessibility_governance_contract_only"
  | "input_missing"
  | "wcag_contrast_expectations_required"
  | "text_background_contrast_required"
  | "icon_button_contrast_required"
  | "focus_ring_contrast_required"
  | "badge_status_contrast_required"
  | "dark_light_mode_contrast_required"
  | "reduced_motion_support_required"
  | "animation_motion_safety_required"
  | "non_color_indicator_required"
  | "visual_state_redundancy_required"
  | "status_icon_text_pattern_required"
  | "visual_testing_required"
  | "low_contrast_rejected"
  | "color_only_status_rejected"
  | "motion_only_feedback_rejected"
  | "unsafe_animation_rejected"
  | "missing_reduced_motion_rejected"
  | "invisible_focus_rejected"
  | "dark_light_contrast_rejected"
  | "runtime_accessibility_mutation_rejected"
  | "ui_rewrite_not_allowed"
  | "theme_mutation_not_allowed"
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

export type R51ColorContrastReducedMotionNonColorIndicatorGovernanceInput = {
  wcagContrastExpectationsPlanned?: boolean;
  textBackgroundContrastPlanned?: boolean;
  iconButtonContrastPlanned?: boolean;
  focusRingContrastPlanned?: boolean;
  badgeStatusContrastPlanned?: boolean;
  darkLightModeContrastReadinessPlanned?: boolean;
  reducedMotionSupportPlanned?: boolean;
  animationMotionSafetyPlanned?: boolean;
  nonColorOnlyIndicatorsPlanned?: boolean;
  visualStateRedundancyPlanned?: boolean;
  statusIconTextPatternPlanned?: boolean;
  accessibilityVisualTestingPlanned?: boolean;
  lowContrastApproved?: boolean;
  colorOnlyStatusApproved?: boolean;
  motionOnlyFeedbackApproved?: boolean;
  unsafeAnimationApproved?: boolean;
  missingReducedMotionApproved?: boolean;
  invisibleLowContrastFocusApproved?: boolean;
  inaccessibleDarkLightContrastApproved?: boolean;
  runtimeAccessibilityMutationAttempted?: boolean;
  uiRewriteRequested?: boolean;
  themeMutationAttempted?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  accessibilityGovernanceOnly?: boolean;
  accessibilityReviewNotes?: string[];
  operatorRecommendations?: string[];
  visualRemediationRecommendations?: string[];
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

export type R51ColorContrastReducedMotionNonColorIndicatorGovernanceResult = {
  visualAccessibilityGovernanceStatus: R51VisualAccessibilityGovernanceStatus;
  wcagContrastStatus: R51VisualAccessibilityReadinessStatus;
  textBackgroundContrastStatus: R51VisualAccessibilityReadinessStatus;
  iconButtonContrastStatus: R51VisualAccessibilityReadinessStatus;
  focusRingContrastStatus: R51VisualAccessibilityReadinessStatus;
  badgeStatusContrastStatus: R51VisualAccessibilityReadinessStatus;
  darkLightModeContrastStatus: R51VisualAccessibilityReadinessStatus;
  reducedMotionStatus: R51VisualAccessibilityReadinessStatus;
  animationMotionSafetyStatus: R51VisualAccessibilityReadinessStatus;
  nonColorIndicatorStatus: R51VisualAccessibilityReadinessStatus;
  visualStateRedundancyStatus: R51VisualAccessibilityReadinessStatus;
  statusIconTextPatternStatus: R51VisualAccessibilityReadinessStatus;
  visualTestingStatus: R51VisualAccessibilityReadinessStatus;
  advisoryOnly: true;
  simulationOnly: true;
  accessibilityGovernanceOnly: true;
  runtimeMutationAllowed: false;
  uiRewriteAllowed: false;
  themeMutationAllowed: false;
  persistenceAllowedNow: false;
  warningCodes: string[];
  accessibilityReviewNotes: string[];
  operatorRecommendations: string[];
  visualRemediationRecommendations: string[];
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

export type R51VisualAccessibilityInvariantCheck = {
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

function addWarning(warningCodes: string[], warningCode: R51VisualAccessibilityWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function plannedStatus(value: boolean | undefined): R51VisualAccessibilityReadinessStatus {
  return value === true ? "planned" : "missing";
}

function addMissingPlanningFinding(
  planned: boolean | undefined,
  warningCode: R51VisualAccessibilityWarningCode,
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

function hasExecutionIndicators(input: R51ColorContrastReducedMotionNonColorIndicatorGovernanceInput) {
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

export function assertR51ColorContrastReducedMotionNonColorIndicatorInvariants(
  result: Pick<
    R51ColorContrastReducedMotionNonColorIndicatorGovernanceResult,
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
): R51VisualAccessibilityInvariantCheck {
  const warningCodes: R51VisualAccessibilityInvariantCheck["warningCodes"] = [];

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

export function summarizeR51ColorContrastReducedMotionNonColorIndicatorGovernance(
  result: R51ColorContrastReducedMotionNonColorIndicatorGovernanceResult,
) {
  const invariantCheck = assertR51ColorContrastReducedMotionNonColorIndicatorInvariants(result);

  return boundSummary(
    `R51E color contrast reduced motion non-color indicator governance is ${result.visualAccessibilityGovernanceStatus}. ` +
      `WCAG contrast: ${result.wcagContrastStatus}; text/background: ${result.textBackgroundContrastStatus}; focus ring: ${result.focusRingContrastStatus}; ` +
      `reduced motion: ${result.reducedMotionStatus}; non-color indicators: ${result.nonColorIndicatorStatus}; visual testing: ${result.visualTestingStatus}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Contract is advisory-only, simulation-only, and accessibility-governance-only; it performs no UI rewrite, CSS/theme edit, runtime mutation, provider activation, persistence, or live execution.",
  );
}

export function createR51ColorContrastReducedMotionNonColorIndicatorGovernance(
  input: R51ColorContrastReducedMotionNonColorIndicatorGovernanceInput = {},
): R51ColorContrastReducedMotionNonColorIndicatorGovernanceResult {
  const warningCodes: string[] = [];
  const accessibilityReviewNotes = collectText(input.accessibilityReviewNotes);
  const operatorRecommendations = collectText(input.operatorRecommendations);
  const visualRemediationRecommendations = collectText(input.visualRemediationRecommendations);
  const accessibilityReviewActions = collectText(input.accessibilityReviewActions);
  const blockingFindings: string[] = [];
  const prohibitedFindings: string[] = [];

  addWarning(warningCodes, "r51e_visual_accessibility_governance_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) {
    addWarning(warningCodes, "input_missing");
    addUnique(prohibitedFindings, "Color contrast, motion, and non-color indicator governance input is missing.");
  }

  addMissingPlanningFinding(input.wcagContrastExpectationsPlanned, "wcag_contrast_expectations_required", "Plan WCAG contrast expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.textBackgroundContrastPlanned, "text_background_contrast_required", "Plan text/background contrast expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.iconButtonContrastPlanned, "icon_button_contrast_required", "Plan icon and button contrast expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.focusRingContrastPlanned, "focus_ring_contrast_required", "Plan visible focus-ring contrast expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.badgeStatusContrastPlanned, "badge_status_contrast_required", "Plan badge and status contrast expectations.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.darkLightModeContrastReadinessPlanned, "dark_light_mode_contrast_required", "Plan dark/light mode contrast readiness.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.reducedMotionSupportPlanned, "reduced_motion_support_required", "Plan reduced-motion support.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.animationMotionSafetyPlanned, "animation_motion_safety_required", "Plan animation and motion safety.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.nonColorOnlyIndicatorsPlanned, "non_color_indicator_required", "Plan non-color-only indicators.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.visualStateRedundancyPlanned, "visual_state_redundancy_required", "Plan visual state redundancy.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.statusIconTextPatternPlanned, "status_icon_text_pattern_required", "Plan status icon and text patterns.", warningCodes, blockingFindings, accessibilityReviewActions);
  addMissingPlanningFinding(input.accessibilityVisualTestingPlanned, "visual_testing_required", "Plan visual accessibility testing expectations.", warningCodes, blockingFindings, accessibilityReviewActions);

  if (input.lowContrastApproved === true) {
    addWarning(warningCodes, "low_contrast_rejected");
    addUnique(prohibitedFindings, "Low-contrast approval is rejected.");
  }
  if (input.colorOnlyStatusApproved === true) {
    addWarning(warningCodes, "color_only_status_rejected");
    addUnique(prohibitedFindings, "Color-only status approval is rejected.");
  }
  if (input.motionOnlyFeedbackApproved === true) {
    addWarning(warningCodes, "motion_only_feedback_rejected");
    addUnique(prohibitedFindings, "Motion-only feedback approval is rejected.");
  }
  if (input.unsafeAnimationApproved === true) {
    addWarning(warningCodes, "unsafe_animation_rejected");
    addUnique(prohibitedFindings, "Unsafe animation approval is rejected.");
  }
  if (input.missingReducedMotionApproved === true) {
    addWarning(warningCodes, "missing_reduced_motion_rejected");
    addUnique(prohibitedFindings, "Missing reduced-motion support approval is rejected.");
  }
  if (input.invisibleLowContrastFocusApproved === true) {
    addWarning(warningCodes, "invisible_focus_rejected");
    addUnique(prohibitedFindings, "Invisible or low-contrast focus approval is rejected.");
  }
  if (input.inaccessibleDarkLightContrastApproved === true) {
    addWarning(warningCodes, "dark_light_contrast_rejected");
    addUnique(prohibitedFindings, "Inaccessible dark/light mode contrast approval is rejected.");
  }
  if (input.runtimeAccessibilityMutationAttempted === true) {
    addWarning(warningCodes, "runtime_accessibility_mutation_rejected");
    addUnique(prohibitedFindings, "Runtime accessibility mutation attempts are rejected in R51E.");
  }
  if (input.uiRewriteRequested === true) {
    addWarning(warningCodes, "ui_rewrite_not_allowed");
    addUnique(prohibitedFindings, "UI rewrite is not allowed in R51E planning.");
  }
  if (input.themeMutationAttempted === true) {
    addWarning(warningCodes, "theme_mutation_not_allowed");
    addUnique(prohibitedFindings, "Theme mutation is not allowed in R51E planning.");
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

  const visualAccessibilityGovernanceStatus: R51VisualAccessibilityGovernanceStatus =
    prohibitedFindings.length > 0
      ? "visual_accessibility_scope_blocked"
      : blockingFindings.length > 0
        ? "visual_accessibility_review_required"
        : "visual_accessibility_governance_planned";

  const result: R51ColorContrastReducedMotionNonColorIndicatorGovernanceResult = {
    visualAccessibilityGovernanceStatus,
    wcagContrastStatus: plannedStatus(input.wcagContrastExpectationsPlanned),
    textBackgroundContrastStatus: plannedStatus(input.textBackgroundContrastPlanned),
    iconButtonContrastStatus: plannedStatus(input.iconButtonContrastPlanned),
    focusRingContrastStatus: plannedStatus(input.focusRingContrastPlanned),
    badgeStatusContrastStatus: plannedStatus(input.badgeStatusContrastPlanned),
    darkLightModeContrastStatus: plannedStatus(input.darkLightModeContrastReadinessPlanned),
    reducedMotionStatus: plannedStatus(input.reducedMotionSupportPlanned),
    animationMotionSafetyStatus: plannedStatus(input.animationMotionSafetyPlanned),
    nonColorIndicatorStatus: plannedStatus(input.nonColorOnlyIndicatorsPlanned),
    visualStateRedundancyStatus: plannedStatus(input.visualStateRedundancyPlanned),
    statusIconTextPatternStatus: plannedStatus(input.statusIconTextPatternPlanned),
    visualTestingStatus: plannedStatus(input.accessibilityVisualTestingPlanned),
    advisoryOnly: true,
    simulationOnly: true,
    accessibilityGovernanceOnly: true,
    runtimeMutationAllowed: false,
    uiRewriteAllowed: false,
    themeMutationAllowed: false,
    persistenceAllowedNow: false,
    warningCodes,
    accessibilityReviewNotes,
    operatorRecommendations,
    visualRemediationRecommendations,
    accessibilityReviewActions,
    blockingFindings,
    prohibitedFindings,
    summary: "R51E color contrast reduced motion non-color indicator governance contract only.",
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
    summary: summarizeR51ColorContrastReducedMotionNonColorIndicatorGovernance(result),
  };
}
