export const r78ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/buyer-demand-alignment-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r78ReadonlyUiSafeCopy = [
  "Buyer-demand alignment is advisory only.",
  "Demand fit may be uncertain and confidence may be limited.",
  "Demand mismatch and missing demand data require manual review.",
  "No buyer contact or seller contact is authorized.",
  "No match creation, deal blast, or campaign is authorized.",
  "No scraping, external APIs, or fetch/network behavior is authorized.",
  "Provider activation remains blocked.",
] as const;

export const r78ReadonlyUiForbiddenSurfaces = [
  "buttons",
  "forms",
  "inputs",
  "match creation controls",
  "buyer contact controls",
  "seller contact controls",
  "deal blast controls",
  "campaign controls",
  "scraping links",
  "provider controls",
  "polling",
  "runtime jobs",
  "persistence",
  "fetch/network",
] as const;

export const r78ReadonlyUiAccessibility = {
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

export const r78ReadonlyUiFlags = {
  implementationAllowedNow: false,
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  sent: false,
  buyerContactControlsAllowed: false,
  sellerContactControlsAllowed: false,
  matchCreationAllowed: false,
  dealBlastAllowed: false,
  campaignControlsAllowed: false,
  scrapingAllowed: false,
  providerControlsAllowed: false,
  formsAllowed: false,
  inputsAllowed: false,
  fetchNetworkAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  persistenceAllowedNow: false,
} as const;

export type R78ReadonlyUiStatus = "buyer_demand_alignment_ui_scope_blocked" | "operator_review_required" | "buyer_demand_alignment_ui_scope_ready";

export type R78ReadonlyUiInput = {
  authorizedSurfacesReviewed?: boolean;
  safeCopyReviewed?: boolean;
  forbiddenSurfacesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  implementationRequestedNow?: boolean;
  buttonRequested?: boolean;
  formRequested?: boolean;
  inputRequested?: boolean;
  matchCreationControlRequested?: boolean;
  buyerContactControlRequested?: boolean;
  sellerContactControlRequested?: boolean;
  dealBlastControlRequested?: boolean;
  campaignControlRequested?: boolean;
  scrapingLinkRequested?: boolean;
  providerControlRequested?: boolean;
  fetchNetworkRequested?: boolean;
  pollingRequested?: boolean;
  runtimeRequested?: boolean;
  persistenceRequested?: boolean;
};

export type R78ReadonlyUiResult = {
  phase: "R78C";
  status: R78ReadonlyUiStatus;
  flags: typeof r78ReadonlyUiFlags;
  authorizedSurfaces: typeof r78ReadonlyUiAuthorizedSurfaces;
  safeCopy: typeof r78ReadonlyUiSafeCopy;
  forbiddenSurfaces: typeof r78ReadonlyUiForbiddenSurfaces;
  accessibility: typeof r78ReadonlyUiAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R78D - Buyer Demand Alignment Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R78ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["safeCopyReviewed", "safe copy"],
  ["forbiddenSurfacesReviewed", "forbidden surfaces"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R78ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R78C is scope-only; implementation waits for R78D"],
  ["buttonRequested", "buttons remain forbidden"],
  ["formRequested", "forms remain forbidden"],
  ["inputRequested", "inputs remain forbidden"],
  ["matchCreationControlRequested", "match creation controls remain forbidden"],
  ["buyerContactControlRequested", "buyer contact controls remain forbidden"],
  ["sellerContactControlRequested", "seller contact controls remain forbidden"],
  ["dealBlastControlRequested", "deal blast controls remain forbidden"],
  ["campaignControlRequested", "campaign controls remain forbidden"],
  ["scrapingLinkRequested", "scraping links remain forbidden"],
  ["providerControlRequested", "provider controls remain forbidden"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["runtimeRequested", "runtime jobs remain blocked"],
  ["persistenceRequested", "persistence remains blocked"],
];

export function assertR78ReadonlyUiScopeInvariants(result: R78ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly) throw new Error("R78C must authorize read-only advisory UI scope only");
  if (
    flags.implementationAllowedNow ||
    flags.providerCalled ||
    flags.sent ||
    flags.buyerContactControlsAllowed ||
    flags.sellerContactControlsAllowed ||
    flags.matchCreationAllowed ||
    flags.dealBlastAllowed ||
    flags.campaignControlsAllowed ||
    flags.scrapingAllowed ||
    flags.providerControlsAllowed ||
    flags.formsAllowed ||
    flags.inputsAllowed ||
    flags.fetchNetworkAllowed ||
    flags.runtimeActivationAllowed ||
    flags.pollingAllowed ||
    flags.persistenceAllowedNow
  ) {
    throw new Error("R78C cannot authorize contacts, matching, deal blasts, campaigns, controls, sourcing, providers, persistence, or network behavior");
  }
}

export function createR78BuyerDemandAlignmentReadonlyUiScopeContract(input: R78ReadonlyUiInput = {}): R78ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R78ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "buyer_demand_alignment_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "buyer_demand_alignment_ui_scope_ready";
  const result: R78ReadonlyUiResult = {
    phase: "R78C",
    status,
    flags: r78ReadonlyUiFlags,
    authorizedSurfaces: r78ReadonlyUiAuthorizedSurfaces,
    safeCopy: r78ReadonlyUiSafeCopy,
    forbiddenSurfaces: r78ReadonlyUiForbiddenSurfaces,
    accessibility: r78ReadonlyUiAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R78D - Buyer Demand Alignment Read-Only UI Implementation",
  };
  assertR78ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR78BuyerDemandAlignmentReadonlyUiScope(result: R78ReadonlyUiResult): string {
  assertR78ReadonlyUiScopeInvariants(result);
  return `R78C ${result.status}: future Buyer Demand Alignment UI is limited to read-only demand fit, demand mismatch, missing-demand-data, confidence limitation, no-contact, no-match, no-deal-blast, no-campaign, no-scraping, and provider-blocked wording.`;
}
