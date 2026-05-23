import { r88AccessibilityRequirements, r88ScopeFlags } from "./r88-revenue-throughput-coordination-scope-contract";

export const r88DriftRiskCategories = [
  "throughput-coordination-to-execution drift",
  "sequencing-review-to-automation drift",
  "velocity-signal-to-runtime drift",
  "bottleneck-to-provider drift",
  "delayed-revenue-path-to-outreach drift",
  "assignment-delay-to-buyer-contact drift",
  "closing-delay-to-execution drift",
  "missing-data-to-skip-tracing drift",
  "bottleneck-to-scraping drift",
  "high-opportunity-to-lead-creation drift",
  "operator-guidance-to-provider drift",
  "external API drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r88DriftFlags = {
  ...r88ScopeFlags,
  driftAuditOnly: true,
  contactAllowed: false,
  providerDriftAllowed: false,
  runtimeDriftAllowed: false,
  revenueSignalDriftToExecutionAllowed: false,
} as const;

export const r88DangerousWordingPatterns = [
  "execute throughput coordination",
  "automate sequencing review",
  "start runtime from velocity signal",
  "activate provider from bottleneck",
  "outreach delayed revenue path",
  "contact buyer from assignment delay",
  "execute closing delay",
  "skip trace missing data",
  "scrape bottleneck",
  "create lead from high opportunity",
  "activate provider from operator guidance",
  "fetch revenue throughput coordination",
  "write revenue throughput coordination audit",
] as const;

export const r88BlockedDriftTransitions = [
  "Throughput coordination visibility cannot execute.",
  "Sequencing review cannot become automation.",
  "Velocity signals cannot trigger runtime jobs.",
  "Bottlenecks cannot activate providers.",
  "Delayed revenue paths cannot trigger outreach.",
  "Assignment delays cannot contact buyers.",
  "Closing delays cannot trigger execution.",
  "Missing data cannot trigger skip tracing.",
  "Bottlenecks cannot trigger scraping.",
  "High-opportunity throughput visibility cannot create leads.",
  "Operator guidance cannot activate providers.",
  "External API drift remains blocked.",
  "Fetch/network drift remains blocked.",
  "Persistence drift remains blocked.",
  "Audit-writing drift remains blocked.",
  "Dangerous wording remains blocked.",
] as const;

export const r88DriftAccessibilityChecks = {
  semanticHeadings: r88AccessibilityRequirements.semanticHeadings,
  readableLabels: r88AccessibilityRequirements.readableLabels,
  textBasedStatusMeaning: r88AccessibilityRequirements.textBasedStatusMeaning,
  noColorOnlyMeaning: r88AccessibilityRequirements.noColorOnlyMeaning,
  noMotionDependency: r88AccessibilityRequirements.noMotionDependency,
  visibleGovernanceWarnings: r88AccessibilityRequirements.visibleGovernanceWarnings,
} as const;

export type R88DriftStatus = "revenue_throughput_coordination_drift_blocked" | "operator_review_required" | "revenue_throughput_coordination_drift_audit_clear";

export type R88DriftInput = {
  throughputCoordinationExecutionReviewed?: boolean;
  sequencingReviewAutomationReviewed?: boolean;
  velocitySignalRuntimeReviewed?: boolean;
  bottleneckProviderReviewed?: boolean;
  delayedRevenuePathOutreachReviewed?: boolean;
  assignmentDelayBuyerContactReviewed?: boolean;
  closingDelayExecutionReviewed?: boolean;
  missingDataSkipTracingReviewed?: boolean;
  bottleneckScrapingReviewed?: boolean;
  highOpportunityLeadCreationReviewed?: boolean;
  operatorGuidanceProviderReviewed?: boolean;
  externalApiReviewed?: boolean;
  fetchNetworkReviewed?: boolean;
  persistenceReviewed?: boolean;
  auditWritingReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  executionRequested?: boolean;
  contactRequested?: boolean;
  runtimeRequested?: boolean;
  automationRequested?: boolean;
  outreachRequested?: boolean;
  providerRequested?: boolean;
  scrapingRequested?: boolean;
  skipTracingRequested?: boolean;
  leadCreationRequested?: boolean;
  externalApiRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R88DriftResult = {
  phase: "R88B";
  status: R88DriftStatus;
  flags: typeof r88DriftFlags;
  riskCategories: typeof r88DriftRiskCategories;
  dangerousWordingPatterns: typeof r88DangerousWordingPatterns;
  blockedDriftTransitions: typeof r88BlockedDriftTransitions;
  accessibility: typeof r88DriftAccessibilityChecks;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R88C - Revenue Throughput Coordination Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R88DriftInput, string]> = [
  ["throughputCoordinationExecutionReviewed", "throughput-coordination-to-execution drift"],
  ["sequencingReviewAutomationReviewed", "sequencing-review-to-automation drift"],
  ["velocitySignalRuntimeReviewed", "velocity-signal-to-runtime drift"],
  ["bottleneckProviderReviewed", "bottleneck-to-provider drift"],
  ["delayedRevenuePathOutreachReviewed", "delayed-revenue-path-to-outreach drift"],
  ["assignmentDelayBuyerContactReviewed", "assignment-delay-to-buyer-contact drift"],
  ["closingDelayExecutionReviewed", "closing-delay-to-execution drift"],
  ["missingDataSkipTracingReviewed", "missing-data-to-skip-tracing drift"],
  ["bottleneckScrapingReviewed", "bottleneck-to-scraping drift"],
  ["highOpportunityLeadCreationReviewed", "high-opportunity-to-lead-creation drift"],
  ["operatorGuidanceProviderReviewed", "operator-guidance-to-provider drift"],
  ["externalApiReviewed", "external API drift"],
  ["fetchNetworkReviewed", "fetch/network drift"],
  ["persistenceReviewed", "persistence drift"],
  ["auditWritingReviewed", "audit-writing drift"],
  ["dangerousWordingReviewed", "dangerous wording drift"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R88DriftInput, string]> = [
  ["executionRequested", "throughput coordination visibility cannot execute"],
  ["contactRequested", "assignment delays cannot contact buyers"],
  ["runtimeRequested", "velocity signals cannot trigger runtime jobs"],
  ["automationRequested", "sequencing review cannot become automation"],
  ["outreachRequested", "delayed revenue paths cannot trigger outreach"],
  ["providerRequested", "bottlenecks and operator guidance cannot activate providers"],
  ["scrapingRequested", "bottlenecks cannot trigger scraping"],
  ["skipTracingRequested", "missing data cannot trigger skip tracing"],
  ["leadCreationRequested", "high-opportunity throughput visibility cannot create leads"],
  ["externalApiRequested", "external API drift remains blocked"],
  ["fetchNetworkRequested", "fetch/network drift remains blocked"],
  ["persistenceRequested", "persistence drift remains blocked"],
  ["auditWritingRequested", "audit-writing drift remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function classifyR88RevenueThroughputCoordinationDangerousWording(text: string): "dangerous_wording_detected" | "wording_clear" {
  const normalized = text.toLowerCase();
  return r88DangerousWordingPatterns.some((pattern) => normalized.includes(pattern.toLowerCase())) ? "dangerous_wording_detected" : "wording_clear";
}

export function assertR88DriftInvariants(result: R88DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.driftAuditOnly) {
    throw new Error("R88B must remain read-only advisory drift audit simulation");
  }
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "driftAuditOnly"].includes(key) && value === true)) {
    throw new Error("R88B cannot authorize revenue throughput coordination drift into execution, contact, outreach, providers, automation, scraping, skip tracing, lead creation, persistence, audit writing, runtime, or network behavior");
  }
}

export function createR88RevenueThroughputCoordinationDriftRiskAudit(input: R88DriftInput = {}): R88DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R88DriftStatus =
    activeBlockedReasons.length > 0 ? "revenue_throughput_coordination_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "revenue_throughput_coordination_drift_audit_clear";
  const result: R88DriftResult = {
    phase: "R88B",
    status,
    flags: r88DriftFlags,
    riskCategories: r88DriftRiskCategories,
    dangerousWordingPatterns: r88DangerousWordingPatterns,
    blockedDriftTransitions: r88BlockedDriftTransitions,
    accessibility: r88DriftAccessibilityChecks,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R88C - Revenue Throughput Coordination Read-Only UI Scope Contract",
  };
  assertR88DriftInvariants(result);
  return result;
}

export function summarizeR88RevenueThroughputCoordinationDriftRiskAudit(result: R88DriftResult): string {
  assertR88DriftInvariants(result);
  return `R88B ${result.status}: revenue throughput coordination drift audit blocks throughput coordination, sequencing review, velocity signals, bottlenecks, delayed revenue paths, assignment delays, closing delays, missing data, high-opportunity throughput visibility, and operator guidance from becoming execution, automation, runtime jobs, providers, outreach, buyer contact, closing execution, skip tracing, scraping, lead creation, external APIs, fetch/network, persistence, audit writing, or dangerous wording.`;
}
