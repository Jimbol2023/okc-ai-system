import type {
  ReputationGovernanceAssuranceInput,
  ReputationGovernanceAssuranceResult,
} from "./reputation-governance-assurance-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceAssuranceRecommendations(
  result: Omit<ReputationGovernanceAssuranceResult, "recommendations" | "explainability">,
): string[] {
  const weakTypes = new Set(
    result.findings
      .filter((finding) => ["weak", "developing"].includes(finding.status))
      .map((finding) => finding.assuranceType),
  );

  return unique([
    ...(result.overallAssuranceStatus === "weak"
      ? ["Prioritize human review of governance assurance before relying on governance reliability indicators."]
      : []),
    ...(weakTypes.has("doctrine_assurance")
      ? ["Review doctrine confidence, doctrine drift, and principle support before treating governance assurance as reliable."]
      : []),
    ...(weakTypes.has("evidence_assurance")
      ? ["Review evidence quality, missing evidence, contradiction areas, and traceability before relying on assurance."]
      : []),
    ...(weakTypes.has("continuity_assurance") || weakTypes.has("resilience_assurance")
      ? ["Review continuity and resilience gaps before treating governance reliability as durable."]
      : []),
    ...(weakTypes.has("lineage_assurance") || weakTypes.has("reviewability_assurance")
      ? ["Review lineage integrity, dependency chains, and reviewability context before relying on assurance status."]
      : []),
    "Use governance assurance intelligence as read-only decision support; it does not enforce policy, execute actions, mutate data, send outreach, or trigger autonomous governance.",
  ]);
}

export function buildGovernanceAssuranceExplainability(params: {
  input: ReputationGovernanceAssuranceInput;
  result: Omit<ReputationGovernanceAssuranceResult, "recommendations" | "explainability">;
}) {
  return {
    summary: [
      `Overall governance assurance status is ${params.result.overallAssuranceStatus}.`,
      `Governance assurance score is ${params.result.governanceAssuranceScore}/100, where higher indicates stronger human-review confidence for governance reliability.`,
      `Evaluated ${params.result.findings.length} assurance findings at ${params.input.evaluatedAt}.`,
      `Assurance weaknesses: ${params.result.assuranceWeaknesses.length}. Assurance drift findings: ${params.result.assuranceDriftFindings.length}.`,
      `Architecture improvement review items: ${params.result.architectureImprovementReview.length}.`,
    ],
    assuranceRulesApplied: [
      "Assurance findings are built only from supplied read-only doctrine, alignment, memory, resilience, continuity, lineage, evidence quality, resolution, remediation, governance, trend, and aggregation outputs.",
      "Doctrine assurance evaluates doctrine confidence, principle support, doctrine drift, and alignment context.",
      "Evidence assurance evaluates evidence quality, missing evidence, contradiction areas, lineage dependency support, and evidence alignment.",
      "Continuity, resilience, lineage, and reviewability assurance evaluate whether upstream governance layers reinforce human-review confidence.",
      "Governance reliability assurance evaluates whether the combined governance stack consistently supports durable, neutral, human-reviewed reliability indicators.",
      "Governance assurance score is deterministic from assurance finding status, finding confidence, upstream scores, context completeness, strengths, weaknesses, drift, and reliability indicators.",
      "Assurance intelligence is read-only and does not enforce policy, automate governance, persist data, or execute actions.",
    ],
    majorDrivers: unique([
      ...params.result.findings
        .slice(0, 8)
        .map((finding) => `${finding.assuranceType}: ${finding.status} (${finding.confidenceScore}/100).`),
      ...params.result.governanceReliabilityIndicators.slice(0, 6),
      ...params.result.assuranceWeaknesses.slice(0, 6),
      ...(params.input.alignmentResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.doctrineResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.evidenceQualityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Governance assurance intelligence evaluates only supplied read-only governance intelligence outputs.",
      "It does not enforce policy, certify compliance, determine fault, profile demographics, infer protected characteristics, or make legal, tax, lending, or investment conclusions.",
      "It does not mutate inputs, write to databases, persist assurance, send messages, automate outreach, block operations, auto-remediate, or trigger autonomous governance actions.",
      "Assurance status is a neutral operational indicator for human review and requires human judgment before any operational decision.",
    ],
  };
}
