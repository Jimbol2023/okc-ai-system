export type CountyGovernanceCivilizationRestorationReplaySurvivabilityIntegrityLevel =
  | "durable_civilization_restoration_replay_survivability"
  | "bounded_civilization_restoration_replay_survivability"
  | "civilization_restoration_replay_continuation_required"
  | "civilization_restoration_replay_degrading"
  | "civilization_restoration_replay_unstable"
  | "fail_closed_replay_survivability_degradation"
  | "collapse_sensitive_replay_survivability";

export type CountyGovernanceCivilizationRestorationReplaySurvivabilityExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceCivilizationRestorationReplaySurvivabilityReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonReplaySurvivability =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_replayable";

export type CountyGovernanceCivilizationRestorationReplaySurvivabilityWarningCode =
  | "CIVILIZATION_REPLAY_SURVIVABILITY_WEAKNESS"
  | "RESTORATION_REPLAY_RECONSTRUCTION_FIDELITY_WEAKNESS"
  | "FAIL_CLOSED_REPLAY_SURVIVABILITY_DEGRADATION"
  | "REPLAY_ARCHIVE_CORRUPTION_RISK"
  | "RECURSIVE_REPLAY_DEGRADATION"
  | "REPLAY_CONTINUITY_DURABILITY_WEAKNESS"
  | "REPLAY_CONTAINMENT_RISK"
  | "DOCTRINE_REPLAY_CONTINUITY_DRIFT"
  | "REPLAY_EXPLAINABILITY_DECAY"
  | "REPLAY_ENTROPY_RECURRENCE_RISK"
  | "REPLAY_RESTORATION_TRACE_INTEGRITY_WEAKNESS"
  | "REPLAY_REEVALUATION_REQUIRED"
  | "REPLAY_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_REPLAY_SURVIVABILITY";

export type CountyGovernanceCivilizationRestorationReplaySurvivabilityInput = {
  civilizationReplaySurvivabilityIntegrityScore: number;
  restorationReplayReconstructionFidelityScore: number;
  failClosedReplaySurvivabilityScore: number;
  replayArchiveCorruptionRiskScore: number;
  recursiveReplayDegradationRiskScore: number;
  replayContinuityDurabilityScore: number;
  replayContainmentStabilityScore: number;
  doctrineReplayContinuityStabilityScore: number;
  replayExplainabilityDurabilityScore: number;
  replayEntropyRecurrenceRiskScore: number;
  replayRestorationTraceIntegrityScore: number;
  replayReevaluationPressureScore: number;
};

export type CountyGovernanceCivilizationRestorationReplaySurvivabilityResult = {
  replaySurvivabilityIntegrityLevel: CountyGovernanceCivilizationRestorationReplaySurvivabilityIntegrityLevel;
  replaySurvivabilitySeverityScore: number;
  replaySurvivabilityExposureLevel: CountyGovernanceCivilizationRestorationReplaySurvivabilityExposureLevel;
  replaySurvivabilityReevaluationRequirementLevel: CountyGovernanceCivilizationRestorationReplaySurvivabilityReevaluationRequirementLevel;
  longHorizonReplaySurvivability: CountyGovernanceLongHorizonReplaySurvivability;
  continuationRequired: boolean;
  failClosedReplaySurvivabilityDegrading: boolean;
  replayArchiveCorruptionDetected: boolean;
  recursiveReplayDegradationDetected: boolean;
  replayContinuityWeaknessDetected: boolean;
  replayContainmentRiskDetected: boolean;
  replayEntropyRecurrenceDetected: boolean;
  collapseSensitiveReplayEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryReplaySurvivabilityDriver: string;
    dominantReplaySurvivabilityEscalationReason: string;
    containmentReplaySurvivabilityAssessment: string;
    longHorizonReplaySurvivabilityAssessment: string;
    failClosedReplaySurvivabilityAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceCivilizationRestorationReplaySurvivabilityWarningCode[] = [
  "FAIL_CLOSED_REPLAY_SURVIVABILITY_DEGRADATION",
  "COLLAPSE_SENSITIVE_REPLAY_SURVIVABILITY",
  "RECURSIVE_REPLAY_DEGRADATION",
  "REPLAY_ENTROPY_RECURRENCE_RISK",
  "REPLAY_CONTAINMENT_RISK",
  "REPLAY_ARCHIVE_CORRUPTION_RISK",
  "DOCTRINE_REPLAY_CONTINUITY_DRIFT",
  "REPLAY_CONTINUITY_DURABILITY_WEAKNESS",
  "RESTORATION_REPLAY_RECONSTRUCTION_FIDELITY_WEAKNESS",
  "REPLAY_RESTORATION_TRACE_INTEGRITY_WEAKNESS",
  "REPLAY_EXPLAINABILITY_DECAY",
  "CIVILIZATION_REPLAY_SURVIVABILITY_WEAKNESS",
  "REPLAY_REEVALUATION_REQUIRED",
  "REPLAY_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceCivilizationRestorationReplaySurvivabilityExposureLevel {
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

function classifyReevaluation(
  score: number,
): CountyGovernanceCivilizationRestorationReplaySurvivabilityReevaluationRequirementLevel {
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

function classifyLongHorizonReplaySurvivability(params: {
  civilizationReplaySurvivabilityIntegrityScore: number;
  restorationReplayReconstructionFidelityScore: number;
  failClosedReplaySurvivabilityScore: number;
  replayContinuityDurabilityScore: number;
  replayEntropyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonReplaySurvivability {
  if (
    params.civilizationReplaySurvivabilityIntegrityScore < 35 ||
    params.restorationReplayReconstructionFidelityScore < 35 ||
    params.failClosedReplaySurvivabilityScore < 35 ||
    params.replayEntropyRecurrenceRiskScore >= 88
  ) {
    return "non_replayable";
  }

  if (
    params.civilizationReplaySurvivabilityIntegrityScore < 55 ||
    params.restorationReplayReconstructionFidelityScore < 55 ||
    params.failClosedReplaySurvivabilityScore < 55 ||
    params.replayContinuityDurabilityScore < 55 ||
    params.replayEntropyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.civilizationReplaySurvivabilityIntegrityScore < 75 ||
    params.restorationReplayReconstructionFidelityScore < 75 ||
    params.replayContinuityDurabilityScore < 75 ||
    params.replayEntropyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.civilizationReplaySurvivabilityIntegrityScore < 88 ||
    params.restorationReplayReconstructionFidelityScore < 88 ||
    params.replayContinuityDurabilityScore < 88 ||
    params.replayEntropyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  replaySurvivabilityWeakness: boolean;
  reconstructionFidelityWeakness: boolean;
  failClosedDegradation: boolean;
  archiveCorruption: boolean;
  recursiveDegradation: boolean;
  replayContinuityWeakness: boolean;
  containmentRisk: boolean;
  doctrineDrift: boolean;
  explainabilityDecay: boolean;
  entropyRecurrence: boolean;
  traceIntegrityWeakness: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceCivilizationRestorationReplaySurvivabilityWarningCode[] {
  const warnings = new Set<CountyGovernanceCivilizationRestorationReplaySurvivabilityWarningCode>();

  if (params.replaySurvivabilityWeakness) {
    warnings.add("CIVILIZATION_REPLAY_SURVIVABILITY_WEAKNESS");
  }

  if (params.reconstructionFidelityWeakness) {
    warnings.add("RESTORATION_REPLAY_RECONSTRUCTION_FIDELITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_REPLAY_SURVIVABILITY_DEGRADATION");
  }

  if (params.archiveCorruption) {
    warnings.add("REPLAY_ARCHIVE_CORRUPTION_RISK");
  }

  if (params.recursiveDegradation) {
    warnings.add("RECURSIVE_REPLAY_DEGRADATION");
  }

  if (params.replayContinuityWeakness) {
    warnings.add("REPLAY_CONTINUITY_DURABILITY_WEAKNESS");
  }

  if (params.containmentRisk) {
    warnings.add("REPLAY_CONTAINMENT_RISK");
  }

  if (params.doctrineDrift) {
    warnings.add("DOCTRINE_REPLAY_CONTINUITY_DRIFT");
  }

  if (params.explainabilityDecay) {
    warnings.add("REPLAY_EXPLAINABILITY_DECAY");
  }

  if (params.entropyRecurrence) {
    warnings.add("REPLAY_ENTROPY_RECURRENCE_RISK");
  }

  if (params.traceIntegrityWeakness) {
    warnings.add("REPLAY_RESTORATION_TRACE_INTEGRITY_WEAKNESS");
  }

  if (params.reevaluationRequired) {
    warnings.add("REPLAY_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("REPLAY_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_REPLAY_SURVIVABILITY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["civilization restoration replay survivability integrity", 0],
  )[0];
}

function classifyReplaySurvivability(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDegradation: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  archiveCorruption: boolean;
  doctrineDrift: boolean;
  replayContinuityWeakness: boolean;
  reconstructionFidelityWeakness: boolean;
  traceIntegrityWeakness: boolean;
  explainabilityDecay: boolean;
  replaySurvivabilityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceCivilizationRestorationReplaySurvivabilityIntegrityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_replay_survivability_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_replay_survivability";
  }

  if (
    params.recursiveDegradation ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.archiveCorruption
  ) {
    return "civilization_restoration_replay_unstable";
  }

  if (
    params.doctrineDrift ||
    params.replayContinuityWeakness ||
    params.reconstructionFidelityWeakness ||
    params.traceIntegrityWeakness ||
    params.explainabilityDecay ||
    params.replaySurvivabilityWeakness
  ) {
    return "civilization_restoration_replay_degrading";
  }

  if (params.continuationRequired) {
    return "civilization_restoration_replay_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_civilization_restoration_replay_survivability";
  }

  return "durable_civilization_restoration_replay_survivability";
}

export function evaluateCountyGovernanceCivilizationRestorationReplaySurvivability(
  input: CountyGovernanceCivilizationRestorationReplaySurvivabilityInput,
): CountyGovernanceCivilizationRestorationReplaySurvivabilityResult {
  const civilizationReplaySurvivabilityIntegrityScore = clampScore(
    input.civilizationReplaySurvivabilityIntegrityScore,
  );
  const restorationReplayReconstructionFidelityScore = clampScore(
    input.restorationReplayReconstructionFidelityScore,
  );
  const failClosedReplaySurvivabilityScore = clampScore(input.failClosedReplaySurvivabilityScore);
  const replayArchiveCorruptionRiskScore = clampScore(input.replayArchiveCorruptionRiskScore);
  const recursiveReplayDegradationRiskScore = clampScore(input.recursiveReplayDegradationRiskScore);
  const replayContinuityDurabilityScore = clampScore(input.replayContinuityDurabilityScore);
  const replayContainmentStabilityScore = clampScore(input.replayContainmentStabilityScore);
  const doctrineReplayContinuityStabilityScore = clampScore(input.doctrineReplayContinuityStabilityScore);
  const replayExplainabilityDurabilityScore = clampScore(input.replayExplainabilityDurabilityScore);
  const replayEntropyRecurrenceRiskScore = clampScore(input.replayEntropyRecurrenceRiskScore);
  const replayRestorationTraceIntegrityScore = clampScore(input.replayRestorationTraceIntegrityScore);
  const replayReevaluationPressureScore = clampScore(input.replayReevaluationPressureScore);

  const failClosedReplaySurvivabilityDegrading = failClosedReplaySurvivabilityScore < 55;
  const replayArchiveCorruptionDetected = replayArchiveCorruptionRiskScore >= 45;
  const recursiveReplayDegradationDetected = recursiveReplayDegradationRiskScore >= 45;
  const replayContinuityWeaknessDetected = replayContinuityDurabilityScore < 55;
  const replayContainmentRiskDetected = replayContainmentStabilityScore < 55;
  const replayEntropyRecurrenceDetected = replayEntropyRecurrenceRiskScore >= 45;
  const doctrineReplayContinuityDrift = doctrineReplayContinuityStabilityScore < 55;
  const replayExplainabilityDecay = replayExplainabilityDurabilityScore < 55;
  const reconstructionFidelityWeakness = restorationReplayReconstructionFidelityScore < 55;
  const traceIntegrityWeakness = replayRestorationTraceIntegrityScore < 55;
  const replaySurvivabilityWeakness = civilizationReplaySurvivabilityIntegrityScore < 75;
  const collapseSensitiveReplayEscalation =
    (recursiveReplayDegradationRiskScore >= 88 ||
      replayEntropyRecurrenceRiskScore >= 88 ||
      replayArchiveCorruptionRiskScore >= 88) &&
    (failClosedReplaySurvivabilityScore < 65 || replayContinuityDurabilityScore < 55);
  const reevaluationRequired =
    replayReevaluationPressureScore >= 58 ||
    reconstructionFidelityWeakness ||
    replayContinuityWeaknessDetected ||
    traceIntegrityWeakness ||
    replayExplainabilityDecay ||
    doctrineReplayContinuityDrift ||
    replayArchiveCorruptionDetected;

  const replaySurvivabilitySeverityScore = clampScore(
    maxScore([
      inverseHealthScore(civilizationReplaySurvivabilityIntegrityScore),
      inverseHealthScore(restorationReplayReconstructionFidelityScore),
      inverseHealthScore(failClosedReplaySurvivabilityScore),
      replayArchiveCorruptionRiskScore,
      recursiveReplayDegradationRiskScore,
      inverseHealthScore(replayContinuityDurabilityScore),
      inverseHealthScore(replayContainmentStabilityScore),
      inverseHealthScore(doctrineReplayContinuityStabilityScore),
      inverseHealthScore(replayExplainabilityDurabilityScore),
      replayEntropyRecurrenceRiskScore,
      inverseHealthScore(replayRestorationTraceIntegrityScore),
      replayReevaluationPressureScore,
    ]),
  );

  const longHorizonReplaySurvivability = classifyLongHorizonReplaySurvivability({
    civilizationReplaySurvivabilityIntegrityScore,
    restorationReplayReconstructionFidelityScore,
    failClosedReplaySurvivabilityScore,
    replayContinuityDurabilityScore,
    replayEntropyRecurrenceRiskScore,
  });
  const replaySurvivabilityExposureLevel = classifyExposure(replaySurvivabilitySeverityScore);
  const replaySurvivabilityReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      replaySurvivabilitySeverityScore,
      replayReevaluationPressureScore,
      replayEntropyRecurrenceRiskScore,
      recursiveReplayDegradationRiskScore,
      replayArchiveCorruptionRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedReplaySurvivabilityDegrading &&
    !collapseSensitiveReplayEscalation &&
    !recursiveReplayDegradationDetected &&
    !replayEntropyRecurrenceDetected &&
    !replayContainmentRiskDetected &&
    !replayArchiveCorruptionDetected &&
    replaySurvivabilitySeverityScore >= 35 &&
    replaySurvivabilitySeverityScore < 72;

  const warningCodes = buildWarnings({
    replaySurvivabilityWeakness,
    reconstructionFidelityWeakness,
    failClosedDegradation: failClosedReplaySurvivabilityDegrading,
    archiveCorruption: replayArchiveCorruptionDetected,
    recursiveDegradation: recursiveReplayDegradationDetected,
    replayContinuityWeakness: replayContinuityWeaknessDetected,
    containmentRisk: replayContainmentRiskDetected,
    doctrineDrift: doctrineReplayContinuityDrift,
    explainabilityDecay: replayExplainabilityDecay,
    entropyRecurrence: replayEntropyRecurrenceDetected,
    traceIntegrityWeakness,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveReplayEscalation,
  });

  const replaySurvivabilityIntegrityLevel = classifyReplaySurvivability({
    failClosedDegradation: failClosedReplaySurvivabilityDegrading,
    collapseSensitive: collapseSensitiveReplayEscalation,
    recursiveDegradation: recursiveReplayDegradationDetected,
    entropyRecurrence: replayEntropyRecurrenceDetected,
    containmentRisk: replayContainmentRiskDetected,
    archiveCorruption: replayArchiveCorruptionDetected,
    doctrineDrift: doctrineReplayContinuityDrift,
    replayContinuityWeakness: replayContinuityWeaknessDetected,
    reconstructionFidelityWeakness,
    traceIntegrityWeakness,
    explainabilityDecay: replayExplainabilityDecay,
    replaySurvivabilityWeakness,
    continuationRequired,
    severityScore: replaySurvivabilitySeverityScore,
  });

  const primaryReplaySurvivabilityDriver = selectPrimaryDriver({
    "civilization replay survivability weakness": inverseHealthScore(civilizationReplaySurvivabilityIntegrityScore),
    "restoration replay reconstruction fidelity weakness": inverseHealthScore(
      restorationReplayReconstructionFidelityScore,
    ),
    "fail-closed replay survivability degradation": inverseHealthScore(failClosedReplaySurvivabilityScore),
    "replay archive corruption risk": replayArchiveCorruptionRiskScore,
    "recursive replay degradation": recursiveReplayDegradationRiskScore,
    "replay continuity durability weakness": inverseHealthScore(replayContinuityDurabilityScore),
    "replay containment risk": inverseHealthScore(replayContainmentStabilityScore),
    "doctrine replay continuity drift": inverseHealthScore(doctrineReplayContinuityStabilityScore),
    "replay explainability decay": inverseHealthScore(replayExplainabilityDurabilityScore),
    "replay entropy recurrence risk": replayEntropyRecurrenceRiskScore,
    "replay restoration trace integrity weakness": inverseHealthScore(replayRestorationTraceIntegrityScore),
    "replay reevaluation pressure": replayReevaluationPressureScore,
  });

  return {
    replaySurvivabilityIntegrityLevel,
    replaySurvivabilitySeverityScore,
    replaySurvivabilityExposureLevel,
    replaySurvivabilityReevaluationRequirementLevel,
    longHorizonReplaySurvivability,
    continuationRequired,
    failClosedReplaySurvivabilityDegrading,
    replayArchiveCorruptionDetected,
    recursiveReplayDegradationDetected,
    replayContinuityWeaknessDetected,
    replayContainmentRiskDetected,
    replayEntropyRecurrenceDetected,
    collapseSensitiveReplayEscalation,
    warningCodes,
    explainability: {
      primaryReplaySurvivabilityDriver,
      dominantReplaySurvivabilityEscalationReason:
        warningCodes[0] ??
        "No deterministic civilization restoration replay survivability escalation threshold was crossed.",
      containmentReplaySurvivabilityAssessment: replayContainmentRiskDetected
        ? "Replay containment is not strong enough to preserve restoration survivability under reconstruction pressure."
        : "Replay containment remains restoration-survivability-supporting for the current caller-supplied governance context.",
      longHorizonReplaySurvivabilityAssessment:
        longHorizonReplaySurvivability === "durable"
          ? "Long-horizon civilization restoration replay survivability is durable under the current inputs. Replay survivability does not imply irreversible restoration capability."
          : `Long-horizon civilization restoration replay survivability is ${longHorizonReplaySurvivability} under the current inputs. Civilization preservation does not guarantee replay survivability.`,
      failClosedReplaySurvivabilityAssessment: failClosedReplaySurvivabilityDegrading
        ? "Fail-closed replay survivability is degrading and overrides optimistic replay assumptions."
        : "Fail-closed replay survivability remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
