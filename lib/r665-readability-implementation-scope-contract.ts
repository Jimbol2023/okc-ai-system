export type R665ReadabilityImplementationScopeStatus =
  | "readability_implementation_scope_blocked"
  | "operator_review_required"
  | "readability_implementation_scope_ready";

export type R665AllowedFutureChangeType =
  | "className-only refinements"
  | "spacing normalization"
  | "typography hierarchy refinements"
  | "card padding normalization"
  | "card spacing normalization"
  | "gap normalization"
  | "responsive grid hardening"
  | "overflow containment"
  | "text wrapping fixes"
  | "badge wrapping fixes"
  | "flex-wrap additions"
  | "break-words additions"
  | "whitespace-normal additions"
  | "min-w-0 additions"
  | "max-w-full additions"
  | "accessibility-safe overflow-hidden"
  | "line-clamp only when governance and safety text remains fully visible"
  | "secondary metadata de-emphasis"
  | "visual density reduction"
  | "scanability improvements"
  | "readability improvements"
  | "bounded advisory text containers";

export type R665ForbiddenFutureChangeType =
  | "business logic changes"
  | "intelligence logic changes"
  | "governance meaning changes"
  | "safety copy weakening"
  | "hiding governance warnings"
  | "removing governance warnings"
  | "route changes"
  | "API changes"
  | "Prisma/schema/migrations"
  | "provider changes"
  | "Twilio/email/SMS changes"
  | "persistence changes"
  | "polling"
  | "auto-refresh"
  | "timers"
  | "execution controls"
  | "buttons"
  | "approval-to-execution controls"
  | "provider activation"
  | "campaign changes"
  | "automation-agent changes"
  | "runtime activation"
  | "enrichment"
  | "skip tracing"
  | "scraping"
  | "GPS/map logic"
  | "data mutations";

export type R665ReadabilityImplementationScopeInput = {
  r665aScopeReviewed?: boolean;
  r665bAuditReviewed?: boolean;
  allowedChangeTypesReviewed?: boolean;
  forbiddenChangeTypesReviewed?: boolean;
  targetSurfaceReviewed?: boolean;
  accessibilityRulesReviewed?: boolean;
  governanceRulesReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  implementationRequestedNow?: boolean;
  redesignRequested?: boolean;
  layoutArchitectureChangeRequested?: boolean;
  businessLogicChangeRequested?: boolean;
  intelligenceLogicChangeRequested?: boolean;
  governanceMeaningChangeRequested?: boolean;
  safetyCopyWeakeningRequested?: boolean;
  governanceWarningHiddenRequested?: boolean;
  governanceWarningRemovalRequested?: boolean;
  routeChangeRequested?: boolean;
  apiChangeRequested?: boolean;
  prismaChangeRequested?: boolean;
  providerChangeRequested?: boolean;
  twilioEmailSmsChangeRequested?: boolean;
  persistenceRequested?: boolean;
  pollingRequested?: boolean;
  autoRefreshRequested?: boolean;
  timerRequested?: boolean;
  executionControlRequested?: boolean;
  buttonRequested?: boolean;
  approvalToExecutionRequested?: boolean;
  providerActivationRequested?: boolean;
  campaignRequested?: boolean;
  automationAgentRequested?: boolean;
  runtimeActivationRequested?: boolean;
  enrichmentRequested?: boolean;
  skipTracingRequested?: boolean;
  scrapingRequested?: boolean;
  gpsMapLogicRequested?: boolean;
  dataMutationRequested?: boolean;
  lineClampWouldHideGovernanceText?: boolean;
  ariaLabelRemovalRequested?: boolean;
  ariaDescribedbyRemovalRequested?: boolean;
  colorOnlyMeaningRequested?: boolean;
  motionDependencyRequested?: boolean;
  focusMovementRequested?: boolean;
};

export type R665ReadabilityImplementationSafetyFlags = {
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
  futureImplementationMustRemainUiOnly: true;
};

export type R665ReadabilityImplementationScopeResult =
  R665ReadabilityImplementationSafetyFlags & {
    phase: "R66.5C";
    surface: "readability_implementation_scope_contract";
    scopeStatus: R665ReadabilityImplementationScopeStatus;
    allowedFutureChangeTypes: R665AllowedFutureChangeType[];
    forbiddenFutureChangeTypes: R665ForbiddenFutureChangeType[];
    recommendedFutureTargets: string[];
    classNameOnlyRules: string[];
    overflowContainmentRules: string[];
    badgeWrappingRules: string[];
    advisoryTextRules: string[];
    lineClampRules: string[];
    accessibilityRules: string[];
    governanceRules: string[];
    deterministicInvariants: string[];
    blockedReasons: string[];
    missingReviewAreas: string[];
    safetyFlags: R665ReadabilityImplementationSafetyFlags;
    nextSuggestedPhase: "R66.5D - Dashboard Readability Cleanup Implementation";
    summary: string;
  };

export type R665ReadabilityImplementationInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const safetyFlags: R665ReadabilityImplementationSafetyFlags = {
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
  futureImplementationMustRemainUiOnly: true,
};

const allowedFutureChangeTypes: R665AllowedFutureChangeType[] = [
  "className-only refinements",
  "spacing normalization",
  "typography hierarchy refinements",
  "card padding normalization",
  "card spacing normalization",
  "gap normalization",
  "responsive grid hardening",
  "overflow containment",
  "text wrapping fixes",
  "badge wrapping fixes",
  "flex-wrap additions",
  "break-words additions",
  "whitespace-normal additions",
  "min-w-0 additions",
  "max-w-full additions",
  "accessibility-safe overflow-hidden",
  "line-clamp only when governance and safety text remains fully visible",
  "secondary metadata de-emphasis",
  "visual density reduction",
  "scanability improvements",
  "readability improvements",
  "bounded advisory text containers",
];

const forbiddenFutureChangeTypes: R665ForbiddenFutureChangeType[] = [
  "business logic changes",
  "intelligence logic changes",
  "governance meaning changes",
  "safety copy weakening",
  "hiding governance warnings",
  "removing governance warnings",
  "route changes",
  "API changes",
  "Prisma/schema/migrations",
  "provider changes",
  "Twilio/email/SMS changes",
  "persistence changes",
  "polling",
  "auto-refresh",
  "timers",
  "execution controls",
  "buttons",
  "approval-to-execution controls",
  "provider activation",
  "campaign changes",
  "automation-agent changes",
  "runtime activation",
  "enrichment",
  "skip tracing",
  "scraping",
  "GPS/map logic",
  "data mutations",
];

const recommendedFutureTargets = [
  "components/dashboard/*intelligence-summary.tsx",
  "components/dashboard/*readiness-summary.tsx",
  "components/dashboard/*priority*.tsx",
  "components/dashboard/*recovery*.tsx",
  "components/dashboard/*work-queue*.tsx",
  "components/dashboard/*quality*.tsx",
  "components/dashboard/*controlled-execution*.tsx",
  "components/dashboard/*driving-for-dollars*.tsx",
  "app/(dashboard)/dashboard/page.tsx only if spacing normalization is required",
];

const classNameOnlyRules = [
  "R66.5D may adjust className values only for existing dashboard display surfaces.",
  "Future cleanup cannot add handlers, state, data fetches, business logic, or runtime behavior.",
  "Future cleanup must avoid unrelated surfaces and preserve existing information architecture.",
];

const overflowContainmentRules = [
  "Use min-w-0, max-w-full, break-words, whitespace-normal, flex-wrap, and responsive grid hardening where needed.",
  "Overflow-hidden is allowed only when it does not hide required safety, governance, or status meaning.",
  "Long labels, badges, headings, status descriptions, and advisory text must remain inside their parent cards.",
];

const badgeWrappingRules = [
  "Badges must wrap within their containers and remain readable on mobile and desktop.",
  "Badge wrapping may use flex-wrap, gap normalization, max-width containment, and shrink behavior refinements.",
  "Badge cleanup cannot remove safety flags, warning labels, or governance stop meaning.",
];

const advisoryTextRules = [
  "Advisory summaries may be visually bounded for scanability while keeping required safety wording visible.",
  "Secondary metadata may be visually de-emphasized without changing data meaning.",
  "Safety wording cannot be weakened, removed, hidden, or converted into color-only meaning.",
];

const lineClampRules = [
  "Line-clamp is allowed only for non-critical secondary metadata.",
  "Line-clamp cannot hide governance warnings, safety copy, advisory-only disclaimers, or execution boundaries.",
  "If governance or safety text would be hidden, use wrapping or spacing normalization instead.",
];

const accessibilityRules = [
  "Semantic sections must be preserved.",
  "aria-labelledby and aria-describedby relationships must be preserved where present.",
  "Readable labels and text-based status meaning must be preserved.",
  "No color-only meaning, motion dependency, focus movement, auto-refresh, polling, or timers may be introduced.",
  "Visible governance and safety warnings must remain readable and reachable in predictable reading order.",
];

const governanceRules = [
  "R66.5C is contract-only and cannot authorize immediate UI implementation.",
  "R66.5D must remain UI-only and cannot change business, intelligence, or governance meaning.",
  "Read-only, advisory-only, simulation-only safety posture must remain intact.",
  "Future cleanup cannot introduce execution controls, hidden buttons, approval-to-execution behavior, providers, campaigns, persistence, polling, runtime activation, enrichment, scraping, skip tracing, or GPS/map logic.",
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
  "uiImplementationAllowedNow:false",
  "futureImplementationMustRemainUiOnly:true",
];

const requiredReviewAreas: Array<
  [keyof R665ReadabilityImplementationScopeInput, string]
> = [
  ["r665aScopeReviewed", "R66.5A UX stabilization scope"],
  ["r665bAuditReviewed", "R66.5B overflow and density audit"],
  ["allowedChangeTypesReviewed", "allowed future change types"],
  ["forbiddenChangeTypesReviewed", "forbidden future change types"],
  ["targetSurfaceReviewed", "future implementation target surfaces"],
  ["accessibilityRulesReviewed", "accessibility rules"],
  ["governanceRulesReviewed", "governance rules"],
  ["operatorReviewCompleted", "operator review"],
];

const forbiddenRequestReasons: Array<
  [keyof R665ReadabilityImplementationScopeInput, string]
> = [
  ["implementationRequestedNow", "R66.5C is contract-only and cannot implement UI changes now"],
  ["redesignRequested", "dashboard redesign is forbidden"],
  ["layoutArchitectureChangeRequested", "layout architecture redesign is forbidden"],
  ["businessLogicChangeRequested", "business logic changes are forbidden"],
  ["intelligenceLogicChangeRequested", "intelligence logic changes are forbidden"],
  ["governanceMeaningChangeRequested", "governance meaning changes are forbidden"],
  ["safetyCopyWeakeningRequested", "safety copy weakening is forbidden"],
  ["governanceWarningHiddenRequested", "hiding governance warnings is forbidden"],
  ["governanceWarningRemovalRequested", "removing governance warnings is forbidden"],
  ["routeChangeRequested", "route changes are forbidden"],
  ["apiChangeRequested", "API changes are forbidden"],
  ["prismaChangeRequested", "Prisma, schema, and migration changes are forbidden"],
  ["providerChangeRequested", "provider changes are forbidden"],
  ["twilioEmailSmsChangeRequested", "Twilio, email, and SMS changes are forbidden"],
  ["persistenceRequested", "persistence changes are forbidden"],
  ["pollingRequested", "polling is forbidden"],
  ["autoRefreshRequested", "auto-refresh is forbidden"],
  ["timerRequested", "timers are forbidden"],
  ["executionControlRequested", "execution controls are forbidden"],
  ["buttonRequested", "buttons and hidden controls are forbidden"],
  ["approvalToExecutionRequested", "approval-to-execution controls are forbidden"],
  ["providerActivationRequested", "provider activation is forbidden"],
  ["campaignRequested", "campaign changes are forbidden"],
  ["automationAgentRequested", "automation-agent changes are forbidden"],
  ["runtimeActivationRequested", "runtime activation is forbidden"],
  ["enrichmentRequested", "enrichment is forbidden"],
  ["skipTracingRequested", "skip tracing is forbidden"],
  ["scrapingRequested", "scraping is forbidden"],
  ["gpsMapLogicRequested", "GPS/map logic is forbidden"],
  ["dataMutationRequested", "data mutations are forbidden"],
  ["lineClampWouldHideGovernanceText", "line-clamp cannot hide governance or safety text"],
  ["ariaLabelRemovalRequested", "aria-labelledby removal is forbidden"],
  ["ariaDescribedbyRemovalRequested", "aria-describedby removal is forbidden"],
  ["colorOnlyMeaningRequested", "color-only meaning is forbidden"],
  ["motionDependencyRequested", "motion dependency is forbidden"],
  ["focusMovementRequested", "focus movement is forbidden"],
];

export function assertR665ReadabilityImplementationScopeInvariants(
  result: Pick<
    R665ReadabilityImplementationScopeResult,
    keyof R665ReadabilityImplementationSafetyFlags
  >,
): R665ReadabilityImplementationInvariantCheck {
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
  if (result.uiImplementationAllowedNow !== false) warningCodes.push("ui_implementation_not_allowed_now");
  if (result.futureImplementationMustRemainUiOnly !== true) warningCodes.push("future_implementation_must_remain_ui_only");
  return { passed: warningCodes.length === 0, warningCodes };
}

export function createR665ReadabilityImplementationScopeContract(
  input: R665ReadabilityImplementationScopeInput = {},
): R665ReadabilityImplementationScopeResult {
  const blockedReasons = forbiddenRequestReasons
    .filter(([key]) => input[key])
    .map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas
    .filter(([key]) => !input[key])
    .map(([, label]) => label);

  const scopeStatus: R665ReadabilityImplementationScopeStatus =
    blockedReasons.length > 0
      ? "readability_implementation_scope_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "readability_implementation_scope_ready";

  const result: R665ReadabilityImplementationScopeResult = {
    phase: "R66.5C",
    surface: "readability_implementation_scope_contract",
    scopeStatus,
    allowedFutureChangeTypes,
    forbiddenFutureChangeTypes,
    recommendedFutureTargets,
    classNameOnlyRules,
    overflowContainmentRules,
    badgeWrappingRules,
    advisoryTextRules,
    lineClampRules,
    accessibilityRules,
    governanceRules,
    deterministicInvariants,
    blockedReasons,
    missingReviewAreas,
    safetyFlags,
    nextSuggestedPhase: "R66.5D - Dashboard Readability Cleanup Implementation",
    summary: "R66.5C readability implementation scope contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR665ReadabilityImplementationScope(result),
  };
}

export function summarizeR665ReadabilityImplementationScope(
  result: R665ReadabilityImplementationScopeResult,
) {
  const invariantCheck = assertR665ReadabilityImplementationScopeInvariants(result);
  return (
    `R66.5C ${result.surface} status is ${result.scopeStatus}. ` +
    `${result.allowedFutureChangeTypes.length} future UI-only cleanup types are allowed and ` +
    `${result.forbiddenFutureChangeTypes.length} forbidden change types are blocked. ` +
    `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "This contract cannot authorize immediate UI implementation, redesign, logic changes, routes, providers, persistence, polling, runtime activation, automation, campaigns, execution controls, hidden buttons, governance weakening, or safety-copy removal."
  );
}
