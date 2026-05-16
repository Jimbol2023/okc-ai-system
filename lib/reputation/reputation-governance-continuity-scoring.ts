import type {
  ReputationGovernanceContinuityInput,
  ReputationGovernanceContinuityStatus,
  ReputationGovernanceDriftFinding,
} from "./reputation-governance-continuity-types";
import type { ReputationSeverity } from "./reputation-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

const SEVERITY_WEIGHT: Record<ReputationSeverity, number> = {
  low: 5,
  moderate: 10,
  elevated: 17,
  critical: 25,
};

export function continuityStatusFromScore(score: number): ReputationGovernanceContinuityStatus {
  if (score >= 88) return "anti_fragile";
  if (score >= 72) return "resilient";
  if (score >= 50) return "stable";
  return "fragile";
}

export function severityFromContinuityDelta(delta: number): ReputationSeverity {
  if (delta <= -25) return "critical";
  if (delta <= -15) return "elevated";
  if (delta <= -8) return "moderate";
  return "low";
}

export function calculateContinuityFindingConfidence(params: {
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

export function calculateGovernanceContinuityScore(params: {
  input: ReputationGovernanceContinuityInput;
  driftFindings: ReputationGovernanceDriftFinding[];
  continuityStrengths: string[];
  resilienceIndicators: string[];
}): number {
  const currentLineageScore = params.input.currentLineageResult?.lineageIntegrityScore ?? 46;
  const previousLineageScore = params.input.previousLineageResult?.lineageIntegrityScore;
  const lineageDelta = previousLineageScore === undefined ? 0 : currentLineageScore - previousLineageScore;
  const contradictionDelta =
    previousLineageScore === undefined
      ? 0
      : (params.input.currentLineageResult?.contradictionChains.length ?? 0) -
        (params.input.previousLineageResult?.contradictionChains.length ?? 0);
  const stabilizationDelta =
    previousLineageScore === undefined
      ? 0
      : (params.input.currentLineageResult?.stabilizationChains.length ?? 0) -
        (params.input.previousLineageResult?.stabilizationChains.length ?? 0);
  const evidenceQualityScore = params.input.evidenceQualityResult?.evidenceQualityScore ?? 50;
  const resolutionProgressScore = params.input.resolutionResult?.resolutionProgressScore ?? 50;
  const driftPenalty = params.driftFindings.reduce(
    (total, finding) => total + SEVERITY_WEIGHT[finding.severity],
    0,
  );
  const contextCompleteness =
    (params.input.currentLineageResult ? 9 : 0) +
    (params.input.previousLineageResult ? 6 : 0) +
    (params.input.governanceResult ? 4 : 0) +
    (params.input.remediationResult ? 4 : 0) +
    (params.input.resolutionResult ? 4 : 0) +
    (params.input.evidenceQualityResult ? 4 : 0) +
    (params.input.trendResult ? 3 : 0) +
    (params.input.aggregationResult ? 3 : 0);
  const resilienceBonus = Math.min(16, params.resilienceIndicators.length * 4);
  const strengthBonus = Math.min(12, params.continuityStrengths.length * 3);
  const lineageImprovementBonus = Math.max(0, Math.min(12, lineageDelta * 0.8));
  const stabilizationBonus = Math.max(0, Math.min(8, stabilizationDelta * 4));
  const contradictionPenalty = Math.max(0, contradictionDelta * 8);

  return clampScore(
    currentLineageScore * 0.38 +
      evidenceQualityScore * 0.16 +
      resolutionProgressScore * 0.12 +
      contextCompleteness +
      resilienceBonus +
      strengthBonus +
      lineageImprovementBonus +
      stabilizationBonus -
      contradictionPenalty -
      driftPenalty,
  );
}
