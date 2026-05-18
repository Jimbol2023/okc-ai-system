export type CountyGovernanceRestorationRegressionForecastIntegrityLevel =
  | "stable_forecast_integrity"
  | "bounded_forecast_regression_risk"
  | "forecast_continuation_required"
  | "forecast_regression_escalating"
  | "forecast_restoration_instability"
  | "forecast_fail_closed_degradation"
  | "forecast_collapse_sensitive";

export type CountyGovernanceRestorationRegressionForecastExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRestorationRegressionForecastReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceRestorationRegressionForecastSustainability =
  | "durable"
  | "watch"
  | "drifting"
  | "unstable"
  | "non_sustainable";

export type CountyGovernanceRestorationRegressionForecastIntegrityWarningCode =
  | "FORECAST_RESTORATION_REGRESSION_EXPOSURE"
  | "FORECAST_FAIL_CLOSED_DEGRADATION"
  | "FORECAST_RECURSIVE_REGRESSION_AMPLIFICATION"
  | "FORECAST_RESTORATION_INSTABILITY"
  | "FORECAST_SURVIVABILITY_CONTAINMENT_WEAKNESS"
  | "FORECAST_CONTINUITY_DECAY_RISK"
  | "FORECAST_DOCTRINE_DIVERGENCE"
  | "FORECAST_ROLLBACK_INSTABILITY"
  | "FORECAST_RESTORATION_DRIFT_TRAJECTORY"
  | "FORECAST_INSTITUTIONAL_REGRESSION_RISK"
  | "FORECAST_NON_REGRESSION_CONFIDENCE_WEAKNESS"
  | "FORECAST_SUSTAINABILITY_DEGRADATION"
  | "FORECAST_LINEAGE_CONTINUITY_WEAKNESS"
  | "FORECAST_ENTROPY_ACCELERATION"
  | "FORECAST_CONTAINMENT_BREAKDOWN"
  | "FORECAST_EXPLAINABILITY_DECAY"
  | "FORECAST_REEVALUATION_REQUIRED"
  | "FORECAST_CONTINUATION_REQUIRED"
  | "FORECAST_COLLAPSE_SENSITIVE_ESCALATION";

export type CountyGovernanceRestorationRegressionForecastIntegrityInput = {
  restorationForecastStabilityScore: number;
  failClosedForecastIntegrityScore: number;
  recursiveRegressionForecastExposureScore: number;
  survivabilityContainmentForecastScore: number;
  continuityForecastDurabilityScore: number;
  doctrineForecastConsistencyScore: number;
  rollbackForecastStabilityScore: number;
  restorationDriftTrajectoryScore: number;
  institutionalForecastDurabilityScore: number;
  nonRegressionForecastConfidenceScore: number;
  sustainabilityForecastIntegrityScore: number;
  lineageContinuityForecastScore: number;
  governanceEntropyAccelerationScore: number;
  containmentBreakdownForecastScore: number;
  forecastExplainabilityDurabilityScore: number;
  reevaluationPressureForecastScore: number;
};

export type CountyGovernanceRestorationRegressionForecastIntegrityResult = {
  forecastIntegrityLevel: CountyGovernanceRestorationRegressionForecastIntegrityLevel;
  forecastSeverityScore: number;
  forecastExposureLevel: CountyGovernanceRestorationRegressionForecastExposureLevel;
  forecastReevaluationRequirementLevel: CountyGovernanceRestorationRegressionForecastReevaluationRequirementLevel;
  forecastSustainability: CountyGovernanceRestorationRegressionForecastSustainability;
  continuationRequired: boolean;
  failClosedForecastDegrading: boolean;
  recursiveForecastAmplificationDetected: boolean;
  rollbackForecastInstabilityDetected: boolean;
  entropyAccelerationDetected: boolean;
  containmentBreakdownForecastDetected: boolean;
  collapseSensitiveForecastEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryForecastDriver: string;
    dominantForecastEscalationReason: string;
    containmentForecastAssessment: string;
    restorationForecastDurabilityAssessment: string;
    entropyTrajectoryAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceRestorationRegressionForecastIntegrityWarningCode[] = [
  "FORECAST_FAIL_CLOSED_DEGRADATION",
  "FORECAST_COLLAPSE_SENSITIVE_ESCALATION",
  "FORECAST_RECURSIVE_REGRESSION_AMPLIFICATION",
  "FORECAST_ENTROPY_ACCELERATION",
  "FORECAST_CONTAINMENT_BREAKDOWN",
  "FORECAST_RESTORATION_INSTABILITY",
  "FORECAST_ROLLBACK_INSTABILITY",
  "FORECAST_DOCTRINE_DIVERGENCE",
  "FORECAST_RESTORATION_DRIFT_TRAJECTORY",
  "FORECAST_SURVIVABILITY_CONTAINMENT_WEAKNESS",
  "FORECAST_CONTINUITY_DECAY_RISK",
  "FORECAST_LINEAGE_CONTINUITY_WEAKNESS",
  "FORECAST_NON_REGRESSION_CONFIDENCE_WEAKNESS",
  "FORECAST_EXPLAINABILITY_DECAY",
  "FORECAST_SUSTAINABILITY_DEGRADATION",
  "FORECAST_REEVALUATION_REQUIRED",
  "FORECAST_CONTINUATION_REQUIRED",
  "FORECAST_RESTORATION_REGRESSION_EXPOSURE",
  "FORECAST_INSTITUTIONAL_REGRESSION_RISK",
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

function classifyForecastExposure(score: number): CountyGovernanceRestorationRegressionForecastExposureLevel {
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

function classifyForecastReevaluation(
  score: number,
): CountyGovernanceRestorationRegressionForecastReevaluationRequirementLevel {
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

function classifyForecastSustainability(params: {
  restorationForecastStabilityScore: number;
  rollbackForecastStabilityScore: number;
  restorationDriftTrajectoryScore: number;
  sustainabilityForecastIntegrityScore: number;
  institutionalForecastDurabilityScore: number;
  governanceEntropyAccelerationScore: number;
}): CountyGovernanceRestorationRegressionForecastSustainability {
  if (
    params.restorationForecastStabilityScore < 35 ||
    params.rollbackForecastStabilityScore < 35 ||
    params.sustainabilityForecastIntegrityScore < 35 ||
    params.restorationDriftTrajectoryScore >= 88 ||
    params.governanceEntropyAccelerationScore >= 88
  ) {
    return "non_sustainable";
  }

  if (
    params.restorationForecastStabilityScore < 55 ||
    params.rollbackForecastStabilityScore < 55 ||
    params.sustainabilityForecastIntegrityScore < 55 ||
    params.restorationDriftTrajectoryScore >= 72 ||
    params.institutionalForecastDurabilityScore < 55 ||
    params.governanceEntropyAccelerationScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.restorationForecastStabilityScore < 75 ||
    params.rollbackForecastStabilityScore < 75 ||
    params.sustainabilityForecastIntegrityScore < 75 ||
    params.restorationDriftTrajectoryScore >= 45 ||
    params.institutionalForecastDurabilityScore < 75 ||
    params.governanceEntropyAccelerationScore >= 50
  ) {
    return "drifting";
  }

  if (
    params.restorationForecastStabilityScore < 88 ||
    params.sustainabilityForecastIntegrityScore < 88 ||
    params.institutionalForecastDurabilityScore < 88 ||
    params.restorationDriftTrajectoryScore >= 25 ||
    params.governanceEntropyAccelerationScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  restorationRegressionExposure: boolean;
  failClosedDegradation: boolean;
  recursiveAmplification: boolean;
  restorationInstability: boolean;
  survivabilityContainmentWeakness: boolean;
  continuityDecayRisk: boolean;
  doctrineDivergence: boolean;
  rollbackInstability: boolean;
  restorationDriftTrajectory: boolean;
  institutionalRegressionRisk: boolean;
  nonRegressionConfidenceWeakness: boolean;
  sustainabilityDegradation: boolean;
  lineageContinuityWeakness: boolean;
  entropyAcceleration: boolean;
  containmentBreakdown: boolean;
  explainabilityDecay: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitiveEscalation: boolean;
}): CountyGovernanceRestorationRegressionForecastIntegrityWarningCode[] {
  const warnings = new Set<CountyGovernanceRestorationRegressionForecastIntegrityWarningCode>();

  if (params.restorationRegressionExposure) {
    warnings.add("FORECAST_RESTORATION_REGRESSION_EXPOSURE");
  }

  if (params.failClosedDegradation) {
    warnings.add("FORECAST_FAIL_CLOSED_DEGRADATION");
  }

  if (params.recursiveAmplification) {
    warnings.add("FORECAST_RECURSIVE_REGRESSION_AMPLIFICATION");
  }

  if (params.restorationInstability) {
    warnings.add("FORECAST_RESTORATION_INSTABILITY");
  }

  if (params.survivabilityContainmentWeakness) {
    warnings.add("FORECAST_SURVIVABILITY_CONTAINMENT_WEAKNESS");
  }

  if (params.continuityDecayRisk) {
    warnings.add("FORECAST_CONTINUITY_DECAY_RISK");
  }

  if (params.doctrineDivergence) {
    warnings.add("FORECAST_DOCTRINE_DIVERGENCE");
  }

  if (params.rollbackInstability) {
    warnings.add("FORECAST_ROLLBACK_INSTABILITY");
  }

  if (params.restorationDriftTrajectory) {
    warnings.add("FORECAST_RESTORATION_DRIFT_TRAJECTORY");
  }

  if (params.institutionalRegressionRisk) {
    warnings.add("FORECAST_INSTITUTIONAL_REGRESSION_RISK");
  }

  if (params.nonRegressionConfidenceWeakness) {
    warnings.add("FORECAST_NON_REGRESSION_CONFIDENCE_WEAKNESS");
  }

  if (params.sustainabilityDegradation) {
    warnings.add("FORECAST_SUSTAINABILITY_DEGRADATION");
  }

  if (params.lineageContinuityWeakness) {
    warnings.add("FORECAST_LINEAGE_CONTINUITY_WEAKNESS");
  }

  if (params.entropyAcceleration) {
    warnings.add("FORECAST_ENTROPY_ACCELERATION");
  }

  if (params.containmentBreakdown) {
    warnings.add("FORECAST_CONTAINMENT_BREAKDOWN");
  }

  if (params.explainabilityDecay) {
    warnings.add("FORECAST_EXPLAINABILITY_DECAY");
  }

  if (params.reevaluationRequired) {
    warnings.add("FORECAST_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("FORECAST_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitiveEscalation) {
    warnings.add("FORECAST_COLLAPSE_SENSITIVE_ESCALATION");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["restoration forecast stability", 0],
  )[0];
}

function classifyForecastIntegrity(params: {
  failClosedDegradation: boolean;
  collapseSensitiveEscalation: boolean;
  recursiveAmplification: boolean;
  entropyAcceleration: boolean;
  containmentBreakdown: boolean;
  restorationInstability: boolean;
  rollbackInstability: boolean;
  doctrineDivergence: boolean;
  restorationDriftTrajectory: boolean;
  survivabilityContainmentWeakness: boolean;
  continuationRequired: boolean;
  forecastSeverityScore: number;
}): CountyGovernanceRestorationRegressionForecastIntegrityLevel {
  if (params.failClosedDegradation) {
    return "forecast_fail_closed_degradation";
  }

  if (params.collapseSensitiveEscalation) {
    return "forecast_collapse_sensitive";
  }

  if (params.recursiveAmplification || params.entropyAcceleration || params.containmentBreakdown) {
    return "forecast_regression_escalating";
  }

  if (
    params.restorationInstability ||
    params.rollbackInstability ||
    params.doctrineDivergence ||
    params.restorationDriftTrajectory ||
    params.survivabilityContainmentWeakness
  ) {
    return "forecast_restoration_instability";
  }

  if (params.continuationRequired) {
    return "forecast_continuation_required";
  }

  if (params.forecastSeverityScore >= 25) {
    return "bounded_forecast_regression_risk";
  }

  return "stable_forecast_integrity";
}

export function evaluateCountyGovernanceRestorationRegressionForecastIntegrity(
  input: CountyGovernanceRestorationRegressionForecastIntegrityInput,
): CountyGovernanceRestorationRegressionForecastIntegrityResult {
  const restorationForecastStabilityScore = clampScore(input.restorationForecastStabilityScore);
  const failClosedForecastIntegrityScore = clampScore(input.failClosedForecastIntegrityScore);
  const recursiveRegressionForecastExposureScore = clampScore(input.recursiveRegressionForecastExposureScore);
  const survivabilityContainmentForecastScore = clampScore(input.survivabilityContainmentForecastScore);
  const continuityForecastDurabilityScore = clampScore(input.continuityForecastDurabilityScore);
  const doctrineForecastConsistencyScore = clampScore(input.doctrineForecastConsistencyScore);
  const rollbackForecastStabilityScore = clampScore(input.rollbackForecastStabilityScore);
  const restorationDriftTrajectoryScore = clampScore(input.restorationDriftTrajectoryScore);
  const institutionalForecastDurabilityScore = clampScore(input.institutionalForecastDurabilityScore);
  const nonRegressionForecastConfidenceScore = clampScore(input.nonRegressionForecastConfidenceScore);
  const sustainabilityForecastIntegrityScore = clampScore(input.sustainabilityForecastIntegrityScore);
  const lineageContinuityForecastScore = clampScore(input.lineageContinuityForecastScore);
  const governanceEntropyAccelerationScore = clampScore(input.governanceEntropyAccelerationScore);
  const containmentBreakdownForecastScore = clampScore(input.containmentBreakdownForecastScore);
  const forecastExplainabilityDurabilityScore = clampScore(input.forecastExplainabilityDurabilityScore);
  const reevaluationPressureForecastScore = clampScore(input.reevaluationPressureForecastScore);

  const failClosedForecastDegrading = failClosedForecastIntegrityScore < 55;
  const collapseSensitiveForecastEscalation =
    recursiveRegressionForecastExposureScore >= 92 ||
    governanceEntropyAccelerationScore >= 92 ||
    containmentBreakdownForecastScore >= 92 ||
    (restorationDriftTrajectoryScore >= 88 &&
      (failClosedForecastIntegrityScore < 65 ||
        lineageContinuityForecastScore < 55 ||
        institutionalForecastDurabilityScore < 55));
  const recursiveForecastAmplificationDetected =
    recursiveRegressionForecastExposureScore >= 72 ||
    (recursiveRegressionForecastExposureScore >= 58 && restorationDriftTrajectoryScore >= 58);
  const entropyAccelerationDetected =
    governanceEntropyAccelerationScore >= 72 ||
    (governanceEntropyAccelerationScore >= 58 && restorationDriftTrajectoryScore >= 58);
  const containmentBreakdownForecastDetected =
    containmentBreakdownForecastScore >= 72 ||
    (containmentBreakdownForecastScore >= 58 && survivabilityContainmentForecastScore < 65);
  const restorationInstability =
    restorationForecastStabilityScore < 55 ||
    sustainabilityForecastIntegrityScore < 55 ||
    institutionalForecastDurabilityScore < 55;
  const rollbackForecastInstabilityDetected = rollbackForecastStabilityScore < 55;
  const doctrineDivergence = doctrineForecastConsistencyScore < 65;
  const restorationDriftTrajectoryRisk = restorationDriftTrajectoryScore >= 65;
  const survivabilityContainmentWeakness = survivabilityContainmentForecastScore < 55;
  const continuityDecayRisk = continuityForecastDurabilityScore < 65;
  const lineageContinuityWeakness = lineageContinuityForecastScore < 65;
  const nonRegressionConfidenceWeakness = nonRegressionForecastConfidenceScore < 65;
  const forecastExplainabilityDecay = forecastExplainabilityDurabilityScore < 65;
  const sustainabilityDegradation = sustainabilityForecastIntegrityScore < 65;
  const restorationRegressionExposure =
    restorationForecastStabilityScore < 75 ||
    restorationDriftTrajectoryScore >= 45 ||
    governanceEntropyAccelerationScore >= 45 ||
    containmentBreakdownForecastScore >= 45;
  const institutionalRegressionRisk = institutionalForecastDurabilityScore < 65;
  const reevaluationRequired =
    reevaluationPressureForecastScore >= 58 ||
    restorationDriftTrajectoryScore >= 58 ||
    governanceEntropyAccelerationScore >= 58 ||
    containmentBreakdownForecastScore >= 58 ||
    continuityDecayRisk ||
    lineageContinuityWeakness ||
    nonRegressionConfidenceWeakness ||
    forecastExplainabilityDecay;

  const forecastSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(restorationForecastStabilityScore),
      inverseHealthScore(failClosedForecastIntegrityScore),
      recursiveRegressionForecastExposureScore,
      inverseHealthScore(survivabilityContainmentForecastScore),
      inverseHealthScore(continuityForecastDurabilityScore),
      inverseHealthScore(doctrineForecastConsistencyScore),
      inverseHealthScore(rollbackForecastStabilityScore),
      restorationDriftTrajectoryScore,
      inverseHealthScore(institutionalForecastDurabilityScore),
      inverseHealthScore(nonRegressionForecastConfidenceScore),
      inverseHealthScore(sustainabilityForecastIntegrityScore),
      inverseHealthScore(lineageContinuityForecastScore),
      governanceEntropyAccelerationScore,
      containmentBreakdownForecastScore,
      inverseHealthScore(forecastExplainabilityDurabilityScore),
      reevaluationPressureForecastScore,
    ]),
  );

  const forecastSustainability = classifyForecastSustainability({
    restorationForecastStabilityScore,
    rollbackForecastStabilityScore,
    restorationDriftTrajectoryScore,
    sustainabilityForecastIntegrityScore,
    institutionalForecastDurabilityScore,
    governanceEntropyAccelerationScore,
  });
  const forecastExposureLevel = classifyForecastExposure(forecastSeverityScore);
  const forecastReevaluationRequirementLevel = classifyForecastReevaluation(
    Math.max(
      forecastSeverityScore,
      reevaluationPressureForecastScore,
      restorationDriftTrajectoryScore,
      governanceEntropyAccelerationScore,
      containmentBreakdownForecastScore,
    ),
  );
  const continuationRequired =
    !failClosedForecastDegrading &&
    !collapseSensitiveForecastEscalation &&
    !recursiveForecastAmplificationDetected &&
    !entropyAccelerationDetected &&
    !containmentBreakdownForecastDetected &&
    forecastSeverityScore >= 35 &&
    forecastSeverityScore < 72;

  const warningCodes = buildWarnings({
    restorationRegressionExposure,
    failClosedDegradation: failClosedForecastDegrading,
    recursiveAmplification: recursiveForecastAmplificationDetected,
    restorationInstability,
    survivabilityContainmentWeakness,
    continuityDecayRisk,
    doctrineDivergence,
    rollbackInstability: rollbackForecastInstabilityDetected,
    restorationDriftTrajectory: restorationDriftTrajectoryRisk,
    institutionalRegressionRisk,
    nonRegressionConfidenceWeakness,
    sustainabilityDegradation,
    lineageContinuityWeakness,
    entropyAcceleration: entropyAccelerationDetected,
    containmentBreakdown: containmentBreakdownForecastDetected,
    explainabilityDecay: forecastExplainabilityDecay,
    reevaluationRequired,
    continuationRequired,
    collapseSensitiveEscalation: collapseSensitiveForecastEscalation,
  });

  const forecastIntegrityLevel = classifyForecastIntegrity({
    failClosedDegradation: failClosedForecastDegrading,
    collapseSensitiveEscalation: collapseSensitiveForecastEscalation,
    recursiveAmplification: recursiveForecastAmplificationDetected,
    entropyAcceleration: entropyAccelerationDetected,
    containmentBreakdown: containmentBreakdownForecastDetected,
    restorationInstability,
    rollbackInstability: rollbackForecastInstabilityDetected,
    doctrineDivergence,
    restorationDriftTrajectory: restorationDriftTrajectoryRisk,
    survivabilityContainmentWeakness,
    continuationRequired,
    forecastSeverityScore,
  });

  const primaryForecastDriver = selectPrimaryDriver({
    "restoration forecast instability": inverseHealthScore(restorationForecastStabilityScore),
    "fail-closed forecast degradation": inverseHealthScore(failClosedForecastIntegrityScore),
    "recursive regression forecast amplification": recursiveRegressionForecastExposureScore,
    "survivability containment forecast weakness": inverseHealthScore(survivabilityContainmentForecastScore),
    "continuity forecast decay": inverseHealthScore(continuityForecastDurabilityScore),
    "doctrine forecast divergence": inverseHealthScore(doctrineForecastConsistencyScore),
    "rollback forecast instability": inverseHealthScore(rollbackForecastStabilityScore),
    "restoration drift trajectory": restorationDriftTrajectoryScore,
    "institutional forecast durability weakness": inverseHealthScore(institutionalForecastDurabilityScore),
    "non-regression forecast confidence weakness": inverseHealthScore(nonRegressionForecastConfidenceScore),
    "sustainability forecast degradation": inverseHealthScore(sustainabilityForecastIntegrityScore),
    "lineage continuity forecast weakness": inverseHealthScore(lineageContinuityForecastScore),
    "governance entropy acceleration": governanceEntropyAccelerationScore,
    "containment breakdown forecast": containmentBreakdownForecastScore,
    "forecast explainability durability decay": inverseHealthScore(forecastExplainabilityDurabilityScore),
    "forecast reevaluation pressure": reevaluationPressureForecastScore,
  });

  return {
    forecastIntegrityLevel,
    forecastSeverityScore,
    forecastExposureLevel,
    forecastReevaluationRequirementLevel,
    forecastSustainability,
    continuationRequired,
    failClosedForecastDegrading,
    recursiveForecastAmplificationDetected,
    rollbackForecastInstabilityDetected,
    entropyAccelerationDetected,
    containmentBreakdownForecastDetected,
    collapseSensitiveForecastEscalation,
    warningCodes,
    explainability: {
      primaryForecastDriver,
      dominantForecastEscalationReason:
        warningCodes[0] ?? "No deterministic restoration regression forecast escalation threshold was crossed.",
      containmentForecastAssessment: containmentBreakdownForecastDetected
        ? "Forecast containment is weakening and may allow future restoration regression spread."
        : "Forecast containment remains bounded for the current caller-supplied restoration context.",
      restorationForecastDurabilityAssessment:
        forecastSustainability === "durable"
          ? "Restoration forecast durability is durable under the current forecast inputs."
          : `Restoration forecast durability is ${forecastSustainability} under the current forecast inputs.`,
      entropyTrajectoryAssessment: entropyAccelerationDetected
        ? "Governance entropy acceleration is forecast to amplify restoration regression pressure."
        : "Governance entropy acceleration remains bounded under the current forecast inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
