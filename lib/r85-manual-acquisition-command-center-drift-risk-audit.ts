import { r85AccessibilityRequirements, r85ScopeFlags } from "./r85-manual-acquisition-command-center-scope-contract";

export const r85DriftRiskCategories = [
  "command-center-to-execution drift",
  "review-priority-to-contact drift",
  "escalation-to-provider drift",
  "workflow-queue-to-runtime drift",
  "bottleneck-to-scraping drift",
  "missing-data-to-skip-tracing drift",
  "revenue-visibility-to-outreach drift",
  "acquisition-review-to-automation drift",
  "operator-coordination-to-provider drift",
  "confidence-score-to-lead-creation drift",
  "external API drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r85DriftFlags = {
  ...r85ScopeFlags,
  driftAuditOnly: true,
  contactAllowed: false,
  providerDriftAllowed: false,
  runtimeDriftAllowed: false,
  commandCenterDriftToExecutionAllowed: false,
} as const;

export const r85DangerousWordingPatterns = [
  "execute command center",
  "contact review priority",
  "activate provider from escalation",
  "start runtime queue",
  "scrape bottleneck",
  "skip trace missing data",
  "outreach revenue visibility",
  "automate acquisition review",
  "activate provider from coordination",
  "create lead from confidence score",
  "fetch command center",
  "write command center audit",
] as const;

export const r85BlockedDriftTransitions = [
  "Command center visibility cannot execute.",
  "Review priority cannot trigger contact.",
  "Escalation visibility cannot activate providers.",
  "Workflow queues cannot trigger runtime jobs.",
  "Bottlenecks cannot trigger scraping.",
  "Missing data cannot trigger skip tracing.",
  "Revenue visibility cannot trigger outreach.",
  "Acquisition review cannot become automation.",
  "Operator coordination cannot activate providers.",
  "Confidence scores cannot create leads.",
  "External API drift remains blocked.",
  "Fetch/network drift remains blocked.",
  "Persistence drift remains blocked.",
  "Audit-writing drift remains blocked.",
  "Dangerous wording remains blocked.",
] as const;

export const r85DriftAccessibilityChecks = {
  semanticHeadings: r85AccessibilityRequirements.semanticHeadings,
  readableLabels: r85AccessibilityRequirements.readableLabels,
  textBasedStatusMeaning: r85AccessibilityRequirements.textBasedStatusMeaning,
  noColorOnlyMeaning: r85AccessibilityRequirements.noColorOnlyMeaning,
  noMotionDependency: r85AccessibilityRequirements.noMotionDependency,
  visibleGovernanceWarnings: r85AccessibilityRequirements.visibleGovernanceWarnings,
} as const;

export type R85DriftStatus = "manual_acquisition_command_center_drift_blocked" | "operator_review_required" | "manual_acquisition_command_center_drift_audit_clear";

export type R85DriftInput = {
  commandCenterExecutionReviewed?: boolean;
  reviewPriorityContactReviewed?: boolean;
  escalationProviderReviewed?: boolean;
  workflowQueueRuntimeReviewed?: boolean;
  bottleneckScrapingReviewed?: boolean;
  missingDataSkipTracingReviewed?: boolean;
  revenueVisibilityOutreachReviewed?: boolean;
  acquisitionReviewAutomationReviewed?: boolean;
  operatorCoordinationProviderReviewed?: boolean;
  confidenceLeadCreationReviewed?: boolean;
  externalApiReviewed?: boolean;
  fetchNetworkReviewed?: boolean;
  persistenceReviewed?: boolean;
  auditWritingReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  executionRequested?: boolean;
  contactRequested?: boolean;
  providerRequested?: boolean;
  runtimeRequested?: boolean;
  scrapingRequested?: boolean;
  skipTracingRequested?: boolean;
  outreachRequested?: boolean;
  automationRequested?: boolean;
  leadCreationRequested?: boolean;
  externalApiRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R85DriftResult = {
  phase: "R85B";
  status: R85DriftStatus;
  flags: typeof r85DriftFlags;
  riskCategories: typeof r85DriftRiskCategories;
  dangerousWordingPatterns: typeof r85DangerousWordingPatterns;
  blockedDriftTransitions: typeof r85BlockedDriftTransitions;
  accessibility: typeof r85DriftAccessibilityChecks;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R85C - Manual Acquisition Command Center Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R85DriftInput, string]> = [
  ["commandCenterExecutionReviewed", "command-center-to-execution drift"],
  ["reviewPriorityContactReviewed", "review-priority-to-contact drift"],
  ["escalationProviderReviewed", "escalation-to-provider drift"],
  ["workflowQueueRuntimeReviewed", "workflow-queue-to-runtime drift"],
  ["bottleneckScrapingReviewed", "bottleneck-to-scraping drift"],
  ["missingDataSkipTracingReviewed", "missing-data-to-skip-tracing drift"],
  ["revenueVisibilityOutreachReviewed", "revenue-visibility-to-outreach drift"],
  ["acquisitionReviewAutomationReviewed", "acquisition-review-to-automation drift"],
  ["operatorCoordinationProviderReviewed", "operator-coordination-to-provider drift"],
  ["confidenceLeadCreationReviewed", "confidence-score-to-lead-creation drift"],
  ["externalApiReviewed", "external API drift"],
  ["fetchNetworkReviewed", "fetch/network drift"],
  ["persistenceReviewed", "persistence drift"],
  ["auditWritingReviewed", "audit-writing drift"],
  ["dangerousWordingReviewed", "dangerous wording drift"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R85DriftInput, string]> = [
  ["executionRequested", "command center visibility cannot execute"],
  ["contactRequested", "review priority cannot trigger contact"],
  ["providerRequested", "escalation visibility cannot activate providers"],
  ["runtimeRequested", "workflow queues cannot trigger runtime jobs"],
  ["scrapingRequested", "bottlenecks cannot trigger scraping"],
  ["skipTracingRequested", "missing data cannot trigger skip tracing"],
  ["outreachRequested", "revenue visibility cannot trigger outreach"],
  ["automationRequested", "acquisition review cannot become automation"],
  ["leadCreationRequested", "confidence scores cannot create leads"],
  ["externalApiRequested", "external API drift remains blocked"],
  ["fetchNetworkRequested", "fetch/network drift remains blocked"],
  ["persistenceRequested", "persistence drift remains blocked"],
  ["auditWritingRequested", "audit-writing drift remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function classifyR85ManualAcquisitionCommandCenterDangerousWording(text: string): "dangerous_wording_detected" | "wording_clear" {
  const normalized = text.toLowerCase();
  return r85DangerousWordingPatterns.some((pattern) => normalized.includes(pattern.toLowerCase())) ? "dangerous_wording_detected" : "wording_clear";
}

export function assertR85DriftInvariants(result: R85DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.driftAuditOnly) {
    throw new Error("R85B must remain read-only advisory drift audit simulation");
  }
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "driftAuditOnly"].includes(key) && value === true)) {
    throw new Error("R85B cannot authorize command center drift into execution, contact, outreach, providers, automation, scraping, skip tracing, lead creation, persistence, audit writing, runtime, or network behavior");
  }
}

export function createR85ManualAcquisitionCommandCenterDriftRiskAudit(input: R85DriftInput = {}): R85DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R85DriftStatus =
    activeBlockedReasons.length > 0 ? "manual_acquisition_command_center_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "manual_acquisition_command_center_drift_audit_clear";
  const result: R85DriftResult = {
    phase: "R85B",
    status,
    flags: r85DriftFlags,
    riskCategories: r85DriftRiskCategories,
    dangerousWordingPatterns: r85DangerousWordingPatterns,
    blockedDriftTransitions: r85BlockedDriftTransitions,
    accessibility: r85DriftAccessibilityChecks,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R85C - Manual Acquisition Command Center Read-Only UI Scope Contract",
  };
  assertR85DriftInvariants(result);
  return result;
}

export function summarizeR85ManualAcquisitionCommandCenterDriftRiskAudit(result: R85DriftResult): string {
  assertR85DriftInvariants(result);
  return `R85B ${result.status}: manual acquisition command center drift audit blocks command center visibility, review priority, escalation, workflow queues, bottlenecks, missing data, revenue visibility, acquisition review, operator coordination, and confidence labels from becoming execution, contact, provider activation, runtime jobs, scraping, skip tracing, outreach, automation, lead creation, external APIs, fetch/network, persistence, audit writing, or dangerous wording.`;
}
