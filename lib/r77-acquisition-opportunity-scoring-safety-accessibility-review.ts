export const r77SafetyReviewFindings = [
  "No lead creation is authorized.",
  "No scraping, map crawling, or external API behavior is authorized.",
  "No skip tracing, owner contact, outreach, or campaign activation is authorized.",
  "No provider activation, provider client, credential read, env read, or fetch/network path is authorized.",
  "No persistence, polling, runtime job, audit writing, automation, or execution is authorized.",
  "Scoring does not imply execution.",
  "Semantic structure and readable advisory labels must remain visible.",
  "Governance warnings, confidence limits, and missing-data warnings must remain visible and text-based.",
] as const;

export const r77SafetyReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  leadCreationAllowed: false,
  scrapingAllowed: false,
  mapCrawlingAllowed: false,
  externalApiAllowed: false,
  skipTracingAllowed: false,
  ownerContactAllowed: false,
  outreachAllowed: false,
  providerActivationAllowed: false,
  providerClientAllowed: false,
  credentialEnvReadAllowed: false,
  fetchNetworkAllowed: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  auditWritingAllowed: false,
  scoringImpliesExecution: false,
  executionAllowed: false,
} as const;

export const r77SafetyAccessibility = {
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

export type R77SafetyStatus = "acquisition_scoring_safety_blocked" | "operator_review_required" | "acquisition_scoring_safety_clear";

export type R77SafetyInput = {
  noLeadCreationReviewed?: boolean;
  noScrapingReviewed?: boolean;
  noMapCrawlingReviewed?: boolean;
  noExternalApiReviewed?: boolean;
  noSkipTracingReviewed?: boolean;
  noOwnerContactReviewed?: boolean;
  noOutreachReviewed?: boolean;
  noProviderReviewed?: boolean;
  noPersistenceReviewed?: boolean;
  noAuditWritingReviewed?: boolean;
  scoringExecutionReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceWarningsReviewed?: boolean;
  leadCreationRequested?: boolean;
  scrapingRequested?: boolean;
  mapCrawlingRequested?: boolean;
  externalApiRequested?: boolean;
  skipTracingRequested?: boolean;
  ownerContactRequested?: boolean;
  outreachRequested?: boolean;
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

export type R77SafetyResult = {
  phase: "R77E";
  status: R77SafetyStatus;
  flags: typeof r77SafetyReviewFlags;
  findings: typeof r77SafetyReviewFindings;
  accessibility: typeof r77SafetyAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R77F - Acquisition Opportunity Scoring Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R77SafetyInput, string]> = [
  ["noLeadCreationReviewed", "no lead creation"],
  ["noScrapingReviewed", "no scraping"],
  ["noMapCrawlingReviewed", "no map crawling"],
  ["noExternalApiReviewed", "no external API behavior"],
  ["noSkipTracingReviewed", "no skip tracing"],
  ["noOwnerContactReviewed", "no owner contact"],
  ["noOutreachReviewed", "no outreach"],
  ["noProviderReviewed", "provider isolation"],
  ["noPersistenceReviewed", "no persistence"],
  ["noAuditWritingReviewed", "no audit writing"],
  ["scoringExecutionReviewed", "scoring does not imply execution"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["governanceWarningsReviewed", "governance warnings"],
];

const blockedReasons: Array<[keyof R77SafetyInput, string]> = [
  ["leadCreationRequested", "lead creation remains blocked"],
  ["scrapingRequested", "scraping remains blocked"],
  ["mapCrawlingRequested", "map crawling remains blocked"],
  ["externalApiRequested", "external API behavior remains blocked"],
  ["skipTracingRequested", "skip tracing remains blocked"],
  ["ownerContactRequested", "owner contact remains blocked"],
  ["outreachRequested", "outreach remains blocked"],
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

export function assertR77SafetyInvariants(result: R77SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R77E must remain read-only advisory simulation");
  if (
    flags.leadCreationAllowed ||
    flags.scrapingAllowed ||
    flags.mapCrawlingAllowed ||
    flags.externalApiAllowed ||
    flags.skipTracingAllowed ||
    flags.ownerContactAllowed ||
    flags.outreachAllowed ||
    flags.providerActivationAllowed ||
    flags.providerClientAllowed ||
    flags.credentialEnvReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.auditWritingAllowed ||
    flags.scoringImpliesExecution ||
    flags.executionAllowed
  ) {
    throw new Error("R77E cannot authorize scoring-to-execution, lead creation, sourcing, owner contact, providers, persistence, audit writing, runtime, polling, or execution");
  }
}

export function createR77AcquisitionOpportunityScoringSafetyAccessibilityReview(input: R77SafetyInput = {}): R77SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R77SafetyStatus =
    activeBlockedReasons.length > 0 ? "acquisition_scoring_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_scoring_safety_clear";
  const result: R77SafetyResult = {
    phase: "R77E",
    status,
    flags: r77SafetyReviewFlags,
    findings: r77SafetyReviewFindings,
    accessibility: r77SafetyAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R77F - Acquisition Opportunity Scoring Final Lockdown Contract",
  };
  assertR77SafetyInvariants(result);
  return result;
}

export function summarizeR77AcquisitionOpportunityScoringSafetyReview(result: R77SafetyResult): string {
  assertR77SafetyInvariants(result);
  return `R77E ${result.status}: safety review preserves no lead creation, no scraping, no external APIs, no skip tracing, no owner contact, no outreach, no providers, no persistence, no polling, no audit writing, scoring-does-not-execute doctrine, semantic accessibility, and visible governance warnings.`;
}
