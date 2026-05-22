export const r79DriftRiskCategories = [
  "cluster-to-geocoding drift",
  "cluster-to-map-crawling drift",
  "cluster-to-scraping drift",
  "cluster-to-lead-creation drift",
  "cluster-to-owner-contact drift",
  "cluster-to-campaign drift",
  "high-cluster-score-to-outreach drift",
  "neighborhood-pattern-to-public-record-crawling drift",
  "missing-area-data-to-external-API drift",
  "buyer-demand-cluster-to-deal-blast drift",
  "provider drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r79DriftFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  geocodingAllowed: false,
  mapCrawlingAllowed: false,
  scrapingAllowed: false,
  leadCreationAllowed: false,
  ownerContactAllowed: false,
  campaignAllowed: false,
  outreachAllowed: false,
  publicRecordCrawlingAllowed: false,
  externalApiAllowed: false,
  dealBlastAllowed: false,
  providerActivationAllowed: false,
  fetchNetworkAllowed: false,
  persistenceAllowedNow: false,
  auditWritingAllowed: false,
  executionAllowed: false,
} as const;

export type R79DriftStatus = "neighborhood_clustering_drift_blocked" | "operator_review_required" | "neighborhood_clustering_drift_audit_clear";

export type R79DriftInput = {
  geocodingReviewed?: boolean;
  mapCrawlingReviewed?: boolean;
  scrapingReviewed?: boolean;
  leadCreationReviewed?: boolean;
  ownerContactReviewed?: boolean;
  campaignReviewed?: boolean;
  outreachReviewed?: boolean;
  publicRecordCrawlingReviewed?: boolean;
  externalApiReviewed?: boolean;
  dealBlastReviewed?: boolean;
  providerReviewed?: boolean;
  persistenceReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  geocodingRequested?: boolean;
  mapCrawlingRequested?: boolean;
  scrapingRequested?: boolean;
  leadCreationRequested?: boolean;
  ownerContactRequested?: boolean;
  campaignRequested?: boolean;
  outreachRequested?: boolean;
  publicRecordCrawlingRequested?: boolean;
  externalApiRequested?: boolean;
  dealBlastRequested?: boolean;
  providerRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  executionRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R79DriftResult = {
  phase: "R79B";
  status: R79DriftStatus;
  flags: typeof r79DriftFlags;
  riskCategories: typeof r79DriftRiskCategories;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R79C - Neighborhood Opportunity Clustering Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R79DriftInput, string]> = [
  ["geocodingReviewed", "cluster-to-geocoding"],
  ["mapCrawlingReviewed", "cluster-to-map-crawling"],
  ["scrapingReviewed", "cluster-to-scraping"],
  ["leadCreationReviewed", "cluster-to-lead-creation"],
  ["ownerContactReviewed", "cluster-to-owner-contact"],
  ["campaignReviewed", "cluster-to-campaign"],
  ["outreachReviewed", "high-cluster-score-to-outreach"],
  ["publicRecordCrawlingReviewed", "neighborhood-pattern-to-public-record-crawling"],
  ["externalApiReviewed", "missing-area-data-to-external-API"],
  ["dealBlastReviewed", "buyer-demand-cluster-to-deal-blast"],
  ["providerReviewed", "provider boundary"],
  ["persistenceReviewed", "persistence boundary"],
  ["auditBoundaryReviewed", "audit boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R79DriftInput, string]> = [
  ["geocodingRequested", "clusters cannot geocode"],
  ["mapCrawlingRequested", "clusters cannot map crawl"],
  ["scrapingRequested", "clusters cannot scrape"],
  ["leadCreationRequested", "clusters cannot create leads"],
  ["ownerContactRequested", "clusters cannot contact owners"],
  ["campaignRequested", "area patterns cannot start campaigns"],
  ["outreachRequested", "high cluster scores cannot trigger outreach"],
  ["publicRecordCrawlingRequested", "neighborhood patterns cannot crawl public records"],
  ["externalApiRequested", "missing area data cannot call external APIs"],
  ["dealBlastRequested", "buyer-demand clusters cannot trigger deal blasts"],
  ["providerRequested", "provider activation remains blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["executionRequested", "execution remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function assertR79DriftInvariants(result: R79DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R79B must remain read-only advisory simulation");
  if (Object.entries(flags).some(([key, value]) => key !== "readOnly" && key !== "advisoryOnly" && key !== "simulationOnly" && value === true)) {
    throw new Error("R79B cannot authorize geodata, sourcing, contact, campaigns, providers, persistence, audit writing, or execution");
  }
}

export function createR79NeighborhoodClusteringDriftGeodataRiskAudit(input: R79DriftInput = {}): R79DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R79DriftStatus =
    activeBlockedReasons.length > 0 ? "neighborhood_clustering_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "neighborhood_clustering_drift_audit_clear";
  const result: R79DriftResult = {
    phase: "R79B",
    status,
    flags: r79DriftFlags,
    riskCategories: r79DriftRiskCategories,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R79C - Neighborhood Opportunity Clustering Read-Only UI Scope Contract",
  };
  assertR79DriftInvariants(result);
  return result;
}

export function summarizeR79NeighborhoodClusteringDriftAudit(result: R79DriftResult): string {
  assertR79DriftInvariants(result);
  return `R79B ${result.status}: neighborhood clustering drift audit blocks clusters from becoming geocoding, map crawling, scraping, lead creation, owner contact, campaigns, outreach, public-record crawling, external APIs, deal blasts, providers, persistence, audit writing, or execution.`;
}
