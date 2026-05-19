export type CountyGovernanceRecoverySustainabilityContinuitySurvivabilityIntegrityLevel =
  | "durable_sustainability_continuity_survivability"
  | "bounded_sustainability_continuity_survivability"
  | "sustainability_continuity_survivability_continuation_required"
  | "sustainability_continuity_survivability_degrading"
  | "sustainability_continuity_survivability_unstable"
  | "fail_closed_survivability_degradation"
  | "collapse_sensitive_survivability";

export type CountyGovernanceRecoverySustainabilityContinuitySurvivabilityExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRecoverySustainabilityContinuitySurvivabilityReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonSurvivability =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_survivable";

export type CountyGovernanceRecoverySustainabilityContinuitySurvivabilityWarningCode =
  | "SUSTAINABILITY_CONTINUITY_SURVIVABILITY_WEAKNESS"
  | "LONG_HORIZON_SURVIVABILITY_DURABILITY_WEAKNESS"
  | "FAIL_CLOSED_SURVIVABILITY_DEGRADATION"
  | "CONTINUITY_SURVIVABILITY_FATIGUE"
  | "RECURSIVE_SURVIVABILITY_DEGRADATION"
  | "INSTITUTIONAL_SURVIVABILITY_DURABILITY_RISK"
  | "CONTAINMENT_SURVIVABILITY_RISK"
  | "DOCTRINE_SURVIVABILITY_DRIFT"
  | "LINEAGE_SURVIVABILITY_PRESERVATION_WEAKNESS"
  | "ENTROPY_SURVIVABILITY_ACCELERATION"
  | "EXPLAINABILITY_SURVIVABILITY_DECAY"
  | "SURVIVABILITY_REEVALUATION_REQUIRED"
  | "SURVIVABILITY_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_SURVIVABILITY";

export type CountyGovernanceRecoverySustainabilityContinuitySurvivabilityInput = {
  sustainabilityContinuitySurvivabilityIntegrityScore: number;
  longHorizonSurvivabilityDurabilityScore: number;
  failClosedSurvivabilityPreservationScore: number;
  continuityFatigueRiskScore: number;
  recursiveSurvivabilityDegradationRiskScore: number;
  institutionalSurvivabilityDurabilityScore: number;
  containmentSurvivabilityStabilityScore: number;
  doctrineSurvivabilityStabilityScore: number;
  lineageSurvivabilityPreservationScore: number;
  entropySurvivabilityAccelerationScore: number;
  explainabilitySurvivabilityDurabilityScore: number;
  survivabilityReevaluationPressureScore: number;
};

export type CountyGovernanceRecoverySustainabilityContinuitySurvivabilityResult = {
  survivabilityIntegrityLevel: CountyGovernanceRecoverySustainabilityContinuitySurvivabilityIntegrityLevel;
  survivabilitySeverityScore: number;
  survivabilityExposureLevel: CountyGovernanceRecoverySustainabilityContinuitySurvivabilityExposureLevel;
  survivabilityReevaluationRequirementLevel: CountyGovernanceRecoverySustainabilityContinuitySurvivabilityReevaluationRequirementLevel;
  longHorizonSurvivability: CountyGovernanceLongHorizonSurvivability;
  continuationRequired: boolean;
  failClosedSurvivabilityDegrading: boolean;
  continuityFatigueDetected: boolean;
  recursiveSurvivabilityDegradationDetected: boolean;
  institutionalSurvivabilityWeaknessDetected: boolean;
  containmentSurvivabilityRiskDetected: boolean;
  entropySurvivabilityAccelerationDetected: boolean;
  collapseSensitiveSurvivabilityEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primarySurvivabilityDriver: string;
    dominantSurvivabilityEscalationReason: string;
    containmentSurvivabilityAssessment: string;
    longHorizonSurvivabilityAssessment: string;
    failClosedSurvivabilityAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceRecoverySustainabilityContinuitySurvivabilityWarningCode[] = [
  "FAIL_CLOSED_SURVIVABILITY_DEGRADATION",
  "COLLAPSE_SENSITIVE_SURVIVABILITY",
  "RECURSIVE_SURVIVABILITY_DEGRADATION",
  "ENTROPY_SURVIVABILITY_ACCELERATION",
  "CONTAINMENT_SURVIVABILITY_RISK",
  "CONTINUITY_SURVIVABILITY_FATIGUE",
  "DOCTRINE_SURVIVABILITY_DRIFT",
  "INSTITUTIONAL_SURVIVABILITY_DURABILITY_RISK",
  "LONG_HORIZON_SURVIVABILITY_DURABILITY_WEAKNESS",
  "LINEAGE_SURVIVABILITY_PRESERVATION_WEAKNESS",
  "EXPLAINABILITY_SURVIVABILITY_DECAY",
  "SUSTAINABILITY_CONTINUITY_SURVIVABILITY_WEAKNESS",
  "SURVIVABILITY_REEVALUATION_REQUIRED",
  "SURVIVABILITY_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceRecoverySustainabilityContinuitySurvivabilityExposureLevel {
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
): CountyGovernanceRecoverySustainabilityContinuitySurvivabilityReevaluationRequirementLevel {
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
  sustainabilityContinuitySurvivabilityIntegrityScore: number;
  longHorizonSurvivabilityDurabilityScore: number;
  failClosedSurvivabilityPreservationScore: number;
  institutionalSurvivabilityDurabilityScore: number;
  entropySurvivabilityAccelerationScore: number;
}): CountyGovernanceLongHorizonSurvivability {
  if (
    params.sustainabilityContinuitySurvivabilityIntegrityScore < 35 ||
    params.longHorizonSurvivabilityDurabilityScore < 35 ||
    params.failClosedSurvivabilityPreservationScore < 35 ||
    params.entropySurvivabilityAccelerationScore >= 88
  ) {
    return "non_survivable";
  }

  if (
    params.sustainabilityContinuitySurvivabilityIntegrityScore < 55 ||
    params.longHorizonSurvivabilityDurabilityScore < 55 ||
    params.failClosedSurvivabilityPreservationScore < 55 ||
    params.institutionalSurvivabilityDurabilityScore < 55 ||
    params.entropySurvivabilityAccelerationScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.sustainabilityContinuitySurvivabilityIntegrityScore < 75 ||
    params.longHorizonSurvivabilityDurabilityScore < 75 ||
    params.institutionalSurvivabilityDurabilityScore < 75 ||
    params.entropySurvivabilityAccelerationScore >= 50
  ) {
    return "strained";
  }

  if (
    params.sustainabilityContinuitySurvivabilityIntegrityScore < 88 ||
    params.longHorizonSurvivabilityDurabilityScore < 88 ||
    params.institutionalSurvivabilityDurabilityScore < 88 ||
    params.entropySurvivabilityAccelerationScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  sustainabilityContinuitySurvivabilityWeakness: boolean;
  longHorizonWeakness: boolean;
  failClosedDegradation: boolean;
  continuityFatigue: boolean;
  recursiveDegradation: boolean;
  institutionalRisk: boolean;
  containmentRisk: boolean;
  doctrineDrift: boolean;
  lineageWeakness: boolean;
  entropyAcceleration: boolean;
  explainabilityDecay: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceRecoverySustainabilityContinuitySurvivabilityWarningCode[] {
  const warnings = new Set<CountyGovernanceRecoverySustainabilityContinuitySurvivabilityWarningCode>();

  if (params.sustainabilityContinuitySurvivabilityWeakness) {
    warnings.add("SUSTAINABILITY_CONTINUITY_SURVIVABILITY_WEAKNESS");
  }

  if (params.longHorizonWeakness) {
    warnings.add("LONG_HORIZON_SURVIVABILITY_DURABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_SURVIVABILITY_DEGRADATION");
  }

  if (params.continuityFatigue) {
    warnings.add("CONTINUITY_SURVIVABILITY_FATIGUE");
  }

  if (params.recursiveDegradation) {
    warnings.add("RECURSIVE_SURVIVABILITY_DEGRADATION");
  }

  if (params.institutionalRisk) {
    warnings.add("INSTITUTIONAL_SURVIVABILITY_DURABILITY_RISK");
  }

  if (params.containmentRisk) {
    warnings.add("CONTAINMENT_SURVIVABILITY_RISK");
  }

  if (params.doctrineDrift) {
    warnings.add("DOCTRINE_SURVIVABILITY_DRIFT");
  }

  if (params.lineageWeakness) {
    warnings.add("LINEAGE_SURVIVABILITY_PRESERVATION_WEAKNESS");
  }

  if (params.entropyAcceleration) {
    warnings.add("ENTROPY_SURVIVABILITY_ACCELERATION");
  }

  if (params.explainabilityDecay) {
    warnings.add("EXPLAINABILITY_SURVIVABILITY_DECAY");
  }

  if (params.reevaluationRequired) {
    warnings.add("SURVIVABILITY_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("SURVIVABILITY_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_SURVIVABILITY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["sustainability continuity survivability integrity", 0],
  )[0];
}

function classifySurvivability(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDegradation: boolean;
  entropyAcceleration: boolean;
  containmentRisk: boolean;
  continuityFatigue: boolean;
  doctrineDrift: boolean;
  institutionalRisk: boolean;
  longHorizonWeakness: boolean;
  lineageWeakness: boolean;
  explainabilityDecay: boolean;
  sustainabilityContinuitySurvivabilityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceRecoverySustainabilityContinuitySurvivabilityIntegrityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_survivability_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_survivability";
  }

  if (
    params.recursiveDegradation ||
    params.entropyAcceleration ||
    params.containmentRisk ||
    params.continuityFatigue
  ) {
    return "sustainability_continuity_survivability_unstable";
  }

  if (params.doctrineDrift || params.institutionalRisk) {
    return "sustainability_continuity_survivability_degrading";
  }

  if (
    params.longHorizonWeakness ||
    params.lineageWeakness ||
    params.explainabilityDecay ||
    params.sustainabilityContinuitySurvivabilityWeakness
  ) {
    return "sustainability_continuity_survivability_degrading";
  }

  if (params.continuationRequired) {
    return "sustainability_continuity_survivability_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_sustainability_continuity_survivability";
  }

  return "durable_sustainability_continuity_survivability";
}

export function evaluateCountyGovernanceRecoverySustainabilityContinuitySurvivability(
  input: CountyGovernanceRecoverySustainabilityContinuitySurvivabilityInput,
): CountyGovernanceRecoverySustainabilityContinuitySurvivabilityResult {
  const sustainabilityContinuitySurvivabilityIntegrityScore = clampScore(
    input.sustainabilityContinuitySurvivabilityIntegrityScore,
  );
  const longHorizonSurvivabilityDurabilityScore = clampScore(input.longHorizonSurvivabilityDurabilityScore);
  const failClosedSurvivabilityPreservationScore = clampScore(input.failClosedSurvivabilityPreservationScore);
  const continuityFatigueRiskScore = clampScore(input.continuityFatigueRiskScore);
  const recursiveSurvivabilityDegradationRiskScore = clampScore(input.recursiveSurvivabilityDegradationRiskScore);
  const institutionalSurvivabilityDurabilityScore = clampScore(input.institutionalSurvivabilityDurabilityScore);
  const containmentSurvivabilityStabilityScore = clampScore(input.containmentSurvivabilityStabilityScore);
  const doctrineSurvivabilityStabilityScore = clampScore(input.doctrineSurvivabilityStabilityScore);
  const lineageSurvivabilityPreservationScore = clampScore(input.lineageSurvivabilityPreservationScore);
  const entropySurvivabilityAccelerationScore = clampScore(input.entropySurvivabilityAccelerationScore);
  const explainabilitySurvivabilityDurabilityScore = clampScore(input.explainabilitySurvivabilityDurabilityScore);
  const survivabilityReevaluationPressureScore = clampScore(input.survivabilityReevaluationPressureScore);

  const failClosedSurvivabilityDegrading = failClosedSurvivabilityPreservationScore < 55;
  const severeContinuityFatigue = continuityFatigueRiskScore >= 88;
  const collapseSensitiveSurvivabilityEscalation =
    recursiveSurvivabilityDegradationRiskScore >= 92 ||
    entropySurvivabilityAccelerationScore >= 92 ||
    (containmentSurvivabilityStabilityScore < 35 &&
      (failClosedSurvivabilityPreservationScore < 65 || longHorizonSurvivabilityDurabilityScore < 55));
  const recursiveSurvivabilityDegradationDetected =
    recursiveSurvivabilityDegradationRiskScore >= 72 ||
    (recursiveSurvivabilityDegradationRiskScore >= 58 && doctrineSurvivabilityStabilityScore < 65);
  const entropySurvivabilityAccelerationDetected =
    entropySurvivabilityAccelerationScore >= 72 ||
    (entropySurvivabilityAccelerationScore >= 58 && longHorizonSurvivabilityDurabilityScore < 65);
  const containmentSurvivabilityRiskDetected =
    containmentSurvivabilityStabilityScore < 55 ||
    (containmentSurvivabilityStabilityScore < 65 && recursiveSurvivabilityDegradationRiskScore >= 58);
  const continuityFatigueDetected =
    continuityFatigueRiskScore >= 72 ||
    (continuityFatigueRiskScore >= 58 && longHorizonSurvivabilityDurabilityScore < 65);
  const institutionalSurvivabilityWeaknessDetected = institutionalSurvivabilityDurabilityScore < 65;
  const doctrineSurvivabilityDrift = doctrineSurvivabilityStabilityScore < 65;
  const longHorizonSurvivabilityDurabilityWeakness = longHorizonSurvivabilityDurabilityScore < 65;
  const lineageSurvivabilityPreservationWeakness = lineageSurvivabilityPreservationScore < 65;
  const explainabilitySurvivabilityDecay = explainabilitySurvivabilityDurabilityScore < 65;
  const sustainabilityContinuitySurvivabilityWeakness =
    sustainabilityContinuitySurvivabilityIntegrityScore < 75;
  const reevaluationRequired =
    survivabilityReevaluationPressureScore >= 58 ||
    longHorizonSurvivabilityDurabilityWeakness ||
    lineageSurvivabilityPreservationWeakness ||
    explainabilitySurvivabilityDecay ||
    doctrineSurvivabilityDrift ||
    institutionalSurvivabilityWeaknessDetected ||
    continuityFatigueDetected;

  const survivabilitySeverityScore = clampScore(
    maxScore([
      inverseHealthScore(sustainabilityContinuitySurvivabilityIntegrityScore),
      inverseHealthScore(longHorizonSurvivabilityDurabilityScore),
      inverseHealthScore(failClosedSurvivabilityPreservationScore),
      continuityFatigueRiskScore,
      recursiveSurvivabilityDegradationRiskScore,
      inverseHealthScore(institutionalSurvivabilityDurabilityScore),
      inverseHealthScore(containmentSurvivabilityStabilityScore),
      inverseHealthScore(doctrineSurvivabilityStabilityScore),
      inverseHealthScore(lineageSurvivabilityPreservationScore),
      entropySurvivabilityAccelerationScore,
      inverseHealthScore(explainabilitySurvivabilityDurabilityScore),
      survivabilityReevaluationPressureScore,
    ]),
  );

  const longHorizonSurvivability = classifyLongHorizonSurvivability({
    sustainabilityContinuitySurvivabilityIntegrityScore,
    longHorizonSurvivabilityDurabilityScore,
    failClosedSurvivabilityPreservationScore,
    institutionalSurvivabilityDurabilityScore,
    entropySurvivabilityAccelerationScore,
  });
  const survivabilityExposureLevel = classifyExposure(survivabilitySeverityScore);
  const survivabilityReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      survivabilitySeverityScore,
      survivabilityReevaluationPressureScore,
      entropySurvivabilityAccelerationScore,
      recursiveSurvivabilityDegradationRiskScore,
      continuityFatigueRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedSurvivabilityDegrading &&
    !collapseSensitiveSurvivabilityEscalation &&
    !recursiveSurvivabilityDegradationDetected &&
    !entropySurvivabilityAccelerationDetected &&
    !containmentSurvivabilityRiskDetected &&
    !severeContinuityFatigue &&
    survivabilitySeverityScore >= 35 &&
    survivabilitySeverityScore < 72;

  const warningCodes = buildWarnings({
    sustainabilityContinuitySurvivabilityWeakness,
    longHorizonWeakness: longHorizonSurvivabilityDurabilityWeakness,
    failClosedDegradation: failClosedSurvivabilityDegrading,
    continuityFatigue: continuityFatigueDetected,
    recursiveDegradation: recursiveSurvivabilityDegradationDetected,
    institutionalRisk: institutionalSurvivabilityWeaknessDetected,
    containmentRisk: containmentSurvivabilityRiskDetected,
    doctrineDrift: doctrineSurvivabilityDrift,
    lineageWeakness: lineageSurvivabilityPreservationWeakness,
    entropyAcceleration: entropySurvivabilityAccelerationDetected,
    explainabilityDecay: explainabilitySurvivabilityDecay,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveSurvivabilityEscalation,
  });

  const survivabilityIntegrityLevel = classifySurvivability({
    failClosedDegradation: failClosedSurvivabilityDegrading,
    collapseSensitive: collapseSensitiveSurvivabilityEscalation,
    recursiveDegradation: recursiveSurvivabilityDegradationDetected,
    entropyAcceleration: entropySurvivabilityAccelerationDetected,
    containmentRisk: containmentSurvivabilityRiskDetected,
    continuityFatigue: continuityFatigueDetected,
    doctrineDrift: doctrineSurvivabilityDrift,
    institutionalRisk: institutionalSurvivabilityWeaknessDetected,
    longHorizonWeakness: longHorizonSurvivabilityDurabilityWeakness,
    lineageWeakness: lineageSurvivabilityPreservationWeakness,
    explainabilityDecay: explainabilitySurvivabilityDecay,
    sustainabilityContinuitySurvivabilityWeakness,
    continuationRequired,
    severityScore: survivabilitySeverityScore,
  });

  const primarySurvivabilityDriver = selectPrimaryDriver({
    "sustainability continuity survivability weakness": inverseHealthScore(
      sustainabilityContinuitySurvivabilityIntegrityScore,
    ),
    "long-horizon survivability durability weakness": inverseHealthScore(longHorizonSurvivabilityDurabilityScore),
    "fail-closed survivability degradation": inverseHealthScore(failClosedSurvivabilityPreservationScore),
    "continuity survivability fatigue": continuityFatigueRiskScore,
    "recursive survivability degradation": recursiveSurvivabilityDegradationRiskScore,
    "institutional survivability durability risk": inverseHealthScore(institutionalSurvivabilityDurabilityScore),
    "containment survivability risk": inverseHealthScore(containmentSurvivabilityStabilityScore),
    "doctrine survivability drift": inverseHealthScore(doctrineSurvivabilityStabilityScore),
    "lineage survivability preservation weakness": inverseHealthScore(lineageSurvivabilityPreservationScore),
    "entropy survivability acceleration": entropySurvivabilityAccelerationScore,
    "explainability survivability decay": inverseHealthScore(explainabilitySurvivabilityDurabilityScore),
    "survivability reevaluation pressure": survivabilityReevaluationPressureScore,
  });

  return {
    survivabilityIntegrityLevel,
    survivabilitySeverityScore,
    survivabilityExposureLevel,
    survivabilityReevaluationRequirementLevel,
    longHorizonSurvivability,
    continuationRequired,
    failClosedSurvivabilityDegrading,
    continuityFatigueDetected,
    recursiveSurvivabilityDegradationDetected,
    institutionalSurvivabilityWeaknessDetected,
    containmentSurvivabilityRiskDetected,
    entropySurvivabilityAccelerationDetected,
    collapseSensitiveSurvivabilityEscalation,
    warningCodes,
    explainability: {
      primarySurvivabilityDriver,
      dominantSurvivabilityEscalationReason:
        warningCodes[0] ?? "No deterministic sustainability continuity survivability escalation threshold was crossed.",
      containmentSurvivabilityAssessment: containmentSurvivabilityRiskDetected
        ? "Projected containment is not strong enough to preserve survivability continuity under sustained pressure."
        : "Projected containment remains survivability-preserving for the current caller-supplied governance context.",
      longHorizonSurvivabilityAssessment:
        longHorizonSurvivability === "durable"
          ? "Long-horizon sustainability continuity survivability is durable under the current inputs."
          : `Long-horizon sustainability continuity survivability is ${longHorizonSurvivability} under the current inputs. Survivability continuity does not imply survivability permanence.`,
      failClosedSurvivabilityAssessment: failClosedSurvivabilityDegrading
        ? "Fail-closed survivability preservation is degrading and overrides optimistic survivability assumptions."
        : "Fail-closed survivability preservation remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
