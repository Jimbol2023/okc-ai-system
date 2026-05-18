export type CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityLevel =
  | "durable_forecast_survivability_continuity"
  | "bounded_forecast_survivability_continuity"
  | "forecast_survivability_continuity_continuation_required"
  | "forecast_survivability_continuity_degrading"
  | "forecast_survivability_continuity_unstable"
  | "fail_closed_forecast_continuity_degradation"
  | "collapse_sensitive_forecast_continuity";

export type CountyGovernanceRestorationForecastSurvivabilityContinuityExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRestorationForecastSurvivabilityContinuityReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceRestorationLongHorizonContinuity =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_continuous";

export type CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityWarningCode =
  | "FORECAST_SURVIVABILITY_CONTINUITY_WEAKNESS"
  | "LONG_HORIZON_CONTINUITY_DURABILITY_WEAKNESS"
  | "FAIL_CLOSED_FORECAST_CONTINUITY_DEGRADATION"
  | "RECURSIVE_SURVIVABILITY_CONTINUITY_DEGRADATION"
  | "ROLLBACK_SURVIVABILITY_CONTINUITY_WEAKNESS"
  | "PROJECTED_CONTAINMENT_CONTINUITY_RISK"
  | "DOCTRINE_CONTINUITY_DRIFT"
  | "INSTITUTIONAL_CONTINUITY_DURABILITY_RISK"
  | "ENTROPY_CONTINUITY_ACCELERATION"
  | "LINEAGE_CONTINUITY_PRESERVATION_WEAKNESS"
  | "EXPLAINABILITY_CONTINUITY_DECAY"
  | "FORECAST_CONTINUITY_REEVALUATION_REQUIRED"
  | "FORECAST_CONTINUITY_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_FORECAST_CONTINUITY";

export type CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityInput = {
  forecastSurvivabilityContinuityIntegrityScore: number;
  longHorizonContinuityDurabilityScore: number;
  failClosedContinuityPreservationScore: number;
  recursiveSurvivabilityContinuityRiskScore: number;
  rollbackSurvivabilityContinuityScore: number;
  projectedContainmentContinuityScore: number;
  doctrineContinuityStabilityScore: number;
  institutionalContinuityDurabilityScore: number;
  entropyContinuityAccelerationScore: number;
  lineageContinuityPreservationScore: number;
  explainabilityContinuityDurabilityScore: number;
  continuityReevaluationPressureScore: number;
};

export type CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityResult = {
  continuityIntegrityLevel: CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityLevel;
  continuitySeverityScore: number;
  continuityExposureLevel: CountyGovernanceRestorationForecastSurvivabilityContinuityExposureLevel;
  continuityReevaluationRequirementLevel: CountyGovernanceRestorationForecastSurvivabilityContinuityReevaluationRequirementLevel;
  longHorizonContinuity: CountyGovernanceRestorationLongHorizonContinuity;
  continuationRequired: boolean;
  failClosedContinuityDegrading: boolean;
  recursiveContinuityDegradationDetected: boolean;
  rollbackContinuityWeaknessDetected: boolean;
  containmentContinuityRiskDetected: boolean;
  entropyContinuityAccelerationDetected: boolean;
  collapseSensitiveContinuityEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryContinuityDriver: string;
    dominantContinuityEscalationReason: string;
    containmentContinuityAssessment: string;
    longHorizonContinuityAssessment: string;
    failClosedContinuityAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityWarningCode[] = [
  "FAIL_CLOSED_FORECAST_CONTINUITY_DEGRADATION",
  "COLLAPSE_SENSITIVE_FORECAST_CONTINUITY",
  "RECURSIVE_SURVIVABILITY_CONTINUITY_DEGRADATION",
  "ENTROPY_CONTINUITY_ACCELERATION",
  "PROJECTED_CONTAINMENT_CONTINUITY_RISK",
  "ROLLBACK_SURVIVABILITY_CONTINUITY_WEAKNESS",
  "DOCTRINE_CONTINUITY_DRIFT",
  "INSTITUTIONAL_CONTINUITY_DURABILITY_RISK",
  "LONG_HORIZON_CONTINUITY_DURABILITY_WEAKNESS",
  "LINEAGE_CONTINUITY_PRESERVATION_WEAKNESS",
  "EXPLAINABILITY_CONTINUITY_DECAY",
  "FORECAST_SURVIVABILITY_CONTINUITY_WEAKNESS",
  "FORECAST_CONTINUITY_REEVALUATION_REQUIRED",
  "FORECAST_CONTINUITY_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceRestorationForecastSurvivabilityContinuityExposureLevel {
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
): CountyGovernanceRestorationForecastSurvivabilityContinuityReevaluationRequirementLevel {
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

function classifyLongHorizonContinuity(params: {
  forecastSurvivabilityContinuityIntegrityScore: number;
  longHorizonContinuityDurabilityScore: number;
  failClosedContinuityPreservationScore: number;
  institutionalContinuityDurabilityScore: number;
  entropyContinuityAccelerationScore: number;
}): CountyGovernanceRestorationLongHorizonContinuity {
  if (
    params.forecastSurvivabilityContinuityIntegrityScore < 35 ||
    params.longHorizonContinuityDurabilityScore < 35 ||
    params.failClosedContinuityPreservationScore < 35 ||
    params.entropyContinuityAccelerationScore >= 88
  ) {
    return "non_continuous";
  }

  if (
    params.forecastSurvivabilityContinuityIntegrityScore < 55 ||
    params.longHorizonContinuityDurabilityScore < 55 ||
    params.failClosedContinuityPreservationScore < 55 ||
    params.institutionalContinuityDurabilityScore < 55 ||
    params.entropyContinuityAccelerationScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.forecastSurvivabilityContinuityIntegrityScore < 75 ||
    params.longHorizonContinuityDurabilityScore < 75 ||
    params.institutionalContinuityDurabilityScore < 75 ||
    params.entropyContinuityAccelerationScore >= 50
  ) {
    return "strained";
  }

  if (
    params.forecastSurvivabilityContinuityIntegrityScore < 88 ||
    params.longHorizonContinuityDurabilityScore < 88 ||
    params.institutionalContinuityDurabilityScore < 88 ||
    params.entropyContinuityAccelerationScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  survivabilityContinuityWeakness: boolean;
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
}): CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityWarningCode[] {
  const warnings = new Set<CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityWarningCode>();

  if (params.survivabilityContinuityWeakness) {
    warnings.add("FORECAST_SURVIVABILITY_CONTINUITY_WEAKNESS");
  }

  if (params.longHorizonWeakness) {
    warnings.add("LONG_HORIZON_CONTINUITY_DURABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_FORECAST_CONTINUITY_DEGRADATION");
  }

  if (params.recursiveDegradation) {
    warnings.add("RECURSIVE_SURVIVABILITY_CONTINUITY_DEGRADATION");
  }

  if (params.rollbackWeakness) {
    warnings.add("ROLLBACK_SURVIVABILITY_CONTINUITY_WEAKNESS");
  }

  if (params.containmentRisk) {
    warnings.add("PROJECTED_CONTAINMENT_CONTINUITY_RISK");
  }

  if (params.doctrineDrift) {
    warnings.add("DOCTRINE_CONTINUITY_DRIFT");
  }

  if (params.institutionalRisk) {
    warnings.add("INSTITUTIONAL_CONTINUITY_DURABILITY_RISK");
  }

  if (params.entropyAcceleration) {
    warnings.add("ENTROPY_CONTINUITY_ACCELERATION");
  }

  if (params.lineageWeakness) {
    warnings.add("LINEAGE_CONTINUITY_PRESERVATION_WEAKNESS");
  }

  if (params.explainabilityDecay) {
    warnings.add("EXPLAINABILITY_CONTINUITY_DECAY");
  }

  if (params.reevaluationRequired) {
    warnings.add("FORECAST_CONTINUITY_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("FORECAST_CONTINUITY_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_FORECAST_CONTINUITY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["forecast survivability continuity integrity", 0],
  )[0];
}

function classifyContinuity(params: {
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
  survivabilityContinuityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_forecast_continuity_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_forecast_continuity";
  }

  if (params.recursiveDegradation || params.entropyAcceleration || params.containmentRisk) {
    return "forecast_survivability_continuity_unstable";
  }

  if (params.rollbackWeakness || params.doctrineDrift || params.institutionalRisk) {
    return "forecast_survivability_continuity_degrading";
  }

  if (
    params.longHorizonWeakness ||
    params.lineageWeakness ||
    params.explainabilityDecay ||
    params.survivabilityContinuityWeakness
  ) {
    return "forecast_survivability_continuity_degrading";
  }

  if (params.continuationRequired) {
    return "forecast_survivability_continuity_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_forecast_survivability_continuity";
  }

  return "durable_forecast_survivability_continuity";
}

export function evaluateCountyGovernanceRestorationForecastSurvivabilityContinuityIntegrity(
  input: CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityInput,
): CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityResult {
  const forecastSurvivabilityContinuityIntegrityScore = clampScore(
    input.forecastSurvivabilityContinuityIntegrityScore,
  );
  const longHorizonContinuityDurabilityScore = clampScore(input.longHorizonContinuityDurabilityScore);
  const failClosedContinuityPreservationScore = clampScore(input.failClosedContinuityPreservationScore);
  const recursiveSurvivabilityContinuityRiskScore = clampScore(input.recursiveSurvivabilityContinuityRiskScore);
  const rollbackSurvivabilityContinuityScore = clampScore(input.rollbackSurvivabilityContinuityScore);
  const projectedContainmentContinuityScore = clampScore(input.projectedContainmentContinuityScore);
  const doctrineContinuityStabilityScore = clampScore(input.doctrineContinuityStabilityScore);
  const institutionalContinuityDurabilityScore = clampScore(input.institutionalContinuityDurabilityScore);
  const entropyContinuityAccelerationScore = clampScore(input.entropyContinuityAccelerationScore);
  const lineageContinuityPreservationScore = clampScore(input.lineageContinuityPreservationScore);
  const explainabilityContinuityDurabilityScore = clampScore(input.explainabilityContinuityDurabilityScore);
  const continuityReevaluationPressureScore = clampScore(input.continuityReevaluationPressureScore);

  const failClosedContinuityDegrading = failClosedContinuityPreservationScore < 55;
  const collapseSensitiveContinuityEscalation =
    recursiveSurvivabilityContinuityRiskScore >= 92 ||
    entropyContinuityAccelerationScore >= 92 ||
    (projectedContainmentContinuityScore < 35 &&
      (failClosedContinuityPreservationScore < 65 || longHorizonContinuityDurabilityScore < 55));
  const recursiveContinuityDegradationDetected =
    recursiveSurvivabilityContinuityRiskScore >= 72 ||
    (recursiveSurvivabilityContinuityRiskScore >= 58 && doctrineContinuityStabilityScore < 65);
  const entropyContinuityAccelerationDetected =
    entropyContinuityAccelerationScore >= 72 ||
    (entropyContinuityAccelerationScore >= 58 && longHorizonContinuityDurabilityScore < 65);
  const containmentContinuityRiskDetected =
    projectedContainmentContinuityScore < 55 ||
    (projectedContainmentContinuityScore < 65 && recursiveSurvivabilityContinuityRiskScore >= 58);
  const rollbackContinuityWeaknessDetected = rollbackSurvivabilityContinuityScore < 55;
  const doctrineContinuityDrift = doctrineContinuityStabilityScore < 65;
  const institutionalContinuityDurabilityRisk = institutionalContinuityDurabilityScore < 65;
  const longHorizonContinuityDurabilityWeakness = longHorizonContinuityDurabilityScore < 65;
  const lineageContinuityPreservationWeakness = lineageContinuityPreservationScore < 65;
  const explainabilityContinuityDecay = explainabilityContinuityDurabilityScore < 65;
  const survivabilityContinuityWeakness = forecastSurvivabilityContinuityIntegrityScore < 75;
  const reevaluationRequired =
    continuityReevaluationPressureScore >= 58 ||
    longHorizonContinuityDurabilityWeakness ||
    lineageContinuityPreservationWeakness ||
    explainabilityContinuityDecay ||
    doctrineContinuityDrift ||
    institutionalContinuityDurabilityRisk;

  const continuitySeverityScore = clampScore(
    maxScore([
      inverseHealthScore(forecastSurvivabilityContinuityIntegrityScore),
      inverseHealthScore(longHorizonContinuityDurabilityScore),
      inverseHealthScore(failClosedContinuityPreservationScore),
      recursiveSurvivabilityContinuityRiskScore,
      inverseHealthScore(rollbackSurvivabilityContinuityScore),
      inverseHealthScore(projectedContainmentContinuityScore),
      inverseHealthScore(doctrineContinuityStabilityScore),
      inverseHealthScore(institutionalContinuityDurabilityScore),
      entropyContinuityAccelerationScore,
      inverseHealthScore(lineageContinuityPreservationScore),
      inverseHealthScore(explainabilityContinuityDurabilityScore),
      continuityReevaluationPressureScore,
    ]),
  );

  const longHorizonContinuity = classifyLongHorizonContinuity({
    forecastSurvivabilityContinuityIntegrityScore,
    longHorizonContinuityDurabilityScore,
    failClosedContinuityPreservationScore,
    institutionalContinuityDurabilityScore,
    entropyContinuityAccelerationScore,
  });
  const continuityExposureLevel = classifyExposure(continuitySeverityScore);
  const continuityReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      continuitySeverityScore,
      continuityReevaluationPressureScore,
      entropyContinuityAccelerationScore,
      recursiveSurvivabilityContinuityRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedContinuityDegrading &&
    !collapseSensitiveContinuityEscalation &&
    !recursiveContinuityDegradationDetected &&
    !entropyContinuityAccelerationDetected &&
    !containmentContinuityRiskDetected &&
    continuitySeverityScore >= 35 &&
    continuitySeverityScore < 72;

  const warningCodes = buildWarnings({
    survivabilityContinuityWeakness,
    longHorizonWeakness: longHorizonContinuityDurabilityWeakness,
    failClosedDegradation: failClosedContinuityDegrading,
    recursiveDegradation: recursiveContinuityDegradationDetected,
    rollbackWeakness: rollbackContinuityWeaknessDetected,
    containmentRisk: containmentContinuityRiskDetected,
    doctrineDrift: doctrineContinuityDrift,
    institutionalRisk: institutionalContinuityDurabilityRisk,
    entropyAcceleration: entropyContinuityAccelerationDetected,
    lineageWeakness: lineageContinuityPreservationWeakness,
    explainabilityDecay: explainabilityContinuityDecay,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveContinuityEscalation,
  });

  const continuityIntegrityLevel = classifyContinuity({
    failClosedDegradation: failClosedContinuityDegrading,
    collapseSensitive: collapseSensitiveContinuityEscalation,
    recursiveDegradation: recursiveContinuityDegradationDetected,
    entropyAcceleration: entropyContinuityAccelerationDetected,
    containmentRisk: containmentContinuityRiskDetected,
    rollbackWeakness: rollbackContinuityWeaknessDetected,
    doctrineDrift: doctrineContinuityDrift,
    institutionalRisk: institutionalContinuityDurabilityRisk,
    longHorizonWeakness: longHorizonContinuityDurabilityWeakness,
    lineageWeakness: lineageContinuityPreservationWeakness,
    explainabilityDecay: explainabilityContinuityDecay,
    survivabilityContinuityWeakness,
    continuationRequired,
    severityScore: continuitySeverityScore,
  });

  const primaryContinuityDriver = selectPrimaryDriver({
    "forecast survivability continuity weakness": inverseHealthScore(forecastSurvivabilityContinuityIntegrityScore),
    "long-horizon continuity durability weakness": inverseHealthScore(longHorizonContinuityDurabilityScore),
    "fail-closed continuity degradation": inverseHealthScore(failClosedContinuityPreservationScore),
    "recursive survivability continuity degradation": recursiveSurvivabilityContinuityRiskScore,
    "rollback survivability continuity weakness": inverseHealthScore(rollbackSurvivabilityContinuityScore),
    "projected containment continuity risk": inverseHealthScore(projectedContainmentContinuityScore),
    "doctrine continuity drift": inverseHealthScore(doctrineContinuityStabilityScore),
    "institutional continuity durability risk": inverseHealthScore(institutionalContinuityDurabilityScore),
    "entropy continuity acceleration": entropyContinuityAccelerationScore,
    "lineage continuity preservation weakness": inverseHealthScore(lineageContinuityPreservationScore),
    "explainability continuity decay": inverseHealthScore(explainabilityContinuityDurabilityScore),
    "continuity reevaluation pressure": continuityReevaluationPressureScore,
  });

  return {
    continuityIntegrityLevel,
    continuitySeverityScore,
    continuityExposureLevel,
    continuityReevaluationRequirementLevel,
    longHorizonContinuity,
    continuationRequired,
    failClosedContinuityDegrading,
    recursiveContinuityDegradationDetected,
    rollbackContinuityWeaknessDetected,
    containmentContinuityRiskDetected,
    entropyContinuityAccelerationDetected,
    collapseSensitiveContinuityEscalation,
    warningCodes,
    explainability: {
      primaryContinuityDriver,
      dominantContinuityEscalationReason:
        warningCodes[0] ?? "No deterministic forecast survivability continuity escalation threshold was crossed.",
      containmentContinuityAssessment: containmentContinuityRiskDetected
        ? "Projected containment is not strong enough to preserve forecast-stress continuity integrity."
        : "Projected containment remains continuity-preserving for the current caller-supplied forecast context.",
      longHorizonContinuityAssessment:
        longHorizonContinuity === "durable"
          ? "Long-horizon forecast survivability continuity is durable under the current inputs."
          : `Long-horizon forecast survivability continuity is ${longHorizonContinuity} under the current inputs.`,
      failClosedContinuityAssessment: failClosedContinuityDegrading
        ? "Fail-closed continuity preservation is degrading and overrides optimistic continuity assumptions."
        : "Fail-closed continuity preservation remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
