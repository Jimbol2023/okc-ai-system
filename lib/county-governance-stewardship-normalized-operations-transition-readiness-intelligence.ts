export type CountyGovernanceTransitionReadinessLevel =
  | "ready_for_bounded_normalized_operations_transition"
  | "bounded_transition_readiness"
  | "transition_continuation_required"
  | "transition_readiness_degrading"
  | "transition_readiness_unstable"
  | "fail_closed_transition_degradation"
  | "collapse_sensitive_transition";

export type CountyGovernanceTransitionExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceTransitionReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonTransitionViability =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_viable";

export type CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessWarningCode =
  | "TRANSITION_READINESS_WEAKNESS"
  | "TRANSITION_SURVIVABILITY_WEAKNESS"
  | "NORMALIZED_GOVERNANCE_CONTINUITY_READINESS_WEAKNESS"
  | "TRANSITION_CONTAINMENT_PERSISTENCE_RISK"
  | "TRANSITION_EXPLAINABILITY_CONTINUITY_DECAY"
  | "FAIL_CLOSED_TRANSITION_DEGRADATION"
  | "TRANSITION_FRAGMENTATION_RISK"
  | "TRANSITION_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_TRANSITION_DRIFT"
  | "TRANSITION_ENTROPY_RECURRENCE_RISK"
  | "TRANSITION_SATURATION_RISK"
  | "LONG_HORIZON_TRANSITION_VIABILITY_WEAKNESS"
  | "TRANSITION_REEVALUATION_REQUIRED"
  | "TRANSITION_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_TRANSITION";

export type CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessInput = {
  transitionReadinessScore: number;
  transitionSurvivabilityScore: number;
  normalizedGovernanceContinuityReadinessScore: number;
  transitionContainmentPersistenceScore: number;
  transitionExplainabilityContinuityScore: number;
  failClosedTransitionScore: number;
  transitionFragmentationRiskScore: number;
  transitionDesynchronizationRiskScore: number;
  recursiveTransitionDriftRiskScore: number;
  transitionEntropyRecurrenceRiskScore: number;
  transitionReevaluationPressureScore: number;
  transitionSaturationRiskScore: number;
  longHorizonTransitionViabilityScore: number;
};

export type CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessResult = {
  transitionReadinessLevel: CountyGovernanceTransitionReadinessLevel;
  transitionSeverityScore: number;
  transitionExposureLevel: CountyGovernanceTransitionExposureLevel;
  transitionReevaluationRequirementLevel: CountyGovernanceTransitionReevaluationRequirementLevel;
  longHorizonTransitionViability: CountyGovernanceLongHorizonTransitionViability;
  continuationRequired: boolean;
  failClosedTransitionDegrading: boolean;
  transitionFragmentationDetected: boolean;
  transitionDesynchronizationDetected: boolean;
  recursiveTransitionDriftDetected: boolean;
  transitionEntropyRecurrenceDetected: boolean;
  transitionSaturationDetected: boolean;
  collapseSensitiveTransitionEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryTransitionDriver: string;
    dominantTransitionEscalationReason: string;
    containmentTransitionAssessment: string;
    longHorizonTransitionAssessment: string;
    failClosedTransitionAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessWarningCode[] = [
  "FAIL_CLOSED_TRANSITION_DEGRADATION",
  "COLLAPSE_SENSITIVE_TRANSITION",
  "RECURSIVE_TRANSITION_DRIFT",
  "TRANSITION_ENTROPY_RECURRENCE_RISK",
  "TRANSITION_SATURATION_RISK",
  "TRANSITION_CONTAINMENT_PERSISTENCE_RISK",
  "TRANSITION_DESYNCHRONIZATION_RISK",
  "TRANSITION_FRAGMENTATION_RISK",
  "TRANSITION_SURVIVABILITY_WEAKNESS",
  "LONG_HORIZON_TRANSITION_VIABILITY_WEAKNESS",
  "TRANSITION_EXPLAINABILITY_CONTINUITY_DECAY",
  "NORMALIZED_GOVERNANCE_CONTINUITY_READINESS_WEAKNESS",
  "TRANSITION_READINESS_WEAKNESS",
  "TRANSITION_REEVALUATION_REQUIRED",
  "TRANSITION_CONTINUATION_REQUIRED",
];

function clampScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function inverseHealthScore(score: number): number {
  return 100 - score;
}

function maxScore(scores: number[]): number {
  return Math.max(...scores.map(clampScore));
}

function classifyExposure(score: number): CountyGovernanceTransitionExposureLevel {
  if (score >= 88) {
    return "critical";
  }

  if (score >= 72) {
    return "amplifying";
  }

  if (score >= 50) {
    return "elevated";
  }

  if (score >= 25) {
    return "contained";
  }

  return "minimal";
}

function classifyReevaluation(score: number): CountyGovernanceTransitionReevaluationRequirementLevel {
  if (score >= 80) {
    return "immediate";
  }

  if (score >= 58) {
    return "required";
  }

  if (score >= 35) {
    return "recommended";
  }

  return "none";
}

function classifyLongHorizonTransition(params: {
  transitionReadinessScore: number;
  transitionSurvivabilityScore: number;
  normalizedGovernanceContinuityReadinessScore: number;
  failClosedTransitionScore: number;
  transitionEntropyRecurrenceRiskScore: number;
  transitionSaturationRiskScore: number;
  longHorizonTransitionViabilityScore: number;
}): CountyGovernanceLongHorizonTransitionViability {
  if (
    params.transitionReadinessScore < 35 ||
    params.transitionSurvivabilityScore < 35 ||
    params.normalizedGovernanceContinuityReadinessScore < 35 ||
    params.failClosedTransitionScore < 35 ||
    params.longHorizonTransitionViabilityScore < 35 ||
    params.transitionEntropyRecurrenceRiskScore >= 88 ||
    params.transitionSaturationRiskScore >= 88
  ) {
    return "non_viable";
  }

  if (
    params.transitionReadinessScore < 55 ||
    params.transitionSurvivabilityScore < 55 ||
    params.normalizedGovernanceContinuityReadinessScore < 55 ||
    params.failClosedTransitionScore < 55 ||
    params.longHorizonTransitionViabilityScore < 55 ||
    params.transitionEntropyRecurrenceRiskScore >= 72 ||
    params.transitionSaturationRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.transitionReadinessScore < 75 ||
    params.transitionSurvivabilityScore < 75 ||
    params.normalizedGovernanceContinuityReadinessScore < 75 ||
    params.longHorizonTransitionViabilityScore < 75 ||
    params.transitionEntropyRecurrenceRiskScore >= 50 ||
    params.transitionSaturationRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.transitionReadinessScore < 88 ||
    params.transitionSurvivabilityScore < 88 ||
    params.normalizedGovernanceContinuityReadinessScore < 88 ||
    params.longHorizonTransitionViabilityScore < 88 ||
    params.transitionEntropyRecurrenceRiskScore >= 25 ||
    params.transitionSaturationRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  transitionReadinessWeakness: boolean;
  transitionSurvivabilityWeakness: boolean;
  normalizedContinuityWeakness: boolean;
  containmentPersistenceRisk: boolean;
  explainabilityDecay: boolean;
  failClosedDegradation: boolean;
  fragmentation: boolean;
  desynchronization: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  saturation: boolean;
  longHorizonViabilityWeakness: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessWarningCode[] {
  const warnings = new Set<CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessWarningCode>();

  if (params.transitionReadinessWeakness) {
    warnings.add("TRANSITION_READINESS_WEAKNESS");
  }

  if (params.transitionSurvivabilityWeakness) {
    warnings.add("TRANSITION_SURVIVABILITY_WEAKNESS");
  }

  if (params.normalizedContinuityWeakness) {
    warnings.add("NORMALIZED_GOVERNANCE_CONTINUITY_READINESS_WEAKNESS");
  }

  if (params.containmentPersistenceRisk) {
    warnings.add("TRANSITION_CONTAINMENT_PERSISTENCE_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("TRANSITION_EXPLAINABILITY_CONTINUITY_DECAY");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_TRANSITION_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("TRANSITION_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("TRANSITION_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_TRANSITION_DRIFT");
  }

  if (params.entropyRecurrence) {
    warnings.add("TRANSITION_ENTROPY_RECURRENCE_RISK");
  }

  if (params.saturation) {
    warnings.add("TRANSITION_SATURATION_RISK");
  }

  if (params.longHorizonViabilityWeakness) {
    warnings.add("LONG_HORIZON_TRANSITION_VIABILITY_WEAKNESS");
  }

  if (params.reevaluationRequired) {
    warnings.add("TRANSITION_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("TRANSITION_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_TRANSITION");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["stewardship normalized operations transition readiness", 0],
  )[0];
}

function classifyTransitionReadiness(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  saturation: boolean;
  containmentRisk: boolean;
  desynchronization: boolean;
  fragmentation: boolean;
  survivabilityWeakness: boolean;
  longHorizonWeakness: boolean;
  explainabilityDecay: boolean;
  normalizedContinuityWeakness: boolean;
  readinessWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceTransitionReadinessLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_transition_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_transition";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.saturation ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "transition_readiness_unstable";
  }

  if (
    params.survivabilityWeakness ||
    params.longHorizonWeakness ||
    params.explainabilityDecay ||
    params.normalizedContinuityWeakness ||
    params.readinessWeakness
  ) {
    return "transition_readiness_degrading";
  }

  if (params.continuationRequired) {
    return "transition_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_transition_readiness";
  }

  return "ready_for_bounded_normalized_operations_transition";
}

export function evaluateCountyGovernanceStewardshipNormalizedOperationsTransitionReadiness(
  input: CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessInput,
): CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessResult {
  const transitionReadinessScore = clampScore(input.transitionReadinessScore);
  const transitionSurvivabilityScore = clampScore(input.transitionSurvivabilityScore);
  const normalizedGovernanceContinuityReadinessScore = clampScore(
    input.normalizedGovernanceContinuityReadinessScore,
  );
  const transitionContainmentPersistenceScore = clampScore(input.transitionContainmentPersistenceScore);
  const transitionExplainabilityContinuityScore = clampScore(input.transitionExplainabilityContinuityScore);
  const failClosedTransitionScore = clampScore(input.failClosedTransitionScore);
  const transitionFragmentationRiskScore = clampScore(input.transitionFragmentationRiskScore);
  const transitionDesynchronizationRiskScore = clampScore(input.transitionDesynchronizationRiskScore);
  const recursiveTransitionDriftRiskScore = clampScore(input.recursiveTransitionDriftRiskScore);
  const transitionEntropyRecurrenceRiskScore = clampScore(input.transitionEntropyRecurrenceRiskScore);
  const transitionReevaluationPressureScore = clampScore(input.transitionReevaluationPressureScore);
  const transitionSaturationRiskScore = clampScore(input.transitionSaturationRiskScore);
  const longHorizonTransitionViabilityScore = clampScore(input.longHorizonTransitionViabilityScore);

  const failClosedTransitionDegrading = failClosedTransitionScore < 55;
  const transitionFragmentationDetected = transitionFragmentationRiskScore >= 45;
  const transitionDesynchronizationDetected = transitionDesynchronizationRiskScore >= 45;
  const recursiveTransitionDriftDetected = recursiveTransitionDriftRiskScore >= 45;
  const transitionEntropyRecurrenceDetected = transitionEntropyRecurrenceRiskScore >= 45;
  const transitionSaturationDetected = transitionSaturationRiskScore >= 45;
  const transitionContainmentPersistenceRisk = transitionContainmentPersistenceScore < 55;
  const transitionSurvivabilityWeakness = transitionSurvivabilityScore < 55;
  const transitionExplainabilityDecay = transitionExplainabilityContinuityScore < 55;
  const longHorizonTransitionViabilityWeakness = longHorizonTransitionViabilityScore < 55;
  const normalizedGovernanceContinuityReadinessWeakness =
    normalizedGovernanceContinuityReadinessScore < 75;
  const transitionReadinessWeakness = transitionReadinessScore < 75;
  const collapseSensitiveTransitionEscalation =
    (recursiveTransitionDriftRiskScore >= 88 ||
      transitionEntropyRecurrenceRiskScore >= 88 ||
      transitionDesynchronizationRiskScore >= 88 ||
      transitionFragmentationRiskScore >= 88 ||
      transitionSaturationRiskScore >= 88) &&
    (failClosedTransitionScore < 65 || transitionSurvivabilityScore < 55);
  const reevaluationRequired =
    transitionReevaluationPressureScore >= 58 ||
    transitionSurvivabilityWeakness ||
    transitionContainmentPersistenceRisk ||
    transitionExplainabilityDecay ||
    longHorizonTransitionViabilityWeakness ||
    transitionFragmentationDetected ||
    transitionDesynchronizationDetected ||
    transitionSaturationDetected;

  const transitionSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(transitionReadinessScore),
      inverseHealthScore(transitionSurvivabilityScore),
      inverseHealthScore(normalizedGovernanceContinuityReadinessScore),
      inverseHealthScore(transitionContainmentPersistenceScore),
      inverseHealthScore(transitionExplainabilityContinuityScore),
      inverseHealthScore(failClosedTransitionScore),
      transitionFragmentationRiskScore,
      transitionDesynchronizationRiskScore,
      recursiveTransitionDriftRiskScore,
      transitionEntropyRecurrenceRiskScore,
      transitionReevaluationPressureScore,
      transitionSaturationRiskScore,
      inverseHealthScore(longHorizonTransitionViabilityScore),
    ]),
  );

  const longHorizonTransitionViability = classifyLongHorizonTransition({
    transitionReadinessScore,
    transitionSurvivabilityScore,
    normalizedGovernanceContinuityReadinessScore,
    failClosedTransitionScore,
    transitionEntropyRecurrenceRiskScore,
    transitionSaturationRiskScore,
    longHorizonTransitionViabilityScore,
  });
  const transitionExposureLevel = classifyExposure(transitionSeverityScore);
  const transitionReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      transitionSeverityScore,
      transitionReevaluationPressureScore,
      transitionEntropyRecurrenceRiskScore,
      recursiveTransitionDriftRiskScore,
      transitionDesynchronizationRiskScore,
      transitionFragmentationRiskScore,
      transitionSaturationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedTransitionDegrading &&
    !collapseSensitiveTransitionEscalation &&
    !recursiveTransitionDriftDetected &&
    !transitionEntropyRecurrenceDetected &&
    !transitionSaturationDetected &&
    !transitionContainmentPersistenceRisk &&
    !transitionDesynchronizationDetected &&
    !transitionFragmentationDetected &&
    transitionSeverityScore >= 35 &&
    transitionSeverityScore < 72;

  const warningCodes = buildWarnings({
    transitionReadinessWeakness,
    transitionSurvivabilityWeakness,
    normalizedContinuityWeakness: normalizedGovernanceContinuityReadinessWeakness,
    containmentPersistenceRisk: transitionContainmentPersistenceRisk,
    explainabilityDecay: transitionExplainabilityDecay,
    failClosedDegradation: failClosedTransitionDegrading,
    fragmentation: transitionFragmentationDetected,
    desynchronization: transitionDesynchronizationDetected,
    recursiveDrift: recursiveTransitionDriftDetected,
    entropyRecurrence: transitionEntropyRecurrenceDetected,
    saturation: transitionSaturationDetected,
    longHorizonViabilityWeakness: longHorizonTransitionViabilityWeakness,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveTransitionEscalation,
  });

  const transitionReadinessLevel = classifyTransitionReadiness({
    failClosedDegradation: failClosedTransitionDegrading,
    collapseSensitive: collapseSensitiveTransitionEscalation,
    recursiveDrift: recursiveTransitionDriftDetected,
    entropyRecurrence: transitionEntropyRecurrenceDetected,
    saturation: transitionSaturationDetected,
    containmentRisk: transitionContainmentPersistenceRisk,
    desynchronization: transitionDesynchronizationDetected,
    fragmentation: transitionFragmentationDetected,
    survivabilityWeakness: transitionSurvivabilityWeakness,
    longHorizonWeakness: longHorizonTransitionViabilityWeakness,
    explainabilityDecay: transitionExplainabilityDecay,
    normalizedContinuityWeakness: normalizedGovernanceContinuityReadinessWeakness,
    readinessWeakness: transitionReadinessWeakness,
    continuationRequired,
    severityScore: transitionSeverityScore,
  });

  const primaryTransitionDriver = selectPrimaryDriver({
    "transition readiness weakness": inverseHealthScore(transitionReadinessScore),
    "transition survivability weakness": inverseHealthScore(transitionSurvivabilityScore),
    "normalized governance continuity readiness weakness": inverseHealthScore(
      normalizedGovernanceContinuityReadinessScore,
    ),
    "transition containment persistence risk": inverseHealthScore(transitionContainmentPersistenceScore),
    "transition explainability continuity decay": inverseHealthScore(transitionExplainabilityContinuityScore),
    "fail-closed transition degradation": inverseHealthScore(failClosedTransitionScore),
    "transition fragmentation risk": transitionFragmentationRiskScore,
    "transition desynchronization risk": transitionDesynchronizationRiskScore,
    "recursive transition drift": recursiveTransitionDriftRiskScore,
    "transition entropy recurrence risk": transitionEntropyRecurrenceRiskScore,
    "transition reevaluation pressure": transitionReevaluationPressureScore,
    "transition saturation risk": transitionSaturationRiskScore,
    "long-horizon transition viability weakness": inverseHealthScore(longHorizonTransitionViabilityScore),
  });

  return {
    transitionReadinessLevel,
    transitionSeverityScore,
    transitionExposureLevel,
    transitionReevaluationRequirementLevel,
    longHorizonTransitionViability,
    continuationRequired,
    failClosedTransitionDegrading,
    transitionFragmentationDetected,
    transitionDesynchronizationDetected,
    recursiveTransitionDriftDetected,
    transitionEntropyRecurrenceDetected,
    transitionSaturationDetected,
    collapseSensitiveTransitionEscalation,
    warningCodes,
    explainability: {
      primaryTransitionDriver,
      dominantTransitionEscalationReason:
        warningCodes[0] ?? "No deterministic normalized operations transition escalation threshold was crossed.",
      containmentTransitionAssessment: transitionContainmentPersistenceRisk
        ? "Transition containment persistence is not strong enough to preserve normalized operations transition readiness."
        : "Transition containment persistence remains readiness-preserving for the current caller-supplied governance context.",
      longHorizonTransitionAssessment:
        longHorizonTransitionViability === "durable"
          ? "Long-horizon normalized operations transition viability is durable under the current inputs. Transition readiness does not imply permanent governance recovery, irreversible normalization, or permanent stabilization."
          : `Long-horizon normalized operations transition viability is ${longHorizonTransitionViability} under the current inputs. Stewardship archival survivability does not guarantee normalized operations readiness.`,
      failClosedTransitionAssessment: failClosedTransitionDegrading
        ? "Fail-closed transition protection is degrading and overrides optimistic normalized operations readiness assumptions."
        : "Fail-closed transition protection remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
