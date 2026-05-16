import {
  auditClassificationFromScore,
  calculateAuditCategoryScores,
  calculateOverallAuditScore,
  findingClassification,
  findingRequiresHumanReview,
} from "./full-system-governance-audit-scoring";
import { buildFullSystemGovernanceAuditExplainability } from "./full-system-governance-audit-explainability";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditInput,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditRecommendationClassification,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const slug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const CATEGORY_LABEL: Record<FullSystemGovernanceAuditCategory, string> = {
  architecture_integrity: "Architecture integrity",
  dependency_integrity: "Dependency integrity",
  orchestration_purity: "Orchestration purity",
  governance_safety: "Governance safety",
  explainability_integrity: "Explainability integrity",
  deterministic_scoring_integrity: "Deterministic scoring integrity",
  traceability_integrity: "Traceability integrity",
  resilience_consistency: "Resilience consistency",
  doctrine_consistency: "Doctrine consistency",
  utility_duplication: "Utility duplication",
  type_duplication: "Type duplication",
  scalability_risks: "Scalability risks",
  enterprise_durability: "Enterprise durability",
  long_horizon_maintainability: "Long-horizon maintainability",
  hidden_execution_pathways: "Hidden execution pathways",
  future_technical_debt: "Future technical debt",
  reusable_infrastructure_opportunities: "Reusable infrastructure opportunities",
  adapter_consistency: "Adapter consistency",
  anti_fragility_opportunities: "Anti-fragility opportunities",
  institutional_continuity_risks: "Institutional continuity risks",
};

const categoryEvidence = (input: FullSystemGovernanceAuditInput, category: FullSystemGovernanceAuditCategory): string[] => {
  const inventory = input.inventory;

  switch (category) {
    case "architecture_integrity":
      return [
        `Governance modules supplied: ${inventory?.governanceModules?.length ?? "not_supplied"}.`,
        `Known warnings: ${inventory?.knownWarnings?.length ?? 0}.`,
        ...(input.readinessResult?.architectureImprovementReview.map((item) => item.observation) ?? []),
      ];
    case "dependency_integrity":
      return [
        `Adapter modules supplied: ${inventory?.adapterModules?.length ?? "not_supplied"}.`,
        `Known limitations: ${inventory?.knownLimitations?.length ?? 0}.`,
        ...(input.lineageResult?.governanceDependencyChains.slice(0, 6) ?? []),
      ];
    case "orchestration_purity":
      return [
        `Automation modules supplied: ${inventory?.automationModules?.length ?? 0}.`,
        `Messaging modules supplied: ${inventory?.messagingModules?.length ?? 0}.`,
        `Orchestration modules supplied: ${inventory?.orchestrationModules?.length ?? 0}.`,
        "Audit module is read-only and does not execute orchestration.",
      ];
    case "governance_safety":
      return [
        `Assurance status: ${input.assuranceResult?.overallAssuranceStatus ?? "not_supplied"}.`,
        `Readiness classification: ${input.readinessResult?.readinessClassification ?? "not_supplied"}.`,
        ...(input.assuranceResult?.governanceReliabilityIndicators.slice(0, 6) ?? []),
      ];
    case "explainability_integrity":
      return [
        ...(input.readinessResult?.explainability.readinessRulesApplied.slice(0, 4) ?? []),
        ...(input.assuranceResult?.explainability.assuranceRulesApplied.slice(0, 4) ?? []),
      ];
    case "deterministic_scoring_integrity":
      return [
        "Readiness, assurance, alignment, doctrine, memory, resilience, continuity, lineage, and evidence scores are deterministic inputs.",
        `Inventory warnings: ${inventory?.knownWarnings?.length ?? 0}.`,
      ];
    case "traceability_integrity":
      return [
        `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        `Evidence quality score: ${input.evidenceQualityResult?.evidenceQualityScore ?? "not_supplied"}.`,
        ...(input.lineageResult?.weakLineageAreas.slice(0, 6) ?? []),
      ];
    case "resilience_consistency":
      return [
        `Resilience status: ${input.resilienceResult?.resilienceStatus ?? "not_supplied"}.`,
        `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
        ...(input.resilienceResult?.resilienceStrengths.slice(0, 6) ?? []),
      ];
    case "doctrine_consistency":
      return [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`,
        ...(input.doctrineResult?.doctrineLimitations.slice(0, 6) ?? []),
      ];
    case "utility_duplication":
      return [
        "Repeated deterministic helpers are intentionally left local during strict build sequence.",
        "Future shared utility extraction remains recommended.",
      ];
    case "type_duplication":
      return [
        "Existing governance result types are reused across readiness and audit inputs.",
        "Evidence traceability contract remains a future formalization need.",
      ];
    case "scalability_risks":
      return [
        "Governance layers are domain-neutral and can accept multiple business-line adapters.",
        `Adapter modules supplied: ${inventory?.adapterModules?.length ?? "not_supplied"}.`,
      ];
    case "enterprise_durability":
      return [
        `Memory status: ${input.memoryResult?.institutionalMemoryStatus ?? "not_supplied"}.`,
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        ...(input.memoryResult?.longHorizonContext.slice(0, 6) ?? []),
      ];
    case "long_horizon_maintainability":
      return [
        `Governance modules supplied: ${inventory?.governanceModules?.length ?? "not_supplied"}.`,
        ...(input.memoryResult?.governanceLessons.slice(0, 6) ?? []),
      ];
    case "hidden_execution_pathways":
      return [
        `Automation modules supplied: ${inventory?.automationModules?.length ?? 0}.`,
        `API modules supplied: ${inventory?.apiModules?.length ?? 0}.`,
        "Audit does not call or execute supplied modules.",
      ];
    case "future_technical_debt":
      return [
        ...(inventory?.knownWarnings ?? []),
        ...(inventory?.knownLimitations ?? []),
        "Local helper duplication remains a future refactor candidate.",
      ];
    case "reusable_infrastructure_opportunities":
      return [
        "Shared deterministic utility extraction is a future upgrade.",
        "Shared traceability and explainability helpers are future upgrade candidates.",
      ];
    case "adapter_consistency":
      return [
        `Adapter modules supplied: ${inventory?.adapterModules?.length ?? "not_supplied"}.`,
        "Core governance intelligence remains adapter-agnostic.",
      ];
    case "anti_fragility_opportunities":
      return [
        `Resilience status: ${input.resilienceResult?.resilienceStatus ?? "not_supplied"}.`,
        `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
        ...(input.resilienceResult?.antiFragilityIndicators.slice(0, 6) ?? []),
      ];
    case "institutional_continuity_risks":
      return [
        `Readiness classification: ${input.readinessResult?.readinessClassification ?? "not_supplied"}.`,
        `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
        ...(input.continuityResult?.continuityWeaknesses.slice(0, 6) ?? []),
      ];
  }
};

const categoryRisks = (input: FullSystemGovernanceAuditInput, category: FullSystemGovernanceAuditCategory, score: number): string[] => {
  const baseRisks = score < 68 ? [`${CATEGORY_LABEL[category]} needs human review before relying on this area.`] : [];

  switch (category) {
    case "orchestration_purity":
    case "hidden_execution_pathways":
      return unique([
        ...baseRisks,
        ...((input.inventory?.automationModules?.length ?? 0) > 0 ? ["Automation modules exist in supplied inventory and require isolation review."] : []),
        ...((input.inventory?.messagingModules?.length ?? 0) > 0 ? ["Messaging modules exist in supplied inventory and require outreach boundary review."] : []),
      ]);
    case "traceability_integrity":
      return unique([
        ...baseRisks,
        ...((input.lineageResult?.weakLineageAreas.length ?? 0) > 0 ? ["Weak lineage areas reduce traceability confidence."] : []),
        ...((input.evidenceQualityResult?.missingEvidenceAreas.length ?? 0) > 0 ? ["Missing evidence areas reduce traceability confidence."] : []),
      ]);
    case "future_technical_debt":
    case "utility_duplication":
      return unique([...baseRisks, "Repeated helper logic can become harder to maintain as governance modules grow."]);
    default:
      return baseRisks;
  }
};

const buildFindings = (input: FullSystemGovernanceAuditInput, categoryScores: Record<FullSystemGovernanceAuditCategory, number>): FullSystemGovernanceAuditFinding[] =>
  (Object.keys(categoryScores) as FullSystemGovernanceAuditCategory[]).map((category) => {
    const score = categoryScores[category];
    const classification = findingClassification(score);
    const evidence = categoryEvidence(input, category);
    const risks = categoryRisks(input, category, score);

    return {
      id: `full-system-governance-audit-${slug(category)}`,
      category,
      classification,
      score,
      description: `${CATEGORY_LABEL[category]} evaluated as ${classification} with score ${score}/100.`,
      evidence,
      risks,
      recommendedHumanReview:
        classification === "critical_risk" || classification === "needs_attention"
          ? `Review ${CATEGORY_LABEL[category].toLowerCase()} before treating the system as governance-ready.`
          : `Continue periodic human review of ${CATEGORY_LABEL[category].toLowerCase()}.`,
      explainability: {
        factors: [
          `Category score: ${score}/100.`,
          `Classification: ${classification}.`,
          `Evidence items: ${evidence.length}.`,
          `Risk items: ${risks.length}.`,
        ],
        reasoning: [
          "Finding is generated deterministically from supplied governance outputs and optional static inventory context.",
        ],
      },
    };
  });

const recommendationClassification = (finding: FullSystemGovernanceAuditFinding): FullSystemGovernanceAuditRecommendationClassification => {
  if (finding.classification === "critical_risk") return "Immediate";
  if (["future_technical_debt", "reusable_infrastructure_opportunities", "utility_duplication", "type_duplication"].includes(finding.category)) {
    return "Future Upgrade";
  }
  if (finding.classification === "needs_attention") return "Future Upgrade";
  return "Optional Optimization";
};

const buildRecommendations = (findings: FullSystemGovernanceAuditFinding[]): FullSystemGovernanceAuditRecommendation[] =>
  findings
    .filter((finding) => finding.classification !== "institutionally_strong")
    .map((finding) => ({
      id: `recommendation-${finding.id}`,
      classification: recommendationClassification(finding),
      category: finding.category,
      recommendation: finding.recommendedHumanReview,
      rationale: finding.risks[0] ?? finding.description,
    }));

const buildStrengths = (findings: FullSystemGovernanceAuditFinding[]): string[] =>
  unique(
    findings
      .filter((finding) => ["stable", "institutionally_strong"].includes(finding.classification))
      .map((finding) => `${CATEGORY_LABEL[finding.category]} is ${finding.classification}.`),
  );

const buildWeaknesses = (findings: FullSystemGovernanceAuditFinding[]): string[] =>
  unique(
    findings
      .filter((finding) => ["critical_risk", "needs_attention"].includes(finding.classification))
      .map((finding) => `${CATEGORY_LABEL[finding.category]} is ${finding.classification}.`),
  );

const buildLimitations = (input: FullSystemGovernanceAuditInput): string[] =>
  unique([
    ...(!input.readinessResult ? ["Readiness result was not supplied."] : []),
    ...(!input.assuranceResult ? ["Assurance result was not supplied."] : []),
    ...(!input.alignmentResult ? ["Alignment result was not supplied."] : []),
    ...(!input.lineageResult ? ["Lineage result was not supplied."] : []),
    ...(!input.evidenceQualityResult ? ["Evidence quality result was not supplied."] : []),
    ...(input.inventory?.knownLimitations ?? []),
    "This audit does not execute runtime paths, call routes, inspect live databases, or validate external systems.",
  ]);

export function analyzeFullSystemGovernanceAudit(input: FullSystemGovernanceAuditInput): FullSystemGovernanceAuditResult {
  const categoryScores = calculateAuditCategoryScores(input);
  const findings = buildFindings(input, categoryScores);
  const overallAuditScore = calculateOverallAuditScore(categoryScores);
  const auditClassification = auditClassificationFromScore(overallAuditScore);
  const strengths = buildStrengths(findings);
  const weaknesses = buildWeaknesses(findings);
  const risks = unique(findings.flatMap((finding) => finding.risks));
  const evidence = unique(findings.flatMap((finding) => finding.evidence).slice(0, 60));
  const limitations = buildLimitations(input);
  const governanceSafetyNotes = [
    "Audit is read-only, analysis-only, non-destructive, governance-safe, and orchestration-safe.",
    "Audit does not enforce policy, execute workflows, send outreach, auto-remediate, auto-block, or trigger autonomous governance.",
    "Audit findings are neutral operational indicators for human review.",
  ];
  const architectureObservations = unique([
    ...findings
      .filter((finding) => ["architecture_integrity", "dependency_integrity", "type_duplication", "scalability_risks"].includes(finding.category))
      .map((finding) => finding.description),
    "Strict build order remains preserved; no broad refactor was performed.",
  ]);
  const orchestrationContaminationRisks = unique([
    ...findings
      .filter((finding) => finding.category === "orchestration_purity")
      .flatMap((finding) => finding.risks),
    "Future preview or dashboard integrations must remain read-only and isolated from execution paths.",
  ]);
  const hiddenExecutionPathwayRisks = unique([
    ...findings
      .filter((finding) => finding.category === "hidden_execution_pathways")
      .flatMap((finding) => finding.risks),
  ]);
  const reusableInfrastructureOpportunities = unique([
    "Extract shared deterministic helpers after governance sequence stabilizes.",
    "Formalize evidence traceability contract in a future upgrade.",
    "Consider shared explainability and recommendation-classification helpers later.",
  ]);
  const futureTechnicalDebtItems = unique([
    ...findings
      .filter((finding) => ["future_technical_debt", "utility_duplication", "type_duplication"].includes(finding.category))
      .flatMap((finding) => [finding.description, ...finding.risks]),
    "Principle-to-evidence normalization remains a future durability upgrade.",
  ]);
  const recommendations = buildRecommendations(findings);
  const resultWithoutExplainability = {
    overallAuditScore,
    auditClassification,
    categoryScores,
    findings,
    strengths,
    weaknesses,
    risks,
    evidence,
    limitations,
    governanceSafetyNotes,
    architectureObservations,
    orchestrationContaminationRisks,
    hiddenExecutionPathwayRisks,
    reusableInfrastructureOpportunities,
    futureTechnicalDebtItems,
    recommendations,
    humanReviewRequired:
      auditClassification !== "institutionally_strong" ||
      findings.some(findingRequiresHumanReview) ||
      risks.length > 0,
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildFullSystemGovernanceAuditExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getFullSystemGovernanceAudit = analyzeFullSystemGovernanceAudit;
