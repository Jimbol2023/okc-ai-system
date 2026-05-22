export const r76ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/distress-property-intelligence-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r76ReadonlyUiSafeCopy = [
  "Distress signals are advisory only.",
  "Signals may be unverified and confidence may be limited.",
  "Manual review is required before any future research.",
  "No lead creation is authorized.",
  "No owner contact, skip tracing, or outreach is authorized.",
  "No scraping, map crawling, Street View automation, or external APIs are authorized.",
  "Provider activation remains blocked.",
] as const;

export const r76ReadonlyUiForbiddenSurfaces = [
  "buttons",
  "forms",
  "inputs",
  "map automation",
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

export const r76ReadonlyUiAccessibility = {
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

export const r76ReadonlyUiFlags = {
  implementationAllowedNow: false,
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  sent: false,
  leadCreationAllowed: false,
  ownerContactControlsAllowed: false,
  skipTracingControlsAllowed: false,
  scrapingAllowed: false,
  mapAutomationAllowed: false,
  providerControlsAllowed: false,
  formsAllowed: false,
  inputsAllowed: false,
  fetchNetworkAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  persistenceAllowedNow: false,
} as const;

export type R76ReadonlyUiStatus = "distress_ui_scope_blocked" | "operator_review_required" | "distress_ui_scope_ready";

export type R76ReadonlyUiInput = {
  authorizedSurfacesReviewed?: boolean;
  safeCopyReviewed?: boolean;
  forbiddenSurfacesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  implementationRequestedNow?: boolean;
  buttonRequested?: boolean;
  formRequested?: boolean;
  inputRequested?: boolean;
  mapAutomationRequested?: boolean;
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

export type R76ReadonlyUiResult = {
  phase: "R76C";
  status: R76ReadonlyUiStatus;
  flags: typeof r76ReadonlyUiFlags;
  authorizedSurfaces: typeof r76ReadonlyUiAuthorizedSurfaces;
  safeCopy: typeof r76ReadonlyUiSafeCopy;
  forbiddenSurfaces: typeof r76ReadonlyUiForbiddenSurfaces;
  accessibility: typeof r76ReadonlyUiAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R76D - Distress Property Intelligence Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R76ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["safeCopyReviewed", "safe copy"],
  ["forbiddenSurfacesReviewed", "forbidden surfaces"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R76ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R76C is scope-only; implementation waits for R76D"],
  ["buttonRequested", "buttons remain forbidden"],
  ["formRequested", "forms remain forbidden"],
  ["inputRequested", "inputs remain forbidden"],
  ["mapAutomationRequested", "map automation remains forbidden"],
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

export function assertR76ReadonlyUiScopeInvariants(result: R76ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly) throw new Error("R76C must authorize read-only advisory UI scope only");
  if (
    flags.implementationAllowedNow ||
    flags.providerCalled ||
    flags.sent ||
    flags.leadCreationAllowed ||
    flags.ownerContactControlsAllowed ||
    flags.skipTracingControlsAllowed ||
    flags.scrapingAllowed ||
    flags.mapAutomationAllowed ||
    flags.providerControlsAllowed ||
    flags.formsAllowed ||
    flags.inputsAllowed ||
    flags.fetchNetworkAllowed ||
    flags.runtimeActivationAllowed ||
    flags.pollingAllowed ||
    flags.persistenceAllowedNow
  ) {
    throw new Error("R76C cannot authorize controls, lead creation, owner contact, skip tracing, scraping, maps, providers, forms, inputs, fetch/network, runtime, polling, persistence, or sending");
  }
}

export function createR76DistressPropertyIntelligenceReadonlyUiScopeContract(input: R76ReadonlyUiInput = {}): R76ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R76ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "distress_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "distress_ui_scope_ready";
  const result: R76ReadonlyUiResult = {
    phase: "R76C",
    status,
    flags: r76ReadonlyUiFlags,
    authorizedSurfaces: r76ReadonlyUiAuthorizedSurfaces,
    safeCopy: r76ReadonlyUiSafeCopy,
    forbiddenSurfaces: r76ReadonlyUiForbiddenSurfaces,
    accessibility: r76ReadonlyUiAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R76D - Distress Property Intelligence Read-Only UI Implementation",
  };
  assertR76ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR76DistressPropertyIntelligenceReadonlyUiScope(result: R76ReadonlyUiResult): string {
  assertR76ReadonlyUiScopeInvariants(result);
  return `R76C ${result.status}: future Distress Property Intelligence UI is limited to read-only distress signal, unverified signal, manual-review, no-owner-contact, no-scraping, no-lead-creation, no-skip-tracing, confidence limitation, and provider-blocked wording.`;
}
