import { r87AccessibilityRequirements, r87ScopeFlags } from "./r87-manual-revenue-command-center-scope-contract";

export const r87DriftRiskCategories = [
  "revenue-command-to-execution drift",
  "executive-review-to-provider drift",
  "revenue-priority-to-contact drift",
  "throughput-review-to-runtime drift",
  "bottleneck-to-scraping drift",
  "missing-data-to-skip-tracing drift",
  "revenue-visibility-to-outreach drift",
  "operator-guidance-to-automation drift",
  "assignment-review-to-buyer-contact drift",
  "closing-review-to-execution drift",
  "confidence-score-to-lead-creation drift",
  "external API drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r87DriftFlags = {
  ...r87ScopeFlags,
  driftAuditOnly: true,
  contactAllowed: false,
  providerDriftAllowed: false,
  runtimeDriftAllowed: false,
  revenueSignalDriftToExecutionAllowed: false,
} as const;

export const r87DangerousWordingPatterns = [
  "execute revenue command",
  "activate provider from executive review",
  "contact revenue priority",
  "start runtime from throughput review",
  "scrape bottleneck",
  "skip trace missing data",
  "outreach revenue visibility",
  "automate operator guidance",
  "contact buyer from assignment review",
  "execute closing review",
  "create lead from confidence score",
  "fetch revenue command center",
  "write revenue command center audit",
] as const;

export const r87BlockedDriftTransitions = [
  "Revenue command visibility cannot execute.",
  "Executive review cannot activate providers.",
  "Revenue priority cannot trigger contact.",
  "Throughput review cannot trigger runtime jobs.",
  "Bottlenecks cannot trigger scraping.",
  "Missing data cannot trigger skip tracing.",
  "Revenue visibility cannot trigger outreach.",
  "Operator guidance cannot become automation.",
  "Assignment review cannot contact buyers.",
  "Closing review cannot trigger execution.",
  "Confidence scores cannot create leads.",
  "External API drift remains blocked.",
  "Fetch/network drift remains blocked.",
  "Persistence drift remains blocked.",
  "Audit-writing drift remains blocked.",
  "Dangerous wording remains blocked.",
] as const;

export const r87DriftAccessibilityChecks = {
  semanticHeadings: r87AccessibilityRequirements.semanticHeadings,
  readableLabels: r87AccessibilityRequirements.readableLabels,
  textBasedStatusMeaning: r87AccessibilityRequirements.textBasedStatusMeaning,
  noColorOnlyMeaning: r87AccessibilityRequirements.noColorOnlyMeaning,
  noMotionDependency: r87AccessibilityRequirements.noMotionDependency,
  visibleGovernanceWarnings: r87AccessibilityRequirements.visibleGovernanceWarnings,
} as const;

export type R87DriftStatus = "manual_revenue_command_center_drift_blocked" | "operator_review_required" | "manual_revenue_command_center_drift_audit_clear";

export type R87DriftInput = {
  revenueCommandExecutionReviewed?: boolean;
  executiveReviewProviderReviewed?: boolean;
  revenuePriorityContactReviewed?: boolean;
  throughputReviewRuntimeReviewed?: boolean;
  bottleneckScrapingReviewed?: boolean;
  missingDataSkipTracingReviewed?: boolean;
  revenueVisibilityOutreachReviewed?: boolean;
  operatorGuidanceAutomationReviewed?: boolean;
  assignmentReviewBuyerContactReviewed?: boolean;
  closingReviewExecutionReviewed?: boolean;
  confidenceLeadCreationReviewed?: boolean;
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

export type R87DriftResult = {
  phase: "R87B";
  status: R87DriftStatus;
  flags: typeof r87DriftFlags;
  riskCategories: typeof r87DriftRiskCategories;
  dangerousWordingPatterns: typeof r87DangerousWordingPatterns;
  blockedDriftTransitions: typeof r87BlockedDriftTransitions;
  accessibility: typeof r87DriftAccessibilityChecks;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R87C - Manual Revenue Command Center Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R87DriftInput, string]> = [
  ["revenueCommandExecutionReviewed", "revenue-command-to-execution drift"],
  ["executiveReviewProviderReviewed", "executive-review-to-provider drift"],
  ["revenuePriorityContactReviewed", "revenue-priority-to-contact drift"],
  ["throughputReviewRuntimeReviewed", "throughput-review-to-runtime drift"],
  ["bottleneckScrapingReviewed", "bottleneck-to-scraping drift"],
  ["missingDataSkipTracingReviewed", "missing-data-to-skip-tracing drift"],
  ["revenueVisibilityOutreachReviewed", "revenue-visibility-to-outreach drift"],
  ["operatorGuidanceAutomationReviewed", "operator-guidance-to-automation drift"],
  ["assignmentReviewBuyerContactReviewed", "assignment-review-to-buyer-contact drift"],
  ["closingReviewExecutionReviewed", "closing-review-to-execution drift"],
  ["confidenceLeadCreationReviewed", "confidence-score-to-lead-creation drift"],
  ["externalApiReviewed", "external API drift"],
  ["fetchNetworkReviewed", "fetch/network drift"],
  ["persistenceReviewed", "persistence drift"],
  ["auditWritingReviewed", "audit-writing drift"],
  ["dangerousWordingReviewed", "dangerous wording drift"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R87DriftInput, string]> = [
  ["executionRequested", "revenue command visibility cannot execute"],
  ["contactRequested", "revenue priority cannot trigger contact"],
  ["runtimeRequested", "throughput review cannot trigger runtime jobs"],
  ["automationRequested", "operator guidance cannot become automation"],
  ["outreachRequested", "revenue visibility cannot trigger outreach"],
  ["providerRequested", "executive review cannot activate providers"],
  ["scrapingRequested", "bottlenecks cannot trigger scraping"],
  ["skipTracingRequested", "missing data cannot trigger skip tracing"],
  ["leadCreationRequested", "confidence scores cannot create leads"],
  ["externalApiRequested", "external API drift remains blocked"],
  ["fetchNetworkRequested", "fetch/network drift remains blocked"],
  ["persistenceRequested", "persistence drift remains blocked"],
  ["auditWritingRequested", "audit-writing drift remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function classifyR87ManualRevenueCommandCenterDangerousWording(text: string): "dangerous_wording_detected" | "wording_clear" {
  const normalized = text.toLowerCase();
  return r87DangerousWordingPatterns.some((pattern) => normalized.includes(pattern.toLowerCase())) ? "dangerous_wording_detected" : "wording_clear";
}

export function assertR87DriftInvariants(result: R87DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.driftAuditOnly) {
    throw new Error("R87B must remain read-only advisory drift audit simulation");
  }
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "driftAuditOnly"].includes(key) && value === true)) {
    throw new Error("R87B cannot authorize revenue command center drift into execution, contact, outreach, providers, automation, scraping, skip tracing, lead creation, persistence, audit writing, runtime, or network behavior");
  }
}

export function createR87ManualRevenueCommandCenterDriftRiskAudit(input: R87DriftInput = {}): R87DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R87DriftStatus =
    activeBlockedReasons.length > 0 ? "manual_revenue_command_center_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "manual_revenue_command_center_drift_audit_clear";
  const result: R87DriftResult = {
    phase: "R87B",
    status,
    flags: r87DriftFlags,
    riskCategories: r87DriftRiskCategories,
    dangerousWordingPatterns: r87DangerousWordingPatterns,
    blockedDriftTransitions: r87BlockedDriftTransitions,
    accessibility: r87DriftAccessibilityChecks,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R87C - Manual Revenue Command Center Read-Only UI Scope Contract",
  };
  assertR87DriftInvariants(result);
  return result;
}

export function summarizeR87ManualRevenueCommandCenterDriftRiskAudit(result: R87DriftResult): string {
  assertR87DriftInvariants(result);
  return `R87B ${result.status}: manual revenue command center drift audit blocks revenue command visibility, executive review, revenue priority, throughput review, bottlenecks, missing data, revenue visibility, operator guidance, assignment review, closing review, and confidence labels from becoming execution, providers, contact, runtime jobs, scraping, skip tracing, outreach, automation, buyer contact, lead creation, external APIs, fetch/network, persistence, audit writing, or dangerous wording.`;
}


