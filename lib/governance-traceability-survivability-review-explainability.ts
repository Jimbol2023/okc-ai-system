import type {
  GovernanceTraceabilitySurvivabilityInput,
  GovernanceTraceabilitySurvivabilityResult,
} from "./governance-traceability-survivability-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceTraceabilitySurvivabilityExplainability(params: {
  input: GovernanceTraceabilitySurvivabilityInput;
  result: Omit<GovernanceTraceabilitySurvivabilityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance traceability survivability classification is ${params.result.traceabilitySurvivabilityClassification}.`,
      `Traceability survivability score is ${params.result.traceabilitySurvivabilityScore}/100, where higher indicates stronger survivability for evidence linkage, recommendation linkage, principle linkage, reasoning linkage, lineage linkage, audit linkage, explainability linkage, survivability linkage, semantic linkage, doctrine linkage, observability linkage, reviewability linkage, institutional memory linkage, and lifecycle continuity linkage.`,
      `Evaluated ${params.result.areaAssessments.length} traceability survivability areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} traceability survivability findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    traceabilitySurvivabilityRulesApplied: [
      "Traceability survivability review is read-only and evaluates only supplied traceability, normalization, explainability, audit, evidence, lineage, survivability, semantic, doctrine, observability, reviewability, memory, and lifecycle outputs.",
      "Area scores are deterministic from traceable signals, fragile signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify traceability collapse risk, weak evidence chains, weak recommendation linkage, weak principle linkage, weak reasoning linkage, weak lineage linkage, audit linkage fragmentation, explainability linkage gaps, semantic linkage instability, doctrine linkage weakness, observability linkage gaps, reviewability linkage degradation, future traceability survivability risks, and long-horizon reconstruction risks.",
      "This review does not mutate traceability structures, rewrite evidence links, redesign governance architecture, centralize traceability control, introduce governance automation, add execution systems, implement persistence, rewrite governance outputs, enforce policy, or trigger orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.traceabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.explainabilityContinuityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.lineageResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Traceability survivability review evaluates supplied governance outputs only and does not validate factual truth, certify compliance, or provide legal conclusions.",
      "It does not mutate inputs, rewrite evidence links, write to databases, add routes, create persistence, automate lifecycle actions, enforce policies, block operations, send outreach, or trigger orchestration.",
      "Traceability survivability is a reconstruction and durability indicator, not a traceability rewrite, storage, or autonomous governance system.",
      "Long-horizon traceability is evaluated from supplied trace links, normalization mappings, explainability outputs, lineage, memory, lifecycle, and audit context only.",
    ],
  };
}
