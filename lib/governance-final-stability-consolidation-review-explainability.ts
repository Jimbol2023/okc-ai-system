import type {
  GovernanceFinalStabilityConsolidationInput,
  GovernanceFinalStabilityConsolidationResult,
} from "./governance-final-stability-consolidation-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceFinalStabilityConsolidationExplainability(params: {
  input: GovernanceFinalStabilityConsolidationInput;
  result: Omit<GovernanceFinalStabilityConsolidationResult, "explainability">;
}) {
  return {
    summary: [
      `Final governance stability classification is ${params.result.governanceStabilityClassification}.`,
      `Final governance stability score is ${params.result.finalGovernanceStabilityScore}/100, where higher indicates stronger consolidated stability across readiness, auditability, traceability, explainability, survivability, continuity, semantic stability, doctrine durability, observability, reviewability, semantic-version survivability, isolation, long-horizon resilience, institutional memory, and audit-history survivability.`,
      `Evaluated ${params.result.areaAssessments.length} final stability areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} final stability consolidation findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    finalStabilityRulesApplied: [
      "Final stability consolidation is read-only and evaluates only supplied governance subsystem outputs and optional metadata.",
      "Area scores are deterministic from stability signals, fragility signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify hidden governance fragility, subsystem inconsistency, reconstruction instability, governance-stack fragmentation, semantic survivability weakness, orchestration contamination risk, explainability continuity weakness, traceability continuity weakness, auditability degradation risk, institutional durability weakness, long-horizon survivability gaps, reviewability inconsistency, isolation instability, and resilience weakness.",
      "This review does not redesign governance architecture, centralize governance control, introduce automation, add execution systems, implement persistence, mutate semantics, rewrite findings, enforce policy, or trigger orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.longHorizonInstitutionalResilienceResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.multiBusinessTenantIsolationResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.semanticVersionSurvivabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.auditResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Final stability consolidation evaluates supplied subsystem outputs only; it does not certify governance, verify runtime infrastructure, or provide legal/compliance conclusions.",
      "It does not mutate inputs, write to databases, add routes, create persistence, perform orchestration, enforce policies, block operations, send outreach, trigger automation, or rewrite governance findings.",
      "Final governance stability is a human-review consolidation indicator, not a governance freeze, enforcement engine, or architecture approval.",
      "Consolidated stability confidence depends on upstream review completeness, explicit evidence contracts, traceability contracts, isolation context, and long-horizon resilience context.",
    ],
  };
}
