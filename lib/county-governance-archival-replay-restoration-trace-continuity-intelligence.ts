export type CountyGovernanceRestorationTraceContinuityLevel =
  | "durable_restoration_trace_continuity"
  | "bounded_restoration_trace_continuity"
  | "restoration_trace_continuation_required"
  | "restoration_trace_degrading"
  | "restoration_trace_unstable"
  | "fail_closed_restoration_continuity_degradation"
  | "collapse_sensitive_restoration_continuity";

export type CountyGovernanceRestorationContinuityExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRestorationReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonRestorationContinuity =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_restorable";

export type CountyGovernanceArchivalReplayRestorationTraceContinuityWarningCode =
  | "RESTORATION_TRACE_CONTINUITY_WEAKNESS"
  | "REPLAY_TO_RESTORATION_CONTINUITY_WEAKNESS"
  | "RESTORATION_AUDIT_TRACE_INTEGRITY_WEAKNESS"
  | "RESTORATION_EXPLAINABILITY_SURVIVABILITY_DECAY"
  | "RESTORATION_HANDOFF_DURABILITY_WEAKNESS"
  | "FAIL_CLOSED_RESTORATION_CONTINUITY_DEGRADATION"
  | "RESTORATION_FRAGMENTATION_RISK"
  | "RESTORATION_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_RESTORATION_DRIFT"
  | "RESTORATION_CONTAINMENT_RISK"
  | "RESTORATION_ENTROPY_RECURRENCE_RISK"
  | "RESTORATION_REEVALUATION_REQUIRED"
  | "RESTORATION_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_RESTORATION_CONTINUITY";

export type CountyGovernanceArchivalReplayRestorationTraceContinuityInput = {
  restorationTraceContinuityScore: number;
  replayToRestorationContinuityScore: number;
  restorationAuditTraceIntegrityScore: number;
  restorationExplainabilitySurvivabilityScore: number;
  restorationHandoffDurabilityScore: number;
  failClosedRestorationContinuityScore: number;
  restorationFragmentationRiskScore: number;
  restorationDesynchronizationRiskScore: number;
  recursiveRestorationDriftRiskScore: number;
  restorationContainmentIntegrityScore: number;
  restorationEntropyRecurrenceRiskScore: number;
  restorationReevaluationPressureScore: number;
};

export type CountyGovernanceArchivalReplayRestorationTraceContinuityResult = {
  restorationTraceContinuityLevel: CountyGovernanceRestorationTraceContinuityLevel;
  restorationContinuitySeverityScore: number;
  restorationContinuityExposureLevel: CountyGovernanceRestorationContinuityExposureLevel;
  restorationReevaluationRequirementLevel: CountyGovernanceRestorationReevaluationRequirementLevel;
  longHorizonRestorationContinuity: CountyGovernanceLongHorizonRestorationContinuity;
  continuationRequired: boolean;
  failClosedRestorationContinuityDegrading: boolean;
  restorationFragmentationDetected: boolean;
  restorationDesynchronizationDetected: boolean;
  recursiveRestorationDriftDetected: boolean;
  restorationContainmentRiskDetected: boolean;
  restorationEntropyRecurrenceDetected: boolean;
  collapseSensitiveRestorationEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryRestorationContinuityDriver: string;
    dominantRestorationEscalationReason: string;
    containmentRestorationAssessment: string;
    longHorizonRestorationContinuityAssessment: string;
    failClosedRestorationContinuityAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceArchivalReplayRestorationTraceContinuityWarningCode[] = [
  "FAIL_CLOSED_RESTORATION_CONTINUITY_DEGRADATION",
  "COLLAPSE_SENSITIVE_RESTORATION_CONTINUITY",
  "RECURSIVE_RESTORATION_DRIFT",
  "RESTORATION_ENTROPY_RECURRENCE_RISK",
  "RESTORATION_CONTAINMENT_RISK",
  "RESTORATION_DESYNCHRONIZATION_RISK",
  "RESTORATION_FRAGMENTATION_RISK",
  "RESTORATION_AUDIT_TRACE_INTEGRITY_WEAKNESS",
  "RESTORATION_HANDOFF_DURABILITY_WEAKNESS",
  "RESTORATION_EXPLAINABILITY_SURVIVABILITY_DECAY",
  "REPLAY_TO_RESTORATION_CONTINUITY_WEAKNESS",
  "RESTORATION_TRACE_CONTINUITY_WEAKNESS",
  "RESTORATION_REEVALUATION_REQUIRED",
  "RESTORATION_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceRestorationContinuityExposureLevel {
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

function classifyReevaluation(score: number): CountyGovernanceRestorationReevaluationRequirementLevel {
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

function classifyLongHorizonRestorationContinuity(params: {
  restorationTraceContinuityScore: number;
  replayToRestorationContinuityScore: number;
  restorationAuditTraceIntegrityScore: number;
  restorationHandoffDurabilityScore: number;
  failClosedRestorationContinuityScore: number;
  restorationEntropyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonRestorationContinuity {
  if (
    params.restorationTraceContinuityScore < 35 ||
    params.replayToRestorationContinuityScore < 35 ||
    params.restorationAuditTraceIntegrityScore < 35 ||
    params.failClosedRestorationContinuityScore < 35 ||
    params.restorationEntropyRecurrenceRiskScore >= 88
  ) {
    return "non_restorable";
  }

  if (
    params.restorationTraceContinuityScore < 55 ||
    params.replayToRestorationContinuityScore < 55 ||
    params.restorationAuditTraceIntegrityScore < 55 ||
    params.restorationHandoffDurabilityScore < 55 ||
    params.failClosedRestorationContinuityScore < 55 ||
    params.restorationEntropyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.restorationTraceContinuityScore < 75 ||
    params.replayToRestorationContinuityScore < 75 ||
    params.restorationAuditTraceIntegrityScore < 75 ||
    params.restorationHandoffDurabilityScore < 75 ||
    params.restorationEntropyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.restorationTraceContinuityScore < 88 ||
    params.replayToRestorationContinuityScore < 88 ||
    params.restorationAuditTraceIntegrityScore < 88 ||
    params.restorationHandoffDurabilityScore < 88 ||
    params.restorationEntropyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  restorationTraceContinuityWeakness: boolean;
  replayToRestorationContinuityWeakness: boolean;
  restorationAuditTraceIntegrityWeakness: boolean;
  restorationExplainabilityDecay: boolean;
  restorationHandoffDurabilityWeakness: boolean;
  failClosedDegradation: boolean;
  fragmentation: boolean;
  desynchronization: boolean;
  recursiveDrift: boolean;
  containmentRisk: boolean;
  entropyRecurrence: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceArchivalReplayRestorationTraceContinuityWarningCode[] {
  const warnings = new Set<CountyGovernanceArchivalReplayRestorationTraceContinuityWarningCode>();

  if (params.restorationTraceContinuityWeakness) {
    warnings.add("RESTORATION_TRACE_CONTINUITY_WEAKNESS");
  }

  if (params.replayToRestorationContinuityWeakness) {
    warnings.add("REPLAY_TO_RESTORATION_CONTINUITY_WEAKNESS");
  }

  if (params.restorationAuditTraceIntegrityWeakness) {
    warnings.add("RESTORATION_AUDIT_TRACE_INTEGRITY_WEAKNESS");
  }

  if (params.restorationExplainabilityDecay) {
    warnings.add("RESTORATION_EXPLAINABILITY_SURVIVABILITY_DECAY");
  }

  if (params.restorationHandoffDurabilityWeakness) {
    warnings.add("RESTORATION_HANDOFF_DURABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_RESTORATION_CONTINUITY_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("RESTORATION_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("RESTORATION_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_RESTORATION_DRIFT");
  }

  if (params.containmentRisk) {
    warnings.add("RESTORATION_CONTAINMENT_RISK");
  }

  if (params.entropyRecurrence) {
    warnings.add("RESTORATION_ENTROPY_RECURRENCE_RISK");
  }

  if (params.reevaluationRequired) {
    warnings.add("RESTORATION_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("RESTORATION_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_RESTORATION_CONTINUITY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["archival replay restoration trace continuity", 0],
  )[0];
}

function classifyRestorationContinuity(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  desynchronization: boolean;
  fragmentation: boolean;
  restorationAuditTraceIntegrityWeakness: boolean;
  restorationHandoffDurabilityWeakness: boolean;
  restorationExplainabilityDecay: boolean;
  replayToRestorationContinuityWeakness: boolean;
  restorationTraceContinuityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceRestorationTraceContinuityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_restoration_continuity_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_restoration_continuity";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "restoration_trace_unstable";
  }

  if (
    params.restorationAuditTraceIntegrityWeakness ||
    params.restorationHandoffDurabilityWeakness ||
    params.restorationExplainabilityDecay ||
    params.replayToRestorationContinuityWeakness ||
    params.restorationTraceContinuityWeakness
  ) {
    return "restoration_trace_degrading";
  }

  if (params.continuationRequired) {
    return "restoration_trace_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_restoration_trace_continuity";
  }

  return "durable_restoration_trace_continuity";
}

export function evaluateCountyGovernanceArchivalReplayRestorationTraceContinuity(
  input: CountyGovernanceArchivalReplayRestorationTraceContinuityInput,
): CountyGovernanceArchivalReplayRestorationTraceContinuityResult {
  const restorationTraceContinuityScore = clampScore(input.restorationTraceContinuityScore);
  const replayToRestorationContinuityScore = clampScore(input.replayToRestorationContinuityScore);
  const restorationAuditTraceIntegrityScore = clampScore(input.restorationAuditTraceIntegrityScore);
  const restorationExplainabilitySurvivabilityScore = clampScore(input.restorationExplainabilitySurvivabilityScore);
  const restorationHandoffDurabilityScore = clampScore(input.restorationHandoffDurabilityScore);
  const failClosedRestorationContinuityScore = clampScore(input.failClosedRestorationContinuityScore);
  const restorationFragmentationRiskScore = clampScore(input.restorationFragmentationRiskScore);
  const restorationDesynchronizationRiskScore = clampScore(input.restorationDesynchronizationRiskScore);
  const recursiveRestorationDriftRiskScore = clampScore(input.recursiveRestorationDriftRiskScore);
  const restorationContainmentIntegrityScore = clampScore(input.restorationContainmentIntegrityScore);
  const restorationEntropyRecurrenceRiskScore = clampScore(input.restorationEntropyRecurrenceRiskScore);
  const restorationReevaluationPressureScore = clampScore(input.restorationReevaluationPressureScore);

  const failClosedRestorationContinuityDegrading = failClosedRestorationContinuityScore < 55;
  const restorationFragmentationDetected = restorationFragmentationRiskScore >= 45;
  const restorationDesynchronizationDetected = restorationDesynchronizationRiskScore >= 45;
  const recursiveRestorationDriftDetected = recursiveRestorationDriftRiskScore >= 45;
  const restorationContainmentRiskDetected = restorationContainmentIntegrityScore < 55;
  const restorationEntropyRecurrenceDetected = restorationEntropyRecurrenceRiskScore >= 45;
  const restorationAuditTraceIntegrityWeakness = restorationAuditTraceIntegrityScore < 55;
  const restorationHandoffDurabilityWeakness = restorationHandoffDurabilityScore < 55;
  const restorationExplainabilityDecay = restorationExplainabilitySurvivabilityScore < 55;
  const replayToRestorationContinuityWeakness = replayToRestorationContinuityScore < 55;
  const restorationTraceContinuityWeakness = restorationTraceContinuityScore < 75;
  const collapseSensitiveRestorationEscalation =
    (recursiveRestorationDriftRiskScore >= 88 ||
      restorationEntropyRecurrenceRiskScore >= 88 ||
      restorationDesynchronizationRiskScore >= 88 ||
      restorationFragmentationRiskScore >= 88) &&
    (failClosedRestorationContinuityScore < 65 || restorationAuditTraceIntegrityScore < 55);
  const reevaluationRequired =
    restorationReevaluationPressureScore >= 58 ||
    restorationAuditTraceIntegrityWeakness ||
    restorationHandoffDurabilityWeakness ||
    restorationExplainabilityDecay ||
    replayToRestorationContinuityWeakness ||
    restorationFragmentationDetected ||
    restorationDesynchronizationDetected;

  const restorationContinuitySeverityScore = clampScore(
    maxScore([
      inverseHealthScore(restorationTraceContinuityScore),
      inverseHealthScore(replayToRestorationContinuityScore),
      inverseHealthScore(restorationAuditTraceIntegrityScore),
      inverseHealthScore(restorationExplainabilitySurvivabilityScore),
      inverseHealthScore(restorationHandoffDurabilityScore),
      inverseHealthScore(failClosedRestorationContinuityScore),
      restorationFragmentationRiskScore,
      restorationDesynchronizationRiskScore,
      recursiveRestorationDriftRiskScore,
      inverseHealthScore(restorationContainmentIntegrityScore),
      restorationEntropyRecurrenceRiskScore,
      restorationReevaluationPressureScore,
    ]),
  );

  const longHorizonRestorationContinuity = classifyLongHorizonRestorationContinuity({
    restorationTraceContinuityScore,
    replayToRestorationContinuityScore,
    restorationAuditTraceIntegrityScore,
    restorationHandoffDurabilityScore,
    failClosedRestorationContinuityScore,
    restorationEntropyRecurrenceRiskScore,
  });
  const restorationContinuityExposureLevel = classifyExposure(restorationContinuitySeverityScore);
  const restorationReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      restorationContinuitySeverityScore,
      restorationReevaluationPressureScore,
      restorationEntropyRecurrenceRiskScore,
      recursiveRestorationDriftRiskScore,
      restorationDesynchronizationRiskScore,
      restorationFragmentationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedRestorationContinuityDegrading &&
    !collapseSensitiveRestorationEscalation &&
    !recursiveRestorationDriftDetected &&
    !restorationEntropyRecurrenceDetected &&
    !restorationContainmentRiskDetected &&
    !restorationDesynchronizationDetected &&
    !restorationFragmentationDetected &&
    restorationContinuitySeverityScore >= 35 &&
    restorationContinuitySeverityScore < 72;

  const warningCodes = buildWarnings({
    restorationTraceContinuityWeakness,
    replayToRestorationContinuityWeakness,
    restorationAuditTraceIntegrityWeakness,
    restorationExplainabilityDecay,
    restorationHandoffDurabilityWeakness,
    failClosedDegradation: failClosedRestorationContinuityDegrading,
    fragmentation: restorationFragmentationDetected,
    desynchronization: restorationDesynchronizationDetected,
    recursiveDrift: recursiveRestorationDriftDetected,
    containmentRisk: restorationContainmentRiskDetected,
    entropyRecurrence: restorationEntropyRecurrenceDetected,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveRestorationEscalation,
  });

  const restorationTraceContinuityLevel = classifyRestorationContinuity({
    failClosedDegradation: failClosedRestorationContinuityDegrading,
    collapseSensitive: collapseSensitiveRestorationEscalation,
    recursiveDrift: recursiveRestorationDriftDetected,
    entropyRecurrence: restorationEntropyRecurrenceDetected,
    containmentRisk: restorationContainmentRiskDetected,
    desynchronization: restorationDesynchronizationDetected,
    fragmentation: restorationFragmentationDetected,
    restorationAuditTraceIntegrityWeakness,
    restorationHandoffDurabilityWeakness,
    restorationExplainabilityDecay,
    replayToRestorationContinuityWeakness,
    restorationTraceContinuityWeakness,
    continuationRequired,
    severityScore: restorationContinuitySeverityScore,
  });

  const primaryRestorationContinuityDriver = selectPrimaryDriver({
    "restoration trace continuity weakness": inverseHealthScore(restorationTraceContinuityScore),
    "replay-to-restoration continuity weakness": inverseHealthScore(replayToRestorationContinuityScore),
    "restoration audit-trace integrity weakness": inverseHealthScore(restorationAuditTraceIntegrityScore),
    "restoration explainability survivability decay": inverseHealthScore(restorationExplainabilitySurvivabilityScore),
    "restoration handoff durability weakness": inverseHealthScore(restorationHandoffDurabilityScore),
    "fail-closed restoration continuity degradation": inverseHealthScore(failClosedRestorationContinuityScore),
    "restoration fragmentation risk": restorationFragmentationRiskScore,
    "restoration desynchronization risk": restorationDesynchronizationRiskScore,
    "recursive restoration drift": recursiveRestorationDriftRiskScore,
    "restoration containment risk": inverseHealthScore(restorationContainmentIntegrityScore),
    "restoration entropy recurrence risk": restorationEntropyRecurrenceRiskScore,
    "restoration reevaluation pressure": restorationReevaluationPressureScore,
  });

  return {
    restorationTraceContinuityLevel,
    restorationContinuitySeverityScore,
    restorationContinuityExposureLevel,
    restorationReevaluationRequirementLevel,
    longHorizonRestorationContinuity,
    continuationRequired,
    failClosedRestorationContinuityDegrading,
    restorationFragmentationDetected,
    restorationDesynchronizationDetected,
    recursiveRestorationDriftDetected,
    restorationContainmentRiskDetected,
    restorationEntropyRecurrenceDetected,
    collapseSensitiveRestorationEscalation,
    warningCodes,
    explainability: {
      primaryRestorationContinuityDriver,
      dominantRestorationEscalationReason:
        warningCodes[0] ?? "No deterministic archival replay restoration continuity escalation threshold was crossed.",
      containmentRestorationAssessment: restorationContainmentRiskDetected
        ? "Restoration containment is not strong enough to preserve restoration trace continuity under handoff pressure."
        : "Restoration containment remains trace-continuity preserving for the current caller-supplied governance context.",
      longHorizonRestorationContinuityAssessment:
        longHorizonRestorationContinuity === "durable"
          ? "Long-horizon restoration trace continuity is durable under the current inputs. Restoration continuity does not imply permanent governance recovery."
          : `Long-horizon restoration trace continuity is ${longHorizonRestorationContinuity} under the current inputs. Replay persistence does not guarantee restoration continuity.`,
      failClosedRestorationContinuityAssessment: failClosedRestorationContinuityDegrading
        ? "Fail-closed restoration continuity is degrading and overrides optimistic restoration assumptions."
        : "Fail-closed restoration continuity remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
