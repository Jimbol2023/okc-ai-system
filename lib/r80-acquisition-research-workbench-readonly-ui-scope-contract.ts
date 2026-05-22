export const r80ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/acquisition-research-workbench-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r80ReadonlyUiSafeCopy = [
  "Acquisition Research Workbench is advisory only.",
  "Research may be uncertain and confidence may be limited.",
  "Missing data and governance-blocked research require manual review.",
  "No scraping, geocoding, map crawling, Street View automation, or external APIs are authorized.",
  "No lead creation, owner contact, buyer contact, seller contact, skip tracing, or campaigns are authorized.",
  "No provider activation or fetch/network behavior is authorized.",
] as const;

export const r80ReadonlyUiForbiddenSurfaces = [
  "buttons",
  "forms",
  "inputs",
  "research execution controls",
  "scraping links",
  "geocoding controls",
  "map controls",
  "lead creation controls",
  "owner-contact controls",
  "buyer/seller-contact controls",
  "skip-tracing controls",
  "provider controls",
  "polling",
  "runtime jobs",
  "persistence",
  "fetch/network",
] as const;

export const r80ReadonlyUiAccessibility = {
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
  noTinyUnreadableText: true,
  noCrampedControls: true,
} as const;

export const r80ReadonlyUiFlags = {
  implementationAllowedNow: false,
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  sent: false,
  researchExecutionControlsAllowed: false,
  scrapingAllowed: false,
  geocodingControlsAllowed: false,
  mapCrawlingAllowed: false,
  streetViewAutomationAllowed: false,
  externalApiAllowed: false,
  leadCreationAllowed: false,
  ownerContactControlsAllowed: false,
  buyerSellerContactControlsAllowed: false,
  skipTracingControlsAllowed: false,
  campaignControlsAllowed: false,
  providerControlsAllowed: false,
  formsAllowed: false,
  inputsAllowed: false,
  fetchNetworkAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  persistenceAllowedNow: false,
} as const;

export type R80ReadonlyUiStatus = "acquisition_research_ui_scope_blocked" | "operator_review_required" | "acquisition_research_ui_scope_ready";

export type R80ReadonlyUiInput = {
  authorizedSurfacesReviewed?: boolean;
  safeCopyReviewed?: boolean;
  forbiddenSurfacesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  implementationRequestedNow?: boolean;
  buttonRequested?: boolean;
  formRequested?: boolean;
  inputRequested?: boolean;
  researchExecutionControlRequested?: boolean;
  scrapingLinkRequested?: boolean;
  geocodingControlRequested?: boolean;
  mapControlRequested?: boolean;
  leadCreationControlRequested?: boolean;
  ownerContactControlRequested?: boolean;
  buyerSellerContactControlRequested?: boolean;
  skipTracingControlRequested?: boolean;
  campaignControlRequested?: boolean;
  providerControlRequested?: boolean;
  fetchNetworkRequested?: boolean;
  pollingRequested?: boolean;
  runtimeRequested?: boolean;
  persistenceRequested?: boolean;
};

export type R80ReadonlyUiResult = {
  phase: "R80C";
  status: R80ReadonlyUiStatus;
  flags: typeof r80ReadonlyUiFlags;
  authorizedSurfaces: typeof r80ReadonlyUiAuthorizedSurfaces;
  safeCopy: typeof r80ReadonlyUiSafeCopy;
  forbiddenSurfaces: typeof r80ReadonlyUiForbiddenSurfaces;
  accessibility: typeof r80ReadonlyUiAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R80D - Acquisition Research Workbench Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R80ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["safeCopyReviewed", "safe copy"],
  ["forbiddenSurfacesReviewed", "forbidden surfaces"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R80ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R80C is scope-only; implementation waits for R80D"],
  ["buttonRequested", "buttons remain forbidden"],
  ["formRequested", "forms remain forbidden"],
  ["inputRequested", "inputs remain forbidden"],
  ["researchExecutionControlRequested", "research execution controls remain forbidden"],
  ["scrapingLinkRequested", "scraping links remain forbidden"],
  ["geocodingControlRequested", "geocoding controls remain forbidden"],
  ["mapControlRequested", "map controls remain forbidden"],
  ["leadCreationControlRequested", "lead creation controls remain forbidden"],
  ["ownerContactControlRequested", "owner-contact controls remain forbidden"],
  ["buyerSellerContactControlRequested", "buyer/seller contact controls remain forbidden"],
  ["skipTracingControlRequested", "skip-tracing controls remain forbidden"],
  ["campaignControlRequested", "campaign controls remain forbidden"],
  ["providerControlRequested", "provider controls remain forbidden"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["runtimeRequested", "runtime jobs remain blocked"],
  ["persistenceRequested", "persistence remains blocked"],
];

export function assertR80ReadonlyUiScopeInvariants(result: R80ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly) throw new Error("R80C must authorize read-only advisory UI scope only");
  if (
    flags.implementationAllowedNow ||
    flags.providerCalled ||
    flags.sent ||
    flags.researchExecutionControlsAllowed ||
    flags.scrapingAllowed ||
    flags.geocodingControlsAllowed ||
    flags.mapCrawlingAllowed ||
    flags.streetViewAutomationAllowed ||
    flags.externalApiAllowed ||
    flags.leadCreationAllowed ||
    flags.ownerContactControlsAllowed ||
    flags.buyerSellerContactControlsAllowed ||
    flags.skipTracingControlsAllowed ||
    flags.campaignControlsAllowed ||
    flags.providerControlsAllowed ||
    flags.formsAllowed ||
    flags.inputsAllowed ||
    flags.fetchNetworkAllowed ||
    flags.runtimeActivationAllowed ||
    flags.pollingAllowed ||
    flags.persistenceAllowedNow
  ) {
    throw new Error("R80C cannot authorize research controls, sourcing, contacts, leads, campaigns, providers, persistence, or network behavior");
  }
}

export function createR80AcquisitionResearchWorkbenchReadonlyUiScopeContract(input: R80ReadonlyUiInput = {}): R80ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R80ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "acquisition_research_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_research_ui_scope_ready";
  const result: R80ReadonlyUiResult = {
    phase: "R80C",
    status,
    flags: r80ReadonlyUiFlags,
    authorizedSurfaces: r80ReadonlyUiAuthorizedSurfaces,
    safeCopy: r80ReadonlyUiSafeCopy,
    forbiddenSurfaces: r80ReadonlyUiForbiddenSurfaces,
    accessibility: r80ReadonlyUiAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R80D - Acquisition Research Workbench Read-Only UI Implementation",
  };
  assertR80ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR80AcquisitionResearchWorkbenchReadonlyUiScope(result: R80ReadonlyUiResult): string {
  assertR80ReadonlyUiScopeInvariants(result);
  return `R80C ${result.status}: future Acquisition Research Workbench UI is limited to read-only research advisory, manual-review, research uncertainty, confidence limitation, missing-data, governance-blocked, no-scraping, no-contact, no-lead, no-campaign, and provider-blocked wording.`;
}
