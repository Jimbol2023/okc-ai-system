export const r76ScopeFlags = {
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
  leadCreationAllowed: false,
  ownerContactAllowed: false,
  skipTracingAllowed: false,
  scrapingAllowed: false,
  mapCrawlingAllowed: false,
  streetViewAutomationAllowed: false,
  externalApiAllowed: false,
  outreachAllowed: false,
  providerClientAllowed: false,
  providerEnvReadAllowed: false,
  credentialReadAllowed: false,
  fetchNetworkAllowed: false,
  campaignAllowedNow: false,
  auditRecordsWritten: false,
} as const;

export const r76AllowedConcepts = [
  "distress property intelligence",
  "advisory-only distress signal review",
  "unverified signal warning doctrine",
  "confidence limitation doctrine",
  "manual-review-only doctrine",
  "possible exterior neglect category",
  "possible vacancy indicator category",
  "possible deferred maintenance category",
  "manual acquisition review priority",
  "future UI visibility only",
] as const;

export const r76DangerousWordingPatterns = [
  "create lead from distress",
  "distress score contacts owner",
  "vacancy triggers outreach",
  "scrape tax records",
  "crawl code violations",
  "scan Street View",
  "skip trace owner",
  "launch neighborhood campaign",
  "AI contacts owner",
  "distress signal executes workflow",
] as const;

export const r76GovernanceBoundary = {
  governanceStopsOutrank: [
    "distress score",
    "vacancy indicator",
    "tax-risk indicator",
    "code-risk indicator",
    "property opportunity",
    "acquisition priority",
    "revenue pressure",
    "buyer demand",
    "operator urgency",
    "AI recommendation",
    "readiness",
    "simulation",
    "provider readiness",
  ],
  distressSignalsOnlyMean: [
    "human review may be useful",
    "future research may be useful",
    "signal may be unverified",
    "confidence may be limited",
    "contact is not authorized",
    "lead creation is not authorized",
    "provider activation remains blocked",
    "runtime activation remains blocked",
    "polling remains blocked",
    "persistence remains blocked",
    "audit writing remains inactive",
    "execution remains blocked",
  ],
} as const;

export const r76AuditBoundary = {
  auditLayerActive: false,
  auditPersistenceAuthorizedNow: false,
  auditRecordsWrittenNow: false,
  wording: [
    "future distress intelligence audit requirements",
    "future explanation trace doctrine",
    "future human-review trace doctrine",
    "future replayability recommendations",
    "no audit records are written in this phase",
  ],
} as const;

export const r76InclusiveAccessibility = {
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

export type R76ScopeStatus = "distress_scope_blocked" | "operator_review_required" | "distress_scope_ready";

export type R76ScopeInput = {
  distressDoctrineReviewed?: boolean;
  advisoryOnlyReviewed?: boolean;
  manualReviewReviewed?: boolean;
  confidenceLimitReviewed?: boolean;
  unverifiedSignalReviewed?: boolean;
  noLeadCreationReviewed?: boolean;
  noOwnerContactReviewed?: boolean;
  noDataSourcingReviewed?: boolean;
  providerIsolationReviewed?: boolean;
  accessibilityReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  leadCreationRequested?: boolean;
  ownerContactRequested?: boolean;
  skipTracingRequested?: boolean;
  scrapingRequested?: boolean;
  mapCrawlingRequested?: boolean;
  streetViewAutomationRequested?: boolean;
  externalApiRequested?: boolean;
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

export type R76ScopeResult = {
  phase: "R76A";
  status: R76ScopeStatus;
  flags: typeof r76ScopeFlags;
  allowedConcepts: typeof r76AllowedConcepts;
  dangerousWordingPatterns: typeof r76DangerousWordingPatterns;
  governanceBoundary: typeof r76GovernanceBoundary;
  auditBoundary: typeof r76AuditBoundary;
  accessibility: typeof r76InclusiveAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R76B - Distress Property Intelligence Drift / Data Risk Audit";
};

const requiredReviewAreas: Array<[keyof R76ScopeInput, string]> = [
  ["distressDoctrineReviewed", "distress property intelligence doctrine"],
  ["advisoryOnlyReviewed", "advisory-only doctrine"],
  ["manualReviewReviewed", "manual-review-only doctrine"],
  ["confidenceLimitReviewed", "confidence limitation doctrine"],
  ["unverifiedSignalReviewed", "unverified signal warning doctrine"],
  ["noLeadCreationReviewed", "no lead creation"],
  ["noOwnerContactReviewed", "no owner contact"],
  ["noDataSourcingReviewed", "no unsafe data sourcing"],
  ["providerIsolationReviewed", "provider isolation"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["auditBoundaryReviewed", "audit boundary"],
];

const blockedReasons: Array<[keyof R76ScopeInput, string]> = [
  ["leadCreationRequested", "lead creation remains blocked"],
  ["ownerContactRequested", "owner contact remains blocked"],
  ["skipTracingRequested", "skip tracing remains blocked"],
  ["scrapingRequested", "scraping remains blocked"],
  ["mapCrawlingRequested", "map crawling remains blocked"],
  ["streetViewAutomationRequested", "Street View automation remains blocked"],
  ["externalApiRequested", "external API calls remain blocked"],
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

export function assertR76ScopeInvariants(result: R76ScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R76A must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.leadCreationAllowed ||
    flags.ownerContactAllowed ||
    flags.skipTracingAllowed ||
    flags.scrapingAllowed ||
    flags.mapCrawlingAllowed ||
    flags.streetViewAutomationAllowed ||
    flags.externalApiAllowed ||
    flags.outreachAllowed ||
    flags.providerClientAllowed ||
    flags.providerEnvReadAllowed ||
    flags.credentialReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.campaignAllowedNow ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R76A cannot authorize lead creation, owner contact, skip tracing, scraping, maps, APIs, providers, outreach, runtime, polling, campaigns, persistence, audit writing, or execution");
  }
}

export function createR76DistressPropertyIntelligenceScopeContract(input: R76ScopeInput = {}): R76ScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R76ScopeStatus =
    activeBlockedReasons.length > 0 ? "distress_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "distress_scope_ready";
  const result: R76ScopeResult = {
    phase: "R76A",
    status,
    flags: r76ScopeFlags,
    allowedConcepts: r76AllowedConcepts,
    dangerousWordingPatterns: r76DangerousWordingPatterns,
    governanceBoundary: r76GovernanceBoundary,
    auditBoundary: r76AuditBoundary,
    accessibility: r76InclusiveAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R76B - Distress Property Intelligence Drift / Data Risk Audit",
  };
  assertR76ScopeInvariants(result);
  return result;
}

export function summarizeR76DistressPropertyIntelligenceScope(result: R76ScopeResult): string {
  assertR76ScopeInvariants(result);
  return `R76A ${result.status}: Distress Property Intelligence is advisory-only and manual-review-only; distress signals are unverified with limited confidence, while lead creation, owner contact, skip tracing, scraping, map crawling, Street View automation, external APIs, providers, runtime, polling, persistence, audit writing, and execution remain blocked.`;
}
