/**
 * Deterministic advisory-only County Source Governance Continuity Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied governance continuity signals and
 * never activates runtime providers or county-source operations.
 */

export type CountyGovernanceContinuityClassification =
  | "durable_continuity"
  | "stable_with_monitoring"
  | "fragile_continuity"
  | "churn_risk"
  | "continuity_unverified"
  | "fail_closed_continuity_required";

export type CountyGovernanceContinuitySeverity = "low" | "moderate" | "elevated" | "high" | "critical";

export type CountyGovernanceContinuityWarningCode =
  | "REPEATED_ESCALATION_CYCLES"
  | "RESOLUTION_NOT_DURABLE"
  | "GOVERNANCE_CONFIDENCE_WEAKENING"
  | "REVIEW_LOOP_FRAGILITY"
  | "WARNING_SUPPRESSION_UNSAFE"
  | "GOVERNANCE_CHURN_RISK"
  | "UNRESOLVED_WARNINGS_REMAIN"
  | "INSUFFICIENT_CONTINUITY_EVIDENCE"
  | "FAIL_CLOSED_SHOULD_REMAIN_ELEVATED";

export interface CountyGovernanceContinuityExplainability {
  summary: string;
  reviewedSignals: readonly string[];
  reasons: readonly string[];
  deterministicRulesApplied: readonly string[];
}

export interface CountyGovernanceContinuityRecommendation {
  recommendationType: "continue_monitoring" | "document" | "review" | "restrict_planning" | "elevate_fail_closed";
  description: string;
  required: boolean;
}

export interface CountySourceGovernanceContinuityInput {
  countyName?: string | null;
  sourceName?: string | null;
  sourceType?: string | null;
  continuityEvidenceScore?: number | null;
  governanceStabilityScore?: number | null;
  continuityConfidenceScore?: number | null;
  previousContinuityConfidenceScore?: number | null;
  escalationCycleCount?: number | null;
  resolutionCycleCount?: number | null;
  durableResolutionCount?: number | null;
  reviewLoopCount?: number | null;
  unresolvedWarningCount?: number | null;
  warningSuppressionRequested?: boolean | null;
  warningSuppressionJustified?: boolean | null;
  temporaryResolutionActive?: boolean | null;
  monitoringWindowComplete?: boolean | null;
  failClosedElevatedCurrently?: boolean | null;
  explainabilityContext?: {
    reviewedSignals?: string[];
    notes?: string[];
  };
}

export interface CountySourceGovernanceContinuityResult {
  continuityClassification: CountyGovernanceContinuityClassification;
  continuitySeverity: CountyGovernanceContinuitySeverity;
  continuityEvidenceScore: number;
  governanceStabilityScore: number;
  continuityConfidenceScore: number;
  previousContinuityConfidenceScore: number;
  confidenceDelta: number;
  governanceStabilityOverTime: "strengthening" | "stable" | "weakening" | "unverified";
  repeatedEscalationDetected: boolean;
  reviewLoopFragilityDetected: boolean;
  warningSuppressionUnsafe: boolean;
  unresolvedWarningsRemain: boolean;
  failClosedShouldRemainElevated: boolean;
  planningMayContinue: boolean;
  monitoringRequired: boolean;
  warningCodes: CountyGovernanceContinuityWarningCode[];
  continuityReasons: string[];
  recommendations: CountyGovernanceContinuityRecommendation[];
  explainability: CountyGovernanceContinuityExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountySourceGovernanceContinuityFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

const clampCount = (count: number | null | undefined): number => {
  if (typeof count !== "number" || Number.isNaN(count)) {
    return 0;
  }

  return Math.max(0, Math.floor(count));
};

const hasIdentity = (input: CountySourceGovernanceContinuityInput): boolean =>
  Boolean(input.countyName?.trim() && input.sourceName?.trim() && input.sourceType?.trim());

const getConfidenceDelta = (currentScore: number, previousScore: number): number => currentScore - previousScore;

const getStabilityTrend = (
  input: CountySourceGovernanceContinuityInput,
  currentScore: number,
  previousScore: number,
): CountySourceGovernanceContinuityResult["governanceStabilityOverTime"] => {
  if (input.previousContinuityConfidenceScore === null || input.previousContinuityConfidenceScore === undefined) {
    return "unverified";
  }

  const delta = getConfidenceDelta(currentScore, previousScore);

  if (delta <= -10) {
    return "weakening";
  }

  if (delta >= 10) {
    return "strengthening";
  }

  return "stable";
};

const getSignals = (input: CountySourceGovernanceContinuityInput = {}) => {
  const continuityEvidenceScore = clampScore(input.continuityEvidenceScore);
  const governanceStabilityScore = clampScore(input.governanceStabilityScore);
  const continuityConfidenceScore = clampScore(input.continuityConfidenceScore);
  const previousContinuityConfidenceScore = clampScore(input.previousContinuityConfidenceScore);
  const escalationCycleCount = clampCount(input.escalationCycleCount);
  const resolutionCycleCount = clampCount(input.resolutionCycleCount);
  const durableResolutionCount = clampCount(input.durableResolutionCount);
  const reviewLoopCount = clampCount(input.reviewLoopCount);
  const unresolvedWarningCount = clampCount(input.unresolvedWarningCount);
  const trend = getStabilityTrend(input, continuityConfidenceScore, previousContinuityConfidenceScore);
  const repeatedEscalationDetected = escalationCycleCount >= 2;
  const weakDurability =
    input.temporaryResolutionActive === true ||
    durableResolutionCount < resolutionCycleCount ||
    continuityEvidenceScore < 55 ||
    governanceStabilityScore < 55;
  const warningSuppressionUnsafe =
    input.warningSuppressionRequested === true &&
    (input.warningSuppressionJustified !== true || unresolvedWarningCount > 0 || weakDurability);
  const reviewLoopFragilityDetected = reviewLoopCount >= 3;
  const insufficientEvidence =
    !hasIdentity(input) ||
    input.monitoringWindowComplete !== true ||
    continuityEvidenceScore < 50 ||
    trend === "unverified";
  const churnRiskDetected =
    repeatedEscalationDetected &&
    (weakDurability || reviewLoopFragilityDetected || trend === "weakening" || resolutionCycleCount >= 2);
  const failClosedContinuityRequired =
    warningSuppressionUnsafe ||
    (repeatedEscalationDetected && weakDurability && trend === "weakening") ||
    (churnRiskDetected && unresolvedWarningCount > 0) ||
    (input.failClosedElevatedCurrently === true && weakDurability);

  return {
    continuityEvidenceScore,
    governanceStabilityScore,
    continuityConfidenceScore,
    previousContinuityConfidenceScore,
    confidenceDelta: getConfidenceDelta(continuityConfidenceScore, previousContinuityConfidenceScore),
    trend,
    repeatedEscalationDetected,
    weakDurability,
    warningSuppressionUnsafe,
    reviewLoopFragilityDetected,
    unresolvedWarningsRemain: unresolvedWarningCount > 0,
    insufficientEvidence,
    churnRiskDetected,
    failClosedContinuityRequired,
  };
};

const getClassificationAndSeverity = (
  input: CountySourceGovernanceContinuityInput,
): {
  classification: CountyGovernanceContinuityClassification;
  severity: CountyGovernanceContinuitySeverity;
} => {
  const signals = getSignals(input);

  if (signals.failClosedContinuityRequired) {
    return { classification: "fail_closed_continuity_required", severity: "critical" };
  }

  if (signals.churnRiskDetected) {
    return { classification: "churn_risk", severity: "high" };
  }

  if (signals.insufficientEvidence) {
    return { classification: "continuity_unverified", severity: "elevated" };
  }

  if (signals.weakDurability || signals.reviewLoopFragilityDetected || signals.unresolvedWarningsRemain) {
    return { classification: "fragile_continuity", severity: "elevated" };
  }

  if (
    signals.continuityEvidenceScore >= 85 &&
    signals.governanceStabilityScore >= 85 &&
    signals.continuityConfidenceScore >= 85 &&
    signals.trend === "strengthening"
  ) {
    return { classification: "durable_continuity", severity: "low" };
  }

  return { classification: "stable_with_monitoring", severity: "moderate" };
};

const getWarningCodes = (
  input: CountySourceGovernanceContinuityInput,
): CountyGovernanceContinuityWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: CountyGovernanceContinuityWarningCode[] = [];

  if (signals.repeatedEscalationDetected) {
    warningCodes.push("REPEATED_ESCALATION_CYCLES");
  }

  if (signals.weakDurability) {
    warningCodes.push("RESOLUTION_NOT_DURABLE");
  }

  if (signals.trend === "weakening") {
    warningCodes.push("GOVERNANCE_CONFIDENCE_WEAKENING");
  }

  if (signals.reviewLoopFragilityDetected) {
    warningCodes.push("REVIEW_LOOP_FRAGILITY");
  }

  if (signals.warningSuppressionUnsafe) {
    warningCodes.push("WARNING_SUPPRESSION_UNSAFE");
  }

  if (signals.churnRiskDetected) {
    warningCodes.push("GOVERNANCE_CHURN_RISK");
  }

  if (signals.unresolvedWarningsRemain) {
    warningCodes.push("UNRESOLVED_WARNINGS_REMAIN");
  }

  if (signals.insufficientEvidence) {
    warningCodes.push("INSUFFICIENT_CONTINUITY_EVIDENCE");
  }

  if (signals.failClosedContinuityRequired) {
    warningCodes.push("FAIL_CLOSED_SHOULD_REMAIN_ELEVATED");
  }

  return warningCodes;
};

const getReasons = (
  classification: CountyGovernanceContinuityClassification,
  input: CountySourceGovernanceContinuityInput,
): string[] => {
  const signals = getSignals(input);
  const reasons: string[] = [];

  if (classification === "durable_continuity") {
    reasons.push("Governance continuity signals are durable, monitored, and strengthening.");
  }

  if (classification === "stable_with_monitoring") {
    reasons.push("Governance continuity appears stable but should remain monitored.");
  }

  if (!hasIdentity(input)) {
    reasons.push("County source identity is incomplete, so continuity cannot be fully verified.");
  }

  if (signals.insufficientEvidence) {
    reasons.push("Continuity evidence is incomplete or below verification threshold.");
  }

  if (signals.repeatedEscalationDetected) {
    reasons.push("Repeated escalation cycles indicate continuity pressure over time.");
  }

  if (signals.weakDurability) {
    reasons.push("Resolution durability is weak or temporary and must not remove safety restrictions.");
  }

  if (signals.trend === "weakening") {
    reasons.push("Governance confidence is weakening across the supplied continuity window.");
  }

  if (signals.reviewLoopFragilityDetected) {
    reasons.push("Repeated review loops indicate governance workflow fragility.");
  }

  if (signals.warningSuppressionUnsafe) {
    reasons.push("Warning suppression is unsafe under current continuity conditions.");
  }

  if (signals.unresolvedWarningsRemain) {
    reasons.push("Unresolved warnings remain attached to the governance package.");
  }

  return reasons;
};

const getRecommendations = (
  classification: CountyGovernanceContinuityClassification,
): CountyGovernanceContinuityRecommendation[] => {
  if (classification === "durable_continuity") {
    return [
      {
        recommendationType: "continue_monitoring",
        description: "Continue advisory-only monitoring with fail-closed execution controls preserved.",
        required: false,
      },
    ];
  }

  const recommendations: CountyGovernanceContinuityRecommendation[] = [
    {
      recommendationType: "document",
      description: "Document continuity evidence, review cycles, and warning handling rationale.",
      required: true,
    },
    {
      recommendationType: "continue_monitoring",
      description: "Keep continuity monitoring active before any future activation decision.",
      required: true,
    },
  ];

  if (classification === "fail_closed_continuity_required") {
    recommendations.push({
      recommendationType: "elevate_fail_closed",
      description: "Keep fail-closed protections elevated until continuity evidence strengthens.",
      required: true,
    });
  }

  if (classification === "churn_risk" || classification === "fragile_continuity") {
    recommendations.push({
      recommendationType: "review",
      description: "Route continuity signals for human governance review.",
      required: true,
    });
  }

  if (classification !== "stable_with_monitoring") {
    recommendations.push({
      recommendationType: "restrict_planning",
      description: "Restrict advisory planning while continuity remains unverified, fragile, or churn-prone.",
      required: true,
    });
  }

  return recommendations;
};

export function evaluateCountySourceGovernanceContinuity(
  input: CountySourceGovernanceContinuityInput = {},
): CountySourceGovernanceContinuityResult {
  const { classification, severity } = getClassificationAndSeverity(input);
  const signals = getSignals(input);
  const failClosedShouldRemainElevated =
    classification === "fail_closed_continuity_required" ||
    classification === "churn_risk" ||
    input.failClosedElevatedCurrently === true;

  return {
    continuityClassification: classification,
    continuitySeverity: severity,
    continuityEvidenceScore: signals.continuityEvidenceScore,
    governanceStabilityScore: signals.governanceStabilityScore,
    continuityConfidenceScore: signals.continuityConfidenceScore,
    previousContinuityConfidenceScore: signals.previousContinuityConfidenceScore,
    confidenceDelta: signals.confidenceDelta,
    governanceStabilityOverTime: signals.trend,
    repeatedEscalationDetected: signals.repeatedEscalationDetected,
    reviewLoopFragilityDetected: signals.reviewLoopFragilityDetected,
    warningSuppressionUnsafe: signals.warningSuppressionUnsafe,
    unresolvedWarningsRemain: signals.unresolvedWarningsRemain,
    failClosedShouldRemainElevated,
    planningMayContinue: classification === "durable_continuity" || classification === "stable_with_monitoring",
    monitoringRequired: classification !== "durable_continuity",
    warningCodes: getWarningCodes(input),
    continuityReasons: getReasons(classification, input),
    recommendations: getRecommendations(classification),
    explainability: {
      summary: `${input.countyName ?? "Unknown county"} ${input.sourceName ?? "unknown source"} governance continuity evaluated with deterministic advisory-only rules.`,
      reviewedSignals: input.explainabilityContext?.reviewedSignals ?? [],
      reasons: input.explainabilityContext?.notes ?? [],
      deterministicRulesApplied: [
        "scores clamped between 0 and 100",
        "missing continuity evidence defaults to conservative fail-closed handling",
        "temporary resolution does not remove safety restrictions",
        "unsafe warning suppression elevates continuity risk",
        "repeated escalation with weak durability triggers churn or elevated fail-closed handling",
      ],
    },
    ingestionBlocked: CountySourceGovernanceContinuityFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountySourceGovernanceContinuityFailClosedDefaults.automationBlocked,
    executionBlocked: CountySourceGovernanceContinuityFailClosedDefaults.executionBlocked,
    planningOnly: CountySourceGovernanceContinuityFailClosedDefaults.planningOnly,
    failClosed: CountySourceGovernanceContinuityFailClosedDefaults.failClosed,
  };
}
