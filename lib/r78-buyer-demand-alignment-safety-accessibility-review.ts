export const r78SafetyReviewFindings = [
  "No buyer contact is authorized.",
  "No seller contact is authorized.",
  "No match creation, deal blasts, or campaigns are authorized.",
  "No scraping or external API behavior is authorized.",
  "No provider activation, provider client, credential read, env read, or fetch/network path is authorized.",
  "No persistence, polling, runtime job, audit writing, automation, or execution is authorized.",
  "Alignment does not imply execution.",
  "Semantic structure and readable advisory labels must remain visible.",
  "Governance warnings, confidence limits, and missing-demand-data warnings must remain visible and text-based.",
] as const;

export const r78SafetyReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  buyerContactAllowed: false,
  sellerContactAllowed: false,
  matchCreationAllowed: false,
  dealBlastAllowed: false,
  campaignAllowed: false,
  scrapingAllowed: false,
  externalApiAllowed: false,
  outreachAllowed: false,
  providerActivationAllowed: false,
  providerClientAllowed: false,
  credentialEnvReadAllowed: false,
  fetchNetworkAllowed: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  auditWritingAllowed: false,
  alignmentImpliesExecution: false,
  executionAllowed: false,
} as const;

export const r78SafetyAccessibility = {
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

export type R78SafetyStatus = "buyer_demand_alignment_safety_blocked" | "operator_review_required" | "buyer_demand_alignment_safety_clear";

export type R78SafetyInput = {
  noBuyerContactReviewed?: boolean;
  noSellerContactReviewed?: boolean;
  noMatchCreationReviewed?: boolean;
  noDealBlastReviewed?: boolean;
  noCampaignReviewed?: boolean;
  noScrapingReviewed?: boolean;
  noExternalApiReviewed?: boolean;
  noProviderReviewed?: boolean;
  noPersistenceReviewed?: boolean;
  noAuditWritingReviewed?: boolean;
  alignmentExecutionReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceWarningsReviewed?: boolean;
  buyerContactRequested?: boolean;
  sellerContactRequested?: boolean;
  matchCreationRequested?: boolean;
  dealBlastRequested?: boolean;
  campaignRequested?: boolean;
  scrapingRequested?: boolean;
  externalApiRequested?: boolean;
  providerRequested?: boolean;
  providerClientRequested?: boolean;
  credentialEnvReadRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  pollingRequested?: boolean;
  runtimeRequested?: boolean;
  auditWritingRequested?: boolean;
  executionRequested?: boolean;
};

export type R78SafetyResult = {
  phase: "R78E";
  status: R78SafetyStatus;
  flags: typeof r78SafetyReviewFlags;
  findings: typeof r78SafetyReviewFindings;
  accessibility: typeof r78SafetyAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R78F - Buyer Demand Alignment Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R78SafetyInput, string]> = [
  ["noBuyerContactReviewed", "no buyer contact"],
  ["noSellerContactReviewed", "no seller contact"],
  ["noMatchCreationReviewed", "no match creation"],
  ["noDealBlastReviewed", "no deal blasts"],
  ["noCampaignReviewed", "no campaigns"],
  ["noScrapingReviewed", "no scraping"],
  ["noExternalApiReviewed", "no external API behavior"],
  ["noProviderReviewed", "provider isolation"],
  ["noPersistenceReviewed", "no persistence"],
  ["noAuditWritingReviewed", "no audit writing"],
  ["alignmentExecutionReviewed", "alignment does not imply execution"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["governanceWarningsReviewed", "governance warnings"],
];

const blockedReasons: Array<[keyof R78SafetyInput, string]> = [
  ["buyerContactRequested", "buyer contact remains blocked"],
  ["sellerContactRequested", "seller contact remains blocked"],
  ["matchCreationRequested", "match creation remains blocked"],
  ["dealBlastRequested", "deal blasts remain blocked"],
  ["campaignRequested", "campaigns remain blocked"],
  ["scrapingRequested", "scraping remains blocked"],
  ["externalApiRequested", "external API behavior remains blocked"],
  ["providerRequested", "provider activation remains blocked"],
  ["providerClientRequested", "provider clients remain blocked"],
  ["credentialEnvReadRequested", "credential/env reads remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["executionRequested", "execution remains blocked"],
];

export function assertR78SafetyInvariants(result: R78SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R78E must remain read-only advisory simulation");
  if (
    flags.buyerContactAllowed ||
    flags.sellerContactAllowed ||
    flags.matchCreationAllowed ||
    flags.dealBlastAllowed ||
    flags.campaignAllowed ||
    flags.scrapingAllowed ||
    flags.externalApiAllowed ||
    flags.outreachAllowed ||
    flags.providerActivationAllowed ||
    flags.providerClientAllowed ||
    flags.credentialEnvReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.auditWritingAllowed ||
    flags.alignmentImpliesExecution ||
    flags.executionAllowed
  ) {
    throw new Error("R78E cannot authorize alignment-to-disposition, contact, matching, campaigns, sourcing, providers, persistence, audit writing, runtime, polling, or execution");
  }
}

export function createR78BuyerDemandAlignmentSafetyAccessibilityReview(input: R78SafetyInput = {}): R78SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R78SafetyStatus =
    activeBlockedReasons.length > 0 ? "buyer_demand_alignment_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "buyer_demand_alignment_safety_clear";
  const result: R78SafetyResult = {
    phase: "R78E",
    status,
    flags: r78SafetyReviewFlags,
    findings: r78SafetyReviewFindings,
    accessibility: r78SafetyAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R78F - Buyer Demand Alignment Final Lockdown Contract",
  };
  assertR78SafetyInvariants(result);
  return result;
}

export function summarizeR78BuyerDemandAlignmentSafetyReview(result: R78SafetyResult): string {
  assertR78SafetyInvariants(result);
  return `R78E ${result.status}: safety review preserves no buyer contact, no seller contact, no match creation, no deal blasts, no campaigns, no scraping, no external APIs, no providers, no persistence, no polling, no audit writing, alignment-does-not-execute doctrine, semantic accessibility, and visible governance warnings.`;
}
