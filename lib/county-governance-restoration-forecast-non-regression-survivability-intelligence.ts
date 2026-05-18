export type CountyGovernanceRestorationForecastNonRegressionSurvivabilityLevel =
  | "durable_forecast_survivability"
  | "bounded_forecast_survivability"
  | "forecast_survivability_continuation_required"
  | "forecast_survivability_degrading"
  | "forecast_survivability_unstable"
  | "fail_closed_forecast_survivability_degradation"
  | "collapse_sensitive_forecast_survivability";

export type CountyGovernanceRestorationForecastSurvivabilityExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRestorationForecastSurvivabilityReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceRestorationLongHorizonSurvivability =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_survivable";

export type CountyGovernanceRestorationForecastNonRegressionSurvivabilityWarningCode =
  | "FORECAST_SURVIVABILITY_WEAKNESS"
  | "LONG_HORIZON_FORECAST_DURABILITY_WEAKNESS"
  | "FAIL_CLOSED_FORECAST_SURVIVABILITY_DEGRADATION"
  | "RECURSIVE_FORECAST_SURVIVABILITY_THREAT"
  | "PROJECTED_CONTAINMENT_SURVIVABILITY_FAILURE"
  | "RESTORATION_DRIFT_SURVIVABILITY_WEAKNESS"
  | "DOCTRINE_FORECAST_SURVIVABILITY_WEAKNESS"
  | "ROLLBACK_FORECAST_SURVIVABILITY_WEAKNESS"
  | "INSTITUTIONAL_FORECAST_SURVIVABILITY_RISK"
  | "ENTROPY_ACCELERATION_SURVIVABILITY_THREAT"
  | "LINEAGE_FORECAST_SURVIVABILITY_WEAKNESS"
  | "EXPLAINABILITY_SURVIVABILITY_DECAY"
  | "FORECAST_SURVIVABILITY_REEVALUATION_REQUIRED"
  | "FORECAST_SURVIVABILITY_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_FORECAST_SURVIVABILITY";

export type CountyGovernanceRestorationForecastNonRegressionSurvivabilityInput = {
  forecastNonRegressionSurvivabilityScore: number;
  longHorizonForecastDurabilityScore: number;
  failClosedForecastSurvivabilityScore: number;
  recursiveForecastSurvivabilityRiskScore: number;
  projectedContainmentSurvivabilityScore: number;
  restorationDriftSurvivabilityScore: number;
  doctrineForecastSurvivabilityScore: number;
  rollbackForecastSurvivabilityScore: number;
  institutionalForecastSurvivabilityScore: number;
  entropyAccelerationSurvivabilityScore: number;
  lineageForecastSurvivabilityScore: number;
  explainabilitySurvivabilityScore: number;
  survivabilityReevaluationPressureScore: number;
};

export type CountyGovernanceRestorationForecastNonRegressionSurvivabilityResult = {
  forecastSurvivabilityLevel: CountyGovernanceRestorationForecastNonRegressionSurvivabilityLevel;
  forecastSurvivabilitySeverityScore: number;
  forecastSurvivabilityExposureLevel: CountyGovernanceRestorationForecastSurvivabilityExposureLevel;
  survivabilityReevaluationRequirementLevel: CountyGovernanceRestorationForecastSurvivabilityReevaluationRequirementLevel;
  longHorizonSurvivability: CountyGovernanceRestorationLongHorizonSurvivability;
  continuationRequired: boolean;
  failClosedForecastSurvivabilityDegrading: boolean;
  recursiveForecastSurvivabilityThreatDetected: boolean;
  rollbackForecastSurvivabilityWeaknessDetected: boolean;
  entropyAccelerationSurvivabilityThreatDetected: boolean;
  containmentSurvivabilityBreakdownDetected: boolean;
  collapseSensitiveSurvivabilityEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primarySurvivabilityDriver: string;
    dominantSurvivabilityEscalationReason: string;
    containmentSurvivabilityAssessment: string;
    longHorizonDurabilityAssessment: string;
    failClosedSurvivabilityAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceRestorationForecastNonRegressionSurvivabilityWarningCode[] = [
  "FAIL_CLOSED_FORECAST_SURVIVABILITY_DEGRADATION",
  "COLLAPSE_SENSITIVE_FORECAST_SURVIVABILITY",
  "RECURSIVE_FORECAST_SURVIVABILITY_THREAT",
  "ENTROPY_ACCELERATION_SURVIVABILITY_THREAT",
  "PROJECTED_CONTAINMENT_SURVIVABILITY_FAILURE",
  "ROLLBACK_FORECAST_SURVIVABILITY_WEAKNESS",
  "DOCTRINE_FORECAST_SURVIVABILITY_WEAKNESS",
  "RESTORATION_DRIFT_SURVIVABILITY_WEAKNESS",
  "INSTITUTIONAL_FORECAST_SURVIVABILITY_RISK",
  "LONG_HORIZON_FORECAST_DURABILITY_WEAKNESS",
  "LINEAGE_FORECAST_SURVIVABILITY_WEAKNESS",
  "EXPLAINABILITY_SURVIVABILITY_DECAY",
  "FORECAST_SURVIVABILITY_WEAKNESS",
  "FORECAST_SURVIVABILITY_REEVALUATION_REQUIRED",
  "FORECAST_SURVIVABILITY_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceRestorationForecastSurvivabilityExposureLevel {
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
): CountyGovernanceRestorationForecastSurvivabilityReevaluationRequirementLevel {
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

function classifyLongHorizonSurvivability(params: {
  forecastNonRegressionSurvivabilityScore: number;
  longHorizonForecastDurabilityScore: number;
  failClosedForecastSurvivabilityScore: number;
  institutionalForecastSurvivabilityScore: number;
  entropyAccelerationSurvivabilityScore: number;
}): CountyGovernanceRestorationLongHorizonSurvivability {
  if (
    params.forecastNonRegressionSurvivabilityScore < 35 ||
    params.longHorizonForecastDurabilityScore < 35 ||
    params.failClosedForecastSurvivabilityScore < 35 ||
    params.entropyAccelerationSurvivabilityScore >= 88
  ) {
    return "non_survivable";
  }

  if (
    params.forecastNonRegressionSurvivabilityScore < 55 ||
    params.longHorizonForecastDurabilityScore < 55 ||
    params.failClosedForecastSurvivabilityScore < 55 ||
    params.institutionalForecastSurvivabilityScore < 55 ||
    params.entropyAccelerationSurvivabilityScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.forecastNonRegressionSurvivabilityScore < 75 ||
    params.longHorizonForecastDurabilityScore < 75 ||
    params.institutionalForecastSurvivabilityScore < 75 ||
    params.entropyAccelerationSurvivabilityScore >= 50
  ) {
    return "strained";
  }

  if (
    params.forecastNonRegressionSurvivabilityScore < 88 ||
    params.longHorizonForecastDurabilityScore < 88 ||
    params.institutionalForecastSurvivabilityScore < 88 ||
    params.entropyAccelerationSurvivabilityScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  forecastSurvivabilityWeakness: boolean;
  longHorizonWeakness: boolean;
  failClosedDegradation: boolean;
  recursiveThreat: boolean;
  containmentFailure: boolean;
  restorationDriftWeakness: boolean;
  doctrineWeakness: boolean;
  rollbackWeakness: boolean;
  institutionalRisk: boolean;
  entropyThreat: boolean;
  lineageWeakness: boolean;
  explainabilityDecay: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceRestorationForecastNonRegressionSurvivabilityWarningCode[] {
  const warnings = new Set<CountyGovernanceRestorationForecastNonRegressionSurvivabilityWarningCode>();

  if (params.forecastSurvivabilityWeakness) {
    warnings.add("FORECAST_SURVIVABILITY_WEAKNESS");
  }

  if (params.longHorizonWeakness) {
    warnings.add("LONG_HORIZON_FORECAST_DURABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_FORECAST_SURVIVABILITY_DEGRADATION");
  }

  if (params.recursiveThreat) {
    warnings.add("RECURSIVE_FORECAST_SURVIVABILITY_THREAT");
  }

  if (params.containmentFailure) {
    warnings.add("PROJECTED_CONTAINMENT_SURVIVABILITY_FAILURE");
  }

  if (params.restorationDriftWeakness) {
    warnings.add("RESTORATION_DRIFT_SURVIVABILITY_WEAKNESS");
  }

  if (params.doctrineWeakness) {
    warnings.add("DOCTRINE_FORECAST_SURVIVABILITY_WEAKNESS");
  }

  if (params.rollbackWeakness) {
    warnings.add("ROLLBACK_FORECAST_SURVIVABILITY_WEAKNESS");
  }

  if (params.institutionalRisk) {
    warnings.add("INSTITUTIONAL_FORECAST_SURVIVABILITY_RISK");
  }

  if (params.entropyThreat) {
    warnings.add("ENTROPY_ACCELERATION_SURVIVABILITY_THREAT");
  }

  if (params.lineageWeakness) {
    warnings.add("LINEAGE_FORECAST_SURVIVABILITY_WEAKNESS");
  }

  if (params.explainabilityDecay) {
    warnings.add("EXPLAINABILITY_SURVIVABILITY_DECAY");
  }

  if (params.reevaluationRequired) {
    warnings.add("FORECAST_SURVIVABILITY_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("FORECAST_SURVIVABILITY_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_FORECAST_SURVIVABILITY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["forecast non-regression survivability", 0],
  )[0];
}

function classifySurvivability(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveThreat: boolean;
  entropyThreat: boolean;
  containmentFailure: boolean;
  rollbackWeakness: boolean;
  doctrineWeakness: boolean;
  restorationDriftWeakness: boolean;
  institutionalRisk: boolean;
  longHorizonWeakness: boolean;
  lineageWeakness: boolean;
  explainabilityDecay: boolean;
  forecastSurvivabilityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceRestorationForecastNonRegressionSurvivabilityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_forecast_survivability_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_forecast_survivability";
  }

  if (params.recursiveThreat || params.entropyThreat || params.containmentFailure) {
    return "forecast_survivability_unstable";
  }

  if (
    params.rollbackWeakness ||
    params.doctrineWeakness ||
    params.restorationDriftWeakness ||
    params.institutionalRisk
  ) {
    return "forecast_survivability_degrading";
  }

  if (
    params.longHorizonWeakness ||
    params.lineageWeakness ||
    params.explainabilityDecay ||
    params.forecastSurvivabilityWeakness
  ) {
    return "forecast_survivability_degrading";
  }

  if (params.continuationRequired) {
    return "forecast_survivability_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_forecast_survivability";
  }

  return "durable_forecast_survivability";
}

export function evaluateCountyGovernanceRestorationForecastNonRegressionSurvivability(
  input: CountyGovernanceRestorationForecastNonRegressionSurvivabilityInput,
): CountyGovernanceRestorationForecastNonRegressionSurvivabilityResult {
  const forecastNonRegressionSurvivabilityScore = clampScore(input.forecastNonRegressionSurvivabilityScore);
  const longHorizonForecastDurabilityScore = clampScore(input.longHorizonForecastDurabilityScore);
  const failClosedForecastSurvivabilityScore = clampScore(input.failClosedForecastSurvivabilityScore);
  const recursiveForecastSurvivabilityRiskScore = clampScore(input.recursiveForecastSurvivabilityRiskScore);
  const projectedContainmentSurvivabilityScore = clampScore(input.projectedContainmentSurvivabilityScore);
  const restorationDriftSurvivabilityScore = clampScore(input.restorationDriftSurvivabilityScore);
  const doctrineForecastSurvivabilityScore = clampScore(input.doctrineForecastSurvivabilityScore);
  const rollbackForecastSurvivabilityScore = clampScore(input.rollbackForecastSurvivabilityScore);
  const institutionalForecastSurvivabilityScore = clampScore(input.institutionalForecastSurvivabilityScore);
  const entropyAccelerationSurvivabilityScore = clampScore(input.entropyAccelerationSurvivabilityScore);
  const lineageForecastSurvivabilityScore = clampScore(input.lineageForecastSurvivabilityScore);
  const explainabilitySurvivabilityScore = clampScore(input.explainabilitySurvivabilityScore);
  const survivabilityReevaluationPressureScore = clampScore(input.survivabilityReevaluationPressureScore);

  const failClosedForecastSurvivabilityDegrading = failClosedForecastSurvivabilityScore < 55;
  const collapseSensitiveSurvivabilityEscalation =
    recursiveForecastSurvivabilityRiskScore >= 92 ||
    entropyAccelerationSurvivabilityScore >= 92 ||
    (projectedContainmentSurvivabilityScore < 35 &&
      (failClosedForecastSurvivabilityScore < 65 || longHorizonForecastDurabilityScore < 55));
  const recursiveForecastSurvivabilityThreatDetected =
    recursiveForecastSurvivabilityRiskScore >= 72 ||
    (recursiveForecastSurvivabilityRiskScore >= 58 && restorationDriftSurvivabilityScore < 65);
  const entropyAccelerationSurvivabilityThreatDetected =
    entropyAccelerationSurvivabilityScore >= 72 ||
    (entropyAccelerationSurvivabilityScore >= 58 && longHorizonForecastDurabilityScore < 65);
  const containmentSurvivabilityBreakdownDetected =
    projectedContainmentSurvivabilityScore < 55 ||
    (projectedContainmentSurvivabilityScore < 65 && recursiveForecastSurvivabilityRiskScore >= 58);
  const rollbackForecastSurvivabilityWeaknessDetected = rollbackForecastSurvivabilityScore < 55;
  const doctrineForecastSurvivabilityWeakness = doctrineForecastSurvivabilityScore < 65;
  const restorationDriftSurvivabilityWeakness = restorationDriftSurvivabilityScore < 65;
  const institutionalForecastSurvivabilityRisk = institutionalForecastSurvivabilityScore < 65;
  const longHorizonForecastDurabilityWeakness = longHorizonForecastDurabilityScore < 65;
  const lineageForecastSurvivabilityWeakness = lineageForecastSurvivabilityScore < 65;
  const explainabilitySurvivabilityDecay = explainabilitySurvivabilityScore < 65;
  const forecastSurvivabilityWeakness = forecastNonRegressionSurvivabilityScore < 75;
  const reevaluationRequired =
    survivabilityReevaluationPressureScore >= 58 ||
    longHorizonForecastDurabilityWeakness ||
    lineageForecastSurvivabilityWeakness ||
    explainabilitySurvivabilityDecay ||
    restorationDriftSurvivabilityWeakness ||
    institutionalForecastSurvivabilityRisk;

  const forecastSurvivabilitySeverityScore = clampScore(
    maxScore([
      inverseHealthScore(forecastNonRegressionSurvivabilityScore),
      inverseHealthScore(longHorizonForecastDurabilityScore),
      inverseHealthScore(failClosedForecastSurvivabilityScore),
      recursiveForecastSurvivabilityRiskScore,
      inverseHealthScore(projectedContainmentSurvivabilityScore),
      inverseHealthScore(restorationDriftSurvivabilityScore),
      inverseHealthScore(doctrineForecastSurvivabilityScore),
      inverseHealthScore(rollbackForecastSurvivabilityScore),
      inverseHealthScore(institutionalForecastSurvivabilityScore),
      entropyAccelerationSurvivabilityScore,
      inverseHealthScore(lineageForecastSurvivabilityScore),
      inverseHealthScore(explainabilitySurvivabilityScore),
      survivabilityReevaluationPressureScore,
    ]),
  );

  const longHorizonSurvivability = classifyLongHorizonSurvivability({
    forecastNonRegressionSurvivabilityScore,
    longHorizonForecastDurabilityScore,
    failClosedForecastSurvivabilityScore,
    institutionalForecastSurvivabilityScore,
    entropyAccelerationSurvivabilityScore,
  });
  const forecastSurvivabilityExposureLevel = classifyExposure(forecastSurvivabilitySeverityScore);
  const survivabilityReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      forecastSurvivabilitySeverityScore,
      survivabilityReevaluationPressureScore,
      entropyAccelerationSurvivabilityScore,
      recursiveForecastSurvivabilityRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedForecastSurvivabilityDegrading &&
    !collapseSensitiveSurvivabilityEscalation &&
    !recursiveForecastSurvivabilityThreatDetected &&
    !entropyAccelerationSurvivabilityThreatDetected &&
    !containmentSurvivabilityBreakdownDetected &&
    forecastSurvivabilitySeverityScore >= 35 &&
    forecastSurvivabilitySeverityScore < 72;

  const warningCodes = buildWarnings({
    forecastSurvivabilityWeakness,
    longHorizonWeakness: longHorizonForecastDurabilityWeakness,
    failClosedDegradation: failClosedForecastSurvivabilityDegrading,
    recursiveThreat: recursiveForecastSurvivabilityThreatDetected,
    containmentFailure: containmentSurvivabilityBreakdownDetected,
    restorationDriftWeakness: restorationDriftSurvivabilityWeakness,
    doctrineWeakness: doctrineForecastSurvivabilityWeakness,
    rollbackWeakness: rollbackForecastSurvivabilityWeaknessDetected,
    institutionalRisk: institutionalForecastSurvivabilityRisk,
    entropyThreat: entropyAccelerationSurvivabilityThreatDetected,
    lineageWeakness: lineageForecastSurvivabilityWeakness,
    explainabilityDecay: explainabilitySurvivabilityDecay,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveSurvivabilityEscalation,
  });

  const forecastSurvivabilityLevel = classifySurvivability({
    failClosedDegradation: failClosedForecastSurvivabilityDegrading,
    collapseSensitive: collapseSensitiveSurvivabilityEscalation,
    recursiveThreat: recursiveForecastSurvivabilityThreatDetected,
    entropyThreat: entropyAccelerationSurvivabilityThreatDetected,
    containmentFailure: containmentSurvivabilityBreakdownDetected,
    rollbackWeakness: rollbackForecastSurvivabilityWeaknessDetected,
    doctrineWeakness: doctrineForecastSurvivabilityWeakness,
    restorationDriftWeakness: restorationDriftSurvivabilityWeakness,
    institutionalRisk: institutionalForecastSurvivabilityRisk,
    longHorizonWeakness: longHorizonForecastDurabilityWeakness,
    lineageWeakness: lineageForecastSurvivabilityWeakness,
    explainabilityDecay: explainabilitySurvivabilityDecay,
    forecastSurvivabilityWeakness,
    continuationRequired,
    severityScore: forecastSurvivabilitySeverityScore,
  });

  const primarySurvivabilityDriver = selectPrimaryDriver({
    "forecast non-regression survivability weakness": inverseHealthScore(forecastNonRegressionSurvivabilityScore),
    "long-horizon forecast durability weakness": inverseHealthScore(longHorizonForecastDurabilityScore),
    "fail-closed forecast survivability degradation": inverseHealthScore(failClosedForecastSurvivabilityScore),
    "recursive forecast survivability threat": recursiveForecastSurvivabilityRiskScore,
    "projected containment survivability weakness": inverseHealthScore(projectedContainmentSurvivabilityScore),
    "restoration drift survivability weakness": inverseHealthScore(restorationDriftSurvivabilityScore),
    "doctrine forecast survivability weakness": inverseHealthScore(doctrineForecastSurvivabilityScore),
    "rollback forecast survivability weakness": inverseHealthScore(rollbackForecastSurvivabilityScore),
    "institutional forecast survivability risk": inverseHealthScore(institutionalForecastSurvivabilityScore),
    "entropy acceleration survivability threat": entropyAccelerationSurvivabilityScore,
    "lineage forecast survivability weakness": inverseHealthScore(lineageForecastSurvivabilityScore),
    "explainability survivability decay": inverseHealthScore(explainabilitySurvivabilityScore),
    "survivability reevaluation pressure": survivabilityReevaluationPressureScore,
  });

  return {
    forecastSurvivabilityLevel,
    forecastSurvivabilitySeverityScore,
    forecastSurvivabilityExposureLevel,
    survivabilityReevaluationRequirementLevel,
    longHorizonSurvivability,
    continuationRequired,
    failClosedForecastSurvivabilityDegrading,
    recursiveForecastSurvivabilityThreatDetected,
    rollbackForecastSurvivabilityWeaknessDetected,
    entropyAccelerationSurvivabilityThreatDetected,
    containmentSurvivabilityBreakdownDetected,
    collapseSensitiveSurvivabilityEscalation,
    warningCodes,
    explainability: {
      primarySurvivabilityDriver,
      dominantSurvivabilityEscalationReason:
        warningCodes[0] ?? "No deterministic forecast survivability escalation threshold was crossed.",
      containmentSurvivabilityAssessment: containmentSurvivabilityBreakdownDetected
        ? "Projected containment is not survivable enough to prevent long-horizon forecast regression spread."
        : "Projected containment remains survivable for the current caller-supplied forecast context.",
      longHorizonDurabilityAssessment:
        longHorizonSurvivability === "durable"
          ? "Long-horizon forecast survivability is durable under the current inputs."
          : `Long-horizon forecast survivability is ${longHorizonSurvivability} under the current inputs.`,
      failClosedSurvivabilityAssessment: failClosedForecastSurvivabilityDegrading
        ? "Fail-closed forecast survivability is degrading and overrides optimistic survivability signals."
        : "Fail-closed forecast survivability remains preserved under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
