export type CountyGovernanceArchivalTransferContinuityLevel =
  | "durable_archival_transfer_continuity"
  | "bounded_archival_transfer_continuity"
  | "archival_transfer_continuation_required"
  | "archival_transfer_degrading"
  | "archival_transfer_unstable"
  | "fail_closed_archival_transfer_degradation"
  | "collapse_sensitive_archival_transfer";

export type CountyGovernanceArchivalTransferExposureLevel =
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

export type CountyGovernanceLongHorizonArchivalContinuity =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_archivable";

export type CountyGovernanceDoctrineClosureArchivalTransferContinuityWarningCode =
  | "ARCHIVAL_TRANSFER_READINESS_WEAKNESS"
  | "CLOSURE_ARCHIVE_CONTINUITY_WEAKNESS"
  | "ARCHIVAL_REPLAY_DURABILITY_WEAKNESS"
  | "ARCHIVAL_EXPLAINABILITY_SURVIVABILITY_DECAY"
  | "ARCHIVAL_AUDIT_INTEGRITY_WEAKNESS"
  | "FAIL_CLOSED_ARCHIVAL_TRANSFER_DEGRADATION"
  | "ARCHIVAL_FRAGMENTATION_RISK"
  | "ARCHIVAL_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_ARCHIVE_DRIFT"
  | "ARCHIVAL_CONTAINMENT_RISK"
  | "ARCHIVAL_ENTROPY_RECURRENCE_RISK"
  | "ARCHIVAL_REEVALUATION_REQUIRED"
  | "ARCHIVAL_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_ARCHIVAL_TRANSFER";

export type CountyGovernanceDoctrineClosureArchivalTransferContinuityInput = {
  archivalTransferReadinessScore: number;
  closureArchiveContinuityScore: number;
  archivalReplayDurabilityScore: number;
  archivalExplainabilitySurvivabilityScore: number;
  archivalAuditIntegrityScore: number;
  failClosedArchivalTransferScore: number;
  archivalFragmentationRiskScore: number;
  archivalDesynchronizationRiskScore: number;
  recursiveArchiveDriftRiskScore: number;
  archivalContainmentIntegrityScore: number;
  archivalEntropyRecurrenceRiskScore: number;
  archivalReevaluationPressureScore: number;
};

export type CountyGovernanceDoctrineClosureArchivalTransferContinuityResult = {
  archivalTransferContinuityLevel: CountyGovernanceArchivalTransferContinuityLevel;
  archivalTransferSeverityScore: number;
  archivalTransferExposureLevel: CountyGovernanceArchivalTransferExposureLevel;
  archivalReevaluationRequirementLevel: CountyGovernanceArchivalReevaluationRequirementLevel;
  longHorizonArchivalContinuity: CountyGovernanceLongHorizonArchivalContinuity;
  continuationRequired: boolean;
  failClosedArchivalTransferDegrading: boolean;
  archivalFragmentationDetected: boolean;
  archivalDesynchronizationDetected: boolean;
  recursiveArchiveDriftDetected: boolean;
  archivalContainmentRiskDetected: boolean;
  archivalEntropyRecurrenceDetected: boolean;
  collapseSensitiveArchivalEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryArchivalTransferDriver: string;
    dominantArchivalEscalationReason: string;
    containmentArchivalAssessment: string;
    longHorizonArchivalContinuityAssessment: string;
    failClosedArchivalTransferAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceDoctrineClosureArchivalTransferContinuityWarningCode[] = [
  "FAIL_CLOSED_ARCHIVAL_TRANSFER_DEGRADATION",
  "COLLAPSE_SENSITIVE_ARCHIVAL_TRANSFER",
  "RECURSIVE_ARCHIVE_DRIFT",
  "ARCHIVAL_ENTROPY_RECURRENCE_RISK",
  "ARCHIVAL_CONTAINMENT_RISK",
  "ARCHIVAL_DESYNCHRONIZATION_RISK",
  "ARCHIVAL_FRAGMENTATION_RISK",
  "ARCHIVAL_REPLAY_DURABILITY_WEAKNESS",
  "ARCHIVAL_AUDIT_INTEGRITY_WEAKNESS",
  "ARCHIVAL_EXPLAINABILITY_SURVIVABILITY_DECAY",
  "CLOSURE_ARCHIVE_CONTINUITY_WEAKNESS",
  "ARCHIVAL_TRANSFER_READINESS_WEAKNESS",
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

function classifyExposure(score: number): CountyGovernanceArchivalTransferExposureLevel {
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

function classifyLongHorizonArchivalContinuity(params: {
  archivalTransferReadinessScore: number;
  closureArchiveContinuityScore: number;
  archivalReplayDurabilityScore: number;
  archivalAuditIntegrityScore: number;
  failClosedArchivalTransferScore: number;
  archivalEntropyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonArchivalContinuity {
  if (
    params.archivalTransferReadinessScore < 35 ||
    params.closureArchiveContinuityScore < 35 ||
    params.archivalReplayDurabilityScore < 35 ||
    params.failClosedArchivalTransferScore < 35 ||
    params.archivalEntropyRecurrenceRiskScore >= 88
  ) {
    return "non_archivable";
  }

  if (
    params.archivalTransferReadinessScore < 55 ||
    params.closureArchiveContinuityScore < 55 ||
    params.archivalReplayDurabilityScore < 55 ||
    params.archivalAuditIntegrityScore < 55 ||
    params.failClosedArchivalTransferScore < 55 ||
    params.archivalEntropyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.archivalTransferReadinessScore < 75 ||
    params.closureArchiveContinuityScore < 75 ||
    params.archivalReplayDurabilityScore < 75 ||
    params.archivalAuditIntegrityScore < 75 ||
    params.archivalEntropyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.archivalTransferReadinessScore < 88 ||
    params.closureArchiveContinuityScore < 88 ||
    params.archivalReplayDurabilityScore < 88 ||
    params.archivalAuditIntegrityScore < 88 ||
    params.archivalEntropyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  archivalTransferReadinessWeakness: boolean;
  closureArchiveContinuityWeakness: boolean;
  archivalReplayDurabilityWeakness: boolean;
  archivalExplainabilityDecay: boolean;
  archivalAuditIntegrityWeakness: boolean;
  failClosedDegradation: boolean;
  fragmentation: boolean;
  desynchronization: boolean;
  recursiveDrift: boolean;
  containmentRisk: boolean;
  entropyRecurrence: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceDoctrineClosureArchivalTransferContinuityWarningCode[] {
  const warnings = new Set<CountyGovernanceDoctrineClosureArchivalTransferContinuityWarningCode>();

  if (params.archivalTransferReadinessWeakness) {
    warnings.add("ARCHIVAL_TRANSFER_READINESS_WEAKNESS");
  }

  if (params.closureArchiveContinuityWeakness) {
    warnings.add("CLOSURE_ARCHIVE_CONTINUITY_WEAKNESS");
  }

  if (params.archivalReplayDurabilityWeakness) {
    warnings.add("ARCHIVAL_REPLAY_DURABILITY_WEAKNESS");
  }

  if (params.archivalExplainabilityDecay) {
    warnings.add("ARCHIVAL_EXPLAINABILITY_SURVIVABILITY_DECAY");
  }

  if (params.archivalAuditIntegrityWeakness) {
    warnings.add("ARCHIVAL_AUDIT_INTEGRITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_ARCHIVAL_TRANSFER_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("ARCHIVAL_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("ARCHIVAL_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_ARCHIVE_DRIFT");
  }

  if (params.containmentRisk) {
    warnings.add("ARCHIVAL_CONTAINMENT_RISK");
  }

  if (params.entropyRecurrence) {
    warnings.add("ARCHIVAL_ENTROPY_RECURRENCE_RISK");
  }

  if (params.reevaluationRequired) {
    warnings.add("ARCHIVAL_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("ARCHIVAL_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_ARCHIVAL_TRANSFER");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["doctrine closure archival transfer continuity", 0],
  )[0];
}

function classifyArchivalTransfer(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  desynchronization: boolean;
  fragmentation: boolean;
  archivalReplayDurabilityWeakness: boolean;
  archivalAuditIntegrityWeakness: boolean;
  archivalExplainabilityDecay: boolean;
  closureArchiveContinuityWeakness: boolean;
  archivalTransferReadinessWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceArchivalTransferContinuityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_archival_transfer_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_archival_transfer";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "archival_transfer_unstable";
  }

  if (
    params.archivalReplayDurabilityWeakness ||
    params.archivalAuditIntegrityWeakness ||
    params.archivalExplainabilityDecay ||
    params.closureArchiveContinuityWeakness ||
    params.archivalTransferReadinessWeakness
  ) {
    return "archival_transfer_degrading";
  }

  if (params.continuationRequired) {
    return "archival_transfer_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_archival_transfer_continuity";
  }

  return "durable_archival_transfer_continuity";
}

export function evaluateCountyGovernanceDoctrineClosureArchivalTransferContinuity(
  input: CountyGovernanceDoctrineClosureArchivalTransferContinuityInput,
): CountyGovernanceDoctrineClosureArchivalTransferContinuityResult {
  const archivalTransferReadinessScore = clampScore(input.archivalTransferReadinessScore);
  const closureArchiveContinuityScore = clampScore(input.closureArchiveContinuityScore);
  const archivalReplayDurabilityScore = clampScore(input.archivalReplayDurabilityScore);
  const archivalExplainabilitySurvivabilityScore = clampScore(input.archivalExplainabilitySurvivabilityScore);
  const archivalAuditIntegrityScore = clampScore(input.archivalAuditIntegrityScore);
  const failClosedArchivalTransferScore = clampScore(input.failClosedArchivalTransferScore);
  const archivalFragmentationRiskScore = clampScore(input.archivalFragmentationRiskScore);
  const archivalDesynchronizationRiskScore = clampScore(input.archivalDesynchronizationRiskScore);
  const recursiveArchiveDriftRiskScore = clampScore(input.recursiveArchiveDriftRiskScore);
  const archivalContainmentIntegrityScore = clampScore(input.archivalContainmentIntegrityScore);
  const archivalEntropyRecurrenceRiskScore = clampScore(input.archivalEntropyRecurrenceRiskScore);
  const archivalReevaluationPressureScore = clampScore(input.archivalReevaluationPressureScore);

  const failClosedArchivalTransferDegrading = failClosedArchivalTransferScore < 55;
  const archivalFragmentationDetected = archivalFragmentationRiskScore >= 45;
  const archivalDesynchronizationDetected = archivalDesynchronizationRiskScore >= 45;
  const recursiveArchiveDriftDetected = recursiveArchiveDriftRiskScore >= 45;
  const archivalContainmentRiskDetected = archivalContainmentIntegrityScore < 55;
  const archivalEntropyRecurrenceDetected = archivalEntropyRecurrenceRiskScore >= 45;
  const archivalReplayDurabilityWeakness = archivalReplayDurabilityScore < 55;
  const archivalAuditIntegrityWeakness = archivalAuditIntegrityScore < 55;
  const archivalExplainabilityDecay = archivalExplainabilitySurvivabilityScore < 55;
  const closureArchiveContinuityWeakness = closureArchiveContinuityScore < 55;
  const archivalTransferReadinessWeakness = archivalTransferReadinessScore < 75;
  const collapseSensitiveArchivalEscalation =
    (recursiveArchiveDriftRiskScore >= 88 ||
      archivalEntropyRecurrenceRiskScore >= 88 ||
      archivalDesynchronizationRiskScore >= 88 ||
      archivalFragmentationRiskScore >= 88) &&
    (failClosedArchivalTransferScore < 65 || archivalReplayDurabilityScore < 55);
  const reevaluationRequired =
    archivalReevaluationPressureScore >= 58 ||
    archivalReplayDurabilityWeakness ||
    archivalAuditIntegrityWeakness ||
    archivalExplainabilityDecay ||
    closureArchiveContinuityWeakness ||
    archivalFragmentationDetected ||
    archivalDesynchronizationDetected;

  const archivalTransferSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(archivalTransferReadinessScore),
      inverseHealthScore(closureArchiveContinuityScore),
      inverseHealthScore(archivalReplayDurabilityScore),
      inverseHealthScore(archivalExplainabilitySurvivabilityScore),
      inverseHealthScore(archivalAuditIntegrityScore),
      inverseHealthScore(failClosedArchivalTransferScore),
      archivalFragmentationRiskScore,
      archivalDesynchronizationRiskScore,
      recursiveArchiveDriftRiskScore,
      inverseHealthScore(archivalContainmentIntegrityScore),
      archivalEntropyRecurrenceRiskScore,
      archivalReevaluationPressureScore,
    ]),
  );

  const longHorizonArchivalContinuity = classifyLongHorizonArchivalContinuity({
    archivalTransferReadinessScore,
    closureArchiveContinuityScore,
    archivalReplayDurabilityScore,
    archivalAuditIntegrityScore,
    failClosedArchivalTransferScore,
    archivalEntropyRecurrenceRiskScore,
  });
  const archivalTransferExposureLevel = classifyExposure(archivalTransferSeverityScore);
  const archivalReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      archivalTransferSeverityScore,
      archivalReevaluationPressureScore,
      archivalEntropyRecurrenceRiskScore,
      recursiveArchiveDriftRiskScore,
      archivalDesynchronizationRiskScore,
      archivalFragmentationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedArchivalTransferDegrading &&
    !collapseSensitiveArchivalEscalation &&
    !recursiveArchiveDriftDetected &&
    !archivalEntropyRecurrenceDetected &&
    !archivalContainmentRiskDetected &&
    !archivalDesynchronizationDetected &&
    !archivalFragmentationDetected &&
    archivalTransferSeverityScore >= 35 &&
    archivalTransferSeverityScore < 72;

  const warningCodes = buildWarnings({
    archivalTransferReadinessWeakness,
    closureArchiveContinuityWeakness,
    archivalReplayDurabilityWeakness,
    archivalExplainabilityDecay,
    archivalAuditIntegrityWeakness,
    failClosedDegradation: failClosedArchivalTransferDegrading,
    fragmentation: archivalFragmentationDetected,
    desynchronization: archivalDesynchronizationDetected,
    recursiveDrift: recursiveArchiveDriftDetected,
    containmentRisk: archivalContainmentRiskDetected,
    entropyRecurrence: archivalEntropyRecurrenceDetected,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveArchivalEscalation,
  });

  const archivalTransferContinuityLevel = classifyArchivalTransfer({
    failClosedDegradation: failClosedArchivalTransferDegrading,
    collapseSensitive: collapseSensitiveArchivalEscalation,
    recursiveDrift: recursiveArchiveDriftDetected,
    entropyRecurrence: archivalEntropyRecurrenceDetected,
    containmentRisk: archivalContainmentRiskDetected,
    desynchronization: archivalDesynchronizationDetected,
    fragmentation: archivalFragmentationDetected,
    archivalReplayDurabilityWeakness,
    archivalAuditIntegrityWeakness,
    archivalExplainabilityDecay,
    closureArchiveContinuityWeakness,
    archivalTransferReadinessWeakness,
    continuationRequired,
    severityScore: archivalTransferSeverityScore,
  });

  const primaryArchivalTransferDriver = selectPrimaryDriver({
    "archival transfer readiness weakness": inverseHealthScore(archivalTransferReadinessScore),
    "closure archive continuity weakness": inverseHealthScore(closureArchiveContinuityScore),
    "archival replay durability weakness": inverseHealthScore(archivalReplayDurabilityScore),
    "archival explainability survivability decay": inverseHealthScore(archivalExplainabilitySurvivabilityScore),
    "archival audit integrity weakness": inverseHealthScore(archivalAuditIntegrityScore),
    "fail-closed archival transfer degradation": inverseHealthScore(failClosedArchivalTransferScore),
    "archival fragmentation risk": archivalFragmentationRiskScore,
    "archival desynchronization risk": archivalDesynchronizationRiskScore,
    "recursive archive drift": recursiveArchiveDriftRiskScore,
    "archival containment risk": inverseHealthScore(archivalContainmentIntegrityScore),
    "archival entropy recurrence risk": archivalEntropyRecurrenceRiskScore,
    "archival reevaluation pressure": archivalReevaluationPressureScore,
  });

  return {
    archivalTransferContinuityLevel,
    archivalTransferSeverityScore,
    archivalTransferExposureLevel,
    archivalReevaluationRequirementLevel,
    longHorizonArchivalContinuity,
    continuationRequired,
    failClosedArchivalTransferDegrading,
    archivalFragmentationDetected,
    archivalDesynchronizationDetected,
    recursiveArchiveDriftDetected,
    archivalContainmentRiskDetected,
    archivalEntropyRecurrenceDetected,
    collapseSensitiveArchivalEscalation,
    warningCodes,
    explainability: {
      primaryArchivalTransferDriver,
      dominantArchivalEscalationReason:
        warningCodes[0] ?? "No deterministic archival transfer continuity escalation threshold was crossed.",
      containmentArchivalAssessment: archivalContainmentRiskDetected
        ? "Archival containment is not strong enough to preserve transfer continuity under archive pressure."
        : "Archival containment remains transfer-continuity preserving for the current caller-supplied governance context.",
      longHorizonArchivalContinuityAssessment:
        longHorizonArchivalContinuity === "durable"
          ? "Long-horizon archival transfer continuity is durable under the current inputs. Archival transfer does not imply permanent governance survivability."
          : `Long-horizon archival transfer continuity is ${longHorizonArchivalContinuity} under the current inputs. Doctrine closure readiness does not guarantee archival transfer continuity.`,
      failClosedArchivalTransferAssessment: failClosedArchivalTransferDegrading
        ? "Fail-closed archival transfer is degrading and overrides optimistic archival continuity assumptions."
        : "Fail-closed archival transfer remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
