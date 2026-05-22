export const r75ScopeFlags = {
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
  scrapingAllowed: false,
  mapCrawlingAllowed: false,
  streetViewAutomationAllowed: false,
  externalApiAllowed: false,
  ownerContactAllowed: false,
  skipTracingAllowed: false,
  outreachAllowed: false,
  providerClientAllowed: false,
  providerEnvReadAllowed: false,
  credentialReadAllowed: false,
  fetchNetworkAllowed: false,
  campaignAllowedNow: false,
  auditRecordsWritten: false,
} as const;

export const r75AllowedConcepts = [
  "virtual driving for dollars intelligence",
  "acquisition intelligence advisory visibility",
  "property opportunity pattern review",
  "distress signal advisory review",
  "neighborhood opportunity pattern visibility",
  "manual property research review",
  "future UI visibility only",
  "human review before research",
] as const;

export const r75DangerousWordingPatterns = [
  "scrape properties",
  "crawl maps",
  "scan Street View",
  "contact owner",
  "skip trace owner",
  "launch owner campaign",
  "property score triggers outreach",
  "AI contacts owner",
  "lead priority starts campaign",
  "external API lookup",
] as const;

export const r75GovernanceBoundary = {
  governanceStopsOutrank: [
    "property opportunity",
    "distress score",
    "acquisition priority",
    "revenue pressure",
    "buyer demand",
    "operator urgency",
    "AI recommendation",
    "readiness",
    "simulation",
    "provider readiness",
  ],
  virtualD4dOnlyMeans: [
    "human review may be useful",
    "future research may be useful",
    "acquisition intelligence may need further review",
    "contact is not authorized",
    "provider activation remains blocked",
    "runtime activation remains blocked",
    "polling remains blocked",
    "persistence remains blocked",
    "audit writing remains inactive",
    "execution remains blocked",
  ],
} as const;

export const r75AuditBoundary = {
  auditLayerActive: false,
  auditPersistenceAuthorizedNow: false,
  auditRecordsWrittenNow: false,
  wording: [
    "future audit log required",
    "audit layer not active yet",
    "audit persistence not authorized now",
    "no audit records are written in this phase",
    "Virtual D4D audit doctrine only",
  ],
} as const;

export const r75InclusiveAccessibility = {
  semanticHeadings: true,
  clearSectionStructure: true,
  ariaLabelledby: true,
  ariaDescribedby: true,
  readableLabels: true,
  plainLanguageSummaries: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  sufficientSpacing: true,
  noMotionDependency: true,
  noFocusMovement: true,
  noAutoRefresh: true,
  noPolling: true,
  predictableReadingOrder: true,
  visibleGovernanceWarnings: true,
  noTinyUnreadableText: true,
  noCrampedControls: true,
} as const;

export type R75ScopeStatus = "virtual_d4d_scope_blocked" | "operator_review_required" | "virtual_d4d_scope_ready";

export type R75ScopeInput = {
  virtualD4dDoctrineReviewed?: boolean;
  acquisitionIntelligenceReviewed?: boolean;
  opportunityVisibilityReviewed?: boolean;
  distressSignalReviewed?: boolean;
  noScrapingReviewed?: boolean;
  noMapCrawlingReviewed?: boolean;
  noExternalApiReviewed?: boolean;
  providerIsolationReviewed?: boolean;
  accessibilityReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  scrapingRequested?: boolean;
  mapCrawlingRequested?: boolean;
  streetViewAutomationRequested?: boolean;
  externalApiRequested?: boolean;
  ownerContactRequested?: boolean;
  skipTracingRequested?: boolean;
  outreachRequested?: boolean;
  providerRequested?: boolean;
  providerClientRequested?: boolean;
  envReadRequested?: boolean;
  credentialReadRequested?: boolean;
  fetchNetworkRequested?: boolean;
  sendRequested?: boolean;
  runtimeRequested?: boolean;
  pollingRequested?: boolean;
  campaignRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
};

export type R75ScopeResult = {
  phase: "R75A";
  status: R75ScopeStatus;
  flags: typeof r75ScopeFlags;
  allowedConcepts: typeof r75AllowedConcepts;
  dangerousWordingPatterns: typeof r75DangerousWordingPatterns;
  governanceBoundary: typeof r75GovernanceBoundary;
  auditBoundary: typeof r75AuditBoundary;
  accessibility: typeof r75InclusiveAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R75B - Virtual D4D Drift / Data-Sourcing Risk Audit";
};

const requiredReviewAreas: Array<[keyof R75ScopeInput, string]> = [
  ["virtualD4dDoctrineReviewed", "Virtual D4D doctrine"],
  ["acquisitionIntelligenceReviewed", "acquisition intelligence"],
  ["opportunityVisibilityReviewed", "property opportunity visibility"],
  ["distressSignalReviewed", "distress signal advisory review"],
  ["noScrapingReviewed", "no scraping"],
  ["noMapCrawlingReviewed", "no map crawling"],
  ["noExternalApiReviewed", "no external APIs"],
  ["providerIsolationReviewed", "provider isolation"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["auditBoundaryReviewed", "audit boundary"],
];

const blockedReasons: Array<[keyof R75ScopeInput, string]> = [
  ["scrapingRequested", "scraping remains blocked"],
  ["mapCrawlingRequested", "map crawling remains blocked"],
  ["streetViewAutomationRequested", "Street View automation remains blocked"],
  ["externalApiRequested", "external API calls remain blocked"],
  ["ownerContactRequested", "owner contact remains blocked"],
  ["skipTracingRequested", "skip tracing remains blocked"],
  ["outreachRequested", "outreach remains blocked"],
  ["providerRequested", "provider activation remains blocked"],
  ["providerClientRequested", "provider clients remain blocked"],
  ["envReadRequested", "provider env reads remain blocked"],
  ["credentialReadRequested", "credential reads remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["sendRequested", "sending remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["campaignRequested", "campaign activation remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
];

export function assertR75ScopeInvariants(result: R75ScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R75A must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.scrapingAllowed ||
    flags.mapCrawlingAllowed ||
    flags.streetViewAutomationAllowed ||
    flags.externalApiAllowed ||
    flags.ownerContactAllowed ||
    flags.skipTracingAllowed ||
    flags.outreachAllowed ||
    flags.providerClientAllowed ||
    flags.providerEnvReadAllowed ||
    flags.credentialReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.campaignAllowedNow ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R75A cannot authorize scraping, map crawling, APIs, owner contact, providers, outreach, runtime, polling, campaigns, persistence, audit writing, or execution");
  }
}

export function createR75VirtualDrivingForDollarsIntelligenceScopeContract(input: R75ScopeInput = {}): R75ScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R75ScopeStatus =
    activeBlockedReasons.length > 0 ? "virtual_d4d_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "virtual_d4d_scope_ready";
  const result: R75ScopeResult = {
    phase: "R75A",
    status,
    flags: r75ScopeFlags,
    allowedConcepts: r75AllowedConcepts,
    dangerousWordingPatterns: r75DangerousWordingPatterns,
    governanceBoundary: r75GovernanceBoundary,
    auditBoundary: r75AuditBoundary,
    accessibility: r75InclusiveAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R75B - Virtual D4D Drift / Data-Sourcing Risk Audit",
  };
  assertR75ScopeInvariants(result);
  return result;
}

export function summarizeR75VirtualDrivingForDollarsIntelligenceScope(result: R75ScopeResult): string {
  assertR75ScopeInvariants(result);
  return `R75A ${result.status}: Virtual D4D intelligence is advisory-only acquisition visibility; scraping, map crawling, external APIs, owner contact, skip tracing, outreach, providers, runtime, polling, campaigns, persistence, audit writing, and execution remain blocked.`;
}
