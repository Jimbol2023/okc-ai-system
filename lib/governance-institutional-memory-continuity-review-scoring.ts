import type {
  GovernanceInstitutionalMemoryContinuityAreaAssessment,
  GovernanceInstitutionalMemoryContinuityClassification,
  GovernanceInstitutionalMemoryContinuityFinding,
} from "./governance-institutional-memory-continuity-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function institutionalMemoryContinuityClassificationFromScore(
  score: number,
): GovernanceInstitutionalMemoryContinuityClassification {
  if (score >= 85) return "institutionally_reconstructable";
  if (score >= 70) return "reconstructable";
  if (score >= 45) return "partially_reconstructable";
  return "fragmented";
}

export function calculateInstitutionalMemoryContinuityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateInstitutionalMemoryContinuityAreaScore(params: {
  baseScore: number;
  reconstructableSignalCount: number;
  memoryFragilitySignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(16, params.reconstructableSignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(30, params.memoryFragilitySignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallInstitutionalMemoryContinuityScore(params: {
  areaAssessments: GovernanceInstitutionalMemoryContinuityAreaAssessment[];
  findings: GovernanceInstitutionalMemoryContinuityFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) / params.areaAssessments.length;
  const durableAreaBonus =
    params.areaAssessments.filter(
      (assessment) =>
        assessment.classification === "reconstructable" ||
        assessment.classification === "institutionally_reconstructable",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + durableAreaBonus - elevatedPenalty - criticalPenalty);
}
