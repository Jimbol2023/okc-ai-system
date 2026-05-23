import {
  r83AccessibilityRequirements,
  r83ScopeFlags,
} from "./r83-acquisition-priority-revenue-scoring-scope-contract";

export const r83DriftRiskCategories = [
  "priority-to-execution drift",
  "urgency-to-contact drift",
  "revenue-score-to-provider drift",
  "close-probability-to-outreach drift",
  "operator-guidance-to-automation drift",
  "lead-decay-to-scraping drift",
  "blocked-lead-to-skip-tracing drift",
  "confidence-score-to-lead-creation drift",
  "external API drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r83DriftFlags = {
  ...r83ScopeFlags,
  driftAuditOnly: true,
  automationAllowed: false,
  outreachAllowed: false,
  providerDriftAllowed: false,
  scoringDriftToExecutionAllowed: false,
} as const;

export const r83DangerousWordingPatterns = [
  "execute priority score",
  "contact urgent lead",
  "activate provider from revenue score",
  "start outreach from close probability",
  "automate operator guidance",
  "scrape decaying lead",
  "skip trace blocked lead",
  "create lead from confidence score",
  "fetch revenue score",
  "write priority audit",
] as const;

export const r83BlockedDriftTransitions = [
  "priority scores cannot execute",
  "urgency cannot trigger contact",
  "revenue scores cannot activate providers",
  "close probability cannot trigger outreach",
  "operator guidance cannot become automation",
  "lead decay cannot trigger scraping",
  "blocked leads cannot trigger skip tracing",
  "confidence scores cannot create leads",
  "external API drift remains blocked",
  "fetch/network drift remains blocked",
  "persistence drift remains blocked",
  "audit-writing drift remains blocked",
  "dangerous wording remains blocked",
] as const;

export const r83DriftAccessibilityChecks = {
  semanticHeadings: r83AccessibilityRequirements.semanticHeadings,
  readableLabels: r83AccessibilityRequirements.readableLabels,
  textBasedStatusMeaning: r83AccessibilityRequirements.textBasedStatusMeaning,
  noColorOnlyMeaning: r83AccessibilityRequirements.noColorOnlyMeaning,
  noMotionDependency: r83AccessibilityRequirements.noMotionDependency,
  visibleGovernanceWarnings: r83AccessibilityRequirements.visibleGovernanceWarnings,
} as const;

export type R83DriftStatus = "acquisition_priority_revenue_drift_blocked" | "operator_review_required" | "acquisition_priority_revenue_drift_audit_clear";

export type R83DriftInput = {
  priorityExecutionReviewed?: boolean;
  urgencyContactReviewed?: boolean;
  revenueProviderReviewed?: boolean;
  closeProbabilityOutreachReviewed?: boolean;
  operatorAutomationReviewed?: boolean;
  leadDecayScrapingReviewed?: boolean;
  blockedLeadSkipTracingReviewed?: boolean;
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
  outreachRequested?: boolean;
  automationRequested?: boolean;
  scrapingRequested?: boolean;
  skipTracingRequested?: boolean;
  leadCreationRequested?: boolean;
  externalApiRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R83DriftResult = {
  phase: "R83B";
  status: R83DriftStatus;
  flags: typeof r83DriftFlags;
  riskCategories: typeof r83DriftRiskCategories;
  dangerousWordingPatterns: typeof r83DangerousWordingPatterns;
  blockedDriftTransitions: typeof r83BlockedDriftTransitions;
  accessibility: typeof r83DriftAccessibilityChecks;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R83C - Acquisition Priority & Revenue Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R83DriftInput, string]> = [
  ["priorityExecutionReviewed", "priority-to-execution drift"],
  ["urgencyContactReviewed", "urgency-to-contact drift"],
  ["revenueProviderReviewed", "revenue-score-to-provider drift"],
  ["closeProbabilityOutreachReviewed", "close-probability-to-outreach drift"],
  ["operatorAutomationReviewed", "operator-guidance-to-automation drift"],
  ["leadDecayScrapingReviewed", "lead-decay-to-scraping drift"],
  ["blockedLeadSkipTracingReviewed", "blocked-lead-to-skip-tracing drift"],
  ["confidenceLeadCreationReviewed", "confidence-score-to-lead-creation drift"],
  ["externalApiReviewed", "external API drift"],
  ["fetchNetworkReviewed", "fetch/network drift"],
  ["persistenceReviewed", "persistence drift"],
  ["auditWritingReviewed", "audit-writing drift"],
  ["dangerousWordingReviewed", "dangerous wording drift"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R83DriftInput, string]> = [
  ["executionRequested", "priority scores cannot execute"],
  ["contactRequested", "urgency cannot trigger contact"],
  ["providerRequested", "revenue scores cannot activate providers"],
  ["outreachRequested", "close probability cannot trigger outreach"],
  ["automationRequested", "operator guidance cannot become automation"],
  ["scrapingRequested", "lead decay cannot trigger scraping"],
  ["skipTracingRequested", "blocked leads cannot trigger skip tracing"],
  ["leadCreationRequested", "confidence scores cannot create leads"],
  ["externalApiRequested", "external API drift remains blocked"],
  ["fetchNetworkRequested", "fetch/network drift remains blocked"],
  ["persistenceRequested", "persistence drift remains blocked"],
  ["auditWritingRequested", "audit-writing drift remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function classifyR83PriorityRevenueDangerousWording(text: string): "dangerous_wording_detected" | "wording_clear" {
  const normalized = text.toLowerCase();
  return r83DangerousWordingPatterns.some((pattern) => normalized.includes(pattern.toLowerCase())) ? "dangerous_wording_detected" : "wording_clear";
}

export function assertR83DriftInvariants(result: R83DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.driftAuditOnly) throw new Error("R83B must remain read-only advisory drift audit simulation");
  if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "driftAuditOnly"].includes(key) && value === true)) {
    throw new Error("R83B cannot authorize scoring drift into execution, contact, outreach, providers, automation, sourcing, persistence, audit writing, or network behavior");
  }
}

export function createR83AcquisitionPriorityRevenueDriftRiskAudit(input: R83DriftInput = {}): R83DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R83DriftStatus =
    activeBlockedReasons.length > 0 ? "acquisition_priority_revenue_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_priority_revenue_drift_audit_clear";
  const result: R83DriftResult = {
    phase: "R83B",
    status,
    flags: r83DriftFlags,
    riskCategories: r83DriftRiskCategories,
    dangerousWordingPatterns: r83DangerousWordingPatterns,
    blockedDriftTransitions: r83BlockedDriftTransitions,
    accessibility: r83DriftAccessibilityChecks,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R83C - Acquisition Priority & Revenue Read-Only UI Scope Contract",
  };
  assertR83DriftInvariants(result);
  return result;
}

export function summarizeR83AcquisitionPriorityRevenueDriftRiskAudit(result: R83DriftResult): string {
  assertR83DriftInvariants(result);
  return `R83B ${result.status}: acquisition priority and revenue drift audit blocks priority, urgency, revenue scores, close probability, operator guidance, decay, blocked lead, and confidence labels from becoming execution, contact, outreach, providers, automation, scraping, skip tracing, lead creation, external APIs, fetch/network, persistence, audit writing, or dangerous wording.`;
}
