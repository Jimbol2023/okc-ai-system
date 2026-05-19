export type CountyGovernanceLegacyContinuityCivilizationPreservationIntegrityLevel =
  | "durable_legacy_continuity_civilization_preservation"
  | "bounded_legacy_continuity_civilization_preservation"
  | "legacy_continuity_civilization_preservation_continuation_required"
  | "legacy_continuity_civilization_preservation_degrading"
  | "legacy_continuity_civilization_preservation_unstable"
  | "fail_closed_civilization_preservation_degradation"
  | "collapse_sensitive_civilization_preservation";

export type CountyGovernanceLegacyContinuityCivilizationPreservationExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceLegacyContinuityCivilizationPreservationReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceLongHorizonCivilizationPreservation =
  | "durable"
  | "watch"
  | "strained"
  | "unstable"
  | "non_preserving";

export type CountyGovernanceLegacyContinuityCivilizationPreservationWarningCode =
  | "LEGACY_CONTINUITY_CIVILIZATION_PRESERVATION_WEAKNESS"
  | "LONG_HORIZON_CIVILIZATION_PRESERVATION_DURABILITY_WEAKNESS"
  | "FAIL_CLOSED_CIVILIZATION_PRESERVATION_DEGRADATION"
  | "CIVILIZATION_ARCHIVE_DEGRADATION_RISK"
  | "RECURSIVE_CIVILIZATION_PRESERVATION_DEGRADATION"
  | "INSTITUTIONAL_CIVILIZATION_DURABILITY_RISK"
  | "CONTAINMENT_CIVILIZATION_PRESERVATION_RISK"
  | "DOCTRINE_CIVILIZATION_CONTINUITY_DRIFT"
  | "LINEAGE_CIVILIZATION_PRESERVATION_WEAKNESS"
  | "ENTROPY_CIVILIZATION_RECURRENCE_RISK"
  | "EXPLAINABILITY_CIVILIZATION_DECAY"
  | "CIVILIZATION_PRESERVATION_REEVALUATION_REQUIRED"
  | "CIVILIZATION_PRESERVATION_CONTINUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_CIVILIZATION_PRESERVATION";

export type CountyGovernanceLegacyContinuityCivilizationPreservationInput = {
  legacyContinuityCivilizationPreservationIntegrityScore: number;
  longHorizonCivilizationPreservationDurabilityScore: number;
  failClosedCivilizationPreservationScore: number;
  civilizationArchiveDegradationRiskScore: number;
  recursiveCivilizationPreservationDegradationRiskScore: number;
  institutionalCivilizationDurabilityScore: number;
  containmentCivilizationPreservationStabilityScore: number;
  doctrineCivilizationContinuityStabilityScore: number;
  lineageCivilizationPreservationScore: number;
  entropyCivilizationRecurrenceRiskScore: number;
  explainabilityCivilizationDurabilityScore: number;
  civilizationPreservationReevaluationPressureScore: number;
};

export type CountyGovernanceLegacyContinuityCivilizationPreservationResult = {
  civilizationPreservationIntegrityLevel: CountyGovernanceLegacyContinuityCivilizationPreservationIntegrityLevel;
  civilizationPreservationSeverityScore: number;
  civilizationPreservationExposureLevel: CountyGovernanceLegacyContinuityCivilizationPreservationExposureLevel;
  civilizationPreservationReevaluationRequirementLevel: CountyGovernanceLegacyContinuityCivilizationPreservationReevaluationRequirementLevel;
  longHorizonCivilizationPreservation: CountyGovernanceLongHorizonCivilizationPreservation;
  continuationRequired: boolean;
  failClosedCivilizationPreservationDegrading: boolean;
  civilizationArchiveDegradationDetected: boolean;
  recursiveCivilizationPreservationDegradationDetected: boolean;
  institutionalCivilizationWeaknessDetected: boolean;
  containmentCivilizationPreservationRiskDetected: boolean;
  entropyCivilizationRecurrenceDetected: boolean;
  collapseSensitiveCivilizationPreservationEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryCivilizationPreservationDriver: string;
    dominantCivilizationPreservationEscalationReason: string;
    containmentCivilizationPreservationAssessment: string;
    longHorizonCivilizationPreservationAssessment: string;
    failClosedCivilizationPreservationAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceLegacyContinuityCivilizationPreservationWarningCode[] = [
  "FAIL_CLOSED_CIVILIZATION_PRESERVATION_DEGRADATION",
  "COLLAPSE_SENSITIVE_CIVILIZATION_PRESERVATION",
  "RECURSIVE_CIVILIZATION_PRESERVATION_DEGRADATION",
  "ENTROPY_CIVILIZATION_RECURRENCE_RISK",
  "CONTAINMENT_CIVILIZATION_PRESERVATION_RISK",
  "CIVILIZATION_ARCHIVE_DEGRADATION_RISK",
  "DOCTRINE_CIVILIZATION_CONTINUITY_DRIFT",
  "INSTITUTIONAL_CIVILIZATION_DURABILITY_RISK",
  "LONG_HORIZON_CIVILIZATION_PRESERVATION_DURABILITY_WEAKNESS",
  "LINEAGE_CIVILIZATION_PRESERVATION_WEAKNESS",
  "EXPLAINABILITY_CIVILIZATION_DECAY",
  "LEGACY_CONTINUITY_CIVILIZATION_PRESERVATION_WEAKNESS",
  "CIVILIZATION_PRESERVATION_REEVALUATION_REQUIRED",
  "CIVILIZATION_PRESERVATION_CONTINUATION_REQUIRED",
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

function classifyExposure(score: number): CountyGovernanceLegacyContinuityCivilizationPreservationExposureLevel {
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
): CountyGovernanceLegacyContinuityCivilizationPreservationReevaluationRequirementLevel {
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

function classifyLongHorizonCivilizationPreservation(params: {
  legacyContinuityCivilizationPreservationIntegrityScore: number;
  longHorizonCivilizationPreservationDurabilityScore: number;
  failClosedCivilizationPreservationScore: number;
  institutionalCivilizationDurabilityScore: number;
  entropyCivilizationRecurrenceRiskScore: number;
}): CountyGovernanceLongHorizonCivilizationPreservation {
  if (
    params.legacyContinuityCivilizationPreservationIntegrityScore < 35 ||
    params.longHorizonCivilizationPreservationDurabilityScore < 35 ||
    params.failClosedCivilizationPreservationScore < 35 ||
    params.entropyCivilizationRecurrenceRiskScore >= 88
  ) {
    return "non_preserving";
  }

  if (
    params.legacyContinuityCivilizationPreservationIntegrityScore < 55 ||
    params.longHorizonCivilizationPreservationDurabilityScore < 55 ||
    params.failClosedCivilizationPreservationScore < 55 ||
    params.institutionalCivilizationDurabilityScore < 55 ||
    params.entropyCivilizationRecurrenceRiskScore >= 72
  ) {
    return "unstable";
  }

  if (
    params.legacyContinuityCivilizationPreservationIntegrityScore < 75 ||
    params.longHorizonCivilizationPreservationDurabilityScore < 75 ||
    params.institutionalCivilizationDurabilityScore < 75 ||
    params.entropyCivilizationRecurrenceRiskScore >= 50
  ) {
    return "strained";
  }

  if (
    params.legacyContinuityCivilizationPreservationIntegrityScore < 88 ||
    params.longHorizonCivilizationPreservationDurabilityScore < 88 ||
    params.institutionalCivilizationDurabilityScore < 88 ||
    params.entropyCivilizationRecurrenceRiskScore >= 25
  ) {
    return "watch";
  }

  return "durable";
}

function buildWarnings(params: {
  civilizationPreservationWeakness: boolean;
  longHorizonWeakness: boolean;
  failClosedDegradation: boolean;
  archiveDegradation: boolean;
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
}): CountyGovernanceLegacyContinuityCivilizationPreservationWarningCode[] {
  const warnings = new Set<CountyGovernanceLegacyContinuityCivilizationPreservationWarningCode>();

  if (params.civilizationPreservationWeakness) {
    warnings.add("LEGACY_CONTINUITY_CIVILIZATION_PRESERVATION_WEAKNESS");
  }

  if (params.longHorizonWeakness) {
    warnings.add("LONG_HORIZON_CIVILIZATION_PRESERVATION_DURABILITY_WEAKNESS");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_CIVILIZATION_PRESERVATION_DEGRADATION");
  }

  if (params.archiveDegradation) {
    warnings.add("CIVILIZATION_ARCHIVE_DEGRADATION_RISK");
  }

  if (params.recursiveDegradation) {
    warnings.add("RECURSIVE_CIVILIZATION_PRESERVATION_DEGRADATION");
  }

  if (params.institutionalRisk) {
    warnings.add("INSTITUTIONAL_CIVILIZATION_DURABILITY_RISK");
  }

  if (params.containmentRisk) {
    warnings.add("CONTAINMENT_CIVILIZATION_PRESERVATION_RISK");
  }

  if (params.doctrineDrift) {
    warnings.add("DOCTRINE_CIVILIZATION_CONTINUITY_DRIFT");
  }

  if (params.lineageWeakness) {
    warnings.add("LINEAGE_CIVILIZATION_PRESERVATION_WEAKNESS");
  }

  if (params.entropyRecurrence) {
    warnings.add("ENTROPY_CIVILIZATION_RECURRENCE_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("EXPLAINABILITY_CIVILIZATION_DECAY");
  }

  if (params.reevaluationRequired) {
    warnings.add("CIVILIZATION_PRESERVATION_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("CIVILIZATION_PRESERVATION_CONTINUATION_REQUIRED");
  }

  if (params.collapseSensitive) {
    warnings.add("COLLAPSE_SENSITIVE_CIVILIZATION_PRESERVATION");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["legacy continuity civilization preservation integrity", 0],
  )[0];
}

function classifyCivilizationPreservation(params: {
  collapseSensitive: boolean;
  failClosedDegradation: boolean;
  recursiveDegradation: boolean;
  entropyRecurrence: boolean;
  containmentRisk: boolean;
  archiveDegradation: boolean;
  doctrineDrift: boolean;
  institutionalRisk: boolean;
  longHorizonWeakness: boolean;
  lineageWeakness: boolean;
  explainabilityDecay: boolean;
  civilizationPreservationWeakness: boolean;
  continuationRequired: boolean;
  severityScore: number;
}): CountyGovernanceLegacyContinuityCivilizationPreservationIntegrityLevel {
  if (params.collapseSensitive) {
    return "collapse_sensitive_civilization_preservation";
  }

  if (params.failClosedDegradation) {
    return "fail_closed_civilization_preservation_degradation";
  }

  if (
    params.recursiveDegradation ||
    params.entropyRecurrence ||
    params.containmentRisk ||
    params.archiveDegradation
  ) {
    return "legacy_continuity_civilization_preservation_unstable";
  }

  if (params.doctrineDrift || params.institutionalRisk) {
    return "legacy_continuity_civilization_preservation_degrading";
  }

  if (
    params.longHorizonWeakness ||
    params.lineageWeakness ||
    params.explainabilityDecay ||
    params.civilizationPreservationWeakness
  ) {
    return "legacy_continuity_civilization_preservation_degrading";
  }

  if (params.continuationRequired) {
    return "legacy_continuity_civilization_preservation_continuation_required";
  }

  if (params.severityScore >= 25) {
    return "bounded_legacy_continuity_civilization_preservation";
  }

  return "durable_legacy_continuity_civilization_preservation";
}

export function evaluateCountyGovernanceLegacyContinuityCivilizationPreservation(
  input: CountyGovernanceLegacyContinuityCivilizationPreservationInput,
): CountyGovernanceLegacyContinuityCivilizationPreservationResult {
  const legacyContinuityCivilizationPreservationIntegrityScore = clampScore(
    input.legacyContinuityCivilizationPreservationIntegrityScore,
  );
  const longHorizonCivilizationPreservationDurabilityScore = clampScore(
    input.longHorizonCivilizationPreservationDurabilityScore,
  );
  const failClosedCivilizationPreservationScore = clampScore(input.failClosedCivilizationPreservationScore);
  const civilizationArchiveDegradationRiskScore = clampScore(input.civilizationArchiveDegradationRiskScore);
  const recursiveCivilizationPreservationDegradationRiskScore = clampScore(
    input.recursiveCivilizationPreservationDegradationRiskScore,
  );
  const institutionalCivilizationDurabilityScore = clampScore(input.institutionalCivilizationDurabilityScore);
  const containmentCivilizationPreservationStabilityScore = clampScore(
    input.containmentCivilizationPreservationStabilityScore,
  );
  const doctrineCivilizationContinuityStabilityScore = clampScore(input.doctrineCivilizationContinuityStabilityScore);
  const lineageCivilizationPreservationScore = clampScore(input.lineageCivilizationPreservationScore);
  const entropyCivilizationRecurrenceRiskScore = clampScore(input.entropyCivilizationRecurrenceRiskScore);
  const explainabilityCivilizationDurabilityScore = clampScore(input.explainabilityCivilizationDurabilityScore);
  const civilizationPreservationReevaluationPressureScore = clampScore(
    input.civilizationPreservationReevaluationPressureScore,
  );

  const failClosedCivilizationPreservationDegrading = failClosedCivilizationPreservationScore < 55;
  const civilizationArchiveDegradationDetected = civilizationArchiveDegradationRiskScore >= 45;
  const recursiveCivilizationPreservationDegradationDetected =
    recursiveCivilizationPreservationDegradationRiskScore >= 45;
  const institutionalCivilizationWeaknessDetected = institutionalCivilizationDurabilityScore < 55;
  const containmentCivilizationPreservationRiskDetected = containmentCivilizationPreservationStabilityScore < 55;
  const entropyCivilizationRecurrenceDetected = entropyCivilizationRecurrenceRiskScore >= 45;
  const doctrineCivilizationContinuityDrift = doctrineCivilizationContinuityStabilityScore < 55;
  const longHorizonCivilizationPreservationWeakness = longHorizonCivilizationPreservationDurabilityScore < 55;
  const lineageCivilizationPreservationWeakness = lineageCivilizationPreservationScore < 55;
  const explainabilityCivilizationDecay = explainabilityCivilizationDurabilityScore < 55;
  const civilizationPreservationWeakness = legacyContinuityCivilizationPreservationIntegrityScore < 75;
  const severeArchiveDegradation = civilizationArchiveDegradationRiskScore >= 88;
  const collapseSensitiveCivilizationPreservationEscalation =
    (recursiveCivilizationPreservationDegradationRiskScore >= 88 ||
      entropyCivilizationRecurrenceRiskScore >= 88 ||
      severeArchiveDegradation) &&
    (failClosedCivilizationPreservationScore < 65 || longHorizonCivilizationPreservationDurabilityScore < 55);
  const reevaluationRequired =
    civilizationPreservationReevaluationPressureScore >= 58 ||
    longHorizonCivilizationPreservationWeakness ||
    lineageCivilizationPreservationWeakness ||
    explainabilityCivilizationDecay ||
    doctrineCivilizationContinuityDrift ||
    institutionalCivilizationWeaknessDetected ||
    civilizationArchiveDegradationDetected;

  const civilizationPreservationSeverityScore = clampScore(
    maxScore([
      inverseHealthScore(legacyContinuityCivilizationPreservationIntegrityScore),
      inverseHealthScore(longHorizonCivilizationPreservationDurabilityScore),
      inverseHealthScore(failClosedCivilizationPreservationScore),
      civilizationArchiveDegradationRiskScore,
      recursiveCivilizationPreservationDegradationRiskScore,
      inverseHealthScore(institutionalCivilizationDurabilityScore),
      inverseHealthScore(containmentCivilizationPreservationStabilityScore),
      inverseHealthScore(doctrineCivilizationContinuityStabilityScore),
      inverseHealthScore(lineageCivilizationPreservationScore),
      entropyCivilizationRecurrenceRiskScore,
      inverseHealthScore(explainabilityCivilizationDurabilityScore),
      civilizationPreservationReevaluationPressureScore,
    ]),
  );

  const longHorizonCivilizationPreservation = classifyLongHorizonCivilizationPreservation({
    legacyContinuityCivilizationPreservationIntegrityScore,
    longHorizonCivilizationPreservationDurabilityScore,
    failClosedCivilizationPreservationScore,
    institutionalCivilizationDurabilityScore,
    entropyCivilizationRecurrenceRiskScore,
  });
  const civilizationPreservationExposureLevel = classifyExposure(civilizationPreservationSeverityScore);
  const civilizationPreservationReevaluationRequirementLevel = classifyReevaluation(
    Math.max(
      civilizationPreservationSeverityScore,
      civilizationPreservationReevaluationPressureScore,
      entropyCivilizationRecurrenceRiskScore,
      recursiveCivilizationPreservationDegradationRiskScore,
      civilizationArchiveDegradationRiskScore,
    ),
  );
  const continuationRequired =
    !failClosedCivilizationPreservationDegrading &&
    !collapseSensitiveCivilizationPreservationEscalation &&
    !recursiveCivilizationPreservationDegradationDetected &&
    !entropyCivilizationRecurrenceDetected &&
    !containmentCivilizationPreservationRiskDetected &&
    !civilizationArchiveDegradationDetected &&
    civilizationPreservationSeverityScore >= 35 &&
    civilizationPreservationSeverityScore < 72;

  const warningCodes = buildWarnings({
    civilizationPreservationWeakness,
    longHorizonWeakness: longHorizonCivilizationPreservationWeakness,
    failClosedDegradation: failClosedCivilizationPreservationDegrading,
    archiveDegradation: civilizationArchiveDegradationDetected,
    recursiveDegradation: recursiveCivilizationPreservationDegradationDetected,
    institutionalRisk: institutionalCivilizationWeaknessDetected,
    containmentRisk: containmentCivilizationPreservationRiskDetected,
    doctrineDrift: doctrineCivilizationContinuityDrift,
    lineageWeakness: lineageCivilizationPreservationWeakness,
    entropyRecurrence: entropyCivilizationRecurrenceDetected,
    explainabilityDecay: explainabilityCivilizationDecay,
    reevaluationRequired,
    continuationRequired,
    collapseSensitive: collapseSensitiveCivilizationPreservationEscalation,
  });

  const civilizationPreservationIntegrityLevel = classifyCivilizationPreservation({
    collapseSensitive: collapseSensitiveCivilizationPreservationEscalation,
    failClosedDegradation: failClosedCivilizationPreservationDegrading,
    recursiveDegradation: recursiveCivilizationPreservationDegradationDetected,
    entropyRecurrence: entropyCivilizationRecurrenceDetected,
    containmentRisk: containmentCivilizationPreservationRiskDetected,
    archiveDegradation: civilizationArchiveDegradationDetected,
    doctrineDrift: doctrineCivilizationContinuityDrift,
    institutionalRisk: institutionalCivilizationWeaknessDetected,
    longHorizonWeakness: longHorizonCivilizationPreservationWeakness,
    lineageWeakness: lineageCivilizationPreservationWeakness,
    explainabilityDecay: explainabilityCivilizationDecay,
    civilizationPreservationWeakness,
    continuationRequired,
    severityScore: civilizationPreservationSeverityScore,
  });

  const primaryCivilizationPreservationDriver = selectPrimaryDriver({
    "legacy continuity civilization preservation weakness": inverseHealthScore(
      legacyContinuityCivilizationPreservationIntegrityScore,
    ),
    "long-horizon civilization preservation durability weakness": inverseHealthScore(
      longHorizonCivilizationPreservationDurabilityScore,
    ),
    "fail-closed civilization preservation degradation": inverseHealthScore(failClosedCivilizationPreservationScore),
    "civilization archive degradation risk": civilizationArchiveDegradationRiskScore,
    "recursive civilization preservation degradation": recursiveCivilizationPreservationDegradationRiskScore,
    "institutional civilization durability risk": inverseHealthScore(institutionalCivilizationDurabilityScore),
    "containment civilization preservation risk": inverseHealthScore(
      containmentCivilizationPreservationStabilityScore,
    ),
    "doctrine civilization continuity drift": inverseHealthScore(doctrineCivilizationContinuityStabilityScore),
    "lineage civilization preservation weakness": inverseHealthScore(lineageCivilizationPreservationScore),
    "entropy civilization recurrence risk": entropyCivilizationRecurrenceRiskScore,
    "explainability civilization decay": inverseHealthScore(explainabilityCivilizationDurabilityScore),
    "civilization preservation reevaluation pressure": civilizationPreservationReevaluationPressureScore,
  });

  return {
    civilizationPreservationIntegrityLevel,
    civilizationPreservationSeverityScore,
    civilizationPreservationExposureLevel,
    civilizationPreservationReevaluationRequirementLevel,
    longHorizonCivilizationPreservation,
    continuationRequired,
    failClosedCivilizationPreservationDegrading,
    civilizationArchiveDegradationDetected,
    recursiveCivilizationPreservationDegradationDetected,
    institutionalCivilizationWeaknessDetected,
    containmentCivilizationPreservationRiskDetected,
    entropyCivilizationRecurrenceDetected,
    collapseSensitiveCivilizationPreservationEscalation,
    warningCodes,
    explainability: {
      primaryCivilizationPreservationDriver,
      dominantCivilizationPreservationEscalationReason:
        warningCodes[0] ??
        "No deterministic legacy continuity civilization preservation escalation threshold was crossed.",
      containmentCivilizationPreservationAssessment: containmentCivilizationPreservationRiskDetected
        ? "Projected containment is not strong enough to preserve civilization-grade governance memory under disruption pressure."
        : "Projected containment remains civilization-preservation-supporting for the current caller-supplied governance context.",
      longHorizonCivilizationPreservationAssessment:
        longHorizonCivilizationPreservation === "durable"
          ? "Long-horizon legacy continuity civilization preservation is durable under the current inputs. Civilization preservation does not imply irreversible governance preservation."
          : `Long-horizon legacy continuity civilization preservation is ${longHorizonCivilizationPreservation} under the current inputs. Legacy continuity does not guarantee civilization preservation.`,
      failClosedCivilizationPreservationAssessment: failClosedCivilizationPreservationDegrading
        ? "Fail-closed civilization preservation is degrading and overrides optimistic preservation assumptions."
        : "Fail-closed civilization preservation remains intact under the current inputs.",
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
