export type CountyGovernanceArchivalReplayPersistenceLevel =
  | "durable_archival_replay_persistence"
  | "bounded_archival_replay_persistence"
  | "archival_replay_continuation_required"
  | "archival_replay_degrading"
  | "archival_replay_unstable"
  | "fail_closed_replay_persistence_degradation"
  | "collapse_sensitive_replay_persistence";

export type CountyGovernanceReplayPersistenceExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceReplayReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonReplayContinuity =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_persistent";

export type CountyGovernanceArchivalReplayPersistenceContinuityWarningCode =
  | "ARCHIVAL_REPLAY_PERSISTENCE_WEAKNESS"
  | "RESTORATION_TRACE_CONTINUITY_WEAKNESS"
  | "REPLAY_AUDIT_DURABILITY_WEAKNESS"
  | "REPLAY_EXPLAINABILITY_SURVIVABILITY_DECAY"
  | "ARCHIVE_RESTORATION_INTEGRITY_WEAKNESS"
  | "FAIL_CLOSED_REPLAY_PERSISTENCE_DEGRADATION"
  | "REPLAY_FRAGMENTATION_RISK"
  | "REPLAY_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_REPLAY_DRIFT"
  | "REPLAY_CONTAINMENT_RISK"
  | "REPLAY_ENTROPY_RECURRENCE_RISK"
  | "REPLAY_REEVALUATION_REQUIRED"
  | "REPLAY_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_REPLAY_PERSISTENCE";

export type CountyGovernanceArchivalReplayPersistenceContinuityInput = {
  archivalReplayPersistenceScore: number;
  restorationTraceContinuityScore: number;
  replayAuditDurabilityScore: number;
  replayExplainabilitySurvivabilityScore: number;
  archiveRestorationIntegrityScore: number;
  failClosedReplayPersistenceScore: number;
  replayFragmentationRiskScore: number;
  replayDesynchronizationRiskScore: number;
  recursiveReplayDriftRiskScore: number;
  replayContainmentIntegrityScore: number;
  replayEntropyRecurrenceRiskScore: number;
  replayReevaluationPressureScore: number;
};

export type CountyGovernanceArchivalReplayPersistenceContinuityResult = {
  archivalReplayPersistenceLevel: CountyGovernanceArchivalReplayPersistenceLevel;
  replayPersistenceSeverityScore: number;
  replayPersistenceExposureLevel: CountyGovernanceReplayPersistenceExposureLevel;
  replayReevaluationRequirementLevel: CountyGovernanceReplayReevaluationRequirementLevel;
  longHorizonReplayContinuity: CountyGovernanceLongHorizonReplayContinuity;
  continuationRequired: boolean;
  failClosedReplayPersistenceDegrading: boolean;
  replayFragmentationDetected: boolean;
  replayDesynchronizationDetected: boolean;
  recursiveReplayDriftDetected: boolean;
  replayContainmentRiskDetected: boolean;
  replayEntropyRecurrenceDetected: boolean;
  collapseSensitiveReplayEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryReplayPersistenceDriver: string;
    dominantReplayEscalationReason: string;
    containmentReplayAssessment: string;
    longHorizonReplayContinuityAssessment: string;
    failClosedReplayPersistenceAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceArchivalReplayPersistenceContinuityWarningCode[] = [
  "FAIL_CLOSED_REPLAY_PERSISTENCE_DEGRADATION",
  "COLLAPSE_SENSITIVE_REPLAY_PERSISTENCE",
  "RECURSIVE_REPLAY_DRIFT",
  "REPLAY_ENTROPY_RECURRENCE_RISK",
  "REPLAY_CONTAINMENT_RISK",
  "REPLAY_DESYNCHRONIZATION_RISK",
  "REPLAY_FRAGMENTATION_RISK",
  "REPLAY_AUDIT_DURABILITY_WEAKNESS",
  "ARCHIVE_RESTORATION_INTEGRITY_WEAKNESS",
  "REPLAY_EXPLAINABILITY_SURVIVABILITY_DECAY",
  "RESTORATION_TRACE_CONTINUITY_WEAKNESS",
  "ARCHIVAL_REPLAY_PERSISTENCE_WEAKNESS",
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

function classifyExposure(score: number): CountyGovernanceReplayPersistenceExposureLevel {
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

function classifyReevaluation(score: number): CountyGovernanceReplayReevaluationRequirementLevel {
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

function classifyLongHorizonReplayContinuity(params: {
  archivalReplayPersistenceScore: number;
  restorationTraceContinuityScore: number;
  replayAuditDurabilityScore: number;
  archiveRestorationIntegrityScore: number;
  failClosedReplayPersistenceScore: number;
  replayEntropyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonReplayContinuity {
  if (
    params.archivalReplayPersistenceScore < 35 ||
    params.restorationTraceContinuityScore < 35 ||
    params.replayAuditDurabilityScore < 35 ||
    params.failClosedReplayPersistenceScore < 35 ||
    params.replayEntropyRecurrenceRiskScore >= 88
  ) {
    return "non_persistent";
  }

  if (
    params.archivalReplayPersistenceScore < 55 ||
    params.restorationTraceContinuityScore < 55 ||
    params.replayAuditDurabilityScore < 55 ||
    params.archiveRestorationIntegrityScore < 55 ||
    params.failClosedReplayPersistenceScore < 55 ||
    params.replayEntropyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.archivalReplayPersistenceScore < 75 ||
    params.restorationTraceContinuityScore < 75 ||
    params.replayAuditDurabilityScore < 75 ||
    params.archiveRestorationIntegrityScore < 75 ||
    params.replayEntropyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.archivalReplayPersistenceScore < 88 ||
    params.restorationTraceContinuityScore < 88 ||
    params.replayAuditDurabilityScore < 88 ||
    params.archiveRestorationIntegrityScore < 88 ||
    params.replayEntropyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  archivalReplayPersistenceWeakness: boolean;
  restorationTraceContinuityWeakness: boolean;
  replayAuditDurabilityWeakness: boolean;
  replayExplainabilityDecay: boolean;
  archiveRestorationIntegrityWeakness: boolean;
  failClosedDegradation: boolean;
  fragmentation: boolean;
  desynchronization: boolean;
  recursiveDrift: boolean;
  containmentRisk: boolean;
  entropyRecurrence: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceArchivalReplayPersistenceContinuityWarningCode[] {
  const warnings = new Set<CountyGovernanceArchivalReplayPersistenceContinuityWarningCode>();

  if (params.archivalReplayPersistenceWeakness) {
    warnings.add("ARCHIVAL_REPLAY_PERSISTENCE_WEAKNESS");
  }

  if (params.restorationTraceContinuityWeakness) {
    warnings.add("RESTORATION_TRACE_CONTINUITY_WEAKNESS");
  }

  if (params.replayAuditDurabilityWeakness) {
    warnings.add("REPLAY_AUDIT_DURABILITY_WEAKNESS");
  }

  if (params.replayExplainabilityDecay) {
    warnings.add("REPLAY_EXPLAINABILITY_SURVIVABILITY_DECAY");
  }

  if (params.archiveRestorationIntegrityWeakness) {
    warnings.add("ARCHIVE_RESTORATION_INTEGRITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_REPLAY_PERSISTENCE_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("REPLAY_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("REPLAY_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_REPLAY_DRIFT");
  }

  if (params.containmentRisk) {
    warnings.add("REPLAY_CONTAINMENT_RISK");
  }

  if (params.entropyRecurrence) {
    warnings.add("REPLAY_ENTROPY_RECURRENCE_RISK");
  }

  if (params.reevaluationRequired) {
    warnings.add("REPLAY_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("REPLAY_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_REPLAY_PERSISTENCE");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["archival replay persistence continuity", 0],
  )[0];
}

function classifyReplayPersistence(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  desynchronization: boolean;
  fragmentation: boolean;
  replayAuditDurabilityWeakness: boolean;
  archiveRestorationIntegrityWeakness: boolean;
  replayExplainabilityDecay: boolean;
  restorationTraceContinuityWeakness: boolean;
  archivalReplayPersistenceWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceArchivalReplayPersistenceLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_replay_persistence_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_replay_persistence";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "archival_replay_unstable";
  }

  if (
    params.replayAuditDurabilityWeakness ||
    params.archiveRestorationIntegrityWeakness ||
    params.replayExplainabilityDecay ||
    params.restorationTraceContinuityWeakness ||
    params.archivalReplayPersistenceWeakness
  ) {
    return "archival_replay_degrading";
  }

  if (params.continuationRequired) {
    return "archival_replay_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_archival_replay_persistence";
  }

  return "durable_archival_replay_persistence";
}

export function evaluateCountyGovernanceArchivalReplayPersistenceContinuity(
  input: CountyGovernanceArchivalReplayPersistenceContinuityInput,
): CountyGovernanceArchivalReplayPersistenceContinuityResult {
  const archivalReplayPersistenceScore = clampScore(input.archivalReplayPersistenceScore);
  const restorationTraceContinuityScore = clampScore(input.restorationTraceContinuityScore);
  const replayAuditDurabilityScore = clampScore(input.replayAuditDurabilityScore);
  const replayExplainabilitySurvivabilityScore = clampScore(input.replayExplainabilitySurvivabilityScore);
  const archiveRestorationIntegrityScore = clampScore(input.archiveRestorationIntegrityScore);
  const failClosedReplayPersistenceScore = clampScore(input.failClosedReplayPersistenceScore);
  const replayFragmentationRiskScore = clampScore(input.replayFragmentationRiskScore);
  const replayDesynchronizationRiskScore = clampScore(input.replayDesynchronizationRiskScore);
  const recursiveReplayDriftRiskScore = clampScore(input.recursiveReplayDriftRiskScore);
  const replayContainmentIntegrityScore = clampScore(input.replayContainmentIntegrityScore);
  const replayEntropyRecurrenceRiskScore = clampScore(input.replayEntropyRecurrenceRiskScore);
  const replayReevaluationPressureScore = clampScore(input.replayReevaluationPressureScore);

  const failClosedReplayPersistenceDegrading = failClosedReplayPersistenceScore < 55;
  const replayFragmentationDetected = replayFragmentationRiskScore >= 45;
  const replayDesynchronizationDetected = replayDesynchronizationRiskScore >= 45;
  const recursiveReplayDriftDetected = recursiveReplayDriftRiskScore >= 45;
  const replayContainmentRiskDetected = replayContainmentIntegrityScore < 55;
  const replayEntropyRecurrenceDetected = replayEntropyRecurrenceRiskScore >= 45;
  const replayAuditDurabilityWeakness = replayAuditDurabilityScore < 55;
  const archiveRestorationIntegrityWeakness = archiveRestorationIntegrityScore < 55;
  const replayExplainabilityDecay = replayExplainabilitySurvivabilityScore < 55;
  const restorationTraceContinuityWeakness = restorationTraceContinuityScore < 55;
  const archivalReplayPersistenceWeakness = archivalReplayPersistenceScore < 75;
  const collapseSensitiveReplayEscalation =
    (recursiveReplayDriftRiskScore >= 88 ||
      replayEntropyRecurrenceRiskScore >= 88 ||
      replayDesynchronizationRiskScore >= 88 ||
      replayFragmentationRiskScore >= 88) &&
    (failClosedReplayPersistenceScore < 65 || replayAuditDurabilityScore < 55);
  const reevaluationRequired =
    replayReevaluationPressureScore >= 58 ||
    replayAuditDurabilityWeakness ||
    archiveRestorationIntegrityWeakness ||
    replayExplainabilityDecay ||
    restorationTraceContinuityWeakness ||
    replayFragmentationDetected ||
    replayDesynchronizationDetected;

  const replayPersistenceSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(archivalReplayPersistenceScore),
      inverseHealthScore(restorationTraceContinuityScore),
      inverseHealthScore(replayAuditDurabilityScore),
      inverseHealthScore(replayExplainabilitySurvivabilityScore),
      inverseHealthScore(archiveRestorationIntegrityScore),
      inverseHealthScore(failClosedReplayPersistenceScore),
      replayFragmentationRiskScore,
      replayDesynchronizationRiskScore,
      recursiveReplayDriftRiskScore,
      inverseHealthScore(replayContainmentIntegrityScore),
      replayEntropyRecurrenceRiskScore,
      replayReevaluationPressureScore,
    ]),
  );

  const longHorizonReplayContinuity = classifyLongHorizonReplayContinuity({
    archivalReplayPersistenceScore,
    restorationTraceContinuityScore,
    replayAuditDurabilityScore,
    archiveRestorationIntegrityScore,
    failClosedReplayPersistenceScore,
    replayEntropyRecurrenceRiskScore,
  });
  const replayPersistenceExposureLevel = classifyExposure(replayPersistenceSeverityScore);
  const replayReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      replayPersistenceSeverityScore,
      replayReevaluationPressureScore,
      replayEntropyRecurrenceRiskScore,
      recursiveReplayDriftRiskScore,
      replayDesynchronizationRiskScore,
      replayFragmentationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedReplayPersistenceDegrading &&
    !collapseSensitiveReplayEscalation &&
    !recursiveReplayDriftDetected &&
    !replayEntropyRecurrenceDetected &&
    !replayContainmentRiskDetected &&
    !replayDesynchronizationDetected &&
    !replayFragmentationDetected &&
    replayPersistenceSeverityScore >= 35 &&
    replayPersistenceSeverityScore < 72;

  const warningCodes = buildWarnings({
    archivalReplayPersistenceWeakness,
    restorationTraceContinuityWeakness,
    replayAuditDurabilityWeakness,
    replayExplainabilityDecay,
    archiveRestorationIntegrityWeakness,
    failClosedDegradation: failClosedReplayPersistenceDegrading,
    fragmentation: replayFragmentationDetected,
    desynchronization: replayDesynchronizationDetected,
    recursiveDrift: recursiveReplayDriftDetected,
    containmentRisk: replayContainmentRiskDetected,
    entropyRecurrence: replayEntropyRecurrenceDetected,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveReplayEscalation,
  });

  const archivalReplayPersistenceLevel = classifyReplayPersistence({
    failClosedDegradation: failClosedReplayPersistenceDegrading,
    collapseSensitive: collapseSensitiveReplayEscalation,
    recursiveDrift: recursiveReplayDriftDetected,
    entropyRecurrence: replayEntropyRecurrenceDetected,
    containmentRisk: replayContainmentRiskDetected,
    desynchronization: replayDesynchronizationDetected,
    fragmentation: replayFragmentationDetected,
    replayAuditDurabilityWeakness,
    archiveRestorationIntegrityWeakness,
    replayExplainabilityDecay,
    restorationTraceContinuityWeakness,
    archivalReplayPersistenceWeakness,
    continuationRequired,
    severityScore: replayPersistenceSeverityScore,
  });

  const primaryReplayPersistenceDriver = selectPrimaryDriver({
    "archival replay persistence weakness": inverseHealthScore(archivalReplayPersistenceScore),
    "restoration trace continuity weakness": inverseHealthScore(restorationTraceContinuityScore),
    "replay audit durability weakness": inverseHealthScore(replayAuditDurabilityScore),
    "replay explainability survivability decay": inverseHealthScore(replayExplainabilitySurvivabilityScore),
    "archive restoration integrity weakness": inverseHealthScore(archiveRestorationIntegrityScore),
    "fail-closed replay persistence degradation": inverseHealthScore(failClosedReplayPersistenceScore),
    "replay fragmentation risk": replayFragmentationRiskScore,
    "replay desynchronization risk": replayDesynchronizationRiskScore,
    "recursive replay drift": recursiveReplayDriftRiskScore,
    "replay containment risk": inverseHealthScore(replayContainmentIntegrityScore),
    "replay entropy recurrence risk": replayEntropyRecurrenceRiskScore,
    "replay reevaluation pressure": replayReevaluationPressureScore,
  });

  return {
    archivalReplayPersistenceLevel,
    replayPersistenceSeverityScore,
    replayPersistenceExposureLevel,
    replayReevaluationRequirementLevel,
    longHorizonReplayContinuity,
    continuationRequired,
    failClosedReplayPersistenceDegrading,
    replayFragmentationDetected,
    replayDesynchronizationDetected,
    recursiveReplayDriftDetected,
    replayContainmentRiskDetected,
    replayEntropyRecurrenceDetected,
    collapseSensitiveReplayEscalation,
    warningCodes,
    explainability: {
      primaryReplayPersistenceDriver,
      dominantReplayEscalationReason:
        warningCodes[0] ?? "No deterministic archival replay persistence escalation threshold was crossed.",
      containmentReplayAssessment: replayContainmentRiskDetected
        ? "Replay containment is not strong enough to preserve archival replay persistence under restoration pressure."
        : "Replay containment remains persistence-preserving for the current caller-supplied governance context.",
      longHorizonReplayContinuityAssessment:
        longHorizonReplayContinuity === "durable"
          ? "Long-horizon archival replay persistence is durable under the current inputs. Replay persistence does not imply permanent governance restoration."
          : `Long-horizon archival replay persistence is ${longHorizonReplayContinuity} under the current inputs. Archival transfer continuity does not guarantee replay persistence.`,
      failClosedReplayPersistenceAssessment: failClosedReplayPersistenceDegrading
        ? "Fail-closed replay persistence is degrading and overrides optimistic replay continuity assumptions."
        : "Fail-closed replay persistence remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
