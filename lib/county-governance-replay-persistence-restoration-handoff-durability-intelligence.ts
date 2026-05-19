export type CountyGovernanceRestorationHandoffDurabilityLevel =
  | "durable_restoration_handoff_durability"
  | "bounded_restoration_handoff_durability"
  | "restoration_handoff_continuation_required"
  | "restoration_handoff_degrading"
  | "restoration_handoff_unstable"
  | "fail_closed_restoration_handoff_degradation"
  | "collapse_sensitive_restoration_handoff";

export type CountyGovernanceRestorationHandoffExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRestorationHandoffReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonRestorationHandoff =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_handoff_viable";

export type CountyGovernanceReplayPersistenceRestorationHandoffDurabilityWarningCode =
  | "RESTORATION_HANDOFF_DURABILITY_WEAKNESS"
  | "REPLAY_TO_RESTORATION_HANDOFF_WEAKNESS"
  | "RESTORATION_TRANSFER_CONTINUITY_WEAKNESS"
  | "AUDIT_HANDOFF_DURABILITY_WEAKNESS"
  | "RESTORATION_EXPLAINABILITY_CONTINUITY_DECAY"
  | "FAIL_CLOSED_RESTORATION_HANDOFF_DEGRADATION"
  | "RESTORATION_HANDOFF_FRAGMENTATION_RISK"
  | "RESTORATION_HANDOFF_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_RESTORATION_HANDOFF_DRIFT"
  | "RESTORATION_HANDOFF_CONTAINMENT_RISK"
  | "RESTORATION_HANDOFF_ENTROPY_RECURRENCE_RISK"
  | "RESTORATION_HANDOFF_REEVALUATION_REQUIRED"
  | "RESTORATION_HANDOFF_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_RESTORATION_HANDOFF";

export type CountyGovernanceReplayPersistenceRestorationHandoffDurabilityInput = {
  restorationHandoffDurabilityScore: number;
  replayToRestorationHandoffScore: number;
  restorationTransferContinuityScore: number;
  auditHandoffDurabilityScore: number;
  restorationExplainabilityContinuityScore: number;
  failClosedRestorationHandoffScore: number;
  restorationHandoffFragmentationRiskScore: number;
  restorationHandoffDesynchronizationRiskScore: number;
  recursiveRestorationHandoffDriftRiskScore: number;
  restorationHandoffContainmentIntegrityScore: number;
  restorationHandoffEntropyRecurrenceRiskScore: number;
  restorationHandoffReevaluationPressureScore: number;
};

export type CountyGovernanceReplayPersistenceRestorationHandoffDurabilityResult = {
  restorationHandoffDurabilityLevel: CountyGovernanceRestorationHandoffDurabilityLevel;
  restorationHandoffSeverityScore: number;
  restorationHandoffExposureLevel: CountyGovernanceRestorationHandoffExposureLevel;
  restorationHandoffReevaluationRequirementLevel: CountyGovernanceRestorationHandoffReevaluationRequirementLevel;
  longHorizonRestorationHandoff: CountyGovernanceLongHorizonRestorationHandoff;
  continuationRequired: boolean;
  failClosedRestorationHandoffDegrading: boolean;
  restorationHandoffFragmentationDetected: boolean;
  restorationHandoffDesynchronizationDetected: boolean;
  recursiveRestorationHandoffDriftDetected: boolean;
  restorationHandoffContainmentRiskDetected: boolean;
  restorationHandoffEntropyRecurrenceDetected: boolean;
  collapseSensitiveRestorationHandoffEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryRestorationHandoffDriver: string;
    dominantRestorationHandoffEscalationReason: string;
    containmentRestorationHandoffAssessment: string;
    longHorizonRestorationHandoffAssessment: string;
    failClosedRestorationHandoffAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceReplayPersistenceRestorationHandoffDurabilityWarningCode[] = [
  "FAIL_CLOSED_RESTORATION_HANDOFF_DEGRADATION",
  "COLLAPSE_SENSITIVE_RESTORATION_HANDOFF",
  "RECURSIVE_RESTORATION_HANDOFF_DRIFT",
  "RESTORATION_HANDOFF_ENTROPY_RECURRENCE_RISK",
  "RESTORATION_HANDOFF_CONTAINMENT_RISK",
  "RESTORATION_HANDOFF_DESYNCHRONIZATION_RISK",
  "RESTORATION_HANDOFF_FRAGMENTATION_RISK",
  "AUDIT_HANDOFF_DURABILITY_WEAKNESS",
  "RESTORATION_TRANSFER_CONTINUITY_WEAKNESS",
  "RESTORATION_EXPLAINABILITY_CONTINUITY_DECAY",
  "REPLAY_TO_RESTORATION_HANDOFF_WEAKNESS",
  "RESTORATION_HANDOFF_DURABILITY_WEAKNESS",
  "RESTORATION_HANDOFF_REEVALUATION_REQUIRED",
  "RESTORATION_HANDOFF_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceRestorationHandoffExposureLevel {
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

function classifyReevaluation(score: number): CountyGovernanceRestorationHandoffReevaluationRequirementLevel {
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

function classifyLongHorizonRestorationHandoff(params: {
  restorationHandoffDurabilityScore: number;
  replayToRestorationHandoffScore: number;
  restorationTransferContinuityScore: number;
  auditHandoffDurabilityScore: number;
  failClosedRestorationHandoffScore: number;
  restorationHandoffEntropyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonRestorationHandoff {
  if (
    params.restorationHandoffDurabilityScore < 35 ||
    params.replayToRestorationHandoffScore < 35 ||
    params.auditHandoffDurabilityScore < 35 ||
    params.failClosedRestorationHandoffScore < 35 ||
    params.restorationHandoffEntropyRecurrenceRiskScore >= 88
  ) {
    return "non_handoff_viable";
  }

  if (
    params.restorationHandoffDurabilityScore < 55 ||
    params.replayToRestorationHandoffScore < 55 ||
    params.restorationTransferContinuityScore < 55 ||
    params.auditHandoffDurabilityScore < 55 ||
    params.failClosedRestorationHandoffScore < 55 ||
    params.restorationHandoffEntropyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.restorationHandoffDurabilityScore < 75 ||
    params.replayToRestorationHandoffScore < 75 ||
    params.restorationTransferContinuityScore < 75 ||
    params.auditHandoffDurabilityScore < 75 ||
    params.restorationHandoffEntropyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.restorationHandoffDurabilityScore < 88 ||
    params.replayToRestorationHandoffScore < 88 ||
    params.restorationTransferContinuityScore < 88 ||
    params.auditHandoffDurabilityScore < 88 ||
    params.restorationHandoffEntropyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  restorationHandoffDurabilityWeakness: boolean;
  replayToRestorationHandoffWeakness: boolean;
  restorationTransferContinuityWeakness: boolean;
  auditHandoffDurabilityWeakness: boolean;
  restorationExplainabilityDecay: boolean;
  failClosedDegradation: boolean;
  fragmentation: boolean;
  desynchronization: boolean;
  recursiveDrift: boolean;
  containmentRisk: boolean;
  entropyRecurrence: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceReplayPersistenceRestorationHandoffDurabilityWarningCode[] {
  const warnings = new Set<CountyGovernanceReplayPersistenceRestorationHandoffDurabilityWarningCode>();

  if (params.restorationHandoffDurabilityWeakness) {
    warnings.add("RESTORATION_HANDOFF_DURABILITY_WEAKNESS");
  }

  if (params.replayToRestorationHandoffWeakness) {
    warnings.add("REPLAY_TO_RESTORATION_HANDOFF_WEAKNESS");
  }

  if (params.restorationTransferContinuityWeakness) {
    warnings.add("RESTORATION_TRANSFER_CONTINUITY_WEAKNESS");
  }

  if (params.auditHandoffDurabilityWeakness) {
    warnings.add("AUDIT_HANDOFF_DURABILITY_WEAKNESS");
  }

  if (params.restorationExplainabilityDecay) {
    warnings.add("RESTORATION_EXPLAINABILITY_CONTINUITY_DECAY");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_RESTORATION_HANDOFF_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("RESTORATION_HANDOFF_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("RESTORATION_HANDOFF_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_RESTORATION_HANDOFF_DRIFT");
  }

  if (params.containmentRisk) {
    warnings.add("RESTORATION_HANDOFF_CONTAINMENT_RISK");
  }

  if (params.entropyRecurrence) {
    warnings.add("RESTORATION_HANDOFF_ENTROPY_RECURRENCE_RISK");
  }

  if (params.reevaluationRequired) {
    warnings.add("RESTORATION_HANDOFF_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("RESTORATION_HANDOFF_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_RESTORATION_HANDOFF");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["replay persistence restoration handoff durability", 0],
  )[0];
}

function classifyRestorationHandoff(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  desynchronization: boolean;
  fragmentation: boolean;
  auditHandoffDurabilityWeakness: boolean;
  restorationTransferContinuityWeakness: boolean;
  restorationExplainabilityDecay: boolean;
  replayToRestorationHandoffWeakness: boolean;
  restorationHandoffDurabilityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceRestorationHandoffDurabilityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_restoration_handoff_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_restoration_handoff";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "restoration_handoff_unstable";
  }

  if (
    params.auditHandoffDurabilityWeakness ||
    params.restorationTransferContinuityWeakness ||
    params.restorationExplainabilityDecay ||
    params.replayToRestorationHandoffWeakness ||
    params.restorationHandoffDurabilityWeakness
  ) {
    return "restoration_handoff_degrading";
  }

  if (params.continuationRequired) {
    return "restoration_handoff_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_restoration_handoff_durability";
  }

  return "durable_restoration_handoff_durability";
}

export function evaluateCountyGovernanceReplayPersistenceRestorationHandoffDurability(
  input: CountyGovernanceReplayPersistenceRestorationHandoffDurabilityInput,
): CountyGovernanceReplayPersistenceRestorationHandoffDurabilityResult {
  const restorationHandoffDurabilityScore = clampScore(input.restorationHandoffDurabilityScore);
  const replayToRestorationHandoffScore = clampScore(input.replayToRestorationHandoffScore);
  const restorationTransferContinuityScore = clampScore(input.restorationTransferContinuityScore);
  const auditHandoffDurabilityScore = clampScore(input.auditHandoffDurabilityScore);
  const restorationExplainabilityContinuityScore = clampScore(input.restorationExplainabilityContinuityScore);
  const failClosedRestorationHandoffScore = clampScore(input.failClosedRestorationHandoffScore);
  const restorationHandoffFragmentationRiskScore = clampScore(input.restorationHandoffFragmentationRiskScore);
  const restorationHandoffDesynchronizationRiskScore = clampScore(
    input.restorationHandoffDesynchronizationRiskScore,
  );
  const recursiveRestorationHandoffDriftRiskScore = clampScore(input.recursiveRestorationHandoffDriftRiskScore);
  const restorationHandoffContainmentIntegrityScore = clampScore(input.restorationHandoffContainmentIntegrityScore);
  const restorationHandoffEntropyRecurrenceRiskScore = clampScore(input.restorationHandoffEntropyRecurrenceRiskScore);
  const restorationHandoffReevaluationPressureScore = clampScore(input.restorationHandoffReevaluationPressureScore);

  const failClosedRestorationHandoffDegrading = failClosedRestorationHandoffScore < 55;
  const restorationHandoffFragmentationDetected = restorationHandoffFragmentationRiskScore >= 45;
  const restorationHandoffDesynchronizationDetected = restorationHandoffDesynchronizationRiskScore >= 45;
  const recursiveRestorationHandoffDriftDetected = recursiveRestorationHandoffDriftRiskScore >= 45;
  const restorationHandoffContainmentRiskDetected = restorationHandoffContainmentIntegrityScore < 55;
  const restorationHandoffEntropyRecurrenceDetected = restorationHandoffEntropyRecurrenceRiskScore >= 45;
  const auditHandoffDurabilityWeakness = auditHandoffDurabilityScore < 55;
  const restorationTransferContinuityWeakness = restorationTransferContinuityScore < 55;
  const restorationExplainabilityDecay = restorationExplainabilityContinuityScore < 55;
  const replayToRestorationHandoffWeakness = replayToRestorationHandoffScore < 55;
  const restorationHandoffDurabilityWeakness = restorationHandoffDurabilityScore < 75;
  const collapseSensitiveRestorationHandoffEscalation =
    (recursiveRestorationHandoffDriftRiskScore >= 88 ||
      restorationHandoffEntropyRecurrenceRiskScore >= 88 ||
      restorationHandoffDesynchronizationRiskScore >= 88 ||
      restorationHandoffFragmentationRiskScore >= 88) &&
    (failClosedRestorationHandoffScore < 65 || auditHandoffDurabilityScore < 55);
  const reevaluationRequired =
    restorationHandoffReevaluationPressureScore >= 58 ||
    auditHandoffDurabilityWeakness ||
    restorationTransferContinuityWeakness ||
    restorationExplainabilityDecay ||
    replayToRestorationHandoffWeakness ||
    restorationHandoffFragmentationDetected ||
    restorationHandoffDesynchronizationDetected;

  const restorationHandoffSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(restorationHandoffDurabilityScore),
      inverseHealthScore(replayToRestorationHandoffScore),
      inverseHealthScore(restorationTransferContinuityScore),
      inverseHealthScore(auditHandoffDurabilityScore),
      inverseHealthScore(restorationExplainabilityContinuityScore),
      inverseHealthScore(failClosedRestorationHandoffScore),
      restorationHandoffFragmentationRiskScore,
      restorationHandoffDesynchronizationRiskScore,
      recursiveRestorationHandoffDriftRiskScore,
      inverseHealthScore(restorationHandoffContainmentIntegrityScore),
      restorationHandoffEntropyRecurrenceRiskScore,
      restorationHandoffReevaluationPressureScore,
    ]),
  );

  const longHorizonRestorationHandoff = classifyLongHorizonRestorationHandoff({
    restorationHandoffDurabilityScore,
    replayToRestorationHandoffScore,
    restorationTransferContinuityScore,
    auditHandoffDurabilityScore,
    failClosedRestorationHandoffScore,
    restorationHandoffEntropyRecurrenceRiskScore,
  });
  const restorationHandoffExposureLevel = classifyExposure(restorationHandoffSeverityScore);
  const restorationHandoffReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      restorationHandoffSeverityScore,
      restorationHandoffReevaluationPressureScore,
      restorationHandoffEntropyRecurrenceRiskScore,
      recursiveRestorationHandoffDriftRiskScore,
      restorationHandoffDesynchronizationRiskScore,
      restorationHandoffFragmentationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedRestorationHandoffDegrading &&
    !collapseSensitiveRestorationHandoffEscalation &&
    !recursiveRestorationHandoffDriftDetected &&
    !restorationHandoffEntropyRecurrenceDetected &&
    !restorationHandoffContainmentRiskDetected &&
    !restorationHandoffDesynchronizationDetected &&
    !restorationHandoffFragmentationDetected &&
    restorationHandoffSeverityScore >= 35 &&
    restorationHandoffSeverityScore < 72;

  const warningCodes = buildWarnings({
    restorationHandoffDurabilityWeakness,
    replayToRestorationHandoffWeakness,
    restorationTransferContinuityWeakness,
    auditHandoffDurabilityWeakness,
    restorationExplainabilityDecay,
    failClosedDegradation: failClosedRestorationHandoffDegrading,
    fragmentation: restorationHandoffFragmentationDetected,
    desynchronization: restorationHandoffDesynchronizationDetected,
    recursiveDrift: recursiveRestorationHandoffDriftDetected,
    containmentRisk: restorationHandoffContainmentRiskDetected,
    entropyRecurrence: restorationHandoffEntropyRecurrenceDetected,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveRestorationHandoffEscalation,
  });

  const restorationHandoffDurabilityLevel = classifyRestorationHandoff({
    failClosedDegradation: failClosedRestorationHandoffDegrading,
    collapseSensitive: collapseSensitiveRestorationHandoffEscalation,
    recursiveDrift: recursiveRestorationHandoffDriftDetected,
    entropyRecurrence: restorationHandoffEntropyRecurrenceDetected,
    containmentRisk: restorationHandoffContainmentRiskDetected,
    desynchronization: restorationHandoffDesynchronizationDetected,
    fragmentation: restorationHandoffFragmentationDetected,
    auditHandoffDurabilityWeakness,
    restorationTransferContinuityWeakness,
    restorationExplainabilityDecay,
    replayToRestorationHandoffWeakness,
    restorationHandoffDurabilityWeakness,
    continuationRequired,
    severityScore: restorationHandoffSeverityScore,
  });

  const primaryRestorationHandoffDriver = selectPrimaryDriver({
    "restoration handoff durability weakness": inverseHealthScore(restorationHandoffDurabilityScore),
    "replay-to-restoration handoff weakness": inverseHealthScore(replayToRestorationHandoffScore),
    "restoration transfer continuity weakness": inverseHealthScore(restorationTransferContinuityScore),
    "audit handoff durability weakness": inverseHealthScore(auditHandoffDurabilityScore),
    "restoration explainability continuity decay": inverseHealthScore(restorationExplainabilityContinuityScore),
    "fail-closed restoration handoff degradation": inverseHealthScore(failClosedRestorationHandoffScore),
    "restoration handoff fragmentation risk": restorationHandoffFragmentationRiskScore,
    "restoration handoff desynchronization risk": restorationHandoffDesynchronizationRiskScore,
    "recursive restoration handoff drift": recursiveRestorationHandoffDriftRiskScore,
    "restoration handoff containment risk": inverseHealthScore(restorationHandoffContainmentIntegrityScore),
    "restoration handoff entropy recurrence risk": restorationHandoffEntropyRecurrenceRiskScore,
    "restoration handoff reevaluation pressure": restorationHandoffReevaluationPressureScore,
  });

  return {
    restorationHandoffDurabilityLevel,
    restorationHandoffSeverityScore,
    restorationHandoffExposureLevel,
    restorationHandoffReevaluationRequirementLevel,
    longHorizonRestorationHandoff,
    continuationRequired,
    failClosedRestorationHandoffDegrading,
    restorationHandoffFragmentationDetected,
    restorationHandoffDesynchronizationDetected,
    recursiveRestorationHandoffDriftDetected,
    restorationHandoffContainmentRiskDetected,
    restorationHandoffEntropyRecurrenceDetected,
    collapseSensitiveRestorationHandoffEscalation,
    warningCodes,
    explainability: {
      primaryRestorationHandoffDriver,
      dominantRestorationHandoffEscalationReason:
        warningCodes[0] ?? "No deterministic replay persistence restoration handoff escalation threshold was crossed.",
      containmentRestorationHandoffAssessment: restorationHandoffContainmentRiskDetected
        ? "Restoration handoff containment is not strong enough to preserve handoff durability under transfer pressure."
        : "Restoration handoff containment remains durability-preserving for the current caller-supplied governance context.",
      longHorizonRestorationHandoffAssessment:
        longHorizonRestorationHandoff === "durable"
          ? "Long-horizon restoration handoff durability is durable under the current inputs. Restoration handoff durability does not imply permanent governance recovery."
          : `Long-horizon restoration handoff durability is ${longHorizonRestorationHandoff} under the current inputs. Restoration trace continuity does not guarantee restoration handoff durability.`,
      failClosedRestorationHandoffAssessment: failClosedRestorationHandoffDegrading
        ? "Fail-closed restoration handoff is degrading and overrides optimistic handoff assumptions."
        : "Fail-closed restoration handoff remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
