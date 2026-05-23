import { r84AccessibilityRequirements, r84ScopeFlags } from "./r84-controlled-acquisition-workflow-intelligence-scope-contract";

export const r84DriftRiskCategories = [
  "workflow-guidance-to-execution drift",
  "manual-next-step-to-automation drift",
  "call-priority-to-dialing drift",
  "review-needed-to-contact drift",
  "bottleneck-to-provider drift",
  "stalled-lead-to-scraping drift",
  "missing-data-to-skip-tracing drift",
  "buyer-readiness-to-outreach drift",
  "closing-readiness-to-execution drift",
  "throughput-score-to-runtime drift",
  "operator-sequence-to-job-queue drift",
  "confidence-score-to-lead-creation drift",
  "external API drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r84DriftFlags = {
  ...r84ScopeFlags,
  driftAuditOnly: true,
  automationAllowed: false,
  dialingAllowed: false,
  outreachAllowed: false,
  providerDriftAllowed: false,
  workflowGuidanceDriftToExecutionAllowed: false,
} as const;

export const r84DangerousWordingPatterns = [
  "execute workflow guidance",
  "automate manual next step",
  "dial call priority",
  "contact review needed lead",
  "activate provider from bottleneck",
  "scrape stalled lead",
  "skip trace missing data",
  "outreach buyer readiness",
  "execute closing readiness",
  "start runtime from throughput score",
  "queue operator sequence",
  "create lead from confidence score",
  "fetch workflow intelligence",
  "write workflow audit",
] as const;

export const r84BlockedDriftTransitions = [
  "Workflow guidance cannot execute.",
  "Manual next steps cannot become automation.",
  "Call priority cannot dial.",
  "Review-needed labels cannot trigger contact.",
  "Bottlenecks cannot activate providers.",
  "Stalled leads cannot trigger scraping.",
  "Missing data cannot trigger skip tracing.",
  "Buyer readiness cannot trigger outreach.",
  "Closing readiness cannot trigger execution.",
  "Throughput scores cannot trigger runtime jobs.",
  "Operator sequence cannot become a job queue.",
  "Confidence scores cannot create leads.",
  "External API drift remains blocked.",
  "Fetch/network drift remains blocked.",
  "Persistence drift remains blocked.",
  "Audit-writing drift remains blocked.",
  "Dangerous wording remains blocked.",
] as const;

export const r84DriftAccessibilityChecks = {
  semanticHeadings: r84AccessibilityRequirements.semanticHeadings,
  readableLabels: r84AccessibilityRequirements.readableLabels,
  textBasedStatusMeaning: r84AccessibilityRequirements.textBasedStatusMeaning,
  noColorOnlyMeaning: r84AccessibilityRequirements.noColorOnlyMeaning,
  noMotionDependency: r84AccessibilityRequirements.noMotionDependency,
  visibleGovernanceWarnings: r84AccessibilityRequirements.visibleGovernanceWarnings,
} as const;

export type R84DriftStatus = "controlled_acquisition_workflow_drift_blocked" | "operator_review_required" | "controlled_acquisition_workflow_drift_audit_clear";

export type R84DriftInput = {
  workflowGuidanceExecutionReviewed?: boolean;
  manualNextStepAutomationReviewed?: boolean;
  callPriorityDialingReviewed?: boolean;
  reviewNeededContactReviewed?: boolean;
  bottleneckProviderReviewed?: boolean;
  stalledLeadScrapingReviewed?: boolean;
  missingDataSkipTracingReviewed?: boolean;
  buyerReadinessOutreachReviewed?: boolean;
  closingReadinessExecutionReviewed?: boolean;
  throughputRuntimeReviewed?: boolean;
  operatorSequenceJobQueueReviewed?: boolean;
  confidenceLeadCreationReviewed?: boolean;
  externalApiReviewed?: boolean;
  fetchNetworkReviewed?: boolean;
  persistenceReviewed?: boolean;
  auditWritingReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  accessibilityReviewed?: boolean;
  executionRequested?: boolean;
  automationRequested?: boolean;
  dialingRequested?: boolean;
  contactRequested?: boolean;
  providerRequested?: boolean;
  scrapingRequested?: boolean;
  skipTracingRequested?: boolean;
  outreachRequested?: boolean;
  runtimeRequested?: boolean;
  jobQueueRequested?: boolean;
  leadCreationRequested?: boolean;
  externalApiRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R84DriftResult = {
  phase: "R84B";
  status: R84DriftStatus;
  flags: typeof r84DriftFlags;
  riskCategories: typeof r84DriftRiskCategories;
  dangerousWordingPatterns: typeof r84DangerousWordingPatterns;
  blockedDriftTransitions: typeof r84BlockedDriftTransitions;
  accessibility: typeof r84DriftAccessibilityChecks;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R84C - Controlled Acquisition Workflow Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R84DriftInput, string]> = [
  ["workflowGuidanceExecutionReviewed", "workflow-guidance-to-execution drift"],
  ["manualNextStepAutomationReviewed", "manual-next-step-to-automation drift"],
  ["callPriorityDialingReviewed", "call-priority-to-dialing drift"],
  ["reviewNeededContactReviewed", "review-needed-to-contact drift"],
  ["bottleneckProviderReviewed", "bottleneck-to-provider drift"],
  ["stalledLeadScrapingReviewed", "stalled-lead-to-scraping drift"],
  ["missingDataSkipTracingReviewed", "missing-data-to-skip-tracing drift"],
  ["buyerReadinessOutreachReviewed", "buyer-readiness-to-outreach drift"],
  ["closingReadinessExecutionReviewed", "closing-readiness-to-execution drift"],
  ["throughputRuntimeReviewed", "throughput-score-to-runtime drift"],
  ["operatorSequenceJobQueueReviewed", "operator-sequence-to-job-queue drift"],
  ["confidenceLeadCreationReviewed", "confidence-score-to-lead-creation drift"],
  ["externalApiReviewed", "external API drift"],
  ["fetchNetworkReviewed", "fetch/network drift"],
  ["persistenceReviewed", "persistence drift"],
  ["auditWritingReviewed", "audit-writing drift"],
  ["dangerousWordingReviewed", "dangerous wording drift"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R84DriftInput, string]> = [
  ["executionRequested", "workflow guidance cannot execute"],
  ["automationRequested", "manual next steps cannot become automation"],
  ["dialingRequested", "call priority cannot dial"],
  ["contactRequested", "review-needed labels cannot trigger contact"],
  ["providerRequested", "bottlenecks cannot activate providers"],
  ["scrapingRequested", "stalled leads cannot trigger scraping"],
  ["skipTracingRequested", "missing data cannot trigger skip tracing"],
  ["outreachRequested", "buyer readiness cannot trigger outreach"],
  ["runtimeRequested", "throughput scores cannot trigger runtime jobs"],
  ["jobQueueRequested", "operator sequence cannot become a job queue"],
  ["leadCreationRequested", "confidence scores cannot create leads"],
  ["externalApiRequested", "external API drift remains blocked"],
  ["fetchNetworkRequested", "fetch/network drift remains blocked"],
  ["persistenceRequested", "persistence drift remains blocked"],
  ["auditWritingRequested", "audit-writing drift remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function classifyR84ControlledAcquisitionWorkflowDangerousWording(text: string): "dangerous_wording_detected" | "wording_clear" {
  const normalized = text.toLowerCase();
  return r84DangerousWordingPatterns.some((pattern) => normalized.includes(pattern.toLowerCase())) ? "dangerous_wording_detected" : "wording_clear";
}

export function assertR84DriftInvariants(result: R84DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.driftAuditOnly) {
    throw new Error("R84B must remain read-only advisory drift audit simulation");
  }
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "driftAuditOnly"].includes(key) && value === true)) {
    throw new Error("R84B cannot authorize workflow drift into execution, dialing, contact, outreach, providers, automation, sourcing, persistence, audit writing, runtime, or network behavior");
  }
}

export function createR84ControlledAcquisitionWorkflowDriftRiskAudit(input: R84DriftInput = {}): R84DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R84DriftStatus =
    activeBlockedReasons.length > 0 ? "controlled_acquisition_workflow_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "controlled_acquisition_workflow_drift_audit_clear";
  const result: R84DriftResult = {
    phase: "R84B",
    status,
    flags: r84DriftFlags,
    riskCategories: r84DriftRiskCategories,
    dangerousWordingPatterns: r84DangerousWordingPatterns,
    blockedDriftTransitions: r84BlockedDriftTransitions,
    accessibility: r84DriftAccessibilityChecks,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R84C - Controlled Acquisition Workflow Read-Only UI Scope Contract",
  };
  assertR84DriftInvariants(result);
  return result;
}

export function summarizeR84ControlledAcquisitionWorkflowDriftRiskAudit(result: R84DriftResult): string {
  assertR84DriftInvariants(result);
  return `R84B ${result.status}: controlled acquisition workflow drift audit blocks workflow guidance, manual next steps, call priority, review-needed labels, bottlenecks, stalled leads, missing data, buyer readiness, closing readiness, throughput scores, operator sequence, and confidence labels from becoming execution, dialing, contact, outreach, providers, automation, scraping, skip tracing, job queues, lead creation, external APIs, fetch/network, persistence, audit writing, or dangerous wording.`;
}
