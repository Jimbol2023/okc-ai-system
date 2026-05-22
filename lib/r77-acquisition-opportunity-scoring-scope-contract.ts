export const r77ScopeFlags = {
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
  scoringGrantsExecution: false,
  leadCreationAllowed: false,
  ownerContactAllowed: false,
  skipTracingAllowed: false,
  scrapingAllowed: false,
  mapCrawlingAllowed: false,
  externalApiAllowed: false,
  outreachAllowed: false,
  providerClientAllowed: false,
  providerEnvReadAllowed: false,
  credentialReadAllowed: false,
  fetchNetworkAllowed: false,
  campaignAllowedNow: false,
  auditRecordsWritten: false,
} as const;

export const r77AllowedConcepts = [
  "acquisition opportunity scoring",
  "advisory-only scoring doctrine",
  "scoring-does-not-create-leads doctrine",
  "scoring-does-not-contact-owners doctrine",
  "manual-review-only doctrine",
  "explainability doctrine",
  "confidence limitation doctrine",
  "missing-data warning doctrine",
  "future UI visibility only",
] as const;

export const r77DangerousWordingPatterns = [
  "score creates lead",
  "high score contacts owner",
  "score triggers skip trace",
  "buyer demand launches campaign",
  "missing data triggers scraping",
  "AI recommendation executes",
  "acquisition score sends",
  "score activates provider",
] as const;

export const r77GovernanceBoundary = {
  governanceStopsOutrank: [
    "acquisition score",
    "distress score",
    "vacancy indicator",
    "property opportunity",
    "buyer demand",
    "neighborhood opportunity",
    "revenue pressure",
    "operator urgency",
    "AI recommendation",
    "readiness",
    "simulation",
    "provider readiness",
  ],
  scoringOnlyMeans: [
    "human review may be useful",
    "future research may be useful",
    "score may be uncertain",
    "confidence may be limited",
    "missing data may exist",
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

export const r77AuditBoundary = {
  auditLayerActive: false,
  auditPersistenceAuthorizedNow: false,
  auditRecordsWrittenNow: false,
  wording: [
    "future acquisition scoring audit requirements",
    "future score explanation trace doctrine",
    "future human-review trace doctrine",
    "future replayability recommendations",
    "no audit records are written in this phase",
  ],
} as const;

export const r77InclusiveAccessibility = {
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

export type R77ScopeStatus = "acquisition_scoring_scope_blocked" | "operator_review_required" | "acquisition_scoring_scope_ready";

export type R77ScopeInput = {
  scoringDoctrineReviewed?: boolean;
  advisoryOnlyReviewed?: boolean;
  manualReviewReviewed?: boolean;
  explainabilityReviewed?: boolean;
  confidenceLimitReviewed?: boolean;
  missingDataWarningReviewed?: boolean;
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
  externalApiRequested?: boolean;
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
  executionRequested?: boolean;
};

export type R77ScopeResult = {
  phase: "R77A";
  status: R77ScopeStatus;
  flags: typeof r77ScopeFlags;
  allowedConcepts: typeof r77AllowedConcepts;
  dangerousWordingPatterns: typeof r77DangerousWordingPatterns;
  governanceBoundary: typeof r77GovernanceBoundary;
  auditBoundary: typeof r77AuditBoundary;
  accessibility: typeof r77InclusiveAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R77B - Acquisition Scoring Drift / Execution Risk Audit";
};

const requiredReviewAreas: Array<[keyof R77ScopeInput, string]> = [
  ["scoringDoctrineReviewed", "acquisition opportunity scoring doctrine"],
  ["advisoryOnlyReviewed", "advisory-only scoring doctrine"],
  ["manualReviewReviewed", "manual-review-only doctrine"],
  ["explainabilityReviewed", "explainability doctrine"],
  ["confidenceLimitReviewed", "confidence limitation doctrine"],
  ["missingDataWarningReviewed", "missing-data warning doctrine"],
  ["noLeadCreationReviewed", "no lead creation"],
  ["noOwnerContactReviewed", "no owner contact"],
  ["noDataSourcingReviewed", "no unsafe data sourcing"],
  ["providerIsolationReviewed", "provider isolation"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["auditBoundaryReviewed", "audit boundary"],
];

const blockedReasons: Array<[keyof R77ScopeInput, string]> = [
  ["leadCreationRequested", "scores cannot create leads"],
  ["ownerContactRequested", "scores cannot contact owners"],
  ["skipTracingRequested", "skip tracing remains blocked"],
  ["scrapingRequested", "scraping remains blocked"],
  ["externalApiRequested", "external API calls remain blocked"],
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
  ["executionRequested", "execution remains blocked"],
];

export function assertR77ScopeInvariants(result: R77ScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R77A must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.scoringGrantsExecution ||
    flags.leadCreationAllowed ||
    flags.ownerContactAllowed ||
    flags.skipTracingAllowed ||
    flags.scrapingAllowed ||
    flags.mapCrawlingAllowed ||
    flags.externalApiAllowed ||
    flags.outreachAllowed ||
    flags.providerClientAllowed ||
    flags.providerEnvReadAllowed ||
    flags.credentialReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.campaignAllowedNow ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R77A cannot authorize lead creation, owner contact, skip tracing, scraping, APIs, providers, outreach, runtime, polling, campaigns, persistence, audit writing, or execution");
  }
}

export function createR77AcquisitionOpportunityScoringScopeContract(input: R77ScopeInput = {}): R77ScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R77ScopeStatus =
    activeBlockedReasons.length > 0 ? "acquisition_scoring_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_scoring_scope_ready";
  const result: R77ScopeResult = {
    phase: "R77A",
    status,
    flags: r77ScopeFlags,
    allowedConcepts: r77AllowedConcepts,
    dangerousWordingPatterns: r77DangerousWordingPatterns,
    governanceBoundary: r77GovernanceBoundary,
    auditBoundary: r77AuditBoundary,
    accessibility: r77InclusiveAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R77B - Acquisition Scoring Drift / Execution Risk Audit",
  };
  assertR77ScopeInvariants(result);
  return result;
}

export function summarizeR77AcquisitionOpportunityScoringScope(result: R77ScopeResult): string {
  assertR77ScopeInvariants(result);
  return `R77A ${result.status}: Acquisition Opportunity Scoring is scoring-only, advisory-only, and manual-review-only; scores may be uncertain and missing data may exist, while lead creation, owner contact, skip tracing, scraping, external APIs, providers, runtime, polling, persistence, audit writing, and execution remain blocked.`;
}
