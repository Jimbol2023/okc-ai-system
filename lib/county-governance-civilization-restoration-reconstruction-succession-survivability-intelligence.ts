export type CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityLevel =
  | "durable_reconstruction_succession_survivability"
  | "bounded_reconstruction_succession_survivability"
  | "reconstruction_succession_continuation_required"
  | "reconstruction_succession_degrading"
  | "reconstruction_succession_unstable"
  | "fail_closed_succession_survivability_degradation"
  | "collapse_sensitive_succession_survivability";

export type CountyGovernanceCivilizationRestorationReconstructionSuccessionExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceCivilizationRestorationReconstructionSuccessionReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonSuccessionSurvivability =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_successional";

export type CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityWarningCode =
  | "RECONSTRUCTION_SUCCESSION_INTEGRITY_WEAKNESS"
  | "SUCCESSION_TRUST_DURABILITY_WEAKNESS"
  | "SUCCESSION_TRANSFER_STABILITY_WEAKNESS"
  | "SUCCESSION_AUDITABILITY_WEAKNESS"
  | "FAIL_CLOSED_SUCCESSION_SURVIVABILITY_DEGRADATION"
  | "SUCCESSION_DESYNCHRONIZATION_RISK"
  | "SUCCESSION_FRAGMENTATION_RISK"
  | "RECURSIVE_SUCCESSION_DRIFT"
  | "SUCCESSION_CONTAINMENT_RISK"
  | "SUCCESSION_EXPLAINABILITY_DECAY"
  | "SUCCESSION_ENTROPY_RECURRENCE_RISK"
  | "SUCCESSION_REEVALUATION_REQUIRED"
  | "SUCCESSION_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_SUCCESSION_SURVIVABILITY";

export type CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityInput = {
  reconstructionSuccessionIntegrityScore: number;
  successionTrustDurabilityScore: number;
  successionTransferStabilityScore: number;
  successionAuditabilityScore: number;
  failClosedSuccessionSurvivabilityScore: number;
  successionDesynchronizationRiskScore: number;
  successionFragmentationRiskScore: number;
  recursiveSuccessionDriftRiskScore: number;
  successionContainmentIntegrityScore: number;
  successionExplainabilityDurabilityScore: number;
  successionEntropyRecurrenceRiskScore: number;
  successionReevaluationPressureScore: number;
};

export type CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityResult = {
  successionSurvivabilityLevel: CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityLevel;
  successionSeverityScore: number;
  successionExposureLevel: CountyGovernanceCivilizationRestorationReconstructionSuccessionExposureLevel;
  successionReevaluationRequirementLevel: CountyGovernanceCivilizationRestorationReconstructionSuccessionReevaluationRequirementLevel;
  longHorizonSuccessionSurvivability: CountyGovernanceLongHorizonSuccessionSurvivability;
  continuationRequired: boolean;
  failClosedSuccessionSurvivabilityDegrading: boolean;
  successionDesynchronizationDetected: boolean;
  successionFragmentationDetected: boolean;
  recursiveSuccessionDriftDetected: boolean;
  successionContainmentRiskDetected: boolean;
  successionEntropyRecurrenceDetected: boolean;
  collapseSensitiveSuccessionEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primarySuccessionDriver: string;
    dominantSuccessionEscalationReason: string;
    containmentSuccessionAssessment: string;
    longHorizonSuccessionAssessment: string;
    failClosedSuccessionAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityWarningCode[] = [
  "FAIL_CLOSED_SUCCESSION_SURVIVABILITY_DEGRADATION",
  "COLLAPSE_SENSITIVE_SUCCESSION_SURVIVABILITY",
  "RECURSIVE_SUCCESSION_DRIFT",
  "SUCCESSION_ENTROPY_RECURRENCE_RISK",
  "SUCCESSION_CONTAINMENT_RISK",
  "SUCCESSION_DESYNCHRONIZATION_RISK",
  "SUCCESSION_FRAGMENTATION_RISK",
  "SUCCESSION_TRUST_DURABILITY_WEAKNESS",
  "SUCCESSION_TRANSFER_STABILITY_WEAKNESS",
  "SUCCESSION_AUDITABILITY_WEAKNESS",
  "SUCCESSION_EXPLAINABILITY_DECAY",
  "RECONSTRUCTION_SUCCESSION_INTEGRITY_WEAKNESS",
  "SUCCESSION_REEVALUATION_REQUIRED",
  "SUCCESSION_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceCivilizationRestorationReconstructionSuccessionExposureLevel {
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
): CountyGovernanceCivilizationRestorationReconstructionSuccessionReevaluationRequirementLevel {
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

function classifyLongHorizonSuccession(params: {
  reconstructionSuccessionIntegrityScore: number;
  successionTrustDurabilityScore: number;
  successionTransferStabilityScore: number;
  failClosedSuccessionSurvivabilityScore: number;
  successionEntropyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonSuccessionSurvivability {
  if (
    params.reconstructionSuccessionIntegrityScore < 35 ||
    params.successionTrustDurabilityScore < 35 ||
    params.failClosedSuccessionSurvivabilityScore < 35 ||
    params.successionEntropyRecurrenceRiskScore >= 88
  ) {
    return "non_successional";
  }

  if (
    params.reconstructionSuccessionIntegrityScore < 55 ||
    params.successionTrustDurabilityScore < 55 ||
    params.successionTransferStabilityScore < 55 ||
    params.failClosedSuccessionSurvivabilityScore < 55 ||
    params.successionEntropyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.reconstructionSuccessionIntegrityScore < 75 ||
    params.successionTrustDurabilityScore < 75 ||
    params.successionTransferStabilityScore < 75 ||
    params.successionEntropyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.reconstructionSuccessionIntegrityScore < 88 ||
    params.successionTrustDurabilityScore < 88 ||
    params.successionTransferStabilityScore < 88 ||
    params.successionEntropyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  successionIntegrityWeakness: boolean;
  trustDurabilityWeakness: boolean;
  transferStabilityWeakness: boolean;
  auditabilityWeakness: boolean;
  failClosedDegradation: boolean;
  desynchronization: boolean;
  fragmentation: boolean;
  recursiveDrift: boolean;
  containmentRisk: boolean;
  explainabilityDecay: boolean;
  entropyRecurrence: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityWarningCode[] {
  const warnings = new Set<CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityWarningCode>();

  if (params.successionIntegrityWeakness) {
    warnings.add("RECONSTRUCTION_SUCCESSION_INTEGRITY_WEAKNESS");
  }

  if (params.trustDurabilityWeakness) {
    warnings.add("SUCCESSION_TRUST_DURABILITY_WEAKNESS");
  }

  if (params.transferStabilityWeakness) {
    warnings.add("SUCCESSION_TRANSFER_STABILITY_WEAKNESS");
  }

  if (params.auditabilityWeakness) {
    warnings.add("SUCCESSION_AUDITABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_SUCCESSION_SURVIVABILITY_DEGRADATION");
  }

  if (params.desynchronization) {
    warnings.add("SUCCESSION_DESYNCHRONIZATION_RISK");
  }

  if (params.fragmentation) {
    warnings.add("SUCCESSION_FRAGMENTATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_SUCCESSION_DRIFT");
  }

  if (params.containmentRisk) {
    warnings.add("SUCCESSION_CONTAINMENT_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("SUCCESSION_EXPLAINABILITY_DECAY");
  }

  if (params.entropyRecurrence) {
    warnings.add("SUCCESSION_ENTROPY_RECURRENCE_RISK");
  }

  if (params.reevaluationRequired) {
    warnings.add("SUCCESSION_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("SUCCESSION_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_SUCCESSION_SURVIVABILITY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["civilization restoration reconstruction succession survivability", 0],
  )[0];
}

function classifySuccession(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  desynchronization: boolean;
  fragmentation: boolean;
  trustDurabilityWeakness: boolean;
  transferStabilityWeakness: boolean;
  auditabilityWeakness: boolean;
  explainabilityDecay: boolean;
  successionIntegrityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_succession_survivability_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_succession_survivability";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "reconstruction_succession_unstable";
  }

  if (
    params.trustDurabilityWeakness ||
    params.transferStabilityWeakness ||
    params.auditabilityWeakness ||
    params.explainabilityDecay ||
    params.successionIntegrityWeakness
  ) {
    return "reconstruction_succession_degrading";
  }

  if (params.continuationRequired) {
    return "reconstruction_succession_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_reconstruction_succession_survivability";
  }

  return "durable_reconstruction_succession_survivability";
}

export function evaluateCountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivability(
  input: CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityInput,
): CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityResult {
  const reconstructionSuccessionIntegrityScore = clampScore(input.reconstructionSuccessionIntegrityScore);
  const successionTrustDurabilityScore = clampScore(input.successionTrustDurabilityScore);
  const successionTransferStabilityScore = clampScore(input.successionTransferStabilityScore);
  const successionAuditabilityScore = clampScore(input.successionAuditabilityScore);
  const failClosedSuccessionSurvivabilityScore = clampScore(input.failClosedSuccessionSurvivabilityScore);
  const successionDesynchronizationRiskScore = clampScore(input.successionDesynchronizationRiskScore);
  const successionFragmentationRiskScore = clampScore(input.successionFragmentationRiskScore);
  const recursiveSuccessionDriftRiskScore = clampScore(input.recursiveSuccessionDriftRiskScore);
  const successionContainmentIntegrityScore = clampScore(input.successionContainmentIntegrityScore);
  const successionExplainabilityDurabilityScore = clampScore(input.successionExplainabilityDurabilityScore);
  const successionEntropyRecurrenceRiskScore = clampScore(input.successionEntropyRecurrenceRiskScore);
  const successionReevaluationPressureScore = clampScore(input.successionReevaluationPressureScore);

  const failClosedSuccessionSurvivabilityDegrading = failClosedSuccessionSurvivabilityScore < 55;
  const successionDesynchronizationDetected = successionDesynchronizationRiskScore >= 45;
  const successionFragmentationDetected = successionFragmentationRiskScore >= 45;
  const recursiveSuccessionDriftDetected = recursiveSuccessionDriftRiskScore >= 45;
  const successionContainmentRiskDetected = successionContainmentIntegrityScore < 55;
  const successionEntropyRecurrenceDetected = successionEntropyRecurrenceRiskScore >= 45;
  const successionTrustDurabilityWeakness = successionTrustDurabilityScore < 55;
  const successionTransferStabilityWeakness = successionTransferStabilityScore < 55;
  const successionAuditabilityWeakness = successionAuditabilityScore < 55;
  const successionExplainabilityDecay = successionExplainabilityDurabilityScore < 55;
  const successionIntegrityWeakness = reconstructionSuccessionIntegrityScore < 75;
  const collapseSensitiveSuccessionEscalation =
    (recursiveSuccessionDriftRiskScore >= 88 ||
      successionEntropyRecurrenceRiskScore >= 88 ||
      successionDesynchronizationRiskScore >= 88 ||
      successionFragmentationRiskScore >= 88) &&
    (failClosedSuccessionSurvivabilityScore < 65 || successionTrustDurabilityScore < 55);
  const reevaluationRequired =
    successionReevaluationPressureScore >= 58 ||
    successionTrustDurabilityWeakness ||
    successionTransferStabilityWeakness ||
    successionAuditabilityWeakness ||
    successionExplainabilityDecay ||
    successionDesynchronizationDetected ||
    successionFragmentationDetected;

  const successionSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(reconstructionSuccessionIntegrityScore),
      inverseHealthScore(successionTrustDurabilityScore),
      inverseHealthScore(successionTransferStabilityScore),
      inverseHealthScore(successionAuditabilityScore),
      inverseHealthScore(failClosedSuccessionSurvivabilityScore),
      successionDesynchronizationRiskScore,
      successionFragmentationRiskScore,
      recursiveSuccessionDriftRiskScore,
      inverseHealthScore(successionContainmentIntegrityScore),
      inverseHealthScore(successionExplainabilityDurabilityScore),
      successionEntropyRecurrenceRiskScore,
      successionReevaluationPressureScore,
    ]),
  );

  const longHorizonSuccessionSurvivability = classifyLongHorizonSuccession({
    reconstructionSuccessionIntegrityScore,
    successionTrustDurabilityScore,
    successionTransferStabilityScore,
    failClosedSuccessionSurvivabilityScore,
    successionEntropyRecurrenceRiskScore,
  });
  const successionExposureLevel = classifyExposure(successionSeverityScore);
  const successionReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      successionSeverityScore,
      successionReevaluationPressureScore,
      successionEntropyRecurrenceRiskScore,
      recursiveSuccessionDriftRiskScore,
      successionDesynchronizationRiskScore,
      successionFragmentationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedSuccessionSurvivabilityDegrading &&
    !collapseSensitiveSuccessionEscalation &&
    !recursiveSuccessionDriftDetected &&
    !successionEntropyRecurrenceDetected &&
    !successionContainmentRiskDetected &&
    !successionDesynchronizationDetected &&
    !successionFragmentationDetected &&
    successionSeverityScore >= 35 &&
    successionSeverityScore < 72;

  const warningCodes = buildWarnings({
    successionIntegrityWeakness,
    trustDurabilityWeakness: successionTrustDurabilityWeakness,
    transferStabilityWeakness: successionTransferStabilityWeakness,
    auditabilityWeakness: successionAuditabilityWeakness,
    failClosedDegradation: failClosedSuccessionSurvivabilityDegrading,
    desynchronization: successionDesynchronizationDetected,
    fragmentation: successionFragmentationDetected,
    recursiveDrift: recursiveSuccessionDriftDetected,
    containmentRisk: successionContainmentRiskDetected,
    explainabilityDecay: successionExplainabilityDecay,
    entropyRecurrence: successionEntropyRecurrenceDetected,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveSuccessionEscalation,
  });

  const successionSurvivabilityLevel = classifySuccession({
    failClosedDegradation: failClosedSuccessionSurvivabilityDegrading,
    collapseSensitive: collapseSensitiveSuccessionEscalation,
    recursiveDrift: recursiveSuccessionDriftDetected,
    entropyRecurrence: successionEntropyRecurrenceDetected,
    containmentRisk: successionContainmentRiskDetected,
    desynchronization: successionDesynchronizationDetected,
    fragmentation: successionFragmentationDetected,
    trustDurabilityWeakness: successionTrustDurabilityWeakness,
    transferStabilityWeakness: successionTransferStabilityWeakness,
    auditabilityWeakness: successionAuditabilityWeakness,
    explainabilityDecay: successionExplainabilityDecay,
    successionIntegrityWeakness,
    continuationRequired,
    severityScore: successionSeverityScore,
  });

  const primarySuccessionDriver = selectPrimaryDriver({
    "reconstruction succession integrity weakness": inverseHealthScore(reconstructionSuccessionIntegrityScore),
    "succession trust durability weakness": inverseHealthScore(successionTrustDurabilityScore),
    "succession transfer stability weakness": inverseHealthScore(successionTransferStabilityScore),
    "succession auditability weakness": inverseHealthScore(successionAuditabilityScore),
    "fail-closed succession survivability degradation": inverseHealthScore(failClosedSuccessionSurvivabilityScore),
    "succession desynchronization risk": successionDesynchronizationRiskScore,
    "succession fragmentation risk": successionFragmentationRiskScore,
    "recursive succession drift": recursiveSuccessionDriftRiskScore,
    "succession containment risk": inverseHealthScore(successionContainmentIntegrityScore),
    "succession explainability decay": inverseHealthScore(successionExplainabilityDurabilityScore),
    "succession entropy recurrence risk": successionEntropyRecurrenceRiskScore,
    "succession reevaluation pressure": successionReevaluationPressureScore,
  });

  return {
    successionSurvivabilityLevel,
    successionSeverityScore,
    successionExposureLevel,
    successionReevaluationRequirementLevel,
    longHorizonSuccessionSurvivability,
    continuationRequired,
    failClosedSuccessionSurvivabilityDegrading,
    successionDesynchronizationDetected,
    successionFragmentationDetected,
    recursiveSuccessionDriftDetected,
    successionContainmentRiskDetected,
    successionEntropyRecurrenceDetected,
    collapseSensitiveSuccessionEscalation,
    warningCodes,
    explainability: {
      primarySuccessionDriver,
      dominantSuccessionEscalationReason:
        warningCodes[0] ??
        "No deterministic civilization restoration reconstruction succession survivability escalation threshold was crossed.",
      containmentSuccessionAssessment: successionContainmentRiskDetected
        ? "Succession containment is not strong enough to preserve governance handoff survivability under transition pressure."
        : "Succession containment remains handoff-survivability-preserving for the current caller-supplied governance context.",
      longHorizonSuccessionAssessment:
        longHorizonSuccessionSurvivability === "durable"
          ? "Long-horizon civilization restoration reconstruction succession survivability is durable under the current inputs. Succession survivability does not imply irreversible governance continuity capability."
          : `Long-horizon civilization restoration reconstruction succession survivability is ${longHorizonSuccessionSurvivability} under the current inputs. Reconstruction integrity does not guarantee succession survivability.`,
      failClosedSuccessionAssessment: failClosedSuccessionSurvivabilityDegrading
        ? "Fail-closed succession survivability is degrading and overrides optimistic succession assumptions."
        : "Fail-closed succession survivability remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
