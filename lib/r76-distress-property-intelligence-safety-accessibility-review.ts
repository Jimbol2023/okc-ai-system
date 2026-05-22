export const r76SafetyReviewFindings = [
  "No scraping behavior is authorized.",
  "No map crawling or Street View automation is authorized.",
  "No external API behavior is authorized.",
  "No lead creation is authorized.",
  "No skip tracing, owner contact, outreach, or campaign activation is authorized.",
  "No provider activation, provider client, credential read, env read, or fetch/network path is authorized.",
  "No persistence, polling, runtime job, audit writing, automation, or execution is authorized.",
  "Semantic structure and readable advisory labels must remain visible.",
  "Governance warnings and confidence limitations must remain visible and text-based.",
] as const;

export const r76SafetyReviewFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  scrapingAllowed: false,
  mapCrawlingAllowed: false,
  streetViewAutomationAllowed: false,
  externalApiAllowed: false,
  leadCreationAllowed: false,
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
  executionAllowed: false,
} as const;

export const r76SafetyAccessibility = {
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

export type R76SafetyStatus = "distress_safety_blocked" | "operator_review_required" | "distress_safety_clear";

export type R76SafetyInput = {
  noScrapingReviewed?: boolean;
  noMapCrawlingReviewed?: boolean;
  noStreetViewReviewed?: boolean;
  noExternalApiReviewed?: boolean;
  noLeadCreationReviewed?: boolean;
  noSkipTracingReviewed?: boolean;
  noOwnerContactReviewed?: boolean;
  noOutreachReviewed?: boolean;
  noProviderReviewed?: boolean;
  noPersistenceReviewed?: boolean;
  noAuditWritingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceWarningsReviewed?: boolean;
  scrapingRequested?: boolean;
  mapCrawlingRequested?: boolean;
  streetViewAutomationRequested?: boolean;
  externalApiRequested?: boolean;
  leadCreationRequested?: boolean;
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

export type R76SafetyResult = {
  phase: "R76E";
  status: R76SafetyStatus;
  flags: typeof r76SafetyReviewFlags;
  findings: typeof r76SafetyReviewFindings;
  accessibility: typeof r76SafetyAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R76F - Distress Property Intelligence Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R76SafetyInput, string]> = [
  ["noScrapingReviewed", "no scraping"],
  ["noMapCrawlingReviewed", "no map crawling"],
  ["noStreetViewReviewed", "no Street View automation"],
  ["noExternalApiReviewed", "no external API behavior"],
  ["noLeadCreationReviewed", "no lead creation"],
  ["noSkipTracingReviewed", "no skip tracing"],
  ["noOwnerContactReviewed", "no owner contact"],
  ["noOutreachReviewed", "no outreach"],
  ["noProviderReviewed", "provider isolation"],
  ["noPersistenceReviewed", "no persistence"],
  ["noAuditWritingReviewed", "no audit writing"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["governanceWarningsReviewed", "governance warnings"],
];

const blockedReasons: Array<[keyof R76SafetyInput, string]> = [
  ["scrapingRequested", "scraping remains blocked"],
  ["mapCrawlingRequested", "map crawling remains blocked"],
  ["streetViewAutomationRequested", "Street View automation remains blocked"],
  ["externalApiRequested", "external API behavior remains blocked"],
  ["leadCreationRequested", "lead creation remains blocked"],
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

export function assertR76SafetyInvariants(result: R76SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R76E must remain read-only advisory simulation");
  if (
    flags.scrapingAllowed ||
    flags.mapCrawlingAllowed ||
    flags.streetViewAutomationAllowed ||
    flags.externalApiAllowed ||
    flags.leadCreationAllowed ||
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
    flags.executionAllowed
  ) {
    throw new Error("R76E cannot authorize sourcing, lead creation, owner contact, providers, persistence, audit writing, runtime, polling, or execution");
  }
}

export function createR76DistressPropertyIntelligenceSafetyAccessibilityReview(input: R76SafetyInput = {}): R76SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R76SafetyStatus =
    activeBlockedReasons.length > 0 ? "distress_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "distress_safety_clear";
  const result: R76SafetyResult = {
    phase: "R76E",
    status,
    flags: r76SafetyReviewFlags,
    findings: r76SafetyReviewFindings,
    accessibility: r76SafetyAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R76F - Distress Property Intelligence Final Lockdown Contract",
  };
  assertR76SafetyInvariants(result);
  return result;
}

export function summarizeR76DistressPropertyIntelligenceSafetyReview(result: R76SafetyResult): string {
  assertR76SafetyInvariants(result);
  return `R76E ${result.status}: safety review preserves no scraping, no map crawling, no Street View automation, no external APIs, no lead creation, no skip tracing, no owner contact, no outreach, no providers, no persistence, no polling, no audit writing, semantic accessibility, and visible governance warnings.`;
}
