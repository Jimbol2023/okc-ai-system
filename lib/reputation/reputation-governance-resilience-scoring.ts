import type {
  ReputationGovernanceResilienceFinding,
  ReputationGovernanceResilienceInput,
  ReputationGovernanceResilienceStatus,
} from "./reputation-governance-resilience-types";
import type { ReputationSeverity } from "./reputation-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

const SEVERITY_WEIGHT: Record<ReputationSeverity, number> = {
  low: 4,
  moderate: 9,
  elevated: 16,
  critical: 24,
};

export function resilienceStatusFromScore(score: number): ReputationGovernanceResilienceStatus {
  if (score >= 88) return "anti_fragile";
  if (score >= 72) return "resilient";
  if (score >= 48) return "pressured";
  return "fragile";
}

export function calculateResilienceFindingConfidence(params: {
  evidenceCount: number;
  affectedGovernanceDomainCount: number;
  affectedBusinessUnitCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore(
    (params.baseConfidence ?? 58) +
      Math.min(18, params.evidenceCount * 4) +
      Math.min(10, params.affectedGovernanceDomainCount * 3) +
      Math.min(8, params.affectedBusinessUnitCount * 2) +
      Math.min(10, params.factorCount * 2),
  );
}

export function calculateGovernanceResilienceScore(params: {
  input: ReputationGovernanceResilienceInput;
  findings: ReputationGovernanceResilienceFinding[];
  resilienceStrengths: string[];
  recoveryIndicators: string[];
  antiFragilityIndicators: string[];
}): number {
  const continuityScore = params.input.continuityResult?.governanceContinuityScore ?? 48;
  const lineageScore = params.input.lineageResult?.lineageIntegrityScore ?? 48;
  const evidenceQualityScore = params.input.evidenceQualityResult?.evidenceQualityScore ?? 50;
  const resolutionProgressScore = params.input.resolutionResult?.resolutionProgressScore ?? 50;
  const remediationReadinessScore = params.input.remediationResult?.remediationReadinessScore ?? 50;
  const driftPenalty = (params.input.continuityResult?.driftFindings.length ?? 0) * 4;
  const contradictionPenalty = (params.input.lineageResult?.contradictionChains.length ?? 0) * 7;
  const weakLineagePenalty = (params.input.lineageResult?.weakLineageAreas.length ?? 0) * 4;
  const findingPenalty = params.findings
    .filter((finding) => finding.findingType !== "anti_fragility_indicator")
    .reduce((total, finding) => total + SEVERITY_WEIGHT[finding.severity], 0);
  const antiFragilityFindingBonus =
    params.findings.filter((finding) => finding.findingType === "anti_fragility_indicator").length * 6;
  const contextCompleteness =
    (params.input.continuityResult ? 7 : 0) +
    (params.input.lineageResult ? 6 : 0) +
    (params.input.resolutionResult ? 4 : 0) +
    (params.input.remediationResult ? 4 : 0) +
    (params.input.governanceResult ? 4 : 0) +
    (params.input.evidenceQualityResult ? 4 : 0) +
    (params.input.trendResult ? 3 : 0) +
    (params.input.aggregationResult ? 3 : 0);
  const strengthBonus = Math.min(14, params.resilienceStrengths.length * 3);
  const recoveryBonus = Math.min(14, params.recoveryIndicators.length * 4);
  const antiFragilityBonus = Math.min(18, params.antiFragilityIndicators.length * 5);

  return clampScore(
    continuityScore * 0.25 +
      lineageScore * 0.2 +
      evidenceQualityScore * 0.16 +
      resolutionProgressScore * 0.13 +
      remediationReadinessScore * 0.1 +
      contextCompleteness +
      strengthBonus +
      recoveryBonus +
      antiFragilityBonus +
      antiFragilityFindingBonus -
      driftPenalty -
      contradictionPenalty -
      weakLineagePenalty -
      findingPenalty,
  );
}
