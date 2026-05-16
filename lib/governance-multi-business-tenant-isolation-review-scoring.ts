import type {
  GovernanceMultiBusinessTenantIsolationAreaAssessment,
  GovernanceMultiBusinessTenantIsolationClassification,
  GovernanceMultiBusinessTenantIsolationFinding,
} from "./governance-multi-business-tenant-isolation-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function multiBusinessTenantIsolationClassificationFromScore(
  score: number,
): GovernanceMultiBusinessTenantIsolationClassification {
  if (score >= 85) return "institutionally_isolated";
  if (score >= 70) return "isolated";
  if (score >= 45) return "partially_isolated";
  return "contaminated";
}

export function calculateMultiBusinessTenantIsolationFindingConfidence(params: {
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

export function calculateMultiBusinessTenantIsolationAreaScore(params: {
  baseScore: number;
  isolationStrengthSignalCount: number;
  isolationRiskSignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(18, params.isolationStrengthSignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(34, params.isolationRiskSignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallMultiBusinessTenantIsolationScore(params: {
  areaAssessments: GovernanceMultiBusinessTenantIsolationAreaAssessment[];
  findings: GovernanceMultiBusinessTenantIsolationFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) /
        params.areaAssessments.length;
  const durableAreaBonus =
    params.areaAssessments.filter(
      (assessment) =>
        assessment.classification === "isolated" ||
        assessment.classification === "institutionally_isolated",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + durableAreaBonus - elevatedPenalty - criticalPenalty);
}
