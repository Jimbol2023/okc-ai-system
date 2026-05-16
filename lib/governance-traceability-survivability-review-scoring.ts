import type {
  GovernanceTraceabilitySurvivabilityAreaAssessment,
  GovernanceTraceabilitySurvivabilityClassification,
  GovernanceTraceabilitySurvivabilityFinding,
} from "./governance-traceability-survivability-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function traceabilitySurvivabilityClassificationFromScore(
  score: number,
): GovernanceTraceabilitySurvivabilityClassification {
  if (score >= 85) return "institutionally_traceable";
  if (score >= 70) return "traceable";
  if (score >= 45) return "partially_traceable";
  return "collapsed";
}

export function calculateTraceabilitySurvivabilityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateTraceabilitySurvivabilityAreaScore(params: {
  baseScore: number;
  traceableSignalCount: number;
  fragileSignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(18, params.traceableSignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(32, params.fragileSignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallTraceabilitySurvivabilityScore(params: {
  areaAssessments: GovernanceTraceabilitySurvivabilityAreaAssessment[];
  findings: GovernanceTraceabilitySurvivabilityFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) / params.areaAssessments.length;
  const durableAreaBonus =
    params.areaAssessments.filter(
      (assessment) => assessment.classification === "traceable" || assessment.classification === "institutionally_traceable",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + durableAreaBonus - elevatedPenalty - criticalPenalty);
}
