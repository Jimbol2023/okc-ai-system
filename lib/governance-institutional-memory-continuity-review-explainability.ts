import type {
  GovernanceInstitutionalMemoryContinuityInput,
  GovernanceInstitutionalMemoryContinuityResult,
} from "./governance-institutional-memory-continuity-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceInstitutionalMemoryContinuityExplainability(params: {
  input: GovernanceInstitutionalMemoryContinuityInput;
  result: Omit<GovernanceInstitutionalMemoryContinuityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance institutional memory continuity classification is ${params.result.memoryContinuityClassification}.`,
      `Institutional memory continuity score is ${params.result.institutionalMemoryContinuityScore}/100, where higher indicates stronger reconstruction durability across governance memory, audit history, semantics, traceability, observability, lineage, reviewability, lifecycle, compatibility, and migration context.`,
      `Evaluated ${params.result.areaAssessments.length} institutional memory continuity areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} institutional memory continuity findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    institutionalMemoryContinuityRulesApplied: [
      "Institutional memory continuity review is read-only and evaluates only supplied governance memory, lifecycle, versioning, reviewability, observability, semantic, traceability, audit, doctrine, lineage, and evidence outputs.",
      "Area scores are deterministic from reconstructable signals, memory fragility signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify institutional memory gaps, governance memory fragmentation, audit memory discontinuity, semantic memory drift, lineage reconstruction weakness, traceability memory gaps, observability memory gaps, reviewability memory weakness, lifecycle memory gaps, future memory survivability risk, and governance history reconstruction risk.",
      "This review does not implement persistence, create memory storage, mutate memory, rewrite governance history, centralize memory control, create lifecycle automation, rewrite semantics, redesign architecture, enforce policy, or trigger orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.memoryResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.lifecycleContinuityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.lineageResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Institutional memory continuity review evaluates supplied governance outputs only and does not validate factual truth, certify compliance, or provide legal conclusions.",
      "It does not mutate inputs, write to databases, add routes, create memory storage, execute memory writes, automate lifecycle actions, enforce policies, block operations, send outreach, or trigger orchestration.",
      "Memory continuity is a reconstruction-readiness indicator, not a persistence implementation or autonomous memory system.",
      "Compatibility and migration memory are evaluated from supplied lifecycle/versioning context and optional metadata only.",
    ],
  };
}
