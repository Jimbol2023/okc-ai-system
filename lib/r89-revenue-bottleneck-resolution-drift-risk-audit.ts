import { r89AccessibilityRequirements, r89ScopeFlags } from "./r89-revenue-bottleneck-resolution-scope-contract";

export const r89DriftRiskCategories = [
  "bottleneck-resolution-to-execution drift",
  "recovery-guidance-to-automation drift",
  "remediation-review-to-provider drift",
  "throughput-recovery-to-runtime drift",
  "blocked-workflow-to-outreach drift",
  "assignment-blockage-to-buyer-contact drift",
  "closing-blockage-to-execution drift",
  "bottleneck-to-scraping drift",
  "missing-data-to-skip-tracing drift",
  "high-impact-signal-to-lead-creation drift",
  "operator-guidance-to-provider drift",
  "external API drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r89DriftFlags = {
  ...r89ScopeFlags,
  driftAuditOnly: true,
  contactAllowed: false,
  providerDriftAllowed: false,
  runtimeDriftAllowed: false,
  bottleneckSignalDriftToExecutionAllowed: false,
} as const;

export const r89DangerousWordingPatterns = [
  "execute bottleneck resolution",
  "automate recovery guidance",
  "activate provider from remediation review",
  "start runtime from throughput recovery",
  "outreach blocked workflow",
  "contact buyer from assignment blockage",
  "execute closing blockage",
  "scrape bottleneck",
  "skip trace missing data",
  "create lead from high impact signal",
  "activate provider from operator guidance",
  "fetch revenue bottleneck resolution",
  "write revenue bottleneck resolution audit",
] as const;

export const r89BlockedDriftTransitions = [
  "Bottleneck resolution visibility cannot execute.",
  "Recovery guidance cannot become automation.",
  "Remediation review cannot activate providers.",
  "Throughput recovery cannot trigger runtime jobs.",
  "Blocked workflow visibility cannot trigger outreach.",
  "Assignment blockages cannot contact buyers.",
  "Closing blockages cannot trigger execution.",
  "Bottlenecks cannot trigger scraping.",
  "Missing data cannot trigger skip tracing.",
  "High-impact bottleneck visibility cannot create leads.",
  "Operator guidance cannot activate providers.",
  "External API drift remains blocked.",
  "Fetch/network drift remains blocked.",
  "Persistence drift remains blocked.",
  "Audit-writing drift remains blocked.",
  "Dangerous wording remains blocked.",
] as const;

export const r89DriftAccessibilityChecks = {
  semanticHeadings: r89AccessibilityRequirements.semanticHeadings,
  readableLabels: r89AccessibilityRequirements.readableLabels,
  textBasedStatusMeaning: r89AccessibilityRequirements.textBasedStatusMeaning,
  noColorOnlyMeaning: r89AccessibilityRequirements.noColorOnlyMeaning,
  noMotionDependency: r89AccessibilityRequirements.noMotionDependency,
  visibleGovernanceWarnings: r89AccessibilityRequirements.visibleGovernanceWarnings,
} as const;

export type R89DriftStatus = "revenue_bottleneck_resolution_drift_blocked" | "operator_review_required" | "revenue_bottleneck_resolution_drift_audit_clear";

export type R89DriftInput = {
  bottleneckResolutionExecutionReviewed?: boolean;
  recoveryGuidanceAutomationReviewed?: boolean;
  remediationReviewProviderReviewed?: boolean;
  throughputRecoveryRuntimeReviewed?: boolean;
  blockedWorkflowOutreachReviewed?: boolean;
  assignmentBlockageBuyerContactReviewed?: boolean;
  closingBlockageExecutionReviewed?: boolean;
  bottleneckScrapingReviewed?: boolean;
  missingDataSkipTracingReviewed?: boolean;
  highImpactLeadCreationReviewed?: boolean;
  operatorGuidanceProviderReviewed?: boolean;
  externalApiReviewed?: boolean;
  fetchNetworkReviewed?: boolean;
  persistenceReviewed?: boolean;
  auditWritingReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  executionRequested?: boolean;
  automationRequested?: boolean;
  providerRequested?: boolean;
  runtimeRequested?: boolean;
  outreachRequested?: boolean;
  contactRequested?: boolean;
  scrapingRequested?: boolean;
  skipTracingRequested?: boolean;
  leadCreationRequested?: boolean;
  externalApiRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R89DriftResult = {
  phase: "R89B";
  status: R89DriftStatus;
  flags: typeof r89DriftFlags;
  riskCategories: typeof r89DriftRiskCategories;
  dangerousWordingPatterns: typeof r89DangerousWordingPatterns;
  blockedDriftTransitions: typeof r89BlockedDriftTransitions;
  accessibility: typeof r89DriftAccessibilityChecks;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R89C - Revenue Bottleneck Resolution Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R89DriftInput, string]> = [
  ["bottleneckResolutionExecutionReviewed", "bottleneck-resolution-to-execution drift"],
  ["recoveryGuidanceAutomationReviewed", "recovery-guidance-to-automation drift"],
  ["remediationReviewProviderReviewed", "remediation-review-to-provider drift"],
  ["throughputRecoveryRuntimeReviewed", "throughput-recovery-to-runtime drift"],
  ["blockedWorkflowOutreachReviewed", "blocked-workflow-to-outreach drift"],
  ["assignmentBlockageBuyerContactReviewed", "assignment-blockage-to-buyer-contact drift"],
  ["closingBlockageExecutionReviewed", "closing-blockage-to-execution drift"],
  ["bottleneckScrapingReviewed", "bottleneck-to-scraping drift"],
  ["missingDataSkipTracingReviewed", "missing-data-to-skip-tracing drift"],
  ["highImpactLeadCreationReviewed", "high-impact-signal-to-lead-creation drift"],
  ["operatorGuidanceProviderReviewed", "operator-guidance-to-provider drift"],
  ["externalApiReviewed", "external API drift"],
  ["fetchNetworkReviewed", "fetch/network drift"],
  ["persistenceReviewed", "persistence drift"],
  ["auditWritingReviewed", "audit-writing drift"],
  ["dangerousWordingReviewed", "dangerous wording drift"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R89DriftInput, string]> = [
  ["executionRequested", "bottleneck resolution visibility cannot execute"],
  ["automationRequested", "recovery guidance cannot become automation"],
  ["providerRequested", "remediation review and operator guidance cannot activate providers"],
  ["runtimeRequested", "throughput recovery cannot trigger runtime jobs"],
  ["outreachRequested", "blocked workflow visibility cannot trigger outreach"],
  ["contactRequested", "assignment blockages cannot contact buyers"],
  ["scrapingRequested", "bottlenecks cannot trigger scraping"],
  ["skipTracingRequested", "missing data cannot trigger skip tracing"],
  ["leadCreationRequested", "high-impact bottleneck visibility cannot create leads"],
  ["externalApiRequested", "external API drift remains blocked"],
  ["fetchNetworkRequested", "fetch/network drift remains blocked"],
  ["persistenceRequested", "persistence drift remains blocked"],
  ["auditWritingRequested", "audit-writing drift remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function classifyR89RevenueBottleneckResolutionDangerousWording(text: string): "dangerous_wording_detected" | "wording_clear" {
  const normalized = text.toLowerCase();
  return r89DangerousWordingPatterns.some((pattern) => normalized.includes(pattern.toLowerCase())) ? "dangerous_wording_detected" : "wording_clear";
}

export function assertR89DriftInvariants(result: R89DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.driftAuditOnly) {
    throw new Error("R89B must remain read-only advisory drift audit simulation");
  }
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "driftAuditOnly"].includes(key) && value === true)) {
    throw new Error("R89B cannot authorize revenue bottleneck resolution drift into execution, contact, outreach, providers, automation, scraping, skip tracing, lead creation, persistence, audit writing, runtime, or network behavior");
  }
}

export function createR89RevenueBottleneckResolutionDriftRiskAudit(input: R89DriftInput = {}): R89DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R89DriftStatus = activeBlockedReasons.length > 0 ? "revenue_bottleneck_resolution_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "revenue_bottleneck_resolution_drift_audit_clear";
  const result: R89DriftResult = {
    phase: "R89B",
    status,
    flags: r89DriftFlags,
    riskCategories: r89DriftRiskCategories,
    dangerousWordingPatterns: r89DangerousWordingPatterns,
    blockedDriftTransitions: r89BlockedDriftTransitions,
    accessibility: r89DriftAccessibilityChecks,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R89C - Revenue Bottleneck Resolution Read-Only UI Scope Contract",
  };
  assertR89DriftInvariants(result);
  return result;
}

export function summarizeR89RevenueBottleneckResolutionDriftRiskAudit(result: R89DriftResult): string {
  assertR89DriftInvariants(result);
  return `R89B ${result.status}: revenue bottleneck resolution drift audit blocks bottleneck resolution, recovery guidance, remediation review, throughput recovery, blocked workflows, assignment blockages, closing blockages, bottlenecks, missing data, high-impact signals, and operator guidance from becoming execution, automation, providers, runtime jobs, outreach, buyer contact, closing execution, scraping, skip tracing, lead creation, external APIs, fetch/network, persistence, audit writing, or dangerous wording.`;
}
