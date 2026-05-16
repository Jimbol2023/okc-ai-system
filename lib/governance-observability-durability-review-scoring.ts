import type {
  GovernanceObservabilityDurabilityAreaAssessment,
  GovernanceObservabilityDurabilityClassification,
  GovernanceObservabilityDurabilityFinding,
} from "./governance-observability-durability-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function observabilityDurabilityClassificationFromScore(
  score: number,
): GovernanceObservabilityDurabilityClassification {
  if (score >= 85) return "institutionally_observable";
  if (score >= 70) return "observable";
  if (score >= 45) return "conditionally_observable";
  return "fragile";
}

export function calculateObservabilityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateObservabilityAreaScore(params: {
  baseScore: number;
  visibleSignalCount: number;
  blindSpotCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(16, params.visibleSignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(26, params.blindSpotCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateObservabilityDurabilityScore(params: {
  areaAssessments: GovernanceObservabilityDurabilityAreaAssessment[];
  findings: GovernanceObservabilityDurabilityFinding[];
}): number {
  const durabilityAreas = params.areaAssessments.filter((assessment) =>
    [
      "governance_dashboards",
      "audit_visibility",
      "traceability_visibility",
      "explainability_visibility",
      "survivability_visibility",
      "semantic_visibility",
      "continuity_visibility",
      "resilience_visibility",
      "evidence_visibility",
    ].includes(assessment.area),
  );
  const areaAverage =
    durabilityAreas.length === 0
      ? 0
      : durabilityAreas.reduce((total, assessment) => total + assessment.score, 0) / durabilityAreas.length;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;
  const strongAreaBonus =
    durabilityAreas.filter(
      (assessment) => assessment.classification === "observable" || assessment.classification === "institutionally_observable",
    ).length * 2;

  return clampScore(areaAverage + strongAreaBonus - elevatedPenalty - criticalPenalty);
}

export function calculateObservabilityScalabilityScore(params: {
  areaAssessments: GovernanceObservabilityDurabilityAreaAssessment[];
  findings: GovernanceObservabilityDurabilityFinding[];
}): number {
  const scalabilityAreas = params.areaAssessments.filter((assessment) =>
    [
      "orchestration_visibility",
      "registry_readiness_visibility",
      "normalization_visibility",
      "future_dashboard_scaling",
      "future_observability_growth",
      "future_ai_agent_growth",
      "future_multi_tenant_visibility",
      "cross_industry_observability",
    ].includes(assessment.area),
  );
  const areaAverage =
    scalabilityAreas.length === 0
      ? 0
      : scalabilityAreas.reduce((total, assessment) => total + assessment.score, 0) / scalabilityAreas.length;
  const scalingPenalty = params.findings.filter((finding) =>
    [
      "dashboard_survivability_risk",
      "scalability_visibility_bottleneck",
      "future_registry_observability_incompatibility",
      "observability_coupling_risk",
      "cross_industry_observability_risk",
    ].includes(finding.findingType),
  ).length * 5;
  const strongAreaBonus =
    scalabilityAreas.filter(
      (assessment) => assessment.classification === "observable" || assessment.classification === "institutionally_observable",
    ).length * 2;

  return clampScore(areaAverage + strongAreaBonus - scalingPenalty);
}
