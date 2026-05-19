export type CountyGovernanceBoundedActivationReadinessLevel =
  | "ready_for_bounded_activation"
  | "bounded_activation_readiness"
  | "activation_continuation_required"
  | "activation_readiness_degrading"
  | "activation_readiness_unstable"
  | "fail_closed_activation_degradation"
  | "collapse_sensitive_activation";

export type CountyGovernanceActivationExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceActivationReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonActivationViability =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_viable";

export type CountyGovernanceNormalizedOperationsBoundedActivationReadinessWarningCode =
  | "ACTIVATION_READINESS_WEAKNESS"
  | "ACTIVATION_SURVIVABILITY_WEAKNESS"
  | "OPERATIONAL_CONTINUITY_READINESS_WEAKNESS"
  | "ACTIVATION_CONTAINMENT_PERSISTENCE_RISK"
  | "ACTIVATION_EXPLAINABILITY_CONTINUITY_DECAY"
  | "FAIL_CLOSED_ACTIVATION_DEGRADATION"
  | "ACTIVATION_FRAGMENTATION_RISK"
  | "ACTIVATION_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_ACTIVATION_DRIFT"
  | "ACTIVATION_ENTROPY_RECURRENCE_RISK"
  | "ACTIVATION_SATURATION_RISK"
  | "LONG_HORIZON_ACTIVATION_VIABILITY_WEAKNESS"
  | "ACTIVATION_REEVALUATION_REQUIRED"
  | "ACTIVATION_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_ACTIVATION";

export type CountyGovernanceNormalizedOperationsBoundedActivationReadinessInput = {
  activationReadinessScore: number;
  activationSurvivabilityScore: number;
  operationalContinuityReadinessScore: number;
  activationContainmentPersistenceScore: number;
  activationExplainabilityContinuityScore: number;
  failClosedActivationScore: number;
  activationFragmentationRiskScore: number;
  activationDesynchronizationRiskScore: number;
  recursiveActivationDriftRiskScore: number;
  activationEntropyRecurrenceRiskScore: number;
  activationReevaluationPressureScore: number;
  activationSaturationRiskScore: number;
  longHorizonActivationViabilityScore: number;
};

export type CountyGovernanceNormalizedOperationsBoundedActivationReadinessResult = {
  boundedActivationReadinessLevel: CountyGovernanceBoundedActivationReadinessLevel;
  activationSeverityScore: number;
  activationExposureLevel: CountyGovernanceActivationExposureLevel;
  activationReevaluationRequirementLevel: CountyGovernanceActivationReevaluationRequirementLevel;
  longHorizonActivationViability: CountyGovernanceLongHorizonActivationViability;
  continuationRequired: boolean;
  failClosedActivationDegrading: boolean;
  activationFragmentationDetected: boolean;
  activationDesynchronizationDetected: boolean;
  recursiveActivationDriftDetected: boolean;
  activationEntropyRecurrenceDetected: boolean;
  activationSaturationDetected: boolean;
  collapseSensitiveActivationEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryActivationDriver: string;
    dominantActivationEscalationReason: string;
    containmentActivationAssessment: string;
    longHorizonActivationAssessment: string;
    failClosedActivationAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceNormalizedOperationsBoundedActivationReadinessWarningCode[] = [
  "FAIL_CLOSED_ACTIVATION_DEGRADATION",
  "COLLAPSE_SENSITIVE_ACTIVATION",
  "RECURSIVE_ACTIVATION_DRIFT",
  "ACTIVATION_ENTROPY_RECURRENCE_RISK",
  "ACTIVATION_SATURATION_RISK",
  "ACTIVATION_CONTAINMENT_PERSISTENCE_RISK",
  "ACTIVATION_DESYNCHRONIZATION_RISK",
  "ACTIVATION_FRAGMENTATION_RISK",
  "ACTIVATION_SURVIVABILITY_WEAKNESS",
  "LONG_HORIZON_ACTIVATION_VIABILITY_WEAKNESS",
  "ACTIVATION_EXPLAINABILITY_CONTINUITY_DECAY",
  "OPERATIONAL_CONTINUITY_READINESS_WEAKNESS",
  "ACTIVATION_READINESS_WEAKNESS",
  "ACTIVATION_REEVALUATION_REQUIRED",
  "ACTIVATION_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceActivationExposureLevel {
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

function classifyReevaluation(score: number): CountyGovernanceActivationReevaluationRequirementLevel {
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

function classifyLongHorizonActivation(params: {
  activationReadinessScore: number;
  activationSurvivabilityScore: number;
  operationalContinuityReadinessScore: number;
  failClosedActivationScore: number;
  activationEntropyRecurrenceRiskScore: number;
  activationSaturationRiskScore: number;
  longHorizonActivationViabilityScore: number;
}): CountyGovernanceLongHorizonActivationViability {
  if (
    params.activationReadinessScore < 35 ||
    params.activationSurvivabilityScore < 35 ||
    params.operationalContinuityReadinessScore < 35 ||
    params.failClosedActivationScore < 35 ||
    params.longHorizonActivationViabilityScore < 35 ||
    params.activationEntropyRecurrenceRiskScore >= 88 ||
    params.activationSaturationRiskScore >= 88
  ) {
    return "non_viable";
  }

  if (
    params.activationReadinessScore < 55 ||
    params.activationSurvivabilityScore < 55 ||
    params.operationalContinuityReadinessScore < 55 ||
    params.failClosedActivationScore < 55 ||
    params.longHorizonActivationViabilityScore < 55 ||
    params.activationEntropyRecurrenceRiskScore >= 72 ||
    params.activationSaturationRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.activationReadinessScore < 75 ||
    params.activationSurvivabilityScore < 75 ||
    params.operationalContinuityReadinessScore < 75 ||
    params.longHorizonActivationViabilityScore < 75 ||
    params.activationEntropyRecurrenceRiskScore >= 50 ||
    params.activationSaturationRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.activationReadinessScore < 88 ||
    params.activationSurvivabilityScore < 88 ||
    params.operationalContinuityReadinessScore < 88 ||
    params.longHorizonActivationViabilityScore < 88 ||
    params.activationEntropyRecurrenceRiskScore >= 25 ||
    params.activationSaturationRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  activationReadinessWeakness: boolean;
  activationSurvivabilityWeakness: boolean;
  operationalContinuityWeakness: boolean;
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
}): CountyGovernanceNormalizedOperationsBoundedActivationReadinessWarningCode[] {
  const warnings = new Set<CountyGovernanceNormalizedOperationsBoundedActivationReadinessWarningCode>();

  if (params.activationReadinessWeakness) {
    warnings.add("ACTIVATION_READINESS_WEAKNESS");
  }

  if (params.activationSurvivabilityWeakness) {
    warnings.add("ACTIVATION_SURVIVABILITY_WEAKNESS");
  }

  if (params.operationalContinuityWeakness) {
    warnings.add("OPERATIONAL_CONTINUITY_READINESS_WEAKNESS");
  }

  if (params.containmentPersistenceRisk) {
    warnings.add("ACTIVATION_CONTAINMENT_PERSISTENCE_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("ACTIVATION_EXPLAINABILITY_CONTINUITY_DECAY");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_ACTIVATION_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("ACTIVATION_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("ACTIVATION_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_ACTIVATION_DRIFT");
  }

  if (params.entropyRecurrence) {
    warnings.add("ACTIVATION_ENTROPY_RECURRENCE_RISK");
  }

  if (params.saturation) {
    warnings.add("ACTIVATION_SATURATION_RISK");
  }

  if (params.longHorizonViabilityWeakness) {
    warnings.add("LONG_HORIZON_ACTIVATION_VIABILITY_WEAKNESS");
  }

  if (params.reevaluationRequired) {
    warnings.add("ACTIVATION_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("ACTIVATION_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_ACTIVATION");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["normalized operations bounded activation readiness", 0],
  )[0];
}

function classifyBoundedActivation(params: {
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
  operationalContinuityWeakness: boolean;
  readinessWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceBoundedActivationReadinessLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_activation_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_activation";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.saturation ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "activation_readiness_unstable";
  }

  if (
    params.survivabilityWeakness ||
    params.longHorizonWeakness ||
    params.explainabilityDecay ||
    params.operationalContinuityWeakness ||
    params.readinessWeakness
  ) {
    return "activation_readiness_degrading";
  }

  if (params.continuationRequired) {
    return "activation_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_activation_readiness";
  }

  return "ready_for_bounded_activation";
}

export function evaluateCountyGovernanceNormalizedOperationsBoundedActivationReadiness(
  input: CountyGovernanceNormalizedOperationsBoundedActivationReadinessInput,
): CountyGovernanceNormalizedOperationsBoundedActivationReadinessResult {
  const activationReadinessScore = clampScore(input.activationReadinessScore);
  const activationSurvivabilityScore = clampScore(input.activationSurvivabilityScore);
  const operationalContinuityReadinessScore = clampScore(input.operationalContinuityReadinessScore);
  const activationContainmentPersistenceScore = clampScore(input.activationContainmentPersistenceScore);
  const activationExplainabilityContinuityScore = clampScore(input.activationExplainabilityContinuityScore);
  const failClosedActivationScore = clampScore(input.failClosedActivationScore);
  const activationFragmentationRiskScore = clampScore(input.activationFragmentationRiskScore);
  const activationDesynchronizationRiskScore = clampScore(input.activationDesynchronizationRiskScore);
  const recursiveActivationDriftRiskScore = clampScore(input.recursiveActivationDriftRiskScore);
  const activationEntropyRecurrenceRiskScore = clampScore(input.activationEntropyRecurrenceRiskScore);
  const activationReevaluationPressureScore = clampScore(input.activationReevaluationPressureScore);
  const activationSaturationRiskScore = clampScore(input.activationSaturationRiskScore);
  const longHorizonActivationViabilityScore = clampScore(input.longHorizonActivationViabilityScore);

  const failClosedActivationDegrading = failClosedActivationScore < 55;
  const activationFragmentationDetected = activationFragmentationRiskScore >= 45;
  const activationDesynchronizationDetected = activationDesynchronizationRiskScore >= 45;
  const recursiveActivationDriftDetected = recursiveActivationDriftRiskScore >= 45;
  const activationEntropyRecurrenceDetected = activationEntropyRecurrenceRiskScore >= 45;
  const activationSaturationDetected = activationSaturationRiskScore >= 45;
  const activationContainmentPersistenceRisk = activationContainmentPersistenceScore < 55;
  const activationSurvivabilityWeakness = activationSurvivabilityScore < 55;
  const activationExplainabilityDecay = activationExplainabilityContinuityScore < 55;
  const longHorizonActivationViabilityWeakness = longHorizonActivationViabilityScore < 55;
  const operationalContinuityReadinessWeakness = operationalContinuityReadinessScore < 75;
  const activationReadinessWeakness = activationReadinessScore < 75;
  const collapseSensitiveActivationEscalation =
    (recursiveActivationDriftRiskScore >= 88 ||
      activationEntropyRecurrenceRiskScore >= 88 ||
      activationDesynchronizationRiskScore >= 88 ||
      activationFragmentationRiskScore >= 88 ||
      activationSaturationRiskScore >= 88) &&
    (failClosedActivationScore < 65 || activationSurvivabilityScore < 55);
  const reevaluationRequired =
    activationReevaluationPressureScore >= 58 ||
    activationSurvivabilityWeakness ||
    activationContainmentPersistenceRisk ||
    activationExplainabilityDecay ||
    longHorizonActivationViabilityWeakness ||
    activationFragmentationDetected ||
    activationDesynchronizationDetected ||
    activationSaturationDetected;

  const activationSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(activationReadinessScore),
      inverseHealthScore(activationSurvivabilityScore),
      inverseHealthScore(operationalContinuityReadinessScore),
      inverseHealthScore(activationContainmentPersistenceScore),
      inverseHealthScore(activationExplainabilityContinuityScore),
      inverseHealthScore(failClosedActivationScore),
      activationFragmentationRiskScore,
      activationDesynchronizationRiskScore,
      recursiveActivationDriftRiskScore,
      activationEntropyRecurrenceRiskScore,
      activationReevaluationPressureScore,
      activationSaturationRiskScore,
      inverseHealthScore(longHorizonActivationViabilityScore),
    ]),
  );

  const longHorizonActivationViability = classifyLongHorizonActivation({
    activationReadinessScore,
    activationSurvivabilityScore,
    operationalContinuityReadinessScore,
    failClosedActivationScore,
    activationEntropyRecurrenceRiskScore,
    activationSaturationRiskScore,
    longHorizonActivationViabilityScore,
  });
  const activationExposureLevel = classifyExposure(activationSeverityScore);
  const activationReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      activationSeverityScore,
      activationReevaluationPressureScore,
      activationEntropyRecurrenceRiskScore,
      recursiveActivationDriftRiskScore,
      activationDesynchronizationRiskScore,
      activationFragmentationRiskScore,
      activationSaturationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedActivationDegrading &&
    !collapseSensitiveActivationEscalation &&
    !recursiveActivationDriftDetected &&
    !activationEntropyRecurrenceDetected &&
    !activationSaturationDetected &&
    !activationContainmentPersistenceRisk &&
    !activationDesynchronizationDetected &&
    !activationFragmentationDetected &&
    activationSeverityScore >= 35 &&
    activationSeverityScore < 72;

  const warningCodes = buildWarnings({
    activationReadinessWeakness,
    activationSurvivabilityWeakness,
    operationalContinuityWeakness: operationalContinuityReadinessWeakness,
    containmentPersistenceRisk: activationContainmentPersistenceRisk,
    explainabilityDecay: activationExplainabilityDecay,
    failClosedDegradation: failClosedActivationDegrading,
    fragmentation: activationFragmentationDetected,
    desynchronization: activationDesynchronizationDetected,
    recursiveDrift: recursiveActivationDriftDetected,
    entropyRecurrence: activationEntropyRecurrenceDetected,
    saturation: activationSaturationDetected,
    longHorizonViabilityWeakness: longHorizonActivationViabilityWeakness,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveActivationEscalation,
  });

  const boundedActivationReadinessLevel = classifyBoundedActivation({
    failClosedDegradation: failClosedActivationDegrading,
    collapseSensitive: collapseSensitiveActivationEscalation,
    recursiveDrift: recursiveActivationDriftDetected,
    entropyRecurrence: activationEntropyRecurrenceDetected,
    saturation: activationSaturationDetected,
    containmentRisk: activationContainmentPersistenceRisk,
    desynchronization: activationDesynchronizationDetected,
    fragmentation: activationFragmentationDetected,
    survivabilityWeakness: activationSurvivabilityWeakness,
    longHorizonWeakness: longHorizonActivationViabilityWeakness,
    explainabilityDecay: activationExplainabilityDecay,
    operationalContinuityWeakness: operationalContinuityReadinessWeakness,
    readinessWeakness: activationReadinessWeakness,
    continuationRequired,
    severityScore: activationSeverityScore,
  });

  const primaryActivationDriver = selectPrimaryDriver({
    "activation readiness weakness": inverseHealthScore(activationReadinessScore),
    "activation survivability weakness": inverseHealthScore(activationSurvivabilityScore),
    "operational continuity readiness weakness": inverseHealthScore(operationalContinuityReadinessScore),
    "activation containment persistence risk": inverseHealthScore(activationContainmentPersistenceScore),
    "activation explainability continuity decay": inverseHealthScore(activationExplainabilityContinuityScore),
    "fail-closed activation degradation": inverseHealthScore(failClosedActivationScore),
    "activation fragmentation risk": activationFragmentationRiskScore,
    "activation desynchronization risk": activationDesynchronizationRiskScore,
    "recursive activation drift": recursiveActivationDriftRiskScore,
    "activation entropy recurrence risk": activationEntropyRecurrenceRiskScore,
    "activation reevaluation pressure": activationReevaluationPressureScore,
    "activation saturation risk": activationSaturationRiskScore,
    "long-horizon activation viability weakness": inverseHealthScore(longHorizonActivationViabilityScore),
  });

  return {
    boundedActivationReadinessLevel,
    activationSeverityScore,
    activationExposureLevel,
    activationReevaluationRequirementLevel,
    longHorizonActivationViability,
    continuationRequired,
    failClosedActivationDegrading,
    activationFragmentationDetected,
    activationDesynchronizationDetected,
    recursiveActivationDriftDetected,
    activationEntropyRecurrenceDetected,
    activationSaturationDetected,
    collapseSensitiveActivationEscalation,
    warningCodes,
    explainability: {
      primaryActivationDriver,
      dominantActivationEscalationReason:
        warningCodes[0] ?? "No deterministic bounded activation escalation threshold was crossed.",
      containmentActivationAssessment: activationContainmentPersistenceRisk
        ? "Activation containment persistence is not strong enough to preserve bounded activation readiness."
        : "Activation containment persistence remains readiness-preserving for the current caller-supplied governance context.",
      longHorizonActivationAssessment:
        longHorizonActivationViability === "durable"
          ? "Long-horizon bounded activation viability is durable under the current inputs. Activation readiness does not imply permanent governance recovery, permanent activation, irreversible normalization, or permanent stabilization."
          : `Long-horizon bounded activation viability is ${longHorizonActivationViability} under the current inputs. Normalized operations transition readiness does not guarantee bounded activation readiness.`,
      failClosedActivationAssessment: failClosedActivationDegrading
        ? "Fail-closed activation protection is degrading and overrides optimistic bounded activation assumptions."
        : "Fail-closed activation protection remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
