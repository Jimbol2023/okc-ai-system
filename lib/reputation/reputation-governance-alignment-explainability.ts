import type {
  ReputationGovernanceAlignmentInput,
  ReputationGovernanceAlignmentResult,
} from "./reputation-governance-alignment-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceAlignmentRecommendations(
  result: Omit<ReputationGovernanceAlignmentResult, "recommendations" | "explainability">,
): string[] {
  const misalignedTypes = new Set(
    result.findings
      .filter((finding) => ["misaligned", "partially_aligned"].includes(finding.status))
      .map((finding) => finding.alignmentType),
  );

  return unique([
    ...(result.overallAlignmentStatus === "misaligned"
      ? ["Prioritize human review of governance alignment before relying on doctrine-practice consistency indicators."]
      : []),
    ...(misalignedTypes.has("doctrine_alignment")
      ? ["Review doctrine principles and drift findings before treating doctrine as aligned with institutional practice."]
      : []),
    ...(misalignedTypes.has("evidence_alignment")
      ? ["Review evidence quality, missing evidence, and contradiction context before interpreting alignment as durable."]
      : []),
    ...(misalignedTypes.has("remediation_alignment") || misalignedTypes.has("resolution_alignment")
      ? ["Compare remediation and resolution patterns against doctrine principles before operational interpretation."]
      : []),
    ...(misalignedTypes.has("continuity_alignment") || misalignedTypes.has("resilience_alignment")
      ? ["Review continuity and resilience alignment before treating governance behavior as stable across periods."]
      : []),
    ...(misalignedTypes.has("reviewability_alignment")
      ? ["Review lineage, dependency chains, and explainability context before relying on alignment status."]
      : []),
    "Use governance alignment intelligence as read-only decision support; it does not enforce policy, execute actions, mutate data, send outreach, or trigger autonomous governance.",
  ]);
}

export function buildGovernanceAlignmentExplainability(params: {
  input: ReputationGovernanceAlignmentInput;
  result: Omit<ReputationGovernanceAlignmentResult, "recommendations" | "explainability">;
}) {
  return {
    summary: [
      `Overall governance alignment status is ${params.result.overallAlignmentStatus}.`,
      `Governance alignment score is ${params.result.governanceAlignmentScore}/100, where higher indicates stronger doctrine-practice alignment.`,
      `Evaluated ${params.result.findings.length} alignment findings at ${params.input.evaluatedAt}.`,
      `Alignment gaps: ${params.result.alignmentGaps.length}. Doctrine-practice gaps: ${params.result.doctrinePracticeGaps.length}.`,
      `Architecture improvement review items: ${params.result.architectureImprovementReview.length}.`,
    ],
    alignmentRulesApplied: [
      "Alignment findings are built only from supplied read-only doctrine, memory, resilience, continuity, lineage, evidence quality, resolution, remediation, governance, trend, and aggregation outputs.",
      "Doctrine alignment compares doctrine status, principle support, doctrine drift, and recurring memory patterns.",
      "Evidence alignment compares doctrine evidence expectations against evidence quality, missing evidence, contradiction areas, and lineage support.",
      "Remediation and resolution alignment compare practice signals against doctrine principles and supporting evidence.",
      "Continuity, resilience, and reviewability alignment compare upstream context against doctrine principles, lineage integrity, and explainability indicators.",
      "Governance alignment score is deterministic from finding status, finding confidence, upstream scores, context completeness, strengths, gaps, and drift penalties.",
      "Alignment intelligence is read-only and does not enforce policy, automate governance, persist data, or execute actions.",
    ],
    majorDrivers: unique([
      ...params.result.findings
        .slice(0, 8)
        .map((finding) => `${finding.alignmentType}: ${finding.status} (${finding.confidenceScore}/100).`),
      ...params.result.alignmentStrengths.slice(0, 6),
      ...params.result.alignmentGaps.slice(0, 6),
      ...(params.input.doctrineResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.memoryResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.resilienceResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Governance alignment intelligence evaluates only supplied read-only governance intelligence outputs.",
      "It does not enforce policy, certify compliance, determine fault, profile demographics, infer protected characteristics, or make legal, tax, lending, or investment conclusions.",
      "It does not mutate inputs, write to databases, persist alignment, send messages, automate outreach, block operations, auto-remediate, or trigger autonomous governance actions.",
      "Alignment status is a neutral operational indicator for human review and requires human judgment before any operational decision.",
    ],
  };
}
