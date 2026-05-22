export const r75DriftRiskCategories = [
  "intelligence-to-scraping drift",
  "distress-signal-to-contact drift",
  "property-score-to-outreach drift",
  "map-readiness-to-map-crawling drift",
  "lead-priority-to-campaign drift",
  "AI-recommendation-to-owner-contact drift",
  "external-data/API drift",
  "provider drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r75DriftFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  scrapingAllowed: false,
  mapCrawlingAllowed: false,
  streetViewAutomationAllowed: false,
  externalApiAllowed: false,
  ownerContactAllowed: false,
  skipTracingAllowed: false,
  outreachAllowed: false,
  providerCalled: false,
  providerActivationAllowed: false,
  fetchNetworkAllowed: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  campaignAllowed: false,
  auditWritingAllowed: false,
  executionAllowed: false,
} as const;

export type R75DriftStatus = "virtual_d4d_drift_blocked" | "operator_review_required" | "virtual_d4d_drift_audit_clear";

export type R75DriftInput = {
  intelligenceScrapingReviewed?: boolean;
  distressContactReviewed?: boolean;
  propertyScoreOutreachReviewed?: boolean;
  mapReadinessReviewed?: boolean;
  leadPriorityCampaignReviewed?: boolean;
  aiOwnerContactReviewed?: boolean;
  externalDataReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  persistenceBoundaryReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  intelligenceScrapingRequested?: boolean;
  distressContactRequested?: boolean;
  propertyScoreOutreachRequested?: boolean;
  mapReadinessCrawlingRequested?: boolean;
  leadPriorityCampaignRequested?: boolean;
  aiOwnerContactRequested?: boolean;
  externalDataApiRequested?: boolean;
  providerRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R75DriftResult = {
  phase: "R75B";
  status: R75DriftStatus;
  flags: typeof r75DriftFlags;
  riskCategories: typeof r75DriftRiskCategories;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R75C - Virtual D4D Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R75DriftInput, string]> = [
  ["intelligenceScrapingReviewed", "intelligence-to-scraping"],
  ["distressContactReviewed", "distress-signal-to-contact"],
  ["propertyScoreOutreachReviewed", "property-score-to-outreach"],
  ["mapReadinessReviewed", "map-readiness-to-map-crawling"],
  ["leadPriorityCampaignReviewed", "lead-priority-to-campaign"],
  ["aiOwnerContactReviewed", "AI-recommendation-to-owner-contact"],
  ["externalDataReviewed", "external-data/API boundary"],
  ["providerBoundaryReviewed", "provider boundary"],
  ["persistenceBoundaryReviewed", "persistence boundary"],
  ["auditBoundaryReviewed", "audit boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R75DriftInput, string]> = [
  ["intelligenceScrapingRequested", "intelligence cannot become scraping"],
  ["distressContactRequested", "distress signals cannot contact owners"],
  ["propertyScoreOutreachRequested", "property scores cannot trigger outreach"],
  ["mapReadinessCrawlingRequested", "map readiness cannot crawl maps"],
  ["leadPriorityCampaignRequested", "lead priority cannot start campaigns"],
  ["aiOwnerContactRequested", "AI recommendations cannot contact owners"],
  ["externalDataApiRequested", "external data/API calls remain blocked"],
  ["providerRequested", "provider activation remains blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function assertR75DriftInvariants(result: R75DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R75B must remain read-only advisory simulation");
  if (
    flags.scrapingAllowed ||
    flags.mapCrawlingAllowed ||
    flags.streetViewAutomationAllowed ||
    flags.externalApiAllowed ||
    flags.ownerContactAllowed ||
    flags.skipTracingAllowed ||
    flags.outreachAllowed ||
    flags.providerCalled ||
    flags.providerActivationAllowed ||
    flags.fetchNetworkAllowed ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.campaignAllowed ||
    flags.auditWritingAllowed ||
    flags.executionAllowed
  ) {
    throw new Error("R75B cannot authorize scraping, map automation, APIs, owner contact, providers, persistence, audit writing, campaigns, or execution");
  }
}

export function createR75VirtualD4dDriftDataSourcingRiskAudit(input: R75DriftInput = {}): R75DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R75DriftStatus =
    activeBlockedReasons.length > 0 ? "virtual_d4d_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "virtual_d4d_drift_audit_clear";
  const result: R75DriftResult = {
    phase: "R75B",
    status,
    flags: r75DriftFlags,
    riskCategories: r75DriftRiskCategories,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R75C - Virtual D4D Read-Only UI Scope Contract",
  };
  assertR75DriftInvariants(result);
  return result;
}

export function summarizeR75VirtualD4dDriftAudit(result: R75DriftResult): string {
  assertR75DriftInvariants(result);
  return `R75B ${result.status}: Virtual D4D drift audit blocks intelligence, distress signals, property scores, map readiness, lead priority, and AI recommendations from becoming scraping, map crawling, owner contact, outreach, campaigns, providers, fetch/network, persistence, audit writing, or execution.`;
}
