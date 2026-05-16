import type {
  GovernanceLifecycleContinuityInput,
  GovernanceLifecycleContinuityResult,
} from "./governance-lifecycle-continuity-review-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildGovernanceLifecycleContinuityExplainability(params: {
  input: GovernanceLifecycleContinuityInput;
  result: Omit<GovernanceLifecycleContinuityResult, "explainability">;
}) {
  return {
    summary: [
      `Governance lifecycle continuity classification is ${params.result.lifecycleContinuityClassification}.`,
      `Lifecycle continuity score is ${params.result.lifecycleContinuityScore}/100, where higher indicates stronger continuity across governance findings, audits, evidence, traceability, observability, reviewability, doctrine, versioning, compatibility, migration, memory, and lineage.`,
      `Evaluated ${params.result.areaAssessments.length} lifecycle continuity areas at ${params.input.evaluatedAt}.`,
      `Detected ${params.result.findings.length} lifecycle continuity findings.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
    ],
    lifecycleContinuityRulesApplied: [
      "Lifecycle continuity review is read-only and evaluates only supplied governance review outputs, metadata, findings, and recommendations.",
      "Area scores are deterministic from continuity signals, fragility signals, finding volume, explainability depth, and supplied upstream classifications.",
      "Findings identify lifecycle gaps, audit continuity risk, semantic drift, traceability discontinuity, observability fragmentation, reviewability degradation, doctrine continuity weakness, versioning continuity risk, compatibility continuity risk, migration continuity risk, institutional memory fragmentation, and governance history reconstruction risk.",
      "This review does not implement persistence, create lifecycle automation, mutate governance history, rewrite findings, centralize lifecycle control, execute migrations, rewrite semantics, redesign architecture, enforce policy, or trigger orchestration.",
    ],
    majorDrivers: unique([
      ...params.result.areaAssessments
        .slice(0, 8)
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
      ...params.result.findings.slice(0, 8).map((finding) => `${finding.findingType}: ${finding.description}`),
      ...(params.input.versioningReadinessResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.reviewabilityIntegrityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.semanticStabilityResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "Lifecycle continuity review evaluates supplied governance outputs only and does not validate factual truth, certify compliance, or provide legal conclusions.",
      "It does not mutate inputs, write to databases, add routes, create lifecycle automation, execute migrations, enforce policies, block operations, send outreach, or trigger orchestration.",
      "Compatibility and migration continuity are evaluated from supplied versioning outputs, optional compatibility/migration context, and metadata; this module does not create migration infrastructure.",
      "Lifecycle continuity classification is a neutral operational indicator for human review.",
    ],
  };
}
