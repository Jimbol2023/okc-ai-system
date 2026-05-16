import type {
  ReputationGovernanceContinuityInput,
  ReputationGovernanceContinuityResult,
} from "./reputation-governance-continuity-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceContinuityRecommendations(
  result: Omit<ReputationGovernanceContinuityResult, "recommendations" | "explainability">,
): string[] {
  const driftTypes = new Set(result.driftFindings.map((finding) => finding.driftType));

  return unique([
    ...(result.continuityStatus === "fragile"
      ? ["Prioritize human review of governance continuity before relying on longitudinal lineage indicators."]
      : []),
    ...(driftTypes.has("lineage_integrity_decline") || driftTypes.has("reviewability_decline")
      ? ["Review lineage integrity and reviewability changes across evaluation periods with human oversight."]
      : []),
    ...(driftTypes.has("evidence_dependency_weakening")
      ? ["Review evidence dependency continuity and refresh weak or missing evidence references before operational interpretation."]
      : []),
    ...(driftTypes.has("remediation_pattern_instability") || driftTypes.has("resolution_pattern_instability")
      ? ["Compare remediation and resolution patterns against governance findings before treating continuity as durable."]
      : []),
    ...(driftTypes.has("stabilization_chain_deterioration")
      ? ["Review stabilization chains and supporting evidence before treating stabilized areas as continuing."]
      : []),
    ...(driftTypes.has("governance_reasoning_inconsistency")
      ? ["Review governance reasoning consistency and contradiction chains before taking any operational action."]
      : []),
    "Use governance continuity intelligence as read-only decision support; it does not validate compliance, assign fault, execute remediation, mutate data, send outreach, or trigger governance action.",
  ]);
}

export function buildGovernanceContinuityExplainability(params: {
  input: ReputationGovernanceContinuityInput;
  result: Omit<ReputationGovernanceContinuityResult, "recommendations" | "explainability">;
}) {
  const currentScore = params.input.currentLineageResult?.lineageIntegrityScore;
  const previousScore = params.input.previousLineageResult?.lineageIntegrityScore;

  return {
    summary: [
      `Governance continuity status is ${params.result.continuityStatus}.`,
      `Governance continuity score is ${params.result.governanceContinuityScore}/100, where higher indicates stronger governance continuity.`,
      `Current lineage integrity: ${currentScore ?? "not_supplied"}. Previous lineage integrity: ${previousScore ?? "not_supplied"}.`,
      `Detected ${params.result.driftFindings.length} governance drift findings at ${params.input.evaluatedAt}.`,
      `Reviewability assessment: ${params.result.reviewabilityAssessment}`,
    ],
    continuityRulesApplied: [
      "Current and previous lineage results are compared when both are supplied.",
      "Lineage integrity decline is flagged when the current integrity score falls below the previous score by a deterministic threshold.",
      "Reviewability decline is flagged when weak lineage areas, low dependency chains, or limited explainability reduce human review clarity.",
      "Evidence dependency weakening is flagged when evidence quality is weak, missing evidence expands, or lineage dependency chains weaken.",
      "Remediation and resolution pattern instability are flagged from supplied plan, resolution, and lineage chain continuity indicators.",
      "Stabilization chain deterioration is flagged when stabilization chains reduce or contradicting evidence increases.",
      "Continuity scoring is deterministic from 0 to 100 and does not mutate source data.",
    ],
    majorDrivers: unique([
      ...params.result.driftFindings
        .slice(0, 8)
        .map((finding) => `${finding.driftType}: ${finding.description}`),
      ...params.result.resilienceIndicators.slice(0, 6),
      ...(params.input.currentLineageResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.evidenceQualityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.resolutionResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Governance continuity intelligence evaluates only supplied read-only reputation intelligence outputs.",
      "It does not prove completion, certify compliance, determine fault, profile demographics, infer protected characteristics, or make legal, tax, lending, or investment conclusions.",
      "It does not mutate inputs, write to databases, send messages, automate outreach, block operations, auto-remediate, or trigger autonomous governance actions.",
      "Continuity status is a neutral operational indicator for human review and requires human judgment before any operational decision.",
    ],
  };
}
