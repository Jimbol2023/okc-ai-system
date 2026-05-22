export type R665FinalUxLockdownStatus =
  | "final_ux_lockdown_blocked"
  | "operator_review_required"
  | "final_ux_lockdown_enforced";

export type R665FinalUxLockdownInput = {
  r665aScopeReviewed?: boolean;
  r665bAuditReviewed?: boolean;
  r665cImplementationScopeReviewed?: boolean;
  r665dCleanupReviewed?: boolean;
  r665eSafetyReviewReviewed?: boolean;
  overflowDoctrineReviewed?: boolean;
  typographyRulesReviewed?: boolean;
  cardDensityRulesReviewed?: boolean;
  badgeWrappingRulesReviewed?: boolean;
  advisoryCopyRulesReviewed?: boolean;
  responsiveRulesReviewed?: boolean;
  governanceVisibilityReviewed?: boolean;
  futureComponentStandardsReviewed?: boolean;
  executionAffordanceRequested?: boolean;
  providerActivationRequested?: boolean;
  runtimeActivationRequested?: boolean;
  pollingRequested?: boolean;
  hiddenControlRequested?: boolean;
  governanceWarningRemovalRequested?: boolean;
  safetyCopyWeakeningRequested?: boolean;
  logicChangeRequested?: boolean;
  routeChangeRequested?: boolean;
  persistenceRequested?: boolean;
  automationRequested?: boolean;
  campaignRequested?: boolean;
  colorOnlyMeaningRequested?: boolean;
  motionDependencyRequested?: boolean;
  focusMovementRequested?: boolean;
};

export type R665FinalUxLockdownSafetyFlags = {
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
  dashboardUxStabilized: true;
  futureDashboardUxStandardsLocked: true;
};

export type R665FinalUxLockdownResult = R665FinalUxLockdownSafetyFlags & {
  phase: "R66.5F";
  surface: "final_ux_lockdown_contract";
  lockdownStatus: R665FinalUxLockdownStatus;
  overflowContainmentDoctrine: string[];
  typographyHierarchyRules: string[];
  cardDensityRules: string[];
  badgeWrappingStandards: string[];
  advisoryCopyContainmentRules: string[];
  responsiveHardeningStandards: string[];
  dashboardSpacingStandards: string[];
  readabilityPreservationRules: string[];
  governanceVisibilityRequirements: string[];
  futureComponentUxStandards: string[];
  forbiddenFutureDrift: string[];
  deterministicInvariants: string[];
  blockedReasons: string[];
  missingReviewAreas: string[];
  safetyFlags: R665FinalUxLockdownSafetyFlags;
  nextSuggestedPhase: "R67A - Automation-Last Governance Scope Contract";
  summary: string;
};

export type R665FinalUxLockdownInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const safetyFlags: R665FinalUxLockdownSafetyFlags = {
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
  dashboardUxStabilized: true,
  futureDashboardUxStandardsLocked: true,
};

const overflowContainmentDoctrine = [
  "Dashboard cards must contain long headings, labels, counts, addresses, statuses, advisory copy, and safety flags.",
  "Use min-w-0, max-w-full, break-words, whitespace-normal, flex-wrap, and safe overflow containment before adding new layout structures.",
  "Overflow-hidden must not hide governance warnings, safety copy, advisory-only disclaimers, or execution boundaries.",
];

const typographyHierarchyRules = [
  "Dashboard headings, labels, statuses, metrics, metadata, and guidance copy must maintain a clear readable hierarchy.",
  "Dense card headings should favor contained text wrapping over smaller unreadable type.",
  "Secondary metadata may be visually de-emphasized only when meaning remains visible and text-based.",
];

const cardDensityRules = [
  "High-density grids must include intermediate responsive columns before wide desktop layouts.",
  "Seven-column dashboard layouts are allowed only at very wide breakpoints and must have safe lower-breakpoint fallbacks.",
  "Repeated cards must maintain consistent padding, gap, and readable vertical rhythm.",
];

const badgeWrappingStandards = [
  "Safety, governance, and status badges must wrap inside their parent containers.",
  "Long true/false safety badges must use max-width containment, break-word behavior, and readable line height.",
  "Badges cannot be removed or hidden to solve density pressure.",
];

const advisoryCopyContainmentRules = [
  "Advisory summaries must remain visible, readable, and screen-reader friendly.",
  "Guidance panels may use wrapping and spacing containment but cannot weaken safety meaning.",
  "Line-clamp cannot be used for governance warnings, safety copy, advisory-only labels, or execution boundaries.",
];

const responsiveHardeningStandards = [
  "Mobile and tablet layouts must avoid horizontal overflow and cramped card headers.",
  "Dashboard grids should prefer one column on mobile, two columns on mid-size screens, and denser grids only when width supports them.",
  "Responsive hardening cannot introduce motion dependency, focus movement, polling, or auto-refresh.",
];

const dashboardSpacingStandards = [
  "Dashboard sections should use consistent card padding and gap rhythm.",
  "Spacing cleanup must preserve existing dashboard placement and information architecture.",
  "Page-level spacing refinements are allowed only for containment and readability, not redesign.",
];

const readabilityPreservationRules = [
  "Operator scanability must improve without hiding warnings or removing context.",
  "Readable labels, text-based status meaning, and predictable reading order must be preserved.",
  "Future cleanup must remain className/presentation scoped unless a later phase explicitly authorizes otherwise.",
];

const governanceVisibilityRequirements = [
  "Governance stop visibility must remain visible and first-order.",
  "Read-only, advisory-only, simulation-only language must remain intact.",
  "No UX stabilization phase can add execution affordances, approval-to-execution behavior, provider activation, runtime activation, polling, persistence, automation, or campaigns.",
];

const futureComponentUxStandards = [
  "New dashboard intelligence components should include min-width containment on card headers.",
  "New safety badge groups should use wrapping, max-width containment, and readable line height.",
  "New advisory guidance panels should preserve semantic headings and visible safety text.",
  "New responsive grids should avoid narrow multi-column cards until wide breakpoints.",
];

const forbiddenFutureDrift = [
  "execution affordances",
  "hidden controls",
  "provider activation",
  "runtime activation",
  "polling",
  "auto-refresh",
  "persistence activation",
  "automation",
  "campaign activation",
  "governance warning removal",
  "safety copy weakening",
  "logic changes",
  "route changes",
  "color-only meaning",
  "motion dependency",
  "focus movement",
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
  "dashboardUxStabilized:true",
  "futureDashboardUxStandardsLocked:true",
];

const requiredReviewAreas: Array<[keyof R665FinalUxLockdownInput, string]> = [
  ["r665aScopeReviewed", "R66.5A scope"],
  ["r665bAuditReviewed", "R66.5B audit"],
  ["r665cImplementationScopeReviewed", "R66.5C implementation scope"],
  ["r665dCleanupReviewed", "R66.5D cleanup"],
  ["r665eSafetyReviewReviewed", "R66.5E safety review"],
  ["overflowDoctrineReviewed", "overflow doctrine"],
  ["typographyRulesReviewed", "typography hierarchy rules"],
  ["cardDensityRulesReviewed", "card density rules"],
  ["badgeWrappingRulesReviewed", "badge wrapping standards"],
  ["advisoryCopyRulesReviewed", "advisory copy rules"],
  ["responsiveRulesReviewed", "responsive hardening rules"],
  ["governanceVisibilityReviewed", "governance visibility requirements"],
  ["futureComponentStandardsReviewed", "future component UX standards"],
];

const blockedReasons: Array<[keyof R665FinalUxLockdownInput, string]> = [
  ["executionAffordanceRequested", "execution affordances are forbidden"],
  ["providerActivationRequested", "provider activation is forbidden"],
  ["runtimeActivationRequested", "runtime activation is forbidden"],
  ["pollingRequested", "polling is forbidden"],
  ["hiddenControlRequested", "hidden controls are forbidden"],
  ["governanceWarningRemovalRequested", "governance warning removal is forbidden"],
  ["safetyCopyWeakeningRequested", "safety copy weakening is forbidden"],
  ["logicChangeRequested", "logic changes are forbidden"],
  ["routeChangeRequested", "route changes are forbidden"],
  ["persistenceRequested", "persistence is forbidden"],
  ["automationRequested", "automation is forbidden"],
  ["campaignRequested", "campaign activation is forbidden"],
  ["colorOnlyMeaningRequested", "color-only meaning is forbidden"],
  ["motionDependencyRequested", "motion dependency is forbidden"],
  ["focusMovementRequested", "focus movement is forbidden"],
];

export function assertR665FinalUxLockdownInvariants(
  result: Pick<R665FinalUxLockdownResult, keyof R665FinalUxLockdownSafetyFlags>,
): R665FinalUxLockdownInvariantCheck {
  const warningCodes: string[] = [];
  if (result.readOnly !== true) warningCodes.push("read_only_required");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.pollingAllowed !== false) warningCodes.push("polling_not_allowed");
  if (result.runtimeActivationAllowed !== false) warningCodes.push("runtime_activation_not_allowed");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_not_allowed");
  if (result.approvalGrantsExecution !== false) warningCodes.push("approval_grants_execution_must_be_false");
  if (result.dashboardUxStabilized !== true) warningCodes.push("dashboard_ux_stabilized_required");
  if (result.futureDashboardUxStandardsLocked !== true) warningCodes.push("future_dashboard_ux_standards_locked_required");
  return { passed: warningCodes.length === 0, warningCodes };
}

export function createR665FinalUxLockdownContract(
  input: R665FinalUxLockdownInput = {},
): R665FinalUxLockdownResult {
  const activeBlockedReasons = blockedReasons
    .filter(([key]) => input[key])
    .map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas
    .filter(([key]) => !input[key])
    .map(([, label]) => label);
  const lockdownStatus: R665FinalUxLockdownStatus =
    activeBlockedReasons.length > 0
      ? "final_ux_lockdown_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "final_ux_lockdown_enforced";

  const result: R665FinalUxLockdownResult = {
    phase: "R66.5F",
    surface: "final_ux_lockdown_contract",
    lockdownStatus,
    overflowContainmentDoctrine,
    typographyHierarchyRules,
    cardDensityRules,
    badgeWrappingStandards,
    advisoryCopyContainmentRules,
    responsiveHardeningStandards,
    dashboardSpacingStandards,
    readabilityPreservationRules,
    governanceVisibilityRequirements,
    futureComponentUxStandards,
    forbiddenFutureDrift,
    deterministicInvariants,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    safetyFlags,
    nextSuggestedPhase: "R67A - Automation-Last Governance Scope Contract",
    summary: "R66.5F final UX lockdown contract.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR665FinalUxLockdown(result),
  };
}

export function summarizeR665FinalUxLockdown(result: R665FinalUxLockdownResult) {
  const invariantCheck = assertR665FinalUxLockdownInvariants(result);
  return (
    `R66.5F ${result.surface} status is ${result.lockdownStatus}. ` +
    `${result.futureComponentUxStandards.length} future component UX standards and ${result.forbiddenFutureDrift.length} forbidden drift categories are locked. ` +
    `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "This lockdown preserves read-only, advisory-only, governance-first dashboard readability without execution affordances, provider activation, runtime activation, polling, hidden controls, or safety-copy weakening."
  );
}
