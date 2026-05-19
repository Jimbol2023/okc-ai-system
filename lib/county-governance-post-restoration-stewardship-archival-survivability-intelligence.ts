export type CountyGovernanceArchivalSurvivabilityLevel =
  | "durable_post_restoration_archival_survivability"
  | "bounded_post_restoration_archival_survivability"
  | "post_restoration_archival_continuation_required"
  | "post_restoration_archival_degrading"
  | "post_restoration_archival_unstable"
  | "fail_closed_archival_degradation"
  | "collapse_sensitive_archival";

export type CountyGovernanceArchivalExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceArchivalReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonArchivalViability =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_viable";

export type CountyGovernancePostRestorationStewardshipArchivalSurvivabilityWarningCode =
  | "ARCHIVAL_CONTINUITY_DURABILITY_WEAKNESS"
  | "ARCHIVAL_SURVIVABILITY_WEAKNESS"
  | "ARCHIVAL_CONTAINMENT_PERSISTENCE_RISK"
  | "ARCHIVAL_EXPLAINABILITY_CONTINUITY_DECAY"
  | "FAIL_CLOSED_ARCHIVAL_DEGRADATION"
  | "ARCHIVAL_FRAGMENTATION_RISK"
  | "ARCHIVAL_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_ARCHIVAL_DRIFT"
  | "ARCHIVAL_ENTROPY_RECURRENCE_RISK"
  | "ARCHIVAL_SATURATION_RISK"
  | "LONG_HORIZON_ARCHIVAL_VIABILITY_WEAKNESS"
  | "ARCHIVAL_REEVALUATION_REQUIRED"
  | "ARCHIVAL_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_ARCHIVAL";

export type CountyGovernancePostRestorationStewardshipArchivalSurvivabilityInput = {
  archivalContinuityDurabilityScore: number;
  archivalSurvivabilityScore: number;
  archivalContainmentPersistenceScore: number;
  archivalExplainabilityContinuityScore: number;
  failClosedArchivalScore: number;
  archivalFragmentationRiskScore: number;
  archivalDesynchronizationRiskScore: number;
  recursiveArchivalDriftRiskScore: number;
  archivalEntropyRecurrenceRiskScore: number;
  archivalReevaluationPressureScore: number;
  archivalSaturationRiskScore: number;
  longHorizonArchivalViabilityScore: number;
};

export type CountyGovernancePostRestorationStewardshipArchivalSurvivabilityResult = {
  archivalSurvivabilityLevel: CountyGovernanceArchivalSurvivabilityLevel;
  archivalSeverityScore: number;
  archivalExposureLevel: CountyGovernanceArchivalExposureLevel;
  archivalReevaluationRequirementLevel: CountyGovernanceArchivalReevaluationRequirementLevel;
  longHorizonArchivalViability: CountyGovernanceLongHorizonArchivalViability;
  continuationRequired: boolean;
  failClosedArchivalDegrading: boolean;
  archivalFragmentationDetected: boolean;
  archivalDesynchronizationDetected: boolean;
  recursiveArchivalDriftDetected: boolean;
  archivalEntropyRecurrenceDetected: boolean;
  archivalSaturationDetected: boolean;
  collapseSensitiveArchivalEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryArchivalDriver: string;
    dominantArchivalEscalationReason: string;
    containmentArchivalAssessment: string;
    longHorizonArchivalAssessment: string;
    failClosedArchivalAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernancePostRestorationStewardshipArchivalSurvivabilityWarningCode[] = [
  "FAIL_CLOSED_ARCHIVAL_DEGRADATION",
  "COLLAPSE_SENSITIVE_ARCHIVAL",
  "RECURSIVE_ARCHIVAL_DRIFT",
  "ARCHIVAL_ENTROPY_RECURRENCE_RISK",
  "ARCHIVAL_SATURATION_RISK",
  "ARCHIVAL_CONTAINMENT_PERSISTENCE_RISK",
  "ARCHIVAL_DESYNCHRONIZATION_RISK",
  "ARCHIVAL_FRAGMENTATION_RISK",
  "ARCHIVAL_SURVIVABILITY_WEAKNESS",
  "LONG_HORIZON_ARCHIVAL_VIABILITY_WEAKNESS",
  "ARCHIVAL_EXPLAINABILITY_CONTINUITY_DECAY",
  "ARCHIVAL_CONTINUITY_DURABILITY_WEAKNESS",
  "ARCHIVAL_REEVALUATION_REQUIRED",
  "ARCHIVAL_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceArchivalExposureLevel {
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

function classifyReevaluation(score: number): CountyGovernanceArchivalReevaluationRequirementLevel {
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

function classifyLongHorizonArchival(params: {
  archivalContinuityDurabilityScore: number;
  archivalSurvivabilityScore: number;
  failClosedArchivalScore: number;
  archivalEntropyRecurrenceRiskScore: number;
  archivalSaturationRiskScore: number;
  longHorizonArchivalViabilityScore: number;
}): CountyGovernanceLongHorizonArchivalViability {
  if (
    params.archivalContinuityDurabilityScore < 35 ||
    params.archivalSurvivabilityScore < 35 ||
    params.failClosedArchivalScore < 35 ||
    params.longHorizonArchivalViabilityScore < 35 ||
    params.archivalEntropyRecurrenceRiskScore >= 88 ||
    params.archivalSaturationRiskScore >= 88
  ) {
    return "non_viable";
  }

  if (
    params.archivalContinuityDurabilityScore < 55 ||
    params.archivalSurvivabilityScore < 55 ||
    params.failClosedArchivalScore < 55 ||
    params.longHorizonArchivalViabilityScore < 55 ||
    params.archivalEntropyRecurrenceRiskScore >= 72 ||
    params.archivalSaturationRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.archivalContinuityDurabilityScore < 75 ||
    params.archivalSurvivabilityScore < 75 ||
    params.longHorizonArchivalViabilityScore < 75 ||
    params.archivalEntropyRecurrenceRiskScore >= 50 ||
    params.archivalSaturationRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.archivalContinuityDurabilityScore < 88 ||
    params.archivalSurvivabilityScore < 88 ||
    params.longHorizonArchivalViabilityScore < 88 ||
    params.archivalEntropyRecurrenceRiskScore >= 25 ||
    params.archivalSaturationRiskScore >= 25
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
}): CountyGovernancePostRestorationStewardshipArchivalSurvivabilityWarningCode[] {
  const warnings = new Set<CountyGovernancePostRestorationStewardshipArchivalSurvivabilityWarningCode>();

  if (params.continuityDurabilityWeakness) {
    warnings.add("ARCHIVAL_CONTINUITY_DURABILITY_WEAKNESS");
  }

  if (params.survivabilityWeakness) {
    warnings.add("ARCHIVAL_SURVIVABILITY_WEAKNESS");
  }

  if (params.containmentPersistenceRisk) {
    warnings.add("ARCHIVAL_CONTAINMENT_PERSISTENCE_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("ARCHIVAL_EXPLAINABILITY_CONTINUITY_DECAY");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_ARCHIVAL_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("ARCHIVAL_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("ARCHIVAL_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_ARCHIVAL_DRIFT");
  }

  if (params.entropyRecurrence) {
    warnings.add("ARCHIVAL_ENTROPY_RECURRENCE_RISK");
  }

  if (params.saturation) {
    warnings.add("ARCHIVAL_SATURATION_RISK");
  }

  if (params.longHorizonViabilityWeakness) {
    warnings.add("LONG_HORIZON_ARCHIVAL_VIABILITY_WEAKNESS");
  }

  if (params.reevaluationRequired) {
    warnings.add("ARCHIVAL_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("ARCHIVAL_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_ARCHIVAL");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["post-restoration stewardship archival survivability", 0],
  )[0];
}

function classifyArchivalSurvivability(params: {
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
}): CountyGovernanceArchivalSurvivabilityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_archival_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_archival";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.saturation ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "post_restoration_archival_unstable";
  }

  if (
    params.survivabilityWeakness ||
    params.longHorizonWeakness ||
    params.explainabilityDecay ||
    params.continuityWeakness
  ) {
    return "post_restoration_archival_degrading";
  }

  if (params.continuationRequired) {
    return "post_restoration_archival_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_post_restoration_archival_survivability";
  }

  return "durable_post_restoration_archival_survivability";
}

export function evaluateCountyGovernancePostRestorationStewardshipArchivalSurvivability(
  input: CountyGovernancePostRestorationStewardshipArchivalSurvivabilityInput,
): CountyGovernancePostRestorationStewardshipArchivalSurvivabilityResult {
  const archivalContinuityDurabilityScore = clampScore(input.archivalContinuityDurabilityScore);
  const archivalSurvivabilityScore = clampScore(input.archivalSurvivabilityScore);
  const archivalContainmentPersistenceScore = clampScore(input.archivalContainmentPersistenceScore);
  const archivalExplainabilityContinuityScore = clampScore(input.archivalExplainabilityContinuityScore);
  const failClosedArchivalScore = clampScore(input.failClosedArchivalScore);
  const archivalFragmentationRiskScore = clampScore(input.archivalFragmentationRiskScore);
  const archivalDesynchronizationRiskScore = clampScore(input.archivalDesynchronizationRiskScore);
  const recursiveArchivalDriftRiskScore = clampScore(input.recursiveArchivalDriftRiskScore);
  const archivalEntropyRecurrenceRiskScore = clampScore(input.archivalEntropyRecurrenceRiskScore);
  const archivalReevaluationPressureScore = clampScore(input.archivalReevaluationPressureScore);
  const archivalSaturationRiskScore = clampScore(input.archivalSaturationRiskScore);
  const longHorizonArchivalViabilityScore = clampScore(input.longHorizonArchivalViabilityScore);

  const failClosedArchivalDegrading = failClosedArchivalScore < 55;
  const archivalFragmentationDetected = archivalFragmentationRiskScore >= 45;
  const archivalDesynchronizationDetected = archivalDesynchronizationRiskScore >= 45;
  const recursiveArchivalDriftDetected = recursiveArchivalDriftRiskScore >= 45;
  const archivalEntropyRecurrenceDetected = archivalEntropyRecurrenceRiskScore >= 45;
  const archivalSaturationDetected = archivalSaturationRiskScore >= 45;
  const archivalContainmentPersistenceRisk = archivalContainmentPersistenceScore < 55;
  const archivalSurvivabilityWeakness = archivalSurvivabilityScore < 55;
  const archivalExplainabilityDecay = archivalExplainabilityContinuityScore < 55;
  const longHorizonArchivalViabilityWeakness = longHorizonArchivalViabilityScore < 55;
  const archivalContinuityDurabilityWeakness = archivalContinuityDurabilityScore < 75;
  const collapseSensitiveArchivalEscalation =
    (recursiveArchivalDriftRiskScore >= 88 ||
      archivalEntropyRecurrenceRiskScore >= 88 ||
      archivalDesynchronizationRiskScore >= 88 ||
      archivalFragmentationRiskScore >= 88 ||
      archivalSaturationRiskScore >= 88) &&
    (failClosedArchivalScore < 65 || archivalSurvivabilityScore < 55);
  const reevaluationRequired =
    archivalReevaluationPressureScore >= 58 ||
    archivalSurvivabilityWeakness ||
    archivalContainmentPersistenceRisk ||
    archivalExplainabilityDecay ||
    longHorizonArchivalViabilityWeakness ||
    archivalFragmentationDetected ||
    archivalDesynchronizationDetected ||
    archivalSaturationDetected;

  const archivalSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(archivalContinuityDurabilityScore),
      inverseHealthScore(archivalSurvivabilityScore),
      inverseHealthScore(archivalContainmentPersistenceScore),
      inverseHealthScore(archivalExplainabilityContinuityScore),
      inverseHealthScore(failClosedArchivalScore),
      archivalFragmentationRiskScore,
      archivalDesynchronizationRiskScore,
      recursiveArchivalDriftRiskScore,
      archivalEntropyRecurrenceRiskScore,
      archivalReevaluationPressureScore,
      archivalSaturationRiskScore,
      inverseHealthScore(longHorizonArchivalViabilityScore),
    ]),
  );

  const longHorizonArchivalViability = classifyLongHorizonArchival({
    archivalContinuityDurabilityScore,
    archivalSurvivabilityScore,
    failClosedArchivalScore,
    archivalEntropyRecurrenceRiskScore,
    archivalSaturationRiskScore,
    longHorizonArchivalViabilityScore,
  });
  const archivalExposureLevel = classifyExposure(archivalSeverityScore);
  const archivalReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      archivalSeverityScore,
      archivalReevaluationPressureScore,
      archivalEntropyRecurrenceRiskScore,
      recursiveArchivalDriftRiskScore,
      archivalDesynchronizationRiskScore,
      archivalFragmentationRiskScore,
      archivalSaturationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedArchivalDegrading &&
    !collapseSensitiveArchivalEscalation &&
    !recursiveArchivalDriftDetected &&
    !archivalEntropyRecurrenceDetected &&
    !archivalSaturationDetected &&
    !archivalContainmentPersistenceRisk &&
    !archivalDesynchronizationDetected &&
    !archivalFragmentationDetected &&
    archivalSeverityScore >= 35 &&
    archivalSeverityScore < 72;

  const warningCodes = buildWarnings({
    continuityDurabilityWeakness: archivalContinuityDurabilityWeakness,
    survivabilityWeakness: archivalSurvivabilityWeakness,
    containmentPersistenceRisk: archivalContainmentPersistenceRisk,
    explainabilityDecay: archivalExplainabilityDecay,
    failClosedDegradation: failClosedArchivalDegrading,
    fragmentation: archivalFragmentationDetected,
    desynchronization: archivalDesynchronizationDetected,
    recursiveDrift: recursiveArchivalDriftDetected,
    entropyRecurrence: archivalEntropyRecurrenceDetected,
    saturation: archivalSaturationDetected,
    longHorizonViabilityWeakness: longHorizonArchivalViabilityWeakness,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveArchivalEscalation,
  });

  const archivalSurvivabilityLevel = classifyArchivalSurvivability({
    failClosedDegradation: failClosedArchivalDegrading,
    collapseSensitive: collapseSensitiveArchivalEscalation,
    recursiveDrift: recursiveArchivalDriftDetected,
    entropyRecurrence: archivalEntropyRecurrenceDetected,
    saturation: archivalSaturationDetected,
    containmentRisk: archivalContainmentPersistenceRisk,
    desynchronization: archivalDesynchronizationDetected,
    fragmentation: archivalFragmentationDetected,
    survivabilityWeakness: archivalSurvivabilityWeakness,
    longHorizonWeakness: longHorizonArchivalViabilityWeakness,
    explainabilityDecay: archivalExplainabilityDecay,
    continuityWeakness: archivalContinuityDurabilityWeakness,
    continuationRequired,
    severityScore: archivalSeverityScore,
  });

  const primaryArchivalDriver = selectPrimaryDriver({
    "archival continuity durability weakness": inverseHealthScore(archivalContinuityDurabilityScore),
    "archival survivability weakness": inverseHealthScore(archivalSurvivabilityScore),
    "archival containment persistence risk": inverseHealthScore(archivalContainmentPersistenceScore),
    "archival explainability continuity decay": inverseHealthScore(archivalExplainabilityContinuityScore),
    "fail-closed archival degradation": inverseHealthScore(failClosedArchivalScore),
    "archival fragmentation risk": archivalFragmentationRiskScore,
    "archival desynchronization risk": archivalDesynchronizationRiskScore,
    "recursive archival drift": recursiveArchivalDriftRiskScore,
    "archival entropy recurrence risk": archivalEntropyRecurrenceRiskScore,
    "archival reevaluation pressure": archivalReevaluationPressureScore,
    "archival saturation risk": archivalSaturationRiskScore,
    "long-horizon archival viability weakness": inverseHealthScore(longHorizonArchivalViabilityScore),
  });

  return {
    archivalSurvivabilityLevel,
    archivalSeverityScore,
    archivalExposureLevel,
    archivalReevaluationRequirementLevel,
    longHorizonArchivalViability,
    continuationRequired,
    failClosedArchivalDegrading,
    archivalFragmentationDetected,
    archivalDesynchronizationDetected,
    recursiveArchivalDriftDetected,
    archivalEntropyRecurrenceDetected,
    archivalSaturationDetected,
    collapseSensitiveArchivalEscalation,
    warningCodes,
    explainability: {
      primaryArchivalDriver,
      dominantArchivalEscalationReason:
        warningCodes[0] ?? "No deterministic post-restoration archival escalation threshold was crossed.",
      containmentArchivalAssessment: archivalContainmentPersistenceRisk
        ? "Archival containment persistence is not strong enough to preserve post-restoration archival survivability."
        : "Archival containment persistence remains survivability-preserving for the current caller-supplied governance context.",
      longHorizonArchivalAssessment:
        longHorizonArchivalViability === "durable"
          ? "Long-horizon post-restoration archival viability is durable under the current inputs. Archival continuity does not imply permanent governance recovery or irreversible preservation."
          : `Long-horizon post-restoration archival viability is ${longHorizonArchivalViability} under the current inputs. Stewardship continuity does not guarantee archival survivability.`,
      failClosedArchivalAssessment: failClosedArchivalDegrading
        ? "Fail-closed archival protection is degrading and overrides optimistic archival survivability assumptions."
        : "Fail-closed archival protection remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
