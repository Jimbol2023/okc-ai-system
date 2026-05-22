export const r77ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/acquisition-opportunity-scoring-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r77ReadonlyUiSafeCopy = [
  "Acquisition scores are advisory only.",
  "Scores may be uncertain and confidence may be limited.",
  "Missing data may affect scoring.",
  "Manual review is required before any future research.",
  "No lead creation is authorized.",
  "No owner contact, skip tracing, or outreach is authorized.",
  "No scraping, external APIs, or fetch/network behavior is authorized.",
  "Provider activation remains blocked.",
] as const;

export const r77ReadonlyUiForbiddenSurfaces = [
  "buttons",
  "forms",
  "inputs",
  "lead creation controls",
  "scraping links",
  "skip-tracing links",
  "owner-contact controls",
  "send controls",
  "provider controls",
  "polling",
  "runtime jobs",
  "persistence",
  "fetch/network",
] as const;

export const r77ReadonlyUiAccessibility = {
  semanticHeadings: true,
  clearSectionStructure: true,
  ariaLabelledby: true,
  ariaDescribedby: true,
  readableLabels: true,
  plainLanguageSummaries: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noFocusMovement: true,
  noAutoRefresh: true,
  noPolling: true,
  predictableReadingOrder: true,
  visibleGovernanceWarnings: true,
} as const;

export const r77ReadonlyUiFlags = {
  implementationAllowedNow: false,
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  sent: false,
  leadCreationAllowed: false,
  ownerContactControlsAllowed: false,
  skipTracingControlsAllowed: false,
  scrapingAllowed: false,
  providerControlsAllowed: false,
  formsAllowed: false,
  inputsAllowed: false,
  fetchNetworkAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  persistenceAllowedNow: false,
} as const;

export type R77ReadonlyUiStatus = "acquisition_scoring_ui_scope_blocked" | "operator_review_required" | "acquisition_scoring_ui_scope_ready";

export type R77ReadonlyUiInput = {
  authorizedSurfacesReviewed?: boolean;
  safeCopyReviewed?: boolean;
  forbiddenSurfacesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  implementationRequestedNow?: boolean;
  buttonRequested?: boolean;
  formRequested?: boolean;
  inputRequested?: boolean;
  leadCreationControlRequested?: boolean;
  scrapingLinkRequested?: boolean;
  skipTracingLinkRequested?: boolean;
  ownerContactControlRequested?: boolean;
  sendControlRequested?: boolean;
  providerControlRequested?: boolean;
  fetchNetworkRequested?: boolean;
  pollingRequested?: boolean;
  runtimeRequested?: boolean;
  persistenceRequested?: boolean;
};

export type R77ReadonlyUiResult = {
  phase: "R77C";
  status: R77ReadonlyUiStatus;
  flags: typeof r77ReadonlyUiFlags;
  authorizedSurfaces: typeof r77ReadonlyUiAuthorizedSurfaces;
  safeCopy: typeof r77ReadonlyUiSafeCopy;
  forbiddenSurfaces: typeof r77ReadonlyUiForbiddenSurfaces;
  accessibility: typeof r77ReadonlyUiAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R77D - Acquisition Opportunity Scoring Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R77ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["safeCopyReviewed", "safe copy"],
  ["forbiddenSurfacesReviewed", "forbidden surfaces"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R77ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R77C is scope-only; implementation waits for R77D"],
  ["buttonRequested", "buttons remain forbidden"],
  ["formRequested", "forms remain forbidden"],
  ["inputRequested", "inputs remain forbidden"],
  ["leadCreationControlRequested", "lead creation controls remain forbidden"],
  ["scrapingLinkRequested", "scraping links remain forbidden"],
  ["skipTracingLinkRequested", "skip-tracing links remain forbidden"],
  ["ownerContactControlRequested", "owner-contact controls remain forbidden"],
  ["sendControlRequested", "send controls remain forbidden"],
  ["providerControlRequested", "provider controls remain forbidden"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["runtimeRequested", "runtime jobs remain blocked"],
  ["persistenceRequested", "persistence remains blocked"],
];

export function assertR77ReadonlyUiScopeInvariants(result: R77ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly) throw new Error("R77C must authorize read-only advisory UI scope only");
  if (
    flags.implementationAllowedNow ||
    flags.providerCalled ||
    flags.sent ||
    flags.leadCreationAllowed ||
    flags.ownerContactControlsAllowed ||
    flags.skipTracingControlsAllowed ||
    flags.scrapingAllowed ||
    flags.providerControlsAllowed ||
    flags.formsAllowed ||
    flags.inputsAllowed ||
    flags.fetchNetworkAllowed ||
    flags.runtimeActivationAllowed ||
    flags.pollingAllowed ||
    flags.persistenceAllowedNow
  ) {
    throw new Error("R77C cannot authorize controls, lead creation, owner contact, skip tracing, scraping, providers, forms, inputs, fetch/network, runtime, polling, persistence, or sending");
  }
}

export function createR77AcquisitionOpportunityScoringReadonlyUiScopeContract(input: R77ReadonlyUiInput = {}): R77ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R77ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "acquisition_scoring_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_scoring_ui_scope_ready";
  const result: R77ReadonlyUiResult = {
    phase: "R77C",
    status,
    flags: r77ReadonlyUiFlags,
    authorizedSurfaces: r77ReadonlyUiAuthorizedSurfaces,
    safeCopy: r77ReadonlyUiSafeCopy,
    forbiddenSurfaces: r77ReadonlyUiForbiddenSurfaces,
    accessibility: r77ReadonlyUiAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R77D - Acquisition Opportunity Scoring Read-Only UI Implementation",
  };
  assertR77ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR77AcquisitionOpportunityScoringReadonlyUiScope(result: R77ReadonlyUiResult): string {
  assertR77ReadonlyUiScopeInvariants(result);
  return `R77C ${result.status}: future Acquisition Opportunity Scoring UI is limited to read-only score categories, manual-review wording, confidence limitations, missing-data warnings, no-lead-creation, no-owner-contact, no-scraping, no-skip-tracing, and provider-blocked wording.`;
}
