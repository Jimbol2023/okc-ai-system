export type CountyGovernanceRestorationNonRegressionLevel =
  | "stable_non_regressive"
  | "bounded_regression_risk"
  | "continuation_required"
  | "regression_escalating"
  | "restoration_instability"
  | "fail_closed_degradation"
  | "collapse_sensitive";

export type CountyGovernanceRestorationRegressionExposureLevel =
  | "minimal"
  | "contained"
  | "elevated"
  | "amplifying"
  | "critical";

export type CountyGovernanceRestorationReevaluationRequirementLevel =
  | "none"
  | "recommended"
  | "required"
  | "immediate";

export type CountyGovernanceRestorationSustainability =
  | "stable"
  | "drifting"
  | "unstable"
  | "non_sustainable";

export type CountyGovernanceRestorationNonRegressionWarningCode =
  | "RESTORATION_REGRESSION_DRIFT"
  | "CONTINUITY_NON_REGRESSION_WEAKNESS"
  | "SURVIVABILITY_CONTAINMENT_FAILURE"
  | "TRACE_REGRESSION_EXPOSURE"
  | "DOCTRINE_REGRESSION_ACCUMULATION"
  | "FAIL_CLOSED_DEGRADATION"
  | "ROLLBACK_INSTABILITY_DETECTED"
  | "RECURSIVE_REGRESSION_AMPLIFICATION"
  | "RESTORATION_DRIFT_ESCALATION"
  | "INSTITUTIONAL_REGRESSION_RISK"
  | "NON_REGRESSION_EXPLAINABILITY_DECAY"
  | "LINEAGE_CONTINUITY_WEAKNESS"
  | "REEVALUATION_REQUIRED"
  | "COLLAPSE_SENSITIVE_ESCALATION"
  | "RESTORATION_SUSTAINABILITY_FAILURE";

export type CountyGovernanceRestorationNonRegressionInput = {
  restorationIntegrityScore: number;
  continuityDurabilityScore: number;
  survivabilityContainmentScore: number;
  traceIntegrityScore: number;
  doctrineConsistencyScore: number;
  failClosedIntegrityScore: number;
  rollbackStabilityScore: number;
  restorationDriftScore: number;
  recursiveRestorationExposureScore: number;
  institutionalRegressionExposureScore: number;
  explainabilityDurabilityScore: number;
  lineageContinuityScore: number;
  reevaluationPressureScore: number;
};

export type CountyGovernanceRestorationNonRegressionResult = {
  nonRegressionLevel: CountyGovernanceRestorationNonRegressionLevel;
  regressionSeverityScore: number;
  regressionExposureLevel: CountyGovernanceRestorationRegressionExposureLevel;
  reevaluationRequirementLevel: CountyGovernanceRestorationReevaluationRequirementLevel;
  restorationSustainability: CountyGovernanceRestorationSustainability;
  continuationRequired: boolean;
  failClosedProtectionDegrading: boolean;
  recursiveRegressionDetected: boolean;
  rollbackInstabilityDetected: boolean;
  collapseSensitiveEscalation: boolean;
  warningCodes: string[];
  explainability: {
    primaryRegressionDriver: string;
    dominantEscalationReason: string;
    containmentAssessment: string;
    restorationDurabilityAssessment: string;
  };
  advisoryOnly: true;
  planningOnly: true;
  executionBlocked: true;
  automationBlocked: true;
  ingestionBlocked: true;
  failClosed: true;
};

const warningOrder: CountyGovernanceRestorationNonRegressionWarningCode[] = [
  "FAIL_CLOSED_DEGRADATION",
  "COLLAPSE_SENSITIVE_ESCALATION",
  "RECURSIVE_REGRESSION_AMPLIFICATION",
  "RESTORATION_SUSTAINABILITY_FAILURE",
  "ROLLBACK_INSTABILITY_DETECTED",
  "DOCTRINE_REGRESSION_ACCUMULATION",
  "RESTORATION_DRIFT_ESCALATION",
  "SURVIVABILITY_CONTAINMENT_FAILURE",
  "CONTINUITY_NON_REGRESSION_WEAKNESS",
  "TRACE_REGRESSION_EXPOSURE",
  "LINEAGE_CONTINUITY_WEAKNESS",
  "NON_REGRESSION_EXPLAINABILITY_DECAY",
  "REEVALUATION_REQUIRED",
  "RESTORATION_REGRESSION_DRIFT",
  "INSTITUTIONAL_REGRESSION_RISK",
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

function classifyExposure(score: number): CountyGovernanceRestorationRegressionExposureLevel {
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

function classifyReevaluation(score: number): CountyGovernanceRestorationReevaluationRequirementLevel {
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

function classifySustainability(params: {
  restorationIntegrityScore: number;
  rollbackStabilityScore: number;
  restorationDriftScore: number;
  doctrineConsistencyScore: number;
  institutionalRegressionExposureScore: number;
}): CountyGovernanceRestorationSustainability {
  if (
    params.restorationIntegrityScore < 35 ||
    params.rollbackStabilityScore < 35 ||
    params.restorationDriftScore >= 88 ||
    params.institutionalRegressionExposureScore >= 88
  ) {
    return "non_sustainable";
  }

  if (
    params.restorationIntegrityScore < 55 ||
    params.rollbackStabilityScore < 55 ||
    params.restorationDriftScore >= 72 ||
    params.doctrineConsistencyScore < 55
  ) {
    return "unstable";
  }

  if (
    params.restorationIntegrityScore < 75 ||
    params.rollbackStabilityScore < 75 ||
    params.restorationDriftScore >= 45 ||
    params.doctrineConsistencyScore < 75 ||
    params.institutionalRegressionExposureScore >= 50
  ) {
    return "drifting";
  }

  return "stable";
}

function buildWarnings(params: {
  restorationRegressionDrift: boolean;
  continuityWeakness: boolean;
  survivabilityContainmentFailure: boolean;
  traceRegressionExposure: boolean;
  doctrineRegressionAccumulation: boolean;
  failClosedDegradation: boolean;
  rollbackInstability: boolean;
  recursiveAmplification: boolean;
  restorationDriftEscalation: boolean;
  institutionalRegressionRisk: boolean;
  explainabilityDecay: boolean;
  lineageWeakness: boolean;
  reevaluationRequired: boolean;
  collapseSensitiveEscalation: boolean;
  sustainabilityFailure: boolean;
}): CountyGovernanceRestorationNonRegressionWarningCode[] {
  const warnings = new Set<CountyGovernanceRestorationNonRegressionWarningCode>();

  if (params.restorationRegressionDrift) {
    warnings.add("RESTORATION_REGRESSION_DRIFT");
  }

  if (params.continuityWeakness) {
    warnings.add("CONTINUITY_NON_REGRESSION_WEAKNESS");
  }

  if (params.survivabilityContainmentFailure) {
    warnings.add("SURVIVABILITY_CONTAINMENT_FAILURE");
  }

  if (params.traceRegressionExposure) {
    warnings.add("TRACE_REGRESSION_EXPOSURE");
  }

  if (params.doctrineRegressionAccumulation) {
    warnings.add("DOCTRINE_REGRESSION_ACCUMULATION");
  }

  if (params.failClosedDegradation) {
    warnings.add("FAIL_CLOSED_DEGRADATION");
  }

  if (params.rollbackInstability) {
    warnings.add("ROLLBACK_INSTABILITY_DETECTED");
  }

  if (params.recursiveAmplification) {
    warnings.add("RECURSIVE_REGRESSION_AMPLIFICATION");
  }

  if (params.restorationDriftEscalation) {
    warnings.add("RESTORATION_DRIFT_ESCALATION");
  }

  if (params.institutionalRegressionRisk) {
    warnings.add("INSTITUTIONAL_REGRESSION_RISK");
  }

  if (params.explainabilityDecay) {
    warnings.add("NON_REGRESSION_EXPLAINABILITY_DECAY");
  }

  if (params.lineageWeakness) {
    warnings.add("LINEAGE_CONTINUITY_WEAKNESS");
  }

  if (params.reevaluationRequired) {
    warnings.add("REEVALUATION_REQUIRED");
  }

  if (params.collapseSensitiveEscalation) {
    warnings.add("COLLAPSE_SENSITIVE_ESCALATION");
  }

  if (params.sustainabilityFailure) {
    warnings.add("RESTORATION_SUSTAINABILITY_FAILURE");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function selectPrimaryDriver(scores: Record<string, number>): string {
  return Object.entries(scores).reduce(
    (selected, candidate) => (candidate[1] > selected[1] ? candidate : selected),
    ["restoration non-regression integrity", 0],
  )[0];
}

function classifyNonRegression(params: {
  failClosedDegradation: boolean;
  collapseSensitiveEscalation: boolean;
  recursiveAmplification: boolean;
  sustainabilityFailure: boolean;
  rollbackInstability: boolean;
  doctrineRegressionAccumulation: boolean;
  restorationDriftEscalation: boolean;
  survivabilityContainmentFailure: boolean;
  continuationRequired: boolean;
  regressionSeverityScore: number;
}): CountyGovernanceRestorationNonRegressionLevel {
  if (params.failClosedDegradation) {
    return "fail_closed_degradation";
  }

  if (params.collapseSensitiveEscalation) {
    return "collapse_sensitive";
  }

  if (params.recursiveAmplification) {
    return "regression_escalating";
  }

  if (params.sustainabilityFailure) {
    return "restoration_instability";
  }

  if (
    params.rollbackInstability ||
    params.doctrineRegressionAccumulation ||
    params.restorationDriftEscalation ||
    params.survivabilityContainmentFailure
  ) {
    return "restoration_instability";
  }

  if (params.continuationRequired) {
    return "continuation_required";
  }

  if (params.regressionSeverityScore >= 25) {
    return "bounded_regression_risk";
  }

  return "stable_non_regressive";
}

export function evaluateCountyGovernanceRestorationNonRegression(
  input: CountyGovernanceRestorationNonRegressionInput,
): CountyGovernanceRestorationNonRegressionResult {
  const restorationIntegrityScore = clampScore(input.restorationIntegrityScore);
  const continuityDurabilityScore = clampScore(input.continuityDurabilityScore);
  const survivabilityContainmentScore = clampScore(input.survivabilityContainmentScore);
  const traceIntegrityScore = clampScore(input.traceIntegrityScore);
  const doctrineConsistencyScore = clampScore(input.doctrineConsistencyScore);
  const failClosedIntegrityScore = clampScore(input.failClosedIntegrityScore);
  const rollbackStabilityScore = clampScore(input.rollbackStabilityScore);
  const restorationDriftScore = clampScore(input.restorationDriftScore);
  const recursiveRestorationExposureScore = clampScore(input.recursiveRestorationExposureScore);
  const institutionalRegressionExposureScore = clampScore(input.institutionalRegressionExposureScore);
  const explainabilityDurabilityScore = clampScore(input.explainabilityDurabilityScore);
  const lineageContinuityScore = clampScore(input.lineageContinuityScore);
  const reevaluationPressureScore = clampScore(input.reevaluationPressureScore);

  const failClosedProtectionDegrading = failClosedIntegrityScore < 55;
  const collapseSensitiveEscalation =
    recursiveRestorationExposureScore >= 88 ||
    institutionalRegressionExposureScore >= 92 ||
    (restorationDriftScore >= 88 && (traceIntegrityScore < 55 || lineageContinuityScore < 55));
  const recursiveRegressionDetected =
    recursiveRestorationExposureScore >= 72 ||
    (recursiveRestorationExposureScore >= 58 && restorationDriftScore >= 58);
  const sustainabilityFailure =
    restorationIntegrityScore < 35 ||
    restorationDriftScore >= 88 ||
    (rollbackStabilityScore < 45 && doctrineConsistencyScore < 55);
  const rollbackInstabilityDetected = rollbackStabilityScore < 55;
  const doctrineRegressionAccumulation = doctrineConsistencyScore < 65;
  const restorationDriftEscalation = restorationDriftScore >= 65;
  const survivabilityContainmentFailure = survivabilityContainmentScore < 55;
  const continuityWeakness = continuityDurabilityScore < 65;
  const traceRegressionExposure = traceIntegrityScore < 65;
  const lineageWeakness = lineageContinuityScore < 65;
  const explainabilityDecay = explainabilityDurabilityScore < 65;
  const restorationRegressionDrift = restorationIntegrityScore < 75 || restorationDriftScore >= 45;
  const institutionalRegressionRisk = institutionalRegressionExposureScore >= 58;
  const reevaluationRequired =
    reevaluationPressureScore >= 58 ||
    restorationDriftScore >= 58 ||
    continuityWeakness ||
    traceRegressionExposure ||
    lineageWeakness ||
    explainabilityDecay;

  const regressionSeverityScore = clampScore(
    Math.round(
      maxScore([
        inverseHealthScore(restorationIntegrityScore),
        inverseHealthScore(continuityDurabilityScore),
        inverseHealthScore(survivabilityContainmentScore),
        inverseHealthScore(traceIntegrityScore),
        inverseHealthScore(doctrineConsistencyScore),
        inverseHealthScore(failClosedIntegrityScore),
        inverseHealthScore(rollbackStabilityScore),
        restorationDriftScore,
        recursiveRestorationExposureScore,
        institutionalRegressionExposureScore,
        inverseHealthScore(explainabilityDurabilityScore),
        inverseHealthScore(lineageContinuityScore),
        reevaluationPressureScore,
      ]),
    ),
  );

  const restorationSustainability = classifySustainability({
    restorationIntegrityScore,
    rollbackStabilityScore,
    restorationDriftScore,
    doctrineConsistencyScore,
    institutionalRegressionExposureScore,
  });
  const regressionExposureLevel = classifyExposure(regressionSeverityScore);
  const reevaluationRequirementLevel = classifyReevaluation(
    Math.max(reevaluationPressureScore, regressionSeverityScore, restorationDriftScore),
  );
  const continuationRequired =
    !failClosedProtectionDegrading &&
    !collapseSensitiveEscalation &&
    !recursiveRegressionDetected &&
    regressionSeverityScore >= 35 &&
    regressionSeverityScore < 72;

  const warningCodes = buildWarnings({
    restorationRegressionDrift,
    continuityWeakness,
    survivabilityContainmentFailure,
    traceRegressionExposure,
    doctrineRegressionAccumulation,
    failClosedDegradation: failClosedProtectionDegrading,
    rollbackInstability: rollbackInstabilityDetected,
    recursiveAmplification: recursiveRegressionDetected,
    restorationDriftEscalation,
    institutionalRegressionRisk,
    explainabilityDecay,
    lineageWeakness,
    reevaluationRequired,
    collapseSensitiveEscalation,
    sustainabilityFailure: restorationSustainability === "non_sustainable",
  });

  const primaryRegressionDriver = selectPrimaryDriver({
    "restoration integrity weakness": inverseHealthScore(restorationIntegrityScore),
    "continuity non-regression weakness": inverseHealthScore(continuityDurabilityScore),
    "survivability containment weakness": inverseHealthScore(survivabilityContainmentScore),
    "trace regression exposure": inverseHealthScore(traceIntegrityScore),
    "doctrine regression accumulation": inverseHealthScore(doctrineConsistencyScore),
    "fail-closed degradation": inverseHealthScore(failClosedIntegrityScore),
    "rollback instability": inverseHealthScore(rollbackStabilityScore),
    "restoration drift": restorationDriftScore,
    "recursive regression amplification": recursiveRestorationExposureScore,
    "institutional regression risk": institutionalRegressionExposureScore,
    "explainability durability decay": inverseHealthScore(explainabilityDurabilityScore),
    "lineage continuity weakness": inverseHealthScore(lineageContinuityScore),
    "reevaluation pressure": reevaluationPressureScore,
  });

  const nonRegressionLevel = classifyNonRegression({
    failClosedDegradation: failClosedProtectionDegrading,
    collapseSensitiveEscalation,
    recursiveAmplification: recursiveRegressionDetected,
    sustainabilityFailure: restorationSustainability === "non_sustainable",
    rollbackInstability: rollbackInstabilityDetected,
    doctrineRegressionAccumulation,
    restorationDriftEscalation,
    survivabilityContainmentFailure,
    continuationRequired,
    regressionSeverityScore,
  });

  return {
    nonRegressionLevel,
    regressionSeverityScore,
    regressionExposureLevel,
    reevaluationRequirementLevel,
    restorationSustainability,
    continuationRequired,
    failClosedProtectionDegrading,
    recursiveRegressionDetected,
    rollbackInstabilityDetected,
    collapseSensitiveEscalation,
    warningCodes,
    explainability: {
      primaryRegressionDriver,
      dominantEscalationReason:
        warningCodes[0] ?? "No deterministic restoration non-regression escalation threshold was crossed.",
      containmentAssessment: survivabilityContainmentFailure
        ? "Survivability remains present but containment is insufficient to prevent restoration regression spread."
        : "Survivability containment is sufficient for the current caller-supplied restoration context.",
      restorationDurabilityAssessment:
        restorationSustainability === "stable"
          ? "Restoration durability is stable under the current non-regression inputs."
          : `Restoration durability is ${restorationSustainability} under the current non-regression inputs.`,
    },
    advisoryOnly: true,
    planningOnly: true,
    executionBlocked: true,
    automationBlocked: true,
    ingestionBlocked: true,
    failClosed: true,
  };
}
