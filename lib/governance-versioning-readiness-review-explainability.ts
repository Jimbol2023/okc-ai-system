import type {
  GovernanceVersioningReadinessInput,
  GovernanceVersioningReadinessResult,
} from "./governance-versioning-readiness-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceVersioningReadinessExplainability(params: {
  input: GovernanceVersioningReadinessInput;
  result: Omit<GovernanceVersioningReadinessResult, "explainability">;
}) {
  return {
    summary: [
      `Governance versioning readiness classification is ${params.result.versioningReadinessClassification}.`,
      `Versioning readiness score is ${params.result.versioningReadinessScore}/100, where higher indicates stronger readiness for future semantic, contract, taxonomy, lifecycle, compatibility, and migration versioning infrastructure.`,
      `Evaluated ${params.result.areaAssessments.length} versioning readiness areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} versioning readiness findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    versioningReadinessRulesApplied: [
      "Versioning readiness review is read-only and evaluates only supplied governance, reviewability, observability, survivability, doctrine durability, semantic stability, registry, normalization, traceability, audit, readiness, assurance, continuity, resilience, lineage, memory, and evidence-quality outputs.",
      "Area scores are deterministic from version-ready signals, version-fragile signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify unstable semantics, unstable classifications, incompatible structures, taxonomy instability, version-fragile semantics, traceability contract instability, audit contract instability, normalization instability, observability instability, doctrine evolution risk, backward compatibility risk, migration risk, semantic version drift, and future registry incompatibility.",
      "This review does not implement persistence, add registry storage, rewrite semantics, redesign architecture, create migration engines, enforce governance, centralize control, mutate contracts, or execute orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.reviewabilityIntegrityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.semanticStabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Versioning readiness review evaluates supplied governance outputs only and does not validate factual truth or certify compliance.",
      "It does not provide legal, tax, lending, investment, protected-class, demographic, or policy-enforcement conclusions.",
      "It does not mutate inputs, write to databases, add routes, create migrations, persist versions, automate workflows, block operations, or trigger orchestration.",
      "Versioning readiness classification is a neutral operational indicator for human review.",
    ],
  };
}
