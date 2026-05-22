export type R665OperatorUxScopeStatus =
  | "ux_stabilization_scope_blocked"
  | "operator_review_required"
  | "ux_stabilization_scope_ready";

export type R665UxStabilizationConcept =
  | "text_overflow_containment"
  | "card_spacing_normalization"
  | "badge_wrapping"
  | "advisory_text_limits"
  | "responsive_hardening"
  | "typography_hierarchy"
  | "readable_dashboard_density"
  | "operator_scanability"
  | "accessibility_preservation"
  | "visual_consistency"
  | "governance_copy_preservation"
  | "logic_free_ui_cleanup";

export type R665ForbiddenSemantic =
  | "dashboard redesign"
  | "app architecture change"
  | "intelligence logic change"
  | "business logic change"
  | "new route"
  | "provider activation"
  | "Twilio activation"
  | "SMS sending"
  | "email sending"
  | "Prisma schema change"
  | "migration"
  | "persistence activation"
  | "polling"
  | "auto-refresh"
  | "execution controls"
  | "campaign controls"
  | "automation"
  | "hidden buttons"
  | "weaken safety copy"
  | "governance meaning change";

export type R665ScopeInput = {
  r66fLockdownReviewed?: boolean;
  uxConceptsReviewed?: boolean;
  dashboardReadabilityReviewed?: boolean;
  overflowReviewed?: boolean;
  badgeWrappingReviewed?: boolean;
  cardSpacingReviewed?: boolean;
  typographyReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  implementationRequested?: boolean;
  redesignRequested?: boolean;
  logicChangeRequested?: boolean;
  routeChangeRequested?: boolean;
  providerActivationRequested?: boolean;
  prismaChangeRequested?: boolean;
  persistenceRequested?: boolean;
  pollingRequested?: boolean;
  runtimeActivationRequested?: boolean;
  executionControlRequested?: boolean;
  campaignRequested?: boolean;
  automationRequested?: boolean;
  hiddenButtonRequested?: boolean;
  governanceMeaningChangeRequested?: boolean;
  safetyCopyWeakeningRequested?: boolean;
  readOnly?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  persistenceAllowedNow?: boolean;
  pollingAllowed?: boolean;
  runtimeActivationAllowed?: boolean;
  providerActivationAllowed?: boolean;
  approvalGrantsExecution?: boolean;
  extraScopeNotes?: string[];
};

export type R665ScopeSafetyFlags = {
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
  uxImplementationAllowedNow: false;
};

export type R665ScopeResult = R665ScopeSafetyFlags & {
  phase: "R66.5A";
  surface: "operator_ux_stabilization_scope";
  scopeStatus: R665OperatorUxScopeStatus;
  allowedUxConcepts: R665UxStabilizationConcept[];
  forbiddenSemantics: R665ForbiddenSemantic[];
  dashboardReadabilityRules: string[];
  overflowContainmentRules: string[];
  badgeWrappingRules: string[];
  cardSpacingRules: string[];
  typographyHierarchyRules: string[];
  accessibilityRequirements: string[];
  governanceBoundaries: string[];
  deterministicInvariants: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R665ScopeSafetyFlags;
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R665ScopeInvariantCheck = { passed: boolean; warningCodes: string[] };

const maxListItems = 44;
const maxTextLength = 180;

const safetyFlags: R665ScopeSafetyFlags = {
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
  uxImplementationAllowedNow: false,
};

const allowedUxConcepts: R665UxStabilizationConcept[] = [
  "text_overflow_containment",
  "card_spacing_normalization",
  "badge_wrapping",
  "advisory_text_limits",
  "responsive_hardening",
  "typography_hierarchy",
  "readable_dashboard_density",
  "operator_scanability",
  "accessibility_preservation",
  "visual_consistency",
  "governance_copy_preservation",
  "logic_free_ui_cleanup",
];

const forbiddenSemantics: R665ForbiddenSemantic[] = [
  "dashboard redesign",
  "app architecture change",
  "intelligence logic change",
  "business logic change",
  "new route",
  "provider activation",
  "Twilio activation",
  "SMS sending",
  "email sending",
  "Prisma schema change",
  "migration",
  "persistence activation",
  "polling",
  "auto-refresh",
  "execution controls",
  "campaign controls",
  "automation",
  "hidden buttons",
  "weaken safety copy",
  "governance meaning change",
];

const dashboardReadabilityRules = [
  "Future cleanup may adjust className-only presentation for readability after R66.5C authorizes exact files.",
  "Future cleanup must preserve all business, intelligence, governance, safety, and data logic.",
  "Dashboard density should favor scannable cards, readable summaries, and consistent spacing without redesigning the information architecture.",
];

const overflowContainmentRules = [
  "Long labels, status text, safety badges, and advisory copy must remain inside their containers.",
  "Allowed future techniques include min-w-0, max-width constraints, break-words, whitespace controls, overflow containment, and responsive grid hardening.",
  "Overflow fixes must not hide safety meaning or remove governance copy.",
];

const badgeWrappingRules = [
  "Safety badges must wrap within their parent container.",
  "Badge text must remain readable and must not overlap neighboring content.",
  "Badge wrapping may use flex-wrap, min-width containment, gap normalization, and text wrapping controls.",
];

const cardSpacingRules = [
  "Cards should use consistent padding, gap, and vertical rhythm across intelligence surfaces.",
  "Card density should reduce readability pressure without adding new dashboard sections or changing data meaning.",
  "Cards must remain mobile-first and responsive.",
];

const typographyHierarchyRules = [
  "Headings, labels, statuses, details, and advisory summaries should have clear hierarchy.",
  "Long advisory text should remain concise and readable.",
  "Typography cleanup must not weaken safety language or change governance meaning.",
];

const accessibilityRequirements = [
  "Semantic headings must be preserved.",
  "Screen-reader-friendly summaries must be preserved.",
  "Status meaning must remain text-based and not color-only.",
  "No motion dependency, focus movement, auto-refresh, or polling may be introduced.",
  "Responsive hardening must improve readability without hiding required safety or governance text.",
];

const governanceBoundaries = [
  "R66.5A authorizes scope definition only, not UI implementation.",
  "Future UX cleanup cannot change execution boundaries, governance meaning, intelligence calculations, provider behavior, persistence, runtime behavior, automation, or routes.",
  "Read-only, advisory-only, simulation-only safety posture must remain intact.",
];

const deterministicInvariants = [
  "readOnly:true",
  "advisoryOnly:true",
  "simulationOnly:true",
  "providerCalled:false",
  "sent:false",
  "persistenceAllowedNow:false",
  "pollingAllowed:false",
  "runtimeActivationAllowed:false",
  "providerActivationAllowed:false",
  "approvalGrantsExecution:false",
  "uxImplementationAllowedNow:false",
];

function addUnique(list: string[], value: string) {
  const trimmed = value.trim();
  const bounded = trimmed.length <= maxTextLength ? trimmed : `${trimmed.slice(0, maxTextLength)}...`;
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function hasForbiddenRequest(input: R665ScopeInput) {
  return Boolean(
    input.implementationRequested ||
      input.redesignRequested ||
      input.logicChangeRequested ||
      input.routeChangeRequested ||
      input.providerActivationRequested ||
      input.prismaChangeRequested ||
      input.persistenceRequested ||
      input.pollingRequested ||
      input.runtimeActivationRequested ||
      input.executionControlRequested ||
      input.campaignRequested ||
      input.automationRequested ||
      input.hiddenButtonRequested ||
      input.governanceMeaningChangeRequested ||
      input.safetyCopyWeakeningRequested ||
      input.readOnly === false ||
      input.advisoryOnly === false ||
      input.simulationOnly === false ||
      input.providerCalled ||
      input.sent ||
      input.persistenceAllowedNow ||
      input.pollingAllowed ||
      input.runtimeActivationAllowed ||
      input.providerActivationAllowed ||
      input.approvalGrantsExecution,
  );
}

export function assertR665OperatorUxStabilizationScopeInvariants(
  result: Pick<R665ScopeResult, keyof R665ScopeSafetyFlags>,
): R665ScopeInvariantCheck {
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
  if (result.uxImplementationAllowedNow !== false) warningCodes.push("ux_implementation_not_allowed_now");
  return { passed: warningCodes.length === 0, warningCodes };
}

export function summarizeR665OperatorUxStabilizationScope(result: R665ScopeResult) {
  const invariantCheck = assertR665OperatorUxStabilizationScopeInvariants(result);
  return (
    `R66.5A ${result.surface} status is ${result.scopeStatus}. ` +
    `${result.allowedUxConcepts.length} UX stabilization concepts and ${result.forbiddenSemantics.length} forbidden semantics are scoped. ` +
    `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "This contract cannot authorize implementation, redesign, logic changes, routes, providers, persistence, polling, runtime activation, automation, campaigns, execution controls, hidden buttons, or governance weakening."
  );
}

export function createR665OperatorUxStabilizationScopeContract(input: R665ScopeInput = {}): R665ScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes: string[] = [];
  for (const note of input.extraScopeNotes ?? []) addUnique(scopeNotes, note);

  addUnique(warningCodes, "r665a_scope_contract_only");
  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r66fLockdownReviewed !== true) addUnique(warningCodes, "r66f_lockdown_review_required");
  if (input.uxConceptsReviewed !== true) addUnique(warningCodes, "ux_concepts_review_required");
  if (input.dashboardReadabilityReviewed !== true) addUnique(warningCodes, "dashboard_readability_review_required");
  if (input.overflowReviewed !== true) addUnique(warningCodes, "overflow_review_required");
  if (input.badgeWrappingReviewed !== true) addUnique(warningCodes, "badge_wrapping_review_required");
  if (input.cardSpacingReviewed !== true) addUnique(warningCodes, "card_spacing_review_required");
  if (input.typographyReviewed !== true) addUnique(warningCodes, "typography_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.governanceBoundaryReviewed !== true) addUnique(warningCodes, "governance_boundary_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");

  const rejectionMap: Array<[boolean | undefined, string]> = [
    [input.implementationRequested, "implementation_rejected"],
    [input.redesignRequested, "redesign_rejected"],
    [input.logicChangeRequested, "logic_change_rejected"],
    [input.routeChangeRequested, "route_change_rejected"],
    [input.providerActivationRequested, "provider_activation_rejected"],
    [input.prismaChangeRequested, "prisma_change_rejected"],
    [input.persistenceRequested, "persistence_rejected"],
    [input.pollingRequested, "polling_rejected"],
    [input.runtimeActivationRequested, "runtime_activation_rejected"],
    [input.executionControlRequested, "execution_control_rejected"],
    [input.campaignRequested, "campaign_rejected"],
    [input.automationRequested, "automation_rejected"],
    [input.hiddenButtonRequested, "hidden_button_rejected"],
    [input.governanceMeaningChangeRequested, "governance_meaning_change_rejected"],
    [input.safetyCopyWeakeningRequested, "safety_copy_weakening_rejected"],
  ];
  for (const [flag, code] of rejectionMap) if (flag === true) addUnique(warningCodes, code);
  if (input.readOnly === false) addUnique(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addUnique(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addUnique(warningCodes, "simulation_only_required");
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addUnique(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addUnique(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addUnique(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addUnique(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.approvalGrantsExecution === true) addUnique(warningCodes, "approval_grants_execution_must_be_false");
  for (const warningCode of warningCodes) {
    if (warningCode.endsWith("_rejected") || warningCode.endsWith("_required") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed")) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingReview =
    input.r66fLockdownReviewed !== true ||
    input.uxConceptsReviewed !== true ||
    input.dashboardReadabilityReviewed !== true ||
    input.overflowReviewed !== true ||
    input.badgeWrappingReviewed !== true ||
    input.cardSpacingReviewed !== true ||
    input.typographyReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R665OperatorUxScopeStatus = hasForbiddenRequest(input)
    ? "ux_stabilization_scope_blocked"
    : missingReview
      ? "operator_review_required"
      : "ux_stabilization_scope_ready";

  const result: R665ScopeResult = {
    phase: "R66.5A",
    surface: "operator_ux_stabilization_scope",
    scopeStatus,
    allowedUxConcepts,
    forbiddenSemantics,
    dashboardReadabilityRules,
    overflowContainmentRules,
    badgeWrappingRules,
    cardSpacingRules,
    typographyHierarchyRules,
    accessibilityRequirements,
    governanceBoundaries,
    deterministicInvariants,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R66.5B - Dashboard Overflow / Density Audit",
    summary: "R66.5A operator UX stabilization scope contract only.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR665OperatorUxStabilizationScope(result) };
}
