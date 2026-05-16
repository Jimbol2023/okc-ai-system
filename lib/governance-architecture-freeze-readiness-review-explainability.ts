import type {
  GovernanceArchitectureFreezeReadinessInput,
  GovernanceArchitectureFreezeReadinessResult,
} from "./governance-architecture-freeze-readiness-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceArchitectureFreezeReadinessExplainability(params: {
  input: GovernanceArchitectureFreezeReadinessInput;
  result: Omit<GovernanceArchitectureFreezeReadinessResult, "explainability">;
}) {
  return {
    summary: [
      `Governance architecture freeze readiness classification is ${params.result.freezeReadinessClassification}.`,
      `Architecture freeze readiness score is ${params.result.architectureFreezeReadinessScore}/100, where higher indicates stronger maturity for architecture freeze readiness, reusable contracts, shared utility extraction planning, governance scaling, operational deployment readiness, enterprise integration, multi-business reuse, and future AI-agent expansion.`,
      `Evaluated ${params.result.areaAssessments.length} freeze-readiness areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} freeze-readiness findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    freezeReadinessRulesApplied: [
      "Architecture freeze readiness review is read-only and evaluates supplied governance subsystem outputs and optional freeze context only.",
      "Area scores are deterministic from freeze-ready signals, freeze-risk signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify unresolved architecture fragility, unstable contracts, premature freeze risk, hidden orchestration contamination, hidden execution pathway risk, subsystem inconsistency, reusable utility instability, semantic instability, traceability weakness, explainability weakness, auditability weakness, survivability weakness, future scaling risk, and institutional durability gaps.",
      "This review does not freeze architecture, extract utilities, redesign governance architecture, centralize governance control, implement persistence, add execution systems, mutate semantics, rewrite findings, automate governance, enforce policy, or trigger orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.finalStabilityConsolidationResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.longHorizonInstitutionalResilienceResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.multiBusinessTenantIsolationResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.auditResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Architecture freeze readiness is a review indicator, not an architecture freeze, deployment approval, utility extraction approval, or compliance conclusion.",
      "It does not mutate inputs, write to databases, add routes, create persistence, perform orchestration, enforce policies, block operations, send outreach, trigger automation, or rewrite governance findings.",
      "Freeze readiness depends on upstream subsystem completeness, explicit contract candidates, stable semantics, traceability durability, explainability continuity, and human-reviewed operational assumptions.",
      "Shared utility extraction remains recommendation-only until explicitly approved.",
    ],
  };
}
