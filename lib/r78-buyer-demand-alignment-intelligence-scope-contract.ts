export const r78ScopeFlags = {
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
  alignmentGrantsExecution: false,
  buyerContactAllowed: false,
  sellerContactAllowed: false,
  matchCreationAllowed: false,
  dealBlastAllowed: false,
  campaignAllowedNow: false,
  leadCreationAllowed: false,
  scrapingAllowed: false,
  externalApiAllowed: false,
  outreachAllowed: false,
  providerClientAllowed: false,
  providerEnvReadAllowed: false,
  credentialReadAllowed: false,
  fetchNetworkAllowed: false,
  auditRecordsWritten: false,
} as const;

export const r78AllowedConcepts = [
  "buyer demand alignment intelligence",
  "advisory-only alignment doctrine",
  "alignment-does-not-create-match doctrine",
  "alignment-does-not-contact-buyers doctrine",
  "alignment-does-not-contact-sellers doctrine",
  "manual-review-only doctrine",
  "explainability doctrine",
  "confidence limitation doctrine",
  "demand-mismatch warning doctrine",
  "missing-demand-data warning doctrine",
] as const;

export const r78DangerousWordingPatterns = [
  "contact matched buyers",
  "blast deal",
  "create buyer match",
  "alignment sends",
  "buyer-ready triggers campaign",
  "demand fit activates provider",
  "missing demand data scrapes",
  "AI contacts buyer",
  "assignment readiness executes",
] as const;

export const r78GovernanceBoundary = {
  governanceStopsOutrank: [
    "buyer demand",
    "demand alignment",
    "demand fit",
    "buyer readiness",
    "assignment readiness",
    "acquisition score",
    "distress score",
    "property opportunity",
    "revenue pressure",
    "operator urgency",
    "AI recommendation",
    "simulation",
    "provider readiness",
  ],
  alignmentOnlyMeans: [
    "human review may be useful",
    "future research may be useful",
    "alignment may be uncertain",
    "confidence may be limited",
    "demand data may be missing",
    "buyer contact is not authorized",
    "seller contact is not authorized",
    "match creation is not authorized",
    "lead creation is not authorized",
    "provider activation remains blocked",
    "runtime activation remains blocked",
    "polling remains blocked",
    "persistence remains blocked",
    "audit writing remains inactive",
    "execution remains blocked",
  ],
} as const;

export const r78AuditBoundary = {
  auditLayerActive: false,
  auditPersistenceAuthorizedNow: false,
  auditRecordsWrittenNow: false,
  wording: [
    "future buyer-demand alignment audit requirements",
    "future demand-fit explanation trace doctrine",
    "future human-review trace doctrine",
    "future replayability recommendations",
    "no audit records are written in this phase",
  ],
} as const;

export const r78InclusiveAccessibility = {
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

export type R78ScopeStatus = "buyer_demand_alignment_scope_blocked" | "operator_review_required" | "buyer_demand_alignment_scope_ready";

export type R78ScopeInput = {
  alignmentDoctrineReviewed?: boolean;
  advisoryOnlyReviewed?: boolean;
  manualReviewReviewed?: boolean;
  explainabilityReviewed?: boolean;
  confidenceLimitReviewed?: boolean;
  demandMismatchReviewed?: boolean;
  missingDemandDataReviewed?: boolean;
  noBuyerContactReviewed?: boolean;
  noSellerContactReviewed?: boolean;
  noMatchCreationReviewed?: boolean;
  noDealBlastReviewed?: boolean;
  noDataSourcingReviewed?: boolean;
  providerIsolationReviewed?: boolean;
  accessibilityReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  buyerContactRequested?: boolean;
  sellerContactRequested?: boolean;
  matchCreationRequested?: boolean;
  dealBlastRequested?: boolean;
  campaignRequested?: boolean;
  leadCreationRequested?: boolean;
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
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  executionRequested?: boolean;
};

export type R78ScopeResult = {
  phase: "R78A";
  status: R78ScopeStatus;
  flags: typeof r78ScopeFlags;
  allowedConcepts: typeof r78AllowedConcepts;
  dangerousWordingPatterns: typeof r78DangerousWordingPatterns;
  governanceBoundary: typeof r78GovernanceBoundary;
  auditBoundary: typeof r78AuditBoundary;
  accessibility: typeof r78InclusiveAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R78B - Buyer Demand Alignment Drift / Disposition Risk Audit";
};

const requiredReviewAreas: Array<[keyof R78ScopeInput, string]> = [
  ["alignmentDoctrineReviewed", "buyer demand alignment doctrine"],
  ["advisoryOnlyReviewed", "advisory-only alignment doctrine"],
  ["manualReviewReviewed", "manual-review-only doctrine"],
  ["explainabilityReviewed", "explainability doctrine"],
  ["confidenceLimitReviewed", "confidence limitation doctrine"],
  ["demandMismatchReviewed", "demand-mismatch warning doctrine"],
  ["missingDemandDataReviewed", "missing-demand-data warning doctrine"],
  ["noBuyerContactReviewed", "no buyer contact"],
  ["noSellerContactReviewed", "no seller contact"],
  ["noMatchCreationReviewed", "no match creation"],
  ["noDealBlastReviewed", "no deal blasts"],
  ["noDataSourcingReviewed", "no unsafe data sourcing"],
  ["providerIsolationReviewed", "provider isolation"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["auditBoundaryReviewed", "audit boundary"],
];

const blockedReasons: Array<[keyof R78ScopeInput, string]> = [
  ["buyerContactRequested", "buyer contact remains blocked"],
  ["sellerContactRequested", "seller contact remains blocked"],
  ["matchCreationRequested", "match creation remains blocked"],
  ["dealBlastRequested", "deal blasts remain blocked"],
  ["campaignRequested", "campaign activation remains blocked"],
  ["leadCreationRequested", "lead creation remains blocked"],
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
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["executionRequested", "execution remains blocked"],
];

export function assertR78ScopeInvariants(result: R78ScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R78A must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.alignmentGrantsExecution ||
    flags.buyerContactAllowed ||
    flags.sellerContactAllowed ||
    flags.matchCreationAllowed ||
    flags.dealBlastAllowed ||
    flags.campaignAllowedNow ||
    flags.leadCreationAllowed ||
    flags.scrapingAllowed ||
    flags.externalApiAllowed ||
    flags.outreachAllowed ||
    flags.providerClientAllowed ||
    flags.providerEnvReadAllowed ||
    flags.credentialReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R78A cannot authorize contact, matching, deal blasts, campaigns, sourcing, providers, persistence, audit writing, or execution");
  }
}

export function createR78BuyerDemandAlignmentIntelligenceScopeContract(input: R78ScopeInput = {}): R78ScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R78ScopeStatus =
    activeBlockedReasons.length > 0 ? "buyer_demand_alignment_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "buyer_demand_alignment_scope_ready";
  const result: R78ScopeResult = {
    phase: "R78A",
    status,
    flags: r78ScopeFlags,
    allowedConcepts: r78AllowedConcepts,
    dangerousWordingPatterns: r78DangerousWordingPatterns,
    governanceBoundary: r78GovernanceBoundary,
    auditBoundary: r78AuditBoundary,
    accessibility: r78InclusiveAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R78B - Buyer Demand Alignment Drift / Disposition Risk Audit",
  };
  assertR78ScopeInvariants(result);
  return result;
}

export function summarizeR78BuyerDemandAlignmentScope(result: R78ScopeResult): string {
  assertR78ScopeInvariants(result);
  return `R78A ${result.status}: Buyer Demand Alignment is alignment-only, advisory-only, and manual-review-only; alignment may be uncertain and demand data may be missing, while buyer contact, seller contact, match creation, deal blasts, campaigns, lead creation, scraping, external APIs, providers, persistence, audit writing, and execution remain blocked.`;
}
