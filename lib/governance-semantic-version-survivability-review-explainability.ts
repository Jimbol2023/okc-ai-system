import type {
  GovernanceSemanticVersionSurvivabilityInput,
  GovernanceSemanticVersionSurvivabilityResult,
} from "./governance-semantic-version-survivability-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceSemanticVersionSurvivabilityExplainability(params: {
  input: GovernanceSemanticVersionSurvivabilityInput;
  result: Omit<GovernanceSemanticVersionSurvivabilityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance semantic-version survivability classification is ${params.result.semanticVersionSurvivabilityClassification}.`,
      `Semantic-version survivability score is ${params.result.semanticVersionSurvivabilityScore}/100, where higher indicates stronger backward-compatible survivability for governance terminology, classifications, audit categories, evidence categories, scoring drivers, doctrine principles, normalization mappings, traceability semantics, explainability semantics, recommendation semantics, limitation semantics, observability semantics, reviewability semantics, registry readiness semantics, and lifecycle continuity semantics.`,
      `Evaluated ${params.result.areaAssessments.length} semantic-version survivability areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} semantic-version survivability findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    semanticVersionSurvivabilityRulesApplied: [
      "Semantic-version survivability review is read-only and evaluates only supplied semantic stability, versioning readiness, registry, normalization, traceability, explainability, audit, doctrine, observability, reviewability, lifecycle, memory, and evidence outputs.",
      "Area scores are deterministic from version-stable signals, version-fragile signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify semantic-version fragility, backward compatibility risks, taxonomy version instability, classification version mismatch, normalization version drift, traceability semantic incompatibility, explainability semantic incompatibility, audit semantic incompatibility, doctrine semantic incompatibility, recommendation semantic drift, limitation semantic drift, scoring semantic drift, future registry version risks, semantic migration survivability risks, and long-horizon semantic reconstruction risks.",
      "This review does not mutate semantic structures, rewrite terminology, redesign governance architecture, centralize semantic control, introduce governance automation, add execution systems, implement persistence, create migration engines, rewrite governance outputs, enforce policy, or trigger orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.semanticStabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.versioningReadinessResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.traceabilitySurvivabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Semantic-version survivability review evaluates supplied governance outputs only and does not validate factual truth, certify compliance, or provide legal conclusions.",
      "It does not mutate inputs, rewrite terminology, write to databases, add routes, create persistence, automate lifecycle actions, create migration engines, enforce policies, block operations, send outreach, or trigger orchestration.",
      "Semantic-version survivability is a reconstruction and backward-compatibility indicator, not a semantic rewrite, registry, migration, or storage system.",
      "Long-horizon semantic survivability is evaluated from supplied semantic stability, registry, normalization, traceability, explainability, versioning, lifecycle, and audit context only.",
    ],
  };
}
