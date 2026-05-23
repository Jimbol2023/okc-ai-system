export const r83ScopeFlags = {
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
  priorityScoresExecute: false,
  revenueScoresTriggerOutreach: false,
  urgencyTriggersContact: false,
  decayTriggersScraping: false,
  confidenceCreatesLeads: false,
  externalApiAllowed: false,
  fetchNetworkAllowed: false,
  scrapingAllowed: false,
  skipTracingAllowed: false,
  mlsAccessAllowed: false,
  publicRecordCrawlingAllowed: false,
  leadCreationAllowed: false,
  contactAllowed: false,
  auditRecordsWritten: false,
} as const;

export const r83Doctrines = [
  "acquisition priority doctrine",
  "revenue scoring doctrine",
  "operator-priority doctrine",
  "manual-review-only doctrine",
  "score-does-not-execute doctrine",
  "urgency advisory doctrine",
  "decay advisory doctrine",
  "readiness advisory doctrine",
  "no-provider doctrine",
  "no-execution doctrine",
  "no-contact doctrine",
  "no-lead-creation doctrine",
  "no-runtime doctrine",
  "no-persistence doctrine",
  "no-audit-writing doctrine",
  "accessibility requirements",
  "deterministic invariants",
  "fail-closed behavior",
] as const;

export const r83AdvisoryPriorityCategories = [
  "hot",
  "warm",
  "cooling",
  "stale",
  "blocked",
  "review-needed",
  "incomplete",
  "high-opportunity",
  "high-risk",
  "near-close",
  "low-confidence",
] as const;

export const r83ForbiddenCapabilities = [
  "automated acquisitions",
  "autonomous negotiation",
  "automated outreach",
  "provider activation",
  "lead generation",
  "scraping",
  "skip tracing",
  "MLS access",
  "public-record crawling",
  "live execution",
  "runtime jobs",
  "persistence",
  "audit writing",
  "polling",
  "fetch/network",
] as const;

export const r83GovernanceBoundary = {
  governanceStopsOutrank: [
    "priority score",
    "revenue score",
    "urgency label",
    "lead decay label",
    "close probability",
    "near-close label",
    "operator action ranking",
    "AI recommendation",
    "revenue pressure",
  ],
  scoringOnlyMeans: [
    "operator review may be useful",
    "lead attention may be prioritized manually",
    "opportunity may be revenue-relevant",
    "lead may be decaying",
    "data may be incomplete",
    "confidence may be low",
    "governance blocks remain controlling",
    "contact is not authorized",
    "provider activation remains blocked",
    "runtime activation remains blocked",
    "persistence remains blocked",
    "audit writing remains inactive",
    "execution remains blocked",
  ],
} as const;

export const r83AccessibilityRequirements = {
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

export type R83ScopeStatus = "acquisition_priority_revenue_scope_blocked" | "operator_review_required" | "acquisition_priority_revenue_scope_ready";

export type R83ScopeInput = {
  acquisitionPriorityReviewed?: boolean;
  revenueScoringReviewed?: boolean;
  operatorPriorityReviewed?: boolean;
  manualReviewOnlyReviewed?: boolean;
  scoreDoesNotExecuteReviewed?: boolean;
  urgencyAdvisoryReviewed?: boolean;
  decayAdvisoryReviewed?: boolean;
  readinessAdvisoryReviewed?: boolean;
  noProviderReviewed?: boolean;
  noExecutionReviewed?: boolean;
  noContactReviewed?: boolean;
  noLeadCreationReviewed?: boolean;
  noRuntimeReviewed?: boolean;
  noPersistenceReviewed?: boolean;
  noAuditWritingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  deterministicInvariantsReviewed?: boolean;
  failClosedReviewed?: boolean;
  executionRequested?: boolean;
  outreachRequested?: boolean;
  providerRequested?: boolean;
  contactRequested?: boolean;
  leadCreationRequested?: boolean;
  scrapingRequested?: boolean;
  skipTracingRequested?: boolean;
  mlsRequested?: boolean;
  publicRecordCrawlingRequested?: boolean;
  externalApiRequested?: boolean;
  fetchNetworkRequested?: boolean;
  runtimeRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
};

export type R83ScopeResult = {
  phase: "R83A";
  status: R83ScopeStatus;
  flags: typeof r83ScopeFlags;
  doctrines: typeof r83Doctrines;
  advisoryPriorityCategories: typeof r83AdvisoryPriorityCategories;
  forbiddenCapabilities: typeof r83ForbiddenCapabilities;
  governanceBoundary: typeof r83GovernanceBoundary;
  accessibility: typeof r83AccessibilityRequirements;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R83B - Acquisition Priority & Revenue Drift / Risk Audit";
};

const requiredReviewAreas: Array<[keyof R83ScopeInput, string]> = [
  ["acquisitionPriorityReviewed", "acquisition priority doctrine"],
  ["revenueScoringReviewed", "revenue scoring doctrine"],
  ["operatorPriorityReviewed", "operator-priority doctrine"],
  ["manualReviewOnlyReviewed", "manual-review-only doctrine"],
  ["scoreDoesNotExecuteReviewed", "score-does-not-execute doctrine"],
  ["urgencyAdvisoryReviewed", "urgency advisory doctrine"],
  ["decayAdvisoryReviewed", "decay advisory doctrine"],
  ["readinessAdvisoryReviewed", "readiness advisory doctrine"],
  ["noProviderReviewed", "no-provider doctrine"],
  ["noExecutionReviewed", "no-execution doctrine"],
  ["noContactReviewed", "no-contact doctrine"],
  ["noLeadCreationReviewed", "no-lead-creation doctrine"],
  ["noRuntimeReviewed", "no-runtime doctrine"],
  ["noPersistenceReviewed", "no-persistence doctrine"],
  ["noAuditWritingReviewed", "no-audit-writing doctrine"],
  ["accessibilityReviewed", "accessibility requirements"],
  ["deterministicInvariantsReviewed", "deterministic invariants"],
  ["failClosedReviewed", "fail-closed behavior"],
];

const blockedReasons: Array<[keyof R83ScopeInput, string]> = [
  ["executionRequested", "priority and revenue scores cannot execute"],
  ["outreachRequested", "revenue scores cannot trigger outreach"],
  ["providerRequested", "provider activation remains blocked"],
  ["contactRequested", "urgency cannot trigger contact"],
  ["leadCreationRequested", "confidence scores cannot create leads"],
  ["scrapingRequested", "lead decay cannot trigger scraping"],
  ["skipTracingRequested", "blocked leads cannot trigger skip tracing"],
  ["mlsRequested", "MLS access remains blocked"],
  ["publicRecordCrawlingRequested", "public-record crawling remains blocked"],
  ["externalApiRequested", "external APIs remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
];

export function assertR83ScopeInvariants(result: R83ScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R83A must remain read-only advisory simulation");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.priorityScoresExecute ||
    flags.revenueScoresTriggerOutreach ||
    flags.urgencyTriggersContact ||
    flags.decayTriggersScraping ||
    flags.confidenceCreatesLeads ||
    flags.externalApiAllowed ||
    flags.fetchNetworkAllowed ||
    flags.scrapingAllowed ||
    flags.skipTracingAllowed ||
    flags.mlsAccessAllowed ||
    flags.publicRecordCrawlingAllowed ||
    flags.leadCreationAllowed ||
    flags.contactAllowed ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R83A cannot authorize priority/revenue scoring drift into contact, providers, sourcing, persistence, audit writing, runtime, polling, leads, or execution");
  }
}

export function createR83AcquisitionPriorityRevenueScoringScopeContract(input: R83ScopeInput = {}): R83ScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R83ScopeStatus =
    activeBlockedReasons.length > 0 ? "acquisition_priority_revenue_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_priority_revenue_scope_ready";
  const result: R83ScopeResult = {
    phase: "R83A",
    status,
    flags: r83ScopeFlags,
    doctrines: r83Doctrines,
    advisoryPriorityCategories: r83AdvisoryPriorityCategories,
    forbiddenCapabilities: r83ForbiddenCapabilities,
    governanceBoundary: r83GovernanceBoundary,
    accessibility: r83AccessibilityRequirements,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R83B - Acquisition Priority & Revenue Drift / Risk Audit",
  };
  assertR83ScopeInvariants(result);
  return result;
}

export function summarizeR83AcquisitionPriorityRevenueScope(result: R83ScopeResult): string {
  assertR83ScopeInvariants(result);
  return `R83A ${result.status}: Acquisition Priority & Revenue Scoring is advisory-only and manual-review-only; hot, warm, cooling, stale, blocked, review-needed, incomplete, high-opportunity, high-risk, near-close, and low-confidence labels may guide human prioritization while providers, contact, outreach, lead creation, scraping, skip tracing, MLS, public records, fetch/network, runtime, polling, persistence, audit writing, and execution remain blocked.`;
}
