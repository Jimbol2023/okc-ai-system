import {
  buildGovernanceReadinessExplainability,
  buildGovernanceReadinessRecommendations,
} from "./governance-readiness-explainability";
import {
  calculateOverallReadinessScore,
  calculateReadinessConfidenceScores,
  calculateReadinessFindingConfidence,
  readinessClassificationFromScore,
} from "./governance-readiness-scoring";
import type {
  GovernanceReadinessArea,
  GovernanceReadinessClassification,
  GovernanceReadinessConfidenceScores,
  GovernanceReadinessFinding,
  GovernanceReadinessInput,
  GovernanceReadinessResult,
} from "./governance-readiness-types";
import type { ReputationArchitectureImprovementItem } from "./reputation/reputation-governance-resilience-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const readinessFromScore = (score: number): GovernanceReadinessClassification => readinessClassificationFromScore(score);

const domainsFromInput = (input: GovernanceReadinessInput): string[] =>
  unique([
    ...(input.governanceResult?.affectedGovernanceDomains ?? []),
    ...(input.remediationResult?.affectedGovernanceDomains ?? []),
    ...(input.lineageResult?.nodes.flatMap((node) => node.relatedGovernanceDomains) ?? []),
    ...(input.doctrineResult?.principles.flatMap((principle) => principle.affectedGovernanceDomains) ?? []),
    ...(input.alignmentResult?.findings.flatMap((finding) => finding.affectedGovernanceDomains) ?? []),
    ...(input.assuranceResult?.findings.flatMap((finding) => finding.affectedGovernanceDomains) ?? []),
  ]);

const createFinding = (params: {
  readinessArea: GovernanceReadinessArea;
  classification: GovernanceReadinessClassification;
  description: string;
  supportingEvidence: string[];
  limitingEvidence: string[];
  affectedGovernanceDomains: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceReadinessFinding => {
  const supportingEvidence = unique(params.supportingEvidence);
  const limitingEvidence = unique(params.limitingEvidence);
  const affectedGovernanceDomains = unique(params.affectedGovernanceDomains);
  const factors = unique(params.factors);

  return {
    id: `governance-readiness-${slug(params.readinessArea)}`,
    readinessArea: params.readinessArea,
    classification: params.classification,
    description: params.description,
    supportingEvidence,
    limitingEvidence,
    affectedGovernanceDomains,
    confidenceScore: calculateReadinessFindingConfidence({
      supportingEvidenceCount: supportingEvidence.length,
      limitingEvidenceCount: limitingEvidence.length,
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

const buildFindings = (
  input: GovernanceReadinessInput,
  confidenceScores: GovernanceReadinessConfidenceScores,
): GovernanceReadinessFinding[] => {
  const domains = domainsFromInput(input);

  return [
    createFinding({
      readinessArea: "assurance_readiness",
      classification: readinessFromScore(confidenceScores.assuranceReadinessScore),
      description: "Assurance readiness is evaluated from governance assurance status, score, strengths, weaknesses, and reliability indicators.",
      supportingEvidence: [
        ...(input.assuranceResult?.assuranceStrengths ?? []),
        ...(input.assuranceResult?.governanceReliabilityIndicators ?? []),
      ],
      limitingEvidence: [
        ...(!input.assuranceResult ? ["Assurance result was not supplied."] : []),
        ...(input.assuranceResult?.assuranceWeaknesses ?? []),
        ...(input.assuranceResult?.assuranceDriftFindings ?? []),
      ],
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review assurance weaknesses and drift before interpreting governance readiness.",
      factors: [
        `Assurance score: ${input.assuranceResult?.governanceAssuranceScore ?? "not_supplied"}.`,
        `Assurance status: ${input.assuranceResult?.overallAssuranceStatus ?? "not_supplied"}.`,
      ],
      reasoning: ["Assurance readiness depends on upstream assurance confidence and reliability indicators."],
    }),
    createFinding({
      readinessArea: "alignment_readiness",
      classification: readinessFromScore(confidenceScores.alignmentReadinessScore),
      description: "Alignment readiness is evaluated from doctrine-practice alignment status, score, gaps, and drift findings.",
      supportingEvidence: input.alignmentResult?.alignmentStrengths ?? [],
      limitingEvidence: [
        ...(!input.alignmentResult ? ["Alignment result was not supplied."] : []),
        ...(input.alignmentResult?.alignmentGaps ?? []),
        ...(input.alignmentResult?.alignmentDriftFindings ?? []),
        ...(input.alignmentResult?.doctrinePracticeGaps ?? []),
      ],
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review alignment gaps and doctrine-practice gaps before relying on readiness.",
      factors: [
        `Alignment score: ${input.alignmentResult?.governanceAlignmentScore ?? "not_supplied"}.`,
        `Alignment status: ${input.alignmentResult?.overallAlignmentStatus ?? "not_supplied"}.`,
      ],
      reasoning: ["Alignment readiness depends on whether doctrine, evidence, continuity, resilience, and reviewability remain mutually supportive."],
    }),
    createFinding({
      readinessArea: "doctrine_readiness",
      classification: readinessFromScore(confidenceScores.doctrineReadinessScore),
      description: "Doctrine readiness is evaluated from doctrine confidence, principle support, drift findings, and doctrine limitations.",
      supportingEvidence: [
        ...(input.doctrineResult?.principles.map((principle) => `${principle.title}: ${principle.confidenceScore}/100.`) ?? []),
        ...(input.doctrineResult?.durablePatterns ?? []),
      ],
      limitingEvidence: [
        ...(!input.doctrineResult ? ["Doctrine result was not supplied."] : []),
        ...(input.doctrineResult?.doctrineLimitations ?? []),
        ...(input.doctrineResult?.driftFindings.map((finding) => finding.description) ?? []),
      ],
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review doctrine drift and unsupported principles before interpreting readiness as durable.",
      factors: [
        `Doctrine score: ${input.doctrineResult?.doctrineConfidenceScore ?? "not_supplied"}.`,
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
      ],
      reasoning: ["Doctrine readiness requires supported neutral principles and limited doctrine inconsistency."],
    }),
    createFinding({
      readinessArea: "memory_readiness",
      classification: readinessFromScore(confidenceScores.memoryReadinessScore),
      description: "Memory readiness is evaluated from institutional memory confidence, historical snapshots, lessons, and long-horizon context.",
      supportingEvidence: [
        ...(input.memoryResult?.governanceLessons ?? []),
        ...(input.memoryResult?.longHorizonContext ?? []),
      ],
      limitingEvidence: [
        ...(!input.memoryResult ? ["Memory result was not supplied."] : []),
        ...(input.memoryResult?.institutionalMemoryStatus === "thin" ? ["Institutional memory status is thin."] : []),
        ...(input.memoryResult?.recurringPatterns
          .filter((pattern) => pattern.patternType.includes("weakness") || pattern.patternType.includes("gap"))
          .map((pattern) => pattern.description) ?? []),
      ],
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review memory depth and recurring limitations before relying on institutional readiness.",
      factors: [
        `Memory score: ${input.memoryResult?.memoryConfidenceScore ?? "not_supplied"}.`,
        `Snapshots reviewed: ${input.memoryResult?.snapshotsReviewed.length ?? "not_supplied"}.`,
      ],
      reasoning: ["Memory readiness strengthens when historical context and lessons are traceable and durable."],
    }),
    createFinding({
      readinessArea: "continuity_readiness",
      classification: readinessFromScore(confidenceScores.continuityReadinessScore),
      description: "Continuity readiness is evaluated from continuity status, continuity score, strengths, weaknesses, and drift.",
      supportingEvidence: [
        ...(input.continuityResult?.continuityStrengths ?? []),
        ...(input.continuityResult?.resilienceIndicators ?? []),
      ],
      limitingEvidence: [
        ...(!input.continuityResult ? ["Continuity result was not supplied."] : []),
        ...(input.continuityResult?.continuityWeaknesses ?? []),
        ...(input.continuityResult?.driftFindings.map((finding) => finding.description) ?? []),
      ],
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review continuity weaknesses and instability before relying on readiness.",
      factors: [
        `Continuity score: ${input.continuityResult?.governanceContinuityScore ?? "not_supplied"}.`,
        `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
      ],
      reasoning: ["Continuity readiness requires stable review context and limited continuity drift."],
    }),
    createFinding({
      readinessArea: "resilience_readiness",
      classification: readinessFromScore(confidenceScores.resilienceReadinessScore),
      description: "Resilience readiness is evaluated from resilience status, recovery indicators, fragility indicators, and anti-fragility context.",
      supportingEvidence: [
        ...(input.resilienceResult?.resilienceStrengths ?? []),
        ...(input.resilienceResult?.recoveryIndicators ?? []),
        ...(input.resilienceResult?.antiFragilityIndicators ?? []),
      ],
      limitingEvidence: [
        ...(!input.resilienceResult ? ["Resilience result was not supplied."] : []),
        ...(input.resilienceResult?.resilienceWeaknesses ?? []),
        ...(input.resilienceResult?.fragilityIndicators ?? []),
      ],
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review resilience instability and recovery indicators before relying on readiness.",
      factors: [
        `Resilience score: ${input.resilienceResult?.governanceResilienceScore ?? "not_supplied"}.`,
        `Resilience status: ${input.resilienceResult?.resilienceStatus ?? "not_supplied"}.`,
      ],
      reasoning: ["Resilience readiness requires recovery capacity, continuity under pressure, and limited fragility."],
    }),
    createFinding({
      readinessArea: "evidence_readiness",
      classification: readinessFromScore(confidenceScores.evidenceReadinessScore),
      description: "Evidence readiness is evaluated from evidence quality score, reliability level, missing evidence, and contradiction context.",
      supportingEvidence: [
        ...(input.evidenceQualityResult?.stabilizationSupportedAreas.map((area) => `Evidence supports stabilization area: ${area}.`) ?? []),
        ...(input.evidenceQualityResult?.findings.flatMap((finding) => finding.supportingEvidence).slice(0, 12) ?? []),
      ],
      limitingEvidence: [
        ...(!input.evidenceQualityResult ? ["Evidence quality result was not supplied."] : []),
        ...(input.evidenceQualityResult?.missingEvidenceAreas.map((area) => `Missing evidence area: ${area}.`) ?? []),
        ...(input.evidenceQualityResult?.contradictionAreas.map((area) => `Evidence contradiction area: ${area}.`) ?? []),
      ],
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review evidence gaps and contradiction context before relying on readiness.",
      factors: [
        `Evidence score: ${input.evidenceQualityResult?.evidenceQualityScore ?? "not_supplied"}.`,
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
      ],
      reasoning: ["Evidence readiness requires reliable evidence quality and low missing or contradictory evidence pressure."],
    }),
    createFinding({
      readinessArea: "lineage_readiness",
      classification: readinessFromScore(confidenceScores.lineageReadinessScore),
      description: "Lineage readiness is evaluated from lineage integrity, dependency chains, stabilization chains, and weak lineage areas.",
      supportingEvidence: [
        ...(input.lineageResult?.governanceDependencyChains ?? []),
        ...(input.lineageResult?.stabilizationChains ?? []),
      ],
      limitingEvidence: [
        ...(!input.lineageResult ? ["Lineage result was not supplied."] : []),
        ...(input.lineageResult?.weakLineageAreas.map((area) => `Weak lineage area: ${area}.`) ?? []),
        ...(input.lineageResult?.contradictionChains.map((chain) => `Contradiction chain: ${chain}.`) ?? []),
      ],
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review weak lineage areas and contradiction chains before relying on readiness.",
      factors: [
        `Lineage score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
        `Dependency chains: ${input.lineageResult?.governanceDependencyChains.length ?? "not_supplied"}.`,
      ],
      reasoning: ["Lineage readiness requires traceable dependency chains and limited contradiction pressure."],
    }),
    createFinding({
      readinessArea: "reviewability_readiness",
      classification: readinessFromScore(confidenceScores.reviewabilityReadinessScore),
      description: "Reviewability readiness is evaluated from continuity reviewability, assurance reviewability, alignment reviewability, and lineage dependency visibility.",
      supportingEvidence: [
        input.continuityResult?.reviewabilityAssessment,
        ...(input.assuranceResult?.findings
          .filter((finding) => finding.assuranceType === "reviewability_assurance")
          .flatMap((finding) => finding.supportingEvidence) ?? []),
        ...(input.alignmentResult?.findings
          .filter((finding) => finding.alignmentType === "reviewability_alignment")
          .flatMap((finding) => finding.supportingEvidence) ?? []),
      ].filter((item): item is string => typeof item === "string"),
      limitingEvidence: [
        ...(!input.continuityResult ? ["Continuity result was not supplied for reviewability readiness."] : []),
        ...(!input.lineageResult ? ["Lineage result was not supplied for reviewability readiness."] : []),
        ...(input.lineageResult?.weakLineageAreas.map((area) => `Weak lineage area: ${area}.`) ?? []),
      ],
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review reviewability context before relying on governance readiness.",
      factors: [`Reviewability readiness score: ${confidenceScores.reviewabilityReadinessScore}.`],
      reasoning: ["Reviewability readiness requires visible reasoning, lineage, limitations, and human-review context."],
    }),
    createFinding({
      readinessArea: "explainability_readiness",
      classification: readinessFromScore(confidenceScores.explainabilityReadinessScore),
      description: "Explainability readiness is evaluated from upstream rules, major drivers, limitations, and evidence-bearing outputs.",
      supportingEvidence: [
        ...(input.assuranceResult?.explainability.assuranceRulesApplied ?? []),
        ...(input.alignmentResult?.explainability.alignmentRulesApplied ?? []),
        ...(input.doctrineResult?.explainability.doctrineRulesApplied ?? []),
      ],
      limitingEvidence: [
        ...(!input.assuranceResult ? ["Assurance explainability was not supplied."] : []),
        ...(!input.alignmentResult ? ["Alignment explainability was not supplied."] : []),
        ...(!input.doctrineResult ? ["Doctrine explainability was not supplied."] : []),
      ],
      affectedGovernanceDomains: domains,
      recommendedHumanReview: "Review missing upstream explainability before relying on readiness.",
      factors: [`Explainability readiness score: ${confidenceScores.explainabilityReadinessScore}.`],
      reasoning: ["Explainability readiness requires deterministic rules, major drivers, evidence, and limitations across upstream layers."],
    }),
  ];
};

const buildStrengths = (findings: GovernanceReadinessFinding[]): string[] =>
  unique(
    findings
      .filter((finding) => ["operationally_ready", "institutionally_ready"].includes(finding.classification))
      .flatMap((finding) => [`${finding.readinessArea} is ${finding.classification}.`, ...finding.supportingEvidence.slice(0, 3)]),
  );

const buildWeaknesses = (findings: GovernanceReadinessFinding[]): string[] =>
  unique(
    findings
      .filter((finding) => ["not_ready", "developing"].includes(finding.classification))
      .flatMap((finding) => [`${finding.readinessArea} is ${finding.classification}.`, ...finding.limitingEvidence.slice(0, 4)]),
  );

const buildSupportingEvidence = (findings: GovernanceReadinessFinding[]): string[] =>
  unique(findings.flatMap((finding) => finding.supportingEvidence).slice(0, 40));

const buildLimitations = (input: GovernanceReadinessInput, findings: GovernanceReadinessFinding[]): string[] =>
  unique([
    ...(!input.assuranceResult ? ["Assurance result was not supplied."] : []),
    ...(!input.alignmentResult ? ["Alignment result was not supplied."] : []),
    ...(!input.doctrineResult ? ["Doctrine result was not supplied."] : []),
    ...(!input.continuityResult ? ["Continuity result was not supplied."] : []),
    ...(!input.lineageResult ? ["Lineage result was not supplied."] : []),
    ...(!input.evidenceQualityResult ? ["Evidence quality result was not supplied."] : []),
    ...findings.flatMap((finding) => finding.limitingEvidence).slice(0, 30),
    "Governance readiness is a read-only human-review confidence indicator and does not execute actions.",
  ]);

const buildReadinessDrivers = (input: GovernanceReadinessInput, findings: GovernanceReadinessFinding[]): string[] =>
  unique([
    ...findings.map((finding) => `${finding.readinessArea}: ${finding.classification} (${finding.confidenceScore}/100).`),
    ...(input.assuranceResult?.explainability.majorDrivers.slice(0, 5) ?? []),
    ...(input.alignmentResult?.explainability.majorDrivers.slice(0, 5) ?? []),
    ...(input.doctrineResult?.explainability.majorDrivers.slice(0, 5) ?? []),
  ]);

const buildPreparednessIndicators = (input: GovernanceReadinessInput, findings: GovernanceReadinessFinding[]): string[] =>
  unique([
    ...(input.assuranceResult?.overallAssuranceStatus === "institutionally_durable" ? ["Assurance status is institutionally durable."] : []),
    ...(input.alignmentResult?.overallAlignmentStatus === "strongly_aligned" ? ["Alignment status is strongly aligned."] : []),
    ...(input.doctrineResult?.doctrineStatus === "durable" ? ["Doctrine status is durable."] : []),
    ...(input.memoryResult?.institutionalMemoryStatus === "durable" ? ["Memory status is durable."] : []),
    ...(input.resilienceResult?.resilienceStatus === "anti_fragile" ? ["Resilience status is anti-fragile."] : []),
    ...(input.continuityResult?.continuityStatus === "anti_fragile" ? ["Continuity status is anti-fragile."] : []),
    ...(input.lineageResult && input.lineageResult.lineageIntegrityScore >= 85 ? ["Lineage integrity is in an institutionally ready range."] : []),
    ...findings
      .filter((finding) => finding.classification === "institutionally_ready")
      .map((finding) => `${finding.readinessArea} is institutionally ready.`),
  ]);

const buildDriftSignals = (input: GovernanceReadinessInput, findings: GovernanceReadinessFinding[]): string[] =>
  unique([
    ...(input.assuranceResult?.assuranceDriftFindings ?? []),
    ...(input.alignmentResult?.alignmentDriftFindings ?? []),
    ...(input.doctrineResult?.driftFindings.map((finding) => `${finding.driftType}: ${finding.description}`) ?? []),
    ...(input.continuityResult?.driftFindings.map((finding) => `${finding.driftType}: ${finding.description}`) ?? []),
    ...(input.evidenceQualityResult?.contradictionAreas.map((area) => `Evidence quality contradiction area: ${area}.`) ?? []),
    ...findings
      .filter((finding) => finding.limitingEvidence.length > finding.supportingEvidence.length)
      .map((finding) => `${finding.readinessArea}: limiting evidence exceeds supporting evidence.`),
  ]);

const buildArchitectureImprovementReview = (
  input: GovernanceReadinessInput,
  findings: GovernanceReadinessFinding[],
): ReputationArchitectureImprovementItem[] => {
  const items: ReputationArchitectureImprovementItem[] = [
    {
      id: "architecture-readiness-input-completeness",
      classification:
        !input.assuranceResult || !input.alignmentResult || !input.continuityResult || !input.lineageResult || !input.evidenceQualityResult
          ? "immediate"
          : "optional_optimization",
      area: "explainability gaps",
      observation: "Readiness confidence is stronger when assurance, alignment, continuity, lineage, and evidence quality results are supplied together.",
      recommendedHumanReview: "Confirm assurance, alignment, continuity, lineage, and evidence quality results are included before relying on readiness classification.",
    },
    {
      id: "architecture-shared-governance-readiness-utilities",
      classification: "future_upgrade",
      area: "reusable infrastructure opportunities",
      observation: "Readiness repeats deterministic helper patterns used by assurance, alignment, doctrine, memory, resilience, continuity, and lineage modules.",
      recommendedHumanReview: "Consider a narrow shared governance utility module after the strict build sequence stabilizes.",
    },
    {
      id: "architecture-formal-evidence-traceability-contract",
      classification: "future_upgrade",
      area: "dependency fragility",
      observation: "Readiness depends on traceable evidence and would benefit from a formal evidence traceability contract in a future stage.",
      recommendedHumanReview: "Review a formal evidence traceability type contract before connecting readiness to audit, storage, or orchestration-adjacent layers.",
    },
    {
      id: "architecture-principle-evidence-normalization",
      classification: "future_upgrade",
      area: "enterprise durability improvements",
      observation: "Principle-to-evidence normalization remains a future durability upgrade for stronger readiness confidence.",
      recommendedHumanReview: "Document principle-to-evidence normalization needs without building a normalization engine in this step.",
    },
    {
      id: "architecture-read-only-readiness-boundary",
      classification: "optional_optimization",
      area: "orchestration contamination risks",
      observation: "Readiness intelligence remains a pure read-only engine isolated from routes, UI, storage, automation, messaging, and orchestration.",
      recommendedHumanReview: "Keep future readiness adoption, preview, storage, or automation workflows separated behind explicit human-reviewed approval.",
    },
  ];

  if (findings.some((finding) => finding.classification === "not_ready")) {
    items.push({
      id: "architecture-readiness-gap-review",
      classification: "future_upgrade",
      area: "governance safety gaps",
      observation: "Not-ready findings suggest future value in richer non-executing traceability across assurance, alignment, evidence, and lineage layers.",
      recommendedHumanReview: "Review not-ready areas manually before considering any downstream integration.",
    });
  }

  return items;
};

export function analyzeEnterpriseGovernanceReadiness(input: GovernanceReadinessInput): GovernanceReadinessResult {
  const confidenceScores = calculateReadinessConfidenceScores(input);
  const findings = buildFindings(input, confidenceScores);
  const strengths = buildStrengths(findings);
  const weaknesses = buildWeaknesses(findings);
  const supportingEvidence = buildSupportingEvidence(findings);
  const limitations = buildLimitations(input, findings);
  const readinessDrivers = buildReadinessDrivers(input, findings);
  const governancePreparednessIndicators = buildPreparednessIndicators(input, findings);
  const driftSignals = buildDriftSignals(input, findings);
  const architectureImprovementReview = buildArchitectureImprovementReview(input, findings);
  const overallReadinessScore = calculateOverallReadinessScore({
    confidenceScores,
    findings,
    strengths,
    weaknesses,
    driftSignals,
    governancePreparednessIndicators,
  });
  const resultWithoutExplainability = {
    overallReadinessScore,
    readinessClassification: readinessClassificationFromScore(overallReadinessScore),
    confidenceScores,
    findings,
    strengths,
    weaknesses,
    supportingEvidence,
    limitations,
    readinessDrivers,
    governancePreparednessIndicators,
    driftSignals,
    humanReviewRequired:
      overallReadinessScore < 85 ||
      weaknesses.length > 0 ||
      driftSignals.length > 0 ||
      findings.some((finding) => finding.classification === "not_ready"),
    architectureImprovementReview,
  };

  return {
    ...resultWithoutExplainability,
    recommendations: buildGovernanceReadinessRecommendations(resultWithoutExplainability),
    explainability: buildGovernanceReadinessExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getEnterpriseGovernanceReadinessIntelligence = analyzeEnterpriseGovernanceReadiness;
