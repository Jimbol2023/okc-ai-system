export type CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationLevel =
  | "durable_succession_memory_continuity_finalization"
  | "bounded_succession_memory_continuity_finalization"
  | "succession_memory_continuity_finalization_continuation_required"
  | "succession_memory_continuity_finalization_degrading"
  | "succession_memory_continuity_finalization_unstable"
  | "fail_closed_memory_finalization_degradation"
  | "collapse_sensitive_memory_finalization";

export type CountyGovernanceCivilizationRestorationSuccessionMemoryFinalizationExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceCivilizationRestorationSuccessionMemoryFinalizationReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonMemoryContinuity =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_finalized";

export type CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationWarningCode =
  | "SUCCESSION_MEMORY_CONTINUITY_WEAKNESS"
  | "FINALIZED_MEMORY_TRUST_DURABILITY_WEAKNESS"
  | "MEMORY_HANDOFF_INTEGRITY_WEAKNESS"
  | "FINALIZED_MEMORY_AUDITABILITY_WEAKNESS"
  | "FAIL_CLOSED_MEMORY_FINALIZATION_DEGRADATION"
  | "MEMORY_CONTINUITY_FRAGMENTATION_RISK"
  | "MEMORY_FINALIZATION_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_MEMORY_DRIFT"
  | "MEMORY_CONTAINMENT_RISK"
  | "FINALIZED_MEMORY_EXPLAINABILITY_DECAY"
  | "MEMORY_ENTROPY_RECURRENCE_RISK"
  | "MEMORY_FINALIZATION_REEVALUATION_REQUIRED"
  | "MEMORY_FINALIZATION_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_MEMORY_FINALIZATION";

export type CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationInput = {
  successionMemoryContinuityScore: number;
  finalizedMemoryTrustDurabilityScore: number;
  memoryHandoffIntegrityScore: number;
  finalizedMemoryAuditabilityScore: number;
  failClosedMemoryFinalizationScore: number;
  memoryContinuityFragmentationRiskScore: number;
  memoryFinalizationDesynchronizationRiskScore: number;
  recursiveMemoryDriftRiskScore: number;
  memoryContainmentIntegrityScore: number;
  finalizedMemoryExplainabilityScore: number;
  memoryEntropyRecurrenceRiskScore: number;
  memoryFinalizationReevaluationPressureScore: number;
};

export type CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationResult = {
  memoryContinuityFinalizationLevel: CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationLevel;
  memoryFinalizationSeverityScore: number;
  memoryFinalizationExposureLevel: CountyGovernanceCivilizationRestorationSuccessionMemoryFinalizationExposureLevel;
  memoryFinalizationReevaluationRequirementLevel: CountyGovernanceCivilizationRestorationSuccessionMemoryFinalizationReevaluationRequirementLevel;
  longHorizonMemoryContinuity: CountyGovernanceLongHorizonMemoryContinuity;
  continuationRequired: boolean;
  failClosedMemoryFinalizationDegrading: boolean;
  memoryContinuityFragmentationDetected: boolean;
  memoryFinalizationDesynchronizationDetected: boolean;
  recursiveMemoryDriftDetected: boolean;
  memoryContainmentRiskDetected: boolean;
  memoryEntropyRecurrenceDetected: boolean;
  collapseSensitiveMemoryFinalizationEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryMemoryFinalizationDriver: string;
    dominantMemoryFinalizationEscalationReason: string;
    containmentMemoryFinalizationAssessment: string;
    longHorizonMemoryContinuityAssessment: string;
    failClosedMemoryFinalizationAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationWarningCode[] = [
  "FAIL_CLOSED_MEMORY_FINALIZATION_DEGRADATION",
  "COLLAPSE_SENSITIVE_MEMORY_FINALIZATION",
  "RECURSIVE_MEMORY_DRIFT",
  "MEMORY_ENTROPY_RECURRENCE_RISK",
  "MEMORY_CONTAINMENT_RISK",
  "MEMORY_FINALIZATION_DESYNCHRONIZATION_RISK",
  "MEMORY_CONTINUITY_FRAGMENTATION_RISK",
  "FINALIZED_MEMORY_TRUST_DURABILITY_WEAKNESS",
  "MEMORY_HANDOFF_INTEGRITY_WEAKNESS",
  "FINALIZED_MEMORY_AUDITABILITY_WEAKNESS",
  "FINALIZED_MEMORY_EXPLAINABILITY_DECAY",
  "SUCCESSION_MEMORY_CONTINUITY_WEAKNESS",
  "MEMORY_FINALIZATION_REEVALUATION_REQUIRED",
  "MEMORY_FINALIZATION_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceCivilizationRestorationSuccessionMemoryFinalizationExposureLevel {
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
): CountyGovernanceCivilizationRestorationSuccessionMemoryFinalizationReevaluationRequirementLevel {
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

function classifyLongHorizonMemoryContinuity(params: {
  successionMemoryContinuityScore: number;
  finalizedMemoryTrustDurabilityScore: number;
  memoryHandoffIntegrityScore: number;
  failClosedMemoryFinalizationScore: number;
  memoryEntropyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonMemoryContinuity {
  if (
    params.successionMemoryContinuityScore < 35 ||
    params.finalizedMemoryTrustDurabilityScore < 35 ||
    params.failClosedMemoryFinalizationScore < 35 ||
    params.memoryEntropyRecurrenceRiskScore >= 88
  ) {
    return "non_finalized";
  }

  if (
    params.successionMemoryContinuityScore < 55 ||
    params.finalizedMemoryTrustDurabilityScore < 55 ||
    params.memoryHandoffIntegrityScore < 55 ||
    params.failClosedMemoryFinalizationScore < 55 ||
    params.memoryEntropyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.successionMemoryContinuityScore < 75 ||
    params.finalizedMemoryTrustDurabilityScore < 75 ||
    params.memoryHandoffIntegrityScore < 75 ||
    params.memoryEntropyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.successionMemoryContinuityScore < 88 ||
    params.finalizedMemoryTrustDurabilityScore < 88 ||
    params.memoryHandoffIntegrityScore < 88 ||
    params.memoryEntropyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  successionMemoryContinuityWeakness: boolean;
  trustDurabilityWeakness: boolean;
  handoffIntegrityWeakness: boolean;
  auditabilityWeakness: boolean;
  failClosedDegradation: boolean;
  fragmentation: boolean;
  desynchronization: boolean;
  recursiveDrift: boolean;
  containmentRisk: boolean;
  explainabilityDecay: boolean;
  entropyRecurrence: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationWarningCode[] {
  const warnings = new Set<CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationWarningCode>();

  if (params.successionMemoryContinuityWeakness) {
    warnings.add("SUCCESSION_MEMORY_CONTINUITY_WEAKNESS");
  }

  if (params.trustDurabilityWeakness) {
    warnings.add("FINALIZED_MEMORY_TRUST_DURABILITY_WEAKNESS");
  }

  if (params.handoffIntegrityWeakness) {
    warnings.add("MEMORY_HANDOFF_INTEGRITY_WEAKNESS");
  }

  if (params.auditabilityWeakness) {
    warnings.add("FINALIZED_MEMORY_AUDITABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_MEMORY_FINALIZATION_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("MEMORY_CONTINUITY_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("MEMORY_FINALIZATION_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_MEMORY_DRIFT");
  }

  if (params.containmentRisk) {
    warnings.add("MEMORY_CONTAINMENT_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("FINALIZED_MEMORY_EXPLAINABILITY_DECAY");
  }

  if (params.entropyRecurrence) {
    warnings.add("MEMORY_ENTROPY_RECURRENCE_RISK");
  }

  if (params.reevaluationRequired) {
    warnings.add("MEMORY_FINALIZATION_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("MEMORY_FINALIZATION_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_MEMORY_FINALIZATION");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["civilization restoration succession memory continuity finalization", 0],
  )[0];
}

function classifyMemoryFinalization(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  desynchronization: boolean;
  fragmentation: boolean;
  trustDurabilityWeakness: boolean;
  handoffIntegrityWeakness: boolean;
  auditabilityWeakness: boolean;
  explainabilityDecay: boolean;
  successionMemoryContinuityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_memory_finalization_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_memory_finalization";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "succession_memory_continuity_finalization_unstable";
  }

  if (
    params.trustDurabilityWeakness ||
    params.handoffIntegrityWeakness ||
    params.auditabilityWeakness ||
    params.explainabilityDecay ||
    params.successionMemoryContinuityWeakness
  ) {
    return "succession_memory_continuity_finalization_degrading";
  }

  if (params.continuationRequired) {
    return "succession_memory_continuity_finalization_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_succession_memory_continuity_finalization";
  }

  return "durable_succession_memory_continuity_finalization";
}

export function evaluateCountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalization(
  input: CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationInput,
): CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationResult {
  const successionMemoryContinuityScore = clampScore(input.successionMemoryContinuityScore);
  const finalizedMemoryTrustDurabilityScore = clampScore(input.finalizedMemoryTrustDurabilityScore);
  const memoryHandoffIntegrityScore = clampScore(input.memoryHandoffIntegrityScore);
  const finalizedMemoryAuditabilityScore = clampScore(input.finalizedMemoryAuditabilityScore);
  const failClosedMemoryFinalizationScore = clampScore(input.failClosedMemoryFinalizationScore);
  const memoryContinuityFragmentationRiskScore = clampScore(input.memoryContinuityFragmentationRiskScore);
  const memoryFinalizationDesynchronizationRiskScore = clampScore(
    input.memoryFinalizationDesynchronizationRiskScore,
  );
  const recursiveMemoryDriftRiskScore = clampScore(input.recursiveMemoryDriftRiskScore);
  const memoryContainmentIntegrityScore = clampScore(input.memoryContainmentIntegrityScore);
  const finalizedMemoryExplainabilityScore = clampScore(input.finalizedMemoryExplainabilityScore);
  const memoryEntropyRecurrenceRiskScore = clampScore(input.memoryEntropyRecurrenceRiskScore);
  const memoryFinalizationReevaluationPressureScore = clampScore(
    input.memoryFinalizationReevaluationPressureScore,
  );

  const failClosedMemoryFinalizationDegrading = failClosedMemoryFinalizationScore < 55;
  const memoryContinuityFragmentationDetected = memoryContinuityFragmentationRiskScore >= 45;
  const memoryFinalizationDesynchronizationDetected = memoryFinalizationDesynchronizationRiskScore >= 45;
  const recursiveMemoryDriftDetected = recursiveMemoryDriftRiskScore >= 45;
  const memoryContainmentRiskDetected = memoryContainmentIntegrityScore < 55;
  const memoryEntropyRecurrenceDetected = memoryEntropyRecurrenceRiskScore >= 45;
  const finalizedMemoryTrustDurabilityWeakness = finalizedMemoryTrustDurabilityScore < 55;
  const memoryHandoffIntegrityWeakness = memoryHandoffIntegrityScore < 55;
  const finalizedMemoryAuditabilityWeakness = finalizedMemoryAuditabilityScore < 55;
  const finalizedMemoryExplainabilityDecay = finalizedMemoryExplainabilityScore < 55;
  const successionMemoryContinuityWeakness = successionMemoryContinuityScore < 75;
  const collapseSensitiveMemoryFinalizationEscalation =
    (recursiveMemoryDriftRiskScore >= 88 ||
      memoryEntropyRecurrenceRiskScore >= 88 ||
      memoryFinalizationDesynchronizationRiskScore >= 88 ||
      memoryContinuityFragmentationRiskScore >= 88) &&
    (failClosedMemoryFinalizationScore < 65 || finalizedMemoryTrustDurabilityScore < 55);
  const reevaluationRequired =
    memoryFinalizationReevaluationPressureScore >= 58 ||
    finalizedMemoryTrustDurabilityWeakness ||
    memoryHandoffIntegrityWeakness ||
    finalizedMemoryAuditabilityWeakness ||
    finalizedMemoryExplainabilityDecay ||
    memoryContinuityFragmentationDetected ||
    memoryFinalizationDesynchronizationDetected;

  const memoryFinalizationSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(successionMemoryContinuityScore),
      inverseHealthScore(finalizedMemoryTrustDurabilityScore),
      inverseHealthScore(memoryHandoffIntegrityScore),
      inverseHealthScore(finalizedMemoryAuditabilityScore),
      inverseHealthScore(failClosedMemoryFinalizationScore),
      memoryContinuityFragmentationRiskScore,
      memoryFinalizationDesynchronizationRiskScore,
      recursiveMemoryDriftRiskScore,
      inverseHealthScore(memoryContainmentIntegrityScore),
      inverseHealthScore(finalizedMemoryExplainabilityScore),
      memoryEntropyRecurrenceRiskScore,
      memoryFinalizationReevaluationPressureScore,
    ]),
  );

  const longHorizonMemoryContinuity = classifyLongHorizonMemoryContinuity({
    successionMemoryContinuityScore,
    finalizedMemoryTrustDurabilityScore,
    memoryHandoffIntegrityScore,
    failClosedMemoryFinalizationScore,
    memoryEntropyRecurrenceRiskScore,
  });
  const memoryFinalizationExposureLevel = classifyExposure(memoryFinalizationSeverityScore);
  const memoryFinalizationReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      memoryFinalizationSeverityScore,
      memoryFinalizationReevaluationPressureScore,
      memoryEntropyRecurrenceRiskScore,
      recursiveMemoryDriftRiskScore,
      memoryFinalizationDesynchronizationRiskScore,
      memoryContinuityFragmentationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedMemoryFinalizationDegrading &&
    !collapseSensitiveMemoryFinalizationEscalation &&
    !recursiveMemoryDriftDetected &&
    !memoryEntropyRecurrenceDetected &&
    !memoryContainmentRiskDetected &&
    !memoryFinalizationDesynchronizationDetected &&
    !memoryContinuityFragmentationDetected &&
    memoryFinalizationSeverityScore >= 35 &&
    memoryFinalizationSeverityScore < 72;

  const warningCodes = buildWarnings({
    successionMemoryContinuityWeakness,
    trustDurabilityWeakness: finalizedMemoryTrustDurabilityWeakness,
    handoffIntegrityWeakness: memoryHandoffIntegrityWeakness,
    auditabilityWeakness: finalizedMemoryAuditabilityWeakness,
    failClosedDegradation: failClosedMemoryFinalizationDegrading,
    fragmentation: memoryContinuityFragmentationDetected,
    desynchronization: memoryFinalizationDesynchronizationDetected,
    recursiveDrift: recursiveMemoryDriftDetected,
    containmentRisk: memoryContainmentRiskDetected,
    explainabilityDecay: finalizedMemoryExplainabilityDecay,
    entropyRecurrence: memoryEntropyRecurrenceDetected,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveMemoryFinalizationEscalation,
  });

  const memoryContinuityFinalizationLevel = classifyMemoryFinalization({
    failClosedDegradation: failClosedMemoryFinalizationDegrading,
    collapseSensitive: collapseSensitiveMemoryFinalizationEscalation,
    recursiveDrift: recursiveMemoryDriftDetected,
    entropyRecurrence: memoryEntropyRecurrenceDetected,
    containmentRisk: memoryContainmentRiskDetected,
    desynchronization: memoryFinalizationDesynchronizationDetected,
    fragmentation: memoryContinuityFragmentationDetected,
    trustDurabilityWeakness: finalizedMemoryTrustDurabilityWeakness,
    handoffIntegrityWeakness: memoryHandoffIntegrityWeakness,
    auditabilityWeakness: finalizedMemoryAuditabilityWeakness,
    explainabilityDecay: finalizedMemoryExplainabilityDecay,
    successionMemoryContinuityWeakness,
    continuationRequired,
    severityScore: memoryFinalizationSeverityScore,
  });

  const primaryMemoryFinalizationDriver = selectPrimaryDriver({
    "succession memory continuity weakness": inverseHealthScore(successionMemoryContinuityScore),
    "finalized memory trust durability weakness": inverseHealthScore(finalizedMemoryTrustDurabilityScore),
    "memory handoff integrity weakness": inverseHealthScore(memoryHandoffIntegrityScore),
    "finalized memory auditability weakness": inverseHealthScore(finalizedMemoryAuditabilityScore),
    "fail-closed memory finalization degradation": inverseHealthScore(failClosedMemoryFinalizationScore),
    "memory continuity fragmentation risk": memoryContinuityFragmentationRiskScore,
    "memory finalization desynchronization risk": memoryFinalizationDesynchronizationRiskScore,
    "recursive memory drift": recursiveMemoryDriftRiskScore,
    "memory containment risk": inverseHealthScore(memoryContainmentIntegrityScore),
    "finalized memory explainability decay": inverseHealthScore(finalizedMemoryExplainabilityScore),
    "memory entropy recurrence risk": memoryEntropyRecurrenceRiskScore,
    "memory finalization reevaluation pressure": memoryFinalizationReevaluationPressureScore,
  });

  return {
    memoryContinuityFinalizationLevel,
    memoryFinalizationSeverityScore,
    memoryFinalizationExposureLevel,
    memoryFinalizationReevaluationRequirementLevel,
    longHorizonMemoryContinuity,
    continuationRequired,
    failClosedMemoryFinalizationDegrading,
    memoryContinuityFragmentationDetected,
    memoryFinalizationDesynchronizationDetected,
    recursiveMemoryDriftDetected,
    memoryContainmentRiskDetected,
    memoryEntropyRecurrenceDetected,
    collapseSensitiveMemoryFinalizationEscalation,
    warningCodes,
    explainability: {
      primaryMemoryFinalizationDriver,
      dominantMemoryFinalizationEscalationReason:
        warningCodes[0] ??
        "No deterministic civilization restoration succession memory finalization escalation threshold was crossed.",
      containmentMemoryFinalizationAssessment: memoryContainmentRiskDetected
        ? "Memory containment is not strong enough to preserve finalized governance memory continuity under finalization pressure."
        : "Memory containment remains finalization-preserving for the current caller-supplied governance context.",
      longHorizonMemoryContinuityAssessment:
        longHorizonMemoryContinuity === "durable"
          ? "Long-horizon civilization restoration succession memory continuity finalization is durable under the current inputs. Memory finalization does not imply irreversible governance continuity."
          : `Long-horizon civilization restoration succession memory continuity finalization is ${longHorizonMemoryContinuity} under the current inputs. Succession survivability does not guarantee memory continuity finalization.`,
      failClosedMemoryFinalizationAssessment: failClosedMemoryFinalizationDegrading
        ? "Fail-closed memory finalization is degrading and overrides optimistic finalization assumptions."
        : "Fail-closed memory finalization remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
