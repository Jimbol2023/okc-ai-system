export type CountyGovernanceRestorationClosurePreservationLevel =
  | "durable_restoration_closure_preservation"
  | "bounded_restoration_closure_preservation"
  | "restoration_closure_continuation_required"
  | "restoration_closure_degrading"
  | "restoration_closure_unstable"
  | "fail_closed_restoration_closure_degradation"
  | "collapse_sensitive_restoration_closure";

export type CountyGovernanceRestorationClosureExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRestorationClosureReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonRestorationClosureViability =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_viable";

export type CountyGovernanceRestorationHandoffClosurePreservationWarningCode =
  | "RESTORATION_CLOSURE_PRESERVATION_WEAKNESS"
  | "RESTORATION_CLOSURE_SURVIVABILITY_WEAKNESS"
  | "RESTORATION_STEWARDSHIP_CONTINUITY_WEAKNESS"
  | "RESTORATION_CLOSURE_CONTAINMENT_RISK"
  | "RESTORATION_CLOSURE_EXPLAINABILITY_DECAY"
  | "FAIL_CLOSED_RESTORATION_CLOSURE_DEGRADATION"
  | "RESTORATION_CLOSURE_FRAGMENTATION_RISK"
  | "RESTORATION_CLOSURE_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_RESTORATION_CLOSURE_DRIFT"
  | "RESTORATION_CLOSURE_ENTROPY_RECURRENCE_RISK"
  | "RESTORATION_CLOSURE_SATURATION_RISK"
  | "RESTORATION_CLOSURE_REEVALUATION_REQUIRED"
  | "RESTORATION_CLOSURE_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_RESTORATION_CLOSURE";

export type CountyGovernanceRestorationHandoffClosurePreservationInput = {
  restorationClosurePreservationScore: number;
  restorationClosureSurvivabilityScore: number;
  restorationStewardshipContinuityScore: number;
  restorationClosureContainmentIntegrityScore: number;
  restorationClosureExplainabilityContinuityScore: number;
  failClosedRestorationClosureScore: number;
  restorationClosureFragmentationRiskScore: number;
  restorationClosureDesynchronizationRiskScore: number;
  recursiveRestorationClosureDriftRiskScore: number;
  restorationClosureEntropyRecurrenceRiskScore: number;
  restorationClosureReevaluationPressureScore: number;
  restorationClosureSaturationRiskScore: number;
};

export type CountyGovernanceRestorationHandoffClosurePreservationResult = {
  restorationClosurePreservationLevel: CountyGovernanceRestorationClosurePreservationLevel;
  restorationClosureSeverityScore: number;
  restorationClosureExposureLevel: CountyGovernanceRestorationClosureExposureLevel;
  restorationClosureReevaluationRequirementLevel: CountyGovernanceRestorationClosureReevaluationRequirementLevel;
  longHorizonRestorationClosureViability: CountyGovernanceLongHorizonRestorationClosureViability;
  continuationRequired: boolean;
  failClosedRestorationClosureDegrading: boolean;
  restorationClosureFragmentationDetected: boolean;
  restorationClosureDesynchronizationDetected: boolean;
  recursiveRestorationClosureDriftDetected: boolean;
  restorationClosureEntropyRecurrenceDetected: boolean;
  restorationClosureSaturationDetected: boolean;
  collapseSensitiveRestorationClosureEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryRestorationClosureDriver: string;
    dominantRestorationClosureEscalationReason: string;
    containmentRestorationClosureAssessment: string;
    longHorizonRestorationClosureAssessment: string;
    failClosedRestorationClosureAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceRestorationHandoffClosurePreservationWarningCode[] = [
  "FAIL_CLOSED_RESTORATION_CLOSURE_DEGRADATION",
  "COLLAPSE_SENSITIVE_RESTORATION_CLOSURE",
  "RECURSIVE_RESTORATION_CLOSURE_DRIFT",
  "RESTORATION_CLOSURE_ENTROPY_RECURRENCE_RISK",
  "RESTORATION_CLOSURE_SATURATION_RISK",
  "RESTORATION_CLOSURE_CONTAINMENT_RISK",
  "RESTORATION_CLOSURE_DESYNCHRONIZATION_RISK",
  "RESTORATION_CLOSURE_FRAGMENTATION_RISK",
  "RESTORATION_CLOSURE_SURVIVABILITY_WEAKNESS",
  "RESTORATION_STEWARDSHIP_CONTINUITY_WEAKNESS",
  "RESTORATION_CLOSURE_EXPLAINABILITY_DECAY",
  "RESTORATION_CLOSURE_PRESERVATION_WEAKNESS",
  "RESTORATION_CLOSURE_REEVALUATION_REQUIRED",
  "RESTORATION_CLOSURE_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceRestorationClosureExposureLevel {
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

function classifyReevaluation(score: number): CountyGovernanceRestorationClosureReevaluationRequirementLevel {
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

function classifyLongHorizonRestorationClosure(params: {
  restorationClosurePreservationScore: number;
  restorationClosureSurvivabilityScore: number;
  restorationStewardshipContinuityScore: number;
  failClosedRestorationClosureScore: number;
  restorationClosureEntropyRecurrenceRiskScore: number;
  restorationClosureSaturationRiskScore: number;
}): CountyGovernanceLongHorizonRestorationClosureViability {
  if (
    params.restorationClosurePreservationScore < 35 ||
    params.restorationClosureSurvivabilityScore < 35 ||
    params.failClosedRestorationClosureScore < 35 ||
    params.restorationClosureEntropyRecurrenceRiskScore >= 88 ||
    params.restorationClosureSaturationRiskScore >= 88
  ) {
    return "non_viable";
  }

  if (
    params.restorationClosurePreservationScore < 55 ||
    params.restorationClosureSurvivabilityScore < 55 ||
    params.restorationStewardshipContinuityScore < 55 ||
    params.failClosedRestorationClosureScore < 55 ||
    params.restorationClosureEntropyRecurrenceRiskScore >= 72 ||
    params.restorationClosureSaturationRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.restorationClosurePreservationScore < 75 ||
    params.restorationClosureSurvivabilityScore < 75 ||
    params.restorationStewardshipContinuityScore < 75 ||
    params.restorationClosureEntropyRecurrenceRiskScore >= 50 ||
    params.restorationClosureSaturationRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.restorationClosurePreservationScore < 88 ||
    params.restorationClosureSurvivabilityScore < 88 ||
    params.restorationStewardshipContinuityScore < 88 ||
    params.restorationClosureEntropyRecurrenceRiskScore >= 25 ||
    params.restorationClosureSaturationRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  closurePreservationWeakness: boolean;
  closureSurvivabilityWeakness: boolean;
  stewardshipContinuityWeakness: boolean;
  closureContainmentRisk: boolean;
  closureExplainabilityDecay: boolean;
  failClosedDegradation: boolean;
  fragmentation: boolean;
  desynchronization: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  saturation: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceRestorationHandoffClosurePreservationWarningCode[] {
  const warnings = new Set<CountyGovernanceRestorationHandoffClosurePreservationWarningCode>();

  if (params.closurePreservationWeakness) {
    warnings.add("RESTORATION_CLOSURE_PRESERVATION_WEAKNESS");
  }

  if (params.closureSurvivabilityWeakness) {
    warnings.add("RESTORATION_CLOSURE_SURVIVABILITY_WEAKNESS");
  }

  if (params.stewardshipContinuityWeakness) {
    warnings.add("RESTORATION_STEWARDSHIP_CONTINUITY_WEAKNESS");
  }

  if (params.closureContainmentRisk) {
    warnings.add("RESTORATION_CLOSURE_CONTAINMENT_RISK");
  }

  if (params.closureExplainabilityDecay) {
    warnings.add("RESTORATION_CLOSURE_EXPLAINABILITY_DECAY");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_RESTORATION_CLOSURE_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("RESTORATION_CLOSURE_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("RESTORATION_CLOSURE_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_RESTORATION_CLOSURE_DRIFT");
  }

  if (params.entropyRecurrence) {
    warnings.add("RESTORATION_CLOSURE_ENTROPY_RECURRENCE_RISK");
  }

  if (params.saturation) {
    warnings.add("RESTORATION_CLOSURE_SATURATION_RISK");
  }

  if (params.reevaluationRequired) {
    warnings.add("RESTORATION_CLOSURE_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("RESTORATION_CLOSURE_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_RESTORATION_CLOSURE");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["restoration handoff closure preservation", 0],
  )[0];
}

function classifyRestorationClosure(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  saturation: boolean;
  containmentRisk: boolean;
  desynchronization: boolean;
  fragmentation: boolean;
  closureSurvivabilityWeakness: boolean;
  stewardshipContinuityWeakness: boolean;
  closureExplainabilityDecay: boolean;
  closurePreservationWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceRestorationClosurePreservationLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_restoration_closure_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_restoration_closure";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.saturation ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "restoration_closure_unstable";
  }

  if (
    params.closureSurvivabilityWeakness ||
    params.stewardshipContinuityWeakness ||
    params.closureExplainabilityDecay ||
    params.closurePreservationWeakness
  ) {
    return "restoration_closure_degrading";
  }

  if (params.continuationRequired) {
    return "restoration_closure_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_restoration_closure_preservation";
  }

  return "durable_restoration_closure_preservation";
}

export function evaluateCountyGovernanceRestorationHandoffClosurePreservation(
  input: CountyGovernanceRestorationHandoffClosurePreservationInput,
): CountyGovernanceRestorationHandoffClosurePreservationResult {
  const restorationClosurePreservationScore = clampScore(input.restorationClosurePreservationScore);
  const restorationClosureSurvivabilityScore = clampScore(input.restorationClosureSurvivabilityScore);
  const restorationStewardshipContinuityScore = clampScore(input.restorationStewardshipContinuityScore);
  const restorationClosureContainmentIntegrityScore = clampScore(input.restorationClosureContainmentIntegrityScore);
  const restorationClosureExplainabilityContinuityScore = clampScore(
    input.restorationClosureExplainabilityContinuityScore,
  );
  const failClosedRestorationClosureScore = clampScore(input.failClosedRestorationClosureScore);
  const restorationClosureFragmentationRiskScore = clampScore(input.restorationClosureFragmentationRiskScore);
  const restorationClosureDesynchronizationRiskScore = clampScore(
    input.restorationClosureDesynchronizationRiskScore,
  );
  const recursiveRestorationClosureDriftRiskScore = clampScore(input.recursiveRestorationClosureDriftRiskScore);
  const restorationClosureEntropyRecurrenceRiskScore = clampScore(input.restorationClosureEntropyRecurrenceRiskScore);
  const restorationClosureReevaluationPressureScore = clampScore(input.restorationClosureReevaluationPressureScore);
  const restorationClosureSaturationRiskScore = clampScore(input.restorationClosureSaturationRiskScore);

  const failClosedRestorationClosureDegrading = failClosedRestorationClosureScore < 55;
  const restorationClosureFragmentationDetected = restorationClosureFragmentationRiskScore >= 45;
  const restorationClosureDesynchronizationDetected = restorationClosureDesynchronizationRiskScore >= 45;
  const recursiveRestorationClosureDriftDetected = recursiveRestorationClosureDriftRiskScore >= 45;
  const restorationClosureEntropyRecurrenceDetected = restorationClosureEntropyRecurrenceRiskScore >= 45;
  const restorationClosureSaturationDetected = restorationClosureSaturationRiskScore >= 45;
  const restorationClosureContainmentRiskDetected = restorationClosureContainmentIntegrityScore < 55;
  const restorationClosureSurvivabilityWeakness = restorationClosureSurvivabilityScore < 55;
  const restorationStewardshipContinuityWeakness = restorationStewardshipContinuityScore < 55;
  const restorationClosureExplainabilityDecay = restorationClosureExplainabilityContinuityScore < 55;
  const restorationClosurePreservationWeakness = restorationClosurePreservationScore < 75;
  const collapseSensitiveRestorationClosureEscalation =
    (recursiveRestorationClosureDriftRiskScore >= 88 ||
      restorationClosureEntropyRecurrenceRiskScore >= 88 ||
      restorationClosureDesynchronizationRiskScore >= 88 ||
      restorationClosureFragmentationRiskScore >= 88 ||
      restorationClosureSaturationRiskScore >= 88) &&
    (failClosedRestorationClosureScore < 65 || restorationClosureSurvivabilityScore < 55);
  const reevaluationRequired =
    restorationClosureReevaluationPressureScore >= 58 ||
    restorationClosureSurvivabilityWeakness ||
    restorationStewardshipContinuityWeakness ||
    restorationClosureExplainabilityDecay ||
    restorationClosureFragmentationDetected ||
    restorationClosureDesynchronizationDetected ||
    restorationClosureSaturationDetected;

  const restorationClosureSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(restorationClosurePreservationScore),
      inverseHealthScore(restorationClosureSurvivabilityScore),
      inverseHealthScore(restorationStewardshipContinuityScore),
      inverseHealthScore(restorationClosureContainmentIntegrityScore),
      inverseHealthScore(restorationClosureExplainabilityContinuityScore),
      inverseHealthScore(failClosedRestorationClosureScore),
      restorationClosureFragmentationRiskScore,
      restorationClosureDesynchronizationRiskScore,
      recursiveRestorationClosureDriftRiskScore,
      restorationClosureEntropyRecurrenceRiskScore,
      restorationClosureReevaluationPressureScore,
      restorationClosureSaturationRiskScore,
    ]),
  );

  const longHorizonRestorationClosureViability = classifyLongHorizonRestorationClosure({
    restorationClosurePreservationScore,
    restorationClosureSurvivabilityScore,
    restorationStewardshipContinuityScore,
    failClosedRestorationClosureScore,
    restorationClosureEntropyRecurrenceRiskScore,
    restorationClosureSaturationRiskScore,
  });
  const restorationClosureExposureLevel = classifyExposure(restorationClosureSeverityScore);
  const restorationClosureReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      restorationClosureSeverityScore,
      restorationClosureReevaluationPressureScore,
      restorationClosureEntropyRecurrenceRiskScore,
      recursiveRestorationClosureDriftRiskScore,
      restorationClosureDesynchronizationRiskScore,
      restorationClosureFragmentationRiskScore,
      restorationClosureSaturationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedRestorationClosureDegrading &&
    !collapseSensitiveRestorationClosureEscalation &&
    !recursiveRestorationClosureDriftDetected &&
    !restorationClosureEntropyRecurrenceDetected &&
    !restorationClosureSaturationDetected &&
    !restorationClosureContainmentRiskDetected &&
    !restorationClosureDesynchronizationDetected &&
    !restorationClosureFragmentationDetected &&
    restorationClosureSeverityScore >= 35 &&
    restorationClosureSeverityScore < 72;

  const warningCodes = buildWarnings({
    closurePreservationWeakness: restorationClosurePreservationWeakness,
    closureSurvivabilityWeakness: restorationClosureSurvivabilityWeakness,
    stewardshipContinuityWeakness: restorationStewardshipContinuityWeakness,
    closureContainmentRisk: restorationClosureContainmentRiskDetected,
    closureExplainabilityDecay: restorationClosureExplainabilityDecay,
    failClosedDegradation: failClosedRestorationClosureDegrading,
    fragmentation: restorationClosureFragmentationDetected,
    desynchronization: restorationClosureDesynchronizationDetected,
    recursiveDrift: recursiveRestorationClosureDriftDetected,
    entropyRecurrence: restorationClosureEntropyRecurrenceDetected,
    saturation: restorationClosureSaturationDetected,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveRestorationClosureEscalation,
  });

  const restorationClosurePreservationLevel = classifyRestorationClosure({
    failClosedDegradation: failClosedRestorationClosureDegrading,
    collapseSensitive: collapseSensitiveRestorationClosureEscalation,
    recursiveDrift: recursiveRestorationClosureDriftDetected,
    entropyRecurrence: restorationClosureEntropyRecurrenceDetected,
    saturation: restorationClosureSaturationDetected,
    containmentRisk: restorationClosureContainmentRiskDetected,
    desynchronization: restorationClosureDesynchronizationDetected,
    fragmentation: restorationClosureFragmentationDetected,
    closureSurvivabilityWeakness: restorationClosureSurvivabilityWeakness,
    stewardshipContinuityWeakness: restorationStewardshipContinuityWeakness,
    closureExplainabilityDecay: restorationClosureExplainabilityDecay,
    closurePreservationWeakness: restorationClosurePreservationWeakness,
    continuationRequired,
    severityScore: restorationClosureSeverityScore,
  });

  const primaryRestorationClosureDriver = selectPrimaryDriver({
    "restoration closure preservation weakness": inverseHealthScore(restorationClosurePreservationScore),
    "restoration closure survivability weakness": inverseHealthScore(restorationClosureSurvivabilityScore),
    "restoration stewardship continuity weakness": inverseHealthScore(restorationStewardshipContinuityScore),
    "restoration closure containment risk": inverseHealthScore(restorationClosureContainmentIntegrityScore),
    "restoration closure explainability decay": inverseHealthScore(
      restorationClosureExplainabilityContinuityScore,
    ),
    "fail-closed restoration closure degradation": inverseHealthScore(failClosedRestorationClosureScore),
    "restoration closure fragmentation risk": restorationClosureFragmentationRiskScore,
    "restoration closure desynchronization risk": restorationClosureDesynchronizationRiskScore,
    "recursive restoration closure drift": recursiveRestorationClosureDriftRiskScore,
    "restoration closure entropy recurrence risk": restorationClosureEntropyRecurrenceRiskScore,
    "restoration closure reevaluation pressure": restorationClosureReevaluationPressureScore,
    "restoration closure saturation risk": restorationClosureSaturationRiskScore,
  });

  return {
    restorationClosurePreservationLevel,
    restorationClosureSeverityScore,
    restorationClosureExposureLevel,
    restorationClosureReevaluationRequirementLevel,
    longHorizonRestorationClosureViability,
    continuationRequired,
    failClosedRestorationClosureDegrading,
    restorationClosureFragmentationDetected,
    restorationClosureDesynchronizationDetected,
    recursiveRestorationClosureDriftDetected,
    restorationClosureEntropyRecurrenceDetected,
    restorationClosureSaturationDetected,
    collapseSensitiveRestorationClosureEscalation,
    warningCodes,
    explainability: {
      primaryRestorationClosureDriver,
      dominantRestorationClosureEscalationReason:
        warningCodes[0] ?? "No deterministic restoration closure preservation escalation threshold was crossed.",
      containmentRestorationClosureAssessment: restorationClosureContainmentRiskDetected
        ? "Restoration closure containment is not strong enough to preserve post-restoration closure viability."
        : "Restoration closure containment remains preservation-ready for the current caller-supplied governance context.",
      longHorizonRestorationClosureAssessment:
        longHorizonRestorationClosureViability === "durable"
          ? "Long-horizon restoration closure preservation is durable under the current inputs. Restoration closure preservation does not imply permanent governance recovery."
          : `Long-horizon restoration closure preservation is ${longHorizonRestorationClosureViability} under the current inputs. Restoration handoff durability does not guarantee closure preservation.`,
      failClosedRestorationClosureAssessment: failClosedRestorationClosureDegrading
        ? "Fail-closed restoration closure is degrading and overrides optimistic closure preservation assumptions."
        : "Fail-closed restoration closure remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
