export type CountyGovernanceRestorationForecastContinuityResilienceIntegrityLevel =
  | "durable_forecast_continuity_resilience"
  | "bounded_forecast_continuity_resilience"
  | "forecast_continuity_resilience_continuation_required"
  | "forecast_continuity_resilience_degrading"
  | "forecast_continuity_resilience_unstable"
  | "fail_closed_forecast_resilience_degradation"
  | "collapse_sensitive_forecast_resilience";

export type CountyGovernanceRestorationForecastContinuityResilienceExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRestorationForecastContinuityResilienceReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceRestorationLongHorizonResilience =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_resilient";

export type CountyGovernanceRestorationForecastContinuityResilienceIntegrityWarningCode =
  | "FORECAST_CONTINUITY_RESILIENCE_WEAKNESS"
  | "LONG_HORIZON_RESILIENCE_DURABILITY_WEAKNESS"
  | "FAIL_CLOSED_FORECAST_RESILIENCE_DEGRADATION"
  | "RECURSIVE_CONTINUITY_RESILIENCE_DEGRADATION"
  | "ROLLBACK_CONTINUITY_RESILIENCE_WEAKNESS"
  | "PROJECTED_CONTAINMENT_RESILIENCE_RISK"
  | "DOCTRINE_RESILIENCE_DRIFT"
  | "INSTITUTIONAL_RESILIENCE_DURABILITY_RISK"
  | "ENTROPY_RESILIENCE_ACCELERATION"
  | "LINEAGE_RESILIENCE_PRESERVATION_WEAKNESS"
  | "EXPLAINABILITY_RESILIENCE_DECAY"
  | "FORECAST_RESILIENCE_REEVALUATION_REQUIRED"
  | "FORECAST_RESILIENCE_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_FORECAST_RESILIENCE";

export type CountyGovernanceRestorationForecastContinuityResilienceIntegrityInput = {
  forecastContinuityResilienceIntegrityScore: number;
  longHorizonResilienceDurabilityScore: number;
  failClosedResiliencePreservationScore: number;
  recursiveContinuityResilienceRiskScore: number;
  rollbackContinuityResilienceScore: number;
  projectedContainmentResilienceScore: number;
  doctrineResilienceStabilityScore: number;
  institutionalResilienceDurabilityScore: number;
  entropyResilienceAccelerationScore: number;
  lineageResiliencePreservationScore: number;
  explainabilityResilienceDurabilityScore: number;
  resilienceReevaluationPressureScore: number;
};

export type CountyGovernanceRestorationForecastContinuityResilienceIntegrityResult = {
  resilienceIntegrityLevel: CountyGovernanceRestorationForecastContinuityResilienceIntegrityLevel;
  resilienceSeverityScore: number;
  resilienceExposureLevel: CountyGovernanceRestorationForecastContinuityResilienceExposureLevel;
  resilienceReevaluationRequirementLevel: CountyGovernanceRestorationForecastContinuityResilienceReevaluationRequirementLevel;
  longHorizonResilience: CountyGovernanceRestorationLongHorizonResilience;
  continuationRequired: boolean;
  failClosedResilienceDegrading: boolean;
  recursiveResilienceDegradationDetected: boolean;
  rollbackResilienceWeaknessDetected: boolean;
  containmentResilienceRiskDetected: boolean;
  entropyResilienceAccelerationDetected: boolean;
  collapseSensitiveResilienceEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryResilienceDriver: string;
    dominantResilienceEscalationReason: string;
    containmentResilienceAssessment: string;
    longHorizonResilienceAssessment: string;
    failClosedResilienceAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceRestorationForecastContinuityResilienceIntegrityWarningCode[] = [
  "FAIL_CLOSED_FORECAST_RESILIENCE_DEGRADATION",
  "COLLAPSE_SENSITIVE_FORECAST_RESILIENCE",
  "RECURSIVE_CONTINUITY_RESILIENCE_DEGRADATION",
  "ENTROPY_RESILIENCE_ACCELERATION",
  "PROJECTED_CONTAINMENT_RESILIENCE_RISK",
  "ROLLBACK_CONTINUITY_RESILIENCE_WEAKNESS",
  "DOCTRINE_RESILIENCE_DRIFT",
  "INSTITUTIONAL_RESILIENCE_DURABILITY_RISK",
  "LONG_HORIZON_RESILIENCE_DURABILITY_WEAKNESS",
  "LINEAGE_RESILIENCE_PRESERVATION_WEAKNESS",
  "EXPLAINABILITY_RESILIENCE_DECAY",
  "FORECAST_CONTINUITY_RESILIENCE_WEAKNESS",
  "FORECAST_RESILIENCE_REEVALUATION_REQUIRED",
  "FORECAST_RESILIENCE_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceRestorationForecastContinuityResilienceExposureLevel {
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
): CountyGovernanceRestorationForecastContinuityResilienceReevaluationRequirementLevel {
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

function classifyLongHorizonResilience(params: {
  forecastContinuityResilienceIntegrityScore: number;
  longHorizonResilienceDurabilityScore: number;
  failClosedResiliencePreservationScore: number;
  institutionalResilienceDurabilityScore: number;
  entropyResilienceAccelerationScore: number;
}): CountyGovernanceRestorationLongHorizonResilience {
  if (
    params.forecastContinuityResilienceIntegrityScore < 35 ||
    params.longHorizonResilienceDurabilityScore < 35 ||
    params.failClosedResiliencePreservationScore < 35 ||
    params.entropyResilienceAccelerationScore >= 88
  ) {
    return "non_resilient";
  }

  if (
    params.forecastContinuityResilienceIntegrityScore < 55 ||
    params.longHorizonResilienceDurabilityScore < 55 ||
    params.failClosedResiliencePreservationScore < 55 ||
    params.institutionalResilienceDurabilityScore < 55 ||
    params.entropyResilienceAccelerationScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.forecastContinuityResilienceIntegrityScore < 75 ||
    params.longHorizonResilienceDurabilityScore < 75 ||
    params.institutionalResilienceDurabilityScore < 75 ||
    params.entropyResilienceAccelerationScore >= 50
  ) {
    return "strained";
  }

  if (
    params.forecastContinuityResilienceIntegrityScore < 88 ||
    params.longHorizonResilienceDurabilityScore < 88 ||
    params.institutionalResilienceDurabilityScore < 88 ||
    params.entropyResilienceAccelerationScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  continuityResilienceWeakness: boolean;
  longHorizonWeakness: boolean;
  failClosedDegradation: boolean;
  recursiveDegradation: boolean;
  rollbackWeakness: boolean;
  containmentRisk: boolean;
  doctrineDrift: boolean;
  institutionalRisk: boolean;
  entropyAcceleration: boolean;
  lineageWeakness: boolean;
  explainabilityDecay: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceRestorationForecastContinuityResilienceIntegrityWarningCode[] {
  const warnings = new Set<CountyGovernanceRestorationForecastContinuityResilienceIntegrityWarningCode>();

  if (params.continuityResilienceWeakness) {
    warnings.add("FORECAST_CONTINUITY_RESILIENCE_WEAKNESS");
  }

  if (params.longHorizonWeakness) {
    warnings.add("LONG_HORIZON_RESILIENCE_DURABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_FORECAST_RESILIENCE_DEGRADATION");
  }

  if (params.recursiveDegradation) {
    warnings.add("RECURSIVE_CONTINUITY_RESILIENCE_DEGRADATION");
  }

  if (params.rollbackWeakness) {
    warnings.add("ROLLBACK_CONTINUITY_RESILIENCE_WEAKNESS");
  }

  if (params.containmentRisk) {
    warnings.add("PROJECTED_CONTAINMENT_RESILIENCE_RISK");
  }

  if (params.doctrineDrift) {
    warnings.add("DOCTRINE_RESILIENCE_DRIFT");
  }

  if (params.institutionalRisk) {
    warnings.add("INSTITUTIONAL_RESILIENCE_DURABILITY_RISK");
  }

  if (params.entropyAcceleration) {
    warnings.add("ENTROPY_RESILIENCE_ACCELERATION");
  }

  if (params.lineageWeakness) {
    warnings.add("LINEAGE_RESILIENCE_PRESERVATION_WEAKNESS");
  }

  if (params.explainabilityDecay) {
    warnings.add("EXPLAINABILITY_RESILIENCE_DECAY");
  }

  if (params.reevaluationRequired) {
    warnings.add("FORECAST_RESILIENCE_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("FORECAST_RESILIENCE_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_FORECAST_RESILIENCE");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["forecast continuity resilience integrity", 0],
  )[0];
}

function classifyResilience(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDegradation: boolean;
  entropyAcceleration: boolean;
  containmentRisk: boolean;
  rollbackWeakness: boolean;
  doctrineDrift: boolean;
  institutionalRisk: boolean;
  longHorizonWeakness: boolean;
  lineageWeakness: boolean;
  explainabilityDecay: boolean;
  continuityResilienceWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceRestorationForecastContinuityResilienceIntegrityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_forecast_resilience_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_forecast_resilience";
  }

  if (params.recursiveDegradation || params.entropyAcceleration || params.containmentRisk) {
    return "forecast_continuity_resilience_unstable";
  }

  if (params.rollbackWeakness || params.doctrineDrift || params.institutionalRisk) {
    return "forecast_continuity_resilience_degrading";
  }

  if (
    params.longHorizonWeakness ||
    params.lineageWeakness ||
    params.explainabilityDecay ||
    params.continuityResilienceWeakness
  ) {
    return "forecast_continuity_resilience_degrading";
  }

  if (params.continuationRequired) {
    return "forecast_continuity_resilience_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_forecast_continuity_resilience";
  }

  return "durable_forecast_continuity_resilience";
}

export function evaluateCountyGovernanceRestorationForecastContinuityResilienceIntegrity(
  input: CountyGovernanceRestorationForecastContinuityResilienceIntegrityInput,
): CountyGovernanceRestorationForecastContinuityResilienceIntegrityResult {
  const forecastContinuityResilienceIntegrityScore = clampScore(input.forecastContinuityResilienceIntegrityScore);
  const longHorizonResilienceDurabilityScore = clampScore(input.longHorizonResilienceDurabilityScore);
  const failClosedResiliencePreservationScore = clampScore(input.failClosedResiliencePreservationScore);
  const recursiveContinuityResilienceRiskScore = clampScore(input.recursiveContinuityResilienceRiskScore);
  const rollbackContinuityResilienceScore = clampScore(input.rollbackContinuityResilienceScore);
  const projectedContainmentResilienceScore = clampScore(input.projectedContainmentResilienceScore);
  const doctrineResilienceStabilityScore = clampScore(input.doctrineResilienceStabilityScore);
  const institutionalResilienceDurabilityScore = clampScore(input.institutionalResilienceDurabilityScore);
  const entropyResilienceAccelerationScore = clampScore(input.entropyResilienceAccelerationScore);
  const lineageResiliencePreservationScore = clampScore(input.lineageResiliencePreservationScore);
  const explainabilityResilienceDurabilityScore = clampScore(input.explainabilityResilienceDurabilityScore);
  const resilienceReevaluationPressureScore = clampScore(input.resilienceReevaluationPressureScore);

  const failClosedResilienceDegrading = failClosedResiliencePreservationScore < 55;
  const collapseSensitiveResilienceEscalation =
    recursiveContinuityResilienceRiskScore >= 92 ||
    entropyResilienceAccelerationScore >= 92 ||
    (projectedContainmentResilienceScore < 35 &&
      (failClosedResiliencePreservationScore < 65 || longHorizonResilienceDurabilityScore < 55));
  const recursiveResilienceDegradationDetected =
    recursiveContinuityResilienceRiskScore >= 72 ||
    (recursiveContinuityResilienceRiskScore >= 58 && doctrineResilienceStabilityScore < 65);
  const entropyResilienceAccelerationDetected =
    entropyResilienceAccelerationScore >= 72 ||
    (entropyResilienceAccelerationScore >= 58 && longHorizonResilienceDurabilityScore < 65);
  const containmentResilienceRiskDetected =
    projectedContainmentResilienceScore < 55 ||
    (projectedContainmentResilienceScore < 65 && recursiveContinuityResilienceRiskScore >= 58);
  const rollbackResilienceWeaknessDetected = rollbackContinuityResilienceScore < 55;
  const doctrineResilienceDrift = doctrineResilienceStabilityScore < 65;
  const institutionalResilienceDurabilityRisk = institutionalResilienceDurabilityScore < 65;
  const longHorizonResilienceDurabilityWeakness = longHorizonResilienceDurabilityScore < 65;
  const lineageResiliencePreservationWeakness = lineageResiliencePreservationScore < 65;
  const explainabilityResilienceDecay = explainabilityResilienceDurabilityScore < 65;
  const continuityResilienceWeakness = forecastContinuityResilienceIntegrityScore < 75;
  const reevaluationRequired =
    resilienceReevaluationPressureScore >= 58 ||
    longHorizonResilienceDurabilityWeakness ||
    lineageResiliencePreservationWeakness ||
    explainabilityResilienceDecay ||
    doctrineResilienceDrift ||
    institutionalResilienceDurabilityRisk;

  const resilienceSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(forecastContinuityResilienceIntegrityScore),
      inverseHealthScore(longHorizonResilienceDurabilityScore),
      inverseHealthScore(failClosedResiliencePreservationScore),
      recursiveContinuityResilienceRiskScore,
      inverseHealthScore(rollbackContinuityResilienceScore),
      inverseHealthScore(projectedContainmentResilienceScore),
      inverseHealthScore(doctrineResilienceStabilityScore),
      inverseHealthScore(institutionalResilienceDurabilityScore),
      entropyResilienceAccelerationScore,
      inverseHealthScore(lineageResiliencePreservationScore),
      inverseHealthScore(explainabilityResilienceDurabilityScore),
      resilienceReevaluationPressureScore,
    ]),
  );

  const longHorizonResilience = classifyLongHorizonResilience({
    forecastContinuityResilienceIntegrityScore,
    longHorizonResilienceDurabilityScore,
    failClosedResiliencePreservationScore,
    institutionalResilienceDurabilityScore,
    entropyResilienceAccelerationScore,
  });
  const resilienceExposureLevel = classifyExposure(resilienceSeverityScore);
  const resilienceReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      resilienceSeverityScore,
      resilienceReevaluationPressureScore,
      entropyResilienceAccelerationScore,
      recursiveContinuityResilienceRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedResilienceDegrading &&
    !collapseSensitiveResilienceEscalation &&
    !recursiveResilienceDegradationDetected &&
    !entropyResilienceAccelerationDetected &&
    !containmentResilienceRiskDetected &&
    resilienceSeverityScore >= 35 &&
    resilienceSeverityScore < 72;

  const warningCodes = buildWarnings({
    continuityResilienceWeakness,
    longHorizonWeakness: longHorizonResilienceDurabilityWeakness,
    failClosedDegradation: failClosedResilienceDegrading,
    recursiveDegradation: recursiveResilienceDegradationDetected,
    rollbackWeakness: rollbackResilienceWeaknessDetected,
    containmentRisk: containmentResilienceRiskDetected,
    doctrineDrift: doctrineResilienceDrift,
    institutionalRisk: institutionalResilienceDurabilityRisk,
    entropyAcceleration: entropyResilienceAccelerationDetected,
    lineageWeakness: lineageResiliencePreservationWeakness,
    explainabilityDecay: explainabilityResilienceDecay,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveResilienceEscalation,
  });

  const resilienceIntegrityLevel = classifyResilience({
    failClosedDegradation: failClosedResilienceDegrading,
    collapseSensitive: collapseSensitiveResilienceEscalation,
    recursiveDegradation: recursiveResilienceDegradationDetected,
    entropyAcceleration: entropyResilienceAccelerationDetected,
    containmentRisk: containmentResilienceRiskDetected,
    rollbackWeakness: rollbackResilienceWeaknessDetected,
    doctrineDrift: doctrineResilienceDrift,
    institutionalRisk: institutionalResilienceDurabilityRisk,
    longHorizonWeakness: longHorizonResilienceDurabilityWeakness,
    lineageWeakness: lineageResiliencePreservationWeakness,
    explainabilityDecay: explainabilityResilienceDecay,
    continuityResilienceWeakness,
    continuationRequired,
    severityScore: resilienceSeverityScore,
  });

  const primaryResilienceDriver = selectPrimaryDriver({
    "forecast continuity resilience weakness": inverseHealthScore(forecastContinuityResilienceIntegrityScore),
    "long-horizon resilience durability weakness": inverseHealthScore(longHorizonResilienceDurabilityScore),
    "fail-closed resilience degradation": inverseHealthScore(failClosedResiliencePreservationScore),
    "recursive continuity resilience degradation": recursiveContinuityResilienceRiskScore,
    "rollback continuity resilience weakness": inverseHealthScore(rollbackContinuityResilienceScore),
    "projected containment resilience risk": inverseHealthScore(projectedContainmentResilienceScore),
    "doctrine resilience drift": inverseHealthScore(doctrineResilienceStabilityScore),
    "institutional resilience durability risk": inverseHealthScore(institutionalResilienceDurabilityScore),
    "entropy resilience acceleration": entropyResilienceAccelerationScore,
    "lineage resilience preservation weakness": inverseHealthScore(lineageResiliencePreservationScore),
    "explainability resilience decay": inverseHealthScore(explainabilityResilienceDurabilityScore),
    "resilience reevaluation pressure": resilienceReevaluationPressureScore,
  });

  return {
    resilienceIntegrityLevel,
    resilienceSeverityScore,
    resilienceExposureLevel,
    resilienceReevaluationRequirementLevel,
    longHorizonResilience,
    continuationRequired,
    failClosedResilienceDegrading,
    recursiveResilienceDegradationDetected,
    rollbackResilienceWeaknessDetected,
    containmentResilienceRiskDetected,
    entropyResilienceAccelerationDetected,
    collapseSensitiveResilienceEscalation,
    warningCodes,
    explainability: {
      primaryResilienceDriver,
      dominantResilienceEscalationReason:
        warningCodes[0] ?? "No deterministic forecast continuity resilience escalation threshold was crossed.",
      containmentResilienceAssessment: containmentResilienceRiskDetected
        ? "Projected containment is not strong enough to preserve resilience under repeated continuity stress."
        : "Projected containment remains resilience-preserving for the current caller-supplied forecast context.",
      longHorizonResilienceAssessment:
        longHorizonResilience === "durable"
          ? "Long-horizon forecast continuity resilience is durable under the current inputs."
          : `Long-horizon forecast continuity resilience is ${longHorizonResilience} under the current inputs.`,
      failClosedResilienceAssessment: failClosedResilienceDegrading
        ? "Fail-closed resilience preservation is degrading and overrides optimistic resilience assumptions."
        : "Fail-closed resilience preservation remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
