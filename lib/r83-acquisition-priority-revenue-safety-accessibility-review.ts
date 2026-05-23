export const r83SafetyFindings = [
  "Priority and revenue scoring does not imply execution.",
  "Urgency does not imply outreach or contact.",
  "Lead decay does not imply scraping.",
  "Blocked leads do not imply skip tracing.",
  "Provider activation remains blocked.",
  "Persistence, polling, runtime activation, and audit writing remain blocked.",
  "Semantic accessibility, readable labels, no color-only meaning, no motion dependency, and visible governance warnings are required.",
] as const;

export const r83SafetyFlags = {
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
  scoringImpliesExecution: false,
  urgencyImpliesOutreach: false,
  decayImpliesScraping: false,
  blockedLeadImpliesSkipTracing: false,
  externalApiAllowed: false,
  fetchNetworkAllowed: false,
  auditWritingAllowed: false,
} as const;

export const r83SafetyAccessibility = {
  semanticStructurePreserved: true,
  readableLabelsPreserved: true,
  noColorOnlyMeaning: true,
  noMotionDependency: true,
  noFocusMovement: true,
  noAutoRefresh: true,
  visibleGovernanceWarnings: true,
} as const;

export type R83SafetyStatus = "acquisition_priority_revenue_safety_blocked" | "operator_review_required" | "acquisition_priority_revenue_safety_clear";

export type R83SafetyInput = {
  scoringExecutionReviewed?: boolean;
  urgencyOutreachReviewed?: boolean;
  decayScrapingReviewed?: boolean;
  blockedSkipTracingReviewed?: boolean;
  providerReviewed?: boolean;
  persistenceReviewed?: boolean;
  pollingRuntimeReviewed?: boolean;
  auditWritingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  governanceWarningsReviewed?: boolean;
  executionRequested?: boolean;
  outreachRequested?: boolean;
  scrapingRequested?: boolean;
  skipTracingRequested?: boolean;
  providerRequested?: boolean;
  persistenceRequested?: boolean;
  pollingRequested?: boolean;
  runtimeRequested?: boolean;
  auditWritingRequested?: boolean;
  fetchNetworkRequested?: boolean;
};

export type R83SafetyResult = {
  phase: "R83E";
  status: R83SafetyStatus;
  flags: typeof r83SafetyFlags;
  findings: typeof r83SafetyFindings;
  accessibility: typeof r83SafetyAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R83F - Acquisition Priority & Revenue Final Lockdown Contract";
};

const requiredReviewAreas: Array<[keyof R83SafetyInput, string]> = [
  ["scoringExecutionReviewed", "priority/revenue scoring does not imply execution"],
  ["urgencyOutreachReviewed", "urgency does not imply outreach"],
  ["decayScrapingReviewed", "decay does not imply scraping"],
  ["blockedSkipTracingReviewed", "blocked leads do not imply skip tracing"],
  ["providerReviewed", "provider isolation"],
  ["persistenceReviewed", "persistence boundary"],
  ["pollingRuntimeReviewed", "polling/runtime boundary"],
  ["auditWritingReviewed", "audit writing boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["governanceWarningsReviewed", "visible governance warnings"],
];

const blockedReasons: Array<[keyof R83SafetyInput, string]> = [
  ["executionRequested", "priority/revenue scoring cannot execute"],
  ["outreachRequested", "urgency cannot trigger outreach"],
  ["scrapingRequested", "lead decay cannot trigger scraping"],
  ["skipTracingRequested", "blocked leads cannot trigger skip tracing"],
  ["providerRequested", "provider activation remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["runtimeRequested", "runtime remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
];

export function assertR83SafetyInvariants(result: R83SafetyResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R83E must remain read-only advisory simulation");
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly"].includes(key) && value === true)) {
    throw new Error("R83E cannot authorize scoring drift into execution, outreach, scraping, skip tracing, providers, persistence, polling, runtime, audit writing, or network behavior");
  }
}

export function createR83AcquisitionPriorityRevenueSafetyAccessibilityReview(input: R83SafetyInput = {}): R83SafetyResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R83SafetyStatus =
    activeBlockedReasons.length > 0 ? "acquisition_priority_revenue_safety_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_priority_revenue_safety_clear";
  const result: R83SafetyResult = {
    phase: "R83E",
    status,
    flags: r83SafetyFlags,
    findings: r83SafetyFindings,
    accessibility: r83SafetyAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R83F - Acquisition Priority & Revenue Final Lockdown Contract",
  };
  assertR83SafetyInvariants(result);
  return result;
}

export function summarizeR83AcquisitionPriorityRevenueSafetyReview(result: R83SafetyResult): string {
  assertR83SafetyInvariants(result);
  return `R83E ${result.status}: safety review preserves priority/revenue scoring-does-not-execute, urgency-does-not-outreach, decay-does-not-scrape, blocked-leads-do-not-skip-trace, provider isolation, no persistence, no polling/runtime, no audit writing, accessibility, and visible governance warnings.`;
}
