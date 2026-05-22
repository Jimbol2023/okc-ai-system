export const r80ScopeFlags = {
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
  researchGrantsExecution: false,
  researchCreatesLeads: false,
  scrapingAllowed: false,
  mapCrawlingAllowed: false,
  geocodingAllowed: false,
  streetViewAutomationAllowed: false,
  externalApiAllowed: false,
  leadCreationAllowed: false,
  ownerContactAllowed: false,
  buyerSellerContactAllowed: false,
  skipTracingAllowed: false,
  providerClientAllowed: false,
  providerEnvReadAllowed: false,
  credentialReadAllowed: false,
  fetchNetworkAllowed: false,
  campaignAllowedNow: false,
  auditRecordsWritten: false,
} as const;

export const r80AllowedConcepts = [
  "acquisition research workbench",
  "advisory-only research doctrine",
  "manual-review-only doctrine",
  "research-does-not-create-leads doctrine",
  "research-does-not-contact-owners doctrine",
  "research-does-not-contact-buyers/sellers doctrine",
  "explainability doctrine",
  "confidence limitation doctrine",
  "missing-data warning doctrine",
  "governance-blocked research doctrine",
  "future UI visibility only",
] as const;

export const r80DangerousWordingPatterns = [
  "start research automation",
  "scrape research source",
  "geocode research area",
  "crawl map for research",
  "create lead from research",
  "contact owner from workbench",
  "contact buyer from research",
  "skip trace research target",
  "research triggers campaign",
  "research launches workflow",
] as const;

export const r80GovernanceBoundary = {
  governanceStopsOutrank: [
    "acquisition research priority",
    "neighborhood cluster score",
    "buyer demand",
    "acquisition score",
    "distress score",
    "revenue pressure",
    "operator urgency",
    "AI recommendation",
    "readiness",
    "simulation",
    "provider readiness",
  ],
  researchOnlyMeans: [
    "human review may be useful",
    "future research may be useful",
    "research may be uncertain",
    "confidence may be limited",
    "data may be missing",
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

export const r80AuditBoundary = {
  auditLayerActive: false,
  auditPersistenceAuthorizedNow: false,
  auditRecordsWrittenNow: false,
  wording: [
    "future acquisition research audit requirements",
    "future research explanation trace doctrine",
    "future human-review trace doctrine",
    "future replayability recommendations",
    "no audit records are written in this phase",
  ],
} as const;

export const r80InclusiveAccessibility = {
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

export type R80ScopeStatus = "acquisition_research_scope_blocked" | "operator_review_required" | "acquisition_research_scope_ready";

export type R80ScopeInput = {
  researchDoctrineReviewed?: boolean;
  advisoryOnlyReviewed?: boolean;
  manualReviewReviewed?: boolean;
  explainabilityReviewed?: boolean;
  confidenceLimitReviewed?: boolean;
  missingDataReviewed?: boolean;
  governanceBlockedResearchReviewed?: boolean;
  noLeadCreationReviewed?: boolean;
  contactBoundaryReviewed?: boolean;
  dataSourcingBoundaryReviewed?: boolean;
  providerIsolationReviewed?: boolean;
  accessibilityReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  scrapingRequested?: boolean;
  mapCrawlingRequested?: boolean;
  geocodingRequested?: boolean;
  streetViewRequested?: boolean;
  externalApiRequested?: boolean;
  leadCreationRequested?: boolean;
  ownerContactRequested?: boolean;
  buyerSellerContactRequested?: boolean;
  skipTracingRequested?: boolean;
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

export type R80ScopeResult = {
  phase: "R80A";
  status: R80ScopeStatus;
  flags: typeof r80ScopeFlags;
  allowedConcepts: typeof r80AllowedConcepts;
  dangerousWordingPatterns: typeof r80DangerousWordingPatterns;
  governanceBoundary: typeof r80GovernanceBoundary;
  auditBoundary: typeof r80AuditBoundary;
  accessibility: typeof r80InclusiveAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R80B - Acquisition Research Drift / Research Automation Risk Audit";
};

const requiredReviewAreas: Array<[keyof R80ScopeInput, string]> = [
  ["researchDoctrineReviewed", "acquisition research doctrine"],
  ["advisoryOnlyReviewed", "advisory-only research doctrine"],
  ["manualReviewReviewed", "manual-review-only doctrine"],
  ["explainabilityReviewed", "explainability doctrine"],
  ["confidenceLimitReviewed", "confidence limitation doctrine"],
  ["missingDataReviewed", "missing-data warning doctrine"],
  ["governanceBlockedResearchReviewed", "governance-blocked research doctrine"],
  ["noLeadCreationReviewed", "research-does-not-create-leads doctrine"],
  ["contactBoundaryReviewed", "contact boundary"],
  ["dataSourcingBoundaryReviewed", "data sourcing boundary"],
  ["providerIsolationReviewed", "provider isolation"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["auditBoundaryReviewed", "audit boundary"],
];

const blockedReasons: Array<[keyof R80ScopeInput, string]> = [
  ["scrapingRequested", "scraping remains blocked"],
  ["mapCrawlingRequested", "map crawling remains blocked"],
  ["geocodingRequested", "geocoding remains blocked"],
  ["streetViewRequested", "Street View automation remains blocked"],
  ["externalApiRequested", "external API calls remain blocked"],
  ["leadCreationRequested", "lead creation remains blocked"],
  ["ownerContactRequested", "owner contact remains blocked"],
  ["buyerSellerContactRequested", "buyer/seller contact remains blocked"],
  ["skipTracingRequested", "skip tracing remains blocked"],
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

export function assertR80ScopeInvariants(result: R80ScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R80A must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.researchGrantsExecution ||
    flags.researchCreatesLeads ||
    flags.scrapingAllowed ||
    flags.mapCrawlingAllowed ||
    flags.geocodingAllowed ||
    flags.streetViewAutomationAllowed ||
    flags.externalApiAllowed ||
    flags.leadCreationAllowed ||
    flags.ownerContactAllowed ||
    flags.buyerSellerContactAllowed ||
    flags.skipTracingAllowed ||
    flags.providerClientAllowed ||
    flags.providerEnvReadAllowed ||
    flags.credentialReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.campaignAllowedNow ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R80A cannot authorize research automation, geodata automation, sourcing, contact, leads, campaigns, providers, persistence, audit writing, or execution");
  }
}

export function createR80AcquisitionResearchWorkbenchScopeContract(input: R80ScopeInput = {}): R80ScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R80ScopeStatus =
    activeBlockedReasons.length > 0 ? "acquisition_research_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_research_scope_ready";
  const result: R80ScopeResult = {
    phase: "R80A",
    status,
    flags: r80ScopeFlags,
    allowedConcepts: r80AllowedConcepts,
    dangerousWordingPatterns: r80DangerousWordingPatterns,
    governanceBoundary: r80GovernanceBoundary,
    auditBoundary: r80AuditBoundary,
    accessibility: r80InclusiveAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R80B - Acquisition Research Drift / Research Automation Risk Audit",
  };
  assertR80ScopeInvariants(result);
  return result;
}

export function summarizeR80AcquisitionResearchWorkbenchScope(result: R80ScopeResult): string {
  assertR80ScopeInvariants(result);
  return `R80A ${result.status}: Acquisition Research Workbench is research-only, advisory-only, and manual-review-only; research may be uncertain and data may be missing, while scraping, geocoding, map crawling, lead creation, contacts, campaigns, providers, persistence, audit writing, and execution remain blocked.`;
}
