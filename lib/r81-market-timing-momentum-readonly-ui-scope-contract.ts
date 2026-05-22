export const r81ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/market-timing-momentum-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r81ReadonlyUiSafeCopy = [
  "Market Timing & Momentum Intelligence is advisory only.",
  "Momentum signals and opportunity windows may be uncertain.",
  "Missing market data requires manual review.",
  "No live data ingestion, scraping, MLS access, public-record crawling, or external APIs are authorized.",
  "No execution, lead creation, contact, campaigns, provider activation, or fetch/network behavior is authorized.",
] as const;

export const r81ReadonlyUiForbiddenSurfaces = [
  "buttons",
  "forms",
  "inputs",
  "data fetch controls",
  "live market controls",
  "MLS controls",
  "scraping links",
  "provider controls",
  "polling",
  "runtime jobs",
  "persistence",
  "fetch/network",
] as const;

export const r81ReadonlyUiAccessibility = {
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

export const r81ReadonlyUiFlags = {
  implementationAllowedNow: false,
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  sent: false,
  liveMarketControlsAllowed: false,
  dataFetchControlsAllowed: false,
  mlsControlsAllowed: false,
  scrapingAllowed: false,
  externalApiAllowed: false,
  executionControlsAllowed: false,
  providerControlsAllowed: false,
  formsAllowed: false,
  inputsAllowed: false,
  fetchNetworkAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  persistenceAllowedNow: false,
} as const;

export type R81ReadonlyUiStatus = "market_timing_ui_scope_blocked" | "operator_review_required" | "market_timing_ui_scope_ready";

export type R81ReadonlyUiInput = {
  authorizedSurfacesReviewed?: boolean;
  safeCopyReviewed?: boolean;
  forbiddenSurfacesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  implementationRequestedNow?: boolean;
  buttonRequested?: boolean;
  formRequested?: boolean;
  inputRequested?: boolean;
  dataFetchControlRequested?: boolean;
  liveMarketControlRequested?: boolean;
  mlsControlRequested?: boolean;
  scrapingLinkRequested?: boolean;
  providerControlRequested?: boolean;
  executionControlRequested?: boolean;
  fetchNetworkRequested?: boolean;
  pollingRequested?: boolean;
  runtimeRequested?: boolean;
  persistenceRequested?: boolean;
};

export type R81ReadonlyUiResult = {
  phase: "R81C";
  status: R81ReadonlyUiStatus;
  flags: typeof r81ReadonlyUiFlags;
  authorizedSurfaces: typeof r81ReadonlyUiAuthorizedSurfaces;
  safeCopy: typeof r81ReadonlyUiSafeCopy;
  forbiddenSurfaces: typeof r81ReadonlyUiForbiddenSurfaces;
  accessibility: typeof r81ReadonlyUiAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R81D - Market Timing Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R81ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["safeCopyReviewed", "safe copy"],
  ["forbiddenSurfacesReviewed", "forbidden surfaces"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R81ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R81C is scope-only; implementation waits for R81D"],
  ["buttonRequested", "buttons remain forbidden"],
  ["formRequested", "forms remain forbidden"],
  ["inputRequested", "inputs remain forbidden"],
  ["dataFetchControlRequested", "data fetch controls remain forbidden"],
  ["liveMarketControlRequested", "live market controls remain forbidden"],
  ["mlsControlRequested", "MLS controls remain forbidden"],
  ["scrapingLinkRequested", "scraping links remain forbidden"],
  ["providerControlRequested", "provider controls remain forbidden"],
  ["executionControlRequested", "execution controls remain forbidden"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["runtimeRequested", "runtime jobs remain blocked"],
  ["persistenceRequested", "persistence remains blocked"],
];

export function assertR81ReadonlyUiScopeInvariants(result: R81ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly) throw new Error("R81C must authorize read-only advisory UI scope only");
  if (
    flags.implementationAllowedNow ||
    flags.providerCalled ||
    flags.sent ||
    flags.liveMarketControlsAllowed ||
    flags.dataFetchControlsAllowed ||
    flags.mlsControlsAllowed ||
    flags.scrapingAllowed ||
    flags.externalApiAllowed ||
    flags.executionControlsAllowed ||
    flags.providerControlsAllowed ||
    flags.formsAllowed ||
    flags.inputsAllowed ||
    flags.fetchNetworkAllowed ||
    flags.runtimeActivationAllowed ||
    flags.pollingAllowed ||
    flags.persistenceAllowedNow
  ) {
    throw new Error("R81C cannot authorize market data controls, MLS, scraping, providers, execution, persistence, or network behavior");
  }
}

export function createR81MarketTimingMomentumReadonlyUiScopeContract(input: R81ReadonlyUiInput = {}): R81ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R81ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "market_timing_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "market_timing_ui_scope_ready";
  const result: R81ReadonlyUiResult = {
    phase: "R81C",
    status,
    flags: r81ReadonlyUiFlags,
    authorizedSurfaces: r81ReadonlyUiAuthorizedSurfaces,
    safeCopy: r81ReadonlyUiSafeCopy,
    forbiddenSurfaces: r81ReadonlyUiForbiddenSurfaces,
    accessibility: r81ReadonlyUiAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R81D - Market Timing Read-Only UI Implementation",
  };
  assertR81ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR81MarketTimingMomentumReadonlyUiScope(result: R81ReadonlyUiResult): string {
  assertR81ReadonlyUiScopeInvariants(result);
  return `R81C ${result.status}: future Market Timing UI is limited to read-only timing advisory, momentum signal, opportunity-window, uncertainty, missing-data, no-live-data, no-scraping, no-external-API, no-execution, and provider-blocked wording.`;
}
