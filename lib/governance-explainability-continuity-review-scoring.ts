import type {
  GovernanceExplainabilityContinuityAreaAssessment,
  GovernanceExplainabilityContinuityClassification,
  GovernanceExplainabilityContinuityFinding,
} from "./governance-explainability-continuity-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function explainabilityContinuityClassificationFromScore(
  score: number,
): GovernanceExplainabilityContinuityClassification {
  if (score >= 85) return "institutionally_explainable";
  if (score >= 70) return "explainable";
  if (score >= 45) return "partially_explainable";
  return "opaque";
}

export function calculateExplainabilityContinuityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateExplainabilityContinuityAreaScore(params: {
  baseScore: number;
  explainabilitySignalCount: number;
  opacitySignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(18, params.explainabilitySignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(32, params.opacitySignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallExplainabilityContinuityScore(params: {
  areaAssessments: GovernanceExplainabilityContinuityAreaAssessment[];
  findings: GovernanceExplainabilityContinuityFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) / params.areaAssessments.length;
  const durableAreaBonus =
    params.areaAssessments.filter(
      (assessment) => assessment.classification === "explainable" || assessment.classification === "institutionally_explainable",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + durableAreaBonus - elevatedPenalty - criticalPenalty);
}
