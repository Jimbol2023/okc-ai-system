import type {
  GovernancePrincipleRegistryReviewInput,
  GovernancePrincipleRegistryReviewResult,
} from "./governance-principle-registry-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernancePrincipleRegistryReviewExplainability(params: {
  input: GovernancePrincipleRegistryReviewInput;
  result: Omit<GovernancePrincipleRegistryReviewResult, "explainability">;
}) {
  return {
    summary: [
      `Governance principle registry readiness classification is ${params.result.registryReadinessClassification}.`,
      `Registry readiness score is ${params.result.registryReadinessScore}/100, where higher indicates stronger maturity for a future human-reviewed governance principle registry.`,
      `Evaluated ${params.result.readinessAreas.length} registry readiness areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} registry review findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    registryReviewRulesApplied: [
      "Registry readiness is reviewed only from supplied read-only doctrine, normalization, traceability, audit, and recommendation inputs.",
      "Readiness areas evaluate principle IDs, doctrine categories, governance metadata, normalization compatibility, taxonomy stability, semantic versioning readiness, vocabulary consistency, and deterministic reasoning.",
      "Findings identify naming inconsistency, duplicated semantics, weak doctrine consistency, semantic overlap, conflicting meanings, fragmented terminology, taxonomy instability, evidence inconsistency, score inconsistency, drift risk, and doctrine fragmentation risk.",
      "This review does not create a production registry, centralize governance logic, mutate semantics, enforce policy, write storage, trigger workflows, or connect to orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.readinessAreas
        .slice(0, 8)
        .map((area) => `${area.areaType}: ${area.status} at ${area.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.normalizationResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.doctrineResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Governance principle registry review evaluates maturity only; it does not implement, persist, or enforce a registry.",
      "It does not validate factual truth, certify compliance, provide legal conclusions, profile demographics, infer protected characteristics, or enforce policy.",
      "It does not mutate inputs, write to databases, call routes, send outreach, automate workflows, block operations, or trigger orchestration.",
      "Registry readiness classification is a neutral operational indicator for human review.",
    ],
  };
}
