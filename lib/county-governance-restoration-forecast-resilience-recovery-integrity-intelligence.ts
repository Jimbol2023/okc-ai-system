export type CountyGovernanceRestorationForecastResilienceRecoveryIntegrityLevel =
  | "durable_forecast_resilience_recovery"
  | "bounded_forecast_resilience_recovery"
  | "forecast_resilience_recovery_continuation_required"
  | "forecast_resilience_recovery_degrading"
  | "forecast_resilience_recovery_unstable"
  | "fail_closed_forecast_recovery_degradation"
  | "collapse_sensitive_forecast_recovery";

export type CountyGovernanceRestorationForecastResilienceRecoveryExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRestorationForecastResilienceRecoveryReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceRestorationLongHorizonRecovery =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_recoverable";

export type CountyGovernanceRestorationForecastResilienceRecoveryIntegrityWarningCode =
  | "FORECAST_RESILIENCE_RECOVERY_WEAKNESS"
  | "LONG_HORIZON_RECOVERY_DURABILITY_WEAKNESS"
  | "FAIL_CLOSED_FORECAST_RECOVERY_DEGRADATION"
  | "RECURSIVE_RESILIENCE_RECOVERY_DEGRADATION"
  | "ROLLBACK_RECOVERY_WEAKNESS"
  | "PROJECTED_CONTAINMENT_RECOVERY_RISK"
  | "DOCTRINE_RECOVERY_DRIFT"
  | "INSTITUTIONAL_RECOVERY_DURABILITY_RISK"
  | "ENTROPY_RECOVERY_ACCELERATION"
  | "LINEAGE_RECOVERY_PRESERVATION_WEAKNESS"
  | "EXPLAINABILITY_RECOVERY_DECAY"
  | "FORECAST_RECOVERY_REEVALUATION_REQUIRED"
  | "FORECAST_RECOVERY_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_FORECAST_RECOVERY";

export type CountyGovernanceRestorationForecastResilienceRecoveryIntegrityInput = {
  forecastResilienceRecoveryIntegrityScore: number;
  longHorizonRecoveryDurabilityScore: number;
  failClosedRecoveryPreservationScore: number;
  recursiveResilienceRecoveryDegradationRiskScore: number;
  rollbackRecoveryIntegrityScore: number;
  projectedContainmentRecoveryScore: number;
  doctrineRecoveryStabilityScore: number;
  institutionalRecoveryDurabilityScore: number;
  entropyRecoveryAccelerationScore: number;
  lineageRecoveryPreservationScore: number;
  explainabilityRecoveryDurabilityScore: number;
  recoveryReevaluationPressureScore: number;
};

export type CountyGovernanceRestorationForecastResilienceRecoveryIntegrityResult = {
  recoveryIntegrityLevel: CountyGovernanceRestorationForecastResilienceRecoveryIntegrityLevel;
  recoverySeverityScore: number;
  recoveryExposureLevel: CountyGovernanceRestorationForecastResilienceRecoveryExposureLevel;
  recoveryReevaluationRequirementLevel: CountyGovernanceRestorationForecastResilienceRecoveryReevaluationRequirementLevel;
  longHorizonRecovery: CountyGovernanceRestorationLongHorizonRecovery;
  continuationRequired: boolean;
  failClosedRecoveryDegrading: boolean;
  recursiveRecoveryDegradationDetected: boolean;
  rollbackRecoveryWeaknessDetected: boolean;
  containmentRecoveryRiskDetected: boolean;
  entropyRecoveryAccelerationDetected: boolean;
  collapseSensitiveRecoveryEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryRecoveryDriver: string;
    dominantRecoveryEscalationReason: string;
    containmentRecoveryAssessment: string;
    longHorizonRecoveryAssessment: string;
    failClosedRecoveryAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceRestorationForecastResilienceRecoveryIntegrityWarningCode[] = [
  "FAIL_CLOSED_FORECAST_RECOVERY_DEGRADATION",
  "COLLAPSE_SENSITIVE_FORECAST_RECOVERY",
  "RECURSIVE_RESILIENCE_RECOVERY_DEGRADATION",
  "ENTROPY_RECOVERY_ACCELERATION",
  "PROJECTED_CONTAINMENT_RECOVERY_RISK",
  "ROLLBACK_RECOVERY_WEAKNESS",
  "DOCTRINE_RECOVERY_DRIFT",
  "INSTITUTIONAL_RECOVERY_DURABILITY_RISK",
  "LONG_HORIZON_RECOVERY_DURABILITY_WEAKNESS",
  "LINEAGE_RECOVERY_PRESERVATION_WEAKNESS",
  "EXPLAINABILITY_RECOVERY_DECAY",
  "FORECAST_RESILIENCE_RECOVERY_WEAKNESS",
  "FORECAST_RECOVERY_REEVALUATION_REQUIRED",
  "FORECAST_RECOVERY_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceRestorationForecastResilienceRecoveryExposureLevel {
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
): CountyGovernanceRestorationForecastResilienceRecoveryReevaluationRequirementLevel {
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

function classifyLongHorizonRecovery(params: {
  forecastResilienceRecoveryIntegrityScore: number;
  longHorizonRecoveryDurabilityScore: number;
  failClosedRecoveryPreservationScore: number;
  institutionalRecoveryDurabilityScore: number;
  entropyRecoveryAccelerationScore: number;
}): CountyGovernanceRestorationLongHorizonRecovery {
  if (
    params.forecastResilienceRecoveryIntegrityScore < 35 ||
    params.longHorizonRecoveryDurabilityScore < 35 ||
    params.failClosedRecoveryPreservationScore < 35 ||
    params.entropyRecoveryAccelerationScore >= 88
  ) {
    return "non_recoverable";
  }

  if (
    params.forecastResilienceRecoveryIntegrityScore < 55 ||
    params.longHorizonRecoveryDurabilityScore < 55 ||
    params.failClosedRecoveryPreservationScore < 55 ||
    params.institutionalRecoveryDurabilityScore < 55 ||
    params.entropyRecoveryAccelerationScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.forecastResilienceRecoveryIntegrityScore < 75 ||
    params.longHorizonRecoveryDurabilityScore < 75 ||
    params.institutionalRecoveryDurabilityScore < 75 ||
    params.entropyRecoveryAccelerationScore >= 50
  ) {
    return "strained";
  }

  if (
    params.forecastResilienceRecoveryIntegrityScore < 88 ||
    params.longHorizonRecoveryDurabilityScore < 88 ||
    params.institutionalRecoveryDurabilityScore < 88 ||
    params.entropyRecoveryAccelerationScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  resilienceRecoveryWeakness: boolean;
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
}): CountyGovernanceRestorationForecastResilienceRecoveryIntegrityWarningCode[] {
  const warnings = new Set<CountyGovernanceRestorationForecastResilienceRecoveryIntegrityWarningCode>();

  if (params.resilienceRecoveryWeakness) {
    warnings.add("FORECAST_RESILIENCE_RECOVERY_WEAKNESS");
  }

  if (params.longHorizonWeakness) {
    warnings.add("LONG_HORIZON_RECOVERY_DURABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_FORECAST_RECOVERY_DEGRADATION");
  }

  if (params.recursiveDegradation) {
    warnings.add("RECURSIVE_RESILIENCE_RECOVERY_DEGRADATION");
  }

  if (params.rollbackWeakness) {
    warnings.add("ROLLBACK_RECOVERY_WEAKNESS");
  }

  if (params.containmentRisk) {
    warnings.add("PROJECTED_CONTAINMENT_RECOVERY_RISK");
  }

  if (params.doctrineDrift) {
    warnings.add("DOCTRINE_RECOVERY_DRIFT");
  }

  if (params.institutionalRisk) {
    warnings.add("INSTITUTIONAL_RECOVERY_DURABILITY_RISK");
  }

  if (params.entropyAcceleration) {
    warnings.add("ENTROPY_RECOVERY_ACCELERATION");
  }

  if (params.lineageWeakness) {
    warnings.add("LINEAGE_RECOVERY_PRESERVATION_WEAKNESS");
  }

  if (params.explainabilityDecay) {
    warnings.add("EXPLAINABILITY_RECOVERY_DECAY");
  }

  if (params.reevaluationRequired) {
    warnings.add("FORECAST_RECOVERY_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("FORECAST_RECOVERY_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_FORECAST_RECOVERY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["forecast resilience recovery integrity", 0],
  )[0];
}

function classifyRecovery(params: {
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
  resilienceRecoveryWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceRestorationForecastResilienceRecoveryIntegrityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_forecast_recovery_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_forecast_recovery";
  }

  if (params.recursiveDegradation || params.entropyAcceleration || params.containmentRisk) {
    return "forecast_resilience_recovery_unstable";
  }

  if (params.rollbackWeakness || params.doctrineDrift || params.institutionalRisk) {
    return "forecast_resilience_recovery_degrading";
  }

  if (
    params.longHorizonWeakness ||
    params.lineageWeakness ||
    params.explainabilityDecay ||
    params.resilienceRecoveryWeakness
  ) {
    return "forecast_resilience_recovery_degrading";
  }

  if (params.continuationRequired) {
    return "forecast_resilience_recovery_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_forecast_resilience_recovery";
  }

  return "durable_forecast_resilience_recovery";
}

export function evaluateCountyGovernanceRestorationForecastResilienceRecoveryIntegrity(
  input: CountyGovernanceRestorationForecastResilienceRecoveryIntegrityInput,
): CountyGovernanceRestorationForecastResilienceRecoveryIntegrityResult {
  const forecastResilienceRecoveryIntegrityScore = clampScore(input.forecastResilienceRecoveryIntegrityScore);
  const longHorizonRecoveryDurabilityScore = clampScore(input.longHorizonRecoveryDurabilityScore);
  const failClosedRecoveryPreservationScore = clampScore(input.failClosedRecoveryPreservationScore);
  const recursiveResilienceRecoveryDegradationRiskScore = clampScore(
    input.recursiveResilienceRecoveryDegradationRiskScore,
  );
  const rollbackRecoveryIntegrityScore = clampScore(input.rollbackRecoveryIntegrityScore);
  const projectedContainmentRecoveryScore = clampScore(input.projectedContainmentRecoveryScore);
  const doctrineRecoveryStabilityScore = clampScore(input.doctrineRecoveryStabilityScore);
  const institutionalRecoveryDurabilityScore = clampScore(input.institutionalRecoveryDurabilityScore);
  const entropyRecoveryAccelerationScore = clampScore(input.entropyRecoveryAccelerationScore);
  const lineageRecoveryPreservationScore = clampScore(input.lineageRecoveryPreservationScore);
  const explainabilityRecoveryDurabilityScore = clampScore(input.explainabilityRecoveryDurabilityScore);
  const recoveryReevaluationPressureScore = clampScore(input.recoveryReevaluationPressureScore);

  const failClosedRecoveryDegrading = failClosedRecoveryPreservationScore < 55;
  const collapseSensitiveRecoveryEscalation =
    recursiveResilienceRecoveryDegradationRiskScore >= 92 ||
    entropyRecoveryAccelerationScore >= 92 ||
    (projectedContainmentRecoveryScore < 35 &&
      (failClosedRecoveryPreservationScore < 65 || longHorizonRecoveryDurabilityScore < 55));
  const recursiveRecoveryDegradationDetected =
    recursiveResilienceRecoveryDegradationRiskScore >= 72 ||
    (recursiveResilienceRecoveryDegradationRiskScore >= 58 && doctrineRecoveryStabilityScore < 65);
  const entropyRecoveryAccelerationDetected =
    entropyRecoveryAccelerationScore >= 72 ||
    (entropyRecoveryAccelerationScore >= 58 && longHorizonRecoveryDurabilityScore < 65);
  const containmentRecoveryRiskDetected =
    projectedContainmentRecoveryScore < 55 ||
    (projectedContainmentRecoveryScore < 65 && recursiveResilienceRecoveryDegradationRiskScore >= 58);
  const rollbackRecoveryWeaknessDetected = rollbackRecoveryIntegrityScore < 55;
  const doctrineRecoveryDrift = doctrineRecoveryStabilityScore < 65;
  const institutionalRecoveryDurabilityRisk = institutionalRecoveryDurabilityScore < 65;
  const longHorizonRecoveryDurabilityWeakness = longHorizonRecoveryDurabilityScore < 65;
  const lineageRecoveryPreservationWeakness = lineageRecoveryPreservationScore < 65;
  const explainabilityRecoveryDecay = explainabilityRecoveryDurabilityScore < 65;
  const resilienceRecoveryWeakness = forecastResilienceRecoveryIntegrityScore < 75;
  const reevaluationRequired =
    recoveryReevaluationPressureScore >= 58 ||
    longHorizonRecoveryDurabilityWeakness ||
    lineageRecoveryPreservationWeakness ||
    explainabilityRecoveryDecay ||
    doctrineRecoveryDrift ||
    institutionalRecoveryDurabilityRisk;

  const recoverySeverityScore = clampScore(
    maxScore([
      inverseHealthScore(forecastResilienceRecoveryIntegrityScore),
      inverseHealthScore(longHorizonRecoveryDurabilityScore),
      inverseHealthScore(failClosedRecoveryPreservationScore),
      recursiveResilienceRecoveryDegradationRiskScore,
      inverseHealthScore(rollbackRecoveryIntegrityScore),
      inverseHealthScore(projectedContainmentRecoveryScore),
      inverseHealthScore(doctrineRecoveryStabilityScore),
      inverseHealthScore(institutionalRecoveryDurabilityScore),
      entropyRecoveryAccelerationScore,
      inverseHealthScore(lineageRecoveryPreservationScore),
      inverseHealthScore(explainabilityRecoveryDurabilityScore),
      recoveryReevaluationPressureScore,
    ]),
  );

  const longHorizonRecovery = classifyLongHorizonRecovery({
    forecastResilienceRecoveryIntegrityScore,
    longHorizonRecoveryDurabilityScore,
    failClosedRecoveryPreservationScore,
    institutionalRecoveryDurabilityScore,
    entropyRecoveryAccelerationScore,
  });
  const recoveryExposureLevel = classifyExposure(recoverySeverityScore);
  const recoveryReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      recoverySeverityScore,
      recoveryReevaluationPressureScore,
      entropyRecoveryAccelerationScore,
      recursiveResilienceRecoveryDegradationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedRecoveryDegrading &&
    !collapseSensitiveRecoveryEscalation &&
    !recursiveRecoveryDegradationDetected &&
    !entropyRecoveryAccelerationDetected &&
    !containmentRecoveryRiskDetected &&
    recoverySeverityScore >= 35 &&
    recoverySeverityScore < 72;

  const warningCodes = buildWarnings({
    resilienceRecoveryWeakness,
    longHorizonWeakness: longHorizonRecoveryDurabilityWeakness,
    failClosedDegradation: failClosedRecoveryDegrading,
    recursiveDegradation: recursiveRecoveryDegradationDetected,
    rollbackWeakness: rollbackRecoveryWeaknessDetected,
    containmentRisk: containmentRecoveryRiskDetected,
    doctrineDrift: doctrineRecoveryDrift,
    institutionalRisk: institutionalRecoveryDurabilityRisk,
    entropyAcceleration: entropyRecoveryAccelerationDetected,
    lineageWeakness: lineageRecoveryPreservationWeakness,
    explainabilityDecay: explainabilityRecoveryDecay,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveRecoveryEscalation,
  });

  const recoveryIntegrityLevel = classifyRecovery({
    failClosedDegradation: failClosedRecoveryDegrading,
    collapseSensitive: collapseSensitiveRecoveryEscalation,
    recursiveDegradation: recursiveRecoveryDegradationDetected,
    entropyAcceleration: entropyRecoveryAccelerationDetected,
    containmentRisk: containmentRecoveryRiskDetected,
    rollbackWeakness: rollbackRecoveryWeaknessDetected,
    doctrineDrift: doctrineRecoveryDrift,
    institutionalRisk: institutionalRecoveryDurabilityRisk,
    longHorizonWeakness: longHorizonRecoveryDurabilityWeakness,
    lineageWeakness: lineageRecoveryPreservationWeakness,
    explainabilityDecay: explainabilityRecoveryDecay,
    resilienceRecoveryWeakness,
    continuationRequired,
    severityScore: recoverySeverityScore,
  });

  const primaryRecoveryDriver = selectPrimaryDriver({
    "forecast resilience recovery weakness": inverseHealthScore(forecastResilienceRecoveryIntegrityScore),
    "long-horizon recovery durability weakness": inverseHealthScore(longHorizonRecoveryDurabilityScore),
    "fail-closed recovery degradation": inverseHealthScore(failClosedRecoveryPreservationScore),
    "recursive resilience recovery degradation": recursiveResilienceRecoveryDegradationRiskScore,
    "rollback recovery weakness": inverseHealthScore(rollbackRecoveryIntegrityScore),
    "projected containment recovery risk": inverseHealthScore(projectedContainmentRecoveryScore),
    "doctrine recovery drift": inverseHealthScore(doctrineRecoveryStabilityScore),
    "institutional recovery durability risk": inverseHealthScore(institutionalRecoveryDurabilityScore),
    "entropy recovery acceleration": entropyRecoveryAccelerationScore,
    "lineage recovery preservation weakness": inverseHealthScore(lineageRecoveryPreservationScore),
    "explainability recovery decay": inverseHealthScore(explainabilityRecoveryDurabilityScore),
    "recovery reevaluation pressure": recoveryReevaluationPressureScore,
  });

  return {
    recoveryIntegrityLevel,
    recoverySeverityScore,
    recoveryExposureLevel,
    recoveryReevaluationRequirementLevel,
    longHorizonRecovery,
    continuationRequired,
    failClosedRecoveryDegrading,
    recursiveRecoveryDegradationDetected,
    rollbackRecoveryWeaknessDetected,
    containmentRecoveryRiskDetected,
    entropyRecoveryAccelerationDetected,
    collapseSensitiveRecoveryEscalation,
    warningCodes,
    explainability: {
      primaryRecoveryDriver,
      dominantRecoveryEscalationReason:
        warningCodes[0] ?? "No deterministic forecast resilience recovery escalation threshold was crossed.",
      containmentRecoveryAssessment: containmentRecoveryRiskDetected
        ? "Projected containment is not strong enough to preserve recovery integrity after resilience stress."
        : "Projected containment remains recovery-preserving for the current caller-supplied forecast context.",
      longHorizonRecoveryAssessment:
        longHorizonRecovery === "durable"
          ? "Long-horizon forecast resilience recovery is durable under the current inputs."
          : `Long-horizon forecast resilience recovery is ${longHorizonRecovery} under the current inputs.`,
      failClosedRecoveryAssessment: failClosedRecoveryDegrading
        ? "Fail-closed recovery preservation is degrading and overrides optimistic recovery assumptions."
        : "Fail-closed recovery preservation remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
