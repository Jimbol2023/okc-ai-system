import type {
  GovernancePrincipleRegistryReadinessArea,
  GovernancePrincipleRegistryReadinessClassification,
  GovernancePrincipleRegistryReviewFinding,
  GovernancePrincipleRegistryReviewInput,
} from "./governance-principle-registry-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function registryReadinessClassificationFromScore(
  score: number,
): GovernancePrincipleRegistryReadinessClassification {
  if (score >= 85) return "institutionally_registry_ready";
  if (score >= 70) return "registry_candidate";
  if (score >= 45) return "developing";
  return "unstable";
}

export function calculateRegistryReviewFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(22, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateReadinessAreaScore(params: {
  completenessScore: number;
  consistencyScore: number;
  explainabilityScore: number;
  limitationPenalty?: number;
}): number {
  return clampScore(
    params.completenessScore * 0.42 +
      params.consistencyScore * 0.36 +
      params.explainabilityScore * 0.22 -
      (params.limitationPenalty ?? 0),
  );
}

export function calculateRegistryReadinessScore(params: {
  input: GovernancePrincipleRegistryReviewInput;
  readinessAreas: GovernancePrincipleRegistryReadinessArea[];
  findings: GovernancePrincipleRegistryReviewFinding[];
}): number {
  const areaAverage =
    params.readinessAreas.length === 0
      ? 0
      : params.readinessAreas.reduce((total, area) => total + area.score, 0) / params.readinessAreas.length;
  const contextBonus =
    (params.input.doctrineResult ? 7 : 0) +
    (params.input.normalizationResult ? 9 : 0) +
    (params.input.traceabilityResult ? 7 : 0) +
    (params.input.auditResult ? 7 : 0);
  const registryCandidateBonus =
    params.readinessAreas.filter(
      (area) => area.status === "registry_candidate" || area.status === "institutionally_registry_ready",
    ).length * 2;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 12;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 8;
  const moderatePenalty = params.findings.filter((finding) => finding.severity === "moderate").length * 4;

  return clampScore(areaAverage * 0.72 + contextBonus + registryCandidateBonus - criticalPenalty - elevatedPenalty - moderatePenalty);
}
