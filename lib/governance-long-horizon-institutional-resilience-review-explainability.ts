import type {
  GovernanceLongHorizonInstitutionalResilienceInput,
  GovernanceLongHorizonInstitutionalResilienceResult,
} from "./governance-long-horizon-institutional-resilience-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceLongHorizonInstitutionalResilienceExplainability(params: {
  input: GovernanceLongHorizonInstitutionalResilienceInput;
  result: Omit<GovernanceLongHorizonInstitutionalResilienceResult, "explainability">;
}) {
  return {
    summary: [
      `Governance long-horizon institutional resilience classification is ${params.result.resilienceClassification}.`,
      `Institutional resilience score is ${params.result.institutionalResilienceScore}/100, where higher indicates stronger long-horizon resilience across governance, audit, traceability, explainability, survivability, semantic, doctrine, observability, reviewability, memory, lifecycle, reconstruction, compatibility, and migration structures.`,
      `Evaluated ${params.result.areaAssessments.length} long-horizon resilience areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} long-horizon resilience findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    institutionalResilienceRulesApplied: [
      "Long-horizon institutional resilience review is read-only and evaluates supplied governance, audit, traceability, explainability, survivability, semantic, observability, reviewability, memory, lifecycle, compatibility, migration, isolation, and metadata context.",
      "Area scores are deterministic from resilience signals, fragility signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify governance brittleness, survivability collapse risks, resilience degradation risks, audit resilience weakness, explainability resilience weakness, traceability resilience weakness, semantic resilience instability, doctrine resilience weakness, institutional continuity risks, reconstruction survivability weakness, long-horizon resilience fragility, orchestration resilience risks, and institutional survivability degradation.",
      "This review does not mutate governance structures, redesign governance architecture, centralize resilience control, introduce governance automation, add execution systems, implement persistence, enforce policy, or trigger orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.multiBusinessTenantIsolationResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.survivabilityExpansionResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.traceabilitySurvivabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.explainabilityContinuityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Long-horizon resilience review evaluates supplied governance outputs and optional resilience context only; it does not certify future resilience, verify operational infrastructure, or provide legal/compliance conclusions.",
      "It does not mutate inputs, write to databases, add routes, create persistence, perform orchestration, enforce policies, block operations, send outreach, trigger automation, or create resilience enforcement systems.",
      "Institutional resilience is a reviewability and durability indicator, not an autonomous resilience controller or runtime recovery system.",
      "Long-horizon confidence depends on future approved evidence contracts, isolation contracts, continuity contracts, observability contracts, and human-reviewed architecture evidence.",
    ],
  };
}
