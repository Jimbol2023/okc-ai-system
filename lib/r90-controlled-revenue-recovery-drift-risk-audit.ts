import { r90AccessibilityRequirements, r90ScopeFlags } from "./r90-controlled-revenue-recovery-scope-contract";

export const r90DriftRiskCategories = [
  "revenue-recovery-to-execution drift",
  "recovery-guidance-to-automation drift",
  "delayed-opportunity-to-outreach drift",
  "stalled-opportunity-to-provider drift",
  "throughput-stabilization-to-runtime drift",
  "recovery-coordination-to-provider drift",
  "escalation-review-to-contact drift",
  "missing-data-to-skip-tracing drift",
  "blocked-recovery-to-scraping drift",
  "high-impact-recovery-to-lead-creation drift",
  "operator-guidance-to-provider drift",
  "external API drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r90DriftFlags = { ...r90ScopeFlags, driftAuditOnly: true, contactAllowed: false, providerDriftAllowed: false, runtimeDriftAllowed: false, recoverySignalDriftToExecutionAllowed: false } as const;

export const r90DangerousWordingPatterns = [
  "execute revenue recovery",
  "automate recovery guidance",
  "outreach delayed opportunity",
  "activate provider from stalled opportunity",
  "start runtime from throughput stabilization",
  "activate provider from recovery coordination",
  "contact from escalation review",
  "skip trace missing data",
  "scrape blocked recovery",
  "create lead from high impact recovery",
  "activate provider from operator guidance",
  "fetch controlled revenue recovery",
  "write controlled revenue recovery audit",
] as const;

export const r90BlockedDriftTransitions = [
  "Revenue recovery visibility cannot execute.",
  "Recovery guidance cannot become automation.",
  "Delayed opportunities cannot trigger outreach.",
  "Stalled opportunities cannot activate providers.",
  "Throughput stabilization cannot trigger runtime jobs.",
  "Recovery coordination cannot activate providers.",
  "Escalation review cannot trigger contact.",
  "Missing data cannot trigger skip tracing.",
  "Blocked recovery cannot trigger scraping.",
  "High-impact recovery visibility cannot create leads.",
  "Operator guidance cannot activate providers.",
  "External API drift remains blocked.",
  "Fetch/network drift remains blocked.",
  "Persistence drift remains blocked.",
  "Audit-writing drift remains blocked.",
  "Dangerous wording remains blocked.",
] as const;

export const r90DriftAccessibilityChecks = {
  semanticHeadings: r90AccessibilityRequirements.semanticHeadings,
  readableLabels: r90AccessibilityRequirements.readableLabels,
  textBasedStatusMeaning: r90AccessibilityRequirements.textBasedStatusMeaning,
  noColorOnlyMeaning: r90AccessibilityRequirements.noColorOnlyMeaning,
  noMotionDependency: r90AccessibilityRequirements.noMotionDependency,
  visibleGovernanceWarnings: r90AccessibilityRequirements.visibleGovernanceWarnings,
} as const;

export type R90DriftStatus = "controlled_revenue_recovery_drift_blocked" | "operator_review_required" | "controlled_revenue_recovery_drift_audit_clear";

export type R90DriftInput = {
  revenueRecoveryExecutionReviewed?: boolean;
  recoveryGuidanceAutomationReviewed?: boolean;
  delayedOpportunityOutreachReviewed?: boolean;
  stalledOpportunityProviderReviewed?: boolean;
  throughputStabilizationRuntimeReviewed?: boolean;
  recoveryCoordinationProviderReviewed?: boolean;
  escalationReviewContactReviewed?: boolean;
  missingDataSkipTracingReviewed?: boolean;
  blockedRecoveryScrapingReviewed?: boolean;
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
  outreachRequested?: boolean;
  providerRequested?: boolean;
  runtimeRequested?: boolean;
  contactRequested?: boolean;
  skipTracingRequested?: boolean;
  scrapingRequested?: boolean;
  leadCreationRequested?: boolean;
  externalApiRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R90DriftResult = { phase: "R90B"; status: R90DriftStatus; flags: typeof r90DriftFlags; riskCategories: typeof r90DriftRiskCategories; dangerousWordingPatterns: typeof r90DangerousWordingPatterns; blockedDriftTransitions: typeof r90BlockedDriftTransitions; accessibility: typeof r90DriftAccessibilityChecks; blockedReasons: string[]; missingReviewAreas: string[]; nextPhase: "R90C - Controlled Revenue Recovery Read-Only UI Scope Contract" };

const requiredReviewAreas: Array<[keyof R90DriftInput, string]> = [
  ["revenueRecoveryExecutionReviewed", "revenue-recovery-to-execution drift"], ["recoveryGuidanceAutomationReviewed", "recovery-guidance-to-automation drift"], ["delayedOpportunityOutreachReviewed", "delayed-opportunity-to-outreach drift"], ["stalledOpportunityProviderReviewed", "stalled-opportunity-to-provider drift"], ["throughputStabilizationRuntimeReviewed", "throughput-stabilization-to-runtime drift"], ["recoveryCoordinationProviderReviewed", "recovery-coordination-to-provider drift"], ["escalationReviewContactReviewed", "escalation-review-to-contact drift"], ["missingDataSkipTracingReviewed", "missing-data-to-skip-tracing drift"], ["blockedRecoveryScrapingReviewed", "blocked-recovery-to-scraping drift"], ["highImpactLeadCreationReviewed", "high-impact-recovery-to-lead-creation drift"], ["operatorGuidanceProviderReviewed", "operator-guidance-to-provider drift"], ["externalApiReviewed", "external API drift"], ["fetchNetworkReviewed", "fetch/network drift"], ["persistenceReviewed", "persistence drift"], ["auditWritingReviewed", "audit-writing drift"], ["dangerousWordingReviewed", "dangerous wording drift"], ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R90DriftInput, string]> = [
  ["executionRequested", "revenue recovery visibility cannot execute"], ["automationRequested", "recovery guidance cannot become automation"], ["outreachRequested", "delayed opportunities cannot trigger outreach"], ["providerRequested", "stalled opportunities, recovery coordination, and operator guidance cannot activate providers"], ["runtimeRequested", "throughput stabilization cannot trigger runtime jobs"], ["contactRequested", "escalation review cannot trigger contact"], ["skipTracingRequested", "missing data cannot trigger skip tracing"], ["scrapingRequested", "blocked recovery cannot trigger scraping"], ["leadCreationRequested", "high-impact recovery visibility cannot create leads"], ["externalApiRequested", "external API drift remains blocked"], ["fetchNetworkRequested", "fetch/network drift remains blocked"], ["persistenceRequested", "persistence drift remains blocked"], ["auditWritingRequested", "audit-writing drift remains blocked"], ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function classifyR90ControlledRevenueRecoveryDangerousWording(text: string): "dangerous_wording_detected" | "wording_clear" { const normalized = text.toLowerCase(); return r90DangerousWordingPatterns.some((pattern) => normalized.includes(pattern.toLowerCase())) ? "dangerous_wording_detected" : "wording_clear"; }

export function assertR90DriftInvariants(result: R90DriftResult): void { const flags = result.flags; if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.driftAuditOnly) throw new Error("R90B must remain read-only advisory drift audit simulation"); if (Object.entries(flags).some(([key, value]) => !["readOnly", "advisoryOnly", "simulationOnly", "driftAuditOnly"].includes(key) && value === true)) throw new Error("R90B cannot authorize controlled revenue recovery drift into execution, contact, outreach, providers, automation, scraping, skip tracing, lead creation, persistence, audit writing, runtime, or network behavior"); }

export function createR90ControlledRevenueRecoveryDriftRiskAudit(input: R90DriftInput = {}): R90DriftResult { const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason); const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label); const status: R90DriftStatus = activeBlockedReasons.length > 0 ? "controlled_revenue_recovery_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "controlled_revenue_recovery_drift_audit_clear"; const result: R90DriftResult = { phase: "R90B", status, flags: r90DriftFlags, riskCategories: r90DriftRiskCategories, dangerousWordingPatterns: r90DangerousWordingPatterns, blockedDriftTransitions: r90BlockedDriftTransitions, accessibility: r90DriftAccessibilityChecks, blockedReasons: activeBlockedReasons, missingReviewAreas, nextPhase: "R90C - Controlled Revenue Recovery Read-Only UI Scope Contract" }; assertR90DriftInvariants(result); return result; }

export function summarizeR90ControlledRevenueRecoveryDriftRiskAudit(result: R90DriftResult): string { assertR90DriftInvariants(result); return `R90B ${result.status}: controlled revenue recovery drift audit blocks revenue recovery, recovery guidance, delayed opportunities, stalled opportunities, throughput stabilization, recovery coordination, escalation review, missing data, blocked recovery, high-impact recovery, and operator guidance from becoming execution, automation, outreach, providers, runtime jobs, contact, skip tracing, scraping, lead creation, external APIs, fetch/network, persistence, audit writing, or dangerous wording.`; }
