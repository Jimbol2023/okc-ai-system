export const r81SafetyReviewFindings = [
  "No live data ingestion is authorized.",
  "No scraping, external API behavior, MLS behavior, or public-record crawling is authorized.",
  "No lead creation, buyer contact, seller contact, owner contact, outreach, campaigns, or deal blasts are authorized.",
  "No provider activation, provider client, credential read, env read, or fetch/network path is authorized.",
  "No persistence, polling, runtime job, audit writing, automation, or execution is authorized.",
  "Timing does not imply execution.",
  "Semantic structure and readable advisory labels must remain visible.",
  "Governance warnings, uncertainty, missing-market-data warnings, and no-live-data warnings must remain visible and text-based.",
] as const;

export const r81SafetyReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  liveDataIngestionAllowed: false,
  scrapingAllowed: false,
  externalApiAllowed: false,
  mlsAccessAllowed: false,
  publicRecordCrawlingAllowed: false,
  fetchNetworkAllowed: false,
  leadCreationAllowed: false,
  buyerSellerOwnerContactAllowed: false,
  outreachAllowed: false,
  campaignAllowed: false,
  providerActivationAllowed: false,
  providerClientAllowed: false,
  credentialEnvReadAllowed: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  auditWritingAllowed: false,
  timingImpliesExecution: false,
  executionAllowed: false,
} as const;

export const r81SafetyAccessibility = {
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

export type R81SafetyStatus = "market_timing_safety_blocked" | "operator_review_required" | "market_timing_safety_clear";

export type R81SafetyInput = {
  noLiveDataReviewed?: boolean;
  noScrapingReviewed?: boolean;
  noExternalApiReviewed?: boolean;
  noMlsReviewed?: boolean;
  noPublicRecordCrawlingReviewed?: boolean;
  noLeadCreationReviewed?: boolean;
  noContactReviewed?: boolean;
  noOutreachReviewed?: boolean;
  noProviderReviewed?: boolean;
  noPersistenceReviewed?: boolean;
  noAuditWritingReviewed?: boolean;
  timingExecutionReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceWarningsReviewed?: boolean;
  liveDataRequested?: boolean;
  scrapingRequested?: boolean;
  externalApiRequested?: boolean;
  mlsRequested?: boolean;
  publicRecordCrawlingRequested?: boolean;
  fetchNetworkRequested?: boolean;
  leadCreationRequested?: boolean;
  contactRequested?: boolean;
  outreachRequested?: boolean;
  campaignRequested?: boolean;
  providerRequested?: boolean;
  providerClientRequested?: boolean;
  credentialEnvReadRequested?: boolean;
  persistenceRequested?: boolean;
  pollingRequested?: boolean;
  runtimeRequested?: boolean;
  auditWritingRequested?: boolean;
  executionRequested?: boolean;
};

export type R81SafetyResult = {
  phase: "R81E";
  status: R81SafetyStatus;
  flags: typeof r81SafetyReviewFlags;
  findings: typeof r81SafetyReviewFindings;
  accessibility: typeof r81SafetyAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R81F - Market Timing Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R81SafetyInput, string]> = [
  ["noLiveDataReviewed", "no live data ingestion"],
  ["noScrapingReviewed", "no scraping"],
  ["noExternalApiReviewed", "no external API behavior"],
  ["noMlsReviewed", "no MLS behavior"],
  ["noPublicRecordCrawlingReviewed", "no public-record crawling"],
  ["noLeadCreationReviewed", "no lead creation"],
  ["noContactReviewed", "no buyer/seller/owner contact"],
  ["noOutreachReviewed", "no outreach"],
  ["noProviderReviewed", "provider isolation"],
  ["noPersistenceReviewed", "no persistence"],
  ["noAuditWritingReviewed", "no audit writing"],
  ["timingExecutionReviewed", "timing does not imply execution"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["governanceWarningsReviewed", "governance warnings"],
];

const blockedReasons: Array<[keyof R81SafetyInput, string]> = [
  ["liveDataRequested", "live data ingestion remains blocked"],
  ["scrapingRequested", "scraping remains blocked"],
  ["externalApiRequested", "external API behavior remains blocked"],
  ["mlsRequested", "MLS access remains blocked"],
  ["publicRecordCrawlingRequested", "public-record crawling remains blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["leadCreationRequested", "lead creation remains blocked"],
  ["contactRequested", "buyer/seller/owner contact remains blocked"],
  ["outreachRequested", "outreach remains blocked"],
  ["campaignRequested", "campaigns remain blocked"],
  ["providerRequested", "provider activation remains blocked"],
  ["providerClientRequested", "provider clients remain blocked"],
  ["credentialEnvReadRequested", "credential/env reads remain blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["executionRequested", "execution remains blocked"],
];

export function assertR81SafetyInvariants(result: R81SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R81E must remain read-only advisory simulation");
  if (Object.entries(flags).some(([key, value]) => key !== "readOnly" && key !== "advisoryOnly" && key !== "simulationOnly" && value === true)) {
    throw new Error("R81E cannot authorize live data, sourcing, MLS, contact, leads, campaigns, providers, persistence, audit writing, runtime, polling, or execution");
  }
}

export function createR81MarketTimingMomentumSafetyAccessibilityReview(input: R81SafetyInput = {}): R81SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R81SafetyStatus =
    activeBlockedReasons.length > 0 ? "market_timing_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "market_timing_safety_clear";
  const result: R81SafetyResult = {
    phase: "R81E",
    status,
    flags: r81SafetyReviewFlags,
    findings: r81SafetyReviewFindings,
    accessibility: r81SafetyAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R81F - Market Timing Final Lockdown Contract",
  };
  assertR81SafetyInvariants(result);
  return result;
}

export function summarizeR81MarketTimingMomentumSafetyReview(result: R81SafetyResult): string {
  assertR81SafetyInvariants(result);
  return `R81E ${result.status}: safety review preserves no live data ingestion, no scraping, no external APIs, no MLS, no public-record crawling, no lead creation, no contact, no outreach, no providers, no persistence, no polling, no audit writing, timing-does-not-execute doctrine, semantic accessibility, and visible governance warnings.`;
}
