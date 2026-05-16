import type {
  GovernanceSurvivabilityExpansionInput,
  GovernanceSurvivabilityExpansionResult,
} from "./governance-survivability-expansion-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceSurvivabilityExpansionExplainability(params: {
  input: GovernanceSurvivabilityExpansionInput;
  result: Omit<GovernanceSurvivabilityExpansionResult, "explainability">;
}) {
  return {
    summary: [
      `Governance survivability classification is ${params.result.survivabilityClassification}.`,
      `Expansion classification is ${params.result.expansionClassification}.`,
      `Survivability score is ${params.result.survivabilityScore}/100 and expansion durability score is ${params.result.expansionDurabilityScore}/100.`,
      `Evaluated ${params.result.areaAssessments.length} survivability and expansion areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} survivability review findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    survivabilityRulesApplied: [
      "Survivability and expansion review is read-only and evaluates only supplied governance, doctrine durability, semantic stability, registry, normalization, traceability, audit, readiness, assurance, continuity, resilience, lineage, memory, and evidence-quality outputs.",
      "Survivability scoring emphasizes governance principles, doctrine structures, evidence, traceability, observability, orchestration boundaries, continuity, and resilience.",
      "Expansion durability scoring emphasizes audit growth, normalization, registry readiness, future AI agents, future verticals, future governance layers, enterprise scaling, multi-tenant growth, and multi-business reuse.",
      "Findings identify survivability bottlenecks, governance fragmentation, orchestration survivability risk, semantic scaling risk, doctrine scaling risk, audit scaling risk, traceability scaling risk, explainability scaling risk, taxonomy survivability risk, registry incompatibility, observability survivability risk, reviewability degradation, institutional continuity risk, and cross-industry survivability risk.",
      "This review does not mutate governance semantics, redesign architecture, centralize enforcement, persist registries, execute orchestration, automate governance, or rewrite governance doctrine.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.doctrineDurabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.semanticStabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Survivability and expansion review evaluates supplied governance outputs only and does not validate factual truth or certify compliance.",
      "It does not provide legal, tax, lending, investment, protected-class, demographic, or policy-enforcement conclusions.",
      "It does not mutate inputs, write to databases, add routes, send outreach, automate workflows, block operations, or trigger orchestration.",
      "Survivability and expansion classifications are neutral operational indicators for human review.",
    ],
  };
}
