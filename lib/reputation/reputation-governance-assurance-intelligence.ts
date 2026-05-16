import {
  buildGovernanceAssuranceExplainability,
  buildGovernanceAssuranceRecommendations,
} from "./reputation-governance-assurance-explainability";
import {
  assuranceStatusFromScore,
  calculateAssuranceFindingConfidence,
  calculateGovernanceAssuranceScore,
} from "./reputation-governance-assurance-scoring";
import type {
  ReputationGovernanceAssuranceFinding,
  ReputationGovernanceAssuranceInput,
  ReputationGovernanceAssuranceResult,
  ReputationGovernanceAssuranceStatus,
  ReputationGovernanceAssuranceType,
} from "./reputation-governance-assurance-types";
import type { ReputationArchitectureImprovementItem } from "./reputation-governance-resilience-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const statusFromEvidence = (
  supportingEvidence: string[],
  conflictingEvidence: string[],
  preferredStatus: ReputationGovernanceAssuranceStatus = "reliable",
): ReputationGovernanceAssuranceStatus => {
  if (conflictingEvidence.length >= supportingEvidence.length + 2) return "weak";
  if (conflictingEvidence.length > 0) return supportingEvidence.length >= conflictingEvidence.length + 2 ? "reliable" : "developing";
  if (supportingEvidence.length >= 6 && preferredStatus === "institutionally_durable") return "institutionally_durable";
  if (supportingEvidence.length >= 3) return preferredStatus;
  return supportingEvidence.length > 0 ? "developing" : "weak";
};

const domainsFromInput = (input: ReputationGovernanceAssuranceInput): string[] =>
  unique([
    ...(input.governanceResult?.affectedGovernanceDomains ?? []),
    ...(input.remediationResult?.affectedGovernanceDomains ?? []),
    ...(input.lineageResult?.nodes.flatMap((node) => node.relatedGovernanceDomains) ?? []),
    ...(input.doctrineResult?.principles.flatMap((principle) => principle.affectedGovernanceDomains) ?? []),
    ...(input.memoryResult?.recurringPatterns.flatMap((pattern) => pattern.affectedGovernanceDomains) ?? []),
    ...(input.resilienceResult?.findings.flatMap((finding) => finding.affectedGovernanceDomains) ?? []),
    ...(input.alignmentResult?.findings.flatMap((finding) => finding.affectedGovernanceDomains) ?? []),
  ]);

const alignmentSupport = (input: ReputationGovernanceAssuranceInput, alignmentType: string): string[] =>
  unique(
    input.alignmentResult?.findings
      .filter((finding) => finding.alignmentType === alignmentType)
      .filter((finding) => ["aligned", "strongly_aligned"].includes(finding.status))
      .flatMap((finding) => [
        `${finding.alignmentType} is ${finding.status}.`,
        ...finding.supportingEvidence,
      ]) ?? [],
  );

const alignmentConflict = (input: ReputationGovernanceAssuranceInput, alignmentType: string): string[] =>
  unique(
    input.alignmentResult?.findings
      .filter((finding) => finding.alignmentType === alignmentType)
      .filter((finding) => ["misaligned", "partially_aligned"].includes(finding.status))
      .flatMap((finding) => [
        `${finding.alignmentType} is ${finding.status}.`,
        ...finding.conflictingEvidence,
      ]) ?? [],
  );

const createFinding = (params: {
  assuranceType: ReputationGovernanceAssuranceType;
  status: ReputationGovernanceAssuranceStatus;
  description: string;
  supportingEvidence: string[];
  conflictingEvidence: string[];
  affectedGovernanceDomains: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): ReputationGovernanceAssuranceFinding => {
  const supportingEvidence = unique(params.supportingEvidence);
  const conflictingEvidence = unique(params.conflictingEvidence);
  const affectedGovernanceDomains = unique(params.affectedGovernanceDomains);
  const factors = unique(params.factors);

  return {
    id: `governance-assurance-${slug(params.assuranceType)}`,
    assuranceType: params.assuranceType,
    status: params.status,
    description: params.description,
    supportingEvidence,
    conflictingEvidence,
    affectedGovernanceDomains,
    confidenceScore: calculateAssuranceFindingConfidence({
      supportingEvidenceCount: supportingEvidence.length,
      conflictingEvidenceCount: conflictingEvidence.length,
      affectedGovernanceDomainCount: affectedGovernanceDomains.length,
      factorCount: factors.length,
      baseConfidence: params.baseConfidence,
    }),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildFindings = (input: ReputationGovernanceAssuranceInput): ReputationGovernanceAssuranceFinding[] => {
  const domains = domainsFromInput(input);
  const doctrineSupport = unique([
    ...(input.doctrineResult?.principles.map((principle) => `${principle.title}: ${principle.confidenceScore}/100.`) ?? []),
    ...(input.doctrineResult?.durablePatterns ?? []),
    ...alignmentSupport(input, "doctrine_alignment"),
  ]);
  const doctrineConflict = unique([
    ...(!input.doctrineResult ? ["Doctrine result was not supplied."] : []),
    ...(input.doctrineResult?.doctrineStatus === "thin" || input.doctrineResult?.doctrineStatus === "forming"
      ? [`Doctrine status is ${input.doctrineResult.doctrineStatus}.`]
      : []),
    ...(input.doctrineResult?.driftFindings.map((finding) => finding.description) ?? []),
    ...alignmentConflict(input, "doctrine_alignment"),
  ]);

  const evidenceSupport = unique([
    ...(input.evidenceQualityResult && ["strong", "highly_reliable"].includes(input.evidenceQualityResult.overallReliabilityLevel)
      ? [`Evidence reliability is ${input.evidenceQualityResult.overallReliabilityLevel}.`]
      : []),
    ...(input.evidenceQualityResult?.stabilizationSupportedAreas.map((area) => `Evidence supports stabilization area: ${area}.`) ?? []),
    ...(input.lineageResult?.governanceDependencyChains ?? []),
    ...alignmentSupport(input, "evidence_alignment"),
  ]);
  const evidenceConflict = unique([
    ...(!input.evidenceQualityResult ? ["Evidence quality result was not supplied."] : []),
    ...(input.evidenceQualityResult && ["weak", "partial"].includes(input.evidenceQualityResult.overallReliabilityLevel)
      ? [`Evidence reliability is ${input.evidenceQualityResult.overallReliabilityLevel}.`]
      : []),
    ...(input.evidenceQualityResult?.missingEvidenceAreas.map((area) => `Missing evidence area: ${area}.`) ?? []),
    ...(input.evidenceQualityResult?.contradictionAreas.map((area) => `Evidence contradiction area: ${area}.`) ?? []),
    ...alignmentConflict(input, "evidence_alignment"),
  ]);

  const continuitySupport = unique([
    ...(input.continuityResult && ["resilient", "anti_fragile"].includes(input.continuityResult.continuityStatus)
      ? [`Continuity status is ${input.continuityResult.continuityStatus}.`]
      : []),
    ...(input.continuityResult?.continuityStrengths ?? []),
    ...(input.continuityResult?.resilienceIndicators ?? []),
    ...(input.memoryResult?.continuityLearningIndicators ?? []),
    ...alignmentSupport(input, "continuity_alignment"),
  ]);
  const continuityConflict = unique([
    ...(!input.continuityResult ? ["Continuity result was not supplied."] : []),
    ...(input.continuityResult && ["fragile", "stable"].includes(input.continuityResult.continuityStatus)
      ? [`Continuity status is ${input.continuityResult.continuityStatus}.`]
      : []),
    ...(input.continuityResult?.continuityWeaknesses ?? []),
    ...(input.continuityResult?.driftFindings.map((finding) => finding.description) ?? []),
    ...alignmentConflict(input, "continuity_alignment"),
  ]);

  const resilienceSupport = unique([
    ...(input.resilienceResult && ["resilient", "anti_fragile"].includes(input.resilienceResult.resilienceStatus)
      ? [`Resilience status is ${input.resilienceResult.resilienceStatus}.`]
      : []),
    ...(input.resilienceResult?.resilienceStrengths ?? []),
    ...(input.resilienceResult?.recoveryIndicators ?? []),
    ...(input.resilienceResult?.antiFragilityIndicators ?? []),
    ...(input.memoryResult?.resilienceLearningIndicators ?? []),
    ...alignmentSupport(input, "resilience_alignment"),
  ]);
  const resilienceConflict = unique([
    ...(!input.resilienceResult ? ["Resilience result was not supplied."] : []),
    ...(input.resilienceResult && ["fragile", "pressured"].includes(input.resilienceResult.resilienceStatus)
      ? [`Resilience status is ${input.resilienceResult.resilienceStatus}.`]
      : []),
    ...(input.resilienceResult?.resilienceWeaknesses ?? []),
    ...(input.resilienceResult?.fragilityIndicators ?? []),
    ...alignmentConflict(input, "resilience_alignment"),
  ]);

  const lineageSupport = unique([
    ...(input.lineageResult && input.lineageResult.lineageIntegrityScore >= 70
      ? [`Lineage integrity score is ${input.lineageResult.lineageIntegrityScore}/100.`]
      : []),
    ...(input.lineageResult?.governanceDependencyChains ?? []),
    ...(input.lineageResult?.stabilizationChains ?? []),
    ...alignmentSupport(input, "reviewability_alignment"),
  ]);
  const lineageConflict = unique([
    ...(!input.lineageResult ? ["Lineage result was not supplied."] : []),
    ...(input.lineageResult && input.lineageResult.lineageIntegrityScore < 55
      ? [`Lineage integrity score is ${input.lineageResult.lineageIntegrityScore}/100.`]
      : []),
    ...(input.lineageResult?.weakLineageAreas.map((area) => `Weak lineage area: ${area}.`) ?? []),
    ...(input.lineageResult?.contradictionChains.map((chain) => `Contradiction chain: ${chain}.`) ?? []),
  ]);

  const reviewabilitySupport = unique([
    input.continuityResult?.reviewabilityAssessment,
    ...(input.lineageResult?.explainability.lineageRulesApplied ?? []),
    ...(input.alignmentResult?.alignmentStrengths.filter((strength) => strength.includes("reviewability")) ?? []),
    ...(input.doctrineResult?.principles
      .filter((principle) => principle.principleType === "human_reviewed_governance")
      .flatMap((principle) => [principle.description, ...principle.supportingEvidence]) ?? []),
  ].filter((item): item is string => typeof item === "string"));
  const reviewabilityConflict = unique([
    ...(!input.alignmentResult ? ["Alignment result was not supplied."] : []),
    ...(!input.continuityResult ? ["Continuity result was not supplied for reviewability assurance."] : []),
    ...(!input.lineageResult ? ["Lineage result was not supplied for reviewability assurance."] : []),
    ...(input.alignmentResult?.alignmentGaps.filter((gap) => gap.includes("reviewability")) ?? []),
    ...(input.doctrineResult?.doctrineLimitations.filter((limitation) => limitation.includes("review")) ?? []),
  ]);

  const reliabilitySupport = unique([
    ...(input.alignmentResult && ["aligned", "strongly_aligned"].includes(input.alignmentResult.overallAlignmentStatus)
      ? [`Alignment status is ${input.alignmentResult.overallAlignmentStatus}.`]
      : []),
    ...(input.doctrineResult && ["reliable", "durable"].includes(input.doctrineResult.doctrineStatus)
      ? [`Doctrine status is ${input.doctrineResult.doctrineStatus}.`]
      : []),
    ...(input.memoryResult && ["reliable", "durable"].includes(input.memoryResult.institutionalMemoryStatus)
      ? [`Memory status is ${input.memoryResult.institutionalMemoryStatus}.`]
      : []),
    ...(input.resolutionResult && ["improving", "stabilized"].includes(input.resolutionResult.overallResolutionStatus)
      ? [`Resolution status is ${input.resolutionResult.overallResolutionStatus}.`]
      : []),
    ...(input.aggregationResult && ["stable", "watch"].includes(input.aggregationResult.enterpriseExposureLevel)
      ? [`Enterprise exposure level is ${input.aggregationResult.enterpriseExposureLevel}.`]
      : []),
  ]);
  const reliabilityConflict = unique([
    ...(input.alignmentResult && ["misaligned", "partially_aligned"].includes(input.alignmentResult.overallAlignmentStatus)
      ? [`Alignment status is ${input.alignmentResult.overallAlignmentStatus}.`]
      : []),
    ...(input.alignmentResult?.doctrinePracticeGaps ?? []),
    ...(input.alignmentResult?.alignmentDriftFindings ?? []),
    ...(input.resolutionResult?.unresolvedAreas.map((area) => `Unresolved area: ${area}.`) ?? []),
    ...(input.aggregationResult && ["elevated", "critical"].includes(input.aggregationResult.enterpriseExposureLevel)
      ? [`Enterprise exposure level is ${input.aggregationResult.enterpriseExposureLevel}.`]
      : []),
  ]);

  return [
    createFinding({
      assuranceType: "doctrine_assurance",
      status: statusFromEvidence(
        doctrineSupport,
        doctrineConflict,
        input.doctrineResult?.doctrineStatus === "durable" ? "institutionally_durable" : "reliable",
      ),
      description: "Doctrine confidence is evaluated against principle support, doctrine drift, and doctrine alignment context.",
      supportingEvidence: doctrineSupport,
      conflictingEvidence: doctrineConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review doctrine confidence and drift before relying on doctrine assurance.",
      factors: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine score: ${input.doctrineResult?.doctrineConfidenceScore ?? "not_supplied"}.`,
      ],
      reasoning: ["Doctrine assurance requires supported doctrine principles, limited drift, and alignment with institutional practice."],
    }),
    createFinding({
      assuranceType: "evidence_assurance",
      status: statusFromEvidence(evidenceSupport, evidenceConflict),
      description: "Evidence confidence is evaluated from evidence quality, missing evidence, contradictions, and traceable lineage support.",
      supportingEvidence: evidenceSupport,
      conflictingEvidence: evidenceConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review evidence limitations and traceability before relying on evidence assurance.",
      factors: [
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        `Evidence score: ${input.evidenceQualityResult?.evidenceQualityScore ?? "not_supplied"}.`,
      ],
      reasoning: ["Evidence assurance is stronger when evidence quality is reliable and supported by traceable lineage context."],
    }),
    createFinding({
      assuranceType: "continuity_assurance",
      status: statusFromEvidence(
        continuitySupport,
        continuityConflict,
        input.continuityResult?.continuityStatus === "anti_fragile" ? "institutionally_durable" : "reliable",
      ),
      description: "Continuity confidence is evaluated from continuity status, strengths, drift, and alignment context.",
      supportingEvidence: continuitySupport,
      conflictingEvidence: continuityConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review continuity drift and weaknesses before relying on continuity assurance.",
      factors: [
        `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
        `Continuity score: ${input.continuityResult?.governanceContinuityScore ?? "not_supplied"}.`,
      ],
      reasoning: ["Continuity assurance requires stable or improving continuity indicators and limited continuity drift."],
    }),
    createFinding({
      assuranceType: "resilience_assurance",
      status: statusFromEvidence(
        resilienceSupport,
        resilienceConflict,
        input.resilienceResult?.resilienceStatus === "anti_fragile" ? "institutionally_durable" : "reliable",
      ),
      description: "Resilience confidence is evaluated from resilience status, recovery indicators, fragility indicators, and resilience alignment.",
      supportingEvidence: resilienceSupport,
      conflictingEvidence: resilienceConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review resilience weaknesses and recovery indicators before relying on resilience assurance.",
      factors: [
        `Resilience status: ${input.resilienceResult?.resilienceStatus ?? "not_supplied"}.`,
        `Resilience score: ${input.resilienceResult?.governanceResilienceScore ?? "not_supplied"}.`,
      ],
      reasoning: ["Resilience assurance is stronger when recovery, resilience, and anti-fragility indicators reinforce governance confidence."],
    }),
    createFinding({
      assuranceType: "lineage_assurance",
      status: statusFromEvidence(lineageSupport, lineageConflict),
      description: "Lineage confidence is evaluated from lineage integrity, dependency chains, stabilization chains, and weak lineage areas.",
      supportingEvidence: lineageSupport,
      conflictingEvidence: lineageConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review lineage integrity and weak lineage areas before relying on lineage assurance.",
      factors: [
        `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        `Weak lineage areas: ${input.lineageResult?.weakLineageAreas.length ?? "not_supplied"}.`,
      ],
      reasoning: ["Lineage assurance requires traceable dependency chains, strong lineage integrity, and limited contradiction pressure."],
    }),
    createFinding({
      assuranceType: "reviewability_assurance",
      status: statusFromEvidence(reviewabilitySupport, reviewabilityConflict),
      description: "Reviewability confidence is evaluated from alignment, continuity assessment, lineage rules, and human-reviewed governance doctrine.",
      supportingEvidence: reviewabilitySupport,
      conflictingEvidence: reviewabilityConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review missing reviewability context before relying on assurance status.",
      factors: [
        `Alignment status: ${input.alignmentResult?.overallAlignmentStatus ?? "not_supplied"}.`,
        `Reviewability support items: ${reviewabilitySupport.length}.`,
      ],
      reasoning: ["Reviewability assurance requires visible reasoning, limitations, dependency chains, and human-review context."],
    }),
    createFinding({
      assuranceType: "governance_reliability_assurance",
      status: statusFromEvidence(reliabilitySupport, reliabilityConflict),
      description: "Governance reliability confidence is evaluated from combined doctrine, alignment, memory, resolution, and exposure context.",
      supportingEvidence: reliabilitySupport,
      conflictingEvidence: reliabilityConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review doctrine-practice gaps and reliability conflicts before relying on governance assurance.",
      factors: [
        `Alignment status: ${input.alignmentResult?.overallAlignmentStatus ?? "not_supplied"}.`,
        `Resolution status: ${input.resolutionResult?.overallResolutionStatus ?? "not_supplied"}.`,
      ],
      reasoning: ["Governance reliability assurance requires multiple governance layers to reinforce the same human-review confidence direction."],
    }),
  ];
};

const buildAssuranceStrengths = (findings: ReputationGovernanceAssuranceFinding[]): string[] =>
  unique(
    findings
      .filter((finding) => ["reliable", "institutionally_durable"].includes(finding.status))
      .flatMap((finding) => [
        `${finding.assuranceType} is ${finding.status}.`,
        ...finding.supportingEvidence.slice(0, 3),
      ]),
  );

const buildAssuranceWeaknesses = (findings: ReputationGovernanceAssuranceFinding[]): string[] =>
  unique(
    findings
      .filter((finding) => ["weak", "developing"].includes(finding.status))
      .flatMap((finding) => [
        `${finding.assuranceType} is ${finding.status}.`,
        ...finding.conflictingEvidence.slice(0, 4),
      ]),
  );

const buildAssuranceDriftFindings = (input: ReputationGovernanceAssuranceInput, findings: ReputationGovernanceAssuranceFinding[]): string[] =>
  unique([
    ...(input.alignmentResult?.alignmentDriftFindings ?? []),
    ...(input.doctrineResult?.driftFindings.map((finding) => `${finding.driftType}: ${finding.description}`) ?? []),
    ...(input.continuityResult?.driftFindings.map((finding) => `${finding.driftType}: ${finding.description}`) ?? []),
    ...(input.evidenceQualityResult?.contradictionAreas.map((area) => `Evidence contradiction area: ${area}.`) ?? []),
    ...findings
      .filter((finding) => finding.conflictingEvidence.length > 0)
      .map((finding) => `${finding.assuranceType}: ${finding.conflictingEvidence.length} assurance limitation items.`),
  ]);

const buildGovernanceReliabilityIndicators = (input: ReputationGovernanceAssuranceInput, findings: ReputationGovernanceAssuranceFinding[]): string[] =>
  unique([
    ...(input.alignmentResult && ["aligned", "strongly_aligned"].includes(input.alignmentResult.overallAlignmentStatus)
      ? [`Alignment status is ${input.alignmentResult.overallAlignmentStatus}.`]
      : []),
    ...(input.doctrineResult && ["reliable", "durable"].includes(input.doctrineResult.doctrineStatus)
      ? [`Doctrine status is ${input.doctrineResult.doctrineStatus}.`]
      : []),
    ...(input.memoryResult && ["reliable", "durable"].includes(input.memoryResult.institutionalMemoryStatus)
      ? [`Memory status is ${input.memoryResult.institutionalMemoryStatus}.`]
      : []),
    ...(input.resilienceResult && ["resilient", "anti_fragile"].includes(input.resilienceResult.resilienceStatus)
      ? [`Resilience status is ${input.resilienceResult.resilienceStatus}.`]
      : []),
    ...(input.continuityResult && ["resilient", "anti_fragile"].includes(input.continuityResult.continuityStatus)
      ? [`Continuity status is ${input.continuityResult.continuityStatus}.`]
      : []),
    ...findings
      .filter((finding) => finding.status === "institutionally_durable")
      .map((finding) => `${finding.assuranceType} is institutionally durable.`),
  ]);

const buildArchitectureImprovementReview = (
  input: ReputationGovernanceAssuranceInput,
  findings: ReputationGovernanceAssuranceFinding[],
): ReputationArchitectureImprovementItem[] => {
  const items: ReputationArchitectureImprovementItem[] = [
    {
      id: "architecture-assurance-input-completeness",
      classification:
        !input.continuityResult || !input.lineageResult || !input.evidenceQualityResult
          ? "immediate"
          : "optional_optimization",
      area: "explainability gaps",
      observation: "Assurance confidence is stronger when continuity, lineage, evidence quality, doctrine, alignment, and memory results are supplied together.",
      recommendedHumanReview: "Confirm continuity, lineage, and evidence quality results are included before relying on assurance status.",
    },
    {
      id: "architecture-shared-reputation-utilities",
      classification: "future_upgrade",
      area: "reusable infrastructure opportunities",
      observation: "Assurance repeats deterministic helper patterns used by alignment, doctrine, memory, resilience, continuity, and lineage modules.",
      recommendedHumanReview: "Consider a narrow shared reputation utility module after the strict governance build sequence stabilizes.",
    },
    {
      id: "architecture-evidence-traceability-contract",
      classification: "future_upgrade",
      area: "dependency fragility",
      observation: "Assurance depends on traceable evidence and would benefit from a formal evidence traceability contract in a future stage.",
      recommendedHumanReview: "Review a formal evidence traceability type contract before connecting assurance to deeper memory, storage, or orchestration-adjacent layers.",
    },
    {
      id: "architecture-principle-evidence-normalization",
      classification: "future_upgrade",
      area: "enterprise durability improvements",
      observation: "Principle-to-evidence normalization remains a future durability upgrade for stronger assurance confidence.",
      recommendedHumanReview: "Document principle-to-evidence normalization needs without building a normalization engine in this step.",
    },
    {
      id: "architecture-read-only-assurance-boundary",
      classification: "optional_optimization",
      area: "orchestration contamination risks",
      observation: "Assurance intelligence remains a pure read-only engine isolated from routes, UI, storage, automation, messaging, and orchestration.",
      recommendedHumanReview: "Keep future assurance adoption, storage, or automation workflows separated behind explicit human-reviewed approval.",
    },
  ];

  if (findings.some((finding) => finding.status === "weak")) {
    items.push({
      id: "architecture-assurance-gap-review",
      classification: "future_upgrade",
      area: "governance safety gaps",
      observation: "Weak assurance findings suggest future value in richer non-executing traceability across doctrine, alignment, evidence, and lineage layers.",
      recommendedHumanReview: "Review weak assurance areas manually before considering any downstream integration.",
    });
  }

  return items;
};

export function analyzeEnterpriseReputationGovernanceAssurance(
  input: ReputationGovernanceAssuranceInput,
): ReputationGovernanceAssuranceResult {
  const findings = buildFindings(input);
  const assuranceStrengths = buildAssuranceStrengths(findings);
  const assuranceWeaknesses = buildAssuranceWeaknesses(findings);
  const assuranceDriftFindings = buildAssuranceDriftFindings(input, findings);
  const governanceReliabilityIndicators = buildGovernanceReliabilityIndicators(input, findings);
  const architectureImprovementReview = buildArchitectureImprovementReview(input, findings);
  const governanceAssuranceScore = calculateGovernanceAssuranceScore({
    input,
    findings,
    assuranceStrengths,
    assuranceWeaknesses,
    assuranceDriftFindings,
    governanceReliabilityIndicators,
  });
  const resultWithoutExplainability = {
    overallAssuranceStatus: assuranceStatusFromScore(governanceAssuranceScore),
    governanceAssuranceScore,
    findings,
    assuranceStrengths,
    assuranceWeaknesses,
    assuranceDriftFindings,
    governanceReliabilityIndicators,
    architectureImprovementReview,
  };

  return {
    ...resultWithoutExplainability,
    recommendations: buildGovernanceAssuranceRecommendations(resultWithoutExplainability),
    explainability: buildGovernanceAssuranceExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getEnterpriseReputationGovernanceAssuranceIntelligence =
  analyzeEnterpriseReputationGovernanceAssurance;
