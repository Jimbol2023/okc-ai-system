export const r81ScopeFlags = {
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
  timingGrantsExecution: false,
  liveDataIngestionAllowed: false,
  externalApiAllowed: false,
  scrapingAllowed: false,
  mlsAccessAllowed: false,
  publicRecordCrawlingAllowed: false,
  leadCreationAllowed: false,
  ownerBuyerSellerContactAllowed: false,
  providerClientAllowed: false,
  providerEnvReadAllowed: false,
  credentialReadAllowed: false,
  fetchNetworkAllowed: false,
  campaignAllowedNow: false,
  auditRecordsWritten: false,
} as const;

export const r81AllowedConcepts = [
  "market timing intelligence",
  "momentum signal advisory doctrine",
  "timing-does-not-execute doctrine",
  "market signal uncertainty doctrine",
  "missing-market-data warning doctrine",
  "manual-review-only doctrine",
  "future UI visibility only",
] as const;

export const r81DangerousWordingPatterns = [
  "execute timing signal",
  "launch campaign from momentum",
  "create lead from opportunity window",
  "scrape missing market data",
  "contact buyer from demand shift",
  "activate provider from urgency",
  "connect MLS",
  "crawl public records",
] as const;

export const r81GovernanceBoundary = {
  governanceStopsOutrank: [
    "market timing signal",
    "momentum score",
    "opportunity window",
    "slowdown signal",
    "demand shift",
    "revenue pressure",
    "operator urgency",
    "AI recommendation",
    "readiness",
    "simulation",
    "provider readiness",
  ],
  timingOnlyMeans: [
    "human review may be useful",
    "market signal may be uncertain",
    "momentum may be limited",
    "data may be missing",
    "live data is not ingested",
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

export const r81AuditBoundary = {
  auditLayerActive: false,
  auditPersistenceAuthorizedNow: false,
  auditRecordsWrittenNow: false,
  wording: [
    "future market timing audit requirements",
    "future market signal explanation trace doctrine",
    "future human-review trace doctrine",
    "future replayability recommendations",
    "no audit records are written in this phase",
  ],
} as const;

export const r81InclusiveAccessibility = {
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
} as const;

export type R81ScopeStatus = "market_timing_scope_blocked" | "operator_review_required" | "market_timing_scope_ready";

export type R81ScopeInput = {
  timingDoctrineReviewed?: boolean;
  momentumAdvisoryReviewed?: boolean;
  timingDoesNotExecuteReviewed?: boolean;
  uncertaintyReviewed?: boolean;
  missingMarketDataReviewed?: boolean;
  manualReviewReviewed?: boolean;
  dataBoundaryReviewed?: boolean;
  contactBoundaryReviewed?: boolean;
  providerIsolationReviewed?: boolean;
  accessibilityReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  liveDataIngestionRequested?: boolean;
  externalApiRequested?: boolean;
  scrapingRequested?: boolean;
  mlsRequested?: boolean;
  publicRecordCrawlingRequested?: boolean;
  leadCreationRequested?: boolean;
  ownerBuyerSellerContactRequested?: boolean;
  providerClientRequested?: boolean;
  envReadRequested?: boolean;
  credentialReadRequested?: boolean;
  fetchNetworkRequested?: boolean;
  sendRequested?: boolean;
  runtimeRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  campaignRequested?: boolean;
  executionRequested?: boolean;
};

export type R81ScopeResult = {
  phase: "R81A";
  status: R81ScopeStatus;
  flags: typeof r81ScopeFlags;
  allowedConcepts: typeof r81AllowedConcepts;
  dangerousWordingPatterns: typeof r81DangerousWordingPatterns;
  governanceBoundary: typeof r81GovernanceBoundary;
  auditBoundary: typeof r81AuditBoundary;
  accessibility: typeof r81InclusiveAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R81B - Market Momentum Drift / Data Risk Audit";
};

const requiredReviewAreas: Array<[keyof R81ScopeInput, string]> = [
  ["timingDoctrineReviewed", "market timing intelligence doctrine"],
  ["momentumAdvisoryReviewed", "momentum signal advisory doctrine"],
  ["timingDoesNotExecuteReviewed", "timing-does-not-execute doctrine"],
  ["uncertaintyReviewed", "market signal uncertainty doctrine"],
  ["missingMarketDataReviewed", "missing-market-data warning doctrine"],
  ["manualReviewReviewed", "manual-review-only doctrine"],
  ["dataBoundaryReviewed", "data sourcing boundary"],
  ["contactBoundaryReviewed", "contact boundary"],
  ["providerIsolationReviewed", "provider isolation"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["auditBoundaryReviewed", "audit boundary"],
];

const blockedReasons: Array<[keyof R81ScopeInput, string]> = [
  ["liveDataIngestionRequested", "live data ingestion remains blocked"],
  ["externalApiRequested", "external API calls remain blocked"],
  ["scrapingRequested", "scraping remains blocked"],
  ["mlsRequested", "MLS access remains blocked"],
  ["publicRecordCrawlingRequested", "public-record crawling remains blocked"],
  ["leadCreationRequested", "lead creation remains blocked"],
  ["ownerBuyerSellerContactRequested", "owner/buyer/seller contact remains blocked"],
  ["providerClientRequested", "provider clients remain blocked"],
  ["envReadRequested", "provider env reads remain blocked"],
  ["credentialReadRequested", "credential reads remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["sendRequested", "sending remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["campaignRequested", "campaigns remain blocked"],
  ["executionRequested", "execution remains blocked"],
];

export function assertR81ScopeInvariants(result: R81ScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R81A must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.timingGrantsExecution ||
    flags.liveDataIngestionAllowed ||
    flags.externalApiAllowed ||
    flags.scrapingAllowed ||
    flags.mlsAccessAllowed ||
    flags.publicRecordCrawlingAllowed ||
    flags.leadCreationAllowed ||
    flags.ownerBuyerSellerContactAllowed ||
    flags.providerClientAllowed ||
    flags.providerEnvReadAllowed ||
    flags.credentialReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.campaignAllowedNow ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R81A cannot authorize market data ingestion, sourcing, MLS, contact, leads, campaigns, providers, persistence, audit writing, or execution");
  }
}

export function createR81MarketTimingMomentumIntelligenceScopeContract(input: R81ScopeInput = {}): R81ScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R81ScopeStatus =
    activeBlockedReasons.length > 0 ? "market_timing_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "market_timing_scope_ready";
  const result: R81ScopeResult = {
    phase: "R81A",
    status,
    flags: r81ScopeFlags,
    allowedConcepts: r81AllowedConcepts,
    dangerousWordingPatterns: r81DangerousWordingPatterns,
    governanceBoundary: r81GovernanceBoundary,
    auditBoundary: r81AuditBoundary,
    accessibility: r81InclusiveAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R81B - Market Momentum Drift / Data Risk Audit",
  };
  assertR81ScopeInvariants(result);
  return result;
}

export function summarizeR81MarketTimingMomentumScope(result: R81ScopeResult): string {
  assertR81ScopeInvariants(result);
  return `R81A ${result.status}: Market Timing & Momentum Intelligence is advisory-only and manual-review-only; timing and momentum signals may be uncertain while live data ingestion, external APIs, scraping, MLS, public-record crawling, contacts, campaigns, providers, persistence, audit writing, and execution remain blocked.`;
}
