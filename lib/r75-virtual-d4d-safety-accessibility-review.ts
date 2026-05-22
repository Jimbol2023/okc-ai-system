export const r75SafetyReviewFindings = [
  "No scraping behavior is authorized.",
  "No map crawling or Street View automation is authorized.",
  "No external API behavior is authorized.",
  "No owner contact, outreach, skip tracing, or campaign activation is authorized.",
  "No provider activation, provider client, credential read, env read, or fetch/network path is authorized.",
  "No persistence, polling, runtime job, audit writing, automation, or execution is authorized.",
  "Semantic structure and readable advisory labels must remain visible.",
  "Governance warnings must remain visible and text-based.",
] as const;

export const r75SafetyReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  scrapingAllowed: false,
  mapCrawlingAllowed: false,
  externalApiAllowed: false,
  ownerContactAllowed: false,
  outreachAllowed: false,
  skipTracingAllowed: false,
  providerActivationAllowed: false,
  providerClientAllowed: false,
  credentialEnvReadAllowed: false,
  fetchNetworkAllowed: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  auditWritingAllowed: false,
  executionAllowed: false,
} as const;

export const r75SafetyAccessibility = {
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

export type R75SafetyStatus = "virtual_d4d_safety_blocked" | "operator_review_required" | "virtual_d4d_safety_clear";

export type R75SafetyInput = {
  noScrapingReviewed?: boolean;
  noMapCrawlingReviewed?: boolean;
  noExternalApiReviewed?: boolean;
  noOwnerContactReviewed?: boolean;
  noOutreachReviewed?: boolean;
  noProviderReviewed?: boolean;
  noPersistenceReviewed?: boolean;
  noAuditWritingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceWarningsReviewed?: boolean;
  scrapingRequested?: boolean;
  mapCrawlingRequested?: boolean;
  externalApiRequested?: boolean;
  ownerContactRequested?: boolean;
  outreachRequested?: boolean;
  skipTracingRequested?: boolean;
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

export type R75SafetyResult = {
  phase: "R75E";
  status: R75SafetyStatus;
  flags: typeof r75SafetyReviewFlags;
  findings: typeof r75SafetyReviewFindings;
  accessibility: typeof r75SafetyAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R75F - Virtual D4D Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R75SafetyInput, string]> = [
  ["noScrapingReviewed", "no scraping"],
  ["noMapCrawlingReviewed", "no map crawling"],
  ["noExternalApiReviewed", "no external API behavior"],
  ["noOwnerContactReviewed", "no owner contact"],
  ["noOutreachReviewed", "no outreach"],
  ["noProviderReviewed", "provider isolation"],
  ["noPersistenceReviewed", "no persistence"],
  ["noAuditWritingReviewed", "no audit writing"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["governanceWarningsReviewed", "governance warnings"],
];

const blockedReasons: Array<[keyof R75SafetyInput, string]> = [
  ["scrapingRequested", "scraping remains blocked"],
  ["mapCrawlingRequested", "map crawling remains blocked"],
  ["externalApiRequested", "external API behavior remains blocked"],
  ["ownerContactRequested", "owner contact remains blocked"],
  ["outreachRequested", "outreach remains blocked"],
  ["skipTracingRequested", "skip tracing remains blocked"],
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

export function assertR75SafetyInvariants(result: R75SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R75E must remain read-only advisory simulation");
  if (
    flags.scrapingAllowed ||
    flags.mapCrawlingAllowed ||
    flags.externalApiAllowed ||
    flags.ownerContactAllowed ||
    flags.outreachAllowed ||
    flags.skipTracingAllowed ||
    flags.providerActivationAllowed ||
    flags.providerClientAllowed ||
    flags.credentialEnvReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.auditWritingAllowed ||
    flags.executionAllowed
  ) {
    throw new Error("R75E cannot authorize scraping, maps, APIs, owner contact, providers, persistence, audit writing, runtime, polling, or execution");
  }
}

export function createR75VirtualD4dSafetyAccessibilityReview(input: R75SafetyInput = {}): R75SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R75SafetyStatus =
    activeBlockedReasons.length > 0 ? "virtual_d4d_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "virtual_d4d_safety_clear";
  const result: R75SafetyResult = {
    phase: "R75E",
    status,
    flags: r75SafetyReviewFlags,
    findings: r75SafetyReviewFindings,
    accessibility: r75SafetyAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R75F - Virtual D4D Final Lockdown Contract",
  };
  assertR75SafetyInvariants(result);
  return result;
}

export function summarizeR75VirtualD4dSafetyReview(result: R75SafetyResult): string {
  assertR75SafetyInvariants(result);
  return `R75E ${result.status}: safety review preserves no scraping, no map crawling, no external APIs, no owner contact, no outreach, no providers, no persistence, no polling, no audit writing, semantic accessibility, and visible governance warnings.`;
}
