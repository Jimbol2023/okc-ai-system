export type CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityLevel =
  | "durable_forecast_recovery_sustainability"
  | "bounded_forecast_recovery_sustainability"
  | "forecast_recovery_sustainability_continuation_required"
  | "forecast_recovery_sustainability_degrading"
  | "forecast_recovery_sustainability_unstable"
  | "fail_closed_forecast_sustainability_degradation"
  | "collapse_sensitive_forecast_sustainability";

export type CountyGovernanceRestorationForecastRecoverySustainabilityExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRestorationForecastRecoverySustainabilityReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceRestorationLongHorizonSustainability =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_sustainable";

export type CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityWarningCode =
  | "FORECAST_RECOVERY_SUSTAINABILITY_WEAKNESS"
  | "LONG_HORIZON_SUSTAINABILITY_DURABILITY_WEAKNESS"
  | "FAIL_CLOSED_FORECAST_SUSTAINABILITY_DEGRADATION"
  | "RECURSIVE_RECOVERY_SUSTAINABILITY_DEGRADATION"
  | "ROLLBACK_SUSTAINABILITY_WEAKNESS"
  | "PROJECTED_CONTAINMENT_SUSTAINABILITY_RISK"
  | "DOCTRINE_SUSTAINABILITY_DRIFT"
  | "INSTITUTIONAL_SUSTAINABILITY_DURABILITY_RISK"
  | "ENTROPY_SUSTAINABILITY_ACCELERATION"
  | "LINEAGE_SUSTAINABILITY_PRESERVATION_WEAKNESS"
  | "EXPLAINABILITY_SUSTAINABILITY_DECAY"
  | "FORECAST_SUSTAINABILITY_REEVALUATION_REQUIRED"
  | "FORECAST_SUSTAINABILITY_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_FORECAST_SUSTAINABILITY";

export type CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityInput = {
  forecastRecoverySustainabilityIntegrityScore: number;
  longHorizonRecoverySustainabilityDurabilityScore: number;
  failClosedRecoverySustainabilityPreservationScore: number;
  recursiveRecoverySustainabilityDegradationRiskScore: number;
  rollbackRecoverySustainabilityScore: number;
  projectedContainmentSustainabilityScore: number;
  doctrineSustainabilityStabilityScore: number;
  institutionalSustainabilityDurabilityScore: number;
  entropySustainabilityAccelerationScore: number;
  lineageSustainabilityPreservationScore: number;
  explainabilitySustainabilityDurabilityScore: number;
  sustainabilityReevaluationPressureScore: number;
};

export type CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityResult = {
  sustainabilityIntegrityLevel: CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityLevel;
  sustainabilitySeverityScore: number;
  sustainabilityExposureLevel: CountyGovernanceRestorationForecastRecoverySustainabilityExposureLevel;
  sustainabilityReevaluationRequirementLevel: CountyGovernanceRestorationForecastRecoverySustainabilityReevaluationRequirementLevel;
  longHorizonSustainability: CountyGovernanceRestorationLongHorizonSustainability;
  continuationRequired: boolean;
  failClosedSustainabilityDegrading: boolean;
  recursiveSustainabilityDegradationDetected: boolean;
  rollbackSustainabilityWeaknessDetected: boolean;
  containmentSustainabilityRiskDetected: boolean;
  entropySustainabilityAccelerationDetected: boolean;
  collapseSensitiveSustainabilityEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primarySustainabilityDriver: string;
    dominantSustainabilityEscalationReason: string;
    containmentSustainabilityAssessment: string;
    longHorizonSustainabilityAssessment: string;
    failClosedSustainabilityAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityWarningCode[] = [
  "FAIL_CLOSED_FORECAST_SUSTAINABILITY_DEGRADATION",
  "COLLAPSE_SENSITIVE_FORECAST_SUSTAINABILITY",
  "RECURSIVE_RECOVERY_SUSTAINABILITY_DEGRADATION",
  "ENTROPY_SUSTAINABILITY_ACCELERATION",
  "PROJECTED_CONTAINMENT_SUSTAINABILITY_RISK",
  "ROLLBACK_SUSTAINABILITY_WEAKNESS",
  "DOCTRINE_SUSTAINABILITY_DRIFT",
  "INSTITUTIONAL_SUSTAINABILITY_DURABILITY_RISK",
  "LONG_HORIZON_SUSTAINABILITY_DURABILITY_WEAKNESS",
  "LINEAGE_SUSTAINABILITY_PRESERVATION_WEAKNESS",
  "EXPLAINABILITY_SUSTAINABILITY_DECAY",
  "FORECAST_RECOVERY_SUSTAINABILITY_WEAKNESS",
  "FORECAST_SUSTAINABILITY_REEVALUATION_REQUIRED",
  "FORECAST_SUSTAINABILITY_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceRestorationForecastRecoverySustainabilityExposureLevel {
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
): CountyGovernanceRestorationForecastRecoverySustainabilityReevaluationRequirementLevel {
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

function classifyLongHorizonSustainability(params: {
  forecastRecoverySustainabilityIntegrityScore: number;
  longHorizonRecoverySustainabilityDurabilityScore: number;
  failClosedRecoverySustainabilityPreservationScore: number;
  institutionalSustainabilityDurabilityScore: number;
  entropySustainabilityAccelerationScore: number;
}): CountyGovernanceRestorationLongHorizonSustainability {
  if (
    params.forecastRecoverySustainabilityIntegrityScore < 35 ||
    params.longHorizonRecoverySustainabilityDurabilityScore < 35 ||
    params.failClosedRecoverySustainabilityPreservationScore < 35 ||
    params.entropySustainabilityAccelerationScore >= 88
  ) {
    return "non_sustainable";
  }

  if (
    params.forecastRecoverySustainabilityIntegrityScore < 55 ||
    params.longHorizonRecoverySustainabilityDurabilityScore < 55 ||
    params.failClosedRecoverySustainabilityPreservationScore < 55 ||
    params.institutionalSustainabilityDurabilityScore < 55 ||
    params.entropySustainabilityAccelerationScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.forecastRecoverySustainabilityIntegrityScore < 75 ||
    params.longHorizonRecoverySustainabilityDurabilityScore < 75 ||
    params.institutionalSustainabilityDurabilityScore < 75 ||
    params.entropySustainabilityAccelerationScore >= 50
  ) {
    return "strained";
  }

  if (
    params.forecastRecoverySustainabilityIntegrityScore < 88 ||
    params.longHorizonRecoverySustainabilityDurabilityScore < 88 ||
    params.institutionalSustainabilityDurabilityScore < 88 ||
    params.entropySustainabilityAccelerationScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  recoverySustainabilityWeakness: boolean;
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
}): CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityWarningCode[] {
  const warnings = new Set<CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityWarningCode>();

  if (params.recoverySustainabilityWeakness) {
    warnings.add("FORECAST_RECOVERY_SUSTAINABILITY_WEAKNESS");
  }

  if (params.longHorizonWeakness) {
    warnings.add("LONG_HORIZON_SUSTAINABILITY_DURABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_FORECAST_SUSTAINABILITY_DEGRADATION");
  }

  if (params.recursiveDegradation) {
    warnings.add("RECURSIVE_RECOVERY_SUSTAINABILITY_DEGRADATION");
  }

  if (params.rollbackWeakness) {
    warnings.add("ROLLBACK_SUSTAINABILITY_WEAKNESS");
  }

  if (params.containmentRisk) {
    warnings.add("PROJECTED_CONTAINMENT_SUSTAINABILITY_RISK");
  }

  if (params.doctrineDrift) {
    warnings.add("DOCTRINE_SUSTAINABILITY_DRIFT");
  }

  if (params.institutionalRisk) {
    warnings.add("INSTITUTIONAL_SUSTAINABILITY_DURABILITY_RISK");
  }

  if (params.entropyAcceleration) {
    warnings.add("ENTROPY_SUSTAINABILITY_ACCELERATION");
  }

  if (params.lineageWeakness) {
    warnings.add("LINEAGE_SUSTAINABILITY_PRESERVATION_WEAKNESS");
  }

  if (params.explainabilityDecay) {
    warnings.add("EXPLAINABILITY_SUSTAINABILITY_DECAY");
  }

  if (params.reevaluationRequired) {
    warnings.add("FORECAST_SUSTAINABILITY_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("FORECAST_SUSTAINABILITY_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_FORECAST_SUSTAINABILITY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["forecast recovery sustainability integrity", 0],
  )[0];
}

function classifySustainability(params: {
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
  recoverySustainabilityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_forecast_sustainability_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_forecast_sustainability";
  }

  if (params.recursiveDegradation || params.entropyAcceleration || params.containmentRisk) {
    return "forecast_recovery_sustainability_unstable";
  }

  if (params.rollbackWeakness || params.doctrineDrift || params.institutionalRisk) {
    return "forecast_recovery_sustainability_degrading";
  }

  if (
    params.longHorizonWeakness ||
    params.lineageWeakness ||
    params.explainabilityDecay ||
    params.recoverySustainabilityWeakness
  ) {
    return "forecast_recovery_sustainability_degrading";
  }

  if (params.continuationRequired) {
    return "forecast_recovery_sustainability_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_forecast_recovery_sustainability";
  }

  return "durable_forecast_recovery_sustainability";
}

export function evaluateCountyGovernanceRestorationForecastRecoverySustainabilityIntegrity(
  input: CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityInput,
): CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityResult {
  const forecastRecoverySustainabilityIntegrityScore = clampScore(
    input.forecastRecoverySustainabilityIntegrityScore,
  );
  const longHorizonRecoverySustainabilityDurabilityScore = clampScore(
    input.longHorizonRecoverySustainabilityDurabilityScore,
  );
  const failClosedRecoverySustainabilityPreservationScore = clampScore(
    input.failClosedRecoverySustainabilityPreservationScore,
  );
  const recursiveRecoverySustainabilityDegradationRiskScore = clampScore(
    input.recursiveRecoverySustainabilityDegradationRiskScore,
  );
  const rollbackRecoverySustainabilityScore = clampScore(input.rollbackRecoverySustainabilityScore);
  const projectedContainmentSustainabilityScore = clampScore(input.projectedContainmentSustainabilityScore);
  const doctrineSustainabilityStabilityScore = clampScore(input.doctrineSustainabilityStabilityScore);
  const institutionalSustainabilityDurabilityScore = clampScore(input.institutionalSustainabilityDurabilityScore);
  const entropySustainabilityAccelerationScore = clampScore(input.entropySustainabilityAccelerationScore);
  const lineageSustainabilityPreservationScore = clampScore(input.lineageSustainabilityPreservationScore);
  const explainabilitySustainabilityDurabilityScore = clampScore(input.explainabilitySustainabilityDurabilityScore);
  const sustainabilityReevaluationPressureScore = clampScore(input.sustainabilityReevaluationPressureScore);

  const failClosedSustainabilityDegrading = failClosedRecoverySustainabilityPreservationScore < 55;
  const collapseSensitiveSustainabilityEscalation =
    recursiveRecoverySustainabilityDegradationRiskScore >= 92 ||
    entropySustainabilityAccelerationScore >= 92 ||
    (projectedContainmentSustainabilityScore < 35 &&
      (failClosedRecoverySustainabilityPreservationScore < 65 ||
        longHorizonRecoverySustainabilityDurabilityScore < 55));
  const recursiveSustainabilityDegradationDetected =
    recursiveRecoverySustainabilityDegradationRiskScore >= 72 ||
    (recursiveRecoverySustainabilityDegradationRiskScore >= 58 && doctrineSustainabilityStabilityScore < 65);
  const entropySustainabilityAccelerationDetected =
    entropySustainabilityAccelerationScore >= 72 ||
    (entropySustainabilityAccelerationScore >= 58 && longHorizonRecoverySustainabilityDurabilityScore < 65);
  const containmentSustainabilityRiskDetected =
    projectedContainmentSustainabilityScore < 55 ||
    (projectedContainmentSustainabilityScore < 65 && recursiveRecoverySustainabilityDegradationRiskScore >= 58);
  const rollbackSustainabilityWeaknessDetected = rollbackRecoverySustainabilityScore < 55;
  const doctrineSustainabilityDrift = doctrineSustainabilityStabilityScore < 65;
  const institutionalSustainabilityDurabilityRisk = institutionalSustainabilityDurabilityScore < 65;
  const longHorizonSustainabilityDurabilityWeakness = longHorizonRecoverySustainabilityDurabilityScore < 65;
  const lineageSustainabilityPreservationWeakness = lineageSustainabilityPreservationScore < 65;
  const explainabilitySustainabilityDecay = explainabilitySustainabilityDurabilityScore < 65;
  const recoverySustainabilityWeakness = forecastRecoverySustainabilityIntegrityScore < 75;
  const reevaluationRequired =
    sustainabilityReevaluationPressureScore >= 58 ||
    longHorizonSustainabilityDurabilityWeakness ||
    lineageSustainabilityPreservationWeakness ||
    explainabilitySustainabilityDecay ||
    doctrineSustainabilityDrift ||
    institutionalSustainabilityDurabilityRisk;

  const sustainabilitySeverityScore = clampScore(
    maxScore([
      inverseHealthScore(forecastRecoverySustainabilityIntegrityScore),
      inverseHealthScore(longHorizonRecoverySustainabilityDurabilityScore),
      inverseHealthScore(failClosedRecoverySustainabilityPreservationScore),
      recursiveRecoverySustainabilityDegradationRiskScore,
      inverseHealthScore(rollbackRecoverySustainabilityScore),
      inverseHealthScore(projectedContainmentSustainabilityScore),
      inverseHealthScore(doctrineSustainabilityStabilityScore),
      inverseHealthScore(institutionalSustainabilityDurabilityScore),
      entropySustainabilityAccelerationScore,
      inverseHealthScore(lineageSustainabilityPreservationScore),
      inverseHealthScore(explainabilitySustainabilityDurabilityScore),
      sustainabilityReevaluationPressureScore,
    ]),
  );

  const longHorizonSustainability = classifyLongHorizonSustainability({
    forecastRecoverySustainabilityIntegrityScore,
    longHorizonRecoverySustainabilityDurabilityScore,
    failClosedRecoverySustainabilityPreservationScore,
    institutionalSustainabilityDurabilityScore,
    entropySustainabilityAccelerationScore,
  });
  const sustainabilityExposureLevel = classifyExposure(sustainabilitySeverityScore);
  const sustainabilityReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      sustainabilitySeverityScore,
      sustainabilityReevaluationPressureScore,
      entropySustainabilityAccelerationScore,
      recursiveRecoverySustainabilityDegradationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedSustainabilityDegrading &&
    !collapseSensitiveSustainabilityEscalation &&
    !recursiveSustainabilityDegradationDetected &&
    !entropySustainabilityAccelerationDetected &&
    !containmentSustainabilityRiskDetected &&
    sustainabilitySeverityScore >= 35 &&
    sustainabilitySeverityScore < 72;

  const warningCodes = buildWarnings({
    recoverySustainabilityWeakness,
    longHorizonWeakness: longHorizonSustainabilityDurabilityWeakness,
    failClosedDegradation: failClosedSustainabilityDegrading,
    recursiveDegradation: recursiveSustainabilityDegradationDetected,
    rollbackWeakness: rollbackSustainabilityWeaknessDetected,
    containmentRisk: containmentSustainabilityRiskDetected,
    doctrineDrift: doctrineSustainabilityDrift,
    institutionalRisk: institutionalSustainabilityDurabilityRisk,
    entropyAcceleration: entropySustainabilityAccelerationDetected,
    lineageWeakness: lineageSustainabilityPreservationWeakness,
    explainabilityDecay: explainabilitySustainabilityDecay,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveSustainabilityEscalation,
  });

  const sustainabilityIntegrityLevel = classifySustainability({
    failClosedDegradation: failClosedSustainabilityDegrading,
    collapseSensitive: collapseSensitiveSustainabilityEscalation,
    recursiveDegradation: recursiveSustainabilityDegradationDetected,
    entropyAcceleration: entropySustainabilityAccelerationDetected,
    containmentRisk: containmentSustainabilityRiskDetected,
    rollbackWeakness: rollbackSustainabilityWeaknessDetected,
    doctrineDrift: doctrineSustainabilityDrift,
    institutionalRisk: institutionalSustainabilityDurabilityRisk,
    longHorizonWeakness: longHorizonSustainabilityDurabilityWeakness,
    lineageWeakness: lineageSustainabilityPreservationWeakness,
    explainabilityDecay: explainabilitySustainabilityDecay,
    recoverySustainabilityWeakness,
    continuationRequired,
    severityScore: sustainabilitySeverityScore,
  });

  const primarySustainabilityDriver = selectPrimaryDriver({
    "forecast recovery sustainability weakness": inverseHealthScore(forecastRecoverySustainabilityIntegrityScore),
    "long-horizon sustainability durability weakness": inverseHealthScore(
      longHorizonRecoverySustainabilityDurabilityScore,
    ),
    "fail-closed sustainability degradation": inverseHealthScore(failClosedRecoverySustainabilityPreservationScore),
    "recursive recovery sustainability degradation": recursiveRecoverySustainabilityDegradationRiskScore,
    "rollback sustainability weakness": inverseHealthScore(rollbackRecoverySustainabilityScore),
    "projected containment sustainability risk": inverseHealthScore(projectedContainmentSustainabilityScore),
    "doctrine sustainability drift": inverseHealthScore(doctrineSustainabilityStabilityScore),
    "institutional sustainability durability risk": inverseHealthScore(institutionalSustainabilityDurabilityScore),
    "entropy sustainability acceleration": entropySustainabilityAccelerationScore,
    "lineage sustainability preservation weakness": inverseHealthScore(lineageSustainabilityPreservationScore),
    "explainability sustainability decay": inverseHealthScore(explainabilitySustainabilityDurabilityScore),
    "sustainability reevaluation pressure": sustainabilityReevaluationPressureScore,
  });

  return {
    sustainabilityIntegrityLevel,
    sustainabilitySeverityScore,
    sustainabilityExposureLevel,
    sustainabilityReevaluationRequirementLevel,
    longHorizonSustainability,
    continuationRequired,
    failClosedSustainabilityDegrading,
    recursiveSustainabilityDegradationDetected,
    rollbackSustainabilityWeaknessDetected,
    containmentSustainabilityRiskDetected,
    entropySustainabilityAccelerationDetected,
    collapseSensitiveSustainabilityEscalation,
    warningCodes,
    explainability: {
      primarySustainabilityDriver,
      dominantSustainabilityEscalationReason:
        warningCodes[0] ?? "No deterministic forecast recovery sustainability escalation threshold was crossed.",
      containmentSustainabilityAssessment: containmentSustainabilityRiskDetected
        ? "Projected containment is not strong enough to preserve sustainability after recovery stress."
        : "Projected containment remains sustainability-preserving for the current caller-supplied forecast context.",
      longHorizonSustainabilityAssessment:
        longHorizonSustainability === "durable"
          ? "Long-horizon forecast recovery sustainability is durable under the current inputs."
          : `Long-horizon forecast recovery sustainability is ${longHorizonSustainability} under the current inputs.`,
      failClosedSustainabilityAssessment: failClosedSustainabilityDegrading
        ? "Fail-closed sustainability preservation is degrading and overrides optimistic sustainability assumptions."
        : "Fail-closed sustainability preservation remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
