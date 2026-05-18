/**
 * Deterministic advisory-only County Source Governance Drift Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied governance drift signals and
 * never activates runtime providers, county-source operations, ingestion, or automation.
 */

export type CountyGovernanceDriftClassification =
  | "no_drift_detected"
  | "minor_monitoring_drift"
  | "confidence_erosion"
  | "risk_posture_degradation"
  | "warning_pattern_expansion"
  | "escalation_threshold_instability"
  | "governance_decision_inconsistency"
  | "continuity_deterioration"
  | "hidden_instability_suspected"
  | "fail_closed_tightening_required"
  | "drift_unverified";

export type CountyGovernanceDriftSeverity = "low" | "moderate" | "elevated" | "high" | "critical";

export type CountyGovernanceDriftWarningCode =
  | "INSUFFICIENT_DRIFT_EVIDENCE"
  | "GOVERNANCE_CONFIDENCE_ERODING"
  | "RISK_POSTURE_DEGRADING"
  | "ESCALATION_THRESHOLD_UNSTABLE"
  | "WARNING_PATTERN_EXPANDING"
  | "GOVERNANCE_DECISION_INCONSISTENCY"
  | "CONTINUITY_CLASSIFICATION_DETERIORATED"
  | "REVIEW_BURDEN_INCREASING"
  | "RESOLUTION_REVERSALS_DETECTED"
  | "HIDDEN_INSTABILITY_SUSPECTED"
  | "FAIL_CLOSED_TIGHTENING_RECOMMENDED";

export interface CountyGovernanceDriftExplainability {
  summary: string;
  reviewedSignals: readonly string[];
  reasons: readonly string[];
  deterministicRulesApplied: readonly string[];
}

export interface CountyGovernanceDriftRecommendation {
  recommendationType: "continue_monitoring" | "document" | "review" | "restrict_planning" | "tighten_fail_closed";
  description: string;
  required: boolean;
}

export interface CountySourceGovernanceDriftInput {
  countyName?: string | null;
  sourceName?: string | null;
  sourceType?: string | null;
  currentGovernanceConfidenceScore?: number | null;
  previousGovernanceConfidenceScore?: number | null;
  baselineGovernanceConfidenceScore?: number | null;
  currentRiskScore?: number | null;
  previousRiskScore?: number | null;
  baselineRiskScore?: number | null;
  currentReviewBurdenScore?: number | null;
  previousReviewBurdenScore?: number | null;
  currentContinuityClassification?: string | null;
  previousContinuityClassification?: string | null;
  escalationThresholdChangeCount?: number | null;
  escalationCycleCount?: number | null;
  resolutionReversalCount?: number | null;
  governanceDecisionChangeCount?: number | null;
  inconsistentDecisionCount?: number | null;
  warningCodeHistory?: string[];
  currentWarningCodes?: string[];
  newlyIntroducedWarningCodes?: string[];
  monitoringWindowComplete?: boolean | null;
  failClosedElevatedCurrently?: boolean | null;
  explainabilityContext?: {
    reviewedSignals?: string[];
    notes?: string[];
  };
}

export interface CountySourceGovernanceDriftResult {
  driftClassification: CountyGovernanceDriftClassification;
  driftSeverity: CountyGovernanceDriftSeverity;
  governanceConfidenceScore: number;
  previousGovernanceConfidenceScore: number;
  baselineGovernanceConfidenceScore: number;
  riskScore: number;
  previousRiskScore: number;
  baselineRiskScore: number;
  reviewBurdenScore: number;
  previousReviewBurdenScore: number;
  governanceConfidenceDelta: number;
  riskDelta: number;
  baselineConfidenceDelta: number;
  baselineRiskDelta: number;
  reviewBurdenDelta: number;
  confidenceTrend: "improving" | "stable" | "eroding" | "unverified";
  riskTrend: "improving" | "stable" | "degrading" | "unverified";
  reviewBurdenTrend: "decreasing" | "stable" | "increasing" | "unverified";
  warningPatternExpanded: boolean;
  escalationThresholdUnstable: boolean;
  governanceDecisionInconsistencyDetected: boolean;
  continuityDeteriorationDetected: boolean;
  hiddenInstabilitySuspected: boolean;
  failClosedShouldTighten: boolean;
  planningMayContinue: boolean;
  monitoringRequired: boolean;
  warningCodes: CountyGovernanceDriftWarningCode[];
  driftReasons: string[];
  recommendations: CountyGovernanceDriftRecommendation[];
  explainability: CountyGovernanceDriftExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountySourceGovernanceDriftFailClosedDefaults = {
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

const hasIdentity = (input: CountySourceGovernanceDriftInput): boolean =>
  Boolean(input.countyName?.trim() && input.sourceName?.trim() && input.sourceType?.trim());

const scoreProvided = (score: number | null | undefined): boolean => typeof score === "number" && !Number.isNaN(score);

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

const getConfidenceTrend = (
  input: CountySourceGovernanceDriftInput,
  confidenceDelta: number,
): CountySourceGovernanceDriftResult["confidenceTrend"] => {
  if (!scoreProvided(input.previousGovernanceConfidenceScore)) {
    return "unverified";
  }

  if (confidenceDelta <= -10) {
    return "eroding";
  }

  if (confidenceDelta >= 10) {
    return "improving";
  }

  return "stable";
};

const getRiskTrend = (
  input: CountySourceGovernanceDriftInput,
  riskDelta: number,
): CountySourceGovernanceDriftResult["riskTrend"] => {
  if (!scoreProvided(input.previousRiskScore)) {
    return "unverified";
  }

  if (riskDelta >= 10) {
    return "degrading";
  }

  if (riskDelta <= -10) {
    return "improving";
  }

  return "stable";
};

const getReviewBurdenTrend = (
  input: CountySourceGovernanceDriftInput,
  reviewBurdenDelta: number,
): CountySourceGovernanceDriftResult["reviewBurdenTrend"] => {
  if (!scoreProvided(input.previousReviewBurdenScore)) {
    return "unverified";
  }

  if (reviewBurdenDelta >= 10) {
    return "increasing";
  }

  if (reviewBurdenDelta <= -10) {
    return "decreasing";
  }

  return "stable";
};

const getSignals = (input: CountySourceGovernanceDriftInput = {}) => {
  const governanceConfidenceScore = clampScore(input.currentGovernanceConfidenceScore);
  const previousGovernanceConfidenceScore = clampScore(input.previousGovernanceConfidenceScore);
  const baselineGovernanceConfidenceScore = clampScore(input.baselineGovernanceConfidenceScore);
  const riskScore = clampScore(input.currentRiskScore);
  const previousRiskScore = clampScore(input.previousRiskScore);
  const baselineRiskScore = clampScore(input.baselineRiskScore);
  const reviewBurdenScore = clampScore(input.currentReviewBurdenScore);
  const previousReviewBurdenScore = clampScore(input.previousReviewBurdenScore);
  const governanceConfidenceDelta = governanceConfidenceScore - previousGovernanceConfidenceScore;
  const riskDelta = riskScore - previousRiskScore;
  const baselineConfidenceDelta = governanceConfidenceScore - baselineGovernanceConfidenceScore;
  const baselineRiskDelta = riskScore - baselineRiskScore;
  const reviewBurdenDelta = reviewBurdenScore - previousReviewBurdenScore;
  const confidenceTrend = getConfidenceTrend(input, governanceConfidenceDelta);
  const riskTrend = getRiskTrend(input, riskDelta);
  const reviewBurdenTrend = getReviewBurdenTrend(input, reviewBurdenDelta);
  const escalationThresholdChangeCount = clampCount(input.escalationThresholdChangeCount);
  const escalationCycleCount = clampCount(input.escalationCycleCount);
  const resolutionReversalCount = clampCount(input.resolutionReversalCount);
  const governanceDecisionChangeCount = clampCount(input.governanceDecisionChangeCount);
  const inconsistentDecisionCount = clampCount(input.inconsistentDecisionCount);
  const warningCodeHistory = normalizeWarnings(input.warningCodeHistory);
  const currentWarningCodes = normalizeWarnings(input.currentWarningCodes);
  const newlyIntroducedWarningCodes = normalizeWarnings(input.newlyIntroducedWarningCodes);
  const previousContinuityRank = getContinuityRank(input.previousContinuityClassification);
  const currentContinuityRank = getContinuityRank(input.currentContinuityClassification);
  const insufficientEvidence =
    !hasIdentity(input) ||
    input.monitoringWindowComplete !== true ||
    !scoreProvided(input.previousGovernanceConfidenceScore) ||
    !scoreProvided(input.previousRiskScore);
  const confidenceEroding =
    confidenceTrend === "eroding" || (scoreProvided(input.baselineGovernanceConfidenceScore) && baselineConfidenceDelta <= -15);
  const riskDegrading = riskTrend === "degrading" || (scoreProvided(input.baselineRiskScore) && baselineRiskDelta >= 15);
  const reviewBurdenIncreasing = reviewBurdenTrend === "increasing";
  const warningPatternExpanded =
    newlyIntroducedWarningCodes.length > 0 ||
    currentWarningCodes.some((warningCode) => !warningCodeHistory.includes(warningCode)) ||
    currentWarningCodes.length >= warningCodeHistory.length + 2;
  const escalationThresholdUnstable = escalationThresholdChangeCount >= 2 || escalationCycleCount >= 3;
  const governanceDecisionInconsistencyDetected =
    governanceDecisionChangeCount >= 2 || inconsistentDecisionCount > 0;
  const continuityDeteriorationDetected =
    previousContinuityRank !== null && currentContinuityRank !== null && currentContinuityRank > previousContinuityRank;
  const hiddenInstabilitySuspected =
    resolutionReversalCount > 0 ||
    (confidenceEroding && riskDegrading) ||
    (warningPatternExpanded && escalationThresholdUnstable) ||
    (governanceDecisionInconsistencyDetected && continuityDeteriorationDetected);
  const failClosedShouldTighten =
    hiddenInstabilitySuspected ||
    (confidenceEroding && riskDegrading) ||
    (input.failClosedElevatedCurrently === true &&
      (confidenceEroding || riskDegrading || escalationThresholdUnstable || governanceDecisionInconsistencyDetected));

  return {
    governanceConfidenceScore,
    previousGovernanceConfidenceScore,
    baselineGovernanceConfidenceScore,
    riskScore,
    previousRiskScore,
    baselineRiskScore,
    reviewBurdenScore,
    previousReviewBurdenScore,
    governanceConfidenceDelta,
    riskDelta,
    baselineConfidenceDelta,
    baselineRiskDelta,
    reviewBurdenDelta,
    confidenceTrend,
    riskTrend,
    reviewBurdenTrend,
    insufficientEvidence,
    confidenceEroding,
    riskDegrading,
    reviewBurdenIncreasing,
    warningPatternExpanded,
    escalationThresholdUnstable,
    governanceDecisionInconsistencyDetected,
    continuityDeteriorationDetected,
    hiddenInstabilitySuspected,
    failClosedShouldTighten,
  };
};

const getClassificationAndSeverity = (
  input: CountySourceGovernanceDriftInput,
): {
  classification: CountyGovernanceDriftClassification;
  severity: CountyGovernanceDriftSeverity;
} => {
  const signals = getSignals(input);

  if (signals.insufficientEvidence) {
    return { classification: "drift_unverified", severity: "elevated" };
  }

  if (signals.failClosedShouldTighten) {
    return { classification: "fail_closed_tightening_required", severity: "critical" };
  }

  if (signals.hiddenInstabilitySuspected) {
    return { classification: "hidden_instability_suspected", severity: "high" };
  }

  if (signals.governanceDecisionInconsistencyDetected) {
    return { classification: "governance_decision_inconsistency", severity: "high" };
  }

  if (signals.continuityDeteriorationDetected) {
    return { classification: "continuity_deterioration", severity: "high" };
  }

  if (signals.escalationThresholdUnstable) {
    return { classification: "escalation_threshold_instability", severity: "elevated" };
  }

  if (signals.riskDegrading) {
    return { classification: "risk_posture_degradation", severity: "elevated" };
  }

  if (signals.confidenceEroding) {
    return { classification: "confidence_erosion", severity: "elevated" };
  }

  if (signals.warningPatternExpanded) {
    return { classification: "warning_pattern_expansion", severity: "moderate" };
  }

  if (signals.reviewBurdenIncreasing) {
    return { classification: "minor_monitoring_drift", severity: "moderate" };
  }

  return { classification: "no_drift_detected", severity: "low" };
};

const getWarningCodes = (input: CountySourceGovernanceDriftInput): CountyGovernanceDriftWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: CountyGovernanceDriftWarningCode[] = [];

  if (signals.insufficientEvidence) {
    warningCodes.push("INSUFFICIENT_DRIFT_EVIDENCE");
  }

  if (signals.confidenceEroding) {
    warningCodes.push("GOVERNANCE_CONFIDENCE_ERODING");
  }

  if (signals.riskDegrading) {
    warningCodes.push("RISK_POSTURE_DEGRADING");
  }

  if (signals.escalationThresholdUnstable) {
    warningCodes.push("ESCALATION_THRESHOLD_UNSTABLE");
  }

  if (signals.warningPatternExpanded) {
    warningCodes.push("WARNING_PATTERN_EXPANDING");
  }

  if (signals.governanceDecisionInconsistencyDetected) {
    warningCodes.push("GOVERNANCE_DECISION_INCONSISTENCY");
  }

  if (signals.continuityDeteriorationDetected) {
    warningCodes.push("CONTINUITY_CLASSIFICATION_DETERIORATED");
  }

  if (signals.reviewBurdenIncreasing) {
    warningCodes.push("REVIEW_BURDEN_INCREASING");
  }

  if (clampCount(input.resolutionReversalCount) > 0) {
    warningCodes.push("RESOLUTION_REVERSALS_DETECTED");
  }

  if (signals.hiddenInstabilitySuspected) {
    warningCodes.push("HIDDEN_INSTABILITY_SUSPECTED");
  }

  if (signals.failClosedShouldTighten) {
    warningCodes.push("FAIL_CLOSED_TIGHTENING_RECOMMENDED");
  }

  return warningCodes;
};

const getReasons = (
  classification: CountyGovernanceDriftClassification,
  input: CountySourceGovernanceDriftInput,
): string[] => {
  const signals = getSignals(input);
  const reasons: string[] = [];

  if (classification === "no_drift_detected") {
    reasons.push("Governance drift signals remain stable across the supplied monitoring window.");
  }

  if (classification === "drift_unverified") {
    reasons.push("Governance drift cannot be fully verified from the supplied monitoring evidence.");
  }

  if (!hasIdentity(input)) {
    reasons.push("County source identity is incomplete, so drift review must remain conservative.");
  }

  if (signals.confidenceEroding) {
    reasons.push("Governance confidence is eroding against prior or baseline signals.");
  }

  if (signals.riskDegrading) {
    reasons.push("Risk posture is degrading against prior or baseline signals.");
  }

  if (signals.warningPatternExpanded) {
    reasons.push("Warning patterns expanded beyond the known governance warning history.");
  }

  if (signals.escalationThresholdUnstable) {
    reasons.push("Escalation threshold changes or escalation cycles indicate unstable governance handling.");
  }

  if (signals.governanceDecisionInconsistencyDetected) {
    reasons.push("Governance decisions are changing or conflicting across the supplied review window.");
  }

  if (signals.continuityDeteriorationDetected) {
    reasons.push("Continuity classification deteriorated across the supplied governance window.");
  }

  if (signals.reviewBurdenIncreasing) {
    reasons.push("Review burden is increasing and should remain attached to advisory planning.");
  }

  if (signals.hiddenInstabilitySuspected) {
    reasons.push("Combined drift signals suggest hidden governance instability.");
  }

  if (signals.failClosedShouldTighten) {
    reasons.push("Fail-closed protections should tighten proactively under current drift conditions.");
  }

  return reasons;
};

const getRecommendations = (
  classification: CountyGovernanceDriftClassification,
): CountyGovernanceDriftRecommendation[] => {
  if (classification === "no_drift_detected") {
    return [
      {
        recommendationType: "continue_monitoring",
        description: "Continue advisory-only monitoring with fail-closed execution controls preserved.",
        required: false,
      },
    ];
  }

  const recommendations: CountyGovernanceDriftRecommendation[] = [
    {
      recommendationType: "document",
      description: "Document drift evidence, warning changes, and governance decision movement.",
      required: true,
    },
    {
      recommendationType: "continue_monitoring",
      description: "Keep drift monitoring active before any future activation decision.",
      required: true,
    },
  ];

  if (
    classification === "governance_decision_inconsistency" ||
    classification === "continuity_deterioration" ||
    classification === "hidden_instability_suspected" ||
    classification === "fail_closed_tightening_required"
  ) {
    recommendations.push({
      recommendationType: "review",
      description: "Route governance drift signals for human review.",
      required: true,
    });
  }

  if (classification !== "minor_monitoring_drift" && classification !== "warning_pattern_expansion") {
    recommendations.push({
      recommendationType: "restrict_planning",
      description: "Restrict advisory planning while drift remains unverified, degrading, or inconsistent.",
      required: true,
    });
  }

  if (classification === "fail_closed_tightening_required") {
    recommendations.push({
      recommendationType: "tighten_fail_closed",
      description: "Tighten fail-closed restrictions until governance drift stabilizes.",
      required: true,
    });
  }

  return recommendations;
};

export function evaluateCountySourceGovernanceDrift(
  input: CountySourceGovernanceDriftInput = {},
): CountySourceGovernanceDriftResult {
  const { classification, severity } = getClassificationAndSeverity(input);
  const signals = getSignals(input);
  const warningCodes = getWarningCodes(input);
  const failClosedShouldTighten =
    signals.failClosedShouldTighten || classification === "fail_closed_tightening_required" || severity === "critical";
  const planningMayContinue = classification === "no_drift_detected" || classification === "minor_monitoring_drift";

  return {
    driftClassification: classification,
    driftSeverity: severity,
    governanceConfidenceScore: signals.governanceConfidenceScore,
    previousGovernanceConfidenceScore: signals.previousGovernanceConfidenceScore,
    baselineGovernanceConfidenceScore: signals.baselineGovernanceConfidenceScore,
    riskScore: signals.riskScore,
    previousRiskScore: signals.previousRiskScore,
    baselineRiskScore: signals.baselineRiskScore,
    reviewBurdenScore: signals.reviewBurdenScore,
    previousReviewBurdenScore: signals.previousReviewBurdenScore,
    governanceConfidenceDelta: signals.governanceConfidenceDelta,
    riskDelta: signals.riskDelta,
    baselineConfidenceDelta: signals.baselineConfidenceDelta,
    baselineRiskDelta: signals.baselineRiskDelta,
    reviewBurdenDelta: signals.reviewBurdenDelta,
    confidenceTrend: signals.confidenceTrend,
    riskTrend: signals.riskTrend,
    reviewBurdenTrend: signals.reviewBurdenTrend,
    warningPatternExpanded: signals.warningPatternExpanded,
    escalationThresholdUnstable: signals.escalationThresholdUnstable,
    governanceDecisionInconsistencyDetected: signals.governanceDecisionInconsistencyDetected,
    continuityDeteriorationDetected: signals.continuityDeteriorationDetected,
    hiddenInstabilitySuspected: signals.hiddenInstabilitySuspected,
    failClosedShouldTighten,
    planningMayContinue,
    monitoringRequired: classification !== "no_drift_detected",
    warningCodes,
    driftReasons: getReasons(classification, input),
    recommendations: getRecommendations(classification),
    explainability: {
      summary: `${input.countyName ?? "Unknown county"} ${input.sourceName ?? "unknown source"} governance drift evaluated with deterministic advisory-only rules.`,
      reviewedSignals: input.explainabilityContext?.reviewedSignals ?? [],
      reasons: input.explainabilityContext?.notes ?? [],
      deterministicRulesApplied: [
        "scores clamped between 0 and 100",
        "counts clamped to non-negative integers",
        "missing monitoring evidence defaults to conservative drift-unverified handling",
        "confidence erosion and risk degradation use fixed delta thresholds",
        "warning expansion, escalation instability, and decision inconsistency cannot loosen fail-closed controls",
        "combined drift signals recommend proactive fail-closed tightening",
      ],
    },
    ingestionBlocked: CountySourceGovernanceDriftFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountySourceGovernanceDriftFailClosedDefaults.automationBlocked,
    executionBlocked: CountySourceGovernanceDriftFailClosedDefaults.executionBlocked,
    planningOnly: CountySourceGovernanceDriftFailClosedDefaults.planningOnly,
    failClosed: CountySourceGovernanceDriftFailClosedDefaults.failClosed,
  };
}
