export const r80SafetyReviewFindings = [
  "No scraping is authorized.",
  "No geocoding, map crawling, Street View automation, or external API behavior is authorized.",
  "No lead creation, skip tracing, owner contact, buyer contact, seller contact, outreach, campaigns, or deal blasts are authorized.",
  "No provider activation, provider client, credential read, env read, or fetch/network path is authorized.",
  "No persistence, polling, runtime job, audit writing, automation, or execution is authorized.",
  "Research does not imply execution.",
  "Semantic structure and readable advisory labels must remain visible.",
  "Governance warnings, confidence limits, research uncertainty, and missing-data warnings must remain visible and text-based.",
] as const;

export const r80SafetyReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  scrapingAllowed: false,
  geocodingAllowed: false,
  mapCrawlingAllowed: false,
  streetViewAutomationAllowed: false,
  externalApiAllowed: false,
  fetchNetworkAllowed: false,
  leadCreationAllowed: false,
  skipTracingAllowed: false,
  ownerContactAllowed: false,
  buyerSellerContactAllowed: false,
  outreachAllowed: false,
  campaignAllowed: false,
  dealBlastAllowed: false,
  providerActivationAllowed: false,
  providerClientAllowed: false,
  credentialEnvReadAllowed: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  auditWritingAllowed: false,
  researchImpliesExecution: false,
  executionAllowed: false,
} as const;

export const r80SafetyAccessibility = {
  semanticStructurePreserved: true,
  readableLabelsPreserved: true,
  screenReaderStructurePreserved: true,
  keyboardOnlyUsabilityPreserved: true,
  elderlyLowVisionUsabilityPreserved: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noFocusMovement: true,
  noAutoRefresh: true,
  noPolling: true,
  visibleGovernanceWarnings: true,
} as const;

export type R80SafetyStatus = "acquisition_research_safety_blocked" | "operator_review_required" | "acquisition_research_safety_clear";

export type R80SafetyInput = {
  noScrapingReviewed?: boolean;
  noGeocodingReviewed?: boolean;
  noMapCrawlingReviewed?: boolean;
  noExternalApiReviewed?: boolean;
  noLeadCreationReviewed?: boolean;
  noSkipTracingReviewed?: boolean;
  noOwnerContactReviewed?: boolean;
  noBuyerSellerContactReviewed?: boolean;
  noOutreachReviewed?: boolean;
  noProviderReviewed?: boolean;
  noPersistenceReviewed?: boolean;
  noAuditWritingReviewed?: boolean;
  researchExecutionReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceWarningsReviewed?: boolean;
  scrapingRequested?: boolean;
  geocodingRequested?: boolean;
  mapCrawlingRequested?: boolean;
  streetViewAutomationRequested?: boolean;
  externalApiRequested?: boolean;
  fetchNetworkRequested?: boolean;
  leadCreationRequested?: boolean;
  skipTracingRequested?: boolean;
  ownerContactRequested?: boolean;
  buyerSellerContactRequested?: boolean;
  outreachRequested?: boolean;
  campaignRequested?: boolean;
  dealBlastRequested?: boolean;
  providerRequested?: boolean;
  providerClientRequested?: boolean;
  credentialEnvReadRequested?: boolean;
  persistenceRequested?: boolean;
  pollingRequested?: boolean;
  runtimeRequested?: boolean;
  auditWritingRequested?: boolean;
  executionRequested?: boolean;
};

export type R80SafetyResult = {
  phase: "R80E";
  status: R80SafetyStatus;
  flags: typeof r80SafetyReviewFlags;
  findings: typeof r80SafetyReviewFindings;
  accessibility: typeof r80SafetyAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R80F - Acquisition Research Workbench Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R80SafetyInput, string]> = [
  ["noScrapingReviewed", "no scraping"],
  ["noGeocodingReviewed", "no geocoding"],
  ["noMapCrawlingReviewed", "no map crawling"],
  ["noExternalApiReviewed", "no external API behavior"],
  ["noLeadCreationReviewed", "no lead creation"],
  ["noSkipTracingReviewed", "no skip tracing"],
  ["noOwnerContactReviewed", "no owner contact"],
  ["noBuyerSellerContactReviewed", "no buyer/seller contact"],
  ["noOutreachReviewed", "no outreach"],
  ["noProviderReviewed", "provider isolation"],
  ["noPersistenceReviewed", "no persistence"],
  ["noAuditWritingReviewed", "no audit writing"],
  ["researchExecutionReviewed", "research does not imply execution"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["governanceWarningsReviewed", "governance warnings"],
];

const blockedReasons: Array<[keyof R80SafetyInput, string]> = [
  ["scrapingRequested", "scraping remains blocked"],
  ["geocodingRequested", "geocoding remains blocked"],
  ["mapCrawlingRequested", "map crawling remains blocked"],
  ["streetViewAutomationRequested", "Street View automation remains blocked"],
  ["externalApiRequested", "external API behavior remains blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["leadCreationRequested", "lead creation remains blocked"],
  ["skipTracingRequested", "skip tracing remains blocked"],
  ["ownerContactRequested", "owner contact remains blocked"],
  ["buyerSellerContactRequested", "buyer/seller contact remains blocked"],
  ["outreachRequested", "outreach remains blocked"],
  ["campaignRequested", "campaigns remain blocked"],
  ["dealBlastRequested", "deal blasts remain blocked"],
  ["providerRequested", "provider activation remains blocked"],
  ["providerClientRequested", "provider clients remain blocked"],
  ["credentialEnvReadRequested", "credential/env reads remain blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["executionRequested", "execution remains blocked"],
];

export function assertR80SafetyInvariants(result: R80SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R80E must remain read-only advisory simulation");
  if (
    flags.scrapingAllowed ||
    flags.geocodingAllowed ||
    flags.mapCrawlingAllowed ||
    flags.streetViewAutomationAllowed ||
    flags.externalApiAllowed ||
    flags.fetchNetworkAllowed ||
    flags.leadCreationAllowed ||
    flags.skipTracingAllowed ||
    flags.ownerContactAllowed ||
    flags.buyerSellerContactAllowed ||
    flags.outreachAllowed ||
    flags.campaignAllowed ||
    flags.dealBlastAllowed ||
    flags.providerActivationAllowed ||
    flags.providerClientAllowed ||
    flags.credentialEnvReadAllowed ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.auditWritingAllowed ||
    flags.researchImpliesExecution ||
    flags.executionAllowed
  ) {
    throw new Error("R80E cannot authorize research-to-execution, sourcing, contact, leads, campaigns, providers, persistence, audit writing, runtime, polling, or execution");
  }
}

export function createR80AcquisitionResearchWorkbenchSafetyAccessibilityReview(input: R80SafetyInput = {}): R80SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R80SafetyStatus =
    activeBlockedReasons.length > 0 ? "acquisition_research_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_research_safety_clear";
  const result: R80SafetyResult = {
    phase: "R80E",
    status,
    flags: r80SafetyReviewFlags,
    findings: r80SafetyReviewFindings,
    accessibility: r80SafetyAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R80F - Acquisition Research Workbench Final Lockdown Contract",
  };
  assertR80SafetyInvariants(result);
  return result;
}

export function summarizeR80AcquisitionResearchWorkbenchSafetyReview(result: R80SafetyResult): string {
  assertR80SafetyInvariants(result);
  return `R80E ${result.status}: safety review preserves no scraping, no geocoding, no map crawling, no external APIs, no lead creation, no skip tracing, no contact, no outreach, no providers, no persistence, no polling, no audit writing, research-does-not-execute doctrine, semantic accessibility, and visible governance warnings.`;
}
