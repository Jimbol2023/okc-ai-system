import type {
  FullSystemGovernanceAuditInput,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

export function buildFullSystemGovernanceAuditExplainability(params: {
  input: FullSystemGovernanceAuditInput;
  result: Omit<FullSystemGovernanceAuditResult, "explainability">;
}) {
  return {
    summary: [
      `Full-system governance audit classification is ${params.result.auditClassification}.`,
      `Overall audit score is ${params.result.overallAuditScore}/100, where higher indicates stronger read-only governance integrity.`,
      `Evaluated ${params.result.findings.length} audit findings at ${params.input.evaluatedAt}.`,
      `Human review required: ${params.result.humanReviewRequired}.`,
      `Recommendations: ${params.result.recommendations.length}.`,
    ],
    auditRulesApplied: [
      "The audit evaluates only supplied read-only governance outputs and optional static inventory metadata.",
      "Category scores are deterministic and derived from readiness, assurance, alignment, doctrine, memory, resilience, continuity, lineage, evidence quality, and inventory context.",
      "Execution surfaces are treated as risk context only; the audit does not execute, mutate, call, route, persist, send, block, remediate, or enforce.",
      "Recommendations are classified as Immediate, Future Upgrade, or Optional Optimization.",
      "The audit detects and explains risks without fixing, refactoring, or redesigning the system.",
    ],
    majorDrivers: unique([
      ...params.result.findings
        .slice(0, 10)
        .map((finding) => `${finding.category}: ${finding.classification} (${finding.score}/100).`),
      ...params.result.risks.slice(0, 8),
      ...(params.input.readinessResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.assuranceResult?.explainability.majorDrivers.slice(0, 4) ?? []),
      ...(params.input.alignmentResult?.explainability.majorDrivers.slice(0, 4) ?? []),
    ]),
    limitations: [
      "This audit is analysis-only and depends on the completeness of supplied governance outputs and static inventory metadata.",
      "It does not scan the filesystem at runtime, execute routes, inspect databases, send outreach, mutate workflows, or trigger orchestration.",
      "It does not certify compliance, provide legal conclusions, profile demographics, infer protected characteristics, or enforce policy.",
      "Findings are neutral operational indicators for human review.",
      ...params.result.limitations,
    ],
  };
}
