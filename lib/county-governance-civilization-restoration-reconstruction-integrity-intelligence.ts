export type CountyGovernanceCivilizationRestorationReconstructionIntegrityLevel =
  | "durable_restoration_reconstruction_integrity"
  | "bounded_restoration_reconstruction_integrity"
  | "restoration_reconstruction_continuation_required"
  | "restoration_reconstruction_degrading"
  | "restoration_reconstruction_unstable"
  | "fail_closed_reconstruction_integrity_degradation"
  | "collapse_sensitive_reconstruction_integrity";

export type CountyGovernanceCivilizationRestorationReconstructionExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceCivilizationRestorationReconstructionReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonReconstructionIntegrity =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_reconstructable";

export type CountyGovernanceCivilizationRestorationReconstructionWarningCode =
  | "REPLAY_RECONSTRUCTION_INTEGRITY_WEAKNESS"
  | "RECONSTRUCTION_TRUST_DURABILITY_WEAKNESS"
  | "RECONSTRUCTION_COHERENCE_WEAKNESS"
  | "RECONSTRUCTION_AUDITABILITY_WEAKNESS"
  | "FAIL_CLOSED_RECONSTRUCTION_INTEGRITY_DEGRADATION"
  | "RECONSTRUCTION_DESYNCHRONIZATION_RISK"
  | "RECONSTRUCTION_DOCTRINE_DIVERGENCE_RISK"
  | "RECURSIVE_RECONSTRUCTION_DRIFT"
  | "RECONSTRUCTION_CONTAINMENT_RISK"
  | "REPLAY_RECONSTRUCTION_EXPLAINABILITY_DECAY"
  | "RECONSTRUCTION_ENTROPY_RECURRENCE_RISK"
  | "RECONSTRUCTION_REEVALUATION_REQUIRED"
  | "RECONSTRUCTION_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_RECONSTRUCTION_INTEGRITY";

export type CountyGovernanceCivilizationRestorationReconstructionIntegrityInput = {
  replayReconstructionIntegrityScore: number;
  reconstructionTrustDurabilityScore: number;
  reconstructionCoherenceScore: number;
  reconstructionAuditabilityScore: number;
  failClosedReconstructionIntegrityScore: number;
  reconstructionDesynchronizationRiskScore: number;
  reconstructionDoctrineDivergenceRiskScore: number;
  recursiveReconstructionDriftRiskScore: number;
  reconstructionContainmentIntegrityScore: number;
  replayReconstructionExplainabilityScore: number;
  reconstructionEntropyRecurrenceRiskScore: number;
  reconstructionReevaluationPressureScore: number;
};

export type CountyGovernanceCivilizationRestorationReconstructionIntegrityResult = {
  reconstructionIntegrityLevel: CountyGovernanceCivilizationRestorationReconstructionIntegrityLevel;
  reconstructionSeverityScore: number;
  reconstructionExposureLevel: CountyGovernanceCivilizationRestorationReconstructionExposureLevel;
  reconstructionReevaluationRequirementLevel: CountyGovernanceCivilizationRestorationReconstructionReevaluationRequirementLevel;
  longHorizonReconstructionIntegrity: CountyGovernanceLongHorizonReconstructionIntegrity;
  continuationRequired: boolean;
  failClosedReconstructionIntegrityDegrading: boolean;
  reconstructionDesynchronizationDetected: boolean;
  reconstructionDoctrineDivergenceDetected: boolean;
  recursiveReconstructionDriftDetected: boolean;
  reconstructionContainmentRiskDetected: boolean;
  reconstructionEntropyRecurrenceDetected: boolean;
  collapseSensitiveReconstructionEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryReconstructionDriver: string;
    dominantReconstructionEscalationReason: string;
    containmentReconstructionAssessment: string;
    longHorizonReconstructionAssessment: string;
    failClosedReconstructionAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceCivilizationRestorationReconstructionWarningCode[] = [
  "FAIL_CLOSED_RECONSTRUCTION_INTEGRITY_DEGRADATION",
  "COLLAPSE_SENSITIVE_RECONSTRUCTION_INTEGRITY",
  "RECURSIVE_RECONSTRUCTION_DRIFT",
  "RECONSTRUCTION_ENTROPY_RECURRENCE_RISK",
  "RECONSTRUCTION_CONTAINMENT_RISK",
  "RECONSTRUCTION_DESYNCHRONIZATION_RISK",
  "RECONSTRUCTION_DOCTRINE_DIVERGENCE_RISK",
  "RECONSTRUCTION_TRUST_DURABILITY_WEAKNESS",
  "RECONSTRUCTION_COHERENCE_WEAKNESS",
  "RECONSTRUCTION_AUDITABILITY_WEAKNESS",
  "REPLAY_RECONSTRUCTION_EXPLAINABILITY_DECAY",
  "REPLAY_RECONSTRUCTION_INTEGRITY_WEAKNESS",
  "RECONSTRUCTION_REEVALUATION_REQUIRED",
  "RECONSTRUCTION_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceCivilizationRestorationReconstructionExposureLevel {
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
): CountyGovernanceCivilizationRestorationReconstructionReevaluationRequirementLevel {
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

function classifyLongHorizonReconstruction(params: {
  replayReconstructionIntegrityScore: number;
  reconstructionTrustDurabilityScore: number;
  reconstructionCoherenceScore: number;
  failClosedReconstructionIntegrityScore: number;
  reconstructionEntropyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonReconstructionIntegrity {
  if (
    params.replayReconstructionIntegrityScore < 35 ||
    params.reconstructionTrustDurabilityScore < 35 ||
    params.failClosedReconstructionIntegrityScore < 35 ||
    params.reconstructionEntropyRecurrenceRiskScore >= 88
  ) {
    return "non_reconstructable";
  }

  if (
    params.replayReconstructionIntegrityScore < 55 ||
    params.reconstructionTrustDurabilityScore < 55 ||
    params.reconstructionCoherenceScore < 55 ||
    params.failClosedReconstructionIntegrityScore < 55 ||
    params.reconstructionEntropyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.replayReconstructionIntegrityScore < 75 ||
    params.reconstructionTrustDurabilityScore < 75 ||
    params.reconstructionCoherenceScore < 75 ||
    params.reconstructionEntropyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.replayReconstructionIntegrityScore < 88 ||
    params.reconstructionTrustDurabilityScore < 88 ||
    params.reconstructionCoherenceScore < 88 ||
    params.reconstructionEntropyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  reconstructionIntegrityWeakness: boolean;
  trustDurabilityWeakness: boolean;
  coherenceWeakness: boolean;
  auditabilityWeakness: boolean;
  failClosedDegradation: boolean;
  desynchronization: boolean;
  doctrineDivergence: boolean;
  recursiveDrift: boolean;
  containmentRisk: boolean;
  explainabilityDecay: boolean;
  entropyRecurrence: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceCivilizationRestorationReconstructionWarningCode[] {
  const warnings = new Set<CountyGovernanceCivilizationRestorationReconstructionWarningCode>();

  if (params.reconstructionIntegrityWeakness) {
    warnings.add("REPLAY_RECONSTRUCTION_INTEGRITY_WEAKNESS");
  }

  if (params.trustDurabilityWeakness) {
    warnings.add("RECONSTRUCTION_TRUST_DURABILITY_WEAKNESS");
  }

  if (params.coherenceWeakness) {
    warnings.add("RECONSTRUCTION_COHERENCE_WEAKNESS");
  }

  if (params.auditabilityWeakness) {
    warnings.add("RECONSTRUCTION_AUDITABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_RECONSTRUCTION_INTEGRITY_DEGRADATION");
  }

  if (params.desynchronization) {
    warnings.add("RECONSTRUCTION_DESYNCHRONIZATION_RISK");
  }

  if (params.doctrineDivergence) {
    warnings.add("RECONSTRUCTION_DOCTRINE_DIVERGENCE_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_RECONSTRUCTION_DRIFT");
  }

  if (params.containmentRisk) {
    warnings.add("RECONSTRUCTION_CONTAINMENT_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("REPLAY_RECONSTRUCTION_EXPLAINABILITY_DECAY");
  }

  if (params.entropyRecurrence) {
    warnings.add("RECONSTRUCTION_ENTROPY_RECURRENCE_RISK");
  }

  if (params.reevaluationRequired) {
    warnings.add("RECONSTRUCTION_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("RECONSTRUCTION_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_RECONSTRUCTION_INTEGRITY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["civilization restoration reconstruction integrity", 0],
  )[0];
}

function classifyReconstruction(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  desynchronization: boolean;
  doctrineDivergence: boolean;
  trustDurabilityWeakness: boolean;
  coherenceWeakness: boolean;
  auditabilityWeakness: boolean;
  explainabilityDecay: boolean;
  reconstructionIntegrityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceCivilizationRestorationReconstructionIntegrityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_reconstruction_integrity_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_reconstruction_integrity";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.desynchronization ||
    params.doctrineDivergence
  ) {
    return "restoration_reconstruction_unstable";
  }

  if (
    params.trustDurabilityWeakness ||
    params.coherenceWeakness ||
    params.auditabilityWeakness ||
    params.explainabilityDecay ||
    params.reconstructionIntegrityWeakness
  ) {
    return "restoration_reconstruction_degrading";
  }

  if (params.continuationRequired) {
    return "restoration_reconstruction_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_restoration_reconstruction_integrity";
  }

  return "durable_restoration_reconstruction_integrity";
}

export function evaluateCountyGovernanceCivilizationRestorationReconstructionIntegrity(
  input: CountyGovernanceCivilizationRestorationReconstructionIntegrityInput,
): CountyGovernanceCivilizationRestorationReconstructionIntegrityResult {
  const replayReconstructionIntegrityScore = clampScore(input.replayReconstructionIntegrityScore);
  const reconstructionTrustDurabilityScore = clampScore(input.reconstructionTrustDurabilityScore);
  const reconstructionCoherenceScore = clampScore(input.reconstructionCoherenceScore);
  const reconstructionAuditabilityScore = clampScore(input.reconstructionAuditabilityScore);
  const failClosedReconstructionIntegrityScore = clampScore(input.failClosedReconstructionIntegrityScore);
  const reconstructionDesynchronizationRiskScore = clampScore(input.reconstructionDesynchronizationRiskScore);
  const reconstructionDoctrineDivergenceRiskScore = clampScore(input.reconstructionDoctrineDivergenceRiskScore);
  const recursiveReconstructionDriftRiskScore = clampScore(input.recursiveReconstructionDriftRiskScore);
  const reconstructionContainmentIntegrityScore = clampScore(input.reconstructionContainmentIntegrityScore);
  const replayReconstructionExplainabilityScore = clampScore(input.replayReconstructionExplainabilityScore);
  const reconstructionEntropyRecurrenceRiskScore = clampScore(input.reconstructionEntropyRecurrenceRiskScore);
  const reconstructionReevaluationPressureScore = clampScore(input.reconstructionReevaluationPressureScore);

  const failClosedReconstructionIntegrityDegrading = failClosedReconstructionIntegrityScore < 55;
  const reconstructionDesynchronizationDetected = reconstructionDesynchronizationRiskScore >= 45;
  const reconstructionDoctrineDivergenceDetected = reconstructionDoctrineDivergenceRiskScore >= 45;
  const recursiveReconstructionDriftDetected = recursiveReconstructionDriftRiskScore >= 45;
  const reconstructionContainmentRiskDetected = reconstructionContainmentIntegrityScore < 55;
  const reconstructionEntropyRecurrenceDetected = reconstructionEntropyRecurrenceRiskScore >= 45;
  const reconstructionTrustDurabilityWeakness = reconstructionTrustDurabilityScore < 55;
  const reconstructionCoherenceWeakness = reconstructionCoherenceScore < 55;
  const reconstructionAuditabilityWeakness = reconstructionAuditabilityScore < 55;
  const replayReconstructionExplainabilityDecay = replayReconstructionExplainabilityScore < 55;
  const replayReconstructionIntegrityWeakness = replayReconstructionIntegrityScore < 75;
  const collapseSensitiveReconstructionEscalation =
    (recursiveReconstructionDriftRiskScore >= 88 ||
      reconstructionEntropyRecurrenceRiskScore >= 88 ||
      reconstructionDesynchronizationRiskScore >= 88) &&
    (failClosedReconstructionIntegrityScore < 65 || reconstructionTrustDurabilityScore < 55);
  const reevaluationRequired =
    reconstructionReevaluationPressureScore >= 58 ||
    reconstructionTrustDurabilityWeakness ||
    reconstructionCoherenceWeakness ||
    reconstructionAuditabilityWeakness ||
    replayReconstructionExplainabilityDecay ||
    reconstructionDesynchronizationDetected ||
    reconstructionDoctrineDivergenceDetected;

  const reconstructionSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(replayReconstructionIntegrityScore),
      inverseHealthScore(reconstructionTrustDurabilityScore),
      inverseHealthScore(reconstructionCoherenceScore),
      inverseHealthScore(reconstructionAuditabilityScore),
      inverseHealthScore(failClosedReconstructionIntegrityScore),
      reconstructionDesynchronizationRiskScore,
      reconstructionDoctrineDivergenceRiskScore,
      recursiveReconstructionDriftRiskScore,
      inverseHealthScore(reconstructionContainmentIntegrityScore),
      inverseHealthScore(replayReconstructionExplainabilityScore),
      reconstructionEntropyRecurrenceRiskScore,
      reconstructionReevaluationPressureScore,
    ]),
  );

  const longHorizonReconstructionIntegrity = classifyLongHorizonReconstruction({
    replayReconstructionIntegrityScore,
    reconstructionTrustDurabilityScore,
    reconstructionCoherenceScore,
    failClosedReconstructionIntegrityScore,
    reconstructionEntropyRecurrenceRiskScore,
  });
  const reconstructionExposureLevel = classifyExposure(reconstructionSeverityScore);
  const reconstructionReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      reconstructionSeverityScore,
      reconstructionReevaluationPressureScore,
      reconstructionEntropyRecurrenceRiskScore,
      recursiveReconstructionDriftRiskScore,
      reconstructionDesynchronizationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedReconstructionIntegrityDegrading &&
    !collapseSensitiveReconstructionEscalation &&
    !recursiveReconstructionDriftDetected &&
    !reconstructionEntropyRecurrenceDetected &&
    !reconstructionContainmentRiskDetected &&
    !reconstructionDesynchronizationDetected &&
    !reconstructionDoctrineDivergenceDetected &&
    reconstructionSeverityScore >= 35 &&
    reconstructionSeverityScore < 72;

  const warningCodes = buildWarnings({
    reconstructionIntegrityWeakness: replayReconstructionIntegrityWeakness,
    trustDurabilityWeakness: reconstructionTrustDurabilityWeakness,
    coherenceWeakness: reconstructionCoherenceWeakness,
    auditabilityWeakness: reconstructionAuditabilityWeakness,
    failClosedDegradation: failClosedReconstructionIntegrityDegrading,
    desynchronization: reconstructionDesynchronizationDetected,
    doctrineDivergence: reconstructionDoctrineDivergenceDetected,
    recursiveDrift: recursiveReconstructionDriftDetected,
    containmentRisk: reconstructionContainmentRiskDetected,
    explainabilityDecay: replayReconstructionExplainabilityDecay,
    entropyRecurrence: reconstructionEntropyRecurrenceDetected,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveReconstructionEscalation,
  });

  const reconstructionIntegrityLevel = classifyReconstruction({
    failClosedDegradation: failClosedReconstructionIntegrityDegrading,
    collapseSensitive: collapseSensitiveReconstructionEscalation,
    recursiveDrift: recursiveReconstructionDriftDetected,
    entropyRecurrence: reconstructionEntropyRecurrenceDetected,
    containmentRisk: reconstructionContainmentRiskDetected,
    desynchronization: reconstructionDesynchronizationDetected,
    doctrineDivergence: reconstructionDoctrineDivergenceDetected,
    trustDurabilityWeakness: reconstructionTrustDurabilityWeakness,
    coherenceWeakness: reconstructionCoherenceWeakness,
    auditabilityWeakness: reconstructionAuditabilityWeakness,
    explainabilityDecay: replayReconstructionExplainabilityDecay,
    reconstructionIntegrityWeakness: replayReconstructionIntegrityWeakness,
    continuationRequired,
    severityScore: reconstructionSeverityScore,
  });

  const primaryReconstructionDriver = selectPrimaryDriver({
    "replay reconstruction integrity weakness": inverseHealthScore(replayReconstructionIntegrityScore),
    "reconstruction trust durability weakness": inverseHealthScore(reconstructionTrustDurabilityScore),
    "reconstruction coherence weakness": inverseHealthScore(reconstructionCoherenceScore),
    "reconstruction auditability weakness": inverseHealthScore(reconstructionAuditabilityScore),
    "fail-closed reconstruction integrity degradation": inverseHealthScore(failClosedReconstructionIntegrityScore),
    "reconstruction desynchronization risk": reconstructionDesynchronizationRiskScore,
    "reconstruction doctrine divergence risk": reconstructionDoctrineDivergenceRiskScore,
    "recursive reconstruction drift": recursiveReconstructionDriftRiskScore,
    "reconstruction containment risk": inverseHealthScore(reconstructionContainmentIntegrityScore),
    "replay reconstruction explainability decay": inverseHealthScore(replayReconstructionExplainabilityScore),
    "reconstruction entropy recurrence risk": reconstructionEntropyRecurrenceRiskScore,
    "reconstruction reevaluation pressure": reconstructionReevaluationPressureScore,
  });

  return {
    reconstructionIntegrityLevel,
    reconstructionSeverityScore,
    reconstructionExposureLevel,
    reconstructionReevaluationRequirementLevel,
    longHorizonReconstructionIntegrity,
    continuationRequired,
    failClosedReconstructionIntegrityDegrading,
    reconstructionDesynchronizationDetected,
    reconstructionDoctrineDivergenceDetected,
    recursiveReconstructionDriftDetected,
    reconstructionContainmentRiskDetected,
    reconstructionEntropyRecurrenceDetected,
    collapseSensitiveReconstructionEscalation,
    warningCodes,
    explainability: {
      primaryReconstructionDriver,
      dominantReconstructionEscalationReason:
        warningCodes[0] ??
        "No deterministic civilization restoration reconstruction integrity escalation threshold was crossed.",
      containmentReconstructionAssessment: reconstructionContainmentRiskDetected
        ? "Reconstruction containment is not strong enough to preserve governance reconstruction integrity under replay pressure."
        : "Reconstruction containment remains integrity-preserving for the current caller-supplied governance context.",
      longHorizonReconstructionAssessment:
        longHorizonReconstructionIntegrity === "durable"
          ? "Long-horizon civilization restoration reconstruction integrity is durable under the current inputs. Reconstruction survivability does not imply irreversible governance restoration capability."
          : `Long-horizon civilization restoration reconstruction integrity is ${longHorizonReconstructionIntegrity} under the current inputs. Replay survivability does not guarantee reconstruction integrity.`,
      failClosedReconstructionAssessment: failClosedReconstructionIntegrityDegrading
        ? "Fail-closed reconstruction integrity is degrading and overrides optimistic reconstruction assumptions."
        : "Fail-closed reconstruction integrity remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
