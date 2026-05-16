import type {
  GovernanceSemanticDomainAssessment,
  GovernanceSemanticStabilityClassification,
  GovernanceSemanticStabilityFinding,
  GovernanceSemanticTermObservation,
} from "./governance-semantic-stability-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function semanticStabilityClassificationFromScore(score: number): GovernanceSemanticStabilityClassification {
  if (score >= 85) return "institutionally_stable";
  if (score >= 70) return "stable";
  if (score >= 45) return "mostly_stable";
  return "unstable";
}

export function calculateSemanticFindingConfidence(params: {
  evidenceCount: number;
  termCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore(
    (params.baseConfidence ?? 58) +
      Math.min(20, params.evidenceCount * 4) +
      Math.min(14, params.termCount * 3) +
      Math.min(14, params.factorCount * 3),
  );
}

export function calculateSemanticDomainScore(params: {
  observations: GovernanceSemanticTermObservation[];
  findings: GovernanceSemanticStabilityFinding[];
  contextSupplied: boolean;
}): number {
  const uniqueTermCount = new Set(params.observations.map((observation) => observation.normalizedTerm)).size;
  const sourceCount = new Set(params.observations.map((observation) => observation.sourceModule)).size;
  const coverageScore = params.contextSupplied ? Math.min(82, 34 + uniqueTermCount * 5 + sourceCount * 7) : 32;
  const driftPenalty = params.findings.filter((finding) => finding.findingType === "semantic_drift").length * 10;
  const ambiguityPenalty = params.findings.filter(
    (finding) => finding.findingType === "recommendation_ambiguity" || finding.findingType === "limitation_ambiguity",
  ).length * 6;
  const instabilityPenalty = params.findings.filter((finding) =>
    ["classification_mismatch", "scoring_semantic_instability", "traceability_terminology_gap"].includes(finding.findingType),
  ).length * 8;
  const explainabilityBonus = params.observations.some((observation) => observation.evidence.length > 0) ? 10 : 0;

  return clampScore(coverageScore + explainabilityBonus - driftPenalty - ambiguityPenalty - instabilityPenalty);
}

export function calculateOverallSemanticStabilityScore(params: {
  domainAssessments: GovernanceSemanticDomainAssessment[];
  findings: GovernanceSemanticStabilityFinding[];
}): number {
  const domainAverage =
    params.domainAssessments.length === 0
      ? 0
      : params.domainAssessments.reduce((total, assessment) => total + assessment.score, 0) /
        params.domainAssessments.length;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;
  const stableDomainBonus =
    params.domainAssessments.filter(
      (assessment) => assessment.classification === "stable" || assessment.classification === "institutionally_stable",
    ).length * 2;

  return clampScore(domainAverage + stableDomainBonus - elevatedPenalty - criticalPenalty);
}
