import type {
  GovernanceAuditHistorySurvivabilityAreaAssessment,
  GovernanceAuditHistorySurvivabilityClassification,
  GovernanceAuditHistorySurvivabilityFinding,
} from "./governance-audit-history-survivability-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function auditHistorySurvivabilityClassificationFromScore(
  score: number,
): GovernanceAuditHistorySurvivabilityClassification {
  if (score >= 85) return "institutionally_survivable";
  if (score >= 70) return "survivable";
  if (score >= 45) return "partially_survivable";
  return "fragmented";
}

export function calculateAuditHistorySurvivabilityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateAuditHistorySurvivabilityAreaScore(params: {
  baseScore: number;
  survivabilitySignalCount: number;
  fragilitySignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(16, params.survivabilitySignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(30, params.fragilitySignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallAuditHistorySurvivabilityScore(params: {
  areaAssessments: GovernanceAuditHistorySurvivabilityAreaAssessment[];
  findings: GovernanceAuditHistorySurvivabilityFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) / params.areaAssessments.length;
  const durableAreaBonus =
    params.areaAssessments.filter(
      (assessment) => assessment.classification === "survivable" || assessment.classification === "institutionally_survivable",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + durableAreaBonus - elevatedPenalty - criticalPenalty);
}
