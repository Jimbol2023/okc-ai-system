import type { GovernanceEvidenceTraceStrength } from "./governance-evidence-traceability-types";
import type {
  PrincipleEvidenceNormalizedMapping,
  PrincipleEvidenceNormalizationClassification,
  PrincipleEvidenceNormalizationGap,
  PrincipleEvidenceNormalizationInput,
} from "./principle-evidence-normalization-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function principleEvidenceNormalizationClassificationFromScore(
  score: number,
): PrincipleEvidenceNormalizationClassification {
  if (score >= 85) return "institutionally_consistent";
  if (score >= 70) return "normalized";
  if (score >= 45) return "partially_normalized";
  return "fragmented";
}

export function mappingStrengthFromScore(score: number): GovernanceEvidenceTraceStrength {
  if (score >= 85) return "institutionally_traceable";
  if (score >= 70) return "strong";
  if (score >= 45) return "moderate";
  return "weak";
}

export function calculatePrincipleEvidenceMappingScore(
  mapping: Omit<PrincipleEvidenceNormalizedMapping, "mappingStrength">,
): number {
  const completeness =
    (mapping.principleType !== "not_supplied" ? 10 : 0) +
    (mapping.principleLabel ? 8 : 0) +
    (mapping.auditCategories.length > 0 ? 8 : 0) +
    (mapping.evidenceIds.length > 0 ? 10 : 0) +
    (mapping.evidenceSummaries.length > 0 ? 10 : 0) +
    (mapping.scoringDrivers.length > 0 ? 10 : 0) +
    (mapping.reasoningChains.length > 0 ? 10 : 0) +
    (mapping.limitations.length > 0 ? 8 : 0) +
    (mapping.recommendationIds.length > 0 ? 8 : 0) +
    (mapping.traceIds.length > 0 ? 8 : 0) +
    (mapping.explainability.factors.length > 0 ? 5 : 0) +
    (mapping.explainability.reasoning.length > 0 ? 5 : 0);
  const confidenceAdjustment = Math.max(-10, Math.min(12, mapping.confidenceImpact * 0.08));
  const riskAdjustment = Math.max(-16, Math.min(6, -mapping.riskImpact * 0.1));
  const humanReviewAdjustment = mapping.humanReviewRequired ? 2 : 0;

  return clampScore(completeness + confidenceAdjustment + riskAdjustment + humanReviewAdjustment);
}

export function calculatePrincipleEvidenceGapConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 56) + Math.min(22, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculatePrincipleEvidenceNormalizationScore(params: {
  input: PrincipleEvidenceNormalizationInput;
  mappings: PrincipleEvidenceNormalizedMapping[];
  gaps: PrincipleEvidenceNormalizationGap[];
}): number {
  const mappingAverage =
    params.mappings.length === 0
      ? 0
      : params.mappings.reduce((total, mapping) => total + calculatePrincipleEvidenceMappingScore(mapping), 0) /
        params.mappings.length;
  const contextBonus =
    (params.input.doctrineResult ? 8 : 0) +
    (params.input.auditResult ? 8 : 0) +
    (params.input.traceabilityResult ? 10 : 0) +
    ((params.input.traceLinks?.length ?? 0) > 0 ? 5 : 0);
  const traceDepthBonus = Math.min(14, params.mappings.reduce((total, mapping) => total + mapping.traceIds.length, 0));
  const strongMappingBonus =
    params.mappings.filter(
      (mapping) => mapping.mappingStrength === "strong" || mapping.mappingStrength === "institutionally_traceable",
    ).length * 3;
  const weakMappingPenalty = params.mappings.filter((mapping) => mapping.mappingStrength === "weak").length * 6;
  const semanticDriftPenalty = params.gaps.filter((gap) => gap.gapType === "governance_semantic_drift_risk").length * 7;
  const gapPenalty = Math.min(38, params.gaps.length * 4);

  return clampScore(
    mappingAverage * 0.66 +
      contextBonus +
      traceDepthBonus +
      strongMappingBonus -
      weakMappingPenalty -
      semanticDriftPenalty -
      gapPenalty,
  );
}
