/**
 * Deterministic advisory-only County Source Escalation Intelligence Layer.
 *
 * Planning metadata only:
 * - no scraping
 * - no fetch calls
 * - no OCR, parser, ingestion, or normalization execution
 * - no database writes
 * - no provider or automation activation
 */

export type CountyEscalationSeverity = "none" | "low" | "moderate" | "high" | "critical";

export type CountyEscalationClassification =
  | "no_escalation_required"
  | "advisory_escalation"
  | "governance_conflict"
  | "policy_conflict"
  | "confidence_instability"
  | "review_burden_override"
  | "risk_override"
  | "mandatory_human_review"
  | "planning_restriction"
  | "governance_deadlock"
  | "critical_escalation";

export type CountyEscalationWarningCode =
  | "UNRESOLVED_GOVERNANCE_CONFLICT"
  | "POLICY_CONTRADICTION_DETECTED"
  | "SURVIVABILITY_UNSTABLE"
  | "CONFIDENCE_COLLAPSE"
  | "REVIEW_BURDEN_EXCEEDED"
  | "GOVERNANCE_OVERRIDE_ACTIVE"
  | "RISK_ESCALATION_ACTIVE"
  | "MANDATORY_HUMAN_REVIEW_REQUIRED"
  | "PLANNING_RESTRICTED"
  | "PLANNING_BLOCKED"
  | "GOVERNANCE_DEADLOCK"
  | "CRITICAL_ESCALATION_REQUIRED"
  | "FAIL_CLOSED_PROTECTION_ACTIVE";

export interface CountyEscalationDecision {
  decision: "no_escalation" | "escalate_for_review" | "block_planning_until_review";
  rationale: string;
}

export interface CountyEscalationExplainability {
  summary: string;
  reviewedLayers: readonly string[];
  notes: readonly string[];
  deterministicRulesApplied: readonly string[];
}

export interface CountyEscalationConflict {
  conflictType: CountyEscalationClassification;
  description: string;
  severity: CountyEscalationSeverity;
  requiresHigherLevelReview: boolean;
}

export interface CountyEscalationRecommendation {
  recommendationType: "document" | "review" | "restrict_planning" | "block_planning" | "continue_advisory";
  description: string;
  required: boolean;
}

export interface CountySourceEscalationInput {
  countyName: string;
  sourceName: string;
  sourceType: string;
  governanceReadinessScore: number;
  governanceDecisionConfidence: number;
  unresolvedGovernanceConflicts: string[];
  blockingWarnings: string[];
  governanceOverrideDetected: boolean;
  policyContradictionDetected: boolean;
  survivabilityInstabilityDetected: boolean;
  reviewBurdenExceeded: boolean;
  confidenceCollapseDetected: boolean;
  riskEscalationDetected: boolean;
  requiresHumanReview: boolean;
  planningContinuationRequested: boolean;
  priorEscalationCount?: number;
  priorSeverityLevel?: CountyEscalationSeverity;
  explainabilityContext?: {
    reviewedLayers?: string[];
    notes?: string[];
  };
}

export interface CountySourceEscalationResult {
  escalationRequired: boolean;
  escalationSeverity: CountyEscalationSeverity;
  escalationClassification: CountyEscalationClassification;
  mandatoryHumanReview: boolean;
  planningMayContinue: boolean;
  planningRestricted: boolean;
  governanceOverrideActive: boolean;
  warningsOverridePlanning: boolean;
  escalationDecision: CountyEscalationDecision;
  escalationReasons: string[];
  escalationRecommendations: CountyEscalationRecommendation[];
  escalationConflicts: CountyEscalationConflict[];
  warningCodes: CountyEscalationWarningCode[];
  explainability: CountyEscalationExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountySourceEscalationFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const severityRank: Record<CountyEscalationSeverity, number> = {
  none: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

const clampScore = (score: number): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const isAtLeast = (severity: CountyEscalationSeverity, minimum: CountyEscalationSeverity): boolean =>
  severityRank[severity] >= severityRank[minimum];

const hasCriticalWarning = (warnings: readonly string[]): boolean =>
  warnings.some((warning) => {
    const normalizedWarning = warning.trim().toUpperCase();

    return (
      normalizedWarning.includes("CRITICAL") ||
      normalizedWarning.includes("DEADLOCK") ||
      normalizedWarning.includes("PLANNING_BLOCKED")
    );
  });

const pushUnique = <T>(items: T[], item: T): void => {
  if (!items.includes(item)) {
    items.push(item);
  }
};

const getClassificationAndSeverity = (
  input: CountySourceEscalationInput,
  readinessScore: number,
  confidenceScore: number,
): {
  classification: CountyEscalationClassification;
  severity: CountyEscalationSeverity;
} => {
  const hasWarnings = input.blockingWarnings.length > 0;
  const hasConflicts = input.unresolvedGovernanceConflicts.length > 0;
  const hasCriticalEscalation =
    input.priorSeverityLevel === "critical" ||
    hasCriticalWarning(input.blockingWarnings) ||
    (input.priorEscalationCount ?? 0) >= 3;
  const hasReadinessRestriction = readinessScore < 0.7 || confidenceScore < 0.7;
  const confidenceInstability = input.confidenceCollapseDetected || confidenceScore < 0.5;

  if (input.governanceOverrideDetected && input.policyContradictionDetected) {
    return { classification: "governance_deadlock", severity: "critical" };
  }

  if (hasCriticalEscalation) {
    return { classification: "critical_escalation", severity: "critical" };
  }

  if (input.policyContradictionDetected) {
    return { classification: "policy_conflict", severity: "high" };
  }

  if (input.riskEscalationDetected) {
    return { classification: "risk_override", severity: "high" };
  }

  if (input.requiresHumanReview) {
    return { classification: "mandatory_human_review", severity: "high" };
  }

  if (hasConflicts) {
    return { classification: "governance_conflict", severity: "moderate" };
  }

  if (confidenceInstability) {
    return { classification: "confidence_instability", severity: "moderate" };
  }

  if (input.reviewBurdenExceeded) {
    return { classification: "review_burden_override", severity: "moderate" };
  }

  if (input.survivabilityInstabilityDetected || hasReadinessRestriction) {
    return { classification: "planning_restriction", severity: "moderate" };
  }

  if (hasWarnings || input.governanceOverrideDetected) {
    return { classification: "advisory_escalation", severity: "low" };
  }

  return { classification: "no_escalation_required", severity: "none" };
};

const getWarningCodes = (
  input: CountySourceEscalationInput,
  classification: CountyEscalationClassification,
  severity: CountyEscalationSeverity,
): CountyEscalationWarningCode[] => {
  const warningCodes: CountyEscalationWarningCode[] = [];

  if (input.unresolvedGovernanceConflicts.length > 0) {
    warningCodes.push("UNRESOLVED_GOVERNANCE_CONFLICT");
  }

  if (input.policyContradictionDetected) {
    warningCodes.push("POLICY_CONTRADICTION_DETECTED");
  }

  if (input.survivabilityInstabilityDetected) {
    warningCodes.push("SURVIVABILITY_UNSTABLE");
  }

  if (input.confidenceCollapseDetected || clampScore(input.governanceDecisionConfidence) < 0.5) {
    warningCodes.push("CONFIDENCE_COLLAPSE");
  }

  if (input.reviewBurdenExceeded) {
    warningCodes.push("REVIEW_BURDEN_EXCEEDED");
  }

  if (input.governanceOverrideDetected) {
    warningCodes.push("GOVERNANCE_OVERRIDE_ACTIVE");
  }

  if (input.riskEscalationDetected) {
    warningCodes.push("RISK_ESCALATION_ACTIVE");
  }

  if (input.requiresHumanReview || isAtLeast(severity, "high")) {
    warningCodes.push("MANDATORY_HUMAN_REVIEW_REQUIRED");
  }

  if (isAtLeast(severity, "moderate")) {
    warningCodes.push("PLANNING_RESTRICTED");
  }

  if (severity === "critical") {
    warningCodes.push("PLANNING_BLOCKED");
    warningCodes.push("CRITICAL_ESCALATION_REQUIRED");
  }

  if (classification === "governance_deadlock") {
    warningCodes.push("GOVERNANCE_DEADLOCK");
  }

  pushUnique(warningCodes, "FAIL_CLOSED_PROTECTION_ACTIVE");

  return warningCodes;
};

const getEscalationReasons = (
  input: CountySourceEscalationInput,
  classification: CountyEscalationClassification,
  severity: CountyEscalationSeverity,
): string[] => {
  const reasons: string[] = [];

  if (classification === "no_escalation_required") {
    reasons.push("No unresolved conflicts, overrides, risk flags, or readiness instability were detected.");
  }

  if (input.blockingWarnings.length > 0) {
    reasons.push("Advisory warning notes are present and must remain attached to planning.");
  }

  if (input.unresolvedGovernanceConflicts.length > 0) {
    reasons.push("Unresolved governance conflicts require escalation before source intelligence can advance.");
  }

  if (input.policyContradictionDetected) {
    reasons.push("A policy contradiction was detected in the county source governance package.");
  }

  if (input.governanceOverrideDetected) {
    reasons.push("A governance override signal is active.");
  }

  if (input.confidenceCollapseDetected || clampScore(input.governanceDecisionConfidence) < 0.5) {
    reasons.push("Governance decision confidence is unstable or collapsed.");
  }

  if (input.reviewBurdenExceeded) {
    reasons.push("Human review burden exceeds advisory planning tolerance.");
  }

  if (input.riskEscalationDetected) {
    reasons.push("Risk escalation requires higher-level governance review.");
  }

  if (input.requiresHumanReview || isAtLeast(severity, "high")) {
    reasons.push("Mandatory human review is required before any future activation decision.");
  }

  if (severity === "critical") {
    reasons.push("Critical escalation blocks planning progression until review resolves the blocker.");
  }

  return reasons;
};

const getEscalationConflicts = (
  input: CountySourceEscalationInput,
  classification: CountyEscalationClassification,
  severity: CountyEscalationSeverity,
): CountyEscalationConflict[] => {
  const conflicts: CountyEscalationConflict[] = input.unresolvedGovernanceConflicts.map((conflict) => ({
    conflictType: "governance_conflict",
    description: conflict,
    severity: isAtLeast(severity, "moderate") ? severity : "moderate",
    requiresHigherLevelReview: true,
  }));

  if (input.policyContradictionDetected) {
    conflicts.push({
      conflictType: "policy_conflict",
      description: "Policy contradiction detected in county source governance inputs.",
      severity: isAtLeast(severity, "high") ? severity : "high",
      requiresHigherLevelReview: true,
    });
  }

  if (classification === "governance_deadlock") {
    conflicts.push({
      conflictType: "governance_deadlock",
      description: "Governance override and policy contradiction are both active.",
      severity: "critical",
      requiresHigherLevelReview: true,
    });
  }

  return conflicts;
};

const getRecommendations = (
  severity: CountyEscalationSeverity,
  planningMayContinue: boolean,
): CountyEscalationRecommendation[] => {
  if (severity === "none") {
    return [
      {
        recommendationType: "continue_advisory",
        description: "Continue advisory-only planning with fail-closed execution controls preserved.",
        required: false,
      },
    ];
  }

  const recommendations: CountyEscalationRecommendation[] = [
    {
      recommendationType: "document",
      description: "Document escalation rationale and preserve warning notes with the county source planning package.",
      required: true,
    },
    {
      recommendationType: "review",
      description: "Route the escalation package for human governance review.",
      required: isAtLeast(severity, "high"),
    },
  ];

  recommendations.push({
    recommendationType: planningMayContinue ? "restrict_planning" : "block_planning",
    description: planningMayContinue
      ? "Allow only restricted advisory planning with escalation notes attached."
      : "Block planning progression until critical escalation is resolved.",
    required: true,
  });

  return recommendations;
};

export function evaluateCountySourceEscalationIntelligence(
  input: CountySourceEscalationInput,
): CountySourceEscalationResult {
  const readinessScore = clampScore(input.governanceReadinessScore);
  const confidenceScore = clampScore(input.governanceDecisionConfidence);
  const { classification, severity } = getClassificationAndSeverity(input, readinessScore, confidenceScore);
  const mandatoryHumanReview = input.requiresHumanReview || isAtLeast(severity, "high");
  const planningMayContinue = severity !== "critical";
  const planningRestricted = isAtLeast(severity, "moderate");
  const warningsOverridePlanning =
    input.blockingWarnings.length > 0 ||
    input.policyContradictionDetected ||
    input.confidenceCollapseDetected ||
    confidenceScore < 0.5 ||
    classification === "governance_deadlock" ||
    severity === "critical";
  const warningCodes = getWarningCodes(input, classification, severity);

  return {
    escalationRequired: severity !== "none",
    escalationSeverity: severity,
    escalationClassification: classification,
    mandatoryHumanReview,
    planningMayContinue,
    planningRestricted,
    governanceOverrideActive: input.governanceOverrideDetected,
    warningsOverridePlanning,
    escalationDecision: {
      decision:
        severity === "none"
          ? "no_escalation"
          : planningMayContinue
            ? "escalate_for_review"
            : "block_planning_until_review",
      rationale:
        severity === "none"
          ? "No escalation signals exceeded advisory thresholds."
          : "Escalation signals require fail-closed advisory governance handling.",
    },
    escalationReasons: getEscalationReasons(input, classification, severity),
    escalationRecommendations: getRecommendations(severity, planningMayContinue),
    escalationConflicts: getEscalationConflicts(input, classification, severity),
    warningCodes,
    explainability: {
      summary: `${input.countyName} ${input.sourceName} ${input.sourceType} escalation evaluated with deterministic advisory-only rules.`,
      reviewedLayers: input.explainabilityContext?.reviewedLayers ?? [],
      notes: input.explainabilityContext?.notes ?? [],
      deterministicRulesApplied: [
        "fail-closed execution controls preserved",
        "critical and deadlock signals override planning progression",
        "moderate and high escalations restrict advisory planning",
        "policy, risk, and human-review signals require higher-level review",
      ],
    },
    ingestionBlocked: CountySourceEscalationFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountySourceEscalationFailClosedDefaults.automationBlocked,
    executionBlocked: CountySourceEscalationFailClosedDefaults.executionBlocked,
    planningOnly: CountySourceEscalationFailClosedDefaults.planningOnly,
    failClosed: CountySourceEscalationFailClosedDefaults.failClosed,
  };
}
