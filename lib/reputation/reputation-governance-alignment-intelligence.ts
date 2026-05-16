import {
  buildGovernanceAlignmentExplainability,
  buildGovernanceAlignmentRecommendations,
} from "./reputation-governance-alignment-explainability";
import {
  alignmentStatusFromScore,
  calculateAlignmentFindingConfidence,
  calculateGovernanceAlignmentScore,
} from "./reputation-governance-alignment-scoring";
import type {
  ReputationGovernanceAlignmentFinding,
  ReputationGovernanceAlignmentInput,
  ReputationGovernanceAlignmentResult,
  ReputationGovernanceAlignmentStatus,
  ReputationGovernanceAlignmentType,
} from "./reputation-governance-alignment-types";
import type { ReputationArchitectureImprovementItem } from "./reputation-governance-resilience-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const includesAny = (value: string, terms: string[]): boolean => {
  const normalized = normalize(value);
  return terms.some((term) => normalized.includes(term));
};

const domainsFromInput = (input: ReputationGovernanceAlignmentInput): string[] =>
  unique([
    ...(input.governanceResult?.affectedGovernanceDomains ?? []),
    ...(input.remediationResult?.affectedGovernanceDomains ?? []),
    ...(input.lineageResult?.nodes.flatMap((node) => node.relatedGovernanceDomains) ?? []),
    ...(input.doctrineResult?.principles.flatMap((principle) => principle.affectedGovernanceDomains) ?? []),
    ...(input.memoryResult?.recurringPatterns.flatMap((pattern) => pattern.affectedGovernanceDomains) ?? []),
    ...(input.resilienceResult?.findings.flatMap((finding) => finding.affectedGovernanceDomains) ?? []),
  ]);

const statusFromEvidence = (
  supportingEvidence: string[],
  conflictingEvidence: string[],
  preferredStatus: ReputationGovernanceAlignmentStatus = "aligned",
): ReputationGovernanceAlignmentStatus => {
  if (conflictingEvidence.length >= supportingEvidence.length + 2) return "misaligned";
  if (conflictingEvidence.length > 0) return supportingEvidence.length >= conflictingEvidence.length + 2 ? "aligned" : "partially_aligned";
  if (supportingEvidence.length >= 5 && preferredStatus === "strongly_aligned") return "strongly_aligned";
  if (supportingEvidence.length >= 3) return preferredStatus;
  return supportingEvidence.length > 0 ? "partially_aligned" : "misaligned";
};

const createFinding = (params: {
  alignmentType: ReputationGovernanceAlignmentType;
  status: ReputationGovernanceAlignmentStatus;
  description: string;
  supportingEvidence: string[];
  conflictingEvidence: string[];
  affectedGovernanceDomains: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): ReputationGovernanceAlignmentFinding => {
  const supportingEvidence = unique(params.supportingEvidence);
  const conflictingEvidence = unique(params.conflictingEvidence);
  const affectedGovernanceDomains = unique(params.affectedGovernanceDomains);
  const factors = unique(params.factors);

  return {
    id: `governance-alignment-${slug(params.alignmentType)}`,
    alignmentType: params.alignmentType,
    status: params.status,
    description: params.description,
    supportingEvidence,
    conflictingEvidence,
    affectedGovernanceDomains,
    confidenceScore: calculateAlignmentFindingConfidence({
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

const principleEvidence = (input: ReputationGovernanceAlignmentInput, terms: string[]): string[] =>
  unique([
    ...(input.doctrineResult?.principles
      .filter((principle) => includesAny(`${principle.principleType} ${principle.title} ${principle.description}`, terms))
      .flatMap((principle) => [
        `${principle.title}: ${principle.confidenceScore}/100.`,
        ...principle.supportingEvidence,
        ...principle.recurringPatterns,
      ]) ?? []),
  ]);

const buildFindings = (input: ReputationGovernanceAlignmentInput): ReputationGovernanceAlignmentFinding[] => {
  const domains = domainsFromInput(input);
  const doctrineSupport = unique([
    ...(input.doctrineResult?.principles.map((principle) => `${principle.title}: ${principle.confidenceScore}/100.`) ?? []),
    ...(input.doctrineResult?.durablePatterns ?? []),
    ...(input.memoryResult?.governanceLessons ?? []),
  ]);
  const doctrineConflict = unique([
    ...(!input.doctrineResult ? ["Doctrine result was not supplied."] : []),
    ...(input.doctrineResult?.driftFindings.flatMap((finding) => [finding.description, ...finding.evidence]) ?? []),
    ...(input.doctrineResult?.doctrineLimitations ?? []),
  ]);

  const evidenceSupport = unique([
    ...principleEvidence(input, ["evidence", "trace", "remediation", "trust"]),
    ...(input.evidenceQualityResult?.stabilizationSupportedAreas.map((area) => `Evidence supports stabilization area: ${area}.`) ?? []),
    ...(input.lineageResult?.governanceDependencyChains ?? []),
  ]);
  const evidenceConflict = unique([
    ...(!input.evidenceQualityResult ? ["Evidence quality result was not supplied."] : []),
    ...(input.evidenceQualityResult?.missingEvidenceAreas.map((area) => `Missing evidence area: ${area}.`) ?? []),
    ...(input.evidenceQualityResult?.contradictionAreas.map((area) => `Evidence contradiction area: ${area}.`) ?? []),
    ...(input.doctrineResult?.driftFindings
      .filter((finding) => finding.driftType === "evidence_support_gap")
      .flatMap((finding) => finding.evidence) ?? []),
  ]);

  const weakPlanItems =
    input.remediationResult?.planItems.filter(
      (item) => ["elevated", "critical"].includes(item.priority) && item.supportingEvidence.length < 2,
    ) ?? [];
  const remediationSupport = unique([
    ...principleEvidence(input, ["remediation", "evidence"]),
    ...(input.remediationResult?.planItems.flatMap((item) => [
      `${item.title}: ${item.priority}.`,
      ...item.supportingEvidence,
    ]) ?? []),
  ]);
  const remediationConflict = unique([
    ...(!input.remediationResult ? ["Remediation result was not supplied."] : []),
    ...weakPlanItems.flatMap((item) => [
      `${item.title} has ${item.supportingEvidence.length} supporting evidence items for ${item.priority} priority.`,
    ]),
    ...(input.evidenceQualityResult?.findings
      .filter((finding) => finding.findingType === "remediation_without_supporting_evidence")
      .map((finding) => finding.description) ?? []),
  ]);

  const unstableResolutionFindings =
    input.resolutionResult?.findings.filter((finding) =>
      ["unresolved", "recurring", "not_started"].includes(finding.status),
    ) ?? [];
  const resolutionSupport = unique([
    ...principleEvidence(input, ["stabilization", "resolution"]),
    ...(input.resolutionResult?.findings
      .filter((finding) => ["stabilized", "improving"].includes(finding.status))
      .flatMap((finding) => [finding.description, ...finding.evidence]) ?? []),
    ...(input.resolutionResult?.stabilizedAreas.map((area) => `Resolution stabilized area: ${area}.`) ?? []),
  ]);
  const resolutionConflict = unique([
    ...(!input.resolutionResult ? ["Resolution result was not supplied."] : []),
    ...unstableResolutionFindings.flatMap((finding) => [finding.description, `Resolution status: ${finding.status}.`]),
  ]);

  const continuitySupport = unique([
    ...principleEvidence(input, ["continuity", "preservation", "durable"]),
    ...(input.continuityResult?.continuityStrengths ?? []),
    ...(input.continuityResult?.resilienceIndicators ?? []),
    ...(input.memoryResult?.continuityLearningIndicators ?? []),
  ]);
  const continuityConflict = unique([
    ...(!input.continuityResult ? ["Continuity result was not supplied."] : []),
    ...(input.continuityResult?.continuityWeaknesses ?? []),
    ...(input.continuityResult?.driftFindings.map((finding) => finding.description) ?? []),
    ...(input.doctrineResult?.driftFindings
      .filter((finding) => finding.driftType === "continuity_context_gap")
      .map((finding) => finding.description) ?? []),
  ]);

  const resilienceSupport = unique([
    ...principleEvidence(input, ["resilience", "anti-fragility", "anti_fragility", "recovery"]),
    ...(input.resilienceResult?.resilienceStrengths ?? []),
    ...(input.resilienceResult?.recoveryIndicators ?? []),
    ...(input.resilienceResult?.antiFragilityIndicators ?? []),
    ...(input.memoryResult?.resilienceLearningIndicators ?? []),
  ]);
  const resilienceConflict = unique([
    ...(!input.resilienceResult ? ["Resilience result was not supplied."] : []),
    ...(input.resilienceResult?.resilienceWeaknesses ?? []),
    ...(input.resilienceResult?.fragilityIndicators ?? []),
    ...(input.resilienceResult?.findings
      .filter((finding) => finding.findingType !== "anti_fragility_indicator")
      .map((finding) => finding.description) ?? []),
  ]);

  const reviewabilitySupport = unique([
    ...principleEvidence(input, ["review", "lineage", "trace", "dependency"]),
    input.continuityResult?.reviewabilityAssessment,
    ...(input.lineageResult?.governanceDependencyChains ?? []),
    ...(input.lineageResult?.explainability.lineageRulesApplied ?? []),
  ].filter((item): item is string => typeof item === "string"));
  const reviewabilityConflict = unique([
    ...(!input.lineageResult ? ["Lineage result was not supplied."] : []),
    ...(input.lineageResult?.weakLineageAreas.map((area) => `Weak lineage area: ${area}.`) ?? []),
    ...(input.doctrineResult?.driftFindings
      .filter((finding) => finding.driftType === "lineage_context_gap")
      .map((finding) => finding.description) ?? []),
  ]);

  return [
    createFinding({
      alignmentType: "doctrine_alignment",
      status: statusFromEvidence(
        doctrineSupport,
        doctrineConflict,
        input.doctrineResult?.doctrineStatus === "durable" ? "strongly_aligned" : "aligned",
      ),
      description: "Doctrine principles are compared with memory lessons and doctrine drift context.",
      supportingEvidence: doctrineSupport,
      conflictingEvidence: doctrineConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review doctrine drift and principle support before treating doctrine as aligned with institutional practice.",
      factors: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        `Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`,
      ],
      reasoning: ["Doctrine alignment is derived from principle confidence, durable patterns, governance lessons, and doctrine drift findings."],
    }),
    createFinding({
      alignmentType: "evidence_alignment",
      status: statusFromEvidence(evidenceSupport, evidenceConflict),
      description: "Evidence quality and traceable support are compared with doctrine evidence expectations.",
      supportingEvidence: evidenceSupport,
      conflictingEvidence: evidenceConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review evidence support, missing evidence, and contradiction areas before relying on alignment.",
      factors: [
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        `Missing evidence areas: ${input.evidenceQualityResult?.missingEvidenceAreas.length ?? "not_supplied"}.`,
      ],
      reasoning: ["Evidence alignment requires doctrine evidence support, evidence quality reliability, and traceable lineage context."],
    }),
    createFinding({
      alignmentType: "remediation_alignment",
      status: statusFromEvidence(remediationSupport, remediationConflict),
      description: "Remediation planning is compared with doctrine principles and supporting evidence.",
      supportingEvidence: remediationSupport,
      conflictingEvidence: remediationConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review remediation support and weak plan evidence before interpreting practice as doctrine-aligned.",
      factors: [
        `Remediation plan items: ${input.remediationResult?.planItems.length ?? "not_supplied"}.`,
        `Weak elevated plan items: ${weakPlanItems.length}.`,
      ],
      reasoning: ["Remediation alignment is stronger when plan items are evidence-supported and consistent with doctrine principles."],
    }),
    createFinding({
      alignmentType: "resolution_alignment",
      status: statusFromEvidence(resolutionSupport, resolutionConflict),
      description: "Resolution states are compared with stabilization-first and evidence-supported doctrine.",
      supportingEvidence: resolutionSupport,
      conflictingEvidence: resolutionConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review unstable resolution patterns before interpreting resolution practice as aligned.",
      factors: [
        `Resolution status: ${input.resolutionResult?.overallResolutionStatus ?? "not_supplied"}.`,
        `Unstable resolution findings: ${unstableResolutionFindings.length}.`,
      ],
      reasoning: ["Resolution alignment is stronger when resolution states are improving or stabilized and supported by evidence."],
    }),
    createFinding({
      alignmentType: "continuity_alignment",
      status: statusFromEvidence(
        continuitySupport,
        continuityConflict,
        input.continuityResult?.continuityStatus === "anti_fragile" ? "strongly_aligned" : "aligned",
      ),
      description: "Continuity context is compared with continuity preservation doctrine and memory indicators.",
      supportingEvidence: continuitySupport,
      conflictingEvidence: continuityConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review continuity weaknesses and drift before interpreting alignment as durable.",
      factors: [
        `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
        `Continuity drift findings: ${input.continuityResult?.driftFindings.length ?? "not_supplied"}.`,
      ],
      reasoning: ["Continuity alignment compares preservation doctrine against continuity strengths, weaknesses, and drift findings."],
    }),
    createFinding({
      alignmentType: "resilience_alignment",
      status: statusFromEvidence(
        resilienceSupport,
        resilienceConflict,
        input.resilienceResult?.resilienceStatus === "anti_fragile" ? "strongly_aligned" : "aligned",
      ),
      description: "Resilience patterns are compared with anti-fragility and dependency resilience doctrine.",
      supportingEvidence: resilienceSupport,
      conflictingEvidence: resilienceConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review resilience weaknesses and fragility indicators before relying on resilience alignment.",
      factors: [
        `Resilience status: ${input.resilienceResult?.resilienceStatus ?? "not_supplied"}.`,
        `Resilience weakness count: ${input.resilienceResult?.resilienceWeaknesses.length ?? "not_supplied"}.`,
      ],
      reasoning: ["Resilience alignment is stronger when recovery, resilience, and anti-fragility indicators support doctrine principles."],
    }),
    createFinding({
      alignmentType: "reviewability_alignment",
      status: statusFromEvidence(reviewabilitySupport, reviewabilityConflict),
      description: "Reviewability context is compared with lineage, dependency, and human-reviewed governance doctrine.",
      supportingEvidence: reviewabilitySupport,
      conflictingEvidence: reviewabilityConflict,
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review weak lineage areas and dependency chains before relying on reviewability alignment.",
      factors: [
        `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        `Weak lineage areas: ${input.lineageResult?.weakLineageAreas.length ?? "not_supplied"}.`,
      ],
      reasoning: ["Reviewability alignment requires traceable dependency chains, lineage integrity, and explicit human-review context."],
    }),
  ];
};

const buildAlignmentStrengths = (findings: ReputationGovernanceAlignmentFinding[]): string[] =>
  unique(
    findings
      .filter((finding) => ["aligned", "strongly_aligned"].includes(finding.status))
      .flatMap((finding) => [
        `${finding.alignmentType} is ${finding.status}.`,
        ...finding.supportingEvidence.slice(0, 3),
      ]),
  );

const buildAlignmentGaps = (findings: ReputationGovernanceAlignmentFinding[]): string[] =>
  unique(
    findings
      .filter((finding) => ["misaligned", "partially_aligned"].includes(finding.status))
      .flatMap((finding) => [
        `${finding.alignmentType} is ${finding.status}.`,
        ...finding.conflictingEvidence.slice(0, 4),
      ]),
  );

const buildAlignmentDriftFindings = (input: ReputationGovernanceAlignmentInput, findings: ReputationGovernanceAlignmentFinding[]): string[] =>
  unique([
    ...(input.doctrineResult?.driftFindings.map((finding) => `${finding.driftType}: ${finding.description}`) ?? []),
    ...(input.continuityResult?.driftFindings.map((finding) => `${finding.driftType}: ${finding.description}`) ?? []),
    ...findings
      .filter((finding) => finding.conflictingEvidence.length > 0)
      .map((finding) => `${finding.alignmentType}: ${finding.conflictingEvidence.length} conflicting evidence items.`),
  ]);

const buildDoctrinePracticeGaps = (findings: ReputationGovernanceAlignmentFinding[]): string[] =>
  unique(
    findings
      .filter((finding) =>
        ["remediation_alignment", "resolution_alignment", "evidence_alignment"].includes(finding.alignmentType),
      )
      .filter((finding) => ["misaligned", "partially_aligned"].includes(finding.status))
      .flatMap((finding) => [
        `${finding.alignmentType} requires human review before treating practice as doctrine-aligned.`,
        ...finding.conflictingEvidence.slice(0, 5),
      ]),
  );

const buildArchitectureImprovementReview = (
  input: ReputationGovernanceAlignmentInput,
  findings: ReputationGovernanceAlignmentFinding[],
): ReputationArchitectureImprovementItem[] => {
  const items: ReputationArchitectureImprovementItem[] = [
    {
      id: "architecture-alignment-input-completeness",
      classification:
        !input.continuityResult || !input.lineageResult || !input.evidenceQualityResult
          ? "immediate"
          : "optional_optimization",
      area: "explainability gaps",
      observation: "Alignment confidence is stronger when doctrine, memory, resilience, continuity, lineage, and evidence quality results are supplied together.",
      recommendedHumanReview: "Confirm continuity, lineage, and evidence quality results are included before relying on alignment status.",
    },
    {
      id: "architecture-shared-reputation-utilities",
      classification: "future_upgrade",
      area: "reusable infrastructure opportunities",
      observation: "Alignment repeats deterministic helper patterns used by doctrine, memory, resilience, continuity, and lineage modules.",
      recommendedHumanReview: "Consider a narrow shared reputation utility module after the strict governance build sequence stabilizes.",
    },
    {
      id: "architecture-evidence-traceability-contract",
      classification: "future_upgrade",
      area: "dependency fragility",
      observation: "Alignment depends on traceable evidence, but a concrete evidence traceability contract remains a future upgrade.",
      recommendedHumanReview: "Review a formal evidence traceability type contract before connecting alignment to deeper memory, storage, or orchestration-adjacent layers.",
    },
    {
      id: "architecture-principle-evidence-normalization",
      classification: "future_upgrade",
      area: "enterprise durability improvements",
      observation: "Doctrine-to-practice alignment would become more durable with future principle-to-evidence normalization.",
      recommendedHumanReview: "Document principle-to-evidence normalization needs without building a normalization engine in this step.",
    },
    {
      id: "architecture-read-only-alignment-boundary",
      classification: "optional_optimization",
      area: "orchestration contamination risks",
      observation: "Alignment intelligence remains a pure read-only engine isolated from routes, UI, storage, automation, messaging, and orchestration.",
      recommendedHumanReview: "Keep future alignment adoption, storage, or automation workflows separated behind explicit human-reviewed approval.",
    },
  ];

  if (findings.some((finding) => finding.status === "misaligned")) {
    items.push({
      id: "architecture-alignment-gap-review",
      classification: "future_upgrade",
      area: "governance safety gaps",
      observation: "Misalignment findings suggest future value in richer non-executing alignment traceability between principles and practice evidence.",
      recommendedHumanReview: "Review misalignment areas manually before considering any downstream integration.",
    });
  }

  return items;
};

export function analyzeEnterpriseReputationGovernanceAlignment(
  input: ReputationGovernanceAlignmentInput,
): ReputationGovernanceAlignmentResult {
  const findings = buildFindings(input);
  const alignmentStrengths = buildAlignmentStrengths(findings);
  const alignmentGaps = buildAlignmentGaps(findings);
  const alignmentDriftFindings = buildAlignmentDriftFindings(input, findings);
  const doctrinePracticeGaps = buildDoctrinePracticeGaps(findings);
  const architectureImprovementReview = buildArchitectureImprovementReview(input, findings);
  const governanceAlignmentScore = calculateGovernanceAlignmentScore({
    input,
    findings,
    alignmentStrengths,
    alignmentGaps,
    alignmentDriftFindings,
    doctrinePracticeGaps,
  });
  const resultWithoutExplainability = {
    overallAlignmentStatus: alignmentStatusFromScore(governanceAlignmentScore),
    governanceAlignmentScore,
    findings,
    alignmentStrengths,
    alignmentGaps,
    alignmentDriftFindings,
    doctrinePracticeGaps,
    architectureImprovementReview,
  };

  return {
    ...resultWithoutExplainability,
    recommendations: buildGovernanceAlignmentRecommendations(resultWithoutExplainability),
    explainability: buildGovernanceAlignmentExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getEnterpriseReputationGovernanceAlignmentIntelligence =
  analyzeEnterpriseReputationGovernanceAlignment;
