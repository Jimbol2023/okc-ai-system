export type CountyGovernanceDoctrineClosureReadinessLevel =
  | "durable_doctrine_closure_readiness"
  | "bounded_doctrine_closure_readiness"
  | "doctrine_closure_continuation_required"
  | "doctrine_closure_degrading"
  | "doctrine_closure_unstable"
  | "fail_closed_doctrine_closure_degradation"
  | "collapse_sensitive_doctrine_closure";

export type CountyGovernanceClosureReadinessExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceClosureReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonClosureReadiness =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_closable";

export type CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessWarningCode =
  | "DOCTRINE_CLOSURE_READINESS_WEAKNESS"
  | "CLOSURE_AUDIT_TRUST_DURABILITY_WEAKNESS"
  | "FINALIZED_CLOSURE_EXPLAINABILITY_DECAY"
  | "CLOSURE_CONTINUITY_SURVIVABILITY_WEAKNESS"
  | "FAIL_CLOSED_CLOSURE_READINESS_DEGRADATION"
  | "CLOSURE_FRAGMENTATION_RISK"
  | "CLOSURE_DESYNCHRONIZATION_RISK"
  | "RECURSIVE_CLOSURE_DRIFT"
  | "CLOSURE_CONTAINMENT_RISK"
  | "AUDIT_PRESERVATION_DURABILITY_WEAKNESS"
  | "CLOSURE_ENTROPY_RECURRENCE_RISK"
  | "CLOSURE_REEVALUATION_REQUIRED"
  | "CLOSURE_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_DOCTRINE_CLOSURE";

export type CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessInput = {
  doctrineClosureReadinessScore: number;
  closureAuditTrustDurabilityScore: number;
  finalizedClosureExplainabilityScore: number;
  closureContinuitySurvivabilityScore: number;
  failClosedClosureReadinessScore: number;
  closureFragmentationRiskScore: number;
  closureDesynchronizationRiskScore: number;
  recursiveClosureDriftRiskScore: number;
  closureContainmentIntegrityScore: number;
  auditPreservationDurabilityScore: number;
  closureEntropyRecurrenceRiskScore: number;
  closureReevaluationPressureScore: number;
};

export type CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessResult = {
  doctrineClosureReadinessLevel: CountyGovernanceDoctrineClosureReadinessLevel;
  closureReadinessSeverityScore: number;
  closureReadinessExposureLevel: CountyGovernanceClosureReadinessExposureLevel;
  closureReevaluationRequirementLevel: CountyGovernanceClosureReevaluationRequirementLevel;
  longHorizonClosureReadiness: CountyGovernanceLongHorizonClosureReadiness;
  continuationRequired: boolean;
  failClosedClosureReadinessDegrading: boolean;
  closureFragmentationDetected: boolean;
  closureDesynchronizationDetected: boolean;
  recursiveClosureDriftDetected: boolean;
  closureContainmentRiskDetected: boolean;
  closureEntropyRecurrenceDetected: boolean;
  collapseSensitiveClosureEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryClosureReadinessDriver: string;
    dominantClosureEscalationReason: string;
    containmentClosureAssessment: string;
    longHorizonClosureReadinessAssessment: string;
    failClosedClosureReadinessAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessWarningCode[] = [
  "FAIL_CLOSED_CLOSURE_READINESS_DEGRADATION",
  "COLLAPSE_SENSITIVE_DOCTRINE_CLOSURE",
  "RECURSIVE_CLOSURE_DRIFT",
  "CLOSURE_ENTROPY_RECURRENCE_RISK",
  "CLOSURE_CONTAINMENT_RISK",
  "CLOSURE_DESYNCHRONIZATION_RISK",
  "CLOSURE_FRAGMENTATION_RISK",
  "CLOSURE_AUDIT_TRUST_DURABILITY_WEAKNESS",
  "AUDIT_PRESERVATION_DURABILITY_WEAKNESS",
  "FINALIZED_CLOSURE_EXPLAINABILITY_DECAY",
  "CLOSURE_CONTINUITY_SURVIVABILITY_WEAKNESS",
  "DOCTRINE_CLOSURE_READINESS_WEAKNESS",
  "CLOSURE_REEVALUATION_REQUIRED",
  "CLOSURE_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceClosureReadinessExposureLevel {
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

function classifyReevaluation(score: number): CountyGovernanceClosureReevaluationRequirementLevel {
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

function classifyLongHorizonClosureReadiness(params: {
  doctrineClosureReadinessScore: number;
  closureAuditTrustDurabilityScore: number;
  closureContinuitySurvivabilityScore: number;
  auditPreservationDurabilityScore: number;
  failClosedClosureReadinessScore: number;
  closureEntropyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonClosureReadiness {
  if (
    params.doctrineClosureReadinessScore < 35 ||
    params.closureAuditTrustDurabilityScore < 35 ||
    params.auditPreservationDurabilityScore < 35 ||
    params.failClosedClosureReadinessScore < 35 ||
    params.closureEntropyRecurrenceRiskScore >= 88
  ) {
    return "non_closable";
  }

  if (
    params.doctrineClosureReadinessScore < 55 ||
    params.closureAuditTrustDurabilityScore < 55 ||
    params.closureContinuitySurvivabilityScore < 55 ||
    params.auditPreservationDurabilityScore < 55 ||
    params.failClosedClosureReadinessScore < 55 ||
    params.closureEntropyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.doctrineClosureReadinessScore < 75 ||
    params.closureAuditTrustDurabilityScore < 75 ||
    params.closureContinuitySurvivabilityScore < 75 ||
    params.auditPreservationDurabilityScore < 75 ||
    params.closureEntropyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.doctrineClosureReadinessScore < 88 ||
    params.closureAuditTrustDurabilityScore < 88 ||
    params.closureContinuitySurvivabilityScore < 88 ||
    params.auditPreservationDurabilityScore < 88 ||
    params.closureEntropyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  doctrineClosureReadinessWeakness: boolean;
  closureAuditTrustWeakness: boolean;
  finalizedClosureExplainabilityDecay: boolean;
  closureContinuitySurvivabilityWeakness: boolean;
  failClosedDegradation: boolean;
  fragmentation: boolean;
  desynchronization: boolean;
  recursiveDrift: boolean;
  containmentRisk: boolean;
  auditPreservationWeakness: boolean;
  entropyRecurrence: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessWarningCode[] {
  const warnings = new Set<CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessWarningCode>();

  if (params.doctrineClosureReadinessWeakness) {
    warnings.add("DOCTRINE_CLOSURE_READINESS_WEAKNESS");
  }

  if (params.closureAuditTrustWeakness) {
    warnings.add("CLOSURE_AUDIT_TRUST_DURABILITY_WEAKNESS");
  }

  if (params.finalizedClosureExplainabilityDecay) {
    warnings.add("FINALIZED_CLOSURE_EXPLAINABILITY_DECAY");
  }

  if (params.closureContinuitySurvivabilityWeakness) {
    warnings.add("CLOSURE_CONTINUITY_SURVIVABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_CLOSURE_READINESS_DEGRADATION");
  }

  if (params.fragmentation) {
    warnings.add("CLOSURE_FRAGMENTATION_RISK");
  }

  if (params.desynchronization) {
    warnings.add("CLOSURE_DESYNCHRONIZATION_RISK");
  }

  if (params.recursiveDrift) {
    warnings.add("RECURSIVE_CLOSURE_DRIFT");
  }

  if (params.containmentRisk) {
    warnings.add("CLOSURE_CONTAINMENT_RISK");
  }

  if (params.auditPreservationWeakness) {
    warnings.add("AUDIT_PRESERVATION_DURABILITY_WEAKNESS");
  }

  if (params.entropyRecurrence) {
    warnings.add("CLOSURE_ENTROPY_RECURRENCE_RISK");
  }

  if (params.reevaluationRequired) {
    warnings.add("CLOSURE_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("CLOSURE_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_DOCTRINE_CLOSURE");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["finalization audit preservation doctrine closure readiness", 0],
  )[0];
}

function classifyDoctrineClosureReadiness(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDrift: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  desynchronization: boolean;
  fragmentation: boolean;
  closureAuditTrustWeakness: boolean;
  auditPreservationWeakness: boolean;
  finalizedClosureExplainabilityDecay: boolean;
  closureContinuitySurvivabilityWeakness: boolean;
  doctrineClosureReadinessWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceDoctrineClosureReadinessLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_doctrine_closure_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_doctrine_closure";
  }

  if (
    params.recursiveDrift ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.desynchronization ||
    params.fragmentation
  ) {
    return "doctrine_closure_unstable";
  }

  if (
    params.closureAuditTrustWeakness ||
    params.auditPreservationWeakness ||
    params.finalizedClosureExplainabilityDecay ||
    params.closureContinuitySurvivabilityWeakness ||
    params.doctrineClosureReadinessWeakness
  ) {
    return "doctrine_closure_degrading";
  }

  if (params.continuationRequired) {
    return "doctrine_closure_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_doctrine_closure_readiness";
  }

  return "durable_doctrine_closure_readiness";
}

export function evaluateCountyGovernanceFinalizationAuditPreservationDoctrineClosureReadiness(
  input: CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessInput,
): CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessResult {
  const doctrineClosureReadinessScore = clampScore(input.doctrineClosureReadinessScore);
  const closureAuditTrustDurabilityScore = clampScore(input.closureAuditTrustDurabilityScore);
  const finalizedClosureExplainabilityScore = clampScore(input.finalizedClosureExplainabilityScore);
  const closureContinuitySurvivabilityScore = clampScore(input.closureContinuitySurvivabilityScore);
  const failClosedClosureReadinessScore = clampScore(input.failClosedClosureReadinessScore);
  const closureFragmentationRiskScore = clampScore(input.closureFragmentationRiskScore);
  const closureDesynchronizationRiskScore = clampScore(input.closureDesynchronizationRiskScore);
  const recursiveClosureDriftRiskScore = clampScore(input.recursiveClosureDriftRiskScore);
  const closureContainmentIntegrityScore = clampScore(input.closureContainmentIntegrityScore);
  const auditPreservationDurabilityScore = clampScore(input.auditPreservationDurabilityScore);
  const closureEntropyRecurrenceRiskScore = clampScore(input.closureEntropyRecurrenceRiskScore);
  const closureReevaluationPressureScore = clampScore(input.closureReevaluationPressureScore);

  const failClosedClosureReadinessDegrading = failClosedClosureReadinessScore < 55;
  const closureFragmentationDetected = closureFragmentationRiskScore >= 45;
  const closureDesynchronizationDetected = closureDesynchronizationRiskScore >= 45;
  const recursiveClosureDriftDetected = recursiveClosureDriftRiskScore >= 45;
  const closureContainmentRiskDetected = closureContainmentIntegrityScore < 55;
  const closureEntropyRecurrenceDetected = closureEntropyRecurrenceRiskScore >= 45;
  const closureAuditTrustWeakness = closureAuditTrustDurabilityScore < 55;
  const auditPreservationWeakness = auditPreservationDurabilityScore < 55;
  const finalizedClosureExplainabilityDecay = finalizedClosureExplainabilityScore < 55;
  const closureContinuitySurvivabilityWeakness = closureContinuitySurvivabilityScore < 55;
  const doctrineClosureReadinessWeakness = doctrineClosureReadinessScore < 75;
  const collapseSensitiveClosureEscalation =
    (recursiveClosureDriftRiskScore >= 88 ||
      closureEntropyRecurrenceRiskScore >= 88 ||
      closureDesynchronizationRiskScore >= 88 ||
      closureFragmentationRiskScore >= 88) &&
    (failClosedClosureReadinessScore < 65 || closureAuditTrustDurabilityScore < 55);
  const reevaluationRequired =
    closureReevaluationPressureScore >= 58 ||
    closureAuditTrustWeakness ||
    auditPreservationWeakness ||
    finalizedClosureExplainabilityDecay ||
    closureContinuitySurvivabilityWeakness ||
    closureFragmentationDetected ||
    closureDesynchronizationDetected;

  const closureReadinessSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(doctrineClosureReadinessScore),
      inverseHealthScore(closureAuditTrustDurabilityScore),
      inverseHealthScore(finalizedClosureExplainabilityScore),
      inverseHealthScore(closureContinuitySurvivabilityScore),
      inverseHealthScore(failClosedClosureReadinessScore),
      closureFragmentationRiskScore,
      closureDesynchronizationRiskScore,
      recursiveClosureDriftRiskScore,
      inverseHealthScore(closureContainmentIntegrityScore),
      inverseHealthScore(auditPreservationDurabilityScore),
      closureEntropyRecurrenceRiskScore,
      closureReevaluationPressureScore,
    ]),
  );

  const longHorizonClosureReadiness = classifyLongHorizonClosureReadiness({
    doctrineClosureReadinessScore,
    closureAuditTrustDurabilityScore,
    closureContinuitySurvivabilityScore,
    auditPreservationDurabilityScore,
    failClosedClosureReadinessScore,
    closureEntropyRecurrenceRiskScore,
  });
  const closureReadinessExposureLevel = classifyExposure(closureReadinessSeverityScore);
  const closureReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      closureReadinessSeverityScore,
      closureReevaluationPressureScore,
      closureEntropyRecurrenceRiskScore,
      recursiveClosureDriftRiskScore,
      closureDesynchronizationRiskScore,
      closureFragmentationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedClosureReadinessDegrading &&
    !collapseSensitiveClosureEscalation &&
    !recursiveClosureDriftDetected &&
    !closureEntropyRecurrenceDetected &&
    !closureContainmentRiskDetected &&
    !closureDesynchronizationDetected &&
    !closureFragmentationDetected &&
    closureReadinessSeverityScore >= 35 &&
    closureReadinessSeverityScore < 72;

  const warningCodes = buildWarnings({
    doctrineClosureReadinessWeakness,
    closureAuditTrustWeakness,
    finalizedClosureExplainabilityDecay,
    closureContinuitySurvivabilityWeakness,
    failClosedDegradation: failClosedClosureReadinessDegrading,
    fragmentation: closureFragmentationDetected,
    desynchronization: closureDesynchronizationDetected,
    recursiveDrift: recursiveClosureDriftDetected,
    containmentRisk: closureContainmentRiskDetected,
    auditPreservationWeakness,
    entropyRecurrence: closureEntropyRecurrenceDetected,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveClosureEscalation,
  });

  const doctrineClosureReadinessLevel = classifyDoctrineClosureReadiness({
    failClosedDegradation: failClosedClosureReadinessDegrading,
    collapseSensitive: collapseSensitiveClosureEscalation,
    recursiveDrift: recursiveClosureDriftDetected,
    entropyRecurrence: closureEntropyRecurrenceDetected,
    containmentRisk: closureContainmentRiskDetected,
    desynchronization: closureDesynchronizationDetected,
    fragmentation: closureFragmentationDetected,
    closureAuditTrustWeakness,
    auditPreservationWeakness,
    finalizedClosureExplainabilityDecay,
    closureContinuitySurvivabilityWeakness,
    doctrineClosureReadinessWeakness,
    continuationRequired,
    severityScore: closureReadinessSeverityScore,
  });

  const primaryClosureReadinessDriver = selectPrimaryDriver({
    "doctrine closure readiness weakness": inverseHealthScore(doctrineClosureReadinessScore),
    "closure audit trust durability weakness": inverseHealthScore(closureAuditTrustDurabilityScore),
    "finalized closure explainability decay": inverseHealthScore(finalizedClosureExplainabilityScore),
    "closure continuity survivability weakness": inverseHealthScore(closureContinuitySurvivabilityScore),
    "fail-closed closure readiness degradation": inverseHealthScore(failClosedClosureReadinessScore),
    "closure fragmentation risk": closureFragmentationRiskScore,
    "closure desynchronization risk": closureDesynchronizationRiskScore,
    "recursive closure drift": recursiveClosureDriftRiskScore,
    "closure containment risk": inverseHealthScore(closureContainmentIntegrityScore),
    "audit preservation durability weakness": inverseHealthScore(auditPreservationDurabilityScore),
    "closure entropy recurrence risk": closureEntropyRecurrenceRiskScore,
    "closure reevaluation pressure": closureReevaluationPressureScore,
  });

  return {
    doctrineClosureReadinessLevel,
    closureReadinessSeverityScore,
    closureReadinessExposureLevel,
    closureReevaluationRequirementLevel,
    longHorizonClosureReadiness,
    continuationRequired,
    failClosedClosureReadinessDegrading,
    closureFragmentationDetected,
    closureDesynchronizationDetected,
    recursiveClosureDriftDetected,
    closureContainmentRiskDetected,
    closureEntropyRecurrenceDetected,
    collapseSensitiveClosureEscalation,
    warningCodes,
    explainability: {
      primaryClosureReadinessDriver,
      dominantClosureEscalationReason:
        warningCodes[0] ?? "No deterministic doctrine closure readiness escalation threshold was crossed.",
      containmentClosureAssessment: closureContainmentRiskDetected
        ? "Closure containment is not strong enough to preserve audit preservation survivability under doctrine closure pressure."
        : "Closure containment remains doctrine-closure preserving for the current caller-supplied governance context.",
      longHorizonClosureReadinessAssessment:
        longHorizonClosureReadiness === "durable"
          ? "Long-horizon doctrine closure readiness is durable under the current inputs. Doctrine closure readiness does not imply irreversible governance continuity."
          : `Long-horizon doctrine closure readiness is ${longHorizonClosureReadiness} under the current inputs. Memory continuity finalization does not guarantee doctrine closure readiness.`,
      failClosedClosureReadinessAssessment: failClosedClosureReadinessDegrading
        ? "Fail-closed closure readiness is degrading and overrides optimistic doctrine closure assumptions."
        : "Fail-closed closure readiness remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
