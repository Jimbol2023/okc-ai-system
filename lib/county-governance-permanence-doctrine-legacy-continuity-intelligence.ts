export type CountyGovernancePermanenceDoctrineLegacyContinuityIntegrityLevel =
  | "durable_permanence_doctrine_legacy_continuity"
  | "bounded_permanence_doctrine_legacy_continuity"
  | "permanence_doctrine_legacy_continuity_continuation_required"
  | "permanence_doctrine_legacy_continuity_degrading"
  | "permanence_doctrine_legacy_continuity_unstable"
  | "fail_closed_legacy_continuity_degradation"
  | "collapse_sensitive_legacy_continuity";

export type CountyGovernancePermanenceDoctrineLegacyContinuityExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernancePermanenceDoctrineLegacyContinuityReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonLegacyContinuity =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_continuous";

export type CountyGovernancePermanenceDoctrineLegacyContinuityWarningCode =
  | "DURABLE_LEGACY_CONTINUITY_WEAKNESS"
  | "LONG_HORIZON_LEGACY_CONTINUITY_DURABILITY_WEAKNESS"
  | "FAIL_CLOSED_LEGACY_CONTINUITY_DEGRADATION"
  | "DOCTRINE_SUCCESSION_INSTABILITY_RISK"
  | "RECURSIVE_LEGACY_CONTINUITY_DEGRADATION"
  | "INSTITUTIONAL_LEGACY_CONTINUITY_DURABILITY_RISK"
  | "CONTAINMENT_LEGACY_CONTINUITY_RISK"
  | "DOCTRINE_LEGACY_CONTINUITY_DRIFT"
  | "LINEAGE_LEGACY_CONTINUITY_PRESERVATION_WEAKNESS"
  | "ENTROPY_LEGACY_RECURRENCE_RISK"
  | "EXPLAINABILITY_LEGACY_CONTINUITY_DECAY"
  | "LEGACY_CONTINUITY_REEVALUATION_REQUIRED"
  | "LEGACY_CONTINUITY_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_LEGACY_CONTINUITY";

export type CountyGovernancePermanenceDoctrineLegacyContinuityInput = {
  permanenceDoctrineLegacyContinuityIntegrityScore: number;
  longHorizonLegacyContinuityDurabilityScore: number;
  failClosedLegacyContinuityPreservationScore: number;
  doctrineSuccessionInstabilityRiskScore: number;
  recursiveLegacyContinuityDegradationRiskScore: number;
  institutionalLegacyContinuityDurabilityScore: number;
  containmentLegacyContinuityStabilityScore: number;
  doctrineLegacyContinuityStabilityScore: number;
  lineageLegacyContinuityPreservationScore: number;
  entropyLegacyRecurrenceRiskScore: number;
  explainabilityLegacyContinuityDurabilityScore: number;
  legacyContinuityReevaluationPressureScore: number;
};

export type CountyGovernancePermanenceDoctrineLegacyContinuityResult = {
  legacyContinuityIntegrityLevel: CountyGovernancePermanenceDoctrineLegacyContinuityIntegrityLevel;
  legacyContinuitySeverityScore: number;
  legacyContinuityExposureLevel: CountyGovernancePermanenceDoctrineLegacyContinuityExposureLevel;
  legacyContinuityReevaluationRequirementLevel: CountyGovernancePermanenceDoctrineLegacyContinuityReevaluationRequirementLevel;
  longHorizonLegacyContinuity: CountyGovernanceLongHorizonLegacyContinuity;
  continuationRequired: boolean;
  failClosedLegacyContinuityDegrading: boolean;
  doctrineSuccessionInstabilityDetected: boolean;
  recursiveLegacyContinuityDegradationDetected: boolean;
  institutionalLegacyContinuityWeaknessDetected: boolean;
  containmentLegacyContinuityRiskDetected: boolean;
  entropyLegacyRecurrenceDetected: boolean;
  collapseSensitiveLegacyContinuityEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryLegacyContinuityDriver: string;
    dominantLegacyContinuityEscalationReason: string;
    containmentLegacyContinuityAssessment: string;
    longHorizonLegacyContinuityAssessment: string;
    failClosedLegacyContinuityAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernancePermanenceDoctrineLegacyContinuityWarningCode[] = [
  "FAIL_CLOSED_LEGACY_CONTINUITY_DEGRADATION",
  "COLLAPSE_SENSITIVE_LEGACY_CONTINUITY",
  "RECURSIVE_LEGACY_CONTINUITY_DEGRADATION",
  "ENTROPY_LEGACY_RECURRENCE_RISK",
  "CONTAINMENT_LEGACY_CONTINUITY_RISK",
  "DOCTRINE_SUCCESSION_INSTABILITY_RISK",
  "DOCTRINE_LEGACY_CONTINUITY_DRIFT",
  "INSTITUTIONAL_LEGACY_CONTINUITY_DURABILITY_RISK",
  "LONG_HORIZON_LEGACY_CONTINUITY_DURABILITY_WEAKNESS",
  "LINEAGE_LEGACY_CONTINUITY_PRESERVATION_WEAKNESS",
  "EXPLAINABILITY_LEGACY_CONTINUITY_DECAY",
  "DURABLE_LEGACY_CONTINUITY_WEAKNESS",
  "LEGACY_CONTINUITY_REEVALUATION_REQUIRED",
  "LEGACY_CONTINUITY_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernancePermanenceDoctrineLegacyContinuityExposureLevel {
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
): CountyGovernancePermanenceDoctrineLegacyContinuityReevaluationRequirementLevel {
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

function classifyLongHorizonLegacyContinuity(params: {
  permanenceDoctrineLegacyContinuityIntegrityScore: number;
  longHorizonLegacyContinuityDurabilityScore: number;
  failClosedLegacyContinuityPreservationScore: number;
  institutionalLegacyContinuityDurabilityScore: number;
  entropyLegacyRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonLegacyContinuity {
  if (
    params.permanenceDoctrineLegacyContinuityIntegrityScore < 35 ||
    params.longHorizonLegacyContinuityDurabilityScore < 35 ||
    params.failClosedLegacyContinuityPreservationScore < 35 ||
    params.entropyLegacyRecurrenceRiskScore >= 88
  ) {
    return "non_continuous";
  }

  if (
    params.permanenceDoctrineLegacyContinuityIntegrityScore < 55 ||
    params.longHorizonLegacyContinuityDurabilityScore < 55 ||
    params.failClosedLegacyContinuityPreservationScore < 55 ||
    params.institutionalLegacyContinuityDurabilityScore < 55 ||
    params.entropyLegacyRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.permanenceDoctrineLegacyContinuityIntegrityScore < 75 ||
    params.longHorizonLegacyContinuityDurabilityScore < 75 ||
    params.institutionalLegacyContinuityDurabilityScore < 75 ||
    params.entropyLegacyRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.permanenceDoctrineLegacyContinuityIntegrityScore < 88 ||
    params.longHorizonLegacyContinuityDurabilityScore < 88 ||
    params.institutionalLegacyContinuityDurabilityScore < 88 ||
    params.entropyLegacyRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  durableLegacyContinuityWeakness: boolean;
  longHorizonWeakness: boolean;
  failClosedDegradation: boolean;
  doctrineSuccessionInstability: boolean;
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
}): CountyGovernancePermanenceDoctrineLegacyContinuityWarningCode[] {
  const warnings = new Set<CountyGovernancePermanenceDoctrineLegacyContinuityWarningCode>();

  if (params.durableLegacyContinuityWeakness) {
    warnings.add("DURABLE_LEGACY_CONTINUITY_WEAKNESS");
  }

  if (params.longHorizonWeakness) {
    warnings.add("LONG_HORIZON_LEGACY_CONTINUITY_DURABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_LEGACY_CONTINUITY_DEGRADATION");
  }

  if (params.doctrineSuccessionInstability) {
    warnings.add("DOCTRINE_SUCCESSION_INSTABILITY_RISK");
  }

  if (params.recursiveDegradation) {
    warnings.add("RECURSIVE_LEGACY_CONTINUITY_DEGRADATION");
  }

  if (params.institutionalRisk) {
    warnings.add("INSTITUTIONAL_LEGACY_CONTINUITY_DURABILITY_RISK");
  }

  if (params.containmentRisk) {
    warnings.add("CONTAINMENT_LEGACY_CONTINUITY_RISK");
  }

  if (params.doctrineDrift) {
    warnings.add("DOCTRINE_LEGACY_CONTINUITY_DRIFT");
  }

  if (params.lineageWeakness) {
    warnings.add("LINEAGE_LEGACY_CONTINUITY_PRESERVATION_WEAKNESS");
  }

  if (params.entropyRecurrence) {
    warnings.add("ENTROPY_LEGACY_RECURRENCE_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("EXPLAINABILITY_LEGACY_CONTINUITY_DECAY");
  }

  if (params.reevaluationRequired) {
    warnings.add("LEGACY_CONTINUITY_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("LEGACY_CONTINUITY_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_LEGACY_CONTINUITY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["permanence doctrine legacy continuity integrity", 0],
  )[0];
}

function classifyLegacyContinuity(params: {
  failClosedDegradation: boolean;
  collapseSensitive: boolean;
  recursiveDegradation: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  doctrineSuccessionInstability: boolean;
  doctrineDrift: boolean;
  institutionalRisk: boolean;
  longHorizonWeakness: boolean;
  lineageWeakness: boolean;
  explainabilityDecay: boolean;
  durableLegacyContinuityWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernancePermanenceDoctrineLegacyContinuityIntegrityLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_legacy_continuity_degradation";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_legacy_continuity";
  }

  if (
    params.recursiveDegradation ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.doctrineSuccessionInstability
  ) {
    return "permanence_doctrine_legacy_continuity_unstable";
  }

  if (params.doctrineDrift || params.institutionalRisk) {
    return "permanence_doctrine_legacy_continuity_degrading";
  }

  if (
    params.longHorizonWeakness ||
    params.lineageWeakness ||
    params.explainabilityDecay ||
    params.durableLegacyContinuityWeakness
  ) {
    return "permanence_doctrine_legacy_continuity_degrading";
  }

  if (params.continuationRequired) {
    return "permanence_doctrine_legacy_continuity_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_permanence_doctrine_legacy_continuity";
  }

  return "durable_permanence_doctrine_legacy_continuity";
}

export function evaluateCountyGovernancePermanenceDoctrineLegacyContinuity(
  input: CountyGovernancePermanenceDoctrineLegacyContinuityInput,
): CountyGovernancePermanenceDoctrineLegacyContinuityResult {
  const permanenceDoctrineLegacyContinuityIntegrityScore = clampScore(
    input.permanenceDoctrineLegacyContinuityIntegrityScore,
  );
  const longHorizonLegacyContinuityDurabilityScore = clampScore(
    input.longHorizonLegacyContinuityDurabilityScore,
  );
  const failClosedLegacyContinuityPreservationScore = clampScore(input.failClosedLegacyContinuityPreservationScore);
  const doctrineSuccessionInstabilityRiskScore = clampScore(input.doctrineSuccessionInstabilityRiskScore);
  const recursiveLegacyContinuityDegradationRiskScore = clampScore(
    input.recursiveLegacyContinuityDegradationRiskScore,
  );
  const institutionalLegacyContinuityDurabilityScore = clampScore(
    input.institutionalLegacyContinuityDurabilityScore,
  );
  const containmentLegacyContinuityStabilityScore = clampScore(input.containmentLegacyContinuityStabilityScore);
  const doctrineLegacyContinuityStabilityScore = clampScore(input.doctrineLegacyContinuityStabilityScore);
  const lineageLegacyContinuityPreservationScore = clampScore(input.lineageLegacyContinuityPreservationScore);
  const entropyLegacyRecurrenceRiskScore = clampScore(input.entropyLegacyRecurrenceRiskScore);
  const explainabilityLegacyContinuityDurabilityScore = clampScore(
    input.explainabilityLegacyContinuityDurabilityScore,
  );
  const legacyContinuityReevaluationPressureScore = clampScore(input.legacyContinuityReevaluationPressureScore);

  const failClosedLegacyContinuityDegrading = failClosedLegacyContinuityPreservationScore < 55;
  const doctrineSuccessionInstabilityDetected =
    doctrineSuccessionInstabilityRiskScore >= 72 ||
    (doctrineSuccessionInstabilityRiskScore >= 58 && doctrineLegacyContinuityStabilityScore < 65);
  const collapseSensitiveLegacyContinuityEscalation =
    (recursiveLegacyContinuityDegradationRiskScore >= 92 ||
      entropyLegacyRecurrenceRiskScore >= 92 ||
      doctrineSuccessionInstabilityRiskScore >= 92) &&
    (failClosedLegacyContinuityPreservationScore < 65 || longHorizonLegacyContinuityDurabilityScore < 55);
  const recursiveLegacyContinuityDegradationDetected =
    recursiveLegacyContinuityDegradationRiskScore >= 72 ||
    (recursiveLegacyContinuityDegradationRiskScore >= 58 && doctrineLegacyContinuityStabilityScore < 65);
  const entropyLegacyRecurrenceDetected =
    entropyLegacyRecurrenceRiskScore >= 72 ||
    (entropyLegacyRecurrenceRiskScore >= 58 && longHorizonLegacyContinuityDurabilityScore < 65);
  const containmentLegacyContinuityRiskDetected =
    containmentLegacyContinuityStabilityScore < 55 ||
    (containmentLegacyContinuityStabilityScore < 65 && recursiveLegacyContinuityDegradationRiskScore >= 58);
  const institutionalLegacyContinuityWeaknessDetected = institutionalLegacyContinuityDurabilityScore < 65;
  const doctrineLegacyContinuityDrift = doctrineLegacyContinuityStabilityScore < 65;
  const longHorizonLegacyContinuityDurabilityWeakness = longHorizonLegacyContinuityDurabilityScore < 65;
  const lineageLegacyContinuityPreservationWeakness = lineageLegacyContinuityPreservationScore < 65;
  const explainabilityLegacyContinuityDecay = explainabilityLegacyContinuityDurabilityScore < 65;
  const durableLegacyContinuityWeakness = permanenceDoctrineLegacyContinuityIntegrityScore < 75;
  const reevaluationRequired =
    legacyContinuityReevaluationPressureScore >= 58 ||
    longHorizonLegacyContinuityDurabilityWeakness ||
    lineageLegacyContinuityPreservationWeakness ||
    explainabilityLegacyContinuityDecay ||
    doctrineLegacyContinuityDrift ||
    institutionalLegacyContinuityWeaknessDetected ||
    doctrineSuccessionInstabilityDetected;

  const legacyContinuitySeverityScore = clampScore(
    maxScore([
      inverseHealthScore(permanenceDoctrineLegacyContinuityIntegrityScore),
      inverseHealthScore(longHorizonLegacyContinuityDurabilityScore),
      inverseHealthScore(failClosedLegacyContinuityPreservationScore),
      doctrineSuccessionInstabilityRiskScore,
      recursiveLegacyContinuityDegradationRiskScore,
      inverseHealthScore(institutionalLegacyContinuityDurabilityScore),
      inverseHealthScore(containmentLegacyContinuityStabilityScore),
      inverseHealthScore(doctrineLegacyContinuityStabilityScore),
      inverseHealthScore(lineageLegacyContinuityPreservationScore),
      entropyLegacyRecurrenceRiskScore,
      inverseHealthScore(explainabilityLegacyContinuityDurabilityScore),
      legacyContinuityReevaluationPressureScore,
    ]),
  );

  const longHorizonLegacyContinuity = classifyLongHorizonLegacyContinuity({
    permanenceDoctrineLegacyContinuityIntegrityScore,
    longHorizonLegacyContinuityDurabilityScore,
    failClosedLegacyContinuityPreservationScore,
    institutionalLegacyContinuityDurabilityScore,
    entropyLegacyRecurrenceRiskScore,
  });
  const legacyContinuityExposureLevel = classifyExposure(legacyContinuitySeverityScore);
  const legacyContinuityReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      legacyContinuitySeverityScore,
      legacyContinuityReevaluationPressureScore,
      entropyLegacyRecurrenceRiskScore,
      recursiveLegacyContinuityDegradationRiskScore,
      doctrineSuccessionInstabilityRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedLegacyContinuityDegrading &&
    !collapseSensitiveLegacyContinuityEscalation &&
    !recursiveLegacyContinuityDegradationDetected &&
    !entropyLegacyRecurrenceDetected &&
    !containmentLegacyContinuityRiskDetected &&
    !doctrineSuccessionInstabilityDetected &&
    legacyContinuitySeverityScore >= 35 &&
    legacyContinuitySeverityScore < 72;

  const warningCodes = buildWarnings({
    durableLegacyContinuityWeakness,
    longHorizonWeakness: longHorizonLegacyContinuityDurabilityWeakness,
    failClosedDegradation: failClosedLegacyContinuityDegrading,
    doctrineSuccessionInstability: doctrineSuccessionInstabilityDetected,
    recursiveDegradation: recursiveLegacyContinuityDegradationDetected,
    institutionalRisk: institutionalLegacyContinuityWeaknessDetected,
    containmentRisk: containmentLegacyContinuityRiskDetected,
    doctrineDrift: doctrineLegacyContinuityDrift,
    lineageWeakness: lineageLegacyContinuityPreservationWeakness,
    entropyRecurrence: entropyLegacyRecurrenceDetected,
    explainabilityDecay: explainabilityLegacyContinuityDecay,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveLegacyContinuityEscalation,
  });

  const legacyContinuityIntegrityLevel = classifyLegacyContinuity({
    failClosedDegradation: failClosedLegacyContinuityDegrading,
    collapseSensitive: collapseSensitiveLegacyContinuityEscalation,
    recursiveDegradation: recursiveLegacyContinuityDegradationDetected,
    entropyRecurrence: entropyLegacyRecurrenceDetected,
    containmentRisk: containmentLegacyContinuityRiskDetected,
    doctrineSuccessionInstability: doctrineSuccessionInstabilityDetected,
    doctrineDrift: doctrineLegacyContinuityDrift,
    institutionalRisk: institutionalLegacyContinuityWeaknessDetected,
    longHorizonWeakness: longHorizonLegacyContinuityDurabilityWeakness,
    lineageWeakness: lineageLegacyContinuityPreservationWeakness,
    explainabilityDecay: explainabilityLegacyContinuityDecay,
    durableLegacyContinuityWeakness,
    continuationRequired,
    severityScore: legacyContinuitySeverityScore,
  });

  const primaryLegacyContinuityDriver = selectPrimaryDriver({
    "durable legacy continuity weakness": inverseHealthScore(permanenceDoctrineLegacyContinuityIntegrityScore),
    "long-horizon legacy continuity durability weakness": inverseHealthScore(
      longHorizonLegacyContinuityDurabilityScore,
    ),
    "fail-closed legacy continuity degradation": inverseHealthScore(failClosedLegacyContinuityPreservationScore),
    "doctrine succession instability risk": doctrineSuccessionInstabilityRiskScore,
    "recursive legacy continuity degradation": recursiveLegacyContinuityDegradationRiskScore,
    "institutional legacy continuity durability risk": inverseHealthScore(
      institutionalLegacyContinuityDurabilityScore,
    ),
    "containment legacy continuity risk": inverseHealthScore(containmentLegacyContinuityStabilityScore),
    "doctrine legacy continuity drift": inverseHealthScore(doctrineLegacyContinuityStabilityScore),
    "lineage legacy continuity preservation weakness": inverseHealthScore(lineageLegacyContinuityPreservationScore),
    "entropy legacy recurrence risk": entropyLegacyRecurrenceRiskScore,
    "explainability legacy continuity decay": inverseHealthScore(explainabilityLegacyContinuityDurabilityScore),
    "legacy continuity reevaluation pressure": legacyContinuityReevaluationPressureScore,
  });

  return {
    legacyContinuityIntegrityLevel,
    legacyContinuitySeverityScore,
    legacyContinuityExposureLevel,
    legacyContinuityReevaluationRequirementLevel,
    longHorizonLegacyContinuity,
    continuationRequired,
    failClosedLegacyContinuityDegrading,
    doctrineSuccessionInstabilityDetected,
    recursiveLegacyContinuityDegradationDetected,
    institutionalLegacyContinuityWeaknessDetected,
    containmentLegacyContinuityRiskDetected,
    entropyLegacyRecurrenceDetected,
    collapseSensitiveLegacyContinuityEscalation,
    warningCodes,
    explainability: {
      primaryLegacyContinuityDriver,
      dominantLegacyContinuityEscalationReason:
        warningCodes[0] ?? "No deterministic permanence doctrine legacy continuity escalation threshold was crossed.",
      containmentLegacyContinuityAssessment: containmentLegacyContinuityRiskDetected
        ? "Projected containment is not strong enough to preserve legacy continuity under doctrine transfer pressure."
        : "Projected containment remains legacy-continuity-preserving for the current caller-supplied governance context.",
      longHorizonLegacyContinuityAssessment:
        longHorizonLegacyContinuity === "durable"
          ? "Long-horizon permanence doctrine legacy continuity is durable under the current inputs. Legacy continuity durability does not imply irreversible governance preservation."
          : `Long-horizon permanence doctrine legacy continuity is ${longHorizonLegacyContinuity} under the current inputs. Permanence doctrine integrity does not guarantee legacy continuity durability.`,
      failClosedLegacyContinuityAssessment: failClosedLegacyContinuityDegrading
        ? "Fail-closed legacy continuity preservation is degrading and overrides optimistic continuity assumptions."
        : "Fail-closed legacy continuity preservation remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
