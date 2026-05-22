export const r665DashboardOverflowDensityAuditFlags = {
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
} as const;

export const r665DashboardAuditTargetFiles = [
  "components/dashboard/acquisition-daily-call-priority-summary.tsx",
  "components/dashboard/buyer-disposition-operational-intelligence-summary.tsx",
  "components/dashboard/buyer-ready-disposition-priority-summary.tsx",
  "components/dashboard/controlled-execution-readiness-summary.tsx",
  "components/dashboard/driving-for-dollars-intelligence-summary.tsx",
  "components/dashboard/lead-quality-intelligence-summary.tsx",
  "components/dashboard/near-close-revenue-recovery-summary.tsx",
  "components/dashboard/operator-work-queue-intelligence-summary.tsx",
  "components/dashboard/operator-work-queue-summary.tsx",
  "components/dashboard/stuck-deal-recovery-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r665OverflowRiskCategories = [
  "long headings",
  "long labels",
  "long advisory text",
  "long addresses/property names",
  "long badge text",
  "long status descriptions",
  "dense metric rows",
] as const;

export const r665DensityRiskCategories = [
  "too many cards in one grid",
  "too many badges",
  "too many nested panels",
  "narrow card columns",
  "repeated warning panels",
  "visual fatigue",
] as const;

export const r665SafeFutureCleanupActions = [
  "break-words",
  "whitespace-normal",
  "min-w-0",
  "max-w-full",
  "flex-wrap",
  "gap normalization",
  "padding normalization",
  "line-clamp only if safe",
  "smaller secondary metadata",
  "clearer heading hierarchy",
] as const;

export const r665ForbiddenCleanupActions = [
  "redesign",
  "logic changes",
  "data changes",
  "changing governance meaning",
  "hiding governance warnings",
  "removing safety copy",
  "adding execution controls",
  "adding buttons",
  "provider changes",
  "runtime changes",
  "persistence changes",
] as const;

export const r665ForbiddenSemantics = [
  "execute",
  "send",
  "approve-to-send",
  "activate provider",
  "activate Twilio",
  "activate email",
  "activate SMS",
  "call seller",
  "call buyer",
  "launch campaign",
  "automate workflow",
  "auto-route",
  "auto-assign",
  "poll",
  "persist",
  "scrape",
  "enrich",
  "skip trace",
  "runtime activation",
  "background job",
] as const;

export const r665AccessibilityAuditRules = [
  "semantic sections preserved",
  "readable labels preserved",
  "no color-only meaning",
  "no motion dependency",
  "no focus movement",
  "no auto-refresh",
  "no polling",
  "predictable reading order",
] as const;

export const r665DashboardOverflowDensityFindings = [
  "multiple intelligence cards use tight four-column and five-column desktop grids that can compress long labels",
  "buyer-ready and operator work queue sections include seven-column grids that create narrow card columns",
  "safety flag badges include long true/false labels that require wrapping protection",
  "card headers pair long titles with count or status pills, creating squeeze risk without min-width containment",
  "advisory guidance panels repeat across dashboard surfaces and can add visual fatigue",
  "long property, status, and recommendation text requires break-word and max-width containment in future cleanup",
] as const;

export const r665FutureImplementationScopeRecommendations = [
  "limit future implementation to className-only cleanup in existing dashboard intelligence components",
  "normalize badge containers with wrapping and max-width containment",
  "harden repeated card headers with min-w-0 and safe text wrapping",
  "bound advisory copy while preserving safety meaning and screen-reader context",
  "reduce responsive grid stress by normalizing gaps, padding, and column behavior",
  "preserve governance stop visibility and advisory copy while improving scanability",
] as const;

export type R665DashboardAuditStatus =
  | "dashboard_audit_blocked"
  | "operator_review_required"
  | "dashboard_overflow_density_audit_complete";

export type R665DashboardOverflowDensityAuditInput = {
  dashboardComponentsReviewed?: boolean;
  dashboardPageReviewed?: boolean;
  overflowRisksReviewed?: boolean;
  densityRisksReviewed?: boolean;
  accessibilityRisksReviewed?: boolean;
  governanceRisksReviewed?: boolean;
  uiImplementationRequested?: boolean;
  redesignRequested?: boolean;
  logicChangeRequested?: boolean;
  dataChangeRequested?: boolean;
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
  safetyCopyRemovalRequested?: boolean;
  colorOnlyMeaningRequested?: boolean;
  motionDependencyRequested?: boolean;
  focusMovementRequested?: boolean;
  autoRefreshRequested?: boolean;
};

export type R665DashboardOverflowDensityAuditResult = {
  phase: "R66.5B";
  status: R665DashboardAuditStatus;
  flags: typeof r665DashboardOverflowDensityAuditFlags;
  targetFiles: typeof r665DashboardAuditTargetFiles;
  overflowRiskCategories: typeof r665OverflowRiskCategories;
  densityRiskCategories: typeof r665DensityRiskCategories;
  safeFutureCleanupActions: typeof r665SafeFutureCleanupActions;
  forbiddenCleanupActions: typeof r665ForbiddenCleanupActions;
  forbiddenSemantics: typeof r665ForbiddenSemantics;
  accessibilityAuditRules: typeof r665AccessibilityAuditRules;
  dashboardFindings: typeof r665DashboardOverflowDensityFindings;
  futureImplementationScopeRecommendations: typeof r665FutureImplementationScopeRecommendations;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R66.5C - Readability Implementation Scope Contract";
};

const unsafeRequestReasons: Array<
  [keyof R665DashboardOverflowDensityAuditInput, string]
> = [
  ["uiImplementationRequested", "R66.5B is audit-only and cannot implement UI changes"],
  ["redesignRequested", "dashboard redesign is outside the stabilization scope"],
  ["logicChangeRequested", "business and intelligence logic changes are forbidden"],
  ["dataChangeRequested", "data shape or meaning changes are forbidden"],
  ["routeChangeRequested", "route changes are forbidden"],
  ["providerActivationRequested", "provider activation is forbidden"],
  ["prismaChangeRequested", "Prisma, schema, and migration changes are forbidden"],
  ["persistenceRequested", "persistence changes are forbidden"],
  ["pollingRequested", "polling and auto-refresh are forbidden"],
  ["runtimeActivationRequested", "runtime activation is forbidden"],
  ["executionControlRequested", "execution controls are forbidden"],
  ["campaignRequested", "campaign controls are forbidden"],
  ["automationRequested", "automation is forbidden"],
  ["hiddenButtonRequested", "hidden buttons or execution affordances are forbidden"],
  ["governanceMeaningChangeRequested", "governance meaning changes are forbidden"],
  ["safetyCopyRemovalRequested", "safety copy removal is forbidden"],
  ["colorOnlyMeaningRequested", "color-only status meaning is forbidden"],
  ["motionDependencyRequested", "motion-dependent meaning is forbidden"],
  ["focusMovementRequested", "automatic focus movement is forbidden"],
  ["autoRefreshRequested", "auto-refresh is forbidden"],
];

const requiredReviewAreas: Array<
  [keyof R665DashboardOverflowDensityAuditInput, string]
> = [
  ["dashboardComponentsReviewed", "dashboard intelligence components"],
  ["dashboardPageReviewed", "dashboard page placement"],
  ["overflowRisksReviewed", "overflow risk categories"],
  ["densityRisksReviewed", "density risk categories"],
  ["accessibilityRisksReviewed", "accessibility/readability risks"],
  ["governanceRisksReviewed", "governance and forbidden semantic risks"],
];

export function createR665DashboardOverflowDensityAudit(
  input: R665DashboardOverflowDensityAuditInput = {},
): R665DashboardOverflowDensityAuditResult {
  const blockedReasons = unsafeRequestReasons
    .filter(([key]) => input[key])
    .map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas
    .filter(([key]) => !input[key])
    .map(([, label]) => label);

  const status: R665DashboardAuditStatus =
    blockedReasons.length > 0
      ? "dashboard_audit_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "dashboard_overflow_density_audit_complete";

  const result: R665DashboardOverflowDensityAuditResult = {
    phase: "R66.5B",
    status,
    flags: r665DashboardOverflowDensityAuditFlags,
    targetFiles: r665DashboardAuditTargetFiles,
    overflowRiskCategories: r665OverflowRiskCategories,
    densityRiskCategories: r665DensityRiskCategories,
    safeFutureCleanupActions: r665SafeFutureCleanupActions,
    forbiddenCleanupActions: r665ForbiddenCleanupActions,
    forbiddenSemantics: r665ForbiddenSemantics,
    accessibilityAuditRules: r665AccessibilityAuditRules,
    dashboardFindings: r665DashboardOverflowDensityFindings,
    futureImplementationScopeRecommendations:
      r665FutureImplementationScopeRecommendations,
    blockedReasons,
    missingReviewAreas,
    nextPhase: "R66.5C - Readability Implementation Scope Contract",
  };

  assertR665DashboardOverflowDensityAuditInvariants(result);

  return result;
}

export function assertR665DashboardOverflowDensityAuditInvariants(
  audit: R665DashboardOverflowDensityAuditResult,
): void {
  if (audit.phase !== "R66.5B") {
    throw new Error("R66.5B audit contract phase mismatch");
  }

  if (
    !audit.flags.readOnly ||
    !audit.flags.advisoryOnly ||
    !audit.flags.simulationOnly
  ) {
    throw new Error("R66.5B must remain read-only, advisory-only, and simulation-only");
  }

  if (
    audit.flags.providerCalled ||
    audit.flags.sent ||
    audit.flags.persistenceAllowedNow ||
    audit.flags.pollingAllowed ||
    audit.flags.runtimeActivationAllowed ||
    audit.flags.providerActivationAllowed ||
    audit.flags.approvalGrantsExecution ||
    audit.flags.uiImplementationAllowedNow
  ) {
    throw new Error("R66.5B cannot authorize execution, persistence, polling, provider activation, or UI implementation");
  }

  if (!audit.forbiddenSemantics.includes("execute")) {
    throw new Error("R66.5B must explicitly forbid execution semantics");
  }

  if (!audit.forbiddenSemantics.includes("runtime activation")) {
    throw new Error("R66.5B must explicitly forbid runtime activation");
  }

  if (!audit.accessibilityAuditRules.includes("no polling")) {
    throw new Error("R66.5B accessibility audit must forbid polling");
  }
}

export function summarizeR665DashboardOverflowDensityAudit(
  audit: R665DashboardOverflowDensityAuditResult,
): string {
  assertR665DashboardOverflowDensityAuditInvariants(audit);

  if (audit.status === "dashboard_audit_blocked") {
    return `R66.5B blocked: ${audit.blockedReasons.join("; ")}.`;
  }

  if (audit.status === "operator_review_required") {
    return `R66.5B requires review of: ${audit.missingReviewAreas.join(", ")}.`;
  }

  return "R66.5B audit complete: dashboard overflow, density, governance, and accessibility risks are documented for R66.5C scope planning only.";
}
