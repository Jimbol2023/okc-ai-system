/**
 * Deterministic advisory-only County Governance Convergence Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied convergence signals and never
 * activates runtime providers, county-source operations, ingestion, or automation.
 */

export type CountyGovernanceConvergenceClassification =
  | "durable_convergence"
  | "governance_coherence_maturing"
  | "stable_convergence_with_monitoring"
  | "fragile_convergence"
  | "temporary_stabilization"
  | "warning_suppression_without_resolution"
  | "coherent_but_unresolved"
  | "unresolved_divergence"
  | "masked_instability"
  | "convergence_unverified"
  | "fail_closed_convergence_required";

export type CountyGovernanceConvergenceSeverity = "low" | "moderate" | "elevated" | "high" | "critical";

export type CountyGovernanceConvergenceStabilityLevel =
  | "durable"
  | "stable"
  | "fragile"
  | "temporary"
  | "masked"
  | "unverified";

export type CountyGovernanceConvergenceWarningCode =
  | "INSUFFICIENT_CONVERGENCE_EVIDENCE"
  | "CONVERGENCE_FRAGILE"
  | "TEMPORARY_STABILIZATION_SUSPECTED"
  | "WARNING_SUPPRESSION_WITHOUT_RESOLUTION"
  | "UNRESOLVED_DIVERGENCE_REMAINS"
  | "MASKED_INSTABILITY_SUSPECTED"
  | "CONFIDENCE_STABILIZATION_WEAK"
  | "WARNING_CLUSTER_NOT_RESOLVED"
  | "ESCALATION_REDUCTION_NOT_DURABLE"
  | "REVIEW_BURDEN_NOT_NORMALIZED"
  | "GOVERNANCE_DECISIONS_STILL_INCONSISTENT"
  | "CONTINUITY_NOT_IMPROVING"
  | "COHERENT_BUT_UNRESOLVED_STATE"
  | "FAIL_CLOSED_CONVERGENCE_REQUIRED";

export interface CountyGovernanceConvergenceExplainability {
  summary: string;
  reviewedSignals: readonly string[];
  reasons: readonly string[];
  deterministicRulesApplied: readonly string[];
  durabilityEvidence: {
    stabilizationSignals: string[];
    continuitySignals: string[];
    divergenceSignals: string[];
    suppressionSignals: string[];
  };
}

export interface CountyGovernanceConvergenceRecommendation {
  recommendationType: "continue_monitoring" | "document" | "review" | "restrict_planning" | "maintain_fail_closed";
  description: string;
  required: boolean;
}

export interface CountyGovernanceConvergenceInput {
  countyName?: string | null;
  sourceName?: string | null;
  sourceType?: string | null;
  currentGovernanceConfidenceScore?: number | null;
  previousGovernanceConfidenceScore?: number | null;
  baselineGovernanceConfidenceScore?: number | null;
  currentRiskScore?: number | null;
  previousRiskScore?: number | null;
  currentReviewBurdenScore?: number | null;
  previousReviewBurdenScore?: number | null;
  currentContinuityClassification?: string | null;
  previousContinuityClassification?: string | null;
  currentWarningCodes?: string[];
  previousWarningCodes?: string[];
  unresolvedWarningCodes?: string[];
  suppressedWarningCodes?: string[];
  escalationCycleCount?: number | null;
  previousEscalationCycleCount?: number | null;
  governanceDecisionChangeCount?: number | null;
  inconsistentDecisionCount?: number | null;
  unresolvedDivergenceCount?: number | null;
  resolutionReversalCount?: number | null;
  convergenceEvidenceScore?: number | null;
  coherenceEvidenceScore?: number | null;
  stabilizationDurabilityScore?: number | null;
  monitoringWindowComplete?: boolean | null;
  failClosedElevatedCurrently?: boolean | null;
  explainabilityContext?: {
    reviewedSignals?: string[];
    notes?: string[];
  };
}

export interface CountyGovernanceConvergenceResult {
  convergenceClassification: CountyGovernanceConvergenceClassification;
  convergenceSeverity: CountyGovernanceConvergenceSeverity;
  convergenceStabilityLevel: CountyGovernanceConvergenceStabilityLevel;
  governanceConfidenceDelta: number;
  riskDelta: number;
  reviewBurdenDelta: number;
  warningCountDelta: number;
  escalationCycleDelta: number;
  confidenceStabilizing: boolean;
  riskNormalizing: boolean;
  reviewBurdenNormalizing: boolean;
  warningPatternShrinking: boolean;
  escalationActivityReducing: boolean;
  governanceDecisionsConsistent: boolean;
  continuityImproving: boolean;
  convergenceDurable: boolean;
  convergenceFragile: boolean;
  temporaryStabilizationSuspected: boolean;
  maskedInstabilitySuspected: boolean;
  unresolvedDivergenceDetected: boolean;
  suppressionWithoutResolutionDetected: boolean;
  convergenceIntegrityLevel: "weak" | "partial" | "credible" | "strong";
  confidenceReliabilityLevel: "untrusted" | "weak" | "moderate" | "strong";
  suppressionRiskLevel: "none" | "low" | "moderate" | "high";
  governanceCoherenceMaturity: "immature" | "developing" | "stabilizing" | "mature";
  signalAgreementSummary: {
    positiveSignalCount: number;
    conflictingSignalCount: number;
    unresolvedSignalCount: number;
  };
  planningMayContinue: boolean;
  monitoringRequired: boolean;
  failClosedShouldRemainElevated: boolean;
  warningCodes: CountyGovernanceConvergenceWarningCode[];
  convergenceReasons: string[];
  recommendations: CountyGovernanceConvergenceRecommendation[];
  explainability: CountyGovernanceConvergenceExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountyGovernanceConvergenceFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const continuityRank: Record<string, number> = {
  durable_continuity: 0,
  stable_with_monitoring: 1,
  continuity_unverified: 2,
  fragile_continuity: 3,
  churn_risk: 4,
  fail_closed_continuity_required: 5,
};

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

const scoreProvided = (score: number | null | undefined): boolean => typeof score === "number" && !Number.isNaN(score);

const hasIdentity = (input: CountyGovernanceConvergenceInput): boolean =>
  Boolean(input.countyName?.trim() && input.sourceName?.trim() && input.sourceType?.trim());

const normalizeWarnings = (warnings: readonly string[] | undefined): string[] =>
  Array.from(
    new Set(
      (warnings ?? [])
        .map((warning) => warning.trim().toUpperCase())
        .filter((warning) => warning.length > 0),
    ),
  );

const getContinuityRank = (classification: string | null | undefined): number | null => {
  if (!classification) {
    return null;
  }

  return continuityRank[classification.trim()] ?? null;
};

const countTrue = (signals: readonly boolean[]): number => signals.filter(Boolean).length;

const getLevel = (
  score: number,
  levels: readonly [number, string, string, string, string],
): string => {
  if (score >= levels[0]) {
    return levels[1];
  }

  if (score >= 70) {
    return levels[2];
  }

  if (score >= 45) {
    return levels[3];
  }

  return levels[4];
};

const getSignals = (input: CountyGovernanceConvergenceInput = {}) => {
  const governanceConfidenceScore = clampScore(input.currentGovernanceConfidenceScore);
  const previousGovernanceConfidenceScore = clampScore(input.previousGovernanceConfidenceScore);
  const baselineGovernanceConfidenceScore = clampScore(input.baselineGovernanceConfidenceScore);
  const riskScore = clampScore(input.currentRiskScore);
  const previousRiskScore = clampScore(input.previousRiskScore);
  const reviewBurdenScore = clampScore(input.currentReviewBurdenScore);
  const previousReviewBurdenScore = clampScore(input.previousReviewBurdenScore);
  const convergenceEvidenceScore = clampScore(input.convergenceEvidenceScore);
  const coherenceEvidenceScore = clampScore(input.coherenceEvidenceScore);
  const stabilizationDurabilityScore = clampScore(input.stabilizationDurabilityScore);
  const escalationCycleCount = clampCount(input.escalationCycleCount);
  const previousEscalationCycleCount = clampCount(input.previousEscalationCycleCount);
  const governanceDecisionChangeCount = clampCount(input.governanceDecisionChangeCount);
  const inconsistentDecisionCount = clampCount(input.inconsistentDecisionCount);
  const unresolvedDivergenceCount = clampCount(input.unresolvedDivergenceCount);
  const resolutionReversalCount = clampCount(input.resolutionReversalCount);
  const currentWarningCodes = normalizeWarnings(input.currentWarningCodes);
  const previousWarningCodes = normalizeWarnings(input.previousWarningCodes);
  const unresolvedWarningCodes = normalizeWarnings(input.unresolvedWarningCodes);
  const suppressedWarningCodes = normalizeWarnings(input.suppressedWarningCodes);
  const currentContinuityRank = getContinuityRank(input.currentContinuityClassification);
  const previousContinuityRank = getContinuityRank(input.previousContinuityClassification);
  const governanceConfidenceDelta = governanceConfidenceScore - previousGovernanceConfidenceScore;
  const riskDelta = riskScore - previousRiskScore;
  const reviewBurdenDelta = reviewBurdenScore - previousReviewBurdenScore;
  const warningCountDelta = currentWarningCodes.length - previousWarningCodes.length;
  const escalationCycleDelta = escalationCycleCount - previousEscalationCycleCount;
  const confidenceStabilizing =
    scoreProvided(input.previousGovernanceConfidenceScore) &&
    governanceConfidenceDelta >= -5 &&
    governanceConfidenceDelta <= 10 &&
    (!scoreProvided(input.baselineGovernanceConfidenceScore) || governanceConfidenceScore >= baselineGovernanceConfidenceScore - 10);
  const riskNormalizing = scoreProvided(input.previousRiskScore) && (riskDelta <= -5 || (riskDelta <= 3 && riskScore <= 35));
  const reviewBurdenNormalizing =
    scoreProvided(input.previousReviewBurdenScore) && (reviewBurdenDelta <= -5 || (reviewBurdenDelta <= 3 && reviewBurdenScore <= 40));
  const warningPatternShrinking =
    currentWarningCodes.length < previousWarningCodes.length && unresolvedWarningCodes.length === 0;
  const escalationActivityReducing =
    input.previousEscalationCycleCount !== null &&
    input.previousEscalationCycleCount !== undefined &&
    escalationCycleDelta < 0;
  const governanceDecisionsConsistent = governanceDecisionChangeCount === 0 && inconsistentDecisionCount === 0;
  const continuityImproving =
    currentContinuityRank !== null && previousContinuityRank !== null && currentContinuityRank < previousContinuityRank;
  const positiveSignalCount = countTrue([
    confidenceStabilizing,
    riskNormalizing,
    reviewBurdenNormalizing,
    warningPatternShrinking,
    escalationActivityReducing,
    governanceDecisionsConsistent,
    continuityImproving,
  ]);
  const conflictingSignalCount = countTrue([
    !confidenceStabilizing,
    !riskNormalizing,
    !reviewBurdenNormalizing,
    !governanceDecisionsConsistent,
    suppressedWarningCodes.length > 0,
    resolutionReversalCount > 0,
  ]);
  const unresolvedSignalCount = countTrue([
    unresolvedWarningCodes.length > 0,
    unresolvedDivergenceCount > 0,
    currentContinuityRank === null || previousContinuityRank === null || !continuityImproving,
  ]);
  const signalAgreementScore = Math.round((positiveSignalCount / 7) * 100);
  const convergenceIntegrityScore = Math.round(
    (convergenceEvidenceScore + coherenceEvidenceScore + stabilizationDurabilityScore + signalAgreementScore) / 4,
  );
  const governanceCoherenceMaturityScore = Math.round(
    (coherenceEvidenceScore + (governanceDecisionsConsistent ? 100 : 0) + (continuityImproving ? 100 : 50)) / 3,
  );
  const insufficientEvidence =
    !hasIdentity(input) ||
    input.monitoringWindowComplete !== true ||
    !scoreProvided(input.previousGovernanceConfidenceScore) ||
    !scoreProvided(input.previousRiskScore) ||
    !scoreProvided(input.previousReviewBurdenScore);
  const suppressionWithoutResolutionDetected =
    suppressedWarningCodes.length > 0 &&
    (unresolvedWarningCodes.length > 0 || convergenceEvidenceScore < 75 || stabilizationDurabilityScore < 75);
  const convergenceIntegrityLevel = getLevel(convergenceIntegrityScore, [
    85,
    "strong",
    "credible",
    "partial",
    "weak",
  ]) as CountyGovernanceConvergenceResult["convergenceIntegrityLevel"];
  const confidenceReliabilityScore = Math.round(
    (governanceConfidenceScore + (confidenceStabilizing ? 100 : 0) + stabilizationDurabilityScore) / 3,
  );
  const confidenceReliabilityLevel = getLevel(confidenceReliabilityScore, [
    85,
    "strong",
    "moderate",
    "weak",
    "untrusted",
  ]) as CountyGovernanceConvergenceResult["confidenceReliabilityLevel"];
  const suppressionRiskLevel: CountyGovernanceConvergenceResult["suppressionRiskLevel"] =
    suppressedWarningCodes.length === 0
      ? "none"
      : suppressionWithoutResolutionDetected
        ? "high"
        : suppressedWarningCodes.length >= 2
          ? "moderate"
          : "low";
  const governanceCoherenceMaturity = getLevel(governanceCoherenceMaturityScore, [
    85,
    "mature",
    "stabilizing",
    "developing",
    "immature",
  ]) as CountyGovernanceConvergenceResult["governanceCoherenceMaturity"];
  const unresolvedDivergenceDetected =
    unresolvedDivergenceCount > 0 ||
    unresolvedWarningCodes.length > 0 ||
    (governanceDecisionsConsistent && (riskScore >= 60 || reviewBurdenScore >= 65));
  const maskedInstabilitySuspected =
    (confidenceStabilizing && (riskScore >= 60 || reviewBurdenScore >= 65)) ||
    (warningPatternShrinking && unresolvedWarningCodes.length > 0) ||
    (escalationActivityReducing && resolutionReversalCount > 0) ||
    (governanceDecisionsConsistent && !continuityImproving && suppressedWarningCodes.length > 0);
  const temporaryStabilizationSuspected =
    positiveSignalCount >= 3 && (stabilizationDurabilityScore < 60 || resolutionReversalCount > 0);
  const convergenceDurable =
    positiveSignalCount >= 6 &&
    convergenceEvidenceScore >= 85 &&
    coherenceEvidenceScore >= 85 &&
    stabilizationDurabilityScore >= 85 &&
    unresolvedWarningCodes.length === 0 &&
    suppressedWarningCodes.length === 0 &&
    unresolvedDivergenceCount === 0 &&
    resolutionReversalCount === 0;
  const convergenceFragile =
    positiveSignalCount >= 3 &&
    !convergenceDurable &&
    (convergenceEvidenceScore < 75 || coherenceEvidenceScore < 75 || stabilizationDurabilityScore < 75);
  const coherentButUnresolved =
    governanceDecisionsConsistent &&
    coherenceEvidenceScore >= 80 &&
    (unresolvedDivergenceCount > 0 || unresolvedWarningCodes.length > 0 || !continuityImproving);
  const failClosedConvergenceRequired =
    suppressionWithoutResolutionDetected ||
    maskedInstabilitySuspected ||
    (input.failClosedElevatedCurrently === true && !convergenceDurable) ||
    (unresolvedDivergenceDetected && convergenceIntegrityScore < 70);

  return {
    governanceConfidenceScore,
    previousGovernanceConfidenceScore,
    baselineGovernanceConfidenceScore,
    riskScore,
    previousRiskScore,
    reviewBurdenScore,
    previousReviewBurdenScore,
    convergenceEvidenceScore,
    coherenceEvidenceScore,
    stabilizationDurabilityScore,
    governanceConfidenceDelta,
    riskDelta,
    reviewBurdenDelta,
    warningCountDelta,
    escalationCycleDelta,
    confidenceStabilizing,
    riskNormalizing,
    reviewBurdenNormalizing,
    warningPatternShrinking,
    escalationActivityReducing,
    governanceDecisionsConsistent,
    continuityImproving,
    insufficientEvidence,
    convergenceDurable,
    convergenceFragile,
    temporaryStabilizationSuspected,
    maskedInstabilitySuspected,
    unresolvedDivergenceDetected,
    suppressionWithoutResolutionDetected,
    coherentButUnresolved,
    signalAgreementScore,
    convergenceIntegrityScore,
    governanceCoherenceMaturityScore,
    convergenceIntegrityLevel,
    confidenceReliabilityLevel,
    suppressionRiskLevel,
    governanceCoherenceMaturity,
    signalAgreementSummary: {
      positiveSignalCount,
      conflictingSignalCount,
      unresolvedSignalCount,
    },
    failClosedConvergenceRequired,
    currentWarningCodes,
    previousWarningCodes,
    unresolvedWarningCodes,
    suppressedWarningCodes,
    resolutionReversalCount,
  };
};

const getClassificationSeverityAndStability = (
  input: CountyGovernanceConvergenceInput,
): {
  classification: CountyGovernanceConvergenceClassification;
  severity: CountyGovernanceConvergenceSeverity;
  stabilityLevel: CountyGovernanceConvergenceStabilityLevel;
} => {
  const signals = getSignals(input);

  if (signals.insufficientEvidence) {
    return { classification: "convergence_unverified", severity: "elevated", stabilityLevel: "unverified" };
  }

  if (signals.failClosedConvergenceRequired) {
    return { classification: "fail_closed_convergence_required", severity: "critical", stabilityLevel: "masked" };
  }

  if (signals.maskedInstabilitySuspected) {
    return { classification: "masked_instability", severity: "critical", stabilityLevel: "masked" };
  }

  if (signals.suppressionWithoutResolutionDetected) {
    return { classification: "warning_suppression_without_resolution", severity: "high", stabilityLevel: "masked" };
  }

  if (signals.unresolvedDivergenceDetected) {
    return { classification: "unresolved_divergence", severity: "high", stabilityLevel: "fragile" };
  }

  if (signals.coherentButUnresolved) {
    return { classification: "coherent_but_unresolved", severity: "elevated", stabilityLevel: "fragile" };
  }

  if (signals.temporaryStabilizationSuspected) {
    return { classification: "temporary_stabilization", severity: "elevated", stabilityLevel: "temporary" };
  }

  if (signals.convergenceFragile) {
    return { classification: "fragile_convergence", severity: "elevated", stabilityLevel: "fragile" };
  }

  if (signals.convergenceDurable) {
    return { classification: "durable_convergence", severity: "low", stabilityLevel: "durable" };
  }

  if (signals.governanceCoherenceMaturityScore >= 80 && signals.signalAgreementScore >= 60) {
    return { classification: "governance_coherence_maturing", severity: "moderate", stabilityLevel: "stable" };
  }

  return { classification: "stable_convergence_with_monitoring", severity: "moderate", stabilityLevel: "stable" };
};

const getWarningCodes = (input: CountyGovernanceConvergenceInput): CountyGovernanceConvergenceWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: CountyGovernanceConvergenceWarningCode[] = [];

  if (signals.insufficientEvidence) {
    warningCodes.push("INSUFFICIENT_CONVERGENCE_EVIDENCE");
  }

  if (signals.convergenceFragile) {
    warningCodes.push("CONVERGENCE_FRAGILE");
  }

  if (signals.temporaryStabilizationSuspected) {
    warningCodes.push("TEMPORARY_STABILIZATION_SUSPECTED");
  }

  if (signals.suppressionWithoutResolutionDetected) {
    warningCodes.push("WARNING_SUPPRESSION_WITHOUT_RESOLUTION");
  }

  if (signals.unresolvedDivergenceDetected) {
    warningCodes.push("UNRESOLVED_DIVERGENCE_REMAINS");
  }

  if (signals.maskedInstabilitySuspected) {
    warningCodes.push("MASKED_INSTABILITY_SUSPECTED");
  }

  if (!signals.confidenceStabilizing) {
    warningCodes.push("CONFIDENCE_STABILIZATION_WEAK");
  }

  if (signals.unresolvedWarningCodes.length > 0) {
    warningCodes.push("WARNING_CLUSTER_NOT_RESOLVED");
  }

  if (!signals.escalationActivityReducing && clampCount(input.previousEscalationCycleCount) > 0) {
    warningCodes.push("ESCALATION_REDUCTION_NOT_DURABLE");
  }

  if (!signals.reviewBurdenNormalizing) {
    warningCodes.push("REVIEW_BURDEN_NOT_NORMALIZED");
  }

  if (!signals.governanceDecisionsConsistent) {
    warningCodes.push("GOVERNANCE_DECISIONS_STILL_INCONSISTENT");
  }

  if (!signals.continuityImproving) {
    warningCodes.push("CONTINUITY_NOT_IMPROVING");
  }

  if (signals.coherentButUnresolved) {
    warningCodes.push("COHERENT_BUT_UNRESOLVED_STATE");
  }

  if (signals.failClosedConvergenceRequired) {
    warningCodes.push("FAIL_CLOSED_CONVERGENCE_REQUIRED");
  }

  return warningCodes;
};

const getReasons = (
  classification: CountyGovernanceConvergenceClassification,
  input: CountyGovernanceConvergenceInput,
): string[] => {
  const signals = getSignals(input);
  const reasons: string[] = [];

  if (classification === "durable_convergence") {
    reasons.push("Governance convergence is supported by durable signal agreement, warning reduction, and coherence evidence.");
  }

  if (classification === "stable_convergence_with_monitoring") {
    reasons.push("Governance convergence is stable enough for monitoring but does not meet durable convergence thresholds.");
  }

  if (classification === "convergence_unverified") {
    reasons.push("Convergence cannot be verified because identity or monitoring evidence is incomplete.");
  }

  if (!signals.confidenceStabilizing) {
    reasons.push("Governance confidence has not stabilized within deterministic convergence thresholds.");
  }

  if (!signals.riskNormalizing) {
    reasons.push("Risk posture is not normalizing strongly enough to prove convergence.");
  }

  if (!signals.reviewBurdenNormalizing) {
    reasons.push("Review burden has not normalized within the supplied monitoring window.");
  }

  if (!signals.warningPatternShrinking) {
    reasons.push("Warning patterns are not shrinking without unresolved warning residue.");
  }

  if (!signals.escalationActivityReducing && clampCount(input.previousEscalationCycleCount) > 0) {
    reasons.push("Escalation activity has not reduced durably.");
  }

  if (!signals.governanceDecisionsConsistent) {
    reasons.push("Governance decisions remain inconsistent or are changing across the review window.");
  }

  if (!signals.continuityImproving) {
    reasons.push("Continuity classification is not improving toward stronger governance stability.");
  }

  if (signals.suppressionWithoutResolutionDetected) {
    reasons.push("Warning suppression is present without enough resolution or durability evidence.");
  }

  if (signals.unresolvedDivergenceDetected) {
    reasons.push("Unresolved divergence remains beneath apparent convergence.");
  }

  if (signals.maskedInstabilitySuspected) {
    reasons.push("Improved surface signals may be masking risk, review burden, reversals, or suppressed warnings.");
  }

  return reasons;
};

const getRecommendations = (
  classification: CountyGovernanceConvergenceClassification,
): CountyGovernanceConvergenceRecommendation[] => {
  if (classification === "durable_convergence") {
    return [
      {
        recommendationType: "continue_monitoring",
        description: "Continue advisory-only monitoring with fail-closed execution controls preserved.",
        required: false,
      },
    ];
  }

  const recommendations: CountyGovernanceConvergenceRecommendation[] = [
    {
      recommendationType: "document",
      description: "Document convergence evidence, unresolved divergence, warning handling, and coherence rationale.",
      required: true,
    },
    {
      recommendationType: "continue_monitoring",
      description: "Keep convergence monitoring active before any future activation decision.",
      required: true,
    },
  ];

  if (
    classification === "warning_suppression_without_resolution" ||
    classification === "coherent_but_unresolved" ||
    classification === "unresolved_divergence" ||
    classification === "masked_instability" ||
    classification === "fail_closed_convergence_required"
  ) {
    recommendations.push({
      recommendationType: "review",
      description: "Route convergence signals for human governance review.",
      required: true,
    });
  }

  if (classification !== "governance_coherence_maturing" && classification !== "stable_convergence_with_monitoring") {
    recommendations.push({
      recommendationType: "restrict_planning",
      description: "Restrict advisory planning while convergence remains fragile, unresolved, masked, or unverified.",
      required: true,
    });
  }

  if (classification === "fail_closed_convergence_required") {
    recommendations.push({
      recommendationType: "maintain_fail_closed",
      description: "Maintain elevated fail-closed controls until convergence is durable and divergence is resolved.",
      required: true,
    });
  }

  return recommendations;
};

export function evaluateCountyGovernanceConvergence(
  input: CountyGovernanceConvergenceInput = {},
): CountyGovernanceConvergenceResult {
  const { classification, severity, stabilityLevel } = getClassificationSeverityAndStability(input);
  const signals = getSignals(input);
  const failClosedShouldRemainElevated =
    classification === "fail_closed_convergence_required" ||
    classification === "masked_instability" ||
    classification === "warning_suppression_without_resolution" ||
    input.failClosedElevatedCurrently === true;
  const planningMayContinue =
    classification === "durable_convergence" ||
    classification === "governance_coherence_maturing" ||
    classification === "stable_convergence_with_monitoring";

  return {
    convergenceClassification: classification,
    convergenceSeverity: severity,
    convergenceStabilityLevel: stabilityLevel,
    governanceConfidenceDelta: signals.governanceConfidenceDelta,
    riskDelta: signals.riskDelta,
    reviewBurdenDelta: signals.reviewBurdenDelta,
    warningCountDelta: signals.warningCountDelta,
    escalationCycleDelta: signals.escalationCycleDelta,
    confidenceStabilizing: signals.confidenceStabilizing,
    riskNormalizing: signals.riskNormalizing,
    reviewBurdenNormalizing: signals.reviewBurdenNormalizing,
    warningPatternShrinking: signals.warningPatternShrinking,
    escalationActivityReducing: signals.escalationActivityReducing,
    governanceDecisionsConsistent: signals.governanceDecisionsConsistent,
    continuityImproving: signals.continuityImproving,
    convergenceDurable: signals.convergenceDurable,
    convergenceFragile: signals.convergenceFragile,
    temporaryStabilizationSuspected: signals.temporaryStabilizationSuspected,
    maskedInstabilitySuspected: signals.maskedInstabilitySuspected,
    unresolvedDivergenceDetected: signals.unresolvedDivergenceDetected,
    suppressionWithoutResolutionDetected: signals.suppressionWithoutResolutionDetected,
    convergenceIntegrityLevel: signals.convergenceIntegrityLevel,
    confidenceReliabilityLevel: signals.confidenceReliabilityLevel,
    suppressionRiskLevel: signals.suppressionRiskLevel,
    governanceCoherenceMaturity: signals.governanceCoherenceMaturity,
    signalAgreementSummary: signals.signalAgreementSummary,
    planningMayContinue,
    monitoringRequired: classification !== "durable_convergence",
    failClosedShouldRemainElevated,
    warningCodes: getWarningCodes(input),
    convergenceReasons: getReasons(classification, input),
    recommendations: getRecommendations(classification),
    explainability: {
      summary: `${input.countyName ?? "Unknown county"} ${input.sourceName ?? "unknown source"} governance convergence evaluated with deterministic advisory-only rules.`,
      reviewedSignals: input.explainabilityContext?.reviewedSignals ?? [],
      reasons: input.explainabilityContext?.notes ?? [],
      deterministicRulesApplied: [
        "scores clamped between 0 and 100",
        "counts clamped to non-negative integers",
        "warning codes normalized with stable de-duplication",
        "positive convergence requires multiple agreeing stabilization signals",
        "warning disappearance alone cannot prove convergence",
        "suppressed warnings do not count as resolved warnings",
        "masked instability and unresolved divergence preserve fail-closed handling",
      ],
      durabilityEvidence: {
        stabilizationSignals: [
          signals.confidenceStabilizing ? "confidence stabilizing" : "confidence stabilization weak",
          signals.riskNormalizing ? "risk normalizing" : "risk not normalized",
          signals.reviewBurdenNormalizing ? "review burden normalizing" : "review burden not normalized",
        ],
        continuitySignals: [
          signals.continuityImproving ? "continuity improving" : "continuity not improving",
          signals.governanceDecisionsConsistent ? "governance decisions consistent" : "governance decisions inconsistent",
        ],
        divergenceSignals: [
          signals.unresolvedDivergenceDetected ? "unresolved divergence detected" : "no unresolved divergence detected",
          signals.maskedInstabilitySuspected ? "masked instability suspected" : "no masked instability suspected",
        ],
        suppressionSignals: [
          signals.suppressionWithoutResolutionDetected
            ? "suppression without resolution detected"
            : "no suppression without resolution detected",
          signals.suppressionRiskLevel,
        ],
      },
    },
    ingestionBlocked: CountyGovernanceConvergenceFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyGovernanceConvergenceFailClosedDefaults.automationBlocked,
    executionBlocked: CountyGovernanceConvergenceFailClosedDefaults.executionBlocked,
    planningOnly: CountyGovernanceConvergenceFailClosedDefaults.planningOnly,
    failClosed: CountyGovernanceConvergenceFailClosedDefaults.failClosed,
  };
}
