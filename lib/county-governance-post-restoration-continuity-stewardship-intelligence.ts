export type CountyGovernanceStewardshipContinuityLevel =
  | "durable_post_restoration_stewardship"
  | "bounded_post_restoration_stewardship"
  | "post_restoration_stewardship_continuation_required"
  | "post_restoration_stewardship_degrading"
  | "post_restoration_stewardship_unstable"
  | "fail_closed_stewardship_degradation"
  | "collapse_sensitive_stewardship";

export type CountyGovernanceStewardshipExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceStewardshipReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonStewardshipViability =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_viable";

export type CountyGovernancePostRestorationContinuityStewardshipWarningCode =
  | "STEWARDSHIP_CONTINUITY_DURABILITY_WEAKNESS"
  | "STEWARDSHIP_SURVIVABILITY_WEAKNESS"
  | "STEWARDSHIP_CONTAINMENT_PERSISTENCE_RISK"
  | "STEWARDSHIP_EXPLAINABILITY_CONTINUITY_DECAY"
  | "FAIL_CLOSED_STEWARDSHIP_DEGRADATION"
  | "STEWARDSHIP_FRAGMENTATION_RISK"
  | "STEWARDSHIP_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_STEWARDSHIP_DRIFT"
  | "STEWARDSHIP_ENTROPY_RECURRENCE_RISK"
  | "STEWARDSHIP_SATURATION_RISK"
  | "LONG_HORIZON_STEWARDSHIP_VIABILITY_WEAKNESS"
  | "STEWARDSHIP_REEVALUATION_REQUIRED"
  | "STEWARDSHIP_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_STEWARDSHIP";

export type CountyGovernancePostRestorationContinuityStewardshipInput = {
  stewardshipContinuityDurabilityScore: number;
  stewardshipSurvivabilityScore: number;
  stewardshipContainmentPersistenceScore: number;
  stewardshipExplainabilityContinuityScore: number;
  failClosedStewardshipScore: number;
  stewardshipFragmentationRiskScore: number;
  stewardshipDesynchronizationRiskScore: number;
  recursiveStewardshipDriftRiskScore: number;
  stewardshipEntropyRecurrenceRiskScore: number;
  stewardshipReevaluationPressureScore: number;
  stewardshipSaturationRiskScore: number;
  longHorizonStewardshipViabilityScore: number;
};

export type CountyGovernancePostRestorationContinuityStewardshipResult = {
  stewardshipContinuityLevel: CountyGovernanceStewardshipContinuityLevel;
  stewardshipSeverityScore: number;
  stewardshipExposureLevel: CountyGovernanceStewardshipExposureLevel;
  stewardshipReevaluationRequirementLevel: CountyGovernanceStewardshipReevaluationRequirementLevel;
  longHorizonStewardshipViability: CountyGovernanceLongHorizonStewardshipViability;
  continuationRequired: boolean;
  failClosedStewardshipDegrading: boolean;
  stewardshipFragmentationDetected: boolean;
  stewardshipDesynchronizationDetected: boolean;
  recursiveStewardshipDriftDetected: boolean;
  stewardshipEntropyRecurrenceDetected: boolean;
  stewardshipSaturationDetected: boolean;
  collapseSensitiveStewardshipEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryStewardshipDriver: string;
    dominantStewardshipEscalationReason: string;
    containmentStewardshipAssessment: string;
    longHorizonStewardshipAssessment: string;
    failClosedStewardshipAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernancePostRestorationContinuityStewardshipWarningCode[] = [
  "FAIL_CLOSED_STEWARDSHIP_DEGRADATION",
  "COLLAPSE_SENSITIVE_STEWARDSHIP",
  "RECURSIVE_STEWARDSHIP_DRIFT",
  "STEWARDSHIP_ENTROPY_RECURRENCE_RISK",
  "STEWARDSHIP_SATURATION_RISK",
  "STEWARDSHIP_CONTAINMENT_PERSISTENCE_RISK",
  "STEWARDSHIP_DESYNCHRONIZATION_RISK",
  "STEWARDSHIP_FRAGMENTATION_RISK",
  "STEWARDSHIP_SURVIVABILITY_WEAKNESS",
  "LONG_HORIZON_STEWARDSHIP_VIABILITY_WEAKNESS",
  "STEWARDSHIP_EXPLAINABILITY_CONTINUITY_DECAY",
  "STEWARDSHIP_CONTINUITY_DURABILITY_WEAKNESS",
  "STEWARDSHIP_REEVALUATION_REQUIRED",
  "STEWARDSHIP_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceStewardshipExposureLevel {
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

function classifyReevaluation(score: number): CountyGovernanceStewardshipReevaluationRequirementLevel {
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

function classifyLongHorizonStewardship(params: {
  stewardshipContinuityDurabilityScore: number;
  stewardshipSurvivabilityScore: number;
  failClosedStewardshipScore: number;
  stewardshipEntropyRecurrenceRiskScore: number;
  stewardshipSaturationRiskScore: number;
  longHorizonStewardshipViabilityScore: number;
}): CountyGovernanceLongHorizonStewardshipViability {
  if (
    params.stewardshipContinuityDurabilityScore < 35 ||
    params.stewardshipSurvivabilityScore < 35 ||
    params.failClosedStewardshipScore < 35 ||
    params.longHorizonStewardshipViabilityScore < 35 ||
    params.stewardshipEntropyRecurrenceRiskScore >= 88 ||
    params.stewardshipSaturationRiskScore >= 88
  ) {
    return "non_viable";
  }

  if (
    params.stewardshipContinuityDurabilityScore < 55 ||
    params.stewardshipSurvivabilityScore < 55 ||
    params.failClosedStewardshipScore < 55 ||
    params.longHorizonStewardshipViabilityScore < 55 ||
    params.stewardshipEntropyRecurrenceRiskScore >= 72 ||
    params.stewardshipSaturationRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.stewardshipContinuityDurabilityScore < 75 ||
    params.stewardshipSurvivabilityScore < 75 ||
    params.longHorizonStewardshipViabilityScore < 75 ||
    params.stewardshipEntropyRecurrenceRiskScore >= 50 ||
    params.stewardshipSaturationRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.stewardshipContinuityDurabilityScore < 88 ||
    params.stewardshipSurvivabilityScore < 88 ||
    params.longHorizonStewardshipViabilityScore < 88 ||
    params.stewardshipEntropyRecurrenceRiskScore >= 25 ||
    params.stewardshipSaturationRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  continuityDurabilityWeakness: boolean;
  survivabilityWeakness: boolean;
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
}): CountyGovernancePostRestorationContinuityStewardshipWarningCode[] {
  const warnings = new Set<CountyGovernancePostRestorationContinuityStewardshipWarningCode>();

  if (params.continuityDurabilityWeakness) {
    warnings.add("STEWARDSHIP_CONTINUITY_DURABILITY_WEAKNESS");
  }

  if (params.survivabilityWeakness) {
    warnings.add("STEWARDSHIP_SURVIVABILITY_WEAKNESS");
  }

  if (params.containmentPersistenceRisk) {
    warnings.add("STEWARDSHIP_CONTAINMENT_PERSISTENCE_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("STEWARDSHIP_EXPLAINABILITY_CONTINUITY_DECAY");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_STEWARDSHIP_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("STEWARDSHIP_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("STEWARDSHIP_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_STEWARDSHIP_DRIFT");
  }

  if (params.entropyRecurrence) {
    warnings.add("STEWARDSHIP_ENTROPY_RECURRENCE_RISK");
  }

  if (params.saturation) {
    warnings.add("STEWARDSHIP_SATURATION_RISK");
  }

  if (params.longHorizonViabilityWeakness) {
    warnings.add("LONG_HORIZON_STEWARDSHIP_VIABILITY_WEAKNESS");
  }

  if (params.reevaluationRequired) {
    warnings.add("STEWARDSHIP_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("STEWARDSHIP_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_STEWARDSHIP");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["post-restoration continuity stewardship", 0],
  )[0];
}

function classifyStewardship(params: {
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
  continuityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceStewardshipContinuityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_stewardship_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_stewardship";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.saturation ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "post_restoration_stewardship_unstable";
  }

  if (
    params.survivabilityWeakness ||
    params.longHorizonWeakness ||
    params.explainabilityDecay ||
    params.continuityWeakness
  ) {
    return "post_restoration_stewardship_degrading";
  }

  if (params.continuationRequired) {
    return "post_restoration_stewardship_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_post_restoration_stewardship";
  }

  return "durable_post_restoration_stewardship";
}

export function evaluateCountyGovernancePostRestorationContinuityStewardship(
  input: CountyGovernancePostRestorationContinuityStewardshipInput,
): CountyGovernancePostRestorationContinuityStewardshipResult {
  const stewardshipContinuityDurabilityScore = clampScore(input.stewardshipContinuityDurabilityScore);
  const stewardshipSurvivabilityScore = clampScore(input.stewardshipSurvivabilityScore);
  const stewardshipContainmentPersistenceScore = clampScore(input.stewardshipContainmentPersistenceScore);
  const stewardshipExplainabilityContinuityScore = clampScore(input.stewardshipExplainabilityContinuityScore);
  const failClosedStewardshipScore = clampScore(input.failClosedStewardshipScore);
  const stewardshipFragmentationRiskScore = clampScore(input.stewardshipFragmentationRiskScore);
  const stewardshipDesynchronizationRiskScore = clampScore(input.stewardshipDesynchronizationRiskScore);
  const recursiveStewardshipDriftRiskScore = clampScore(input.recursiveStewardshipDriftRiskScore);
  const stewardshipEntropyRecurrenceRiskScore = clampScore(input.stewardshipEntropyRecurrenceRiskScore);
  const stewardshipReevaluationPressureScore = clampScore(input.stewardshipReevaluationPressureScore);
  const stewardshipSaturationRiskScore = clampScore(input.stewardshipSaturationRiskScore);
  const longHorizonStewardshipViabilityScore = clampScore(input.longHorizonStewardshipViabilityScore);

  const failClosedStewardshipDegrading = failClosedStewardshipScore < 55;
  const stewardshipFragmentationDetected = stewardshipFragmentationRiskScore >= 45;
  const stewardshipDesynchronizationDetected = stewardshipDesynchronizationRiskScore >= 45;
  const recursiveStewardshipDriftDetected = recursiveStewardshipDriftRiskScore >= 45;
  const stewardshipEntropyRecurrenceDetected = stewardshipEntropyRecurrenceRiskScore >= 45;
  const stewardshipSaturationDetected = stewardshipSaturationRiskScore >= 45;
  const stewardshipContainmentPersistenceRisk = stewardshipContainmentPersistenceScore < 55;
  const stewardshipSurvivabilityWeakness = stewardshipSurvivabilityScore < 55;
  const stewardshipExplainabilityDecay = stewardshipExplainabilityContinuityScore < 55;
  const longHorizonStewardshipViabilityWeakness = longHorizonStewardshipViabilityScore < 55;
  const stewardshipContinuityDurabilityWeakness = stewardshipContinuityDurabilityScore < 75;
  const collapseSensitiveStewardshipEscalation =
    (recursiveStewardshipDriftRiskScore >= 88 ||
      stewardshipEntropyRecurrenceRiskScore >= 88 ||
      stewardshipDesynchronizationRiskScore >= 88 ||
      stewardshipFragmentationRiskScore >= 88 ||
      stewardshipSaturationRiskScore >= 88) &&
    (failClosedStewardshipScore < 65 || stewardshipSurvivabilityScore < 55);
  const reevaluationRequired =
    stewardshipReevaluationPressureScore >= 58 ||
    stewardshipSurvivabilityWeakness ||
    stewardshipContainmentPersistenceRisk ||
    stewardshipExplainabilityDecay ||
    longHorizonStewardshipViabilityWeakness ||
    stewardshipFragmentationDetected ||
    stewardshipDesynchronizationDetected ||
    stewardshipSaturationDetected;

  const stewardshipSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(stewardshipContinuityDurabilityScore),
      inverseHealthScore(stewardshipSurvivabilityScore),
      inverseHealthScore(stewardshipContainmentPersistenceScore),
      inverseHealthScore(stewardshipExplainabilityContinuityScore),
      inverseHealthScore(failClosedStewardshipScore),
      stewardshipFragmentationRiskScore,
      stewardshipDesynchronizationRiskScore,
      recursiveStewardshipDriftRiskScore,
      stewardshipEntropyRecurrenceRiskScore,
      stewardshipReevaluationPressureScore,
      stewardshipSaturationRiskScore,
      inverseHealthScore(longHorizonStewardshipViabilityScore),
    ]),
  );

  const longHorizonStewardshipViability = classifyLongHorizonStewardship({
    stewardshipContinuityDurabilityScore,
    stewardshipSurvivabilityScore,
    failClosedStewardshipScore,
    stewardshipEntropyRecurrenceRiskScore,
    stewardshipSaturationRiskScore,
    longHorizonStewardshipViabilityScore,
  });
  const stewardshipExposureLevel = classifyExposure(stewardshipSeverityScore);
  const stewardshipReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      stewardshipSeverityScore,
      stewardshipReevaluationPressureScore,
      stewardshipEntropyRecurrenceRiskScore,
      recursiveStewardshipDriftRiskScore,
      stewardshipDesynchronizationRiskScore,
      stewardshipFragmentationRiskScore,
      stewardshipSaturationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedStewardshipDegrading &&
    !collapseSensitiveStewardshipEscalation &&
    !recursiveStewardshipDriftDetected &&
    !stewardshipEntropyRecurrenceDetected &&
    !stewardshipSaturationDetected &&
    !stewardshipContainmentPersistenceRisk &&
    !stewardshipDesynchronizationDetected &&
    !stewardshipFragmentationDetected &&
    stewardshipSeverityScore >= 35 &&
    stewardshipSeverityScore < 72;

  const warningCodes = buildWarnings({
    continuityDurabilityWeakness: stewardshipContinuityDurabilityWeakness,
    survivabilityWeakness: stewardshipSurvivabilityWeakness,
    containmentPersistenceRisk: stewardshipContainmentPersistenceRisk,
    explainabilityDecay: stewardshipExplainabilityDecay,
    failClosedDegradation: failClosedStewardshipDegrading,
    fragmentation: stewardshipFragmentationDetected,
    desynchronization: stewardshipDesynchronizationDetected,
    recursiveDrift: recursiveStewardshipDriftDetected,
    entropyRecurrence: stewardshipEntropyRecurrenceDetected,
    saturation: stewardshipSaturationDetected,
    longHorizonViabilityWeakness: longHorizonStewardshipViabilityWeakness,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveStewardshipEscalation,
  });

  const stewardshipContinuityLevel = classifyStewardship({
    failClosedDegradation: failClosedStewardshipDegrading,
    collapseSensitive: collapseSensitiveStewardshipEscalation,
    recursiveDrift: recursiveStewardshipDriftDetected,
    entropyRecurrence: stewardshipEntropyRecurrenceDetected,
    saturation: stewardshipSaturationDetected,
    containmentRisk: stewardshipContainmentPersistenceRisk,
    desynchronization: stewardshipDesynchronizationDetected,
    fragmentation: stewardshipFragmentationDetected,
    survivabilityWeakness: stewardshipSurvivabilityWeakness,
    longHorizonWeakness: longHorizonStewardshipViabilityWeakness,
    explainabilityDecay: stewardshipExplainabilityDecay,
    continuityWeakness: stewardshipContinuityDurabilityWeakness,
    continuationRequired,
    severityScore: stewardshipSeverityScore,
  });

  const primaryStewardshipDriver = selectPrimaryDriver({
    "stewardship continuity durability weakness": inverseHealthScore(stewardshipContinuityDurabilityScore),
    "stewardship survivability weakness": inverseHealthScore(stewardshipSurvivabilityScore),
    "stewardship containment persistence risk": inverseHealthScore(stewardshipContainmentPersistenceScore),
    "stewardship explainability continuity decay": inverseHealthScore(stewardshipExplainabilityContinuityScore),
    "fail-closed stewardship degradation": inverseHealthScore(failClosedStewardshipScore),
    "stewardship fragmentation risk": stewardshipFragmentationRiskScore,
    "stewardship desynchronization risk": stewardshipDesynchronizationRiskScore,
    "recursive stewardship drift": recursiveStewardshipDriftRiskScore,
    "stewardship entropy recurrence risk": stewardshipEntropyRecurrenceRiskScore,
    "stewardship reevaluation pressure": stewardshipReevaluationPressureScore,
    "stewardship saturation risk": stewardshipSaturationRiskScore,
    "long-horizon stewardship viability weakness": inverseHealthScore(longHorizonStewardshipViabilityScore),
  });

  return {
    stewardshipContinuityLevel,
    stewardshipSeverityScore,
    stewardshipExposureLevel,
    stewardshipReevaluationRequirementLevel,
    longHorizonStewardshipViability,
    continuationRequired,
    failClosedStewardshipDegrading,
    stewardshipFragmentationDetected,
    stewardshipDesynchronizationDetected,
    recursiveStewardshipDriftDetected,
    stewardshipEntropyRecurrenceDetected,
    stewardshipSaturationDetected,
    collapseSensitiveStewardshipEscalation,
    warningCodes,
    explainability: {
      primaryStewardshipDriver,
      dominantStewardshipEscalationReason:
        warningCodes[0] ?? "No deterministic post-restoration stewardship escalation threshold was crossed.",
      containmentStewardshipAssessment: stewardshipContainmentPersistenceRisk
        ? "Stewardship containment persistence is not strong enough to preserve post-restoration continuity."
        : "Stewardship containment persistence remains continuity-preserving for the current caller-supplied governance context.",
      longHorizonStewardshipAssessment:
        longHorizonStewardshipViability === "durable"
          ? "Long-horizon post-restoration stewardship viability is durable under the current inputs. Stewardship continuity does not imply permanent governance recovery."
          : `Long-horizon post-restoration stewardship viability is ${longHorizonStewardshipViability} under the current inputs. Restoration closure preservation does not guarantee stewardship continuity.`,
      failClosedStewardshipAssessment: failClosedStewardshipDegrading
        ? "Fail-closed stewardship is degrading and overrides optimistic stewardship assumptions."
        : "Fail-closed stewardship remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
