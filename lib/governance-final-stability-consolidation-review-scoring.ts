import type {
  GovernanceFinalStabilityAreaAssessment,
  GovernanceFinalStabilityClassification,
  GovernanceFinalStabilityFinding,
} from "./governance-final-stability-consolidation-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function finalGovernanceStabilityClassificationFromScore(
  score: number,
): GovernanceFinalStabilityClassification {
  if (score >= 85) return "institutionally_stable";
  if (score >= 70) return "stable";
  if (score >= 45) return "partially_stable";
  return "unstable";
}

export function calculateFinalGovernanceStabilityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore(
    (params.baseConfidence ?? 58) +
      Math.min(24, params.evidenceCount * 5) +
      Math.min(16, params.factorCount * 3),
  );
}

export function calculateFinalGovernanceStabilityAreaScore(params: {
  baseScore: number;
  stabilitySignalCount: number;
  fragilitySignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(18, params.stabilitySignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(34, params.fragilitySignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallFinalGovernanceStabilityScore(params: {
  areaAssessments: GovernanceFinalStabilityAreaAssessment[];
  findings: GovernanceFinalStabilityFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) /
        params.areaAssessments.length;
  const stableAreaBonus =
    params.areaAssessments.filter(
      (assessment) =>
        assessment.classification === "stable" ||
        assessment.classification === "institutionally_stable",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + stableAreaBonus - elevatedPenalty - criticalPenalty);
}
