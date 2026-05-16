import type { GovernanceReadinessInput, GovernanceReadinessResult } from "./governance-readiness-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceReadinessRecommendations(
  result: Omit<GovernanceReadinessResult, "recommendations" | "explainability">,
): string[] {
  const weakAreas = new Set(
    result.findings
      .filter((finding) => ["not_ready", "developing"].includes(finding.classification))
      .map((finding) => finding.readinessArea),
  );

  return unique([
    ...(result.readinessClassification === "not_ready"
      ? ["Prioritize human review of governance readiness before relying on preparedness indicators."]
      : []),
    ...(weakAreas.has("assurance_readiness") || weakAreas.has("alignment_readiness")
      ? ["Review assurance and alignment gaps before interpreting governance as operationally ready."]
      : []),
    ...(weakAreas.has("evidence_readiness")
      ? ["Review evidence quality, missing evidence, and contradiction context before relying on readiness."]
      : []),
    ...(weakAreas.has("lineage_readiness") || weakAreas.has("reviewability_readiness")
      ? ["Review lineage integrity, dependency chains, and reviewability context before relying on readiness classification."]
      : []),
    ...(weakAreas.has("continuity_readiness") || weakAreas.has("resilience_readiness")
      ? ["Review continuity and resilience drift before interpreting governance preparedness as durable."]
      : []),
    "Use governance readiness intelligence as read-only decision support; it does not enforce policy, execute actions, mutate data, send outreach, or trigger autonomous governance.",
  ]);
}

export function buildGovernanceReadinessExplainability(params: {
  input: GovernanceReadinessInput;
  result: Omit<GovernanceReadinessResult, "recommendations" | "explainability">;
}) {
  return {
    summary: [
      `Governance readiness classification is ${params.result.readinessClassification}.`,
      `Overall readiness score is ${params.result.overallReadinessScore}/100, where higher indicates stronger human-review confidence for governance readiness.`,
      `Evaluated ${params.result.findings.length} readiness findings at ${params.input.evaluatedAt}.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
      `Drift signals: ${params.result.driftSignals.length}.`,
    ],
    readinessRulesApplied: [
      "Readiness findings are built only from supplied read-only assurance, alignment, doctrine, memory, resilience, continuity, lineage, evidence quality, resolution, remediation, governance, trend, and aggregation outputs.",
      "Assurance readiness evaluates assurance score, assurance status, assurance weaknesses, and governance reliability indicators.",
      "Alignment, doctrine, memory, continuity, resilience, evidence, and lineage readiness each use their upstream deterministic status, score, strengths, weaknesses, and limitations.",
      "Reviewability readiness is derived from continuity reviewability assessment, lineage dependency chains, assurance reviewability, and alignment reviewability.",
      "Explainability readiness is derived from whether upstream layers provide major drivers, rules, evidence, and limitations.",
      "Overall readiness score uses explicit deterministic weights plus visible strength, preparedness, weakness, and drift adjustments.",
      "Readiness intelligence is read-only and does not enforce policy, automate governance, persist data, or execute actions.",
    ],
    majorDrivers: unique([
      ...params.result.readinessDrivers.slice(0, 8),
      ...params.result.governancePreparednessIndicators.slice(0, 6),
      ...params.result.weaknesses.slice(0, 6),
      ...(params.input.assuranceResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.alignmentResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.doctrineResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Governance readiness intelligence evaluates only supplied read-only governance intelligence outputs.",
      "It does not enforce policy, certify compliance, determine fault, profile demographics, infer protected characteristics, or make legal, tax, lending, or investment conclusions.",
      "It does not mutate inputs, write to databases, persist readiness, send messages, automate outreach, block operations, auto-remediate, or trigger autonomous governance actions.",
      "Readiness classification is a neutral operational indicator for human review and requires human judgment before any operational decision.",
      ...params.result.limitations,
    ],
  };
}
