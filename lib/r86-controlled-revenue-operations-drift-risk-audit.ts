import { r86AccessibilityRequirements, r86ScopeFlags } from "./r86-controlled-revenue-operations-scope-contract";

export const r86DriftRiskCategories = [
  "revenue-signal-to-execution drift",
  "revenue-priority-to-contact drift",
  "throughput-score-to-runtime drift",
  "pipeline-review-to-automation drift",
  "closing-readiness-to-execution drift",
  "assignment-readiness-to-outreach drift",
  "revenue-delay-to-provider drift",
  "bottleneck-to-scraping drift",
  "missing-data-to-skip-tracing drift",
  "high-opportunity-to-lead-creation drift",
  "operator-guidance-to-provider drift",
  "external API drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r86DriftFlags = {
  ...r86ScopeFlags,
  driftAuditOnly: true,
  contactAllowed: false,
  providerDriftAllowed: false,
  runtimeDriftAllowed: false,
  revenueSignalDriftToExecutionAllowed: false,
} as const;

export const r86DangerousWordingPatterns = [
  "execute revenue signal",
  "contact revenue priority",
  "start runtime from throughput",
  "automate pipeline review",
  "execute closing readiness",
  "outreach assignment readiness",
  "activate provider from revenue delay",
  "scrape bottleneck",
  "skip trace missing data",
  "create lead from high opportunity",
  "activate provider from operator guidance",
  "fetch revenue operations",
  "write revenue operations audit",
] as const;

export const r86BlockedDriftTransitions = [
  "Revenue signals cannot execute.",
  "Revenue priority cannot trigger contact.",
  "Throughput scores cannot trigger runtime jobs.",
  "Pipeline review cannot become automation.",
  "Closing readiness cannot trigger execution.",
  "Assignment readiness cannot trigger outreach.",
  "Revenue delay cannot activate providers.",
  "Bottlenecks cannot trigger scraping.",
  "Missing data cannot trigger skip tracing.",
  "High opportunity cannot create leads.",
  "Operator guidance cannot activate providers.",
  "External API drift remains blocked.",
  "Fetch/network drift remains blocked.",
  "Persistence drift remains blocked.",
  "Audit-writing drift remains blocked.",
  "Dangerous wording remains blocked.",
] as const;

export const r86DriftAccessibilityChecks = {
  semanticHeadings: r86AccessibilityRequirements.semanticHeadings,
  readableLabels: r86AccessibilityRequirements.readableLabels,
  textBasedStatusMeaning: r86AccessibilityRequirements.textBasedStatusMeaning,
  noColorOnlyMeaning: r86AccessibilityRequirements.noColorOnlyMeaning,
  noMotionDependency: r86AccessibilityRequirements.noMotionDependency,
  visibleGovernanceWarnings: r86AccessibilityRequirements.visibleGovernanceWarnings,
} as const;

export type R86DriftStatus = "controlled_revenue_operations_drift_blocked" | "operator_review_required" | "controlled_revenue_operations_drift_audit_clear";

export type R86DriftInput = {
  revenueSignalExecutionReviewed?: boolean;
  revenuePriorityContactReviewed?: boolean;
  throughputRuntimeReviewed?: boolean;
  pipelineReviewAutomationReviewed?: boolean;
  closingReadinessExecutionReviewed?: boolean;
  assignmentReadinessOutreachReviewed?: boolean;
  revenueDelayProviderReviewed?: boolean;
  bottleneckScrapingReviewed?: boolean;
  missingDataSkipTracingReviewed?: boolean;
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

export type R86DriftResult = {
  phase: "R86B";
  status: R86DriftStatus;
  flags: typeof r86DriftFlags;
  riskCategories: typeof r86DriftRiskCategories;
  dangerousWordingPatterns: typeof r86DangerousWordingPatterns;
  blockedDriftTransitions: typeof r86BlockedDriftTransitions;
  accessibility: typeof r86DriftAccessibilityChecks;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R86C - Controlled Revenue Operations Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R86DriftInput, string]> = [
  ["revenueSignalExecutionReviewed", "revenue-signal-to-execution drift"],
  ["revenuePriorityContactReviewed", "revenue-priority-to-contact drift"],
  ["throughputRuntimeReviewed", "throughput-score-to-runtime drift"],
  ["pipelineReviewAutomationReviewed", "pipeline-review-to-automation drift"],
  ["closingReadinessExecutionReviewed", "closing-readiness-to-execution drift"],
  ["assignmentReadinessOutreachReviewed", "assignment-readiness-to-outreach drift"],
  ["revenueDelayProviderReviewed", "revenue-delay-to-provider drift"],
  ["bottleneckScrapingReviewed", "bottleneck-to-scraping drift"],
  ["missingDataSkipTracingReviewed", "missing-data-to-skip-tracing drift"],
  ["highOpportunityLeadCreationReviewed", "high-opportunity-to-lead-creation drift"],
  ["operatorGuidanceProviderReviewed", "operator-guidance-to-provider drift"],
  ["externalApiReviewed", "external API drift"],
  ["fetchNetworkReviewed", "fetch/network drift"],
  ["persistenceReviewed", "persistence drift"],
  ["auditWritingReviewed", "audit-writing drift"],
  ["dangerousWordingReviewed", "dangerous wording drift"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R86DriftInput, string]> = [
  ["executionRequested", "revenue signals cannot execute"],
  ["contactRequested", "revenue priority cannot trigger contact"],
  ["runtimeRequested", "throughput scores cannot trigger runtime jobs"],
  ["automationRequested", "pipeline review cannot become automation"],
  ["outreachRequested", "assignment readiness cannot trigger outreach"],
  ["providerRequested", "revenue delay cannot activate providers"],
  ["scrapingRequested", "bottlenecks cannot trigger scraping"],
  ["skipTracingRequested", "missing data cannot trigger skip tracing"],
  ["leadCreationRequested", "high opportunity cannot create leads"],
  ["externalApiRequested", "external API drift remains blocked"],
  ["fetchNetworkRequested", "fetch/network drift remains blocked"],
  ["persistenceRequested", "persistence drift remains blocked"],
  ["auditWritingRequested", "audit-writing drift remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function classifyR86ControlledRevenueOperationsDangerousWording(text: string): "dangerous_wording_detected" | "wording_clear" {
  const normalized = text.toLowerCase();
  return r86DangerousWordingPatterns.some((pattern) => normalized.includes(pattern.toLowerCase())) ? "dangerous_wording_detected" : "wording_clear";
}

export function assertR86DriftInvariants(result: R86DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.driftAuditOnly) {
    throw new Error("R86B must remain read-only advisory drift audit simulation");
  }
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "driftAuditOnly"].includes(key) && value === true)) {
    throw new Error("R86B cannot authorize revenue operations drift into execution, contact, outreach, providers, automation, scraping, skip tracing, lead creation, persistence, audit writing, runtime, or network behavior");
  }
}

export function createR86ControlledRevenueOperationsDriftRiskAudit(input: R86DriftInput = {}): R86DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R86DriftStatus =
    activeBlockedReasons.length > 0 ? "controlled_revenue_operations_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "controlled_revenue_operations_drift_audit_clear";
  const result: R86DriftResult = {
    phase: "R86B",
    status,
    flags: r86DriftFlags,
    riskCategories: r86DriftRiskCategories,
    dangerousWordingPatterns: r86DangerousWordingPatterns,
    blockedDriftTransitions: r86BlockedDriftTransitions,
    accessibility: r86DriftAccessibilityChecks,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R86C - Controlled Revenue Operations Read-Only UI Scope Contract",
  };
  assertR86DriftInvariants(result);
  return result;
}

export function summarizeR86ControlledRevenueOperationsDriftRiskAudit(result: R86DriftResult): string {
  assertR86DriftInvariants(result);
  return `R86B ${result.status}: controlled revenue operations drift audit blocks revenue signals, revenue priority, throughput scores, pipeline review, closing readiness, assignment readiness, revenue delay, bottlenecks, missing data, high opportunity, and operator guidance from becoming execution, contact, runtime jobs, automation, outreach, providers, scraping, skip tracing, lead creation, external APIs, fetch/network, persistence, audit writing, or dangerous wording.`;
}
