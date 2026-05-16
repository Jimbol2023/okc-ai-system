import type {
  GovernanceExplainabilityContinuityInput,
  GovernanceExplainabilityContinuityResult,
} from "./governance-explainability-continuity-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceExplainabilityContinuityExplainability(params: {
  input: GovernanceExplainabilityContinuityInput;
  result: Omit<GovernanceExplainabilityContinuityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance explainability continuity classification is ${params.result.explainabilityContinuityClassification}.`,
      `Explainability continuity score is ${params.result.explainabilityContinuityScore}/100, where higher indicates stronger long-horizon continuity for reasoning visibility, evidence visibility, scoring explainability, limitation visibility, traceability explainability, audit explainability, survivability explainability, semantic explainability, doctrine explainability, observability explainability, reviewability explainability, institutional memory continuity, and lineage continuity.`,
      `Evaluated ${params.result.areaAssessments.length} explainability continuity areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} explainability continuity findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    explainabilityContinuityRulesApplied: [
      "Explainability continuity review is read-only and evaluates only supplied governance explainability, audit, evidence, traceability, semantic, observability, lineage, reviewability, survivability, doctrine, lifecycle, memory, and audit-history outputs.",
      "Area scores are deterministic from explainability signals, opacity signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify explainability drift, reasoning fragmentation, evidence visibility gaps, scoring explainability degradation, limitation visibility degradation, traceability explainability gaps, semantic explainability instability, audit explainability fragmentation, observability explainability gaps, institutional explainability survivability risks, governance opacity risks, reviewability degradation risks, and long-horizon explainability continuity risks.",
      "This review does not mutate explainability structures, rewrite reasoning, redesign governance architecture, centralize explainability control, introduce governance automation, add execution systems, implement persistence, rewrite governance outputs, enforce policy, or trigger orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.auditHistorySurvivabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.reviewabilityIntegrityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.traceabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Explainability continuity review evaluates supplied governance outputs only and does not validate factual truth, certify compliance, or provide legal conclusions.",
      "It does not mutate inputs, rewrite reasoning, write to databases, add routes, create persistence, automate lifecycle actions, enforce policies, block operations, send outreach, or trigger orchestration.",
      "Explainability continuity is a reconstruction and durability indicator, not an autonomous reasoning rewrite system.",
      "Long-horizon explainability is evaluated from supplied explainability summaries, rules, drivers, limitations, evidence links, and reviewability context only.",
    ],
  };
}
