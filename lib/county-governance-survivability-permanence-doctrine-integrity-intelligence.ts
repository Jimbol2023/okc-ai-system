export type CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityLevel =
  | "durable_survivability_permanence_doctrine_integrity"
  | "bounded_survivability_permanence_doctrine_integrity"
  | "survivability_permanence_doctrine_continuation_required"
  | "survivability_permanence_doctrine_degrading"
  | "survivability_permanence_doctrine_unstable"
  | "fail_closed_permanence_doctrine_degradation"
  | "collapse_sensitive_permanence_doctrine";

export type CountyGovernanceSurvivabilityPermanenceExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceSurvivabilityPermanenceReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonPermanence =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_permanent";

export type CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityWarningCode =
  | "SURVIVABILITY_PERMANENCE_DOCTRINE_WEAKNESS"
  | "LONG_HORIZON_PERMANENCE_DURABILITY_WEAKNESS"
  | "FAIL_CLOSED_PERMANENCE_DOCTRINE_DEGRADATION"
  | "FALSE_PERMANENCE_ASSUMPTION_RISK"
  | "RECURSIVE_PERMANENCE_DEGRADATION"
  | "INSTITUTIONAL_PERMANENCE_DURABILITY_RISK"
  | "CONTAINMENT_PERMANENCE_RISK"
  | "DOCTRINE_PERMANENCE_DRIFT"
  | "LINEAGE_PERMANENCE_PRESERVATION_WEAKNESS"
  | "ENTROPY_RECURRENCE_PERMANENCE_RISK"
  | "EXPLAINABILITY_PERMANENCE_DECAY"
  | "PERMANENCE_REEVALUATION_REQUIRED"
  | "PERMANENCE_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_PERMANENCE_DOCTRINE";

export type CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityInput = {
  survivabilityPermanenceDoctrineIntegrityScore: number;
  longHorizonPermanenceDurabilityScore: number;
  failClosedPermanencePreservationScore: number;
  permanenceAssumptionRiskScore: number;
  recursivePermanenceDegradationRiskScore: number;
  institutionalPermanenceDurabilityScore: number;
  containmentPermanenceStabilityScore: number;
  doctrinePermanenceStabilityScore: number;
  lineagePermanencePreservationScore: number;
  entropyRecurrenceRiskScore: number;
  explainabilityPermanenceDurabilityScore: number;
  permanenceReevaluationPressureScore: number;
};

export type CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityResult = {
  permanenceDoctrineIntegrityLevel: CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityLevel;
  permanenceSeverityScore: number;
  permanenceExposureLevel: CountyGovernanceSurvivabilityPermanenceExposureLevel;
  permanenceReevaluationRequirementLevel: CountyGovernanceSurvivabilityPermanenceReevaluationRequirementLevel;
  longHorizonPermanence: CountyGovernanceLongHorizonPermanence;
  continuationRequired: boolean;
  failClosedPermanenceDegrading: boolean;
  falsePermanenceAssumptionDetected: boolean;
  recursivePermanenceDegradationDetected: boolean;
  institutionalPermanenceWeaknessDetected: boolean;
  containmentPermanenceRiskDetected: boolean;
  entropyRecurrenceDetected: boolean;
  collapseSensitivePermanenceEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryPermanenceDriver: string;
    dominantPermanenceEscalationReason: string;
    containmentPermanenceAssessment: string;
    longHorizonPermanenceAssessment: string;
    failClosedPermanenceAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityWarningCode[] = [
  "FAIL_CLOSED_PERMANENCE_DOCTRINE_DEGRADATION",
  "COLLAPSE_SENSITIVE_PERMANENCE_DOCTRINE",
  "RECURSIVE_PERMANENCE_DEGRADATION",
  "ENTROPY_RECURRENCE_PERMANENCE_RISK",
  "CONTAINMENT_PERMANENCE_RISK",
  "FALSE_PERMANENCE_ASSUMPTION_RISK",
  "DOCTRINE_PERMANENCE_DRIFT",
  "INSTITUTIONAL_PERMANENCE_DURABILITY_RISK",
  "LONG_HORIZON_PERMANENCE_DURABILITY_WEAKNESS",
  "LINEAGE_PERMANENCE_PRESERVATION_WEAKNESS",
  "EXPLAINABILITY_PERMANENCE_DECAY",
  "SURVIVABILITY_PERMANENCE_DOCTRINE_WEAKNESS",
  "PERMANENCE_REEVALUATION_REQUIRED",
  "PERMANENCE_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceSurvivabilityPermanenceExposureLevel {
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

function classifyReevaluation(score: number): CountyGovernanceSurvivabilityPermanenceReevaluationRequirementLevel {
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

function classifyLongHorizonPermanence(params: {
  survivabilityPermanenceDoctrineIntegrityScore: number;
  longHorizonPermanenceDurabilityScore: number;
  failClosedPermanencePreservationScore: number;
  institutionalPermanenceDurabilityScore: number;
  entropyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonPermanence {
  if (
    params.survivabilityPermanenceDoctrineIntegrityScore < 35 ||
    params.longHorizonPermanenceDurabilityScore < 35 ||
    params.failClosedPermanencePreservationScore < 35 ||
    params.entropyRecurrenceRiskScore >= 88
  ) {
    return "non_permanent";
  }

  if (
    params.survivabilityPermanenceDoctrineIntegrityScore < 55 ||
    params.longHorizonPermanenceDurabilityScore < 55 ||
    params.failClosedPermanencePreservationScore < 55 ||
    params.institutionalPermanenceDurabilityScore < 55 ||
    params.entropyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.survivabilityPermanenceDoctrineIntegrityScore < 75 ||
    params.longHorizonPermanenceDurabilityScore < 75 ||
    params.institutionalPermanenceDurabilityScore < 75 ||
    params.entropyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.survivabilityPermanenceDoctrineIntegrityScore < 88 ||
    params.longHorizonPermanenceDurabilityScore < 88 ||
    params.institutionalPermanenceDurabilityScore < 88 ||
    params.entropyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  survivabilityPermanenceDoctrineWeakness: boolean;
  longHorizonWeakness: boolean;
  failClosedDegradation: boolean;
  falsePermanenceAssumption: boolean;
  recursiveDegradation: boolean;
  institutionalRisk: boolean;
  containmentRisk: boolean;
  doctrineDrift: boolean;
  lineageWeakness: boolean;
  entropyRecurrence: boolean;
  explainabilityDecay: boolean;
  reevaluationRequired: boolean;
  continuationRequired: boolean;
  collapseSensitive: boolean;
}): CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityWarningCode[] {
  const warnings = new Set<CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityWarningCode>();

  if (params.survivabilityPermanenceDoctrineWeakness) {
    warnings.add("SURVIVABILITY_PERMANENCE_DOCTRINE_WEAKNESS");
  }

  if (params.longHorizonWeakness) {
    warnings.add("LONG_HORIZON_PERMANENCE_DURABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_PERMANENCE_DOCTRINE_DEGRADATION");
  }

  if (params.falsePermanenceAssumption) {
    warnings.add("FALSE_PERMANENCE_ASSUMPTION_RISK");
  }

  if (params.recursiveDegradation) {
    warnings.add("RECURSIVE_PERMANENCE_DEGRADATION");
  }

  if (params.institutionalRisk) {
    warnings.add("INSTITUTIONAL_PERMANENCE_DURABILITY_RISK");
  }

  if (params.containmentRisk) {
    warnings.add("CONTAINMENT_PERMANENCE_RISK");
  }

  if (params.doctrineDrift) {
    warnings.add("DOCTRINE_PERMANENCE_DRIFT");
  }

  if (params.lineageWeakness) {
    warnings.add("LINEAGE_PERMANENCE_PRESERVATION_WEAKNESS");
  }

  if (params.entropyRecurrence) {
    warnings.add("ENTROPY_RECURRENCE_PERMANENCE_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("EXPLAINABILITY_PERMANENCE_DECAY");
  }

  if (params.reevaluationRequired) {
    warnings.add("PERMANENCE_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("PERMANENCE_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_PERMANENCE_DOCTRINE");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["survivability permanence doctrine integrity", 0],
  )[0];
}

function classifyPermanence(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDegradation: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  falsePermanenceAssumption: boolean;
  doctrineDrift: boolean;
  institutionalRisk: boolean;
  longHorizonWeakness: boolean;
  lineageWeakness: boolean;
  explainabilityDecay: boolean;
  survivabilityPermanenceDoctrineWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_permanence_doctrine_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_permanence_doctrine";
  }

  if (
    params.recursiveDegradation ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.falsePermanenceAssumption
  ) {
    return "survivability_permanence_doctrine_unstable";
  }

  if (params.doctrineDrift || params.institutionalRisk) {
    return "survivability_permanence_doctrine_degrading";
  }

  if (
    params.longHorizonWeakness ||
    params.lineageWeakness ||
    params.explainabilityDecay ||
    params.survivabilityPermanenceDoctrineWeakness
  ) {
    return "survivability_permanence_doctrine_degrading";
  }

  if (params.continuationRequired) {
    return "survivability_permanence_doctrine_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_survivability_permanence_doctrine_integrity";
  }

  return "durable_survivability_permanence_doctrine_integrity";
}

export function evaluateCountyGovernanceSurvivabilityPermanenceDoctrineIntegrity(
  input: CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityInput,
): CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityResult {
  const survivabilityPermanenceDoctrineIntegrityScore = clampScore(
    input.survivabilityPermanenceDoctrineIntegrityScore,
  );
  const longHorizonPermanenceDurabilityScore = clampScore(input.longHorizonPermanenceDurabilityScore);
  const failClosedPermanencePreservationScore = clampScore(input.failClosedPermanencePreservationScore);
  const permanenceAssumptionRiskScore = clampScore(input.permanenceAssumptionRiskScore);
  const recursivePermanenceDegradationRiskScore = clampScore(input.recursivePermanenceDegradationRiskScore);
  const institutionalPermanenceDurabilityScore = clampScore(input.institutionalPermanenceDurabilityScore);
  const containmentPermanenceStabilityScore = clampScore(input.containmentPermanenceStabilityScore);
  const doctrinePermanenceStabilityScore = clampScore(input.doctrinePermanenceStabilityScore);
  const lineagePermanencePreservationScore = clampScore(input.lineagePermanencePreservationScore);
  const entropyRecurrenceRiskScore = clampScore(input.entropyRecurrenceRiskScore);
  const explainabilityPermanenceDurabilityScore = clampScore(input.explainabilityPermanenceDurabilityScore);
  const permanenceReevaluationPressureScore = clampScore(input.permanenceReevaluationPressureScore);

  const failClosedPermanenceDegrading = failClosedPermanencePreservationScore < 55;
  const falsePermanenceAssumptionDetected =
    permanenceAssumptionRiskScore >= 72 ||
    (permanenceAssumptionRiskScore >= 58 && doctrinePermanenceStabilityScore < 65);
  const collapseSensitivePermanenceEscalation =
    recursivePermanenceDegradationRiskScore >= 92 ||
    entropyRecurrenceRiskScore >= 92 ||
    (containmentPermanenceStabilityScore < 35 &&
      (failClosedPermanencePreservationScore < 65 || longHorizonPermanenceDurabilityScore < 55));
  const recursivePermanenceDegradationDetected =
    recursivePermanenceDegradationRiskScore >= 72 ||
    (recursivePermanenceDegradationRiskScore >= 58 && doctrinePermanenceStabilityScore < 65);
  const entropyRecurrenceDetected =
    entropyRecurrenceRiskScore >= 72 ||
    (entropyRecurrenceRiskScore >= 58 && longHorizonPermanenceDurabilityScore < 65);
  const containmentPermanenceRiskDetected =
    containmentPermanenceStabilityScore < 55 ||
    (containmentPermanenceStabilityScore < 65 && recursivePermanenceDegradationRiskScore >= 58);
  const institutionalPermanenceWeaknessDetected = institutionalPermanenceDurabilityScore < 65;
  const doctrinePermanenceDrift = doctrinePermanenceStabilityScore < 65;
  const longHorizonPermanenceDurabilityWeakness = longHorizonPermanenceDurabilityScore < 65;
  const lineagePermanencePreservationWeakness = lineagePermanencePreservationScore < 65;
  const explainabilityPermanenceDecay = explainabilityPermanenceDurabilityScore < 65;
  const survivabilityPermanenceDoctrineWeakness = survivabilityPermanenceDoctrineIntegrityScore < 75;
  const reevaluationRequired =
    permanenceReevaluationPressureScore >= 58 ||
    longHorizonPermanenceDurabilityWeakness ||
    lineagePermanencePreservationWeakness ||
    explainabilityPermanenceDecay ||
    doctrinePermanenceDrift ||
    institutionalPermanenceWeaknessDetected ||
    falsePermanenceAssumptionDetected;

  const permanenceSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(survivabilityPermanenceDoctrineIntegrityScore),
      inverseHealthScore(longHorizonPermanenceDurabilityScore),
      inverseHealthScore(failClosedPermanencePreservationScore),
      permanenceAssumptionRiskScore,
      recursivePermanenceDegradationRiskScore,
      inverseHealthScore(institutionalPermanenceDurabilityScore),
      inverseHealthScore(containmentPermanenceStabilityScore),
      inverseHealthScore(doctrinePermanenceStabilityScore),
      inverseHealthScore(lineagePermanencePreservationScore),
      entropyRecurrenceRiskScore,
      inverseHealthScore(explainabilityPermanenceDurabilityScore),
      permanenceReevaluationPressureScore,
    ]),
  );

  const longHorizonPermanence = classifyLongHorizonPermanence({
    survivabilityPermanenceDoctrineIntegrityScore,
    longHorizonPermanenceDurabilityScore,
    failClosedPermanencePreservationScore,
    institutionalPermanenceDurabilityScore,
    entropyRecurrenceRiskScore,
  });
  const permanenceExposureLevel = classifyExposure(permanenceSeverityScore);
  const permanenceReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      permanenceSeverityScore,
      permanenceReevaluationPressureScore,
      entropyRecurrenceRiskScore,
      recursivePermanenceDegradationRiskScore,
      permanenceAssumptionRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedPermanenceDegrading &&
    !collapseSensitivePermanenceEscalation &&
    !recursivePermanenceDegradationDetected &&
    !entropyRecurrenceDetected &&
    !containmentPermanenceRiskDetected &&
    !falsePermanenceAssumptionDetected &&
    permanenceSeverityScore >= 35 &&
    permanenceSeverityScore < 72;

  const warningCodes = buildWarnings({
    survivabilityPermanenceDoctrineWeakness,
    longHorizonWeakness: longHorizonPermanenceDurabilityWeakness,
    failClosedDegradation: failClosedPermanenceDegrading,
    falsePermanenceAssumption: falsePermanenceAssumptionDetected,
    recursiveDegradation: recursivePermanenceDegradationDetected,
    institutionalRisk: institutionalPermanenceWeaknessDetected,
    containmentRisk: containmentPermanenceRiskDetected,
    doctrineDrift: doctrinePermanenceDrift,
    lineageWeakness: lineagePermanencePreservationWeakness,
    entropyRecurrence: entropyRecurrenceDetected,
    explainabilityDecay: explainabilityPermanenceDecay,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitivePermanenceEscalation,
  });

  const permanenceDoctrineIntegrityLevel = classifyPermanence({
    failClosedDegradation: failClosedPermanenceDegrading,
    collapseSensitive: collapseSensitivePermanenceEscalation,
    recursiveDegradation: recursivePermanenceDegradationDetected,
    entropyRecurrence: entropyRecurrenceDetected,
    containmentRisk: containmentPermanenceRiskDetected,
    falsePermanenceAssumption: falsePermanenceAssumptionDetected,
    doctrineDrift: doctrinePermanenceDrift,
    institutionalRisk: institutionalPermanenceWeaknessDetected,
    longHorizonWeakness: longHorizonPermanenceDurabilityWeakness,
    lineageWeakness: lineagePermanencePreservationWeakness,
    explainabilityDecay: explainabilityPermanenceDecay,
    survivabilityPermanenceDoctrineWeakness,
    continuationRequired,
    severityScore: permanenceSeverityScore,
  });

  const primaryPermanenceDriver = selectPrimaryDriver({
    "survivability permanence doctrine weakness": inverseHealthScore(
      survivabilityPermanenceDoctrineIntegrityScore,
    ),
    "long-horizon permanence durability weakness": inverseHealthScore(longHorizonPermanenceDurabilityScore),
    "fail-closed permanence doctrine degradation": inverseHealthScore(failClosedPermanencePreservationScore),
    "false permanence assumption risk": permanenceAssumptionRiskScore,
    "recursive permanence degradation": recursivePermanenceDegradationRiskScore,
    "institutional permanence durability risk": inverseHealthScore(institutionalPermanenceDurabilityScore),
    "containment permanence risk": inverseHealthScore(containmentPermanenceStabilityScore),
    "doctrine permanence drift": inverseHealthScore(doctrinePermanenceStabilityScore),
    "lineage permanence preservation weakness": inverseHealthScore(lineagePermanencePreservationScore),
    "entropy recurrence permanence risk": entropyRecurrenceRiskScore,
    "explainability permanence decay": inverseHealthScore(explainabilityPermanenceDurabilityScore),
    "permanence reevaluation pressure": permanenceReevaluationPressureScore,
  });

  return {
    permanenceDoctrineIntegrityLevel,
    permanenceSeverityScore,
    permanenceExposureLevel,
    permanenceReevaluationRequirementLevel,
    longHorizonPermanence,
    continuationRequired,
    failClosedPermanenceDegrading,
    falsePermanenceAssumptionDetected,
    recursivePermanenceDegradationDetected,
    institutionalPermanenceWeaknessDetected,
    containmentPermanenceRiskDetected,
    entropyRecurrenceDetected,
    collapseSensitivePermanenceEscalation,
    warningCodes,
    explainability: {
      primaryPermanenceDriver,
      dominantPermanenceEscalationReason:
        warningCodes[0] ?? "No deterministic survivability permanence doctrine escalation threshold was crossed.",
      containmentPermanenceAssessment: containmentPermanenceRiskDetected
        ? "Projected containment is not strong enough to preserve permanence doctrine integrity under recurrence pressure."
        : "Projected containment remains permanence-preserving for the current caller-supplied governance context.",
      longHorizonPermanenceAssessment:
        longHorizonPermanence === "durable"
          ? "Long-horizon survivability permanence doctrine integrity is durable under the current inputs. Permanence doctrine integrity does not imply indefinite safety."
          : `Long-horizon survivability permanence doctrine integrity is ${longHorizonPermanence} under the current inputs. Survivability continuity does not imply permanence doctrine integrity.`,
      failClosedPermanenceAssessment: failClosedPermanenceDegrading
        ? "Fail-closed permanence preservation is degrading and overrides optimistic permanence assumptions."
        : "Fail-closed permanence preservation remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
