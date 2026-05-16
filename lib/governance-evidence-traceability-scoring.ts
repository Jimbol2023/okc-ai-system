import type {
  GovernanceEvidenceTraceGap,
  GovernanceEvidenceTraceLink,
  GovernanceEvidenceTraceStrength,
  GovernanceEvidenceTraceabilityInput,
} from "./governance-evidence-traceability-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function traceStrengthFromScore(score: number): GovernanceEvidenceTraceStrength {
  if (score >= 85) return "institutionally_traceable";
  if (score >= 70) return "strong";
  if (score >= 45) return "moderate";
  return "weak";
}

export function calculateTraceLinkScore(trace: Omit<GovernanceEvidenceTraceLink, "traceStrength">): number {
  const completeness =
    (trace.traceId ? 5 : 0) +
    (trace.evidenceId ? 5 : 0) +
    (trace.evidenceType ? 5 : 0) +
    (trace.evidenceSource ? 7 : 0) +
    (trace.sourceModule ? 7 : 0) +
    (trace.auditCategory ? 7 : 0) +
    (trace.governancePrinciple !== "not_supplied" ? 8 : 0) +
    (trace.scoringDriver ? 9 : 0) +
    (trace.evidenceSummary ? 10 : 0) +
    (trace.reasoningLink ? 10 : 0) +
    (trace.limitation ? 7 : 0) +
    (trace.recommendationId ? 8 : 0) +
    (trace.humanReviewRequired ? 5 : 0);
  const confidenceAdjustment = Math.max(-12, Math.min(12, trace.confidenceImpact * 0.12));
  const riskAdjustment = Math.max(-14, Math.min(8, -trace.riskImpact * 0.12));

  return clampScore(completeness + confidenceAdjustment + riskAdjustment);
}

export function calculateTraceGapConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(22, params.evidenceCount * 5) + Math.min(14, params.factorCount * 3));
}

export function calculateGovernanceEvidenceTraceabilityScore(params: {
  input: GovernanceEvidenceTraceabilityInput;
  traces: GovernanceEvidenceTraceLink[];
  gaps: GovernanceEvidenceTraceGap[];
}): number {
  const averageTraceStrength =
    params.traces.length === 0
      ? 0
      : params.traces.reduce((total, trace) => total + calculateTraceLinkScore(trace), 0) / params.traces.length;
  const auditContextBonus =
    (params.input.auditResult ? 10 : 0) +
    ((params.input.auditFindings?.length ?? 0) > 0 ? 5 : 0) +
    ((params.input.recommendations?.length ?? 0) > 0 ? 5 : 0);
  const traceDepthBonus = Math.min(18, params.traces.length * 2);
  const institutionallyTraceableBonus =
    params.traces.filter((trace) => trace.traceStrength === "institutionally_traceable").length * 3;
  const weakTracePenalty = params.traces.filter((trace) => trace.traceStrength === "weak").length * 5;
  const gapPenalty = Math.min(36, params.gaps.length * 5);

  return clampScore(
    averageTraceStrength * 0.68 +
      auditContextBonus +
      traceDepthBonus +
      institutionallyTraceableBonus -
      weakTracePenalty -
      gapPenalty,
  );
}
