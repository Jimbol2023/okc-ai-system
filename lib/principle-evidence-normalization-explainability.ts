import type {
  PrincipleEvidenceNormalizationInput,
  PrincipleEvidenceNormalizationResult,
} from "./principle-evidence-normalization-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildPrincipleEvidenceNormalizationExplainability(params: {
  input: PrincipleEvidenceNormalizationInput;
  result: Omit<PrincipleEvidenceNormalizationResult, "explainability">;
}) {
  return {
    summary: [
      `Principle-to-evidence normalization classification is ${params.result.normalizationClassification}.`,
      `Normalization score is ${params.result.normalizationScore}/100, where higher indicates stronger consistency between governance principles, evidence, scoring drivers, audit categories, limitations, recommendations, and reasoning chains.`,
      `Evaluated ${params.result.mappings.length} normalized principle-evidence mappings at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.gaps.length} normalization gaps.`,
      `Human review notes: ${params.result.humanReviewNotes.length}.`,
    ],
    normalizationRulesApplied: [
      "Normalization uses only supplied read-only doctrine, audit, recommendation, and evidence traceability inputs.",
      "Mapping strength is deterministic from principle labels, audit categories, evidence links, scoring drivers, reasoning chains, limitations, recommendations, trace references, confidence impact, and risk impact.",
      "Weak mappings, missing links, inconsistent semantics, audit category drift, weak limitation linkage, unclear recommendations, and traceability inconsistencies are surfaced as human-review findings.",
      "This layer standardizes relationships only; it does not mutate evidence, rewrite recommendations, enforce policy, trigger workflows, or connect to orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.mappings
        .slice(0, 8)
        .map((mapping) => `${mapping.principleLabel}: ${mapping.mappingStrength} mapping with ${mapping.traceIds.length} trace links.`),
      ...params.result.gaps.slice(0, 8).map((gap) => `${gap.gapType}: ${gap.description}`),
      ...(params.input.traceabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.doctrineResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Principle-to-evidence normalization evaluates only supplied read-only governance context and optional trace records.",
      "It does not validate factual truth, certify compliance, provide legal conclusions, profile demographics, infer protected characteristics, or enforce policy.",
      "It does not mutate inputs, write to databases, call routes, send outreach, automate workflows, block operations, or trigger orchestration.",
      "Normalization classification is a neutral operational indicator for human review.",
    ],
  };
}
