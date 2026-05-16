import type {
  GovernanceLifecycleContinuityAreaAssessment,
  GovernanceLifecycleContinuityClassification,
  GovernanceLifecycleContinuityFinding,
} from "./governance-lifecycle-continuity-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function lifecycleContinuityClassificationFromScore(score: number): GovernanceLifecycleContinuityClassification {
  if (score >= 85) return "institutionally_continuous";
  if (score >= 70) return "continuous";
  if (score >= 45) return "partially_continuous";
  return "discontinuous";
}

export function calculateLifecycleContinuityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateLifecycleContinuityAreaScore(params: {
  baseScore: number;
  continuitySignalCount: number;
  fragilitySignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(16, params.continuitySignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(30, params.fragilitySignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallLifecycleContinuityScore(params: {
  areaAssessments: GovernanceLifecycleContinuityAreaAssessment[];
  findings: GovernanceLifecycleContinuityFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) / params.areaAssessments.length;
  const durableAreaBonus =
    params.areaAssessments.filter(
      (assessment) => assessment.classification === "continuous" || assessment.classification === "institutionally_continuous",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + durableAreaBonus - elevatedPenalty - criticalPenalty);
}
