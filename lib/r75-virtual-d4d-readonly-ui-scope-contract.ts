export const r75ReadonlyUiAuthorizedSurfaces = [
  "components/dashboard/virtual-driving-for-dollars-summary.tsx",
  "app/(dashboard)/dashboard/page.tsx",
] as const;

export const r75ReadonlyUiSafeCopy = [
  "Virtual D4D intelligence is advisory only.",
  "Opportunity patterns require human review.",
  "Distress signals do not authorize contact.",
  "No scraping, map crawling, or Street View automation is authorized.",
  "No owner contact, outreach, skip tracing, or campaign is authorized.",
  "Provider activation remains blocked.",
  "Manual acquisition review may be useful.",
] as const;

export const r75ReadonlyUiForbiddenSurfaces = [
  "buttons",
  "forms",
  "inputs",
  "map automation",
  "external links implying scraping",
  "send controls",
  "contact controls",
  "provider controls",
  "polling",
  "runtime jobs",
  "persistence",
  "fetch/network",
] as const;

export const r75ReadonlyUiAccessibility = {
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

export const r75ReadonlyUiFlags = {
  implementationAllowedNow: false,
  readOnly: true,
  advisoryOnly: true,
  providerCalled: false,
  sent: false,
  scrapingAllowed: false,
  mapAutomationAllowed: false,
  ownerContactControlsAllowed: false,
  outreachControlsAllowed: false,
  providerControlsAllowed: false,
  formsAllowed: false,
  inputsAllowed: false,
  fetchNetworkAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  persistenceAllowedNow: false,
} as const;

export type R75ReadonlyUiStatus = "virtual_d4d_ui_scope_blocked" | "operator_review_required" | "virtual_d4d_ui_scope_ready";

export type R75ReadonlyUiInput = {
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
  sendControlRequested?: boolean;
  contactControlRequested?: boolean;
  providerControlRequested?: boolean;
  fetchNetworkRequested?: boolean;
  pollingRequested?: boolean;
  runtimeRequested?: boolean;
  persistenceRequested?: boolean;
};

export type R75ReadonlyUiResult = {
  phase: "R75C";
  status: R75ReadonlyUiStatus;
  flags: typeof r75ReadonlyUiFlags;
  authorizedSurfaces: typeof r75ReadonlyUiAuthorizedSurfaces;
  safeCopy: typeof r75ReadonlyUiSafeCopy;
  forbiddenSurfaces: typeof r75ReadonlyUiForbiddenSurfaces;
  accessibility: typeof r75ReadonlyUiAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R75D - Virtual D4D Read-Only UI Implementation";
};

const requiredReviewAreas: Array<[keyof R75ReadonlyUiInput, string]> = [
  ["authorizedSurfacesReviewed", "authorized read-only surfaces"],
  ["safeCopyReviewed", "safe copy"],
  ["forbiddenSurfacesReviewed", "forbidden surfaces"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R75ReadonlyUiInput, string]> = [
  ["implementationRequestedNow", "R75C is scope-only; implementation waits for R75D"],
  ["buttonRequested", "buttons remain forbidden"],
  ["formRequested", "forms remain forbidden"],
  ["inputRequested", "inputs remain forbidden"],
  ["mapAutomationRequested", "map automation remains forbidden"],
  ["scrapingLinkRequested", "external links implying scraping remain forbidden"],
  ["sendControlRequested", "send controls remain forbidden"],
  ["contactControlRequested", "contact controls remain forbidden"],
  ["providerControlRequested", "provider controls remain forbidden"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["runtimeRequested", "runtime jobs remain blocked"],
  ["persistenceRequested", "persistence remains blocked"],
];

export function assertR75ReadonlyUiScopeInvariants(result: R75ReadonlyUiResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly) throw new Error("R75C must authorize read-only advisory UI scope only");
  if (
    flags.implementationAllowedNow ||
    flags.providerCalled ||
    flags.sent ||
    flags.scrapingAllowed ||
    flags.mapAutomationAllowed ||
    flags.ownerContactControlsAllowed ||
    flags.outreachControlsAllowed ||
    flags.providerControlsAllowed ||
    flags.formsAllowed ||
    flags.inputsAllowed ||
    flags.fetchNetworkAllowed ||
    flags.runtimeActivationAllowed ||
    flags.pollingAllowed ||
    flags.persistenceAllowedNow
  ) {
    throw new Error("R75C cannot authorize controls, scraping, map automation, owner contact, providers, forms, inputs, fetch/network, runtime, polling, persistence, or sending");
  }
}

export function createR75VirtualD4dReadonlyUiScopeContract(input: R75ReadonlyUiInput = {}): R75ReadonlyUiResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R75ReadonlyUiStatus =
    activeBlockedReasons.length > 0 ? "virtual_d4d_ui_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "virtual_d4d_ui_scope_ready";
  const result: R75ReadonlyUiResult = {
    phase: "R75C",
    status,
    flags: r75ReadonlyUiFlags,
    authorizedSurfaces: r75ReadonlyUiAuthorizedSurfaces,
    safeCopy: r75ReadonlyUiSafeCopy,
    forbiddenSurfaces: r75ReadonlyUiForbiddenSurfaces,
    accessibility: r75ReadonlyUiAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R75D - Virtual D4D Read-Only UI Implementation",
  };
  assertR75ReadonlyUiScopeInvariants(result);
  return result;
}

export function summarizeR75VirtualD4dReadonlyUiScope(result: R75ReadonlyUiResult): string {
  assertR75ReadonlyUiScopeInvariants(result);
  return `R75C ${result.status}: future Virtual D4D UI is limited to read-only opportunity pattern, distress signal, no-scraping, no-owner-contact, no-outreach, provider-blocked, and manual-review wording.`;
}
