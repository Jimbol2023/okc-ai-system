import type {
  GovernanceSurvivabilityExpansionAreaAssessment,
  GovernanceSurvivabilityExpansionClassification,
  GovernanceSurvivabilityExpansionFinding,
} from "./governance-survivability-expansion-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function survivabilityExpansionClassificationFromScore(
  score: number,
): GovernanceSurvivabilityExpansionClassification {
  if (score >= 85) return "institutionally_scalable";
  if (score >= 70) return "scalable";
  if (score >= 45) return "conditionally_scalable";
  return "fragile";
}

export function calculateSurvivabilityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateSurvivabilityAreaScore(params: {
  baseScore: number;
  evidenceCount: number;
  limitationCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(14, params.evidenceCount * 2) +
      Math.min(10, params.explainabilityCount * 2) -
      Math.min(24, params.limitationCount * 4) -
      Math.min(26, params.findingCount * 6),
  );
}

export function calculateSurvivabilityScore(params: {
  areaAssessments: GovernanceSurvivabilityExpansionAreaAssessment[];
  findings: GovernanceSurvivabilityExpansionFinding[];
}): number {
  const survivabilityAreas = params.areaAssessments.filter((assessment) =>
    [
      "governance_principles",
      "doctrine_structures",
      "evidence_semantics",
      "traceability_semantics",
      "observability_semantics",
      "orchestration_review_semantics",
      "continuity_semantics",
      "resilience_semantics",
    ].includes(assessment.area),
  );
  const areaAverage =
    survivabilityAreas.length === 0
      ? 0
      : survivabilityAreas.reduce((total, assessment) => total + assessment.score, 0) / survivabilityAreas.length;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;
  const strongAreaBonus =
    survivabilityAreas.filter(
      (assessment) => assessment.classification === "scalable" || assessment.classification === "institutionally_scalable",
    ).length * 2;

  return clampScore(areaAverage + strongAreaBonus - elevatedPenalty - criticalPenalty);
}

export function calculateExpansionDurabilityScore(params: {
  areaAssessments: GovernanceSurvivabilityExpansionAreaAssessment[];
  findings: GovernanceSurvivabilityExpansionFinding[];
}): number {
  const expansionAreas = params.areaAssessments.filter((assessment) =>
    [
      "audit_semantics",
      "normalization_semantics",
      "registry_readiness_semantics",
      "future_ai_agents",
      "future_business_verticals",
      "future_governance_layers",
      "future_enterprise_scaling",
      "future_multi_tenant_growth",
      "multi_business_reuse",
    ].includes(assessment.area),
  );
  const areaAverage =
    expansionAreas.length === 0
      ? 0
      : expansionAreas.reduce((total, assessment) => total + assessment.score, 0) / expansionAreas.length;
  const scalingPenalty = params.findings.filter((finding) =>
    [
      "semantic_scaling_risk",
      "doctrine_scaling_risk",
      "audit_scaling_risk",
      "traceability_scaling_risk",
      "taxonomy_survivability_risk",
      "cross_industry_survivability_risk",
    ].includes(finding.findingType),
  ).length * 5;
  const strongAreaBonus =
    expansionAreas.filter(
      (assessment) => assessment.classification === "scalable" || assessment.classification === "institutionally_scalable",
    ).length * 2;

  return clampScore(areaAverage + strongAreaBonus - scalingPenalty);
}
