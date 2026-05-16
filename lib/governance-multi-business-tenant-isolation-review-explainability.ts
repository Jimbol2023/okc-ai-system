import type {
  GovernanceMultiBusinessTenantIsolationInput,
  GovernanceMultiBusinessTenantIsolationResult,
} from "./governance-multi-business-tenant-isolation-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceMultiBusinessTenantIsolationExplainability(params: {
  input: GovernanceMultiBusinessTenantIsolationInput;
  result: Omit<GovernanceMultiBusinessTenantIsolationResult, "explainability">;
}) {
  return {
    summary: [
      `Governance multi-business / multi-tenant isolation classification is ${params.result.isolationClassification}.`,
      `Isolation survivability score is ${params.result.isolationSurvivabilityScore}/100, where higher indicates stronger review-only boundary survivability across business, tenant, governance, audit, traceability, explainability, survivability, semantic, doctrine, observability, reviewability, orchestration-review, institutional-memory, and lifecycle-continuity structures.`,
      `Evaluated ${params.result.areaAssessments.length} isolation areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} isolation findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    isolationRulesApplied: [
      "Multi-business / multi-tenant isolation review is read-only and evaluates only supplied governance, audit, traceability, explainability, survivability, semantic, observability, reviewability, memory, lifecycle, and metadata context.",
      "Area scores are deterministic from isolation strength signals, isolation risk signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify tenant contamination risk, governance leakage risk, traceability crossover risk, explainability crossover risk, semantic contamination risk, audit contamination risk, survivability fragmentation risk, lineage crossover risk, observability leakage risk, reviewability contamination risk, orchestration boundary weakness, weak governance boundaries, cross-business reconstruction risk, and future tenant survivability risk.",
      "This review does not implement tenant persistence, create tenant routing, mutate governance boundaries, redesign governance architecture, centralize governance control, introduce tenant-aware orchestration, automate governance, write data, enforce policy, or trigger execution.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.survivabilityExpansionResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.observabilityDurabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.traceabilitySurvivabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.semanticVersionSurvivabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Isolation review evaluates supplied governance outputs and optional boundary metadata only; it does not verify tenant infrastructure, certify isolation, or provide legal/compliance conclusions.",
      "It does not mutate inputs, write to databases, add routes, create tenant storage, create tenant routing, perform orchestration, enforce policies, block operations, send outreach, or trigger automation.",
      "Isolation survivability is a reviewability and boundary-durability indicator, not a tenant management system, access-control system, or runtime isolation guarantee.",
      "Long-horizon tenant and business isolation confidence depends on future approved boundary contracts, traceability contracts, observability contracts, and human-reviewed architecture evidence.",
    ],
  };
}
